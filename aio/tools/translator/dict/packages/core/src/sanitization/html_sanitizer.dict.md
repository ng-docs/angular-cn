SanitizingHtmlSerializer serializes a DOM fragment, stripping out any unsafe elements and unsafe
attributes.

SanitizingHtmlSerializer 序列化 DOM 片段，剥离任何不安全的元素和不安全的属性。

Escapes all potentially dangerous characters, so that the
resulting string can be safely inserted into attribute or
element text.

对所有具有潜在危险的字符进行转译，以便将结果字符串安全地插入到属性或元素文本中。

Sanitizes the given unsafe, untrusted HTML fragment, and returns HTML text that is safe to add to
the DOM in a browser environment.

清理给定的不安全、不可信的 HTML 片段，并返回可在浏览器环境中安全地添加到 DOM 的 HTML 文本。