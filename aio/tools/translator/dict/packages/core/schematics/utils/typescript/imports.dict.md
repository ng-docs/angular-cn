Gets import information about the specified identifier by using the Type checker.

使用类型检查器获取有关指定标识符的导入信息。

File in which to look for imports.

要在其中查找导入的文件。

Name of the import's module.

导入的模块的名称。

Original name of the specifier to look for. Aliases will be resolved to
   their original name.

要查找的说明符的原始名称。别名将被解析为其原始名称。

Gets a top-level import specifier with a specific name that is imported from a particular module.
E.g. given a file that looks like:

获取从特定模块导入的具有特定名称的顶级导入说明符。例如，给定一个类似于以下内容的文件：

Calling `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` will yield the node
referring to `Directive` in the top import.

调用 `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` 将产生在顶级导入中引用
`Directive` 的节点。

Node that contains the imports.

包含导入的节点。

Import that should be replaced.

应该替换的导入。

Import that should be inserted.

应该插入的导入。

Replaces an import inside a named imports node with a different one.

将命名导入节点中的导入替换为不同的导入。

Symbol that should be removed.

应删除的符号。

An updated node \(ts.NamedImports\).

更新的节点 \(ts.NamedImports\)。

Removes a symbol from the named imports and updates a node
that represents a given named imports.

从命名导入中删除符号并更新表示给定命名导入的节点。

Finds an import specifier with a particular name.

查找具有特定名称的导入说明符。