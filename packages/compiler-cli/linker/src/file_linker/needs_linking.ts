/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {declarationFunctions} from './partial_linkers/partial_linker_selector';

/**
 * Determines if the provided source file may need to be processed by the linker, i.e. whether it
 * potentially contains any declarations. If true is returned, then the source file should be
 * processed by the linker as it may contain declarations that need to be fully compiled. If false
 * is returned, parsing and processing of the source file can safely be skipped to improve
 * performance.
 *
 * 确定所提供的源文件是否需要由链接器处理，即它是否可能包含任何声明。如果返回
 * true，则源文件应该由链接器处理，因为它可能包含需要完全编译的声明。如果返回 false
 * ，则可以安全地跳过源文件的解析和处理以提高性能。
 *
 * This function may return true even for source files that don't actually contain any declarations
 * that need to be compiled.
 *
 * 即使对于实际上不包含任何需要编译的声明的源文件，此函数也可能返回 true。
 *
 * @param path the absolute path of the source file for which to determine whether linking may be
 * needed.
 *
 * 确定是否需要链接的源文件的绝对路径。
 *
 * @param source the source file content as a string.
 *
 * 以字符串形式的源文件内容。
 *
 * @returns
 *
 * whether the source file may contain declarations that need to be linked.
 *
 * 源文件是否可以包含需要链接的声明。
 *
 */
export function needsLinking(path: string, source: string): boolean {
  return declarationFunctions.some(fn => source.includes(fn));
}
