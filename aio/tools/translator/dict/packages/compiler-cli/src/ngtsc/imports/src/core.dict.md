Rewrites imports of symbols being written into generated code.

重写正在写入生成代码的符号的导入。

Should the given symbol be imported at all?

给定的符号是否应该导入？

If `true`, the symbol should be imported from the given specifier. If `false`, the symbol
should be referenced directly, without an import.

如果为 `true`，则应从给定的说明符导入符号。如果 `false`，则应直接引用该符号，而不需要导入。

Optionally rewrite a reference to an imported symbol, changing either the binding prefix or the
symbol name itself.

（可选）重写对导入符号的引用，更改绑定前缀或符号名称本身。

Optionally rewrite the given module specifier in the context of a given file.

（可选）在给定文件的上下文中重写给定的模块说明符。

`ImportRewriter` that does no rewriting.

不重写的 `ImportRewriter`。

A mapping of supported symbols that can be imported from within &commat;angular/core, and the names by
which they're exported from r3_symbols.

可以从 &commat;angular/core 中导入的受支持符号的映射，以及从 r3_symbols 导出它们的名称。

`ImportRewriter` that rewrites imports from '&commat;angular/core' to be imported from the r3_symbols.ts
file instead.

`ImportRewriter`，它将从 '&commat;angular/core' 的导入重写为从 r3_symbols.ts 文件导入。