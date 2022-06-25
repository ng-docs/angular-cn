# Work with translation files

# 处理翻译文件

After you prepare a component for translation, use the [`extract-i18n`][AioCliExtractI18n] [Angular CLI][AioCliMain] command to extract the marked text in the component into a *source language* file.

准备好要翻译的组件后，使用 [Angular CLI][AioCliMain] 的 [`extract-i18n`][AioCliExtractI18n] 命令将组件中的标记文本提取到*源语言*文件中。

The marked text includes text marked with `i18n`, attributes marked with `i18n-`*attribute*, and text tagged with `$localize` as described in [Prepare templates for translations][AioGuideI18nCommonPrepare].

已标记的文本包括标记为 `i18n` 的文本、标记为 `i18n-`*属性*的属性和标记为 `$localize` 的文本，如[准备翻译模板][AioGuideI18nCommonPrepare]中所述。

Complete the following steps to create and update translation files for your project.

完成以下步骤为你的项目创建和更新翻译文件。

1. [Extract the source language file][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]

   [提取源语言文件][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]

   1. Optionally, change the location, format, and name

      （可选）更改位置、格式和名称

1. Copy the source language file to [create a translation file for each language][AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]

   复制源语言文件以便为[每种语言创建一个翻译文件][AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]

1. [Translate each translation file][AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]

   [翻译每个翻译文件][AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]

1. Translate plurals and alternate expressions separately

   分别翻译复数和替代表达式

   1. [Translate plurals][AioGuideI18nCommonTranslationFilesTranslatePlurals]

      [翻译复数][AioGuideI18nCommonTranslationFilesTranslatePlurals]

   1. [Translate alternate expressions][AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]

      [翻译替代表达式][AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]

   1. [Translate nested expressions][AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]

      [翻译嵌套表达式][AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]

## Extract the source language file

## 提取源语言文件

To extract the source language file, complete the following actions.

要提取源语言文件，请完成以下操作。

1. Open a terminal window

   打开终端窗口

1. Change to the root directory of your project

   切换到你的项目根目录

1. Run the following CLI command

   运行以下 CLI 命令

   <code-example path="i18n/doc-files/commands.sh" region="extract-i18n-default" language="sh"></code-example>

The `extract-i18n` command creates a source language file named `messages.xlf` in the root directory of your project.  For more information about the XML Localization Interchange File Format (XLIFF, version 1.2), see [XLIFF][WikipediaWikiXliff].

`extract-i18n` 命令在项目的根目录中创建一个名为 `messages.xlf` 的源语言文件。有关 XML 本地化交换文件格式（XLIFF，版本 1.2）的更多信息，请参阅 [XLIFF][WikipediaWikiXliff]。

Use the following [`extract-i18n`][AioCliExtractI18n] command options to change the source language file location, format, and file name.

使用以下 [`extract-i18n`][AioCliExtractI18n] 命令选项更改源语言文件位置、格式和文件名。

| Command option | Details |
| :------------- | :------ |
| 命令选项 | 详情 |
| `--format` | Set the format of the output file |
| `--format` | 设置输出文件的格式 |
| `--outFile` | Set the name of the output file |
| `--outFile` | 设置输出文件的名称 |
| `--output-path` | Set the path of the output directory |
| `--output-path` | 设置输出目录的路径 |

### Change the source language file location

### 更改源语言文件的位置

To create a file in the `src/locale` directory, specify the output path as an option.

要在 `src/locale` 目录中创建文件，请将输出路径指定为选项。

#### `extract-18n --output-path` example

#### `extract-18n --output-path` 示例

The following example specifies the output path as an option.

以下示例将输出路径指定给选项。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-output-path" language="sh"></code-example>

### Change the source language file format

### 更改源语言文件格式

The `extract-i18n` command creates files in the following translation formats.

`extract-i18n` 命令会创建如下翻译格式的文件。

| Translation format | Details | file extension |
| :----------------- | :------ | :------------- |
| 翻译格式 | 详情 | 文件扩展名 |
| ARB | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification] | `.arb` |
| ARB | [应用资源包][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification] | `.arb` |
| JSON | [JavaScript Object Notation][JsonMain] | `.json` |
| JSON | [JavaScript 对象表示法][JsonMain] | `.json` |
| XLIFF 1.2 | [XML Localization Interchange File Format, version 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml] | `.xlf` |
| XLIFF 1.2 | [XML 本地化交换文件格式，版本 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml] | `.xlf` |
| XLIFF 2 | [XML Localization Interchange File Format, version 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf` |
| XLIFF 2 | [XML 本地化交换文件格式，版本 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf` |
| XMB | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb] | `.xmb` (`.xtb`) |
| XMB | [XML 消息包][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb] | `.xmb` (`.xtb`) |

Specify the translation format explicitly with the `--format` command option.

使用 `--format` 命令选项明确指定转换格式。

<div class="alert is-helpful">

The XMB format generates `.xmb` source language files, but uses`.xtb` translation files.

XMB 格式生成 `.xmb` 扩展名的源语言文件，但生成 `.xtb` 扩展名的翻译文件。

</div>

#### `extract-18n --format` example

#### `extract-18n --format` 示例

The following example demonstrates several translation formats.

以下示例演示了几种翻译格式。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-formats" language="sh"></code-example>

### Change the source language file name

### 更改源语言文件名

To change the name of the source language file generated by the extraction tool, use the `--outFile` command option.

要更改提取工具生成的源语言文件的名称，请使用 `--outFile` 命令选项。

#### `extract-18n --out-file` example

#### `extract-18n --out-file` 示例

The following example demonstrates naming the output file.

以下示例演示命名输出文件。

<code-example path="i18n/doc-files/commands.sh" region="extract-i18n-out-file" language="sh"></code-example>

## Create a translation file for each language

## 为每种语言创建一个翻译文件

To create a translation file for a locale or language, complete the following actions.

要为语言环境或语言创建翻译文件，请完成以下操作。

1. [Extract the source language file][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]

   [提取源语言文件][AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]

1. Make a copy of the source language file to create a *translation* file for each language

   复制源语言文件，为每种语言创建一个*翻译*文件

1. Rename the *translation* file to add the locale

   重命名*翻译*文件以添加语言环境标识

    <code-example language="file">

    messages.xlf --> message.{locale}.xlf

    </code-example>

1. Create a new directory at your project root named `locale`

   在你的项目根目录创建一个名为 `locale` 的新目录

    <code-example language="file">

    src/locale

    </code-example>

1. Move the *translation* file to the new directory

   将*翻译*文件移到新目录

1. Send the *translation* file to your translator

   将*翻译*文件发送给你的翻译人员

1. Repeat the above steps for each language you want to add to your application

   对要添加到应用程序中的每种语言重复上述步骤

### `extract-i18n` example for French

### 法语的 `extract-i18n` 示例

For example, to create a French translation file, complete the following actions.

例如，要创建法语翻译文件，请完成以下操作。

1. Run the `extract-18n` command

   运行 `extract-18n` 命令

1. Make a copy of the `messages.xlf` source language file

   复制 `messages.xlf` 源语言文件

1. Rename the copy to `messages.fr.xlf` for the French language (`fr`) translation.

   将副本重命名为 `messages.fr.xlf` 以进行法语 ( `fr` ) 翻译。

1. Move the `fr` translation file to the `src/locale` directory.

   将 `fr` 翻译文件移动到 `src/locale` 目录。

1. Send the `fr` translation file to the translator.

   将 `fr` 翻译文件发送给翻译人员。

## Translate each translation file

## 翻译每个翻译文件

Unless you are fluent in the language and have the time to edit translations, you will likely complete the following steps.

除非你精通该语言并有时间编辑翻译，否则你可能会完成以下步骤。

1. Send each translation file to a translator

   将每个翻译文件发送给翻译人员

1. The translator uses an XLIFF file editor complete the following actions

   翻译人员使用 XLIFF 文件编辑器完成以下操作

1. Create the translation

   创建翻译

1. Edit the translation

   编辑翻译

### Translation process example for French

### 法语翻译流程示例

To demonstrate the process, review the `messages.fr.xlf` file in the [Example Angular Internationalization application][AioGuideI18nExample].  The [Example Angular Internationalization application][AioGuideI18nExample] includes a French translation for you to edit without a special XLIFF editor or knowledge of French.

要演示该过程，请查看 [Angular 国际化应用范例][AioGuideI18nExample]中的 `messages.fr.xlf` 文件。[Angular 国际化应用范例][AioGuideI18nExample]中就包含法语翻译文件，你无需特殊的 XLIFF 编辑器或法语知识即可进行编辑。

The following actions describe the translation process for French.

以下操作描述了法语的翻译过程。

1. Open `messages.fr.xlf` and find the first `<trans-unit>` element.
   This is a *translation unit*, also known as a *text node*, that represents the translation of the `<h1>` greeting tag that was previously marked with the `i18n` attribute.

   打开 `messages.fr.xlf` 并找到第一个 `<trans-unit>` 元素。这是一个*翻译单元*，也称为*文本节点*，表示之前用 `i18n` 属性标记的 `<h1>` 问候标签的翻译。

   > <code-example path="i18n/doc-files/messages.fr.xlf.html" region="translated-hello-before" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>
   >
   > The `id="introductionHeader"` is a [custom ID][AioGuideI18nOptionalManageMarkedText], but without the `@@` prefix required in the source HTML.
   >
   > `id="introductionHeader"` 是一个 [自定义 ID][AioGuideI18nOptionalManageMarkedText]，但没有源 HTML 中所需的 `@@` 前缀。

1. Duplicate the `<source>...</source>` element in the text node, rename it to `target`, and then replace the content with the French text.

   复制文本节点中的 `<source>...</source>` 元素，将其重命名为 `target` ，然后将内容替换为法语文本。

   > <code-example path="i18n/doc-files/messages.fr.xlf.html" region="translated-hello" header="src/locale/messages.fr.xlf (trans-unit, after translation)"></code-example>
   >
   > In a more complex translation, the information and context in the [description and meaning elements][AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] help you choose the right words for translation.
   >
   > 在更复杂的翻译中，[描述和含义元素][AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] 中的信息和上下文可帮助你选择正确的单词进行翻译。

1. Translate the other text nodes.
    The following example displays the way to translate.

   翻译其他文本节点。以下示例显示了翻译方式。

   > <code-example path="i18n/doc-files/messages.fr.xlf.html" region="translated-other-nodes" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

    <div class="alert is-important">

    Don't change the IDs for translation units.
    Each `id` attribute is generated by Angular and depends on the content of the component text and the assigned meaning.
    If you change either the text or the meaning, then the `id` attribute changes.
    For more about managing text updates and IDs, see [custom IDs][AioGuideI18nOptionalManageMarkedText].

    不要更改这些翻译单元的 ID。每个 `id` 属性由 Angular 生成，它取决于组件文本的内容和所指定的含义。如果你更改了文本或含义，则 `id` 属性就会更改。有关管理文本更新和 ID 的更多信息，请参阅 [自定义 ID][AioGuideI18nOptionalManageMarkedText]。

    </div>

## Translate plurals

## 翻译复数

Add or remove plural cases as needed for each language.

根据需要为每种语言添加或删除复数分支。

<div class="alert is-helpful">

For language plural rules, see [CLDR plural rules][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml].

语言复数规则，参见 [CLDR 复数规则][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]。

</div>

### `minute` `plural` example

### `minute` `plural` 例子

To translate a `plural`, translate the ICU format match values.

要翻译 `plural` ，就要翻译 ICU 格式的匹配值。

* `just now`
* `one minute ago`
* `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

The following example displays the way to translate.

以下示例显示了翻译方式。

<code-example path="i18n/doc-files/messages.fr.xlf.html" region="translated-plural" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

## Translate alternate expressions

## 翻译替代表达式

Angular also extracts alternate `select` ICU expressions as separate translation units.

Angular 还会提取备用的 `select` ICU 表达式作为单独的翻译单元。

### `gender` `select` example

### `gender` `select` 示例

The following example displays a `select` ICU expression in the component template.

以下示例在组件模板中显示了一个 `select` ICU 表达式。

<code-example path="i18n/src/app/app.component.html" region="i18n-select" header="src/app/app.component.html"></code-example>

In this example, Angular extracts the expression into two translation units.
The first contains the text outside of the `select` clause, and uses a placeholder for `select` (`<x id="ICU">`):

在这个例子中，Angular 将表达式提取到两个翻译单元中。第一个包含 `select` 子句之外的文本，并为 `select` 使用占位符（ `<x id="ICU">` ）：

<code-example path="i18n/doc-files/messages.fr.xlf.html" region="translate-select-1" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

<div class="alert is-important">

When you translate the text, move the placeholder if necessary, but don't remove it.
If you remove the placeholder, the ICU expression is removed from your translated application.

翻译文本时，如有必要，请移动占位符，但不要将其删除。如果删除占位符，将从翻译完的应用程序中删除此 ICU 表达式。

</div>

The following example displays the second translation unit that contains the `select` clause.

以下示例显示包含 `select` 子句的第二个翻译单元。

<code-example path="i18n/doc-files/messages.fr.xlf.html" region="translate-select-2" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

The following example displays both translation units after translation is complete.

以下示例显示了翻译完的两个翻译单元。

<code-example path="i18n/doc-files/messages.fr.xlf.html" region="translated-select" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

## Translate nested expressions

## 翻译嵌套表达式

Angular treats a nested expression in the same manner as an alternate expression.  Angular extracts the expression into two translation units.

Angular 按照与替代表达式相同的方式处理嵌套表达式。 Angular 会将表达式提取到两个翻译单元中。

### Nested `plural` example

### 嵌套 `plural` 示例

The following example displays the first translation unit that contains the text outside of the nested expression.

以下示例显示包含嵌套表达式之外的文本的第一个翻译单元。

<code-example path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested-1" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

The following example displays the second translation unit that contains the complete nested expression.

以下示例展示了包含完整嵌套表达式的第二个翻译单元。

<code-example path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested-2" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

The following example displays both translation units after translating.

以下示例会在翻译后显示两个翻译单元。

<code-example path="i18n/doc-files/messages.fr.xlf.html" region="translate-nested" header="src/locale/messages.fr.xlf (trans-unit)"></code-example>

## What's next

## 下一步

* [Merge translations into the app][AioGuideI18nCommonMerge]

  [将翻译结果合并到应用程序中][AioGuideI18nCommonMerge]

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliExtractI18n]: cli/extract-i18n "ng extract-i18n | CLI | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#command-line-interface-cli "command-line interface (CLI) - Glossary | Angular"

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Merge translations into the application | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "Prepare templates for translations | Angular"

[AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n-common-prepare#add-helpful-descriptions-and-meanings "Add helpful descriptions and meanings - Prepare component for translation | Angular"

[AioGuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n-common-translation-files#create-a-translation-file-for-each-language "Create a translation file for each language - Work with translation files | Angular"

[AioGuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n-common-translation-files#extract-the-source-language-file "Extract the source language file - Work with translation files | Angular"

[AioGuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n-common-translation-files#translate-alternate-expressions "Translate alternate expressions - Work with translation files | Angular"

[AioGuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n-common-translation-files#translate-each-translation-file "Translate each translation file - Work with translation files | Angular"

[AioGuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n-common-translation-files#translate-nested-expressions "Translate nested expressions - Work with translation files | Angular"

[AioGuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n-common-translation-files#translate-plurals "Translate plurals - Work with translation files | Angular"

[AioGuideI18nExample]: guide/i18n-example "Example Angular Internationalization application | Angular"

[AioGuideI18nOptionalManageMarkedText]: guide/i18n-optional-manage-marked-text "Manage marked text with custom IDs | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification "ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub"

[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html "Language Plural Rules - CLDR Charts | Unicode | GitHub"

[JsonMain]: https://www.json.org "Introducing JSON | JSON"

[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: http://docs.oasis-open.org/xliff/xliff-core/xliff-core.html "XLIFF Version 1.2 Specification | Oasis Open Docs"

[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html "XLIFF Version 2.0 | Oasis Open Docs"

[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb "XMB | CLDR - Unicode Common Locale Data Repository | Unicode"

[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF "XLIFF | Wikipedia"

<!-- end links -->

@reviewed 2021-10-13
