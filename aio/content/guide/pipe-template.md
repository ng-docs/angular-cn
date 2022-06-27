# Using a pipe in a template

# 在模板中使用管道

To apply a pipe, use the pipe operator (`|`) within a template expression as shown in the following code example, along with the *name* of the pipe, which is `date` for the built-in [`DatePipe`](api/common/DatePipe).

The tabs in the example show the following:

* `app.component.html` uses `date` in a separate template to display a birthday.

  `app.component.html` 在另一个单独的模板中使用 `date` 来显示生日。

* `hero-birthday1.component.ts` uses the same pipe as part of an in-line template in a component that also sets the birthday value.

  `hero-birthday1.component.ts` 使用相同的管道作为组件内嵌模板的一部分，同时该组件也会设置生日值。

<code-tabs>
    <code-pane header="src/app/app.component.html" region="hero-birthday-template" path="pipes/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/hero-birthday1.component.ts" path="pipes/src/app/hero-birthday1.component.ts"></code-pane>
</code-tabs>

The component's `birthday` value flows through the pipe operator, `|` to the [`date`](api/common/DatePipe) function.

该组件的 `birthday` 值通过管道操作符（|）流向 [`date`](api/common/DatePipe) 函数。

@reviewed 2022-04-07