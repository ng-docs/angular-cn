Construct a TS program consisting solely of an import graph, from a string-based representation
of the graph.

从图的基于字符串的表示构建一个仅由导入图组成的 TS 程序。

The `graph` string consists of semicolon separated files, where each file is specified
as a name and \(optionally\) a list of comma-separated imports or exports. For example:

`graph`
字符串由分号分隔的文件组成，其中每个文件都指定为名称和（可选）以逗号分隔的导入或导出列表。例如：

specifies a program with three files \(a.ts, b.ts, c.ts\) where a.ts imports from both b.ts and
c.ts.

指定一个具有三个文件（a.ts、b.ts、c.ts）的程序，其中 a.ts 从 b.ts 和 c.ts 导入。

A more complicated example has a dependency from b.ts to c.ts: "a:b,c;b:c;c".

一个更复杂的例子有从 b.ts 到 c.ts 的依赖关系：“a:b,c;b:c;c”。

A \* preceding a file name in the list of imports indicates that the dependency should be an
"export" and not an "import" dependency. For example:

导入列表中文件名前面的 \* 表示依赖项应该是“导出”而不是“导入”依赖项。例如：

represents a program where a.ts exports from b.ts and imports from c.ts.

表示一个程序，其中 a.ts 从 b.ts 导出并从 c.ts 导入。

An import can be suffixed with ! to make it a type-only import.

导入可以以 ! 为后缀使其成为仅限类型的导入。