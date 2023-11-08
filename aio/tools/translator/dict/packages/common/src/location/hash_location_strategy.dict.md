A {&commat;link LocationStrategy} used to configure the {&commat;link Location} service to
represent its state in the
[hash fragment](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)
of the browser's URL.

此 {&commat;link LocationStrategy} 用来配置 {&commat;link Location} 服务，以便在浏览器 URL 的 [hash
片段](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)中表示其状态。

For instance, if you call `location.go('/foo')`, the browser's URL will become
`example.com#/foo`.

比如，如果你调用 `location.go('/foo')`，则浏览器的 URL 将变为 `example.com#/foo`。

Example

例子

{&commat;example common/location/ts/hash_location_component.ts region='LocationComponent'}