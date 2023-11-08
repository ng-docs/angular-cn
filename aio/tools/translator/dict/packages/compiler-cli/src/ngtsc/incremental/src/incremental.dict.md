Information about the previous compilation being used as a starting point for the current one,
including the delta of files which have logically changed and need to be reanalyzed.

有关上一次编译的信息被用作当前编译的起点，包括逻辑上已更改且需要重新分析的文件的变化情况。

Discriminant of the `Phase` type union.

`Phase` 类型的联合的判别式。

An incremental compilation undergoing analysis, and building a semantic dependency graph.

正在进行分析并构建语义依赖图的增量编译。

An incremental compilation that completed analysis and is undergoing template type-checking and
emit.

已完成分析并正在接受模板类型检查和发出的增量编译。

Represents the current phase of a compilation.

表示编译的当前阶段。

Manages the incremental portion of an Angular compilation, allowing for reuse of a prior
compilation if available, and producing an output state for reuse of the current compilation in a
future one.

管理 Angular 编译的增量部分，允许重用以前的编译（如果可用），并生成输出状态以供将来重用当前编译。

Begin a fresh `IncrementalCompilation`.

开始一个新的 `IncrementalCompilation`。

To accurately detect whether a source file was affected during an incremental rebuild, the
"original" source file needs to be consistently used.

为了准确检测源文件在增量重建期间是否受到影响，需要一致使用“原始”源文件。

First, TypeScript may have created source file redirects when declaration files of the same
version of a library are included multiple times. The non-redirected source file should be used
to detect changes, as otherwise the redirected source files cause a mismatch when compared to
a prior program.

首先，当多次包含同一版本库的声明文件时，TypeScript
可能已经创建了源文件重定向。非重定向的源文件应该用于检测更改，否则重定向的源文件与以前的程序相比会导致不匹配。

Second, the program that is used for template type checking may contain mutated source files, if
inline type constructors or inline template type-check blocks had to be used. Such source files
store their original, non-mutated source file from the original program in a symbol. For
computing the affected files in an incremental build this original source file should be used, as
the mutated source file would always be considered affected.

其次，如果必须使用内联类型构造函数或内联模板类型检查块，用于模板类型检查的程序可能包含变异的源文件。此类源文件将来自原始程序的原始、未变异的源文件存储在符号中。对于在增量构建中计算受影响的文件，应该使用此原始源文件，因为变异的源文件将始终被认为是受影响的。