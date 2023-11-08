Virtual file system tree that contains the source files.

包含源文件的虚拟文件系统树。

Virtual file system path that resolves to the TypeScript project.

解析为 TypeScript 项目的虚拟文件系统路径。

Base path for the virtual file system tree.

虚拟文件系统树的基本路径。

Optional file reader function. Can be used to overwrite files in
  the TypeScript program, or to add in-memory files \(e.g. to add global types\).

可选的文件阅读器功能。可用于覆盖 TypeScript 程序中的文件，或添加内存文件（例如添加全局类型）。

Additional file paths that should be added to the program.

应该添加到程序中的其他文件路径。

Creates a TypeScript program instance for a TypeScript project within
the virtual file system tree.

在虚拟文件系统树中为 TypeScript 项目创建 TypeScript 程序实例。

Overrides of the parsed compiler options.

覆盖已解析的编译器选项。

Creates the options necessary to instantiate a TypeScript program.

创建实例化 TypeScript 程序所需的选项。

Absolute path to the project.

项目的绝对路径。

File being checked.

正在检查的文件。

Program that includes the source file.

包含源文件的程序。

Checks whether a file can be migrate by our automated migrations.

检查我们的自动迁移是否可以迁移文件。