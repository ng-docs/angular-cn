/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';

import {RouterOutlet} from '../directives/router_outlet';

/**
 * This component is used internally within the router to be a placeholder when an empty
 * router-outlet is needed. For example, with a config such as:
 *
 * 当需要空的 router-outlet 时，此组件在路由器内部用作占位符。例如，使用如下配置：
 *
 * `{path: 'parent', outlet: 'nav', children: [...]}`
 *
 * In order to render, there needs to be a component on this config, which will default
 * to this `EmptyOutletComponent`.
 *
 * 为了渲染，此配置中需要有一个组件，默认为此 `EmptyOutletComponent` 。
 *
 */
@Component({
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
  standalone: true,
})
export class ɵEmptyOutletComponent {
}

export {ɵEmptyOutletComponent as EmptyOutletComponent};
