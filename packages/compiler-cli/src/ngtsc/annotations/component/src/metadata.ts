/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AnimationTriggerNames, R3ClassMetadata, R3ComponentMetadata, R3TemplateDependency, R3TemplateDependencyMetadata, SchemaMetadata} from '@angular/compiler';
import ts from 'typescript';

import {Reference} from '../../../imports';
import {ClassPropertyMapping, ComponentResources, DirectiveTypeCheckMeta} from '../../../metadata';
import {ClassDeclaration} from '../../../reflection';
import {SubsetOfKeys} from '../../../util/src/typescript';

import {ParsedTemplateWithSource, StyleUrlMeta} from './resources';

/**
 * These fields of `R3ComponentMetadata` are updated in the `resolve` phase.
 *
 * `R3ComponentMetadata` 的这些字段会在 `resolve` 阶段更新。
 *
 * The `keyof R3ComponentMetadata &` condition ensures that only fields of `R3ComponentMetadata` can
 * be included here.
 *
 * `keyof R3ComponentMetadata &` 条件可确保这里只能包含 `R3ComponentMetadata` 的字段。
 *
 */
export type ComponentMetadataResolvedFields = SubsetOfKeys<
    R3ComponentMetadata<R3TemplateDependencyMetadata>, 'declarations'|'declarationListEmitMode'>;

export interface ComponentAnalysisData {
  /**
   * `meta` includes those fields of `R3ComponentMetadata` which are calculated at `analyze` time
   * (not during resolve).
   *
   * `meta` 包括 `R3ComponentMetadata` 中在 `analyze` 时（而不是解析期间）计算的那些字段。
   *
   */
  meta: Omit<R3ComponentMetadata<R3TemplateDependencyMetadata>, ComponentMetadataResolvedFields>;
  baseClass: Reference<ClassDeclaration>|'dynamic'|null;
  typeCheckMeta: DirectiveTypeCheckMeta;
  template: ParsedTemplateWithSource;
  classMetadata: R3ClassMetadata|null;

  inputs: ClassPropertyMapping;
  outputs: ClassPropertyMapping;

  /**
   * Providers extracted from the `providers` field of the component annotation which will require
   * an Angular factory definition at runtime.
   *
   * 从组件注解的 `providers` 字段中提取的提供者，在运行时需要 Angular 工厂定义。
   *
   */
  providersRequiringFactory: Set<Reference<ClassDeclaration>>|null;

  /**
   * Providers extracted from the `viewProviders` field of the component annotation which will
   * require an Angular factory definition at runtime.
   *
   * 从组件注解的 `viewProviders` 字段中提取的提供者，在运行时需要 Angular 工厂定义。
   *
   */
  viewProvidersRequiringFactory: Set<Reference<ClassDeclaration>>|null;

  resources: ComponentResources;

  /**
   * `styleUrls` extracted from the decorator, if present.
   *
   * 从装饰器中提取的 `styleUrls` （如果存在）。
   *
   */
  styleUrls: StyleUrlMeta[]|null;

  /**
   * Inline stylesheets extracted from the decorator, if present.
   *
   * 从装饰器提取的内联样式表（如果存在）。
   *
   */
  inlineStyles: string[]|null;

  isPoisoned: boolean;
  animationTriggerNames: AnimationTriggerNames|null;

  rawImports: ts.Expression|null;
  resolvedImports: Reference<ClassDeclaration>[]|null;

  schemas: SchemaMetadata[]|null;
}

export type ComponentResolutionData =
    Pick<R3ComponentMetadata<R3TemplateDependencyMetadata>, ComponentMetadataResolvedFields>;
