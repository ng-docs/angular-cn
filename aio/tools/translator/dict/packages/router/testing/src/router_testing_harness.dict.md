A testing harness for the `Router` to reduce the boilerplate needed to test routes and routed
components.

用于 `Router` 的测试工具，用于减少测试路由和路由组件所需的样板文件。

The target of navigation to trigger before returning the harness.

返回线束之前要触发的导航目标。

Creates a `RouterTestingHarness` instance.

创建一个 `RouterTestingHarness` 实例。

The `RouterTestingHarness` also creates its own root component with a `RouterOutlet` for the
purposes of rendering route components.

`RouterTestingHarness` 还使用 `RouterOutlet` 创建自己的根组件，用于渲染路由组件。

Throws an error if an instance has already been created.
Use of this harness also requires `destroyAfterEach: true` in the `ModuleTeardownOptions`

如果实例已创建，则抛出错误。使用此工具还需要在 `ModuleTeardownOptions` 中设置 `destroyAfterEach: true`

Instructs the root fixture to run change detection.

指示根夹具运行变更检测。

The `DebugElement` of the `RouterOutlet` component. `null` if the outlet is not activated.

`RouterOutlet` 组件的 `DebugElement`。如果插座未激活，则为 `null`。

The native element of the `RouterOutlet` component. `null` if the outlet is not activated.

`RouterOutlet` 组件的原生元素。如果插座未激活，则为 `null`。

The target of the navigation. Passed to `Router.navigateByUrl`.

导航的目标。传递给 `Router.navigateByUrl`。

The activated component instance of the `RouterOutlet` after navigation completes
    \(`null` if the outlet does not get activated\).

导航完成后 `RouterOutlet` 的激活组件实例（如果插座未激活则为 `null` ）。

Triggers a `Router` navigation and waits for it to complete.

触发 `Router` 导航并等待它完成。

The root component with a `RouterOutlet` created for the harness is used to render `Route`
components. The root component is reused within the same test in subsequent calls to
`navigateForTest`.

具有为线束创建的 `RouterOutlet` 的根组件用于渲染 `Route` 组件。在对 `navigateForTest` 后续调用中，根组件在同一测试中重复使用。

When testing `Routes` with a guards that reject the navigation, the `RouterOutlet` might not be
activated and the `activatedComponent` may be `null`.

当使用拒绝导航的守卫测试 `Routes` 时，`RouterOutlet` 可能未激活并且 `activatedComponent` 可能为 `null`。

{&commat;example router/testing/test/router_testing_harness_examples.spec.ts region='Guard'}



After navigation completes, the required type for the
    activated component of the `RouterOutlet`. If the outlet is not activated or a different
    component is activated, this function will throw an error.

导航完成后，`RouterOutlet` 的激活组件所需的类型。如果插座未激活或激活了不同的组件，则此函数将引发错误。

The activated component instance of the `RouterOutlet` after navigation completes.

导航完成后激活的 `RouterOutlet` 组件实例。

Triggers a router navigation and waits for it to complete.

触发路由器导航并等待它完成。

The root component with a `RouterOutlet` created for the harness is used to render `Route`
components.

具有为线束创建的 `RouterOutlet` 的根组件用于渲染 `Route` 组件。

{&commat;example router/testing/test/router_testing_harness_examples.spec.ts region='RoutedComponent'}



The root component is reused within the same test in subsequent calls to `navigateByUrl`.

在对 `navigateByUrl` 后续调用中，根组件在同一测试中重复使用。

This function also makes it easier to test components that depend on `ActivatedRoute` data.

此功能还可以更轻松地测试依赖于 `ActivatedRoute` 数据的组件。

{&commat;example router/testing/test/router_testing_harness_examples.spec.ts region='ActivatedRoute'}