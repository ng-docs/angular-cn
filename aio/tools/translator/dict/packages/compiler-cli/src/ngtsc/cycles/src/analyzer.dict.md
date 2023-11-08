Analyzes a `ts.Program` for cycles.

分析 `ts.Program` 的周期。

a `Cycle` object if an import between `from` and `to` would create a cycle; `null`
    otherwise.

如果 `from` 和 `to` 之间的导入将创建一个循环，则为 `Cycle` 对象；否则 `null`。

Check for a cycle to be created in the `ts.Program` by adding an import between `from` and
`to`.

通过在 `from` 和 `to` 之间添加导入来检查要在 `ts.Program` 中创建的循环。

Record a synthetic import from `from` to `to`.

记录从 `from` to `to` 的合成导入。

This is an import that doesn't exist in the `ts.Program` but will be considered as part of the
import graph for cycle creation.

这是 `ts.Program` 中不存在的导入，但将被视为创建周期的导入图的一部分。

Stores the results of cycle detection in a memory efficient manner. A symbol is attached to
source files that indicate what the cyclic analysis result is, as indicated by two markers that
are unique to this instance. This alleviates memory pressure in large import graphs, as each
execution is able to store its results in the same memory location \(i.e. in the symbol
on the source file\) as earlier executions.

以内存高效的方式存储周期检测的结果。源文件上会附加一个符号，以表明循环分析结果是什么，由此实例唯一的两个标记表示。这减轻了大型导入图中的内存压力，因为每次执行都能够将其结果存储在与早期执行相同的内存位置（即源文件上的符号中）。

Represents an import cycle between `from` and `to` in the program.

表示程序中 `from` 和 `to` 之间的导入周期。

This class allows us to do the work to compute the cyclic path between `from` and `to` only if
needed.

此类允许我们仅在需要时才计算 `from` 和 `to` 之间的循环路径。

Compute an array of source-files that illustrates the cyclic path between `from` and `to`.

计算一个源文件数组，以说明 `from` 和 `to` 之间的循环路径。

Note that a `Cycle` will not be created unless a path is available between `to` and `from`,
so `findPath()` will never return `null`.

请注意，除非 `to` 和 `from` 之间有路径，否则不会创建 `Cycle`，因此 `findPath()` 将永远不会返回
`null`。

What to do if a cycle is detected.

如果检测到周期该怎么办。

Add "remote scoping" code to avoid creating a cycle.

添加“远程范围”代码以避免创建循环。

Fail the compilation with an error.

编译失败并出现错误。