/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {concatStringsWithSpace} from '../../util/stringify';
import {assertFirstCreatePass} from '../assert';
import {AttributeMarker, TAttributes, TNode} from '../interfaces/node';
import {getTView} from '../state';

/**
 * Compute the static styling (class/style) from `TAttributes`.
 *
 * 从 `TAttributes` 计算静态样式（类/样式）。
 *
 * This function should be called during `firstCreatePass` only.
 *
 * 此函数应仅在 `firstCreatePass` 期间调用。
 *
 * @param tNode The `TNode` into which the styling information should be loaded.
 *
 * 应该加载样式信息的 `TNode` 。
 *
 * @param attrs `TAttributes` containing the styling information.
 *
 * 包含样式信息的 `TAttributes` 。
 *
 * @param writeToHost Where should the resulting static styles be written?
 *
 * 生成的静态样式应该写在哪里？
 *
 * - `false` Write to `TNode.stylesWithoutHost` / `TNode.classesWithoutHost`
 *
 *   `false` 写入 `TNode.stylesWithoutHost` / `TNode.classesWithoutHost`
 *
 * - `true` Write to `TNode.styles` / `TNode.classes`
 *
 *   `true` 写入 `TNode.styles` / `TNode.classes`
 *
 */
export function computeStaticStyling(
    tNode: TNode, attrs: TAttributes|null, writeToHost: boolean): void {
  ngDevMode &&
      assertFirstCreatePass(getTView(), 'Expecting to be called in first template pass only');
  let styles: string|null = writeToHost ? tNode.styles : null;
  let classes: string|null = writeToHost ? tNode.classes : null;
  let mode: AttributeMarker|0 = 0;
  if (attrs !== null) {
    for (let i = 0; i < attrs.length; i++) {
      const value = attrs[i];
      if (typeof value === 'number') {
        mode = value;
      } else if (mode == AttributeMarker.Classes) {
        classes = concatStringsWithSpace(classes, value as string);
      } else if (mode == AttributeMarker.Styles) {
        const style = value as string;
        const styleValue = attrs[++i] as string;
        styles = concatStringsWithSpace(styles, style + ': ' + styleValue + ';');
      }
    }
  }
  writeToHost ? tNode.styles = styles : tNode.stylesWithoutHost = styles;
  writeToHost ? tNode.classes = classes : tNode.classesWithoutHost = classes;
}
