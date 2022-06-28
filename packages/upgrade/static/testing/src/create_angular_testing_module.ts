/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector, NgModule, Type} from '@angular/core';

import * as angular from '../../../src/common/src/angular1';
import {$INJECTOR, INJECTOR_KEY, UPGRADE_APP_TYPE_KEY} from '../../../src/common/src/constants';
import {UpgradeAppType} from '../../../src/common/src/util';

let $injector: angular.IInjectorService|null = null;
let injector: Injector;

export function $injectorFactory() {
  return $injector;
}

@NgModule({providers: [{provide: $INJECTOR, useFactory: $injectorFactory}]})
export class AngularTestingModule {
  constructor(i: Injector) {
    injector = i;
  }
}

/**
 * A helper function to use when unit testing Angular services that depend upon upgraded AngularJS
 * services.
 *
 * 单元测试依赖于升级后的 AngularJS 服务的 Angular 服务时要使用的帮助器函数。
 *
 * This function returns an `NgModule` decorated class that is configured to wire up the Angular
 * and AngularJS injectors without the need to actually bootstrap a hybrid application.
 * This makes it simpler and faster to unit test services.
 *
 * 此函数返回一个 `NgModule` 装饰类，该类被配置为连接 Angular 和 AngularJS
 * 注入器，而无需实际引导混合应用程序。这使得单元测试服务变得更简单、更快。
 *
 * Use the returned class as an "import" when configuring the `TestBed`.
 *
 * 配置 `TestBed` 时，使用返回的类作为“导入”。
 *
 * In the following code snippet, we are configuring the TestBed with two imports.
 * The `Ng2AppModule` is the Angular part of our hybrid application and the `ng1AppModule` is the
 * AngularJS part.
 *
 * 在以下代码片段中，我们使用两个导入配置 TestBed。 `Ng2AppModule` 是我们混合应用程序的 Angular
 * 部分，而 `ng1AppModule` 是 AngularJS 部分。
 *
 * <code-example path="upgrade/static/ts/full/module.spec.ts" region="angular-setup"></code-example>
 *
 * Once this is done we can get hold of services via the Angular `Injector` as normal.
 * Services that are (or have dependencies on) an upgraded AngularJS service, will be instantiated
 * as needed by the AngularJS `$injector`.
 *
 * 完成后，我们可以像往常一样通过 Angular `Injector` 获取服务。作为（或依赖于）升级后的 AngularJS
 * 服务的服务，将根据 AngularJS `$injector` 的需要实例化。
 *
 * In the following code snippet, `HeroesService` is an Angular service that depends upon an
 * AngularJS service, `titleCase`.
 *
 * 在以下代码片段中，`HeroesService` 是一项依赖于 AngularJS 服务 `titleCase` 的 Angular 服务。
 *
 * <code-example path="upgrade/static/ts/full/module.spec.ts" region="angular-spec"></code-example>
 *
 * <div class="alert is-important">
 *
 * This helper is for testing services not Components.
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
 * * Do not use `createAngularTestingModule` in the same spec as `createAngularJSTestingModule`.
 *
 *   不要在与 `createAngularJSTestingModule` `createAngularTestingModule`
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
 * @param angularJSModules a collection of the names of AngularJS modules to include in the
 * configuration.
 *
 * 要包含在配置中的 AngularJS 模块名称的集合。
 *
 * @param [strictDi] whether the AngularJS injector should have `strictDI` enabled.
 *
 * AngularJS 注入器是否应该启用 `strictDI` 。
 *
 * @publicApi
 */
export function createAngularTestingModule(
    angularJSModules: string[], strictDi?: boolean): Type<any> {
  angular.module_('$$angularJSTestingModule', angularJSModules)
      .constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Static)
      .factory(INJECTOR_KEY, () => injector);
  $injector = angular.injector(['ng', '$$angularJSTestingModule'], strictDi);
  return AngularTestingModule;
}
