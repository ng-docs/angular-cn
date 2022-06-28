/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, DoCheck, ElementRef, EventEmitter, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

import {IAttributes, IAugmentedJQuery, IDirective, IInjectorService, ILinkFn, IScope, ITranscludeFunction} from '../../src/common/src/angular1';
import {$SCOPE} from '../../src/common/src/constants';
import {IBindingDestination, IControllerInstance, UpgradeHelper} from '../../src/common/src/upgrade_helper';
import {isFunction} from '../../src/common/src/util';

const NOT_SUPPORTED: any = 'NOT_SUPPORTED';
const INITIAL_VALUE = {
  __UNINITIALIZED__: true
};

class Bindings {
  twoWayBoundProperties: string[] = [];
  twoWayBoundLastValues: any[] = [];

  expressionBoundProperties: string[] = [];

  propertyToOutputMap: {[propName: string]: string} = {};
}

/**
 * @description
 *
 * A helper class that allows an AngularJS component to be used from Angular.
 *
 * 允许从 Angular 使用 AngularJS 组件的帮助器类。
 *
 * *Part of the [upgrade/static](api?query=upgrade%2Fstatic)
 * library for hybrid upgrade apps that support AOT compilation.*
 *
 * *支持 AOT 编译的混合升级应用程序的[upgrade/静态](api?query=upgrade%2Fstatic)库的一部分。*
 *
 * This helper class should be used as a base class for creating Angular directives
 * that wrap AngularJS components that need to be "upgraded".
 *
 * 此帮助器类应该用作创建包装需要“升级”的 AngularJS 组件的 Angular 指令的基类。
 *
 * @usageNotes
 *
 * ### Examples
 *
 * ### 例子
 *
 * Let's assume that you have an AngularJS component called `ng1Hero` that needs
 * to be made available in Angular templates.
 *
 * 假设你有一个名为 `ng1Hero` 的 AngularJS 组件，需要在 Angular 模板中使用。
 *
 * {@example upgrade/static/ts/full/module.ts region="ng1-hero"}
 *
 * We must create a `Directive` that will make this AngularJS component
 * available inside Angular templates.
 *
 * {@example upgrade/static/ts/full/module.ts region="ng1-hero-wrapper"}
 *
 * In this example you can see that we must derive from the `UpgradeComponent`
 * base class but also provide an {@link Directive `@Directive`} decorator. This is
 * because the AOT compiler requires that this information is statically available at
 * compile time.
 *
 * Note that we must do the following:
 * * specify the directive's selector (`ng1-hero`)
 * * specify all inputs and outputs that the AngularJS component expects
 * * derive from `UpgradeComponent`
 * * call the base class from the constructor, passing
 *   * the AngularJS name of the component (`ng1Hero`)
 *   * the `ElementRef` and `Injector` for the component wrapper
 * @publicApi
 * @extensible
 */
@Directive()
export class UpgradeComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
  private helper: UpgradeHelper;

  private $injector: IInjectorService;

  private element: Element;
  private $element: IAugmentedJQuery;
  private $componentScope: IScope;

  private directive: IDirective;
  private bindings: Bindings;

  // TODO(issue/24571): remove '!'.
  private controllerInstance!: IControllerInstance;
  // TODO(issue/24571): remove '!'.
  private bindingDestination!: IBindingDestination;

  // We will be instantiating the controller in the `ngOnInit` hook, when the
  // first `ngOnChanges` will have been already triggered. We store the
  // `SimpleChanges` and "play them back" later.
  // TODO(issue/24571): remove '!'.
  private pendingChanges!: SimpleChanges|null;

  // TODO(issue/24571): remove '!'.
  private unregisterDoCheckWatcher!: Function;

  /**
   * Create a new `UpgradeComponent` instance. You should not normally need to do this.
   * Instead you should derive a new class from this one and call the super constructor
   * from the base class.
   *
   * 创建一个新的 `UpgradeComponent`
   * 实例。你通常不需要这样做。相反，你应该从中派生一个新类，并从基类调用超级构造函数。
   *
   * {@example upgrade/static/ts/full/module.ts region="ng1-hero-wrapper" }
   *
   * * The `name` parameter should be the name of the AngularJS directive.
   *
   *   `name` 参数应该是 AngularJS 指令的名称。
   *
   * * The `elementRef` and `injector` parameters should be acquired from Angular by dependency
   *   injection into the base class constructor.
   *
   *   `elementRef` 和 `injector` 参数应该通过依赖注入到基类构造函数的方式从 Angular 获取。
   *
   */
  constructor(private name: string, private elementRef: ElementRef, private injector: Injector) {
    this.helper = new UpgradeHelper(injector, name, elementRef);

    this.$injector = this.helper.$injector;

    this.element = this.helper.element;
    this.$element = this.helper.$element;

    this.directive = this.helper.directive;
    this.bindings = this.initializeBindings(this.directive);

    // We ask for the AngularJS scope from the Angular injector, since
    // we will put the new component scope onto the new injector for each component
    const $parentScope = injector.get($SCOPE);
    // QUESTION 1: Should we create an isolated scope if the scope is only true?
    // QUESTION 2: Should we make the scope accessible through `$element.scope()/isolateScope()`?
    this.$componentScope = $parentScope.$new(!!this.directive.scope);

    this.initializeOutputs();
  }

  ngOnInit() {
    // Collect contents, insert and compile template
    const attachChildNodes: ILinkFn|undefined = this.helper.prepareTransclusion();
    const linkFn = this.helper.compileTemplate();

    // Instantiate controller
    const controllerType = this.directive.controller;
    const bindToController = this.directive.bindToController;
    if (controllerType) {
      this.controllerInstance = this.helper.buildController(controllerType, this.$componentScope);
    } else if (bindToController) {
      throw new Error(`Upgraded directive '${
          this.directive.name}' specifies 'bindToController' but no controller.`);
    }

    // Set up outputs
    this.bindingDestination = bindToController ? this.controllerInstance : this.$componentScope;
    this.bindOutputs();

    // Require other controllers
    const requiredControllers =
        this.helper.resolveAndBindRequiredControllers(this.controllerInstance);

    // Hook: $onChanges
    if (this.pendingChanges) {
      this.forwardChanges(this.pendingChanges);
      this.pendingChanges = null;
    }

    // Hook: $onInit
    if (this.controllerInstance && isFunction(this.controllerInstance.$onInit)) {
      this.controllerInstance.$onInit();
    }

    // Hook: $doCheck
    if (this.controllerInstance && isFunction(this.controllerInstance.$doCheck)) {
      const callDoCheck = () => this.controllerInstance.$doCheck!();

      this.unregisterDoCheckWatcher = this.$componentScope.$parent.$watch(callDoCheck);
      callDoCheck();
    }

    // Linking
    const link = this.directive.link;
    const preLink = typeof link == 'object' && link.pre;
    const postLink = typeof link == 'object' ? link.post : link;
    const attrs: IAttributes = NOT_SUPPORTED;
    const transcludeFn: ITranscludeFunction = NOT_SUPPORTED;
    if (preLink) {
      preLink(this.$componentScope, this.$element, attrs, requiredControllers, transcludeFn);
    }

    linkFn(this.$componentScope, null!, {parentBoundTranscludeFn: attachChildNodes});

    if (postLink) {
      postLink(this.$componentScope, this.$element, attrs, requiredControllers, transcludeFn);
    }

    // Hook: $postLink
    if (this.controllerInstance && isFunction(this.controllerInstance.$postLink)) {
      this.controllerInstance.$postLink();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.bindingDestination) {
      this.pendingChanges = changes;
    } else {
      this.forwardChanges(changes);
    }
  }

  ngDoCheck() {
    const twoWayBoundProperties = this.bindings.twoWayBoundProperties;
    const twoWayBoundLastValues = this.bindings.twoWayBoundLastValues;
    const propertyToOutputMap = this.bindings.propertyToOutputMap;

    twoWayBoundProperties.forEach((propName, idx) => {
      const newValue = this.bindingDestination[propName];
      const oldValue = twoWayBoundLastValues[idx];

      if (!Object.is(newValue, oldValue)) {
        const outputName = propertyToOutputMap[propName];
        const eventEmitter: EventEmitter<any> = (this as any)[outputName];

        eventEmitter.emit(newValue);
        twoWayBoundLastValues[idx] = newValue;
      }
    });
  }

  ngOnDestroy() {
    if (isFunction(this.unregisterDoCheckWatcher)) {
      this.unregisterDoCheckWatcher();
    }
    this.helper.onDestroy(this.$componentScope, this.controllerInstance);
  }

  private initializeBindings(directive: IDirective) {
    const btcIsObject = typeof directive.bindToController === 'object';
    if (btcIsObject && Object.keys(directive.scope!).length) {
      throw new Error(
          `Binding definitions on scope and controller at the same time is not supported.`);
    }

    const context = btcIsObject ? directive.bindToController : directive.scope;
    const bindings = new Bindings();

    if (typeof context == 'object') {
      Object.keys(context).forEach(propName => {
        const definition = context[propName];
        const bindingType = definition.charAt(0);

        // QUESTION: What about `=*`? Ignore? Throw? Support?

        switch (bindingType) {
          case '@':
          case '<':
            // We don't need to do anything special. They will be defined as inputs on the
            // upgraded component facade and the change propagation will be handled by
            // `ngOnChanges()`.
            break;
          case '=':
            bindings.twoWayBoundProperties.push(propName);
            bindings.twoWayBoundLastValues.push(INITIAL_VALUE);
            bindings.propertyToOutputMap[propName] = propName + 'Change';
            break;
          case '&':
            bindings.expressionBoundProperties.push(propName);
            bindings.propertyToOutputMap[propName] = propName;
            break;
          default:
            let json = JSON.stringify(context);
            throw new Error(
                `Unexpected mapping '${bindingType}' in '${json}' in '${this.name}' directive.`);
        }
      });
    }

    return bindings;
  }

  private initializeOutputs() {
    // Initialize the outputs for `=` and `&` bindings
    this.bindings.twoWayBoundProperties.concat(this.bindings.expressionBoundProperties)
        .forEach(propName => {
          const outputName = this.bindings.propertyToOutputMap[propName];
          (this as any)[outputName] = new EventEmitter();
        });
  }

  private bindOutputs() {
    // Bind `&` bindings to the corresponding outputs
    this.bindings.expressionBoundProperties.forEach(propName => {
      const outputName = this.bindings.propertyToOutputMap[propName];
      const emitter = (this as any)[outputName];

      this.bindingDestination[propName] = (value: any) => emitter.emit(value);
    });
  }

  private forwardChanges(changes: SimpleChanges) {
    // Forward input changes to `bindingDestination`
    Object.keys(changes).forEach(
        propName => this.bindingDestination[propName] = changes[propName].currentValue);

    if (isFunction(this.bindingDestination.$onChanges)) {
      this.bindingDestination.$onChanges(changes);
    }
  }
}
