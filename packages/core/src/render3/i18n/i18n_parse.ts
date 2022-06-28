/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '../../util/ng_dev_mode';
import '../../util/ng_i18n_closure_mode';

import {getTemplateContent, SRCSET_ATTRS, URI_ATTRS, VALID_ATTRS, VALID_ELEMENTS} from '../../sanitization/html_sanitizer';
import {getInertBodyHelper} from '../../sanitization/inert_body';
import {_sanitizeUrl, sanitizeSrcset} from '../../sanitization/url_sanitizer';
import {assertDefined, assertEqual, assertGreaterThanOrEqual, assertOneOf, assertString} from '../../util/assert';
import {CharCode} from '../../util/char_code';
import {loadIcuContainerVisitor} from '../instructions/i18n_icu_container_visitor';
import {allocExpando, createTNodeAtIndex} from '../instructions/shared';
import {getDocument} from '../interfaces/document';
import {ELEMENT_MARKER, I18nCreateOpCode, I18nCreateOpCodes, I18nRemoveOpCodes, I18nUpdateOpCode, I18nUpdateOpCodes, ICU_MARKER, IcuCreateOpCode, IcuCreateOpCodes, IcuExpression, IcuType, TI18n, TIcu} from '../interfaces/i18n';
import {TNode, TNodeType} from '../interfaces/node';
import {SanitizerFn} from '../interfaces/sanitization';
import {HEADER_OFFSET, LView, TView} from '../interfaces/view';
import {getCurrentParentTNode, getCurrentTNode, setCurrentTNode} from '../state';
import {attachDebugGetter} from '../util/debug_utils';

import {i18nCreateOpCodesToString, i18nRemoveOpCodesToString, i18nUpdateOpCodesToString, icuCreateOpCodesToString} from './i18n_debug';
import {addTNodeAndUpdateInsertBeforeIndex} from './i18n_insert_before_index';
import {ensureIcuContainerVisitorLoaded} from './i18n_tree_shaking';
import {createTNodePlaceholder, icuCreateOpCode, setTIcu, setTNodeInsertBeforeIndex} from './i18n_util';



const BINDING_REGEXP = /�(\d+):?\d*�/gi;
const ICU_REGEXP = /({\s*�\d+:?\d*�\s*,\s*\S{6}\s*,[\s\S]*})/gi;
const NESTED_ICU = /�(\d+)�/;
const ICU_BLOCK_REGEXP = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/;

const MARKER = `�`;
const SUBTEMPLATE_REGEXP = /�\/?\*(\d+:\d+)�/gi;
const PH_REGEXP = /�(\/?[#*]\d+):?\d*�/gi;

/**
 * Angular Dart introduced &ngsp; as a placeholder for non-removable space, see:
 * <https://github.com/dart-lang/angular/blob/0bb611387d29d65b5af7f9d2515ab571fd3fbee4/_tests/test/compiler/preserve_whitespace_test.dart#L25-L32>
 * In Angular Dart &ngsp; is converted to the 0xE500 PUA (Private Use Areas) unicode character
 * and later on replaced by a space. We are re-implementing the same idea here, since translations
 * might contain this special character.
 *
 * Angular Dart 介绍了 &ngsp;作为不可移动空间的占位符，请参阅：
 * <https://github.com/dart-lang/angular/blob/0bb611387d29d65b5af7f9d2515ab571fd3fbee4/_tests/test/compiler/preserve_whitespace_test.dart#L25-L32>在
 * Angular Dart &ngsp; 中被转换为 0xE500 PUA（私人使用区域）unicode
 * 字符，后来被空格替换。我们在这里重新实现了同一个想法，因为翻译可能包含这个特殊字符。
 *
 */
const NGSP_UNICODE_REGEXP = /\uE500/g;
function replaceNgsp(value: string): string {
  return value.replace(NGSP_UNICODE_REGEXP, ' ');
}

/**
 * Create dynamic nodes from i18n translation block.
 *
 * 从 i18n 翻译块创建动态节点。
 *
 * - Text nodes are created synchronously
 *
 *   文本节点是同步创建的
 *
 * - TNodes are linked into tree lazily
 *
 *   TNode 会延迟链接到树
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @parentTNodeIndex index to the parent TNode of this i18n block
 * @param lView Current `LView`
 *
 * 当前 `LView`
 *
 * @param index Index of `ɵɵi18nStart` instruction.
 *
 * `ɵɵi18nStart` 指令的索引。
 *
 * @param message Message to translate.
 *
 * 要翻译的消息。
 *
 * @param subTemplateIndex Index into the sub template of message translation. (ie in case of
 *     `ngIf`) (-1 otherwise)
 *
 * 对消息翻译的子模板的索引。（即在 `ngIf` 的情况下）（否则为-1）
 *
 */
export function i18nStartFirstCreatePass(
    tView: TView, parentTNodeIndex: number, lView: LView, index: number, message: string,
    subTemplateIndex: number) {
  const rootTNode = getCurrentParentTNode();
  const createOpCodes: I18nCreateOpCodes = [] as any;
  const updateOpCodes: I18nUpdateOpCodes = [] as any;
  const existingTNodeStack: TNode[][] = [[]];
  if (ngDevMode) {
    attachDebugGetter(createOpCodes, i18nCreateOpCodesToString);
    attachDebugGetter(updateOpCodes, i18nUpdateOpCodesToString);
  }

  message = getTranslationForTemplate(message, subTemplateIndex);
  const msgParts = replaceNgsp(message).split(PH_REGEXP);
  for (let i = 0; i < msgParts.length; i++) {
    let value = msgParts[i];
    if ((i & 1) === 0) {
      // Even indexes are text (including bindings & ICU expressions)
      const parts = i18nParseTextIntoPartsAndICU(value);
      for (let j = 0; j < parts.length; j++) {
        let part = parts[j];
        if ((j & 1) === 0) {
          // `j` is odd therefore `part` is string
          const text = part as string;
          ngDevMode && assertString(text, 'Parsed ICU part should be string');
          if (text !== '') {
            i18nStartFirstCreatePassProcessTextNode(
                tView, rootTNode, existingTNodeStack[0], createOpCodes, updateOpCodes, lView, text);
          }
        } else {
          // `j` is Even therefor `part` is an `ICUExpression`
          const icuExpression: IcuExpression = part as IcuExpression;
          // Verify that ICU expression has the right shape. Translations might contain invalid
          // constructions (while original messages were correct), so ICU parsing at runtime may
          // not succeed (thus `icuExpression` remains a string).
          // Note: we intentionally retain the error here by not using `ngDevMode`, because
          // the value can change based on the locale and users aren't guaranteed to hit
          // an invalid string while they're developing.
          if (typeof icuExpression !== 'object') {
            throw new Error(`Unable to parse ICU expression in "${message}" message.`);
          }
          const icuContainerTNode = createTNodeAndAddOpCode(
              tView, rootTNode, existingTNodeStack[0], lView, createOpCodes,
              ngDevMode ? `ICU ${index}:${icuExpression.mainBinding}` : '', true);
          const icuNodeIndex = icuContainerTNode.index;
          ngDevMode &&
              assertGreaterThanOrEqual(
                  icuNodeIndex, HEADER_OFFSET, 'Index must be in absolute LView offset');
          icuStart(tView, lView, updateOpCodes, parentTNodeIndex, icuExpression, icuNodeIndex);
        }
      }
    } else {
      // Odd indexes are placeholders (elements and sub-templates)
      // At this point value is something like: '/#1:2' (originally coming from '�/#1:2�')
      const isClosing = value.charCodeAt(0) === CharCode.SLASH;
      const type = value.charCodeAt(isClosing ? 1 : 0);
      ngDevMode && assertOneOf(type, CharCode.STAR, CharCode.HASH);
      const index = HEADER_OFFSET + Number.parseInt(value.substring((isClosing ? 2 : 1)));
      if (isClosing) {
        existingTNodeStack.shift();
        setCurrentTNode(getCurrentParentTNode()!, false);
      } else {
        const tNode = createTNodePlaceholder(tView, existingTNodeStack[0], index);
        existingTNodeStack.unshift([]);
        setCurrentTNode(tNode, true);
      }
    }
  }

  tView.data[index] = <TI18n>{
    create: createOpCodes,
    update: updateOpCodes,
  };
}

/**
 * Allocate space in i18n Range add create OpCode instruction to create a text or comment node.
 *
 * 在 i18n Range 中分配空间 add create OpCode 指令以创建文本或注释节点。
 *
 * @param tView Current `TView` needed to allocate space in i18n range.
 *
 * 当前 `TView` 需要在 i18n 范围内分配空间。
 *
 * @param rootTNode Root `TNode` of the i18n block. This node determines if the new TNode will be
 *     added as part of the `i18nStart` instruction or as part of the `TNode.insertBeforeIndex`.
 *
 * i18n 块的根 `TNode` 。此节点确定新的 TNode 是作为 `i18nStart` 指令的一部分还是作为
 * `TNode.insertBeforeIndex` 的一部分添加。
 *
 * @param existingTNodes internal state for `addTNodeAndUpdateInsertBeforeIndex`.
 *
 * `addTNodeAndUpdateInsertBeforeIndex` 的内部状态。
 *
 * @param lView Current `LView` needed to allocate space in i18n range.
 *
 * 当前 `LView` 需要在 i18n 范围内分配空间。
 *
 * @param createOpCodes Array storing `I18nCreateOpCodes` where new opCodes will be added.
 *
 * 存储 `I18nCreateOpCodes` 的数组，将在其中添加新的 opCodes。
 *
 * @param text Text to be added when the `Text` or `Comment` node will be created.
 *
 * 创建 `Text` 或 `Comment` 节点时要添加的文本。
 *
 * @param isICU true if a `Comment` node for ICU (instead of `Text`) node should be created.
 *
 * 如果要创建 ICU 的 `Comment` 节点（而不是 `Text`）节点，则为 true 。
 *
 */
function createTNodeAndAddOpCode(
    tView: TView, rootTNode: TNode|null, existingTNodes: TNode[], lView: LView,
    createOpCodes: I18nCreateOpCodes, text: string|null, isICU: boolean): TNode {
  const i18nNodeIdx = allocExpando(tView, lView, 1, null);
  let opCode = i18nNodeIdx << I18nCreateOpCode.SHIFT;
  let parentTNode = getCurrentParentTNode();

  if (rootTNode === parentTNode) {
    // FIXME(misko): A null `parentTNode` should represent when we fall of the `LView` boundary.
    // (there is no parent), but in some circumstances (because we are inconsistent about how we set
    // `previousOrParentTNode`) it could point to `rootTNode` So this is a work around.
    parentTNode = null;
  }
  if (parentTNode === null) {
    // If we don't have a parent that means that we can eagerly add nodes.
    // If we have a parent than these nodes can't be added now (as the parent has not been created
    // yet) and instead the `parentTNode` is responsible for adding it. See
    // `TNode.insertBeforeIndex`
    opCode |= I18nCreateOpCode.APPEND_EAGERLY;
  }
  if (isICU) {
    opCode |= I18nCreateOpCode.COMMENT;
    ensureIcuContainerVisitorLoaded(loadIcuContainerVisitor);
  }
  createOpCodes.push(opCode, text === null ? '' : text);
  // We store `{{?}}` so that when looking at debug `TNodeType.template` we can see where the
  // bindings are.
  const tNode = createTNodeAtIndex(
      tView, i18nNodeIdx, isICU ? TNodeType.Icu : TNodeType.Text,
      text === null ? (ngDevMode ? '{{?}}' : '') : text, null);
  addTNodeAndUpdateInsertBeforeIndex(existingTNodes, tNode);
  const tNodeIdx = tNode.index;
  setCurrentTNode(tNode, false /* Text nodes are self closing */);
  if (parentTNode !== null && rootTNode !== parentTNode) {
    // We are a child of deeper node (rather than a direct child of `i18nStart` instruction.)
    // We have to make sure to add ourselves to the parent.
    setTNodeInsertBeforeIndex(parentTNode, tNodeIdx);
  }
  return tNode;
}

/**
 * Processes text node in i18n block.
 *
 * 处理 i18n 块中的文本节点。
 *
 * Text nodes can have:
 *
 * 文本节点可以有：
 *
 * - Create instruction in `createOpCodes` for creating the text node.
 *
 *   在 `createOpCodes` 中创建用于创建文本节点的指令。
 *
 * - Allocate spec for text node in i18n range of `LView`
 *
 *   为 `LView` 的 i18n 范围中的文本节点分配规范
 *
 * - If contains binding:
 *
 *   如果包含绑定：
 *
 *   - bindings => allocate space in i18n range of `LView` to store the binding value.
 *
 *     binds => 在 `LView` 的 i18n 范围内分配空间来存储绑定值。
 *
 *   - populate `updateOpCodes` with update instructions.
 *
 *     使用更新操作指南填充 `updateOpCodes` 。
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @param rootTNode Root `TNode` of the i18n block. This node determines if the new TNode will
 *     be added as part of the `i18nStart` instruction or as part of the
 *     `TNode.insertBeforeIndex`.
 *
 * i18n 块的根 `TNode` 。此节点确定新的 TNode 是作为 `i18nStart` 指令的一部分还是作为
 * `TNode.insertBeforeIndex` 的一部分添加。
 *
 * @param existingTNodes internal state for `addTNodeAndUpdateInsertBeforeIndex`.
 *
 * `addTNodeAndUpdateInsertBeforeIndex` 的内部状态。
 *
 * @param createOpCodes Location where the creation OpCodes will be stored.
 *
 * 将存储创建的 OpCode 的位置。
 *
 * @param lView Current `LView`
 *
 * 当前 `LView`
 *
 * @param text The translated text (which may contain binding)
 *
 * 翻译后的文本（可能包含绑定）
 *
 */
function i18nStartFirstCreatePassProcessTextNode(
    tView: TView, rootTNode: TNode|null, existingTNodes: TNode[], createOpCodes: I18nCreateOpCodes,
    updateOpCodes: I18nUpdateOpCodes, lView: LView, text: string): void {
  const hasBinding = text.match(BINDING_REGEXP);
  const tNode = createTNodeAndAddOpCode(
      tView, rootTNode, existingTNodes, lView, createOpCodes, hasBinding ? null : text, false);
  if (hasBinding) {
    generateBindingUpdateOpCodes(updateOpCodes, text, tNode.index, null, 0, null);
  }
}

/**
 * See `i18nAttributes` above.
 *
 * 请参阅上面的 `i18nAttributes` 。
 *
 */
export function i18nAttributesFirstPass(tView: TView, index: number, values: string[]) {
  const previousElement = getCurrentTNode()!;
  const previousElementIndex = previousElement.index;
  const updateOpCodes: I18nUpdateOpCodes = [] as any;
  if (ngDevMode) {
    attachDebugGetter(updateOpCodes, i18nUpdateOpCodesToString);
  }
  if (tView.firstCreatePass && tView.data[index] === null) {
    for (let i = 0; i < values.length; i += 2) {
      const attrName = values[i];
      const message = values[i + 1];

      if (message !== '') {
        // Check if attribute value contains an ICU and throw an error if that's the case.
        // ICUs in element attributes are not supported.
        // Note: we intentionally retain the error here by not using `ngDevMode`, because
        // the `value` can change based on the locale and users aren't guaranteed to hit
        // an invalid string while they're developing.
        if (ICU_REGEXP.test(message)) {
          throw new Error(
              `ICU expressions are not supported in attributes. Message: "${message}".`);
        }

        // i18n attributes that hit this code path are guaranteed to have bindings, because
        // the compiler treats static i18n attributes as regular attribute bindings.
        // Since this may not be the first i18n attribute on this element we need to pass in how
        // many previous bindings there have already been.
        generateBindingUpdateOpCodes(
            updateOpCodes, message, previousElementIndex, attrName, countBindings(updateOpCodes),
            null);
      }
    }
    tView.data[index] = updateOpCodes;
  }
}


/**
 * Generate the OpCodes to update the bindings of a string.
 *
 * 生成 OpCodes 以更新字符串的绑定。
 *
 * @param updateOpCodes Place where the update opcodes will be stored.
 *
 * 将存储更新操作码的地方。
 *
 * @param str The string containing the bindings.
 *
 * 包含绑定的字符串。
 *
 * @param destinationNode Index of the destination node which will receive the binding.
 *
 * 将接收绑定的目标节点的索引。
 *
 * @param attrName Name of the attribute, if the string belongs to an attribute.
 *
 * 属性的名称，如果字符串属于某个属性。
 *
 * @param sanitizeFn Sanitization function used to sanitize the string after update, if necessary.
 *
 * 如有必要，用于在更新后清理字符串的清理函数。
 *
 * @param bindingStart The lView index of the next expression that can be bound via an opCode.
 *
 * 可以通过 opCode 绑定的下一个表达式的 lView 索引。
 *
 * @returns
 *
 * The mask value for these bindings
 *
 * 这些绑定的掩码值
 *
 */
function generateBindingUpdateOpCodes(
    updateOpCodes: I18nUpdateOpCodes, str: string, destinationNode: number, attrName: string|null,
    bindingStart: number, sanitizeFn: SanitizerFn|null): number {
  ngDevMode &&
      assertGreaterThanOrEqual(
          destinationNode, HEADER_OFFSET, 'Index must be in absolute LView offset');
  const maskIndex = updateOpCodes.length;  // Location of mask
  const sizeIndex = maskIndex + 1;         // location of size for skipping
  updateOpCodes.push(null, null);          // Alloc space for mask and size
  const startIndex = maskIndex + 2;        // location of first allocation.
  if (ngDevMode) {
    attachDebugGetter(updateOpCodes, i18nUpdateOpCodesToString);
  }
  const textParts = str.split(BINDING_REGEXP);
  let mask = 0;

  for (let j = 0; j < textParts.length; j++) {
    const textValue = textParts[j];

    if (j & 1) {
      // Odd indexes are bindings
      const bindingIndex = bindingStart + parseInt(textValue, 10);
      updateOpCodes.push(-1 - bindingIndex);
      mask = mask | toMaskBit(bindingIndex);
    } else if (textValue !== '') {
      // Even indexes are text
      updateOpCodes.push(textValue);
    }
  }

  updateOpCodes.push(
      destinationNode << I18nUpdateOpCode.SHIFT_REF |
      (attrName ? I18nUpdateOpCode.Attr : I18nUpdateOpCode.Text));
  if (attrName) {
    updateOpCodes.push(attrName, sanitizeFn);
  }
  updateOpCodes[maskIndex] = mask;
  updateOpCodes[sizeIndex] = updateOpCodes.length - startIndex;
  return mask;
}

/**
 * Count the number of bindings in the given `opCodes`.
 *
 * 计算给定的 `opCodes` 中的绑定数。
 *
 * It could be possible to speed this up, by passing the number of bindings found back from
 * `generateBindingUpdateOpCodes()` to `i18nAttributesFirstPass()` but this would then require more
 * complexity in the code and/or transient objects to be created.
 *
 * 可以通过将从 `generateBindingUpdateOpCodes()` 找到的绑定数量传递给 `i18nAttributesFirstPass()`
 * 来加快此过程，但这将需要更复杂的代码和/或要创建的瞬态对象。
 *
 * Since this function is only called once when the template is instantiated, is trivial in the
 * first instance (since `opCodes` will be an empty array), and it is not common for elements to
 * contain multiple i18n bound attributes, it seems like this is a reasonable compromise.
 *
 * 由于此函数仅在模板实例化时调用一次，在第一个实例中很简单（因为 `opCodes`
 * 将是一个空数组），并且元素不常见包含多个 i18n 绑定属性，似乎这是一个合理的妥协。
 *
 */
function countBindings(opCodes: I18nUpdateOpCodes): number {
  let count = 0;
  for (let i = 0; i < opCodes.length; i++) {
    const opCode = opCodes[i];
    // Bindings are negative numbers.
    if (typeof opCode === 'number' && opCode < 0) {
      count++;
    }
  }
  return count;
}

/**
 * Convert binding index to mask bit.
 *
 * 将绑定索引转换为掩码位。
 *
 * Each index represents a single bit on the bit-mask. Because bit-mask only has 32 bits, we make
 * the 32nd bit share all masks for all bindings higher than 32. Since it is extremely rare to
 * have more than 32 bindings this will be hit very rarely. The downside of hitting this corner
 * case is that we will execute binding code more often than necessary. (penalty of performance)
 *
 * 每个索引都表示位掩码上的单个位。因为 bit-mask 只有 32 位，所以我们让第 32 位共享所有高于 32
 * 的绑定的所有掩码。由于很少有超过 32
 * 的绑定，因此很少会被命中。遇到这种极端情况的缺点是我们将比必要的更频繁地执行绑定代码。
 *（绩效处罚）
 *
 */
function toMaskBit(bindingIndex: number): number {
  return 1 << Math.min(bindingIndex, 31);
}

export function isRootTemplateMessage(subTemplateIndex: number): subTemplateIndex is - 1 {
  return subTemplateIndex === -1;
}


/**
 * Removes everything inside the sub-templates of a message.
 *
 * 删除消息子模板中的所有内容。
 *
 */
function removeInnerTemplateTranslation(message: string): string {
  let match;
  let res = '';
  let index = 0;
  let inTemplate = false;
  let tagMatched;

  while ((match = SUBTEMPLATE_REGEXP.exec(message)) !== null) {
    if (!inTemplate) {
      res += message.substring(index, match.index + match[0].length);
      tagMatched = match[1];
      inTemplate = true;
    } else {
      if (match[0] === `${MARKER}/*${tagMatched}${MARKER}`) {
        index = match.index;
        inTemplate = false;
      }
    }
  }

  ngDevMode &&
      assertEqual(
          inTemplate, false,
          `Tag mismatch: unable to find the end of the sub-template in the translation "${
              message}"`);

  res += message.slice(index);
  return res;
}


/**
 * Extracts a part of a message and removes the rest.
 *
 * 提取消息的一部分并删除其余部分。
 *
 * This method is used for extracting a part of the message associated with a template. A
 * translated message can span multiple templates.
 *
 * 此方法用于提取与模板关联的消息的一部分。翻译后的消息可以跨越多个模板。
 *
 * Example:
 *
 * 示例：
 *
 * ```
 * <div i18n>Translate <span *ngIf>me</span>!</div>
 * ```
 *
 * @param message The message to crop
 *
 * 要裁剪的消息
 *
 * @param subTemplateIndex Index of the sub-template to extract. If undefined it returns the
 * external template and removes all sub-templates.
 *
 * 要提取的子模板的索引。如果未定义，则返回外部模板并删除所有子模板。
 *
 */
export function getTranslationForTemplate(message: string, subTemplateIndex: number) {
  if (isRootTemplateMessage(subTemplateIndex)) {
    // We want the root template message, ignore all sub-templates
    return removeInnerTemplateTranslation(message);
  } else {
    // We want a specific sub-template
    const start =
        message.indexOf(`:${subTemplateIndex}${MARKER}`) + 2 + subTemplateIndex.toString().length;
    const end = message.search(new RegExp(`${MARKER}\\/\\*\\d+:${subTemplateIndex}${MARKER}`));
    return removeInnerTemplateTranslation(message.substring(start, end));
  }
}

/**
 * Generate the OpCodes for ICU expressions.
 *
 * 为 ICU 表达式生成 OpCode。
 *
 * @param icuExpression
 * @param index Index where the anchor is stored and an optional `TIcuContainerNode`
 *
 * 存储锚点的索引和可选的 `TIcuContainerNode`
 *
 * - `lView[anchorIdx]` points to a `Comment` node representing the anchor for the ICU.
 *
 *   `lView[anchorIdx]` 指向表示 ICU 锚的 `Comment` 节点。
 *
 * - `tView.data[anchorIdx]` points to the `TIcuContainerNode` if ICU is root (`null` otherwise)
 *
 *   如果 ICU 是根，则 `tView.data[anchorIdx]` 指向 `TIcuContainerNode`（否则为 `null`）
 *
 */
export function icuStart(
    tView: TView, lView: LView, updateOpCodes: I18nUpdateOpCodes, parentIdx: number,
    icuExpression: IcuExpression, anchorIdx: number) {
  ngDevMode && assertDefined(icuExpression, 'ICU expression must be defined');
  let bindingMask = 0;
  const tIcu: TIcu = {
    type: icuExpression.type,
    currentCaseLViewIndex: allocExpando(tView, lView, 1, null),
    anchorIdx,
    cases: [],
    create: [],
    remove: [],
    update: []
  };
  addUpdateIcuSwitch(updateOpCodes, icuExpression, anchorIdx);
  setTIcu(tView, anchorIdx, tIcu);
  const values = icuExpression.values;
  for (let i = 0; i < values.length; i++) {
    // Each value is an array of strings & other ICU expressions
    const valueArr = values[i];
    const nestedIcus: IcuExpression[] = [];
    for (let j = 0; j < valueArr.length; j++) {
      const value = valueArr[j];
      if (typeof value !== 'string') {
        // It is an nested ICU expression
        const icuIndex = nestedIcus.push(value as IcuExpression) - 1;
        // Replace nested ICU expression by a comment node
        valueArr[j] = `<!--�${icuIndex}�-->`;
      }
    }
    bindingMask = parseIcuCase(
                      tView, tIcu, lView, updateOpCodes, parentIdx, icuExpression.cases[i],
                      valueArr.join(''), nestedIcus) |
        bindingMask;
  }
  if (bindingMask) {
    addUpdateIcuUpdate(updateOpCodes, bindingMask, anchorIdx);
  }
}

/**
 * Parses text containing an ICU expression and produces a JSON object for it.
 * Original code from closure library, modified for Angular.
 *
 * 解析包含 ICU 表达式的文本并为其生成 JSON 对象。来自闭包库的原始代码，针对 Angular 进行了修改。
 *
 * @param pattern Text containing an ICU expression that needs to be parsed.
 *
 * 包含需要解析的 ICU 表达式的文本。
 *
 */
export function parseICUBlock(pattern: string): IcuExpression {
  const cases = [];
  const values: (string|IcuExpression)[][] = [];
  let icuType = IcuType.plural;
  let mainBinding = 0;
  pattern = pattern.replace(ICU_BLOCK_REGEXP, function(str: string, binding: string, type: string) {
    if (type === 'select') {
      icuType = IcuType.select;
    } else {
      icuType = IcuType.plural;
    }
    mainBinding = parseInt(binding.slice(1), 10);
    return '';
  });

  const parts = i18nParseTextIntoPartsAndICU(pattern) as string[];
  // Looking for (key block)+ sequence. One of the keys has to be "other".
  for (let pos = 0; pos < parts.length;) {
    let key = parts[pos++].trim();
    if (icuType === IcuType.plural) {
      // Key can be "=x", we just want "x"
      key = key.replace(/\s*(?:=)?(\w+)\s*/, '$1');
    }
    if (key.length) {
      cases.push(key);
    }

    const blocks = i18nParseTextIntoPartsAndICU(parts[pos++]) as string[];
    if (cases.length > values.length) {
      values.push(blocks);
    }
  }

  // TODO(ocombe): support ICU expressions in attributes, see #21615
  return {type: icuType, mainBinding: mainBinding, cases, values};
}


/**
 * Breaks pattern into strings and top level {...} blocks.
 * Can be used to break a message into text and ICU expressions, or to break an ICU expression
 * into keys and cases. Original code from closure library, modified for Angular.
 *
 * 将模式分解为字符串和顶级 {...} 块。可用于将消息拆分为文本和 ICU 表达式，或将 ICU
 * 表达式拆分为键和案例。来自闭包库的原始代码，针对 Angular 进行了修改。
 *
 * @param pattern (sub)Pattern to be broken.
 *
 *（子）要打破的模式。
 *
 * @returns
 *
 * An `Array<string|IcuExpression>` where:
 *
 * 一个 `Array<string|IcuExpression>` ，其中：
 *
 * - odd positions: `string` => text between ICU expressions
 *
 *   奇数位置： `string` => ICU 表达式之间的文本
 *
 * - even positions: `ICUExpression` => ICU expression parsed into `ICUExpression` record.
 *
 *   偶数位置： `ICUExpression` => ICU 表达式解析为 `ICUExpression` 记录。
 *
 */
export function i18nParseTextIntoPartsAndICU(pattern: string): (string|IcuExpression)[] {
  if (!pattern) {
    return [];
  }

  let prevPos = 0;
  const braceStack = [];
  const results: (string|IcuExpression)[] = [];
  const braces = /[{}]/g;
  // lastIndex doesn't get set to 0 so we have to.
  braces.lastIndex = 0;

  let match;
  while (match = braces.exec(pattern)) {
    const pos = match.index;
    if (match[0] == '}') {
      braceStack.pop();

      if (braceStack.length == 0) {
        // End of the block.
        const block = pattern.substring(prevPos, pos);
        if (ICU_BLOCK_REGEXP.test(block)) {
          results.push(parseICUBlock(block));
        } else {
          results.push(block);
        }

        prevPos = pos + 1;
      }
    } else {
      if (braceStack.length == 0) {
        const substring = pattern.substring(prevPos, pos);
        results.push(substring);
        prevPos = pos + 1;
      }
      braceStack.push('{');
    }
  }

  const substring = pattern.substring(prevPos);
  results.push(substring);
  return results;
}


/**
 * Parses a node, its children and its siblings, and generates the mutate & update OpCodes.
 *
 * 解析一个节点、其子项和其同级，并生成 mutate & update OpCodes。
 *
 */
export function parseIcuCase(
    tView: TView, tIcu: TIcu, lView: LView, updateOpCodes: I18nUpdateOpCodes, parentIdx: number,
    caseName: string, unsafeCaseHtml: string, nestedIcus: IcuExpression[]): number {
  const create: IcuCreateOpCodes = [] as any;
  const remove: I18nRemoveOpCodes = [] as any;
  const update: I18nUpdateOpCodes = [] as any;
  if (ngDevMode) {
    attachDebugGetter(create, icuCreateOpCodesToString);
    attachDebugGetter(remove, i18nRemoveOpCodesToString);
    attachDebugGetter(update, i18nUpdateOpCodesToString);
  }
  tIcu.cases.push(caseName);
  tIcu.create.push(create);
  tIcu.remove.push(remove);
  tIcu.update.push(update);

  const inertBodyHelper = getInertBodyHelper(getDocument());
  const inertBodyElement = inertBodyHelper.getInertBodyElement(unsafeCaseHtml);
  ngDevMode && assertDefined(inertBodyElement, 'Unable to generate inert body element');
  const inertRootNode = getTemplateContent(inertBodyElement!) as Element || inertBodyElement;
  if (inertRootNode) {
    return walkIcuTree(
        tView, tIcu, lView, updateOpCodes, create, remove, update, inertRootNode, parentIdx,
        nestedIcus, 0);
  } else {
    return 0;
  }
}

function walkIcuTree(
    tView: TView, tIcu: TIcu, lView: LView, sharedUpdateOpCodes: I18nUpdateOpCodes,
    create: IcuCreateOpCodes, remove: I18nRemoveOpCodes, update: I18nUpdateOpCodes,
    parentNode: Element, parentIdx: number, nestedIcus: IcuExpression[], depth: number): number {
  let bindingMask = 0;
  let currentNode = parentNode.firstChild;
  while (currentNode) {
    const newIndex = allocExpando(tView, lView, 1, null);
    switch (currentNode.nodeType) {
      case Node.ELEMENT_NODE:
        const element = currentNode as Element;
        const tagName = element.tagName.toLowerCase();
        if (VALID_ELEMENTS.hasOwnProperty(tagName)) {
          addCreateNodeAndAppend(create, ELEMENT_MARKER, tagName, parentIdx, newIndex);
          tView.data[newIndex] = tagName;
          const elAttrs = element.attributes;
          for (let i = 0; i < elAttrs.length; i++) {
            const attr = elAttrs.item(i)!;
            const lowerAttrName = attr.name.toLowerCase();
            const hasBinding = !!attr.value.match(BINDING_REGEXP);
            // we assume the input string is safe, unless it's using a binding
            if (hasBinding) {
              if (VALID_ATTRS.hasOwnProperty(lowerAttrName)) {
                if (URI_ATTRS[lowerAttrName]) {
                  generateBindingUpdateOpCodes(
                      update, attr.value, newIndex, attr.name, 0, _sanitizeUrl);
                } else if (SRCSET_ATTRS[lowerAttrName]) {
                  generateBindingUpdateOpCodes(
                      update, attr.value, newIndex, attr.name, 0, sanitizeSrcset);
                } else {
                  generateBindingUpdateOpCodes(update, attr.value, newIndex, attr.name, 0, null);
                }
              } else {
                ngDevMode &&
                    console.warn(
                        `WARNING: ignoring unsafe attribute value ` +
                        `${lowerAttrName} on element ${tagName} ` +
                        `(see https://g.co/ng/security#xss)`);
              }
            } else {
              addCreateAttribute(create, newIndex, attr);
            }
          }
          // Parse the children of this node (if any)
          bindingMask = walkIcuTree(
                            tView, tIcu, lView, sharedUpdateOpCodes, create, remove, update,
                            currentNode as Element, newIndex, nestedIcus, depth + 1) |
              bindingMask;
          addRemoveNode(remove, newIndex, depth);
        }
        break;
      case Node.TEXT_NODE:
        const value = currentNode.textContent || '';
        const hasBinding = value.match(BINDING_REGEXP);
        addCreateNodeAndAppend(create, null, hasBinding ? '' : value, parentIdx, newIndex);
        addRemoveNode(remove, newIndex, depth);
        if (hasBinding) {
          bindingMask =
              generateBindingUpdateOpCodes(update, value, newIndex, null, 0, null) | bindingMask;
        }
        break;
      case Node.COMMENT_NODE:
        // Check if the comment node is a placeholder for a nested ICU
        const isNestedIcu = NESTED_ICU.exec(currentNode.textContent || '');
        if (isNestedIcu) {
          const nestedIcuIndex = parseInt(isNestedIcu[1], 10);
          const icuExpression: IcuExpression = nestedIcus[nestedIcuIndex];
          // Create the comment node that will anchor the ICU expression
          addCreateNodeAndAppend(
              create, ICU_MARKER, ngDevMode ? `nested ICU ${nestedIcuIndex}` : '', parentIdx,
              newIndex);
          icuStart(tView, lView, sharedUpdateOpCodes, parentIdx, icuExpression, newIndex);
          addRemoveNestedIcu(remove, newIndex, depth);
        }
        break;
    }
    currentNode = currentNode.nextSibling;
  }
  return bindingMask;
}

function addRemoveNode(remove: I18nRemoveOpCodes, index: number, depth: number) {
  if (depth === 0) {
    remove.push(index);
  }
}

function addRemoveNestedIcu(remove: I18nRemoveOpCodes, index: number, depth: number) {
  if (depth === 0) {
    remove.push(~index);  // remove ICU at `index`
    remove.push(index);   // remove ICU comment at `index`
  }
}

function addUpdateIcuSwitch(
    update: I18nUpdateOpCodes, icuExpression: IcuExpression, index: number) {
  update.push(
      toMaskBit(icuExpression.mainBinding), 2, -1 - icuExpression.mainBinding,
      index << I18nUpdateOpCode.SHIFT_REF | I18nUpdateOpCode.IcuSwitch);
}

function addUpdateIcuUpdate(update: I18nUpdateOpCodes, bindingMask: number, index: number) {
  update.push(bindingMask, 1, index << I18nUpdateOpCode.SHIFT_REF | I18nUpdateOpCode.IcuUpdate);
}

function addCreateNodeAndAppend(
    create: IcuCreateOpCodes, marker: null|ICU_MARKER|ELEMENT_MARKER, text: string,
    appendToParentIdx: number, createAtIdx: number) {
  if (marker !== null) {
    create.push(marker);
  }
  create.push(
      text, createAtIdx,
      icuCreateOpCode(IcuCreateOpCode.AppendChild, appendToParentIdx, createAtIdx));
}

function addCreateAttribute(create: IcuCreateOpCodes, newIndex: number, attr: Attr) {
  create.push(newIndex << IcuCreateOpCode.SHIFT_REF | IcuCreateOpCode.Attr, attr.name, attr.value);
}
