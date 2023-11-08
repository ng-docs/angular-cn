Set the font of the containing element to the result of an expression.

将容器元素的字体设置为表达式的结果。

Set the width of the containing element to a pixel value returned by an expression.

将容器元素的宽度设置为表达式返回的像素值。

Set a collection of style values using an expression that returns key-value pairs.

使用返回键值对的表达式来设置样式值的集合。

An attribute directive that updates styles for the containing HTML element.
Sets one or more style properties, specified as colon-separated key-value pairs.
The key is a style name, with an optional `.<unit>` suffix
\(such as 'top.px', 'font-style.em'\).
The value is an expression to be evaluated.
The resulting non-null value, expressed in the given unit,
is assigned to the given style property.
If the result of evaluation is null, the corresponding style is removed.

一个属性指令，用于更新容器元素的样式。可以通过指定用冒号分隔的键值对来设置一个或多个样式属性。其键是样式名称，带有可选的 `<unit>` 后缀（比如 'top.px'，'font-style.em'）；其值是待求值的表达式。如果求值结果不是 null，则把用指定单位表示的结果赋值给指定的样式属性；如果是 null，则删除相应的样式。