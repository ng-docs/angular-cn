<code-example language="typescript">



Creates an initializer that sets up `ngRoute` integration
along with setting up the Angular router.

创建一个初始化程序，该初始化程序设置 `ngRoute` 集成并设置 Angular 路由器。

The upgrade NgModule.

升级 NgModule。

The location strategy.

location 策略。

Sets up a location change listener to trigger `history.pushState`.
Works around the problem that `onPopState` does not trigger `history.pushState`.
Must be called *after* calling `UpgradeModule.bootstrap`.

设置 location 更改监听器以触发 `history.pushState`。解决 `onPopState` 不会触发
`history.pushState` 的问题。必须在调用 `UpgradeModule.bootstrap` *之后*调用。

Normalizes and parses a URL.

规范化和解析 URL。

Normalizing means that a relative URL will be resolved into an absolute URL in the context of
the application document.

规范化意味着相对 URL 将在应用程序文档的上下文中被解析为绝对 URL。

Parsing means that the anchor's `protocol`, `hostname`, `port`, `pathname` and related
  properties are all populated to reflect the normalized URL.

解析意味着锚的 `protocol`、`hostname`、`port`、`pathname`
和相关属性都会被填充以反映规范化的 URL。

While this approach has wide compatibility, it doesn't work as expected on IE. On IE, normalizing
happens similar to other browsers, but the parsed components will not be set. \(E.g. if you assign
`a.href = 'foo'`, then `a.protocol`, `a.host`, etc. will not be correctly updated.\)
We work around that by performing the parsing in a 2nd step by taking a previously normalized URL
and assigning it again. This correctly populates all properties.

虽然这种方法具有广泛的兼容性，但它在 IE 上无法按预期工作。在 IE
上，规范化与其他浏览器类似，但不会设置解析后的组件。（例如，如果你分配 `a.href = 'foo'`，那么
`a.protocol`、`a.host` 等将不会被正确更新。）我们通过在第二步中通过获取以前规范化的 URL
来执行解析来解决这个问题，并且再次分配它。这会正确填充所有属性。

See
https://github.com/angular/angular.js/blob/2c7400e7d07b0f6cec1817dab40b9250ce8ebce6/src/ng/urlUtils.js#L26-L33
for more info.

有关更多信息，请参阅 https://github.com/angular/angular.js/blob/2c7400e7d07b0f6cec1817dab40b9250ce8ebce6/src/ng/urlUtils.js#L26-L33
。