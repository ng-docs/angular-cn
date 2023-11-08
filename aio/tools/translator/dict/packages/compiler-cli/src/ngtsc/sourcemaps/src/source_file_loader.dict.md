This class can be used to load a source file, its associated source map and any upstream sources.

此类可用于加载源文件、其关联的源映射和任何上游源。

Since a source file might reference \(or include\) a source map, this class can load those too.
Since a source map might reference other source files, these are also loaded as needed.

由于源文件可能引用（或包含）源映射，因此此类也可以加载它们。由于源映射可能会引用其他源文件，因此还会根据需要加载这些文件。

This is done recursively. The result is a "tree" of `SourceFile` objects, each containing
mappings to other `SourceFile` objects as necessary.

这是递归完成的。结果是一棵 `SourceFile` 对象的“树”，每个对象都根据需要包含到其他 `SourceFile`
对象的映射。

The path to the source file to load.

要加载的源文件的路径。

The contents of the source file to load.

要加载的源文件的内容。

The raw source-map and the path to the source-map file.

原始 source-map 和 source-map 文件的路径。

a SourceFile object created from the `contents` and provided source-map info.

从 `contents` 创建并提供 source-map 信息的 SourceFile 对象。

Load a source file from the provided content and source map, and recursively load any
referenced source files.

从提供的内容和源映射加载源文件，并递归加载任何引用的源文件。

a SourceFile object created from the `contents` and computed source-map info.

从 `contents` 和计算的 source-map 信息创建的 SourceFile 对象。

Load a source file from the provided content, compute its source map, and recursively load any
referenced source files.

从提供的内容加载源文件，计算其源映射，并递归加载任何引用的源文件。

a SourceFile object if its contents could be loaded from disk, or null otherwise.

如果可以从磁盘加载其内容，则为 SourceFile 对象，否则为 null。

Load a source file from the file-system, compute its source map, and recursively load any
referenced source files.

从文件系统加载源文件，计算其源映射，并递归加载任何引用的源文件。