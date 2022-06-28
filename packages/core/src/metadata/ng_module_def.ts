/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';

import {SchemaMetadata} from './schema';


export interface NgModuleType<T = any> extends Type<T> {
  ɵmod: NgModuleDef<T>;
}

/**
 * Represents the expansion of an `NgModule` into its scopes.
 *
 * 表示将 `NgModule` 扩展到其范围。
 *
 * A scope is a set of directives and pipes that are visible in a particular context. Each
 * `NgModule` has two scopes. The `compilation` scope is the set of directives and pipes that will
 * be recognized in the templates of components declared by the module. The `exported` scope is the
 * set of directives and pipes exported by a module (that is, module B's exported scope gets added
 * to module A's compilation scope when module A imports B).
 *
 * 范围是在特定上下文中可见的一组指令和管道。每个 `NgModule` 都有两个范围。 `compilation`
 * 范围是将在模块声明的组件模板中识别的指令和管道集。 `exported`
 * 的范围是模块导出的指令和管道集（即，当模块 A 导入 B 时，模块 B 的导出范围会添加到模块 A
 * 的编译范围）。
 *
 */
export interface NgModuleTransitiveScopes {
  compilation: {directives: Set<any>; pipes: Set<any>;};
  exported: {directives: Set<any>; pipes: Set<any>;};
  schemas: SchemaMetadata[]|null;
}

/**
 * Runtime link information for NgModules.
 *
 * NgModules 的运行时链接信息。
 *
 * This is the internal data structure used by the runtime to assemble components, directives,
 * pipes, and injectors.
 *
 * 这是运行时用来组装组件、指令、管道和注入器的内部数据结构。
 *
 * NOTE: Always use `ɵɵdefineNgModule` function to create this object,
 * never create the object directly since the shape of this object
 * can change between versions.
 *
 * 注意：始终使用 `ɵɵdefineNgModule`
 * 函数来创建此对象，切勿直接创建对象，因为此对象的形状可以在版本之间更改。
 *
 */
export interface NgModuleDef<T> {
  /**
   * Token representing the module. Used by DI.
   *
   * 表示模块的标记。由 DI 使用。
   *
   */
  type: T;

  /**
   * List of components to bootstrap.
   *
   * 要引导的组件列表。
   *
   */
  bootstrap: Type<any>[]|(() => Type<any>[]);

  /**
   * List of components, directives, and pipes declared by this module.
   *
   * 此模块声明的组件、指令和管道的列表。
   *
   */
  declarations: Type<any>[]|(() => Type<any>[]);

  /**
   * List of modules or `ModuleWithProviders` imported by this module.
   *
   * 此模块导入的模块或 `ModuleWithProviders` 列表。
   *
   */
  imports: Type<any>[]|(() => Type<any>[]);

  /**
   * List of modules, `ModuleWithProviders`, components, directives, or pipes exported by this
   * module.
   *
   * 此模块导出的模块、 `ModuleWithProviders` 、组件、指令或管道的列表。
   *
   */
  exports: Type<any>[]|(() => Type<any>[]);

  /**
   * Cached value of computed `transitiveCompileScopes` for this module.
   *
   * 此模块的计算的可 `transitiveCompileScopes` 编译器范围的缓存值。
   *
   * This should never be read directly, but accessed via `transitiveScopesFor`.
   *
   * 这永远不应该直接读取，而应该通过 `transitiveScopesFor` 访问。
   *
   */
  transitiveCompileScopes: NgModuleTransitiveScopes|null;

  /**
   * The set of schemas that declare elements to be allowed in the NgModule.
   *
   * 声明 NgModule 中允许的元素的模式集。
   *
   */
  schemas: SchemaMetadata[]|null;

  /**
   * Unique ID for the module with which it should be registered.
   *
   * 应该注册的模块的唯一 ID。
   *
   */
  id: string|null;
}
