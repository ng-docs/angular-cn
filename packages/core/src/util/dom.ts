/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Disallowed strings in the comment.
 *
 * 注释中不允许使用的字符串。
 *
 * see: <https://html.spec.whatwg.org/multipage/syntax.html#comments>
 *
 * 请参阅： <https://html.spec.whatwg.org/multipage/syntax.html#comments>
 *
 */
const COMMENT_DISALLOWED = /^>|^->|<!--|-->|--!>|<!-$/g;
/**
 * Delimiter in the disallowed strings which needs to be wrapped with zero with character.
 *
 * 不允许使用的字符串中的分隔符，需要用零包装。
 *
 */
const COMMENT_DELIMITER = /(<|>)/;
const COMMENT_DELIMITER_ESCAPED = '\u200B$1\u200B';

/**
 * Escape the content of comment strings so that it can be safely inserted into a comment node.
 *
 * 对注释字符串的内容进行转译，以便将其安全地插入注释节点。
 *
 * The issue is that HTML does not specify any way to escape comment end text inside the comment.
 * Consider: `<!-- The way you close a comment is with ">", and "->" at the beginning or by "-->" or
 * "--!>" at the end. -->`. Above the `"-->"` is meant to be text not an end to the comment. This
 * can be created programmatically through DOM APIs. (`<!--` are also disallowed.)
 *
 * 问题是 HTML 没有指定任何方式来对注释中的注释结尾文本进行转译。考虑： `<!-- The way you close a
 * comment is with ">", and "->" at the beginning or by "-->" or "--!>" at the end. -->` . `"-->"`
 * 上方的意思是文本，而不是注释的结尾。这可以通过 DOM API 以编程方式创建。（`<!--`
 * 也不允许使用。）
 *
 * see: <https://html.spec.whatwg.org/multipage/syntax.html#comments>
 *
 * 请参阅： <https://html.spec.whatwg.org/multipage/syntax.html#comments>
 *
 * ```
 * div.innerHTML = div.innerHTML
 * ```
 *
 * One would expect that the above code would be safe to do, but it turns out that because comment
 * text is not escaped, the comment may contain text which will prematurely close the comment
 * opening up the application for XSS attack. (In SSR we programmatically create comment nodes which
 * may contain such text and expect them to be safe.)
 *
 * 人们会期望上面的代码可以安全地执行，但事实证明，由于注释文本没有被转义，因此注释可能包含文本，这会过早关闭注释，从而打开应用程序进行
 * XSS 攻击。（在 SSR 中，我们以编程方式创建可能包含此类文本的注释节点，并希望它们是安全的。）
 *
 * This function escapes the comment text by looking for comment delimiters (`<` and `>`) and
 * surrounding them with `_>_` where the `_` is a zero width space `\u200B`. The result is that if a
 * comment contains any of the comment start/end delimiters (such as `<!--`, `-->` or `--!>`) the
 * text it will render normally but it will not cause the HTML parser to close/open the comment.
 *
 * 此函数通过查找注释分隔符（`<` 和 `>`）并用 `_>_` 包围它们来转译注释文本，其中 `_` 是零宽度空格
 * `\u200B` 。结果是，如果注释包含任何注释开始/结束分隔符（例如 `<!--`、`-->` 或 `--!>`
 *），它将正常呈现文本，但不会导致 HTML 解析器关闭/打开评论。
 *
 * @param value text to make safe for comment node by escaping the comment open/close character
 *     sequence.
 *
 * 通过转义注释打开/关闭字符序列来使注释节点安全的文本。
 *
 */
export function escapeCommentText(value: string): string {
  return value.replace(
      COMMENT_DISALLOWED, (text) => text.replace(COMMENT_DELIMITER, COMMENT_DELIMITER_ESCAPED));
}
