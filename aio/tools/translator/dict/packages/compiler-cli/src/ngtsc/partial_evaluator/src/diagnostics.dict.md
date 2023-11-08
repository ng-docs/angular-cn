The resolved value for which a type representation should be derived.

应该为其派生类型表示的解析值。

The maximum nesting depth of objects and arrays, defaults to 1 level.

对象和数组的最大嵌套深度，默认为 1 级。

Derives a type representation from a resolved value to be reported in a diagnostic.

从要在诊断中报告的解析值派生类型表示。

The node for which a `ts.Diagnostic` is to be created with the trace.

要使用跟踪为其创建 `ts.Diagnostic` 的节点。

The dynamic value for which a trace should be created.

应该为其创建跟踪的动态值。

Creates an array of related information diagnostics for a `DynamicValue` that describe the trace
of why an expression was evaluated as dynamic.

为 `DynamicValue`
创建一个相关信息诊断的数组，这些信息诊断描述了对表达式被估算为动态的原因的跟踪。

Determines the closest parent node that is to be considered as container, which is used to reduce
the granularity of tracing the dynamic values to a single entry per container. Currently, full
statements and destructuring patterns are considered as container.

确定要被视为容器的最近的父节点，用于减少将动态值跟踪到每个容器的单个条目的粒度。目前，完整的语句和解构模式被认为是容器。