# Service worker configuration

# Service Worker 配置

## Prerequisites

## 前提条件

A basic understanding of the following:

对下列知识有基本的了解：

* [Service Worker in Production](guide/service-worker-devops)

  [生产环境下的 Service Worker](guide/service-worker-devops)。

The `ngsw-config.json` configuration file specifies which files and data URLs the Angular service worker should cache and how it should update the cached files and data.
The [Angular CLI](cli) processes the configuration file during `ng build`.
Manually, process it with the `ngsw-config` tool (where `<project-name>` is the name of the project being built):

配置文件 `ngsw-config.json` 指定了 Angular Service Worker 应该缓存哪些文件和数据的 URL，以及如何更新缓存的文件和数据。[Angular CLI](cli) 会在 `ng build` 期间处理配置文件。如果想手动处理，可以用 `ngsw-config` 工具（这里的 `<project-name>` 就是要构建的项目名）：

<code-example format="shell" language="shell">

./node_modules/.bin/ngsw-config ./dist/&lt;project-name&gt; ./ngsw-config.json [/base/href]

</code-example>

The configuration file uses the JSON format.
All file paths must begin with `/`, which corresponds to the deployment directory —usually `dist/<project-name>` in CLI projects.

该配置文件使用 JSON 格式。所有文件路径都必须以 `/` 开头，也就是相应的部署目录 —— 在 CLI 项目中的它通常是 `dist/<project-name>`。

<a id="glob-patterns"></a>

Unless otherwise commented, patterns use a **limited\*** glob format that internally will be converted into regex:

除非另有注释，否则模式使用**limited\*** glob 格式，该格式将在内部转换为正则表达式：

| Glob formats | Details |
| :----------- | :------ |
| Glob 格式 | 详情 |
| `**` | Matches 0 or more path segments |
| `**` | 匹配 0 个或多个路径段 |
| `*` | Matches 0 or more characters excluding `/` |
| `*` | 匹配不包括 `/` 的 0 个或多个字符 |
| `?` | Matches exactly one character excluding `/` |
| `?` | 正好匹配不包括 `/` 的一个字符 |
| `!` prefix | Marks the pattern as being negative, meaning that only files that don't match the pattern are included |
| `!` 前缀 | 将模式标记为负数，这意味着仅包含与模式不匹配的文件 |

<div class="alert is-helpful">

  **\*** Pay attention that some characters with a special meaning in a regular expression are not escaped and also the pattern is not wrapped in `^`/`$` in the internal glob to regex conversion.

**\***请注意，在内部 glob 到正则表达式的转换中，正则表达式中某些具有特殊含义的字符不会被转义，并且模式不会用 `^` / `$` 包装。

- `$` is a special character in regex that matches the end of the string and will not be automatically escaped when converting the glob pattern to a regular expression.
  If you want to literally match the `$` character, you have to escape it yourself (with `\\$`).

  `$` 是正则表达式中的一个特殊字符，它与字符串的结尾匹配，在将 glob 模式转换为正则表达式时不会自动转义。如果你想从字面上匹配 `$` 字符，则必须自己对它进行转译（使用 `\\$`）。

  <div class="alert is-important">

    For example, the glob pattern `/foo/bar/$value` results in an unmatchable expression, because it is impossible to have a string that has any characters after it has ended.

  例如，glob 模式 `/foo/bar/$value` 会导致出现无法匹配的表达式，因为字符串不可能在结尾后有任何字符。

  </div>

- The pattern will not be automatically wrapped in `^` and `$` when converting it to a regular expression.
  Therefore, the patterns will partially match the request URLs.
  If you want your patterns to match the beginning and/or end of URLs, you can add `^`/`$` yourself.

  将模式转换为正则表达式时，不会自动用 `^` 和 `$` 包装。因此，这些模式将部分匹配请求 URL。如果你希望你的模式匹配 URL 的开头和/或结尾，可以自己添加 `^` / `$`。

  <div class="alert is-important">

    For example, the glob pattern `/foo/bar/*.js` will match both `.js` and `.json` files.
    If you want to only match `.js` files, use `/foo/bar/*.js$`.

  例如，glob 模式 `/foo/bar/*.js` 将匹配 `.js` 和 `.json` 文件。如果你想仅匹配 `.js` 文件，请使用 `/foo/bar/*.js$`。

  </div>

</div>

Example patterns:

范例模式：

| Patterns | Details |
| :------- | :------ |
| 模式 | 详情 |
| `/**/*.html` | Specifies all HTML files |
| `/**/*.html` | 指定所有 HTML 文件 |
| `/*.html` | Specifies only HTML files in the root |
| `/*.html` | 仅指定根中的 HTML 文件 |
| `!/**/*.map` | Exclude all sourcemaps |
| `!/**/*.map` | 排除所有源映射 |

The following sections describe each property of the configuration file.

下面讲讲配置文件中的每个属性。

## `appData`

This section enables you to pass any data you want that describes this particular version of the application.
The `SwUpdate` service includes that data in the update notifications.
Many applications use this section to provide additional information for the display of UI popups, notifying users of the available update.

本节允许你传递用来描述这个特定应用版本的任何数据。`SwUpdate` 服务会在更新通知中包含这些数据。许多应用会使用本节来提供 UI 弹窗时要显示的附加信息，以通知用户有可用的更新。

<a id="index-file"></a>

## `index`

Specifies the file that serves as the index page to satisfy navigation requests.
Usually this is `/index.html`.

指定用来充当索引页的文件以满足导航请求。通常是 `/index.html`。

## `assetGroups`

*Assets* are resources that are part of the application version that update along with the application.
They can include resources loaded from the page's origin as well as third-party resources loaded from CDNs and other external URLs.
As not all such external URLs might be known at build time, URL patterns can be matched.

*资产（Assets）*是与应用一起更新的应用版本的一部分。它们可以包含从页面的同源地址加载的资源以及从 CDN 和其它外部 URL 加载的第三方资源。由于在构建时可能没法提前知道所有这些外部 URL，因此也可以指定 URL 的模式。

This field contains an array of asset groups, each of which defines a set of asset resources and the policy by which they are cached.

该字段包含一个资产组的数组，每个资产组中会定义一组资产资源和它们的缓存策略。

<code-example format="json" language="json">

{
  "assetGroups": [
    {
      &hellip;
    },
    {
      &hellip;
    }
  ]
}

</code-example>

<div class="alert is-helpful">

When the ServiceWorker handles a request, it checks asset groups in the order in which they appear in `ngsw-config.json`.
The first asset group that matches the requested resource handles the request.

当 ServiceWorker 处理请求时，它将按照资源组在 `ngsw-config.json` 中出现的顺序对其进行检查。与所请求的资源匹配的第一个资源组将处理该请求。

It is recommended that you put the more specific asset groups higher in the list.
For example, an asset group that matches `/foo.js` should appear before one that matches `*.js`.

建议将更具体的资源组放在列表中较高的位置。比如，与 `/foo.js` 匹配的资源组应出现在与 `*.js` 匹配的资源组之前。

</div>

Each asset group specifies both a group of resources and a policy that governs them.
This policy determines when the resources are fetched and what happens when changes are detected.

每个资产组都会指定一组资源和一个管理它们的策略。此策略用来决定何时获取资源以及当检测到更改时该怎么做。

Asset groups follow the Typescript interface shown here:

这些资产组会遵循下面的 Typescript 接口：

<code-example format="typescript" language="typescript">

interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    urls?: string[];
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}

</code-example>

### `name`

A `name` is mandatory.
It identifies this particular group of assets between versions of the configuration.

`name` 是强制性的。它用来标识该配置文件版本中这个特定的资产组。

### `installMode`

The `installMode` determines how these resources are initially cached.
The `installMode` can be either of two values:

`installMode` 决定了这些资源最初的缓存方式。`installMode` 可以取如下两个值之一：

| Values | Details |
| :----- | :------ |
| 值 | 详情 |
| `prefetch` | Tells the Angular service worker to fetch every single listed resource while it's caching the current version of the application. This is bandwidth-intensive but ensures resources are available whenever they're requested, even if the browser is currently offline. |
| `prefetch` | 要求 Angular Service Worker 在缓存当前版本的应用时要获取每一个列出的资源。这是个带宽密集型的模式，但可以确保这些资源在请求时可用，即使浏览器正处于离线状态。|
| `lazy` | Does not cache any of the resources up front. Instead, the Angular service worker only caches resources for which it receives requests. This is an on-demand caching mode. Resources that are never requested are not cached. This is useful for things like images at different resolutions, so the service worker only caches the correct assets for the particular screen and orientation. |
| `lazy` | `lazy` 不会预先缓存任何资源。相反，Angular Service Worker 只会缓存它收到请求的资源。这是一种按需缓存模式。永远不会请求的资源也永远不会被缓存。这对于像为不同分辨率提供的图片之类的资源很有用，那样 Service Worker 就只会为特定的屏幕和设备方向缓存正确的资源。|

Defaults to `prefetch`.

默认为 `prefetch`。

### `updateMode`

For resources already in the cache, the `updateMode` determines the caching behavior when a new version of the application is discovered.
Any resources in the group that have changed since the previous version are updated in accordance with `updateMode`.

对于已经存在于缓存中的资源，`updateMode` 会决定在发现了新版本应用后的缓存行为。
自上一版本以来更改过的所有组中资源都会根据 `updateMode` 进行更新。

对于已经存在于缓存中的资源，`updateMode` 会决定在发现了新版本应用后的缓存行为。自上一版本以来更改过的所有组中资源都会根据 `updateMode` 进行更新。

| Values | Details |
| :----- | :------ |
| 值 | 详情 |
| `prefetch` | Tells the service worker to download and cache the changed resources immediately. |
| `prefetch` | 要求 Service Worker 立即下载并缓存更新过的资源。|
| `lazy` | Tells the service worker to not cache those resources. Instead, it treats them as unrequested and waits until they're requested again before updating them. An `updateMode` of `lazy` is only valid if the `installMode` is also `lazy`. |
| `lazy` | `lazy` 要求 Service Worker 不要缓存这些资源，而是先把它们看作未被请求的，等到它们再次被请求时才进行更新。`lazy` 这个 `updateMode` 只有在 `installMode` 也同样是 `lazy` 时才有效。|

Defaults to the value `installMode` is set to.

其默认值为 `installMode` 的值。

### `resources`

This section describes the resources to cache, broken up into the following groups:

本节描述要缓存的资源，分为如下几组：

| Resource groups | Details |
| :-------------- | :------ |
| 资源组 | 详情 |
| `files` | Lists patterns that match files in the distribution directory. These can be single files or glob-like patterns that match a number of files. |
| `files` | `files` 列出了与 `dist` 目录中的文件相匹配的模式。它们可以是单个文件也可以是能匹配多个文件的类似 glob 的模式。|
| `urls` | Includes both URLs and URL patterns that are matched at runtime. These resources are not fetched directly and do not have content hashes, but they are cached according to their HTTP headers. This is most useful for CDNs such as the Google Fonts service. <br />  *(Negative glob patterns are not supported and `?` will be matched literally; that is, it will not match any character other than `?`.)* |
| `urls` | 包括要在运行时进行匹配的 URL 和 URL 模式。这些资源不是直接获取的，也没有内容散列，但它们会根据 HTTP 标头进行缓存。 这对于像 Google Fonts 服务这样的 CDN 非常有用。<br> **（不支持 glob 的逆模式，`?` 将会按字面匹配；也就是说它不会匹配除了 `?` 之外的任何字符。）** |

### `cacheQueryOptions`

These options are used to modify the matching behavior of requests.
They are passed to the browsers `Cache#match` function.
See [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match) for details.
Currently, only the following options are supported:

这些选项用来修改对请求进行匹配的行为。它们会传给浏览器的 `Cache#match` 函数。详情参阅 [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match)。目前，只支持下列选项：

| Options | Details |
| :------ | :------ |
| 选项 | 详情 |
| `ignoreSearch` | Ignore query parameters. Defaults to `false`. |
| `ignoreSearch` | 忽略查询参数。默认为 `false`。|

## `dataGroups`

Unlike asset resources, data requests are not versioned along with the application.
They're cached according to manually-configured policies that are more useful for situations such as API requests and other data dependencies.

与这些资产性（asset）资源不同，数据请求不会随应用一起版本化。它们会根据手动配置的策略进行缓存，这些策略对 API 请求和所依赖的其它数据等情况会更有用。

This field contains an array of data groups, each of which defines a set of data resources and the policy by which they are cached.

本字段包含一个数据组的数组，其中的每一个条目都定义了一组数据资源以及对它们的缓存策略。

<code-example format="json" language="json">

{
  "dataGroups": [
    {
      &hellip;
    },
    {
      &hellip;
    }
  ]
}

</code-example>

<div class="alert is-helpful">

When the ServiceWorker handles a request, it checks data groups in the order in which they appear in `ngsw-config.json`.
The first data group that matches the requested resource handles the request.

当 ServiceWorker 处理请求时，它将按照数据组在 `ngsw-config.json` 中出现的顺序对其进行检查。与所请求的资源匹配的第一个数据组将处理该请求。

It is recommended that you put the more specific data groups higher in the list.
For example, a data group that matches `/api/foo.json` should appear before one that matches `/api/*.json`.

建议将更具体的数据组放在列表中较高的位置。比如，与 `/api/foo.json` 匹配的数据组应出现在与 `/api/*.json` 匹配的数据组之前。

</div>

Data groups follow this Typescript interface:

数据组遵循下列 TypeScript 接口：

<code-example format="typescript" language="typescript">

export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    strategy?: 'freshness' &verbar; 'performance';
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}

</code-example>

### `name`

Similar to `assetGroups`, every data group has a `name` which uniquely identifies it.

和 `assetGroups` 下类似，每个数据组也都有一个 `name`，用作它的唯一标识。

### `urls`

A list of URL patterns.
URLs that match these patterns are cached according to this data group's policy.
Only non-mutating requests (GET and HEAD) are cached.

一个 URL 模式的列表。匹配这些模式的 URL 将会根据该数据组的策略进行缓存。只有非修改型的请求（GET 和 HEAD）才会进行缓存。

* Negative glob patterns are not supported

  （不支持 glob 中的否定模式）。

* `?` is matched literally; that is, it matches *only* the character `?`

  `?` 只做字面匹配，也就是说，它*只*能匹配 `?` 字符。

### `version`

Occasionally APIs change formats in a way that is not backward-compatible.
A new version of the application might not be compatible with the old API format and thus might not be compatible with existing cached resources from that API.

API 有时可能会以不向后兼容的方式更改格式。新版本的应用可能与旧的 API 格式不兼容，因此也就与该 API 中目前已缓存的资源不兼容。

`version` provides a mechanism to indicate that the resources being cached have been updated in a backwards-incompatible way, and that the old cache entries —those from previous versions— should be discarded.

`version` 提供了一种机制，用于指出这些被缓存的资源已经通过不向后兼容的方式进行了更新，并且旧的缓存条目（即来自以前版本的缓存条目）应该被丢弃。

`version` is an integer field and defaults to `1`.

`version` 是个整型字段，默认为 `0`。

### `cacheConfig`

This section defines the policy by which matching requests are cached.

本节定义了对匹配上的请求进行缓存时的策略。

#### `maxSize`

(required) The maximum number of entries, or responses, in the cache.
Open-ended caches can grow in unbounded ways and eventually exceed storage quotas, calling for eviction.

（必需）缓存的最大条目数或响应数。开放式缓存可以无限增长，并最终超过存储配额，建议适时清理。

#### `maxAge`

(required) The `maxAge` parameter indicates how long responses are allowed to remain in the cache before being considered invalid and evicted.
`maxAge` is a duration string, using the following unit suffixes:

（必需）`maxAge` 参数表示在响应因失效而要清除之前允许在缓存中留存的时间。`maxAge` 是一个表示持续时间的字符串，可使用以下单位作为后缀：

| Suffixes | Details |
| :------- | :------ |
| 后缀 | 详情 |
| `d` | Days |
| `d` | 天 |
| `h` | Hours |
| `h` | 小时 |
| `m` | Minutes |
| `m` | 分钟 |
| `s` | Seconds |
| `s` | 秒 |
| `u` | Milliseconds |
| `u` | 毫秒 |

For example, the string `3d12h` caches content for up to three and a half days.

比如，字符串 `3d12h` 规定此内容最多缓存三天半。

#### `timeout`

This duration string specifies the network timeout.
The network timeout is how long the Angular service worker waits for the network to respond before using a cached response, if configured to do so.
`timeout` is a duration string, using the following unit suffixes:

这个表示持续时间的字符串用于指定网络超时时间。
如果配置了网络超时时间，Angular Service Worker 就会先等待这么长时间再使用缓存。`timeout` 是一个表示持续时间的字符串，使用下列后缀单位：

这个表示持续时间的字符串用于指定网络超时时间。如果配置了网络超时时间，Angular Service Worker 就会先等待这么长时间再使用缓存。`timeout` 是一个表示持续时间的字符串，使用下列后缀单位：

| Suffixes | Details |
| :------- | :------ |
| 后缀 | 详情 |
| `d` | Days |
| `d` | 天 |
| `h` | Hours |
| `h` | 小时 |
| `m` | Minutes |
| `m` | 分钟 |
| `s` | Seconds |
| `s` | 秒 |
| `u` | Milliseconds |
| `u` | 毫秒 |

For example, the string `5s30u` translates to five seconds and 30 milliseconds of network timeout.

比如，字符串 `5s30u` 将会被翻译成 5 秒零 30 毫秒的网络超时。

#### `strategy`

The Angular service worker can use either of two caching strategies for data resources.

Angular Service Worker 可以使用两种缓存策略之一来获取数据资源。

| Caching strategies | Details |
| :----------------- | :------ |
| 缓存策略 | 详情 |
| `performance` | The default, optimizes for responses that are as fast as possible. If a resource exists in the cache, the cached version is used, and no network request is made. This allows for some staleness, depending on the `maxAge`, in exchange for better performance. This is suitable for resources that don't change often; for example, user avatar images. |
| `performance` | `performance`，默认值，为尽快给出响应而优化。如果缓存中存在某个资源，则使用这个缓存版本，而不再发起网络请求。它允许资源有一定的陈旧性（取决于 `maxAge`）以换取更好的性能。适用于那些不经常改变的资源，比如用户头像。|
| `freshness` | Optimizes for currency of data, preferentially fetching requested data from the network. Only if the network times out, according to `timeout`, does the request fall back to the cache. This is useful for resources that change frequently; for example, account balances. |
| `freshness` | `freshness` 为数据的即时性而优化，优先从网络获取请求的数据。只有当网络超时时，请求才会根据 `timeout` 的设置回退到缓存中。这对于那些频繁变化的资源很有用，比如账户余额。|

<div class="alert is-helpful">

You can also emulate a third strategy, [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate), which returns cached data (if available), but also fetches fresh data from the network in the background for next time.
To use this strategy set `strategy` to `freshness` and `timeout` to `0u` in `cacheConfig`.

你还可以模拟第三种策略 [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate)，它会返回缓存的数据（如果可用），但是也会在后台从网络上获取新数据，以供下次使用。要使用本策略，请在 `cacheConfig` 中把 `strategy` 设置为 `freshness`，并且把 `timeout` 设置为 `0u`。

This essentially does the following:

本质上说，它会做如下工作：

1. Try to fetch from the network first.

   首先尝试从网络上获取。

1. If the network request does not complete after 0ms (that is, immediately), fall back to the cache (ignoring cache age).

   如果网络请求没有在 0ms 内（也就是立刻）完成，就用缓存做为后备（忽略缓存有效期）。

1. Once the network request completes, update the cache for future requests.

   一旦网络请求完成，就更新缓存，以供将来的请求使用。

1. If the resource does not exist in the cache, wait for the network request anyway.

   如果指定的资源在缓存中不存在，总是等待网络请求。

</div>

#### `cacheOpaqueResponses`

Whether the Angular service worker should cache opaque responses or not.

Angular 服务工作者是否应该缓存不透明的响应。

If not specified, the default value depends on the data group's configured strategy:

如果未指定，则默认值取决于数据组的配置策略：

| Strategies | Details |
| :--------- | :------ |
| Strategies | 详情 |
| Groups with the `freshness` strategy | The default value is `true` (cache opaque responses). These groups will request the data anew every time, only falling back to the cached response when offline or on a slow network. Therefore, it doesn't matter if the service worker caches an error response. |
| 使用 `freshness` 策略的组 | 默认值为 `true`（缓存不透明响应）。这些组每次都会重新请求数据，只有在脱机或在慢速网络上时才会回到缓存响应。因此，服务工作者是否缓存错误响应是无关紧要的。|
| Groups with the `performance` strategy | The default value is `false` (do not cache opaque responses). These groups would continue to return a cached response until `maxAge` expires, even if the error was due to a temporary network or server issue. Therefore, it would be problematic for the service worker to cache an error response. |
| 具有 `performance` 策略的组 | 默认值为 `false`（不缓存不透明响应）。这些组将继续返回缓存响应，直到 `maxAge` 过期，即使错误是由于临时网络或服务器问题造成的。因此，服务工作者缓存错误响应将是有问题的。|

<div class="callout is-important">

<header>Comment on opaque responses</header>

<header>评论不透明的响应</header>

In case you are not familiar, an [opaque response][WhatwgFetchSpecConceptFilteredResponseOpaque] is a special type of response returned when requesting a resource that is on a different origin which doesn't return CORS headers.
One of the characteristics of an opaque response is that the service worker is not allowed to read its status, meaning it can't check if the request was successful or not.
See [Introduction to fetch()][GoogleDeveloperWebUpdates201503IntroductionToFetchResponseTypes] for more details.

如果你不熟悉，[不透明响应][WhatwgFetchSpecConceptFilteredResponseOpaque]是请求不同来源的不返回 CORS 标头的资源时返回的一种特殊类型的响应。不透明响应的特性之一是不允许服务工作者读取其状态，这意味着它无法检查请求是否成功。有关更多详细信息，请参阅[fetch()][GoogleDeveloperWebUpdates201503IntroductionToFetchResponseTypes]介绍。

If you are not able to implement CORS —for example, if you don't control the origin— prefer using the `freshness` strategy for resources that result in opaque responses.

如果你无法实现 CORS（例如，如果你不控制来源），更愿意对会导致不透明响应的资源使用 `freshness` 策略。

</div>

### `cacheQueryOptions`

See [assetGroups](#assetgroups) for details.

详情参阅 [assetGroups](#assetgroups)。

## `navigationUrls`

This optional section enables you to specify a custom list of URLs that will be redirected to the index file.

这个可选节让你可以指定一个自定义的 URL 列表，它们都会被重定向到索引文件。

### Handling navigation requests

### 处理导航请求

The ServiceWorker redirects navigation requests that don't match any `asset` or `data` group to the specified [index file](#index-file).
A request is considered to be a navigation request if:

对于没有匹配上任何 `asset` 或 `data` 组的导航请求，ServiceWorker 会把它们重定向到指定的[索引文件](#index-file)。下列请求将会视为导航请求：

* Its [mode](https://developer.mozilla.org/docs/Web/API/Request/mode) is `navigation`

  它的[模式](https://developer.mozilla.org/docs/Web/API/Request/mode)是 `navigation`

* It accepts a `text/html` response (as determined by the value of the `Accept` header)

  它接受 `text/html` 响应（根据 `Accept` 头的值决定）

* Its URL matches certain criteria (see the following)

  它的 URL 符合特定的条件（稍后讲）

By default, these criteria are:

默认情况下，这些条件是：

* The URL must not contain a file extension (that is, a `.`) in the last path segment

  URL 的最后一段路径中不能包含文件扩展名（比如 `.`）

* The URL must not contain `__`

  URL 中不能包含 `__`

<div class="alert is-helpful">

To configure whether navigation requests are sent through to the network or not, see the [navigationRequestStrategy](#navigation-request-strategy) section.

要配置浏览请求是否发送到网络，请参阅 [navigationRequestStrategy](#navigation-request-strategy) 部分。

</div>

### Matching navigation request URLs

### 匹配导航请求的 URL

While these default criteria are fine in most cases, it is sometimes desirable to configure different rules.
For example, you might want to ignore specific routes (that are not part of the Angular app) and pass them through to the server.

虽然这些默认条件在大多数情况下都挺好用，不过有时还是要配置一些不同的规则。比如，你可能希望忽略一些特定的路由（它们可能不是 Angular 应用的一部分），而是把它们透传给服务器。

This field contains an array of URLs and [glob-like](#glob-patterns) URL patterns that are matched at runtime.
It can contain both negative patterns (that is, patterns starting with `!`) and non-negative patterns and URLs.

该字段包含一个将要在运行期间匹配的 URL 和 [类似 glob 的](#glob-patterns) URL 模式。
它既可以包含正向模式也可以包含反向模式（比如用 `!` 开头的模式）。

Only requests whose URLs match *any* of the non-negative URLs/patterns and *none* of the negative ones are considered navigation requests.
The URL query is ignored when matching.

只有那些能匹配**任意**正向 URL 或 URL 模式并且**不匹配任何一个**反向模式的 URL 才会视为导航请求。当匹配时，这些 URL 查询将会被忽略。

If the field is omitted, it defaults to:

如果省略了该字段，它的默认值是：

<code-example format="typescript" language="typescript">

[
  '/&ast;&ast;',           // Include all URLs.
  '!/&ast;&ast;/&ast;.&ast;',      // Exclude URLs to files.
  '!/&ast;&ast;/&ast;__&ast;',     // Exclude URLs containing &grave;__&grave; in the last segment.
  '!/&ast;&ast;/&ast;__&ast;/&ast;&ast;',  // Exclude URLs containing &grave;__&grave; in any other segment.
]

</code-example>

<a id="navigation-request-strategy"></a>

## `navigationRequestStrategy`

This optional property enables you to configure how the service worker handles navigation requests:

通过此可选属性，你可以配置服务工作者如何处理导航请求：

<code-example format="json" language="json">

{
  "navigationRequestStrategy": "freshness"
}

</code-example>

| Possible values | Details |
| :-------------- | :------ |
| 可能的值 | 详情 |
| `'performance'` | The default setting. Serves the specified [index file](#index-file), which is typically cached. |
| `'performance'` | 默认设置。提供指定的[索引文件](#index-file)，它通常会被缓存。|
| `'freshness'` | Passes the requests through to the network and falls back to the `performance` behavior when offline. This value is useful when the server redirects the navigation requests elsewhere using an HTTP redirect (3xx status code). Reasons for using this value include: <ul> <li> Redirecting to an authentication website when authentication is not handled by the application </li> <li> Redirecting specific URLs to avoid breaking existing links/bookmarks after a website redesign </li> <li> Redirecting to a different website, such as a server-status page, while a page is temporarily down </li> </ul> |
| `'freshness'` | 将请求透传到网络，并在脱机时回退到 `performance` 模式。当服务器在用 HTTP 重定向（3xx 状态代码）将导航请求重定向到其他位置时，此值很有用。使用此值的原因包括：<ul> <li> 当应用尚未处理身份验证时，重定向到身份验证网站。</li> <li> 重定向特定的 URL，以免在网站重新设计后破坏现有的链接/书签。</li> <li>  当页面暂时关闭时，重定向到其他网站，比如服务器状态页。</li> </ul> |

<div class="alert is-important">

The `freshness` strategy usually results in more requests sent to the server, which can increase response latency.
It is recommended that you use the default performance strategy whenever possible.

`freshness` 策略通常会导致向服务器发送更多请求，这可能会增加响应延迟。建议你尽可能使用默认的性能策略。

</div>

<!-- links -->

<!-- external links -->

[GoogleDeveloperWebUpdates201503IntroductionToFetchResponseTypes]: https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types

[WhatwgFetchSpecConceptFilteredResponseOpaque]: https://fetch.spec.whatwg.org#concept-filtered-response-opaque

<!-- end links -->

@reviewed 2022-02-28