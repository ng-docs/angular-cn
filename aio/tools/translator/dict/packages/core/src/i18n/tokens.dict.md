Work out the locale from the potential global properties.

从潜在的全局属性中找出语言环境。

Closure Compiler: use `goog.LOCALE`.

闭包编译器：使用 `goog.LOCALE`。

Ivy enabled: use `$localize.locale`

启用 Ivy：使用 `$localize.locale`

Example

例子

Provide this token to set the locale of your application.
It is used for i18n extraction, by i18n pipes \(DatePipe, I18nPluralPipe, CurrencyPipe,
DecimalPipe and PercentPipe\) and by ICU expressions.

提供此令牌以设置应用程序的语言环境。它通过 i18n
管道（DatePipe、I18nPluralPipe、CurrencyPipe、DecimalPipe 和 PercentPipe）和 ICU 表达式用于 i18n
提取。

See the [i18n guide](guide/i18n-common-locale-id) for more information.

有关更多信息，请参见 [i18n 指南](guide/i18n-common-locale-id)。

Provide this token to set the default currency code your application uses for
CurrencyPipe when there is no currency code passed into it. This is only used by
CurrencyPipe and has no relation to locale currency. Defaults to USD if not configured.

如果没有传递任何货币代码，请提供此令牌来设置你的应用程序用于 CurrencyPipe 的默认货币代码。仅由
CurrencyPipe 使用，与语言环境的货币无关。如果未配置，则默认为 USD。

Use this token at bootstrap to provide the content of your translation file \(`xtb`,
`xlf` or `xlf2`\) when you want to translate your application in another language.

当你想用另一种语言翻译应用程序时，可以在引导程序中使用此令牌来提供翻译文件的内容（`xtb`、`xlf`
或 `xlf2`）

See the [i18n guide](guide/i18n-common-merge) for more information.

有关更多信息，请参见 [i18n 指南](guide/i18n-common-merge)。

Provide this token at bootstrap to set the format of your {&commat;link TRANSLATIONS}: `xtb`,
`xlf` or `xlf2`.

在引导程序中提供此令牌以设置 {&commat;link TRANSLATIONS} 的格式：`xtb`、`xlf` 或 `xlf2`。

Use this enum at bootstrap as an option of `bootstrapModule` to define the strategy
that the compiler should use in case of missing translations:

在系统启动时使用此枚举作为 `bootstrapModule`
的一个选项来定义策略，编译器应该在缺少翻译的情况下使用：

Error: throw if you have missing translations.

Error：如果缺少翻译，则抛出该错误。

Warning \(default\): show a warning in the console and/or shell.

Warning（默认）：在控制台和/或应用外壳中显示警告。

Ignore: do nothing.

Ignore：什么都不做。

See the [i18n guide](guide/i18n-common-merge#report-missing-translations) for more information.

有关更多信息，请参见 [i18n 指南](guide/i18n-common-merge#report-missing-translations)。