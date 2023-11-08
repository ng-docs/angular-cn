Name of property. Because it is going to DOM, this is not subject to
       renaming as part of minification.

属性的名称。因为它将转到 DOM，因此不会作为缩小的一部分重命名。

New value to write.

要写入的新值。

An optional function used to sanitize the value.

用于清理值的可选函数。

This function returns itself so that it may be chained
\(e.g. `property('name', ctx.name)('title', ctx.title)`\)

此函数返回自身，以便它可以被链接（例如 `property('name', ctx.name)('title', ctx.title)`）

Update a property on a selected element.

更新所选元素的属性。

Operates on the element selected by index via the {&commat;link select} instruction.

通过 {&commat;link select} 指令对按索引选择的元素进行操作。

If the property name also exists as an input property on one of the element's directives,
the component property will be set instead of the element property. This check must
be conducted at runtime so child components that add new `@Inputs` don't have to be re-compiled

如果属性名称也作为元素指令之一的输入属性存在，则将设置 component 属性而不是 element
属性。此检查必须在运行时进行，因此添加新 `@Inputs` 的子组件不必重新编译

Given `<div style="..." my-dir>` and `MyDir` with `@Input('style')` we need to write to
directive input.

给定 `<div style="..." my-dir>` 和带有 `MyDir` `@Input('style')` MyDir，我们需要写入指令输入。