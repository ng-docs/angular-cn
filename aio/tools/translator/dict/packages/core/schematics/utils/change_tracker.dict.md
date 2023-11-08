Function that can be used to remap a generated import.

可用于重新映射生成的导入的函数。

Mapping between a source file and the changes that have to be applied to it.

源文件与必须对其应用的更改之间的映射。

Change that needs to be applied to a file.

需要应用于文件的更改。

Index at which to start changing the file.

开始更改文件的索引。

Amount of text that should be removed after the `start`.
No text will be removed if omitted.

`start` 后应删除的文本量。如果省略，则不会删除任何文本。

New text that should be inserted.

应插入的新文本。

Tracks changes that have to be made for specific files.

跟踪必须对特定文件进行的更改。

File in which the text is being inserted.

插入文本的文件。

Index at which the text is insert.

插入文本的索引。

Text to be inserted.

要插入的文本。

Tracks the insertion of some text.

跟踪一些文本的插入。

File in which to replace the text.

要替换文本的文件。

Index from which to replace the text.

从中替换文本的索引。

Length of the text being replaced.

被替换文本的长度。

Text to be inserted instead of the old one.

要插入的文本而不是旧文本。

Replaces text within a file.

替换文件中的文本。

Node to be replaced.

要更换的节点。

New node to be inserted.

要插入的新节点。

Hint when formatting the text of the new node.

格式化新节点的文本时提示。

File to use when printing out the new node. This is important
when copying nodes from one file to another, because TypeScript might not output literal nodes
without it.

打印出新节点时要使用的文件。这在将节点从一个文件复制到另一个文件时很重要，因为没有它，TypeScript 可能不会输出文字节点。

Replaces the text of an AST node with a new one.

将 AST 节点的文本替换为新的文本。

Node whose text should be removed.

应删除其文本的节点。

Removes the text of an AST node from a file.

从文件中删除 AST 节点的文本。

File to which to add the import.

要向其添加导入的文件。

Symbol being imported.

正在导入的符号。

Module from which the symbol is imported.

从中导入符号的模块。

Adds an import to a file.

向文件添加导入。

Gets the changes that should be applied to all the files in the migration.
The changes are sorted in the order in which they should be applied.

获取应应用于迁移中所有文件的更改。更改按应应用的顺序排序。

Normalizes a path to use posix separators.

规范化路径以使用 posix 分隔符。