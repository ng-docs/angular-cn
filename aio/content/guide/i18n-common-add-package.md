# Add the localize package

# 添加本地化包

To take advantage of the localization features of Angular, use the [Angular CLI][AioCliMain] to add the `@angular/localize` package to your project.

要利用 Angular 的本地化功能，请用 [Angular CLI][AioCliMain] 将 `@angular/localize` 包添加到你的项目中。

To add the `@angular/localize` package, use the following command to update the `package.json` and `polyfills.ts` files in your project.

要添加 `@angular/localize` 包，请使用如下命令来更新项目中的 `package.json` 和 `polyfills.ts` 文件。

<code-example path="i18n/doc-files/commands.sh" region="add-localize"></code-example>

<div class="alert is-helpful">

For more information about `package.json` and `polyfill.ts` files, see [Workspace npm dependencies][AioGuideNpmPackages].

有关 `package.json` 和 `polyfill` 包的更多信息，请参阅[工作区的 npm 依赖项][AioGuideNpmPackages]。

</div>

If `@angular/localize` is not installed and you try to build a localized version of your project, the [Angular CLI][AioCliMain] generates an error.

如果尚未安装 `@angular/localize`，而你试图构建此项目的本地化版本，[Angular CLI][AioCliMain] 就会报错。

<!--todo: add example error -->

## What's next

## 下一步呢？

* [Refer to locales by ID][AioGuideI18nCommonLocaleId]

  [通过 ID 引用语音环境][AioGuideI18nCommonLocaleId]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "Refer to locales by ID | Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-10-07