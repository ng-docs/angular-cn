/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {I18nDebug, IcuCreateOpCodes, TI18n, TIcu} from '@angular/core/src/render3/interfaces/i18n';
import {TNode} from '@angular/core/src/render3/interfaces/node';
import {TView} from '@angular/core/src/render3/interfaces/view';

import {isDOMElement, isDOMText, isTI18n, isTIcu, isTNode, isTView} from './is_shape_of';


/**
 * Generic matcher which asserts that an object is of a given shape (`shapePredicate`) and that it
 * contains a subset of properties.
 *
 * 通用匹配器，它断言一个对象具有给定的形状 ( `shapePredicate` )，并且它包含属性的子集。
 *
 * @param name Name of `shapePredicate` to display when assertion fails.
 *
 * 断言失败时要显示的 `shapePredicate` 的名称。
 *
 * @param shapePredicate Predicate which verifies that the object is of correct shape.
 *
 * 验证对象具有正确形状的谓词。
 *
 * @param expected Expected set of properties to be found on the object.
 *
 * 要在对象上找到的预期属性集。
 *
 */
export function matchObjectShape<T>(
    name: string, shapePredicate: (obj: any) => obj is T,
    expected: Partial<T> = {}): jasmine.AsymmetricMatcher<T> {
  const matcher = function() {};
  let _actual: any = null;
  let _matcherUtils: jasmine.MatchersUtil = null!;

  matcher.asymmetricMatch = function(actual: any, matcherUtils: jasmine.MatchersUtil) {
    _actual = actual;
    _matcherUtils = matcherUtils;
    if (!shapePredicate(actual)) return false;
    for (const key in expected) {
      if (expected.hasOwnProperty(key) && !matcherUtils.equals(actual[key], expected[key])) {
        return false;
      }
    }
    return true;
  };
  matcher.jasmineToString = function(pp: (value: any) => string) {
    let errors: string[] = [];
    if (!_actual || typeof _actual !== 'object') {
      return `Expecting ${pp(expect)} got ${pp(_actual)}`;
    }
    for (const key in expected) {
      if (expected.hasOwnProperty(key) && !_matcherUtils.equals(_actual[key], expected[key]))
        errors.push(`\n  property obj.${key} to equal ${expected[key]} but got ${_actual[key]}`);
    }
    return errors.join('\n');
  };

  return matcher;
}


/**
 * Asymmetric matcher which matches a `TView` of a given shape.
 *
 * 匹配给定形状的 `TView` 的非对称匹配器。
 *
 * Expected usage:
 *
 * 预期用法：
 *
 * ```
 * expect(tNode).toEqual(matchTView({type: TViewType.Root}));
 * expect({
 *   node: tNode
 * }).toEqual({
 *   node: matchTNode({type: TViewType.Root})
 * });
 * ```
 *
 * @param expected optional properties which the `TView` must contain.
 *
 * `TView` 必须包含的可选属性。
 *
 */
export function matchTView(expected?: Partial<TView>): jasmine.AsymmetricMatcher<TView> {
  return matchObjectShape('TView', isTView, expected);
}

/**
 * Asymmetric matcher which matches a `TNode` of a given shape.
 *
 * 匹配给定形状的 `TNode` 的非对称匹配器。
 *
 * Expected usage:
 *
 * 预期用法：
 *
 * ```
 * expect(tNode).toEqual(matchTNode({type: TNodeType.Element}));
 * expect({
 *   node: tNode
 * }).toEqual({
 *   node: matchTNode({type: TNodeType.Element})
 * });
 * ```
 *
 * @param expected optional properties which the `TNode` must contain.
 *
 * `TNode` 必须包含的可选属性。
 *
 */
export function matchTNode(expected?: Partial<TNode>): jasmine.AsymmetricMatcher<TNode> {
  return matchObjectShape('TNode', isTNode, expected);
}


/**
 * Asymmetric matcher which matches a `T18n` of a given shape.
 *
 * 匹配给定形状的 `T18n` 的非对称匹配器。
 *
 * Expected usage:
 *
 * 预期用法：
 *
 * ```
 * expect(tNode).toEqual(matchT18n({vars: 0}));
 * expect({
 *   node: tNode
 * }).toEqual({
 *   node: matchT18n({vars: 0})
 * });
 * ```
 *
 * @param expected optional properties which the `TI18n` must contain.
 *
 * `TI18n` 必须包含的可选属性。
 *
 */
export function matchTI18n(expected?: Partial<TI18n>): jasmine.AsymmetricMatcher<TI18n> {
  return matchObjectShape('TI18n', isTI18n, expected);
}


/**
 * Asymmetric matcher which matches a `T1cu` of a given shape.
 *
 * 匹配给定形状的 `T1cu` 的非对称匹配器。
 *
 * Expected usage:
 *
 * 预期用法：
 *
 * ```
 * expect(tNode).toEqual(matchTIcu({type: TIcuType.select}));
 * expect({
 *   type: TIcuType.select
 * }).toEqual({
 *   node: matchT18n({type: TIcuType.select})
 * });
 * ```
 *
 * @param expected optional properties which the `TIcu` must contain.
 *
 * `TIcu` 必须包含的可选属性。
 *
 */
export function matchTIcu(expected?: Partial<TIcu>): jasmine.AsymmetricMatcher<TIcu> {
  return matchObjectShape('TIcu', isTIcu, expected);
}



/**
 * Asymmetric matcher which matches a DOM Element.
 *
 * 匹配 DOM 元素的非对称匹配器。
 *
 * Expected usage:
 *
 * 预期用法：
 *
 * ```
 * expect(div).toEqual(matchT18n('div', {id: '123'}));
 * expect({
 *   node: div
 * }).toEqual({
 *   node: matchT18n('div', {id: '123'})
 * });
 * ```
 *
 * @param expectedTagName optional DOM tag name.
 *
 * 可选的 DOM 标签名称。
 *
 * @param expectedAttributes optional DOM element properties.
 *
 * 可选的 DOM 元素属性。
 *
 */
export function matchDomElement(
    expectedTagName: string|undefined = undefined,
    expectedAttrs: {[key: string]: string|null} = {}): jasmine.AsymmetricMatcher<Element> {
  const matcher = function() {};
  let _actual: any = null;

  matcher.asymmetricMatch = function(actual: any) {
    _actual = actual;
    if (!isDOMElement(actual)) return false;
    if (expectedTagName && (expectedTagName.toUpperCase() !== actual.tagName.toUpperCase())) {
      return false;
    }
    if (expectedAttrs) {
      for (const attrName in expectedAttrs) {
        if (expectedAttrs.hasOwnProperty(attrName)) {
          const expectedAttrValue = expectedAttrs[attrName];
          const actualAttrValue = actual.getAttribute(attrName);
          if (expectedAttrValue !== actualAttrValue) {
            return false;
          }
        }
      }
    }
    return true;
  };
  matcher.jasmineToString = function() {
    let actualStr = isDOMElement(_actual) ? `<${_actual.tagName}${toString(_actual.attributes)}>` :
                                            JSON.stringify(_actual);
    let expectedStr = `<${expectedTagName || '*'}${
        Object.keys(expectedAttrs).map(key => ` ${key}=${JSON.stringify(expectedAttrs[key])}`)}>`;
    return `[${actualStr} != ${expectedStr}]`;
  };

  function toString(attrs: NamedNodeMap) {
    let text = '';
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      text += ` ${attr.name}=${JSON.stringify(attr.value)}`;
    }
    return text;
  }


  return matcher;
}

/**
 * Asymmetric matcher which matches DOM text node.
 *
 * 匹配 DOM 文本节点的非对称匹配器。
 *
 * Expected usage:
 *
 * 预期用法：
 *
 * ```
 * expect(div).toEqual(matchDomText('text'));
 * expect({
 *   node: div
 * }).toEqual({
 *   node: matchDomText('text')
 * });
 * ```
 *
 * @param expectedText optional DOM text.
 *
 * 可选的 DOM 文本。
 *
 */
export function matchDomText(expectedText: string|undefined = undefined):
    jasmine.AsymmetricMatcher<Text> {
  const matcher = function() {};
  let _actual: any = null;

  matcher.asymmetricMatch = function(actual: any) {
    _actual = actual;
    if (!isDOMText(actual)) return false;
    if (expectedText && (expectedText !== actual.textContent)) {
      return false;
    }
    return true;
  };
  matcher.jasmineToString = function() {
    let actualStr = isDOMText(_actual) ? `#TEXT: ${JSON.stringify(_actual.textContent)}` :
                                         JSON.stringify(_actual);
    let expectedStr = `#TEXT: ${JSON.stringify(expectedText)}`;
    return `[${actualStr} != ${expectedStr}]`;
  };

  return matcher;
}

export function matchI18nMutableOpCodes(expectedMutableOpCodes: string[]):
    jasmine.AsymmetricMatcher<IcuCreateOpCodes> {
  const matcher = function() {};
  let _actual: any = null;

  matcher.asymmetricMatch = function(actual: any, matchersUtil: jasmine.MatchersUtil) {
    _actual = actual;
    if (!Array.isArray(actual)) return false;
    const debug = (actual as I18nDebug).debug as undefined | string[];
    if (expectedMutableOpCodes && (!matchersUtil.equals(debug, expectedMutableOpCodes))) {
      return false;
    }
    return true;
  };
  matcher.jasmineToString = function() {
    const debug = (_actual as I18nDebug).debug as undefined | string[];
    return `[${JSON.stringify(debug)} != ${expectedMutableOpCodes}]`;
  };

  return matcher;
}
