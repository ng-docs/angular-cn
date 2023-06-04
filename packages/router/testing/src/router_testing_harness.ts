/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, DebugElement, Injectable, Type, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router, RouterOutlet, ɵafterNextNavigation as afterNextNavigation} from '@angular/router';

@Injectable({providedIn: 'root'})
export class RootFixtureService {
  private fixture?: ComponentFixture<RootCmp>;
  private harness?: RouterTestingHarness;

  createHarness(): RouterTestingHarness {
    if (this.harness) {
      throw new Error('Only one harness should be created per test.');
    }
    this.harness = new RouterTestingHarness(this.getRootFixture());
    return this.harness;
  }

  private getRootFixture(): ComponentFixture<RootCmp> {
    if (this.fixture !== undefined) {
      return this.fixture;
    }
    this.fixture = TestBed.createComponent(RootCmp);
    this.fixture.detectChanges();
    return this.fixture;
  }
}

@Component({
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet],
})
export class RootCmp {
  @ViewChild(RouterOutlet) outlet?: RouterOutlet;
}

/**
 * A testing harness for the `Router` to reduce the boilerplate needed to test routes and routed
 * components.
 *
 * 用于 `Router` 的测试工具，用于减少测试路由和路由组件所需的样板文件。
 *
 * @publicApi
 */
export class RouterTestingHarness {
  /**
   * Creates a `RouterTestingHarness` instance.
   *
   * 创建一个 `RouterTestingHarness` 实例。
   *
   * The `RouterTestingHarness` also creates its own root component with a `RouterOutlet` for the
   * purposes of rendering route components.
   *
   * `RouterTestingHarness` 还使用 `RouterOutlet` 创建自己的根组件，用于渲染路由组件。
   *
   * Throws an error if an instance has already been created.
   * Use of this harness also requires `destroyAfterEach: true` in the `ModuleTeardownOptions`
   *
   * 如果实例已创建，则抛出错误。使用此工具还需要在 `ModuleTeardownOptions` 中设置 `destroyAfterEach: true`
   *
   * @param initialUrl The target of navigation to trigger before returning the harness.
   *
   * 返回线束之前要触发的导航目标。
   *
   */
  static async create(initialUrl?: string): Promise<RouterTestingHarness> {
    const harness = TestBed.inject(RootFixtureService).createHarness();
    if (initialUrl !== undefined) {
      await harness.navigateByUrl(initialUrl);
    }
    return harness;
  }

  /** @internal */
  constructor(private readonly fixture: ComponentFixture<RootCmp>) {}

  /**
   * Instructs the root fixture to run change detection.
   *
   * 指示根夹具运行变更检测。
   *
   */
  detectChanges(): void {
    this.fixture.detectChanges();
  }
  /**
   * The `DebugElement` of the `RouterOutlet` component. `null` if the outlet is not activated.
   *
   * `RouterOutlet` 组件的 `DebugElement`。如果插座未激活，则为 `null`。
   *
   */
  get routeDebugElement(): DebugElement|null {
    const outlet = this.fixture.componentInstance.outlet;
    if (!outlet || !outlet.isActivated) {
      return null;
    }
    return this.fixture.debugElement.query(v => v.componentInstance === outlet.component);
  }
  /**
   * The native element of the `RouterOutlet` component. `null` if the outlet is not activated.
   *
   * `RouterOutlet` 组件的原生元素。如果插座未激活，则为 `null`。
   *
   */
  get routeNativeElement(): HTMLElement|null {
    return this.routeDebugElement?.nativeElement ?? null;
  }

  /**
   * Triggers a `Router` navigation and waits for it to complete.
   *
   * 触发 `Router` 导航并等待它完成。
   *
   * The root component with a `RouterOutlet` created for the harness is used to render `Route`
   * components. The root component is reused within the same test in subsequent calls to
   * `navigateForTest`.
   *
   * 具有为线束创建的 `RouterOutlet` 的根组件用于渲染 `Route` 组件。在对 `navigateForTest` 后续调用中，根组件在同一测试中重复使用。
   *
   * When testing `Routes` with a guards that reject the navigation, the `RouterOutlet` might not be
   * activated and the `activatedComponent` may be `null`.
   *
   * 当使用拒绝导航的守卫测试 `Routes` 时，`RouterOutlet` 可能未激活并且 `activatedComponent` 可能为 `null`。
   *
   * {@example router/testing/test/router_testing_harness_examples.spec.ts region='Guard'}
   *
   * @param url The target of the navigation. Passed to `Router.navigateByUrl`.
   *
   * 导航的目标。传递给 `Router.navigateByUrl`。
   *
   * @returns
   *
   * The activated component instance of the `RouterOutlet` after navigation completes
   *     \(`null` if the outlet does not get activated\).
   *
   * 导航完成后 `RouterOutlet` 的激活组件实例（如果插座未激活则为 `null` ）。
   *
   */
  async navigateByUrl(url: string): Promise<null|{}>;
  /**
   * Triggers a router navigation and waits for it to complete.
   *
   * 触发路由器导航并等待它完成。
   *
   * The root component with a `RouterOutlet` created for the harness is used to render `Route`
   * components.
   *
   * 具有为线束创建的 `RouterOutlet` 的根组件用于渲染 `Route` 组件。
   *
   * {@example router/testing/test/router_testing_harness_examples.spec.ts region='RoutedComponent'}
   *
   * The root component is reused within the same test in subsequent calls to `navigateByUrl`.
   *
   * 在对 `navigateByUrl` 后续调用中，根组件在同一测试中重复使用。
   *
   * This function also makes it easier to test components that depend on `ActivatedRoute` data.
   *
   * 此功能还可以更轻松地测试依赖于 `ActivatedRoute` 数据的组件。
   *
   * {@example router/testing/test/router_testing_harness_examples.spec.ts region='ActivatedRoute'}
   *
   * @param url The target of the navigation. Passed to `Router.navigateByUrl`.
   *
   * 导航的目标。传递给 `Router.navigateByUrl`。
   *
   * @param requiredRoutedComponentType After navigation completes, the required type for the
   *     activated component of the `RouterOutlet`. If the outlet is not activated or a different
   *     component is activated, this function will throw an error.
   *
   * 导航完成后，`RouterOutlet` 的激活组件所需的类型。如果插座未激活或激活了不同的组件，则此函数将引发错误。
   *
   * @returns
   *
   * The activated component instance of the `RouterOutlet` after navigation completes.
   *
   * 导航完成后激活的 `RouterOutlet` 组件实例。
   *
   */
  async navigateByUrl<T>(url: string, requiredRoutedComponentType: Type<T>): Promise<T>;
  async navigateByUrl<T>(url: string, requiredRoutedComponentType?: Type<T>): Promise<T|null> {
    const router = TestBed.inject(Router);
    let resolveFn!: () => void;
    const redirectTrackingPromise = new Promise<void>(resolve => {
      resolveFn = resolve;
    });
    afterNextNavigation(TestBed.inject(Router), resolveFn);
    await router.navigateByUrl(url);
    await redirectTrackingPromise;
    this.fixture.detectChanges();
    const outlet = this.fixture.componentInstance.outlet;
    // The outlet might not be activated if the user is testing a navigation for a guard that
    // rejects
    if (outlet && outlet.isActivated && outlet.activatedRoute.component) {
      const activatedComponent = outlet.component;
      if (requiredRoutedComponentType !== undefined &&
          !(activatedComponent instanceof requiredRoutedComponentType)) {
        throw new Error(`Unexpected routed component type. Expected ${
            requiredRoutedComponentType.name} but got ${activatedComponent.constructor.name}`);
      }
      return activatedComponent as T;
    } else {
      return null;
    }
  }
}
