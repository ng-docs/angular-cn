/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {HEADER_OFFSET, LView, TView} from '../interfaces/view';
import {getContextLView} from '../state';
import {load} from '../util/view_utils';


/**
 * Store a value in the `data` at a given `index`.
 *
 * 在给定 `index` 处的 `data` 中存储一个值。
 *
 */
export function store<T>(tView: TView, lView: LView, index: number, value: T): void {
  // We don't store any static data for local variables, so the first time
  // we see the template, we should store as null to avoid a sparse array
  if (index >= tView.data.length) {
    tView.data[index] = null;
    tView.blueprint[index] = null;
  }
  lView[index] = value;
}

/**
 * Retrieves a local reference from the current contextViewData.
 *
 * 从当前的 contextViewData 中检索本地引用。
 *
 * If the reference to retrieve is in a parent view, this instruction is used in conjunction
 * with a nextContext() call, which walks up the tree and updates the contextViewData instance.
 *
 * 如果要检索的引用在父视图中，则此指令会与 nextContext() 调用结合使用，它会沿着树走并更新
 * contextViewData 实例。
 *
 * @param index The index of the local ref in contextViewData.
 *
 * contextViewData 中本地引用的索引。
 *
 * @codeGenApi
 */
export function ɵɵreference<T>(index: number) {
  const contextLView = getContextLView();
  return load<T>(contextLView, HEADER_OFFSET + index);
}
