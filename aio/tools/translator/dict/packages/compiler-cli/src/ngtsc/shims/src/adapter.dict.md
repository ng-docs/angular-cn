Generates and tracks shim files for each original `ts.SourceFile`.

为每个原始 `ts.SourceFile` 生成并跟踪 shim 文件。

The `ShimAdapter` provides an API that's designed to be used by a `ts.CompilerHost`
implementation and allows it to include synthetic "shim" files in the program that's being
created. It works for both freshly created programs as well as with reuse of an older program
\(which already may contain shim files and thus have a different creation flow\).

`ShimAdapter` 提供了一个旨在供 `ts.CompilerHost` 实现使用的
API，并允许它在正在创建的程序中包含合成的“shim”文件。它适用于新创建的程序以及重用旧程序（可能已经包含
shim 文件，因此具有不同的创建流程）。

A `Set` of shim `ts.SourceFile`s which should not be emitted.

不应该发出的一 `Set` shim `ts.SourceFile`。

A list of extra filenames which should be considered inputs to program creation.

应被视为程序创建的输入的额外文件名列表。

This includes any top-level shims generated for the program, as well as per-file shim names for
those files which are included in the root files of the program.

这包括为程序生成的任何顶级 shim，以及程序根文件中包含的这些文件的每个文件 shim 名称。

Extension prefixes of all installed per-file shims.

所有已安装的每文件 shim 的扩展前缀。

Produce a shim `ts.SourceFile` if `fileName` refers to a shim file which should exist in the
program.

如果 `fileName` 引用程序中应该存在的 shim 文件，则生成一个 shim `ts.SourceFile`。

If `fileName` does not refer to a potential shim file, `null` is returned. If a corresponding
base file could not be determined, `undefined` is returned instead.

如果 `fileName` 不引用潜在的 shim 文件，则返回 `null`。如果无法确定对应的基础文件，则会返回
`undefined`。