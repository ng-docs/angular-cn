A group of assets that are cached in a `Cache` and managed by a given policy.

缓存在 `Cache` 中并由给定策略管理的一组资产。

Concrete classes derive from this base and specify the exact caching policy.

具体类从此基础派生并指定确切的缓存策略。

Normalized resource URLs.

规范化的资源 URL。

Regular expression patterns.

正则表达式模式。

A Promise which resolves to the `Cache` used to back this asset group. This
is opened from the constructor.

解析为用于支持此资产组的 `Cache` 的 Promise。这是从构造函数打开的。

Group name from the configuration.

配置中的组名。

Metadata associated with specific cache entries.

与特定缓存条目关联的元数据。

Initialize this asset group, updating from the given source if available.

初始化此资产组，如果可用，则从给定源更新。

Return a list of the names of all caches used by this group.

返回此组使用的所有缓存名称的列表。

Process a request for a given resource and return it, or return null if it's not available.

处理对给定资源的请求并返回它，如果不可用，则返回 null。

Fetch the complete state of a cached resource, or return null if it's not found.

获取缓存资源的完整状态，如果找不到，则返回 null。

Lookup all resources currently stored in the cache which have no associated hash.

查找当前存储在缓存中的所有没有关联哈希的资源。

Fetch the given resource from the network, and cache it if able.

从网络中获取给定的资源，并在可能时将其缓存。

Load a particular asset from the network, accounting for hash validation.

从网络加载特定资产，并考虑哈希验证。

Possibly update a resource, if it's expired and needs to be updated. A no-op otherwise.

如果资源已过期且需要更新，可能会更新资源。否则为无操作。

An `AssetGroup` that prefetches all of its resources during initialization.

在初始化期间预取其所有资源的 `AssetGroup`。