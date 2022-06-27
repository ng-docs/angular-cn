/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SanitizerFn} from './sanitization';


/**
 * Stores a list of nodes which need to be removed.
 *
 * 存储需要删除的节点列表。
 *
 * Numbers are indexes into the `LView`
 *
 * 数字是 `LView` 的索引
 *
 * - index > 0: `removeRNode(lView[0])`
 *
 *   索引> 0： `removeRNode(lView[0])`
 *
 * - index &lt; 0: `removeICU(~lView[0])`
 *
 *   索引 &lt; 0： `removeICU(~lView[0])`
 *
 */
export interface I18nRemoveOpCodes extends Array<number> {
  __brand__: 'I18nRemoveOpCodes';
}

/**
 * `I18nMutateOpCode` defines OpCodes for `I18nMutateOpCodes` array.
 *
 * `I18nMutateOpCode` 为 `I18nMutateOpCodes` 数组定义 OpCodes。
 *
 * OpCodes are efficient operations which can be applied to the DOM to update it. (For example to
 * update to a new ICU case requires that we clean up previous elements and create new ones.)
 *
 * OpCodes 是高效的操作，可以应用于 DOM 以更新它。 （例如，要更新到新的 ICU
 * 病例，需要我们清理以前的元素并创建新元素。）
 *
 * OpCodes contain three parts:
 *  1) Parent node index offset. (p)
 *  2) Reference node index offset. (r)
 *  3) The instruction to execute. (i)
 *
 * OpCodes 包含三部分： 1）父节点索引偏移量。 (p) 2) 参考节点索引偏移量。 (r) 3) 要执行的指令。
 * （一）
 *
 * pppp pppp pppp pppp rrrr rrrr rrrr riii
 * 3322 2222 2222 1111 1111 1110 0000 0000
 * 1098 7654 3210 9876 5432 1098 7654 3210
 *
 * ```
 * var parent = lView[opCode >>> SHIFT_PARENT];
 * var refNode = lView[((opCode & MASK_REF) >>> SHIFT_REF)];
 * var instruction = opCode & MASK_OPCODE;
 * ```
 *
 * See: `I18nCreateOpCodes` for example of usage.
 *
 * 有关用法的示例，请参阅： `I18nCreateOpCodes` 。
 *
 */
export const enum IcuCreateOpCode {
  /**
   * Stores shift amount for bits 17-3 that contain reference index.
   *
   * 存储包含引用索引的第 17-3 位的移位量。
   *
   */
  SHIFT_REF = 1,
  /**
   * Stores shift amount for bits 31-17 that contain parent index.
   *
   * 存储包含父索引的第 31-17 位的移位量。
   *
   */
  SHIFT_PARENT = 17,
  /**
   * Mask for OpCode
   *
   * 操作码的掩码
   *
   */
  MASK_INSTRUCTION = 0b1,

  /**
   * Mask for the Reference node (bits 16-3)
   *
   * 参考节点的掩码（第 16-3 位）
   *
   */
  MASK_REF = 0b11111111111111110,
  //           11111110000000000
  //           65432109876543210

  /**
   * Instruction to append the current node to `PARENT`.
   *
   * 将当前节点附加到 `PARENT` 的指令。
   *
   */
  AppendChild = 0b0,

  /**
   * Instruction to set the attribute of a node.
   *
   * 设置节点属性的指令。
   *
   */
  Attr = 0b1,
}


/**
 * Array storing OpCode for dynamically creating `i18n` blocks.
 *
 * 存储 OpCode 以动态创建 `i18n` 块的数组。
 *
 * Example:
 *
 * 示例：
 *
 * ```ts
 * <I18nCreateOpCode>[
 *   // For adding text nodes
 *   // ---------------------
 *   // Equivalent to:
 *   //   lView[1].appendChild(lView[0] = document.createTextNode('xyz'));
 *   'xyz', 0, 1 << SHIFT_PARENT | 0 << SHIFT_REF | AppendChild,
 *
 *   // For adding element nodes
 *   // ---------------------
 *   // Equivalent to:
 *   //   lView[1].appendChild(lView[0] = document.createElement('div'));
 *   ELEMENT_MARKER, 'div', 0, 1 << SHIFT_PARENT | 0 << SHIFT_REF | AppendChild,
 *
 *   // For adding comment nodes
 *   // ---------------------
 *   // Equivalent to:
 *   //   lView[1].appendChild(lView[0] = document.createComment(''));
 *   ICU_MARKER, '', 0, 1 << SHIFT_PARENT | 0 << SHIFT_REF | AppendChild,
 *
 *   // For moving existing nodes to a different location
 *   // --------------------------------------------------
 *   // Equivalent to:
 *   //   const node = lView[1];
 *   //   lView[2].appendChild(node);
 *   1 << SHIFT_REF | Select, 2 << SHIFT_PARENT | 0 << SHIFT_REF | AppendChild,
 *
 *   // For removing existing nodes
 *   // --------------------------------------------------
 *   //   const node = lView[1];
 *   //   removeChild(tView.data(1), node, lView);
 *   1 << SHIFT_REF | Remove,
 *
 *   // For writing attributes
 *   // --------------------------------------------------
 *   //   const node = lView[1];
 *   //   node.setAttribute('attr', 'value');
 *   1 << SHIFT_REF | Attr, 'attr', 'value'
 * ];
 * ```
 *
 */
export interface IcuCreateOpCodes extends Array<number|string|ELEMENT_MARKER|ICU_MARKER|null>,
                                          I18nDebug {
  __brand__: 'I18nCreateOpCodes';
}

export const enum I18nUpdateOpCode {
  /**
   * Stores shift amount for bits 17-2 that contain reference index.
   *
   * 存储包含引用索引的第 17-2 位的移位量。
   *
   */
  SHIFT_REF = 2,
  /**
   * Mask for OpCode
   *
   * 操作码的掩码
   *
   */
  MASK_OPCODE = 0b11,

  /**
   * Instruction to update a text node.
   *
   * 更新文本节点的操作指南。
   *
   */
  Text = 0b00,
  /**
   * Instruction to update a attribute of a node.
   *
   * 更新节点属性的指令。
   *
   */
  Attr = 0b01,
  /**
   * Instruction to switch the current ICU case.
   *
   * 切换当前 ICU 病例的操作指南。
   *
   */
  IcuSwitch = 0b10,
  /**
   * Instruction to update the current ICU case.
   *
   * 更新当前 ICU 病例的操作指南。
   *
   */
  IcuUpdate = 0b11,
}

/**
 * Marks that the next string is an element name.
 *
 * 标记下一个字符串是元素名称。
 *
 * See `I18nMutateOpCodes` documentation.
 *
 * 请参阅 `I18nMutateOpCodes` 文档。
 *
 */
export const ELEMENT_MARKER: ELEMENT_MARKER = {
  marker: 'element'
};
export interface ELEMENT_MARKER {
  marker: 'element';
}

/**
 * Marks that the next string is comment text need for ICU.
 *
 * 标记下一个字符串是 ICU 需要的注释文本。
 *
 * See `I18nMutateOpCodes` documentation.
 *
 * 请参阅 `I18nMutateOpCodes` 文档。
 *
 */
export const ICU_MARKER: ICU_MARKER = {
  marker: 'ICU'
};

export interface ICU_MARKER {
  marker: 'ICU';
}

export interface I18nDebug {
  /**
   * Human readable representation of the OpCode arrays.
   *
   * OpCode 数组的人类可读表示。
   *
   * NOTE: This property only exists if `ngDevMode` is set to `true` and it is not present in
   * production. Its presence is purely to help debug issue in development, and should not be relied
   * on in production application.
   *
   * 注意：仅当 `ngDevMode` 设置为 `true`
   * 并且生产中不存在此属性时才存在。它的存在纯粹是为了帮助调试开发中的问题，不应在生产应用程序中依赖。
   *
   */
  debug?: string[];
}

/**
 * Array storing OpCode for dynamically creating `i18n` translation DOM elements.
 *
 * 存储 OpCode 的数组，用于动态创建 `i18n` 翻译 DOM 元素。
 *
 * This array creates a sequence of `Text` and `Comment` (as ICU anchor) DOM elements. It consists
 * of a pair of `number` and `string` pairs which encode the operations for the creation of the
 * translated block.
 *
 * 此数组创建一系列 `Text` 和 `Comment` （作为 ICU 锚）的 DOM 元素。它由一对 `number` 和 `string`
 * 对组成，它们对创建翻译块的操作进行编码。
 *
 * The number is shifted and encoded according to `I18nCreateOpCode`
 *
 * 数字会根据 `I18nCreateOpCode` 进行移位和编码
 *
 * Pseudocode:
 *
 * 伪代码：
 *
 * ```
 * const i18nCreateOpCodes = [
 *   10 << I18nCreateOpCode.SHIFT, "Text Node add to DOM",
 *   11 << I18nCreateOpCode.SHIFT | I18nCreateOpCode.COMMENT, "Comment Node add to DOM",
 *   12 << I18nCreateOpCode.SHIFT | I18nCreateOpCode.APPEND_LATER, "Text Node added later"
 * ];
 *
 * for(var i=0; i<i18nCreateOpCodes.length; i++) {
 *   const opcode = i18NCreateOpCodes[i++];
 *   const index = opcode >> I18nCreateOpCode.SHIFT;
 *   const text = i18NCreateOpCodes[i];
 *   let node: Text|Comment;
 *   if (opcode & I18nCreateOpCode.COMMENT === I18nCreateOpCode.COMMENT) {
 *     node = lView[~index] = document.createComment(text);
 *   } else {
 *     node = lView[index] = document.createText(text);
 *   }
 *   if (opcode & I18nCreateOpCode.APPEND_EAGERLY !== I18nCreateOpCode.APPEND_EAGERLY) {
 *     parentNode.appendChild(node);
 *   }
 * }
 * ```
 *
 */
export interface I18nCreateOpCodes extends Array<number|string>, I18nDebug {
  __brand__: 'I18nCreateOpCodes';
}

/**
 * See `I18nCreateOpCodes`
 *
 * 请参阅 `I18nCreateOpCodes`
 *
 */
export enum I18nCreateOpCode {
  /**
   * Number of bits to shift index so that it can be combined with the `APPEND_EAGERLY` and
   * `COMMENT`.
   *
   * 要移动索引的位数，以便它可以与 `APPEND_EAGERLY` 和 `COMMENT` 结合使用。
   *
   */
  SHIFT = 2,

  /**
   * Should the node be appended to parent imedditatly after creation.
   *
   * 创建后，节点是否应该立即附加到父级。
   *
   */
  APPEND_EAGERLY = 0b01,

  /**
   * If set the node should be comment (rather than a text) node.
   *
   * 如果设置了，则节点应该是注释（而不是文本）节点。
   *
   */
  COMMENT = 0b10,
}


/**
 * Stores DOM operations which need to be applied to update DOM render tree due to changes in
 * expressions.
 *
 * 存储由于表达式的更改而需要用于更新 DOM 渲染树的 DOM 操作。
 *
 * The basic idea is that `i18nExp` OpCodes capture expression changes and update a change
 * mask bit. (Bit 1 for expression 1, bit 2 for expression 2 etc..., bit 32 for expression 32 and
 * higher.) The OpCodes then compare its own change mask against the expression change mask to
 * determine if the OpCodes should execute.
 *
 * 基本思想是 `i18nExp` OpCodes 捕获表达式更改并更新更改掩码位。 （表达式 1 的位 1，表达式 2 的位 2
 * 等……，表达式 32 及更高版本的位 32 。）然后，OpCodes
 * 将其自己的更改掩码与表达式更改掩码进行比较，以确定 OpCodes 是否应该执行。
 *
 * NOTE: 32nd bit is special as it says 32nd or higher. This way if we have more than 32 bindings
 * the code still works, but with lower efficiency. (it is unlikely that a translation would have
 * more than 32 bindings.)
 *
 * 注：第 32 位是特殊的，因为它表示 32nd 或更高。这样，如果我们有超过 32
 * 个绑定，代码仍然可以工作，但效率较低。 （翻译不太可能有超过 32 个绑定。）
 *
 * These OpCodes can be used by both the i18n block as well as ICU sub-block.
 *
 * 这些 OpCode 可以由 i18n 块以及 ICU 子块使用。
 *
 * ## Example
 *
 * ## 例子
 *
 * Assume
 *
 * 假设
 *
 * ```ts
 *   if (rf & RenderFlags.Update) {
 *    i18nExp(ctx.exp1); // If changed set mask bit 1
 *    i18nExp(ctx.exp2); // If changed set mask bit 2
 *    i18nExp(ctx.exp3); // If changed set mask bit 3
 *    i18nExp(ctx.exp4); // If changed set mask bit 4
 *    i18nApply(0);            // Apply all changes by executing the OpCodes.
 *  }
 * ```
 *
 * We can assume that each call to `i18nExp` sets an internal `changeMask` bit depending on the
 * index of `i18nExp`.
 *
 * 我们可以假设每次对 i18nExp 的调用都根据 `i18nExp` 的索引设置一个内部 `changeMask` `i18nExp` 。
 *
 * ### OpCodes
 *
 * ### 操作码
 *
 * ```ts
 * <I18nUpdateOpCodes>[
 *   // The following OpCodes represent: `<div i18n-title="pre{{exp1}}in{{exp2}}post">`
 *   // If `changeMask & 0b11`
 *   //        has changed then execute update OpCodes.
 *   //        has NOT changed then skip `8` values and start processing next OpCodes.
 *   0b11, 8,
 *   // Concatenate `newValue = 'pre'+lView[bindIndex-4]+'in'+lView[bindIndex-3]+'post';`.
 *   'pre', -4, 'in', -3, 'post',
 *   // Update attribute: `elementAttribute(1, 'title', sanitizerFn(newValue));`
 *   1 << SHIFT_REF | Attr, 'title', sanitizerFn,
 *
 *   // The following OpCodes represent: `<div i18n>Hello {{exp3}}!">`
 *   // If `changeMask & 0b100`
 *   //        has changed then execute update OpCodes.
 *   //        has NOT changed then skip `4` values and start processing next OpCodes.
 *   0b100, 4,
 *   // Concatenate `newValue = 'Hello ' + lView[bindIndex -2] + '!';`.
 *   'Hello ', -2, '!',
 *   // Update text: `lView[1].textContent = newValue;`
 *   1 << SHIFT_REF | Text,
 *
 *   // The following OpCodes represent: `<div i18n>{exp4, plural, ... }">`
 *   // If `changeMask & 0b1000`
 *   //        has changed then execute update OpCodes.
 *   //        has NOT changed then skip `2` values and start processing next OpCodes.
 *   0b1000, 2,
 *   // Concatenate `newValue = lView[bindIndex -1];`.
 *   -1,
 *   // Switch ICU: `icuSwitchCase(lView[1], 0, newValue);`
 *   0 << SHIFT_ICU | 1 << SHIFT_REF | IcuSwitch,
 *
 *   // Note `changeMask & -1` is always true, so the IcuUpdate will always execute.
 *   -1, 1,
 *   // Update ICU: `icuUpdateCase(lView[1], 0);`
 *   0 << SHIFT_ICU | 1 << SHIFT_REF | IcuUpdate,
 *
 * ];
 * ```
 *
 */
export interface I18nUpdateOpCodes extends Array<string|number|SanitizerFn|null>, I18nDebug {
  __brand__: 'I18nUpdateOpCodes';
}

/**
 * Store information for the i18n translation block.
 *
 * 存储 i18n 翻译块的信息。
 *
 */
export interface TI18n {
  /**
   * A set of OpCodes which will create the Text Nodes and ICU anchors for the translation blocks.
   *
   * 一组 OpCodes，它将为翻译块创建文本节点和 ICU 锚。
   *
   * NOTE: The ICU anchors are filled in with ICU Update OpCode.
   *
   * 注： ICU 锚点使用 ICU Update OpCode 填充。
   *
   */
  create: I18nCreateOpCodes;

  /**
   * A set of OpCodes which will be executed on each change detection to determine if any changes to
   * DOM are required.
   *
   * 一组 OpCodes，将在每次更改检测时执行，以确定是否需要对 DOM 进行任何更改。
   *
   */
  update: I18nUpdateOpCodes;
}

/**
 * Defines the ICU type of `select` or `plural`
 *
 * 定义 `select` 或 `plural` 的 ICU 类型
 *
 */
export const enum IcuType {
  select = 0,
  plural = 1,
}

export interface TIcu {
  /**
   * Defines the ICU type of `select` or `plural`
   *
   * 定义 `select` 或 `plural` 的 ICU 类型
   *
   */
  type: IcuType;

  /**
   * Index in `LView` where the anchor node is stored. `<!-- ICU 0:0 -->`
   *
   * `LView` 中存储锚节点的索引。 `<!-- ICU 0:0 -->`
   *
   */
  anchorIdx: number;

  /**
   * Currently selected ICU case pointer.
   *
   * 当前选择的 ICU 病例指针。
   *
   * `lView[currentCaseLViewIndex]` stores the currently selected case. This is needed to know how
   * to clean up the current case when transitioning no the new case.
   *
   * `lView[currentCaseLViewIndex]` 存储当前选择的案例。这需要知道在不转换新案例时如何清理当前案例。
   *
   * If the value stored is:
   * `null`: No current case selected.
   *   `<0`: A flag which means that the ICU just switched and that `icuUpdate` must be executed
   *         regardless of the `mask`. (After the execution the flag is cleared)
   *   `>=0` A currently selected case index.
   *
   * 如果存储的值为： `null` ：未选择当前案例。 `<0` ：一个标志，这意味着 ICU 刚刚切换，并且无论
   * `mask` 如何，都必须执行 `icuUpdate` 。 （执行后，标志被清除） `>=0` 当前选择的案例索引。
   *
   */
  currentCaseLViewIndex: number;

  /**
   * A list of case values which the current ICU will try to match.
   *
   * 当前 ICU 将尝试匹配的 case 值列表。
   *
   * The last value is `other`
   *
   * 最后一个值为 `other`
   *
   */
  cases: any[];

  /**
   * A set of OpCodes to apply in order to build up the DOM render tree for the ICU
   *
   * 要应用的一组操作码，以便为 ICU 构建 DOM 渲染树
   *
   */
  create: IcuCreateOpCodes[];

  /**
   * A set of OpCodes to apply in order to destroy the DOM render tree for the ICU.
   *
   * 要应用的一组操作码，以破坏 ICU 的 DOM 渲染树。
   *
   */
  remove: I18nRemoveOpCodes[];

  /**
   * A set of OpCodes to apply in order to update the DOM render tree for the ICU bindings.
   *
   * 要应用的一组 OpCode ，以更新 ICU 绑定的 DOM 渲染树。
   *
   */
  update: I18nUpdateOpCodes[];
}

// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;

/**
 * Parsed ICU expression
 *
 * 解析的 ICU 表达式
 *
 */
export interface IcuExpression {
  type: IcuType;
  mainBinding: number;
  cases: string[];
  values: (string|IcuExpression)[][];
}
