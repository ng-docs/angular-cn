/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import '../util/ng_dev_mode';

import {assertDefined, assertNotEqual} from '../util/assert';

import {AttributeMarker, TAttributes, TNode, TNodeType, isNameOnlyAttributeMarker, unusedValueExportToPlacateAjd as unused1} from './interfaces/node';
import {CssSelector, CssSelectorList, NG_PROJECT_AS_ATTR_NAME, SelectorFlags, unusedValueExportToPlacateAjd as unused2} from './interfaces/projection';
import {getInitialClassNameValue} from './styling/class_and_style_bindings';

const unusedValueToPlacateAjd = unused1 + unused2;

const NG_TEMPLATE_SELECTOR = 'ng-template';

function isCssClassMatching(nodeClassAttrVal: string, cssClassToMatch: string): boolean {
  const nodeClassesLen = nodeClassAttrVal.length;
  const matchIndex = nodeClassAttrVal !.indexOf(cssClassToMatch);
  const matchEndIdx = matchIndex + cssClassToMatch.length;
  if (matchIndex === -1                                                  // no match
      || (matchIndex > 0 && nodeClassAttrVal ![matchIndex - 1] !== ' ')  // no space before
      ||
      (matchEndIdx < nodeClassesLen && nodeClassAttrVal ![matchEndIdx] !== ' '))  // no space after
  {
    return false;
  }
  return true;
}

/**
 * Function that checks whether a given tNode matches tag-based selector and has a valid type.
 *
 * Matching can be perfomed in 2 modes: projection mode (when we project nodes) and regular
 * directive matching mode. In "projection" mode, we do not need to check types, so if tag name
 * matches selector, we declare a match. In "directive matching" mode, we also check whether tNode
 * is of expected type:
 * - whether tNode has either Element or ElementContainer type
 * - or if we want to match "ng-template" tag, we check for Container type
 */
function hasTagAndTypeMatch(
    tNode: TNode, currentSelector: string, isProjectionMode: boolean): boolean {
  return currentSelector === tNode.tagName &&
      (isProjectionMode ||
       (tNode.type === TNodeType.Element || tNode.type === TNodeType.ElementContainer) ||
       (tNode.type === TNodeType.Container && currentSelector === NG_TEMPLATE_SELECTOR));
}

/**
 * A utility function to match an Ivy node static data against a simple CSS selector
 *
 * @param node static data to match
 * @param selector
 * @returns true if node matches the selector.
 */
export function isNodeMatchingSelector(
    tNode: TNode, selector: CssSelector, isProjectionMode: boolean): boolean {
  ngDevMode && assertDefined(selector[0], 'Selector should have a tag name');
  let mode: SelectorFlags = SelectorFlags.ELEMENT;
  const nodeAttrs = tNode.attrs || [];

  // Find the index of first attribute that has no value, only a name.
  let nameOnlyMarkerIdx = nodeAttrs && nodeAttrs.length;
  for (let i = 0; i < nodeAttrs.length; i++) {
    const nodeAttr = nodeAttrs[i];
    if (isNameOnlyAttributeMarker(nodeAttr)) {
      nameOnlyMarkerIdx = i;
      break;
    }
  }

  // When processing ":not" selectors, we skip to the next ":not" if the
  // current one doesn't match
  let skipToNextSelector = false;

  for (let i = 0; i < selector.length; i++) {
    const current = selector[i];
    if (typeof current === 'number') {
      // If we finish processing a :not selector and it hasn't failed, return false
      if (!skipToNextSelector && !isPositive(mode) && !isPositive(current as number)) {
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
      if ((mode & SelectorFlags.CLASS) && tNode.stylingTemplate) {
        if (!isCssClassMatching(readClassValueFromTNode(tNode), selectorAttrValue as string)) {
          if (isPositive(mode)) return false;
          skipToNextSelector = true;
        }
        continue;
      }

      const attrName = (mode & SelectorFlags.CLASS) ? 'class' : current;
      const attrIndexInNode = findAttrIndexInNode(attrName, nodeAttrs);

      if (attrIndexInNode === -1) {
        if (isPositive(mode)) return false;
        skipToNextSelector = true;
        continue;
      }

      if (selectorAttrValue !== '') {
        let nodeAttrValue: string;
        const maybeAttrName = nodeAttrs[attrIndexInNode];
        if (attrIndexInNode > nameOnlyMarkerIdx) {
          nodeAttrValue = '';
        } else {
          ngDevMode && assertNotEqual(
                           maybeAttrName, AttributeMarker.NamespaceURI,
                           'We do not match directives on namespaced attributes');
          nodeAttrValue = nodeAttrs[attrIndexInNode + 1] as string;
        }

        const compareAgainstClassName = mode & SelectorFlags.CLASS ? nodeAttrValue : null;
        if (compareAgainstClassName &&
                !isCssClassMatching(compareAgainstClassName, selectorAttrValue as string) ||
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

function readClassValueFromTNode(tNode: TNode): string {
  // comparing against CSS class values is complex because the compiler doesn't place them as
  // regular attributes when an element is created. Instead, the classes (and styles for
  // that matter) are placed in a special styling context that is used for resolving all
  // class/style values across static attributes, [style]/[class] and [style.prop]/[class.name]
  // bindings. Therefore if and when the styling context exists then the class values are to be
  // extracted by the context helper code below...
  return tNode.stylingTemplate ? getInitialClassNameValue(tNode.stylingTemplate) : '';
}

/**
 * Examines an attribute's definition array from a node to find the index of the
 * attribute with the specified name.
 *
 * NOTE: Will not find namespaced attributes.
 *
 * @param name the name of the attribute to find
 * @param attrs the attribute array to examine
 */
function findAttrIndexInNode(name: string, attrs: TAttributes | null): number {
  if (attrs === null) return -1;
  let nameOnlyMode = false;
  let i = 0;
  while (i < attrs.length) {
    const maybeAttrName = attrs[i];
    if (maybeAttrName === name) {
      return i;
    } else if (maybeAttrName === AttributeMarker.NamespaceURI) {
      // NOTE(benlesh): will not find namespaced attributes. This is by design.
      i += 4;
    } else {
      if (isNameOnlyAttributeMarker(maybeAttrName)) {
        nameOnlyMode = true;
      }
      i += nameOnlyMode ? 1 : 2;
    }
  }

  return -1;
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

export function getProjectAsAttrValue(tNode: TNode): string|null {
  const nodeAttrs = tNode.attrs;
  if (nodeAttrs != null) {
    const ngProjectAsAttrIdx = nodeAttrs.indexOf(NG_PROJECT_AS_ATTR_NAME);
    // only check for ngProjectAs in attribute names, don't accidentally match attribute's value
    // (attribute names are stored at even indexes)
    if ((ngProjectAsAttrIdx & 1) === 0) {
      return nodeAttrs[ngProjectAsAttrIdx + 1] as string;
    }
  }
  return null;
}

/**
 * Checks a given node against matching projection selectors and returns
 * selector index (or 0 if none matched).
 *
 * This function takes into account the ngProjectAs attribute: if present its value will be compared
 * to the raw (un-parsed) CSS selector instead of using standard selector matching logic.
 */
export function matchingProjectionSelectorIndex(
    tNode: TNode, selectors: CssSelectorList[], textSelectors: string[]): number {
  const ngProjectAsAttrVal = getProjectAsAttrValue(tNode);
  for (let i = 0; i < selectors.length; i++) {
    // if a node has the ngProjectAs attribute match it against unparsed selector
    // match a node against a parsed selector only if ngProjectAs attribute is not present
    if (ngProjectAsAttrVal === textSelectors[i] ||
        ngProjectAsAttrVal === null &&
            isNodeMatchingSelectorList(tNode, selectors[i], /* isProjectionMode */ true)) {
      return i + 1;  // first matching selector "captures" a given node
    }
  }
  return 0;
}
