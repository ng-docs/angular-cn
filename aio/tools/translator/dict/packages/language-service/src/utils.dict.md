Retrieves the `ts.ClassDeclaration` at a location along with its template nodes.

检索某个位置的 `ts.ClassDeclaration` 及其模板节点。

First, attempt to sort component declarations by file name.
If the files are the same, sort by start location of the declaration.

首先，尝试按文件名对组件声明进行排序。如果文件相同，请按声明的开始位置排序。

Given an attribute node, converts it to string form for use as a CSS selector.

给定一个属性节点，将其转换为字符串形式以用作 CSS 选择器。

Given a template or element node, returns all attributes on the node.

给定模板或元素节点，返回节点上的所有属性。

Given two `Set`s, returns all items in the `left` which do not appear in the `right`.

给定两个 `Set`，返回 `left` 没有出现在 `right` 的所有条目。

The element or template node that the attribute/tag is part of.

属性/标签所属的元素或模板节点。

The list of directives to match against.

要匹配的指令列表。

The list of directives matching the tag name via the strategy described above.

通过上述策略与标签名称匹配的指令列表。

Given an element or template, determines which directives match because the tag is present. For
example, if a directive selector is `div[myAttr]`, this would match div elements but would not if
the selector were just `[myAttr]`. We find which directives are applied because of this tag by
elimination: compare the directive matches with the tag present against the directive matches
without it. The difference would be the directives which match because the tag is present.

给定一个元素或模板，确定哪些指令匹配，因为标签存在。例如，如果指令选择器是 `div[myAttr]`
，这将匹配 div 元素，但如果选择器只是 `[myAttr]`
则不会。我们通过消除来找到由于此标签而应用了哪些指令：将带有此标签的指令匹配项与没有它的指令匹配项进行比较。区别将是因为存在标签而匹配的指令。

The name of the attribute

属性的名称

The node which the attribute appears on

属性出现的节点

Given an attribute name, determines which directives match because the attribute is present. We
find which directives are applied because of this attribute by elimination: compare the directive
matches with the attribute present against the directive matches without it. The difference would
be the directives which match because the attribute is present.

给定一个属性名称，确定哪些指令匹配，因为该属性存在。我们通过消除来找到由于此属性而应用了哪些指令：将具有存在属性的指令匹配项与没有它的指令匹配项进行比较。不同之处在于因为存在属性而匹配的指令。

Given a list of directives and a text to use as a selector, returns the directives which match
for the selector.

给定指令列表和要用作选择器的文本，返回与选择器匹配的指令。

Returns a new `ts.SymbolDisplayPart` array which has the alias imports from the tcb filtered
out, i.e. `i0.NgForOf`.

返回一个新的 `ts.SymbolDisplayPart` 数组，该数组具有从 tcb 过滤掉的别名导入，即 `i0.NgForOf`。

Returns a new array formed by applying a given callback function to each element of the array,
and then flattening the result by one level.

返回一个新数组，通过将给定的回调函数应用于数组的每个元素，然后将结果展平一个级别来形成。

For a given location in a shim file, retrieves the corresponding file url for the template and
the span in the template.

对于 shim 文件中的给定位置，检索模板的对应文件 url 和模板中的跨度。