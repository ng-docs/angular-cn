Interface describing a file captured in the Bazel action.
https://docs.bazel.build/versions/main/skylark/lib/File.html.

描述在 Bazel 操作中捕获的文件的接口。
https://docs.bazel.build/versions/main/skylark/lib/File.html。

Execroot-relative path pointing to the file.

指向文件的 Execroot 相对路径。

The path of this file relative to its root. e.g. omitting `bazel-out/<..>/bin`.

此文件相对于其根目录的路径。例如，省略 `bazel-out/<..>/bin`。

Interface describing an entry-point.

描述入口点的接口。

ES2022 index file for the APF entry-point.

APF 入口点的 ES2022 索引文件。

Flat ES2022 ES module bundle file.

平面 ES2022 ES 模块包文件。

Flat ES2015 ES module bundle file.

平面 ES2015 ES 模块包文件。

Index type definition file for the APF entry-point.

APF 入口点的索引类型定义文件。

Whether the index or typing paths have been guessed. For entry-points built
through `ts_library`, there is no explicit setting that declares the entry-point
so the index file is guessed.

是否已猜测到索引或键入路径。对于通过 `ts_library`
构建的入口点，没有显式设置来声明入口点，因此会猜测索引文件。

Interface capturing relevant metadata for packaging.

捕获相关元数据以进行打包的接口。

NPM package name of the output.

输出的 NPM 包名称。

Record of entry-points \(including the primary one\) and their info.

入口点（包括主要入口点）及其信息的记录。

List of known `package.json` fields which provide information about
supported package formats and their associated entry paths.

已知的 `package.json` 字段的列表，这些字段提供有关受支持的包格式及其关联的条目路径的信息。

Union type matching known `package.json` format fields.

与已知 `package.json` 格式字段匹配的联合类型。

Type describing the conditional exports descriptor for an entry-point.
https://nodejs.org/api/packages.html#packages_conditional_exports

描述入口点的条件导出描述符的类型。
https://nodejs.org/api/packages.html#packages_conditional_exports

Type describing a `package.json` the packager deals with.

描述打包器处理的 `package.json` 的类型。

Relative path in the output directory where the
  file is written to.

写入文件的输出目录中的相对路径。

Content of the file.

文件的内容。

Writes a file with the specified content into the package output.

将具有指定内容的文件写入包输出。

File that should be copied.

应该复制的文件。

Copies a file into the package output to the specified location.

将文件复制到包输出中的指定位置。

Gets the relative path for the given file within the owning package. This
assumes the file is contained in the owning package.

获取给定文件在所属包中的相对路径。这假定文件包含在拥有的包中。

e.g. consider the owning package is `packages/core` and the input file
is `packages/core/testing/index.d.ts`. This function would return the
relative path as followed: `testing/index.d.ts`.

例如，考虑拥有的包是 `packages/core`，输入文件是 `packages/core/testing/index.d.ts`
。此函数将返回相对路径：`testing/index.d.ts`。

Writes an ESM file into the `esm2022` output directory.

将 ESM 文件写入 `esm2022` 输出目录。

Gets the output-relative path where the given flat ESM file should be written to.

获取应写入给定平面 ESM 文件的输出相对路径。

Gets the output-relative path where a non-flat ESM2022 file should be written to.

获取应写入非平面 ESM2022 文件的输出相对路径。

Gets the output-relative path where the typing file is being written to.

获取要写入键入文件的输出相对路径。

Gets the entry-point sub-path from the package root. e.g. if the package name
is `@angular/cdk`, then for `@angular/cdk/a11y` just `a11y` would be returned.

从包根获取入口点子路径。例如，如果包名是 `@angular/cdk`，那么对于 `@angular/cdk/a11y` `a11y`
返回 a11y。

Gets whether the given module name resolves to a secondary entry-point.
e.g. if the package name is `@angular/cdk`, then for `@angular/cdk/a11y`
this would return `true`.

获取给定的模块名称是否解析为辅助入口点。例如，如果包名是 `@angular/cdk`，那么对于
`@angular/cdk/a11y`，这将返回 `true`。

Path where the `package.json` is stored in
  the package output.

`package.json` 存储在包输出中的路径。

Parsed package.json content

解析的 package.json 内容

Whether the passed package.json has been generated.

是否已生成传递的 package.json。

Inserts or edits properties into the package.json file\(s\) in the package so that
they point to all the right generated artifacts.

将属性插入或编辑到包中的 package.json 文件中，以使它们指向所有正确生成的工件。

Updates the primary `package.json` file of the NPM package to specify
the module conditional exports and the ESM module type.

更新 NPM 包的主要 `package.json` 文件以指定模块条件导出和 ESM 模块类型。

An error if the mapping is already defined and would conflict.

如果映射已定义并且会冲突，则会出现错误。

Inserts a subpath export mapping into the specified `package.json` object.

将子路径导出映射插入指定的 `package.json` 对象。

Whether the package explicitly sets any of the format properties \(like `main`\).

包是否显式设置任何格式属性（例如 `main`）。

Normalizes the specified path by replacing backslash separators with Posix
forward slash separators.

通过使用 Posix 正斜杠分隔符替换反斜杠分隔符来规范化指定路径。