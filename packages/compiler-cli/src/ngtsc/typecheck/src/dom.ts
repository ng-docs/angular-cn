/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DomElementSchemaRegistry, ParseSourceSpan, SchemaMetadata, TmplAstElement} from '@angular/compiler';
import ts from 'typescript';

import {ErrorCode, ngErrorCode} from '../../diagnostics';
import {TemplateDiagnostic, TemplateId} from '../api';
import {makeTemplateDiagnostic} from '../diagnostics';

import {TemplateSourceResolver} from './tcb_util';

const REGISTRY = new DomElementSchemaRegistry();
const REMOVE_XHTML_REGEX = /^:xhtml:/;

/**
 * Checks every non-Angular element/property processed in a template and potentially produces
 * `ts.Diagnostic`s related to improper usage.
 *
 * 检查模板中处理的每个非 Angular 元素/属性，并可能生成与使用不当相关的 `ts.Diagnostic` 。
 *
 * A `DomSchemaChecker`'s job is to check DOM nodes and their attributes written used in templates
 * and produce `ts.Diagnostic`s if the nodes don't conform to the DOM specification. It acts as a
 * collector for these diagnostics, and can be queried later to retrieve the list of any that have
 * been generated.
 *
 * `DomSchemaChecker` 的工作是检查模板中使用的 DOM 节点及其编写的属性，如果节点不符合 DOM
 * 规范，则生成 `ts.Diagnostic`
 * 。它充当这些诊断的收集器，并且可以在以后查询以检索已生成的任何诊断的列表。
 *
 */
export interface DomSchemaChecker {
  /**
   * Get the `ts.Diagnostic`s that have been generated via `checkElement` and `checkProperty` calls
   * thus far.
   *
   * 获取 `ts.Diagnostic` 已通过 `checkElement` 和 `checkProperty` 调用生成的 ts.Diagnostic 。
   *
   */
  readonly diagnostics: ReadonlyArray<TemplateDiagnostic>;

  /**
   * Check a non-Angular element and record any diagnostics about it.
   *
   * 检查一个非 Angular 元素并记录关于它的任何诊断。
   *
   * @param id the template ID, suitable for resolution with a `TcbSourceResolver`.
   *
   * 模板 ID，适合使用 `TcbSourceResolver` 。
   *
   * @param element the element node in question.
   *
   * 有问题的元素节点。
   *
   * @param schemas any active schemas for the template, which might affect the validity of the
   * element.
   *
   * 模板的任何活动模式，这可能会影响元素的有效性。
   *
   * @param hostIsStandalone boolean indicating whether the element's host is a standalone
   *     component.
   *
   * 布尔值，指示元素的宿主是否是独立组件。
   *
   */
  checkElement(
      id: string, element: TmplAstElement, schemas: SchemaMetadata[],
      hostIsStandalone: boolean): void;

  /**
   * Check a property binding on an element and record any diagnostics about it.
   *
   * 检查元素上的属性绑定并记录有关它的任何诊断。
   *
   * @param id the template ID, suitable for resolution with a `TcbSourceResolver`.
   *
   * 模板 ID，适合使用 `TcbSourceResolver` 。
   *
   * @param element the element node in question.
   *
   * 有问题的元素节点。
   *
   * @param name the name of the property being checked.
   *
   * 正在检查的属性的名称。
   *
   * @param span the source span of the binding. This is redundant with `element.attributes` but is
   * passed separately to avoid having to look up the particular property name.
   *
   * 绑定的源范围。这与 `element.attributes` 是多余的，但要单独传递以避免查找特定的属性名称。
   *
   * @param schemas any active schemas for the template, which might affect the validity of the
   * property.
   *
   * 模板的任何活动模式，这可能会影响属性的有效性。
   *
   */
  checkProperty(
      id: string, element: TmplAstElement, name: string, span: ParseSourceSpan,
      schemas: SchemaMetadata[], hostIsStandalone: boolean): void;
}

/**
 * Checks non-Angular elements and properties against the `DomElementSchemaRegistry`, a schema
 * maintained by the Angular team via extraction from a browser IDL.
 *
 * 根据 DomElementSchemaRegistry 检查非 Angular 元素和属性， `DomElementSchemaRegistry` 是由 Angular
 * 团队通过从浏览器 IDL 中提取来维护的模式。
 *
 */
export class RegistryDomSchemaChecker implements DomSchemaChecker {
  private _diagnostics: TemplateDiagnostic[] = [];

  get diagnostics(): ReadonlyArray<TemplateDiagnostic> {
    return this._diagnostics;
  }

  constructor(private resolver: TemplateSourceResolver) {}

  checkElement(
      id: TemplateId, element: TmplAstElement, schemas: SchemaMetadata[],
      hostIsStandalone: boolean): void {
    // HTML elements inside an SVG `foreignObject` are declared in the `xhtml` namespace.
    // We need to strip it before handing it over to the registry because all HTML tag names
    // in the registry are without a namespace.
    const name = element.name.replace(REMOVE_XHTML_REGEX, '');

    if (!REGISTRY.hasElement(name, schemas)) {
      const mapping = this.resolver.getSourceMapping(id);

      const schemas = `'${hostIsStandalone ? '@Component' : '@NgModule'}.schemas'`;
      let errorMsg = `'${name}' is not a known element:\n`;
      errorMsg += `1. If '${name}' is an Angular component, then verify that it is ${
          hostIsStandalone ? 'included in the \'@Component.imports\' of this component' :
                             'part of this module'}.\n`;
      if (name.indexOf('-') > -1) {
        errorMsg += `2. If '${name}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the ${
            schemas} of this component to suppress this message.`;
      } else {
        errorMsg +=
            `2. To allow any element add 'NO_ERRORS_SCHEMA' to the ${schemas} of this component.`;
      }

      const diag = makeTemplateDiagnostic(
          id, mapping, element.startSourceSpan, ts.DiagnosticCategory.Error,
          ngErrorCode(ErrorCode.SCHEMA_INVALID_ELEMENT), errorMsg);
      this._diagnostics.push(diag);
    }
  }

  checkProperty(
      id: TemplateId, element: TmplAstElement, name: string, span: ParseSourceSpan,
      schemas: SchemaMetadata[], hostIsStandalone: boolean): void {
    if (!REGISTRY.hasProperty(element.name, name, schemas)) {
      const mapping = this.resolver.getSourceMapping(id);

      const decorator = hostIsStandalone ? '@Component' : '@NgModule';
      const schemas = `'${decorator}.schemas'`;
      let errorMsg =
          `Can't bind to '${name}' since it isn't a known property of '${element.name}'.`;
      if (element.name.startsWith('ng-')) {
        errorMsg += `\n1. If '${name}' is an Angular directive, then add 'CommonModule' to the '${
                        decorator}.imports' of this component.` +
            `\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the ${
                        schemas} of this component.`;
      } else if (element.name.indexOf('-') > -1) {
        errorMsg +=
            `\n1. If '${element.name}' is an Angular component and it has '${
                name}' input, then verify that it is ${
                hostIsStandalone ? 'included in the \'@Component.imports\' of this component' :
                                   'part of this module'}.` +
            `\n2. If '${
                element.name}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the ${
                schemas} of this component to suppress this message.` +
            `\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the ${
                schemas} of this component.`;
      }

      const diag = makeTemplateDiagnostic(
          id, mapping, span, ts.DiagnosticCategory.Error,
          ngErrorCode(ErrorCode.SCHEMA_INVALID_ATTRIBUTE), errorMsg);
      this._diagnostics.push(diag);
    }
  }
}
