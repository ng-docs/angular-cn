# Manage marked text with custom IDs

# 使用自定义 ID 管理标记文本

The Angular extractor generates a file with a translation unit entry each of the following instances.

Angular 提取器会生成一个文件，其中包含以下每个实例的翻译单元条目。

* Each `i18n` attribute in a component template

  组件模板中的每个 `i18n` 属性

* Each [`$localize`][AioApiLocalizeInitLocalize] tagged message string in component code

  组件代码中每个 [`$localize`][AioApiLocalizeInitLocalize] 标记的消息字符串

As described in [How meanings control text extraction and merges][AioGuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges], Angular assigns each translation unit a unique ID.

如[含义(meaning)如何控制文本提取与合并][AioGuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]中所述，Angular 会为每个翻译单元分配一个唯一的 ID。

The following example displays translation units with unique IDs.

下面的范例会显示一些带有唯一 ID 的翻译单元。

<code-example header="messages.fr.xlf.html" path="i18n/doc-files/messages.fr.xlf.html" region="generated-id"></code-example>

When you change the translatable text, the extractor generates a new ID for that translation unit.
In most cases, changes in the source text also require a change to the translation.
Therefore, using a new ID keeps the text change in sync with translations.

当你更改可翻译文本时，提取器会为该翻译单元生成一个新 ID。在大多数情况下，源文本中的更改还需要更改翻译结果。因此，使用新 ID 可使文本更改与翻译保持同步。

However, some translation systems require a specific form or syntax for the ID.
To address the requirement, use a custom ID to mark text.
Most developers don't need to use a custom ID.
If you want to use a unique syntax to convey additional metadata, use a custom ID.
Additional metadata may include the library, component, or area of the application in which the text appears.

但是，某些翻译系统需要 ID 的特定形式或语法。要满足此要求，请使用自定义 ID 来标记文本。大多数开发人员不需要使用自定义 ID。如果你想使用独特的语法来传达额外的元数据，请使用自定义 ID。其他元数据可能包括出现文本的库、组件或应用程序中的区块。

To specify a custom ID in the `i18n` attribute or [`$localize`][AioApiLocalizeInitLocalize] tagged message string, use the `@@` prefix.
The following example defines the `introductionHeader` custom ID in a heading element.

要在 `i18n` 属性或以 [ `$localize` ][AioApiLocalizeInitLocalize] 标记的消息字符串中指定自定义 ID，请使用 `@@` 前缀。以下示例在标题元素中定义了自定义 ID `introductionHeader`。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-solo-id"></code-example>

The following example defines the `introductionHeader` custom ID for a variable.

以下示例为变量定义了自定义 ID `introductionHeader`。

<!--todo: replace with code example -->

<code-example format="typescript" language="typescript">

variableText1 = &dollar;localize `:&commat;&commat;introductionHeader:Hello i18n!`;

</code-example>

When you specify a custom ID, the extractor generates a translation unit with the custom ID.

当你指定自定义 ID 时，提取器会生成一个带有自定义 ID 的翻译单元。

<code-example header="messages.fr.xlf.html" path="i18n/doc-files/messages.fr.xlf.html" region="custom-id"></code-example>

If you change the text, the extractor does not change the ID.
As a result, you don't have to take the extra step to update the translation.
The drawback of using custom IDs is that if you change the text, your translation may be out-of-sync with the newly changed source text.

如果更改文本，提取器*不会*更改 ID。这导致你不得不用额外的步骤来更新其翻译。使用自定义 ID 的缺点是，如果你更改文本，你的翻译可能与新更改的源文本不同步。

#### Use a custom ID with a description

#### 使用带有描述的自定义 ID

Use a custom ID in combination with a description and a meaning to further help the translator.

将自定义 ID 与描述(description)和含义(meaning)结合使用，以进一步帮助翻译人员。

The following example includes a description, followed by the custom ID.

以下示例包含“描述”，其后是自定义 ID。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-id"></code-example>

The following example defines the `introductionHeader` custom ID and description for a variable.

以下示例定义了一个变量的自定义 ID `introductionHeader` 及其描述。

<!--todo: replace with code example -->

<code-example format="typescript" language="typescript">

variableText2 = &dollar;localize `:An introduction header for this sample&commat;&commat;introductionHeader:Hello i18n!`;

</code-example>

The following example adds a meaning.

下面的例子又增加了“含义”。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-attribute-meaning-and-id"></code-example>

The following example defines the `introductionHeader` custom ID for a variable.

以下示例为变量定义了自定义 ID `introductionHeader`。

<!--todo: replace with code example -->

<code-example format="typescript" language="typescript">

variableText3 = &dollar;localize `:site header|An introduction header for this sample&commat;&commat;introductionHeader:Hello i18n!`;

</code-example>

#### Define unique custom IDs

#### 定义唯一的自定义 ID

Be sure to define custom IDs that are unique.
If you use the same ID for two different text elements, the extraction tool extracts only the first one, and Angular uses the translation in place of both original text elements.

请务必定义唯一的自定义 ID。如果你对两个不同的文本元素使用相同的 ID，提取工具只会提取第一个，而 Angular 会使用其翻译来代替两个原始文本元素。

For example, in the following code snippet the same `myId` custom ID is defined for two different text elements.

比如，在以下代码片段中，为两个不同的文本元素定义了相同的自定义 ID `myId`。

<code-example header="app/app.component.html" path="i18n/doc-files/app.component.html" region="i18n-duplicate-custom-id"></code-example>

The following displays the translation in French.

下面以法语显示翻译。

<code-example header="src/locale/messages.fr.xlf" path="i18n/doc-files/messages.fr.xlf.html" region="i18n-duplicate-custom-id"></code-example>

Both elements now use the same translation (`Bonjour`), because both were defined with the same custom ID.

这两个元素现在使用相同的翻译 ( `Bonjour` )，因为它们都是使用相同的自定义 ID 定义的。

<code-example path="i18n/doc-files/rendered-output.html"></code-example>

<!-- links -->

[AioApiLocalizeInitLocalize]: api/localize/init/$localize "$localize | init - localize - API | Angular"

[AioGuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n-common-prepare#how-meanings-control-text-extraction-and-merges "How meanings control text extraction and merges - Prepare components for translations | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28