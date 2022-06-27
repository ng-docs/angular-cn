/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AbsoluteSourceSpan, ParseLocation, ParseSourceFile, ParseSourceSpan} from '@angular/compiler';
import ts from 'typescript';

import {TemplateId, TemplateSourceMapping} from '../api';
import {getTemplateId} from '../diagnostics';

import {computeLineStartsMap, getLineAndCharacterFromPosition} from './line_mappings';
import {TemplateSourceResolver} from './tcb_util';

/**
 * Represents the source of a template that was processed during type-checking. This information is
 * used when translating parse offsets in diagnostics back to their original line/column location.
 *
 * 表示在类型检查期间处理的模板的源。将诊断中的解析偏移量转换回其原始行/列位置时会使用此信息。
 *
 */
export class TemplateSource {
  private lineStarts: number[]|null = null;

  constructor(readonly mapping: TemplateSourceMapping, private file: ParseSourceFile) {}

  toParseSourceSpan(start: number, end: number): ParseSourceSpan {
    const startLoc = this.toParseLocation(start);
    const endLoc = this.toParseLocation(end);
    return new ParseSourceSpan(startLoc, endLoc);
  }

  private toParseLocation(position: number) {
    const lineStarts = this.acquireLineStarts();
    const {line, character} = getLineAndCharacterFromPosition(lineStarts, position);
    return new ParseLocation(this.file, position, line, character);
  }

  private acquireLineStarts(): number[] {
    if (this.lineStarts === null) {
      this.lineStarts = computeLineStartsMap(this.file.content);
    }
    return this.lineStarts;
  }
}

/**
 * Assigns IDs to templates and keeps track of their origins.
 *
 * 为模板分配 ID 并跟踪它们的来源。
 *
 * Implements `TemplateSourceResolver` to resolve the source of a template based on these IDs.
 *
 * 实现 `TemplateSourceResolver` 以根据这些 ID 解析模板的源。
 *
 */
export class TemplateSourceManager implements TemplateSourceResolver {
  /**
   * This map keeps track of all template sources that have been type-checked by the id that is
   * attached to a TCB's function declaration as leading trivia. This enables translation of
   * diagnostics produced for TCB code to their source location in the template.
   *
   * 此映射会跟踪所有模板源，这些模板源已由 TCB 的函数声明作为前导琐事附加的 id
   * 进行类型检查。这允许将为 TCB 代码生成的诊断转换到它们在模板中的源位置。
   *
   */
  private templateSources = new Map<TemplateId, TemplateSource>();

  getTemplateId(node: ts.ClassDeclaration): TemplateId {
    return getTemplateId(node);
  }

  captureSource(node: ts.ClassDeclaration, mapping: TemplateSourceMapping, file: ParseSourceFile):
      TemplateId {
    const id = getTemplateId(node);
    this.templateSources.set(id, new TemplateSource(mapping, file));
    return id;
  }

  getSourceMapping(id: TemplateId): TemplateSourceMapping {
    if (!this.templateSources.has(id)) {
      throw new Error(`Unexpected unknown template ID: ${id}`);
    }
    return this.templateSources.get(id)!.mapping;
  }

  toParseSourceSpan(id: TemplateId, span: AbsoluteSourceSpan): ParseSourceSpan|null {
    if (!this.templateSources.has(id)) {
      return null;
    }
    const templateSource = this.templateSources.get(id)!;
    return templateSource.toParseSourceSpan(span.start, span.end);
  }
}
