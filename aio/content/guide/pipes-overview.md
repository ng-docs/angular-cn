# Understanding Pipes

Use [pipes](guide/glossary#pipe "Definition of a pipe") to transform strings, currency amounts, dates, and other data for display.

## What is a pipe

Pipes are simple functions to use in [template expressions](/guide/glossary#template-expression "Definition of template expression") to accept an input value and return a transformed value. Pipes are useful because you can use them throughout your application, while only declaring each pipe once.
For example, you would use a pipe to show a date as **April 15, 1988** rather than the raw string format.

<div class="alert is-helpful">

For the sample application used in this topic, see the <live-example></live-example>.

</div>

## Built-in pipes

Angular provides built-in pipes for typical data transformations, including transformations for internationalization (i18n), which use locale information to format data.
The following are commonly used built-in pipes for data formatting:

Angular 为典型的数据转换提供了内置的管道，包括国际化的转换（i18n），它使用本地化信息来格式化数据。数据格式化常用的内置管道如下：

* [`DatePipe`](api/common/DatePipe): Formats a date value according to locale rules.

  [`DatePipe`](api/common/DatePipe)：根据本地环境中的规则格式化日期值。

* [`UpperCasePipe`](api/common/UpperCasePipe): Transforms text to all upper case.

  [`UpperCasePipe`](api/common/UpperCasePipe)：把文本全部转换成大写。

* [`LowerCasePipe`](api/common/LowerCasePipe): Transforms text to all lower case.

  [`LowerCasePipe`](api/common/LowerCasePipe) ：把文本全部转换成小写。

* [`CurrencyPipe`](api/common/CurrencyPipe): Transforms a number to a currency string, formatted according to locale rules.

  [`CurrencyPipe`](api/common/CurrencyPipe) ：把数字转换成货币字符串，根据本地环境中的规则进行格式化。

* [`DecimalPipe`](/api/common/DecimalPipe): Transforms a number into a string with a decimal point, formatted according to locale rules.

  [`DecimalPipe`](/api/common/DecimalPipe)：把数字转换成带小数点的字符串，根据本地环境中的规则进行格式化。

* [`PercentPipe`](api/common/PercentPipe): Transforms a number to a percentage string, formatted according to locale rules.

  [`PercentPipe`](api/common/PercentPipe) ：把数字转换成百分比字符串，根据本地环境中的规则进行格式化。

<div class="alert is-helpful">

* For a complete list of built-in pipes, see the [pipes API documentation](/api/common#pipes "Pipes API reference summary").

  关于内置管道的完整列表，请参阅[管道 API 文档](/api/common#pipes "管道 API 参考总结") 。

* To learn more about using pipes for internationalization (i18n) efforts, see [formatting data based on locale][AioGuideI18nCommonFormatDataLocale].

</div>

Create pipes to encapsulate custom transformations and use your custom pipes in template expressions.

你还可以创建管道来封装自定义转换，并在模板表达式中使用自定义管道。

## Pipes and precedence

## 管道的优先级

The pipe operator has a higher precedence than the ternary operator (`?:`), which means `a ? b : c | x` is parsed as `a ? b : (c | x)`.
The pipe operator cannot be used without parentheses in the first and second operands of `?:`.

管道操作符要比三目运算符(`?:`)的优先级高，这意味着 `a ? b : c | x` 会被解析成 `a ? b : (c | x)`。

Due to precedence, if you want a pipe to apply to the result of a ternary, wrap the entire expression in parentheses; for example, `(a ? b : c) | x`.

由于这种优先级设定，如果你要用管道处理三目元算符的结果，就要把整个表达式包裹在括号中，比如 `(a ? b : c) | x`。

<code-example path="pipes/src/app/precedence.component.html" region="precedence" header="src/app/precedence.component.html"></code-example>

<!-- links -->

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale "Format data based on locale | Angular"

<!-- end links -->

@reviewed 2022-04-01