A codec for encoding and decoding URL parts.

用于编码和解码 URL 部分的编解码器。

The path string

路径字符串

Encodes the path from the provided string

解码所提供的字符串的路径

Decodes the path from the provided string

解码所提供的字符串的路径

The path string or object

路径字符串或对象

Encodes the search string from the provided string or object

从所提供的字符串或对象中编码搜索字符串

Decodes the search objects from the provided string

从所提供的字符串中解码搜索对象

The hash string

哈希字符串

Encodes the hash from the provided string

对所提供的字符串中的哈希进行编码

Decodes the hash from the provided string

从所提供的字符串中解码哈希

The URL string

URL 字符串

Normalizes the URL from the provided string

从所提供的字符串中标准化 URL

The URL path

网址路径

The search object

搜索对象

The has string

哈希字符串

The base URL for the URL

此 URL 的基本 URL

Normalizes the URL from the provided string, search, hash, and base URL parameters

根据所提供的字符串、搜索、哈希和基本 URL 参数标准化 URL

First string for comparison

要比较的第一个字符串

Second string for comparison

要比较的第二个字符串

Checks whether the two strings are equal

检查两个字符串是否相等

The full URL string

完整的 URL 字符串

The base for the URL

URL 的 base 部分

Parses the URL string based on the base URL

根据基本 URL 解析 URL 字符串

A `UrlCodec` that uses logic from AngularJS to serialize and parse URLs
and URL parameters.

一个 `UrlCodec`，它使用 AngularJS 中的逻辑来序列化和解析 URL 和 URL 参数。

value potential URI component to check.

值要检查的潜在 URI 组件。

the decoded URI if it can be decoded or else `undefined`.

解码的 URI（如果可以解码），否则为 `undefined`。

Tries to decode the URI component without throwing an exception.

尝试在不抛出异常的情况下解码 URI 组件。

Parses an escaped url query string into key-value pairs. Logic taken from
https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1382

将转义的 url
查询字符串解析为键值对。逻辑来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1382

Serializes into key-value pairs. Logic taken from
https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1409

序列化为键值对。逻辑来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1409

We need our custom method because encodeURIComponent is too aggressive and doesn't follow
https://tools.ietf.org/html/rfc3986 with regards to the character set \(pchar\) allowed in path
segments:
   segment       = *pchar
   pchar         = unreserved / pct-encoded / sub-delims / ":" / "&commat;"
   pct-encoded   = "%" HEXDIG HEXDIG
   unreserved    = ALPHA / DIGIT / "-" / "." / "\_" / "~"
   sub-delims    = "!" / "$" / "&" / "'" / "\(" / "\)"
                    / "*" / "+" / "," / ";" / "="

我们需要我们的自定义方法，因为 encodeURIComponent
过于激进，并且在路径段中允许的字符集（pchar）方面不遵循 https://tools.ietf.org/html/rfc3986
：segment = *pchar pchar = unreserved / pct -encoded / sub-delims / “:” / “&commat;” pct-encoded = “%”
HEXDIG HEXDIG unreserved = ALPHA / DIGIT /“-”/“。” /"\_" /"~" sub-delims = "!"
/“$”/“&”/“'”/“\(”/“\)”/“* ”/“+”/“,”/“;” / "="

Logic from https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1437

来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1437 的逻辑

This method is intended for encoding *key* or *value* parts of query component. We need a custom
method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
encoded per https://tools.ietf.org/html/rfc3986:
   query         = *\( pchar / "/" / "?" \)
   pchar         = unreserved / pct-encoded / sub-delims / ":" / "&commat;"
   unreserved    = ALPHA / DIGIT / "-" / "." / "\_" / "~"
   pct-encoded   = "%" HEXDIG HEXDIG
   sub-delims    = "!" / "$" / "&" / "'" / "\(" / "\)"
                    / "*" / "+" / "," / ";" / "="

此方法旨在编码查询组件的*键*或*值*部分。我们需要一个自定义方法，因为 encodeURIComponent
太激进了，并且会编码不必按 https://tools.ietf.org/html/rfc3986 编码的东西：query = *\( pchar /
"/" / "?" \) pchar = 未保留/pct 编码/子 delims/“:”/“&commat;”未保留=ALPHA/DIGIT/“-”/“.” /“\_”/“~”
pct-encoded = “%” HEXDIG HEXDIG sub-delims = “!” /“$”/“&”/“'”/“\(”/“\)”/“* ”/“+”/“,”/“;” / "="

Logic from https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1456

来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1456 的逻辑