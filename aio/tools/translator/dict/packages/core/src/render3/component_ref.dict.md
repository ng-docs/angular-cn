The NgModuleRef to which all resolved factories are bound.

所有解析工厂绑定的 NgModuleRef。

Injector that looks up a value using a specific injector, before falling back to the module
injector. Used primarily when creating components or embedded views dynamically.

在回退到模块注入器之前，使用特定注入器查找值的注入器。主要在动态创建组件或嵌入式视图时使用。

ComponentFactory interface implementation.

ComponentFactory 接口实现。

The component definition.

组件定义。

The NgModuleRef to which the factory is bound.

工厂绑定的 NgModuleRef。

Represents an instance of a Component created via a {&commat;link ComponentFactory}.

表示通过 {&commat;link ComponentFactory} 创建的 Component 实例。

`ComponentRef` provides access to the Component Instance as well other objects related to this
Component Instance and allows you to destroy the Component Instance via the {&commat;link #destroy}
method.

`ComponentRef` 提供对组件实例以及与此组件实例相关的其他对象的访问，并允许你通过 {&commat;link #destroy} 方法销毁组件实例。

Represents a HostFeature function.

表示 HostFeature 函数。

Creates a TNode that can be used to instantiate a root component.

创建一个可用于实例化根组件的 TNode。

Render host element.

渲染宿主元素。

The parent view where the host node is stored

存放宿主节点的父视图

Factory to be used for creating child renderers.

用于创建子渲染器的工厂。

The current renderer

当前渲染器

The sanitizer, if provided

消毒剂（如果提供）

Component view created

已创建组件视图

Creates the root component view and the root component node.

创建根组件视图和根组件节点。

Sets up the styling information on a root component.

在根组件上设置样式信息。

Creates a root component and sets it up with features and host bindings.Shared by
renderComponent\(\) and ViewContainerRef.createComponent\(\).

创建一个根组件并为其设置功能和宿主绑定。由 renderComponent\(\) 和 ViewContainerRef.createComponent\(\) 共享。

Sets the static attributes on a root component.

在根组件上设置静态属性。

Projects the `projectableNodes` that were specified when creating a root component.

投影创建根组件时指定的 `projectableNodes`。

Used to enable lifecycle hooks on the root component.

用于在根组件上启用生命周期挂钩。

Include this feature when calling `renderComponent` if the root component
you are rendering has lifecycle hooks defined. Otherwise, the hooks won't
be called properly.

如果你正在渲染的根组件定义了生命周期挂钩，则在调用 `renderComponent` 时包括此功能。否则，钩子将不会被正确调用。

Example:

范例：