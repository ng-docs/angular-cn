# Manage marked text with custom IDs

# 使用自定义 ID 管理已标记文本

{@a custom-id}

The Angular extractor generates a file with a translation unit entry for each `i18n` attribute in a template.
As described in [How meanings control text extraction and merging][AioGuideI18nCommonPrepareTransactionUnitIds], Angular assigns each translation unit a unique ID.
The following example displays translation units with unique IDs.

Angular 提取器为模板中的每个 `i18n` 属性生成一个带有翻译单元条目的文件。如[含义如何控制文本提取与合并][AioGuideI18nCommonPrepareTransactionUnitIds]中所述，Angular 会为每个翻译单元分配一个唯一的 ID。以下示例展示具有唯一 ID 的翻译单元。

<code-example path="i18n/doc-files/messages.fr.xlf.html" header="messages.fr.xlf.html" region="generated-id"></code-example>

When you change the translatable text, the extractor generates a new ID for that translation unit.
In most cases a text change would also require a change to the translation.
Therefore, using a new ID keeps the text change in sync with translations.

当你更改可翻译文本时，提取器会为该翻译单元生成一个新 ID。在大多数情况下，文本更改还需要更改翻译。因此，使用新 ID 可使文本更改与翻译保持同步。

However, some translation systems require a specific form or syntax for the ID.
To address this requirement, mark text with custom IDs.
While most developers don't need to use custom IDs, some may want to use IDs that have a unique syntax to convey additional metadata (such as the library, component, or area of the application in which the text appears).

但是，某些翻译系统需要 ID 的特定形式或语法。要满足此要求，请使用自定义 ID 来标记文本。虽然大多数开发人员都不需要使用自定义 ID，但有些开发人员可能希望使用具有独特语法的 ID 来传达额外的元数据（例如库、组件或文本在应用程序中出现的区域）。

Specify a custom ID in the `i18n` attribute by using the `@@` prefix.
The following example defines the `introductionHeader` custom ID.

使用 `@@` 前缀在 `i18n` 属性中指定自定义 ID。以下示例定义了 `introductionHeader` 这个自定义 ID。

<code-example path='i18n/doc-files/app.component.html' region='i18n-attribute-solo-id' header='app/app.component.html'></code-example>

When you specify a custom ID, the extractor generates a translation unit with the custom ID.

当你指定自定义 ID 时，提取器会生成一个带有自定义 ID 的翻译单元。

<code-example path="i18n/doc-files/messages.fr.xlf.html" header="messages.fr.xlf.html" region="custom-id"></code-example>

If you change the text, the extractor does *not* change the ID.
As a result, you don't have to take the extra step of updating the translation.
The drawback of using custom IDs is that if you change the text, your translation may be out-of-sync with the newly changed source text.

如果更改文本，提取器*不会*更改 ID。这导致你不得不用额外的步骤来更新其翻译。使用自定义 ID 的缺点是，如果你更改文本，你的翻译可能与新更改的源文本不同步。

#### Use a custom ID with a description

#### 使用带有描述的自定义 ID

Use a custom ID in combination with a description and a meaning to further help the translator.
The following example includes a description, followed by the custom ID.

将自定义 ID 与描述和含义结合使用，以进一步帮助翻译人员。以下示例包含“描述”，其后是自定义 ID。

<code-example path='i18n/doc-files/app.component.html' region='i18n-attribute-id' header='app/app.component.html'></code-example>

The following example adds a meaning.

下面的例子又增加了“含义”。

<code-example path='i18n/doc-files/app.component.html' region='i18n-attribute-meaning-and-id' header='app/app.component.html'></code-example>

#### Define unique custom IDs

#### 定义唯一的自定义 ID

Be sure to define custom IDs that are unique.
If you use the same ID for two different text elements, the extraction tool extracts only the first one, and Angular uses its translation in place of both original text elements.

请务必定义唯一的自定义 ID。如果你对两个不同的文本元素使用相同的 ID，提取工具只会提取第一个，而 Angular 会使用其翻译来代替两个原始文本元素。

For example, in the following code snippet the same `myId` custom ID is defined for two different text elements.

例如，在以下代码片段中，为两个不同的文本元素定义了相同的自定义 ID `myId`。

<code-example path='i18n/doc-files/app.component.html' region='i18n-duplicate-custom-id' header='app/app.component.html'></code-example>

The following displays the translation in French.

下面以法语显示翻译。

<code-example path='i18n/doc-files/messages.fr.xlf.html' region='i18n-duplicate-custom-id' header='header="src/locale/messages.fr.xlf'></code-example>

Both elements now use the same translation (`Bonjour`), because both were defined with the same custom ID.

这两个元素现在使用相同的翻译 ( `Bonjour` )，因为它们都是使用相同的自定义 ID 定义的。

<code-example path='i18n/doc-files/rendered-output.html'></code-example>

<!-- links -->

[AioGuideI18nCommonPrepareTransactionUnitIds]: guide/i18n-common-prepare#transaction-unit-ids "How meanings control text extraction and merging - Common Internationalization task #4: Prepare templates for translations | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-09-15
