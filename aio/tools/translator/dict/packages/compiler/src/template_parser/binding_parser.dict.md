Parses bindings in templates and in the directive host area.

解析模板和指令宿主区域中的绑定。

Similar to `parseInterpolation`, but treats the provided string as a single expression
element that would normally appear within the interpolation prefix and suffix \(`{{` and `}}`\).
This is used for parsing the switch expression in ICUs.

类似于 `parseInterpolation`，但将提供的字符串视为通常出现在插值前缀和后缀（`{{` 和 `}}`）中的单个表达式元素。这用于解析 ICU 中的 switch 表达式。

template binding name

模板绑定名称

template binding value

模板绑定值

span of template binding relative to entire the template

模板绑定相对于整个模板的跨度

start of the tplValue relative to the entire template

tplValue 相对于整个模板的开始

potential attributes to match in the template

模板中要匹配的潜在属性

target property bindings in the template

模板中的 target 属性绑定

target variables in the template

模板中的目标变量

Parses the bindings in a microsyntax expression, and converts them to
`ParsedProperty` or `ParsedVariable`.

解析微语法表达式中的绑定，并将它们转换为 `ParsedProperty` 或 `ParsedVariable`。

original source span

原始源跨度

absolute source span to move to

要移动到的绝对源跨度

Compute a new ParseSourceSpan based off an original `sourceSpan` by using
absolute offsets from the specified `absoluteSpan`.

使用与指定 `absoluteSpan` 的绝对偏移量，根据原始 `sourceSpan` 计算新的 ParseSourceSpan。