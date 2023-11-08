The NgOnChangesFeature decorates a component with support for the ngOnChanges
lifecycle hook, so it should be included in any component that implements
that hook.

NgOnChangesFeature 使用对 ngOnChanges
生命周期钩子的支持来装饰组件，因此它应该包含在任何实现该钩子的组件中。

If the component or directive uses inheritance, the NgOnChangesFeature MUST
be included as a feature AFTER {&commat;link InheritDefinitionFeature}, otherwise
inherited properties will not be propagated to the ngOnChanges lifecycle
hook.

如果组件或指令使用继承，则 NgOnChangesFeature 必须作为特性 AFTER {&commat;link InheritDefinitionFeature}
包含，否则继承的属性将不会传播到 ngOnChanges 生命周期钩子。

Example usage:

示例用法：

Component instance. Because this function gets inserted into `TView.preOrderHooks`,
    it is guaranteed to be called with component instance.

组件实例。因为此函数被插入到 `TView.preOrderHooks` 中，所以可以保证使用组件实例调用它。

This is a synthetic lifecycle hook which gets inserted into `TView.preOrderHooks` to simulate
`ngOnChanges`.

这是一个合成的生命周期钩子，它被插入 `TView.preOrderHooks` 以模拟 `ngOnChanges`。

The hook reads the `NgSimpleChangesStore` data from the component instance and if changes are
found it invokes `ngOnChanges` on the component instance.

该钩子从组件实例中读取 `NgSimpleChangesStore` 数据，如果发现更改，它会调用组件实例上的
`ngOnChanges`。

Data structure which is monkey-patched on the component instance and used by `ngOnChanges`
life-cycle hook to track previous input values.

在组件实例上进行了猴子修补的数据结构，供 `ngOnChanges` 生命周期钩子用于跟踪以前的输入值。