Absolute path \(on the real file-system\) to the test case being processed.

正在处理的测试用例的绝对路径（在真实文件系统上）。

a mock file-system containing the test case files.

包含测试用例文件的模拟文件系统。

Setup a mock file-system that is used to generate the partial files.

设置一个用于生成部分文件的模拟文件系统。

The result of compiling a test-case.

编译测试用例的结果。

The mock file-system where the input and generated files live.

输入和生成文件所在的模拟文件系统。

An array of paths \(relative to the testPath\) of input files to be compiled.

要编译的输入文件的路径数组（相对于 testPath）。

Any extra options to pass to the TypeScript compiler.

要传递给 TypeScript 编译器的任何额外选项。

Any extra options to pass to the Angular compiler.

要传递给 Angular 编译器的任何额外选项。

A collection of paths of the generated files \(absolute within the mock file-system\).

生成的文件的路径集合（在模拟文件系统中）。

Compile the input source `files` stored in `fs`, writing the generated files to `fs`.

编译存储在 `fs` 中的输入源 `files`，将生成的文件写入 `fs`。

the mock file-system where the compilation is happening.

发生编译的模拟文件系统。

Gets an absolute path \(in the mock file-system\) of the root directory where the compilation is to
be done.

获取要在其中完成编译的根目录的绝对路径（在模拟文件系统中）。

Gets an absolute path \(in the mock file-system\) of the directory where the compiled files are
stored.

获取存储已编译文件的目录的绝对路径（在模拟文件系统中）。

The absolute path \(within the mock file-system\) that is the root of the
    compilation.

作为编译的根的绝对路径（在模拟文件系统中）。

The absolute path \(within the mock file-system\) where compiled files will be
    written.

将写入已编译文件的绝对路径（在模拟文件系统中）。

Additional options for the TypeScript compiler.

TypeScript 编译器的其他选项。

Additional options for the Angular compiler.

Angular 编译器的其他选项。

Get the options object to pass to the compiler.

获取要传递给编译器的 options 对象。

Replace escaped line-ending markers \(\\r\\n\) with real line-ending characters.

将转义的行结尾标记（\\r\\n）替换为真实的行结尾字符。

This allows us to simulate, more reliably, files that have `\r\n` line-endings.
\(See `test_cases/r3_view_compiler_i18n/line_ending_normalization/template.html`.\)

这允许我们更可靠地模拟具有 `\r\n` 行结尾的文件。（请参阅
`test_cases/r3_view_compiler_i18n/line_ending_normalization/template.html`。）

The diagnostics to parse.

要解析的诊断信息。

Parse the `diagnostics` to extract an error message string.

解析 `diagnostics` 信息以提取错误消息字符串。

The error message includes the location if available.

错误消息包括位置（如果可用）。