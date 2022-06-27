# Common Internationalization tasks

# 常见的国际化任务

Use the following Angular tasks to internationalize your project.

使用以下 Angular 任务来国际化你的项目。

* Use built-in pipes to display dates, numbers, percentages, and currencies in a local format.

  使用内置管道以本地格式显示日期、数字、百分比和货币。

* Mark text in component templates for translation.

  在组件模板中标记文本以进行翻译。

* Mark plural forms of expressions for translation.

  标记出要翻译的表达式的复数形式。

* Mark alternate text for translation.

  标记替代文本进行翻译。

After you prepare your project for an international audience, use the [Angular CLI][AioCliMain] to localize your project.
Complete the following tasks to localize your project.

* Use the CLI to extract marked text to a *source language* file.

  使用 CLI 将标记的文本提取到*源语言*文件中。

* Make a copy of the *source language* file for each language, and send all of *translation* files to a translator or service.

  为每种语言制作一份*源语言*文件的副本，并将所有*翻译*文件发送给翻译人员或翻译服务。

* Use the CLI to merge the finished translation files when you build your project for one or more locales.

  在为一种或多种语言环境构建项目时，使用 CLI 合并已完成的翻译文件。

<div class="alert is-helpful">

Create an adaptable user interface for all of your target locales that takes into consideration the differences in spacing for different languages.
For more details, see [How to approach internationalization][ThinkwithgoogleMarketfinderIntlEnUsGuideHowToApproachI18nOverview].

</div>

## Prerequisites

## 先决条件

To prepare your project for translations, you should have a basic understanding of the following subjects.

要准备翻译项目，你应该对以下主题有基本的了解。

* [Templates][AioGuideGlossaryTemplate]

* [Components][AioGuideGlossaryComponent]

* [Angular CLI][AioCliMain] [command-line][AioGuideGlossaryCommandLineInterfaceCli] tool for managing the Angular development cycle

* [Extensible Markup Language (XML)][W3Xml] used for translation files

## Learn about common Angular internationalization tasks

## 了解常见的 Angular 国际化任务

<div class="card-container">
    <a href="guide/i18n-common-add-package" class="docs-card" title="Add the localize package">

```
    <section>Add the localize package</section>
    <p>Learn how to add the Angular Localize package to your project</p>
    <p class="card-footer">Add the localize package</p>
</a>
<a href="guide/i18n-common-locale-id" class="docs-card" title="Refer to locales by ID">
    <section>Refer to locales by ID</section>
    <p>Learn how to identify and specify a locale identifier for your project</p>
    <p class="card-footer">Refer to locales by ID</p>
</a>
<a href="guide/i18n-common-format-data-locale" class="docs-card" title="Format data based on locale">
    <section>Format data based on locale</section>
    <p>Learn how to implement localized data pipes and override the locale for your project</p>
    <p class="card-footer">Format data based on locale</p>
</a>
<a href="guide/i18n-common-prepare" class="docs-card" title="Prepare component for translation">
    <section>Prepare component for translation</section>
    <p>Learn how to specify source text for translation</p>
    <p class="card-footer">Prepare component for translation</p>
</a>
<a href="guide/i18n-common-translation-files" class="docs-card" title="Work with translation files">
    <section>Work with translation files</section>
    <p>Learn how to review and process translation text</p>
    <p class="card-footer">Work with translation files</p>
</a>
<a href="guide/i18n-common-merge" class="docs-card" title="Merge translations into the application">
    <section>Merge translations into the application</section>
    <p>Learn how to merge translations and build your translated application</p>
    <p class="card-footer">Merge translations into the application</p>
</a>
<a href="guide/i18n-common-deploy" class="docs-card" title="Deploy multiple locales">
    <section>Deploy multiple locales</section>
    <p>Learn how to deploy multiple locales for your application</p>
    <p class="card-footer">Deploy multiple locales</p>
</a>
```

</div>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#command-line-interface-cli "command-line interface (CLI) - Glossary | Angular"

[AioGuideGlossaryComponent]: guide/glossary#component "component - Glossary | Angular"

[AioGuideGlossaryTemplate]: guide/glossary#template "template - Glossary | Angular"

<!-- external links -->

[ThinkwithgoogleMarketfinderIntlEnUsGuideHowToApproachI18nOverview]: https://marketfinder.thinkwithgoogle.com/intl/en_us/guide/how-to-approach-i18n#overview "Overview - How to approach internationalization | Market Finder | Think with Google"

[W3Xml]: https://www.w3.org/XML "Extensible Markup Language (XML) | W3C"

<!-- end links -->

@reviewed 2021-10-07