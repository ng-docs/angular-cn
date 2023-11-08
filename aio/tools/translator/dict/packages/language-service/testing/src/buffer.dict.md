A file that is currently open in the `ts.Project`, with a cursor position.

当前在 `ts.Project` 中打开的文件，带有光标位置。

a snippet of text which contains the '¦' symbol, representing where
    the cursor should be placed within the snippet when located in the larger buffer.

包含 '¦' 符号的文本片段，表示当位于较大的缓冲区中时光标应该放在代码段中的位置。

Find a snippet of text within the given buffer and position the cursor within it.

在给定的缓冲区中查找文本片段并将光标定位在其中。

Execute the `getDefinitionAndBoundSpan` operation in the Language Service at the cursor
location in this buffer.

在此缓冲区中的光标位置处执行语言服务中的 `getDefinitionAndBoundSpan` 操作。

Given a text snippet which contains exactly one cursor symbol \('¦'\), extract both the offset of
that cursor within the text as well as the text snippet without the cursor.

给定一个正好包含一个光标符号 \('¦'\)
的文本片段，请提取该光标在文本中的偏移量以及没有光标的文本片段。