/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {KeyValueArray} from '../../util/array_utils';
import {TStylingRange} from '../interfaces/styling';

import {TIcu} from './i18n';
import {CssSelector} from './projection';
import {RNode} from './renderer_dom';
import {LView, TView} from './view';


/**
 * TNodeType corresponds to the {@link TNode} `type` property.
 *
 * TNodeType 对应于 {@link TNode} `type` 属性。
 *
 * NOTE: type IDs are such that we use each bit to denote a type. This is done so that we can easily
 * check if the `TNode` is of more than one type.
 *
 * 注意：类型 ID 是这样的，我们可以用每个位来表示一种类型。这样做是为了我们可以轻松检查 `TNode`
 * 是否属于一种以上。
 *
 * `if (tNode.type === TNodeType.Text || tNode.type === TNode.Element)`
 * can be written as:
 * `if (tNode.type & (TNodeType.Text | TNodeType.Element))`
 *
 * `if (tNode.type === TNodeType.Text || tNode.type === TNode.Element)` 可以写为： `if (tNode.type &
 * (TNodeType.Text | TNodeType.Element))`
 *
 * However any given `TNode` can only be of one type.
 *
 * 但是，任何给定的 `TNode` 都只能是一种类型。
 *
 */
export const enum TNodeType {
  /**
   * The TNode contains information about a DOM element aka {@link RText}.
   *
   * TNode 包含有关 DOM 元素的信息，即 {@link RText} 。
   *
   */
  Text = 0b1,

  /**
   * The TNode contains information about a DOM element aka {@link RElement}.
   *
   * TNode 包含有关 DOM 元素的信息，即 {@link RElement} 。
   *
   */
  Element = 0b10,

  /**
   * The TNode contains information about an {@link LContainer} for embedded views.
   *
   * TNode 包含有关嵌入式视图的 {@link LContainer} 的信息。
   *
   */
  Container = 0b100,

  /**
   * The TNode contains information about an `<ng-container>` element {@link RNode}.
   *
   * TNode 包含有关 `<ng-container>` 元素 {@link RNode} 的信息。
   *
   */
  ElementContainer = 0b1000,

  /**
   * The TNode contains information about an `<ng-content>` projection
   *
   * TNode 包含有关 `<ng-content>` 投影的信息
   *
   */
  Projection = 0b10000,

  /**
   * The TNode contains information about an ICU comment used in `i18n`.
   *
   * TNode 包含有关 `i18n` 中使用的 ICU 注释的信息。
   *
   */
  Icu = 0b100000,

  /**
   * Special node type representing a placeholder for future `TNode` at this location.
   *
   * 表示此位置未来 `TNode` 的占位符的特殊节点类型。
   *
   * I18n translation blocks are created before the element nodes which they contain. (I18n blocks
   * can span over many elements.) Because i18n `TNode`s (representing text) are created first they
   * often may need to point to element `TNode`s which are not yet created. In such a case we create
   * a `Placeholder` `TNode`. This allows the i18n to structurally link the `TNode`s together
   * without knowing any information about the future nodes which will be at that location.
   *
   * I18n 翻译块是在它们包含的元素节点之前创建的。（I18n 块可以跨越许多元素。）因为 i18n `TNode`
   *（表示文本）是首先创建的，它们通常可能需要指向尚未创建的元素 `TNode`
   * 。在这种情况下，我们创建一个 `Placeholder` `TNode` 。这允许 i18n 在结构 `TNode`
   * 链接在一起，而不知道有关将在该位置的未来节点的任何信息。
   *
   * On `firstCreatePass` When element instruction executes it will try to create a `TNode` at that
   * location. Seeing a `Placeholder` `TNode` already there tells the system that it should reuse
   * existing `TNode` (rather than create a new one) and just update the missing information.
   *
   * 在 `firstCreatePass` 当 element 指令执行时，它将尝试在该位置创建一个 `TNode`
   * 。看到那里已经有一个 `Placeholder` `TNode` ，告诉系统它应该重用现有的 `TNode`
   *（而不是创建新的），并更新缺失的信息。
   *
   */
  Placeholder = 0b1000000,

  // Combined Types These should never be used for `TNode.type` only as a useful way to check
  // if `TNode.type` is one of several choices.

  // See: https://github.com/microsoft/TypeScript/issues/35875 why we can't refer to existing enum.
  AnyRNode = 0b11,        // Text | Element,
  AnyContainer = 0b1100,  // Container | ElementContainer, // See:
}

/**
 * Converts `TNodeType` into human readable text.
 * Make sure this matches with `TNodeType`
 *
 * 将 `TNodeType` 转换为人类可读的文本。确保这与 `TNodeType`
 *
 */
export function toTNodeTypeAsString(tNodeType: TNodeType): string {
  let text = '';
  (tNodeType & TNodeType.Text) && (text += '|Text');
  (tNodeType & TNodeType.Element) && (text += '|Element');
  (tNodeType & TNodeType.Container) && (text += '|Container');
  (tNodeType & TNodeType.ElementContainer) && (text += '|ElementContainer');
  (tNodeType & TNodeType.Projection) && (text += '|Projection');
  (tNodeType & TNodeType.Icu) && (text += '|IcuContainer');
  (tNodeType & TNodeType.Placeholder) && (text += '|Placeholder');
  return text.length > 0 ? text.substring(1) : text;
}

/**
 * Corresponds to the TNode.flags property.
 *
 * 对应于 TNode.flags 属性。
 *
 */
export const enum TNodeFlags {
  /**
   * Bit #1 - This bit is set if the node is a host for any directive (including a component)
   *
   * 位 #1 - 如果节点是任何指令（包括组件）的主机，则设置此位
   *
   */
  isDirectiveHost = 0x1,

  /**
   * Bit #2 - This bit is set if the node is a host for a component.
   *
   * 位 #2 - 如果节点是组件的主机，则设置此位。
   *
   * Setting this bit implies that the `isDirectiveHost` bit is set as well.
   *
   * 设置此位意味着也设置了 `isDirectiveHost` 位。
   *
   */
  isComponentHost = 0x2,

  /**
   * Bit #3 - This bit is set if the node has been projected
   *
   * 位 #3 - 如果已投影节点，则设置此位
   *
   */
  isProjected = 0x4,

  /**
   * Bit #4 - This bit is set if any directive on this node has content queries
   *
   * 位 #4 - 如果此节点上的任何指令有内容查询，则设置此位
   *
   */
  hasContentQuery = 0x8,

  /**
   * Bit #5 - This bit is set if the node has any "class" inputs
   *
   * 位 #5 - 如果节点有任何“类”输入，则设置此位
   *
   */
  hasClassInput = 0x10,

  /**
   * Bit #6 - This bit is set if the node has any "style" inputs
   *
   * 位 #6 -如果节点有任何“style”输入，则设置此位
   *
   */
  hasStyleInput = 0x20,

  /**
   * Bit #7 This bit is set if the node has been detached by i18n
   *
   * 位 #7 如果节点已被 i18n 分离，则设置此位
   *
   */
  isDetached = 0x40,

  /**
   * Bit #8 - This bit is set if the node has directives with host bindings.
   *
   * 位 #8 - 如果节点有带有主机绑定的指令，则设置此位。
   *
   * This flags allows us to guard host-binding logic and invoke it only on nodes
   * that actually have directives with host bindings.
   *
   * 此标志允许我们保护主机绑定逻辑，并仅在实际上具有使用主机绑定的指令的节点上调用它。
   *
   */
  hasHostBindings = 0x80,
}

/**
 * Corresponds to the TNode.providerIndexes property.
 *
 * 对应于 TNode.providerIndexes 属性。
 *
 */
export const enum TNodeProviderIndexes {
  /**
   * The index of the first provider on this node is encoded on the least significant bits.
   *
   * 此节点上的第一个提供程序的索引在最低有效位上编码。
   *
   */
  ProvidersStartIndexMask = 0b00000000000011111111111111111111,

  /**
   * The count of view providers from the component on this node is
   * encoded on the 20 most significant bits.
   *
   * 此节点上组件的视图提供程序的计数在 20 个最高有效位上编码。
   *
   */
  CptViewProvidersCountShift = 20,
  CptViewProvidersCountShifter = 0b00000000000100000000000000000000,
}

/**
 * A set of marker values to be used in the attributes arrays. These markers indicate that some
 * items are not regular attributes and the processing should be adapted accordingly.
 *
 * 要在属性数组中使用的一组标记值。这些标记表明某些条目不是常规属性，应相应地调整处理。
 *
 */
export const enum AttributeMarker {
  /**
   * An implicit marker which indicates that the value in the array are of `attributeKey`,
   * `attributeValue` format.
   *
   * 一个隐式标记，表明数组中的值是 `attributeKey` , `attributeValue` 格式。
   *
   * NOTE: This is implicit as it is the type when no marker is present in array. We indicate that
   * it should not be present at runtime by the negative number.
   *
   * 注意：这是隐式的，因为它是数组中不存在标记时的类型。我们表明它不应该在运行时出现负数。
   *
   */
  ImplicitAttributes = -1,

  /**
   * Marker indicates that the following 3 values in the attributes array are:
   * namespaceUri, attributeName, attributeValue
   * in that order.
   *
   * 标记表明 properties 数组中的以下 3 个值依次是： namespaceUri、attributeName、attributeValue 。
   *
   */
  NamespaceURI = 0,

  /**
   * Signals class declaration.
   *
   * 信号类声明。
   *
   * Each value following `Classes` designates a class name to include on the element.
   *
   * `Classes` 后面的每个值都指定要包含在元素中的类名。
   *
   * ## Example:
   *
   * ## 示例：
   *
   * Given:
   *
   * 给定：
   *
   * ```
   * <div class="foo bar baz">...<d/vi>
   * ```
   *
   * the generated code is:
   *
   * 生成的代码是：
   *
   * ```
   * var _c1 = [AttributeMarker.Classes, 'foo', 'bar', 'baz'];
   * ```
   *
   */
  Classes = 1,

  /**
   * Signals style declaration.
   *
   * 信号风格声明。
   *
   * Each pair of values following `Styles` designates a style name and value to include on the
   * element.
   *
   * `Styles` 后面的每对值都指定要包含在元素中的样式名称和值。
   *
   * ## Example:
   *
   * ## 示例：
   *
   * Given:
   *
   * 给定：
   *
   * ```
   * <div style="width:100px; height:200px; color:red">...</div>
   * ```
   *
   * the generated code is:
   *
   * 生成的代码是：
   *
   * ```
   * var _c1 = [AttributeMarker.Styles, 'width', '100px', 'height'. '200px', 'color', 'red'];
   * ```
   *
   */
  Styles = 2,

  /**
   * Signals that the following attribute names were extracted from input or output bindings.
   *
   * 表明以下属性名称是从输入或输出绑定中提取的。
   *
   * For example, given the following HTML:
   *
   * 例如，给定以下 HTML：
   *
   * ```
   * <div moo="car" [foo]="exp" (bar)="doSth()">
   * ```
   *
   * the generated code is:
   *
   * 生成的代码是：
   *
   * ```
   * var _c1 = ['moo', 'car', AttributeMarker.Bindings, 'foo', 'bar'];
   * ```
   *
   */
  Bindings = 3,

  /**
   * Signals that the following attribute names were hoisted from an inline-template declaration.
   *
   * 表明以下属性名称是从内联模板声明中提升的。
   *
   * For example, given the following HTML:
   *
   * 例如，给定以下 HTML：
   *
   * ```
   * <div *ngFor="let value of values; trackBy:trackBy" dirA [dirB]="value">
   * ```
   *
   * the generated code for the `template()` instruction would include:
   *
   * 为 `template()` 指令生成的代码将包括：
   *
   * ```
   * ['dirA', '', AttributeMarker.Bindings, 'dirB', AttributeMarker.Template, 'ngFor', 'ngForOf',
   * 'ngForTrackBy', 'let-value']
   * ```
   *
   * while the generated code for the `element()` instruction inside the template function would
   * include:
   *
   * 而模板函数中 `element()` 指令的生成代码将包括：
   *
   * ```
   * ['dirA', '', AttributeMarker.Bindings, 'dirB']
   * ```
   *
   */
  Template = 4,

  /**
   * Signals that the following attribute is `ngProjectAs` and its value is a parsed
   * `CssSelector`.
   *
   * 表明以下属性是 `ngProjectAs` ，其值是解析后的 `CssSelector` 。
   *
   * For example, given the following HTML:
   *
   * 例如，给定以下 HTML：
   *
   * ```
   * <h1 attr="value" ngProjectAs="[title]">
   * ```
   *
   * the generated code for the `element()` instruction would include:
   *
   * 为 `element()` 指令生成的代码将包括：
   *
   * ```
   * ['attr', 'value', AttributeMarker.ProjectAs, ['', 'title', '']]
   * ```
   *
   */
  ProjectAs = 5,

  /**
   * Signals that the following attribute will be translated by runtime i18n
   *
   * 表明以下属性将由运行时 i18n 翻译的信号
   *
   * For example, given the following HTML:
   *
   * 例如，给定以下 HTML：
   *
   * ```
   * <div moo="car" foo="value" i18n-foo [bar]="binding" i18n-bar>
   * ```
   *
   * the generated code is:
   *
   * 生成的代码是：
   *
   * ```
   * var _c1 = ['moo', 'car', AttributeMarker.I18n, 'foo', 'bar'];
   * ```
   *
   */
  I18n = 6,
}

/**
 * A combination of:
 *
 * 的组合：
 *
 * - Attribute names and values.
 *
 *   属性名称和值。
 *
 * - Special markers acting as flags to alter attributes processing.
 *
 *   作为标志来更改属性处理的特殊标记。
 *
 * - Parsed ngProjectAs selectors.
 *
 *   解析的 ngProjectAs 选择器。
 *
 */
export type TAttributes = (string|AttributeMarker|CssSelector)[];

/**
 * Constants that are associated with a view. Includes:
 *
 * 与视图关联的常量。包括：
 *
 * - Attribute arrays.
 *
 *   属性数组。
 *
 * - Local definition arrays.
 *
 *   本地定义数组。
 *
 * - Translated messages (i18n).
 *
 *   翻译的消息 (i18n)。
 *
 */
export type TConstants = (TAttributes|string)[];

/**
 * Factory function that returns an array of consts. Consts can be represented as a function in
 * case any additional statements are required to define consts in the list. An example is i18n
 * where additional i18n calls are generated, which should be executed when consts are requested
 * for the first time.
 *
 * 返回 const 数组的工厂函数。 Consts 可以表示为函数，以防需要任何额外的语句来在列表中定义
 * consts。一个例子是 i18n ，它会生成额外的 i18n 调用，应该在第一次请求 const 时执行。
 *
 */
export type TConstantsFactory = () => TConstants;

/**
 * TConstants type that describes how the `consts` field is generated on ComponentDef: it can be
 * either an array or a factory function that returns that array.
 *
 * 描述如何在 ComponentDef 上生成 `consts` 字段的 TConstants
 * 类型：它可以是数组或返回该数组的工厂函数。
 *
 */
export type TConstantsOrFactory = TConstants|TConstantsFactory;

/**
 * Binding data (flyweight) for a particular node that is shared between all templates
 * of a specific type.
 *
 * 在特定类型的所有模板之间共享的特定节点的绑定数据（享元）。
 *
 * If a property is:
 *
 * 如果一个属性是：
 *
 * - PropertyAliases: that property's data was generated and this is it
 *
 *   PropertyAliases：已生成该属性的数据，就是这样
 *
 * - Null: that property's data was already generated and nothing was found.
 *
 *   null：该属性的数据已经生成，并且未找到任何内容。
 *
 * - Undefined: that property's data has not yet been generated
 *
 *   未定义：该属性的数据尚未生成
 *
 * see: <https://en.wikipedia.org/wiki/Flyweight_pattern> for more on the Flyweight pattern
 *
 * 有关 Flyweight 模式的更多信息，请参阅： <https://en.wikipedia.org/wiki/Flyweight_pattern>
 *
 */
export interface TNode {
  /**
   * The type of the TNode. See TNodeType.
   *
   * TNode 的类型。请参阅 TNodeType 。
   *
   */
  type: TNodeType;

  /**
   * Index of the TNode in TView.data and corresponding native element in LView.
   *
   * TView.data 中 TNode 的索引和 LView 中相应的本机元素。
   *
   * This is necessary to get from any TNode to its corresponding native element when
   * traversing the node tree.
   *
   * 在遍历节点树时，这是从任何 TNode 获取其对应的本机元素所必需的。
   *
   * If index is -1, this is a dynamically created container node or embedded view node.
   *
   * 如果 index 为 -1，则这是动态创建的容器节点或嵌入式视图节点。
   *
   */
  index: number;

  /**
   * Insert before existing DOM node index.
   *
   * 在现有的 DOM 节点索引之前插入。
   *
   * When DOM nodes are being inserted, normally they are being appended as they are created.
   * Under i18n case, the translated text nodes are created ahead of time as part of the
   * `ɵɵi18nStart` instruction which means that this `TNode` can't just be appended and instead
   * needs to be inserted using `insertBeforeIndex` semantics.
   *
   * 插入 DOM 节点时，通常它们会在创建时被附加。在 i18n 情况下，翻译后的文本节点会作为 `ɵɵi18nStart`
   * 指令的一部分提前创建，这意味着此 `TNode` 不能只是附加，而是需要使用 `insertBeforeIndex`
   * 语义来插入。
   *
   * Additionally sometimes it is necessary to insert new text nodes as a child of this `TNode`. In
   * such a case the value stores an array of text nodes to insert.
   *
   * 此外，有时有必要插入新的文本节点作为此 `TNode`
   * 的子项。在这种情况下，该值存储要插入的文本节点数组。
   *
   * Example:
   *
   * 示例：
   *
   * ```
   * <div i18n>
   *   Hello <span>World</span>!
   * </div>
   * ```
   *
   * In the above example the `ɵɵi18nStart` instruction can create `Hello`, `World` and `!` text
   * nodes. It can also insert `Hello` and `!` text node as a child of `<div>`, but it can't
   * insert `World` because the `<span>` node has not yet been created. In such a case the
   * `<span>` `TNode` will have an array which will direct the `<span>` to not only insert
   * itself in front of `!` but also to insert the `World` (created by `ɵɵi18nStart`) into
   * `<span>` itself.
   *
   * 在上面的示例中，`ɵɵi18nStart` 指令可以创建 `Hello`、`World` 和 `!` 文本节点。它还可以插入
   * `Hello` 和 `!` text 节点作为 `<div>` 的子项，但它无法插入 `World` ，因为 `<span>`
   * 节点尚未创建。在这种情况下，`<span>` `TNode` 将有一个数组，该数组将指导 `<span>`
   * 不仅将自己插入到 `!` 还要将 `World`（由 `ɵɵi18nStart` 创建）插入 `<span>` 本身。
   *
   * Pseudo code:
   *
   * 伪代码：
   *
   * ```
   *   if (insertBeforeIndex === null) {
   *     // append as normal
   *   } else if (Array.isArray(insertBeforeIndex)) {
   *     // First insert current `TNode` at correct location
   *     const currentNode = lView[this.index];
   *     parentNode.insertBefore(currentNode, lView[this.insertBeforeIndex[0]]);
   *     // Now append all of the children
   *     for(let i=1; i<this.insertBeforeIndex; i++) {
   *       currentNode.appendChild(lView[this.insertBeforeIndex[i]]);
   *     }
   *   } else {
   *     parentNode.insertBefore(lView[this.index], lView[this.insertBeforeIndex])
   *   }
   * ```
   *
   * - null: Append as normal using `parentNode.appendChild`
   *
   *   null：使用 `parentNode.appendChild` 正常附加
   *
   * - `number`: Append using
   *      `parentNode.insertBefore(lView[this.index], lView[this.insertBeforeIndex])`
   *
   *   `number` ：使用 `parentNode.insertBefore(lView[this.index], lView[this.insertBeforeIndex])`
   *
   * *Initialization*
   *
   * *初始化*
   *
   * Because `ɵɵi18nStart` executes before nodes are created, on `TView.firstCreatePass` it is not
   * possible for `ɵɵi18nStart` to set the `insertBeforeIndex` value as the corresponding `TNode`
   * has not yet been created. For this reason the `ɵɵi18nStart` creates a `TNodeType.Placeholder`
   * `TNode` at that location. See `TNodeType.Placeholder` for more information.
   *
   * 因为 `ɵɵi18nStart` 会在创建节点之前执行，因此在 TView.firstCreatePass 上
   * `TView.firstCreatePass` `ɵɵi18nStart` 设置 `insertBeforeIndex` 值，因为尚未创建对应的 `TNode`
   * 。出于这个原因，`ɵɵi18nStart` 会在该位置创建一个 `TNodeType.Placeholder` `TNode`
   * 。有关更多信息，请参阅 `TNodeType.Placeholder` 。
   *
   */
  insertBeforeIndex: InsertBeforeIndex;

  /**
   * The index of the closest injector in this node's LView.
   *
   * 此节点的 LView 中最近的注入器的索引。
   *
   * If the index === -1, there is no injector on this node or any ancestor node in this view.
   *
   * 如果索引 === -1，则此节点或此视图中的任何祖先节点上没有注入器。
   *
   * If the index !== -1, it is the index of this node's injector OR the index of a parent
   * injector in the same view. We pass the parent injector index down the node tree of a view so
   * it's possible to find the parent injector without walking a potentially deep node tree.
   * Injector indices are not set across view boundaries because there could be multiple component
   * hosts.
   *
   * 如果索引 !== -1
   * ，则它是此节点的注入器的索引或同一个视图中父注入器的索引。我们将父注入器索引沿着视图的节点树传递，因此可以在不走可能很深的节点树的情况下找到父注入器。注入器索引不会跨视图边界设置，因为可能有多个组件主机。
   *
   * If tNode.injectorIndex === tNode.parent.injectorIndex, then the index belongs to a parent
   * injector.
   *
   * 如果 tNode.injectorIndex === tNode.parent.injectorIndex ，则该索引属于父注入器。
   *
   */
  injectorIndex: number;

  /**
   * Stores starting index of the directives.
   *
   * 存储指令的起始索引。
   *
   * NOTE: The first directive is always component (if present).
   *
   * 注意：第一个指令始终是 component（如果存在）。
   *
   */
  directiveStart: number;

  /**
   * Stores final exclusive index of the directives.
   *
   * 存储指令的最终排他索引。
   *
   * The area right behind the `directiveStart-directiveEnd` range is used to allocate the
   * `HostBindingFunction` `vars` (or null if no bindings.) Therefore `directiveEnd` is used to set
   * `LFrame.bindingRootIndex` before `HostBindingFunction` is executed.
   *
   * `directiveStart-directiveEnd` 范围后面的区域用于分配 `HostBindingFunction` `vars`
   *（如果没有绑定，则为 null）。因此，`directiveEnd` 用于在执行 `LFrame.bindingRootIndex`
   * 之前设置 `HostBindingFunction` 。
   *
   */
  directiveEnd: number;

  /**
   * Stores the last directive which had a styling instruction.
   *
   * 存储最后一个具有样式指令的指令。
   *
   * Initial value of this is `-1` which means that no `hostBindings` styling instruction has
   * executed. As `hostBindings` instructions execute they set the value to the index of the
   * `DirectiveDef` which contained the last `hostBindings` styling instruction.
   *
   * this 的初始值为 `-1` ，这意味着没有执行 `hostBindings` 样式指令。当 `hostBindings`
   * 指令执行时，它们将值设置为包含最后一个 `hostBindings` 样式指令的 `DirectiveDef` 的索引。
   *
   * Valid values are:
   *
   * 有效值为：
   *
   * - `-1` No `hostBindings` instruction has executed.
   *
   *   `-1` 没有执行 `hostBindings` 指令。
   *
   * - `directiveStart <= directiveStylingLast < directiveEnd`: Points to the `DirectiveDef` of
   *   the last styling instruction which executed in the `hostBindings`.
   *
   *   `directiveStart <= directiveStylingLast < directiveEnd` ：指向在 `hostBindings`
   * 中执行的最后一个样式指令的 `DirectiveDef` 。
   *
   * This data is needed so that styling instructions know which static styling data needs to be
   * collected from the `DirectiveDef.hostAttrs`. A styling instruction needs to collect all data
   * since last styling instruction.
   *
   * 需要这些数据，以便样式说明知道需要从 `DirectiveDef.hostAttrs`
   * 收集哪些静态样式数据。样式说明需要收集自上一次样式说明以来的所有数据。
   *
   */
  directiveStylingLast: number;

  /**
   * Stores indexes of property bindings. This field is only set in the ngDevMode and holds
   * indexes of property bindings so TestBed can get bound property metadata for a given node.
   *
   * 存储属性绑定的索引。此字段仅在 ngDevMode 中设置，并保存属性绑定的索引，因此 TestBed
   * 可以获取给定节点的绑定属性元数据。
   *
   */
  propertyBindings: number[]|null;

  /**
   * Stores if Node isComponent, isProjected, hasContentQuery, hasClassInput and hasStyleInput
   * etc.
   *
   * 存储 Node isComponent、isProjected、hasContentQuery、hasClassInput 和 hasStyleInput 等。
   *
   */
  flags: TNodeFlags;

  /**
   * This number stores two values using its bits:
   *
   * 此数字使用其位存储两个值：
   *
   * - the index of the first provider on that node (first 16 bits)
   *
   *   该节点上第一个提供程序的索引（前 16 位）
   *
   * - the count of view providers from the component on this node (last 16 bits)
   *
   *   此节点上组件的视图提供者的计数（最后 16 位）
   *
   */
  // TODO(misko): break this into actual vars.
  providerIndexes: TNodeProviderIndexes;

  /**
   * The value name associated with this node.
   * if type:
   *   `TNodeType.Text`: text value
   *   `TNodeType.Element`: tag name
   *   `TNodeType.ICUContainer`: `TIcu`
   *
   * 与此节点关联的值名称。如果类型： `TNodeType.Text` ：文本值 `TNodeType.Element` ：标签名称
   * `TNodeType.ICUContainer` ： `TIcu`
   *
   */
  value: any;

  /**
   * Attributes associated with an element. We need to store attributes to support various
   * use-cases (attribute injection, content projection with selectors, directives matching).
   * Attributes are stored statically because reading them from the DOM would be way too slow for
   * content projection and queries.
   *
   * 与元素关联的属性。我们需要存储属性以支持各种用例（属性注入、使用选择器的内容投影、指令匹配）。属性是静态存储的，因为从
   * DOM 读取它们对于内容投影和查询来说太慢了。
   *
   * Since attrs will always be calculated first, they will never need to be marked undefined by
   * other instructions.
   *
   * 由于 attrs 将始终首先计算，因此它们永远不需要被其他指令标记为 undefined 。
   *
   * For regular attributes a name of an attribute and its value alternate in the array.
   * e.g. ['role', 'checkbox']
   * This array can contain flags that will indicate "special attributes" (attributes with
   * namespaces, attributes extracted from bindings and outputs).
   *
   * 对于常规属性，属性的名称及其值在数组中交替出现。例如['role', 'checkbox']['role',
   * 'checkbox']此数组可以包含表明“特殊属性”的标志（带有命名空间的属性、从绑定和输出中提取的属性）。
   *
   */
  attrs: TAttributes|null;

  /**
   * Same as `TNode.attrs` but contains merged data across all directive host bindings.
   *
   * 与 `TNode.attrs` 相同，但包含跨所有指令主机绑定的合并数据。
   *
   * We need to keep `attrs` as unmerged so that it can be used for attribute selectors.
   * We merge attrs here so that it can be used in a performant way for initial rendering.
   *
   * 我们需要将 `attrs` 保持为未合并，以便它可用于属性选择器。我们在这里合并
   * attrs，以便可以用高性能的方式进行初始渲染。
   *
   * The `attrs` are merged in first pass in following order:
   *
   * `attrs` 会在第一遍中按以下顺序合并：
   *
   * - Component's `hostAttrs`
   *
   *   组件的 `hostAttrs`
   *
   * - Directives' `hostAttrs`
   *
   *   指令的 `hostAttrs`
   *
   * - Template `TNode.attrs` associated with the current `TNode`.
   *
   *   与当前 `TNode.attrs` 关联的模板 `TNode` 。
   *
   */
  mergedAttrs: TAttributes|null;

  /**
   * A set of local names under which a given element is exported in a template and
   * visible to queries. An entry in this array can be created for different reasons:
   *
   * 一组本地名称，给定元素在其下在模板中导出并且对查询可见。可以出于不同的原因创建此数组中的条目：
   *
   * - an element itself is referenced, ex.: `<div #foo>`
   *
   *   引用了元素本身，例如： `<div #foo>`
   *
   * - a component is referenced, ex.: `<my-cmpt #foo>`
   *
   *   引用了一个组件，例如： `<my-cmpt #foo>`
   *
   * - a directive is referenced, ex.: `<my-cmpt #foo="directiveExportAs">`.
   *
   *   引用了指令，例如： `<my-cmpt #foo="directiveExportAs">` 。
   *
   * A given element might have different local names and those names can be associated
   * with a directive. We store local names at even indexes while odd indexes are reserved
   * for directive index in a view (or `-1` if there is no associated directive).
   *
   * 给定的元素可能有不同的本地名称，这些名称可以与指令相关联。我们将本地名称存储在偶数索引处，而奇数索引是为视图中的指令索引保留的（如果没有关联的指令，则为
   * `-1`）。
   *
   * Some examples:
   *
   * 一些例子：
   *
   * - `<div #foo>` => `["foo", -1]`
   *
   * - `<my-cmpt #foo>` => `["foo", myCmptIdx]`
   *
   * - `<my-cmpt #foo #bar="directiveExportAs">` => `["foo", myCmptIdx, "bar", directiveIdx]`
   *
   * - `<div #foo #bar="directiveExportAs">` => `["foo", -1, "bar", directiveIdx]`
   *
   */
  localNames: (string|number)[]|null;

  /**
   * Information about input properties that need to be set once from attribute data.
   *
   * 有关需要从属性数据设置一次的输入属性的信息。
   *
   */
  initialInputs: InitialInputData|null|undefined;

  /**
   * Input data for all directives on this node. `null` means that there are no directives with
   * inputs on this node.
   *
   * 此节点上所有指令的输入数据。 `null` 意味着此节点上没有带有输入的指令。
   *
   */
  inputs: PropertyAliases|null;

  /**
   * Output data for all directives on this node. `null` means that there are no directives with
   * outputs on this node.
   *
   * 此节点上所有指令的输出数据。 `null` 意味着此节点上没有带有输出的指令。
   *
   */
  outputs: PropertyAliases|null;

  /**
   * The TView or TViews attached to this node.
   *
   * 附加到此节点的 TView 或 TView。
   *
   * If this TNode corresponds to an LContainer with inline views, the container will
   * need to store separate static data for each of its view blocks (TView\[]). Otherwise,
   * nodes in inline views with the same index as nodes in their parent views will overwrite
   * each other, as they are in the same template.
   *
   * 如果此 TNode 对应于具有内联视图的 LContainer，则容器将需要为每个视图块 (TView\[])
   * 存储单独的静态数据。否则，内联视图中与父视图中的节点具有相同索引的节点将彼此覆盖，因为它们在同一个模板中。
   *
   * Each index in this array corresponds to the static data for a certain
   * view. So if you had V(0) and V(1) in a container, you might have:
   *
   * 此数组中的每个索引都对应于某个视图的静态数据。因此，如果你在容器中有 V(0) 和 V(1) ，你可能有：
   *
   * \[
   *   [{tagName: 'div', attrs: ...}, null],     // V(0) TView
   *   [{tagName: 'button', attrs ...}, null]    // V(1) TView
   *
   * \[ [{tagName: 'div', attrs: ...} , null][{tagName: 'div', attrs: ...}, null] , // V(0) TView
   * [{tagName: 'button', attrs ...}, null][{tagName: 'button', attrs ...}, null] // V(1) TView
   *
   * If this TNode corresponds to an LContainer with a template (e.g. structural
   * directive), the template's TView will be stored here.
   *
   * 如果此 TNode 对应于带有模板（例如结构指令）的 LContainer，则模板的 TView 将存储在这里。
   *
   * If this TNode corresponds to an element, tViews will be null .
   *
   * 如果此 TNode 对应于一个元素，则 tViews 将是 null 。
   *
   */
  tViews: TView|TView[]|null;

  /**
   * The next sibling node. Necessary so we can propagate through the root nodes of a view
   * to insert them or remove them from the DOM.
   *
   * 下一个兄弟节点。这是必要的，因此我们可以通过视图的根节点进行传播以插入它们或从 DOM 中删除它们。
   *
   */
  next: TNode|null;

  /**
   * The next projected sibling. Since in Angular content projection works on the node-by-node
   * basis the act of projecting nodes might change nodes relationship at the insertion point
   * (target view). At the same time we need to keep initial relationship between nodes as
   * expressed in content view.
   *
   * 下一个投影的同级。由于在 Angular
   * 内容投影中逐个节点工作，因此投影节点的行为可能会更改插入点（目标视图）的节点关系。同时，我们需要保持内容视图中表示的节点之间的初始关系。
   *
   */
  projectionNext: TNode|null;

  /**
   * First child of the current node.
   *
   * 当前节点的第一个子项。
   *
   * For component nodes, the child will always be a ContentChild (in same view).
   * For embedded view nodes, the child will be in their child view.
   *
   * 对于组件节点，子节点将始终是 ContentChild
   *（在同一个视图中）。对于嵌入式视图节点，子项将在他们的子视图中。
   *
   */
  child: TNode|null;

  /**
   * Parent node (in the same view only).
   *
   * 父节点（仅在同一个视图中）。
   *
   * We need a reference to a node's parent so we can append the node to its parent's native
   * element at the appropriate time.
   *
   * 我们需要对节点的父级的引用，以便我们可以在适当的时候将节点附加到其父级的本机元素。
   *
   * If the parent would be in a different view (e.g. component host), this property will be null.
   * It's important that we don't try to cross component boundaries when retrieving the parent
   * because the parent will change (e.g. index, attrs) depending on where the component was
   * used (and thus shouldn't be stored on TNode). In these cases, we retrieve the parent through
   * LView.node instead (which will be instance-specific).
   *
   * 如果父级在不同的视图中（例如组件主机），则此属性将是 null
   * 。重要的是，我们在检索父级时不要尝试跨越组件边界，因为父级会根据组件的使用位置而更改（例如
   * index、attrs）（因此不应该存储在 TNode 上）。在这些情况下，我们改为通过 LView.node
   * 检索父级（这将是特定于实例的）。
   *
   * If this is an inline view node (V), the parent will be its container.
   *
   * 如果这是一个内联视图节点 (V)，则父级将是其容器。
   *
   */
  parent: TElementNode|TContainerNode|null;

  /**
   * List of projected TNodes for a given component host element OR index into the said nodes.
   *
   * 给定组件主机元素的投影 TNode 列表或到所述节点的索引。
   *
   * For easier discussion assume this example:
   * `<parent>`'s view definition:
   *
   * 为了更轻松的讨论，假设有这个例子： `<parent>` 的视图定义：
   *
   * ```
   * <child id="c1">content1</child>
   * <child id="c2"><span>content2</span></child>
   * ```
   *
   * `<child>`'s view definition:
   *
   * `<child>` 的视图定义：
   *
   * ```
   * <ng-content id="cont1"></ng-content>
   * ```
   *
   * If `Array.isArray(projection)` then `TNode` is a host element:
   *
   * 如果 `Array.isArray(projection)` 则 `TNode` 是宿主元素：
   *
   * - `projection` stores the content nodes which are to be projected.
   *
   *   `projection` 存储要投影的内容节点。
   *
   *   - The nodes represent categories defined by the selector: For example:
   *     `<ng-content/><ng-content select="abc"/>` would represent the heads for `<ng-content/>`
   *     and `<ng-content select="abc"/>` respectively.
   *
   *     节点表示选择器定义的类别：例如： `<ng-content/><ng-content select="abc"/>` 将表示
   * `<ng-content/>` 和 `<ng-content select="abc"/>` 的头部 `<ng-content select="abc"/>` 分别。
   *
   *   - The nodes we store in `projection` are heads only, we used `.next` to get their
   *     siblings.
   *
   *     我们在 `projection` 中存储的节点只是头，我们用 `.next` 来获取它们的兄弟姐妹。
   *
   *   - The nodes `.next` is sorted/rewritten as part of the projection setup.
   *
   *     节点 `.next` 被作为投影设置的一部分进行排序/重写。
   *
   *   - `projection` size is equal to the number of projections `<ng-content>`. The size of
   *     `c1` will be `1` because `<child>` has only one `<ng-content>`.
   *
   *     `projection` 大小等于投影 `<ng-content>` 的数量。 `c1` 的大小将是 `1` ，因为 `<child>`
   * 只有一个 `<ng-content>` 。
   *
   * - we store `projection` with the host (`c1`, `c2`) rather than the `<ng-content>` (`cont1`)
   *     because the same component (`<child>`) can be used in multiple locations (`c1`, `c2`) and
   *   as a result have different set of nodes to project.
   *
   *   我们使用主机（`c1` , `c2`）而不是 `<ng-content>`（`cont1`）存储 `projection`
   * ，因为同一个组件（`<child>`）可以在多个位置（`c1` , `c2`）使用，因此有不同的要投影的节点。
   *
   * - without `projection` it would be difficult to efficiently traverse nodes to be projected.
   *
   *   没有 `projection` ，就很难有效地遍历要投影的节点。
   *
   * If `typeof projection == 'number'` then `TNode` is a `<ng-content>` element:
   *
   * 如果 typeofprojection `typeof projection == 'number'` 则 `TNode` 是 `<ng-content>` 元素：
   *
   * - `projection` is an index of the host's `projection`Nodes.
   *
   *   `projection` 是主机的 `projection` 节点的索引。
   *
   *   - This would return the first head node to project:
   *     `getHost(currentTNode).projection[currentTNode.projection]`.
   *
   *     这将把第一个头节点返回到 project：
   * `getHost(currentTNode).projection[currentTNode.projection]` 。
   *
   * - When projecting nodes the parent node retrieved may be a `<ng-content>` node, in which case
   *   the process is recursive in nature.
   *
   *   投影节点时，检索到的父节点可能是 `<ng-content>` 节点，在这种情况下，该过程本质上是递归的。
   *
   * If `projection` is of type `RNode[][]` than we have a collection of native nodes passed as
   * projectable nodes during dynamic component creation.
   *
   * 如果 `projection` 的类型是 `RNode[][]`
   * ，则我们有一个在动态组件创建期间作为可投影节点传递的本机节点集合。
   *
   */
  projection: (TNode|RNode[])[]|number|null;

  /**
   * A collection of all `style` static values for an element (including from host).
   *
   * 元素的所有 `style` 静态值的集合（包括来自主机的）。
   *
   * This field will be populated if and when:
   *
   * 在以下情况下将填充此字段：
   *
   * - There are one or more initial `style`s on an element (e.g. `<div style="width:200px;">`)
   *
   *   元素上有一个或多个初始 `style`（例如 `<div style="width:200px;">`）
   *
   * - There are one or more initial `style`s on a directive/component host
   *   (e.g. `@Directive({host: {style: "width:200px;" } }`)
   *
   *   指令/组件主机上有一个或多个初始 `style`（例如 `@Directive({host: {style: "width:200px;" } }`
   *）
   *
   */
  styles: string|null;


  /**
   * A collection of all `style` static values for an element excluding host sources.
   *
   * 元素的所有 `style` 静态值的集合，不包括主机源。
   *
   * Populated when there are one or more initial `style`s on an element
   * (e.g. `<div style="width:200px;">`)
   * Must be stored separately from `tNode.styles` to facilitate setting directive
   * inputs that shadow the `style` property. If we used `tNode.styles` as is for shadowed inputs,
   * we would feed host styles back into directives as "inputs". If we used `tNode.attrs`, we
   * would have to concatenate the attributes on every template pass. Instead, we process once on
   * first create pass and store here.
   *
   * 当元素上有一个或多个初始 `style` 时填充（例如 `<div style="width:200px;">`）必须与
   * `tNode.styles` 分开存储，以便利设置会影响 `style` 属性的指令输入。如果我们将 `tNode.styles`
   * 原样用于阴影输入，我们会将主机样式作为“输入”反馈到指令中。如果我们使用 `tNode.attrs`
   * ，我们将不得不连接每个模板传递上的属性。相反，我们在第一次创建传递时处理一次并在此存储。
   *
   */
  stylesWithoutHost: string|null;

  /**
   * A `KeyValueArray` version of residual `styles`.
   *
   * 残差 `styles` 的 `KeyValueArray` 版本。
   *
   * When there are styling instructions than each instruction stores the static styling
   * which is of lower priority than itself. This means that there may be a higher priority
   * styling than the instruction.
   *
   * 当有样式指令时，每条指令都会存储优先级比自身低的静态样式。这意味着可能有比指令更高优先级的样式。
   *
   * Imagine:
   *
   * 想象一下：
   *
   * ```
   * <div style="color: highest;" my-dir>
   * ```
   *
   * @Directive ({
   *   host: {
   *     style: 'color: lowest; ',
   *     '[styles.color]': 'exp' // ɵɵstyleProp('color', ctx.exp);
   *   }
   * })
   * ```
   *
   * In the above case:
   * - `color: lowest` is stored with `ɵɵstyleProp('color', ctx.exp);` instruction
   * -  `color: highest` is the residual and is stored here.
   *
   * - `undefined': not initialized.
   * - `null`: initialized but `styles` is `null`
   * - `KeyValueArray`: parsed version of `styles`.
   */
  residualStyles: KeyValueArray<any>|undefined|null;

  /**
   * A collection of all class static values for an element (including from host).
   *
   * 元素的所有类静态值的集合（包括来自主机的）。
   *
   * This field will be populated if and when:
   *
   * 在以下情况下将填充此字段：
   *
   * - There are one or more initial classes on an element (e.g. `<div class="one two three">`)
   *
   *   元素上有一个或多个初始类（例如 `<div class="one two three">`）
   *
   * - There are one or more initial classes on an directive/component host
   *   (e.g. `@Directive({host: {class: "SOME_CLASS" } }`)
   *
   *   指令/组件主机上有一个或多个初始类（例如 `@Directive({host: {class: "SOME_CLASS" } }`）
   *
   */
  classes: string|null;

  /**
   * A collection of all class static values for an element excluding host sources.
   *
   * 元素的所有类静态值的集合，不包括主机源。
   *
   * Populated when there are one or more initial classes on an element
   * (e.g. `<div class="SOME_CLASS">`)
   * Must be stored separately from `tNode.classes` to facilitate setting directive
   * inputs that shadow the `class` property. If we used `tNode.classes` as is for shadowed
   * inputs, we would feed host classes back into directives as "inputs". If we used
   * `tNode.attrs`, we would have to concatenate the attributes on every template pass. Instead,
   * we process once on first create pass and store here.
   *
   * 当元素上有一个或多个初始类时填充（例如 `<div class="SOME_CLASS">`）必须与 `tNode.classes`
   * 分开存储，以便利设置隐藏 `class` 属性的指令输入。如果我们按原样使用 `tNode.classes`
   * 作为阴影输入，我们会将主机类作为“输入”反馈到指令中。如果我们使用 `tNode.attrs`
   * ，我们将不得不连接每个模板传递上的属性。相反，我们在第一次创建传递时处理一次并在此存储。
   *
   */
  classesWithoutHost: string|null;

  /**
   * A `KeyValueArray` version of residual `classes`.
   *
   * 残差 `classes` 的 `KeyValueArray` 版本。
   *
   * Same as `TNode.residualStyles` but for classes.
   *
   * 与 `TNode.residualStyles` 相同，但适用于类。
   *
   * - \`undefined': not initialized.
   *
   *   “未定义”：未初始化。
   *
   * - `null`: initialized but `classes` is `null`
   *
   *   `null` ：已初始化但 `classes` 为 `null`
   *
   * - `KeyValueArray`: parsed version of `classes`.
   *
   *   `KeyValueArray` ： `classes` 的解析版本。
   *
   */
  residualClasses: KeyValueArray<any>|undefined|null;

  /**
   * Stores the head/tail index of the class bindings.
   *
   * 存储类绑定的头/尾索引。
   *
   * - If no bindings, the head and tail will both be 0.
   *
   *   如果没有绑定，则头部和尾部都将是 0。
   *
   * - If there are template bindings, stores the head/tail of the class bindings in the template.
   *
   *   如果有模板绑定，则将类绑定的头/尾存储在模板中。
   *
   * - If no template bindings but there are host bindings, the head value will point to the last
   *   host binding for "class" (not the head of the linked list), tail will be 0.
   *
   *   如果没有模板绑定但有主机绑定，则 head 值将指向 “class”
   * 的最后一个主机绑定（不是链表的头），tail 将是 0。
   *
   * See: `style_binding_list.ts` for details.
   *
   * 有关详细信息，请参阅： `style_binding_list.ts` 。
   *
   * This is used by `insertTStylingBinding` to know where the next styling binding should be
   * inserted so that they can be sorted in priority order.
   *
   * `insertTStylingBinding`
   * 用它来了解下一个样式绑定应该插入的位置，以便可以按优先级顺序对它们进行排序。
   *
   */
  classBindings: TStylingRange;

  /**
   * Stores the head/tail index of the class bindings.
   *
   * 存储类绑定的头/尾索引。
   *
   * - If no bindings, the head and tail will both be 0.
   *
   *   如果没有绑定，则头部和尾部都将是 0。
   *
   * - If there are template bindings, stores the head/tail of the style bindings in the template.
   *
   *   如果有模板绑定，则将样式绑定的头/尾存储在模板中。
   *
   * - If no template bindings but there are host bindings, the head value will point to the last
   *   host binding for "style" (not the head of the linked list), tail will be 0.
   *
   *   如果没有模板绑定但有主机绑定，则 head 值将指向 “style”
   * 的最后一个主机绑定（不是链表的头），tail 将是 0。
   *
   * See: `style_binding_list.ts` for details.
   *
   * 有关详细信息，请参阅： `style_binding_list.ts` 。
   *
   * This is used by `insertTStylingBinding` to know where the next styling binding should be
   * inserted so that they can be sorted in priority order.
   *
   * `insertTStylingBinding`
   * 用它来了解下一个样式绑定应该插入的位置，以便可以按优先级顺序对它们进行排序。
   *
   */
  styleBindings: TStylingRange;
}

/**
 * See `TNode.insertBeforeIndex`
 *
 * 请参阅 `TNode.insertBeforeIndex`
 *
 */
export type InsertBeforeIndex = null|number|number[];

/**
 * Static data for an element
 *
 * 元素的静态数据
 *
 */
export interface TElementNode extends TNode {
  /**
   * Index in the data\[] array
   *
   * data\[] 数组中的索引
   *
   */
  index: number;
  child: TElementNode|TTextNode|TElementContainerNode|TContainerNode|TProjectionNode|null;
  /**
   * Element nodes will have parents unless they are the first node of a component or
   * embedded view (which means their parent is in a different view and must be
   * retrieved using viewData[HOST_NODE]).
   *
   * 元素节点将有父节点，除非它们是组件或嵌入式视图的第一个节点（这意味着它们的父节点在不同的视图中，必须使用
   * viewData [HOST_NODE][HOST_NODE]检索）。
   *
   */
  parent: TElementNode|TElementContainerNode|null;
  tViews: null;

  /**
   * If this is a component TNode with projection, this will be an array of projected
   * TNodes or native nodes (see TNode.projection for more info). If it's a regular element node
   * or a component without projection, it will be null.
   *
   * 如果这是带有投影的组件 TNode，则这将是投影 TNode 或本机节点的数组（有关更多信息，请参阅
   * TNode.projection）。如果它是常规元素节点或没有投影的组件，则为 null 。
   *
   */
  projection: (TNode|RNode[])[]|null;

  /**
   * Stores TagName
   *
   * 存储 TagName
   *
   */
  value: string;
}

/**
 * Static data for a text node
 *
 * 文本节点的静态数据
 *
 */
export interface TTextNode extends TNode {
  /**
   * Index in the data\[] array
   *
   * data\[] 数组中的索引
   *
   */
  index: number;
  child: null;
  /**
   * Text nodes will have parents unless they are the first node of a component or
   * embedded view (which means their parent is in a different view and must be
   * retrieved using LView.node).
   *
   * 文本节点将有父节点，除非它们是组件或嵌入式视图的第一个节点（这意味着它们的父级在不同的视图中，必须使用
   * LView.node 检索）。
   *
   */
  parent: TElementNode|TElementContainerNode|null;
  tViews: null;
  projection: null;
}

/**
 * Static data for an LContainer
 *
 * LContainer 的静态数据
 *
 */
export interface TContainerNode extends TNode {
  /**
   * Index in the data\[] array.
   *
   * data\[] 数组中的索引。
   *
   * If it's -1, this is a dynamically created container node that isn't stored in
   * data\[] (e.g. when you inject ViewContainerRef) .
   *
   * 如果是 -1，则这是一个动态创建的容器节点，不存储在 data\[] 中（例如，当你注入 ViewContainerRef
   * 时）。
   *
   */
  index: number;
  child: null;

  /**
   * Container nodes will have parents unless:
   *
   * 容器节点将有父节点，除非：
   *
   * - They are the first node of a component or embedded view
   *
   *   它们是组件或嵌入式视图的第一个节点
   *
   * - They are dynamically created
   *
   *   它们是动态创建的
   *
   */
  parent: TElementNode|TElementContainerNode|null;
  tViews: TView|TView[]|null;
  projection: null;
  value: null;
}

/**
 * Static data for an <ng-container>
 *
 * 的静态数据<ng-container>
 *
 */
export interface TElementContainerNode extends TNode {
  /**
   * Index in the LView\[] array.
   *
   * LView\[] 数组中的索引。
   *
   */
  index: number;
  child: TElementNode|TTextNode|TContainerNode|TElementContainerNode|TProjectionNode|null;
  parent: TElementNode|TElementContainerNode|null;
  tViews: null;
  projection: null;
}

/**
 * Static data for an ICU expression
 *
 * ICU 表达式的静态数据
 *
 */
export interface TIcuContainerNode extends TNode {
  /**
   * Index in the LView\[] array.
   *
   * LView\[] 数组中的索引。
   *
   */
  index: number;
  child: null;
  parent: TElementNode|TElementContainerNode|null;
  tViews: null;
  projection: null;
  value: TIcu;
}

/**
 * Static data for an LProjectionNode
 *
 * LProjectionNode 的静态数据
 *
 */
export interface TProjectionNode extends TNode {
  /**
   * Index in the data\[] array
   *
   * data\[] 数组中的索引
   *
   */
  child: null;
  /**
   * Projection nodes will have parents unless they are the first node of a component
   * or embedded view (which means their parent is in a different view and must be
   * retrieved using LView.node).
   *
   * 投影节点将有父节点，除非它们是组件或嵌入式视图的第一个节点（这意味着它们的父节点在不同的视图中，必须使用
   * LView.node 检索）。
   *
   */
  parent: TElementNode|TElementContainerNode|null;
  tViews: null;

  /**
   * Index of the projection node. (See TNode.projection for more info.)
   *
   * 投影节点的索引。（有关更多信息，请参阅 TNode.projection 。）
   *
   */
  projection: number;
  value: null;
}

/**
 * A union type representing all TNode types that can host a directive.
 *
 * 表示可以托管指令的所有 TNode 类型的联合类型。
 *
 */
export type TDirectiveHostNode = TElementNode|TContainerNode|TElementContainerNode;

/**
 * This mapping is necessary so we can set input properties and output listeners
 * properly at runtime when property names are minified or aliased.
 *
 * 这种映射是必要的，因此我们可以在运行时当属性名称被缩小或别名时正确设置输入属性和输出侦听器。
 *
 * Key: unminified / public input or output name
 * Value: array containing minified / internal name and related directive index
 *
 * 键：未缩小/公共输入或输出名称值：包含缩小/内部名称和相关指令索引的数组
 *
 * The value must be an array to support inputs and outputs with the same name
 * on the same node.
 *
 * 该值必须是一个数组，以支持在同一个节点上具有相同名称的输入和输出。
 *
 */
export type PropertyAliases = {
  // This uses an object map because using the Map type would be too slow
  [key: string]: PropertyAliasValue
};

/**
 * Store the runtime input or output names for all the directives.
 *
 * 存储所有指令的运行时输入或输出名称。
 *
 * i+0: directive instance index
 * i+1: privateName
 *
 * i+0：指令实例索引 i+1： privateName
 *
 * e.g. [0, 'change-minified']
 *
 * 例如[0, 'change-minified'][0, 'change-minified']
 *
 */
export type PropertyAliasValue = (number|string)[];

/**
 * This array contains information about input properties that
 * need to be set once from attribute data. It's ordered by
 * directive index (relative to element) so it's simple to
 * look up a specific directive's initial input data.
 *
 * 此数组包含有关需要从属性数据设置一次的输入属性的信息。它按指令索引（相对于元素）排序，因此查找特定指令的初始输入数据很简单。
 *
 * Within each sub-array:
 *
 * 在每个子数组中：
 *
 * i+0: attribute name
 * i+1: minified/internal input name
 * i+2: initial value
 *
 * i+0：属性名称 i+1：缩小/内部输入名称 i+2：初始值
 *
 * If a directive on a node does not have any input properties
 * that should be set from attributes, its index is set to null
 * to avoid a sparse array.
 *
 * 如果节点上的指令没有任何应该从属性设置的输入属性，则其索引将设置为 null 以避免使用稀疏数组。
 *
 * e.g. \[null, ['role-min', 'minified-input', 'button']]
 *
 * 例如 \[null, ['role-min', 'minified-input', 'button']['role-min', 'minified-input', 'button'] ]
 *
 */
export type InitialInputData = (InitialInputs|null)[];

/**
 * Used by InitialInputData to store input properties
 * that should be set once from attributes.
 *
 * 供 InitialInputData 用于存储应该从属性设置一次的输入属性。
 *
 * i+0: attribute name
 * i+1: minified/internal input name
 * i+2: initial value
 *
 * i+0：属性名称 i+1：缩小/内部输入名称 i+2：初始值
 *
 * e.g. ['role-min', 'minified-input', 'button']
 *
 * 例如[“role-min”、“minified-input”、“按钮”]['role-min', 'minified-input', 'button']
 *
 */
export type InitialInputs = string[];

// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;

/**
 * Type representing a set of TNodes that can have local refs (`#foo`) placed on them.
 *
 * 表示一组 TNode 的类型，可以在其上放置本地引用 ( `#foo` ) 。
 *
 */
export type TNodeWithLocalRefs = TContainerNode|TElementNode|TElementContainerNode;

/**
 * Type for a function that extracts a value for a local refs.
 * Example:
 *
 * 为从本地 refs 提取值的函数的类型。示例：
 *
 * - `<div #nativeDivEl>` - `nativeDivEl` should point to the native `<div>` element;
 *
 *   `<div #nativeDivEl>` - `nativeDivEl` 应该指向本机 `<div>` 元素；
 *
 * - `<ng-template #tplRef>` - `tplRef` should point to the `TemplateRef` instance;
 *
 *   `<ng-template #tplRef>` - `tplRef` 应该指向 `TemplateRef` 实例；
 *
 */
export type LocalRefExtractor = (tNode: TNodeWithLocalRefs, currentView: LView) => any;

/**
 * Returns `true` if the `TNode` has a directive which has `@Input()` for `class` binding.
 *
 * 如果 `TNode` 有一个具有 `@Input()` 进行 `class` 绑定的指令，则返回 `true` 。
 *
 * ```
 * <div my-dir [class]="exp"></div>
 * ```
 *
 * and
 *
 * 和
 *
 * ```
 *
 * @Directive ({
 * })
 * class MyDirective {
 * @Input ()
 *   class: string;
 * }
 * ```
 *
 * In the above case it is necessary to write the reconciled styling information into the
 * directive's input.
 * @param tNode
 */
export function hasClassInput(tNode: TNode) {
  return (tNode.flags & TNodeFlags.hasClassInput) !== 0;
}

/**
 * Returns `true` if the `TNode` has a directive which has `@Input()` for `style` binding.
 *
 * 如果 `TNode` 有一个使用 `@Input()` 进行 `style` 绑定的指令，则返回 `true` 。
 *
 * ```
 * <div my-dir [style]="exp"></div>
 * ```
 *
 * and
 *
 * 和
 *
 * ```
 *
 * @Directive ({
 * })
 * class MyDirective {
 * @Input ()
 *   class: string;
 * }
 * ```
 *
 * In the above case it is necessary to write the reconciled styling information into the
 * directive's input.
 * @param tNode
 */
export function hasStyleInput(tNode: TNode) {
  return (tNode.flags & TNodeFlags.hasStyleInput) !== 0;
}
