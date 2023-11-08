The following example illustrates how to configure a multi-provider using `APP_INITIALIZER` token
and a function returning a promise.

以下示例展示了如何使用 `APP_INITIALIZER` 令牌和返回 Promise 的函数配置多提供者。

It's also possible to configure a multi-provider using `APP_INITIALIZER` token and a function
returning an observable, see an example below. Note: the `HttpClient` in this example is used for
demo purposes to illustrate how the factory function can work with other providers available
through DI.

也可以用 `APP_INITIALIZER` 令牌和返回 observable
的函数来配置多提供者，请参阅下面的示例。注：此示例中的 `HttpClient`
用于演示目的，以说明工厂函数如何与通过 DI 获得的其他提供程序一起使用。

A [DI token](guide/glossary#di-token "DI token definition") that you can use to provide
one or more initialization functions.

可用于提供一个或多个初始化功能的 [DI 令牌](guide/glossary#di-token "DI 令牌定义")。

The provided functions are injected at application startup and executed during
app initialization. If any of these functions returns a Promise or an Observable, initialization
does not complete until the Promise is resolved or the Observable is completed.

所提供的函数是在应用程序启动时注入的，并在应用程序初始化期间执行。如果这些函数中的任何一个返回
Promise，则直到 Promise 被解析之前，初始化都不会完成。

You can, for example, create a factory function that loads language data
or an external configuration, and provide that function to the `APP_INITIALIZER` token.
The function is executed during the application bootstrap process,
and the needed data is available on startup.

比如，你可以创建一个工厂函数来加载语言数据或外部配置，并将该函数提供给 `APP_INITIALIZER`
令牌。该功能在应用程序引导过程中执行，并且所需的数据在启动时可用。

A class that reflects the state of running {&commat;link APP_INITIALIZER} functions.

反映正在运行的 {&commat;link APP_INITIALIZER} 函数状态的类。