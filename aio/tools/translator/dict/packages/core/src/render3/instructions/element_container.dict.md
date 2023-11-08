Index of the element in the LView array

LView 数组中元素的索引

Index of the container attributes in the `consts` array.

容器属性在 `consts` 数组中的索引。

Index of the container's local references in the `consts` array.

容器的本地引用在 `consts` 数组中的索引。

This function returns itself so that it may be chained.

此函数返回自己，以便它可以被链接。

Even if this instruction accepts a set of attributes no actual attribute values are propagated to
the DOM \(as a comment node can't have attributes\). Attributes are here only for directive
matching purposes and setting initial inputs of directives.

即使此指令接受一组属性，也不会将实际的属性值传播到
DOM（因为注释节点不能有属性）。属性在这里仅用于指令匹配和设置指令的初始输入。

Creates a logical container for other nodes \(<ng-container>\) backed by a comment node in the DOM.
The instruction must later be followed by `elementContainerEnd()` call.

为其他节点创建逻辑容器 \(<ng-container>\) 由 DOM 中的注释节点支持。该指令稍后必须跟
`elementContainerEnd()` 调用。

Mark the end of the <ng-container>.

标记<ng-container>.

Creates an empty logical container using {&commat;link elementContainerStart}
and {&commat;link elementContainerEnd}

使用 {&commat;link elementContainerStart} 和 {&commat;link elementContainerEnd} 创建一个空的逻辑容器

Enables hydration code path \(to lookup existing elements in DOM\)
in addition to the regular creation mode of comment nodes that
represent <ng-container>'s anchor.

除了表示注释节点的常规创建模式之外，还启用水合代码路径（以查找 DOM 中的现有元素）