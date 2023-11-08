The name of the property to update

要更新的属性名称

Static value used for concatenation only.

仅用于连接的静态值。

Value checked for change.

检查更改的值。

An optional sanitizer function

可选的消毒器功能

itself, so that it may be chained.

本身，以便它可以被链接起来。

Update an interpolated property on an element with a lone bound value

使用唯一绑定值更新元素上的插值属性

Used when the value passed to a property has 1 interpolated value in it, an no additional text
surrounds that interpolated value:

当传递给属性的值中有 1 个内插值时使用，并且该内插值周围没有额外的文本：

Its compiled representation is::

其编译后的表示是::

If the property name also exists as an input property on one of the element's directives,
the component property will be set instead of the element property. This check must
be conducted at runtime so child components that add new `@Inputs` don't have to be re-compiled.

如果属性名称也作为元素指令之一的输入属性存在，则将设置 component 属性而不是 element
属性。此检查必须在运行时进行，因此添加新 `@Inputs` 的子组件不必重新编译。

Update an interpolated property on an element with single bound value surrounded by text.

使用被文本包围的单个绑定值更新元素上的插值属性。

Used when the value passed to a property has 1 interpolated value in it:

当传递给属性的值中有 1 个插值时使用：

Update an interpolated property on an element with 2 bound values surrounded by text.

使用被文本包围的 2 个绑定值更新元素上的插值属性。

Used when the value passed to a property has 2 interpolated values in it:

当传递给属性的值中有 2 个插值时使用：

Update an interpolated property on an element with 3 bound values surrounded by text.

使用 3 个被文本包围的绑定值更新元素上的插值属性。

Used when the value passed to a property has 3 interpolated values in it:

当传递给属性的值中有 3 个插值时使用：

Update an interpolated property on an element with 4 bound values surrounded by text.

使用 4 个被文本包围的绑定值更新元素上的插值属性。

Used when the value passed to a property has 4 interpolated values in it:

当传递给属性的值中有 4 个插值时使用：

Update an interpolated property on an element with 5 bound values surrounded by text.

使用 5 个被文本包围的绑定值更新元素上的插值属性。

Used when the value passed to a property has 5 interpolated values in it:

当传递给属性的值中有 5 个插值时使用：

Update an interpolated property on an element with 6 bound values surrounded by text.

使用 6 个被文本包围的绑定值更新元素上的插值属性。

Used when the value passed to a property has 6 interpolated values in it:

当传递给属性的值中有 6 个插值时使用：

Update an interpolated property on an element with 7 bound values surrounded by text.

使用 7 个被文本包围的绑定值更新元素上的插值属性。

Used when the value passed to a property has 7 interpolated values in it:

当传递给属性的值中有 7 个插值时使用：

Update an interpolated property on an element with 8 bound values surrounded by text.

使用 8 个被文本包围的绑定值更新元素上的插值属性。

Used when the value passed to a property has 8 interpolated values in it:

当传递给属性的值中有 8 个插值时使用：

The name of the property to update.

要更新的属性的名称。

The collection of values and the strings in between those values, beginning with a
string prefix and ending with a string suffix.
\(e.g. `['prefix', value0, '-', value1, '-', value2, ..., value99, 'suffix']`\)

值和这些值之间的字符串的集合，以字符串前缀开头并以字符串后缀结尾。（例如 `['prefix', value0,
'-', value1, '-', value2, ..., value99, 'suffix']`）

Update an interpolated property on an element with 9 or more bound values surrounded by text.

使用 9 个或更多被文本包围的绑定值更新元素上的插值属性。

Used when the number of interpolated values exceeds 8.

当内插值的数量超过 8 时使用。