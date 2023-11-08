The index of the container in the data array

容器在数据数组中的索引

Inline template

内联模板

The number of nodes, local refs, and pipes for this template

此模板的节点、本地引用和管道的数量

The number of bindings for this template

此模板的绑定数

The name of the container element, if applicable

容器元素的名称（如果适用）

Index of template attributes in the `consts` array.

`consts` 数组中模板属性的索引。

Index of the local references in the `consts` array.

`consts` 数组中的本地引用的索引。

A function which extracts local-refs values from the template.
       Defaults to the current element associated with the local-ref.

从模板中提取 local-refs 值的函数。默认为与 local-ref 关联的当前元素。

Creates an LContainer for an ng-template \(dynamically-inserted view\), e.g.

为 ng-template（动态插入的视图）创建一个 LContainer，例如

&lt;ng-template #foo>

&lt;ng-模板 #foo>

<div></div>
</ng-template>



Regular creation mode for LContainers and their anchor \(comment\) nodes.

LContainers 及其锚点（注释）节点的常规创建模式。

Enables hydration code path \(to lookup existing elements in DOM\)
in addition to the regular creation mode for LContainers and their
anchor \(comment\) nodes.

除了 LContainers 及其锚点（注释）节点的常规创建模式之外，还启用水合代码路径（以查找 DOM 中的现有元素）。