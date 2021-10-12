# Prepare templates for translations

# 准备翻译模板

{@a template-translations}

To translate the templates of your application, prepare the text for a translator or translation service by marking text, attributes, and other elements with the Angular `i18n` attribute.
Complete the following actions to mark text, attributes, and other elements with the Angular `i18n` attribute.

要翻译应用程序的模板，请使用 Angular 的 `i18n` 属性来标记文本、属性和其他元素，为翻译器或翻译服务准备文本。完成以下操作以使用 Angular `i18n` 属性标记文本、属性和其他元素。

1. [Mark text for translations][AioGuideI18nCommonPrepareMarkTextForTranslations].

   [标记要翻译的文本][AioGuideI18nCommonPrepareMarkTextForTranslations]。

1. [Add helpful descriptions and meanings][AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] to help the translator with additional information or context.

   [添加有用的描述和含义][AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]来为翻译人员提供更多信息或上下文。

1. [Translate text not for display][AioGuideI18nCommonPrepareTranslateTextNotForDisplay].

   [翻译非元素文本][AioGuideI18nCommonPrepareTranslateTextNotForDisplay]。

1. [Mark element attributes for translations][AioGuideI18nCommonPrepareMarkElementAttributesForTranslations], such as the `title` attribute of an image.

   [标记要翻译的元素属性][AioGuideI18nCommonPrepareMarkElementAttributesForTranslations]，例如图片的 `title` 属性。

1. [Mark plurals and alternates for translation][AioGuideI18nCommonPrepareMarkPluralsAndAlternatesForTranslation] in order to comply with the pluralization rules and grammatical constructions of different languages.

   [标记复数和替代翻译][AioGuideI18nCommonPrepareMarkPluralsAndAlternatesForTranslation]以符合不同语言的复数规则和语法结构。

### Mark text for translations

### 标记要翻译的文本

{@a i18n-attribute}

Mark the static text messages in your component templates for translation using the `i18n` attribute.
Place it on every element tag with fixed text to be translated.

使用 `i18n` 属性标记要翻译的组件模板中的静态文本消息。将它放在每个元素标签上，并带有要翻译的固定文本。

For example, the following `<h1>` tag displays a simple English language greeting, "Hello i18n!".

例如，以下 `<h1>` 标记显示简单的英语问候语 “Hello i18n！”。

<code-example path="i18n/doc-files/app.component.html" region="greeting" header="src/app/app.component.html"></code-example>

To mark the greeting for translation, add the `i18n` attribute to the `<h1>` tag.

要将问候语标记为待翻译，请将 `i18n` 属性添加到 `<h1>` 标记。

<code-example path="i18n/doc-files/app.component.html" region="i18n-attribute" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

`i18n` is a custom attribute, recognized by Angular tools and compilers.
After translation, the compiler removes it.
It is not an Angular directive.

`i18n` 是一个自定义属性，会被 Angular 工具和编译器识别。翻译后，编译器将其删除。它并不是 Angular 指令。

</div>

### Add helpful descriptions and meanings

### 添加有用的描述和含义

{@a help-translator}

To translate a text message accurately, the translator may need additional information or context.
Add a *description* of the text message as the value of the `i18n` attribute.
The following example displays the value of the `i18n` attribute.

为了更准确地翻译文本消息，翻译者可能需要额外的信息或上下文。添加文本消息的*描述*作为 `i18n` 属性的值。以下示例展示 `i18n` 属性的值。

<code-example path="i18n/doc-files/app.component.html" region="i18n-attribute-desc" header="src/app/app.component.html"></code-example>

The translator may also need to know the meaning or intent of the text message within this particular application context, in order to translate it the same way as other text with the same meaning.
Start the `i18n` attribute value with the *meaning* and separate it from the *description* with the `|` character: `<meaning>|<description>`.

翻译者可能还需要了解该特定应用上下文中文本消息的含义或意图，以便以与具有相同含义的其他文本相同的方式对其进行翻译。用*含义*开始 `i18n` 属性值，并用 `|` 将其与*描述*分开。字符： `<meaning>|<description>` 。

For example, you may want to indicate that the `<h1>` tag is a site header that needs to be translated the same way, whether it's used as a header or referenced in another section of text.
The following example shows how to indicate that the `<h1>` tag needs to be translated as a header or referenced elsewhere.

例如，你可能希望指出 `<h1>` 标记是一个需要始终翻译为相同结果的站点标题，无论它是用作标题还是在其他文本部分中引用。以下示例展示了如何指出需要将 `<h1>` 标记翻译为标题或在其他地方引用。

<code-example path="i18n/doc-files/app.component.html" region="i18n-attribute-meaning" header="src/app/app.component.html"></code-example>

The result is any text marked with `site header`, as the *meaning* is translated exactly the same way.

这会导致任何标记为 `site header` 的文本，因为其*含义*相同，其翻译结果也完全相同。

<!-- section break -->

{@a transaction-unit-ids}

<div class="callout is-helpful">
<header>How meanings control text extraction and merging</header>

The Angular extraction tool generates a translation unit entry for each `i18n` attribute in a template.
The Angular extraction tool assigns each translation unit a unique ID based on the *meaning* and *description*.
For more information about the Angular extraction tool, see [Work with translation files][AioGuideI18nCommonTranslationFiles] in this guide.

Angular 提取工具为模板中的每个 `i18n` 属性生成一个翻译单元条目。 Angular 提取工具根据*含义*和*描述*为每个翻译单元分配一个唯一的 ID。有关 Angular 提取工具的更多信息，请参阅本指南中的 [使用翻译文件][AioGuideI18nCommonTranslationFiles]。

The same text elements with different *meanings* are extracted with different IDs.
For example, if the word "right" uses the following two definitions in two different locations, the word is translated differently and merged back into the application as different translation entries.

具有不同*含义*的相同文本元素会使用不同的 ID 进行提取。例如，如果单词 “right” 在两个不同的位置使用以下两个定义，则该单词将被不同地翻译并作为不同的翻译条目合并回应用程序。

* `correct` as in you are "right"

  `correct`，比如在 you are "right" 中

* `direction` as in turn "right"

  `direction`，比如在 turn "right" 中

If the same text elements meet the following conditions, the text elements are extracted only once and use the same ID.

如果相同的文本元素满足以下条件，则仅提取一次文本元素并使用相同的 ID。

* Same meaning or definition

  相同的含义或定义

* Different descriptions

  不同的描述

That one translation entry is merged back into the application wherever the same text elements appear.

只要出现相同的文本元素，该翻译条目就会合并回应用程序。

</div>

### Translate text not for display

### 翻译非元素文本

{@a no-element}

If you translate non-displayed text using the `<span>` tag, you create a new DOM element.
To avoid creating a new DOM element, wrap the text in an `<ng-container>` element.
The following example shows the `<ng-container>` element transformed into a non-displayed HTML comment.

如果你借助 `<span>` 标签翻译非元素文本，就会创建一个新的 DOM 元素。为避免创建新的 DOM 元素，请将文本包裹在 `<ng-container>` 元素中。以下示例展示了如何将 `<ng-container>` 元素转换为不可见的 HTML 注释。

<code-example path="i18n/src/app/app.component.html" region="i18n-ng-container"></code-example>

### Mark element attributes for translations

### 标记要翻译的元素属性

{@a translate-attributes}

HTML attributes such as `title` include text that should be translated along with the rest of the displayed text in the template.
The following example displays an image with a `title` attribute.

HTML 属性（如 `title` ）可能包含要与模板中显示的其余文本一起翻译的文本。以下示例展示具有 `title` 属性的图像元素。

<code-example path="i18n/doc-files/app.component.html" region="i18n-title" header="src/app/app.component.html"></code-example>

To mark an attribute for translation, add `i18n-`*attribute* in which *attribute* is the attribute to translate.
The following example displays how to mark the `title` attribute on the `img` tag by adding `i18n-title`.

要标记要翻译的属性，请添加 `i18n-`*属性*，其中的*属性*代表要翻译的属性。下面的示例展示了如何通过添加 `i18n-title` 来标出 `img` 标签上的 `title` 属性。

<code-example path="i18n/src/app/app.component.html" region="i18n-title-translate" header="src/app/app.component.html"></code-example>

Use `i18n-`*attribute* with any attribute of any element.
Also, to assign a meaning, description, and custom ID, use the `i18n-`*attribute*`="<meaning>|<description>@@<id>"` syntax.

可以将 `i18n-`*属性*与任何元素的任何属性一起使用。此外，要指定含义、描述和自定义 ID，请使用 `i18n-`*属性*`="<meaning>|<description>@@<id>"` 语法。

### Mark plurals and alternates for translation

### 标记复数和替代翻译

{@a plurals-alternates}

Different languages have different pluralization rules and grammatical constructions that increase the difficulty of translation.
To simplify translation, use International Components for Unicode (ICU) clauses with regular expressions, such as `plural` to mark the uses of plural numbers, and `select` to mark alternate text choices.

不同的语言有不同的复数规则和语法结构，这增加了翻译的难度。为简化翻译工作，可使用带有规则表达式的 Unicode 国际组件 (ICU) 子句，例如 `plural` 标记复数的使用，并用 `select` 标出替代文本选项。

<div class="alert is-helpful">

The ICU clauses adhere to the [ICU Message Format][GithubUnicodeOrgIcuUserguideFormatParseMessages] specified in the [CLDR pluralization rules][UnicodeCldrIndexCldrSpecPluralRules].

ICU 子句遵循 [CLDR 复数规则][UnicodeCldrIndexCldrSpecPluralRules] 中指定的 [ICU 消息格式][GithubUnicodeOrgIcuUserguideFormatParseMessages]。

</div>

#### Mark plurals

#### 标记复数

{@a plural-ICU}

Use the `plural` clause to mark expressions that may not be meaningful if translated word-for-word.

使用 `plural` 从句来标出如果逐字翻译可能没有意义的表达式。

For example, if you want to display "updated x minutes ago" in English, you may want to display "just now", "one minute ago", or "*x* minutes ago" (with *x* as the actual number).
Other languages might express this cardinality differently.
The following example displays how to use a `plural` clause to express each of the three situations.

例如，如果你想用英文显示“updated x minutes ago”，你可能希望显示“just now”、“one minute ago”或“ *x* minutes ago”（ *x*为实际数字）。其他语言可能会以不同的方式表达这种基数。下面的例子展示了如何使用 `plural` 从句来分别表达这三种情况。

<code-example path="i18n/src/app/app.component.html" region="i18n-plural" header="src/app/app.component.html"></code-example>

Review the following details in the above example.

下面是上述示例中的细节。

* The first parameter, `minutes`, is bound to the component property (`minutes`), which determines the number of minutes.

  第一个参数 `minutes` 绑定到组件属性（ `minutes` ），该属性确定分钟数。

* The second parameter identifies this as a `plural` translation type.

  第二个参数将此标识为 `plural` 翻译类型。

* The third parameter defines a pattern of pluralization categories and the matching values:

  第三个参数定义了复数类别和匹配值的模式：

  * For zero minutes, use `=0 {just now}`.

    对于零分钟，使用 `=0 {just now}` 。

  * For one minute, use `=1 {one minute}`.

    一分钟，使用 `=1 {one minute}` 。

  * For any unmatched cardinality, use `other {{{minutes}} minutes ago}`.
    Use HTML markup and [interpolations][AioGuideGlossaryInterpolation], such as `{{{minutes}}` with the `plural` clause in expressions.

    对于任何不匹配的基数，使用 `other {{{minutes}} minutes ago}` 。使用 HTML 标记和[插值][AioGuideGlossaryInterpolation]（例如 `{{{minutes}}`），与表达式中的 `plural` 从句。

  * After the pluralization category, put the default text (English) within braces (`{}`).

    在复数类别之后，将默认文本（英语）放在大括号 ( `{}` ) 内。

Pluralization categories include (depending on the language):

复数类别包括（取决于语言）：

* `=0` (or any other number)

  `=0`（或任何其他数字）

* `zero`
* `one`
* `two`
* `few`
* `many`
* `other`

<div class="callout is-important">

<header>Locales may not support some pluralization categories</header>

<header>某些语言环境可能不支持某些复数类别</header>

Many locales don't support some of the pluralization categories.
For example, the default locale (`en-US`) and other locales (such as `es`) have very simple `plural()` functions that don't support the `few` category.
The following code example displays the [en-US][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL15L18] `plural()` function.

许多语言环境不支持某些复数类别。例如，默认语言环境（ `en-US` ）和其他语言环境（例如 `es` ）具有非常简单的 `plural()` 函数，不支持 `few` 类别。以下代码示例展示了 [en-US][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL15L18] 的 `plural()` 函数。

<code-example path="i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy></code-example>

The function will only ever return 1 (`one`) or 5 (`other`).
The `few` category will never match.
If none of the pluralization categories match, Angular will try to match `other`.
Use `other` as the standard fallback for a missing category.

该函数只会返回 1（ `one` ）或 5（ `other` ）。 `few` 类别永远不会匹配。如果没有匹配上任何复数类别，Angular 将尝试匹配 `other`，使用 `other` 作为缺少类别的标准回退。

For more information about pluralization categories, see [Choosing plural category names][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames] in the CLDR - Unicode Common Locale Data Repository.

有关复数类别的更多信息，请参阅 CLDR - Unicode Common Locale Data Repository 中的 [选择复数类别名称][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]。

</div>

### Mark alternates and nested expressions

### 标记替代文本和嵌套表达式

{@a select-icu}
{@a nesting-icus}

If you need to display alternate text depending on the value of a variable, you need to translate all of the alternates.

如果需要根据变量的值显示替代文本，则需要翻译所有替代文本。

The `select` clause, similar to the `plural` clause, marks choices for alternate text based on your defined string values.
For example, the following clause in the component template binds to the `gender` property of the component, which outputs one of the following string values: `"male"`, `"female"`, or `"other"`.
The clause maps the values to the appropriate translations.

`select` 子句类似于 `plural` 子句，根据你定义的字符串值标记出替代文本的选择。例如，组件模板中的以下子句绑定到组件的 `gender` 属性，该属性输出以下字符串值之一：`"male"`、`"female"` 或 `"other"` 。该子句将值映射到适当的翻译。

<code-example path="i18n/src/app/app.component.html" region="i18n-select" header="src/app/app.component.html"></code-example>

Also, nest different clauses together, such as the `plural` and `select` clauses.
The following example displays nested clauses.

此外，可以将不同的子句嵌套在一起，例如 `plural` 和 `select` 子句。以下示例展示了嵌套子句。

<code-example path="i18n/src/app/app.component.html" region="i18n-nested" header="src/app/app.component.html"></code-example>

<!-- links -->

[AioGuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n-common-prepare#add-helpful-descriptions-and-meanings "Add helpful descriptions and meanings - Prepare templates for translations | Angular"

[AioGuideI18nCommonPrepareMarkElementAttributesForTranslations]: guide/i18n-common-prepare#mark-element-attributes-for-translations "Mark element attributes for translations - Prepare templates for translations | Angular"

[AioGuideI18nCommonPrepareMarkPluralsAndAlternatesForTranslation]: guide/i18n-common-prepare#mark-plurals-and-alternates-for-translation "Mark plurals and alternates for translation - Prepare templates for translations | Angular"

[AioGuideI18nCommonPrepareMarkTextForTranslations]: guide/i18n-common-prepare#mark-text-for-translations "Prepare templates for translations | Angular"

[AioGuideI18nCommonPrepareTranslateTextNotForDisplay]: guide/i18n-common-prepare#translate-text-not-for-display "Translate text not for display - Prepare templates for translations | Angular"

[AioGuideI18nCommonTranslationFiles]: guide/i18n-common-translation-files "Work with translation files | Angular"

[AioGuideGlossaryInterpolation]: guide/glossary#interpolation "interpolation - Glossary | Angular"

<!-- external links -->

[GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL15L18]: https://github.com/angular/angular/blob/ecffc3557fe1bff9718c01277498e877ca44588d/packages/core/src/i18n/locale_en.ts#L15-L18 "Line 15 to 18 - angular/packages/core/src/i18n/locale_en.ts | angular/angular | GitHub"

[GithubUnicodeOrgIcuUserguideFormatParseMessages]: https://unicode-org.github.io/icu/userguide/format_parse/messages "ICU Message Format - ICU Documentation | Unicode | GitHub"

[UnicodeCldrIndexCldrSpecPluralRules]: http://cldr.unicode.org/index/cldr-spec/plural-rules "Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode"

[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names "Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode"

<!-- end links -->

@reviewed 2021-09-15
