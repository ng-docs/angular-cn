The underlying DOM node.

基础 DOM 节点。

The `DebugElement` parent. Will be `null` if this is the root element.

`DebugElement` 父级。如果这是根元素，则为 `null`。

The host dependency injector. For example, the root element's component instance injector.

宿主依赖注入器。例如，根元素的组件实例注入器。

The element's own component instance, if it has one.

元素自己的组件实例（如果有）。

An object that provides parent context for this element. Often an ancestor component instance
that governs this element.

为此元素提供父上下文的对象。通常是控制此元素的祖先组件实例。

When an element is repeated within *ngFor, the context is an `NgForOf` whose `$implicit`
property is the value of the row instance value. For example, the `hero` in \`*ngFor="let hero
of heroes"\`.

当一个元素在*ngFor 中重复时，上下文是一个 `NgForOf`，其 `$implicit` 属性是行实例值的值。例如，
`hero`* ngFor="let hero of heros"\` 中的英雄。

The callbacks attached to the component's &commat;Output properties and/or the element's event
properties.

附加到组件的 &commat;Output 属性和/或元素的 event 属性的回调。

Dictionary of objects associated with template local variables \(e.g. #foo\), keyed by the local
variable name.

与模板局部变量（例如 #foo）关联的对象字典，以局部变量名作为键。

This component's injector lookup tokens. Includes the component itself plus the tokens that the
component lists in its providers metadata.

此组件的注入器查找令牌。包括组件本身以及组件在其提供者元数据中列出的令牌。

[Component testing scenarios](guide/testing-components-scenarios)

[组件测试场景](guide/testing-components-scenarios)

[Basics of testing components](guide/testing-components-basics)

[测试组件的基础知识](guide/testing-components-basics)

[Testing utility APIs](guide/testing-utility-apis)

[测试工具 API](guide/testing-utility-apis)

The underlying DOM element at the root of the component.

组件根处的基础 DOM 元素。

The element tag name, if it is an element.

元素令牌名称（如果是元素）。

Gets a map of property names to property values for an element.

获取元素的属性名称到属性值的映射。

This map includes:

这张地图包括：

Regular property bindings \(e.g. `[id]="id"`\)

常规属性绑定（例如 `[id]="id"`）

Host property bindings \(e.g. `host: { '[id]': "id" }`\)

宿主属性绑定（例如 `host: { '[id]': "id" }`）

Interpolated property bindings \(e.g. \`id="{{ value }}"\)

插值属性绑定（例如 \`id="{{ value }}"）

It does not include:

它不包括：

input property bindings \(e.g. `[myCustomInput]="value"`\)

输入属性绑定（例如 `[myCustomInput]="value"`）

attribute bindings \(e.g. `[attr.role]="menu"`\)

属性绑定（例如 `[attr.role]="menu"`）

A map of attribute names to attribute values for an element.

元素的属性名称到属性值的映射。

[ElementCSSInlineStyle](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style)



The inline styles of the DOM element.

DOM 元素的内联样式。

Will be `null` if there is no `style` property on the underlying DOM element.

如果基础 DOM 元素上没有 `style` 属性，则将为 `null`。

[Element.className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)

[元素类名](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)

A map containing the class names on the element as keys.

包含元素上的类名作为键的映射表。

This map is derived from the `className` property of the DOM element.

此映射表派生自 DOM 元素的 `className` 属性。

Note: The values of this object will always be `true`. The class key will not appear in the KV
object if it does not exist on the element.

注意：此对象的值将始终为 `true`。如果元素上不存在，则类键将不会出现在 KV 对象中。

[Node.childNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes)



The `childNodes` of the DOM element as a `DebugNode` array.

DOM 元素的 `childNodes`，为 `DebugNode` 数组。

The immediate `DebugElement` children. Walk the tree by descending through `children`.

直接的 `DebugElement` 子项。通过 `children` 下降来走树。

the first `DebugElement` that matches the predicate at any depth in the subtree.

子树中任何深度处与谓词匹配的第一个 `DebugElement`。

All `DebugElement` matches for the predicate at any depth in the subtree.

子树中任何深度的谓词的所有 `DebugElement` 匹配。

All `DebugNode` matches for the predicate at any depth in the subtree.

子树中任何深度的谓词的所有 `DebugNode` 匹配。

The name of the event to trigger

要触发的事件名称

The _event object_ expected by the handler

处理程序所期望的 _ 事件对象 _

[Testing components scenarios](guide/testing-components-scenarios#trigger-event-handler)

[测试组件场景](guide/testing-components-scenarios#trigger-event-handler)

Triggers the event by its name if there is a corresponding listener in the element's
`listeners` collection.

如果元素的 `listeners` 集合中有对应的侦听器，则按事件名称触发事件。

If the event lacks a listener or there's some other problem, consider
calling `nativeElement.dispatchEvent(eventObject)`.

如果事件缺少侦听器或存在其他问题，请考虑调用 `nativeElement.dispatchEvent(eventObject)`。

the element from which the walk is started

开始步行的元素

the predicate to match

要匹配的谓词

the list of positive matches

肯定匹配的列表

whether only elements should be searched

是否只搜索元素

Walk the TNode tree to find matches for the predicate.

遍历 TNode 树以查找谓词的匹配项。

the current TNode

当前 TNode

the LView of this TNode

此 TNode 的 LView

the root native node on which predicate should not be matched

不应该匹配谓词的原生根节点

Recursively match the current TNode against the predicate, and goes on with the next ones.

递归地将当前 TNode 与谓词匹配，并继续下一个。

the container to be processed

要处理的容器

Process all TNodes in a given container.

处理给定容器中的所有 TNode。

the current native node

当前的原生节点

Match the current native node against the predicate.

将当前的原生节点与谓词匹配。

the list where matches are stored

存储匹配项的列表

Match all the descendants of a DOM node against a predicate.

将 DOM 节点的所有后代与谓词匹配。

Iterates through the property bindings for a given node and generates
a map of property names to values. This map only contains property bindings
defined in templates, not in host bindings.

迭代给定节点的属性绑定，并生成属性名称到值的映射。此映射仅包含在模板中定义的属性绑定，不包含在宿主绑定中。

A boolean-valued function over a value, possibly including context information
regarding that value's position in an array.

根据参数值返回布尔值的函数，可能包括该值在数组中位置的上下文信息。