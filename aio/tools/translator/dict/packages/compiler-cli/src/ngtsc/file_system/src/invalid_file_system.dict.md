The default `FileSystem` that will always fail.

始终失败的 `FileSystem` 系统。

This is a way of ensuring that the developer consciously chooses and
configures the `FileSystem` before using it; particularly important when
considering static functions like `absoluteFrom()` which rely on
the `FileSystem` under the hood.

这是一种确保开发人员在使用之前有 `FileSystem` 地选择和配置文件系统的方法；在考虑像
`absoluteFrom()` 之类的依赖于引擎盖下的 `FileSystem` 的静态函数时尤为重要。