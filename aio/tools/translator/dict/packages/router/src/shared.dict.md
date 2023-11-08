The primary routing outlet.

主路由出口的名字。

A private symbol used to store the value of `Route.title` inside the `Route.data` if it is a
static string or `Route.resolve` if anything else. This allows us to reuse the existing route
data/resolvers to support the title feature without new instrumentation in the `Router` pipeline.

一个私有符号，用于将 `Route.title` 的值存储在 `Route.data` 中（如果是静态字符串），或者 `Route.resolve` 如果是其他）。这允许我们重用现有的路由数据/解析器来支持标题特性，而无需在 `Router` 管道中进行新的检测。

A collection of matrix and query URL parameters.

矩阵和查询 URL 参数的集合。

[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)



A map that provides access to the required and optional parameters
specific to a route.
The map supports retrieving a single value with `get()`
or multiple values with `getAll()`.

提供访问特定于路由的必需和可选参数的映射表。该映射表支持使用 `get()` 检索单个值或使用 `getAll()`
检索多个值。

The parameter name.

参数名称。

True if the map contains the given parameter, false otherwise.

如果此映射表包含给定参数，则为 true，否则为 false。

Reports whether the map contains a given parameter.

报告此映射表是否包含给定的参数。

The parameter's single value,
or the first value if the parameter has multiple values,
or `null` when there is no such parameter.

参数的单个值；如果参数具有多个值，则返回第一个值；如果没有这样的参数，则返回 `null`。

Retrieves a single value for a parameter.

检索参数的单个值。

An array containing one or more values,
or an empty array if there is no such parameter.

包含一个或多个值的数组；如果没有这样的参数，则为空数组。

Retrieves multiple values for a parameter.

检索参数的多个值。

Names of the parameters in the map.

映射表中参数的名称。

The instance to convert.

要转换的实例。

The new map instance.

新的 `ParamMap` 实例。

Converts a `Params` instance to a `ParamMap`.

将 `Params` 实例转换为 `ParamMap`。

The remaining unmatched segments in the current navigation

当前导航中剩余的不匹配段

The current segment group being matched

正在匹配的当前段组

The `Route` to match against.

要匹配的 `Route`。

Route

路由

The resulting match information or `null` if the `route` should not match.

结果的匹配信息，如果 `route` 不应该匹配，则为 `null`。

Matches the route configuration \(`route`\) against the actual URL \(`segments`\).

将路由配置 \( `route` \) 与实际 URL \( `segments` \) 匹配。

When no matcher is defined on a `Route`, this is the matcher used by the Router by default.

当 `Route` 上没有定义匹配器时，这是 Router 默认使用的匹配器。