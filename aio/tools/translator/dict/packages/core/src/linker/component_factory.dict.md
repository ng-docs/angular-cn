Represents a component created by a `ComponentFactory`.
Provides access to the component instance and related objects,
and provides the means of destroying the instance.

表示由 `ComponentFactory` 创建的组件。提供对组件实例和相关对象的访问，并提供销毁实例的方法。

The name of an input.

输入的名称。

The new value of an input.

输入的新值。

Updates a specified input name to a new value. Using this method will properly mark for check
component using the `OnPush` change detection strategy. It will also assure that the
`OnChanges` lifecycle hook runs when a dynamically created component is change-detected.

将指定的输入名称更新为新值。使用此方法将使用 `OnPush` 变更检测策略正确标记为 check 组件。它还将确保 `OnChanges` 生命周期钩子在检测到动态创建的组件时运行。

The host or anchor [element](guide/glossary#element) for this component instance.

此组件实例的宿主或锚点[元素](guide/glossary#element)。

The [dependency injector](guide/glossary#injector) for this component instance.

此组件实例的[依赖项注入器](guide/glossary#injector)。

This component instance.

该组件实例。

The [host view](guide/glossary#view-hierarchy) defined by the template
for this component instance.

模板为此组件实例定义的[宿主视图](guide/glossary#view-tree)。

The change detector for this component instance.

此组件实例的变更检测器。

The type of this component \(as created by a `ComponentFactory` class\).

此组件的类型（由 `ComponentFactory` 类创建）。

Destroys the component instance and all of the data structures associated with it.

销毁组件实例以及与其关联的所有数据结构。

A handler function that cleans up developer-defined data
associated with this component. Called when the `destroy()` method is invoked.

一个处理器函数，用于清理与此组件关联的由开发人员定义的数据。在调用 `destroy()` 方法时调用。

A lifecycle hook that provides additional developer-defined cleanup
functionality for the component.

一个生命周期钩子，为组件提供其他由开发人员定义的清理功能。

[Dynamic Components](guide/dynamic-component-loader)

[动态组件](guide/dynamic-component-loader)

Angular no longer requires Component factories. Please use other APIs where
    Component class can be used directly.

Angular 不再需要组件工厂。请使用可以直接使用 Component 类的其他 API。

Base class for a factory that can create a component dynamically.
Instantiate a factory for a given type of component with `resolveComponentFactory()`.
Use the resulting `ComponentFactory.create()` method to create a component of that type.

可用来动态创建组件的工厂的基类。`resolveComponentFactory()`
实例化给定类型的组件的工厂。使用生成的 `ComponentFactory.create()` 方法创建该类型的组件。

The component's HTML selector.

组件的 HTML 选择器。

The type of component the factory will create.

工厂将创建的组件的类型。

Selector for all <ng-content> elements in the component.

组件中所有 <ng-content> 元素的选择器。

The inputs of the component.

组件的输入。

The outputs of the component.

组件的输出。

Creates a new component.

创建一个新组件。