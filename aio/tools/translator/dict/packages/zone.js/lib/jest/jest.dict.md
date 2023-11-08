Gets a function wrapping the body of a jest `describe` block to execute in a
synchronous-only zone.

获取一个包装 jest `describe` 块主体的函数，以在仅同步区域中执行。

Gets a function wrapping the body of a jest `it/beforeEach/afterEach` block to
execute in a ProxyZone zone.
This will run in the `proxyZone`.

获取一个函数，该函数包装要在 ProxyZone 区域中执行的 jest `it/beforeEach/afterEach`
块的主体。这将在 `proxyZone` 中运行。