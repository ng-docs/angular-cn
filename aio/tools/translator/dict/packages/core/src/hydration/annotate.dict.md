A collection that tracks all serialized views \(`ngh` DOM annotations\)
to avoid duplication. An attempt to add a duplicate view results in the
collection returning the index of the previously collected serialized view.
This reduces the number of annotations needed for a given page.

跟踪所有序列化视图（ `ngh` DOM 注释）以避免重复的集合。尝试添加重复视图会导致集合返回先前收集的序列化视图的索引。这减少了给定页面所需的注释数量。

Global counter that is used to generate a unique id for TViews
during the serialization process.

用于在序列化过程中为 TViews 生成唯一 ID 的全局计数器。

Generates a unique id for a given TView and returns this id.
The id is also stored on this instance of a TView and reused in
subsequent calls.

为给定的 TView 生成一个唯一的 id 并返回这个 id。id 也存储在 TView 的这个实例上，并在后续调用中重复使用。

This id is needed to uniquely identify and pick up dehydrated views
at runtime.

需要此 id 才能在运行时唯一标识和提取脱水视图。

Describes a context available during the serialization
process. The context is used to share and collect information
during the serialization.

描述序列化过程中可用的上下文。上下文用于在序列化期间共享和收集信息。

Computes the number of root nodes in a given view
\(or child nodes in a given container if a tNode is provided\).

计算给定视图中的根节点数（如果提供了 tNode，则计算给定容器中的子节点数）。

An instance of an ApplicationRef.

ApplicationRef 的实例。

A reference to the current Document instance.

对当前 Document 实例的引用。

Annotates all components bootstrapped in a given ApplicationRef
with info needed for hydration.

使用水合所需的信息注释在给定 ApplicationRef 中引导的所有组件。

the lContainer we are serializing

我们正在序列化的 lContainer

the hydration context

水合

an array of the `SerializedView` objects

`SerializedView` 对象的数组

Serializes the lContainer data into a list of SerializedView objects,
that represent views within this lContainer.

将 lContainer 数据序列化为 SerializedView 对象列表，这些对象表示此 lContainer 中的视图。

Helper function to produce a node path \(which navigation steps runtime logic
needs to take to locate a node\) and stores it in the `NODES` section of the
current serialized view.

生成节点路径的帮助函数（运行时逻辑需要采取哪些导航步骤来定位节点）并将其存储在当前序列化视图的 `NODES` 部分。

Helper function to append information about a disconnected node.
This info is needed at runtime to avoid DOM lookups for this element
and instead, the element would be created from scratch.

用于附加有关断开连接的节点的信息的辅助函数。在运行时需要此信息以避免为此元素进行 DOM 查找，相反，该元素将从头开始创建。

the lView we are serializing

我们正在序列化的 lView

the `SerializedView` object containing the data to be added to the host node

包含要添加到宿主节点的数据的 `SerializedView` 对象

Serializes the lView data into a SerializedView object that will later be added
to the TransferState storage and referenced using the `ngh` attribute on a host
element.

将 lView 数据序列化为一个 SerializedView 对象，该对象稍后将添加到 TransferState 存储并使用宿主元素上的 `ngh` 属性进行引用。

Determines whether a component instance that is represented
by a given LView uses `ViewEncapsulation.ShadowDom`.

确定由给定 LView 表示的组件实例是否使用 `ViewEncapsulation.ShadowDom`。

The Host element to be annotated

要注释的 Host 元素

The associated LView

关联的 LView

The hydration context

水合

Annotates component host element for hydration:

注释组件宿主元素以进行水合：

by either adding the `ngh` attribute and collecting hydration-related info
for the serialization and transferring to the client

通过添加 `ngh` 属性并收集与水合相关的信息以进行序列化并传输到客户端

or by adding the `ngSkipHydration` attribute in case Angular detects that
component contents is not compatible with hydration.

或者通过添加 `ngSkipHydration` 属性，以防 Angular 检测到组件内容与 hydration 不兼容。

The Map of text nodes to be replaced with comments

要替换为注释的文本节点映射

The document

文档

Physically inserts the comment nodes to ensure empty text nodes and adjacent
text node separators are preserved after server serialization of the DOM.
These get swapped back for empty text nodes or separators once hydration happens
on the client.

物理插入注释节点以确保空文本节点和相邻的文本节点分隔符在 DOM 的服务器序列化后得到保留。一旦在客户端发生水合，这些就会换回空文本节点或分隔符。

Detects whether a given TNode represents a node that
is being content projected.

检测给定的 TNode 是否表示正在投影内容的节点。

Check whether a given node exists, but is disconnected from the DOM.

检查给定节点是否存在，但与 DOM 断开连接。

Note: we leverage the fact that we have this information available in the DOM emulation
layer \(in Domino\) for now. Longer-term solution should not rely on the DOM emulation and
only use internal data structures and state to compute this information.

注意：我们利用了目前在 DOM 仿真层（在 Domino 中）中提供此信息这一事实。长期解决方案不应依赖 DOM 模拟，而应仅使用内部数据结构和状态来计算此信息。