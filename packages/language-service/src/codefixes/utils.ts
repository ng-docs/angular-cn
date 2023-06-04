/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {absoluteFrom} from '@angular/compiler-cli';
import {NgCompiler} from '@angular/compiler-cli/src/ngtsc/core';
import tss from 'typescript/lib/tsserverlibrary';

import {TemplateInfo} from '../utils';

/**
 * This context is the info includes the `errorCode` at the given span the user selected in the
 * editor and the `NgCompiler` could help to fix it.
 *
 * 此上下文是包含用户在编辑器中选择的给定范围内的 `errorCode` 信息，`NgCompiler` 可以帮助修复它。
 *
 * When the editor tries to provide a code fix for a diagnostic in a span of a template file, this
 * context will be provided to the `CodeActionMeta` which could handle the `errorCode`.
 *
 * 当编辑器尝试为模板文件范围内的诊断提供代码修复时，此上下文将提供给可以处理 `errorCode` `CodeActionMeta`。
 *
 */
export interface CodeActionContext {
  templateInfo: TemplateInfo;
  fileName: string;
  compiler: NgCompiler;
  start: number;
  end: number;
  errorCode: number;
  formatOptions: tss.FormatCodeSettings;
  preferences: tss.UserPreferences;
  tsLs: tss.LanguageService;
}

/**
 * This context is the info includes all diagnostics in the `scope` and the `NgCompiler` that could
 * help to fix it.
 *
 * 这个上下文是信息，包括 `scope` 内的所有诊断和可以帮助修复它的 `NgCompiler`。
 *
 * When the editor tries to fix the all same type of diagnostics selected by the user in the
 * `scope`, this context will be provided to the `CodeActionMeta` which could handle the `fixId`.
 *
 * 当编辑器尝试修复 `scope` 内用户选择的所有相同类型的诊断时，此上下文将提供给可以处理 `fixId` `CodeActionMeta`。
 *
 */
export interface CodeFixAllContext {
  scope: tss.CombinedCodeFixScope;
  compiler: NgCompiler;
  // https://github.com/microsoft/TypeScript/blob/5c4caafc2a2d0fceb03fce80fb14d3ee4407d918/src/services/types.ts#L781-L785
  fixId: string;
  formatOptions: tss.FormatCodeSettings;
  preferences: tss.UserPreferences;
  tsLs: tss.LanguageService;
  diagnostics: tss.Diagnostic[];
}

export interface CodeActionMeta {
  errorCodes: Array<number>;
  getCodeActions: (context: CodeActionContext) => readonly tss.CodeFixAction[];
  fixIds: FixIdForCodeFixesAll[];
  getAllCodeActions: (context: CodeFixAllContext) => tss.CombinedCodeActions;
}

/**
 * Convert the span of `textChange` in the TCB to the span of the template.
 *
 * 将 TCB 中 `textChange` 的 span 转换为模板的 span。
 *
 */
export function convertFileTextChangeInTcb(
    changes: readonly tss.FileTextChanges[], compiler: NgCompiler): tss.FileTextChanges[] {
  const ttc = compiler.getTemplateTypeChecker();
  const fileTextChanges: tss.FileTextChanges[] = [];
  for (const fileTextChange of changes) {
    if (!ttc.isTrackedTypeCheckFile(absoluteFrom(fileTextChange.fileName))) {
      fileTextChanges.push(fileTextChange);
      continue;
    }
    const textChanges: tss.TextChange[] = [];
    let fileName: string|undefined;
    const seenTextChangeInTemplate = new Set<string>();
    for (const textChange of fileTextChange.textChanges) {
      const templateMap = ttc.getTemplateMappingAtTcbLocation({
        tcbPath: absoluteFrom(fileTextChange.fileName),
        isShimFile: true,
        positionInFile: textChange.span.start,
      });
      if (templateMap === null) {
        continue;
      }
      const mapping = templateMap.templateSourceMapping;
      if (mapping.type === 'external') {
        fileName = mapping.templateUrl;
      } else if (mapping.type === 'direct') {
        fileName = mapping.node.getSourceFile().fileName;
      } else {
        continue;
      }
      const start = templateMap.span.start.offset;
      const length = templateMap.span.end.offset - templateMap.span.start.offset;
      const changeSpanKey = `${start},${length}`;
      if (seenTextChangeInTemplate.has(changeSpanKey)) {
        continue;
      }
      seenTextChangeInTemplate.add(changeSpanKey);
      textChanges.push({
        newText: textChange.newText,
        span: {
          start,
          length,
        },
      });
    }
    if (fileName === undefined) {
      continue;
    }
    fileTextChanges.push({
      fileName,
      isNewFile: fileTextChange.isNewFile,
      textChanges,
    });
  }
  return fileTextChanges;
}

/**
 * 'fix all' is only available when there are multiple diagnostics that the code action meta
 * indicates it can fix.
 *
 * “全部修复”仅在存在代码操作元指示它可以修复的多个诊断时可用。
 *
 */
export function isFixAllAvailable(meta: CodeActionMeta, diagnostics: tss.Diagnostic[]) {
  const errorCodes = meta.errorCodes;
  let maybeFixableDiagnostics = 0;
  for (const diag of diagnostics) {
    if (errorCodes.includes(diag.code)) maybeFixableDiagnostics++;
    if (maybeFixableDiagnostics > 1) return true;
  }

  return false;
}

export enum FixIdForCodeFixesAll {
  FIX_SPELLING = 'fixSpelling',
  FIX_MISSING_MEMBER = 'fixMissingMember',
  FIX_INVALID_BANANA_IN_BOX = 'fixInvalidBananaInBox',
  FIX_MISSING_IMPORT = 'fixMissingImport',
}
