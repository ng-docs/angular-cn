Inserts an embedded view from a prepared `TemplateRef`.

根据一个提前备好的 `TemplateRef` 插入一个内嵌视图。

You can attach a context object to the `EmbeddedViewRef` by setting `[ngTemplateOutletContext]`.
`[ngTemplateOutletContext]` should be an object, the object's keys will be available for binding
by the local template `let` declarations.

你可以通过设置 `[ngTemplateOutletContext]` 来给 `EmbeddedViewRef` 附加一个上下文对象。
`[ngTemplateOutletContext]` 是一个对象，该对象的 key 可在模板中使用 `let` 语句进行绑定。

Using the key `$implicit` in the context object will set its value as default.

在上下文对象中使用 `$implicit` 这个 key 会把对应的值设置为默认值。

Example

例子

{&commat;example common/ngTemplateOutlet/ts/module.ts region='NgTemplateOutlet'}



A context object to attach to the {&commat;link EmbeddedViewRef}. This should be an
object, the object's keys will be available for binding by the local template `let`
declarations.
Using the key `$implicit` in the context object will set its value as default.

附加到 {&commat;link EmbeddedViewRef}
的上下文对象。这应该是一个对象，该对象的键名将可以在局部模板中使用 `let`
声明中进行绑定。在上下文对象中使用 `$implicit` 为键名时，将把它作为默认值。

A string defining the template reference and optionally the context object for the template.

一个字符串，用于定义模板引用以及模板的上下文对象。

Injector to be used within the embedded view.

要在嵌入式视图中使用的注入器。