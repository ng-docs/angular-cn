URL string

网址字符串

The joined URL string.

联接后的 URL 字符串。

Joins two parts of a URL with a slash if needed.

如果需要，使用斜杠连接 URL 的两部分。

URL string.

网址字符串。

The URL string, modified if needed.

URL 字符串，如果需要，可以修改。

Removes a trailing slash from a URL string if needed.
Looks for the first occurrence of either `#`, `?`, or the end of the
line as `/` characters and removes the trailing slash if one exists.

如果需要，从 URL 字符串中删除尾部斜杠。寻找 `#` , `?` 的第一次出现，或将行尾作为 `/`
字符，如果存在，则删除尾部斜杠。

The normalized URL parameters string.

规范化的 URL 参数字符串。

Normalizes URL parameters by prepending with `?` if needed.

通过前缀 `?` 来规范化 URL 参数如果需要。