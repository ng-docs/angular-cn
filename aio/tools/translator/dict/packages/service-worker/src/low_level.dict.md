This event is only emitted by the deprecated {&commat;link SwUpdate#available}.
Use the {&commat;link VersionReadyEvent} instead, which is emitted by {&commat;link SwUpdate#versionUpdates}.
See {&commat;link SwUpdate#available} docs for an example.

此事件仅由已过时的 {&commat;link SwUpdate#available} 发出。改用 {&commat;link VersionReadyEvent}，它由 {&commat;link
SwUpdate#versionUpdates} 发出。有关示例，请参阅 {&commat;link SwUpdate#available} 文档。

An event emitted when a new version of the app is available.

有新版本的应用程序可用时发出的事件。

This event is only emitted by the deprecated {&commat;link SwUpdate#activated}.
Use the return value of {&commat;link SwUpdate#activateUpdate} instead.

此事件仅由已过时的 {&commat;link SwUpdate#activated} 发出。改用 {&commat;link SwUpdate#activateUpdate}
的返回值。

An event emitted when a new version of the app has been downloaded and activated.

下载并激活新版本的应用程序时发出的事件。

An event emitted when the service worker has checked the version of the app on the server and it
didn't find a new version that it doesn't have already downloaded.

当服务工作人员检查了服务器上应用程序的版本并且没有找到尚未下载的新版本时发出的事件。

An event emitted when the service worker has detected a new version of the app on the server and
is about to start downloading it.

当 Service Worker 在服务器上检测到应用程序的新版本并即将开始下载时发出的事件。

An event emitted when the installation of a new version failed.
It may be used for logging/monitoring purposes.

新版本安装失败时发出的事件。它可用于日志/监控目的。

A union of all event types that can be emitted by
{&commat;link api/service-worker/SwUpdate#versionUpdates SwUpdate#versionUpdates}.

{&commat;link api/service-worker/SwUpdate#versionUpdates SwUpdate#versionUpdates}
可以发出的所有事件类型的联合。

An event emitted when the version of the app used by the service worker to serve this client is
in a broken state that cannot be recovered from and a full page reload is required.

当 Service Worker
用来为此客户端提供服务的应用程序版本处于无法恢复的损坏状态并且需要重新加载整页时发出的事件。

For example, the service worker may not be able to retrieve a required resource, neither from the
cache nor from the server. This could happen if a new version is deployed to the server and the
service worker cache has been partially cleaned by the browser, removing some files of a previous
app version but not all.

例如，服务工作者可能无法从缓存或服务器中检索所需的资源。如果将新版本部署到服务器并且浏览器已部分清除
Service Worker 缓存（删除了以前应用程序版本的某些文件，但不是全部），可能会发生这种情况。

An event emitted when a `PushEvent` is received by the service worker.

服务工作者收到 `PushEvent` 时发出的事件。