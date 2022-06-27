/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ComponentFactoryResolver, Injector, Type} from '@angular/core';

/**
 * Provide methods for scheduling the execution of a callback.
 *
 * 提供用于调度回调执行的方法。
 *
 */
export const scheduler = {
  /**
   * Schedule a callback to be called after some delay.
   *
   * 安排在一段时间后调用的回调。
   *
   * Returns a function that when executed will cancel the scheduled function.
   *
   * 返回一个函数，执行时将取消计划的函数。
   *
   */
  schedule(taskFn: () => void, delay: number): () => void {
    const id = setTimeout(taskFn, delay);
    return () => clearTimeout(id);
  },

  /**
   * Schedule a callback to be called before the next render.
   * (If `window.requestAnimationFrame()` is not available, use `scheduler.schedule()` instead.)
   *
   * 安排要在下一次渲染之前调用的回调。 （如果 `window.requestAnimationFrame()` 不可用，请改用
   * `scheduler.schedule()` 。）
   *
   * Returns a function that when executed will cancel the scheduled function.
   *
   * 返回一个函数，执行时将取消计划的函数。
   *
   */
  scheduleBeforeRender(taskFn: () => void): () => void {
    // TODO(gkalpak): Implement a better way of accessing `requestAnimationFrame()`
    //                (e.g. accounting for vendor prefix, SSR-compatibility, etc).
    if (typeof window === 'undefined') {
      // For SSR just schedule immediately.
      return scheduler.schedule(taskFn, 0);
    }

    if (typeof window.requestAnimationFrame === 'undefined') {
      const frameMs = 16;
      return scheduler.schedule(taskFn, frameMs);
    }

    const id = window.requestAnimationFrame(taskFn);
    return () => window.cancelAnimationFrame(id);
  },
};

/**
 * Convert a camelCased string to kebab-cased.
 *
 * 将 camelCased 字符串转换为 kebab-cased。
 *
 */
export function camelToDashCase(input: string): string {
  return input.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
}

/**
 * Check whether the input is an `Element`.
 *
 * 检查输入是否是 `Element` 。
 *
 */
export function isElement(node: Node|null): node is Element {
  return !!node && node.nodeType === Node.ELEMENT_NODE;
}

/**
 * Check whether the input is a function.
 *
 * 检查输入是否是函数。
 *
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Convert a kebab-cased string to camelCased.
 *
 * 将 kebab 大小写的字符串转换为 camelCased。
 *
 */
export function kebabToCamelCase(input: string): string {
  return input.replace(/-([a-z\d])/g, (_, char) => char.toUpperCase());
}

let _matches: (this: any, selector: string) => boolean;

/**
 * Check whether an `Element` matches a CSS selector.
 * NOTE: this is duplicated from @angular/upgrade, and can
 * be consolidated in the future
 *
 * 检查 `Element` 是否与 CSS 选择器匹配。注：这是从 @angular/upgrade 复制的，并且可以在将来合并
 *
 */
export function matchesSelector(el: any, selector: string): boolean {
  if (!_matches) {
    const elProto = <any>Element.prototype;
    _matches = elProto.matches || elProto.matchesSelector || elProto.mozMatchesSelector ||
        elProto.msMatchesSelector || elProto.oMatchesSelector || elProto.webkitMatchesSelector;
  }
  return el.nodeType === Node.ELEMENT_NODE ? _matches.call(el, selector) : false;
}

/**
 * Test two values for strict equality, accounting for the fact that `NaN !== NaN`.
 *
 * 测试两个值的严格相等，考虑 `NaN !== NaN` 的事实。
 *
 */
export function strictEquals(value1: any, value2: any): boolean {
  return value1 === value2 || (value1 !== value1 && value2 !== value2);
}

/**
 * Gets a map of default set of attributes to observe and the properties they affect.
 *
 * 获取要观察的默认属性集及其影响的属性的映射。
 *
 */
export function getDefaultAttributeToPropertyInputs(
    inputs: {propName: string, templateName: string}[]) {
  const attributeToPropertyInputs: {[key: string]: string} = {};
  inputs.forEach(({propName, templateName}) => {
    attributeToPropertyInputs[camelToDashCase(templateName)] = propName;
  });

  return attributeToPropertyInputs;
}

/**
 * Gets a component's set of inputs. Uses the injector to get the component factory where the inputs
 * are defined.
 *
 * 获取组件的输入集。使用注入器来获取定义输入的组件工厂。
 *
 */
export function getComponentInputs(
    component: Type<any>, injector: Injector): {propName: string, templateName: string}[] {
  const componentFactoryResolver: ComponentFactoryResolver = injector.get(ComponentFactoryResolver);
  const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
  return componentFactory.inputs;
}
