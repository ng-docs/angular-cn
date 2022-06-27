/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ComponentRef, createNgModuleRef, Directive, Injector, Input, NgModuleFactory, NgModuleRef, OnChanges, OnDestroy, SimpleChanges, Type, ViewContainerRef} from '@angular/core';


/**
 * Instantiates a {@link Component} type and inserts its Host View into the current View.
 * `NgComponentOutlet` provides a declarative approach for dynamic component creation.
 *
 * 实例化单个 {@link Component} 类型，并将其宿主视图插入当前视图。`NgComponentOutlet`
 * 为动态组件创建提供了一种声明式方法。
 *
 * `NgComponentOutlet` requires a component type, if a falsy value is set the view will clear and
 * any existing component will be destroyed.
 *
 * `NgComponentOutlet` 所需的组件类型，如果设置为假值，则视图将被清除并且任何现有组件将被销毁。
 *
 * @usageNotes
 *
 * ### Fine tune control
 *
 * ### 微调控制
 *
 * You can control the component creation process by using the following optional attributes:
 *
 * 你可以使用以下可选属性来控制组件的创建过程：
 *
 * * `ngComponentOutletInjector`: Optional custom {@link Injector} that will be used as parent for
 *   the Component. Defaults to the injector of the current view container.
 *
 *   `ngComponentOutletInjector` ：可选的自定义 {@link Injector} ，将用作 Component
 * 的父级。默认为当前视图容器的注入器。
 *
 *   ```
 *   `ngComponentOutletInjector`：可选的自定义 {@link
 *   ```
 *
 *   Injector}，将用作此组件的父级。默认为当前视图容器的注入器。
 *
 * * `ngComponentOutletContent`: Optional list of projectable nodes to insert into the content
 *   section of the component, if it exists.
 *
 *   `ngComponentOutletContent` ：要插入组件的 content 部分的可项目节点的可选列表（如果存在）。
 *
 *   ```
 *   `ngComponentOutletContent`：要插入到组件内容部分的可投影节点的可选列表（如果存在）。
 *   ```
 *
 * * `ngComponentOutletNgModule`: Optional NgModule class reference to allow loading another
 *   module dynamically, then loading a component from that module.
 *
 *   `ngComponentOutletNgModule` ：可选的 NgModule
 * 类引用，以允许动态加载另一个模块，然后从该模块加载组件。
 *
 *   ```
 *   `ngComponentOutletNgModuleFactory`：可选模块工厂，允许动态加载其他模块，然后从该模块加载组件。
 *   ```
 *
 * * `ngComponentOutletNgModuleFactory`: Deprecated config option that allows providing optional
 *   NgModule factory to allow loading another module dynamically, then loading a component from
 * that module. Use `ngComponentOutletNgModule` instead.
 *
 *   `ngComponentOutletNgModuleFactory` ：不推荐使用的配置选项，它允许提供可选的 NgModule
 * 工厂以允许动态加载另一个模块，然后从该模块加载组件。改用 `ngComponentOutletNgModule` 。
 *
 * ### Syntax
 *
 * ### 语法
 *
 * Simple
 *
 * 简单
 *
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression"></ng-container>
 * ```
 *
 * Customized injector/content
 *
 * 定制的注入器/内容
 *
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   injector: injectorExpression;
 *                                   content: contentNodesExpression;">
 * </ng-container>
 * ```
 *
 * Customized NgModule reference
 *
 * 定制的 ngModule 引用
 *
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   ngModule: ngModuleClass;">
 * </ng-container>
 * ```
 *
 * ### A simple example
 *
 * ### 一个简单的例子
 *
 * {
 *
 * @example common/ngComponentOutlet/ts/module.ts region='SimpleExample'}
 *
 * A more complete example with additional options:
 *
 * {
 * @example common/ngComponentOutlet/ts/module.ts region='CompleteExample'}
 * @publicApi
 * @ngModule CommonModule
 */
@Directive({selector: '[ngComponentOutlet]'})
export class NgComponentOutlet implements OnChanges, OnDestroy {
  @Input() ngComponentOutlet!: Type<any>;

  @Input() ngComponentOutletInjector?: Injector;
  @Input() ngComponentOutletContent?: any[][];

  @Input() ngComponentOutletNgModule?: Type<any>;
  /**
   * @deprecated
   *
   * This input is deprecated, use `ngComponentOutletNgModule` instead.
   *
   * 不推荐使用此输入，请改用 `ngComponentOutletNgModule` 。
   *
   */
  @Input() ngComponentOutletNgModuleFactory?: NgModuleFactory<any>;

  private _componentRef: ComponentRef<any>|undefined;
  private _moduleRef: NgModuleRef<any>|undefined;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  /** @nodoc */
  ngOnChanges(changes: SimpleChanges) {
    const {
      _viewContainerRef: viewContainerRef,
      ngComponentOutletNgModule: ngModule,
      ngComponentOutletNgModuleFactory: ngModuleFactory,
    } = this;
    viewContainerRef.clear();
    this._componentRef = undefined;

    if (this.ngComponentOutlet) {
      const injector = this.ngComponentOutletInjector || viewContainerRef.parentInjector;

      if (changes['ngComponentOutletNgModule'] || changes['ngComponentOutletNgModuleFactory']) {
        if (this._moduleRef) this._moduleRef.destroy();

        if (ngModule) {
          this._moduleRef = createNgModuleRef(ngModule, getParentInjector(injector));
        } else if (ngModuleFactory) {
          this._moduleRef = ngModuleFactory.create(getParentInjector(injector));
        } else {
          this._moduleRef = undefined;
        }
      }

      this._componentRef = viewContainerRef.createComponent(this.ngComponentOutlet, {
        index: viewContainerRef.length,
        injector,
        ngModuleRef: this._moduleRef,
        projectableNodes: this.ngComponentOutletContent,
      });
    }
  }

  /** @nodoc */
  ngOnDestroy() {
    if (this._moduleRef) this._moduleRef.destroy();
  }
}

// Helper function that returns an Injector instance of a parent NgModule.
function getParentInjector(injector: Injector): Injector {
  const parentNgModule = injector.get(NgModuleRef);
  return parentNgModule.injector;
}
