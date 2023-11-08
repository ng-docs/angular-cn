[Using the Angular Unified Location Service](guide/upgrade#using-the-unified-angular-location-service)

[使用 Angular 统一位置服务](guide/upgrade#using-the-unified-angular-location-service)

Location service that provides a drop-in replacement for the $location service
provided in AngularJS.

位置服务，提供对 AngularJS 中提供的 $location 服务的直接替代品。

The callback function that is triggered for the listener when the URL changes.

URL 更改时为监听器触发的回调函数。

The callback function that is triggered when an error occurs.

发生错误时触发的回调函数。

Registers listeners for URL changes. This API is used to catch updates performed by the
AngularJS framework. These changes are a subset of the `$locationChangeStart` and
`$locationChangeSuccess` events which fire when AngularJS updates its internally-referenced
version of the browser URL.

注册对 URL 更改的监听器。该 API 用于捕获 AngularJS 框架执行的更新。`$locationChangeStart` 和
`$locationChangeSuccess` 事件的子集，这些事件在 AngularJS 更新其内部引用的浏览器 URL
版本时触发。

It's possible for `$locationChange` events to happen, but for the browser URL
\(window.location\) to remain unchanged. This `onChange` callback will fire only when AngularJS
actually updates the browser URL \(window.location\).

`$locationChange` 事件有可能发生，但浏览器的 URL（window.location）保持不变。仅当 AngularJS
实际上更新浏览器 URL（window.location）时，才会触发此 `onChange`

The URL string.

URL 字符串。

Parses the provided URL, and sets the current URL to the parsed result.

解析此 URL，并将当前 URL 设置为解析结果。

The full URL string.

完整的 URL 字符串。

A URL string relative to the full URL string.

相对于完整 URL 字符串的 URL 字符串。

Parses the provided URL and its relative URL.

解析提供的 URL 及其相对 URL。

Retrieves the full URL representation with all segments encoded according to
rules specified in
[RFC 3986](https://tools.ietf.org/html/rfc3986).

检索完整的 URL 表示形式，其中包含根据 [RFC 3986 中](https://tools.ietf.org/html/rfc3986)
指定的规则编码过的所有段。

Retrieves the current URL, or sets a new URL. When setting a URL,
changes the path, search, and hash, and returns a reference to its own instance.

检索当前 URL，或设置新 URL。设置 URL 时，更改路径、搜索和哈希，并返回对其自身实例的引用。

Retrieves the protocol of the current URL.

检索当前 URL 的协议。

In contrast to the non-AngularJS version `location.host` which returns `hostname:port`, this
returns the `hostname` portion only.

与非 AngularJS 版本不同，其 `location.host` 会返回 `hostname:port`，而这里会返回 `hostname`
部分。

Retrieves the port of the current URL.

检索当前 URL 的端口。

Retrieves the path of the current URL, or changes the path and returns a reference to its own
instance.

检索当前 URL 的路径，或更改路径并返回对其自身实例的引用。

Paths should always begin with forward slash \(/\). This method adds the forward slash
if it is missing.

路径应始终以正斜杠（/）开头。如果缺少此斜杠，则此方法将添加它。

New search params - string or
hash object.

新的搜索参数-字符串或哈希对象。

When called with a single argument the method acts as a setter, setting the `search` component
of `$location` to the specified value.

当使用单个参数调用它时，该方法会充当设置器，将 `$location` 的 `search` 组件设置为指定值。

If the argument is a hash object containing an array of values, these values will be encoded
as duplicate search parameters in the URL.

如果参数是包含值数组的哈希对象，则这些值将被编码为 URL 中的重复搜索参数。

If `search` is a string or number,
    then `paramValue`
will override only a single search property.

如果 `search` 是字符串或数字，则 `paramValue` 将仅覆盖单个搜索属性。

If `paramValue` is an array, it will override the property of the `search` component of
`$location` specified via the first argument.

如果 `paramValue` 是一个数组，它将覆盖通过第一个参数指定的 `$location` 的 `search` 的部分。

If `paramValue` is `null`, the property specified via the first argument will be deleted.

如果 `paramValue` 为 `null`，则将删除通过第一个参数指定的属性。

If `paramValue` is `true`, the property specified via the first argument will be added with no
value nor trailing equal sign.

如果 `paramValue` 为 `true`，则将通过第一个参数指定的属性添加为无值或结尾等号。

The parsed `search` object of the current URL, or the changed `search` object.

当前 URL 的已解析 `search` 对象，或更改后的 `search` 对象。

Retrieves a map of the search parameters of the current URL, or changes a search
part and returns a reference to its own instance.

检索当前 URL 的搜索参数的映射，或更改搜索部分并返回对其自身实例的引用。

Retrieves the current hash fragment, or changes the hash fragment and returns a reference to
its own instance.

检索当前哈希片段，或更改哈希片段并返回对其自身实例的引用。

Changes to `$location` during the current `$digest` will replace the current
history record, instead of adding a new one.

当前 `$digest` 期间对 `$location` 更改将替换当前历史记录，而不是添加新的记录。

Retrieves the history state object when called without any parameter.

当不带任何参数调用时将检索历史状态对象。

Change the history state object when called with one parameter and return `$location`.
The state object is later passed to `pushState` or `replaceState`.

使用一个参数调用时将更改历史状态对象，并返回 `$location`。状态对象随后传递给 `pushState` 或
`replaceState`。

This method is supported only in HTML5 mode and only in browsers supporting
the HTML5 History API methods such as `pushState` and `replaceState`. If you need to support
older browsers \(like Android &lt; 4.0\), don't use this method.

仅在 HTML5 模式下以及在支持 HTML5 History API 方法（比如 `pushState` 和
`replaceState`）的浏览器中才支持此方法。如果你需要支持较旧的浏览器（比如 Android
&lt;4.0），请不要使用此方法。

The factory function used to create an instance of the `$locationShim` in Angular,
and provides an API-compatible `$locationProvider` for AngularJS.

Angular 中用于创建 `$locationShim` 实例的工厂函数，并为 AngularJS 提供与 API 兼容的
`$locationProvider`。

Factory method that returns an instance of the $locationShim

返回 $locationShim 实例的工厂方法

Stub method used to keep API compatible with AngularJS. This setting is configured through
the LocationUpgradeModule's `config` method in your Angular app.

用于使 API 与 AngularJS 兼容的存根方法。此设置是通过 Angular 应用中 LocationUpgradeModule 的
`config` 方法配置的。