A value resulting from static resolution.

由静态解析产生的值。

This could be a primitive, collection type, reference to a `ts.Node` that declares a
non-primitive value, or a special `DynamicValue` type which indicates the value was not
available statically.

这可以是基元、集合类型、对声明非原始值的 `ts.Node` 的引用，或者是表明该值不是静态可用的特殊
`DynamicValue` 类型。

An array of `ResolvedValue`s.

`ResolvedValue` 的数组。

This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueArray`
\-> `ResolvedValue`.

这是一个具体化类型，允许循环引用 `ResolvedValue` -> `ResolvedValueArray` -> `ResolvedValue`。

A map of strings to `ResolvedValue`s.

字符串到 `ResolvedValue` 的映射。

This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueMap`
\-> `ResolvedValue`.

这是一个具体化类型，允许 `ResolvedValue` -> `ResolvedValueMap` -> `ResolvedValue` 的循环引用。

A collection of publicly exported declarations from a module. Each declaration is evaluated
lazily upon request.

模块中公开导出的声明的集合。每个声明都会根据请求延迟估算。

A value member of an enumeration.

枚举的值成员。

Contains a `Reference` to the enumeration itself, and the name of the referenced member.

包含对枚举本身的 `Reference` 以及被引用成员的名称。

An implementation of a known function that can be statically evaluated.
It could be a built-in function or method \(such as `Array.prototype.slice`\) or a TypeScript
helper \(such as `__spread`\).

可以静态估算的已知函数的实现。它可以是内置函数或方法（例如 `Array.prototype.slice`）或
TypeScript 帮助器（例如 `__spread`）。