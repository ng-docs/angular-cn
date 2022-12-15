/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Compiler, CompilerOptions, Injector, NgModule, NgModuleRef, NgZone, resolveForwardRef, StaticProvider, Testability, Type} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {bootstrap, element as angularElement, IAngularBootstrapConfig, IAugmentedJQuery, IInjectorService, IModule, IProvideService, IRootScopeService, ITestabilityService, module_ as angularModule} from '../../common/src/angular1';
import {$$TESTABILITY, $COMPILE, $INJECTOR, $ROOT_SCOPE, COMPILER_KEY, INJECTOR_KEY, LAZY_MODULE_REF, NG_ZONE_KEY, UPGRADE_APP_TYPE_KEY} from '../../common/src/constants';
import {downgradeComponent} from '../../common/src/downgrade_component';
import {downgradeInjectable} from '../../common/src/downgrade_injectable';
import {controllerKey, Deferred, destroyApp, LazyModuleRef, onError, UpgradeAppType} from '../../common/src/util';

import {UpgradeNg1ComponentAdapterBuilder} from './upgrade_ng1_adapter';

let upgradeCount: number = 0;

/**
 * Use `UpgradeAdapter` to allow AngularJS and Angular to coexist in a single application.
 *
 * 使用 `UpgradeAdapter` 允许 AngularJS 和 Angular 在单个应用程序中共存。
 *
 * The `UpgradeAdapter` allows:
 *
 * `UpgradeAdapter` 允许：
 *
 * 1. creation of Angular component from AngularJS component directive
 *    (See [UpgradeAdapter#upgradeNg1Component()])
 *
 *    从 AngularJS 组件指令创建 Angular
 * 组件（请参阅[UpgradeAdapter#upgradeNg1Component()][UpgradeAdapter#upgradeNg1Component()]）
 *
 * 2. creation of AngularJS directive from Angular component.
 *    (See [UpgradeAdapter#downgradeNg2Component()])
 *
 *    从 Angular 组件创建 AngularJS
 * 指令。（请参阅[UpgradeAdapter#downgradeNg2Component()][UpgradeAdapter#downgradeNg2Component()]
 *
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application.
 *
 *    混合 Angular 应用程序的引导，该应用程序包含在单个应用程序中共存的两个框架。
 *
 * @usageNotes
 *
 * ### Mental Model
 *
 * ### 心理模型
 *
 * When reasoning about how a hybrid application works it is useful to have a mental model which
 * describes what is happening and explains what is happening at the lowest level.
 *
 * 在推理混合应用程序的工作方式时，有一个心智模型会很有用，它可以描述正在发生的事情并在最低级别解释正在发生的事情。
 *
 * 1. There are two independent frameworks running in a single application, each framework treats
 *    the other as a black box.
 *
 *    在单个应用程序中运行有两个独立的框架，每个框架都将另一个框架视为黑盒。
 *
 * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
 *    instantiated the element is the owner. Each framework only updates/interacts with its own
 *    DOM elements and ignores others.
 *
 *    页面上的每个 DOM
 * 元素都归一个框架所有。无论哪个框架实例化此元素，都是所有者。每个框架都只更新自己的 DOM
 * 元素/交互，而忽略其他框架。
 *
 * 3. AngularJS directives always execute inside AngularJS framework codebase regardless of
 *    where they are instantiated.
 *
 *    AngularJS 指令始终在 AngularJS 框架代码库中执行，无论它们是在哪里实例化的。
 *
 * 4. Angular components always execute inside Angular framework codebase regardless of
 *    where they are instantiated.
 *
 *    Angular 组件始终在 Angular 框架代码库中执行，无论它们在哪里实例化。
 *
 * 5. An AngularJS component can be upgraded to an Angular component. This creates an
 *    Angular directive, which bootstraps the AngularJS component directive in that location.
 *
 *    AngularJS 组件可以升级为 Angular 组件。这会创建一个 Angular 指令，它会引导该位置的 AngularJS
 * 组件指令。
 *
 * 6. An Angular component can be downgraded to an AngularJS component directive. This creates
 *    an AngularJS directive, which bootstraps the Angular component in that location.
 *
 *    Angular 组件可以降级为 AngularJS 组件指令。这会创建一个 AngularJS 指令，该指令会引导该位置的
 * Angular 组件。
 *
 * 7. Whenever an adapter component is instantiated the host element is owned by the framework
 *    doing the instantiation. The other framework then instantiates and owns the view for that
 *    component. This implies that component bindings will always follow the semantics of the
 *    instantiation framework. The syntax is always that of Angular syntax.
 *
 *    每当实例化适配器组件时，宿主元素都归进行实例化的框架所有。然后，另一个框架会实例化并拥有该组件的视图。这意味着组件绑定将始终遵循实例化框架的语义。语法始终是
 * Angular 语法。
 *
 * 8. AngularJS is always bootstrapped first and owns the bottom most view.
 *
 *    AngularJS 始终首先引导并拥有最底部的视图。
 *
 * 9. The new application is running in Angular zone, and therefore it no longer needs calls to
 *    `$apply()`.
 *
 *    新应用程序在 Angular 区域中运行，因此它不再需要调用 `$apply()` 。
 *
 * ### Example
 *
 * ### 例子
 *
 * ```
 * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module), myCompilerOptions);
 * const module = angular.module('myExample', []);
 * module.directive('ng2Comp', adapter.downgradeNg2Component(Ng2Component));
 *
 * module.directive('ng1Hello', function() {
 *   return {
 *      scope: { title: '=' },
 *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
 *   };
 * });
 *
 *
 * @Component({
 *   selector: 'ng2-comp',
 *   inputs: ['name'],
 *   template: 'ng2[<ng1-hello [title]="name">transclude</ng1-hello>](<ng-content></ng-content>)',
 *   directives:
 * })
 * class Ng2Component {
 * }
 *
 * @NgModule({
 *   declarations: [Ng2Component, adapter.upgradeNg1Component('ng1Hello')],
 *   imports: [BrowserModule]
 * })
 * class MyNg2Module {}
 *
 *
 * document.body.innerHTML = '<ng2-comp name="World">project</ng2-comp>';
 *
 * adapter.bootstrap(document.body, ['myExample']).ready(function() {
 *   expect(document.body.textContent).toEqual(
 *       "ng2[ng1[Hello World!](transclude)](project)");
 * });
 *
 * ```
 * @deprecated
 *
 * Deprecated since v5. Use `upgrade/static` instead, which also supports
 * [Ahead-of-Time compilation](guide/aot-compiler).
 *
 * 自 v5 以来已弃用。改用 `upgrade/static` ，它也支持[Ahead-of-Time 编译](guide/aot-compiler)。
 *
 * @publicApi
 */
export class UpgradeAdapter {
  private idPrefix: string = `NG2_UPGRADE_${upgradeCount++}_`;
  private downgradedComponents: Type<any>[] = [];
  /**
   * An internal map of ng1 components which need to up upgraded to ng2.
   *
   * 需要升级到 ng2 的 ng1 组件的内部映射。
   *
   * We can't upgrade until injector is instantiated and we can retrieve the component metadata.
   * For this reason we keep a list of components to upgrade until ng1 injector is bootstrapped.
   *
   * 在注入器实例化并且我们可以检索组件元数据之前，我们无法升级。出于这个原因，我们会保留要升级的组件列表，直到
   * ng1 注入器被引导。
   *
   * @internal
   */
  private ng1ComponentsToBeUpgraded: {[name: string]: UpgradeNg1ComponentAdapterBuilder} = {};
  private upgradedProviders: StaticProvider[] = [];
  // TODO(issue/24571): remove '!'.
  private ngZone!: NgZone;
  // TODO(issue/24571): remove '!'.
  private ng1Module!: IModule;
  private moduleRef: NgModuleRef<any>|null = null;
  // TODO(issue/24571): remove '!'.
  private ng2BootstrapDeferred!: Deferred<IInjectorService>;

  constructor(private ng2AppModule: Type<any>, private compilerOptions?: CompilerOptions) {
    if (!ng2AppModule) {
      throw new Error(
          'UpgradeAdapter cannot be instantiated without an NgModule of the Angular app.');
    }
  }

  /**
   * Allows Angular Component to be used from AngularJS.
   *
   * 允许从 AngularJS 使用 Angular 组件。
   *
   * Use `downgradeNg2Component` to create an AngularJS Directive Definition Factory from
   * Angular Component. The adapter will bootstrap Angular component from within the
   * AngularJS template.
   *
   * 使用 `downgradeNg2Component` 从 Angular 组件创建 AngularJS 指令定义工厂。适配器将从 AngularJS
   * 模板中引导 Angular 组件。
   *
   * @usageNotes
   *
   * ### Mental Model
   *
   * ### 心理模型
   *
   * 1. The component is instantiated by being listed in AngularJS template. This means that the
   *    host element is controlled by AngularJS, but the component's view will be controlled by
   *    Angular.
   *
   *    该组件是通过在 AngularJS 模板中列出来实例化的。这意味着宿主元素由 AngularJS
   * 控制，但组件的视图将由 Angular 控制。
   *
   * 2. Even thought the component is instantiated in AngularJS, it will be using Angular
   *    syntax. This has to be done, this way because we must follow Angular components do not
   *    declare how the attributes should be interpreted.
   *
   *    即使组件是在 AngularJS 中实例化的，它也将使用 Angular 语法。必须这样做，因为我们必须遵循
   * Angular 组件，而不是声明应该如何解释属性。
   *
   * 3. `ng-model` is controlled by AngularJS and communicates with the downgraded Angular component
   *    by way of the `ControlValueAccessor` interface from @angular/forms. Only components that
   *    implement this interface are eligible.
   *
   * ### Supported Features
   *
   * - Bindings:
   *   - Attribute: `<comp name="World">`
   *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
   *   - Expression:  `<comp [name]="username">`
   *   - Event:  `<comp (close)="doSomething()">`
   *   - ng-model: `<comp ng-model="name">`
   * - Content projection: yes
   *
   * ### Example
   *
   * ```
   * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
   * const module = angular.module('myExample', []);
   * module.directive('greet', adapter.downgradeNg2Component(Greeter));
   *
   * @Component({
   *   selector: 'greet',
   *   template: '{{salutation}} {{name}}! - <ng-content></ng-content>'
   * })
   * class Greeter {
   * @Input () salutation: string;
   * @Input () name: string;
   * }
   *
   * @NgModule({
   *   declarations: [Greeter],
   *   imports: [BrowserModule]
   * })
   * class MyNg2Module {}
   *
   * document.body.innerHTML =
   *   'ng1 template: <greet salutation="Hello" [name]="world">text</greet>';
   *
   * adapter.bootstrap(document.body, ['myExample']).ready(function() {
   *   expect(document.body.textContent).toEqual("ng1 template: Hello world! - text");
   * });
   * ```
   */
  downgradeNg2Component(component: Type<any>): Function {
    this.downgradedComponents.push(component);

    return downgradeComponent({component});
  }

  /**
   * Allows AngularJS Component to be used from Angular.
   *
   * 允许从 Angular 使用 AngularJS 组件。
   *
   * Use `upgradeNg1Component` to create an Angular component from AngularJS Component
   * directive. The adapter will bootstrap AngularJS component from within the Angular
   * template.
   *
   * 使用 `upgradeNg1Component` 从 AngularJS Component 指令创建一个 Angular 组件。适配器将从 Angular
   * 模板中引导 AngularJS 组件。
   *
   * @usageNotes
   *
   * ### Mental Model
   *
   * ### 心理模型
   *
   * 1. The component is instantiated by being listed in Angular template. This means that the
   *    host element is controlled by Angular, but the component's view will be controlled by
   *    AngularJS.
   *
   *    该组件是通过在 Angular 模板中列出来实例化的。这意味着宿主元素由 Angular
   * 控制，但组件的视图将由 AngularJS 控制。
   *
   * ### Supported Features
   *
   * ### 支持的特性
   *
   * - Bindings:
   *
   *   绑定：
   *
   *   - Attribute: `<comp name="World">`
   *
   *     属性： `<comp name="World">`
   *
   *   - Interpolation:  `<comp greeting="Hello {{name}}!">`
   *
   *     插值： `<comp greeting="Hello {{name}}!">`
   *
   *   - Expression:  `<comp [name]="username">`
   *
   *     表达式： `<comp [name]="username">`
   *
   *   - Event:  `<comp (close)="doSomething()">`
   *
   *     事件： `<comp (close)="doSomething()">`
   *
   * - Transclusion: yes
   *
   *   嵌入：是
   *
   * - Only some of the features of
   *   [Directive Definition Object](https://docs.angularjs.org/api/ng/service/$compile) are
   *   supported:
   *
   *   仅支持[指令定义对象](https://docs.angularjs.org/api/ng/service/$compile)的某些特性：
   *
   *   - `compile`: not supported because the host element is owned by Angular, which does
   *     not allow modifying DOM structure during compilation.
   *
   *     `compile` ：不支持，因为宿主元素归 Angular 所有，它不允许在编译期间修改 DOM 结构。
   *
   *   - `controller`: supported. (NOTE: injection of `$attrs` and `$transclude` is not supported.)
   *
   *     `controller` ：支持。（注意：不支持注入 `$attrs` 和 `$transclude` 。）
   *
   *   - `controllerAs`: supported.
   *
   *     `controllerAs` ：支持。
   *
   *   - `bindToController`: supported.
   *
   *     `bindToController` ：支持。
   *
   *   - `link`: supported. (NOTE: only pre-link function is supported.)
   *
   *     `link` ：支持。（注意：仅支持预链接功能。）
   *
   *   - `name`: supported.
   *
   *     `name` ：支持。
   *
   *   - `priority`: ignored.
   *
   *     `priority` ：忽略。
   *
   *   - `replace`: not supported.
   *
   *     `replace` ：不支持。
   *
   *   - `require`: supported.
   *
   *     `require` ：支持。
   *
   *   - `restrict`: must be set to 'E'.
   *
   *     `restrict` ：必须设置为 'E'。
   *
   *   - `scope`: supported.
   *
   *     `scope` ：支持。
   *
   *   - `template`: supported.
   *
   *     `template` ：支持。
   *
   *   - `templateUrl`: supported.
   *
   *     `templateUrl` ：支持。
   *
   *   - `terminal`: ignored.
   *
   *     `terminal` ：被忽略。
   *
   *   - `transclude`: supported.
   *
   *     `transclude` ：支持。
   *
   * ### Example
   *
   * ### 例子
   *
   * ```
   * const adapter = new UpgradeAdapter(forwardRef(() => MyNg2Module));
   * const module = angular.module('myExample', []);
   *
   * module.directive('greet', function() {
   *   return {
   *     scope: {salutation: '=', name: '=' },
   *     template: '{{salutation}} {{name}}! - <span ng-transclude></span>'
   *   };
   * });
   *
   * module.directive('ng2', adapter.downgradeNg2Component(Ng2Component));
   *
   * @Component({
   *   selector: 'ng2',
   *   template: 'ng2 template: <greet salutation="Hello" [name]="world">text</greet>'
   * })
   * class Ng2Component {
   * }
   * @NgModule({
   *   declarations: [Ng2Component, adapter.upgradeNg1Component('greet')],
   *   imports: [BrowserModule]
   * })
   * class MyNg2Module {}
   *
   * document.body.innerHTML = '<ng2></ng2>';
   *
   * adapter.bootstrap(document.body, ['myExample']).ready(function() {
   *   expect(document.body.textContent).toEqual("ng2 template: Hello world! - text");
   * });
   * ```
   */
  upgradeNg1Component(name: string): Type<any> {
    if ((<any>this.ng1ComponentsToBeUpgraded).hasOwnProperty(name)) {
      return this.ng1ComponentsToBeUpgraded[name].type;
    } else {
      return (this.ng1ComponentsToBeUpgraded[name] = new UpgradeNg1ComponentAdapterBuilder(name))
          .type;
    }
  }

  /**
   * Registers the adapter's AngularJS upgrade module for unit testing in AngularJS.
   * Use this instead of `angular.mock.module()` to load the upgrade module into
   * the AngularJS testing injector.
   *
   * 注册适配器的 AngularJS 升级模块以在 AngularJS 中进行单元测试。使用它而不是
   * `angular.mock.module()` 将升级模块加载到 AngularJS 测试注入器中。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * ```
   * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
   *
   * // configure the adapter with upgrade/downgrade components and services
   * upgradeAdapter.downgradeNg2Component(MyComponent);
   *
   * let upgradeAdapterRef: UpgradeAdapterRef;
   * let $compile, $rootScope;
   *
   * // We must register the adapter before any calls to `inject()`
   * beforeEach(() => {
   *   upgradeAdapterRef = upgradeAdapter.registerForNg1Tests(['heroApp']);
   * });
   *
   * beforeEach(inject((_$compile_, _$rootScope_) => {
   *   $compile = _$compile_;
   *   $rootScope = _$rootScope_;
   * }));
   *
   * it("says hello", (done) => {
   *   upgradeAdapterRef.ready(() => {
   *     const element = $compile("<my-component></my-component>")($rootScope);
   *     $rootScope.$apply();
   *     expect(element.html()).toContain("Hello World");
   *     done();
   *   })
   * });
   *
   * ```
   *
   * @param modules any AngularJS modules that the upgrade module should depend upon
   *
   * 升级模块应该依赖的任何 AngularJS 模块
   *
   * @returns
   *
   * an `UpgradeAdapterRef`, which lets you register a `ready()` callback to
   * run assertions once the Angular components are ready to test through AngularJS.
   *
   * 一个 `UpgradeAdapterRef` ，它允许你注册一个 `ready()` 回调以在 Angular 组件准备好通过 AngularJS
   * 进行测试后运行断言。
   *
   */
  registerForNg1Tests(modules?: string[]): UpgradeAdapterRef {
    const windowNgMock = (window as any)['angular'].mock;
    if (!windowNgMock || !windowNgMock.module) {
      throw new Error('Failed to find \'angular.mock.module\'.');
    }
    this.declareNg1Module(modules);
    windowNgMock.module(this.ng1Module.name);
    const upgrade = new UpgradeAdapterRef();
    this.ng2BootstrapDeferred.promise.then((ng1Injector) => {
      (<any>upgrade)._bootstrapDone(this.moduleRef, ng1Injector);
    }, onError);
    return upgrade;
  }

  /**
   * Bootstrap a hybrid AngularJS / Angular application.
   *
   * 引导混合 AngularJS / Angular 应用程序。
   *
   * This `bootstrap` method is a direct replacement (takes same arguments) for AngularJS
   * [`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) method. Unlike
   * AngularJS, this bootstrap is asynchronous.
   *
   * 此 `bootstrap` 方法是 AngularJS
   * [`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap)方法的直接替换（采用相同的参数）。与
   * AngularJS 不同，此引导程序是异步的。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * ```
   * const adapter = new UpgradeAdapter(MyNg2Module);
   * const module = angular.module('myExample', []);
   * module.directive('ng2', adapter.downgradeNg2Component(Ng2));
   *
   * module.directive('ng1', function() {
   *   return {
   *      scope: { title: '=' },
   *      template: 'ng1[Hello {{title}}!](<span ng-transclude></span>)'
   *   };
   * });
   *
   *
   * @Component({
   *   selector: 'ng2',
   *   inputs: ['name'],
   *   template: 'ng2[<ng1 [title]="name">transclude</ng1>](<ng-content></ng-content>)'
   * })
   * class Ng2 {
   * }
   *
   * @NgModule({
   *   declarations: [Ng2, adapter.upgradeNg1Component('ng1')],
   *   imports: [BrowserModule]
   * })
   * class MyNg2Module {}
   *
   * document.body.innerHTML = '<ng2 name="World">project</ng2>';
   *
   * adapter.bootstrap(document.body, ['myExample']).ready(function() {
   *   expect(document.body.textContent).toEqual(
   *       "ng2[ng1[Hello World!](transclude)](project)");
   * });
   * ```
   */
  bootstrap(element: Element, modules?: any[], config?: IAngularBootstrapConfig):
      UpgradeAdapterRef {
    this.declareNg1Module(modules);

    const upgrade = new UpgradeAdapterRef();

    // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
    const windowAngular = (window as any /** TODO #???? */)['angular'];
    windowAngular.resumeBootstrap = undefined;

    this.ngZone.run(() => {
      bootstrap(element, [this.ng1Module.name], config!);
    });
    const ng1BootstrapPromise = new Promise<void>((resolve) => {
      if (windowAngular.resumeBootstrap) {
        const originalResumeBootstrap: () => void = windowAngular.resumeBootstrap;
        windowAngular.resumeBootstrap = function() {
          windowAngular.resumeBootstrap = originalResumeBootstrap;
          const r = windowAngular.resumeBootstrap.apply(this, arguments);
          resolve();
          return r;
        };
      } else {
        resolve();
      }
    });

    Promise.all([this.ng2BootstrapDeferred.promise, ng1BootstrapPromise]).then(([ng1Injector]) => {
      angularElement(element).data!(controllerKey(INJECTOR_KEY), this.moduleRef!.injector);
      this.moduleRef!.injector.get<NgZone>(NgZone).run(() => {
        (<any>upgrade)._bootstrapDone(this.moduleRef, ng1Injector);
      });
    }, onError);
    return upgrade;
  }

  /**
   * Allows AngularJS service to be accessible from Angular.
   *
   * 允许从 Angular 访问 AngularJS 服务。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * ```
   * class Login { ... }
   * class Server { ... }
   *
   * @Injectable ()
   * class Example {
   *   constructor(@Inject('server') server, login: Login) {
   *     ...
   *   }
   * }
   *
   * const module = angular.module('myExample', []);
   * module.service('server', Server);
   * module.service('login', Login);
   *
   * const adapter = new UpgradeAdapter(MyNg2Module);
   * adapter.upgradeNg1Provider('server');
   * adapter.upgradeNg1Provider('login', {asToken: Login});
   *
   * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
   *   const example: Example = ref.ng2Injector.get(Example);
   * });
   *
   * ```
   */
  upgradeNg1Provider(name: string, options?: {asToken: any}) {
    const token = options && options.asToken || name;
    this.upgradedProviders.push({
      provide: token,
      useFactory: ($injector: IInjectorService) => $injector.get(name),
      deps: [$INJECTOR]
    });
  }

  /**
   * Allows Angular service to be accessible from AngularJS.
   *
   * 允许从 AngularJS 访问 Angular 服务。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * ```
   * class Example {
   * }
   *
   * const adapter = new UpgradeAdapter(MyNg2Module);
   *
   * const module = angular.module('myExample', []);
   * module.factory('example', adapter.downgradeNg2Provider(Example));
   *
   * adapter.bootstrap(document.body, ['myExample']).ready((ref) => {
   *   const example: Example = ref.ng1Injector.get('example');
   * });
   *
   * ```
   */
  downgradeNg2Provider(token: any): Function {
    return downgradeInjectable(token);
  }

  /**
   * Declare the AngularJS upgrade module for this adapter without bootstrapping the whole
   * hybrid application.
   *
   * 在不引导整个混合应用程序的情况下为此适配器声明 AngularJS 升级模块。
   *
   * This method is automatically called by `bootstrap()` and `registerForNg1Tests()`.
   *
   * 此方法会由 `bootstrap()` 和 `registerForNg1Tests()` 自动调用。
   *
   * @param modules The AngularJS modules that this upgrade module should depend upon.
   *
   * 此升级模块应该依赖的 AngularJS 模块。
   *
   * @returns
   *
   * The AngularJS upgrade module that is declared by this method
   *
   * 此方法声明的 AngularJS 升级模块
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * ```
   * const upgradeAdapter = new UpgradeAdapter(MyNg2Module);
   * upgradeAdapter.declareNg1Module(['heroApp']);
   * ```
   */
  private declareNg1Module(modules: string[] = []): IModule {
    const delayApplyExps: Function[] = [];
    let original$applyFn: Function;
    let rootScopePrototype: any;
    const upgradeAdapter = this;
    const ng1Module = this.ng1Module = angularModule(this.idPrefix, modules);
    const platformRef = platformBrowserDynamic();

    this.ngZone = new NgZone({enableLongStackTrace: Zone.hasOwnProperty('longStackTraceZoneSpec')});
    this.ng2BootstrapDeferred = new Deferred();
    ng1Module.constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Dynamic)
        .factory(INJECTOR_KEY, () => this.moduleRef!.injector.get(Injector))
        .factory(
            LAZY_MODULE_REF, [INJECTOR_KEY, (injector: Injector) => ({injector} as LazyModuleRef)])
        .constant(NG_ZONE_KEY, this.ngZone)
        .factory(COMPILER_KEY, () => this.moduleRef!.injector.get(Compiler))
        .config([
          '$provide', '$injector',
          (provide: IProvideService, ng1Injector: IInjectorService) => {
            provide.decorator($ROOT_SCOPE, [
              '$delegate',
              function(rootScopeDelegate: IRootScopeService) {
                // Capture the root apply so that we can delay first call to $apply until we
                // bootstrap Angular and then we replay and restore the $apply.
                rootScopePrototype = rootScopeDelegate.constructor.prototype;
                if (rootScopePrototype.hasOwnProperty('$apply')) {
                  original$applyFn = rootScopePrototype.$apply;
                  rootScopePrototype.$apply = (exp: any) => delayApplyExps.push(exp);
                } else {
                  throw new Error('Failed to find \'$apply\' on \'$rootScope\'!');
                }
                return rootScopeDelegate;
              }
            ]);
            if (ng1Injector.has($$TESTABILITY)) {
              provide.decorator($$TESTABILITY, [
                '$delegate',
                function(testabilityDelegate: ITestabilityService) {
                  const originalWhenStable: Function = testabilityDelegate.whenStable;
                  // Cannot use arrow function below because we need the context
                  const newWhenStable = function(this: unknown, callback: Function) {
                    originalWhenStable.call(this, function(this: unknown) {
                      const ng2Testability: Testability =
                          upgradeAdapter.moduleRef!.injector.get(Testability);
                      if (ng2Testability.isStable()) {
                        callback.apply(this, arguments);
                      } else {
                        ng2Testability.whenStable(newWhenStable.bind(this, callback));
                      }
                    });
                  };

                  testabilityDelegate.whenStable = newWhenStable;
                  return testabilityDelegate;
                }
              ]);
            }
          }
        ]);

    ng1Module.run([
      '$injector', '$rootScope',
      (ng1Injector: IInjectorService, rootScope: IRootScopeService) => {
        UpgradeNg1ComponentAdapterBuilder.resolve(this.ng1ComponentsToBeUpgraded, ng1Injector)
            .then(() => {
              // Note: There is a bug in TS 2.4 that prevents us from
              // inlining this into @NgModule
              // TODO(tbosch): find or file a bug against TypeScript for this.
              const ngModule = {
                providers: [
                  {provide: $INJECTOR, useFactory: () => ng1Injector},
                  {provide: $COMPILE, useFactory: () => ng1Injector.get($COMPILE)},
                  this.upgradedProviders
                ],
                imports: [resolveForwardRef(this.ng2AppModule)],
                entryComponents: this.downgradedComponents
              };
              // At this point we have ng1 injector and we have prepared
              // ng1 components to be upgraded, we now can bootstrap ng2.
              @NgModule({jit: true, ...ngModule})
              class DynamicNgUpgradeModule {
                constructor() {}
                ngDoBootstrap() {}
              }
              platformRef
                  .bootstrapModule(
                      DynamicNgUpgradeModule, [this.compilerOptions!, {ngZone: this.ngZone}])
                  .then((ref: NgModuleRef<any>) => {
                    this.moduleRef = ref;
                    this.ngZone.run(() => {
                      if (rootScopePrototype) {
                        rootScopePrototype.$apply = original$applyFn;  // restore original $apply
                        while (delayApplyExps.length) {
                          rootScope.$apply(delayApplyExps.shift());
                        }
                        rootScopePrototype = null;
                      }
                    });
                  })
                  .then(() => this.ng2BootstrapDeferred.resolve(ng1Injector), onError)
                  .then(() => {
                    let subscription = this.ngZone.onMicrotaskEmpty.subscribe({
                      next: () => {
                        if (rootScope.$$phase) {
                          if (typeof ngDevMode === 'undefined' || ngDevMode) {
                            console.warn(
                                'A digest was triggered while one was already in progress. This may mean that something is triggering digests outside the Angular zone.');
                          }

                          return rootScope.$evalAsync(() => {});
                        }

                        return rootScope.$digest();
                      }
                    });
                    rootScope.$on('$destroy', () => {
                      subscription.unsubscribe();
                    });

                    // Destroy the AngularJS app once the Angular `PlatformRef` is destroyed.
                    // This does not happen in a typical SPA scenario, but it might be useful for
                    // other use-cases where disposing of an Angular/AngularJS app is necessary
                    // (such as Hot Module Replacement (HMR)).
                    // See https://github.com/angular/angular/issues/39935.
                    platformRef.onDestroy(() => destroyApp(ng1Injector));
                  });
            })
            .catch((e) => this.ng2BootstrapDeferred.reject(e));
      }
    ]);

    return ng1Module;
  }
}

/**
 * Synchronous promise-like object to wrap parent injectors,
 * to preserve the synchronous nature of AngularJS's $compile.
 *
 * 包装父注入器的同步类 Promise 对象，以保留 AngularJS 的 $compile 的同步特性。
 *
 */
class ParentInjectorPromise {
  // TODO(issue/24571): remove '!'.
  private injector!: Injector;
  private callbacks: ((injector: Injector) => any)[] = [];

  constructor(private element: IAugmentedJQuery) {
    // store the promise on the element
    element.data!(controllerKey(INJECTOR_KEY), this);
  }

  then(callback: (injector: Injector) => any) {
    if (this.injector) {
      callback(this.injector);
    } else {
      this.callbacks.push(callback);
    }
  }

  resolve(injector: Injector) {
    this.injector = injector;

    // reset the element data to point to the real injector
    this.element.data!(controllerKey(INJECTOR_KEY), injector);

    // clean out the element to prevent memory leaks
    this.element = null!;

    // run all the queued callbacks
    this.callbacks.forEach((callback) => callback(injector));
    this.callbacks.length = 0;
  }
}


/**
 * Use `UpgradeAdapterRef` to control a hybrid AngularJS / Angular application.
 *
 * 使用 `UpgradeAdapterRef` 来控制混合 AngularJS / Angular 应用程序。
 *
 * @deprecated
 *
 * Deprecated since v5. Use `upgrade/static` instead, which also supports
 * [Ahead-of-Time compilation](guide/aot-compiler).
 *
 * 自 v5 以来已弃用。改用 `upgrade/static` ，它也支持[Ahead-of-Time 编译](guide/aot-compiler)。
 *
 * @publicApi
 */
export class UpgradeAdapterRef {
  /* @internal */
  private _readyFn: ((upgradeAdapterRef: UpgradeAdapterRef) => void)|null = null;

  public ng1RootScope: IRootScopeService = null!;
  public ng1Injector: IInjectorService = null!;
  public ng2ModuleRef: NgModuleRef<any> = null!;
  public ng2Injector: Injector = null!;

  /* @internal */
  private _bootstrapDone(ngModuleRef: NgModuleRef<any>, ng1Injector: IInjectorService) {
    this.ng2ModuleRef = ngModuleRef;
    this.ng2Injector = ngModuleRef.injector;
    this.ng1Injector = ng1Injector;
    this.ng1RootScope = ng1Injector.get($ROOT_SCOPE);
    this._readyFn && this._readyFn(this);
  }

  /**
   * Register a callback function which is notified upon successful hybrid AngularJS / Angular
   * application has been bootstrapped.
   *
   * 注册一个回调函数，该函数会在成功的混合 AngularJS/Angular 应用程序被引导时收到通知。
   *
   * The `ready` callback function is invoked inside the Angular zone, therefore it does not
   * require a call to `$apply()`.
   *
   * `ready` 回调函数是在 Angular 区域内调用的，因此它不需要调用 `$apply()` 。
   *
   */
  public ready(fn: (upgradeAdapterRef: UpgradeAdapterRef) => void) {
    this._readyFn = fn;
  }

  /**
   * Dispose of running hybrid AngularJS / Angular application.
   *
   * 处置正在运行的混合 AngularJS / Angular 应用程序。
   *
   */
  public dispose() {
    this.ng1Injector!.get($ROOT_SCOPE).$destroy();
    this.ng2ModuleRef!.destroy();
  }
}
