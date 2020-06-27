/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {INJECTOR, ScopedService} from './usage';

INJECTOR.get(ScopedService).doSomething();
