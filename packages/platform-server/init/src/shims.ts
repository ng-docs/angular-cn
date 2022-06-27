/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ɵsetDomTypes} from '@angular/platform-server';

/**
 * Apply the necessary shims to make DOM globals (such as `Element`, `HTMLElement`, etc.) available
 * on the environment.
 *
 * 应用必要的 shim 以使 DOM 全局变量（例如 `Element` 、 `HTMLElement` 等）在环境中可用。
 *
 */
export function applyShims(): void {
  ɵsetDomTypes();
}
