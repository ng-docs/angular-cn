Every time we make a breaking change to the declaration interface or partial-linker behavior, we
must update this constant to prevent old partial-linkers from incorrectly processing the
declaration.

每次我们对声明接口或部分链接器行为进行重大更改时，我们都必须更新此常量以防止旧的部分链接器错误地处理声明。

Do not include any prerelease in these versions as they are ignored.

不要在这些版本中包含任何预发行版，因为它们被忽略。

Compile a Injectable declaration defined by the `R3InjectableMetadata`.

编译由 `R3InjectableMetadata` 定义的 Injectable 声明。

Gathers the declaration fields for a Injectable into a `DefinitionMap`.

将 Injectable 的声明字段收集到 `DefinitionMap` 中。