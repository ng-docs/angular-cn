/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {first} from 'rxjs/operators';

import {APP_BOOTSTRAP_LISTENER, ApplicationRef} from '../application_ref';
import {ENABLED_SSR_FEATURES, PLATFORM_ID} from '../application_tokens';
import {Console} from '../console';
import {ENVIRONMENT_INITIALIZER, EnvironmentProviders, Injector, makeEnvironmentProviders} from '../di';
import {inject} from '../di/injector_compatibility';
import {formatRuntimeError, RuntimeErrorCode} from '../errors';
import {enableLocateOrCreateContainerRefImpl} from '../linker/view_container_ref';
import {enableLocateOrCreateElementNodeImpl} from '../render3/instructions/element';
import {enableLocateOrCreateElementContainerNodeImpl} from '../render3/instructions/element_container';
import {enableApplyRootElementTransformImpl} from '../render3/instructions/shared';
import {enableLocateOrCreateContainerAnchorImpl} from '../render3/instructions/template';
import {enableLocateOrCreateTextNodeImpl} from '../render3/instructions/text';
import {TransferState} from '../transfer_state';
import {NgZone} from '../zone';

import {cleanupDehydratedViews} from './cleanup';
import {IS_HYDRATION_DOM_REUSE_ENABLED, PRESERVE_HOST_CONTENT} from './tokens';
import {enableRetrieveHydrationInfoImpl, NGH_DATA_KEY} from './utils';
import {enableFindMatchingDehydratedViewImpl} from './views';


/**
 * Indicates whether the hydration-related code was added,
 * prevents adding it multiple times.
 *
 * 指示是否添加了与水化相关的代码，防止多次添加。
 *
 */
let isHydrationSupportEnabled = false;

/**
 * Defines a period of time that Angular waits for the `ApplicationRef.isStable` to emit `true`.
 * If there was no event with the `true` value during this time, Angular reports a warning.
 *
 * 定义 Angular 等待 `ApplicationRef.isStable` 发出 `true` 时间段。 如果在这段时间内没有任何具有 `true` 值的事件，Angular 会报告一个警告。
 *
 */
const APPLICATION_IS_STABLE_TIMEOUT = 10_000;

/**
 * Brings the necessary hydration code in tree-shakable manner.
 * The code is only present when the `provideClientHydration` is
 * invoked. Otherwise, this code is tree-shaken away during the
 * build optimization step.
 *
 * 以 tree-shakable 的方式带来必要的水合代码。 该代码仅在调用 `provideClientHydration` 时出现。 否则，这段代码会在构建优化步骤中被摇树掉。
 *
 * This technique allows us to swap implementations of methods so
 * tree shaking works appropriately when hydration is disabled or
 * enabled. It brings in the appropriate version of the method that
 * supports hydration only when enabled.
 *
 * 这种技术允许我们交换方法的实现，以便在禁用或启用水合作用时 tree shaking 适当地工作。 它引入了仅在启用时才支持水合作用的方法的适当版本。
 *
 */
function enableHydrationRuntimeSupport() {
  if (!isHydrationSupportEnabled) {
    isHydrationSupportEnabled = true;
    enableRetrieveHydrationInfoImpl();
    enableLocateOrCreateElementNodeImpl();
    enableLocateOrCreateTextNodeImpl();
    enableLocateOrCreateElementContainerNodeImpl();
    enableLocateOrCreateContainerAnchorImpl();
    enableLocateOrCreateContainerRefImpl();
    enableFindMatchingDehydratedViewImpl();
    enableApplyRootElementTransformImpl();
  }
}

/**
 * Detects whether the code is invoked in a browser.
 * Later on, this check should be replaced with a tree-shakable
 * flag \(e.g. `!isServer`\).
 *
 * 检测代码是否在浏览器中被调用。 稍后，此检查应替换为 tree-shakable 标志（例如 `!isServer` ）。
 *
 */
function isBrowser(): boolean {
  return inject(PLATFORM_ID) === 'browser';
}

/**
 * Outputs a message with hydration stats into a console.
 *
 * 将包含水合作用统计信息的消息输出到控制台。
 *
 */
function printHydrationStats(injector: Injector) {
  const console = injector.get(Console);
  const message = `Angular hydrated ${ngDevMode!.hydratedComponents} component(s) ` +
      `and ${ngDevMode!.hydratedNodes} node(s), ` +
      `${ngDevMode!.componentsSkippedHydration} component(s) were skipped. ` +
      `Note: this feature is in Developer Preview mode. ` +
      `Learn more at https://angular.io/guide/hydration.`;
  // tslint:disable-next-line:no-console
  console.log(message);
}


/**
 * Returns a Promise that is resolved when an application becomes stable.
 *
 * 返回一个在应用程序变得稳定时解决的承诺。
 *
 */
function whenStable(appRef: ApplicationRef, injector: Injector): Promise<void> {
  const isStablePromise = appRef.isStable.pipe(first((isStable: boolean) => isStable)).toPromise();
  if (typeof ngDevMode !== 'undefined' && ngDevMode) {
    const timeoutTime = APPLICATION_IS_STABLE_TIMEOUT;
    const console = injector.get(Console);
    const ngZone = injector.get(NgZone);

    // The following call should not and does not prevent the app to become stable
    // We cannot use RxJS timer here because the app would remain unstable.
    // This also avoids an extra change detection cycle.
    const timeoutId = ngZone.runOutsideAngular(() => {
      return setTimeout(() => logWarningOnStableTimedout(timeoutTime, console), timeoutTime);
    });

    isStablePromise.finally(() => clearTimeout(timeoutId));
  }

  return isStablePromise.then(() => {});
}

/**
 * Returns a set of providers required to setup hydration support
 * for an application that is server side rendered. This function is
 * included into the `provideClientHydration` public API function from
 * the `platform-browser` package.
 *
 * 返回为服务器端呈现的应用程序设置水合支持所需的一组提供程序。 该函数包含在 `platform-browser` 包中的 `provideClientHydration` 公共 API 函数中。
 *
 * The function sets up an internal flag that would be recognized during
 * the server side rendering time as well, so there is no need to
 * configure or change anything in NgUniversal to enable the feature.
 *
 * 该函数设置了一个内部标志，该标志也会在服务器端渲染期间被识别，因此无需在 NgUniversal 中配置或更改任何内容即可启用该功能。
 *
 */
export function withDomHydration(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: IS_HYDRATION_DOM_REUSE_ENABLED,
      useFactory: () => {
        let isEnabled = true;
        if (isBrowser()) {
          // On the client, verify that the server response contains
          // hydration annotations. Otherwise, keep hydration disabled.
          const transferState = inject(TransferState, {optional: true});
          isEnabled = !!transferState?.get(NGH_DATA_KEY, null);
          if (!isEnabled && (typeof ngDevMode !== 'undefined' && ngDevMode)) {
            const console = inject(Console);
            const message = formatRuntimeError(
                RuntimeErrorCode.MISSING_HYDRATION_ANNOTATIONS,
                'Angular hydration was requested on the client, but there was no ' +
                    'serialized information present in the server response, ' +
                    'thus hydration was not enabled. ' +
                    'Make sure the `provideClientHydration()` is included into the list ' +
                    'of providers in the server part of the application configuration.');
            // tslint:disable-next-line:no-console
            console.warn(message);
          }
        }
        if (isEnabled) {
          inject(ENABLED_SSR_FEATURES).add('hydration');
        }
        return isEnabled;
      },
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => {
        // Since this function is used across both server and client,
        // make sure that the runtime code is only added when invoked
        // on the client. Moving forward, the `isBrowser` check should
        // be replaced with a tree-shakable alternative (e.g. `isServer`
        // flag).
        if (isBrowser() && inject(IS_HYDRATION_DOM_REUSE_ENABLED)) {
          enableHydrationRuntimeSupport();
        }
      },
      multi: true,
    },
    {
      provide: PRESERVE_HOST_CONTENT,
      useFactory: () => {
        // Preserve host element content only in a browser
        // environment and when hydration is configured properly.
        // On a server, an application is rendered from scratch,
        // so the host content needs to be empty.
        return isBrowser() && inject(IS_HYDRATION_DOM_REUSE_ENABLED);
      }
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: () => {
        if (isBrowser() && inject(IS_HYDRATION_DOM_REUSE_ENABLED)) {
          const appRef = inject(ApplicationRef);
          const injector = inject(Injector);
          return () => {
            whenStable(appRef, injector).then(() => {
              // Wait until an app becomes stable and cleanup all views that
              // were not claimed during the application bootstrap process.
              // The timing is similar to when we start the serialization process
              // on the server.
              cleanupDehydratedViews(appRef);

              if (typeof ngDevMode !== 'undefined' && ngDevMode) {
                printHydrationStats(injector);
              }
            });
          };
        }
        return () => {};  // noop
      },
      multi: true,
    }
  ]);
}

/**
 *
 * @param time The time in ms until the stable timedout warning message is logged
 *
 * 记录稳定超时警告消息之前的时间（以毫秒为单位）
 *
 */
function logWarningOnStableTimedout(time: number, console: Console): void {
  const message =
      `Angular hydration expected the ApplicationRef.isStable() to emit \`true\`, but it ` +
      `didn't happen within ${
          time}ms. Angular hydration logic depends on the application becoming stable ` +
      `as a signal to complete hydration process.`;

  console.warn(formatRuntimeError(RuntimeErrorCode.HYDRATION_STABLE_TIMEDOUT, message));
}
