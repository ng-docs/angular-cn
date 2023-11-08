Sets a strict mode for JIT-compiled components to throw an error on unknown elements,
instead of just logging the error.
\(for AOT-compiled ones this check happens at build time\).

为 JIT 编译的组件设置严格模式以在未知元素上抛出错误，而不仅仅是记录错误。（对于 AOT 编译的，此检查发生在构建时）。

Gets the current value of the strict mode.

获取严格模式的当前值。

Sets a strict mode for JIT-compiled components to throw an error on unknown properties,
instead of just logging the error.
\(for AOT-compiled ones this check happens at build time\).

为 JIT 编译的组件设置严格模式以在未知属性上抛出错误，而不仅仅是记录错误。（对于 AOT 编译的，此检查发生在构建时）。

Element to validate

要验证的元素

An `LView` that represents a current component that is being rendered

代表正在渲染的当前组件的 `LView`

Name of the tag to check

要检查的标签名称

Array of schemas

模式数组

Boolean indicating that the element matches any directive

指示该元素匹配任何指令的布尔值

Validates that the element is known at runtime and produces
an error if it's not the case.
This check is relevant for JIT-compiled components \(for AOT-compiled
ones this check happens at build time\).

验证该元素在运行时是否已知，如果不是，则产生错误。此检查与 JIT 编译的组件相关（对于 AOT 编译的组件，此检查发生在构建时）。

The element is considered known if either:

如果满足以下任一条件，则该元素被认为是已知的：

it's a known HTML element

这是一个已知的 HTML 元素

it's a known custom element

这是一个已知的自定义元素

the element matches any directive

该元素匹配任何指令

the element is allowed by one of the schemas

该元素被其中一个模式所允许

Name of the property to check

要检查的属性的名称

Name of the tag hosting the property

托管属性的标签的名称

Validates that the property of the element is known at runtime and returns
false if it's not the case.
This check is relevant for JIT-compiled components \(for AOT-compiled
ones this check happens at build time\).

验证元素的属性在运行时是否已知，如果不是，则返回 false。此检查与 JIT 编译的组件相关（对于 AOT 编译的组件，此检查发生在构建时）。

The property is considered known if either:

如果满足以下任一条件，则该属性被视为已知：

it's a known property of the element

它是元素的已知属性

the property is used for animations

该属性用于动画

Name of the invalid property

无效属性的名称

Type of the node hosting the property

托管属性的节点类型

An `LView` that represents a current component

代表当前组件的 `LView`

Logs or throws an error that a property is not supported on an element.

记录或抛出元素不支持属性的错误。

An `LView` that represents a current component that is being rendered.

表示正在渲染的当前组件的 `LView`。

WARNING: this is a **dev-mode only** function \(thus should always be guarded by the `ngDevMode`\)
and must **not** be used in production bundles. The function makes megamorphic reads, which might
be too slow for production mode and also it relies on the constructor function being available.

警告：这是一个**仅限开发模式的**函数（因此应始终由 `ngDevMode` 保护）并且**不得**在生产包中使用。该函数进行超态读取，这对于生产模式来说可能太慢，而且它依赖于可用的构造函数。

Gets a reference to the host component def \(where a current component is declared\).

获取对宿主组件 def（声明当前组件的位置）的引用。

WARNING: this is a **dev-mode only** function \(thus should always be guarded by the `ngDevMode`\)
and must **not** be used in production bundles. The function makes megamorphic reads, which might
be too slow for production mode.

警告：这是一个**仅限开发模式的**函数（因此应始终由 `ngDevMode` 保护）并且**不得**在生产包中使用。该函数进行巨态读取，这对于生产模式来说可能太慢了。

Checks if the current component is declared inside of a standalone component template.

检查当前组件是否在独立组件模板内声明。

Constructs a string describing the location of the host component template. The function is used
in dev mode to produce error messages.

构造一个描述宿主组件模板位置的字符串。该函数在开发模式下用于生成错误消息。

The set of known control flow directives and their corresponding imports.
We use this set to produce a more precises error message with a note
that the `CommonModule` should also be included.

一组已知的控制流指令及其相应的导入。我们使用此集合来生成更精确的错误消息，并附注还应包括 `CommonModule`。

Name of the tag

标签名称

Returns true if the tag name is allowed by specified schemas.

如果指定模式允许标记名称，则返回 true。