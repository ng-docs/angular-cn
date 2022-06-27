/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector, NgModuleFactory, NgModuleRef, PlatformRef, StaticProvider, Type} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';

import {IInjectorService, IProvideService, module_ as angularModule} from '../../src/common/src/angular1';
import {$INJECTOR, $PROVIDE, DOWNGRADED_MODULE_COUNT_KEY, INJECTOR_KEY, LAZY_MODULE_REF, UPGRADE_APP_TYPE_KEY, UPGRADE_MODULE_NAME} from '../../src/common/src/constants';
import {destroyApp, getDowngradedModuleCount, isFunction, isNgModuleType, LazyModuleRef, UpgradeAppType} from '../../src/common/src/util';

import {angular1Providers, setTempInjectorRef} from './angular1_providers';
import {NgAdapterInjector} from './util';


let moduleUid = 0;

/**
 * @description
 *
 * A helper function for creating an AngularJS module that can bootstrap an Angular module
 * "on-demand" (possibly lazily) when a {@link downgradeComponent downgraded component} needs to be
 * instantiated.
 *
 * 一个用于创建 AngularJS 模块的帮助器函数，当需要实例化 {@link downgradeComponent 降级组件}
 * 时，可以“按需”（可能是延迟）引导 Angular 模块。
 *
 * *Part of the [upgrade/static](api?query=upgrade/static) library for hybrid upgrade apps that
 * support AOT compilation.*
 *
 * *支持 AOT 编译的混合升级应用程序的[upgrade/静态](api?query=upgrade/static)库的一部分。*
 *
 * It allows loading/bootstrapping the Angular part of a hybrid application lazily and not having to
 * pay the cost up-front. For example, you can have an AngularJS application that uses Angular for
 * specific routes and only instantiate the Angular modules if/when the user visits one of these
 * routes.
 *
 * 它允许延迟加载/引导混合应用程序的 Angular 部分，而无需预先支付成本。例如，你可以有一个 AngularJS
 * 应用程序，将 Angular 用于特定路由，并且只有在/当用户访问这些路由之一时才实例化 Angular 模块。
 *
 * The Angular module will be bootstrapped once (when requested for the first time) and the same
 * reference will be used from that point onwards.
 *
 * Angular 模块将被引导一次（第一次请求时），并且从那时起将使用相同的引用。
 *
 * `downgradeModule()` requires either an `NgModuleFactory`, `NgModule` class or a function:
 *
 * `downgradeModule()` 需要 `NgModuleFactory` 、 `NgModule` 类或函数：
 *
 * - `NgModuleFactory`: If you pass an `NgModuleFactory`, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}.
 *   NOTE: this type of the argument is deprecated. Please either provide an `NgModule` class or a
 *   bootstrap function instead.
 *
 *   `NgModuleFactory` ：如果你传递了 `NgModuleFactory` ，它将用于使用 `platformBrowser` 的 {@link
 * PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}
 * 来实例化模块。注意：这种类型的参数已被弃用。请提供 `NgModule` 类或引导函数。
 *
 * - `NgModule` class: If you pass an NgModule class, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModule bootstrapModule()}.
 *
 *   `NgModule` 类：如果你传递了 NgModule 类，它将用于使用 `platformBrowser` 的 {@link
 * PlatformRef#bootstrapModule bootstrapModule()} 来实例化模块。
 *
 * - `Function`: If you pass a function, it is expected to return a promise resolving to an
 *   `NgModuleRef`. The function is called with an array of extra {@link StaticProvider Providers}
 *   that are expected to be available from the returned `NgModuleRef`'s `Injector`.
 *
 *   `Function` ：如果你传递了一个函数，它应该会返回一个解析为 `NgModuleRef` 的
 * Promise。使用额外的 {@link StaticProvider Providers} 数组来调用该函数，这些数组可以从返回的
 * `NgModuleRef` 的 `Injector` 中获得。
 *
 * `downgradeModule()` returns the name of the created AngularJS wrapper module. You can use it to
 * declare a dependency in your main AngularJS module.
 *
 * `downgradeModule()` 会返回创建的 AngularJS 包装器模块的名称。你可以用它在主 AngularJS
 * 模块中声明依赖项。
 *
 * {
 *
 * @example upgrade/static/ts/lite/module.ts region="basic-how-to"}
 *
 * For more details on how to use `downgradeModule()` see
 * [Upgrading for Performance](guide/upgrade-performance).
 * @usageNotes
 *
 * Apart from `UpgradeModule`, you can use the rest of the `upgrade/static` helpers as usual to
 * build a hybrid application. Note that the Angular pieces (e.g. downgraded services) will not be
 * available until the downgraded module has been bootstrapped, i.e. by instantiating a downgraded
 * component.
 *
 * 除了 `UpgradeModule` ，你可以像往常一样使用其余的 `upgrade/static`
 * 帮助器来构建混合应用程序。请注意，在降级的模块被引导（即通过实例化降级组件）之前，Angular
 * 部分（例如降级的服务）将不可用。
 *
 * <div class="alert is-important">
 *
 *   You cannot use `downgradeModule()` and `UpgradeModule` in the same hybrid application.<br />
 *   Use one or the other.
 *
 * 你不能在同一个混合应用程序中使用 `downgradeModule()` 和 `UpgradeModule` 。<br />使用两者之一。
 *
 * </div>
 *
 * ### Differences with `UpgradeModule`
 *
 * ### 与 `UpgradeModule` 的区别
 *
 * Besides their different API, there are two important internal differences between
 * `downgradeModule()` and `UpgradeModule` that affect the behavior of hybrid applications:
 *
 * 除了它们不同的 API 之外， `downgradeModule()` 和 `UpgradeModule`
 * 之间还有两个重要的内部区别会影响混合应用程序的行为：
 *
 * 1. Unlike `UpgradeModule`, `downgradeModule()` does not bootstrap the main AngularJS module
 *    inside the {@link NgZone Angular zone}.
 *
 *    与 `UpgradeModule` 不同， `downgradeModule()` 不会引导 {@link NgZone Angular zone} 中的主
 * AngularJS 模块。
 *
 * 2. Unlike `UpgradeModule`, `downgradeModule()` does not automatically run a
 *    [$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) when changes are
 *    detected in the Angular part of the application.
 *
 *    与 `UpgradeModule` 不同，当检测到应用程序的 Angular 部分发生更改时， `downgradeModule()`
 * 不会自动运行[$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) 。
 *
 * What this means is that applications using `UpgradeModule` will run change detection more
 * frequently in order to ensure that both frameworks are properly notified about possible changes.
 * This will inevitably result in more change detection runs than necessary.
 *
 * 这意味着使用 `UpgradeModule`
 * 的应用程序将更频繁地运行更改检测，以确保这两个框架都得到有关可能的更改的正确通知。这将不可避免地导致比必要的变更检测运行更多。
 *
 * `downgradeModule()`, on the other side, does not try to tie the two change detection systems as
 * tightly, restricting the explicit change detection runs only to cases where it knows it is
 * necessary (e.g. when the inputs of a downgraded component change). This improves performance,
 * especially in change-detection-heavy applications, but leaves it up to the developer to manually
 * notify each framework as needed.
 *
 * 另一方面， `downgradeModule()`
 * 不会尝试将两个更改检测系统紧密联系起来，而是将显式更改检测限制仅在它知道有必要的情况下运行（例如，当降级组件的输入更改时）。这提高了性能，尤其是在需要更改检测的应用程序中，但让开发人员根据需要手动通知每个框架。
 *
 * For a more detailed discussion of the differences and their implications, see
 * [Upgrading for Performance](guide/upgrade-performance).
 *
 * 有关区别及其含义的更详细讨论，请参阅[升级以提高性能](guide/upgrade-performance)。
 *
 * <div class="alert is-helpful">
 *
 *   You can manually trigger a change detection run in AngularJS using
 *   [scope.$apply(...)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply) or
 *   [$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest).
 *
 * 你可以用[scope.$apply(…)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply)或[$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest)手动触发
 * AngularJS 中运行的更改检测。
 *
 *   You can manually trigger a change detection run in Angular using {@link NgZone#run
 *   ngZone.run(...)}.
 *
 * 你可以用 {@link NgZone#run ngZone.run(…)} 手动触发 Angular 中运行的更改检测。
 *
 * </div>
 *
 * ### Downgrading multiple modules
 *
 * ### 降级多个模块
 *
 * It is possible to downgrade multiple modules and include them in an AngularJS application. In
 * that case, each downgraded module will be bootstrapped when an associated downgraded component or
 * injectable needs to be instantiated.
 *
 * 可以降级多个模块并将它们包含在 AngularJS
 * 应用程序中。在这种情况下，当需要实例化关联的降级组件或可注入时，每个降级的模块都将被引导。
 *
 * Things to keep in mind, when downgrading multiple modules:
 *
 * 降级多个模块时要记住的事情：
 *
 * - Each downgraded component/injectable needs to be explicitly associated with a downgraded
 *   module. See `downgradeComponent()` and `downgradeInjectable()` for more details.
 *
 *   每个降级的组件/可注入物都需要与降级的模块显式关联。有关更多详细信息，请参阅
 * `downgradeComponent()` 和 `downgradeInjectable()` 。
 *
 * - If you want some injectables to be shared among all downgraded modules, you can provide them as
 *   `StaticProvider`s, when creating the `PlatformRef` (e.g. via `platformBrowser` or
 *   `platformBrowserDynamic`).
 *
 *   如果你希望在所有降级模块之间共享某些注入器，可以在创建 `PlatformRef` 时将它们作为
 * `StaticProvider` 提供（例如通过 `platformBrowser` 或 `platformBrowserDynamic` ）。
 *
 * - When using {@link PlatformRef#bootstrapmodule `bootstrapModule()`} or
 *   {@link PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()`} to bootstrap the
 *   downgraded modules, each one is considered a "root" module. As a consequence, a new instance
 *   will be created for every injectable provided in `"root"` (via
 *   {@link Injectable#providedIn `providedIn`}).
 *   If this is not your intention, you can have a shared module (that will act as act as the "root"
 *   module) and create all downgraded modules using that module's injector:
 *
 *   使用 {@link PlatformRef#bootstrapmodule `bootstrapModule()` } 或 {@link
 * PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()` }
 * 引导降级模块时，每个都被认为是一个“根”模块。因此，将为 `"root"`
 * 中提供的每个可注入物创建一个新实例（通过 {@link Injectable#providedIn `providedIn` }
 * ）。如果这不是你的意图，你可以有一个共享模块（将作为“根”模块）并使用该模块的注入器创建所有降级模块：
 *
 *   {
 *
 * @example upgrade/static/ts/lite-multi-shared/module.ts region="shared-root-module"}
 * @publicApi
 */
export function downgradeModule<T>(moduleOrBootstrapFn: Type<T>|(
    (extraProviders: StaticProvider[]) => Promise<NgModuleRef<T>>)): string;
/**
 * @description
 *
 * A helper function for creating an AngularJS module that can bootstrap an Angular module
 * "on-demand" (possibly lazily) when a {@link downgradeComponent downgraded component} needs to be
 * instantiated.
 *
 * 一个用于创建 AngularJS 模块的帮助器函数，当需要实例化 {@link downgradeComponent 降级组件}
 * 时，可以“按需”（可能是延迟）引导 Angular 模块。
 *
 * *Part of the [upgrade/static](api?query=upgrade/static) library for hybrid upgrade apps that
 * support AOT compilation.*
 *
 * *支持 AOT 编译的混合升级应用程序的[upgrade/静态](api?query=upgrade/static)库的一部分。*
 *
 * It allows loading/bootstrapping the Angular part of a hybrid application lazily and not having to
 * pay the cost up-front. For example, you can have an AngularJS application that uses Angular for
 * specific routes and only instantiate the Angular modules if/when the user visits one of these
 * routes.
 *
 * 它允许延迟加载/引导混合应用程序的 Angular 部分，而无需预先支付成本。例如，你可以有一个 AngularJS
 * 应用程序，将 Angular 用于特定路由，并且只有在/当用户访问这些路由之一时才实例化 Angular 模块。
 *
 * The Angular module will be bootstrapped once (when requested for the first time) and the same
 * reference will be used from that point onwards.
 *
 * Angular 模块将被引导一次（第一次请求时），并且从那时起将使用相同的引用。
 *
 * `downgradeModule()` requires either an `NgModuleFactory`, `NgModule` class or a function:
 *
 * `downgradeModule()` 需要 `NgModuleFactory` 、 `NgModule` 类或函数：
 *
 * - `NgModuleFactory`: If you pass an `NgModuleFactory`, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}.
 *   NOTE: this type of the argument is deprecated. Please either provide an `NgModule` class or a
 *   bootstrap function instead.
 *
 *   `NgModuleFactory` ：如果你传递了 `NgModuleFactory` ，它将用于使用 `platformBrowser` 的 {@link
 * PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}
 * 来实例化模块。注意：这种类型的参数已被弃用。请提供 `NgModule` 类或引导函数。
 *
 * - `NgModule` class: If you pass an NgModule class, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModule bootstrapModule()}.
 *
 *   `NgModule` 类：如果你传递了 NgModule 类，它将用于使用 `platformBrowser` 的 {@link
 * PlatformRef#bootstrapModule bootstrapModule()} 来实例化模块。
 *
 * - `Function`: If you pass a function, it is expected to return a promise resolving to an
 *   `NgModuleRef`. The function is called with an array of extra {@link StaticProvider Providers}
 *   that are expected to be available from the returned `NgModuleRef`'s `Injector`.
 *
 *   `Function` ：如果你传递了一个函数，它应该会返回一个解析为 `NgModuleRef` 的
 * Promise。使用额外的 {@link StaticProvider Providers} 数组来调用该函数，这些数组可以从返回的
 * `NgModuleRef` 的 `Injector` 中获得。
 *
 * `downgradeModule()` returns the name of the created AngularJS wrapper module. You can use it to
 * declare a dependency in your main AngularJS module.
 *
 * `downgradeModule()` 会返回创建的 AngularJS 包装器模块的名称。你可以用它在主 AngularJS
 * 模块中声明依赖项。
 *
 * {
 *
 * @example upgrade/static/ts/lite/module.ts region="basic-how-to"}
 *
 * For more details on how to use `downgradeModule()` see
 * [Upgrading for Performance](guide/upgrade-performance).
 * @usageNotes
 *
 * Apart from `UpgradeModule`, you can use the rest of the `upgrade/static` helpers as usual to
 * build a hybrid application. Note that the Angular pieces (e.g. downgraded services) will not be
 * available until the downgraded module has been bootstrapped, i.e. by instantiating a downgraded
 * component.
 *
 * 除了 `UpgradeModule` ，你可以像往常一样使用其余的 `upgrade/static`
 * 帮助器来构建混合应用程序。请注意，在降级的模块被引导（即通过实例化降级组件）之前，Angular
 * 部分（例如降级的服务）将不可用。
 *
 * <div class="alert is-important">
 *
 *   You cannot use `downgradeModule()` and `UpgradeModule` in the same hybrid application.<br />
 *   Use one or the other.
 *
 * 你不能在同一个混合应用程序中使用 `downgradeModule()` 和 `UpgradeModule` 。<br />使用两者之一。
 *
 * </div>
 *
 * ### Differences with `UpgradeModule`
 *
 * ### 与 `UpgradeModule` 的区别
 *
 * Besides their different API, there are two important internal differences between
 * `downgradeModule()` and `UpgradeModule` that affect the behavior of hybrid applications:
 *
 * 除了它们不同的 API 之外， `downgradeModule()` 和 `UpgradeModule`
 * 之间还有两个重要的内部区别会影响混合应用程序的行为：
 *
 * 1. Unlike `UpgradeModule`, `downgradeModule()` does not bootstrap the main AngularJS module
 *    inside the {@link NgZone Angular zone}.
 *
 *    与 `UpgradeModule` 不同， `downgradeModule()` 不会引导 {@link NgZone Angular zone} 中的主
 * AngularJS 模块。
 *
 * 2. Unlike `UpgradeModule`, `downgradeModule()` does not automatically run a
 *    [$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) when changes are
 *    detected in the Angular part of the application.
 *
 *    与 `UpgradeModule` 不同，当检测到应用程序的 Angular 部分发生更改时， `downgradeModule()`
 * 不会自动运行[$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) 。
 *
 * What this means is that applications using `UpgradeModule` will run change detection more
 * frequently in order to ensure that both frameworks are properly notified about possible changes.
 * This will inevitably result in more change detection runs than necessary.
 *
 * 这意味着使用 `UpgradeModule`
 * 的应用程序将更频繁地运行更改检测，以确保这两个框架都得到有关可能的更改的正确通知。这将不可避免地导致比必要的变更检测运行更多。
 *
 * `downgradeModule()`, on the other side, does not try to tie the two change detection systems as
 * tightly, restricting the explicit change detection runs only to cases where it knows it is
 * necessary (e.g. when the inputs of a downgraded component change). This improves performance,
 * especially in change-detection-heavy applications, but leaves it up to the developer to manually
 * notify each framework as needed.
 *
 * 另一方面， `downgradeModule()`
 * 不会尝试将两个更改检测系统紧密联系起来，而是将显式更改检测限制仅在它知道有必要的情况下运行（例如，当降级组件的输入更改时）。这提高了性能，尤其是在需要更改检测的应用程序中，但让开发人员根据需要手动通知每个框架。
 *
 * For a more detailed discussion of the differences and their implications, see
 * [Upgrading for Performance](guide/upgrade-performance).
 *
 * 有关区别及其含义的更详细讨论，请参阅[升级以提高性能](guide/upgrade-performance)。
 *
 * <div class="alert is-helpful">
 *
 *   You can manually trigger a change detection run in AngularJS using
 *   [scope.$apply(...)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply) or
 *   [$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest).
 *
 * 你可以用[scope.$apply(…)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply)或[$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest)手动触发
 * AngularJS 中运行的更改检测。
 *
 *   You can manually trigger a change detection run in Angular using {@link NgZone#run
 *   ngZone.run(...)}.
 *
 * 你可以用 {@link NgZone#run ngZone.run(…)} 手动触发 Angular 中运行的更改检测。
 *
 * </div>
 *
 * ### Downgrading multiple modules
 *
 * ### 降级多个模块
 *
 * It is possible to downgrade multiple modules and include them in an AngularJS application. In
 * that case, each downgraded module will be bootstrapped when an associated downgraded component or
 * injectable needs to be instantiated.
 *
 * 可以降级多个模块并将它们包含在 AngularJS
 * 应用程序中。在这种情况下，当需要实例化关联的降级组件或可注入时，每个降级的模块都将被引导。
 *
 * Things to keep in mind, when downgrading multiple modules:
 *
 * 降级多个模块时要记住的事情：
 *
 * - Each downgraded component/injectable needs to be explicitly associated with a downgraded
 *   module. See `downgradeComponent()` and `downgradeInjectable()` for more details.
 *
 *   每个降级的组件/可注入物都需要与降级的模块显式关联。有关更多详细信息，请参阅
 * `downgradeComponent()` 和 `downgradeInjectable()` 。
 *
 * - If you want some injectables to be shared among all downgraded modules, you can provide them as
 *   `StaticProvider`s, when creating the `PlatformRef` (e.g. via `platformBrowser` or
 *   `platformBrowserDynamic`).
 *
 *   如果你希望在所有降级模块之间共享某些注入器，可以在创建 `PlatformRef` 时将它们作为
 * `StaticProvider` 提供（例如通过 `platformBrowser` 或 `platformBrowserDynamic` ）。
 *
 * - When using {@link PlatformRef#bootstrapmodule `bootstrapModule()`} or
 *   {@link PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()`} to bootstrap the
 *   downgraded modules, each one is considered a "root" module. As a consequence, a new instance
 *   will be created for every injectable provided in `"root"` (via
 *   {@link Injectable#providedIn `providedIn`}).
 *   If this is not your intention, you can have a shared module (that will act as act as the "root"
 *   module) and create all downgraded modules using that module's injector:
 *
 *   使用 {@link PlatformRef#bootstrapmodule `bootstrapModule()` } 或 {@link
 * PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()` }
 * 引导降级模块时，每个都被认为是一个“根”模块。因此，将为 `"root"`
 * 中提供的每个可注入物创建一个新实例（通过 {@link Injectable#providedIn `providedIn` }
 * ）。如果这不是你的意图，你可以有一个共享模块（将作为“根”模块）并使用该模块的注入器创建所有降级模块：
 *
 *   {
 *
 * @example upgrade/static/ts/lite-multi-shared/module.ts region="shared-root-module"}
 * @publicApi
 * @deprecated
 *
 * Passing `NgModuleFactory` as the `downgradeModule` function argument is deprecated,
 *     please pass an NgModule class reference instead.
 *
 * 不推荐将 `NgModuleFactory` 作为 `downgradeModule` 函数参数传递，请改为传递 NgModule 类引用。
 *
 */
export function downgradeModule<T>(moduleOrBootstrapFn: NgModuleFactory<T>): string;
/**
 * @description
 *
 * A helper function for creating an AngularJS module that can bootstrap an Angular module
 * "on-demand" (possibly lazily) when a {@link downgradeComponent downgraded component} needs to be
 * instantiated.
 *
 * 一个用于创建 AngularJS 模块的帮助器函数，当需要实例化 {@link downgradeComponent 降级组件}
 * 时，可以“按需”（可能是延迟）引导 Angular 模块。
 *
 * *Part of the [upgrade/static](api?query=upgrade/static) library for hybrid upgrade apps that
 * support AOT compilation.*
 *
 * *支持 AOT 编译的混合升级应用程序的[upgrade/静态](api?query=upgrade/static)库的一部分。*
 *
 * It allows loading/bootstrapping the Angular part of a hybrid application lazily and not having to
 * pay the cost up-front. For example, you can have an AngularJS application that uses Angular for
 * specific routes and only instantiate the Angular modules if/when the user visits one of these
 * routes.
 *
 * 它允许延迟加载/引导混合应用程序的 Angular 部分，而无需预先支付成本。例如，你可以有一个 AngularJS
 * 应用程序，将 Angular 用于特定路由，并且只有在/当用户访问这些路由之一时才实例化 Angular 模块。
 *
 * The Angular module will be bootstrapped once (when requested for the first time) and the same
 * reference will be used from that point onwards.
 *
 * Angular 模块将被引导一次（第一次请求时），并且从那时起将使用相同的引用。
 *
 * `downgradeModule()` requires either an `NgModuleFactory`, `NgModule` class or a function:
 *
 * `downgradeModule()` 需要 `NgModuleFactory` 、 `NgModule` 类或函数：
 *
 * - `NgModuleFactory`: If you pass an `NgModuleFactory`, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}.
 *   NOTE: this type of the argument is deprecated. Please either provide an `NgModule` class or a
 *   bootstrap function instead.
 *
 *   `NgModuleFactory` ：如果你传递了 `NgModuleFactory` ，它将用于使用 `platformBrowser` 的 {@link
 * PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()}
 * 来实例化模块。注意：这种类型的参数已被弃用。请提供 `NgModule` 类或引导函数。
 *
 * - `NgModule` class: If you pass an NgModule class, it will be used to instantiate a module
 *   using `platformBrowser`'s {@link PlatformRef#bootstrapModule bootstrapModule()}.
 *
 *   `NgModule` 类：如果你传递了 NgModule 类，它将用于使用 `platformBrowser` 的 {@link
 * PlatformRef#bootstrapModule bootstrapModule()} 来实例化模块。
 *
 * - `Function`: If you pass a function, it is expected to return a promise resolving to an
 *   `NgModuleRef`. The function is called with an array of extra {@link StaticProvider Providers}
 *   that are expected to be available from the returned `NgModuleRef`'s `Injector`.
 *
 *   `Function` ：如果你传递了一个函数，它应该会返回一个解析为 `NgModuleRef` 的
 * Promise。使用额外的 {@link StaticProvider Providers} 数组来调用该函数，这些数组可以从返回的
 * `NgModuleRef` 的 `Injector` 中获得。
 *
 * `downgradeModule()` returns the name of the created AngularJS wrapper module. You can use it to
 * declare a dependency in your main AngularJS module.
 *
 * `downgradeModule()` 会返回创建的 AngularJS 包装器模块的名称。你可以用它在主 AngularJS
 * 模块中声明依赖项。
 *
 * {
 *
 * @example upgrade/static/ts/lite/module.ts region="basic-how-to"}
 *
 * For more details on how to use `downgradeModule()` see
 * [Upgrading for Performance](guide/upgrade-performance).
 * @usageNotes
 *
 * Apart from `UpgradeModule`, you can use the rest of the `upgrade/static` helpers as usual to
 * build a hybrid application. Note that the Angular pieces (e.g. downgraded services) will not be
 * available until the downgraded module has been bootstrapped, i.e. by instantiating a downgraded
 * component.
 *
 * 除了 `UpgradeModule` ，你可以像往常一样使用其余的 `upgrade/static`
 * 帮助器来构建混合应用程序。请注意，在降级的模块被引导（即通过实例化降级组件）之前，Angular
 * 部分（例如降级的服务）将不可用。
 *
 * <div class="alert is-important">
 *
 *   You cannot use `downgradeModule()` and `UpgradeModule` in the same hybrid application.<br />
 *   Use one or the other.
 *
 * 你不能在同一个混合应用程序中使用 `downgradeModule()` 和 `UpgradeModule` 。<br />使用两者之一。
 *
 * </div>
 *
 * ### Differences with `UpgradeModule`
 *
 * ### 与 `UpgradeModule` 的区别
 *
 * Besides their different API, there are two important internal differences between
 * `downgradeModule()` and `UpgradeModule` that affect the behavior of hybrid applications:
 *
 * 除了它们不同的 API 之外， `downgradeModule()` 和 `UpgradeModule`
 * 之间还有两个重要的内部区别会影响混合应用程序的行为：
 *
 * 1. Unlike `UpgradeModule`, `downgradeModule()` does not bootstrap the main AngularJS module
 *    inside the {@link NgZone Angular zone}.
 *
 *    与 `UpgradeModule` 不同， `downgradeModule()` 不会引导 {@link NgZone Angular zone} 中的主
 * AngularJS 模块。
 *
 * 2. Unlike `UpgradeModule`, `downgradeModule()` does not automatically run a
 *    [$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) when changes are
 *    detected in the Angular part of the application.
 *
 *    与 `UpgradeModule` 不同，当检测到应用程序的 Angular 部分发生更改时， `downgradeModule()`
 * 不会自动运行[$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest) 。
 *
 * What this means is that applications using `UpgradeModule` will run change detection more
 * frequently in order to ensure that both frameworks are properly notified about possible changes.
 * This will inevitably result in more change detection runs than necessary.
 *
 * 这意味着使用 `UpgradeModule`
 * 的应用程序将更频繁地运行更改检测，以确保这两个框架都得到有关可能的更改的正确通知。这将不可避免地导致比必要的变更检测运行更多。
 *
 * `downgradeModule()`, on the other side, does not try to tie the two change detection systems as
 * tightly, restricting the explicit change detection runs only to cases where it knows it is
 * necessary (e.g. when the inputs of a downgraded component change). This improves performance,
 * especially in change-detection-heavy applications, but leaves it up to the developer to manually
 * notify each framework as needed.
 *
 * 另一方面， `downgradeModule()`
 * 不会尝试将两个更改检测系统紧密联系起来，而是将显式更改检测限制仅在它知道有必要的情况下运行（例如，当降级组件的输入更改时）。这提高了性能，尤其是在需要大量更改检测的应用程序中，但让开发人员根据需要手动通知每个框架。
 *
 * For a more detailed discussion of the differences and their implications, see
 * [Upgrading for Performance](guide/upgrade-performance).
 *
 * 有关区别及其含义的更详细讨论，请参阅[升级以提高性能](guide/upgrade-performance)。
 *
 * <div class="alert is-helpful">
 *
 *   You can manually trigger a change detection run in AngularJS using
 *   [scope.$apply(...)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply) or
 *   [$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest).
 *
 * 你可以用[scope.$apply(…)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply)或[$rootScope.$digest()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest)手动触发
 * AngularJS 中运行的更改检测。
 *
 *   You can manually trigger a change detection run in Angular using {@link NgZone#run
 *   ngZone.run(...)}.
 *
 * 你可以用 {@link NgZone#run ngZone.run(…)} 手动触发 Angular 中运行的更改检测。
 *
 * </div>
 *
 * ### Downgrading multiple modules
 *
 * ### 降级多个模块
 *
 * It is possible to downgrade multiple modules and include them in an AngularJS application. In
 * that case, each downgraded module will be bootstrapped when an associated downgraded component or
 * injectable needs to be instantiated.
 *
 * 可以降级多个模块并将它们包含在 AngularJS
 * 应用程序中。在这种情况下，当需要实例化关联的降级组件或可注入时，每个降级的模块都将被引导。
 *
 * Things to keep in mind, when downgrading multiple modules:
 *
 * 降级多个模块时要记住的事情：
 *
 * - Each downgraded component/injectable needs to be explicitly associated with a downgraded
 *   module. See `downgradeComponent()` and `downgradeInjectable()` for more details.
 *
 *   每个降级的组件/可注入物都需要与降级的模块显式关联。有关更多详细信息，请参阅
 * `downgradeComponent()` 和 `downgradeInjectable()` 。
 *
 * - If you want some injectables to be shared among all downgraded modules, you can provide them as
 *   `StaticProvider`s, when creating the `PlatformRef` (e.g. via `platformBrowser` or
 *   `platformBrowserDynamic`).
 *
 *   如果你希望在所有降级模块之间共享某些注入器，可以在创建 `PlatformRef` 时将它们作为
 * `StaticProvider` 提供（例如通过 `platformBrowser` 或 `platformBrowserDynamic` ）。
 *
 * - When using {@link PlatformRef#bootstrapmodule `bootstrapModule()`} or
 *   {@link PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()`} to bootstrap the
 *   downgraded modules, each one is considered a "root" module. As a consequence, a new instance
 *   will be created for every injectable provided in `"root"` (via
 *   {@link Injectable#providedIn `providedIn`}).
 *   If this is not your intention, you can have a shared module (that will act as act as the "root"
 *   module) and create all downgraded modules using that module's injector:
 *
 *   使用 {@link PlatformRef#bootstrapmodule `bootstrapModule()` } 或 {@link
 * PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()` }
 * 引导降级模块时，每个都被认为是一个“根”模块。因此，将为 `"root"`
 * 中提供的每个可注入物创建一个新实例（通过 {@link Injectable#providedIn `providedIn` }
 * ）。如果这不是你的意图，你可以有一个共享模块（将作为“根”模块）并使用该模块的注入器创建所有降级模块：
 *
 *   {
 *
 * @example upgrade/static/ts/lite-multi-shared/module.ts region="shared-root-module"}
 * @publicApi
 */
export function downgradeModule<T>(moduleOrBootstrapFn: Type<T>|NgModuleFactory<T>|(
    (extraProviders: StaticProvider[]) => Promise<NgModuleRef<T>>)): string {
  const lazyModuleName = `${UPGRADE_MODULE_NAME}.lazy${++moduleUid}`;
  const lazyModuleRefKey = `${LAZY_MODULE_REF}${lazyModuleName}`;
  const lazyInjectorKey = `${INJECTOR_KEY}${lazyModuleName}`;

  let bootstrapFn: (extraProviders: StaticProvider[]) => Promise<NgModuleRef<T>>;
  if (isNgModuleType(moduleOrBootstrapFn)) {
    // NgModule class
    bootstrapFn = (extraProviders: StaticProvider[]) =>
        platformBrowser(extraProviders).bootstrapModule(moduleOrBootstrapFn);
  } else if (!isFunction(moduleOrBootstrapFn)) {
    // NgModule factory
    bootstrapFn = (extraProviders: StaticProvider[]) =>
        platformBrowser(extraProviders).bootstrapModuleFactory(moduleOrBootstrapFn);
  } else {
    // bootstrap function
    bootstrapFn = moduleOrBootstrapFn;
  }

  let injector: Injector;

  // Create an ng1 module to bootstrap.
  angularModule(lazyModuleName, [])
      .constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Lite)
      .factory(INJECTOR_KEY, [lazyInjectorKey, identity])
      .factory(
          lazyInjectorKey,
          () => {
            if (!injector) {
              throw new Error(
                  'Trying to get the Angular injector before bootstrapping the corresponding ' +
                  'Angular module.');
            }
            return injector;
          })
      .factory(LAZY_MODULE_REF, [lazyModuleRefKey, identity])
      .factory(
          lazyModuleRefKey,
          [
            $INJECTOR,
            ($injector: IInjectorService) => {
              setTempInjectorRef($injector);
              const result: LazyModuleRef = {
                promise: bootstrapFn(angular1Providers).then(ref => {
                  injector = result.injector = new NgAdapterInjector(ref.injector);
                  injector.get($INJECTOR);

                  // Destroy the AngularJS app once the Angular `PlatformRef` is destroyed.
                  // This does not happen in a typical SPA scenario, but it might be useful for
                  // other use-cases where disposing of an Angular/AngularJS app is necessary
                  // (such as Hot Module Replacement (HMR)).
                  // See https://github.com/angular/angular/issues/39935.
                  injector.get(PlatformRef).onDestroy(() => destroyApp($injector));

                  return injector;
                })
              };
              return result;
            }
          ])
      .config([
        $INJECTOR, $PROVIDE,
        ($injector: IInjectorService, $provide: IProvideService) => {
          $provide.constant(DOWNGRADED_MODULE_COUNT_KEY, getDowngradedModuleCount($injector) + 1);
        }
      ]);

  return lazyModuleName;
}

function identity<T = any>(x: T): T {
  return x;
}
