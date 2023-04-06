/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';

/**
 * NgModule to install on the client side while using the `TransferState` to transfer state from
 * server to client.
 *
 * 要安装在客户端的 NgModule，它同时会使用 `TransferState` 将状态从服务器传输到客户端。
 *
 * @publicApi
 * @deprecated no longer needed, you can inject the `TransferState` in an app without providing
 *     this module.
 */
@NgModule({})
export class BrowserTransferStateModule {
}
