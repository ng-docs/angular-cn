Generic selector that displays the string that matches the current value.

通用选择器，用于显示与当前值匹配的字符串。

If none of the keys of the `mapping` match the `value`, then the content
of the `other` key is returned when present, otherwise an empty string is returned.

如果 `mapping` 中的任何键都不与 `value` 匹配，`other` 键的内容如果存在则返回，否则返回空字符串。

Example

例子

{&commat;example common/pipes/ts/i18n_pipe.ts region='I18nSelectPipeComponent'}



a string to be internationalized.

要国际化的字符串。

an object that indicates the text that should be displayed
for different values of the provided `value`.

一个对象，指示对不同于所提供 `value` 的值应该显示的文本。