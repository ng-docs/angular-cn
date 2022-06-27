/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SchemaMetadata} from '@angular/compiler';

import {Reexport, Reference} from '../../imports';
import {DirectiveMeta, NgModuleMeta, PipeMeta} from '../../metadata';
import {ClassDeclaration} from '../../reflection';


/**
 * Data for one of a given NgModule's scopes (either compilation scope or export scopes).
 *
 * 给定 NgModule 范围之一（编译范围或导出范围）的数据。
 *
 */
export interface ScopeData {
  dependencies: Array<DirectiveMeta|PipeMeta>;

  /**
   * Whether some module or component in this scope contains errors and is thus semantically
   * unreliable.
   *
   * 此范围内的某些模块或组件是否包含错误，因此在语义上不可靠。
   *
   */
  isPoisoned: boolean;
}

/**
 * An export scope of an NgModule, containing the directives/pipes it contributes to other NgModules
 * which import it.
 *
 * NgModule 的导出范围，包含它为导入它的其他 NgModule 贡献的指令/管道。
 *
 */
export interface ExportScope {
  /**
   * The scope exported by an NgModule, and available for import.
   *
   * 由 NgModule 导出的范围，可用于导入。
   *
   */
  exported: ScopeData;
}

/**
 * A resolved scope for a given component that cannot be set locally in the component definition,
 * and must be set via remote scoping call in the component's NgModule file.
 *
 * 给定组件的解析范围，无法在组件定义中本地设置，必须通过组件的 NgModule
 * 文件中的远程范围调用来设置。
 *
 */
export interface RemoteScope {
  /**
   * Those directives used by the component that requires this scope to be set remotely.
   *
   * 需要远程设置此范围的组件使用的那些指令。
   *
   */
  directives: Reference[];

  /**
   * Those pipes used by the component that requires this scope to be set remotely.
   *
   * 需要远程设置此范围的组件使用的那些管道。
   *
   */
  pipes: Reference[];
}

export enum ComponentScopeKind {
  NgModule,
  Standalone,
}


export interface LocalModuleScope extends ExportScope {
  kind: ComponentScopeKind.NgModule;
  ngModule: ClassDeclaration;
  compilation: ScopeData;
  reexports: Reexport[]|null;
  schemas: SchemaMetadata[];
}

export interface StandaloneScope {
  kind: ComponentScopeKind.Standalone;
  dependencies: Array<DirectiveMeta|PipeMeta|NgModuleMeta>;
  component: ClassDeclaration;
  schemas: SchemaMetadata[];
  isPoisoned: boolean;
}

export type ComponentScope = LocalModuleScope|StandaloneScope;

/**
 * Read information about the compilation scope of components.
 *
 * 阅读有关组件编译范围的信息。
 *
 */
export interface ComponentScopeReader {
  getScopeForComponent(clazz: ClassDeclaration): ComponentScope|null;

  /**
   * Get the `RemoteScope` required for this component, if any.
   *
   * 获取此组件所需的 `RemoteScope` （如果有）。
   *
   * If the component requires remote scoping, then retrieve the directives/pipes registered for
   * that component. If remote scoping is not required (the common case), returns `null`.
   *
   * 如果组件需要远程范围，则检索为该组件注册的指令/管道。如果不需要远程范围设定（常见情况），则返回
   * `null` 。
   *
   */
  getRemoteScope(clazz: ClassDeclaration): RemoteScope|null;
}
