/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';

/**
 * Test component which contains an invalid banana in box warning. Should build successfully.
 *
 * 包含箱内无效香蕉警告的测试组件。应该成功构建。
 *
 */
@Component({
  template: `
    <div ([foo])="bar"></div>
  `,
})
export class TestCmp {
  bar: string = 'test';
}
