Given a reference to a directive, return a flattened version of its `DirectiveMeta` metadata
which includes metadata from its entire inheritance chain.

给定对指令的引用，返回其 `DirectiveMeta` 元数据的展平版本，其中包括来自整个继承链的元数据。

The returned `DirectiveMeta` will either have `baseClass: null` if the inheritance chain could be
fully resolved, or `baseClass: 'dynamic'` if the inheritance chain could not be completely
followed.

如果继承链可以被完全解析，则返回的 `DirectiveMeta` 将具有 `baseClass: null`
，如果不能完全遵循继承链，则返回的 DirectiveMeta 将具有 baseClass `baseClass: 'dynamic'`。