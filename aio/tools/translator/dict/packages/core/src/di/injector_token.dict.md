An InjectionToken that gets the current `Injector` for `createInjector()`-style injectors.

一个 InjectionToken，用于获取当前 `Injector` 的 `createInjector()` 式的注入器。

Requesting this token instead of `Injector` allows `StaticInjector` to be tree-shaken from a
project.

请求此令牌而不是 `Injector` 可使 `StaticInjector` 能在项目中摇树优化掉。