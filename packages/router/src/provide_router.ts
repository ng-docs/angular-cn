/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {HashLocationStrategy, LOCATION_INITIALIZED, LocationStrategy, ViewportScroller} from '@angular/common';
import {APP_BOOTSTRAP_LISTENER, APP_INITIALIZER, ApplicationRef, Component, ComponentRef, ENVIRONMENT_INITIALIZER, EnvironmentInjector, EnvironmentProviders, inject, InjectFlags, InjectionToken, Injector, makeEnvironmentProviders, NgZone, Provider, Type} from '@angular/core';
import {of, Subject} from 'rxjs';

import {INPUT_BINDER, RoutedComponentInputBinder} from './directives/router_outlet';
import {Event, NavigationError, stringifyEvent} from './events';
import {Routes} from './models';
import {NavigationTransitions} from './navigation_transition';
import {Router} from './router';
import {InMemoryScrollingOptions, ROUTER_CONFIGURATION, RouterConfigOptions} from './router_config';
import {ROUTES} from './router_config_loader';
import {PreloadingStrategy, RouterPreloader} from './router_preloader';
import {ROUTER_SCROLLER, RouterScroller} from './router_scroller';
import {ActivatedRoute} from './router_state';
import {UrlSerializer} from './url_tree';
import {afterNextNavigation} from './utils/navigations';


/**
 * Sets up providers necessary to enable `Router` functionality for the application.
 * Allows to configure a set of routes as well as extra features that should be enabled.
 *
 * 设置为应用程序启用 `Router` 特性所需的提供程序。允许配置一组路由以及应该启用的额外特性。
 *
 * @usageNotes
 *
 * Basic example of how you can add a Router to your application:
 *
 * 如何将路由器添加到应用程序的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent, {
 *   providers: [provideRouter(appRoutes)]
 * });
 * ```
 *
 * You can also enable optional features in the Router by adding functions from the `RouterFeatures`
 * type:
 *
 * 你还可以通过添加 `RouterFeatures` 类型的函数来在路由器中启用可选特性：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes,
 *         withDebugTracing(),
 *         withRouterConfig({paramsInheritanceStrategy: 'always'}))
 *     ]
 *   }
 * );
 * ```
 * @see `RouterFeatures`
 * @publicApi
 * @param routes A set of `Route`s to use for the application routing table.
 *
 * 用于应用程序路由表的一组 `Route` 。
 * @param features Optional features to configure additional router behaviors.
 *
 * 配置其他路由器行为的可选特性。
 * @returns
 *
 * A set of providers to setup a Router.
 *
 * 一组用于设置路由器的提供程序。
 *
 */
export function provideRouter(routes: Routes, ...features: RouterFeatures[]): EnvironmentProviders {
  return makeEnvironmentProviders([
    {provide: ROUTES, multi: true, useValue: routes},
    (typeof ngDevMode === 'undefined' || ngDevMode) ?
        {provide: ROUTER_IS_PROVIDED, useValue: true} :
        [],
    {provide: ActivatedRoute, useFactory: rootRoute, deps: [Router]},
    {provide: APP_BOOTSTRAP_LISTENER, multi: true, useFactory: getBootstrapListener},
    features.map(feature => feature.ɵproviders),
  ]);
}

export function rootRoute(router: Router): ActivatedRoute {
  return router.routerState.root;
}

/**
 * Helper type to represent a Router feature.
 *
 * 表示路由器特性的帮助器类型。
 *
 * @publicApi
 */
export interface RouterFeature<FeatureKind extends RouterFeatureKind> {
  ɵkind: FeatureKind;
  ɵproviders: Provider[];
}

/**
 * Helper function to create an object that represents a Router feature.
 *
 * 用于创建表示路由器功能的对象的辅助函数。
 *
 */
function routerFeature<FeatureKind extends RouterFeatureKind>(
    kind: FeatureKind, providers: Provider[]): RouterFeature<FeatureKind> {
  return {ɵkind: kind, ɵproviders: providers};
}


/**
 * An Injection token used to indicate whether `provideRouter` or `RouterModule.forRoot` was ever
 * called.
 *
 * 用于指示是否调用过 `provideRouter` 或 `RouterModule.forRoot` 注入令牌。
 *
 */
export const ROUTER_IS_PROVIDED =
    new InjectionToken<boolean>('', {providedIn: 'root', factory: () => false});

const routerIsProvidedDevModeCheck = {
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useFactory() {
    return () => {
      if (!inject(ROUTER_IS_PROVIDED)) {
        console.warn(
            '`provideRoutes` was called without `provideRouter` or `RouterModule.forRoot`. ' +
            'This is likely a mistake.');
      }
    };
  }
};

/**
 * Registers a [DI provider](guide/glossary#provider) for a set of routes.
 *
 * 为一组路由注册[DI 提供程序](guide/glossary#provider)。
 *
 * @param routes The route configuration to provide.
 *
 * 注册路由。
 * @usageNotes
 *
 * ```
 * @NgModule({
 *   providers: [provideRoutes(ROUTES)]
 * })
 * class LazyLoadedChildModule {}
 * ```
 * @deprecated
 *
 * If necessary, provide routes using the `ROUTES` `InjectionToken`.
 *
 * 如有必要，使用 `ROUTES` `InjectionToken` 提供路由。
 *
 * @see `ROUTES`
 * @publicApi
 */
export function provideRoutes(routes: Routes): Provider[] {
  return [
    {provide: ROUTES, multi: true, useValue: routes},
    (typeof ngDevMode === 'undefined' || ngDevMode) ? routerIsProvidedDevModeCheck : [],
  ];
}

/**
 * A type alias for providers returned by `withInMemoryScrolling` for use with `provideRouter`.
 *
 * `provideRouter` `withInMemoryScrolling` 使用。
 *
 * @see `withInMemoryScrolling`
 * @see `provideRouter`
 * @publicApi
 */
export type InMemoryScrollingFeature = RouterFeature<RouterFeatureKind.InMemoryScrollingFeature>;

/**
 * Enables customizable scrolling behavior for router navigations.
 *
 * 为路由器导航启用可自定义的滚动行为。
 *
 * @usageNotes
 *
 * Basic example of how you can enable scrolling feature:
 *
 * 如何启用滚动特性的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withInMemoryScrolling())
 *     ]
 *   }
 * );
 * ```
 * @see `provideRouter`
 * @see `ViewportScroller`
 * @publicApi
 * @param options Set of configuration parameters to customize scrolling behavior, see
 *     `InMemoryScrollingOptions` for additional information.
 *
 * 可选值。默认值为 `{}`。
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 */
export function withInMemoryScrolling(options: InMemoryScrollingOptions = {}):
    InMemoryScrollingFeature {
  const providers = [{
    provide: ROUTER_SCROLLER,
    useFactory: () => {
      const viewportScroller = inject(ViewportScroller);
      const zone = inject(NgZone);
      const transitions = inject(NavigationTransitions);
      const urlSerializer = inject(UrlSerializer);
      return new RouterScroller(urlSerializer, transitions, viewportScroller, zone, options);
    },
  }];
  return routerFeature(RouterFeatureKind.InMemoryScrollingFeature, providers);
}

export function getBootstrapListener() {
  const injector = inject(Injector);
  return (bootstrappedComponentRef: ComponentRef<unknown>) => {
    const ref = injector.get(ApplicationRef);

    if (bootstrappedComponentRef !== ref.components[0]) {
      return;
    }

    const router = injector.get(Router);
    const bootstrapDone = injector.get(BOOTSTRAP_DONE);

    if (injector.get(INITIAL_NAVIGATION) === InitialNavigation.EnabledNonBlocking) {
      router.initialNavigation();
    }

    injector.get(ROUTER_PRELOADER, null, InjectFlags.Optional)?.setUpPreloading();
    injector.get(ROUTER_SCROLLER, null, InjectFlags.Optional)?.init();
    router.resetRootComponentType(ref.componentTypes[0]);
    if (!bootstrapDone.closed) {
      bootstrapDone.next();
      bootstrapDone.complete();
      bootstrapDone.unsubscribe();
    }
  };
}

/**
 * A subject used to indicate that the bootstrapping phase is done. When initial navigation is
 * `enabledBlocking`, the first navigation waits until bootstrapping is finished before continuing
 * to the activation phase.
 *
 * 用于指示引导阶段已完成的主题。 当初始导航为 `enabledBlocking` 时，第一个导航会等待引导完成，然后再继续激活阶段。
 *
 */
const BOOTSTRAP_DONE = new InjectionToken<Subject<void>>(
    (typeof ngDevMode === 'undefined' || ngDevMode) ? 'bootstrap done indicator' : '', {
      factory: () => {
        return new Subject<void>();
      }
    });

/**
 * This and the INITIAL_NAVIGATION token are used internally only. The public API side of this is
 * configured through the `ExtraOptions`.
 *
 * 这和 INITIAL_NAVIGATION 令牌仅在内部使用。 公共 API 端是通过 `ExtraOptions` 配置的。
 *
 * When set to `EnabledBlocking`, the initial navigation starts before the root
 * component is created. The bootstrap is blocked until the initial navigation is complete. This
 * value is required for [server-side rendering](guide/universal) to work.
 *
 * 当设置为 `EnabledBlocking` 时，初始导航在创建根组件之前开始。 引导程序被阻止，直到初始导航完成。 [服务器端渲染](guide/universal)需要此值才能工作。
 *
 * When set to `EnabledNonBlocking`, the initial navigation starts after the root component has been
 * created. The bootstrap is not blocked on the completion of the initial navigation.
 *
 * 当设置为 `EnabledNonBlocking` 时，初始导航在根组件创建后开始。 初始导航完成后，引导程序不会被阻止。
 *
 * When set to `Disabled`, the initial navigation is not performed. The location listener is set up
 * before the root component gets created. Use if there is a reason to have more control over when
 * the router starts its initial navigation due to some complex initialization logic.
 *
 * 设置为 `Disabled` 时，不执行初始导航。 位置侦听器是在创建根组件之前设置的。 如果由于某些复杂的初始化逻辑而有理由对路由器何时开始其初始导航进行更多控制，请使用。
 *
 * @see `ExtraOptions`
 */
const enum InitialNavigation {
  EnabledBlocking,
  EnabledNonBlocking,
  Disabled,
}

const INITIAL_NAVIGATION = new InjectionToken<InitialNavigation>(
    (typeof ngDevMode === 'undefined' || ngDevMode) ? 'initial navigation' : '',
    {providedIn: 'root', factory: () => InitialNavigation.EnabledNonBlocking});

/**
 * A type alias for providers returned by `withEnabledBlockingInitialNavigation` for use with
 * `provideRouter`.
 *
 * `provideRouter` `withEnabledBlockingInitialNavigation` 使用。
 *
 * @see `withEnabledBlockingInitialNavigation`
 * @see `provideRouter`
 * @publicApi
 */
export type EnabledBlockingInitialNavigationFeature =
    RouterFeature<RouterFeatureKind.EnabledBlockingInitialNavigationFeature>;

/**
 * A type alias for providers returned by `withEnabledBlockingInitialNavigation` or
 * `withDisabledInitialNavigation` functions for use with `provideRouter`.
 *
 * 由 `withEnabledBlockingInitialNavigation` 或 `withDisabledInitialNavigation` 函数返回的提供程序的类型别名，与 `provideRouter` 一起使用。
 *
 * @see `withEnabledBlockingInitialNavigation`
 * @see `withDisabledInitialNavigation`
 * @see `provideRouter`
 * @publicApi
 */
export type InitialNavigationFeature =
    EnabledBlockingInitialNavigationFeature|DisabledInitialNavigationFeature;

/**
 * Configures initial navigation to start before the root component is created.
 *
 * 将初始导航配置为在创建根组件之前启动。
 *
 * The bootstrap is blocked until the initial navigation is complete. This value is required for
 * [server-side rendering](guide/universal) to work.
 *
 * 在初始导航完成之前，引导程序被阻止。[服务器端渲染](guide/universal)需要此值。
 *
 * @usageNotes
 *
 * Basic example of how you can enable this navigation behavior:
 *
 * 如何启用此导航行为的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withEnabledBlockingInitialNavigation())
 *     ]
 *   }
 * );
 * ```
 * @see `provideRouter`
 * @publicApi
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 */
export function withEnabledBlockingInitialNavigation(): EnabledBlockingInitialNavigationFeature {
  const providers = [
    {provide: INITIAL_NAVIGATION, useValue: InitialNavigation.EnabledBlocking},
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [Injector],
      useFactory: (injector: Injector) => {
        const locationInitialized: Promise<any> =
            injector.get(LOCATION_INITIALIZED, Promise.resolve());

        return () => {
          return locationInitialized.then(() => {
            return new Promise(resolve => {
              const router = injector.get(Router);
              const bootstrapDone = injector.get(BOOTSTRAP_DONE);
              afterNextNavigation(router, () => {
                // Unblock APP_INITIALIZER in case the initial navigation was canceled or errored
                // without a redirect.
                resolve(true);
              });

              injector.get(NavigationTransitions).afterPreactivation = () => {
                // Unblock APP_INITIALIZER once we get to `afterPreactivation`. At this point, we
                // assume activation will complete successfully (even though this is not
                // guaranteed).
                resolve(true);
                return bootstrapDone.closed ? of(void 0) : bootstrapDone;
              };
              router.initialNavigation();
            });
          });
        };
      }
    },
  ];
  return routerFeature(RouterFeatureKind.EnabledBlockingInitialNavigationFeature, providers);
}

/**
 * A type alias for providers returned by `withDisabledInitialNavigation` for use with
 * `provideRouter`.
 *
 * `provideRouter` `withDisabledInitialNavigation` 使用。
 *
 * @see `withDisabledInitialNavigation`
 * @see `provideRouter`
 * @publicApi
 */
export type DisabledInitialNavigationFeature =
    RouterFeature<RouterFeatureKind.DisabledInitialNavigationFeature>;

/**
 * Disables initial navigation.
 *
 * 禁用初始导航。
 *
 * Use if there is a reason to have more control over when the router starts its initial navigation
 * due to some complex initialization logic.
 *
 * 如果由于某些复杂的初始化逻辑而有理由对路由器何时开始其初始导航有更多控制权，可以使用。
 *
 * @usageNotes
 *
 * Basic example of how you can disable initial navigation:
 *
 * 如何禁用初始导航的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withDisabledInitialNavigation())
 *     ]
 *   }
 * );
 * ```
 * @see `provideRouter`
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 * @publicApi
 */
export function withDisabledInitialNavigation(): DisabledInitialNavigationFeature {
  const providers = [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const router = inject(Router);
        return () => {
          router.setUpLocationChangeListener();
        };
      }
    },
    {provide: INITIAL_NAVIGATION, useValue: InitialNavigation.Disabled}
  ];
  return routerFeature(RouterFeatureKind.DisabledInitialNavigationFeature, providers);
}

/**
 * A type alias for providers returned by `withDebugTracing` for use with `provideRouter`.
 *
 * `withDebugTracing` 返回的提供程序的类型别名，与 `provideRouter` 一起使用。
 *
 * @see `withDebugTracing`
 * @see `provideRouter`
 * @publicApi
 */
export type DebugTracingFeature = RouterFeature<RouterFeatureKind.DebugTracingFeature>;

/**
 * Enables logging of all internal navigation events to the console.
 * Extra logging might be useful for debugging purposes to inspect Router event sequence.
 *
 * 启用将所有内部导航事件记录到控制台。额外的日志可能可用于调试以检查路由器事件顺序。
 *
 * @usageNotes
 *
 * Basic example of how you can enable debug tracing:
 *
 * 如何启用调试跟踪的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withDebugTracing())
 *     ]
 *   }
 * );
 * ```
 * @see `provideRouter`
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 * @publicApi
 */
export function withDebugTracing(): DebugTracingFeature {
  let providers: Provider[] = [];
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    providers = [{
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        const router = inject(Router);
        return () => router.events.subscribe((e: Event) => {
          // tslint:disable:no-console
          console.group?.(`Router Event: ${(<any>e.constructor).name}`);
          console.log(stringifyEvent(e));
          console.log(e);
          console.groupEnd?.();
          // tslint:enable:no-console
        });
      }
    }];
  } else {
    providers = [];
  }
  return routerFeature(RouterFeatureKind.DebugTracingFeature, providers);
}

const ROUTER_PRELOADER = new InjectionToken<RouterPreloader>(
    (typeof ngDevMode === 'undefined' || ngDevMode) ? 'router preloader' : '');

/**
 * A type alias that represents a feature which enables preloading in Router.
 * The type is used to describe the return value of the `withPreloading` function.
 *
 * 一种类型别名，表示在 Router 中启用预加载的特性。该类型用于描述 `withPreloading` 函数的返回值。
 *
 * @see `withPreloading`
 * @see `provideRouter`
 * @publicApi
 */
export type PreloadingFeature = RouterFeature<RouterFeatureKind.PreloadingFeature>;

/**
 * Allows to configure a preloading strategy to use. The strategy is configured by providing a
 * reference to a class that implements a `PreloadingStrategy`.
 *
 * 允许配置要使用的预加载策略。该策略是通过提供对实现 `PreloadingStrategy` 的类的引用来配置的。
 *
 * @usageNotes
 *
 * Basic example of how you can configure preloading:
 *
 * 如何配置预加载的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withPreloading(PreloadAllModules))
 *     ]
 *   }
 * );
 * ```
 * @see `provideRouter`
 * @param preloadingStrategy A reference to a class that implements a `PreloadingStrategy` that
 *     should be used.
 *
 * 对实现应该使用的 `PreloadingStrategy` 的类的引用。
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 * @publicApi
 */
export function withPreloading(preloadingStrategy: Type<PreloadingStrategy>): PreloadingFeature {
  const providers = [
    {provide: ROUTER_PRELOADER, useExisting: RouterPreloader},
    {provide: PreloadingStrategy, useExisting: preloadingStrategy},
  ];
  return routerFeature(RouterFeatureKind.PreloadingFeature, providers);
}

/**
 * A type alias for providers returned by `withRouterConfig` for use with `provideRouter`.
 *
 * `withRouterConfig` 返回的提供程序的类型别名，与 `provideRouter` 一起使用。
 *
 * @see `withRouterConfig`
 * @see `provideRouter`
 * @publicApi
 */
export type RouterConfigurationFeature =
    RouterFeature<RouterFeatureKind.RouterConfigurationFeature>;

/**
 * Allows to provide extra parameters to configure Router.
 *
 * 允许提供额外的参数来配置路由器。
 *
 * @usageNotes
 *
 * Basic example of how you can provide extra configuration options:
 *
 * 如何提供额外配置选项的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withRouterConfig({
 *          onSameUrlNavigation: 'reload'
 *       }))
 *     ]
 *   }
 * );
 * ```
 * @see `provideRouter`
 * @param options A set of parameters to configure Router, see `RouterConfigOptions` for
 *     additional information.
 *
 * 用于配置路由器的一组参数，有关其他信息，请参阅 `RouterConfigOptions` 。
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 * @publicApi
 */
export function withRouterConfig(options: RouterConfigOptions): RouterConfigurationFeature {
  const providers = [
    {provide: ROUTER_CONFIGURATION, useValue: options},
  ];
  return routerFeature(RouterFeatureKind.RouterConfigurationFeature, providers);
}

/**
 * A type alias for providers returned by `withHashLocation` for use with `provideRouter`.
 *
 * `withHashLocation` 返回的提供者的类型别名，用于 `provideRouter` 。
 *
 * @see `withHashLocation`
 * @see `provideRouter`
 * @publicApi
 */
export type RouterHashLocationFeature = RouterFeature<RouterFeatureKind.RouterHashLocationFeature>;

/**
 * Provides the location strategy that uses the URL fragment instead of the history API.
 *
 * 提供使用 URL 片段而不是 history API 的定位策略。
 *
 * @usageNotes
 *
 * Basic example of how you can use the hash location option:
 *
 * 如何使用散列位置选项的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withHashLocation())
 *     ]
 *   }
 * );
 * ```
 *
 * @see `provideRouter`
 * @see `HashLocationStrategy`
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 * @publicApi
 */
export function withHashLocation(): RouterConfigurationFeature {
  const providers = [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ];
  return routerFeature(RouterFeatureKind.RouterConfigurationFeature, providers);
}

/**
 * A type alias for providers returned by `withNavigationErrorHandler` for use with `provideRouter`.
 *
 * `withNavigationErrorHandler` 返回的提供者的类型别名，用于 `provideRouter` 。
 *
 * @see `withNavigationErrorHandler`
 * @see `provideRouter`
 * @publicApi
 */
export type NavigationErrorHandlerFeature =
    RouterFeature<RouterFeatureKind.NavigationErrorHandlerFeature>;

/**
 * Subscribes to the Router's navigation events and calls the given function when a
 * `NavigationError` happens.
 *
 * 订阅路由器的导航事件并在发生 `NavigationError` 时调用给定的函数。
 *
 * This function is run inside application's injection context so you can use the `inject` function.
 *
 * 此函数在应用程序的注入上下文中运行，因此您可以使用 `inject` 函数。
 *
 * @usageNotes
 *
 * Basic example of how you can use the error handler option:
 *
 * 如何使用错误处理程序选项的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withNavigationErrorHandler((e: NavigationError) =>
 * inject(MyErrorTracker).trackError(e)))
 *     ]
 *   }
 * );
 * ```
 *
 * @see `NavigationError`
 * @see `inject`
 * @see `EnvironmentInjector#runInContext`
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 * @publicApi
 */
export function withNavigationErrorHandler(fn: (error: NavigationError) => void):
    NavigationErrorHandlerFeature {
  const providers = [{
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => {
      const injector = inject(EnvironmentInjector);
      inject(Router).events.subscribe((e) => {
        if (e instanceof NavigationError) {
          injector.runInContext(() => fn(e));
        }
      });
    }
  }];
  return routerFeature(RouterFeatureKind.NavigationErrorHandlerFeature, providers);
}

/**
 * A type alias for providers returned by `withComponentInputBinding` for use with `provideRouter`.
 *
 * `withComponentInputBinding` 返回的提供者的类型别名，用于 `provideRouter` 。
 *
 * @see `withComponentInputBinding`
 * @see `provideRouter`
 * @publicApi
 */
export type ComponentInputBindingFeature =
    RouterFeature<RouterFeatureKind.ComponentInputBindingFeature>;

/**
 * Enables binding information from the `Router` state directly to the inputs of the component in
 * `Route` configurations.
 *
 * 启用从 `Router` 状态直接绑定到 `Route` 配置中组件输入的信息。
 *
 * @usageNotes
 *
 * Basic example of how you can enable the feature:
 *
 * 如何启用该功能的基本示例：
 *
 * ```
 * const appRoutes: Routes = [];
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideRouter(appRoutes, withComponentInputBinding())
 *     ]
 *   }
 * );
 * ```
 *
 * @returns
 *
 * A set of providers for use with `provideRouter`.
 *
 * 一组与 `provideRouter` 一起使用的提供程序。
 *
 */
export function withComponentInputBinding(): ComponentInputBindingFeature {
  const providers = [
    RoutedComponentInputBinder,
    {provide: INPUT_BINDER, useExisting: RoutedComponentInputBinder},
  ];

  return routerFeature(RouterFeatureKind.ComponentInputBindingFeature, providers);
}

/**
 * A type alias that represents all Router features available for use with `provideRouter`.
 * Features can be enabled by adding special functions to the `provideRouter` call.
 * See documentation for each symbol to find corresponding function name. See also `provideRouter`
 * documentation on how to use those functions.
 *
 * 一个类型别名，表示可与 `provideRouter` 一起使用的所有路由器特性。可以通过向 `provideRouter` 调用添加特殊函数来启用特性。请参阅每个符号的文档以查找对应的函数名称。有关如何使用这些函数，另请参阅 `provideRouter` 文档。
 *
 * @see `provideRouter`
 * @publicApi
 */
export type RouterFeatures =
    PreloadingFeature|DebugTracingFeature|InitialNavigationFeature|InMemoryScrollingFeature|
    RouterConfigurationFeature|NavigationErrorHandlerFeature|ComponentInputBindingFeature;

/**
 * The list of features as an enum to uniquely type each feature.
 *
 * 作为枚举的功能列表，用于唯一键入每个功能。
 *
 */
export const enum RouterFeatureKind {
  PreloadingFeature,
  DebugTracingFeature,
  EnabledBlockingInitialNavigationFeature,
  DisabledInitialNavigationFeature,
  InMemoryScrollingFeature,
  RouterConfigurationFeature,
  RouterHashLocationFeature,
  NavigationErrorHandlerFeature,
  ComponentInputBindingFeature,
}
