/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef} from '../application_ref';


/**
 * @description
 * Hook for manual bootstrapping of the application instead of using `bootstrap` array in @NgModule
 * annotation. This hook is invoked only when the `bootstrap` array is empty or not provided.
 *
 * 挂钩以手动引导应用程序，而不是在 @NgModule 标记中的 bootstrap 数组。
 *
 * Reference to the current application is provided as a parameter.
 *
 * See ["Bootstrapping"](guide/bootstrapping) and ["Entry components"](guide/entry-components).
 *
 * @usageNotes
 *
 * The example below uses `ApplicationRef.bootstrap()` to render the
 * `AppComponent` on the page.
 *
 * ```typescript
 * class AppModule implements DoBootstrap {
 *   ngDoBootstrap(appRef: ApplicationRef) {
 *     appRef.bootstrap(AppComponent); // Or some other component
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export interface DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void;
}
