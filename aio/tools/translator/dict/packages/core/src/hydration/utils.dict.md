The name of the key used in the TransferState collection,
where hydration information is located.

TransferState 集合中使用的键的名称，水合信息所在的位置。

Lookup key used to reference DOM hydration data \(ngh\) in `TransferState`.

用于在 `TransferState` 中引用 DOM 水合数据 \(ngh\) 的查找键。

The name of the attribute that would be added to host component
nodes and contain a reference to a particular slot in transferred
state that contains the necessary hydration info for this component.

将添加到宿主组件节点的属性的名称，并包含对处于传输状态的特定插槽的引用，该插槽包含此组件的必要水合信息。

The contents of the text comment added to nodes that would otherwise be
empty when serialized by the server and passed to the client. The empty
node is lost when the browser parses it otherwise. This comment node will
be replaced during hydration in the client to restore the lost empty text
node.

添加到节点的文本注释的内容，否则这些节点在由服务器序列化并传递给客户端时将为空。当浏览器以其他方式解析空节点时，空节点将丢失。该注释节点将在客户端水合期间被替换以恢复丢失的空文本节点。

The contents of the text comment added in the case of adjacent text nodes.
When adjacent text nodes are serialized by the server and sent to the
client, the browser loses reference to the amount of nodes and assumes
just one text node. This separator is replaced during hydration to restore
the proper separation and amount of text nodes that should be present.

在相邻文本节点的情况下添加的文本注释的内容。当相邻的文本节点被服务器序列化并发送给客户端时，浏览器将失去对节点数量的参考并假定只有一个文本节点。此分隔符在水合期间被替换，以恢复应存在的文本节点的适当分隔和数量。

Component's host element.

组件的宿主元素。

Injector that this component has access to.

该组件有权访问的注入器。

Reference to a function that reads `ngh` attribute value from a given RNode
and retrieves hydration information from the TransferState using that value
as an index. Returns `null` by default, when hydration is not enabled.

引用从给定 RNode 读取 `ngh` 属性值并使用该值作为索引从 TransferState 检索水合信息的函数。未启用水合时，默认返回 `null`。

Sets the implementation for the `retrieveHydrationInfo` function.

设置 `retrieveHydrationInfo` 函数的实现。

Retrieves hydration info by reading the value from the `ngh` attribute
and accessing a corresponding slot in TransferState storage.

通过从 `ngh` 属性中读取值并访问 TransferState 存储中的相应插槽来检索水合信息。

Retrieves an instance of a component LView from a given ViewRef.
Returns an instance of a component LView or `null` in case of an embedded view.

从给定的 ViewRef 中检索组件 LView 的实例。返回组件 LView 的实例，如果是嵌入式视图，则返回 `null`。

The app's root HTML Element

应用程序的根 HTML 元素

Restores text nodes and separators into the DOM that were lost during SSR
serialization. The hydration process replaces empty text nodes and text
nodes that are immediately adjacent to other text nodes with comment nodes
that this method filters on to restore those missing nodes that the
hydration process is expecting to be present.

将 SSR 序列化期间丢失的文本节点和分隔符恢复到 DOM 中。水合过程将空文本节点和与其他文本节点紧邻的文本节点替换为此方法过滤的注释节点，以恢复水合过程期望存在的那些缺失节点。

Internal type that represents a claimed node.
Only used in dev mode.

表示已声明节点的内部类型。仅在开发模式下使用。

Marks a node as "claimed" by hydration process.
This is needed to make assessments in tests whether
the hydration process handled all nodes.

通过水合过程将节点标记为“已声明”。这需要在测试中评估水合过程是否处理了所有节点。

Returns the size of an <ng-container>, using either the information
serialized in `ELEMENT_CONTAINERS` \(element container size\) or by
computing the sum of root nodes in all dehydrated views in a given
container \(in case this `<ng-container>` was also used as a view
container host node, e.g. &lt;ng-container \*ngIf>\).

返回一个的大小

Computes the size of a serialized container \(the number of root nodes\)
by calculating the sum of root nodes in all dehydrated views in this container.

通过计算此容器中所有脱水视图中的根节点总和来计算序列化容器的大小（根节点数）。

Checks whether a node is annotated as "disconnected", i.e. not present
in the DOM at serialization time. We should not attempt hydration for
such nodes and instead, use a regular "creation mode".

检查节点是否被注释为“断开连接”，即在序列化时不存在于 DOM 中。我们不应尝试对此类节点进行水合，而应使用常规的“创建模式”。