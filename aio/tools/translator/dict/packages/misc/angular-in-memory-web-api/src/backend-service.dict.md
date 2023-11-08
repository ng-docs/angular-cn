Base class for in-memory web api back-ends
Simulate the behavior of a RESTy web api
backed by the simple in-memory data store provided by the injected `InMemoryDbService` service.
Conforms mostly to behavior described here:
http://www.restapitutorial.com/lessons/httpmethods.html

内存 Web api 后端的基类 模拟由注入的 `InMemoryDbService` 服务提供的简单内存数据存储支持的 RESTy
Web api 的行为。主要符合此处描述的行为：
http://www.restapitutorial.com/lessons/httpmethods.html

Process Request and return an Observable of Http Response object
in the manner of a RESTy web api.

处理 Request 并以 RESTy Web api 的方式返回 Http Response 对象的 Observable。

Expect URI pattern in the form :base/:collectionName/:id?
Examples:
  // for store with a 'customers' collection
  GET api/customers          // all customers
  GET api/customers/42       // the character with id=42
  GET api/customers?name=^j  // 'j' is a regex; returns customers whose name starts with 'j' or
'J' GET api/customers.json/42  // ignores the ".json"

期望 :base/:collectionName/:id 格式的 URI 模式？示例：// 对于具有 'customers' 集合的商店 GET
api/customers // 所有客户 GET api/customers/42 // id=42 的字符 GET api/customers?name=^j // 'j'
是正则表达式；返回名称以 'j' 或 'J' 开头的客户 GET api/customers.json/42 // 忽略“.json”

Also accepts direct commands to the service in which the last segment of the apiBase is the
word "commands" Examples: POST commands/resetDb, GET/POST commands/config - get or \(re\)set the
config

还接受对服务的直接命令，其中 apiBase 的最后一段是单词“commands” 示例：POST
命令/resetDb、GET/POST 命令/config - 获取或（重新）设置配置

HTTP overrides:
    If the injected inMemDbService defines an HTTP method \(lowercase\)
    The request is forwarded to that method as in
    `inMemDbService.get(requestInfo)`
    which must return either an Observable of the response type
    for this http library or null|undefined \(which means "keep processing"\).

HTTP 覆盖：如果注入的 inMemDbService 定义了一个 HTTP 方法（小写），则请求将被转发到该方法，就像
`inMemDbService.get(requestInfo)` 一样，它必须返回此 HTTP 库的响应类型的 Observable 或
null|undefined（这意味着“继续处理”）。

Add configured delay to response observable unless delay === 0

将配置的延迟添加到响应 observable，除非 delay === 0

Apply query/search parameters as a filter over the collection
This impl only supports RegExp queries on string properties of the collection
ANDs the conditions together

应用查询/搜索参数作为集合上的过滤器此实现仅支持对集合的字符串属性的正则表达式查询将条件与在一起

Get a method from the `InMemoryDbService` \(if it exists\), bound to that service

从 `InMemoryDbService`（如果存在）获取绑定到该服务的方法

Commands reconfigure the in-memory web api service or extract information from it.
Commands ignore the latency delay and respond ASAP.

命令会重新配置内存中 Web api 服务或从中提取信息。命令会忽略延迟延迟并尽快响应。

When the last segment of the `apiBase` path is "commands",
the `collectionName` is the command.

当 `apiBase` 路径的最后一段是“commands”时，`collectionName` 是命令。

Example URLs:
  commands/resetdb \(POST\) // Reset the "database" to its original state
  commands/config \(GET\)   // Return this service's config object
  commands/config \(POST\)  // Update the config \(e.g. the delay\)

示例 URL：commands/resetdb \(POST\) // 将“数据库”重置为其原始状态 commands/config \(GET\) //
返回此服务的配置对象 commands/config \(POST\) // 更新配置（例如延迟）

Usage:
  http.post\('commands/resetdb', undefined\);
  http.get\('commands/config'\);
  http.post\('commands/config', '{"delay":1000}'\);

用法：http.post\('commands/resetdb', undefined\); http.get\('commands/config'\);
http.post\('commands/config', '{"delay":1000}'\);

Create standard HTTP headers object from hash map of header strings

从标头字符串的哈希映射表创建标准 HTTP 标头对象

create the function that passes unhandled requests through to the "real" backend.

创建将未处理的请求传递到“真实”后端的函数。

return a search map from a location query/search string

从位置查询/搜索字符串返回搜索地图

creates ResponseOptions when observable is subscribed

订阅 observable 时创建 ResponseOptions

if true \(default\), add simulated latency delay from configuration

如果为 true（默认），则从配置中添加模拟的延迟延迟

Create a cold response Observable from a factory for ResponseOptions

从工厂为 ResponseOptions 创建冷响应 Observable

Create a Response observable from ResponseOptions observable.

从 ResponseOptions observable 创建一个 Response 可观察值。

Create a cold Observable of ResponseOptions.

创建 ResponseOptions 的冷 Observable。

Find first instance of item in collection by `item.id`

按 `item.id` 查找集合中条目的第一个实例

collection of items with `id` key property

具有 `id` 键属性的条目的集合

Generate the next available id for item in this collection
Use method from `inMemDbService` if it exists and returns a value,
else delegates to `genIdDefault`.

为此集合中的条目生成下一个可用的 id，如果存在，则使用 `inMemDbService`
中的方法并返回值，否则委托给 `genIdDefault`。

name of the collection

集合名称

Default generator of the next available id for item in this collection
This default implementation works only for numeric ids.

此集合中条目的下一个可用 id 的默认生成器此默认实现仅适用于数字 id。

Get JSON body from the request object

从请求对象获取 JSON 正文

Get location info from a url, even on server where `document` is not defined

从 url 获取位置信息，即使在未定义 `document` 的服务器上

get or create the function that passes unhandled requests
through to the "real" backend.

获取或创建将未处理的请求传递到“真实”后端的函数。

Get utility methods from this service instance.
Useful within an HTTP method override

从此服务实例获取实用程序方法。在 HTTP 方法覆盖中很有用

request object from the http call

来自 http 调用的请求对象

return canonical HTTP method name \(lowercase\) from the request object
e.g. \(req.method || 'get'\).toLowerCase\(\);

从请求对象返回规范的 HTTP 方法名称（小写），例如 \(req.method || 'get'\).toLowerCase\(\);

Parse the id as a number. Return original value if not a number.

将 id 解析为数字。如果不是数字，则返回原始值。

return true if can determine that the collection's `item.id` is a number
This implementation can't tell if the collection is empty so it assumes NO

如果可以确定集合的 `item.id` 是数字，则返回 true 此实现无法告诉集合是否为空，因此它假定为 NO

Parses the request URL into a `ParsedRequestUrl` object.
Parsing depends upon certain values of `config`: `apiBase`, `host`, and `urlRoot`.

将请求 URL 解析为 `ParsedRequestUrl` 对象。解析取决于 `config` 的某些值：`apiBase`、`host`
和 `urlRoot`。

Configuring the `apiBase` yields the most interesting changes to `parseRequestUrl` behavior:
  When apiBase=undefined and url='http://localhost/api/collection/42'
    {base: 'api/', collectionName: 'collection', id: '42', ...}
  When apiBase='some/api/root/' and url='http://localhost/some/api/root/collection'
    {base: 'some/api/root/', collectionName: 'collection', id: undefined, ...}
  When apiBase='/' and url='http://localhost/collection'
    {base: '/', collectionName: 'collection', id: undefined, ...}

配置 `apiBase` 会对 `parseRequestUrl` 行为产生最有趣的更改：当 apiBase=undefined 和 url='
http://localhost/api/collection/42 ' {base: 'api/', collectionName: 'collection', id: '42 ',
...} 当 apiBase='some/api/root/' 和 url=' http://localhost/some/api/root/collection ' {base:
'some/api/root/', collectionName: ' collection', id: undefined, ...} 当 apiBase='/' 和 url='
http://localhost/collection ' {base: '/', collectionName: 'collection', id: undefined, ...}

The actual api base segment values are ignored. Only the number of segments matters.
The following api base strings are considered identical: 'a/b' ~ 'some/api/' ~ \`two/segments'

实际的 api 基本段值被忽略。只有段的数量很重要。以下 api 基本字符串被认为是相同的：'a/b' ~
'some/api/' ~ \`two/segments'

To replace this default method, assign your alternative to your
`InMemDbService['parseRequestUrl']`

要替换此默认方法，请将你的替代方案分配给你的 `InMemDbService['parseRequestUrl']`

Tell your in-mem "database" to reset.
returns Observable of the database because resetting it could be async

告诉你的内存“数据库”重置。返回数据库的 Observable，因为重置它可能是异步的