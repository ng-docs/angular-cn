# Optional practices

# 可选做法

In special cases, the following practices are required.

在特殊情况下，需要以下做法。

* [Set the source locale manually][AioGuideI18nSetSourceManually] by setting the [`LOCALE_ID`][AioApiCoreLocaleId] token.

  通过设置 [`LOCALE_ID`][AioApiCoreLocaleId] 标记来[手动设置源语言环境][AioGuideI18nSetSourceManually]。

* [Import global variants of the locale data][AioGuideI18nOptionalImportGlobalVariants] for extra locale data.

  [导入语言环境数据的全局变量][AioGuideI18nOptionalImportGlobalVariants] 用作额外的语言环境数据。

* [Manage marked text with custom IDs][AioGuideI18nOptionalManageMarkedText] if you require more control over matching translations.

  如果你需要对匹配翻译进行更多控制，可以[用自定义 ID 管理标记文本][AioGuideI18nOptionalManageMarkedText]。

<!-- links -->

[AioGuideI18nOptionalManageMarkedText]: guide/i18n-optional-manage-marked-text "Optional practice: Manage marked text with custom IDs | Angular"

[AioGuideI18nOptionalImportGlobalVariants]: guide/i18n-optional-import-global-variants "Optional practice: Import global variants of the locale data | Angular"

[AioGuideI18nSetSourceManually]: guide/i18n-optional-manual-source-locale "Optional practice: Set the source locale manually | Angular"

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-09-15
