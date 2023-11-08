Extract translatable messages from an html AST

从 html AST 中提取可翻译消息

This Visitor is used:

此访问器用于：

to extract all the translatable strings from an html AST \(see `extract()`\),

从 html AST 中提取所有可翻译字符串（请参阅 `extract()`）

to replace the translatable strings with the actual translations \(see `merge()`\)

用实际的翻译替换可翻译字符串（请参阅 `merge()`）

Extracts the messages from the tree

从树中提取消息

Returns a tree where all translatable nodes are translated

返回所有可翻译节点都被翻译的树