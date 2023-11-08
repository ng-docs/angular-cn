Checks a given node against matching projection slots and returns the
determined slot index. Returns "null" if no slot matched the given node.

根据匹配的投影槽检查给定节点并返回确定的槽索引。如果没有槽与给定节点匹配，则返回“null”。

This function takes into account the parsed ngProjectAs selector from the
node's attributes. If present, it will check whether the ngProjectAs selector
matches any of the projection slot selectors.

此函数考虑了从节点属性中解析的 ngProjectAs 选择器。如果存在，它将检查 ngProjectAs 选择器是否与任何投影插槽选择器匹配。

Instruction to distribute projectable nodes among <ng-content> occurrences in a given template.
It takes all the selectors from the entire component's template and decides where
each projected node belongs \(it re-distributes nodes among "buckets" where each "bucket" is
backed by a selector\).

在之间分配可投影节点的说明

This function requires CSS selectors to be provided in 2 forms: parsed \(by a compiler\) and text,
un-parsed form.

此功能需要以 2 种形式提供 CSS 选择器：已解析（由编译器）和文本、未解析形式。

The parsed form is needed for efficient matching of a node against a given CSS selector.
The un-parsed, textual form is needed for support of the ngProjectAs attribute.

需要解析的形式来有效匹配节点与给定的 CSS 选择器。需要未解析的文本形式来支持 ngProjectAs 属性。

Having a CSS selector in 2 different formats is not ideal, but alternatives have even more
drawbacks:

拥有 2 种不同格式的 CSS 选择器并不理想，但替代方案有更多缺点：

having only a textual form would require runtime parsing of CSS selectors;

只有文本形式需要 CSS 选择器的运行时解析；

we can't have only a parsed as we can't re-construct textual form from it \(as entered by a
template author\).

我们不能只解析一个，因为我们不能从中重新构建文本形式（由模板作者输入）。

Inserts previously re-distributed projected nodes. This instruction must be preceded by a call
to the projectionDef instruction.

插入先前重新分布的投影节点。此指令之前必须调用 projectionDef 指令。