The following set contains all keywords that can be used in the animation css shorthand
property and is used during the scoping of keyframes to make sure such keywords
are not modified.

以下集合包含可在动画 css 速记属性中使用的所有关键字，并在关键帧范围界定期间使用，以确保此类关键字未被修改。

The following class has its origin from a port of shadowCSS from webcomponents.js to TypeScript.
It has since diverge in many ways to tailor Angular's needs.

以下类起源于从 webcomponents.js 到 TypeScript 的 shadowCSS 端口。从那以后，它在许多方面都有所不同，以适应 Angular 的需求。

Source:
https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js

来源：https&#x3A; [//github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js](https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js)

The original file level comment is reproduced below

原文件级评论转载如下

Object containing as keys characters that should be substituted by placeholders
when found in strings during the css text parsing, and as values the respective
placeholders

包含作为键字符的对象，当在 css 文本解析期间在字符串中找到时应由占位符替换，以及作为相应占位符的值

the original css text.

原始的 CSS 文本。

the css text with specific characters in strings replaced by placeholders.

占位符替换字符串中特定字符的 css 文本。

Parse the provided css text and inside strings \(meaning, inside pairs of unescaped single or
double quotes\) replace specific characters with their respective placeholders as indicated
by the `ESCAPE_IN_STRING_MAP` map.

解析提供的 css 文本和内部字符串（意思是，在未转义的单引号或双引号内）将特定字符替换为其各自的占位符，如 `ESCAPE_IN_STRING_MAP` 映射所示。

For example convert the text
 `animation: "my-anim:at\"ion" 1s;`
to
 `animation: "my-anim%COLON_IN_PLACEHOLDER%at\"ion" 1s;`

例如将文本 `animation: "my-anim:at\"ion" 1s;` 转换为 `animation: "my-anim%COLON_IN_PLACEHOLDER%at\"ion" 1s;`

This is necessary in order to remove the meaning of some characters when found inside strings
\(for example `;` indicates the end of a css declaration, `,` the sequence of values and `:` the
division between property and value during a declaration, none of these meanings apply when such
characters are within strings and so in order to prevent parsing issues they need to be replaced
with placeholder text for the duration of the css manipulation process\).

这是必要的，以便删除在字符串中找到的某些字符的含义（例如 `;` 表示 css 声明的结尾 `,` 值的序列和 `:` 声明期间属性和值之间的划分，这些含义均不适用当这些字符在字符串中时，为了防止解析问题，需要在 css 操作过程中将它们替换为占位符文本）。

the css text containing the placeholders.

包含占位符的 CSS 文本。

the css text without the placeholders.

没有占位符的 css 文本。

Replace in a string all occurrences of keys in the `ESCAPE_IN_STRING_MAP` map with their
original representation, this is simply used to revert the changes applied by the
escapeInStrings function.

将字符串中所有出现的 `ESCAPE_IN_STRING_MAP` 映射中的键替换为其原始表示，这仅用于恢复 escapeInStrings 函数应用的更改。

For example it reverts the text:
 `animation: "my-anim%COLON_IN_PLACEHOLDER%at\"ion" 1s;`
to it's original form of:
 `animation: "my-anim:at\"ion" 1s;`

例如，它将文本：`animation: "my-anim%COLON_IN_PLACEHOLDER%at\"ion" 1s;` 还原为它的原始形式：`animation: "my-anim:at\"ion" 1s;`

Note: For the sake of simplicity this function does not check that the placeholders are
actually inside strings as it would anyway be extremely unlikely to find them outside of strings.

注意：为了简单起见，此函数不检查占位符是否确实在字符串内部，因为它无论如何都不太可能在字符串外部找到它们。

the string possibly containing escaped quotes.

可能包含转义引号的字符串。

boolean indicating whether the string was quoted inside a bigger string \(if not
then it means that it doesn't represent an inner string and thus no unescaping is required\)

布尔值，指示字符串是否在更大的字符串中被引用（如果不是，则意味着它不代表内部字符串，因此不需要转义）

the string in the "canonical" representation without escaped quotes.

没有转义引号的“规范”表示中的字符串。

Unescape all quotes present in a string, but only if the string was actually already
quoted.

取消转义字符串中存在的所有引号，但前提是该字符串实际上已经被引用。

This generates a "canonical" representation of strings which can be used to match strings
which would otherwise only differ because of differently escaped quotes.

这会生成字符串的“规范”表示，可用于匹配字符串，否则这些字符串只会因为不同的转义引号而不同。

For example it converts the string \(assumed to be quoted\):
 `this \\"is\\" a \\'\\\\'test`
to:
 `this "is" a '\\\\'test`
\(note that the latter backslashes are not removed as they are not actually escaping the single
quote\)

例如，它将字符串（假设被引用）：`this \\"is\\" a \\'\\\\'test` 转换为：`this "is" a '\\\\'test` （注意后者反斜杠没有被删除，因为它们实际上并没有转义单引号）

an array of context selectors that will be combined.

一组将被组合的上下文选择器。

the rest of the selectors that are not context selectors.

其余的不是上下文选择器的选择器。

Combine the `contextSelectors` with the `hostMarker` and the `otherSelectors`
to create a selector that matches the same as `:host-context()`.

将 `contextSelectors` 与 `hostMarker` 和 `otherSelectors` 结合起来，创建一个与 `:host-context()` 相同的选择器。

Given a single context selector `A` we need to output selectors that match on the host and as an
ancestor of the host:

给定一个上下文选择器 `A` 我们需要输出匹配宿主并作为宿主祖先的选择器：

When there is more than one context selector we also have to create combinations of those
selectors with each other. For example if there are `A` and `B` selectors the output is:

当有多个上下文选择器时，我们还必须创建这些选择器彼此的组合。例如，如果有 `A` 和 `B` 选择器，则输出为：

And so on...

等等...

An array of groups of strings that will be repeated. This array is mutated
    in-place.

一组将重复的字符串组。这个数组是就地变异的。

The number of times the current groups should appear.

当前组应该出现的次数。

Mutate the given `groups` array so that there are `multiples` clones of the original array
stored.

改变给定的 `groups` 数组，以便存储原始数组的 `multiples` 克隆。

For example `repeatGroups([a, b], 3)` will result in `[a, b, a, b, a, b]` - but importantly the
newly added groups will be clones of the original.

例如 `repeatGroups([a, b], 3)` 将导致 `[a, b, a, b, a, b]` - 但重要的是，新添加的组将是原始组的克隆。