The string contents of the template.

模板的字符串内容。

This is the "logical" template string, after expansion of any escaped characters \(for inline
templates\). This may differ from the actual template bytes as they appear in the .ts file.

这是扩展任何转义字符（对于内联模板）之后的“逻辑”模板字符串。这可能与 .ts
文件中出现的实际模板字节不同。

A full path to the file which contains the template.

包含模板的文件的完整路径。

This can be either the original .ts file if the template is inline, or the .html file if an
external file was used.

如果模板是内联的，则可以是原始的 .ts 文件，如果使用了外部文件，则可以是 .html 文件。

Whether the template was inline \(using `template`\) or external \(using `templateUrl`\).

模板是内联的（使用 `template`）还是外部的（使用 `templateUrl`）。

If the template was defined inline by a direct string literal, then this is that literal
expression. Otherwise `null`, if the template was not defined inline or was not a literal.

如果模板是由直接字符串文字内联定义的，那么这就是该文字表达式。否则 `null`
，如果模板不是内联定义或不是文字。

Compile a component declaration defined by the `R3ComponentMetadata`.

编译由 `R3ComponentMetadata` 定义的组件声明。

Gathers the declaration fields for a component into a `DefinitionMap`.

将组件的声明字段收集到 `DefinitionMap` 中。