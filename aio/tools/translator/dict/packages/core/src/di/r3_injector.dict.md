Marker which indicates that a value has not yet been created from the factory function.

表明尚未从工厂函数创建值的标记。

Marker which indicates that the factory function for a token is in the process of being called.

指示标记的工厂函数正在被调用的过程中的标记。

If the injector is asked to inject a token with its value set to CIRCULAR, that indicates
injection of a dependency has recursively attempted to inject the original token, and there is
a circular dependency among the providers.

如果要求注入器注入值设置为 CIRCULAR
的标记，则表明依赖注入已递归尝试注入原始标记，并且提供者之间存在循环依赖。

A lazily initialized NullInjector.

延迟初始化的 NullInjector。

An entry in the injector which tracks information about the given token, including a possible
current value.

注入器中的条目，用于跟踪有关给定标记的信息，包括可能的当前值。

An `Injector` that's part of the environment injector hierarchy, which exists outside of the
component tree.

创建一个新的 `Injector`，它是使用 `InjectorType<any>` 的 `defType` 配置的。

The instance from the injector if defined, otherwise the `notFoundValue`.

注入器中的实例（如果已定义），否则为 `notFoundValue`。

When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.

当 `notFoundValue` 为 `undefined` 或 `Injector.THROW_IF_NOT_FOUND` 时。

Retrieves an instance from the injector based on the provided token.

根据提供的标记从注入器中检索实例。

use object-based flags \(`InjectOptions`\) instead.

改用基于对象的标志（`InjectOptions`）。

from v4.0.0 use ProviderToken<T>

从 v4.0.0 使用 ProviderToken<T>

the closure to be run in the context of this injector

要在此注入器的上下文中运行的闭包

the return value of the function, if any

函数的返回值，如果有的话

use the standalone function `runInInjectionContext` instead

改为使用独立函数 `runInInjectionContext`

Runs the given function in the context of this `EnvironmentInjector`.

在此 `EnvironmentInjector` 的上下文中运行给定的函数。

Within the function's stack frame, `inject` can be used to inject dependencies from this
injector. Note that `inject` is only usable synchronously, and cannot be used in any
asynchronous callbacks or after any `await` points.

在函数的堆栈框架中，`inject` 可用于从此注入器注入依赖项。请注意，`inject` 仅可同步使用，不能在任何异步回调或任何 `await` 点之后使用。

Flag indicating that this injector was previously destroyed.

表明此注入器以前被破坏的标志。

Destroy the injector and release references to every instance or provider associated with it.

销毁注入器并释放对与其关联的每个实例或提供者的引用。

Also calls the `OnDestroy` lifecycle hooks of every instance that was created for which a
hook was found.

还会调用为其创建的每个实例的 `OnDestroy` 生命周期钩子。

provider to convert to factory

要转换为工厂的提供者

Converts a `SingleProvider` into a factory function.

将 `SingleProvider` 转换为工厂函数。