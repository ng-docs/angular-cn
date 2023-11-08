NgModule class.

NgModule 类。

Optional injector instance to use as a parent for the module injector. If
    not provided, `NullInjector` will be used instead.

用作模块注入器的父级的可选注入器实例。如果未提供，将改为使用 `NullInjector`。

NgModuleRef that represents an NgModule instance.

NgModuleRef，表示 NgModule 实例。

Returns a new NgModuleRef instance based on the NgModule class and parent injector provided.

根据提供的 NgModule 类和父注入器返回一个新的 NgModuleRef 实例。

Use `createNgModule` instead.

改用 `createNgModule`。

The `createNgModule` function alias for backwards-compatibility.
Please avoid using it directly and use `createNgModule` instead.

向后兼容的 `createNgModule` 函数别名。请避免直接使用它，而改用 `createNgModule`。

An array of providers.

提供程序的数组。

A parent environment injector.

父环境注入器。

An optional name for this injector instance, which will be used in error
    messages.

此注入器实例的可选名称，将在错误消息中使用。

Create a new environment injector.

创建一个新的环境注入器。

Learn more about environment injectors in
[this guide](guide/standalone-components#environment-injectors).

在[本指南](guide/standalone-components#environment-injectors)中了解有关环境注入器的更多信息。