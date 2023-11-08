Angular uses the special entity &ngsp; as a placeholder for non-removable space.
It's replaced by the 0xE500 PUA \(Private Use Areas\) unicode character and later on replaced by a
space.
We are re-implementing the same idea since translations might contain this special character.

Angular Dart 介绍了 &ngsp;作为不可移动空间的占位符，请参阅：
https://github.com/dart-lang/angular/blob/0bb611387d29d65b5af7f9d2515ab571fd3fbee4/_tests/test/compiler/preserve_whitespace_test.dart#L25-L32 在
Angular Dart &ngsp; 中被转换为 0xE500 PUA（私人使用区域）unicode
字符，后来被空格替换。我们在这里重新实现了同一个想法，因为翻译可能包含这个特殊字符。

Object to patch

要修补的对象

Getter returning a value to patch

Getter 返回一个值给 patch

Patch a `debug` property getter on top of the existing object.

在现有对象之上修补 `debug` 属性获取器。

NOTE: always call this method with `ngDevMode && attachDebugObject(...)`

注意：始终使用 `ngDevMode && attachDebugObject(...)` 调用此方法

Current `TView`

当前 `TView`

Current `LView`

当前 `LView`

Index of `ɵɵi18nStart` instruction.

`ɵɵi18nStart` 指令的索引。

Message to translate.

要翻译的消息。

Index into the sub template of message translation. \(ie in case of
    `ngIf`\) \(-1 otherwise\)

对消息翻译的子模板的索引。（即在 `ngIf` 的情况下）（否则为-1）

Create dynamic nodes from i18n translation block.

从 i18n 翻译块创建动态节点。

Text nodes are created synchronously

文本节点是同步创建的

TNodes are linked into tree lazily

TNode 会延迟链接到树

Current `TView` needed to allocate space in i18n range.

当前 `TView` 需要在 i18n 范围内分配空间。

Root `TNode` of the i18n block. This node determines if the new TNode will be
    added as part of the `i18nStart` instruction or as part of the `TNode.insertBeforeIndex`.

i18n 块的根 `TNode`。此节点确定新的 TNode 是作为 `i18nStart` 指令的一部分还是作为
`TNode.insertBeforeIndex` 的一部分添加。

internal state for `addTNodeAndUpdateInsertBeforeIndex`.

`addTNodeAndUpdateInsertBeforeIndex` 的内部状态。

Current `LView` needed to allocate space in i18n range.

当前 `LView` 需要在 i18n 范围内分配空间。

Array storing `I18nCreateOpCodes` where new opCodes will be added.

存储 `I18nCreateOpCodes` 的数组，将在其中添加新的 opCodes。

Text to be added when the `Text` or `Comment` node will be created.

创建 `Text` 或 `Comment` 节点时要添加的文本。

true if a `Comment` node for ICU \(instead of `Text`\) node should be created.

如果要创建 ICU 的 `Comment` 节点（而不是 `Text`）节点，则为 true。

Allocate space in i18n Range add create OpCode instruction to create a text or comment node.

在 i18n Range 中分配空间 add create OpCode 指令以创建文本或注释节点。

Root `TNode` of the i18n block. This node determines if the new TNode will
    be added as part of the `i18nStart` instruction or as part of the
    `TNode.insertBeforeIndex`.

i18n 块的根 `TNode`。此节点确定新的 TNode 是作为 `i18nStart` 指令的一部分还是作为
`TNode.insertBeforeIndex` 的一部分添加。

Location where the creation OpCodes will be stored.

将存储创建的 OpCode 的位置。

The translated text \(which may contain binding\)

翻译后的文本（可能包含绑定）

Processes text node in i18n block.

处理 i18n 块中的文本节点。

Text nodes can have:

文本节点可以有：

Create instruction in `createOpCodes` for creating the text node.

在 `createOpCodes` 中创建用于创建文本节点的指令。

Allocate spec for text node in i18n range of `LView`

为 `LView` 的 i18n 范围中的文本节点分配规范

If contains binding:

如果包含绑定：

bindings => allocate space in i18n range of `LView` to store the binding value.

binds => 在 `LView` 的 i18n 范围内分配空间来存储绑定值。

populate `updateOpCodes` with update instructions.

使用更新操作指南填充 `updateOpCodes`。

See `i18nAttributes` above.

请参阅上面的 `i18nAttributes`。

Place where the update opcodes will be stored.

将存储更新操作码的地方。

The string containing the bindings.

包含绑定的字符串。

Index of the destination node which will receive the binding.

将接收绑定的目标节点的索引。

Name of the attribute, if the string belongs to an attribute.

属性的名称，如果字符串属于某个属性。

Sanitization function used to sanitize the string after update, if necessary.

如有必要，用于在更新后清理字符串的清理函数。

The lView index of the next expression that can be bound via an opCode.

可以通过 opCode 绑定的下一个表达式的 lView 索引。

The mask value for these bindings

这些绑定的掩码值

Generate the OpCodes to update the bindings of a string.

生成 OpCodes 以更新字符串的绑定。

Count the number of bindings in the given `opCodes`.

计算给定的 `opCodes` 中的绑定数。

It could be possible to speed this up, by passing the number of bindings found back from
`generateBindingUpdateOpCodes()` to `i18nAttributesFirstPass()` but this would then require more
complexity in the code and/or transient objects to be created.

可以通过将从 `generateBindingUpdateOpCodes()` 找到的绑定数量传递给 `i18nAttributesFirstPass()`
来加快此过程，但这将需要更复杂的代码和/或要创建的瞬态对象。

Since this function is only called once when the template is instantiated, is trivial in the
first instance \(since `opCodes` will be an empty array\), and it is not common for elements to
contain multiple i18n bound attributes, it seems like this is a reasonable compromise.

由于此函数仅在模板实例化时调用一次，在第一个实例中很简单（因为 `opCodes`
将是一个空数组），并且元素不常见包含多个 i18n 绑定属性，似乎这是一个合理的妥协。

Convert binding index to mask bit.

将绑定索引转换为掩码位。

Each index represents a single bit on the bit-mask. Because bit-mask only has 32 bits, we make
the 32nd bit share all masks for all bindings higher than 32. Since it is extremely rare to
have more than 32 bindings this will be hit very rarely. The downside of hitting this corner
case is that we will execute binding code more often than necessary. \(penalty of performance\)

每个索引都表示位掩码上的单个位。因为 bit-mask 只有 32 位，所以我们让第 32 位共享所有高于 32
的绑定的所有掩码。由于很少有超过 32
的绑定，因此很少会被命中。遇到这种极端情况的缺点是我们将比必要的更频繁地执行绑定代码。
（绩效处罚）

Removes everything inside the sub-templates of a message.

删除消息子模板中的所有内容。

The message to crop

要裁剪的消息

Index of the sub-template to extract. If undefined it returns the
external template and removes all sub-templates.

要提取的子模板的索引。如果未定义，则返回外部模板并删除所有子模板。

Extracts a part of a message and removes the rest.

提取消息的一部分并删除其余部分。

This method is used for extracting a part of the message associated with a template. A
translated message can span multiple templates.

此方法用于提取与模板关联的消息的一部分。翻译后的消息可以跨越多个模板。

Example:

示例：

Index where the anchor is stored and an optional `TIcuContainerNode`

存储锚点的索引和可选的 `TIcuContainerNode`

`lView[anchorIdx]` points to a `Comment` node representing the anchor for the ICU.

`lView[anchorIdx]` 指向表示 ICU 锚的 `Comment` 节点。

`tView.data[anchorIdx]` points to the `TIcuContainerNode` if ICU is root \(`null` otherwise\)

如果 ICU 是根，则 `tView.data[anchorIdx]` 指向 `TIcuContainerNode`（否则为 `null`）

Generate the OpCodes for ICU expressions.

为 ICU 表达式生成 OpCode。

Text containing an ICU expression that needs to be parsed.

包含需要解析的 ICU 表达式的文本。

Parses text containing an ICU expression and produces a JSON object for it.
Original code from closure library, modified for Angular.

解析包含 ICU 表达式的文本并为其生成 JSON 对象。来自闭包库的原始代码，针对 Angular 进行了修改。

\(sub\)Pattern to be broken.

（子）要打破的模式。

An `Array<string|IcuExpression>` where:

一个 `Array<string|IcuExpression>`，其中：

odd positions: `string` => text between ICU expressions

奇数位置：`string` => ICU 表达式之间的文本

even positions: `ICUExpression` => ICU expression parsed into `ICUExpression` record.

偶数位置：`ICUExpression` => ICU 表达式解析为 `ICUExpression` 记录。

Breaks pattern into strings and top level {...} blocks.
Can be used to break a message into text and ICU expressions, or to break an ICU expression
into keys and cases. Original code from closure library, modified for Angular.

将模式分解为字符串和顶级 {...} 块。可用于将消息拆分为文本和 ICU 表达式，或将 ICU
表达式拆分为键和案例。来自闭包库的原始代码，针对 Angular 进行了修改。

Parses a node, its children and its siblings, and generates the mutate & update OpCodes.

解析一个节点、其子项和其同级，并生成 mutate & update OpCodes。