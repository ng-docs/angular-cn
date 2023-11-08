A list of allowed HTTP methods to cache.

允许缓存的 HTTP 方法列表。

A method that returns a hash representation of a string using a variant of DJB2 hash
algorithm.

一种使用 DJB2 哈希算法的变体返回字符串的哈希表示形式的方法。

This is the same hashing logic that is used to generate component ids.

这与用于生成组件 ID 的哈希逻辑相同。

Returns the DI providers needed to enable HTTP transfer cache.

返回启用 HTTP 传输缓存所需的 DI 提供程序。

By default, when using server rendering, requests are performed twice: once on the server and
other one on the browser.

默认情况下，当使用服务端渲染时，请求执行两次：一次在服务器上，另一次在浏览器上。

When these providers are added, requests performed on the server are cached and reused during the
bootstrapping of the application in the browser thus avoiding duplicate requests and reducing
load time.

添加这些提供程序后，在服务器上执行的请求将被缓存并在浏览器中引导应用程序期间重复使用，从而避免重复请求并减少加载时间。