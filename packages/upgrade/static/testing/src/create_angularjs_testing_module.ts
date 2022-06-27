/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import * as ng from '../../../src/common/src/angular1';
import {$INJECTOR, INJECTOR_KEY, UPGRADE_APP_TYPE_KEY} from '../../../src/common/src/constants';
import {UpgradeAppType} from '../../../src/common/src/util';


/**
 * A helper function to use when unit testing AngularJS services that depend upon downgraded Angular
 * services.
 *
 * 单元测试依赖于降级 Angular 服务的 AngularJS 服务时要使用的帮助器函数。
 *
 * This function returns an AngularJS module that is configured to wire up the AngularJS and Angular
 * injectors without the need to actually bootstrap a hybrid application.
 * This makes it simpler and faster to unit test services.
 *
 * 此函数返回一个 AngularJS 模块，该模块被配置为连接 AngularJS 和 Angular
 * 注入器，而无需实际引导混合应用程序。这使得单元测试服务变得更简单、更快。
 *
 * Use the returned AngularJS module in a call to
 * [`angular.mocks.module`](https://docs.angularjs.org/api/ngMock/function/angular.mock.module) to
 * include this module in the unit test injector.
 *
 * 在对[`angular.mocks.module`](https://docs.angularjs.org/api/ngMock/function/angular.mock.module)的调用中使用返回的
 * AngularJS 模块，以将此模块包含在单元测试注入器中。
 *
 * In the following code snippet, we are configuring the `$injector` with two modules:
 * The AngularJS `ng1AppModule`, which is the AngularJS part of our hybrid application and the
 * `Ng2AppModule`, which is the Angular part.
 *
 * 在以下代码片段中，我们使用两个模块配置 `$injector` ： AngularJS `ng1AppModule`
 * ，它是我们混合应用程序的 AngularJS 部分和 `Ng2AppModule` ，它是 Angular 部分。
 *
 * <code-example path="upgrade/static/ts/full/module.spec.ts"
 * region="angularjs-setup"></code-example>
 *
 * Once this is done we can get hold of services via the AngularJS `$injector` as normal.
 * Services that are (or have dependencies on) a downgraded Angular service, will be instantiated as
 * needed by the Angular root `Injector`.
 *
 * 完成后，我们可以像往常一样通过 AngularJS `$injector` 获取服务。作为（或依赖于）降级的 Angular
 * 服务的服务，将根据 Angular 根 `Injector` 的需要实例化。
 *
 * In the following code snippet, `heroesService` is a downgraded Angular service that we are
 * accessing from AngularJS.
 *
 * 在以下代码片段中， `heroesService` 是我们从 AngularJS 访问的降级 Angular 服务。
 *
 * <code-example path="upgrade/static/ts/full/module.spec.ts"
 * region="angularjs-spec"></code-example>
 *
 * <div class="alert is-important">
 *
 * This helper is for testing services not components.
 * For Component testing you must still bootstrap a hybrid app. See `UpgradeModule` or
 * `downgradeModule` for more information.
 *
 * 此帮助器用于测试服务而不是组件。对于组件测试，你仍然必须引导混合应用程序。有关更多信息，请参阅
 * `UpgradeModule` 或 `downgradeModule` 。
 *
 * </div>
 *
 * <div class="alert is-important">
 *
 * The resulting configuration does not wire up AngularJS digests to Zone hooks. It is the
 * responsibility of the test writer to call `$rootScope.$apply`, as necessary, to trigger
 * AngularJS handlers of async events from Angular.
 *
 * 生成的配置不会将 AngularJS 摘要连接到 Zone 钩子。测试作者有责任根据需要调用 `$rootScope.$apply`
 * ，以触发来自 Angular 的异步事件的 AngularJS 处理程序。
 *
 * </div>
 *
 * <div class="alert is-important">
 *
 * The helper sets up global variables to hold the shared Angular and AngularJS injectors.
 *
 * 帮助器设置全局变量来保存共享的 Angular 和 AngularJS 注入器。
 *
 * * Only call this helper once per spec.
 *
 *   每个规范只调用一次此帮助器。
 *
 * * Do not use `createAngularJSTestingModule` in the same spec as `createAngularTestingModule`.
 *
 *   不要在与 `createAngularTestingModule` `createAngularJSTestingModule`
 *
 * </div>
 *
 * Here is the example application and its unit tests that use `createAngularTestingModule`
 * and `createAngularJSTestingModule`.
 *
 * 这是使用 `createAngularTestingModule` 和 `createAngularJSTestingModule`
 * 的示例应用程序及其单元测试。
 *
 * <code-tabs>
 *  <code-pane header="module.spec.ts" path="upgrade/static/ts/full/module.spec.ts"></code-pane>
 *  <code-pane header="module.ts" path="upgrade/static/ts/full/module.ts"></code-pane>
 * </code-tabs>
 *
 * @param angularModules a collection of Angular modules to include in the configuration.
 *
 * 要包含在配置中的 Angular 模块的集合。
 *
 * @publicApi
 */
export function createAngularJSTestingModule(angularModules: any[]): string {
  return ng.module_('$$angularJSTestingModule', [])
      .constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Static)
      .factory(
          INJECTOR_KEY,
          [
            $INJECTOR,
            ($injector: ng.IInjectorService) => {
              TestBed.configureTestingModule({
                imports: angularModules,
                providers: [{provide: $INJECTOR, useValue: $injector}]
              });
              return TestBed.inject(Injector);
            }
          ])
      .name;
}
