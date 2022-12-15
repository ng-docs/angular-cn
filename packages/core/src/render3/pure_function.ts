/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertIndexInRange} from '../util/assert';

import {bindingUpdated, bindingUpdated2, bindingUpdated3, bindingUpdated4, getBinding, updateBinding} from './bindings';
import {LView} from './interfaces/view';
import {getBindingRoot, getLView} from './state';
import {NO_CHANGE} from './tokens';


/**
 * Bindings for pure functions are stored after regular bindings.
 *
 * 纯函数的绑定是在常规绑定之后存储的。
 *
 * ## |-------decls------|---------vars---------|                 |----- hostVars (dir1) ------|
 *
 * ## |-------decls------|---------vars----------| |----- hostVars (dir1) ------|
 *
 * ## | nodes/refs/pipes | bindings | fn slots  | injector | dir1 | host bindings | host slots |
 *
 * ## |节点/引用/管道|绑定| fn 插槽|喷油器|目录 1 |宿主绑定|宿主插槽|
 *
 * ```
 *                ^                      ^
 *  TView.bindingStartIndex      TView.expandoStartIndex
 * ```
 *
 * Pure function instructions are given an offset from the binding root. Adding the offset to the
 * binding root gives the first index where the bindings are stored. In component views, the binding
 * root is the bindingStartIndex. In host bindings, the binding root is the expandoStartIndex +
 * any directive instances + any hostVars in directives evaluated before it.
 *
 * 纯函数指令会被赋予从绑定根的偏移量。将偏移量添加到绑定根会给出存储绑定的第一个索引。在组件视图中，绑定根是
 * bindStartIndex 。在宿主绑定中，绑定根是 expandoStartIndex + 任何指令实例 +
 * 在它之前估算的指令中的任何 hostVars 。
 *
 * See VIEW_DATA.md for more information about host binding resolution.
 *
 * 有关宿主绑定解析的更多信息，请参阅 VIEW_DATA.md 。
 *
 */

/**
 * If the value hasn't been saved, calls the pure function to store and return the
 * value. If it has been saved, returns the saved value.
 *
 * 如果值尚未保存，则调用纯函数来存储并返回值。如果已保存，则返回保存的值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn Function that returns a value
 *
 * 返回值的函数
 *
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * value
 *
 * 值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction0<T>(slotOffset: number, pureFn: () => T, thisArg?: any): T {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  return lView[bindingIndex] === NO_CHANGE ?
      updateBinding(lView, bindingIndex, thisArg ? pureFn.call(thisArg) : pureFn()) :
      getBinding(lView, bindingIndex);
}

/**
 * If the value of the provided exp has changed, calls the pure function to return
 * an updated value. Or if the value has not changed, returns cached value.
 *
 * 如果提供的 exp 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果值没有更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn Function that returns an updated value
 *
 * 返回更新值的函数
 *
 * @param exp Updated expression value
 *
 * 更新的表达式值
 *
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction1(
    slotOffset: number, pureFn: (v: any) => any, exp: any, thisArg?: any): any {
  return pureFunction1Internal(getLView(), getBindingRoot(), slotOffset, pureFn, exp, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction2(
    slotOffset: number, pureFn: (v1: any, v2: any) => any, exp1: any, exp2: any,
    thisArg?: any): any {
  return pureFunction2Internal(
      getLView(), getBindingRoot(), slotOffset, pureFn, exp1, exp2, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction3(
    slotOffset: number, pureFn: (v1: any, v2: any, v3: any) => any, exp1: any, exp2: any, exp3: any,
    thisArg?: any): any {
  return pureFunction3Internal(
      getLView(), getBindingRoot(), slotOffset, pureFn, exp1, exp2, exp3, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction4(
    slotOffset: number, pureFn: (v1: any, v2: any, v3: any, v4: any) => any, exp1: any, exp2: any,
    exp3: any, exp4: any, thisArg?: any): any {
  return pureFunction4Internal(
      getLView(), getBindingRoot(), slotOffset, pureFn, exp1, exp2, exp3, exp4, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction5(
    slotOffset: number, pureFn: (v1: any, v2: any, v3: any, v4: any, v5: any) => any, exp1: any,
    exp2: any, exp3: any, exp4: any, exp5: any, thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  const different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated(lView, bindingIndex + 4, exp5) || different ?
      updateBinding(
          lView, bindingIndex + 5,
          thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5) :
                    pureFn(exp1, exp2, exp3, exp4, exp5)) :
      getBinding(lView, bindingIndex + 5);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction6(
    slotOffset: number, pureFn: (v1: any, v2: any, v3: any, v4: any, v5: any, v6: any) => any,
    exp1: any, exp2: any, exp3: any, exp4: any, exp5: any, exp6: any, thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  const different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated2(lView, bindingIndex + 4, exp5, exp6) || different ?
      updateBinding(
          lView, bindingIndex + 6,
          thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6) :
                    pureFn(exp1, exp2, exp3, exp4, exp5, exp6)) :
      getBinding(lView, bindingIndex + 6);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param exp7
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction7(
    slotOffset: number,
    pureFn: (v1: any, v2: any, v3: any, v4: any, v5: any, v6: any, v7: any) => any, exp1: any,
    exp2: any, exp3: any, exp4: any, exp5: any, exp6: any, exp7: any, thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  let different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated3(lView, bindingIndex + 4, exp5, exp6, exp7) || different ?
      updateBinding(
          lView, bindingIndex + 7,
          thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7) :
                    pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7)) :
      getBinding(lView, bindingIndex + 7);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param exp7
 * @param exp8
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunction8(
    slotOffset: number,
    pureFn: (v1: any, v2: any, v3: any, v4: any, v5: any, v6: any, v7: any, v8: any) => any,
    exp1: any, exp2: any, exp3: any, exp4: any, exp5: any, exp6: any, exp7: any, exp8: any,
    thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  const different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  return bindingUpdated4(lView, bindingIndex + 4, exp5, exp6, exp7, exp8) || different ?
      updateBinding(
          lView, bindingIndex + 8,
          thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8) :
                    pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8)) :
      getBinding(lView, bindingIndex + 8);
}

/**
 * pureFunction instruction that can support any number of bindings.
 *
 * 可以支持任意数量的绑定的 pureFunction 指令。
 *
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn A pure function that takes binding values and builds an object or array
 * containing those values.
 *
 * 一个纯函数，它接受绑定值并构建包含这些值的对象或数组。
 *
 * @param exps An array of binding values
 *
 * 绑定值的数组
 *
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 * @codeGenApi
 */
export function ɵɵpureFunctionV(
    slotOffset: number, pureFn: (...v: any[]) => any, exps: any[], thisArg?: any): any {
  return pureFunctionVInternal(getLView(), getBindingRoot(), slotOffset, pureFn, exps, thisArg);
}

/**
 * Results of a pure function invocation are stored in LView in a dedicated slot that is initialized
 * to NO_CHANGE. In rare situations a pure pipe might throw an exception on the very first
 * invocation and not produce any valid results. In this case LView would keep holding the NO_CHANGE
 * value. The NO_CHANGE is not something that we can use in expressions / bindings thus we convert
 * it to `undefined`.
 *
 * 纯函数调用的结果存储在 LView 中初始化为 NO_CHANGE
 * 的专用槽中。在极少数情况下，纯管道可能会在第一次调用时抛出异常并且不会产生任何有效结果。在这种情况下，LView
 * 将继续保留 NO_CHANGE 值。 NO_CHANGE 不是我们可以在表达式/绑定中使用的东西，因此我们将其转换为
 * `undefined` 。
 *
 */
function getPureFunctionReturnValue(lView: LView, returnValueIndex: number) {
  ngDevMode && assertIndexInRange(lView, returnValueIndex);
  const lastReturnValue = lView[returnValueIndex];
  return lastReturnValue === NO_CHANGE ? undefined : lastReturnValue;
}

/**
 * If the value of the provided exp has changed, calls the pure function to return
 * an updated value. Or if the value has not changed, returns cached value.
 *
 * 如果提供的 exp 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果值没有更改，则返回缓存值。
 *
 * @param lView LView in which the function is being executed.
 *
 * 正在其中执行函数的 LView。
 *
 * @param bindingRoot Binding root index.
 *
 * 绑定根索引。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn Function that returns an updated value
 *
 * 返回更新值的函数
 *
 * @param exp Updated expression value
 *
 * 更新的表达式值
 *
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 */
export function pureFunction1Internal(
    lView: LView, bindingRoot: number, slotOffset: number, pureFn: (v: any) => any, exp: any,
    thisArg?: any): any {
  const bindingIndex = bindingRoot + slotOffset;
  return bindingUpdated(lView, bindingIndex, exp) ?
      updateBinding(lView, bindingIndex + 1, thisArg ? pureFn.call(thisArg, exp) : pureFn(exp)) :
      getPureFunctionReturnValue(lView, bindingIndex + 1);
}


/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param lView LView in which the function is being executed.
 *
 * 正在其中执行函数的 LView。
 *
 * @param bindingRoot Binding root index.
 *
 * 绑定根索引。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 */
export function pureFunction2Internal(
    lView: LView, bindingRoot: number, slotOffset: number, pureFn: (v1: any, v2: any) => any,
    exp1: any, exp2: any, thisArg?: any): any {
  const bindingIndex = bindingRoot + slotOffset;
  return bindingUpdated2(lView, bindingIndex, exp1, exp2) ?
      updateBinding(
          lView, bindingIndex + 2,
          thisArg ? pureFn.call(thisArg, exp1, exp2) : pureFn(exp1, exp2)) :
      getPureFunctionReturnValue(lView, bindingIndex + 2);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param lView LView in which the function is being executed.
 *
 * 正在其中执行函数的 LView。
 *
 * @param bindingRoot Binding root index.
 *
 * 绑定根索引。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 */
export function pureFunction3Internal(
    lView: LView, bindingRoot: number, slotOffset: number,
    pureFn: (v1: any, v2: any, v3: any) => any, exp1: any, exp2: any, exp3: any,
    thisArg?: any): any {
  const bindingIndex = bindingRoot + slotOffset;
  return bindingUpdated3(lView, bindingIndex, exp1, exp2, exp3) ?
      updateBinding(
          lView, bindingIndex + 3,
          thisArg ? pureFn.call(thisArg, exp1, exp2, exp3) : pureFn(exp1, exp2, exp3)) :
      getPureFunctionReturnValue(lView, bindingIndex + 3);
}


/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param lView LView in which the function is being executed.
 *
 * 正在其中执行函数的 LView。
 *
 * @param bindingRoot Binding root index.
 *
 * 绑定根索引。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 */
export function pureFunction4Internal(
    lView: LView, bindingRoot: number, slotOffset: number,
    pureFn: (v1: any, v2: any, v3: any, v4: any) => any, exp1: any, exp2: any, exp3: any, exp4: any,
    thisArg?: any): any {
  const bindingIndex = bindingRoot + slotOffset;
  return bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4) ?
      updateBinding(
          lView, bindingIndex + 4,
          thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4) : pureFn(exp1, exp2, exp3, exp4)) :
      getPureFunctionReturnValue(lView, bindingIndex + 4);
}

/**
 * pureFunction instruction that can support any number of bindings.
 *
 * 可以支持任意数量的绑定的 pureFunction 指令。
 *
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * 如果提供的任何 exp
 * 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。
 *
 * @param lView LView in which the function is being executed.
 *
 * 正在其中执行函数的 LView。
 *
 * @param bindingRoot Binding root index.
 *
 * 绑定根索引。
 *
 * @param slotOffset the offset from binding root to the reserved slot
 *
 * 从绑定根到保留槽的偏移量
 *
 * @param pureFn A pure function that takes binding values and builds an object or array
 * containing those values.
 *
 * 一个纯函数，它接受绑定值并构建包含这些值的对象或数组。
 *
 * @param exps An array of binding values
 *
 * 绑定值的数组
 *
 * @param thisArg Optional calling context of pureFn
 *
 * pureFn 的可选调用上下文
 *
 * @returns
 *
 * Updated or cached value
 *
 * 更新或缓存的值
 *
 */
export function pureFunctionVInternal(
    lView: LView, bindingRoot: number, slotOffset: number, pureFn: (...v: any[]) => any,
    exps: any[], thisArg?: any): any {
  let bindingIndex = bindingRoot + slotOffset;
  let different = false;
  for (let i = 0; i < exps.length; i++) {
    bindingUpdated(lView, bindingIndex++, exps[i]) && (different = true);
  }
  return different ? updateBinding(lView, bindingIndex, pureFn.apply(thisArg, exps)) :
                     getPureFunctionReturnValue(lView, bindingIndex);
}
