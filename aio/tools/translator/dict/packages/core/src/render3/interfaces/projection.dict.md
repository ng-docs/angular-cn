Expresses a single CSS Selector.

表示单个 CSS 选择器。

Beginning of array

数组的开头

First index: element name

第一个索引：元素名称

Subsequent odd indices: attr keys

后续的奇数索引：attr 键

Subsequent even indices: attr values

后续的偶数索引：attr 值

After SelectorFlags.CLASS flag

在 SelectorFlags.CLASS 标志之后

Class name values

类名值

SelectorFlags.NOT flag

SelectorFlags.NOT 标志

Changes the mode to NOT

将模式更改为 NO

Can be combined with other flags to set the element / attr / class mode

可以与其他标志结合使用来设置元素/attr/类模式

e.g. SelectorFlags.NOT | SelectorFlags.ELEMENT

例如 SelectorFlags.NOT | SelectorFlags.ELEMENT

Example:

示例：

Original: `div.foo.bar[attr1=val1][attr2]`

原文：`div.foo.bar[attr1=val1][attr2]`

Parsed: `['div', 'attr1', 'val1', 'attr2', '', SelectorFlags.CLASS, 'foo', 'bar']`

解析后：`['div', 'attr1', 'val1', 'attr2', '', SelectorFlags.CLASS, 'foo', 'bar']`

Original: `'div[attr1]:not(.foo[attr2])`

原文: `'div[attr1]:not(.foo[attr2])`

Parsed:

解析后：

See more examples in node_selector_matcher_spec.ts

在 node_selector_matcher_spec.ts 中查看更多示例

A list of CssSelectors.

CssSelector 列表。

A directive or component can have multiple selectors. This type is used for
directive defs so any of the selectors in the list will match that directive.

指令或组件可以有多个选择器。此类型用于指令 defs，因此列表中的任何选择器都将匹配该指令。

Original: `'form, [ngForm]'`

原文：`'form, [ngForm]'`

Parsed: `[['form'], ['', 'ngForm', '']]`

解析后：`[['form'], ['', 'ngForm', '']]`

List of slots for a projection. A slot can be either based on a parsed CSS selector
which will be used to determine nodes which are projected into that slot.

投影的插槽列表。一个槽可以基于解析后的 CSS 选择器，该选择器将用于确定投影到该槽的节点。

When set to "\*", the slot is reserved and can be used for multi-slot projection
using {&commat;link ViewContainerRef#createComponent}. The last slot that specifies the
wildcard selector will retrieve all projectable nodes which do not match any selector.

当设置为“\*”时，该槽是保留的，可用于使用 {&commat;link ViewContainerRef#createComponent}
进行多槽投影。指定通配符选择器的最后一个插槽将检索与任何选择器不匹配的所有可投影节点。

Flags used to build up CssSelectors

用于构建 CssSelectors 的标志

Indicates this is the beginning of a new negative selector

表明这是新的否定选择器的开始

Mode for matching attributes

匹配属性的模式

Mode for matching tag names

匹配标签名称的模式

Mode for matching class names

匹配类名的模式