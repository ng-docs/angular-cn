/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Options to configure the linking behavior.
 *
 * 配置链接行为的选项。
 *
 */
export interface LinkerOptions {
  /**
   * Whether to use source-mapping to compute the original source for external templates.
   * The default is `true`.
   *
   * 是否使用 source-mapping 来计算外部模板的原始源。默认值为 `true` 。
   *
   */
  sourceMapping: boolean;

  /**
   * This option tells the linker to generate information used by a downstream JIT compiler.
   *
   * 此选项告诉链接器生成供下游 JIT 编译器使用的信息。
   *
   * Specifically, in JIT mode, NgModule definitions must describe the `declarations`, `imports`,
   * `exports`, etc, which are otherwise not needed.
   *
   * 具体来说，在 JIT 模式下，NgModule 定义必须描述 `declarations`、`imports`、`exports`
   * 等，否则就不需要这些。
   *
   */
  linkerJitMode: boolean;

  /**
   * How to handle a situation where a partial declaration matches none of the supported
   * partial-linker versions.
   *
   * 如何处理部分声明与任何受支持的部分链接器版本都不匹配的情况。
   *
   * - `error` - the version mismatch is a fatal error.
   *
   *   `error` - 版本不匹配是致命错误。
   *
   * - `warn` - a warning is sent to the logger but the most recent partial-linker
   *   will attempt to process the declaration anyway.
   *
   *   `warn` - 会向记录器发送警告，但最新的部分链接器无论如何都会尝试处理声明。
   *
   * - `ignore` - the most recent partial-linker will, silently, attempt to process
   *   the declaration.
   *
   *   `ignore` - 最近的部分链接器将尝试以静默方式处理声明。
   *
   * The default is `error`.
   *
   * 默认值为 `error` 。
   *
   */
  unknownDeclarationVersionHandling: 'ignore'|'warn'|'error';
}

/**
 * The default linker options to use if properties are not provided.
 *
 * 如果未提供属性，则要使用的默认链接器选项。
 *
 */
export const DEFAULT_LINKER_OPTIONS: LinkerOptions = {
  sourceMapping: true,
  linkerJitMode: false,
  unknownDeclarationVersionHandling: 'error',
};
