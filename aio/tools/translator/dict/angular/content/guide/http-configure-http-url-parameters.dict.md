HTTP - Configure URL parameters

HTTP - 配置 URL 参数

Use the `HttpParams` class with the `params` request option to add URL query strings in your `HttpRequest`.

使用 `HttpParams` 类和 `params` 选项在你的 `HttpRequest` 中添加 URL 查询字符串。

Create URL parameter using the search method

使用搜索方法创建 URL 参数

The following example, the `searchHeroes()` method queries for heroes whose names contain the search term.

下面的例子中，`searchHeroes()` 方法用于查询名字中包含搜索词的英雄。

Start by importing `HttpParams` class.

首先导入 `HttpParams` 类。

If there is a search term, the code constructs an options object with an HTML URL-encoded search parameter.
If the term is "cat", for example, the GET request URL would be `api/heroes?name=cat`.

如果有搜索词，代码会用进行过 URL 编码的搜索参数来构造一个 options 对象。比如，如果搜索词是 "cat"，那么 GET 请求的 URL 就是 `api/heroes?name=cat`。

The `HttpParams` object is immutable.
If you need to update the options, save the returned value of the `.set()` method.

`HttpParams` 是不可变对象。如果需要更新选项，请保留 `.set()` 方法的返回值。

Create URL parameters from a query

从查询创建 URL 参数

You can also create HTTP parameters directly from a query string by using the `fromString` variable:

你也可以使用 `fromString` 变量从查询字符串中直接创建 HTTP 参数：

<a id="intercepting-requests-and-responses"></a>