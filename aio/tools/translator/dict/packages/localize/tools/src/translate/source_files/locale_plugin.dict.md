The name of the locale to inline into the code.

要内联到代码中的语言环境的名称。

Additional options including the name of the `$localize` function.

其他选项包括 `$localize` 函数的名称。

This Babel plugin will replace the following code forms with a string literal containing the
given `locale`.

这个 Babel 插件将用包含给定 `locale` 字符串文字替换以下代码形式。

`$localize.locale`                                            -> `"locale"`



`typeof $localize !== "undefined" && $localize.locale`        -> `"locale"`



`xxx && typeof $localize !== "undefined" && $localize.locale` -> `"xxx && locale"`



`$localize.locale || default`                                 -> `"locale" || default`



the expression to check

要检查的表达式

the name of the `$localize` symbol

`$localize` 符号的名称

Returns true if the expression one of:

如果表达式是以下之一，则返回 true：