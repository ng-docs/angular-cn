/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @module
 * @description
 * Entry point for all public APIs of the language service package.
 */

import ts from 'typescript';

export interface PluginConfig {
  /**
   * If true, return only Angular results. Otherwise, return Angular + TypeScript
   * results.
   *
   * 如果为 true，则仅返回 Angular 结果。否则，返回 Angular + TypeScript 结果。
   *
   */
  angularOnly: boolean;
  /**
   * If true, enable `strictTemplates` in Angular compiler options regardless
   * of its value in tsconfig.json.
   *
   * 如果为 true，请在 Angular 编译器选项中启用 `strictTemplates` ，无论其在 tsconfig.json
   * 中的值如何。
   *
   */
  forceStrictTemplates?: true;
}

export type GetTcbResponse = {
  /**
   * The filename of the SourceFile this typecheck block belongs to.
   * The filename is entirely opaque and unstable, useful only for debugging
   * purposes.
   *
   * 此类型检查块所属的 SourceFile 的文件名。文件名是完全不透明且不稳定的，仅用于调试目的。
   *
   */
  fileName: string,
  /**
   * The content of the SourceFile this typecheck block belongs to.
   *
   * 此类型检查块所属的 SourceFile 的内容。
   *
   */
  content: string,
  /**
   * Spans over node(s) in the typecheck block corresponding to the
   * TS code generated for template node under the current cursor position.
   *
   * 跨越类型检查块中与当前光标位置下为模板节点生成的 TS 代码对应的节点。
   *
   * When the cursor position is over a source for which there is no generated
   * code, `selections` is empty.
   *
   * 当光标位置在没有生成代码的源上时，`selections` 为空。
   *
   */
  selections: ts.TextSpan[],
};

export type GetComponentLocationsForTemplateResponse = ts.DocumentSpan[];
export type GetTemplateLocationForComponentResponse = ts.DocumentSpan|undefined;

/**
 * `NgLanguageService` describes an instance of an Angular language service,
 * whose API surface is a strict superset of TypeScript's language service.
 *
 * `NgLanguageService` 描述了 Angular 语言服务的实例，其 API 图面是 TypeScript 语言服务的严格超集。
 *
 */
export interface NgLanguageService extends ts.LanguageService {
  getTcb(fileName: string, position: number): GetTcbResponse|undefined;
  getComponentLocationsForTemplate(fileName: string): GetComponentLocationsForTemplateResponse;
  getTemplateLocationForComponent(fileName: string, position: number):
      GetTemplateLocationForComponentResponse;
}

export function isNgLanguageService(ls: ts.LanguageService|
                                    NgLanguageService): ls is NgLanguageService {
  return 'getTcb' in ls;
}
