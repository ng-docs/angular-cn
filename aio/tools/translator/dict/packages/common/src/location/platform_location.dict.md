This class should not be used directly by an application developer. Instead, use
{&commat;link Location}.

此类不应由应用程序开发人员直接使用。而应使用 {&commat;link Location}。

`PlatformLocation` encapsulates all calls to DOM APIs, which allows the Router to be
platform-agnostic.
This means that we can have different implementation of `PlatformLocation` for the different
platforms that Angular supports. For example, `@angular/platform-browser` provides an
implementation specific to the browser environment, while `@angular/platform-server` provides
one suitable for use with server-side rendering.

`PlatformLocation` 封装了对 DOM API 的所有调用，这可以让路由器与平台无关。这意味着我们可以为
Angular 支持的不同平台提供 `PlatformLocation` 的不同实现。比如，`@angular/platform-browser`
提供了特定于浏览器环境的实现，而 `@angular/platform-server`
提供了适合与服务端渲染一起使用的实现。

The `PlatformLocation` class is used directly by all implementations of {&commat;link LocationStrategy}
when they need to interact with the DOM APIs like pushState, popState, etc.

{&commat;link LocationStrategy} 的所有实现在需要与 DOM API（比如 pushState，popState
等）进行交互时，都直接使用 `PlatformLocation`

{&commat;link LocationStrategy} in turn is used by the {&commat;link Location} service which is used directly
by the {&commat;link Router} in order to navigate between routes. Since all interactions between {&commat;link
Router} /
{&commat;link Location} / {&commat;link LocationStrategy} and DOM APIs flow through the `PlatformLocation`
class, they are all platform-agnostic.

{&commat;link LocationStrategy} 由 {&commat;link Router} 直接使用的 {&commat;link Location}
服务使用，以便在路由之间导航。由于 {&commat;link Router} / {&commat;link Location} / {&commat;link LocationStrategy}与
DOM API 之间的所有交互都是通过 `PlatformLocation` 类进行的，因此它们都是与平台无关的。

Returns a function that, when executed, removes the `popstate` event handler.

返回一个函数，该函数在执行时会删除 `popstate` 事件处理程序。

Returns a function that, when executed, removes the `hashchange` event handler.

返回一个函数，该函数在执行时会删除 `hashchange` 事件处理程序。

Indicates when a location is initialized.

指示何时初始化 location。

A serializable version of the event from `onPopState` or `onHashChange`

来自 `onPopState` 或 `onHashChange` 的事件的可序列化版本

`PlatformLocation` encapsulates all of the direct calls to platform APIs.
This class should not be used directly by an application developer. Instead, use
{&commat;link Location}.

`PlatformLocation` 封装了所有对平台 API 的直接调用。此类不应由应用程序开发人员直接使用。相反，请使用 {&commat;link Location}。