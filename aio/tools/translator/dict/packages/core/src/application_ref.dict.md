Internal token to indicate whether having multiple bootstrapped platform should be allowed \(only
one bootstrapped platform is allowed by default\). This token helps to support SSR scenarios.

指示是否应允许具有多个自举平台的内部令牌（默认情况下只允许一个自举平台）。此令牌有助于支持 SSR 场景。

Internal token that allows to register extra callbacks that should be invoked during the
`PlatformRef.destroy` operation. This token is needed to avoid a direct reference to the
`PlatformRef` class \(i.e. register the callback via `PlatformRef.onDestroy`\), thus making the
entire class tree-shakeable.

允许注册应在 `PlatformRef.destroy` 操作期间调用的额外回调的内部令牌。需要此令牌以避免直接引用 `PlatformRef` 类（即通过 `PlatformRef.onDestroy` 注册回调），从而使整个类可摇树。

A [DI token](guide/glossary#di-token "DI token definition") that provides a set of callbacks to
be called for every component that is bootstrapped.

一个 [DI 令牌](guide/glossary#di-token "DI
令牌定义")，该令牌提供了一组针对每个要引导的组件调用的回调。

Each callback must take a `ComponentRef` instance and return nothing.

每个回调都必须接受 `ComponentRef` 实例，并且不返回任何内容。

Sets the error for an invalid write to a signal to be an Angular `RuntimeError`.

将无效写入信号的错误设置为 Angular `RuntimeError`。

A token for third-party components that can register themselves with NgProbe.

本令牌可以在 NgProbe 中注册自己的第三方组件。

Creates a platform.
Platforms must be created on launch using this function.

创建一个平台。必须使用此函数在启动时创建平台。

The goal of this function is to bootstrap a platform injector,
but avoid referencing `PlatformRef` class.
This function is needed for bootstrapping a Standalone Component.

此函数的目标是引导平台注入器，但避免引用 `PlatformRef` 类。引导独立组件需要此函数。

A promise that returns an `ApplicationRef` instance once resolved.

一个承诺，一旦解决就返回一个 `ApplicationRef` 实例。

Internal create application API that implements the core application creation logic and optional
bootstrap logic.

内部创建应用程序 API，实现核心应用程序创建逻辑和可选的引导程序逻辑。

Platforms \(such as `platform-browser`\) may require different set of application and platform
providers for an application to function correctly. As a result, platforms may use this function
internally and supply the necessary providers during the bootstrap, while exposing
platform-specific APIs as a part of their public API.

平台（例如 `platform-browser` ）可能需要不同的应用程序和平台提供商集才能使应用程序正常运行。因此，平台可以在内部使用此功能并在引导期间提供必要的提供程序，同时将特定于平台的 API 作为其公共 API 的一部分公开。

Another platform factory to modify. Allows you to compose factories
to build up configurations that might be required by different libraries or parts of the
application.

要修改的另一个平台工厂。允许你组合多个工厂来构建一些配置，其它库或应用程序的其它部分可能需要的它们。

Identifies the new platform factory.

标识新的平台工厂。

A set of dependency providers for platforms created with the new factory.

使用新工厂创建的平台的一组依赖项提供者。

Creates a factory for a platform. Can be used to provide or override `Providers` specific to
your application's runtime needs, such as `PLATFORM_INITIALIZER` and `PLATFORM_ID`.

为平台创建工厂。可用于提供或覆盖针对你的应用程序的运行时需求的 `Providers`，比如 `PLATFORM_INITIALIZER` 和 `PLATFORM_ID`。

Checks that there is currently a platform that contains the given token as a provider.

检查当前是否存在以给定标记为提供者的平台。

Helper function to create an instance of a platform injector \(that maintains the 'platform'
scope\).

用于创建平台注入器实例的辅助函数（维护“平台”范围）。

Destroys the current Angular platform and all Angular applications on the page.
Destroys all modules and listeners registered with the platform.

销毁页面上的当前 Angular 平台和所有 Angular 应用程序。销毁在平台上注册的所有模块和监听器。

Returns the current platform.

返回当前平台。

Used to configure event and run coalescing with `provideZoneChangeDetection`.

用于配置事件并使用 `provideZoneChangeDetection` 运行合并。

Optionally specify coalescing event change detections or not.
Consider the following case.

（可选）指定或不指定合并事件变更检测。考虑以下情况。

When button is clicked, because of the event bubbling, both
event handlers will be called and 2 change detections will be
triggered. We can coalesce such kind of events to only trigger
change detection only once.

单击按钮时，由于事件冒泡，将调用两个事件处理程序，并触发 2 次变更检测。我们可以合并此类事件以仅触发变更检测一次。

By default, this option will be false. So the events will not be
coalesced and the change detection will be triggered multiple times.
And if this option be set to true, the change detection will be
triggered async by scheduling a animation frame. So in the case above,
the change detection will only be triggered once.

默认情况下，此选项将是 false。因此，事件将不会被合并，并且变更检测将被触发多次。如果此选项设置为 true，则变更检测将通过调度动画帧来异步触发。因此在上面的情况下，变更检测将只会触发一次。

Optionally specify if `NgZone#run()` method invocations should be coalesced
into a single change detection.

（可选）指定 `NgZone#run()` 方法调用是否应合并为单个变更检测。

Consider the following case.

考虑以下情况。

This case triggers the change detection multiple times.
With ngZoneRunCoalescing options, all change detections in an event loop trigger only once.
In addition, the change detection executes in requestAnimation.

这种情况会多次触发变更检测。使用 ngZoneRunCoalescing 选项，事件循环中的所有变更检测只会触发一次。此外，变更检测是在 requestAnimation 中执行的。

Provides additional options to the bootstrapping process.

为引导过程提供其他选项。

Optionally specify which `NgZone` should be used.

（可选）指定应该使用哪个 `NgZone`。

Provide your own `NgZone` instance.

提供你自己的 `NgZone` 实例。

`zone.js` - Use default `NgZone` which requires `Zone.js`.

`zone.js` - 使用需要 `Zone.js` `NgZone`。

`noop` - Use `NoopNgZone` which does nothing.

`noop` - 使用什么都不做的 `NoopNgZone`。

The Angular platform is the entry point for Angular on a web page.
Each page has exactly one platform. Services \(such as reflection\) which are common
to every Angular application running on the page are bound in its scope.
A page's platform is initialized implicitly when a platform is created using a platform
factory such as `PlatformBrowser`, or explicitly by calling the `createPlatform()` function.

Angular 平台是 Angular 在网页上的入口点。每个页面只有一个平台。页面上运行的每个 Angular 应用程序所共有的服务（比如反射）都在其范围内绑定。当使用 `PlatformBrowser` 这样的平台工厂创建平台时，将隐式初始化此页面的平台；也可以通过调用 `createPlatform()` 函数来显式初始化此页面的平台。

Passing NgModule factories as the `PlatformRef.bootstrapModuleFactory` function
    argument is deprecated. Use the `PlatformRef.bootstrapModule` API instead.

将 NgModule 工厂作为 `PlatformRef.bootstrapModuleFactory` 函数参数传递已弃用。请改用 `PlatformRef.bootstrapModule` API。

Creates an instance of an `@NgModule` for the given platform.

为给定的平台创建 `@NgModule` 的实例。

Simple Example

简单的例子

Creates an instance of an `@NgModule` for a given platform.

使用给定的运行时编译器为给定的平台创建 `@NgModule` 的实例。

Registers a listener to be called when the platform is destroyed.

注册销毁平台时要调用的监听器。

Retrieves the platform {&commat;link Injector}, which is the parent injector for
every Angular application on the page and provides singleton providers.

检索平台 {&commat;link Injector}，它是页面上每个 Angular 应用程序的父注入器，并提供单例提供程序。

Indicates whether this instance was destroyed.

表明此实例是否已销毁。

isStable examples and caveats

isStable 示例和注意事项

Note two important points about `isStable`, demonstrated in the examples below:

请注意关于 `isStable` 两个要点，在下面的示例中进行了演示：

the application will never be stable if you start any kind
of recurrent asynchronous task when the application starts
\(for example for a polling process, started with a `setInterval`, a `setTimeout`
or using RxJS operators like `interval`\);

如果在应用程序启动时启动任何类型的循环异步任务，应用程序将永远不会稳定（例如，对于轮询过程，使用 `setInterval` 、 `setTimeout` 或使用 RxJS 操作符如 `interval` ）；

the `isStable` Observable runs outside of the Angular zone.

`isStable` Observable 在 Angular 区域之外运行。

Let's imagine that you start a recurrent task
\(here incrementing a counter, using RxJS `interval`\),
and at the same time subscribe to `isStable`.

假设你开始一个循环任务（这里使用 RxJS `interval` 递增一个计数器），同时订阅 `isStable`。

In this example, `isStable` will never emit `true`,
and the trace "App is stable now" will never get logged.

在此示例中，`isStable` 永远不会发出 `true`，并且永远不会记录“A​​pp 现在稳定”的跟踪。

If you want to execute something when the app is stable,
you have to wait for the application to be stable
before starting your polling process.

如果你想在应用程序稳定时执行某些操作，则必须等待应用程序稳定后再开始轮询过程。

In this example, the trace "App is stable now" will be logged
and then the counter starts incrementing every second.

在此示例中，将记录跟踪“应用程序现在稳定”，然后计数器开始每秒递增。

Note also that this Observable runs outside of the Angular zone,
which means that the code in the subscription
to this Observable will not trigger the change detection.

另请注意，此 Observable 在 Angular 区域之外运行，这意味着订阅此 Observable 中的代码不会触发变更检测。

Let's imagine that instead of logging the counter value,
you update a field of your component
and display it in its template.

假设你不记录计数器值，而是更新组件的一个字段并将其显示在其模板中。

As the `isStable` Observable runs outside the zone,
the `value` field will be updated properly,
but the template will not be refreshed!

由于 `isStable` Observable 在 zone 外运行，`value` 字段会正确更新，但模板不会刷新！

You'll have to manually trigger the change detection to update the template.

你必须手动触发变更检测才能更新模板。

Or make the subscription callback run inside the zone.

或者让订阅回调在区域内运行。

A reference to an Angular application running on a page.

对页面上运行的 Angular 应用程序的引用。

Get a list of component types registered to this application.
This list is populated even before the component is created.

获取注册到该应用程序的组件类型的列表。在创建组件之前，会填充此列表。

Get a list of components registered to this application.

获取已注册到该应用中的组件的列表。

Returns an Observable that indicates when the application is stable or unstable.

返回一个 Observable，指示应用程序何时变得稳定或不稳定。

The `EnvironmentInjector` used to create this application.

用于创建此应用程序的 `EnvironmentInjector`。

Bootstrap process

引导过程

When bootstrapping a component, Angular mounts it onto a target DOM element
and kicks off automatic change detection. The target DOM element can be
provided using the `rootSelectorOrNode` argument.

引导组件时，Angular 会将其挂载到目标 DOM 元素上并启动自动变更检测。可以用 `rootSelectorOrNode` 参数提供目标 DOM 元素。

If the target DOM element is not provided, Angular tries to find one on a page
using the `selector` of the component that is being bootstrapped
\(first matched element is used\).

（可选）可以将组件安装到与 componentType 的选择器不匹配的 DOM 元素上。

Example

范例

Generally, we define the component to bootstrap in the `bootstrap` array of `NgModule`,
but it requires us to know the component while writing the application code.

一般来说，我们在 `NgModule` 的 `bootstrap` 数组中定义要引导的组件，但它需要我们在编写应用程序代码时了解组件。

Imagine a situation where we have to wait for an API call to decide about the component to
bootstrap. We can use the `ngDoBootstrap` hook of the `NgModule` and call this method to
dynamically bootstrap a component.

想象这样一种情况，我们必须等待 API 调用来决定要引导的组件。我们可以用 `NgModule` 的 `ngDoBootstrap` 钩子并调用此方法来动态引导组件。

{&commat;example core/ts/platform/platform.ts region='componentSelector'}



Optionally, a component can be mounted onto a DOM element that does not match the
selector of the bootstrapped component.

可选地，可以将组件安装到与引导组件的选择器不匹配的 DOM 元素上。

In the following example, we are providing a CSS selector to match the target element.

在下面的示例中，我们提供了一个 CSS 选择器来匹配目标元素。

{&commat;example core/ts/platform/platform.ts region='cssSelector'}



While in this example, we are providing reference to a DOM node.

在此示例中，我们提供对 DOM 节点的引用。

{&commat;example core/ts/platform/platform.ts region='domNode'}



Bootstrap a component onto the element identified by its selector or, optionally, to a
specified element.

将组件引导到其选择器标识的元素上，或者（可选）引导到指定的元素。

Passing Component factories as the `Application.bootstrap` function argument is
    deprecated. Pass Component Types instead.

将组件工厂作为 `Application.bootstrap` 函数参数传递已弃用。改为传递组件类型。

Invoke this method to explicitly process change detection and its side-effects.

调用此方法可以显式处理变更检测及其副作用。

In development mode, `tick()` also performs a second change detection cycle to ensure that no
further changes are detected. If additional changes are picked up during this second cycle,
bindings in the app have side-effects that cannot be resolved in a single change detection
pass.
In this case, Angular throws an error, since an Angular application can only have one change
detection pass during which all change detection must complete.

在开发模式下，`tick()` 还会执行第二个变更检测周期，以确保没有检测到其他更改。如果在第二个周期内获取了其他更改，则应用程序中的绑定就会产生副作用，这些副作用无法通过一次变更检测过程解决。在这种情况下，Angular 就会引发错误，因为 Angular 应用程序只能进行一次变更检测遍历，在此过程中必须完成所有变更检测。

Attaches a view so that it will be dirty checked.
The view will be automatically detached when it is destroyed.
This will throw if the view is already attached to a ViewContainer.

附加视图，以便对其进行脏检查。视图销毁后将自动分离。如果视图已附加到 ViewContainer，则会抛出此错误。

Detaches a view from dirty checking again.

再次从脏检查中分离视图。

A callback function to add as a listener.

添加为侦听器的回调函数。

A function which unregisters a listener.

注销侦听器的函数。

Registers a listener to be called when an instance is destroyed.

注册一个侦听器，在实例被销毁时调用。

Destroys an Angular application represented by this `ApplicationRef`. Calling this function
will destroy the associated environment injectors as well as all the bootstrapped components
with their views.

销毁此 `ApplicationRef` 表示的 Angular 应用程序。调用此函数将破坏关联的环境注入器以及所有带有视图的引导组件。

Returns the number of attached views.

返回已附加视图的数量。

`InjectionToken` used to configure how to call the `ErrorHandler`.

`InjectionToken` 用于配置如何调用 `ErrorHandler`。

`NgZone` is provided by default today so the default \(and only\) implementation for this
is calling `ErrorHandler.handleError` outside of the Angular zone.

现在默认提供 `NgZone`，因此默认（也是唯一）实现是在 Angular 区域之外调用 `ErrorHandler.handleError`。

Internal token used to verify that `provideZoneChangeDetection` is not used
with the bootstrapModule API.

用于验证 `provideZoneChangeDetection` 未与 bootstrapModule API 一起使用的内部令牌。

Provides `NgZone`-based change detection for the application bootstrapped using
`bootstrapApplication`.

为使用 `bootstrapApplication` 引导的应用程序提供基于 `NgZone` 的变更检测。

`NgZone` is already provided in applications by default. This provider allows you to configure
options like `eventCoalescing` in the `NgZone`.
This provider is not available for `platformBrowser().bootstrapModule`, which uses
`BootstrapOptions` instead.

默认情况下，应用程序中已经提供了 `NgZone`。该提供程序允许你在 `NgZone` 中配置诸如 `eventCoalescing` 之类的选项。此提供程序不适用于 `platformBrowser().bootstrapModule`，它使用 `BootstrapOptions` 代替。