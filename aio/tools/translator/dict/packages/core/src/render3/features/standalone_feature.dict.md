A service used by the framework to create instances of standalone injectors. Those injectors are
created on demand in case of dynamic component instantiation and contain ambient providers
collected from the imports graph rooted at a given standalone component.

框架用于创建独立注入器实例的服务。这些注入器是在动态组件实例化的情况下按需创建的，并包含从以给定独立组件为根的导入图中收集的环境提供器。

A feature that acts as a setup code for the {&commat;link StandaloneService}.

作为 {&commat;link StandaloneService} 的设置代码的特性。

The most important responsibility of this feature is to expose the "getStandaloneInjector"
function \(an entry points to a standalone injector creation\) on a component definition object. We
go through the features infrastructure to make sure that the standalone injector creation logic
is tree-shakable and not included in applications that don't use standalone components.

此特性最重要的责任是在组件定义对象上公开“getStandaloneInjector”函数（指向独立注入器创建的入口点）。我们遍历了特性基础设施，以确保独立注入器创建逻辑是可
tree-shakable 的，并且不包含在不使用独立组件的应用程序中。