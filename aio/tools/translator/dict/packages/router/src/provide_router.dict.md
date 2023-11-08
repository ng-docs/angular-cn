Basic example of how you can add a Router to your application:

如何将路由器添加到应用程序的基本示例：

You can also enable optional features in the Router by adding functions from the `RouterFeatures`
type:

你还可以通过添加 `RouterFeatures` 类型的函数来在路由器中启用可选特性：

A set of `Route`s to use for the application routing table.

用于应用程序路由表的一组 `Route`。

Optional features to configure additional router behaviors.

配置其他路由器行为的可选特性。

A set of providers to setup a Router.

一组用于设置路由器的提供程序。

Sets up providers necessary to enable `Router` functionality for the application.
Allows to configure a set of routes as well as extra features that should be enabled.

设置为应用程序启用 `Router` 特性所需的提供程序。允许配置一组路由以及应该启用的额外特性。

Helper type to represent a Router feature.

表示路由器特性的帮助器类型。

Helper function to create an object that represents a Router feature.

用于创建表示路由器功能的对象的辅助函数。

An Injection token used to indicate whether `provideRouter` or `RouterModule.forRoot` was ever
called.

用于指示是否调用过 `provideRouter` 或 `RouterModule.forRoot` 注入令牌。

The route configuration to provide.

注册路由。

If necessary, provide routes using the `ROUTES` `InjectionToken`.

如有必要，使用 `ROUTES` `InjectionToken` 提供路由。

Registers a [DI provider](guide/glossary#provider) for a set of routes.

为一组路由注册[DI 提供程序](guide/glossary#provider)。

A type alias for providers returned by `withInMemoryScrolling` for use with `provideRouter`.

`provideRouter` `withInMemoryScrolling` 使用。

Basic example of how you can enable scrolling feature:

如何启用滚动特性的基本示例：

Set of configuration parameters to customize scrolling behavior, see
    `InMemoryScrollingOptions` for additional information.

可选值。默认值为 `{}`。

A set of providers for use with `provideRouter`.

一组与 `provideRouter` 一起使用的提供程序。

Enables customizable scrolling behavior for router navigations.

为路由器导航启用可自定义的滚动行为。

A subject used to indicate that the bootstrapping phase is done. When initial navigation is
`enabledBlocking`, the first navigation waits until bootstrapping is finished before continuing
to the activation phase.

用于指示引导阶段已完成的主题。当初始导航为 `enabledBlocking` 时，第一个导航会等待引导完成，然后再继续激活阶段。

This and the INITIAL_NAVIGATION token are used internally only. The public API side of this is
configured through the `ExtraOptions`.

这和 INITIAL_NAVIGATION 令牌仅在内部使用。公共 API 端是通过 `ExtraOptions` 配置的。

When set to `EnabledBlocking`, the initial navigation starts before the root
component is created. The bootstrap is blocked until the initial navigation is complete. This
value is required for [server-side rendering](guide/universal) to work.

当设置为 `EnabledBlocking` 时，初始导航在创建根组件之前开始。引导程序被阻止，直到初始导航完成。[服务端渲染](guide/universal)需要此值才能工作。

When set to `EnabledNonBlocking`, the initial navigation starts after the root component has been
created. The bootstrap is not blocked on the completion of the initial navigation.

当设置为 `EnabledNonBlocking` 时，初始导航在根组件创建后开始。初始导航完成后，引导程序不会被阻止。

When set to `Disabled`, the initial navigation is not performed. The location listener is set up
before the root component gets created. Use if there is a reason to have more control over when
the router starts its initial navigation due to some complex initialization logic.

设置为 `Disabled` 时，不执行初始导航。位置侦听器是在创建根组件之前设置的。如果由于某些复杂的初始化逻辑而有理由对路由器何时开始其初始导航进行更多控制，请使用。

A type alias for providers returned by `withEnabledBlockingInitialNavigation` for use with
`provideRouter`.

`provideRouter` `withEnabledBlockingInitialNavigation` 使用。

A type alias for providers returned by `withEnabledBlockingInitialNavigation` or
`withDisabledInitialNavigation` functions for use with `provideRouter`.

由 `withEnabledBlockingInitialNavigation` 或 `withDisabledInitialNavigation` 函数返回的提供程序的类型别名，与 `provideRouter` 一起使用。

Basic example of how you can enable this navigation behavior:

如何启用此导航行为的基本示例：

Configures initial navigation to start before the root component is created.

将初始导航配置为在创建根组件之前启动。

The bootstrap is blocked until the initial navigation is complete. This value is required for
[server-side rendering](guide/universal) to work.

在初始导航完成之前，引导程序被阻止。[服务端渲染](guide/universal)需要此值。

A type alias for providers returned by `withDisabledInitialNavigation` for use with
`provideRouter`.

`provideRouter` `withDisabledInitialNavigation` 使用。

Basic example of how you can disable initial navigation:

如何禁用初始导航的基本示例：

Disables initial navigation.

禁用初始导航。

Use if there is a reason to have more control over when the router starts its initial navigation
due to some complex initialization logic.

如果由于某些复杂的初始化逻辑而有理由对路由器何时开始其初始导航有更多控制权，可以使用。

A type alias for providers returned by `withDebugTracing` for use with `provideRouter`.

`withDebugTracing` 返回的提供程序的类型别名，与 `provideRouter` 一起使用。

Basic example of how you can enable debug tracing:

如何启用调试跟踪的基本示例：

Enables logging of all internal navigation events to the console.
Extra logging might be useful for debugging purposes to inspect Router event sequence.

启用将所有内部导航事件记录到控制台。额外的日志可能可用于调试以检查路由器事件顺序。

A type alias that represents a feature which enables preloading in Router.
The type is used to describe the return value of the `withPreloading` function.

一种类型别名，表示在 Router 中启用预加载的特性。该类型用于描述 `withPreloading` 函数的返回值。

Basic example of how you can configure preloading:

如何配置预加载的基本示例：

A reference to a class that implements a `PreloadingStrategy` that
    should be used.

对实现应该使用的 `PreloadingStrategy` 的类的引用。

Allows to configure a preloading strategy to use. The strategy is configured by providing a
reference to a class that implements a `PreloadingStrategy`.

允许配置要使用的预加载策略。该策略是通过提供对实现 `PreloadingStrategy` 的类的引用来配置的。

A type alias for providers returned by `withRouterConfig` for use with `provideRouter`.

`withRouterConfig` 返回的提供程序的类型别名，与 `provideRouter` 一起使用。

Basic example of how you can provide extra configuration options:

如何提供额外配置选项的基本示例：

A set of parameters to configure Router, see `RouterConfigOptions` for
    additional information.

用于配置路由器的一组参数，有关其他信息，请参阅 `RouterConfigOptions`。

Allows to provide extra parameters to configure Router.

允许提供额外的参数来配置路由器。

A type alias for providers returned by `withHashLocation` for use with `provideRouter`.

`withHashLocation` 返回的提供者的类型别名，用于 `provideRouter`。

Basic example of how you can use the hash location option:

如何使用散列位置选项的基本示例：

Provides the location strategy that uses the URL fragment instead of the history API.

提供使用 URL 片段而不是 history API 的定位策略。

A type alias for providers returned by `withNavigationErrorHandler` for use with `provideRouter`.

`withNavigationErrorHandler` 返回的提供者的类型别名，用于 `provideRouter`。

Basic example of how you can use the error handler option:

如何使用错误处理程序选项的基本示例：

Subscribes to the Router's navigation events and calls the given function when a
`NavigationError` happens.

订阅路由器的导航事件并在发生 `NavigationError` 时调用给定的函数。

This function is run inside application's injection context so you can use the `inject` function.

此函数在应用程序的注入上下文中运行，因此你可以使用 `inject` 函数。

A type alias for providers returned by `withComponentInputBinding` for use with `provideRouter`.

`withComponentInputBinding` 返回的提供者的类型别名，用于 `provideRouter`。

Basic example of how you can enable the feature:

如何启用该功能的基本示例：

Enables binding information from the `Router` state directly to the inputs of the component in
`Route` configurations.

启用从 `Router` 状态直接绑定到 `Route` 配置中组件输入的信息。

A type alias that represents all Router features available for use with `provideRouter`.
Features can be enabled by adding special functions to the `provideRouter` call.
See documentation for each symbol to find corresponding function name. See also `provideRouter`
documentation on how to use those functions.

一个类型别名，表示可与 `provideRouter` 一起使用的所有路由器特性。可以通过向 `provideRouter` 调用添加特殊函数来启用特性。请参阅每个符号的文档以查找对应的函数名称。有关如何使用这些函数，另请参阅 `provideRouter` 文档。

The list of features as an enum to uniquely type each feature.

作为枚举的功能列表，用于唯一键入每个功能。