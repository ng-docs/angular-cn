/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CssSelector, SchemaMetadata, SelectorMatcher} from '@angular/compiler';
import ts from 'typescript';

import {Reference} from '../../imports';
import {DirectiveMeta, flattenInheritedDirectiveMetadata, HostDirectivesResolver, MetadataReader, MetaKind} from '../../metadata';
import {ClassDeclaration} from '../../reflection';

import {ComponentScopeKind, ComponentScopeReader} from './api';

/**
 * The scope that is used for type-check code generation of a component template.
 *
 * 用于组件模板的类型检查代码生成的范围。
 *
 */
export interface TypeCheckScope {
  /**
   * A `SelectorMatcher` instance that contains the flattened directive metadata of all directives
   * that are in the compilation scope of the declaring NgModule.
   *
   * 一个 `SelectorMatcher` 实例，包含声明的 NgModule 的编译范围内的所有指令的展平指令元数据。
   *
   */
  matcher: SelectorMatcher<DirectiveMeta[]>;

  /**
   * All of the directives available in the compilation scope of the declaring NgModule.
   *
   * 声明的 NgModule 的编译范围内可用的所有指令。
   *
   */
  directives: DirectiveMeta[];

  /**
   * The pipes that are available in the compilation scope.
   *
   * 编译范围中可用的管道。
   *
   */
  pipes: Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>;

  /**
   * The schemas that are used in this scope.
   *
   * 此范围中使用的模式。
   *
   */
  schemas: SchemaMetadata[];

  /**
   * Whether the original compilation scope which produced this `TypeCheckScope` was itself poisoned
   * (contained semantic errors during its production).
   *
   * 生成此 `TypeCheckScope` 的原始编译范围本身是否已中毒（在其生产过程中包含语义错误）。
   *
   */
  isPoisoned: boolean;
}

/**
 * Computes scope information to be used in template type checking.
 *
 * 计算要在模板类型检查中使用的范围信息。
 *
 */
export class TypeCheckScopeRegistry {
  /**
   * Cache of flattened directive metadata. Because flattened metadata is scope-invariant it's
   * cached individually, such that all scopes refer to the same flattened metadata.
   *
   * 展平指令元数据的缓存。因为展平元数据是范围不变的，所以它是单独缓存的，因此所有范围都引用同一个展平元数据。
   *
   */
  private flattenedDirectiveMetaCache = new Map<ClassDeclaration, DirectiveMeta>();

  /**
   * Cache of the computed type check scope per NgModule declaration.
   *
   * 每个 NgModule 声明的计算类型检查范围的缓存。
   *
   */
  private scopeCache = new Map<ClassDeclaration, TypeCheckScope>();

  constructor(
      private scopeReader: ComponentScopeReader, private metaReader: MetadataReader,
      private hostDirectivesResolver: HostDirectivesResolver) {}

  /**
   * Computes the type-check scope information for the component declaration. If the NgModule
   * contains an error, then 'error' is returned. If the component is not declared in any NgModule,
   * an empty type-check scope is returned.
   *
   * 计算组件声明的类型检查范围信息。如果 NgModule 包含错误，则返回 'error'。如果未在任何 NgModule
   * 中声明组件，则返回空的类型检查范围。
   *
   */
  getTypeCheckScope(node: ClassDeclaration): TypeCheckScope {
    const matcher = new SelectorMatcher<DirectiveMeta[]>();
    const directives: DirectiveMeta[] = [];
    const pipes = new Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>();

    const scope = this.scopeReader.getScopeForComponent(node);
    if (scope === null) {
      return {
        matcher,
        directives,
        pipes,
        schemas: [],
        isPoisoned: false,
      };
    }

    const cacheKey = scope.kind === ComponentScopeKind.NgModule ? scope.ngModule : scope.component;
    const dependencies = scope.kind === ComponentScopeKind.NgModule ?
        scope.compilation.dependencies :
        scope.dependencies;

    if (this.scopeCache.has(cacheKey)) {
      return this.scopeCache.get(cacheKey)!;
    }

    for (const meta of dependencies) {
      if (meta.kind === MetaKind.Directive && meta.selector !== null) {
        const extMeta = this.getTypeCheckDirectiveMetadata(meta.ref);
        matcher.addSelectables(
            CssSelector.parse(meta.selector),
            [...this.hostDirectivesResolver.resolve(extMeta), extMeta]);
        directives.push(extMeta);
      } else if (meta.kind === MetaKind.Pipe) {
        if (!ts.isClassDeclaration(meta.ref.node)) {
          throw new Error(`Unexpected non-class declaration ${
              ts.SyntaxKind[meta.ref.node.kind]} for pipe ${meta.ref.debugName}`);
        }
        pipes.set(meta.name, meta.ref as Reference<ClassDeclaration<ts.ClassDeclaration>>);
      }
    }

    const typeCheckScope: TypeCheckScope = {
      matcher,
      directives,
      pipes,
      schemas: scope.schemas,
      isPoisoned: scope.kind === ComponentScopeKind.NgModule ?
          scope.compilation.isPoisoned || scope.exported.isPoisoned :
          scope.isPoisoned,
    };
    this.scopeCache.set(cacheKey, typeCheckScope);
    return typeCheckScope;
  }

  getTypeCheckDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta {
    const clazz = ref.node;
    if (this.flattenedDirectiveMetaCache.has(clazz)) {
      return this.flattenedDirectiveMetaCache.get(clazz)!;
    }

    const meta = flattenInheritedDirectiveMetadata(this.metaReader, ref);
    this.flattenedDirectiveMetaCache.set(clazz, meta);
    return meta;
  }
}
