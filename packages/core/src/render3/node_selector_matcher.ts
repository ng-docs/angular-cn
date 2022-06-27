/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import '../util/ng_dev_mode';

import {assertDefined, assertEqual, assertNotEqual} from '../util/assert';

import {AttributeMarker, TAttributes, TNode, TNodeType, unusedValueExportToPlacateAjd as unused1} from './interfaces/node';
import {CssSelector, CssSelectorList, SelectorFlags, unusedValueExportToPlacateAjd as unused2} from './interfaces/projection';
import {classIndexOf} from './styling/class_differ';
import {isNameOnlyAttributeMarker} from './util/attrs_utils';

const unusedValueToPlacateAjd = unused1 + unused2;

const NG_TEMPLATE_SELECTOR = 'ng-template';

/**
 * Search the `TAttributes` to see if it contains `cssClassToMatch` (case insensitive)
 *
 * 搜索 `TAttributes` 以查看它是否包含 `cssClassToMatch` （不区分大小写）
 *
 * @param attrs `TAttributes` to search through.
 *
 * 要搜索的 `TAttributes` 。
 *
 * @param cssClassToMatch class to match (lowercase)
 *
 * 要匹配的类（小写）
 *
 * @param isProjectionMode Whether or not class matching should look into the attribute `class` in
 *    addition to the `AttributeMarker.Classes`.
 *
 * 除了 `AttributeMarker.Classes` 之外，类匹配是否应该查看属性 `class` 。
 *
 */
function isCssClassMatching(
    attrs: TAttributes, cssClassToMatch: string, isProjectionMode: boolean): boolean {
  // TODO(misko): The fact that this function needs to know about `isProjectionMode` seems suspect.
  // It is strange to me that sometimes the class information comes in form of `class` attribute
  // and sometimes in form of `AttributeMarker.Classes`. Some investigation is needed to determine
  // if that is the right behavior.
  ngDevMode &&
      assertEqual(
          cssClassToMatch, cssClassToMatch.toLowerCase(), 'Class name expected to be lowercase.');
  let i = 0;
  while (i < attrs.length) {
    let item = attrs[i++];
    if (isProjectionMode && item === 'class') {
      item = attrs[i] as string;
      if (classIndexOf(item.toLowerCase(), cssClassToMatch, 0) !== -1) {
        return true;
      }
    } else if (item === AttributeMarker.Classes) {
      // We found the classes section. Start searching for the class.
      while (i < attrs.length && typeof (item = attrs[i++]) == 'string') {
        // while we have strings
        if (item.toLowerCase() === cssClassToMatch) return true;
      }
      return false;
    }
  }
  return false;
}

/**
 * Checks whether the `tNode` represents an inline template (e.g. `*ngFor`).
 *
 * 检查 `tNode` 是否表示内联模板（例如 `*ngFor` ）。
 *
 * @param tNode current TNode
 *
 * 当前 TNode
 *
 */
export function isInlineTemplate(tNode: TNode): boolean {
  return tNode.type === TNodeType.Container && tNode.value !== NG_TEMPLATE_SELECTOR;
}

/**
 * Function that checks whether a given tNode matches tag-based selector and has a valid type.
 *
 * 检查给定 tNode 是否与基于标签的选择器匹配并且具有有效类型的函数。
 *
 * Matching can be performed in 2 modes: projection mode (when we project nodes) and regular
 * directive matching mode:
 *
 * 匹配可以在 2 种模式下执行：投影模式（当我们投影节点时）和正则指令匹配模式：
 *
 * - in the "directive matching" mode we do _not_ take TContainer's tagName into account if it is
 *   different from NG_TEMPLATE_SELECTOR (value different from NG_TEMPLATE_SELECTOR indicates that a
 *   tag name was extracted from \* syntax so we would match the same directive twice);
 *
 *   在“指令匹配”模式下，如果 TContainer 的 tagName 与 NG_TEMPLATE_SELECTOR 不同，我们就 _ 不会\_
 * 考虑它（与 NG_TEMPLATE_SELECTOR 不同的值表明标签名称是从 \*
 * 语法中提取的，因此我们将匹配同一个指令两次）；
 *
 * - in the "projection" mode, we use a tag name potentially extracted from the \* syntax processing
 *   (applicable to TNodeType.Container only).
 *
 *   在“投影”模式下，我们使用可能从 \* 语法处理中提取的标签名称（仅适用于 TNodeType.Container ）。
 *
 */
function hasTagAndTypeMatch(
    tNode: TNode, currentSelector: string, isProjectionMode: boolean): boolean {
  const tagNameToCompare =
      tNode.type === TNodeType.Container && !isProjectionMode ? NG_TEMPLATE_SELECTOR : tNode.value;
  return currentSelector === tagNameToCompare;
}

/**
 * A utility function to match an Ivy node static data against a simple CSS selector
 *
 * 一种将 Ivy 节点静态数据与简单 CSS 选择器进行匹配的工具函数
 *
 * @param node static data of the node to match
 *
 * 要匹配的节点的静态数据
 *
 * @param selector The selector to try matching against the node.
 *
 * 要尝试与节点匹配的选择器。
 *
 * @param isProjectionMode if `true` we are matching for content projection, otherwise we are doing
 * directive matching.
 *
 * 如果为 `true` ，我们正在匹配内容投影，否则我们正在进行指令匹配。
 *
 * @returns
 *
 * true if node matches the selector.
 *
 * 如果节点与选择器匹配，则为 true 。
 *
 */
export function isNodeMatchingSelector(
    tNode: TNode, selector: CssSelector, isProjectionMode: boolean): boolean {
  ngDevMode && assertDefined(selector[0], 'Selector should have a tag name');
  let mode: SelectorFlags = SelectorFlags.ELEMENT;
  const nodeAttrs = tNode.attrs || [];

  // Find the index of first attribute that has no value, only a name.
  const nameOnlyMarkerIdx = getNameOnlyMarkerIndex(nodeAttrs);

  // When processing ":not" selectors, we skip to the next ":not" if the
  // current one doesn't match
  let skipToNextSelector = false;

  for (let i = 0; i < selector.length; i++) {
    const current = selector[i];
    if (typeof current === 'number') {
      // If we finish processing a :not selector and it hasn't failed, return false
      if (!skipToNextSelector && !isPositive(mode) && !isPositive(current)) {
        return false;
      }
      // If we are skipping to the next :not() and this mode flag is positive,
      // it's a part of the current :not() selector, and we should keep skipping
      if (skipToNextSelector && isPositive(current)) continue;
      skipToNextSelector = false;
      mode = (current as number) | (mode & SelectorFlags.NOT);
      continue;
    }

    if (skipToNextSelector) continue;

    if (mode & SelectorFlags.ELEMENT) {
      mode = SelectorFlags.ATTRIBUTE | mode & SelectorFlags.NOT;
      if (current !== '' && !hasTagAndTypeMatch(tNode, current, isProjectionMode) ||
          current === '' && selector.length === 1) {
        if (isPositive(mode)) return false;
        skipToNextSelector = true;
      }
    } else {
      const selectorAttrValue = mode & SelectorFlags.CLASS ? current : selector[++i];

      // special case for matching against classes when a tNode has been instantiated with
      // class and style values as separate attribute values (e.g. ['title', CLASS, 'foo'])
      if ((mode & SelectorFlags.CLASS) && tNode.attrs !== null) {
        if (!isCssClassMatching(tNode.attrs, selectorAttrValue as string, isProjectionMode)) {
          if (isPositive(mode)) return false;
          skipToNextSelector = true;
        }
        continue;
      }

      const attrName = (mode & SelectorFlags.CLASS) ? 'class' : current;
      const attrIndexInNode =
          findAttrIndexInNode(attrName, nodeAttrs, isInlineTemplate(tNode), isProjectionMode);

      if (attrIndexInNode === -1) {
        if (isPositive(mode)) return false;
        skipToNextSelector = true;
        continue;
      }

      if (selectorAttrValue !== '') {
        let nodeAttrValue: string;
        if (attrIndexInNode > nameOnlyMarkerIdx) {
          nodeAttrValue = '';
        } else {
          ngDevMode &&
              assertNotEqual(
                  nodeAttrs[attrIndexInNode], AttributeMarker.NamespaceURI,
                  'We do not match directives on namespaced attributes');
          // we lowercase the attribute value to be able to match
          // selectors without case-sensitivity
          // (selectors are already in lowercase when generated)
          nodeAttrValue = (nodeAttrs[attrIndexInNode + 1] as string).toLowerCase();
        }

        const compareAgainstClassName = mode & SelectorFlags.CLASS ? nodeAttrValue : null;
        if (compareAgainstClassName &&
                classIndexOf(compareAgainstClassName, selectorAttrValue as string, 0) !== -1 ||
            mode & SelectorFlags.ATTRIBUTE && selectorAttrValue !== nodeAttrValue) {
          if (isPositive(mode)) return false;
          skipToNextSelector = true;
        }
      }
    }
  }

  return isPositive(mode) || skipToNextSelector;
}

function isPositive(mode: SelectorFlags): boolean {
  return (mode & SelectorFlags.NOT) === 0;
}

/**
 * Examines the attribute's definition array for a node to find the index of the
 * attribute that matches the given `name`.
 *
 * 检查节点的属性定义数组，以查找与给定 `name` 匹配的属性的索引。
 *
 * NOTE: This will not match namespaced attributes.
 *
 * 注意：这将不匹配命名空间属性。
 *
 * Attribute matching depends upon `isInlineTemplate` and `isProjectionMode`.
 * The following table summarizes which types of attributes we attempt to match:
 *
 * 属性匹配取决于 `isInlineTemplate` 和 `isProjectionMode` 。下表总结了我们尝试匹配的属性类型：
 *
 * ===========================================================================================================
 * Modes                   | Normal Attributes | Bindings Attributes | Template Attributes | I18n
 *
 * ==================================================
 * ================================================== ======= 模式|普通属性|绑定属性|模板属性| I18n
 *
 * # Attributes
 *
 * # 属性
 *
 * ## Inline + Projection     | YES               | YES                 | NO                  | YES
 *
 * ## 内联+投影|是|是是|是没有|是
 *
 * ## Inline + Directive      | NO                | NO                  | YES                 | NO
 *
 * ## 内联+指令|没有|没有|是|是否
 *
 * ## Non-inline + Projection | YES               | YES                 | NO                  | YES
 *
 * ## 非内联+投影|是|是是|是没有|是
 *
 * # Non-inline + Directive  | YES               | YES                 | NO                  | YES
 *
 * # 非内联+ 指令|是|是是|是没有|是
 *
 * @param name the name of the attribute to find
 *
 * 要查找的属性名称
 *
 * @param attrs the attribute array to examine
 *
 * 要检查的属性数组
 *
 * @param isInlineTemplate true if the node being matched is an inline template (e.g. `*ngFor`)
 * rather than a manually expanded template node (e.g `<ng-template>`).
 *
 * 如果要匹配的节点是内联模板（例如 `*ngFor` ）而不是手动扩展的模板节点（例如 `<ng-template>`
 * ），则为 true 。
 *
 * @param isProjectionMode true if we are matching against content projection otherwise we are
 * matching against directives.
 *
 * 如果我们要与内容投影匹配，则为 true ，否则我们正在匹配指令。
 *
 */
function findAttrIndexInNode(
    name: string, attrs: TAttributes|null, isInlineTemplate: boolean,
    isProjectionMode: boolean): number {
  if (attrs === null) return -1;

  let i = 0;

  if (isProjectionMode || !isInlineTemplate) {
    let bindingsMode = false;
    while (i < attrs.length) {
      const maybeAttrName = attrs[i];
      if (maybeAttrName === name) {
        return i;
      } else if (
          maybeAttrName === AttributeMarker.Bindings || maybeAttrName === AttributeMarker.I18n) {
        bindingsMode = true;
      } else if (
          maybeAttrName === AttributeMarker.Classes || maybeAttrName === AttributeMarker.Styles) {
        let value = attrs[++i];
        // We should skip classes here because we have a separate mechanism for
        // matching classes in projection mode.
        while (typeof value === 'string') {
          value = attrs[++i];
        }
        continue;
      } else if (maybeAttrName === AttributeMarker.Template) {
        // We do not care about Template attributes in this scenario.
        break;
      } else if (maybeAttrName === AttributeMarker.NamespaceURI) {
        // Skip the whole namespaced attribute and value. This is by design.
        i += 4;
        continue;
      }
      // In binding mode there are only names, rather than name-value pairs.
      i += bindingsMode ? 1 : 2;
    }
    // We did not match the attribute
    return -1;
  } else {
    return matchTemplateAttribute(attrs, name);
  }
}

export function isNodeMatchingSelectorList(
    tNode: TNode, selector: CssSelectorList, isProjectionMode: boolean = false): boolean {
  for (let i = 0; i < selector.length; i++) {
    if (isNodeMatchingSelector(tNode, selector[i], isProjectionMode)) {
      return true;
    }
  }

  return false;
}

export function getProjectAsAttrValue(tNode: TNode): CssSelector|null {
  const nodeAttrs = tNode.attrs;
  if (nodeAttrs != null) {
    const ngProjectAsAttrIdx = nodeAttrs.indexOf(AttributeMarker.ProjectAs);
    // only check for ngProjectAs in attribute names, don't accidentally match attribute's value
    // (attribute names are stored at even indexes)
    if ((ngProjectAsAttrIdx & 1) === 0) {
      return nodeAttrs[ngProjectAsAttrIdx + 1] as CssSelector;
    }
  }
  return null;
}

function getNameOnlyMarkerIndex(nodeAttrs: TAttributes) {
  for (let i = 0; i < nodeAttrs.length; i++) {
    const nodeAttr = nodeAttrs[i];
    if (isNameOnlyAttributeMarker(nodeAttr)) {
      return i;
    }
  }
  return nodeAttrs.length;
}

function matchTemplateAttribute(attrs: TAttributes, name: string): number {
  let i = attrs.indexOf(AttributeMarker.Template);
  if (i > -1) {
    i++;
    while (i < attrs.length) {
      const attr = attrs[i];
      // Return in case we checked all template attrs and are switching to the next section in the
      // attrs array (that starts with a number that represents an attribute marker).
      if (typeof attr === 'number') return -1;
      if (attr === name) return i;
      i++;
    }
  }
  return -1;
}

/**
 * Checks whether a selector is inside a CssSelectorList
 *
 * 检查选择器是否在 CssSelectorList 中
 *
 * @param selector Selector to be checked.
 *
 * 要检查的选择器。
 *
 * @param list List in which to look for the selector.
 *
 * 要在其中查找选择器的列表。
 *
 */
export function isSelectorInSelectorList(selector: CssSelector, list: CssSelectorList): boolean {
  selectorListLoop: for (let i = 0; i < list.length; i++) {
    const currentSelectorInList = list[i];
    if (selector.length !== currentSelectorInList.length) {
      continue;
    }
    for (let j = 0; j < selector.length; j++) {
      if (selector[j] !== currentSelectorInList[j]) {
        continue selectorListLoop;
      }
    }
    return true;
  }
  return false;
}

function maybeWrapInNotSelector(isNegativeMode: boolean, chunk: string): string {
  return isNegativeMode ? ':not(' + chunk.trim() + ')' : chunk;
}

function stringifyCSSSelector(selector: CssSelector): string {
  let result = selector[0] as string;
  let i = 1;
  let mode = SelectorFlags.ATTRIBUTE;
  let currentChunk = '';
  let isNegativeMode = false;
  while (i < selector.length) {
    let valueOrMarker = selector[i];
    if (typeof valueOrMarker === 'string') {
      if (mode & SelectorFlags.ATTRIBUTE) {
        const attrValue = selector[++i] as string;
        currentChunk +=
            '[' + valueOrMarker + (attrValue.length > 0 ? '="' + attrValue + '"' : '') + ']';
      } else if (mode & SelectorFlags.CLASS) {
        currentChunk += '.' + valueOrMarker;
      } else if (mode & SelectorFlags.ELEMENT) {
        currentChunk += ' ' + valueOrMarker;
      }
    } else {
      //
      // Append current chunk to the final result in case we come across SelectorFlag, which
      // indicates that the previous section of a selector is over. We need to accumulate content
      // between flags to make sure we wrap the chunk later in :not() selector if needed, e.g.
      // ```
      //  ['', Flags.CLASS, '.classA', Flags.CLASS | Flags.NOT, '.classB', '.classC']
      // ```
      // should be transformed to `.classA :not(.classB .classC)`.
      //
      // Note: for negative selector part, we accumulate content between flags until we find the
      // next negative flag. This is needed to support a case where `:not()` rule contains more than
      // one chunk, e.g. the following selector:
      // ```
      //  ['', Flags.ELEMENT | Flags.NOT, 'p', Flags.CLASS, 'foo', Flags.CLASS | Flags.NOT, 'bar']
      // ```
      // should be stringified to `:not(p.foo) :not(.bar)`
      //
      if (currentChunk !== '' && !isPositive(valueOrMarker)) {
        result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
        currentChunk = '';
      }
      mode = valueOrMarker;
      // According to CssSelector spec, once we come across `SelectorFlags.NOT` flag, the negative
      // mode is maintained for remaining chunks of a selector.
      isNegativeMode = isNegativeMode || !isPositive(mode);
    }
    i++;
  }
  if (currentChunk !== '') {
    result += maybeWrapInNotSelector(isNegativeMode, currentChunk);
  }
  return result;
}

/**
 * Generates string representation of CSS selector in parsed form.
 *
 * 以解析的形式生成 CSS 选择器的字符串表示。
 *
 * ComponentDef and DirectiveDef are generated with the selector in parsed form to avoid doing
 * additional parsing at runtime (for example, for directive matching). However in some cases (for
 * example, while bootstrapping a component), a string version of the selector is required to query
 * for the host element on the page. This function takes the parsed form of a selector and returns
 * its string representation.
 *
 * ComponentDef 和 DirectiveDef
 * 是使用已解析形式的选择器生成的，以避免在运行时进行额外的解析（例如，用于指令匹配）。但是在某些情况下（例如，引导组件时），需要选择器的字符串版本来查询页面上的主机元素。此函数采用选择器的解析形式，并返回其字符串表示。
 *
 * @param selectorList selector in parsed form
 *
 * 解析形式的选择器
 *
 * @returns
 *
 * string representation of a given selector
 *
 * 给定选择器的字符串表示
 *
 */
export function stringifyCSSSelectorList(selectorList: CssSelectorList): string {
  return selectorList.map(stringifyCSSSelector).join(',');
}

/**
 * Extracts attributes and classes information from a given CSS selector.
 *
 * 从给定的 CSS 选择器中提取属性和类信息。
 *
 * This function is used while creating a component dynamically. In this case, the host element
 * (that is created dynamically) should contain attributes and classes specified in component's CSS
 * selector.
 *
 * 动态创建组件时使用此函数。在这种情况下，宿主元素（动态创建的）应该包含组件的 CSS
 * 选择器中指定的属性和类。
 *
 * @param selector CSS selector in parsed form (in a form of array)
 *
 * 解析后的 CSS 选择器（数组形式）
 *
 * @returns
 *
 * object with `attrs` and `classes` fields that contain extracted information
 *
 * 具有包含提取信息的 `attrs` 和 `classes` 字段的对象
 *
 */
export function extractAttrsAndClassesFromSelector(selector: CssSelector):
    {attrs: string[], classes: string[]} {
  const attrs: string[] = [];
  const classes: string[] = [];
  let i = 1;
  let mode = SelectorFlags.ATTRIBUTE;
  while (i < selector.length) {
    let valueOrMarker = selector[i];
    if (typeof valueOrMarker === 'string') {
      if (mode === SelectorFlags.ATTRIBUTE) {
        if (valueOrMarker !== '') {
          attrs.push(valueOrMarker, selector[++i] as string);
        }
      } else if (mode === SelectorFlags.CLASS) {
        classes.push(valueOrMarker);
      }
    } else {
      // According to CssSelector spec, once we come across `SelectorFlags.NOT` flag, the negative
      // mode is maintained for remaining chunks of a selector. Since attributes and classes are
      // extracted only for "positive" part of the selector, we can stop here.
      if (!isPositive(mode)) break;
      mode = valueOrMarker;
    }
    i++;
  }
  return {attrs, classes};
}
