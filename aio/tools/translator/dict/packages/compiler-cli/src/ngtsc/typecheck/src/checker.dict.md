Primary template type-checking engine, which performs type-checking using a
`TypeCheckingProgramStrategy` for type-checking program maintenance, and the
`ProgramTypeCheckAdapter` for generation of template type-checking code.

主要的模板类型检查引擎，它使用 `TypeCheckingProgramStrategy`
执行类型检查以进行类型检查程序维护，并使用 `ProgramTypeCheckAdapter` 来生成模板类型检查代码。

Retrieve type-checking and template parse diagnostics from the given `ts.SourceFile` using the
most recent type-checking program.

使用最新的类型检查程序从给定的 `ts.SourceFile` 中检索类型检查和模板解析诊断。

Remove any shim data that depends on inline operations applied to the type-checking program.

删除任何依赖于应用于类型检查程序的内联操作的 shim 数据。

This can be useful if new inlines need to be applied, and it's not possible to guarantee that
they won't overwrite or corrupt existing inlines that are used by such shims.

如果需要应用新的内联，这会很有用，并且无法保证它们不会覆盖或损坏此类 shim 使用的现有内联。

Data for template type-checking related to a specific input file in the user's program \(which
contains components to be checked\).

与用户程序中的特定输入文件（包含要检查的组件）相关的模板类型检查的数据。

Whether the type-checking shim required any inline changes to the original file, which affects
whether the shim can be reused.

类型检查 shim 是否需要对原始文件进行任何内联更改，这会影响 shim 是否可以重用。

Source mapping information for mapping diagnostics from inlined type check blocks back to the
original template.

用于将诊断从内联类型检查块映射回原始模板的源映射信息。

Data for each shim generated from this input file.

从此输入文件生成的每个 shim 的数据。

A single input file will generate one or more shim files that actually contain template
type-checking code.

单个输入文件将生成一个或多个实际包含模板类型检查代码的 shim 文件。

Whether the template type-checker is certain that all components from this input file have had
type-checking code generated into shims.

模板类型检查器是否确定此输入文件中的所有组件都有类型检查代码生成到 shims 中。

Drives a `TypeCheckContext` to generate type-checking code for every component in the program.

驱动 `TypeCheckContext` 为程序中的每个组件生成类型检查代码。

Drives a `TypeCheckContext` to generate type-checking code efficiently for a single input file.

驱动 `TypeCheckContext` 为单个输入文件高效地生成类型检查代码。

Drives a `TypeCheckContext` to generate type-checking code efficiently for only those components
which map to a single shim of a single input file.

驱动 `TypeCheckContext` 以仅为映射到单个输入文件的单个 shim 的那些组件高效地生成类型检查代码。

Cached scope information for a component.

组件的缓存范围信息。