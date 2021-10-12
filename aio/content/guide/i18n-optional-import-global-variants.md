# Import global variants of the locale data

# 导入语言环境数据的全局变量

{@a import-locale}

Angular will automatically include locale data if you configure the locale using the `--localize` option with [`ng build`][AioCliBuild] CLI command.

如果你是用 `--localize` 选项和 [`ng build`][AioCliBuild] CLI 命令配置的语言环境，Angular 将自动包含语言环境数据。

The [Angular repository][GithubAngularAngularTreeMasterPackagesCommonLocales] files (`@angular/common/locales`) contain most of the locale data that you need, but some advanced formatting options require additional locale data.

[Angular 存储库][GithubAngularAngularTreeMasterPackagesCommonLocales]中的一些文件(`@angular/common/locales`)包含你需要的大部分语言环境数据，但一些高级格式化选项需要额外的语言环境数据。

Global variants of the locale data are available in [`@angular/common/locales/global`][GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal].

语言环境数据的全局变量在 [`@angular/common/locales/global`][GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal] 中。

The following example imports the global variants for French (`fr`).

以下示例导入法语 ( `fr` ) 的全局变量。

<code-example path="i18n/doc-files/app.module.ts" header="src/app/app.module.ts" region="global-locale"></code-example>

<!-- links -->

[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/master/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"

[GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal]: https://github.com/angular/angular/tree/master/packages/common/locales/global "angular/packages/common/locales/global | angular/angular | GitHub"

<!-- end links -->

@reviewed 2021-09-15
