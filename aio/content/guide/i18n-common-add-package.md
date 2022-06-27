# Add the localize package

# 添加 localize 包

To take advantage of the localization features of Angular, use the [Angular CLI][AioCliMain] to add the `@angular/localize` package to your project.

To add the `@angular/localize` package, use the following command to update the `package.json` and `polyfills.ts` files in your project.

要添加 `@angular/localize` 包，请使用如下命令来更新项目中的 `package.json` 和 `polyfills.ts` 文件。

<code-example path="i18n/doc-files/commands.sh" region="add-localize"></code-example>

<div class="alert is-helpful">

For more information about `package.json` and `polyfill.ts` files, see [Workspace npm dependencies][AioGuideNpmPackages].

</div>

If `@angular/localize` is not installed and you try to build a localized version of your project, the [Angular CLI][AioCliMain] generates an error.

<!--todo: add example error -->

## What's next

## 下一步是什么

* [Refer to locales by ID][AioGuideI18nCommonLocaleId]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "Refer to locales by ID | Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-10-07