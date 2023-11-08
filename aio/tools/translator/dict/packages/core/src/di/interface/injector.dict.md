Special flag indicating that a decorator is of type `Inject`. It's used to make `Inject`
decorator tree-shakable \(so we don't have to rely on the `instanceof` checks\).
Note: this flag is not included into the `InjectFlags` since it's an internal-only API.

表明装饰器是 `Inject` 类型的特殊标志。它用于使 `Inject` 装饰器可树形抖动（因此我们不必依赖
`instanceof` 检查）。注意：此标志不包含在 `InjectFlags`，因为它是一个仅限内部的 API。

use an options object for `inject` instead.

改用选项对象进行 `inject`。

Injection flags for DI.

DI 的注入标志。

Check self and check parent injector if needed

检查自我并在需要时检查父注入器

Specifies that an injector should retrieve a dependency from any injector until reaching the
host element of the current component. \(Only used with Element Injector\)

指定注入器应该从任何注入器检索依赖项，直到到达当前组件的宿主元素。（仅与 Element Injector
一起使用）

Don't ascend to ancestors of the node requesting injection.

不要上升到请求注入的节点的祖先。

Skip the node that is requesting injection.

跳过正在请求注入的节点。

Inject `defaultValue` instead if token not found.

如果找不到标记，则注入 `defaultValue`。

This enum is an exact copy of the `InjectFlags` enum above, but the difference is that this is a
const enum, so actual enum values would be inlined in generated code. The `InjectFlags` enum can
be turned into a const enum when ViewEngine is removed \(see TODO at the `InjectFlags` enum
above\). The benefit of inlining is that we can use these flags at the top level without affecting
tree-shaking \(see "no-toplevel-property-access" tslint rule for more info\).
Keep this enum in sync with `InjectFlags` enum above.

此枚举是上面的 `InjectFlags` 枚举的精确副本，但区别在于这是一个 const
枚举，因此实际的枚举值将在生成的代码中内联。删除 ViewEngine 时，`InjectFlags` 枚举可以变成 const
枚举（请参阅上面的 `InjectFlags` 枚举中的 TODO）。内联的好处是我们可以在顶层使用这些标志而不影响
tree-shaking（有关更多信息，请参阅“no-toplevel-property-access” tslint 规则）。保持此枚举与上面的
`InjectFlags` 枚举同步。

This token is being injected into a pipe.

此标记正在被注入管道。

This flag is intentionally not in the public facing `InjectFlags` because it is only added by
the compiler and is not a developer applicable flag.

此标志故意不在面向公众的 `InjectFlags` 中，因为它只是由编译器添加，并且不是开发人员适用的标志。

Type of the options argument to `inject`.

要 `inject` 选项参数的类型。

Use optional injection, and return `null` if the requested token is not found.

使用可选注入，如果未找到请求的令牌，则返回 `null`。

Start injection at the parent of the current injector.

在当前注入器的父级开始注入。

Only query the current injector for the token, and don't fall back to the parent injector if
it's not found.

只查询当前注入器的令牌，如果找不到则不要回退到父注入器。

Stop injection at the host component's injector. Only relevant when injecting from an element
injector, and a no-op for environment injectors.

在宿主组件的注入器处停止注入。仅在从元素注入器注入时相关，并且对环境注入器无操作。