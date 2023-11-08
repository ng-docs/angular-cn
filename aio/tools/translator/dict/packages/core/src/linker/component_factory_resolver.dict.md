Angular no longer requires Component factories. Please use other APIs where
    Component class can be used directly.

Angular 不再需要组件工厂。请使用可以直接使用 Component 类的其他 API。

A simple registry that maps `Components` to generated `ComponentFactory` classes
that can be used to create instances of components.
Use to obtain the factory for a given component type,
then use the factory's `create()` method to create a component of that type.

一个简单的注册表，它将 `Components` 映射到生成的 `ComponentFactory`
类，该类可用于创建组件的实例。用于获取给定组件类型的工厂，然后使用工厂的 `create()`
方法创建该类型的组件。

Note: since v13, dynamic component creation via
[`ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)
does **not** require resolving component factory: component class can be used directly.

注意：从 v13
开始，通过[`ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)创建动态组件**不需要**解析组件工厂：组件类可以直接使用。

The component type.

组件类型。

Retrieves the factory object that creates a component of the given type.

检索能创建给定类型的组件的工厂对象。