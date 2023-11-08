Used for stringify render output in Ivy.
Important! This function is very performance-sensitive and we should
be extra careful not to introduce megamorphic reads in it.
Check `core/test/render3/perf/render_stringify` for benchmarks and alternate implementations.

用于在 Ivy
中字符串化渲染输出。重要！此函数对性能非常敏感，我们要特别注意不要在其中引入超态读取。检查
`core/test/render3/perf/render_stringify` 以获取基准测试和替代实现。

Used to stringify a value so that it can be displayed in an error message.
Important! This function contains a megamorphic read and should only be
used for error messages.

用于字符串化一个值，以便它可以在错误消息中显示。重要！此函数包含大态读取，应仅用于错误消息。