# Add the localize package

# 添加本地化包

{@a setting-up-cli}
{@a add-localize}

To take advantage of the localization features of Angular, use the Angular CLI to add the `@angular/localize` package to your project.

要利用 Angular 的本地化功能，请用 Angular CLI 将 `@angular/localize` 包添加到你的项目中。

<code-example path="i18n/doc-files/commands.sh" region="add-localize" language="sh"></code-example>

This command updates the `package.json` and `polyfills.ts` files of your project to import the `@angular/localize` package.

此命令会更新项目的 `package.json` 和 `polyfills.ts` 文件以导入 `@angular/localize` 包。

<div class="alert is-helpful">

For more information about `package.json` and polyfill packages, see [Workspace npm dependencies][AioGuideNpmPackages].

有关 `package.json` 和 polyfill 包的更多信息，请参阅[工作区的 npm 依赖项][AioGuideNpmPackages]。

</div>

If `@angular/localize` is not installed, the Angular CLI may generate an error when you try to build a localized version of your application.

如果未安装 `@angular/localize` ，当你尝试构建应用程序的本地化版本时，Angular CLI 可能会产生错误。

<!-- links -->

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-09-15
