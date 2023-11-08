*Internal* service that keeps track of pending tasks happening in the system
during the initial rendering. No tasks are tracked after an initial
rendering.

跟踪初始渲染期间系统中发生的未决任务的*内部*服务。初始渲染后不会跟踪任何任务。

This information is needed to make sure that the serialization on the server
is delayed until all tasks in the queue \(such as an initial navigation or a
pending HTTP request\) are completed.

需要此信息来确保服务器上的序列化延迟到队列中的所有任务（例如初始导航或挂起的 HTTP 请求）完成后。