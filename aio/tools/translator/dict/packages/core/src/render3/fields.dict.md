If a directive is diPublic, bloomAdd sets a property on the type with this constant as
the key and the directive's unique ID as the value. This allows us to map directives to their
bloom filter bit for DI.

如果指令是 diPublic，则 bloomAdd 会以此常量作为键，以指令的唯一 ID
作为值的类型设置属性。这允许我们将指令映射到它们的 DI 布隆过滤器位。

The `NG_ENV_ID` field on a DI token indicates special processing in the `EnvironmentInjector`:
getting such tokens from the `EnvironmentInjector` will bypass the standard DI resolution
strategy and instead will return implementation produced by the `NG_ENV_ID` factory function.

DI 令牌上的 `NG_ENV_ID` 字段表示 `EnvironmentInjector` 中的特殊处理：从 `EnvironmentInjector` 获取此类令牌将绕过标准 DI 解析策略，而是返回由 `NG_ENV_ID` 工厂函数生成的实现。

This particular retrieval of DI tokens is mostly done to eliminate circular dependencies and
improve tree-shaking.

这种对 DI 令牌的特殊检索主要是为了消除循环依赖并改进 tree-shaking。