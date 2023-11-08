The goal here is to make sure that the browser DOM API is the Renderer.
We do this by defining a subset of DOM API to be the renderer and then
use that at runtime for rendering.

这里的目标是确保浏览器 DOM API 是 Renderer。我们通过定义 DOM API
的一个子集作为渲染器，然后在运行时使用它进行渲染来实现。

At runtime we can then use the DOM api directly, in server or web-worker
it will be easy to implement such API.

然后在运行时，我们可以直接使用 DOM api，在服务器或 Web-worker 中很容易实现这样的 API。

Subset of API needed for appending elements and text nodes.

附加元素和文本节点所需的 API 子集。

Returns the parent Element, Document, or DocumentFragment

返回父 Element、Document 或 DocumentFragment

Returns the parent Element if there is one

如果有父元素，则返回

Gets the Node immediately following this one in the parent's childNodes

获取父级的 childNodes 中紧跟此的 Node

the child node to remove

要删除的子节点

Removes a child from the current node and returns the removed node

从当前节点中删除子项并返回被删除的节点

Insert a child node.

插入子节点。

Used exclusively for adding View root nodes into ViewAnchor location.

专门用于将 View 根节点添加到 ViewAnchor 位置。

Append a child node.

附加一个子节点。

Used exclusively for building up DOM which are static \(ie not View roots\)

专门用于构建静态 DOM（即不是 View 根）

Subset of API needed for writing attributes, properties, and setting up
listeners on Element.

在 Element 上编写属性、属性和设置侦听器所需的 API 子集。