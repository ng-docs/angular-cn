Represents the origin environment from where reference will be emitted. This interface exists
as an indirection for the `Environment` type, which would otherwise introduce a \(type-only\)
import cycle.

表示将发出引用的源环境。此接口作为 `Environment` 类型的间接存在，否则将引入（仅类型）导入周期。

Adapter interface which allows the template type-checking diagnostics code to interpret offsets
in a TCB and map them back to original locations in the template.

适配器接口，允许模板类型检查诊断代码解释 TCB 中的偏移量并将它们映射回模板中的原始位置。

For the given template id, retrieve the original source mapping which describes how the offsets
in the template should be interpreted.

对于给定的模板 id，检索原始源映射，该映射描述了应该如何解释模板中的偏移量。

Convert an absolute source span associated with the given template id into a full
`ParseSourceSpan`. The returned parse span has line and column numbers in addition to only
absolute offsets and gives access to the original template source.

将与给定模板 id 关联的绝对源范围转换为完整的 `ParseSourceSpan`
。返回的解析跨度除了绝对偏移量之外还有行号和列号，并提供对原始模板源的访问。

Indicates whether a particular component requires an inline type check block.

表明特定组件是否需要内联类型检查块。

This is not a boolean state as inlining might only be required to get the best possible
type-checking, but the component could theoretically still be checked without it.

这不是布尔状态，因为可能只需要内联来获得最好的类型检查，但理论上仍然可以在没有它的情况下检查组件。

There is no way to type check this component without inlining.

如果不内联，就无法类型检查此组件。

Inlining should be used due to the component's generic bounds, but a non-inlining fallback
method can be used if that's not possible.

由于组件的通用边界，应该使用内联，但如果这是不可能的，可以用非内联后备方法。

There is no requirement for this component's TCB to be inlined.

不要求内联此组件的 TCB。

Maps a shim position back to a template location.

将 shim 位置映射回模板位置。

Traverses up the AST starting from the given node to extract the source location from comments
that have been emitted into the TCB. If the node does not exist within a TCB, or if an ignore
marker comment is found up the tree \(and this is part of a diagnostic request\), this function
returns null.

从给定节点开始向上遍历 AST，以从已发出到 TCB 的注释中提取源位置。如果该节点在 TCB
中不存在，或者在树上找到了忽略标记注释（这是诊断请求的一部分），则此函数返回 null。