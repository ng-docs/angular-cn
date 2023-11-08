A codec for encoding and decoding parameters in URLs.

一个用来在 URL 中编码和解码参数的编解码器。

Used by `HttpParams`.

由 `HttpParams` 使用。

Provides encoding and decoding of URL parameter and query-string values.

提供 URL 参数和查询字符串值的编码和解码。

Serializes and parses URL parameter keys and values to encode and decode them.
If you pass URL query parameters without encoding,
the query parameters can be misinterpreted at the receiving end.

一个 `HttpParameterCodec`，它使用 `encodeURIComponent` 和 `decodeURIComponent` 来序列化和解析 URL
参数的 key 和 value。如果你传入未编码的查询参数，那么接收端可能会对这些参数进行错误解析。请使用
`HttpParameterCodec` 类对查询字符串的值进行编码和解码。

The key name.

键名。

The encoded key name.

编码过的键名。

Encodes a key name for a URL parameter or query-string.

编码 URL 参数或查询字符串的键名。

The value.

值。

The encoded value.

编码过的值。

Encodes the value of a URL parameter or query-string.

对 URL 参数或查询字符串的值进行编码。

The decoded key name.

解码过的键名。

Decodes an encoded URL parameter or query-string key.

解码编码的 URL 参数或查询字符串键。

The decoded value.

解码过的值。

Decodes an encoded URL parameter or query-string value.

解码编码的 URL 参数或查询字符串值。

Encode input string with standard encodeURIComponent and then un-encode specific characters.

使用标准 encodeURIComponent 对输入字符串进行编码，然后对特定字符进行解编码。

Options used to construct an `HttpParams` instance.

用于构造 `HttpParams` 实例的选项。

String representation of the HTTP parameters in URL-query-string format.
Mutually exclusive with `fromObject`.

HTTP 参数的 URL 查询字符串格式表示法。与 `fromObject` 互斥。

Object map of the HTTP parameters. Mutually exclusive with `fromString`.

HTTP 参数的对象映射表。与 `fromString` 互斥。

Encoding codec used to parse and serialize the parameters.

用来解析和序列化参数的编解码器。

An HTTP request/response body that represents serialized parameters,
per the MIME type `application/x-www-form-urlencoded`.

HTTP 请求体/响应体，用来表示序列化参数，它们的 MIME 类型都是
`application/x-www-form-urlencoded`。

This class is immutable; all mutation operations return a new instance.

这个类是不可变的 - 每个修改类的操作都会返回一个新实例。

The parameter name.

参数名称。

True if the parameter has one or more values,
false if it has no value or is not present.

如果参数具有一个或多个值，则为 true；如果参数没有值或不存在，则为 false。

Reports whether the body includes one or more values for a given parameter.

报告主体中是否包含给定参数的一个或多个值。

The first value of the given parameter,
or `null` if the parameter is not present.

获取给定参数名对应的第一个值，如果没有则返回 `null`。

Retrieves the first value for a parameter.

检索参数的第一个值。

All values in a string array,
or `null` if the parameter not present.

获取给定参数名对应的所有值，如果没有则返回 `null`。

Retrieves all values for a  parameter.

检索某个参数的所有值。

The parameter names in a string array.

字符串数组中的参数名称。

Retrieves all the parameters for this body.

检索此 `body` 的所有参数。

The new value to add.

要添加的新值。

A new body with the appended value.

构造一个新的 `body`，添加一个具有给定参数名的值。

Appends a new value to existing values for a parameter.

将新值附加到参数的现有值。

parameters and values

参数和值

A new body with the new value.

构造一个新的 `body`，具有一个给定参数名的新值。

Constructs a new body with appended values for the given parameter name.

使用给定参数名称的附加值构造一个新主体。

The new value.

新值。

Replaces the value for a parameter.

替换参数的值。

The value to remove, if provided.

要删除的值（如果提供）。

A new body with the given value removed, or with all values
removed if no value is specified.

删除给定值的新主体，如果未指定值，则删除所有值。

Removes a given value or all values from a parameter.

从参数中删除给定值或所有值。

Serializes the body to an encoded string, where key-value pairs \(separated by `=`\) are
separated by `&`s.

把该 `body` 序列化为一个编码过的字符串，其中的 key-value 对（用 `=` 分隔）会以 `&` 分隔。