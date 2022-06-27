/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

const headerStart =
    '/****************************************************************************************************\n' +
    ' * PARTIAL FILE: ';

const headerEnd =
    '\n ****************************************************************************************************/\n';

/**
 * Render the partially compiled files into a single golden partial output string.
 *
 * 将部分编译的文件渲染为单个黄金部分输出字符串。
 *
 * @param files The partially compiled files to be rendered.
 *
 * 要呈现的部分编译的文件。
 *
 */
export function renderGoldenPartial(files: PartiallyCompiledFile[]): string {
  return files.map(file => `${headerStart + file.path + headerEnd}${file.content}`).join('\n');
}

/**
 * Parse the `partialContent` into a set of partially compiled files.
 *
 * 将 `partialContent` 解析为一组部分编译的文件。
 *
 * The `partialContent` is a single string that can contains multiple files.
 * Each file is delimited by a header comment that also contains its original path.
 *
 * `partialContent`
 * 是可以包含多个文件的单个字符串。每个文件都由一个标头注释分隔，该注释还包含其原始路径。
 *
 * @param partialContent The partial content to parse.
 *
 * 要解析的部分内容。
 *
 */
export function parseGoldenPartial(partialContent: string): PartiallyCompiledFile[] {
  const files: PartiallyCompiledFile[] = [];
  const partials = partialContent.split(headerStart);
  for (const partial of partials) {
    const [path, content] = partial.split(headerEnd);
    if (path) {
      files.push({path, content});
    }
  }
  return files;
}

/**
 * Represents the path and contents of a partially compiled file.
 *
 * 表示部分编译的文件的路径和内容。
 *
 */
export interface PartiallyCompiledFile {
  path: string;
  content: string;
}
