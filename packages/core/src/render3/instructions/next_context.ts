/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {nextContextImpl} from '../state';

/**
 * Retrieves a context at the level specified and saves it as the global, contextViewData.
 * Will get the next level up if level is not specified.
 *
 * 检索指定级别的上下文，并将其保存为全局 contextViewData 。如果未指定 level，将获得下一个级别。
 *
 * This is used to save contexts of parent views so they can be bound in embedded views, or
 * in conjunction with reference() to bind a ref from a parent view.
 *
 * 这用于保存父视图的上下文，以便它们可以绑定在嵌入式视图中，或与 reference() 结合以绑定来自父视图的
 * ref。
 *
 * @param level The relative level of the view from which to grab context compared to contextVewData
 *
 * 与 contextVewData 相比，要从中获取上下文的视图的相对级别
 *
 * @returns
 *
 * context
 *
 * 上下文
 *
 * @codeGenApi
 */
export function ɵɵnextContext<T = any>(level: number = 1): T {
  return nextContextImpl(level);
}
