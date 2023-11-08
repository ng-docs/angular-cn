These offsets should match the match-groups in `_SELECTOR_REGEXP` offsets.

这些偏移量应该与 `_SELECTOR_REGEXP` 偏移量中的 match-groups 匹配。

A css selector contains an element name,
css classes and attribute/value pairs with the purpose
of selecting subsets out of them.

css 选择器包含元素名称、css 类和属性/值对，目的是从它们中选择子集。

The selectors are encoded in pairs where:

选择器是成对编码的，其中：

even locations are attribute names

甚至位置都是属性名称

odd locations are attribute values.

奇数位置是属性值。

Example:
Selector: `[key1=value1][key2]` would parse to:

示例：Selector: `[key1=value1][key2]` 将解析为：

the attribute to unescape.

unescape 的属性。

the unescaped string.

未转义的字符串。

Unescape `\$` sequences from the CSS attribute selector.

从 CSS 属性选择器中对 `\$` 序列进行转译。

This is needed because `$` can have a special meaning in CSS selectors,
but we might want to match an attribute that contains `$`.
[MDN web link for more
info](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).

这是需要的，因为 `$` 在 CSS 选择器中可以有特殊的含义，但我们可能想要匹配包含 `$` 的属性。[MDN
Web 链接以获取更多信息](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)。

the attribute to escape.

要转义的属性。

the escaped string.

转义的字符串。

Escape `$` sequences from the CSS attribute selector.

从 CSS 属性选择器中转译 `$` 序列。

This is needed because `$` can have a special meaning in CSS selectors,
with this method we are escaping `$` with \`\\$'.
[MDN web link for more
info](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).

这是需要的，因为 `$` 在 CSS 选择器中可以有特殊的含义，使用这种方法，我们可以用 \`\\$' 对 `$`
进行转译。[MDN Web
链接以获取更多信息](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)。

Reads a list of CssSelectors and allows to calculate which ones
are contained in a given CssSelector.

读取 CssSelector 列表，并允许计算给定 CssSelector 中包含的 CssSelector。

A css selector

一个 css 选择器

This callback will be called with the object handed into `addSelectable`

将使用传递给 `addSelectable` 的对象调用此回调

boolean true if a match was found

布尔值 如果找到匹配项，则为 true

Find the objects that have been added via `addSelectable`
whose css selector is contained in the given css selector.

查找已通过 `addSelectable` 添加的对象，其 css 选择器包含在给定的 css 选择器中。