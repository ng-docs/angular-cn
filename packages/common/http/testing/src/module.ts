/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {provideHttpClientTesting} from './provider';


/**
 * Configures `HttpClientTestingBackend` as the `HttpBackend` used by `HttpClient`.
 *
 * 把 `HttpClientTestingBackend` 配置为给 `HttpClient` 使用的 `HttpBackend`。
 *
 * Inject `HttpTestingController` to expect and flush requests in your tests.
 *
 * 注入 `HttpTestingController` 以断言和刷新各个测试中的请求。
 *
 * @publicApi
 */
@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    provideHttpClientTesting(),
  ],
})
export class HttpClientTestingModule {
}
