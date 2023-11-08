A type reference resolver function is responsible for translating a type reference from the
origin source file into a type reference that is valid in the desired source file. If the type
cannot be translated to the desired source file, then null can be returned.

类型引用解析器函数负责将类型引用从源源文件转换为在所需源文件中有效的类型引用。如果类型无法转换为所需的源文件，则可以返回
null。

A marker to indicate that a type reference is ineligible for emitting. This needs to be truthy
as it's returned from `ts.forEachChild`, which only returns truthy values.

用于表明类型引用不符合发出条件的标记。这需要是真实的，因为它是从 `ts.forEachChild`
返回的，它只返回真实值。

Determines whether the provided type can be emitted, which means that it can be safely emitted
into a different location.

确定提供的类型是否可以发出，这意味着它可以安全地发出到不同的位置。

If this function returns true, a `TypeEmitter` should be able to succeed. Vice versa, if this
function returns false, then using the `TypeEmitter` should not be attempted as it is known to
fail.

如果此函数返回 true，`TypeEmitter` 应该能够成功。反之亦然，如果此函数返回 false，则不应尝试使用
`TypeEmitter`，因为已知它会失败。

Given a `ts.TypeNode`, this class derives an equivalent `ts.TypeNode` that has been emitted into
a different context.

给定一个 `ts.TypeNode`，此类会派生一个等效的 `ts.TypeNode`，它已被发出到不同的上下文中。

For example, consider the following code:

例如，考虑以下代码：

Here, the generic type parameters `T` and `U` can be emitted into a different context, as the
type reference to `NgIterable` originates from an absolute module import so that it can be
emitted anywhere, using that same module import. The process of emitting translates the
`NgIterable` type reference to a type reference that is valid in the context in which it is
emitted, for example:

在这里，泛型类型参数 `T` 和 `U` 可以发出到不同的上下文中，因为对 `NgIterable`
的类型引用来自绝对模块导入，因此它可以在任何地方使用同一个模块导入发出。发出的过程 `NgIterable`
类型引用转换为在它发出的上下文中有效的类型引用，例如：

Notice how the type reference for `NgIterable` has been translated into a qualified name,
referring to the namespace import that was created.

请注意 `NgIterable` 的类型引用已被转换为限定名，引用创建的命名空间导入。