Given the following DOM structure:

给定以下 DOM 结构：

Calling `getComponent` on `<child-comp>` will return the instance of `ChildComponent`
associated with this DOM element.

在 `<my-app>` 上调用该函数将返回 `MyApp` 实例。

Calling the function on `<app-root>` will return the `MyApp` instance.

在 `<my-app>` 上调用该函数将返回 `MyApp` 实例。

DOM element from which the component should be retrieved.

要从中检索组件的 DOM 元素。

Component instance associated with the element or `null` if there
   is no component associated with it.

与元素关联的组件实例，如果没有关联的组件，则返回 `null`。

Retrieves the component instance associated with a given DOM element.

检索与给定 DOM 元素关联的组件实例。

Element for which to get the surrounding component instance.

要获取外围组件实例的元素。

Instance of the component that is around the element or null if the element isn't
   inside any component.

元素周围的组件实例，如果元素不在任何组件内，则为 null。

If inside an embedded view \(e.g. `*ngIf` or `*ngFor`\), retrieves the context of the embedded
view that the element is part of. Otherwise retrieves the instance of the component whose view
owns the element \(in this case, the result is the same as calling `getOwningComponent`\).

如果在嵌入式视图中（比如 `*ngIf` 或 `*ngFor`），则检索元素所属的嵌入式视图的上下文。否则，检索其视图中拥有该元素的组件的实例（在这种情况下，其结果与调用 `getOwningComponent` 相同）。

DOM element, component or directive instance
   for which to retrieve the root components.

要为其检索根组件的 DOM 元素、组件或指令实例。

Component instance whose view owns the DOM element or null if the element is not
   part of a component view.

其视图拥有 DOM 元素的组件实例，如果该元素不是组件视图的一部分，则返回 null。

Retrieves the component instance whose view contains the DOM element.

检索其视图中包含此 DOM 元素的组件实例。

For example, if `<child-comp>` is used in the template of `<app-comp>`
\(i.e. a `ViewChild` of `<app-comp>`\), calling `getOwningComponent` on `<child-comp>`
would return `<app-comp>`.

比如，如果 `<child-comp>` 在 `<app-comp>` 的模板中使用（即 `<app-comp>` 的 `ViewChild`），在 `<child-comp>` 上调用 `getOwningComponent` 将返回 `<app-comp>`。

Root components associated with the target object.

与目标对象关联的根组件。

Retrieves all root components associated with a DOM element, directive or component instance.
Root components are those which have been bootstrapped by Angular.

检索与 DOM 元素，指令或组件实例关联的所有根组件。根组件是由 Angular 引导启动的组件。

DOM element, component or directive instance for which to
   retrieve the injector.

要为其获取注入器的 DOM 元素、组件或指令实例。

Injector associated with the element, component or directive instance.

与元素、组件或指令实例关联的注入器。

Retrieves an `Injector` associated with an element, component or directive instance.

检索与元素、组件或指令实例关联的 `Injector`。

Element for which the injection tokens should be retrieved.

应为其检索注入令牌的元素。

Retrieve a set of injection tokens at a given DOM node.

在给定的 DOM 节点检索一组注入令牌。

Calling `getDirectives` on `<button>` will return an array with an instance of the `MyButton`
directive that is associated with the DOM node.

在 `<my-comp>` 上调用 `getDirectives` 将返回一个空数组。

Calling `getDirectives` on `<my-comp>` will return an empty array.

在 `<my-comp>` 上调用 `getDirectives` 将返回一个空数组。

DOM node for which to get the directives.

要为其获取指令的 DOM 元素。

Array of directives associated with the node.

与节点关联的指令数组。

Retrieves directive instances associated with a given DOM node. Does not include
component instances.

检索与给定 DOM 元素关联的指令实例。不包括组件实例。

Partial metadata for a given directive instance.
This information might be useful for debugging purposes or tooling.
Currently only `inputs` and `outputs` metadata is available.

给定指令实例的部分元数据。此信息可能可用于调试目的或工具。当前只有 `inputs` 和 `outputs` 元数据可用。

Partial metadata for a given component instance.
This information might be useful for debugging purposes or tooling.
Currently the following fields are available:

给定组件实例的部分元数据。此信息可能可用于调试目的或工具。目前有以下字段可用：

inputs

inputs（输入属性）

outputs

outputs（输出属性）

encapsulation

encapsulation（封装）

Instance of a directive or component

指令或组件的实例

metadata of the passed directive or component

传递的指令或组件的元数据

Returns the debug \(partial\) metadata for a particular directive or component instance.
The function accepts an instance of a directive or component and returns the corresponding
metadata.

返回特定指令或组件实例的调试（部分）元数据。该函数接受指令或组件的实例，并返回相应的元数据。

DOM element, component or directive instance for which to retrieve
   the local references.

要为其检索本地引用的 DOM 元素、组件或指令实例。

Retrieve map of local references.

检索本地参考地图。

The references are retrieved as a map of local reference name to element or directive instance.

引用作为本地引用名称到元素或指令实例的映射来检索。

Component or directive instance for which the host
    element should be retrieved.

要为其检索宿主元素的组件或指令实例。

Host element of the target.

目标的宿主元素。

Retrieves the host element of a component or directive instance.
The host element is the DOM element that matched the selector of the directive.

检索组件或指令实例的宿主元素。宿主元素是与指令的选择器匹配的 DOM 元素。

The component to return the content text for.

要为其返回内容文本的组件。

Retrieves the rendered text for a given component.

检索给定组件的渲染文本。

This function retrieves the host element of a component and
and then returns the `textContent` for that element. This implies
that the text returned will include re-projected content of
the component as well.

此函数检索组件的宿主元素，然后返回该元素的 `textContent`。这意味着返回的文本也将包括组件的重新投影内容。

Event listener configuration returned from `getListeners`.

`getListeners` 返回的事件监听器配置。

Name of the event listener.

事件监听器的名称。

Element that the listener is bound to.

监听器绑定到的元素。

Callback that is invoked when the event is triggered.

触发事件时调用的回调。

Whether the listener is using event capturing.

监听器是否正在使用事件捕获。

Type of the listener \(e.g. a native DOM event or a custom &commat;Output\).

监听器的类型（比如，原生 DOM 事件或自定义 &commat;Output）。

Calling `getListeners` on `<div>` will return an object that looks as follows:

在 `<div>` 上调用 `getListeners` 将返回一个如下所示的对象：

Element for which the DOM listeners should be retrieved.

要为其检索 DOM 监听器的元素。

Array of event listeners on the DOM element.

DOM 元素上的事件侦听器数组。

Retrieves a list of event listeners associated with a DOM element. The list does include host
listeners, but it does not include event listeners defined outside of the Angular context
\(e.g. through `addEventListener`\).

检索与 DOM 元素关联的事件监听器的列表。该列表包含宿主监听器，但不包含在 Angular 上下文之外定义的事件监听器（比如，通过 `addEventListener`）。

This function should not exist because it is megamorphic and only mostly correct.

这个函数不应该存在，因为它是超态的，而且只是大部分正确。

See call site for more info.

有关详细信息，请参阅呼叫站点。

DOM element or component instance for which to retrieve the LView.

要为其检索 LView 的 DOM 元素或组件实例。

Retrieve the component `LView` from component/element.

从组件/元素中检索组件 `LView`。

NOTE: `LView` is a private and should not be leaked outside.
      Don't export this method to `ng.*` on window.

注意：`LView` 是私有的，不应泄露到外部。不要将此方法导出到窗口上的 `ng.*`。

Asserts that a value is a DOM Element.

断言一个值是一个 DOM 元素。