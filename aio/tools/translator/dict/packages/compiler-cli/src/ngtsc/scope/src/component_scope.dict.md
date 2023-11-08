A `ComponentScopeReader` that reads from an ordered set of child readers until it obtains the
requested scope.

一个 `ComponentScopeReader`，它会从一组有序的子读取器中读取，直到获得所请求的范围。

This is used to combine `ComponentScopeReader`s that read from different sources \(e.g. from a
registry and from the incremental state\).

这用于组合从不同来源（例如从注册表和从增量状态）读取的 `ComponentScopeReader`。