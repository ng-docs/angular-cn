In the following example, `TruncatePipe` returns the shortened value with an added ellipses.

在以下示例中，`TruncatePipe` 会返回添加了省略号的缩短值。

Invoking `{{ 'It was the best of times' | truncate }}` in a template will produce `It was...`.

调用模板中的 `{{ 'It was the best of times' | truncate }}` 将生成 `It was...`。

In the following example, `TruncatePipe` takes parameters that sets the truncated length and the
string to append with.

在以下示例中，`TruncatePipe` 接受设置截断长度的参数和要附加的字符串。

Invoking `{{ 'It was the best of times' | truncate:4:'....' }}` in a template will produce `It
was the best....`.

在模板中调用 `{{ 'ok' | repeat:3 }}` 的结果是 `okokok`。

An interface that is implemented by pipes in order to perform a transformation.
Angular invokes the `transform` method with the value of a binding
as the first argument, and any parameters as the second argument in list form.

一个需要由管道实现的接口，用于执行转换操作。
Angular 会调用它的 `transform`
方法，并把要绑定的值作为第一个参数传入，其它参数会依次从第二个参数的位置开始传入。