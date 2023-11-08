This visitor walks over HTML parse tree and converts information stored in
i18n-related attributes \("i18n" and "i18n-\*"\) into i18n meta object that is
stored with other element's and attribute's information.

此访问者会遍历 HTML 解析树，并将存储在 i18n 相关属性（“i18n”和“i18n-\*”）中的信息转换为 i18n
元对象，该对象与其他元素和属性的信息一起存储。

I18n separators for metadata

元数据的 I18n 分隔符

String that represents i18n meta

表示 i18n 元的字符串

Object with id, meaning and description fields

具有 id、meaning 和 description 字段的对象

Parses i18n metas like:

解析 i18n 元，例如：

`"@@id"`,



`"description[@@id]"`,



`"meaning|description[@@id]"`
and returns an object with parsed output.

`"meaning|description[@@id]"` 并返回具有解析输出的对象。