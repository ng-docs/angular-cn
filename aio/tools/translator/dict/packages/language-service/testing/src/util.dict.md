Expect that a list of objects with a `fileName` property matches a set of expected files by only
comparing the file names and not any path prefixes.

期望具有 `fileName` 属性的对象列表与一组预期文件匹配，方法是仅比较文件名而不比较任何路径前缀。

This assertion is independent of the order of either list.

此断言与任一列表的顺序无关。

Returns whether the given `ts.Diagnostic` is of a type only produced by the Angular compiler \(as
opposed to being an upstream TypeScript diagnostic\).

返回给定的 `ts.Diagnostic` 是否属于仅由 Angular 编译器生成的类型（而不是上游的 TypeScript
诊断）。

Template type-checking diagnostics are not "ng-specific" in this sense, since they are plain
TypeScript diagnostics that are produced from expressions in the template by way of a TCB.

从这个意义上说，模板类型检查诊断不是“特定于 ng 的”，因为它们是普通的 TypeScript 诊断，是通过 TCB
从模板中的表达式生成的。