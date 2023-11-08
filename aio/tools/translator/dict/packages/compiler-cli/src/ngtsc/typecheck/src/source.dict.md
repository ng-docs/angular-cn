Represents the source of a template that was processed during type-checking. This information is
used when translating parse offsets in diagnostics back to their original line/column location.

表示在类型检查期间处理的模板的源。将诊断中的解析偏移量转换回其原始行/列位置时会使用此信息。

Assigns IDs to templates and keeps track of their origins.

为模板分配 ID 并跟踪它们的来源。

Implements `TemplateSourceResolver` to resolve the source of a template based on these IDs.

实现 `TemplateSourceResolver` 以根据这些 ID 解析模板的源。