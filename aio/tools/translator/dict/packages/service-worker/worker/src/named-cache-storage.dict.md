A wrapper around `CacheStorage` to allow interacting with caches more easily and consistently by:

`CacheStorage` 的包装器，允许通过以下方式更轻松、更一致地与缓存交互：

Adding a `name` property to all opened caches, which can be used to easily perform other
operations that require the cache name.

向所有打开的缓存添加 `name` 属性，可用于轻松执行需要缓存名称的其他操作。

Name-spacing cache names to avoid conflicts with other caches on the same domain.

命名空间缓存名称，以避免与同一个域上的其他缓存冲突。