Represents the header configuration options for an HTTP request.
Instances are immutable. Modifying methods return a cloned
instance with the change. The original object is never changed.

Http 头的不可变集合，惰性解析。

Constructs a new HTTP header object with the given values.

使用给定的值构造一个新的 HTTP 标头对象。

The header name to check for existence.

要检查是否存在的头名称

True if the header exists, false otherwise.

这个头是否存在。

Checks for existence of a given header.

检查是否存在指定名称的头。

The header name.

标头名称。

The value string if the header exists, null otherwise

如果头存在则返回一个字符串，否则返回 null

Retrieves the first value of a given header.

返回匹配指定名称的第一个头的值。

A list of header names.

一个头名称列表。

Retrieves the names of the headers.

返回所有的头名称。

The header name from which to retrieve values.

准备获取值的头名称

A string of values if the header exists, null otherwise.

如果标头存在则返回一个字符串数组，否则返回 null。

Retrieves a list of values for a given header.

返回头中具有指定名称的值的列表。

The header name for which to append the values.

要附加值的标头名称。

The value to append.

要附加的值。

A clone of the HTTP headers object with the value appended to the given header.

HTTP 标头对象的克隆，带有由给定标头追加的值。

Appends a new value to the existing set of values for a header
and returns them in a clone of the original instance.

将新值附加到标头的现有值集中，并在原始实例的克隆中返回它们。

The value or values to set or override for the given header.

要设置或覆盖给定标头的一个或多个值。

A clone of the HTTP headers object with the newly set header value.

HTTP 标头对象的克隆，其中包含新设置的标头值。

Sets or modifies a value for a given header in a clone of the original instance.
If the header already exists, its value is replaced with the given value
in the returned object.

设置或修改原始实例的克隆中给定标头的值。如果标题已经存在，则其值将在返回对象中被给定值替换。

The value or values to delete for the given header.

要删除的给定标头的一个或多个值。

A clone of the HTTP headers object with the given value deleted.

HTTP 标头对象的克隆，其中删除了给定值。

Deletes values for a given header in a clone of the original instance.

在原始实例的克隆中删除给定标头的值。

Verifies that the headers object has the right shape: the values
must be either strings, numbers or arrays. Throws an error if an invalid
header value is present.

验证标头对象是否具有正确的形状：值必须是字符串或数组。如果存在无效的标头值，则抛出错误。