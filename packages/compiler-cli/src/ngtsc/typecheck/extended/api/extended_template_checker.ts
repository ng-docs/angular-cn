/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {TemplateDiagnostic} from '../../api';

/**
 * Interface to generate extended template diangostics from the component tempaltes.
 *
 * 从组件 tempalte 生成扩展模板诊断的接口。
 *
 */
export interface ExtendedTemplateChecker {
  /**
   * Run `TemplateCheck`s for a component and return the generated `ts.Diagnostic`s.
   *
   * 为组件运行 `TemplateCheck` 并返回生成的 `ts.Diagnostic` 。
   *
   */
  getDiagnosticsForComponent(component: ts.ClassDeclaration): TemplateDiagnostic[];
}
