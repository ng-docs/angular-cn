The location of the start of the span \(having skipped leading trivia\).
Skipping leading trivia makes source-spans more "user friendly", since things like HTML
elements will appear to begin at the start of the opening tag, rather than at the start of any
leading trivia, which could include newlines.

跨度开始的位置（跳过了前导琐事）。跳过前导琐事使 source-spans 更加“用户友好”，因为 HTML
元素等内容将出现在开始标记的开头，而不是在任何前导琐事的开头，可能包括换行符。

The location of the end of the span.

跨度结束的位置。

The start of the token without skipping the leading trivia.
This is used by tooling that splits tokens further, such as extracting Angular interpolations
from text tokens. Such tooling creates new source-spans relative to the original token's
source-span. If leading trivia characters have been skipped then the new source-spans may be
incorrectly offset.

标记的开始，而不跳过领先的琐事。这由进一步拆分标记的工具使用，例如从文本标记中提取 Angular
插值。此类工具会创建相对于原始标记的 source-span 的新的 source-span
。如果已跳过前导琐事字符，则新的 source-spans 可能会被错误地偏移。

Additional information \(such as identifier names\) that should be associated with the span.

应该与 Span 关联的附加信息（例如标识符名称）。

Create an object that holds information about spans of tokens/nodes captured during
lexing/parsing of text.

创建一个对象，该对象包含有关在文本词法分析/解析期间捕获的标记/节点范围的信息。

Component or Directive.

组件或指令。

name of the Component or Directive.

组件或指令的名称。

reference to Component or Directive source.

对组件或指令源的引用。

instance of ParseSourceSpan that represent a given Component or Directive.

表示给定组件或指令的 ParseSourceSpan 实例。

Generates Source Span object for a given R3 Type for JIT mode.

为 JIT 模式的给定 R3 类型生成 Source Span 对象。