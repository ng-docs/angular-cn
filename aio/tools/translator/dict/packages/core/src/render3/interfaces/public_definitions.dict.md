An object literal of this type is used to represent the metadata of a constructor dependency.
The type itself is never referred to from generated code.

这种类型的对象文字用于表示构造函数依赖项的元数据。永远不会从生成的代码中引用类型本身。

If an `@Attribute` decorator is used, this represents the injected attribute's name. If the
attribute name is a dynamic expression instead of a string literal, this will be the unknown
type.

如果使用了 `@Attribute`
装饰器，则这表示注入的属性的名称。如果属性名称是动态表达式而不是字符串文字，则这将是未知类型。

If `@Optional()` is used, this key is set to true.

如果使用 `@Optional()`，则此键设置为 true。

If `@Host` is used, this key is set to true.

如果使用 `@Host`，则此键设置为 true。

If `@Self` is used, this key is set to true.

如果使用 `@Self`，则此键设置为 true。

If `@SkipSelf` is used, this key is set to true.

如果使用 `@SkipSelf`，则此键设置为 true。