The [DI token](guide/glossary/#di-token) for a router configuration.

路由器配置的 [DI 令牌。](guide/glossary/#di-token)

`ROUTES` is a low level API for router configuration via dependency injection.

`ROUTES` 是一个通过依赖注入进行路由器配置的低级 API。

We recommend that in almost all cases to use higher level APIs such as `RouterModule.forRoot()`,
`provideRouter`, or `Router.resetConfig()`.

我们建议在几乎所有情况下使用更高级的 API，例如 `RouterModule.forRoot()` 、
`RouterModule.forChild()`、`provideRoutes` 或 `Router.resetConfig()`。