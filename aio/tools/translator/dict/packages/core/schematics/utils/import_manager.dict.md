Update recorder for managing imports.

用于管理导入的更新记录器。

Possible types of quotes for imports.

可能的进口报价类型。

Import manager that can be used to add TypeScript imports to given source
files. The manager ensures that multiple transformations are applied properly
without shifted offsets and that similar existing import declarations are re-used.

可用于将 TypeScript
导入添加到给定源文件的导入管理器。管理器确保在不偏移偏移的情况下正确应用多重转换，并且重新使用类似的现有导入声明。

Adds an import to the given source-file and returns the TypeScript
identifier that can be used to access the newly imported symbol.

添加对给定 source-file 的导入，并返回可用于访问新导入的符号的 TypeScript 标识符。

Stores the collected import changes within the appropriate update recorders. The
updated imports can only be updated *once* per source-file because previous updates
could otherwise shift the source-file offsets.

将收集的导入更改存储在适当的更新记录器中。每个源文件只能更新*一次*更新的导入，因为以前的更新可能会移动源文件的偏移量。