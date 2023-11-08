Gets a function wrapping the body of a Jasmine `describe` block to execute in a
synchronous-only zone.

获取一个包装 Jasmine `describe` 块主体的函数，以在仅同步区域中执行。

Gets a function wrapping the body of a Jasmine `it/beforeEach/afterEach` block to
execute in a ProxyZone zone.
This will run in `testProxyZone`. The `testProxyZone` will be reset by the `ZoneQueueRunner`

获取一个函数，该函数包装要在 ProxyZone 区域中执行的 Jasmine `it/beforeEach/afterEach`
块的主体。这将在 `testProxyZone` 中运行。`testProxyZone` 将由 `ZoneQueueRunner` 重置