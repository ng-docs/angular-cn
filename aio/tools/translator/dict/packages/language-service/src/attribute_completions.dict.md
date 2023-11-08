Differentiates different kinds of `AttributeCompletion`s.

区分不同种类的 `AttributeCompletion`。

Completion of an attribute from the HTML schema.

完成 HTML 模式中的属性。

Attributes often have a corresponding DOM property of the same name.

属性通常有一个对应的同名 DOM 属性。

Completion of a property from the DOM schema.

完成 DOM 架构中的属性。

`DomProperty` completions are generated only for properties which don't share their name with
an HTML attribute.

`DomProperty` 补全仅针对不与 HTML 属性共享名称的属性生成。

Completion of an event from the DOM schema.

完成 DOM 架构中的事件。

Completion of an attribute that results in a new directive being matched on an element.

完成导致在元素上匹配新指令的属性。

Completion of an attribute that results in a new structural directive being matched on an
element.

完成导致在元素上匹配新结构指令的属性。

Completion of an input from a directive which is either present on the element, or becomes
present after the addition of this attribute.

来自指令的输入的完成，该指令要么存在于元素上，要么在添加此属性后变得存在。

Completion of an output from a directive which is either present on the element, or becomes
present after the addition of this attribute.

完成指令的输出，该指令要么出现在元素上，要么在添加此属性后出现。

Completion of an attribute from the DOM schema.

完成 DOM 架构中的属性。

Name of the HTML attribute \(not to be confused with the corresponding DOM property name\).

HTML 属性的名称（不要与相应的 DOM 属性名称混淆）。

Whether this attribute is also a DOM property. Note that this is required to be `true` because
we only want to provide DOM attributes when there is an Angular syntax associated with them
\(`[propertyName]=""`\).

此属性是否也是 DOM 属性。请注意，这必须是 `true`，因为我们只想在存在与之关联的 Angular 语法（ `[propertyName]=""` ）时提供 DOM 属性。

Completion of a DOM property of an element that's distinct from an HTML attribute.

完成与 HTML 属性不同的元素的 DOM 属性。

Name of the DOM property

DOM 属性的名称

Name of the DOM event

DOM 事件的名称

Completion of an attribute which results in a new directive being matched on an element.

完成一个属性，导致在一个元素上匹配一个新的指令。

Name of the attribute whose addition causes this directive to match the element.

属性的名称，其添加导致此指令与元素匹配。

The directive whose selector gave rise to this completion.

其选择器导致此完成的指令。

Completion of an input of a directive which may either be present on the element, or become
present when a binding to this input is added.

完成指令的输入，它可能出现在元素上，或者在添加到该输入的绑定时出现。

The public property name of the input \(the name which would be used in any binding to that
input\).

输入的公共属性名称（将用于对该输入的任何绑定的名称）。

The directive which has this input.

具有此输入的指令。

The field name on the directive class which corresponds to this input.

与此输入对应的指令类上的字段名称。

Currently, in the case where a single property name corresponds to multiple input fields, only
the first such field is represented here. In the future multiple results may be warranted.

目前，在单个属性名称对应多个输入字段的情况下，这里只表示第一个这样的字段。将来可能需要多个结果。

Whether this input can be used with two-way binding \(that is, whether a corresponding change
output exists on the directive\).

此输入是否可以与双向绑定一起使用（即指令上是否存在相应的更改输出）。

The public event name of the output \(the name which would be used in any binding to that
output\).

输出的公共事件名称（将用于任何绑定到该输出的名称）。

The directive which has this output.

具有此输出的指令。

The field name on the directive class which corresponds to this output.

与此输出对应的指令类上的字段名称。

Any named attribute which is available for completion on a given element.

可用于完成给定元素的任何命名属性。

Disambiguated by the `kind` property into various types of completions.

通过 `kind` 属性消歧为各种类型的补全。

Given an element and its context, produce a `Map` of all possible attribute completions.

给定一个元素及其上下文，生成一个包含所有可能的属性补全的 `Map`。

3 kinds of attributes are considered for completion, from highest to lowest priority:

3 种属性被考虑完成，优先级从高到低：

Inputs/outputs of directives present on the element already.

指令的输入/输出已经存在于元素上。

Inputs/outputs of directives that are not present on the element, but which would become
present if such a binding is added.

指令的输入/输出不存在于元素上，但如果添加这样的绑定就会出现。

Attributes from the DOM schema for the element.

来自元素的 DOM 架构的属性。

The priority of these options determines which completions are added to the `Map`. If a directive
input shares the same name as a DOM attribute, the `Map` will reflect the directive input
completion, not the DOM completion for that name.

这些选项的优先级决定了将哪些补全添加到 `Map` 中。如果指令输入与 DOM 属性共享相同的名称，则 `Map` 将反映指令输入完成，而不是该名称的 DOM 完成。

Used to ensure Angular completions appear before DOM completions. Inputs and Outputs are
prioritized first while attributes which would match an additional directive are prioritized
second.

用于确保 Angular 完成出现在 DOM 完成之前。输入和输出优先级最高，而匹配附加指令的属性优先级次之。

This sort priority is based on the ASCII table. Other than `space`, the `!` is the first
printable character in the ASCII ordering.

此排序优先级基于 ASCII 表。除了 `space`，`!` 是 ASCII 排序中的第一个可打印字符。

Given an `AttributeCompletion`, add any available completions to a `ts.CompletionEntry` array of
results.

给定一个 `AttributeCompletion`，将任何可用的完成添加到结果的 `ts.CompletionEntry` 数组中。

The kind of completions generated depends on whether the current context is an attribute context
or not. For example, completing on `<element attr|>` will generate two results: `attribute` and
`[attribute]` - either a static attribute can be generated, or a property binding. However,
`<element [attr|]>` is not an attribute context, and so only the property completion `attribute`
is generated. Note that this completion does not have the `[]` property binding sugar as its
implicitly present in a property binding context \(we're already completing within an `[attr|]`
expression\).

生成的完成类型取决于当前上下文是否是属性上下文。例如，完成 `<element attr|>` 将生成两个结果：`attribute` 和 `[attribute]` - 可以生成静态属性或属性绑定。但是，`<element [attr|]>` 不是属性上下文，因此只生成属性完成 `attribute`。请注意，此完成没有 `[]` 属性绑定糖，因为它隐式存在于属性绑定上下文中（我们已经在 `[attr|]` 表达式中完成）。

If the `insertSnippet` is `true`, the completion entries should includes the property or event
binding sugar in some case. For Example `<div (my¦) />`, the `replacementSpan` is `(my)`, and the
`insertText` is `(myOutput)="$0"`.

如果 `insertSnippet` 为 `true`，则在某些情况下，完成条目应包括属性或事件绑定糖。例如 `<div (my¦) />`，`replacementSpan` 是 `(my)`，`insertText` 是 `(myOutput)="$0"`。

Iterates over `CssSelector` attributes, which are internally represented in a zipped array style
which is not conducive to straightforward iteration.

迭代 `CssSelector` 属性，这些属性在内部以压缩数组样式表示，不利于直接迭代。