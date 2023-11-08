Add the localize package

添加本地化包

To take advantage of the localization features of Angular, use the [Angular CLI][AioCliMain] to add the `@angular/localize` package to your project.

要利用 Angular 的本地化功能，请用 [Angular CLI][AioCliMain] 将 `@angular/localize` 包添加到你的项目中。

To add the `@angular/localize` package, use the following command to update the `package.json` and TypeScript configuration files in your project.

要添加 `@angular/localize` 包，请使用如下命令来更新项目中的 `package.json` 和 `polyfills.ts` 文件。

It adds `types: ["@angular/localize"]` in the TypeScript configuration files as well as the reference to the type definition of `@angular/localize` at the top of the `main.ts` file.

它在 TypeScript 配置文件中添加 `types: ["@angular/localize"]`，并在 `main.ts` 文件顶部添加对 `@angular/localize` 类型定义的引用。

If `@angular/localize` is not installed and you try to build a localized version of your project \(for example, while using the `i18n` attributes in templates\), the [Angular CLI][AioCliMain] will generate an error, which would contain the steps that you can take to enable i18n for your project.

如果尚未安装 `@angular/localize`，而你试图构建此项目的本地化版本，[Angular CLI][AioCliMain] 就会报错。

Options

选项

If set, then `$localize` can be used at runtime. Also `@angular/localize` gets included in the `dependencies` section of `package.json`, rather than `devDependencies`, which is the default.

如果设置了，则可以在运行时使用 `$localize`。同时，`@angular/localize` 也包含在 `package.json` 的 `dependencies` 部分，而不是默认的 `devDependencies`。

The name of the project.

项目的名称。

VALUE TYPE

值的类型

DEFAULT VALUE

默认值

For more available options, see [ng add][AioCliAdd] in [Angular CLI][AioCliMain].

要了解更多可用选项，请参阅 [Angular CLI][AioCliMain] 中的 [ng add][AioCliAdd]。

What's next

下一步呢？

[`@angular/localize` API][AioApiLocalize]



[Refer to locales by ID][AioGuideI18nCommonLocaleId]

[通过 ID 引用语音环境][AioGuideI18nCommonLocaleId]