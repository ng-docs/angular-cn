Class declaration that contains this template.

包含此模板的类声明。

File content of the given template.

给定模板的文件内容。

Start offset of the template content \(e.g. in the inline source file\)

模板内容的开始偏移量（例如在内联源文件中）

Whether the given template is inline or not.

给定的模板是否是内联的。

Path to the file that contains this template.

包含此模板的文件的路径。

Gets the character and line of a given position index in the template.
If the template is declared inline within a TypeScript source file, the line and
character are based on the full source file content.

获取模板中给定位置索引的字符和行。如果模板是在 TypeScript
源文件中内联声明的，则该行和字符将基于完整的源文件内容。

Visitor that can be used to determine Angular templates referenced within given
TypeScript source files \(inline templates or external referenced templates\)

可用于确定给定 TypeScript 源文件中引用的 Angular 模板（内联模板或外部引用模板）的访问器