the directive definition

指令定义

Resolves the providers which are defined in the DirectiveDef.

解析 DirectiveDef 中定义的提供者。

When inserting the tokens and the factories in their respective arrays, we can assume that
this method is called first for the component \(if any\), and then for other directives on the same
node.
As a consequence,the providers are always processed in that order:
1\) The view providers of the component
2\) The providers of the component
3\) The providers of the other directives
This matches the structure of the injectables arrays of a view \(for each node\).
So the tokens and the factories can be pushed at the end of the arrays, except
in one case for multi providers.

在各自的数组中插入标记和工厂时，我们可以假定首先为组件（如果有）调用此方法，然后为同一个节点上的其他指令调用。因此，提供程序始终按该顺序处理：
1）组件的视图提供者 2）组件的提供者 3）其他指令的提供者 这与视图的 injectionables
数组的结构（每个节点）。因此，标记和工厂可以被推送到数组的末尾，但在一种情况下是多重提供者。

Resolves a provider and publishes it to the DI system.

解析提供者并将其发布到 DI 系统。

`TView` in which to register the hook.

要在其中注册钩子的 `TView`。

Provider whose hook should be registered.

应该注册其钩子的提供者。

Index under which to find the context for the hook when it's being invoked.

调用钩子时要在其下查找钩子上下文的索引。

Only required for `multi` providers. Index of the provider in the multi
provider factory.

仅 `multi` 提供程序需要。多提供者工厂中提供者的索引。

Registers the `ngOnDestroy` hook of a provider, if the provider supports destroy hooks.

如果提供者支持 destroy 钩子，则注册提供者的 `ngOnDestroy` 钩子。

Index at which the factory was inserted.

插入工厂的索引。

Add a factory in a multi factory.

在多工厂中添加工厂。

Returns the index of item in the array, but only in the begin to end range.

返回数组中条目的索引，但仅在开始到结束范围内。

Use this with `multi` `providers`.

将其与 `multi` `providers` 一起使用。

Use this with `multi` `viewProviders`.

将其与 `multi` `viewProviders` 一起使用。

This factory knows how to concatenate itself with the existing `multi` `providers`.

该工厂知道如何将自己与现有的 `multi` `providers` 连接起来。

Maps an array of factories into an array of values.

将工厂数组映射到值数组。

Creates a multi factory.

创建多工厂。