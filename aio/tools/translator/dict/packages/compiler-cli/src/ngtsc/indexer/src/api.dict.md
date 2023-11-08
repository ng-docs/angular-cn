Describes the kind of identifier found in a template.

描述在模板中找到的标识符类型。

Describes a semantically-interesting identifier in a template, such as an interpolated variable
or selector.

描述模板中一个在语义上有趣的标识符，例如插值变量或选择器。

Describes a template expression, which may have a template reference or variable target.

描述一个模板表达式，它可能有一个模板引用或变量 target。

ReferenceIdentifier or VariableIdentifier in the template that this identifier targets, if
any. If the target is `null`, it points to a declaration on the component class.

此标识符所针对的模板中的 ReferenceIdentifier 或 VariableIdentifier（如果有）。如果目标是
`null`，则指向组件类上的声明。

Describes a property accessed in a template.

描述在模板中访问的属性。

No longer being used. To be removed.

不再被使用。要被删除。

Describes a method accessed in a template.

描述在模板中访问的方法。

Describes an element attribute in a template.

描述模板中的元素属性。

A reference to a directive node and its selector.

对指令节点及其选择器的引用。

A base interface for element and template identifiers.

元素和模板标识符的基础接口。

Attributes on an element or template.

元素或模板上的属性。

Directives applied to an element or template.

应用于元素或模板的指令。

Describes an indexed element in a template. The name of an `ElementIdentifier` is the entire
element tag, which can be parsed by an indexer to determine where used directives should be
referenced.

描述模板中的索引元素。`ElementIdentifier` 的名称是整个元素标记，可以由索引器解析以确定应该引用
used 指令的位置。

Describes an indexed template node in a component template file.

描述组件模板文件中的索引模板节点。

Describes a reference in a template like "foo" in `<div #foo></div>`.

描述模板中的引用，例如 `<div #foo></div>` 中的 "foo"。

The target of this reference. If the target is not known, this is `null`.

此引用的目标。如果目标未知，则为 `null`。

The template AST node that the reference targets.

引用所针对的模板 AST 节点。

The directive on `node` that the reference targets. If no directive is targeted, this is
`null`.

引用所针对的 `node` 上的指令。如果没有目标指令，则这是 `null`。

Describes a template variable like "foo" in `<div *ngFor="let foo of foos"></div>`.

在 `<div *ngFor="let foo of foos"></div>` 中描述一个类似于“foo”的模板变量。

Identifiers recorded at the top level of the template, without any context about the HTML nodes
they were discovered in.

记录在模板顶层的标识符，没有关于在其中找到它们的 HTML 节点的任何上下文。

Describes the absolute byte offsets of a text anchor in a source code.

描述源代码中文本锚点的绝对字节偏移。

Describes an analyzed, indexed component and its template.

描述一个已分析的、索引的组件及其模板。