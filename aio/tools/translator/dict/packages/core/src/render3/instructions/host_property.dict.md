Name of property. Because it is going to DOM, this is not subject to
       renaming as part of minification.

属性的名称。因为它将转到 DOM，因此不会作为缩小的一部分重命名。

New value to write.

要写入的新值。

An optional function used to sanitize the value.

用于清理值的可选函数。

This function returns itself so that it may be chained
\(e.g. `property('name', ctx.name)('title', ctx.title)`\)

此函数返回自己，以便它可以被链接（例如 `property('name', ctx.name)('title', ctx.title)`）

Update a property on a host element. Only applies to native node properties, not inputs.

更新宿主元素上的属性。仅适用于原生节点属性，不适用于输入。

Operates on the element selected by index via the {&commat;link select} instruction.

通过 {&commat;link select} 指令对按索引选择的元素进行操作。

The index of the element to update in the data array

数据数组中要更新的元素的索引

Updates a synthetic host binding \(e.g. `[@foo]`\) on a component or directive.

更新组件或指令上的合成宿主绑定（例如 `[@foo]`）。

This instruction is for compatibility purposes and is designed to ensure that a
synthetic host binding \(e.g. `@HostBinding('@foo')`\) properly gets rendered in
the component's renderer. Normally all host bindings are evaluated with the parent
component's renderer, but, in the case of animation &commat;triggers, they need to be
evaluated with the sub component's renderer \(because that's where the animation
triggers are defined\).

本操作指南是出于兼容性目的，旨在确保合成宿主绑定（例如 `@HostBinding('@foo')`
）在组件的渲染器中正确渲染。通常，所有宿主绑定都是使用父组件的渲染器进行估算的，但是，对于动画 &commat;triggers
，它们需要使用子组件的渲染器进行估算（因为这是定义动画触发器的地方）。

Do not use this instruction as a replacement for `elementProperty`. This instruction
only exists to ensure compatibility with the ViewEngine's host binding behavior.

不要使用此操作指南来代替 `elementProperty`。本操作指南的存在只是为了确保与 ViewEngine
的宿主绑定行为兼容。