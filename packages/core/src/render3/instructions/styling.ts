/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SafeValue, unwrapSafeValue} from '../../sanitization/bypass';
import {KeyValueArray, keyValueArrayGet, keyValueArraySet} from '../../util/array_utils';
import {assertDefined, assertEqual, assertLessThan, assertNotEqual, throwError} from '../../util/assert';
import {EMPTY_ARRAY} from '../../util/empty';
import {concatStringsWithSpace, stringify} from '../../util/stringify';
import {assertFirstUpdatePass} from '../assert';
import {bindingUpdated} from '../bindings';
import {DirectiveDef} from '../interfaces/definition';
import {AttributeMarker, TAttributes, TNode, TNodeFlags, TNodeType} from '../interfaces/node';
import {Renderer} from '../interfaces/renderer';
import {RElement} from '../interfaces/renderer_dom';
import {getTStylingRangeNext, getTStylingRangeNextDuplicate, getTStylingRangePrev, getTStylingRangePrevDuplicate, TStylingKey, TStylingRange} from '../interfaces/styling';
import {LView, RENDERER, TData, TView} from '../interfaces/view';
import {applyStyling} from '../node_manipulation';
import {getCurrentDirectiveDef, getLView, getSelectedIndex, getTView, incrementBindingIndex} from '../state';
import {insertTStylingBinding} from '../styling/style_binding_list';
import {getLastParsedKey, getLastParsedValue, parseClassName, parseClassNameNext, parseStyle, parseStyleNext} from '../styling/styling_parser';
import {NO_CHANGE} from '../tokens';
import {getNativeByIndex} from '../util/view_utils';

import {setDirectiveInputsWhichShadowsStyling} from './property';


/**
 * Update a style binding on an element with the provided value.
 *
 * 使用提供的值更新元素上的样式绑定。
 *
 * If the style value is falsy then it will be removed from the element
 * (or assigned a different value depending if there are any styles placed
 * on the element with `styleMap` or any static styles that are
 * present from when the element was created with `styling`).
 *
 * 如果 style 值为 falsy，则将其从元素中删除（或分配不同的值，具体取决于是否使用 `styleMap`
 * 在元素上放置了任何样式或使用 Style 创建元素时存在的任何静态 `styling`）。
 *
 * Note that the styling element is updated as part of `stylingApply`.
 *
 * 请注意，样式元素是作为 `stylingApply` 的一部分更新的。
 *
 * @param prop A valid CSS property.
 *
 * 有效的 CSS 属性。
 *
 * @param value New value to write (`null` or an empty string to remove).
 *
 * 要写入的新值（`null` 或要删除的空字符串）。
 *
 * @param suffix Optional suffix. Used with scalar values to add unit such as `px`.
 *
 * 可选的后缀。与标量值一起使用以添加单位，例如 `px` 。
 *
 * Note that this will apply the provided style value to the host element if this function is called
 * within a host binding function.
 *
 * 请注意，如果此函数在宿主绑定函数中调用，这会将提供的 style 值应用于宿主元素。
 *
 * @codeGenApi
 */
export function ɵɵstyleProp(
    prop: string, value: string|number|SafeValue|undefined|null,
    suffix?: string|null): typeof ɵɵstyleProp {
  checkStylingProperty(prop, value, suffix, false);
  return ɵɵstyleProp;
}

/**
 * Update a class binding on an element with the provided value.
 *
 * 使用提供的值更新元素上的类绑定。
 *
 * This instruction is meant to handle the `[class.foo]="exp"` case and,
 * therefore, the class binding itself must already be allocated using
 * `styling` within the creation block.
 *
 * 此指令旨在处理 `[class.foo]="exp"` 情况，因此，类绑定本身必须已经使用创建块中的 `styling`
 * 进行分配。
 *
 * @param prop A valid CSS class (only one).
 *
 * 有效的 CSS 类（只有一个）。
 *
 * @param value A true/false value which will turn the class on or off.
 *
 * 一个 true/false 值，它将打开或关闭类。
 *
 * Note that this will apply the provided class value to the host element if this function
 * is called within a host binding function.
 *
 * 请注意，如果在宿主绑定函数中调用此函数，这会将提供的 class 值应用于宿主元素。
 *
 * @codeGenApi
 */
export function ɵɵclassProp(className: string, value: boolean|undefined|null): typeof ɵɵclassProp {
  checkStylingProperty(className, value, null, true);
  return ɵɵclassProp;
}


/**
 * Update style bindings using an object literal on an element.
 *
 * 使用元素上的对象文字更新样式绑定。
 *
 * This instruction is meant to apply styling via the `[style]="exp"` template bindings.
 * When styles are applied to the element they will then be updated with respect to
 * any styles/classes set via `styleProp`. If any styles are set to falsy
 * then they will be removed from the element.
 *
 * 本操作指南旨在通过 `[style]="exp"` 模板绑定来应用样式。当样式应用于元素时，它们将根据通过
 * `styleProp` 设置的任何样式/类进行更新。如果任何样式设置为 falsy，那么它们将被从元素中删除。
 *
 * Note that the styling instruction will not be applied until `stylingApply` is called.
 *
 * 请注意，在调用 `stylingApply` 之前，不会应用样式指令。
 *
 * @param styles A key/value style map of the styles that will be applied to the given element.
 *        Any missing styles (that have already been applied to the element beforehand) will be
 *        removed (unset) from the element's styling.
 *
 * 将应用于给定元素的样式的键/值样式映射。任何缺失的样式（已经预先应用于元素）都将从元素的样式中删除（取消设置）。
 *
 * Note that this will apply the provided styleMap value to the host element if this function
 * is called within a host binding.
 *
 * 请注意，如果在宿主绑定中调用此函数，这会将提供的 styleMap 值应用于宿主元素。
 *
 * @codeGenApi
 */
export function ɵɵstyleMap(styles: {[styleName: string]: any}|string|undefined|null): void {
  checkStylingMap(styleKeyValueArraySet, styleStringParser, styles, false);
}


/**
 * Parse text as style and add values to KeyValueArray.
 *
 * 将文本解析为样式并将值添加到 KeyValueArray。
 *
 * This code is pulled out to a separate function so that it can be tree shaken away if it is not
 * needed. It is only referenced from `ɵɵstyleMap`.
 *
 * 此代码被提取到一个单独的函数中，以便在不需要时可以将其从树上摇掉。它仅从 `ɵɵstyleMap` 引用。
 *
 * @param keyValueArray KeyValueArray to add parsed values to.
 *
 * 要添加解析值的 KeyValueArray。
 *
 * @param text text to parse.
 *
 * 要解析的文本。
 *
 */
export function styleStringParser(keyValueArray: KeyValueArray<any>, text: string): void {
  for (let i = parseStyle(text); i >= 0; i = parseStyleNext(text, i)) {
    styleKeyValueArraySet(keyValueArray, getLastParsedKey(text), getLastParsedValue(text));
  }
}


/**
 * Update class bindings using an object literal or class-string on an element.
 *
 * 使用元素上的对象文字或类字符串更新类绑定。
 *
 * This instruction is meant to apply styling via the `[class]="exp"` template bindings.
 * When classes are applied to the element they will then be updated with
 * respect to any styles/classes set via `classProp`. If any
 * classes are set to falsy then they will be removed from the element.
 *
 * 本操作指南旨在通过 `[class]="exp"` 模板绑定来应用样式。当类应用于元素时，它们将根据通过
 * `classProp` 设置的任何样式/类进行更新。如果任何类设置为 falsy，那么它们将被从元素中删除。
 *
 * Note that the styling instruction will not be applied until `stylingApply` is called.
 * Note that this will the provided classMap value to the host element if this function is called
 * within a host binding.
 *
 * 请注意，在调用 `stylingApply`
 * 之前，不会应用样式指令。请注意，如果此函数在宿主绑定中调用，这将提供给宿主元素的 classMap 值。
 *
 * @param classes A key/value map or string of CSS classes that will be added to the
 *        given element. Any missing classes (that have already been applied to the element
 *        beforehand) will be removed (unset) from the element's list of CSS classes.
 *
 * 将添加到给定元素的键/值映射或 CSS 类的字符串。任何缺失的类（已事先应用于元素）都将从元素的 CSS
 * 类列表中删除（取消设置）。
 *
 * @codeGenApi
 */
export function ɵɵclassMap(classes: {[className: string]: boolean|undefined|null}|string|undefined|
                           null): void {
  checkStylingMap(keyValueArraySet, classStringParser, classes, true);
}

/**
 * Parse text as class and add values to KeyValueArray.
 *
 * 将文本解析为类，并将值添加到 KeyValueArray。
 *
 * This code is pulled out to a separate function so that it can be tree shaken away if it is not
 * needed. It is only referenced from `ɵɵclassMap`.
 *
 * 此代码被提取到一个单独的函数中，以便在不需要时可以将其从树上摇掉。它仅从 `ɵɵclassMap` 引用。
 *
 * @param keyValueArray KeyValueArray to add parsed values to.
 *
 * 要添加解析值的 KeyValueArray。
 *
 * @param text text to parse.
 *
 * 要解析的文本。
 *
 */
export function classStringParser(keyValueArray: KeyValueArray<any>, text: string): void {
  for (let i = parseClassName(text); i >= 0; i = parseClassNameNext(text, i)) {
    keyValueArraySet(keyValueArray, getLastParsedKey(text), true);
  }
}

/**
 * Common code between `ɵɵclassProp` and `ɵɵstyleProp`.
 *
 * `ɵɵclassProp` 和 `ɵɵstyleProp` 之间的通用代码。
 *
 * @param prop property name.
 *
 * 属性名称。
 *
 * @param value binding value.
 *
 * 绑定值。
 *
 * @param suffix suffix for the property (e.g. `em` or `px`)
 *
 * 属性的后缀（例如 `em` 或 `px`）
 *
 * @param isClassBased `true` if `class` change (`false` if `style`)
 *
 * 如果 `class` 更改，则为 `true`（如果 `style` 则为 `false`）
 *
 */
export function checkStylingProperty(
    prop: string, value: any|NO_CHANGE, suffix: string|undefined|null,
    isClassBased: boolean): void {
  const lView = getLView();
  const tView = getTView();
  // Styling instructions use 2 slots per binding.
  // 1. one for the value / TStylingKey
  // 2. one for the intermittent-value / TStylingRange
  const bindingIndex = incrementBindingIndex(2);
  if (tView.firstUpdatePass) {
    stylingFirstUpdatePass(tView, prop, bindingIndex, isClassBased);
  }
  if (value !== NO_CHANGE && bindingUpdated(lView, bindingIndex, value)) {
    const tNode = tView.data[getSelectedIndex()] as TNode;
    updateStyling(
        tView, tNode, lView, lView[RENDERER], prop,
        lView[bindingIndex + 1] = normalizeSuffix(value, suffix), isClassBased, bindingIndex);
  }
}

/**
 * Common code between `ɵɵclassMap` and `ɵɵstyleMap`.
 *
 * `ɵɵclassMap` 和 `ɵɵstyleMap` 之间的通用代码。
 *
 * @param keyValueArraySet (See `keyValueArraySet` in "util/array_utils") Gets passed in as a
 *        function so that `style` can be processed. This is done for tree shaking purposes.
 *
 *（请参阅“util/array_utils”中的 `keyValueArraySet`）作为函数传入，以便可以处理 `style`
 * 。这样做是为了摇树的目的。
 *
 * @param stringParser Parser used to parse `value` if `string`. (Passed in as `style` and `class`
 *        have different parsers.)
 *
 * 解析器用于解析 `string` 的 `value` 。（作为 `style` 传入，并且 `class` 有不同的解析器。）
 *
 * @param value bound value from application
 *
 * 来自应用程序的绑定值
 *
 * @param isClassBased `true` if `class` change (`false` if `style`)
 *
 * 如果 `class` 更改，则为 `true`（如果 `style` 则为 `false`）
 *
 */
export function checkStylingMap(
    keyValueArraySet: (keyValueArray: KeyValueArray<any>, key: string, value: any) => void,
    stringParser: (styleKeyValueArray: KeyValueArray<any>, text: string) => void,
    value: any|NO_CHANGE, isClassBased: boolean): void {
  const tView = getTView();
  const bindingIndex = incrementBindingIndex(2);
  if (tView.firstUpdatePass) {
    stylingFirstUpdatePass(tView, null, bindingIndex, isClassBased);
  }
  const lView = getLView();
  if (value !== NO_CHANGE && bindingUpdated(lView, bindingIndex, value)) {
    // `getSelectedIndex()` should be here (rather than in instruction) so that it is guarded by the
    // if so as not to read unnecessarily.
    const tNode = tView.data[getSelectedIndex()] as TNode;
    if (hasStylingInputShadow(tNode, isClassBased) && !isInHostBindings(tView, bindingIndex)) {
      if (ngDevMode) {
        // verify that if we are shadowing then `TData` is appropriately marked so that we skip
        // processing this binding in styling resolution.
        const tStylingKey = tView.data[bindingIndex];
        assertEqual(
            Array.isArray(tStylingKey) ? tStylingKey[1] : tStylingKey, false,
            'Styling linked list shadow input should be marked as \'false\'');
      }
      // VE does not concatenate the static portion like we are doing here.
      // Instead VE just ignores the static completely if dynamic binding is present.
      // Because of locality we have already set the static portion because we don't know if there
      // is a dynamic portion until later. If we would ignore the static portion it would look like
      // the binding has removed it. This would confuse `[ngStyle]`/`[ngClass]` to do the wrong
      // thing as it would think that the static portion was removed. For this reason we
      // concatenate it so that `[ngStyle]`/`[ngClass]`  can continue to work on changed.
      let staticPrefix = isClassBased ? tNode.classesWithoutHost : tNode.stylesWithoutHost;
      ngDevMode && isClassBased === false && staticPrefix !== null &&
          assertEqual(
              staticPrefix.endsWith(';'), true, 'Expecting static portion to end with \';\'');
      if (staticPrefix !== null) {
        // We want to make sure that falsy values of `value` become empty strings.
        value = concatStringsWithSpace(staticPrefix, value ? value : '');
      }
      // Given `<div [style] my-dir>` such that `my-dir` has `@Input('style')`.
      // This takes over the `[style]` binding. (Same for `[class]`)
      setDirectiveInputsWhichShadowsStyling(tView, tNode, lView, value, isClassBased);
    } else {
      updateStylingMap(
          tView, tNode, lView, lView[RENDERER], lView[bindingIndex + 1],
          lView[bindingIndex + 1] = toStylingKeyValueArray(keyValueArraySet, stringParser, value),
          isClassBased, bindingIndex);
    }
  }
}

/**
 * Determines when the binding is in `hostBindings` section
 *
 * 确定绑定何时在 `hostBindings` 部分
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @param bindingIndex index of binding which we would like if it is in `hostBindings`
 *
 * 如果它在 `hostBindings` 中，我们想要的绑定索引
 *
 */
function isInHostBindings(tView: TView, bindingIndex: number): boolean {
  // All host bindings are placed after the expando section.
  return bindingIndex >= tView.expandoStartIndex;
}

/**
 * Collects the necessary information to insert the binding into a linked list of style bindings
 * using `insertTStylingBinding`.
 *
 * 使用 `insertTStylingBinding` 收集必要的信息以将绑定插入到样式绑定的链表中。
 *
 * @param tView `TView` where the binding linked list will be stored.
 *
 * 将存储绑定链表的 `TView` 。
 *
 * @param tStylingKey Property/key of the binding.
 *
 * 绑定的属性/键。
 *
 * @param bindingIndex Index of binding associated with the `prop`
 *
 * 与 `prop` 关联的绑定索引
 *
 * @param isClassBased `true` if `class` change (`false` if `style`)
 *
 * 如果 `class` 更改，则为 `true`（如果 `style` 则为 `false`）
 *
 */
function stylingFirstUpdatePass(
    tView: TView, tStylingKey: TStylingKey, bindingIndex: number, isClassBased: boolean): void {
  ngDevMode && assertFirstUpdatePass(tView);
  const tData = tView.data;
  if (tData[bindingIndex + 1] === null) {
    // The above check is necessary because we don't clear first update pass until first successful
    // (no exception) template execution. This prevents the styling instruction from double adding
    // itself to the list.
    // `getSelectedIndex()` should be here (rather than in instruction) so that it is guarded by the
    // if so as not to read unnecessarily.
    const tNode = tData[getSelectedIndex()] as TNode;
    ngDevMode && assertDefined(tNode, 'TNode expected');
    const isHostBindings = isInHostBindings(tView, bindingIndex);
    if (hasStylingInputShadow(tNode, isClassBased) && tStylingKey === null && !isHostBindings) {
      // `tStylingKey === null` implies that we are either `[style]` or `[class]` binding.
      // If there is a directive which uses `@Input('style')` or `@Input('class')` than
      // we need to neutralize this binding since that directive is shadowing it.
      // We turn this into a noop by setting the key to `false`
      tStylingKey = false;
    }
    tStylingKey = wrapInStaticStylingKey(tData, tNode, tStylingKey, isClassBased);
    insertTStylingBinding(tData, tNode, tStylingKey, bindingIndex, isHostBindings, isClassBased);
  }
}

/**
 * Adds static styling information to the binding if applicable.
 *
 * 如果适用，将静态样式信息添加到绑定。
 *
 * The linked list of styles not only stores the list and keys, but also stores static styling
 * information on some of the keys. This function determines if the key should contain the styling
 * information and computes it.
 *
 * 样式链表不仅存储列表和键，还会在某些键上存储静态样式信息。此函数确定键是否应包含样式信息并进行计算。
 *
 * See `TStylingStatic` for more details.
 *
 * 有关更多详细信息，请参阅 `TStylingStatic` 。
 *
 * @param tData `TData` where the linked list is stored.
 *
 * 存储链表的 `TData` 。
 *
 * @param tNode `TNode` for which the styling is being computed.
 *
 * 正在计算其样式的 `TNode` 。
 *
 * @param stylingKey `TStylingKeyPrimitive` which may need to be wrapped into `TStylingKey`
 *
 * 可能需要包装到 `TStylingKeyPrimitive` 中的 `TStylingKey`
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 */
export function wrapInStaticStylingKey(
    tData: TData, tNode: TNode, stylingKey: TStylingKey, isClassBased: boolean): TStylingKey {
  const hostDirectiveDef = getCurrentDirectiveDef(tData);
  let residual = isClassBased ? tNode.residualClasses : tNode.residualStyles;
  if (hostDirectiveDef === null) {
    // We are in template node.
    // If template node already had styling instruction then it has already collected the static
    // styling and there is no need to collect them again. We know that we are the first styling
    // instruction because the `TNode.*Bindings` points to 0 (nothing has been inserted yet).
    const isFirstStylingInstructionInTemplate =
        (isClassBased ? tNode.classBindings : tNode.styleBindings) as any as number === 0;
    if (isFirstStylingInstructionInTemplate) {
      // It would be nice to be able to get the statics from `mergeAttrs`, however, at this point
      // they are already merged and it would not be possible to figure which property belongs where
      // in the priority.
      stylingKey = collectStylingFromDirectives(null, tData, tNode, stylingKey, isClassBased);
      stylingKey = collectStylingFromTAttrs(stylingKey, tNode.attrs, isClassBased);
      // We know that if we have styling binding in template we can't have residual.
      residual = null;
    }
  } else {
    // We are in host binding node and there was no binding instruction in template node.
    // This means that we need to compute the residual.
    const directiveStylingLast = tNode.directiveStylingLast;
    const isFirstStylingInstructionInHostBinding =
        directiveStylingLast === -1 || tData[directiveStylingLast] !== hostDirectiveDef;
    if (isFirstStylingInstructionInHostBinding) {
      stylingKey =
          collectStylingFromDirectives(hostDirectiveDef, tData, tNode, stylingKey, isClassBased);
      if (residual === null) {
        // - If `null` than either:
        //    - Template styling instruction already ran and it has consumed the static
        //      styling into its `TStylingKey` and so there is no need to update residual. Instead
        //      we need to update the `TStylingKey` associated with the first template node
        //      instruction. OR
        //    - Some other styling instruction ran and determined that there are no residuals
        let templateStylingKey = getTemplateHeadTStylingKey(tData, tNode, isClassBased);
        if (templateStylingKey !== undefined && Array.isArray(templateStylingKey)) {
          // Only recompute if `templateStylingKey` had static values. (If no static value found
          // then there is nothing to do since this operation can only produce less static keys, not
          // more.)
          templateStylingKey = collectStylingFromDirectives(
              null, tData, tNode, templateStylingKey[1] /* unwrap previous statics */,
              isClassBased);
          templateStylingKey =
              collectStylingFromTAttrs(templateStylingKey, tNode.attrs, isClassBased);
          setTemplateHeadTStylingKey(tData, tNode, isClassBased, templateStylingKey);
        }
      } else {
        // We only need to recompute residual if it is not `null`.
        // - If existing residual (implies there was no template styling). This means that some of
        //   the statics may have moved from the residual to the `stylingKey` and so we have to
        //   recompute.
        // - If `undefined` this is the first time we are running.
        residual = collectResidual(tData, tNode, isClassBased);
      }
    }
  }
  if (residual !== undefined) {
    isClassBased ? (tNode.residualClasses = residual) : (tNode.residualStyles = residual);
  }
  return stylingKey;
}

/**
 * Retrieve the `TStylingKey` for the template styling instruction.
 *
 * 检索模板样式说明的 `TStylingKey` 。
 *
 * This is needed since `hostBinding` styling instructions are inserted after the template
 * instruction. While the template instruction needs to update the residual in `TNode` the
 * `hostBinding` instructions need to update the `TStylingKey` of the template instruction because
 * the template instruction is downstream from the `hostBindings` instructions.
 *
 * 这是需要的，因为 `hostBinding` 样式说明是在模板指令之后插入的。虽然模板指令需要更新 `hostBinding`
 * `TNode` 需要更新模板指令的 `TStylingKey` ，因为模板指令是 `hostBindings` 指令的下游。
 *
 * @param tData `TData` where the linked list is stored.
 *
 * 存储链表的 `TData` 。
 *
 * @param tNode `TNode` for which the styling is being computed.
 *
 * 正在计算其样式的 `TNode` 。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 * @return `TStylingKey` if found or `undefined` if not found.
 *
 * 如果找到，`TStylingKey` ，如果找不到，则为 `undefined` 。
 *
 */
function getTemplateHeadTStylingKey(tData: TData, tNode: TNode, isClassBased: boolean): TStylingKey|
    undefined {
  const bindings = isClassBased ? tNode.classBindings : tNode.styleBindings;
  if (getTStylingRangeNext(bindings) === 0) {
    // There does not seem to be a styling instruction in the `template`.
    return undefined;
  }
  return tData[getTStylingRangePrev(bindings)] as TStylingKey;
}

/**
 * Update the `TStylingKey` of the first template instruction in `TNode`.
 *
 * 更新 `TStylingKey` 中第一个模板指令的 `TNode` 。
 *
 * Logically `hostBindings` styling instructions are of lower priority than that of the template.
 * However, they execute after the template styling instructions. This means that they get inserted
 * in front of the template styling instructions.
 *
 * 从逻辑上讲，`hostBindings`
 * 样式说明的优先级低于模板的优先级。但是，它们会在模板样式说明之后执行。这意味着它们会被插入到模板样式说明的前面。
 *
 * If we have a template styling instruction and a new `hostBindings` styling instruction is
 * executed it means that it may need to steal static fields from the template instruction. This
 * method allows us to update the first template instruction `TStylingKey` with a new value.
 *
 * 如果我们有模板样式指令并执行了新的 `hostBindings`
 * 样式指令，则意味着它可能需要从模板指令中窃取静态字段。此方法允许我们使用新值更新第一个模板指令
 * `TStylingKey` 。
 *
 * Assume:
 *
 * 假设：
 *
 * ```
 * <div my-dir style="color: red" [style.color]="tmplExp"></div>
 * ```
 *
 * @Directive({
 *   host: {
 *     'style': 'width: 100px',
 *     '[style.color]': 'dirExp',
 *   }
 * })
 * class MyDir {}
 * ```
 *
 * when `[style.color]="tmplExp"` executes it creates this data structure.
 * ```
 *  ['', 'color', 'color', 'red', 'width', '100px'],
 * ```
 *
 * The reason for this is that the template instruction does not know if there are styling
 * instructions and must assume that there are none and must collect all of the static styling.
 * (both
 * `color' and 'width`)
 *
 * When `'[style.color]': 'dirExp',` executes we need to insert a new data into the linked list.
 * ```
 *  ['', 'color', 'width', '100px'],  // newly inserted
 *  ['', 'color', 'color', 'red', 'width', '100px'], // this is wrong
 * ```
 *
 * Notice that the template statics is now wrong as it incorrectly contains `width` so we need to
 * update it like so:
 * ```
 *  ['', 'color', 'width', '100px'],
 *  ['', 'color', 'color', 'red'],    // UPDATE
 * ```
 * @param tData `TData` where the linked list is stored.
 *
 * 存储链表的 `TData` 。
 *
 * @param tNode `TNode` for which the styling is being computed.
 *
 * 正在计算其样式的 `TNode` 。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 * @param tStylingKey New `TStylingKey` which is replacing the old one.
 *
 * 新的 `TStylingKey` 正在替换旧的。
 *
 */
function setTemplateHeadTStylingKey(
    tData: TData, tNode: TNode, isClassBased: boolean, tStylingKey: TStylingKey): void {
  const bindings = isClassBased ? tNode.classBindings : tNode.styleBindings;
  ngDevMode &&
      assertNotEqual(
          getTStylingRangeNext(bindings), 0,
          'Expecting to have at least one template styling binding.');
  tData[getTStylingRangePrev(bindings)] = tStylingKey;
}

/**
 * Collect all static values after the current `TNode.directiveStylingLast` index.
 *
 * 收集当前 `TNode.directiveStylingLast` 索引之后的所有静态值。
 *
 * Collect the remaining styling information which has not yet been collected by an existing
 * styling instruction.
 *
 * 收集现有样式指令尚未收集的其余样式信息。
 *
 * @param tData `TData` where the `DirectiveDefs` are stored.
 *
 * 存储 `DirectiveDefs` 的 `TData` 。
 *
 * @param tNode `TNode` which contains the directive range.
 *
 * 包含指令范围的 `TNode` 。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 */
function collectResidual(tData: TData, tNode: TNode, isClassBased: boolean): KeyValueArray<any>|
    null {
  let residual: KeyValueArray<any>|null|undefined = undefined;
  const directiveEnd = tNode.directiveEnd;
  ngDevMode &&
      assertNotEqual(
          tNode.directiveStylingLast, -1,
          'By the time this function gets called at least one hostBindings-node styling instruction must have executed.');
  // We add `1 + tNode.directiveStart` because we need to skip the current directive (as we are
  // collecting things after the last `hostBindings` directive which had a styling instruction.)
  for (let i = 1 + tNode.directiveStylingLast; i < directiveEnd; i++) {
    const attrs = (tData[i] as DirectiveDef<any>).hostAttrs;
    residual = collectStylingFromTAttrs(residual, attrs, isClassBased) as KeyValueArray<any>| null;
  }
  return collectStylingFromTAttrs(residual, tNode.attrs, isClassBased) as KeyValueArray<any>| null;
}

/**
 * Collect the static styling information with lower priority than `hostDirectiveDef`.
 *
 * 收集优先级低于 `hostDirectiveDef` 的静态样式信息。
 *
 * (This is opposite of residual styling.)
 *
 *（这与残留样式相反。）
 *
 * @param hostDirectiveDef `DirectiveDef` for which we want to collect lower priority static
 *        styling. (Or `null` if template styling)
 *
 * 我们要为其收集较低优先级的静态样式的 `DirectiveDef` 。（如果是模板样式，则为 `null`）
 *
 * @param tData `TData` where the linked list is stored.
 *
 * 存储链表的 `TData` 。
 *
 * @param tNode `TNode` for which the styling is being computed.
 *
 * 正在计算其样式的 `TNode` 。
 *
 * @param stylingKey Existing `TStylingKey` to update or wrap.
 *
 * 要更新或包装的现有 `TStylingKey` 。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 */
function collectStylingFromDirectives(
    hostDirectiveDef: DirectiveDef<any>|null, tData: TData, tNode: TNode, stylingKey: TStylingKey,
    isClassBased: boolean): TStylingKey {
  // We need to loop because there can be directives which have `hostAttrs` but don't have
  // `hostBindings` so this loop catches up to the current directive..
  let currentDirective: DirectiveDef<any>|null = null;
  const directiveEnd = tNode.directiveEnd;
  let directiveStylingLast = tNode.directiveStylingLast;
  if (directiveStylingLast === -1) {
    directiveStylingLast = tNode.directiveStart;
  } else {
    directiveStylingLast++;
  }
  while (directiveStylingLast < directiveEnd) {
    currentDirective = tData[directiveStylingLast] as DirectiveDef<any>;
    ngDevMode && assertDefined(currentDirective, 'expected to be defined');
    stylingKey = collectStylingFromTAttrs(stylingKey, currentDirective.hostAttrs, isClassBased);
    if (currentDirective === hostDirectiveDef) break;
    directiveStylingLast++;
  }
  if (hostDirectiveDef !== null) {
    // we only advance the styling cursor if we are collecting data from host bindings.
    // Template executes before host bindings and so if we would update the index,
    // host bindings would not get their statics.
    tNode.directiveStylingLast = directiveStylingLast;
  }
  return stylingKey;
}

/**
 * Convert `TAttrs` into `TStylingStatic`.
 *
 * 将 `TAttrs` 转换为 `TStylingStatic` 。
 *
 * @param stylingKey existing `TStylingKey` to update or wrap.
 *
 * 要更新或包装的现有 `TStylingKey` 。
 *
 * @param attrs `TAttributes` to process.
 *
 * 要处理的 `TAttributes` 。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 */
function collectStylingFromTAttrs(
    stylingKey: TStylingKey|undefined, attrs: TAttributes|null,
    isClassBased: boolean): TStylingKey {
  const desiredMarker = isClassBased ? AttributeMarker.Classes : AttributeMarker.Styles;
  let currentMarker = AttributeMarker.ImplicitAttributes;
  if (attrs !== null) {
    for (let i = 0; i < attrs.length; i++) {
      const item = attrs[i] as number | string;
      if (typeof item === 'number') {
        currentMarker = item;
      } else {
        if (currentMarker === desiredMarker) {
          if (!Array.isArray(stylingKey)) {
            stylingKey = stylingKey === undefined ? [] : ['', stylingKey] as any;
          }
          keyValueArraySet(
              stylingKey as KeyValueArray<any>, item, isClassBased ? true : attrs[++i]);
        }
      }
    }
  }
  return stylingKey === undefined ? null : stylingKey;
}

/**
 * Convert user input to `KeyValueArray`.
 *
 * 将用户输入转换为 `KeyValueArray` 。
 *
 * This function takes user input which could be `string`, Object literal, or iterable and converts
 * it into a consistent representation. The output of this is `KeyValueArray` (which is an array
 * where
 * even indexes contain keys and odd indexes contain values for those keys).
 *
 * 此函数接受用户输入，可以是 `string`、Object 文字或 iterable
 * ，并将其转换为一致的表示。它的输出是 `KeyValueArray`
 *（这是一个数组，其中偶数索引包含键，奇数索引包含这些键的值）。
 *
 * The advantage of converting to `KeyValueArray` is that we can perform diff in an input
 * independent
 * way.
 * (ie we can compare `foo bar` to \`['bar', 'baz'] and determine a set of changes which need to be
 * applied)
 *
 * 转换为 `KeyValueArray` 的优势是我们可以以与输入无关的方式执行 diff。（即我们可以将 `foo bar` 与
 * \` ['bar', 'baz']['bar', 'baz']进行比较，并确定需要应用的一组更改）
 *
 * The fact that `KeyValueArray` is sorted is very important because it allows us to compute the
 * difference in linear fashion without the need to allocate any additional data.
 *
 * `KeyValueArray`
 * 已排序的事实非常重要，因为它允许我们以线性方式计算差值，而无需分配任何额外的数据。
 *
 * For example if we kept this as a `Map` we would have to iterate over previous `Map` to determine
 * which values need to be deleted, over the new `Map` to determine additions, and we would have to
 * keep additional `Map` to keep track of duplicates or items which have not yet been visited.
 *
 * 例如，如果我们将其保留为 `Map` ，我们将不得不迭代以前的 `Map` 来确定需要删除哪些值，遍历新 `Map`
 * 来确定要添加的值，并且我们将不得不保留额外的 `Map` 以跟踪重复项或条目尚未访问。
 *
 * @param keyValueArraySet (See `keyValueArraySet` in "util/array_utils") Gets passed in as a
 *        function so that `style` can be processed. This is done
 *        for tree shaking purposes.
 *
 *（请参阅“util/array_utils”中的 `keyValueArraySet`）作为函数传入，以便可以处理 `style`
 * 。这样做是为了摇树的目的。
 *
 * @param stringParser The parser is passed in so that it will be tree shakable. See
 *        `styleStringParser` and `classStringParser`
 *
 * 传入解析器，以便它是可摇树的。请参阅 `styleStringParser` 和 `classStringParser`
 *
 * @param value The value to parse/convert to `KeyValueArray`
 *
 * 要解析/转换为 `KeyValueArray` 的值
 *
 */
export function toStylingKeyValueArray(
    keyValueArraySet: (keyValueArray: KeyValueArray<any>, key: string, value: any) => void,
    stringParser: (styleKeyValueArray: KeyValueArray<any>, text: string) => void,
    value: string|string[]|{[key: string]: any}|SafeValue|null|undefined): KeyValueArray<any> {
  if (value == null /*|| value === undefined */ || value === '') return EMPTY_ARRAY as any;
  const styleKeyValueArray: KeyValueArray<any> = [] as any;
  const unwrappedValue = unwrapSafeValue(value) as string | string[] | {[key: string]: any};
  if (Array.isArray(unwrappedValue)) {
    for (let i = 0; i < unwrappedValue.length; i++) {
      keyValueArraySet(styleKeyValueArray, unwrappedValue[i], true);
    }
  } else if (typeof unwrappedValue === 'object') {
    for (const key in unwrappedValue) {
      if (unwrappedValue.hasOwnProperty(key)) {
        keyValueArraySet(styleKeyValueArray, key, unwrappedValue[key]);
      }
    }
  } else if (typeof unwrappedValue === 'string') {
    stringParser(styleKeyValueArray, unwrappedValue);
  } else {
    ngDevMode &&
        throwError('Unsupported styling type ' + typeof unwrappedValue + ': ' + unwrappedValue);
  }
  return styleKeyValueArray;
}

/**
 * Set a `value` for a `key`.
 *
 * 为 `key` 设置 `value` 。
 *
 * See: `keyValueArraySet` for details
 *
 * 有关详细信息，请参阅： `keyValueArraySet`
 *
 * @param keyValueArray KeyValueArray to add to.
 *
 * 要添加到的 KeyValueArray。
 *
 * @param key Style key to add.
 *
 * 要添加的样式键。
 *
 * @param value The value to set.
 *
 * 要设置的值。
 *
 */
export function styleKeyValueArraySet(keyValueArray: KeyValueArray<any>, key: string, value: any) {
  keyValueArraySet(keyValueArray, key, unwrapSafeValue(value));
}

/**
 * Update map based styling.
 *
 * 更新基于地图的样式。
 *
 * Map based styling could be anything which contains more than one binding. For example `string`,
 * or object literal. Dealing with all of these types would complicate the logic so
 * instead this function expects that the complex input is first converted into normalized
 * `KeyValueArray`. The advantage of normalization is that we get the values sorted, which makes it
 * very cheap to compute deltas between the previous and current value.
 *
 * 基于映射的样式可以是任何包含多个绑定的东西。例如 `string`
 * 或对象文字。处理所有这些类型会使逻辑复杂化，因此此函数期望复杂的输入首先转换为规范化的
 * `KeyValueArray`
 * 。归一化的优势是我们对值进行了排序，这使得计算前一个值和当前值之间的差值变得非常便宜。
 *
 * @param tView Associated `TView.data` contains the linked list of binding priorities.
 *
 * 关联的 `TView.data` 包含绑定优先级的链表。
 *
 * @param tNode `TNode` where the binding is located.
 *
 * 绑定所在的 `TNode` 。
 *
 * @param lView `LView` contains the values associated with other styling binding at this `TNode`.
 *
 * `LView` 包含与此 `TNode` 上的其他样式绑定关联的值。
 *
 * @param renderer Renderer to use if any updates.
 *
 * 如果有任何更新，要使用的渲染器。
 *
 * @param oldKeyValueArray Previous value represented as `KeyValueArray`
 *
 * 表示为 `KeyValueArray` 的前一个值
 *
 * @param newKeyValueArray Current value represented as `KeyValueArray`
 *
 * 表示为 `KeyValueArray` 的当前值
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 * @param bindingIndex Binding index of the binding.
 *
 * 绑定的绑定索引。
 *
 */
function updateStylingMap(
    tView: TView, tNode: TNode, lView: LView, renderer: Renderer,
    oldKeyValueArray: KeyValueArray<any>, newKeyValueArray: KeyValueArray<any>,
    isClassBased: boolean, bindingIndex: number) {
  if (oldKeyValueArray as KeyValueArray<any>| NO_CHANGE === NO_CHANGE) {
    // On first execution the oldKeyValueArray is NO_CHANGE => treat it as empty KeyValueArray.
    oldKeyValueArray = EMPTY_ARRAY as any;
  }
  let oldIndex = 0;
  let newIndex = 0;
  let oldKey: string|null = 0 < oldKeyValueArray.length ? oldKeyValueArray[0] : null;
  let newKey: string|null = 0 < newKeyValueArray.length ? newKeyValueArray[0] : null;
  while (oldKey !== null || newKey !== null) {
    ngDevMode && assertLessThan(oldIndex, 999, 'Are we stuck in infinite loop?');
    ngDevMode && assertLessThan(newIndex, 999, 'Are we stuck in infinite loop?');
    const oldValue =
        oldIndex < oldKeyValueArray.length ? oldKeyValueArray[oldIndex + 1] : undefined;
    const newValue =
        newIndex < newKeyValueArray.length ? newKeyValueArray[newIndex + 1] : undefined;
    let setKey: string|null = null;
    let setValue: any = undefined;
    if (oldKey === newKey) {
      // UPDATE: Keys are equal => new value is overwriting old value.
      oldIndex += 2;
      newIndex += 2;
      if (oldValue !== newValue) {
        setKey = newKey;
        setValue = newValue;
      }
    } else if (newKey === null || oldKey !== null && oldKey < newKey!) {
      // DELETE: oldKey key is missing or we did not find the oldKey in the newValue
      // (because the keyValueArray is sorted and `newKey` is found later alphabetically).
      // `"background" < "color"` so we need to delete `"background"` because it is not found in the
      // new array.
      oldIndex += 2;
      setKey = oldKey;
    } else {
      // CREATE: newKey's is earlier alphabetically than oldKey's (or no oldKey) => we have new key.
      // `"color" > "background"` so we need to add `color` because it is in new array but not in
      // old array.
      ngDevMode && assertDefined(newKey, 'Expecting to have a valid key');
      newIndex += 2;
      setKey = newKey;
      setValue = newValue;
    }
    if (setKey !== null) {
      updateStyling(tView, tNode, lView, renderer, setKey, setValue, isClassBased, bindingIndex);
    }
    oldKey = oldIndex < oldKeyValueArray.length ? oldKeyValueArray[oldIndex] : null;
    newKey = newIndex < newKeyValueArray.length ? newKeyValueArray[newIndex] : null;
  }
}

/**
 * Update a simple (property name) styling.
 *
 * 更新简单（属性名称）样式。
 *
 * This function takes `prop` and updates the DOM to that value. The function takes the binding
 * value as well as binding priority into consideration to determine which value should be written
 * to DOM. (For example it may be determined that there is a higher priority overwrite which blocks
 * the DOM write, or if the value goes to `undefined` a lower priority overwrite may be consulted.)
 *
 * 此函数接受 `prop` 并将 DOM 更新为该值。该函数会考虑绑定值以及绑定优先级来确定应该将哪个值写入
 * DOM。（例如，可以确定有较高优先级的覆盖会阻止 DOM 写入，或者如果值变为 `undefined`
 * ，则可以咨询较低优先级的覆盖。）
 *
 * @param tView Associated `TView.data` contains the linked list of binding priorities.
 *
 * 关联的 `TView.data` 包含绑定优先级的链表。
 *
 * @param tNode `TNode` where the binding is located.
 *
 * 绑定所在的 `TNode` 。
 *
 * @param lView `LView` contains the values associated with other styling binding at this `TNode`.
 *
 * `LView` 包含与此 `TNode` 上的其他样式绑定关联的值。
 *
 * @param renderer Renderer to use if any updates.
 *
 * 如果有任何更新，要使用的渲染器。
 *
 * @param prop Either style property name or a class name.
 *
 * 样式属性名或类名。
 *
 * @param value Either style value for `prop` or `true`/`false` if `prop` is class.
 *
 * `prop` 的样式值，如果 `prop` 是 class，则为 `true` / `false` 。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 * @param bindingIndex Binding index of the binding.
 *
 * 绑定的绑定索引。
 *
 */
function updateStyling(
    tView: TView, tNode: TNode, lView: LView, renderer: Renderer, prop: string,
    value: string|undefined|null|boolean, isClassBased: boolean, bindingIndex: number) {
  if (!(tNode.type & TNodeType.AnyRNode)) {
    // It is possible to have styling on non-elements (such as ng-container).
    // This is rare, but it does happen. In such a case, just ignore the binding.
    return;
  }
  const tData = tView.data;
  const tRange = tData[bindingIndex + 1] as TStylingRange;
  const higherPriorityValue = getTStylingRangeNextDuplicate(tRange) ?
      findStylingValue(tData, tNode, lView, prop, getTStylingRangeNext(tRange), isClassBased) :
      undefined;
  if (!isStylingValuePresent(higherPriorityValue)) {
    // We don't have a next duplicate, or we did not find a duplicate value.
    if (!isStylingValuePresent(value)) {
      // We should delete current value or restore to lower priority value.
      if (getTStylingRangePrevDuplicate(tRange)) {
        // We have a possible prev duplicate, let's retrieve it.
        value = findStylingValue(tData, null, lView, prop, bindingIndex, isClassBased);
      }
    }
    const rNode = getNativeByIndex(getSelectedIndex(), lView) as RElement;
    applyStyling(renderer, isClassBased, rNode, prop, value);
  }
}

/**
 * Search for styling value with higher priority which is overwriting current value, or a
 * value of lower priority to which we should fall back if the value is `undefined`.
 *
 * 搜索具有较高优先级的样式值，它会覆盖当前值，或者搜索优先级较低的值，如果值为 `undefined`
 * ，我们应该回退到。
 *
 * When value is being applied at a location, related values need to be consulted.
 *
 * 在某个位置应用值时，需要参考相关值。
 *
 * - If there is a higher priority binding, we should be using that one instead.
 *   For example `<div  [style]="{color:exp1}" [style.color]="exp2">` change to `exp1`
 *   requires that we check `exp2` to see if it is set to value other than `undefined`.
 *
 *   如果有更高优先级的绑定，我们应该改用那个绑定。例如 `<div [style]="{color:exp1}"
 * [style.color]="exp2">` 更改为 `exp1` 需要我们检查 `exp2` 以查看它是否设置为 `undefined`
 * 以外的值。
 *
 * - If there is a lower priority binding and we are changing to `undefined`
 *   For example `<div  [style]="{color:exp1}" [style.color]="exp2">` change to `exp2` to
 *   `undefined` requires that we check `exp1` (and static values) and use that as new value.
 *
 *   如果有较低优先级的绑定并且我们要更改为 `undefined` 例如 `<div [style]="{color:exp1}"
 * [style.color]="exp2">` 将 `exp2` 更改为 `undefined` 要求我们检查 `exp1`
 *（和静态值）并将其作为新值。
 *
 * NOTE: The styling stores two values.
 * 1\. The raw value which came from the application is stored at `index + 0` location. (This value
 *    is used for dirty checking).
 * 2\. The normalized value is stored at `index + 1`.
 *
 * 注意：此样式存储两个值。 1.来自应用程序的原始值存储在 `index + 0` 位置。（此值用于脏检查）。 2.
 * 归一化值存储在 `index + 1` 处。
 *
 * @param tData `TData` used for traversing the priority.
 *
 * 用于遍历优先级的 `TData` 。
 *
 * @param tNode `TNode` to use for resolving static styling. Also controls search direction.
 *
 * 用于解析静态样式的 `TNode` 。还控制搜索方向。
 *
 * - `TNode` search next and quit as soon as `isStylingValuePresent(value)` is true.
 *    If no value found consult `tNode.residualStyle`/`tNode.residualClass` for default value.
 *
 *   `TNode` 搜索下一个并在 `isStylingValuePresent(value)` 为 true 时立即退出。如果找不到值，请参阅
 * `tNode.residualStyle` / `tNode.residualClass` 作为默认值。
 *
 * - `null` search prev and go all the way to end. Return last value where
 *   `isStylingValuePresent(value)` is true.
 *
 *   `null` 搜索 prev 并一直到 end。返回 `isStylingValuePresent(value)` 为 true 的最后一个值。
 *
 * @param lView `LView` used for retrieving the actual values.
 *
 * `LView` 用于检索实际值。
 *
 * @param prop Property which we are interested in.
 *
 * 我们感兴趣的属性。
 *
 * @param index Starting index in the linked list of styling bindings where the search should start.
 *
 * 应该开始搜索的样式绑定链接列表中的起始索引。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 */
function findStylingValue(
    tData: TData, tNode: TNode|null, lView: LView, prop: string, index: number,
    isClassBased: boolean): any {
  // `TNode` to use for resolving static styling. Also controls search direction.
  //   - `TNode` search next and quit as soon as `isStylingValuePresent(value)` is true.
  //      If no value found consult `tNode.residualStyle`/`tNode.residualClass` for default value.
  //   - `null` search prev and go all the way to end. Return last value where
  //     `isStylingValuePresent(value)` is true.
  const isPrevDirection = tNode === null;
  let value: any = undefined;
  while (index > 0) {
    const rawKey = tData[index] as TStylingKey;
    const containsStatics = Array.isArray(rawKey);
    // Unwrap the key if we contain static values.
    const key = containsStatics ? (rawKey as string[])[1] : rawKey;
    const isStylingMap = key === null;
    let valueAtLViewIndex = lView[index + 1];
    if (valueAtLViewIndex === NO_CHANGE) {
      // In firstUpdatePass the styling instructions create a linked list of styling.
      // On subsequent passes it is possible for a styling instruction to try to read a binding
      // which
      // has not yet executed. In that case we will find `NO_CHANGE` and we should assume that
      // we have `undefined` (or empty array in case of styling-map instruction) instead. This
      // allows the resolution to apply the value (which may later be overwritten when the
      // binding actually executes.)
      valueAtLViewIndex = isStylingMap ? EMPTY_ARRAY : undefined;
    }
    let currentValue = isStylingMap ? keyValueArrayGet(valueAtLViewIndex, prop) :
                                      (key === prop ? valueAtLViewIndex : undefined);
    if (containsStatics && !isStylingValuePresent(currentValue)) {
      currentValue = keyValueArrayGet(rawKey as KeyValueArray<any>, prop);
    }
    if (isStylingValuePresent(currentValue)) {
      value = currentValue;
      if (isPrevDirection) {
        return value;
      }
    }
    const tRange = tData[index + 1] as TStylingRange;
    index = isPrevDirection ? getTStylingRangePrev(tRange) : getTStylingRangeNext(tRange);
  }
  if (tNode !== null) {
    // in case where we are going in next direction AND we did not find anything, we need to
    // consult residual styling
    let residual = isClassBased ? tNode.residualClasses : tNode.residualStyles;
    if (residual != null /** OR residual !=== undefined */) {
      value = keyValueArrayGet(residual!, prop);
    }
  }
  return value;
}

/**
 * Determines if the binding value should be used (or if the value is 'undefined' and hence priority
 * resolution should be used.)
 *
 * 确定是否应该使用绑定值（或者该值是否为 'undefined' ，因此应该使用优先级解析。）
 *
 * @param value Binding style value.
 *
 * 绑定样式值。
 *
 */
function isStylingValuePresent(value: any): boolean {
  // Currently only `undefined` value is considered non-binding. That is `undefined` says I don't
  // have an opinion as to what this binding should be and you should consult other bindings by
  // priority to determine the valid value.
  // This is extracted into a single function so that we have a single place to control this.
  return value !== undefined;
}

/**
 * Normalizes and/or adds a suffix to the value.
 *
 * 对值进行规范化和/或添加后缀。
 *
 * If value is `null`/`undefined` no suffix is added
 *
 * 如果值为 `null` / `undefined` ，则不添加后缀
 *
 * @param value
 * @param suffix
 */
function normalizeSuffix(value: any, suffix: string|undefined|null): string|null|undefined|boolean {
  if (value == null /** || value === undefined */) {
    // do nothing
  } else if (typeof suffix === 'string') {
    value = value + suffix;
  } else if (typeof value === 'object') {
    value = stringify(unwrapSafeValue(value));
  }
  return value;
}


/**
 * Tests if the `TNode` has input shadow.
 *
 * 测试 `TNode` 是否有输入阴影。
 *
 * An input shadow is when a directive steals (shadows) the input by using `@Input('style')` or
 * `@Input('class')` as input.
 *
 * 输入阴影是指指令使用 `@Input('style')` 或 `@Input('class')` 作为输入来窃取（阴影）输入。
 *
 * @param tNode `TNode` which we would like to see if it has shadow.
 *
 * 我们想查看它是否有阴影的 `TNode` 。
 *
 * @param isClassBased `true` if `class` (`false` if `style`)
 *
 * 如果是 `class` ，则为 `true`（如果是 `style` ，则为 `false`）
 *
 */
export function hasStylingInputShadow(tNode: TNode, isClassBased: boolean) {
  return (tNode.flags & (isClassBased ? TNodeFlags.hasClassInput : TNodeFlags.hasStyleInput)) !== 0;
}
