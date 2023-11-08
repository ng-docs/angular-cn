A metadata record of how old a particular cached resource is.

特定缓存资源的年龄的元数据记录。

A node in the LRU chain for a given `DataGroup`.

给定 `DataGroup` 的 LRU 链中的节点。

Serializable as previous/next are identified by their URL and are not references.

可序列化为上一个/下一个是由它们的 URL 标识的，而不是引用。

The URL tracked by this node.

此节点跟踪的 URL。

The previous \(more recent\) node in the chain, or null if this is the head.

链中的前一个（最近的）节点，如果这是头，则为 null。

The next \(less recent\) node in the chain, or null if this is the tail.

链中的下一个（最近的）节点，如果这是尾部，则为 null。

Serializable state of an entire LRU chain.

整个 LRU 链的可序列化状态。

Essentially a doubly linked list of URLs.

本质上是一个 URL 的双向链接列表。

URL of the head node, or null if the chain is empty.

头节点的 URL，如果链为空，则为 null。

URL of the tail node, or null if the chain is empty.

尾节点的 URL，如果链为空，则为 null。

Map of URLs to data for each URL \(including next/prev pointers\).

URL 到每个 URL 的数据的映射（包括 next/prev 指针）。

Count of the number of nodes in the chain.

链中节点数的计数。

Manages an instance of `LruState` and moves URLs to the head of the
chain when requested.

管理 `LruState` 的实例，并在请求时将 URL 移动到链的头部。

The current count of URLs in the list.

列表中的当前 URL 计数。

Remove the tail.

去掉尾巴。

A group of cached resources determined by a set of URL patterns which follow a LRU policy
for caching.

由一组 URL 模式确定的一组缓存资源，这些 URL 模式遵循 LRU 缓存策略。

Sync the LRU chain to non-volatile storage.

将 LRU 链同步到非易失性存储。

Process a fetch event and return a `Response` if the resource is covered by this group,
or `null` otherwise.

处理 fetch 事件，如果资源被此组覆盖，则返回 `Response`，否则返回 `null`。

Delete all of the saved state which this group uses to track resources.

删除此组用于跟踪资源的所有已保存状态。

Return a list of the names of all caches used by this group.

返回此组使用的所有缓存名称的列表。