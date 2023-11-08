A parsed node in a template, which may have a name \(if it is a selector\) or
be anonymous \(like a text span\).

模板中的解析节点，可能有一个名称（如果它是选择器）或是匿名的（如文本跨度）。

Visits the AST of an Angular template syntax expression, finding interesting
entities \(variable references, etc.\). Creates an array of Entities found in
the expression, with the location of the Entities being relative to the
expression.

访问 Angular 模板语法表达式的 AST，查找有趣的实体（变量引用等）。创建在表达式中找到的 Entity
数组，其中 Entity 的位置是相对于表达式的。

Visiting `text {{prop}}` will return
`[TopLevelIdentifier {name: 'prop', span: {start: 7, end: 11}}]`.

访问 `text {{prop}}` 将返回 `[TopLevelIdentifier {name: 'prop', span: {start: 7, end: 11}}]`。

expression AST to visit

要访问的表达式 AST

expression AST source code

表达式 AST 源代码

absolute byte offset from start of the file to the start of the AST
source code.

从文件开头到 AST 源代码开头的绝对字节偏移量。

bound target of the entire template, which can be used to query for the
entities expressions target.

整个模板的绑定目标，可用于查询实体表达式目标。

closure converting a template target node to its identifier.

闭包将模板目标节点转换为其标识符。

Returns identifiers discovered in an expression.

返回在表达式中找到的标识符。

Visits the AST of a parsed Angular template. Discovers and stores
identifiers of interest, deferring to an `ExpressionVisitor` as needed.

访问已解析的 Angular 模板的 AST。发现并存储感兴趣的标识符，根据需要推迟到 `ExpressionVisitor`。

bound template target

绑定模板目标

Creates a template visitor for a bound template target. The bound target can be used when
deferred to the expression visitor to get information about the target of an expression.

为绑定的模板目标创建模板访问器。当延迟到表达式访问者以获取有关表达式目标的信息时，可以用绑定目标。

node to visit

要访问的节点

Visits a node in the template.

访问模板中的节点。

Add an identifier for an HTML element and visit its children recursively.

为 HTML 元素添加标识符并递归访问其子项。

bound template target, which can be used for querying expression targets.

绑定的模板目标，可用于查询表达式目标。

identifiers in template

模板中的标识符

Traverses a template AST and builds identifiers discovered in it.

遍历模板 AST 并构建在其中找到的标识符。