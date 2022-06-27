# Import global variants of the locale data

# 导入语言环境数据的全局变体

The [Angular CLI][AioCliMain] automatically includes locale data if you run the [`ng build`][AioCliBuild] command with the `--localize` option.

<!--todo: replace with code-example -->

<code-example format="shell" language="shell">

ng build --localize

</code-example>

The `@angular/common` package on npm contains the locale data files.
Global variants of the locale data are available in [`@angular/common/locales/global`][UnpkgBrowseAngularCommonLocalesGlobal].

## `import` example for French

## 法语的 `import` 示例

The following example imports the global variants for French (`fr`).

以下示例导入了法语 ( `fr` ) 的全局变体。

<code-example header="src/app/app.module.ts" path="i18n/doc-files/app.module.ts" region="global-locale"></code-example>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocalesGlobal]: https://unpkg.com/browse/@angular/common/locales/global "@angular/common/locales/global | Unpkg"

<!-- end links -->

@reviewed 2022-02-28