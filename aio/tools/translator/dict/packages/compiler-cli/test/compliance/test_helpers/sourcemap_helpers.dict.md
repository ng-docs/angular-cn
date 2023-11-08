The test file-system where the source, generated and expected files are stored.

存储源文件、生成文件和预期文件的测试文件系统。

The content of the generated source file.

生成的源文件的内容。

The absolute path, within the test file-system, of the generated source
    file.

生成的源文件在测试文件系统中的绝对路径。

The content of the expected source file, containing mapping information.

预期的源文件的内容，包含映射信息。

The content of the expected source file, stripped of the mapping information.

预期的源文件的内容，删除了映射信息。

Check the source-mappings of the generated source file against mappings stored in the expected
source file.

根据存储在预期源文件中的映射检查生成的源文件的 source-mappings。

The source-mappings are encoded into the expected source file in the form of an end-of-line
comment that has the following syntax:

source-mappings 以具有以下语法的行尾注释的形式编码到预期的源文件中：

The `path/to/original` path will be absolute within the mock file-system, where the root is the
directory containing the `TEST_CASES.json` file. The `generated code` and the `original source`
are not trimmed of whitespace - but there is a single space after the generated and a single
space before the original source.

`path/to/original` 路径在模拟文件系统中将是绝对路径，其中的根是包含 `TEST_CASES.json`
文件的目录。`generated code` 和 `original source` 不会删除空格 -
但生成的代码和原始源代码之前有一个空格。

A mapping of a segment of generated text to a segment of source text.

生成的文本段到源文本段的映射。

The generated text in this segment.

此段中生成的文本。

The source text in this segment.

此句段中的源文本。

The URL of the source file for this segment.

此段的源文件的 URL。

The content of the expected file containing source-map information.

包含 source-map 信息的预期文件的内容。

Extract the source-map information \(encoded in comments - see `checkMappings()`\) from the given
`expected` source content, returning both the `mappings` and the `expected` source code, stripped
of the source-mapping comments.

从给定的 `expected` 源内容中提取 source-map 信息（在注释中编码 - 请参阅 `checkMappings()`
），返回 `mappings` 和 `expected` 的源代码，去除源映射注释。

the test file-system that holds the source and generated files.

包含源文件和生成文件的测试文件系统。

The path of the generated file to process.

要处理的生成文件的路径。

The contents of the generated file to process.

要处理的生成文件的内容。

An array of segment mappings for each mapped segment in the given generated file. An
    empty array is returned if there is no source-map file found.

给定生成文件中每个映射段的段映射数组。如果找不到 source-map 文件，则返回空数组。

Process a generated file to extract human understandable segment mappings.

处理生成的文件以提取人类可理解的段映射。

These mappings are easier to compare in unit tests than the raw SourceMap mappings.

与原始 SourceMap 映射相比，这些映射在单元测试中更容易比较。

An error message if a matching segment cannot be found, or null if it can.

如果找不到匹配的段，则显示错误消息，如果可以，则为 null。

Check that the `expected` segment appears in the collection of `mappings`.

检查 `expected` 的段是否出现在 `mappings` 集合中。

Helper function for debugging failed mappings.
This lays out the segment mappings in the console to make it easier to compare.

用于调试失败的映射的帮助器函数。这会在控制台中列出段映射，以更轻松地进行比较。