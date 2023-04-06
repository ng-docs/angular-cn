# Add the localize package

# 添加本地化包

To take advantage of the localization features of Angular, use the [Angular CLI][AioCliMain] to add the `@angular/localize` package to your project.

要利用 Angular 的本地化功能，请用 [Angular CLI][AioCliMain] 将 `@angular/localize` 包添加到你的项目中。

To add the `@angular/localize` package, use the following command to update the `package.json` and TypeScript configuration files in your project.

要添加 `@angular/localize` 包，请使用如下命令来更新项目中的 `package.json` 和 `polyfills.ts` 文件。

<code-example path="i18n/doc-files/commands.sh" region="add-localize"></code-example>

It adds `types: ["@angular/localize"]` in the TypeScript configuration files as well as the reference to the type definition of `@angular/localize` at the top of the `main.ts` file.

<div class="alert is-helpful">

For more information about `package.json` and `tsconfig.json` files, see [Workspace npm dependencies][AioGuideNpmPackages] and [TypeScript Configuraiton][AioGuideTsConfig].

有关 `package.json` 和 `polyfill` 包的更多信息，请参阅[工作区的 npm 依赖项][AioGuideNpmPackages]。

</div>

If `@angular/localize` is not installed and you try to build a localized version of your project (for example, while using the `i18n` attributes in templates), the [Angular CLI][AioCliMain] will generate an error, which would contain the steps that you can take to enable i18n for your project.

如果尚未安装 `@angular/localize`，而你试图构建此项目的本地化版本，[Angular CLI][AioCliMain] 就会报错。

## Options

## 选项

| OPTION             | DESCRIPTION                                                                                                                                                                                   | VALUE TYPE | DEFAULT VALUE |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------------ |
| 选项               | 说明                                                                                                                                                                                          | 值的类型   | 默认值        |
| `--project`        | The name of the project.                                                                                                                                                                      | `string`   |               |
| `--use-at-runtime` | If set, then `$localize` can be used at runtime. Also `@angular/localize` gets included in the `dependencies` section of `package.json`, rather than `devDependencies`, which is the default. | `boolean`  | `false`       |

For more available options, see [ng add][AioCliAdd] in [Angular CLI][AioCliMain].

## What's next

## 下一步呢？

* [@angular/localize API][AioApiLocalize]
* [Refer to locales by ID][AioGuideI18nCommonLocaleId]

  [通过 ID 引用语音环境][AioGuideI18nCommonLocaleId]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "Refer to locales by ID | Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

[AioGuideTsConfig]: guide/typescript-configuration "TypeScript Configuration | Angular"

[AioCliAdd]: cli/add "ng add | CLI | Angular"

[AioApiLocalize]: api/localize "$localize | @angular/localize - API | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2023-03-10
