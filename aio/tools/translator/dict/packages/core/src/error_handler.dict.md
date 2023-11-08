Example

例子

Provides a hook for centralized exception handling.

提供用于集中式异常处理的挂钩。

The default implementation of `ErrorHandler` prints error messages to the `console`. To
intercept error handling, write a custom exception handler that replaces this default as
appropriate for your app.

`ErrorHandler` 的默认实现将错误消息打印到
`console`。要拦截错误处理，请编写一个自定义的异常处理器，该异常处理器将把此默认行为改成你应用所需的。