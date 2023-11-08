Tracks the current readiness condition under which the SW is operating. This controls
whether the SW attempts to respond to some or all requests.

跟踪 SW 正在运行的当前就绪条件。这控制 SW 是尝试响应部分还是所有请求。

Tracks whether the SW is in an initialized state or not. Before initialization,
it's not legal to respond to requests.

跟踪 SW 是否处于初始化状态。在初始化之前，响应请求是不合法的。

A scheduler which manages a queue of tasks that need to be executed when the SW is
not doing any other work \(not processing any other requests\).

一种调度程序，它管理在 SW 不做任何其他工作（不处理任何其他请求）时需要执行的任务队列。

Delete caches that were used by older versions of `@angular/service-worker` to avoid running
into storage quota limitations imposed by browsers.
\(Since at this point the SW has claimed all clients, it is safe to remove those caches.\)

删除旧版 `@angular/service-worker` 使用的缓存，以避免遇到浏览器施加的存储配额限制。（由于此时
SW 已声明所有客户端，因此删除这些缓存是安全的。）

Determine if a specific version of the given resource is cached anywhere within the SW,
and fetch it if so.

确定给定资源的特定版本是否缓存在 SW 中的任何地方，如果是则获取它。