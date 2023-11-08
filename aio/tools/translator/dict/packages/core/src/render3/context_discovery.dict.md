Component, Directive or DOM Node.

组件、指令或 DOM 节点。

Returns the matching `LContext` data for a given DOM node, directive or component instance.

返回给定 DOM 节点、指令或组件实例的匹配 `LContext` 数据。

This function will examine the provided DOM element, component, or directive instance\\'s
monkey-patched property to derive the `LContext` data. Once called then the monkey-patched
value will be that of the newly created `LContext`.

此函数将检查提供的 DOM 元素、组件或指令实例的 Monkey-patched 属性以派生 `LContext`
数据。一旦调用，那么猴子修补的值将是新创建的 `LContext` 的值。

If the monkey-patched value is the `LView` instance then the context value for that
target will be created and the monkey-patch reference will be updated. Therefore when this
function is called it may mutate the provided element\\'s, component\\'s or any of the associated
directive\\'s monkey-patch values.

如果 Monkey-patched 的值是 `LView` 实例，则将创建该目标的上下文值，并更新 Monkey-patch
引用。因此，当调用此函数时，它可能会改变提供的元素、组件或任何关联指令的 Monkey-patch 值。

If the monkey-patch value is not detected then the code will walk up the DOM until an element
is found which contains a monkey-patch reference. When that occurs then the provided element
will be updated with a new context \(which is then returned\). If the monkey-patch value is not
detected for a component/directive instance then it will throw an error \(all components and
directives should be automatically monkey-patched by ivy\).

如果未检测到 Monkey-patch 值，则代码将沿着 DOM 向上走，直到找到包含 Monkey-patch
引用的元素。当发生这种情况时，所提供的元素将使用新的上下文（然后返回）进行更新。如果未为组件/指令实例检测到
Monkey-patch 值，则它将抛出错误（所有组件和指令都应由 ivy 自动进行猴子补丁）。

Creates an empty instance of a `LContext` context

创建 `LContext` 上下文的空实例

The component's view

组件的视图

Takes a component instance and returns the view for that component.

接受一个组件实例并返回该组件的视图。

This property will be monkey-patched on elements, components and directives.

此属性将在元素、组件和指令上进行猴子修补。

Assigns the given data to the given target \(which could be a component,
directive or DOM node instance\) using monkey-patching.

使用 Monkey-patching 将给定数据分配给给定目标（可以是组件、指令或 DOM 节点实例）。

Returns the monkey-patch value data present on the target \(which could be
a component, directive or a DOM node\).

返回目标上存在的 Monkey-patch 值数据（可以是组件、指令或 DOM 节点）。

Locates the element within the given LView and returns the matching index

在给定的 LView 中定位元素并返回匹配的索引

Locates the next tNode \(child, sibling or parent\).

定位下一个 tNode（子级、同级或父级）。

Locates the component within the given LView and returns the matching index

在给定的 LView 中定位组件并返回匹配的索引

Locates the directive within the given LView and returns the matching index

在给定的 LView 中定位指令并返回匹配的索引

The node index

节点索引

The target view data

目标视图数据

Returns a list of directives applied to a node at a specific index. The list includes
directives matched by selector and any host directives, but it excludes components.
Use `getComponentAtNodeIndex` to find the component applied to a node.

根据提供的指令索引值列表，返回从给定视图中提取的指令列表。

Returns a map of local references \(local reference name => element or directive instance\) that
exist on a given element.

返回给定元素上存在的本地引用（本地引用 name => 元素或指令实例）的映射表。