Represents the possible parse modes to be used as a bitmask.

表示要用作位掩码的可能的解析模式。

Whether an output binding is being parsed.

是否正在解析输出绑定。

Whether an assignment event is being parsed, i.e. an expression originating from
two-way-binding aka banana-in-a-box syntax.

是否正在解析赋值事件，即来自双向绑定的表达式，也就是 banner-in-a-box 语法。

name of directive, without the \* prefix. For example: ngIf, ngFor

指令的名称，不带 \* 前缀。例如：ngIf、ngFor

RHS of the microsyntax attribute

微语法属性的 RHS

template filename if it's external, component filename if it's inline

如果是外部的，则为模板文件名，如果是内联的，则为组件文件名

start of the `templateKey`

`templateKey` 的开始

start of the `templateValue`

`templateValue` 值的开始

Parse microsyntax template expression and return a list of bindings or
parsing errors in case the given expression is invalid.

解析微语法模板表达式，并在给定表达式无效的情况下返回绑定或解析错误列表。

For example,

例如，

contains three bindings:

包含三个绑定：

ngFor -> null

ngFor -> 空

item -> NgForOfContext.$implicit

项 -> NgForOfContext.$implicit

ngForOf -> items

ngForOf -> 条目

This is apparent from the de-sugared template:

这从脱糖模板中可以明显看出：

Similar to `parseInterpolation`, but treats the provided string as a single expression
element that would normally appear within the interpolation prefix and suffix \(`{{` and `}}`\).
This is used for parsing the switch expression in ICUs.

类似于 `parseInterpolation`，但将提供的字符串视为通常出现在插值前缀和后缀（`{{` 和 `}}`
）中的单个表达式元素。这用于解析 ICU 中的 switch 表达式。

Splits a string of text into "raw" text segments and expressions present in interpolations in
the string.
Returns `null` if there are no interpolations, otherwise a
`SplitInterpolation` with splits that look like
  <raw text> <expression> <raw text> ... <raw text> <expression> <raw text>

将文本字符串拆分为“原始”文本段和字符串中的插值表达式。如果没有插值，则返回 `null`，否则返回
`SplitInterpolation`，其拆分看起来像<raw text><expression><raw text>...<raw
text><expression><raw text>

Describes a stateful context an expression parser is in.

描述表达式解析器所在的有状态上下文。

A Writable context is one in which a value may be written to an lvalue.
For example, after we see a property access, we may expect a write to the
property via the "=" operator.
  prop
       ^ possible "=" after

可写上下文是可以将值写入左值的上下文。例如，在我们看到属性访问之后，我们可能会期望通过“="
运算符对属性进行写入。prop ^ 可能的 "=" 之后

Whether all the parser input has been processed.

是否已处理所有解析器输入。

Index of the next token to be processed, or the end of the last token if all have been
processed.

要处理的下一个标记的索引，如果已处理全部，则为最后一个标记的结尾。

End index of the last processed token, or the start of the first token if none have been
processed.

最后处理的标记的结束索引，如果没有被处理，则为第一个标记的开始。

Returns the absolute offset of the start of the current token.

返回当前标记开始的绝对偏移量。

Position from which the `ParseSpan` will start.

`ParseSpan` 将开始的位置。

Optional ending index to be used if provided \(and if greater than the
    natural ending index\)

如果提供，则要使用的可选结尾索引（并且如果大于自然结尾索引）

Retrieve a `ParseSpan` from `start` to the current position \(or to `artificialEndIndex` if
provided\).

检索从 `start` 到当前位置的 `ParseSpan`（如果提供，则检索到 `artificialEndIndex`）。

Consumes an expected character, otherwise emits an error about the missing expected character
and skips over the token stream until reaching a recoverable point.

使用预期字符，否则会发出有关缺失的预期字符的错误并跳过标记流，直到达到可恢复点。

See `this.error` and `this.skip` for more details.

有关更多详细信息，请参阅 `this.error` 和 `this.skip`。

Parses an identifier, a keyword, a string with an optional `-` in between,
and returns the string along with its absolute source span.

解析标识符、关键字、中间带有可选 `-` 的字符串，并返回字符串及其绝对源范围。

name of the microsyntax directive, like ngIf, ngFor,
without the \*, along with its absolute span.

微语法指令的名称，例如 ngIf、ngFor，不带 \*，以及其绝对跨度。

contains five bindings:

包含五个绑定：

i -> NgForOfContext.index

我 - > NgForOfContext.index

ngForTrackBy -> func

ngForTrackBy -> 功能

For a full description of the microsyntax grammar, see
https://gist.github.com/mhevery/d3530294cff2e4a1b3fe15ff75d08855

有关微语法语法的完整描述，请参阅 https://gist.github.com/mhevery/d3530294cff2e4a1b3fe15ff75d08855

Records an error and skips over the token stream until reaching a recoverable point. See
`this.skip` for more details on token skipping.

记录错误并跳过标记流，直到达到可恢复点。有关标记跳过的更多详细信息，请参阅 `this.skip`。

The tokens for the interpolated value.

内插值的标记。

A map of index locations in the decoded template to indexes in the original template

解码模板中的索引位置到原始模板中索引的映射

Computes the real offset in the original template for indexes in an interpolation.

计算插值中索引在原始模板中的实际偏移量。

Because templates can have encoded HTML entities and the input passed to the parser at this stage
of the compiler is the _decoded_ value, we need to compute the real offset using the original
encoded values in the interpolated tokens. Note that this is only a special case handling for
`MlParserTokenType.ENCODED_ENTITY` token types. All other interpolated tokens are expected to
have parts which exactly match the input string for parsing the interpolation.

因为模板可以有编码的 HTML 实体，并且在编译器的这个阶段传递给解析器的输入是 _ 解码 _
后的值，所以我们需要使用插值标记中的原始编码值来计算实际偏移量。请注意，这只是
`MlParserTokenType.ENCODED_ENTITY`
标记类型的特例处理。所有其他插值标记都应该具有与输入字符串完全匹配的部分，以解析插值。