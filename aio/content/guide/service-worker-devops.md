# Service worker in production

# 生产环境下的 Service Worker

This page is a reference for deploying and supporting production applications that use the Angular service worker.
It explains how the Angular service worker fits into the larger production environment, the service worker's behavior under various conditions, and available resources and fail-safes.

本页讲的是如何使用 Angular Service Worker 发布和支持生产环境下的应用。它解释了 Angular Service Worker 如何满足大规模生产环境的需求、Service Worker 在多种条件下有哪些行为以及有哪些可用的资源和故障保护机制。

## Prerequisites

## 前提条件

A basic understanding of the following:

对下列知识有基本的了解：

* [Service Worker Communication](guide/service-worker-communications)

  [与 Service Worker 通讯](guide/service-worker-communications).

## Service worker and caching of application resources

Imagine the Angular service worker as a forward cache or a Content Delivery Network (CDN) edge that is installed in the end user's web browser.
The service worker responds to requests made by the Angular application for resources or data from a local cache, without needing to wait for the network.
Like any cache, it has rules for how content is expired and updated.

<a id="versions"></a>

### Application versions

In the context of an Angular service worker, a "version" is a collection of resources that represent a specific build of the Angular application.
Whenever a new build of the application is deployed, the service worker treats that build as a new version of the application.
This is true even if only a single file is updated.
At any given time, the service worker might have multiple versions of the application in its cache and it might be serving them simultaneously.
For more information, see the [Application tabs](guide/service-worker-devops#tabs) section.

To preserve application integrity, the Angular service worker groups all files into a version together.
The files grouped into a version usually include HTML, JS, and CSS files.
Grouping of these files is essential for integrity because HTML, JS, and CSS files frequently refer to each other and depend on specific content.
For example, an `index.html` file might have a `<script>` tag that references `bundle.js` and it might attempt to call a function `startApp()` from within that script.
Any time this version of `index.html` is served, the corresponding `bundle.js` must be served with it.
For example, assume that the `startApp()` function is renamed to `runApp()` in both files.
In this scenario, it is not valid to serve the old `index.html`, which calls `startApp()`, along with the new bundle, which defines `runApp()`.

要保持应用的整体性，Angular Service Worker 会用所有的文件共同组成一个版本。组成版本的这些文件通常包括 HTML、JS 和 CSS 文件。把这些文件分成一组是至关重要的，因为它们会互相引用，并且依赖于一些特定内容。比如，`index.html` 文件可能有个引用 `bundle.js` 的 `<script>` 标签，它可能会试图从这个脚本中调用一个 `startApp()` 函数。任何时候，只要这个版本的 `index.html` 被提供了，与它对应的 `bundle.js` 也必须同时提供。这种情况下，使用调用了 `startApp()` 的老的 `index.html` 并同时使用定义了 `runApp()` 的新 bundle 就是无效的。

This file integrity is especially important when lazy loading modules.
A JS bundle might reference many lazy chunks, and the filenames of the lazy chunks are unique to the particular build of the application.
If a running application at version `X` attempts to load a lazy chunk, but the server has already updated to version `X + 1`, the lazy loading operation fails.

The version identifier of the application is determined by the contents of all resources, and it changes if any of them change.
In practice, the version is determined by the contents of the `ngsw.json` file, which includes hashes for all known content.
If any of the cached files change, the file's hash changes in `ngsw.json`. This change causes the Angular service worker to treat the active set of files as a new version.

<div class="alert is-helpful">

The build process creates the manifest file, `ngsw.json`, using information from `ngsw-config.json`.

</div>

With the versioning behavior of the Angular service worker, an application server can ensure that the Angular application always has a consistent set of files.

借助 Angular Service Worker 的这种版本控制行为，应用服务器就可以确保这个 Angular 应用中的这组文件始终保持一致。

#### Update checks

#### 更新检测

Every time the user opens or refreshes the application, the Angular service worker checks for updates to the application by looking for updates to the `ngsw.json` manifest.
If an update is found, it is downloaded and cached automatically, and is served the next time the application is loaded.

### Resource integrity

### 资源整体性

One of the potential side effects of long caching is inadvertently caching a resource that's not valid.
In a normal HTTP cache, a hard refresh or the cache expiring limits the negative effects of caching a file that's not valid.
A service worker ignores such constraints and effectively long-caches the entire application.
It's important that the service worker gets the correct content, so it keeps hashes of the resources to maintain their integrity.

#### Hashed content

To ensure resource integrity, the Angular service worker validates the hashes of all resources for which it has a hash.
For an application created with the [Angular CLI](cli), this is everything in the `dist` directory covered by the user's `src/ngsw-config.json` configuration.

If a particular file fails validation, the Angular service worker attempts to re-fetch the content using a "cache-busting" URL parameter to prevent browser or intermediate caching.
If that content also fails validation, the service worker considers the entire version of the application to not be valid and stops serving the application.
If necessary, the service worker enters a safe mode where requests fall back on the network. The service worker doesn't use its cache if there's a high risk of serving content that is broken, outdated, or not valid.

Hash mismatches can occur for a variety of reasons:

导致哈希值不匹配的原因有很多：

* Caching layers between the origin server and the end user could serve stale content

* A non-atomic deployment could result in the Angular service worker having visibility of partially updated content

  非原子化的部署可能会导致 Angular Service Worker 看到部分更新后的内容。

* Errors during the build process could result in updated resources without `ngsw.json` being updated.
  The reverse could also happen resulting in an updated `ngsw.json` without updated resources.

  构建过程中的错误可能会导致更新了资源，却没有更新 `ngsw.json`。反之，也可能发生没有更新资源，却更新了 `ngsw.json` 的情况。

#### Unhashed content

#### 不带哈希的内容

The only resources that have hashes in the `ngsw.json` manifest are resources that were present in the `dist` directory at the time the manifest was built.
Other resources, especially those loaded from CDNs, have content that is unknown at build time or are updated more frequently than the application is deployed.

`ngsw.json` 清单中唯一带哈希值的资源就是构建清单时 `dist` 目录中的资源。而其它资源，特别是从 CDN 加载的资源，其内容在构建时是未知的，或者会比应用程序部署得更频繁。

If the Angular service worker does not have a hash to verify a resource is valid, it still caches its contents. At the same time, it honors the HTTP caching headers by using a policy of *stale while revalidate*.
The Angular service worker continues to serve a resource even after its HTTP caching headers indicate
that it is no longer valid. At the same time, it attempts to refresh the expired resource in the background.
This way, broken unhashed resources do not remain in the cache beyond their configured lifetimes.

<a id="tabs"></a>

### Application tabs

It can be problematic for an application if the version of resources it's receiving changes suddenly or without warning.
See the [Application versions](guide/service-worker-devops#versions) section for a description of such issues.

The Angular service worker provides a guarantee: a running application continues to run the same version of the application.
If another instance of the application is opened in a new web browser tab, then the most current version of the application is served.
As a result, that new tab can be running a different version of the application than the original tab.

<div class="alert is-important">

**IMPORTANT**: <br />
This guarantee is **stronger** than that provided by the normal web deployment model.
Without a service worker, there is no guarantee that lazily loaded code is from the same version as the application's initial code.

</div>

The Angular service worker might change the version of a running application under error conditions such as:

* The current version becomes non-valid due to a failed hash

* An unrelated error causes the service worker to enter safe mode and deactivates it temporarily

The Angular service worker cleans up application versions when no tab is using them.

Other reasons the Angular service worker might change the version of a running application are normal events:

另一些可能导致 Angular Service Worker 在运行期间改变版本的因素是一些正常事件：

* The page is reloaded/refreshed

  页面被重新加载/刷新。

* The page requests an update be immediately activated using the `SwUpdate` service

  该页面通过 `SwUpdate` 服务请求立即激活这个更新。

### Service worker updates

### Service Worker 更新

The Angular service worker is a small script that runs in web browsers.
From time to time, the service worker is updated with bug fixes and feature improvements.

The Angular service worker is downloaded when the application is first opened and when the application is accessed after a period of inactivity.
If the service worker changes, it's updated in the background.

Most updates to the Angular service worker are transparent to the application. The old caches are still valid and content is still served normally.
Occasionally, a bug fix or feature in the Angular service worker might require the invalidation of old caches.
In this case, the service worker transparently refreshes the application from the network.

### Bypassing the service worker

### 绕过 Service Worker

In some cases, you might want to bypass the service worker entirely and let the browser handle the request.
An example is when you rely on a feature that is currently not supported in service workers, such as [reporting progress on uploaded files](https://github.com/w3c/ServiceWorker/issues/1141).

To bypass the service worker, set `ngsw-bypass` as a request header, or as a query parameter.
The value of the header or query parameter is ignored and can be empty or omitted.

要想绕过 Service Worker，你可以设置一个名叫 `ngsw-bypass` 的请求头或查询参数。（这个请求头或查询参数的值会被忽略，可以把它设为空字符串或略去。）。

### Service worker requests when the server can't be reached

The service worker processes all requests unless the [service worker is explicitly bypassed](#bypassing-the-service-worker).
The service worker either returns a cached response or sends the request to the server, depending on the state and configuration of the cache. 
The service worker only caches responses to non-mutating requests, such as `GET` and `HEAD`.

If the service worker receives an error from the server or it doesn't receive a response, it returns an error status that indicates the result of the call.
For example, if the service worker doesn't receive a response, it creates a [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) status to return. The `504` status in this example could be returned because the server is offline or the client is disconnected.

## Debugging the Angular service worker

## 调试 Angular Service Worker

Occasionally, it might be necessary to examine the Angular service worker in a running state to investigate issues or whether it's operating as designed.
Browsers provide built-in tools for debugging service workers and the Angular service worker itself includes useful debugging features.

### Locating and analyzing debugging information

### 定位并分析调试信息

The Angular service worker exposes debugging information under the `ngsw/` virtual directory.
Currently, the single exposed URL is `ngsw/state`.
Here is an example of this debug page's contents:

Angular Service Worker 会在虚拟目录 `ngsw/` 下暴露出调试信息。目前，它暴露的唯一的 URL 是 `ngsw/state`。下面是这个调试页面中的一段范例内容：

<code-example format="output" hideCopy language="shell">

NGSW Debug Info:

Driver version: 13.3.7
Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 &ast; init post-load (update, cleanup)

Debug log:

</code-example>

#### Driver state

#### 驱动程序的状态

The first line indicates the driver state:

第一行表示驱动程序的状态：

<code-example format="output" hideCopy language="shell">

Driver state: NORMAL ((nominal))

</code-example>

`NORMAL` indicates that the service worker is operating normally and is not in a degraded state.

`NORMAL` 表示这个 Service Worker 正在正常运行，并且没有处于降级运行的状态。

There are two possible degraded states:

有两种可能的降级状态：

| Degraded states | Details |
| :-------------- | :------ |
| 降级状态 | 详情 |
| `EXISTING_CLIENTS_ONLY` | The service worker does not have a clean copy of the latest known version of the application. Older cached versions are safe to use, so existing tabs continue to run from cache, but new loads of the application will be served from the network. The service worker will try to recover from this state when a new version of the application is detected and installed. This happens when a new `ngsw.json` is available. |
| `SAFE_MODE` | The service worker cannot guarantee the safety of using cached data. Either an unexpected error occurred or all cached versions are invalid. All traffic will be served from the network, running as little service worker code as possible. |
| `SAFE_MODE` | Service Worker 不能保证使用缓存数据的安全性。发生了意外错误或所有缓存版本都无效。这时所有的流量都将从网络提供，尽量少运行 Service Worker 中的代码。 |

In both cases, the parenthetical annotation provides the
error that caused the service worker to enter the degraded state.

在这两种情况下，后面的括号注解中都会提供导致 Service Worker 进入降级状态的错误信息。

Both states are temporary; they are saved only for the lifetime of the [ServiceWorker instance](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope).
The browser sometimes terminates an idle service worker to conserve memory and processor power, and creates a new service worker instance in response to network events.
The new instance starts in the `NORMAL` mode, regardless of the state of the previous instance.

这两种状态都是暂时的；它们仅在 [ServiceWorker 实例](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope) 的生命周期内保存。 浏览器有时会终止空闲的 Service Worker，以节省内存和处理能力，并创建一个新的 Service Worker 实例来响应网络事件。 无论先前实例的状态如何，新实例均以 `NORMAL` 模式启动。

#### Latest manifest hash

#### 最新清单的哈希

<code-example format="output" hideCopy language="shell">

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

</code-example>

This is the SHA1 hash of the most up-to-date version of the application that the service worker knows about.

这是 Service Worker 所知道的应用最新版本的 SHA1 哈希值。

#### Last update check

#### 最后一次更新检查

<code-example format="output" hideCopy language="shell">

Last update check: never

</code-example>

This indicates the last time the service worker checked for a new version, or update, of the application.
`never` indicates that the service worker has never checked for an update.

这表示 Service Worker 最后一次检查应用程序的新版本或更新的时间。“never” 表示 Service Worker 从未检查过更新。

In this example debug file, the update check is currently scheduled, as explained the next section.

在这个调试文件范例中，这次更新检查目前是已排期的，如下一节所述。

#### Version

#### 版本

<code-example format="output" hideCopy language="shell">

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

</code-example>

In this example, the service worker has one version of the application cached and being used to serve two different tabs.

在这个例子中，Service Worker 拥有一个版本的应用程序缓存并用它服务于两个不同的选项卡。

<div class="alert is-helpful">

**NOTE**: <br />
This version hash is the "latest manifest hash" listed above.
Both clients are on the latest version.
Each client is listed by its ID from the `Clients` API in the browser.

</div>

#### Idle task queue

#### 空闲任务队列

<code-example format="output" hideCopy language="shell">

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 &ast; init post-load (update, cleanup)

</code-example>

The Idle Task Queue is the queue of all pending tasks that happen in the background in the service worker.
If there are any tasks in the queue, they are listed with a description.
In this example, the service worker has one such task scheduled, a post-initialization operation involving an update check and cleanup of stale caches.

空闲任务队列是 Service Worker 中所有在后台发生的未决任务的队列。如果这个队列中存在任何任务，则列出它们的描述。在这个例子中，Service Worker 安排的任务是一个用于更新检查和清除过期缓存的后期初始化操作。

The last update tick/run counters give the time since specific events happened related to the idle queue.
The "Last update run" counter shows the last time idle tasks were actually executed.
"Last update tick" shows the time since the last event after which the queue might be processed.

最后的 tick/run 计数器给出了与特定事件发生有关的空闲队列中的时间。“Last update run” 计数器显示的是上次执行空闲任务的时间。“Last update tick” 显示的是自上次事件以来可能要处理的队列的时间。

#### Debug log

#### 调试日志

<code-example format="output" hideCopy language="shell">

Debug log:

</code-example>

Errors that occur within the service worker are logged here.

### Developer tools

### 开发者工具

Browsers such as Chrome provide developer tools for interacting with service workers.
Such tools can be powerful when used properly, but there are a few things to keep in mind.

Chrome 等浏览器提供了能与 Service Worker 交互的开发者工具。这些工具在使用得当时非常强大，但也要牢记一些事情。

* When using developer tools, the service worker is kept running in the background and never restarts.
  This can cause behavior with Dev Tools open to differ from behavior a user might experience.

  使用开发人员工具时，Service Worker 将继续在后台运行，并且不会重新启动。这可能会导致开着 Dev Tools 时的行为与用户实际遇到的行为不一样。

* If you look in the Cache Storage viewer, the cache is frequently out of date.
  Right-click the Cache Storage title and refresh the caches.

  如果你查看缓存存储器的查看器，缓存就会经常过期。右键单击缓存存储器的标题并刷新缓存。

* Stopping and starting the service worker in the Service Worker pane checks for updates

## Service worker safety

## Service Worker 的安全性

Bugs or broken configurations could cause the Angular service worker to act in unexpected ways.
If this happens, the Angular service worker contains several failsafe mechanisms in case an administrator needs to deactivate the service worker quickly.

### Fail-safe

### 故障保护机制

To deactivate the service worker, rename the `ngsw.json` file or delete it.
When the service worker's request for `ngsw.json` returns a `404`, then the service worker removes all its caches and de-registers itself, essentially self-destructing.

### Safety worker

<!-- vale Angular.Google_Acronyms = NO -->

A small script, `safety-worker.js`, is also included in the `@angular/service-worker` NPM package.
When loaded, it un-registers itself from the browser and removes the service worker caches.
This script can be used as a last resort to get rid of unwanted service workers already installed on client pages.

<!-- vale Angular.Google_Acronyms = YES -->

<div class="alert is-important">

**IMPORTANT**: <br />
You cannot register this worker directly, as old clients with cached state might not see a new `index.html` which installs the different worker script.

</div>

Instead, you must serve the contents of `safety-worker.js` at the URL of the Service Worker script you are trying to unregister. You must continue to do so until you are certain all users have successfully unregistered the old worker.
For most sites, this means that you should serve the safety worker at the old Service Worker URL forever.
This script can be used to deactivate `@angular/service-worker` and remove the corresponding caches. It also removes any other Service Workers which might have been served in the past on your site.

### Changing your application's location

<div class="alert is-important">

**IMPORTANT**: <br />
Service workers don't work behind redirect.
You might have already encountered the error `The script resource is behind a redirect, which is disallowed`.

</div>

This can be a problem if you have to change your application's location.
If you set up a redirect from the old location, such as `example.com`, to the new location, `www.example.com` in this example, the worker stops working.
Also, the redirect won't even trigger for users who are loading the site entirely from Service Worker.
The old worker, which was registered at `example.com`, tries to update and sends a request to the old location `example.com`. This request is redirected to the new location `www.example.com` and creates the error: `The script resource is behind a redirect, which is disallowed`.

To remedy this, you might need to deactivate the old worker using one of the preceding techniques: [Fail-safe](#fail-safe) or [Safety Worker](#safety-worker).

## More on Angular service workers

## 关于 Angular Service Worker 的更多信息

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Service Worker Configuration](guide/service-worker-config)

  [Service Worker 配置](guide/service-worker-config)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28