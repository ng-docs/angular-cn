Reads Angular metadata from classes declared in .d.ts files and computes an `ExportScope`.

从 .d.ts 文件中声明的类读取 Angular 元数据并计算 `ExportScope`。

Given an NgModule declared in a .d.ts file, this resolver can produce a transitive `ExportScope`
of all of the directives/pipes it exports. It does this by reading metadata off of Ivy static
fields on directives, components, pipes, and NgModules.

给定在 .d.ts 文件中声明的 NgModule，此解析器可以生成它导出的所有指令/管道的可传递 `ExportScope`
。它通过从指令、组件、管道和 NgModules 上的 Ivy 静态字段中读取元数据来实现。

a `MetadataReader` which can read metadata from `.d.ts` files.

一个 `MetadataReader`，可以从 `.d.ts` 文件中读取元数据。

Resolve a `Reference`'d NgModule from a .d.ts file and produce a transitive `ExportScope`
listing the directives and pipes which that NgModule exports to others.

从 .d.ts 文件解析 `Reference` d NgModule，并生成一个可传递的 `ExportScope`，列出该 NgModule
导出给其他人的指令和管道。

This operation relies on a `Reference` instead of a direct TypeScript node as the `Reference`s
produced depend on how the original NgModule was imported.

此操作依赖于 `Reference` 而不是直接的 TypeScrpt 节点，因为生成的 `Reference` 取决于原始
NgModule 的导入方式。