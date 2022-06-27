/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {ɵgetDOM as getDOM} from '@angular/common';
import {Type, ɵglobal as global} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {childNodesAsList, hasClass, hasStyle, isCommentNode} from './browser_util';


/**
 * Jasmine matchers that check Angular specific conditions.
 *
 * 检查 Angular 特定条件的 Jasmine 匹配器。
 *
 * Note: These matchers will only work in a browser environment.
 *
 * 注意：这些匹配器仅在浏览器环境中工作。
 *
 */
export interface NgMatchers<T = any> extends jasmine.Matchers<T> {
  /**
   * Expect the value to be a `Promise`.
   *
   * 期望值是 `Promise` 。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * {
   *
   * @example testing/ts/matchers.ts region='toBePromise'}
   */
  toBePromise(): boolean;

  /**
   * Expect the value to be an instance of a class.
   *
   * 期望值是类的实例。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * {
   *
   * @example testing/ts/matchers.ts region='toBeAnInstanceOf'}
   */
  toBeAnInstanceOf(expected: any): boolean;

  /**
   * Expect the element to have exactly the given text.
   *
   * 期望元素具有给定的文本。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * {
   *
   * @example testing/ts/matchers.ts region='toHaveText'}
   */
  toHaveText(expected: string): boolean;

  /**
   * Expect the element to have the given CSS class.
   *
   * 期望元素具有给定的 CSS 类。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * {
   *
   * @example testing/ts/matchers.ts region='toHaveCssClass'}
   */
  toHaveCssClass(expected: string): boolean;

  /**
   * Expect the element to have the given CSS styles.
   *
   * 期望元素具有给定的 CSS 样式。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * {
   *
   * @example testing/ts/matchers.ts region='toHaveCssStyle'}
   */
  toHaveCssStyle(expected: {[k: string]: string}|string): boolean;

  /**
   * Expect a class to implement the interface of the given class.
   *
   * 期望一个类实现给定类的接口。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * {
   *
   * @example testing/ts/matchers.ts region='toImplement'}
   */
  toImplement(expected: any): boolean;

  /**
   * Expect an exception to contain the given error text.
   *
   * 期望出现一个包含给定错误文本的异常。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * {
   *
   * @example testing/ts/matchers.ts region='toContainError'}
   */
  toContainError(expected: any): boolean;

  /**
   * Expect a component of the given type to show.
   *
   * 期望显示给定类型的组件。
   *
   */
  toContainComponent(expectedComponentType: Type<any>, expectationFailOutput?: any): boolean;

  /**
   * Invert the matchers.
   *
   * 反转匹配器。
   *
   */
  not: NgMatchers<T>;
}

const _global = <any>(typeof window === 'undefined' ? global : window);

/**
 * Jasmine matching function with Angular matchers mixed in.
 *
 * 混合了 Angular 匹配器的 Jasmine 匹配函数。
 *
 * ## Example
 *
 * ## 例子
 *
 * {@example testing/ts/matchers.ts region='toHaveText'}
 *
 */
export const expect: <T = any>(actual: T) => NgMatchers<T> = _global.expect;


// Some Map polyfills don't polyfill Map.toString correctly, which
// gives us bad error messages in tests.
// The only way to do this in Jasmine is to monkey patch a method
// to the object :-(
(Map as any).prototype['jasmineToString'] = function() {
  const m = this;
  if (!m) {
    return '' + m;
  }
  const res: any[] = [];
  m.forEach((v: any, k: any) => {
    res.push(`${String(k)}:${String(v)}`);
  });
  return `{ ${res.join(',')} }`;
};

_global.beforeEach(function() {
  jasmine.addMatchers({
    toBePromise: function() {
      return {
        compare: function(actual: any) {
          const pass = typeof actual === 'object' && typeof actual.then === 'function';
          return {
            pass: pass,
            get message() {
              return 'Expected ' + actual + ' to be a promise';
            }
          };
        }
      };
    },

    toBeAnInstanceOf: function() {
      return {
        compare: function(actual: any, expectedClass: any) {
          const pass = typeof actual === 'object' && actual instanceof expectedClass;
          return {
            pass: pass,
            get message() {
              return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
            }
          };
        }
      };
    },

    toHaveText: function() {
      return {
        compare: function(actual: any, expectedText: string) {
          const actualText = elementText(actual);
          return {
            pass: actualText == expectedText,
            get message() {
              return 'Expected ' + actualText + ' to be equal to ' + expectedText;
            }
          };
        }
      };
    },

    toHaveCssClass: function() {
      return {compare: buildError(false), negativeCompare: buildError(true)};

      function buildError(isNot: boolean) {
        return function(actual: any, className: string) {
          return {
            pass: hasClass(actual, className) == !isNot,
            get message() {
              return `Expected ${actual.outerHTML} ${
                  isNot ? 'not ' : ''}to contain the CSS class "${className}"`;
            }
          };
        };
      }
    },

    toHaveCssStyle: function() {
      return {
        compare: function(actual: any, styles: {[k: string]: string}|string) {
          let allPassed: boolean;
          if (typeof styles === 'string') {
            allPassed = hasStyle(actual, styles);
          } else {
            allPassed = Object.keys(styles).length !== 0;
            Object.keys(styles).forEach(prop => {
              allPassed = allPassed && hasStyle(actual, prop, styles[prop]);
            });
          }

          return {
            pass: allPassed,
            get message() {
              const expectedValueStr = typeof styles === 'string' ? styles : JSON.stringify(styles);
              return `Expected ${actual.outerHTML} ${!allPassed ? ' ' : 'not '}to contain the
                      CSS ${typeof styles === 'string' ? 'property' : 'styles'} "${
                  expectedValueStr}"`;
            }
          };
        }
      };
    },

    toContainError: function() {
      return {
        compare: function(actual: any, expectedText: any) {
          const errorMessage = actual.toString();
          return {
            pass: errorMessage.indexOf(expectedText) > -1,
            get message() {
              return 'Expected ' + errorMessage + ' to contain ' + expectedText;
            }
          };
        }
      };
    },

    toImplement: function() {
      return {
        compare: function(actualObject: any, expectedInterface: any) {
          const intProps = Object.keys(expectedInterface.prototype);

          const missedMethods: any[] = [];
          intProps.forEach((k) => {
            if (!actualObject.constructor.prototype[k]) missedMethods.push(k);
          });

          return {
            pass: missedMethods.length == 0,
            get message() {
              return 'Expected ' + actualObject +
                  ' to have the following methods: ' + missedMethods.join(', ');
            }
          };
        }
      };
    },

    toContainComponent: function() {
      return {
        compare: function(actualFixture: any, expectedComponentType: Type<any>) {
          const failOutput = arguments[2];
          const msgFn = (msg: string): string => [msg, failOutput].filter(Boolean).join(', ');

          // verify correct actual type
          if (!(actualFixture instanceof ComponentFixture)) {
            return {
              pass: false,
              message: msgFn(`Expected actual to be of type \'ComponentFixture\' [actual=${
                  actualFixture.constructor.name}]`)
            };
          }

          const found = !!actualFixture.debugElement.query(By.directive(expectedComponentType));
          return found ?
              {pass: true} :
              {pass: false, message: msgFn(`Expected ${expectedComponentType.name} to show`)};
        }
      };
    }
  });
});

function elementText(n: any): string {
  const hasNodes = (n: any) => {
    const children = n.childNodes;
    return children && children.length > 0;
  };

  if (n instanceof Array) {
    return n.map(elementText).join('');
  }

  if (isCommentNode(n)) {
    return '';
  }

  if (getDOM().isElementNode(n)) {
    const tagName = (n as Element).tagName;

    if (tagName === 'CONTENT') {
      return elementText(Array.prototype.slice.apply((<any>n).getDistributedNodes()));
    } else if (tagName === 'SLOT') {
      return elementText(Array.prototype.slice.apply((<any>n).assignedNodes()));
    }
  }

  if (hasShadowRoot(n)) {
    return elementText(childNodesAsList((<any>n).shadowRoot));
  }

  if (hasNodes(n)) {
    return elementText(childNodesAsList(n));
  }

  return (n as any).textContent;
}

function hasShadowRoot(node: any): boolean {
  return node.shadowRoot != null && node instanceof HTMLElement;
}
