The definition that is a SubClass of another directive of component

作为组件的另一个指令的 SubClass 的定义

Merges the definition from a super class to a sub class.

将定义从超类合并到子类。

A list of `WritableDefs` starting at the top most type and listing
sub-types in order. For each type take the `hostAttrs` and `hostVars` and merge it with the child
type.

从最顶部的类型开始并按顺序列出子类型的 `WritableDefs` 列表。对于每种类型，获取 `hostAttrs` 和
`hostVars` 并将其与子类型合并。

Merge the `hostAttrs` and `hostVars` from the inherited parent to the base class.

将 `hostAttrs` 和 `hostVars` 从继承的父类合并到基类。