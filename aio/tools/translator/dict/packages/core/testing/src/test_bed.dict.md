Static methods implemented by the `TestBed`.

`TestBed` 实现的静态方法。

Initialize the environment for testing with a compiler factory, a PlatformRef, and an
angular module. These are common to every test in the suite.

使用编译器工厂、PlatformRef 和 Angular 模块初始化用于测试的环境。这些在套件中的每个测试中都是通用的。

This may only be called once, to set up the common providers for the current test
suite on the current platform. If you absolutely need to change the providers,
first use `resetTestEnvironment`.

这可能只会调用一次，以在当前平台上为当前测试套件设置通用提供者。如果你绝对需要更改提供者，请首先使用 `resetTestEnvironment`。

Test modules and platforms for individual platforms are available from
'&commat;angular/&lt;platform_name>/testing'.

单个平台的测试模块和平台可从 '&commat;angular/&lt;platform_name>/testing' 获得。

Reset the providers for the test injector.

重置测试注入器的提供者。

use object-based flags \(`InjectOptions`\) instead.

改用基于对象的标志 \( `InjectOptions` \)。

from v9.0.0 use TestBed.inject

从 v9.0.0 使用 TestBed.inject

EnvironmentInjector#runInContext

环境注入器#runInContext

Runs the given function in the `EnvironmentInjector` context of `TestBed`.

在 `TestBed` 的 `EnvironmentInjector` 上下文中运行给定函数。

Overwrites all providers for the given token with the given provider definition.

使用给定的提供程序定义覆盖给定标记的所有提供程序。

Returns a singleton of the `TestBed` class.

返回 `TestBed` 类的单例。

Configures and initializes environment for unit testing and provides methods for
creating components and services in unit tests.

配置和初始化用于单元测试的环境，并提供用于在单元测试中创建组件和服务的方法。

TestBed is the primary api for writing unit tests for Angular applications and libraries.

TestBed 是为 Angular 应用程序和库编写单元测试的主要 api。

Allows overriding default providers, directives, pipes, modules of the test injector,
which are defined in test_injector.js

允许覆盖测试注入器的默认提供程序、指令、管道、模块，它们在 test_injector.js 中定义

Compile components with a `templateUrl` for the test's NgModule.
It is necessary to call this function
as fetching urls is asynchronous.

使用 `templateUrl` Url 为测试的 NgModule 编译组件。有必要调用此函数，因为获取 url 是异步的。

Overrides the template of the given component, compiling the template
in the context of the TestingModule.

覆盖给定组件的模板，在 TestingModule 的上下文中编译模板。

Note: This works for JIT and AOTed components as well.

注意：这也适用于 JIT 和 AOTed 组件。

Internal-only flag to indicate whether a module
scoping queue has been checked and flushed already.

仅供内部使用的标志，以表明模块作用域队列是否已被检查并刷新。

`TestBed` is the primary api for writing unit tests for Angular applications and libraries.

`TestBed` 是为 Angular 应用程序和库编写单元测试的主要 api。

Allows injecting dependencies in `beforeEach()` and `it()`. Note: this function
\(imported from the `@angular/core/testing` package\) can **only** be used to inject dependencies
in tests. To inject dependencies in your application code, use the [`inject`](api/core/inject)
function from the `@angular/core` package instead.

允许在 `beforeEach()` 和 `it()` 中注入依赖项。

Example:

比如：