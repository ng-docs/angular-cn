/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Interface of `zone.js` configurations.
 *
 * `zone.js` 配置的接口。
 *
 * You can define the following configurations on the `window/global` object before
 * importing `zone.js` to change `zone.js` default behaviors.
 *
 * 你可以在导入 `zone.js` 之前在 `window/global` 对象上定义以下配置以更改 `zone.js` 默认行为。
 *
 */
interface ZoneGlobalConfigurations {
  /**
   * Disable the monkey patch of the `Node.js` `EventEmitter` API.
   *
   * 禁用 `Node.js` `EventEmitter` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches the `Node.js` `EventEmitter` APIs to make asynchronous
   * callbacks of those APIs in the same zone when scheduled.
   *
   * 默认情况下，`zone.js` `Node.js` `EventEmitter` API 进行修补，以按计划在同一个区域中对这些 API
   * 进行异步回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const EventEmitter = require('events');
   * class MyEmitter extends EventEmitter {}
   * const myEmitter = new MyEmitter();
   *
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   myEmitter.on('event', () => {
   *     console.log('an event occurs in the zone', Zone.current.name);
   *     // the callback runs in the zone when it is scheduled,
   *     // so the output is 'an event occurs in the zone myZone'.
   *   });
   * });
   * myEmitter.emit('event');
   * ```
   *
   * If you set `__Zone_disable_EventEmitter = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `EventEmitter` APIs and the above code
   * outputs 'an event occurred <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_EventEmitter = true` ，`zone.js` 不会对
   * `EventEmitter` API 进行猴子补丁，并且上面的代码会输出 'an event occurred<root>'。
   *
   */
  __Zone_disable_EventEmitter?: boolean;

  /**
   * Disable the monkey patch of the `Node.js` `fs` API.
   *
   * 禁用 `Node.js` `fs` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches `Node.js` `fs` APIs to make asynchronous callbacks of
   * those APIs in the same zone when scheduled.
   *
   * 默认情况下，`zone.js` 修补 `Node.js` `fs` API，以在调度时在同一个区域中对这些 API
   * 进行异步回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const fs = require('fs');
   *
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   fs.stat('/tmp/world', (err, stats) => {
   *     console.log('fs.stats() callback is invoked in the zone', Zone.current.name);
   *     // since the callback of the `fs.stat()` runs in the same zone
   *     // when it is called, so the output is 'fs.stats() callback is invoked in the zone myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_fs = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `fs` API and the above code
   * outputs 'get stats occurred <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_fs = true` ，`zone.js` 不会对 `fs` API
   * 进行猴子补丁，并且上面的代码输出 'get statsured<root>'。
   *
   */
  __Zone_disable_fs?: boolean;

  /**
   * Disable the monkey patch of the `Node.js` `timer` API.
   *
   * 禁用 `Node.js` `timer` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches the `Node.js` `timer` APIs to make asynchronous
   * callbacks of those APIs in the same zone when scheduled.
   *
   * 默认情况下，`zone.js` 修补 `Node.js` `timer` API，以按计划在同一个区域中对这些 API
   * 进行异步回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   setTimeout(() => {
   *     console.log('setTimeout() callback is invoked in the zone', Zone.current.name);
   *     // since the callback of `setTimeout()` runs in the same zone
   *     // when it is scheduled, so the output is 'setTimeout() callback is invoked in the zone
   *     // myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_timers = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `timer` APIs and the above code
   * outputs 'timeout <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_timers = true` ，`zone.js` 不会对 `timer` API
   * 进行猴子补丁，并且上面的代码输出 'timeout<root>'。
   *
   */
  __Zone_disable_node_timers?: boolean;

  /**
   * Disable the monkey patch of the `Node.js` `process.nextTick()` API.
   *
   * 禁用 `Node.js` `process.nextTick()` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches the `Node.js` `process.nextTick()` API to make the
   * callback in the same zone when calling `process.nextTick()`.
   *
   * 默认情况下，`zone.js` 修补 `Node.js` `process.nextTick()` API，以在调用 `process.nextTick()`
   * 时在同一个区域中进行回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   process.nextTick(() => {
   *     console.log('process.nextTick() callback is invoked in the zone', Zone.current.name);
   *     // since the callback of `process.nextTick()` runs in the same zone
   *     // when it is scheduled, so the output is 'process.nextTick() callback is invoked in the
   *     // zone myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_nextTick = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `process.nextTick()` API and the above code
   * outputs 'nextTick <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_nextTick = true` ，`zone.js` 不会对
   * `process.nextTick()` API 进行猴子补丁，并且上面的代码输出 'nextTick<root>'。
   *
   */
  __Zone_disable_nextTick?: boolean;

  /**
   * Disable the monkey patch of the `Node.js` `crypto` API.
   *
   * 禁用 `Node.js` `crypto` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches the `Node.js` `crypto` APIs to make asynchronous callbacks
   * of those APIs in the same zone when called.
   *
   * 默认情况下，`zone.js` 修补 `Node.js` `crypto` API，以在调用时在同一个区域中对这些 API
   * 进行异步回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const crypto = require('crypto');
   *
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   crypto.randomBytes(() => {
   *     console.log('crypto.randomBytes() callback is invoked in the zone', Zone.current.name);
   *     // since the callback of `crypto.randomBytes()` runs in the same zone
   *     // when it is called, so the output is 'crypto.randomBytes() callback is invoked in the
   *     // zone myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_crypto = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `crypto` API and the above code
   * outputs 'crypto <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_crypto = true` ，`zone.js` 不会对 `crypto` API
   * 进行猴子补丁，并且上面的代码会输出 'crypto<root>'。
   *
   */
  __Zone_disable_crypto?: boolean;

  /**
   * Disable the monkey patch of the `Object.defineProperty()` API.
   *
   * 禁用 `Object.defineProperty()` API 的猴子补丁。
   *
   * Note: This configuration is available only in the legacy bundle (dist/zone.js). This module is
   * not available in the evergreen bundle (zone-evergreen.js).
   *
   * 注意：此配置仅在旧版包 (dist/zone.js) 中可用。此模块在 evergreen 包 ( zone-evergreen.js )
   * 中不可用。
   *
   * In the legacy browser, the default behavior of `zone.js` is to monkey patch
   * `Object.defineProperty()` and `Object.create()` to try to ensure PropertyDescriptor parameter's
   * configurable property to be true. This patch is only needed in some old mobile browsers.
   *
   * 在旧版浏览器中，`zone.js` 的默认行为是对 `Object.defineProperty()` 和 `Object.create()`
   * 进行猴子补丁，以尝试确保 PropertyDescriptor 参数的可配置属性为
   * true。只有在某些旧的移动浏览器中需要此补丁。
   *
   * If you set `__Zone_disable_defineProperty = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `Object.defineProperty()` API and does not
   * modify desc.configurable to true.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_defineProperty = true` ，`zone.js` 不会对
   * `Object.defineProperty()` API 进行猴子补丁，并且不会将 desc.configurable 修改为 true。
   *
   */
  __Zone_disable_defineProperty?: boolean;

  /**
   * Disable the monkey patch of the browser `registerElement()` API.
   *
   * 禁用浏览器 `registerElement()` API 的猴子补丁。
   *
   * NOTE: This configuration is only available in the legacy bundle (dist/zone.js), this
   * module is not available in the evergreen bundle (zone-evergreen.js).
   *
   * 注意：此配置仅在旧版包 (dist/zone.js) 中可用，此模块在常绿包 (zone-evergreen.js) 中不可用。
   *
   * In the legacy browser, the default behavior of `zone.js` is to monkey patch the
   * `registerElement()` API to make asynchronous callbacks of the API in the same zone when
   * `registerElement()` is called.
   *
   * 在旧版浏览器中，`zone.js` 的默认行为是对 `registerElement()` API 进行猴子修补，以在调用
   * `registerElement()` 时在同一个区域中对 API 进行异步回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const proto = Object.create(HTMLElement.prototype);
   * proto.createdCallback = function() {
   *   console.log('createdCallback is invoked in the zone', Zone.current.name);
   * };
   * proto.attachedCallback = function() {
   *   console.log('attachedCallback is invoked in the zone', Zone.current.name);
   * };
   * proto.detachedCallback = function() {
   *   console.log('detachedCallback is invoked in the zone', Zone.current.name);
   * };
   * proto.attributeChangedCallback = function() {
   *   console.log('attributeChangedCallback is invoked in the zone', Zone.current.name);
   * };
   *
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   document.registerElement('x-elem', {prototype: proto});
   * });
   * ```
   *
   * When these callbacks are invoked, those callbacks will be in the zone when
   * `registerElement()` is called.
   *
   * 当调用这些回调时，这些回调将在调用 `registerElement()` 时的区域中。
   *
   * If you set `__Zone_disable_registerElement = true` before importing `zone.js`,
   * `zone.js` does not monkey patch `registerElement()` API and the above code
   * outputs '<root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_registerElement = true` ，`zone.js`
   * 不会猴子补丁 `registerElement()` API 并且上面的代码输出 '<root>'。
   *
   */
  __Zone_disable_registerElement?: boolean;

  /**
   * Disable the monkey patch of the browser legacy `EventTarget` API.
   *
   * 禁用浏览器旧版 `EventTarget` API 的猴子补丁。
   *
   * NOTE: This configuration is only available in the legacy bundle (dist/zone.js), this module
   * is not available in the evergreen bundle (zone-evergreen.js).
   *
   * 注意：此配置仅在旧版包 (dist/zone.js) 中可用，此模块在常绿包 (zone-evergreen.js) 中不可用。
   *
   * In some old browsers, the `EventTarget` is not available, so `zone.js` cannot directly monkey
   * patch the `EventTarget`. Instead, `zone.js` patches all known HTML elements' prototypes (such
   * as `HtmlDivElement`). The callback of the `addEventListener()` will be in the same zone when
   * the `addEventListener()` is called.
   *
   * 在某些旧版浏览器中，`EventTarget` 不可用，因此 `zone.js` 不能直接猴子修补 `EventTarget`
   * 。相反，`zone.js` 修补所有已知的 HTML 元素的原型（例如 `HtmlDivElement`）。调用
   * `addEventListener()` `addEventListener()` 回调将在同一个区域中。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   div.addEventListener('click', () => {
   *     console.log('div click event listener is invoked in the zone', Zone.current.name);
   *     // the output is 'div click event listener is invoked in the zone myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_EventTargetLegacy = true` before importing `zone.js`
   * In some old browsers, where `EventTarget` is not available, if you set
   * `__Zone_disable_EventTargetLegacy = true` before importing `zone.js`, `zone.js` does not monkey
   * patch all HTML element APIs and the above code outputs 'clicked <root>'.
   *
   * 如果你在 `zone.js` `zone.js` `EventTarget` `zone.js` `__Zone_disable_EventTargetLegacy = true`
   * `__Zone_disable_EventTargetLegacy = true` '点击<root>'。
   *
   */
  __Zone_disable_EventTargetLegacy?: boolean;

  /**
   * Disable the monkey patch of the browser `timer` APIs.
   *
   * 禁用浏览器 `timer` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches browser timer
   * APIs (`setTimeout()`/`setInterval()`/`setImmediate()`) to make asynchronous callbacks of those
   * APIs in the same zone when scheduled.
   *
   * 默认情况下，`zone.js` 修补浏览器计时器 API ( `setTimeout()` / `setInterval()` /
   * `setImmediate()` ) 以在调度时在同一个区域中对这些 API 进行异步回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   setTimeout(() => {
   *     console.log('setTimeout() callback is invoked in the zone', Zone.current.name);
   *     // since the callback of `setTimeout()` runs in the same zone
   *     // when it is scheduled, so the output is 'setTimeout() callback is invoked in the zone
   *     // myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_timers = true` before importing `zone.js`,
   * `zone.js` does not monkey patch `timer` API and the above code
   * outputs 'timeout <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_timers = true` ，`zone.js` 不会猴子修补
   * `timer` API，并且上面的代码输出 'timeout<root>'。
   *
   */
  __Zone_disable_timers?: boolean;

  /**
   * Disable the monkey patch of the browser `requestAnimationFrame()` API.
   *
   * 禁用浏览器 `requestAnimationFrame()` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches the browser `requestAnimationFrame()` API
   * to make the asynchronous callback of the `requestAnimationFrame()` in the same zone when
   * scheduled.
   *
   * 默认情况下，`zone.js` 修补浏览器 `requestAnimationFrame()` API，以按计划在同一个区域中进行
   * `requestAnimationFrame()` 的异步回调。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   requestAnimationFrame(() => {
   *     console.log('requestAnimationFrame() callback is invoked in the zone', Zone.current.name);
   *     // since the callback of `requestAnimationFrame()` will be in the same zone
   *     // when it is scheduled, so the output will be 'requestAnimationFrame() callback is invoked
   *     // in the zone myZone'
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_requestAnimationFrame = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `requestAnimationFrame()` API and the above code
   * outputs 'raf <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_requestAnimationFrame = true` ，`zone.js`
   * 不会对 `requestAnimationFrame()` API 进行修补，并且上面的代码输出 'raf<root>'。
   *
   */
  __Zone_disable_requestAnimationFrame?: boolean;

  /**
   * Disable the monkey patching of the browser's `queueMicrotask()` API.
   *
   * 禁用浏览器的 `queueMicrotask()` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches the browser's `queueMicrotask()` API
   * to ensure that `queueMicrotask()` callback is invoked in the same zone as zone used to invoke
   * `queueMicrotask()`. And also the callback is running as `microTask` like
   * `Promise.prototype.then()`.
   *
   * 默认情况下，`zone.js` 修补浏览器的 `queueMicrotask()` API 以确保 `queueMicrotask()`
   * 回调在与调用 `queueMicrotask()` 所用的区域相同的区域中调用。并且回调作为 `microTask` 运行，例如
   * `Promise.prototype.then()` 。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   queueMicrotask(() => {
   *     console.log('queueMicrotask() callback is invoked in the zone', Zone.current.name);
   *     // Since `queueMicrotask()` was invoked in `myZone`, same zone is restored
   *     // when 'queueMicrotask() callback is invoked, resulting in `myZone` being console logged.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_queueMicrotask = true` before importing `zone.js`,
   * `zone.js` does not monkey patch the `queueMicrotask()` API and the above code
   * output will change to: 'queueMicrotask() callback is invoked in the zone <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_queueMicrotask = true` ，`zone.js` 不会对
   * `queueMicrotask()` API 进行猴子修补，并且上面的代码输出将更改为： 'queueMicrotask()
   * 回调是在区域中调用的<root>'。
   *
   */
  __Zone_disable_queueMicrotask?: boolean;

  /**
   * Disable the monkey patch of the browser blocking APIs(`alert()`/`prompt()`/`confirm()`).
   *
   * 禁用浏览器阻塞 API 的猴子补丁（`alert()` / `prompt()` / `confirm()`）。
   *
   */
  __Zone_disable_blocking?: boolean;

  /**
   * Disable the monkey patch of the browser `EventTarget` APIs.
   *
   * 禁用浏览器 `EventTarget` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches EventTarget APIs. The callbacks of the
   * `addEventListener()` run in the same zone when the `addEventListener()` is called.
   *
   * 默认情况下，`zone.js` 猴子修补 EventTarget API。调用 `addEventListener()` 时，
   * `addEventListener()` 的回调在同一个区域中运行。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   div.addEventListener('click', () => {
   *     console.log('div event listener is invoked in the zone', Zone.current.name);
   *     // the output is 'div event listener is invoked in the zone myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_EventTarget = true` before importing `zone.js`,
   * `zone.js` does not monkey patch EventTarget API and the above code
   * outputs 'clicked <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_EventTarget = true` ，`zone.js` 不会对
   * EventTarget API 进行猴子补丁，并且上面的代码输出 'clicked<root>'。
   *
   */
  __Zone_disable_EventTarget?: boolean;

  /**
   * Disable the monkey patch of the browser `FileReader` APIs.
   *
   * 禁用浏览器 `FileReader` API 的猴子补丁。
   *
   */
  __Zone_disable_FileReader?: boolean;

  /**
   * Disable the monkey patch of the browser `MutationObserver` APIs.
   *
   * 禁用浏览器 `MutationObserver` API 的猴子补丁。
   *
   */
  __Zone_disable_MutationObserver?: boolean;

  /**
   * Disable the monkey patch of the browser `IntersectionObserver` APIs.
   *
   * 禁用浏览器 `IntersectionObserver` API 的猴子补丁。
   *
   */
  __Zone_disable_IntersectionObserver?: boolean;

  /**
   * Disable the monkey patch of the browser onProperty APIs(such as onclick).
   *
   * 禁用浏览器 onProperty API 的猴子补丁（例如 onclick）。
   *
   * By default, `zone.js` monkey patches onXXX properties (such as onclick). The callbacks of onXXX
   * properties run in the same zone when the onXXX properties is set.
   *
   * 默认情况下，`zone.js` 猴子会修补 onXXX 属性（例如 onclick）。设置 onXXX 属性时，onXXX
   * 属性的回调在同一个区域中运行。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   * zone.run(() => {
   *   div.onclick = () => {
   *     console.log('div click event listener is invoked in the zone', Zone.current.name);
   *     // the output will be 'div click event listener is invoked in the zone myZone'
   *   }
   * });
   * ```
   *
   * If you set `__Zone_disable_on_property = true` before importing `zone.js`,
   * `zone.js` does not monkey patch onXXX properties and the above code
   * outputs 'clicked <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_on_property = true` ，`zone.js` 不会猴子修补
   * onXXX 属性，并且上面的代码输出 'clicked<root>'。
   *
   */
  __Zone_disable_on_property?: boolean;

  /**
   * Disable the monkey patch of the browser `customElements` APIs.
   *
   * 禁用浏览器 `customElements` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches `customElements` APIs to make callbacks run in the
   * same zone when the `customElements.define()` is called.
   *
   * 默认情况下，`zone.js` 猴子会修补 `customElements` API，以使回调在调用
   * `customElements.define()` 时在同一个区域中运行。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * class TestCustomElement extends HTMLElement {
   *   constructor() { super(); }
   *   connectedCallback() {}
   *   disconnectedCallback() {}
   *   attributeChangedCallback(attrName, oldVal, newVal) {}
   *   adoptedCallback() {}
   * }
   *
   * const zone = Zone.fork({name: 'myZone'});
   * zone.run(() => {
   *   customElements.define('x-elem', TestCustomElement);
   * });
   * ```
   *
   * All those callbacks defined in TestCustomElement runs in the zone when
   * the `customElements.define()` is called.
   *
   * 当调用 `customElements.define()` 时，TestCustomElement 中定义的所有这些回调都在区域中运行。
   *
   * If you set `__Zone_disable_customElements = true` before importing `zone.js`,
   * `zone.js` does not monkey patch `customElements` APIs and the above code
   * runs inside <root> zone.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_customElements = true` ，`zone.js`
   * 不会猴子修补 `customElements` API，并且上面的代码在里面运行<root>区。
   *
   */
  __Zone_disable_customElements?: boolean;

  /**
   * Disable the monkey patch of the browser `XMLHttpRequest` APIs.
   *
   * 禁用浏览器 `XMLHttpRequest` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches `XMLHttpRequest` APIs to make XMLHttpRequest act
   * as macroTask.
   *
   * 默认情况下，`zone.js` 修补 `XMLHttpRequest` API 以使 XMLHttpRequest 充当宏任务。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({
   *   name: 'myZone',
   *   onScheduleTask: (delegate, curr, target, task) => {
   *     console.log('task is scheduled', task.type, task.source, task.zone.name);
   *     return delegate.scheduleTask(target, task);
   *   }
   * })
   * const xhr = new XMLHttpRequest();
   * zone.run(() => {
   *   xhr.onload = function() {};
   *   xhr.open('get', '/', true);
   *   xhr.send();
   * });
   * ```
   *
   * In this example, the instance of XMLHttpRequest runs in the zone and acts as a macroTask. The
   * output is 'task is scheduled macroTask, XMLHttpRequest.send, zone'.
   *
   * 在此示例中，XMLHttpRequest
   * 的实例在区域中运行，并作为宏任务。输出是“任务是调度的宏任务，XMLHttpRequest.send，区域”。
   *
   * If you set `__Zone_disable_XHR = true` before importing `zone.js`,
   * `zone.js` does not monkey patch `XMLHttpRequest` APIs and the above onScheduleTask callback
   * will not be called.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_XHR = true` ，`zone.js` 不会对
   * `XMLHttpRequest` API 进行猴子补丁，并且不会调用上面的 onScheduleTask 回调。
   *
   */
  __Zone_disable_XHR?: boolean;

  /**
   * Disable the monkey patch of the browser geolocation APIs.
   *
   * 禁用浏览器地理定位 API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches geolocation APIs to make callbacks run in the same zone
   * when those APIs are called.
   *
   * 默认情况下，`zone.js` 修补地理定位 API，以使回调在调用这些 API 时在同一个区域中运行。
   *
   * Consider the following examples:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({
   *   name: 'myZone'
   * });
   *
   * zone.run(() => {
   *   navigator.geolocation.getCurrentPosition(pos => {
   *     console.log('navigator.getCurrentPosition() callback is invoked in the zone',
   *     Zone.current.name);
   *     // output is 'navigator.getCurrentPosition() callback is invoked in the zone myZone'.
   *   }
   * });
   * ```
   *
   * If set you `__Zone_disable_geolocation = true` before importing `zone.js`,
   * `zone.js` does not monkey patch geolocation APIs and the above code
   * outputs 'getCurrentPosition <root>'.
   *
   * 如果在导入 `zone.js` 之前设置你 `__Zone_disable_geolocation = true` ，`zone.js`
   * 不会猴子修补地理定位 API，并且上面的代码输出 'getCurrentPosition<root>'。
   *
   */
  __Zone_disable_geolocation?: boolean;

  /**
   * Disable the monkey patch of the browser `canvas` APIs.
   *
   * 禁用浏览器 `canvas` API 的猴子补丁。
   *
   * By default, `zone.js` monkey patches `canvas` APIs to make callbacks run in the same zone when
   * those APIs are called.
   *
   * 默认情况下，`zone.js` 猴子会修补 `canvas` API，以使这些 API 被调用时回调在同一个区域中运行。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({
   *   name: 'myZone'
   * });
   *
   * zone.run(() => {
   *   canvas.toBlob(blog => {
   *     console.log('canvas.toBlob() callback is invoked in the zone', Zone.current.name);
   *     // output is 'canvas.toBlob() callback is invoked in the zone myZone'.
   *   }
   * });
   * ```
   *
   * If you set `__Zone_disable_canvas = true` before importing `zone.js`,
   * `zone.js` does not monkey patch `canvas` APIs and the above code
   * outputs 'canvas.toBlob <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_canvas = true` ，`zone.js` 不会猴子修补
   * `canvas` API，并且上面的代码输出 'canvas.toBlob<root>'。
   *
   */
  __Zone_disable_canvas?: boolean;

  /**
   * Disable the `Promise` monkey patch.
   *
   * 禁用 `Promise` 猴子补丁。
   *
   * By default, `zone.js` monkey patches `Promise` APIs to make the `then()/catch()` callbacks in
   * the same zone when those callbacks are called.
   *
   * 默认情况下，`zone.js` 修补 `Promise` API，以在调用 `then()/catch()`
   * 回调时在同一个区域中进行这些回调。
   *
   * Consider the following examples:
   *
   * 考虑以下示例：
   *
   * ```
   * const zone = Zone.current.fork({name: 'myZone'});
   *
   * const p = Promise.resolve(1);
   *
   * zone.run(() => {
   *   p.then(() => {
   *     console.log('then() callback is invoked in the zone', Zone.current.name);
   *     // output is 'then() callback is invoked in the zone myZone'.
   *   });
   * });
   * ```
   *
   * If you set `__Zone_disable_ZoneAwarePromise = true` before importing `zone.js`,
   * `zone.js` does not monkey patch `Promise` APIs and the above code
   * outputs 'promise then callback <root>'.
   *
   * 如果你在导入 `zone.js` 之前设置 `__Zone_disable_ZoneAwarePromise = true` ，`zone.js` 不会对
   * `Promise` API 进行猴子补丁，并且上面的代码输出 'promise then callback<root>'。
   *
   */
  __Zone_disable_ZoneAwarePromise?: boolean;

  /**
   * Define event names that users don't want monkey patched by the `zone.js`.
   *
   * 定义用户不希望由 `zone.js` 修补的事件名称。
   *
   * By default, `zone.js` monkey patches EventTarget.addEventListener(). The event listener
   * callback runs in the same zone when the addEventListener() is called.
   *
   * 默认情况下，`zone.js` 猴子修补 EventTarget.addEventListener() 。调用 addEventListener()
   * 时，事件侦听器回调在同一个区域中运行。
   *
   * Sometimes, you don't want all of the event names used in this patched version because it
   * impacts performance. For example, you might want `scroll` or `mousemove` event listeners to run
   * the native `addEventListener()` for better performance.
   *
   * 有时，你不希望此修补版本中使用的所有事件名称，因为它会影响性能。例如，你可能希望 `scroll` 或
   * `mousemove` 事件侦听器运行本机 `addEventListener()` 以获得更好的性能。
   *
   * Users can achieve this goal by defining `__zone_symbol__UNPATCHED_EVENTS = ['scroll',
   * 'mousemove'];` before importing `zone.js`.
   *
   * 用户可以通过定义 `__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove'];`
   * 来实现这个目标在导入 `zone.js` 之前。
   *
   */
  __zone_symbol__UNPATCHED_EVENTS?: string[];

  /**
   * Define the event names of the passive listeners.
   *
   * 定义被动侦听器的事件名称。
   *
   * To add passive event listeners, you can use `elem.addEventListener('scroll', listener,
   * {passive: true});` or implement your own `EventManagerPlugin`.
   *
   * 要添加被动事件侦听器，你可以用 `elem.addEventListener('scroll', listener, {passive: true});`
   * 或实现你自己的 `EventManagerPlugin` 。
   *
   * You can also define a global variable as follows:
   *
   * 你还可以定义一个全局变量，如下所示：
   *
   * ```
   * __zone_symbol__PASSIVE_EVENTS = ['scroll'];
   * ```
   *
   * The preceding code makes all scroll event listeners passive.
   *
   * 前面的代码使所有滚动事件侦听器都是被动的。
   *
   */
  __zone_symbol__PASSIVE_EVENTS?: string[];

  /**
   * Disable wrapping uncaught promise rejection.
   *
   * 禁用包装未捕获的 Promise 拒绝。
   *
   * By default, `zone.js` wraps the uncaught promise rejection in a new `Error` object
   * which contains additional information such as a value of the rejection and a stack trace.
   *
   * 默认情况下，`zone.js` 未捕获的 Promise 拒绝包装在一个新的 `Error`
   * 对象中，该对象包含其他信息，例如拒绝的值和堆栈跟踪。
   *
   * If you set `__zone_symbol__DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION = true;` before
   * importing `zone.js`, `zone.js` will not wrap the uncaught promise rejection.
   *
   * 如果你设置 `__zone_symbol__DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION = true;` 在导入
   * `zone.js` 之前，`zone.js` 不会包装未捕获的 Promise 拒绝。
   *
   */
  __zone_symbol__DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION?: boolean;
}

/**
 * Interface of `zone-testing.js` test configurations.
 *
 * `zone-testing.js` 测试配置的接口。
 *
 * You can define the following configurations on the `window` or `global` object before
 * importing `zone-testing.js` to change `zone-testing.js` default behaviors in the test runner.
 *
 * 你可以在导入 `zone-testing.js` 之前在 `window` 或 `global`
 * 对象上定义以下配置，以更改测试运行器中的 `zone-testing.js` 默认行为。
 *
 */
interface ZoneTestConfigurations {
  /**
   * Disable the Jasmine integration.
   *
   * 禁用 Jasmine 集成。
   *
   * In the `zone-testing.js` bundle, by default, `zone-testing.js` monkey patches Jasmine APIs
   * to make Jasmine APIs run in specified zone.
   *
   * 默认情况下，在 `zone-testing.js` 包中，`zone-testing.js` 猴子修补 Jasmine API 以使 Jasmine API
   * 在指定区域中运行。
   *
   * 1. Make the `describe()`/`xdescribe()`/`fdescribe()` methods run in the syncTestZone.
   *
   *    使 `describe()` / `xdescribe()` / `fdescribe()` 方法在 syncTestZone 中运行。
   *
   * 2. Make the `it()`/`xit()`/`fit()`/`beforeEach()`/`afterEach()`/`beforeAll()`/`afterAll()`
   *    methods run in the ProxyZone.
   *
   *    使 `it()` / `xit()` / `fit()` / `beforeEach()` / `afterEach()` / `beforeAll()` /
   * `afterAll()` 方法在 ProxyZone 中运行。
   *
   * With this patch, `async()`/`fakeAsync()` can work with the Jasmine runner.
   *
   * 使用此补丁，`async()` / `fakeAsync()` 可以与 Jasmine 运行器一起使用。
   *
   * If you set `__Zone_disable_jasmine = true` before importing `zone-testing.js`,
   * `zone-testing.js` does not monkey patch the jasmine APIs and the `async()`/`fakeAsync()` cannot
   * work with the Jasmine runner any longer.
   *
   * 如果你在导入 `zone-testing.js` 之前设置 `__Zone_disable_jasmine = true` ，则 `zone-testing.js`
   * 不会对 jasmine API 进行猴子补丁，并且 `async()` / `fakeAsync()` 不能再与 Jasmine
   * 运行器一起使用。
   *
   */
  __Zone_disable_jasmine?: boolean;

  /**
   * Disable the Mocha integration.
   *
   * 禁用 Mocha 集成。
   *
   * In the `zone-testing.js` bundle, by default, `zone-testing.js` monkey patches the Mocha APIs
   * to make Mocha APIs run in the specified zone.
   *
   * 默认情况下，在 `zone-testing.js` 包中，`zone-testing.js` Monkey 修补 Mocha API 以使 Mocha API
   * 在指定的区域中运行。
   *
   * 1. Make the `describe()`/`xdescribe()`/`fdescribe()` methods run in the syncTestZone.
   *
   *    使 `describe()` / `xdescribe()` / `fdescribe()` 方法在 syncTestZone 中运行。
   *
   * 2. Make the `it()`/`xit()`/`fit()`/`beforeEach()`/`afterEach()`/`beforeAll()`/`afterAll()`
   *    methods run in the ProxyZone.
   *
   *    使 `it()` / `xit()` / `fit()` / `beforeEach()` / `afterEach()` / `beforeAll()` /
   * `afterAll()` 方法在 ProxyZone 中运行。
   *
   * With this patch, `async()`/`fakeAsync()` can work with the Mocha runner.
   *
   * 使用此补丁，`async()` / `fakeAsync()` 可以与 Mocha 运行器一起使用。
   *
   * If you set `__Zone_disable_mocha = true` before importing `zone-testing.js`,
   * `zone-testing.js` does not monkey patch the Mocha APIs and the `async()/`fakeAsync()\` can not
   * work with the Mocha runner any longer.
   *
   * 如果你在导入 `zone-testing.js` 之前设置 `__Zone_disable_mocha = true` ，则 `zone-testing.js`
   * 不会对 Mocha API 进行猴子补丁，并且 `async()/` fakeAsync() \` 不能再与 Mocha 运行器一起使用。
   *
   */
  __Zone_disable_mocha?: boolean;

  /**
   * Disable the Jest integration.
   *
   * 禁用 Jest 集成。
   *
   * In the `zone-testing.js` bundle, by default, `zone-testing.js` monkey patches Jest APIs
   * to make Jest APIs run in the specified zone.
   *
   * 默认情况下，在 `zone-testing.js` 包中，`zone-testing.js` 猴子修补 Jest API 以使 Jest API
   * 在指定的区域中运行。
   *
   * 1. Make the `describe()`/`xdescribe()`/`fdescribe()` methods run in the syncTestZone.
   *
   *    使 `describe()` / `xdescribe()` / `fdescribe()` 方法在 syncTestZone 中运行。
   *
   * 2. Make the `it()`/`xit()`/`fit()`/`beforeEach()`/`afterEach()`/`before()`/`after()` methods
   *    run in the ProxyZone.
   *
   *    使 `it()` / `xit()` / `fit()` / `beforeEach()` / `afterEach()` / `before()` / `after()`
   * 方法在 ProxyZone 中运行。
   *
   * With this patch, `async()`/`fakeAsync()` can work with the Jest runner.
   *
   * 使用此补丁，`async()` / `fakeAsync()` 可以与 Jest 运行器一起使用。
   *
   * If you set `__Zone_disable_jest = true` before importing `zone-testing.js`,
   * `zone-testing.js` does not monkey patch the jest APIs and `async()`/`fakeAsync()` cannot
   * work with the Jest runner any longer.
   *
   * 如果你在导入 `zone-testing.js` 之前设置 `__Zone_disable_jest = true` ，则 `zone-testing.js`
   * 不会对 jest API 进行猴子补丁，并且 `async()` / `fakeAsync()` 不能再与 Jest 运行器一起使用。
   *
   */
  __Zone_disable_jest?: boolean;

  /**
   * Disable monkey patch the jasmine clock APIs.
   *
   * 禁用猴子补丁 jasmine 时钟 API。
   *
   * By default, `zone-testing.js` monkey patches the `jasmine.clock()` API,
   * so the `jasmine.clock()` can work with the `fakeAsync()/tick()` API.
   *
   * 默认情况下，`zone-testing.js` 猴子会修补 `jasmine.clock()` API，因此 `jasmine.clock()` 可以与
   * `fakeAsync()/tick()` API 一起使用。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * describe('jasmine.clock integration', () => {
   *   beforeEach(() => {
   *     jasmine.clock().install();
   *   });
   *   afterEach(() => {
   *     jasmine.clock().uninstall();
   *   });
   *   it('fakeAsync test', fakeAsync(() => {
   *     setTimeout(spy, 100);
   *     expect(spy).not.toHaveBeenCalled();
   *     jasmine.clock().tick(100);
   *     expect(spy).toHaveBeenCalled();
   *   }));
   * });
   * ```
   *
   * In the `fakeAsync()` method, `jasmine.clock().tick()` works just like `tick()`.
   *
   * 在 `fakeAsync()` 方法中，`jasmine.clock().tick()` 的工作方式与 `tick()` 一样。
   *
   * If you set `__zone_symbol__fakeAsyncDisablePatchingClock = true` before importing
   * `zone-testing.js`,`zone-testing.js` does not monkey patch the `jasmine.clock()` APIs and the
   * `jasmine.clock()` cannot work with `fakeAsync()` any longer.
   *
   * 如果你在导入 `zone-testing.js` 之前设置 `__zone_symbol__fakeAsyncDisablePatchingClock = true`
   * ，则 `zone-testing.js` 不会对 `jasmine.clock()` API 进行猴子补丁，并且 `jasmine.clock()`
   * 不能再与 `fakeAsync()` 一起使用。
   *
   */
  __zone_symbol__fakeAsyncDisablePatchingClock?: boolean;

  /**
   * Enable auto running into `fakeAsync()` when installing the `jasmine.clock()`.
   *
   * 安装 `fakeAsync()` `jasmine.clock()` 。
   *
   * By default, `zone-testing.js` does not automatically run into `fakeAsync()`
   * if the `jasmine.clock().install()` is called.
   *
   * 默认情况下，如果 `jasmine.clock().install()` ，则 `zone-testing.js` 不会自动运行 `fakeAsync()`
   * 。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * describe('jasmine.clock integration', () => {
   *   beforeEach(() => {
   *     jasmine.clock().install();
   *   });
   *   afterEach(() => {
   *     jasmine.clock().uninstall();
   *   });
   *   it('fakeAsync test', fakeAsync(() => {
   *     setTimeout(spy, 100);
   *     expect(spy).not.toHaveBeenCalled();
   *     jasmine.clock().tick(100);
   *     expect(spy).toHaveBeenCalled();
   *   }));
   * });
   * ```
   *
   * You must run `fakeAsync()` to make test cases in the `FakeAsyncTestZone`.
   *
   * 你必须运行 `fakeAsync()` 才能在 `FakeAsyncTestZone` 中创建测试用例。
   *
   * If you set `__zone_symbol__fakeAsyncAutoFakeAsyncWhenClockPatched = true` before importing
   * `zone-testing.js`, `zone-testing.js` can run test case automatically in the
   * `FakeAsyncTestZone` without calling the `fakeAsync()`.
   *
   * 如果你在导入 `zone-testing.js` 之前设置 `__zone_symbol__fakeAsyncAutoFakeAsyncWhenClockPatched
   * = true` ，则 `zone-testing.js` 可以在 `FakeAsyncTestZone` 中自动运行测试用例，而无需调用
   * `fakeAsync()` 。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * describe('jasmine.clock integration', () => {
   *   beforeEach(() => {
   *     jasmine.clock().install();
   *   });
   *   afterEach(() => {
   *     jasmine.clock().uninstall();
   *   });
   *   it('fakeAsync test', () => { // here we don't need to call fakeAsync
   *     setTimeout(spy, 100);
   *     expect(spy).not.toHaveBeenCalled();
   *     jasmine.clock().tick(100);
   *     expect(spy).toHaveBeenCalled();
   *   });
   * });
   * ```
   *
   */
  __zone_symbol__fakeAsyncAutoFakeAsyncWhenClockPatched?: boolean;

  /**
   * Enable waiting for the unresolved promise in the `async()` test.
   *
   * 在 `async()` 测试中启用等待未解决的 Promise 。
   *
   * In the `async()` test, `AsyncTestZone` waits for all the asynchronous tasks to finish. By
   * default, if some promises remain unresolved, `AsyncTestZone` does not wait and reports that it
   * received an unexpected result.
   *
   * 在 `async()` 测试中，`AsyncTestZone` 会等待所有异步任务完成。默认情况下，如果某些 Promise
   * 仍未解决，`AsyncTestZone` 不会等待并报告它收到了意外的结果。
   *
   * Consider the following example:
   *
   * 考虑以下示例：
   *
   * ```
   * describe('wait never resolved promise', () => {
   *   it('async with never resolved promise test', async(() => {
   *     const p = new Promise(() => {});
   *     p.then(() => {
   *       // do some expectation.
   *     });
   *   }))
   * });
   * ```
   *
   * By default, this case passes, because the callback of `p.then()` is never called. Because `p`
   * is an unresolved promise, there is no pending asynchronous task, which means the `async()`
   * method does not wait.
   *
   * 默认情况下，这种情况会通过，因为 `p.then()` 的回调永远不会被调用。因为 `p` 是一个未解决的
   * Promise，所以没有挂起的异步任务，这意味着 `async()` 方法不会等待。
   *
   * If you set `__zone_symbol__supportWaitUnResolvedChainedPromise = true`, the above case
   * times out, because `async()` will wait for the unresolved promise.
   *
   * 如果你设置 `__zone_symbol__supportWaitUnResolvedChainedPromise = true` ，则上述情况会超时，因为
   * `async()` 将等待未解决的 Promise 。
   *
   */
  __zone_symbol__supportWaitUnResolvedChainedPromise?: boolean;
}

/**
 * The interface of the `zone.js` runtime configurations.
 *
 * `zone.js` 运行时配置的接口。
 *
 * These configurations can be defined on the `Zone` object after
 * importing zone.js to change behaviors. The differences between
 * the `ZoneRuntimeConfigurations` and the `ZoneGlobalConfigurations` are,
 *
 * 可以在导入 zone.js 以更改行为之后在 `Zone` 对象上定义这些配置。 `ZoneRuntimeConfigurations` 和
 * `ZoneGlobalConfigurations` 之间的区别是，
 *
 * 1. `ZoneGlobalConfigurations` must be defined on the `global/window` object before importing
 *    `zone.js`. The value of the configuration cannot be changed at runtime.
 *
 *    `ZoneGlobalConfigurations` 必须在导入 `zone.js` 之前在 `global/window`
 * 对象上定义。配置的值不能在运行时更改。
 *
 * 2. `ZoneRuntimeConfigurations` must be defined on the `Zone` object after importing `zone.js`.
 *    You can change the value of this configuration at runtime.
 *
 *    导入 `ZoneRuntimeConfigurations` 之后，必须在 `Zone` 对象上定义 `zone.js`
 * 。你可以在运行时更改此配置的值。
 *
 */
interface ZoneRuntimeConfigurations {
  /**
   * Ignore outputting errors to the console when uncaught Promise errors occur.
   *
   * 发生未捕获的 Promise 错误时，忽略将错误输出到控制台。
   *
   * By default, if an uncaught Promise error occurs, `zone.js` outputs the
   * error to the console by calling `console.error()`.
   *
   * 默认情况下，如果发生未捕获的 Promise 错误，`zone.js` 会通过调用 `console.error()`
   * 将错误输出到控制台。
   *
   * If you set `__zone_symbol__ignoreConsoleErrorUncaughtError = true`, `zone.js` does not output
   * the uncaught error to `console.error()`.
   *
   * 如果你设置 `__zone_symbol__ignoreConsoleErrorUncaughtError = true` ，`zone.js`
   * 不会将未捕获的错误输出到 `console.error()` 。
   *
   */
  __zone_symbol__ignoreConsoleErrorUncaughtError?: boolean;
}
