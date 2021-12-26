# Import global variants of the locale data

# 导入语言环境数据的全局变体

The [Angular CLI][AioCliMain] automatically includes locale data if you run the [`ng build`][AioCliBuild] command with the `--localize` option.

如果你使用 `--localize` 选项运行 [`ng build`][AioCliBuild] 命令，则 [Angular CLI][AioCliMain] 会自动包含语言环境数据。

<!--todo: replace with code-example -->

<code-example language="sh">

ng build --localize

</code-example>

The `@angular/common` package on npm contains the locale data files.
Global variants of the locale data are available in [`@angular/common/locales/global`][GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal].

npm 上的 `@angular/common` 包中包含语言环境数据文件。语言环境数据的全局变体来自 [`@angular/common/locales/global`][GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal]。

## `import` example for French

## 法语的 `import` 示例

The following example imports the global variants for French (`fr`).

以下示例导入了法语 ( `fr` ) 的全局变体。

<code-example path="i18n/doc-files/app.module.ts" header="src/app/app.module.ts" region="global-locale"></code-example>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/master/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"

[GithubAngularAngularTreeMasterPackagesCommonLocalesGlobal]: https://github.com/angular/angular/tree/master/packages/common/locales/global "angular/packages/common/locales/global | angular/angular | GitHub"

<!-- end links -->

@reviewed 2021-10-13
