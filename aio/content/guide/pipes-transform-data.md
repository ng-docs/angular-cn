# Transforming data with parameters and chained pipes

# 使用参数和管道链来格式化数据

Use optional parameters to fine-tune a pipe's output.
For example, use the [`CurrencyPipe`](api/common/CurrencyPipe "API reference") with a country code such as EUR as a parameter.
The template expression `{{ amount | currency:'EUR' }}` transforms the `amount` to currency in euros.
Follow the pipe name (`currency`) with a colon (`:`) and the parameter value (`'EUR'`).

可以用可选参数微调管道的输出。比如，你可以使用 [`CurrencyPipe`](api/common/CurrencyPipe "API 参考") 和国家代码（如 EUR）作为参数。模板表达式 `{{ amount | currency:'EUR' }}` 会把 `amount` 转换成欧元。紧跟在管道名称（`currency`）后面的是冒号（`:`）和参数值（`'EUR'`）。

If the pipe accepts multiple parameters, separate the values with colons.
For example, `{{ amount | currency:'EUR':'Euros '}}` adds the second parameter, the string literal `'Euros '`, to the output string. Use any valid template expression as a parameter, such as a string literal or a component property.

如果管道能接受多个参数，就用冒号分隔这些值。比如，`{{ amount | currency:'EUR':'Euros '}}` 会把第二个参数（字符串 `'Euros '`）添加到输出字符串中。你可以使用任何有效的模板表达式作为参数，比如字符串字面量或组件的属性。

Some pipes require at least one parameter and allow more optional parameters, such as [`SlicePipe`](api/common/SlicePipe "API reference for SlicePipe"). For example, `{{ slice:1:5 }}` creates a new array or string containing a subset of the elements starting with element `1` and ending with element `5`.

有些管道需要至少一个参数，并且允许使用更多的可选参数，比如 [`SlicePipe`](api/common/SlicePipe "SlicePipe 的 API 参考")。比如，`{{ slice:1:5 }}` 会创建一个新数组或字符串，它以第 `1` 个元素开头，并以第 `5` 个元素结尾。

## Example: Formatting a date

## 范例：格式化日期

The tabs in the following example demonstrates toggling between two different formats (`'shortDate'` and `'fullDate'`):

下面的例子显示了两种不同格式（`'shortDate'` 和 `'fullDate'`）之间的切换：

* The `app.component.html` template uses a format parameter for the [`DatePipe`](api/common/DatePipe) (named `date`) to show the date as **04/15/88**.

  该 `app.component.html` 模板使用 [`DatePipe`](api/common/DatePipe)（名为 `date`）的格式参数把日期显示为 **04/15/88**。

* The `hero-birthday2.component.ts` component binds the pipe's format parameter to the component's `format` property in the `template` section, and adds a button for a click event bound to the component's `toggleFormat()` method.

  `hero-birthday2.component.ts` 组件把该管道的 format 参数绑定到 `template` 中组件的 `format` 属性，并添加了一个按钮，其 click 事件绑定到了该组件的 `toggleFormat()` 方法。

* The `hero-birthday2.component.ts` component's `toggleFormat()` method toggles the component's `format` property between a short form
  (`'shortDate'`) and a longer form (`'fullDate'`).

  `hero-birthday2.component.ts` 组件的 `toggleFormat()` 方法会在短格式（`'shortDate'`）和长格式（`'fullDate'`）之间切换该组件的 `format` 属性。

<code-tabs>
    <code-pane header="src/app/app.component.html" region="format-birthday" path="pipes/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/hero-birthday2.component.ts (template)" region="template" path="pipes/src/app/hero-birthday2.component.ts"></code-pane>
    <code-pane header="src/app/hero-birthday2.component.ts (class)" region="class" path="pipes/src/app/hero-birthday2.component.ts"></code-pane>
</code-tabs>

Clicking the **Toggle Format** button alternates the date format between **04/15/1988** and **Friday, April 15, 1988**.

点击 **Toggle Format** 按钮可以在 **04/15/1988** 和 **Friday, April 15, 1988** 之间切换日期格式。

<div class="alert is-helpful">

For `date` pipe format options, see [DatePipe](api/common/DatePipe "DatePipe API Reference page").

关于 `date` 管道的格式选项，参阅 [DatePipe](api/common/DatePipe "DatePipe API 参考手册页面")。

</div>

## Example: Applying two formats by chaining pipes

## 范例：通过串联管道应用两种格式

Chain pipes so that the output of one pipe becomes the input to the next.

可以对管道进行串联，以便一个管道的输出成为下一个管道的输入。

In the following example, chained pipes first apply a format to a date value, then convert the formatted date to uppercase characters.
The first tab for the `src/app/app.component.html` template chains `DatePipe` and `UpperCasePipe` to display the birthday as **APR 15, 1988**.
The second tab for the `src/app/app.component.html` template passes the `fullDate` parameter to `date` before chaining to `uppercase`, which produces **FRIDAY, APRIL 15, 1988**.

在下面的范例中，串联管道首先将格式应用于一个日期值，然后将格式化之后的日期转换为大写字符。`src/app/app.component.html` 模板的第一个标签页把 `DatePipe` 和 `UpperCasePipe` 的串联起来，将其显示为 **APR 15, 1988**。`src/app/app.component.html` 模板的第二个标签页在串联 `uppercase` 之前，还把 `fullDate` 参数传给了 `date`，将其显示为 **FRIDAY, APRIL 15, 1988**。

<code-tabs>
    <code-pane header="src/app/app.component.html (1)" region="chained-birthday" path="pipes/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/app.component.html (2)" region="chained-parameter-birthday" path="pipes/src/app/app.component.html"></code-pane>
</code-tabs>

@reviewed 2022-4-01