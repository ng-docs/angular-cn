/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵDomAdapter as DomAdapter} from '@angular/common';



/**
 * Provides DOM operations in any browser environment.
 *
 * 在任何浏览器环境中提供 DOM 操作。
 *
 * @security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 */
export abstract class GenericBrowserDomAdapter extends DomAdapter {
  readonly supportsDOMEvents: boolean = true;
}
