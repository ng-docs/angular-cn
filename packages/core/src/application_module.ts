/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef} from './application_ref';
import {NgModule} from './metadata';

/**
 * Re-exported by `BrowserModule`, which is included automatically in the root
 * `AppModule` when you create a new app with the CLI `new` command. Eagerly injects
 * `ApplicationRef` to instantiate it.
 *
 * 由 `BrowserModule` 重新导出，当你使用 CLI `new` 命令创建新应用时，它会自动包含在根 `AppModule`
 * 中。
 *
 * @publicApi
 */
@NgModule()
export class ApplicationModule {
  // Inject ApplicationRef to make it eager...
  constructor(appRef: ApplicationRef) {}
}
