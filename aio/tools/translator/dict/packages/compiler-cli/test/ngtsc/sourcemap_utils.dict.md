A mapping of a segment of generated text to a segment of source text.

生成的文本段到源文本段的映射。

The generated text in this segment.

此段中生成的文本。

The source text in this segment.

此句段中的源文本。

The URL of the source file for this segment.

此段的源文件的 URL。

the environment that holds the source and generated files.

包含源文件和生成文件的环境。

The name of the generated file to process.

要处理的生成文件的名称。

An array of segment mappings for each mapped segment in the given generated file.

给定生成文件中每个映射段的段映射数组。

Process a generated file to extract human understandable segment mappings.
These mappings are easier to compare in unit tests that the raw SourceMap mappings.

处理生成的文件以提取人类可理解的段映射。与原始 SourceMap
映射相比，这些映射在单元测试中更容易比较。