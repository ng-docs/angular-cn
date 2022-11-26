/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {APP_ID, NgModule, Provider} from '@angular/core';
import {TransferState, ɵescapeHtml as escapeHtml} from '@angular/platform-browser';

import {BEFORE_APP_SERIALIZED} from './tokens';

export const TRANSFER_STATE_SERIALIZATION_PROVIDERS: Provider[] = [{
  provide: BEFORE_APP_SERIALIZED,
  useFactory: serializeTransferStateFactory,
  deps: [DOCUMENT, APP_ID, TransferState],
  multi: true,
}];

function serializeTransferStateFactory(doc: Document, appId: string, transferStore: TransferState) {
  return () => {
    // The `.toJSON` here causes the `onSerialize` callbacks to be called.
    // These callbacks can be used to provide the value for a given key.
    const content = transferStore.toJson();

    if (transferStore.isEmpty) {
      // The state is empty, nothing to transfer,
      // avoid creating an extra `<script>` tag in this case.
      return;
    }

    const script = doc.createElement('script');
    script.id = appId + '-state';
    script.setAttribute('type', 'application/json');
    script.textContent = escapeHtml(content);
    doc.body.appendChild(script);
  };
}

/**
 * NgModule to install on the server side while using the `TransferState` to transfer state from
 * server to client.
 *
 * 要安装在服务端的 NgModule，它同时会使用 `TransferState` 将状态从服务器传输到客户端。
 *
 * Note: this module is not needed if the `renderApplication` function is used.
 * The `renderApplication` makes all providers from this module available in the application.
 *
 * @publicApi
 * @deprecated no longer needed, you can inject the `TransferState` in an app without providing
 *     this module.
 */
@NgModule({})
export class ServerTransferStateModule {
}
