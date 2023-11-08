The element whose inner range we want to parse.

我们要解析其内部范围的元素。

a collection of XML `Node` objects and any errors that were parsed from the element's
    contents.

XML `Node` 对象以及从元素内容解析的任何错误的集合。

Parse the "contents" of an XML element.

解析 XML 元素的“内容”。

This would be equivalent to parsing the `innerHTML` string of an HTML document.

这将等效于解析 HTML 文档的 `innerHTML` 字符串。

The element whose inner range we want to compute.

我们要计算其内部范围的元素。

Compute a `LexerRange` that contains all the children of the given `element`.

计算包含给定 `element` 的所有子项的 `LexerRange`。

This "hint" object is used to pass information from `analyze()` to `parse()` for
`TranslationParser`s that expect XML contents.

对于需要 XML 内容的 `TranslationParser`，此“hint”对象用于将信息从 `canParse()` 传递到 `parse()`
。

This saves the `parse()` method from having to re-parse the XML.

这使 `parse()` 方法无需重新解析 XML。

The path to the file being checked.

正在检查的文件的路径。

The contents of the file being checked.

正在检查的文件的内容。

The expected name of an XML root node that should exist.

应该存在的 XML 根节点的预期名称。

The attributes \(and their values\) that should appear on the root node.

应该出现在根节点上的属性（及其值）。

The `XmlTranslationParserHint` object for use by `TranslationParser.parse()` if the XML
document has the expected format.

如果 XML 文档具有预期的格式，则 `TranslationParser.parse()` 使用的 `XmlTranslationParserHint`
对象。

Can this XML be parsed for translations, given the expected `rootNodeName` and expected root node
`attributes` that should appear in the file.

给定文件中应该出现的预期 `rootNodeName` 和预期的根节点 `attributes`，是否可以解析此 XML
以进行翻译。

The expected name of the element to match.

要匹配的元素的预期名称。

Create a predicate, which can be used by things like `Array.filter()`, that will match a named
XML Element from a collection of XML Nodes.

创建一个 `Array.filter()` 之类的东西使用的谓词，它将匹配 XML 节点集合中的命名 XML 元素。

Add an XML parser related message to the given `diagnostics` object.

将 XML 解析器相关消息添加到给定的 `diagnostics` 对象。

Copy the formatted error message from the given `parseError` object into the given `diagnostics`
object.

将格式化的错误消息从给定的 `parseError` 对象复制到给定的 `diagnostics` 对象中。

Add the provided `errors` to the `bundle` diagnostics.

将提供的 `errors` 添加到 `bundle` 诊断中。