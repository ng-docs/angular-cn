Contextual information for a target position within the template.

模板中目标位置的上下文信息。

Target position within the template.

模板中的目标位置。

The template \(or AST expression\) node or nodes closest to the search position.

离搜索位置最近的模板（或 AST 表达式）节点。

The `t.Template` which contains the found node or expression \(or `null` if in the root
template\).

包含找到的节点或表达式的 `t.Template`（如果在根模板中，则为 `null`）。

The immediate parent node of the targeted node.

目标节点的直接父节点。

A node or nodes targeted at a given position in the template, including potential contextual
information about the specific aspect of the node being referenced.

针对模板中给定位置的一个或多个节点，包括有关被引用节点的特定切面的潜在上下文信息。

Some nodes have multiple interior contexts. For example, `t.Element` nodes have both a tag name
as well as a body, and a given position definitively points to one or the other. `TargetNode`
captures the node itself, as well as this additional contextual disambiguation.

某些节点有多个内部上下文。例如，`t.Element`
节点既有标签名称也有主体，并且给定的位置最终指向了两者。`TargetNode`
捕获节点本身，以及这种额外的上下文消歧。

Contexts which logically target only a single node in the template AST.

在逻辑上仅针对模板 AST 中的单个节点的上下文。

Contexts which logically target multiple nodes in the template AST, which cannot be
disambiguated given a single position because they are all equally relevant. For example, in the
banana-in-a-box syntax `[(ngModel)]="formValues.person"`, the position in the template for the
key `ngModel` refers to both the bound event `ngModelChange` and the input `ngModel`.

逻辑上以模板 AST
中的多个节点为目标的上下文，在给定单个位置的情况下无法消除歧义，因为它们都是同样相关的。例如，在
banner-in-a-box 语法 `[(ngModel)]="formValues.person"` 中，键 `ngModel`
在模板中的位置是指绑定事件 `ngModelChange` 和输入 `ngModel`。

Differentiates the various kinds of `TargetNode`s.

区分各种类型的 `TargetNode`。

An `e.AST` expression that's targeted at a given position, with no additional context.

针对给定位置的 `e.AST` 表达式，没有额外的上下文。

An `e.Call` expression with the cursor in a position where an argument could appear.

光标位于可能出现参数的位置的 `e.Call` 表达式。

This is returned when the only matching node is the method call expression, but the cursor is
within the method call parentheses. For example, in the expression `foo(|)` there is no argument
expression that the cursor could be targeting, but the cursor is in a position where one could
appear.

当唯一匹配的节点是方法调用表达式，但光标在方法调用括号内时，会返回此值。例如，在表达式 `foo(|)`
中，没有光标可以作为目标的参数表达式，但光标位于可以出现的位置。

A `t.Node` template node that's targeted at a given position, with no additional context.

以给定位置为目标的 `t.Node` 模板节点，没有额外的上下文。

A `t.Element` \(or `t.Template`\) element node that's targeted, where the given position is within
the tag name.

目标的 `t.Element`（或 `t.Template`）元素节点，其中的给定位置在标签名称中。

A `t.Element` \(or `t.Template`\) element node that's targeted, where the given position is within
the element body.

目标的 `t.Element`（或 `t.Template`）元素节点，其中的给定位置在元素体中。

A `t.BoundAttribute` and `t.BoundEvent` pair that are targeted, where the given position is
within the key span of both.

目标的 `t.BoundAttribute` 和 `t.BoundEvent` 对，其中的给定位置在两者的键范围内。

Special marker AST that can be used when the cursor is within the `sourceSpan` but not
the key or value span of a node with key/value spans.

当光标在 `sourceSpan` 但不在具有键/值范围的节点的键或值范围内时可以用的特殊标记 AST。

This special marker is added to the path when the cursor is within the sourceSpan but not the key
or value span of a node with key/value spans.

当光标在 sourceSpan 但不在具有键/值范围的节点的键或值范围内时，会将此特殊标记添加到路径中。

AST tree of the template

模板的 AST 树

target cursor position

目标光标位置

Return the template AST node or expression AST node that most accurately
represents the node at the specified cursor `position`.

返回最准确地表示指定光标 `position` 处的节点的模板 AST 节点或表达式 AST 节点。

A tcb nodes for the template at a given position, include the tcb node of the template.

给定位置的模板的 tcb 节点，包括模板的 tcb 节点。

Return the nodes in `TCB` of the node at the specified cursor `position`.

返回指定光标 `position` 处节点的 `TCB` 中的节点。

Visitor which, given a position and a template, identifies the node within the template at that
position, as well as records the path of increasingly nested nodes that were traversed to reach
that position.

访问者，给定一个位置和模板，可识别模板中该位置的节点，并记录为到达该位置而遍历的越来越多的嵌套节点的路径。