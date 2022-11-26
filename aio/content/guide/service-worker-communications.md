# Service worker communication

# 与 Service Worker 通讯

Importing `ServiceWorkerModule` into your `AppModule` doesn't just register the service worker, it also provides a few services you can use to interact with the service worker and control the caching of your application.

把 `ServiceWorkerModule` 导入到你的 `AppModule` 中不仅会注册 Service Worker，还会提供一些服务，让你能和 Service Worker 通讯，并控制你的应用缓存。

## Prerequisites

## 前提条件

A basic understanding of the following:

对下列知识有基本的了解：

* [Getting Started with Service Workers](guide/service-worker-getting-started)

  [Service Worker 快速上手](guide/service-worker-getting-started)。

## `SwUpdate` service

## `SwUpdate` 服务

The `SwUpdate` service gives you access to events that indicate when the service worker discovers and installs an available update for your application.

`SwUpdate` 服务让你能访问一些事件，这些事件会指出 Service Worker 何时发现并安装了可用的更新

The `SwUpdate` service supports three separate operations:

`SwUpdate` 服务支持四个独立的操作：

* Get notified when an updated version is *detected* on the server, *installed and ready* to be used locally or when an *installation fails*

  当在服务器上*检测到*新版本、已安装并可本地使用或安装失败时获得通知

* Ask the service worker to check the server for new updates

  要求 Service Worker 检查服务器上是否有更新。

* Ask the service worker to activate the latest version of the application for the current tab

  要求 Service Worker 为当前标签页激活应用的最新版本

### Version updates

### 版本更新

The `versionUpdates` is an `Observable` property of `SwUpdate` and emits four event types:

`versionUpdates` 是 `SwUpdate` 的一个 `Observable` 属性，并且会发出四种事件类型：

| Event types | Details |
| :---------- | :------ |
| 事件类型 | 详情 |
| `VersionDetectedEvent` | Emitted when the service worker has detected a new version of the app on the server and is about to start downloading it. |
| `VersionDetectedEvent` | 当 Service Worker 在服务器上检测到应用程序的新版本并即将开始下载时发出。 |
| `NoNewVersionDetectedEvent` | Emitted when the service worker has checked the version of the app on the server and did not find a new version. |
| `NoNewVersionDetectedEvent` | 当 Service Worker 检查了服务器上应用程序的版本并且没有找到新版本时发出。 |
| `VersionReadyEvent` | Emitted when a new version of the app is available to be activated by clients. It may be used to notify the user of an available update or prompt them to refresh the page. |
| `VersionReadyEvent` | 当有新版本的应用程序可供客户端激活时发出。它可用于通知用户可用的更新或提示他们刷新页面。 |
| `VersionInstallationFailedEvent` | Emitted when the installation of a new version failed. It may be used for logging/monitoring purposes. |
| `VersionInstallationFailedEvent` | 在新版本安装失败时发出。它可用于日志/监控目的。 |

<code-example header="log-update.service.ts" path="service-worker-getting-started/src/app/log-update.service.ts" region="sw-update"></code-example>

### Checking for updates

### 检查更新

It's possible to ask the service worker to check if any updates have been deployed to the server.
The service worker checks for updates during initialization and on each navigation request —that is, when the user navigates from a different address to your application.
However, you might choose to manually check for updates if you have a site that changes frequently or want updates to happen on a schedule.

可以要求 Service Worker 检查是否有任何更新已经发布到了服务器上。Service Worker 会在初始化和每次导航请求（也就是用户导航到应用中的另一个地址）时检查更新。不过，如果你的站点更新非常频繁，或者需要按计划进行更新，你可能会选择手动检查更新。

Do this with the `checkForUpdate()` method:

通过调用 `checkForUpdate()` 方法来实现：

<code-example header="check-for-update.service.ts" path="service-worker-getting-started/src/app/check-for-update.service.ts"></code-example>

This method returns a `Promise<boolean>` which indicates if an update is available for activation.
The check might fail, which will cause a rejection of the `Promise`.

该方法返回一个用来表示检查更新已经成功完成的 `Promise<boolean>`。这种检查可能会失败，它会导致此 `Promise` 被拒绝（reject）。

<div class="alert is-important">

In order to avoid negatively affecting the initial rendering of the page, `ServiceWorkerModule` waits for up to 30 seconds by default for the application to stabilize, before registering the ServiceWorker script.
Constantly polling for updates, for example, with [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) or RxJS' [interval()](https://rxjs.dev/api/index/function/interval), prevents the application from stabilizing and the ServiceWorker script is not registered with the browser until the 30 seconds upper limit is reached.

为了避免影响页面的首次渲染，在注册 ServiceWorker 脚本之前，`ServiceWorkerModule` 默认会在应用程序达到稳定态之前等待最多 30 秒。如果不断轮询更新（比如调用 [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 或 RxJS 的 [interval()](https://rxjs.dev/api/index/function/interval)）就会阻止应用程序达到稳定态，则直到 30 秒结束之前都不会往浏览器中注册 ServiceWorker 脚本。

<div class="alert is-helpful">

**NOTE**: <br />
This is true for any kind of polling done by your application.
Check the [isStable](api/core/ApplicationRef#isStable) documentation for more information.

**注意**：<br />
应用中所执行的各种轮询都会阻止它达到稳定态。欲知详情，参阅 [isStable](api/core/ApplicationRef#isStable) 文档。

</div>

Avoid that delay by waiting for the application to stabilize first, before starting to poll for updates, as shown in the preceding example.
Alternatively, you might want to define a different [registration strategy](api/service-worker/SwRegistrationOptions#registrationStrategy) for the ServiceWorker.

可以通过在开始轮询更新之前先等应用达到稳定态来消除这种延迟，如上述例子所示。另外，你还可以为 ServiceWorker 定义不一样的 [注册策略](api/service-worker/SwRegistrationOptions#registrationStrategy)。

</div>

### Updating to the latest version

### 升级到最新版本

You can update an existing tab to the latest version by reloading the page as soon as a new version is ready.
To avoid disrupting the user's progress, it is generally a good idea to prompt the user and let them confirm that it is OK to reload the page and update to the latest version:

<code-example header="prompt-update.service.ts" path="service-worker-getting-started/src/app/prompt-update.service.ts" region="sw-version-ready"></code-example>

<div class="alert is-important">

Calling {@link SwUpdate#activateUpdate SwUpdate#activateUpdate()} updates a tab to the latest version without reloading the page, but this could break the application.

Updating without reloading can create a version mismatch between the [application shell](guide/glossary#app-shell) and other page resources, such as [lazy-loaded chunks](guide/glossary#lazy-loading), whose filenames may change between versions.

You should only use `activateUpdate()`, if you are certain it is safe for your specific use case.

如果调用 `activateUpdate()` 而不刷新页面，可能会破坏正在运行的应用中的惰性加载模块，特别是如果惰性加载的模块文件名中使用了哈希时，就会改变每一个版本。所以，建议每当 `activateUpdate()` 返回的 Promise 被解析时，都刷新一次页面。

</div>

### Handling an unrecoverable state

### 处理不可恢复的状态

In some cases, the version of the application used by the service worker to serve a client might be in a broken state that cannot be recovered from without a full page reload.

在某些情况下，Service Worker 用来为客户端提供服务的应用版本可能处于损坏状态，如果不重新加载整个页面，则无法恢复该状态。

For example, imagine the following scenario:

比如，设想以下情形：

* A user opens the application for the first time and the service worker caches the latest version of the application.
  Assume the application's cached assets include `index.html`, `main.<main-hash-1>.js` and `lazy-chunk.<lazy-hash-1>.js`.

  用户首次打开该应用，Service Worker 会缓存该应用的最新版本。假设应用要缓存的资源包括 `index.html`、`main.<main-hash-1>.js` 和 `lazy-chunk.<lazy-hash-1>.js`。

* The user closes the application and does not open it for a while.

  用户关闭该应用程序，并且有一段时间没有打开它。

* After some time, a new version of the application is deployed to the server.
  This newer version includes the files `index.html`, `main.<main-hash-2>.js` and `lazy-chunk.<lazy-hash-2>.js`.

  一段时间后，会将新版本的应用程序部署到服务器。新版本中包含文件 `index.html`、`main.<main-hash-2>.js` 和 `lazy-chunk.<lazy-hash-2>.js`。

  <div class="alert is-helpful">

  **NOTE**: <br />
  The hashes are different now, because the content of the files changed.

  **注意**：<br />
  哈希值现在已经不同了，因为文件的内容已经改变）。服务器上不再提供旧版本。

  </div>

  The old version is no longer available on the server.

  旧版本在服务器上不再可用。

* In the meantime, the user's browser decides to evict `lazy-chunk.<lazy-hash-1>.js` from its cache.
  Browsers might decide to evict specific (or all) resources from a cache in order to reclaim disk space.

  同时，用户的浏览器决定从其缓存中清退 `lazy-chunk.<lazy-hash-1>.js` 浏览器可能决定从缓存中清退特定（或所有）资源，以便回收磁盘空间。

* The user opens the application again.
  The service worker serves the latest version known to it at this point, namely the old version (`index.html` and `main.<main-hash-1>.js`).

  用户再次打开本应用。此时，Service Worker 将提供它所知的最新版本，当然，实际上对我们是旧版本（`index.html` 和 `main.<main-hash-1>.js`）。

* At some later point, the application requests the lazy bundle, `lazy-chunk.<lazy-hash-1>.js`.

  在稍后的某个时刻，该应用程序请求惰性捆绑包 `lazy-chunk.<lazy-hash-1>.js`。

* The service worker is unable to find the asset in the cache (remember that the browser evicted it).
  Nor is it able to retrieve it from the server (because the server now only has `lazy-chunk.<lazy-hash-2>.js` from the newer version).

  Service Worker 无法在缓存中找到该资产（请记住浏览器已经将其清退了）。它也无法从服务器上获取它（因为服务器现在只有较新版本的 `lazy-chunk.<lazy-hash-2>.js`）。

In the preceding scenario, the service worker is not able to serve an asset that would normally be cached.
That particular application version is broken and there is no way to fix the state of the client without reloading the page.
In such cases, the service worker notifies the client by sending an `UnrecoverableStateEvent` event.
Subscribe to `SwUpdate#unrecoverable` to be notified and handle these errors.

在上述情况下，Service Worker 将无法提供通常会被缓存的资产。该特定的应用程序版本已损坏，并且无法在不重新加载页面的情况下修复客户端的状态。在这种情况下，Service Worker 会通过发送 `UnrecoverableStateEvent` 事件来通知客户端。可以订阅 `SwUpdate#unrecoverable` 以得到通知并处理这些错误。

<code-example header="handle-unrecoverable-state.service.ts" path="service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" region="sw-unrecoverable-state"></code-example>

## More on Angular service workers

## 关于 Angular Service Worker 的更多信息

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Service Worker Notifications](guide/service-worker-notifications)

  [Service Worker 通知](guide/service-worker-notifications)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28