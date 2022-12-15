/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {KeyValueArray, keyValueArrayIndexOf} from '../../util/array_utils';
import {assertEqual, assertIndexInRange, assertNotEqual} from '../../util/assert';
import {assertFirstUpdatePass} from '../assert';
import {TNode} from '../interfaces/node';
import {getTStylingRangeNext, getTStylingRangePrev, setTStylingRangeNext, setTStylingRangeNextDuplicate, setTStylingRangePrev, setTStylingRangePrevDuplicate, toTStylingRange, TStylingKey, TStylingKeyPrimitive, TStylingRange} from '../interfaces/styling';
import {TData} from '../interfaces/view';
import {getTView} from '../state';


/**
 * NOTE: The word `styling` is used interchangeably as style or class styling.
 *
 * 注意： `styling` 一词可与样式或类样式互换使用。
 *
 * This file contains code to link styling instructions together so that they can be replayed in
 * priority order. The file exists because Ivy styling instruction execution order does not match
 * that of the priority order. The purpose of this code is to create a linked list so that the
 * instructions can be traversed in priority order when computing the styles.
 *
 * 此文件包含将样式说明链接在一起的代码，以便可以按优先级顺序重放它们。该文件存在，因为 Ivy
 * 样式化指令的执行顺序与优先级顺序不匹配。此代码的目的是创建一个链表，以便在计算样式时可以按优先级顺序遍历这些指令。
 *
 * Assume we are dealing with the following code:
 *
 * 假设我们正在处理以下代码：
 *
 * ```
 *
 * @Component({
 *   template: `
 *     <my-cmp [style]=" {color: '#001'} "
 *             [style.color]=" #002 "
 *             dir-style-color-1
 *             dir-style-color-2> `
 * })
 * class ExampleComponent {
 *   static ngComp = ... {
 *     ...
 *     // Compiler ensures that `ɵɵstyleProp` is after `ɵɵstyleMap`
 *     ɵɵstyleMap({color: '#001'});
 *     ɵɵstyleProp('color', '#002');
 *     ...
 *   }
 * }
 * @Directive({
 *   selector: `[dir-style-color-1]',
 * })
 * class Style1Directive {
 * @HostBinding ('style') style = {color: '#005'};
 * @HostBinding ('style.color') color = '#006';
 *
 *   static ngDir = ... {
 *     ...
 *     // Compiler ensures that `ɵɵstyleProp` is after `ɵɵstyleMap`
 *     ɵɵstyleMap({color: '#005'});
 *     ɵɵstyleProp('color', '#006');
 *     ...
 *   }
 * }
 * @Directive({
 *   selector: `[dir-style-color-2]',
 * })
 * class Style2Directive {
 * @HostBinding ('style') style = {color: '#007'};
 * @HostBinding ('style.color') color = '#008';
 *
 *   static ngDir = ... {
 *     ...
 *     // Compiler ensures that `ɵɵstyleProp` is after `ɵɵstyleMap`
 *     ɵɵstyleMap({color: '#007'});
 *     ɵɵstyleProp('color', '#008');
 *     ...
 *   }
 * }
 * @Directive({
 *   selector: `my-cmp',
 * })
 * class MyComponent {
 * @HostBinding ('style') style = {color: '#003'};
 * @HostBinding ('style.color') color = '#004';
 *
 *   static ngComp = ... {
 *     ...
 *     // Compiler ensures that `ɵɵstyleProp` is after `ɵɵstyleMap`
 *     ɵɵstyleMap({color: '#003'});
 *     ɵɵstyleProp('color', '#004');
 *     ...
 *   }
 * }
 * ```
 *
 * The Order of instruction execution is:
 *
 * NOTE: the comment binding location is for illustrative purposes only.
 *
 * ```
 * // Template: (ExampleComponent)
 *     ɵɵstyleMap({color: '#001'});   // Binding index: 10
 *     ɵɵstyleProp('color', '#002');  // Binding index: 12
 * // MyComponent
 *     ɵɵstyleMap({color: '#003'});   // Binding index: 20
 *     ɵɵstyleProp('color', '#004');  // Binding index: 22
 * // Style1Directive
 *     ɵɵstyleMap({color: '#005'});   // Binding index: 24
 *     ɵɵstyleProp('color', '#006');  // Binding index: 26
 * // Style2Directive
 *     ɵɵstyleMap({color: '#007'});   // Binding index: 28
 *     ɵɵstyleProp('color', '#008');  // Binding index: 30
 * ```
 *
 * The correct priority order of concatenation is:
 *
 * ```
 * // MyComponent
 *     ɵɵstyleMap({color: '#003'});   // Binding index: 20
 *     ɵɵstyleProp('color', '#004');  // Binding index: 22
 * // Style1Directive
 *     ɵɵstyleMap({color: '#005'});   // Binding index: 24
 *     ɵɵstyleProp('color', '#006');  // Binding index: 26
 * // Style2Directive
 *     ɵɵstyleMap({color: '#007'});   // Binding index: 28
 *     ɵɵstyleProp('color', '#008');  // Binding index: 30
 * // Template: (ExampleComponent)
 *     ɵɵstyleMap({color: '#001'});   // Binding index: 10
 *     ɵɵstyleProp('color', '#002');  // Binding index: 12
 * ```
 *
 * What color should be rendered?
 *
 * Once the items are correctly sorted in the list, the answer is simply the last item in the
 * concatenation list which is `#002`.
 *
 * To do so we keep a linked list of all of the bindings which pertain to this element.
 * Notice that the bindings are inserted in the order of execution, but the `TView.data` allows
 * us to traverse them in the order of priority.
 *
 * |Idx|`TView.data`|`LView`          | Notes
 * |---|------------|-----------------|--------------
 * |...|            |                 |
 * |10 |`null`      |`{color: '#001'}`| `ɵɵstyleMap('color', {color: '#001'})`
 * |11 |`30 | 12`   | ...             |
 * |12 |`color`     |`'#002'`         | `ɵɵstyleProp('color', '#002')`
 * |13 |`10 | 0`    | ...             |
 * |...|            |                 |
 * |20 |`null`      |`{color: '#003'}`| `ɵɵstyleMap('color', {color: '#003'})`
 * |21 |`0 | 22`    | ...             |
 * |22 |`color`     |`'#004'`         | `ɵɵstyleProp('color', '#004')`
 * |23 |`20 | 24`   | ...             |
 * |24 |`null`      |`{color: '#005'}`| `ɵɵstyleMap('color', {color: '#005'})`
 * |25 |`22 | 26`   | ...             |
 * |26 |`color`     |`'#006'`         | `ɵɵstyleProp('color', '#006')`
 * |27 |`24 | 28`   | ...             |
 * |28 |`null`      |`{color: '#007'}`| `ɵɵstyleMap('color', {color: '#007'})`
 * |29 |`26 | 30`   | ...             |
 * |30 |`color`     |`'#008'`         | `ɵɵstyleProp('color', '#008')`
 * |31 |`28 | 10`   | ...             |
 *
 * The above data structure allows us to re-concatenate the styling no matter which data binding
 * changes.
 *
 * NOTE: in addition to keeping track of next/previous index the `TView.data` also stores prev/next
 * duplicate bit. The duplicate bit if true says there either is a binding with the same name or
 * there is a map (which may contain the name). This information is useful in knowing if other
 * styles with higher priority need to be searched for overwrites.
 *
 * NOTE: See `should support example in 'tnode_linked_list.ts' documentation` in
 * `tnode_linked_list_spec.ts` for working example.
 */
let __unused_const_as_closure_does_not_like_standalone_comment_blocks__: undefined;

/**
 * Insert new `tStyleValue` at `TData` and link existing style bindings such that we maintain linked
 * list of styles and compute the duplicate flag.
 *
 * 在 `tStyleValue` 处插入新的 `TData` 并链接现有的样式绑定，以便我们维护样式的链表并计算重复标志。
 *
 * Note: this function is executed during `firstUpdatePass` only to populate the `TView.data`.
 *
 * 注意：此函数在 `firstUpdatePass` 期间执行，仅用于填充 `TView.data` 。
 *
 * The function works by keeping track of `tStylingRange` which contains two pointers pointing to
 * the head/tail of the template portion of the styles.
 *
 * 该函数通过跟踪 `tStylingRange` 来工作，它包含两个指向样式模板部分的头/尾的指针。
 *
 * - if `isHost === false` (we are template) then insertion is at tail of `TStylingRange`
 *
 *   如果 `isHost === false`（我们是模板），则插入在 `TStylingRange` 的尾部
 *
 * - if `isHost === true` (we are host binding) then insertion is at head of `TStylingRange`
 *
 *   如果 `isHost === true`（我们是宿主绑定），则插入在 `TStylingRange` 的头部
 *
 * @param tData The `TData` to insert into.
 *
 * 要插入的 `TData` 。
 *
 * @param tNode `TNode` associated with the styling element.
 *
 * 与样式元素关联的 `TNode` 。
 *
 * @param tStylingKey See `TStylingKey`.
 *
 * 请参阅 `TStylingKey` 。
 *
 * @param index location of where `tStyleValue` should be stored (and linked into list.)
 *
 * 应该存储 `tStyleValue` 的位置（并链接到列表中。）
 *
 * @param isHostBinding `true` if the insertion is for a `hostBinding`. (insertion is in front of
 *               template.)
 *
 * `true` 插入是针对 `hostBinding` 的，则为 true 。（插入在模板前面。）
 *
 * @param isClassBinding True if the associated `tStylingKey` as a `class` styling.
 *                       `tNode.classBindings` should be used (or `tNode.styleBindings` otherwise.)
 *
 * 如果关联的 `tStylingKey` 作为 `class` 样式，则为真。应使用 `tNode.classBindings`（或否则使用
 * `tNode.styleBindings` 。）
 *
 */
export function insertTStylingBinding(
    tData: TData, tNode: TNode, tStylingKeyWithStatic: TStylingKey, index: number,
    isHostBinding: boolean, isClassBinding: boolean): void {
  ngDevMode && assertFirstUpdatePass(getTView());
  let tBindings = isClassBinding ? tNode.classBindings : tNode.styleBindings;
  let tmplHead = getTStylingRangePrev(tBindings);
  let tmplTail = getTStylingRangeNext(tBindings);

  tData[index] = tStylingKeyWithStatic;
  let isKeyDuplicateOfStatic = false;
  let tStylingKey: TStylingKeyPrimitive;
  if (Array.isArray(tStylingKeyWithStatic)) {
    // We are case when the `TStylingKey` contains static fields as well.
    const staticKeyValueArray = tStylingKeyWithStatic as KeyValueArray<any>;
    tStylingKey = staticKeyValueArray[1];  // unwrap.
    // We need to check if our key is present in the static so that we can mark it as duplicate.
    if (tStylingKey === null ||
        keyValueArrayIndexOf(staticKeyValueArray, tStylingKey as string) > 0) {
      // tStylingKey is present in the statics, need to mark it as duplicate.
      isKeyDuplicateOfStatic = true;
    }
  } else {
    tStylingKey = tStylingKeyWithStatic;
  }
  if (isHostBinding) {
    // We are inserting host bindings

    // If we don't have template bindings then `tail` is 0.
    const hasTemplateBindings = tmplTail !== 0;
    // This is important to know because that means that the `head` can't point to the first
    // template bindings (there are none.) Instead the head points to the tail of the template.
    if (hasTemplateBindings) {
      // template head's "prev" will point to last host binding or to 0 if no host bindings yet
      const previousNode = getTStylingRangePrev(tData[tmplHead + 1] as TStylingRange);
      tData[index + 1] = toTStylingRange(previousNode, tmplHead);
      // if a host binding has already been registered, we need to update the next of that host
      // binding to point to this one
      if (previousNode !== 0) {
        // We need to update the template-tail value to point to us.
        tData[previousNode + 1] =
            setTStylingRangeNext(tData[previousNode + 1] as TStylingRange, index);
      }
      // The "previous" of the template binding head should point to this host binding
      tData[tmplHead + 1] = setTStylingRangePrev(tData[tmplHead + 1] as TStylingRange, index);
    } else {
      tData[index + 1] = toTStylingRange(tmplHead, 0);
      // if a host binding has already been registered, we need to update the next of that host
      // binding to point to this one
      if (tmplHead !== 0) {
        // We need to update the template-tail value to point to us.
        tData[tmplHead + 1] = setTStylingRangeNext(tData[tmplHead + 1] as TStylingRange, index);
      }
      // if we don't have template, the head points to template-tail, and needs to be advanced.
      tmplHead = index;
    }
  } else {
    // We are inserting in template section.
    // We need to set this binding's "previous" to the current template tail
    tData[index + 1] = toTStylingRange(tmplTail, 0);
    ngDevMode &&
        assertEqual(
            tmplHead !== 0 && tmplTail === 0, false,
            'Adding template bindings after hostBindings is not allowed.');
    if (tmplHead === 0) {
      tmplHead = index;
    } else {
      // We need to update the previous value "next" to point to this binding
      tData[tmplTail + 1] = setTStylingRangeNext(tData[tmplTail + 1] as TStylingRange, index);
    }
    tmplTail = index;
  }

  // Now we need to update / compute the duplicates.
  // Starting with our location search towards head (least priority)
  if (isKeyDuplicateOfStatic) {
    tData[index + 1] = setTStylingRangePrevDuplicate(tData[index + 1] as TStylingRange);
  }
  markDuplicates(tData, tStylingKey, index, true, isClassBinding);
  markDuplicates(tData, tStylingKey, index, false, isClassBinding);
  markDuplicateOfResidualStyling(tNode, tStylingKey, tData, index, isClassBinding);

  tBindings = toTStylingRange(tmplHead, tmplTail);
  if (isClassBinding) {
    tNode.classBindings = tBindings;
  } else {
    tNode.styleBindings = tBindings;
  }
}

/**
 * Look into the residual styling to see if the current `tStylingKey` is duplicate of residual.
 *
 * 查看残差样式以查看当前的 `tStylingKey` 是否是 persistence 的副本。
 *
 * @param tNode `TNode` where the residual is stored.
 *
 * 存储残差的 `TNode` 。
 *
 * @param tStylingKey `TStylingKey` to store.
 *
 * 要存储的 `TStylingKey` 。
 *
 * @param tData `TData` associated with the current `LView`.
 *
 * 与当前 `TData` 关联的 `LView` 。
 *
 * @param index location of where `tStyleValue` should be stored (and linked into list.)
 *
 * 应该存储 `tStyleValue` 的位置（并链接到列表中。）
 *
 * @param isClassBinding True if the associated `tStylingKey` as a `class` styling.
 *                       `tNode.classBindings` should be used (or `tNode.styleBindings` otherwise.)
 *
 * 如果关联的 `tStylingKey` 作为 `class` 样式，则为真。应使用 `tNode.classBindings`（或否则使用
 * `tNode.styleBindings` 。）
 *
 */
function markDuplicateOfResidualStyling(
    tNode: TNode, tStylingKey: TStylingKey, tData: TData, index: number, isClassBinding: boolean) {
  const residual = isClassBinding ? tNode.residualClasses : tNode.residualStyles;
  if (residual != null /* or undefined */ && typeof tStylingKey == 'string' &&
      keyValueArrayIndexOf(residual, tStylingKey) >= 0) {
    // We have duplicate in the residual so mark ourselves as duplicate.
    tData[index + 1] = setTStylingRangeNextDuplicate(tData[index + 1] as TStylingRange);
  }
}


/**
 * Marks `TStyleValue`s as duplicates if another style binding in the list has the same
 * `TStyleValue`.
 *
 * 如果列表中的另一个样式绑定具有相同的 `TStyleValue` ，则将 `TStyleValue` 标记为重复。
 *
 * NOTE: this function is intended to be called twice once with `isPrevDir` set to `true` and once
 * with it set to `false` to search both the previous as well as next items in the list.
 *
 * 注意：此函数旨在在 `isPrevDir` 设置为 `true` 的情况下调用两次，在设置为 `false`
 * 的情况下调用一次，以搜索列表中的上一个和下一个条目。
 *
 * No duplicate case
 *
 * 没有重复的案例
 *
 * ```
 *   [style.color]
 *   [style.width.px] <<- index
 *   [style.height.px]
 * ```
 *
 * In the above case adding `[style.width.px]` to the existing `[style.color]` produces no
 * duplicates because `width` is not found in any other part of the linked list.
 *
 * 在上述情况下，将 `[style.width.px]` 添加到现有的 `[style.color]`
 * 不会产生重复项，因为在链表的任何其他部分都找不到 `width` 。
 *
 * Duplicate case
 *
 * 重复案例
 *
 * ```
 *   [style.color]
 *   [style.width.em]
 *   [style.width.px] <<- index
 * ```
 *
 * In the above case adding `[style.width.px]` will produce a duplicate with `[style.width.em]`
 * because `width` is found in the chain.
 *
 * 在上述情况下，添加 `[style.width.px]` 将生成带有 `[style.width.em]` 的副本，因为 `width`
 * 是在链中找到的。
 *
 * Map case 1
 *
 * 地图案例 1
 *
 * ```
 *   [style.width.px]
 *   [style.color]
 *   [style]  <<- index
 * ```
 *
 * In the above case adding `[style]` will produce a duplicate with any other bindings because
 * `[style]` is a Map and as such is fully dynamic and could produce `color` or `width`.
 *
 * 在上述情况下，添加 `[style]` 将生成与任何其他绑定的副本，因为 `[style]` 是 Map
 * ，因此是完全动态的，可以生成 `color` 或 `width` 。
 *
 * Map case 2
 *
 * 地图案例 2
 *
 * ```
 *   [style]
 *   [style.width.px]
 *   [style.color]  <<- index
 * ```
 *
 * In the above case adding `[style.color]` will produce a duplicate because there is already a
 * `[style]` binding which is a Map and as such is fully dynamic and could produce `color` or
 * `width`.
 *
 * 在上述情况下，添加 `[style.color]` 将产生重复，因为已经有了一个 `[style]` 绑定，它是 Map
 * ，因此是完全动态的，可以生成 `color` 或 `width` 。
 *
 * NOTE: Once `[style]` (Map) is added into the system all things are mapped as duplicates.
 * NOTE: We use `style` as example, but same logic is applied to `class`es as well.
 *
 * 注意：一旦 `[style]`（Map）添加到系统中，所有东西都被映射为副本。注意：我们使用 `style`
 * 作为示例，但相同的逻辑也适用于 `class` es。
 *
 * @param tData `TData` where the linked list is stored.
 *
 * 存储链表的 `TData` 。
 *
 * @param tStylingKey `TStylingKeyPrimitive` which contains the value to compare to other keys in
 *        the linked list.
 *
 * `TStylingKeyPrimitive` ，其中包含要与链表中其他键进行比较的值。
 *
 * @param index Starting location in the linked list to search from
 *
 * 链表中要搜索的起始位置
 *
 * @param isPrevDir Direction.
 *        \- `true` for previous (lower priority);
 *        \- `false` for next (higher priority).
 *
 * 方向。 - 上一个为 `true`（优先级较低）； - 下一个为 `false`（更高优先级）。
 *
 */
function markDuplicates(
    tData: TData, tStylingKey: TStylingKeyPrimitive, index: number, isPrevDir: boolean,
    isClassBinding: boolean) {
  const tStylingAtIndex = tData[index + 1] as TStylingRange;
  const isMap = tStylingKey === null;
  let cursor =
      isPrevDir ? getTStylingRangePrev(tStylingAtIndex) : getTStylingRangeNext(tStylingAtIndex);
  let foundDuplicate = false;
  // We keep iterating as long as we have a cursor
  // AND either:
  // - we found what we are looking for, OR
  // - we are a map in which case we have to continue searching even after we find what we were
  //   looking for since we are a wild card and everything needs to be flipped to duplicate.
  while (cursor !== 0 && (foundDuplicate === false || isMap)) {
    ngDevMode && assertIndexInRange(tData, cursor);
    const tStylingValueAtCursor = tData[cursor] as TStylingKey;
    const tStyleRangeAtCursor = tData[cursor + 1] as TStylingRange;
    if (isStylingMatch(tStylingValueAtCursor, tStylingKey)) {
      foundDuplicate = true;
      tData[cursor + 1] = isPrevDir ? setTStylingRangeNextDuplicate(tStyleRangeAtCursor) :
                                      setTStylingRangePrevDuplicate(tStyleRangeAtCursor);
    }
    cursor = isPrevDir ? getTStylingRangePrev(tStyleRangeAtCursor) :
                         getTStylingRangeNext(tStyleRangeAtCursor);
  }
  if (foundDuplicate) {
    // if we found a duplicate, than mark ourselves.
    tData[index + 1] = isPrevDir ? setTStylingRangePrevDuplicate(tStylingAtIndex) :
                                   setTStylingRangeNextDuplicate(tStylingAtIndex);
  }
}

/**
 * Determines if two `TStylingKey`s are a match.
 *
 * 确定两个 `TStylingKey` 是否匹配。
 *
 * When computing whether a binding contains a duplicate, we need to compare if the instruction
 * `TStylingKey` has a match.
 *
 * 在计算绑定是否包含重复项时，我们需要比较 `TStylingKey` 指令是否有匹配项。
 *
 * Here are examples of `TStylingKey`s which match given `tStylingKeyCursor` is:
 *
 * 以下是与给定 `tStylingKeyCursor` 匹配的 `TStylingKey` 的示例：
 *
 * - `color`
 *
 *   - `color`    // Match another color
 *
 *     `color` // 匹配另一种颜色
 *
 *   - `null`     // That means that `tStylingKey` is a `classMap`/`styleMap` instruction
 *
 *     `null` // 这意味着 `tStylingKey` 是 `classMap` / `styleMap` 指令
 *
 *   - `['', 'color', 'other', true]` // wrapped `color` so match
 *
 *     `['', 'color', 'other', true]` // 包装的 `color` 以便匹配
 *
 *   - `['', null, 'other', true]`       // wrapped `null` so match
 *
 *     `['', null, 'other', true]` // 包装 `null` 以进行匹配
 *
 *   - `['', 'width', 'color', 'value']` // wrapped static value contains a match on `'color'`
 *
 *     `['', 'width', 'color', 'value']` // 包装的静态值包含 `'color'` 上的匹配项
 *
 * - `null`       // `tStylingKeyCursor` always match as it is `classMap`/`styleMap` instruction
 *
 *   `null` // `tStylingKeyCursor` 始终匹配，因为它是 `classMap` / `styleMap` 指令
 *
 * @param tStylingKeyCursor
 * @param tStylingKey
 */
function isStylingMatch(tStylingKeyCursor: TStylingKey, tStylingKey: TStylingKeyPrimitive) {
  ngDevMode &&
      assertNotEqual(
          Array.isArray(tStylingKey), true, 'Expected that \'tStylingKey\' has been unwrapped');
  if (
      tStylingKeyCursor === null ||  // If the cursor is `null` it means that we have map at that
                                     // location so we must assume that we have a match.
      tStylingKey == null ||  // If `tStylingKey` is `null` then it is a map therefor assume that it
                              // contains a match.
      (Array.isArray(tStylingKeyCursor) ? tStylingKeyCursor[1] : tStylingKeyCursor) ===
          tStylingKey  // If the keys match explicitly than we are a match.
  ) {
    return true;
  } else if (Array.isArray(tStylingKeyCursor) && typeof tStylingKey === 'string') {
    // if we did not find a match, but `tStylingKeyCursor` is `KeyValueArray` that means cursor has
    // statics and we need to check those as well.
    return keyValueArrayIndexOf(tStylingKeyCursor, tStylingKey) >=
        0;  // see if we are matching the key
  }
  return false;
}
