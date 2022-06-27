/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * From where the content for a source file or source-map came.
 *
 * 源文件或 source-map 的内容来自哪里。
 *
 * - Source files can be linked to source-maps by:
 *
 *   源文件可以通过以下方式链接到 source-maps：
 *
 *   - providing the content inline via a base64 encoded data comment,
 *
 *     通过 base64 编码的数据注释内联提供内容，
 *
 *   - providing a URL to the file path in a comment,
 *
 *     在注释中提供文件路径的 URL，
 *
 *   - the loader inferring the source-map path from the source file path.
 *
 *     加载器从源文件路径推断 source-map 路径。
 *
 * - Source-maps can link to source files by:
 *
 *   Source-maps 可以通过以下方式链接到源文件：
 *
 *   - providing the content inline in the `sourcesContent` property
 *
 *     在 `sourcesContent` 属性中内联提供内容
 *
 *   - providing the path to the file in the `sources` property
 *
 *     在 `sources` 属性中提供文件的路径
 *
 */
export enum ContentOrigin {
  /**
   * The contents were provided programmatically when calling `loadSourceFile()`.
   *
   * 内容是在调用 `loadSourceFile()` 时以编程方式提供的。
   *
   */
  Provided,
  /**
   * The contents were extracted directly form the contents of the referring file.
   *
   * 内容是直接从引用文件的内容中提取的。
   *
   */
  Inline,
  /**
   * The contents were loaded from the file-system, after being explicitly referenced or inferred
   * from the referring file.
   *
   * 内容是在从引用文件显式引用或推断后从文件系统加载的。
   *
   */
  FileSystem,
}
