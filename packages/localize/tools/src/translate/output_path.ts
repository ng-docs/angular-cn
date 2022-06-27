/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, PathManipulation} from '@angular/compiler-cli/private/localize';

/**
 * A function that will return an absolute path to where a file is to be written, given a locale and
 * a relative path.
 *
 * 在给定区域设置和相对路径的情况下，将返回要写入文件的位置的绝对路径的函数。
 *
 */
export interface OutputPathFn {
  (locale: string, relativePath: string): string;
}

/**
 * Create a function that will compute the absolute path to where a translated file should be
 * written.
 *
 * 创建一个函数，该函数将计算应写入已翻译文件的绝对路径。
 *
 * The special `{{LOCALE}}` marker will be replaced with the locale code of the current translation.
 *
 * 特殊的 `{{LOCALE}}` 标记将被替换为当前翻译的区域设置代码。
 *
 * @param outputFolder An absolute path to the folder containing this set of translations.
 *
 * 包含这组翻译的文件夹的绝对路径。
 *
 */
export function getOutputPathFn(fs: PathManipulation, outputFolder: AbsoluteFsPath): OutputPathFn {
  const [pre, post] = outputFolder.split('{{LOCALE}}');
  return post === undefined ? (_locale, relativePath) => fs.join(pre, relativePath) :
                              (locale, relativePath) => fs.join(pre + locale + post, relativePath);
}
