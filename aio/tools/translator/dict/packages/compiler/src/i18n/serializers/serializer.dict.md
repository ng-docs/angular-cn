A `PlaceholderMapper` converts placeholder names from internal to serialized representation and
back.

`PlaceholderMapper` 会将占位符名称从内部表示形式转换为序列化表示形式，然后返回。

It should be used for serialization format that put constraints on the placeholder names.

它应该用于对占位符名称施加限制的序列化格式。

A simple mapper that take a function to transform an internal name to a public name

一个简单的映射器，它带有一个将内部名称转换为公共名称的函数