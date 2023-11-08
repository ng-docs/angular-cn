These fields of `R3ComponentMetadata` are updated in the `resolve` phase.

`R3ComponentMetadata` 的这些字段会在 `resolve` 阶段更新。

The `keyof R3ComponentMetadata &` condition ensures that only fields of `R3ComponentMetadata` can
be included here.

`keyof R3ComponentMetadata &` 条件可确保这里只能包含 `R3ComponentMetadata` 的字段。

`meta` includes those fields of `R3ComponentMetadata` which are calculated at `analyze` time
\(not during resolve\).

`meta` 包括 `R3ComponentMetadata` 中在 `analyze` 时（而不是解析期间）计算的那些字段。

Providers extracted from the `providers` field of the component annotation which will require
an Angular factory definition at runtime.

从组件注解的 `providers` 字段中提取的提供者，在运行时需要 Angular 工厂定义。

Providers extracted from the `viewProviders` field of the component annotation which will
require an Angular factory definition at runtime.

从组件注解的 `viewProviders` 字段中提取的提供者，在运行时需要 Angular 工厂定义。

`styleUrls` extracted from the decorator, if present.

从装饰器中提取的 `styleUrls`（如果存在）。

Inline stylesheets extracted from the decorator, if present.

从装饰器提取的内联样式表（如果存在）。

Additional directives applied to the component host.

应用于组件宿主的附加指令。

Raw expression that defined the host directives array. Used for diagnostics.

定义宿主指令数组的原始表达式。用于诊断。