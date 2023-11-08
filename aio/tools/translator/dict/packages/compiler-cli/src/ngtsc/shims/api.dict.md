Generates a single shim file for the entire program.

为整个程序生成单个 shim 文件。

Whether this shim should be emitted during TypeScript emit.

是否应在 TypeScript 发出期间发出此 shim。

Create a `ts.SourceFile` representing the shim, with the correct filename.

使用正确的文件名创建一个表示 shim 的 `ts.SourceFile`。

Generates a shim file for each original `ts.SourceFile` in the user's program, with a file
extension prefix.

为用户程序中的每个原始 `ts.SourceFile` 生成一个 shim 文件，带有文件扩展名前缀。

The extension prefix which will be used for the shim.

将用于 shim 的扩展前缀。

Knowing this allows the `ts.CompilerHost` implementation which is consuming this shim generator
to predict the shim filename, which is useful when a previous `ts.Program` already includes a
generated version of the shim.

知道这一点，可以让使用此 shim 生成器的 `ts.CompilerHost` 实现来预测 shim 文件名，这在以前的
`ts.Program` 已经包含生成的 shim 版本时会很有用。

Whether shims produced by this generator should be emitted during TypeScript emit.

此生成器生成的 shim 是否应在 TypeScript 发出期间发出。

Generate the shim for a given original `ts.SourceFile`, with the given filename.

使用给定的文件名，为给定的原始 `ts.SourceFile` 生成 shim。