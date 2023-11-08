Represents only those types in `T` that are object types.

仅表示 `T` 中作为对象类型的那些类型。

Represents the value type of an object literal.

表示对象文字的值类型。

Represents the value type of an array literal.

表示数组文字的值类型。

Ensures that `This` has its generic type `Actual` conform to the expected generic type in
`Expected`, to disallow calling a method if the generic type does not conform.

确保 `This` 的泛型类型 `Actual` 符合 `Expected`
中的预期泛型类型，以在泛型类型不符合的情况下禁止调用方法。

Represents only the string keys of type `T`.

仅表示 `T` 类型的字符串键。

This helper class wraps an object expression along with an `AstHost` object, exposing helper
methods that make it easier to extract the properties of the object.

此帮助器类将对象表达式与 `AstHost` 对象包装在一起，公开了可以更轻松地提取对象属性的帮助器方法。

The generic `T` is used as reference type of the expected structure that is represented by this
object. It does not achieve full type-safety for the provided operations in correspondence with
`T`; its main goal is to provide references to a documented type and ensure that the properties
that are read from the object are present.

泛型 `T` 用作此对象表示的预期结构的引用类型。它没有为与 `T`
对应的提供的操作实现完全类型安全；其主要目标是提供对文档化类型的引用，并确保存在从对象读取的属性。

Unfortunately, the generic types are unable to prevent reading an optional property from the
object without first having called `has` to ensure that the property exists. This is one example
of where full type-safety is not achieved.

不幸的是，泛型类型无法在不首先调用 `has`
以确保属性存在的情况下防止从对象读取可选属性。这是未实现完全类型安全的一个例子。

Create a new `AstObject` from the given `expression` and `host`.

从给定的 `expression` 和 `host` 创建一个新的 `AstObject`。

Returns true if the object has a property called `propertyName`.

如果对象有一个名为 `propertyName` 的属性，则返回 true。

Returns the number value of the property called `propertyName`.

返回名为 `propertyName` 的属性的数字值。

Throws an error if there is no such property or the property is not a number.

如果不存在这样的属性或该属性不是数字，则会抛出错误。

Returns the string value of the property called `propertyName`.

返回名为 `propertyName` 的属性的字符串值。

Throws an error if there is no such property or the property is not a string.

如果不存在这样的属性或者该属性不是字符串，则抛出错误。

Returns the boolean value of the property called `propertyName`.

返回名为 `propertyName` 的属性的布尔值。

Throws an error if there is no such property or the property is not a boolean.

如果不存在这样的属性或者该属性不是布尔值，则抛出错误。

Returns the nested `AstObject` parsed from the property called `propertyName`.

返回从名为 `propertyName` 的属性解析的嵌套 `AstObject`。

Throws an error if there is no such property or the property is not an object.

如果不存在这样的属性或该属性不是对象，则抛出错误。

Returns an array of `AstValue` objects parsed from the property called `propertyName`.

返回从名为 `propertyName` 的属性解析的 `AstValue` 对象的数组。

Throws an error if there is no such property or the property is not an array.

如果不存在这样的属性或该属性不是数组，则抛出错误。

Returns a `WrappedNodeExpr` object that wraps the expression at the property called
`propertyName`.

返回一个 `WrappedNodeExpr` 对象，该对象在名为 `propertyName` 的属性处包装表达式。

Throws an error if there is no such property.

如果没有这样的属性，则抛出错误。

Returns the raw `TExpression` value of the property called `propertyName`.

返回名为 `propertyName` 的属性的原始 `TExpression` 值。

Returns an `AstValue` that wraps the value of the property called `propertyName`.

返回一个 `AstValue`，它包含名为 `propertyName` 的属性的值。

Converts the AstObject to a raw JavaScript object, mapping each property value \(as an
`AstValue`\) to the generic type \(`T`\) via the `mapper` function.

将 AstObject 转换为原始 JavaScript 对象，通过 `mapper` 函数将每个属性值（作为 `AstValue`
）映射到泛型类型 （ `T` ）。

Converts the AstObject to a JavaScript Map, mapping each property value \(as an
`AstValue`\) to the generic type \(`T`\) via the `mapper` function.

将 AstObject 转换为 JavaScript Map，通过 `mapper` 函数将每个属性值（作为 `AstValue`
）映射到泛型类型 （ `T` ）。

This helper class wraps an `expression`, exposing methods that use the `host` to give
access to the underlying value of the wrapped expression.

此帮助器类包装了一个 `expression`，公开了使用 `host` 来提供对包装表达式的基础值的访问的方法。

The generic `T` is used as reference type of the expected type that is represented by this value.
It does not achieve full type-safety for the provided operations in correspondence with `T`; its
main goal is to provide references to a documented type.

泛型 `T` 用作此值表示的预期类型的引用类型。它没有为与 `T`
对应的提供的操作实现完全类型安全；其主要目标是提供对文档类型的引用。

Get the name of the symbol represented by the given expression node, or `null` if it is not a
symbol.

获取给定表达式节点表示的符号的名称，如果不是符号，则为 `null`。

Is this value a number?

这个值是数字吗？

Parse the number from this value, or error if it is not a number.

从此值解析数字，如果不是数字，则错误。

Is this value a string?

这个值是字符串吗？

Parse the string from this value, or error if it is not a string.

从此值解析字符串，如果不是字符串，则解析错误。

Is this value a boolean?

这个值是布尔值吗？

Parse the boolean from this value, or error if it is not a boolean.

从此值解析布尔值，如果不是布尔值，则解析错误。

Is this value an object literal?

此值是对象文字吗？

Parse this value into an `AstObject`, or error if it is not an object literal.

将此值解析为 `AstObject`，如果它不是对象文字，则解析为错误。

Is this value an array literal?

此值是数组文字吗？

Parse this value into an array of `AstValue` objects, or error if it is not an array literal.

将此值解析为 `AstValue` 对象数组，如果它不是数组文字，则解析为错误。

Is this value a function expression?

此值是函数表达式吗？

Extract the return value as an `AstValue` from this value as a function expression, or error if
it is not a function expression.

从此值中将返回值作为 `AstValue` 提取为函数表达式，如果不是函数表达式，则将其提取为错误。

Return the `TExpression` of this value wrapped in a `WrappedNodeExpr`.

返回包装在 `TExpression` 中的此值的 `WrappedNodeExpr`。

Get the range of the location of this value in the original source.

获取此值在原始源中的位置范围。