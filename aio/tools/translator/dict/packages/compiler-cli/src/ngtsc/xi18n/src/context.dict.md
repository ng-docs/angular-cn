Captures template information intended for extraction of i18n messages from a template.

捕获旨在从模板中提取 i18n 消息的模板信息。

This interface is compatible with the View Engine compiler's `MessageBundle` class, which is used
to implement xi18n for VE. Due to the dependency graph of ngtsc, an interface is needed as it
can't depend directly on `MessageBundle`.

此接口与 View Engine 编译器的 `MessageBundle` 类兼容，该类用于为 VE 实现 xi18n。由于 ngtsc
的依赖图，需要一个接口，因为它不能直接依赖于 `MessageBundle`。

Capture i18n messages from the template.

从模板捕获 i18n 消息。

In `MessageBundle` itself, this returns any `ParseError`s from the template. In this interface,
the return type is declared as `void` for simplicity, since any parse errors would be reported
as diagnostics anyway.

在 `MessageBundle` 本身中，这会返回模板中的任何 `ParseError`
。在此接口中，为简单起见，返回类型被声明为 `void`，因为任何解析错误都会被报告为诊断错误。