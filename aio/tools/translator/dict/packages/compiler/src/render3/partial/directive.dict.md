Every time we make a breaking change to the declaration interface or partial-linker behavior, we
must update this constant to prevent old partial-linkers from incorrectly processing the
declaration.

每次我们对声明接口或部分链接器行为进行重大更改时，我们都必须更新此常量以防止旧的部分链接器错误地处理声明。

Do not include any prerelease in these versions as they are ignored.

不要在这些版本中包含任何预发行版，因为它们被忽略。

Compile a directive declaration defined by the `R3DirectiveMetadata`.

编译由 `R3DirectiveMetadata` 定义的指令声明。

Gathers the declaration fields for a directive into a `DefinitionMap`. This allows for reusing
this logic for components, as they extend the directive metadata.

将指令的声明字段收集到 `DefinitionMap` 中。这允许为组件重用此逻辑，因为它们扩展了指令元数据。

Compiles the metadata of a single query into its partial declaration form as declared
by `R3DeclareQueryMetadata`.

将单个查询的元数据编译为 `R3DeclareQueryMetadata` 声明的其部分声明形式。

Compiles the host metadata into its partial declaration form as declared
in `R3DeclareDirectiveMetadata['host']`

将宿主元数据编译为其在 `R3DeclareDirectiveMetadata['host']` 中声明的部分声明形式