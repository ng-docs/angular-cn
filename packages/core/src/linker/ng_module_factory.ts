/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../di/injector';
import {EnvironmentInjector} from '../di/r3_injector';
import {Type} from '../interface/type';

import {ComponentFactoryResolver} from './component_factory_resolver';


/**
 * Represents an instance of an `NgModule` created by an `NgModuleFactory`.
 * Provides access to the `NgModule` instance and related objects.
 *
 * `NgModule` 创建的 `NgModuleFactory` 的实例。提供对 `NgModule` 实例和相关对象的访问。
 *
 * @publicApi
 */
export abstract class NgModuleRef<T> {
  /**
   * The injector that contains all of the providers of the `NgModule`.
   *
   * 包含 `NgModule` 所有提供者的注入器。
   *
   */
  abstract get injector(): EnvironmentInjector;

  /**
   * The resolver that can retrieve component factories in a context of this module.
   *
   * 可以在此模块的上下文中检索组件工厂的解析器。
   *
   * Note: since v13, dynamic component creation via
   * [`ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)
   * does **not** require resolving component factory: component class can be used directly.
   *
   * 注意：从 v13
   * 开始，通过[`ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)创建动态组件**不需要**解析组件工厂：组件类可以直接使用。
   *
   * @deprecated
   *
   * Angular no longer requires Component factories. Please use other APIs where
   *     Component class can be used directly.
   *
   * Angular 不再需要组件工厂。请使用可以直接使用 Component 类的其他 API。
   *
   */
  abstract get componentFactoryResolver(): ComponentFactoryResolver;

  /**
   * The `NgModule` instance.
   *
   * `NgModule` 实例。
   *
   */
  abstract get instance(): T;

  /**
   * Destroys the module instance and all of the data structures associated with it.
   *
   * 销毁模块实例以及与其关联的所有数据结构。
   *
   */
  abstract destroy(): void;

  /**
   * Registers a callback to be executed when the module is destroyed.
   *
   * 注册一个销毁模块时要执行的回调。
   *
   */
  abstract onDestroy(callback: () => void): void;
}

export interface InternalNgModuleRef<T> extends NgModuleRef<T> {
  // Note: we are using the prefix _ as NgModuleData is an NgModuleRef and therefore directly
  // exposed to the user.
  _bootstrapComponents: Type<any>[];
}

/**
 * @publicApi
 * @deprecated
 *
 * This class was mostly used as a part of ViewEngine-based JIT API and is no longer needed in Ivy
 * JIT mode. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes)
 * for additional context. Angular provides APIs that accept NgModule classes directly (such as
 * [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) and
 * [createNgModuleRef](api/core/createNgModuleRef)), consider switching to those APIs instead of
 * using factory-based ones.
 *
 * 此类主要作为 ViewEngine-based JIT API 的一部分使用，在 Ivy JIT
 * 模式下不再需要。有关其他上下文，请参阅[由于 ViewEngine 弃用导致的 JIT API
 * 更改](guide/deprecations#jit-api-changes)。 Angular 提供了直接接受 NgModule 类的
 * API（例如[PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule)和[createNgModuleRef](api/core/createNgModuleRef)
 *），请考虑切换到这些 API，而不是使用基于工厂的 API。
 *
 */
export abstract class NgModuleFactory<T> {
  abstract get moduleType(): Type<T>;
  abstract create(parentInjector: Injector|null): NgModuleRef<T>;
}
