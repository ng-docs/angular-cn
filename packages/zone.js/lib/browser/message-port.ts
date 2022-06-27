/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Monkey patch `MessagePort.prototype.onmessage` and `MessagePort.prototype.onmessageerror`
 * properties to make the callback in the zone when the value are set.
 *
 * Monkey 修补程序 `MessagePort.prototype.onmessage` 和 `MessagePort.prototype.onmessageerror`
 * 属性，以在设置值时在区域中进行回调。
 *
 */
Zone.__load_patch('MessagePort', (global: any, Zone: ZoneType, api: _ZonePrivate) => {
  const MessagePort = global['MessagePort'];
  if (typeof MessagePort !== 'undefined' && MessagePort.prototype) {
    api.patchOnProperties(MessagePort.prototype, ['message', 'messageerror']);
  }
});
