Prepare component for translation

准备翻译组件

To prepare your project for translation, complete the following actions.

要准备翻译项目，请完成以下操作。

Use the `i18n` attribute to mark text in component templates

使用 `i18n` 属性标记组件模板中的文本

Use the `i18n-` attribute to mark attribute text strings in component templates

使用 `i18n-` 属性在组件模板中标记属性文本字符串

Use the `$localize` tagged message string to mark text strings in component code

使用带 `$localize` 标记的消息字符串标记组件代码中的文本字符串

Mark text in component template

在组件模板中标记文本

In a component template, the i18n metadata is the value of the `i18n` attribute.

在组件模板中，i18n 元数据就是 `i18n` 属性的值。

Use the `i18n` attribute to mark a static text message in your component templates for translation.
Place it on every element tag that contains fixed text you want to translate.

使用 `i18n` 属性在组件模板中标记静态文本消息以进行翻译。将它放在每个包含要翻译的固定文本的元素标签上。

`i18n` example

`i18n` 示例

The following `<h1>` tag displays a simple English language greeting, "Hello i18n!".

下面的 `<h1>` 标签显示了一个简单的英语问候语：“Hello i18n！”。

To mark the greeting for translation, add the `i18n` attribute to the `<h1>` tag.

要将问候语标记为待翻译，请将 `i18n` 属性添加到 `<h1>` 标记。

Translate inline text without HTML element

翻译没有 HTML 元素的内联文本

Use the `<ng-container>` element to associate a translation behavior for specific text without changing the way text is displayed.

使用 `<ng-container>` 元素来为特定文本关联翻译行为，而不会改变文本的显示方式。

Mark element attributes for translations

标记翻译的元素属性

In a component template, the i18n metadata is the value of the `i18n-{attribute_name}` attribute.

在组件模板中，i18n 的元数据是 `i18n-{attribute_name}` 属性的值。

The attributes of HTML elements include text that should be translated along with the rest of the displayed text in the component template.

HTML 元素的属性包括那些要和组件模板中显示的其它文本一起翻译的文本。

Use `i18n-{attribute_name}` with any attribute of any element and replace `{attribute_name}` with the name of the attribute.
Use the following syntax to assign a meaning, description, and custom ID.

将 `i18n-{attribute_name}` 与任何元素的任何属性一起使用，并将 `{attribute_name}` 替换为该属性的名称。使用以下语法分配含义、描述和自定义 ID。

`i18n-title` example

`i18n-title` 示例

To translate the title of an image, review this example.
The following example displays an image with a `title` attribute.

要翻译图像的标题，请查看此示例。以下示例显示具有 `title` 属性的图像。

To mark the title attribute for translation, complete the following action.

要标记出待翻译的标题属性，请完成以下操作。

Add the `i18n-title` attribute

添加 `i18n-title` 属性

The following example displays how to mark the `title` attribute on the `img` tag by adding `i18n-title`.

下面的示例展示了如何通过添加 `i18n-title` 来标记出 `img` 标签上的 `title` 属性。

Mark text in component code

在组件代码中标记文本

In component code, the translation source text and the metadata are surrounded by backtick \(<code>\`</code>\) characters.

在组件代码中，翻译源文本和元数据被反引号 （<code>\`</code>） 字符包围。

Use the [`$localize`][AioApiLocalizeInitLocalize] tagged message string to mark a string in your code for translation.

使用 [ `$localize` ][AioApiLocalizeInitLocalize] 标记的消息字符串在代码中标记出要翻译的字符串。

The i18n metadata is surrounded by colon \(`:`\) characters and prepends the translation source text.

i18n 元数据包裹在冒号 （`:`） 字符中，并放在翻译源文本之前。

Include interpolated text

包含插值文本

Include [interpolations][AioGuideGlossaryInterpolation] in a [`$localize`][AioApiLocalizeInitLocalize] tagged message string.

在 [`$localize`][AioApiLocalizeInitLocalize] 标记的消息字符串中包含[插值文本][AioGuideGlossaryInterpolation]。

Name the interpolation placeholder

命名插值占位符

i18n metadata for translation

用于翻译的 i18n 元数据

The following parameters provide context and additional information to reduce confusion for your translator.

以下参数提供上下文和附加信息，以避免翻译人员弄混。

Meaning

含义（Meaning）

Provide the meaning or intent of the text within the specific context

提供文本在特定上下文中的含义或意图

Description

说明

Provide additional information or context

提供额外的信息或背景

Custom ID

自定义 ID

Provide a custom identifier

提供自定义标识符

Metadata parameter

元数据参数

Details

详情

For additional information about custom IDs, see [Manage marked text with custom IDs][AioGuideI18nOptionalManageMarkedText].

有关自定义 ID 的其他信息，请参阅[使用自定义 ID 管理已标记的文本][AioGuideI18nOptionalManageMarkedText]。

Add helpful descriptions and meanings

添加有用的描述和含义

To translate a text message accurately, provide additional information or context for the translator.

要准确翻译文本消息，就要为翻译人员提供额外信息或上下文。

Add a *description* of the text message as the value of the `i18n` attribute or [`$localize`][AioApiLocalizeInitLocalize] tagged message string.

为 `i18n` 属性的值或 [ `$localize` ][AioApiLocalizeInitLocalize] 标记的消息字符串添加文本消息的*描述*。

The following example shows the value of the `i18n` attribute.

以下示例显示了 `i18n` 属性的值。

The following example shows the value of the [`$localize`][AioApiLocalizeInitLocalize] tagged message string with a description.

以下示例显示了带有描述的 [`$localize`][AioApiLocalizeInitLocalize] 标记消息字符串的值。

The translator may also need to know the meaning or intent of the text message within this particular application context, in order to translate it the same way as other text with the same meaning.
Start the `i18n` attribute value with the *meaning* and separate it from the *description* with the `|` character: `{meaning}|{description}`.

翻译者可能还需要了解该特定应用上下文中此文本消息的含义或意图，以便以与具有相同含义的其他文本相同的方式对其进行翻译。把*含义*放在 `i18n` 属性值的最前面，并用 `|` 字符将其与*描述*分开：`{meaning}|{description}`。

`h1` example

`h1` 示例

For example, you may want to specify that the `<h1>` tag is a site header that you need translated the same way, whether it is used as a header or referenced in another section of text.

比如，你可能希望将 `<h1>` 标记指定为需要以相同方式翻译的站点标题，无论是把它用作标题还是在其他文本部分中引用。

The following example shows how to specify that the `<h1>` tag must be translated as a header or referenced elsewhere.

以下示例显示如何指定 `<h1>` 标记无论在标题还是在别处引用都要以相同方式翻译。

The result is any text marked with `site header`, as the *meaning* is translated exactly the same way.

其结果是：任何标有 `site header` 的文本都会以相同方式翻译，因为其*含义*完全相同。

The following code example shows the value of the [`$localize`][AioApiLocalizeInitLocalize] tagged message string with a meaning and a description.

以下代码示例显示了带有含义和描述的 [`$localize`][AioApiLocalizeInitLocalize] 标记消息字符串的值。

The same text elements with different *meanings* are extracted with different IDs.
For example, if the word "right" uses the following two definitions in two different locations, the word is translated differently and merged back into the application as different translation entries.

具有不同*含义*的相同文本元素以不同的 ID 提取。比如，如果单词“right”在两个不同的位置使用以下两个定义，则该单词将被以不同地方式翻译并作为不同的翻译条目合并回应用程序。

`correct` as in "you are right"

`correct` 如 "you are right"

`direction` as in "turn right"

`direction` 如 "turn right"

If the same text elements meet the following conditions, the text elements are extracted only once and use the same ID.

如果相同的文本元素满足以下条件，则只会提取一次文本元素并使用相同的 ID。

Same meaning or definition

相同的含义或定义

Different descriptions

不同的描述

That one translation entry is merged back into the application wherever the same text elements appear.

只要出现相同的文本元素，该翻译条目就会合并回应用程序。

</div>



ICU expressions

ICU 表达式

ICU expressions help you mark alternate text in component templates to meet conditions.
An ICU expression includes a component property, an ICU clause, and the case statements surrounded by open curly brace \(`{`\) and close curly brace \(`}`\) characters.

ICU 表达式可帮助你在组件模板中标记出某些条件下的替代文本。ICU 表达式包括一个组件属性、一个 ICU 子句以及由左花括号 （ `{` ） 和右花括号 （ `}` ） 字符包围的 case 语句。

The component property defines the variable
An ICU clause defines the type of conditional text.

组件属性定义了变量，而 ICU 子句定义了条件文本的类型。

[`select`][AioGuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]

[`select`][AioGuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]

Mark choices for alternate text based on your defined string values

根据你定义的字符串值标记出替代文本的一些选择

[`plural`][AioGuideI18nCommonPrepareMarkPlurals]

[`plural`][AioGuideI18nCommonPrepareMarkPlurals]

Mark the use of plural numbers

标记复数的使用

ICU clause

ICU 子句

To simplify translation, use International Components for Unicode clauses \(ICU clauses\) with regular expressions.

为了简化翻译，请使用带有正则表达式的 Unicode 子句（ICU 子句）的国际化组件。

Mark plurals

标记复数

Different languages have different pluralization rules that increase the difficulty of translation.
Because other locales express cardinality differently, you may need to set pluralization categories that do not align with English.
Use the `plural` clause to mark expressions that may not be meaningful if translated word-for-word.

不同的语言有不同的复数规则，这增加了翻译的难度。因为其他语言环境表达基数的方式不同，你可能需要设置与英语不一致的复数类别。使用 `plural` 从句来标记当逐字翻译时可能没有意义的表达式。

After the pluralization category, enter the default text \(English\) surrounded by open curly brace \(`{`\) and close curly brace \(`}`\) characters.

在复数类别之后，输入由左大括号 （`{`） 和右大括号 （`}`） 字符包围的默认文本（英文）。

The following pluralization categories are available for English and may change based on the locale.

以下复数类别适用于英语，可能会根据语言环境而变化。

The default quantity

数量的默认值

Quantity is a large number

数量很大

Quantity is 2 or more

数量为 2 或更多

Quantity is 2

数量为 2

`=2 { }` <br /> `two { }`

`=2 { }` <br /> `two { }`

Quantity is 1

数量为 1

`=1 { }` <br /> `one { }`

`=1 { }` <br /> `one { }`

Quantity is zero

数量为零

`=0 { }` <br /> `zero { }`

`=0 { }` <br /> `zero { }`

Pluralization category

复数类

Example

范例

If none of the pluralization categories match, Angular uses `other` to match the standard fallback for a missing category.

如果不能匹配任何复数类别，Angular 就会使用 `other` 来匹配缺失类别的标准后备值。

`minutes` example

`minutes` 示例

If you want to display the following phrase in English, where `x` is a number.

如果你想用英文显示以下短语，其中 `x` 是一个数字。

And you also want to display the following phrases based on the cardinality of `x`.

如果你还想根据 `x` 的基数显示以下短语。

Use HTML markup and [interpolations][AioGuideGlossaryInterpolation].
The following code example shows how to use the `plural` clause to express the previous three situations in a `<span>` element.

使用 HTML 标记和[插值][AioGuideGlossaryInterpolation]。下面的代码示例展示了如何在 `<span>` 元素中使用 `plural` 子句来表达前三种情况。

Review the following details in the previous code example.

查看前面代码示例中的以下详细信息。

For any unmatched cardinality, the default pluralization category is `other`. The value is `{{minutes}} minutes ago`.

对于任何不匹配的基数，默认的复数类别是 `other`。该值为 `{{minutes}} minutes ago`。

For one minute, the pluralization category is `=1`. The value is `one minute`.

对于一分钟，复数类别是 `=1`。该值为 `one minute`。

For zero minutes, the pluralization category is `=0`. The value is `just now`.

对于零分钟，复数类别是 `=0`。其值是 `just now`。

The second parameter specifies the ICU clause is `plural`.

第二个参数指定 ICU 子句是 `plural`。

The first parameter specifies the component property is `minutes` and determines the number of minutes.

第一个参数指定这个组件属性是 `minutes` 并确定其分钟数。

Parameters

参数

`{{minutes}}` is an [interpolation][AioGuideGlossaryInterpolation].

`{{minutes}}` 是一个[插值][AioGuideGlossaryInterpolation]。

Mark alternates and nested expressions

标记替代和嵌套表达式

The `select` clause marks choices for alternate text based on your defined string values.

`select` 子句根据你定义的字符串值标记替代文本的选择。

Translate all of the alternates to display alternate text based on the value of a variable.

翻译所有替代项以根据变量的值显示替代文本。

After the selection category, enter the text \(English\) surrounded by open curly brace \(`{`\) and close curly brace \(`}`\) characters.

在选择类别后，输入由左大括号 （ `{` ） 和右大括号 （ `}` ） 字符包围的文本（英文）。

Different locales have different grammatical constructions that increase the difficulty of translation.
Use HTML markup.
If none of the selection categories match, Angular uses `other` to match the standard fallback for a missing category.

不同的语言环境具有不同的语法结构，这增加了翻译的难度。使用 HTML 标记。如果无法匹配任何选择类别，Angular 就会使用 `other` 来匹配缺失类别的标准后备值。

`gender` example

`gender` 例子

If you want to display the following phrase in English.

如果你想用英文显示下面的短语。

And you also want to display the following phrases based on the `gender` property of the component.

如果你还想根据组件的 `gender` 属性显示以下短语。

The following code example shows how to bind the `gender` property of the component and use the `select` clause to express the previous three situations in a `<span>` element.

下面的代码示例展示了如何绑定组件的 `gender` 属性，并使用 `select` 子句在 `<span>` 元素中表达前三种情况。

The `gender` property binds the outputs to each of following string values.

`gender` 属性将输出绑定到以下每个字符串值。

other

其它

male

男性

female

女性

Value

值

English value

英语值

The `select` clause maps the values to the appropriate translations.
The following code example shows `gender` property used with the select clause.

`select` 子句会将值映射成适当的翻译。以下代码示例显示了与 select 子句一起使用的 `gender` 属性。

`gender` and `minutes` example

`gender` 和 `minutes` 示例

Combine different clauses together, such as the `plural` and `select` clauses.
The following code example shows nested clauses based on the `gender` and `minutes` examples.

将不同的子句组合在一起，比如 `plural` 和 `select` 子句。以下代码示例显示了基于 `gender` 和 `minutes` 示例的嵌套子句。

What's next

下一步呢？

[Work with translation files][AioGuideI18nCommonTranslationFiles]

[使用翻译文件][AioGuideI18nCommonTranslationFiles]