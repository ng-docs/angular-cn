Information extracted from a `bootstrapModule` call necessary to migrate it.

从迁移它所必需的 `bootstrapModule` 调用中提取的信息。

The call itself.

调用本身。

Class that is being bootstrapped.

正在引导的类。

Metadata of the module class being bootstrapped.

正在引导的模块类的元数据。

Component that the module is bootstrapping.

模块正在引导的组件。

Classes declared by the bootstrapped module.

由引导模块声明的类。

Call to be analyzed.

调用进行分析。

Extracts all of the information from a `bootstrapModule` call
necessary to convert it to `bootstrapApplication`.

从 `bootstrapModule` 调用中提取将其转换为 `bootstrapApplication` 所需的所有信息。

Analysis result of the call.

通话分析结果。

Tracker in which to register the changes.

在其中注册更改的跟踪器。

Additional providers, apart from the auto-detected ones, that should
be added to the bootstrap call.

除自动检测的提供程序外，应将其他提供程序添加到引导程序调用中。

Converts a `bootstrapModule` call to `bootstrapApplication`.

将 `bootstrapModule` 调用转换为 `bootstrapApplication`。

Analysis result of the `bootstrapModule` call.

`bootstrapModule` 调用的分析结果。

Providers that should be added to the new call.

应添加到新呼叫中的提供商。

Modules that are being imported into the new call.

正在导入到新调用中的模块。

Object keeping track of the changes to the different files.

对象跟踪对不同文件的更改。

Replaces a `bootstrapModule` call with `bootstrapApplication`.

用 `bootstrapApplication` 替换 `bootstrapModule` 调用。

File to which the imports will be moved.

导入将移动到的文件。

Node declaring the imports.

声明导入的节点。

Map used to look up nodes based on their positions in a file.

Map 用于根据节点在文件中的位置查找节点。

Array keeping track of the imports that are being added to the new call.

跟踪正在添加到新调用的导入的数组。

Array keeping track of the providers in the new call.

跟踪新调用中提供者的数组。

Tracker in which changes to files are being stored.

存储文件更改的跟踪器。

Nodes that should be copied to the new file.

应复制到新文件的节点。

Processes the `imports` of an NgModule so that they can be used in the `bootstrapApplication`
call inside of a different file.

处理 NgModule 的 `imports`，以便它们可以在不同文件内的 `bootstrapApplication` 调用中使用。

File that the `forRoot` call is coming from.

`forRoot` 调用来自的文件。

Node that is passed as the second argument to the `forRoot` call.

作为第二个参数传递给 `forRoot` 调用的节点。

Tracker in which to track imports that need to be inserted.

跟踪需要插入的导入的跟踪器。

Null if the options can't be migrated, otherwise an array of call expressions.

如果无法迁移选项，则为 Null，否则为调用表达式数组。

Generates the call expressions that can be used to replace the options
object that is passed into a `RouterModule.forRoot` call.

生成可用于替换传递到 `RouterModule.forRoot` 调用中的选项对象的调用表达式。

File to which the nodes will be copied.

节点将复制到的文件。

Node within which to look for references.

在其中查找引用的节点。

Tracker in which changes to files are stored.

存储文件更改的跟踪器。

Set that keeps track of the nodes being copied.

设置跟踪正在复制的节点。

Finds all the nodes that are referenced inside a root node and would need to be copied into a
new file in order for the node to compile, and tracks them.

查找在根节点内引用的所有节点，并且需要将其复制到新文件中以便节点进行编译，并跟踪它们。

Node from which to start looking for references.

从中开始查找引用的节点。

Finds all the nodes referenced within the root node in the same file.

查找同一文件中根节点内引用的所有节点。

Node whose references we're lookip for.

我们正在查找其引用的节点。

Start of a range that should be excluded from the results.

应从结果中排除的范围的开始。

End of a range that should be excluded from the results.

应从结果中排除的范围的末尾。

Finds all the nodes referring to a specific node within the same file.

查找引用同一文件中特定节点的所有节点。

File name to which to remap the imports.

将导入重新映射到的文件名。

Node being transformed.

正在转换的节点。

Transforms a node so that any dynamic imports with relative file paths it contains are remapped
as if they were specified in a different file. If no transformations have occurred, the original
node will be returned.

转换一个节点，以便它包含的任何具有相对文件路径的动态导入都被重新映射，就好像它们是在不同的文件中指定的一样。如果没有发生任何转换，将返回原始节点。

Node to be checked.

要检查的节点。

Checks whether a node is a statement at the top level of a file.

检查节点是否是文件顶层的语句。

Asserts that a node is an identifier that might be referring to a symbol. This excludes
identifiers of named nodes like property assignments.

断言节点是可能引用符号的标识符。这不包括命名节点的标识符，如属性分配。

Start of the exclusion range.

排除范围的开始。

End of the exclusion range.

排除范围结束。

Start of the range that is being checked.

正在检查的范围的开始。

End of the range that is being checked.

正在检查的范围的末尾。

Checks whether a range is completely outside of another range.

检查一个范围是否完全在另一个范围之外。

Name of the file that the specifier will be moved to.

说明符将移动到的文件的名称。

Specifier whose path is being remapped.

正在重新映射其路径的说明符。

Remaps the specifier of a relative import from its original location to a new one.

将相对导入的说明符从其原始位置重新映射到新位置。

Whether a node is exported.

节点是否导出。

Asserts that a node is an exportable declaration, which means that it can either be exported or
it can be safely copied into another file.

断言节点是可导出声明，这意味着它可以导出或可以安全地复制到另一个文件中。

File in which to search for imports.

在其中搜索导入的文件。

Gets the index after the last import in a file. Can be used to insert new code into the file.

获取文件中最后一次导入后的索引。可用于将新代码插入文件。

Checks if any of the program's files has an import of a specific module.

检查程序的任何文件是否导入了特定模块。