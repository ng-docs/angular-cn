/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Location, LocationStrategy} from '@angular/common';
import {Provider} from '@angular/core';

import {SpyLocation} from './location_mock';
import {MockLocationStrategy} from './mock_location_strategy';

/**
 * Returns mock providers for the `Location` and `LocationStrategy` classes.
 * The mocks are helpful in tests to fire simulated location events.
 *
 * 返回 `Location` 和 `LocationStrategy` 类的模拟提供程序。模拟在测试中有助于触发模拟的位置事件。
 *
 * @publicApi
 */
export function provideLocationMocks(): Provider[] {
  return [
    {provide: Location, useClass: SpyLocation},
    {provide: LocationStrategy, useClass: MockLocationStrategy},
  ];
}
