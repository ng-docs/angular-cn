# Resolve documentation linter messages

# 解析文档 linter 消息

This topic describes different ways to resolve common messages that the documentation linter produces.

本主题介绍了解决文档 linter 生成的常见消息的不同方法。

## Anatomy of a documentation linter message

## 文档 linter 消息的剖析

This is an example of a message produced by the documentation linter.

这是文档 linter 生成的消息的示例。

<div class="lightbox">

<img alt="sample of a lint message" src="generated/images/guide/docs-lint-errors/sample-lint-error.png">

</div>

A documentation linter message contains these elements.
Starting from the top line:

文档 linter 消息包含这些元素。从顶行开始：

<!-- vale Angular.Angular_Spelling = NO -->

<!-- vale Angular.Google_Spacing = NO -->

<!-- vale Angular.Google_We = NO -->

* The severity.
  One of these icons indicates the severity of the message:

  严重性。这些图标之一表示消息的严重性：

  * **Error** (A red `x` in a circle)
    Errors must be corrected before the file can be merged.

    **错误**（圆圈中的红色 `x` ）必须在合并文件之前更正错误。

    <div class="lightbox">

    <img alt="documentation style error icon" src="generated/images/guide/docs-lint-errors/lint-error-icon.png">

    </div>

  * **Warning** (A yellow exclamation mark in a triangle)
    Warnings should be corrected before the file is merged.

    **警告**（三角形中的黄色感叹号）应在合并文件之前更正警告。

    <div class="lightbox">

    <img alt="documentation style warning icon" src="generated/images/guide/docs-lint-errors/lint-warn-icon.png">

    </div>

  * **Info** (A blue lower-case `i` in a circle)
    Informational messages should be corrected before the file is merged.

    **信息**（圆圈中的蓝色小写 `i` ）信息性消息应在合并文件之前更正。

    <div class="lightbox">

    <img alt="documentation style info icon" src="generated/images/guide/docs-lint-errors/lint-info-icon.png">

    </div>

* The style rule message.
  The style rule message in this example is:

  样式规则消息。此示例中的样式规则消息是：

  <code-example language="none" hideCopy>

  Did you really mean 'sdfdsfsdfdfssd'? It wasn't found in our dictionary.

  </code-example>

* The style reference.
  Some references are linked to a style guide topic that explains the rule.
  The style reference in this example is:

  样式引用。某些引用链接到解释规则的风格指南主题。此示例中的样式引用是：

  <code-example language="none" hideCopy>

  Vale(Angular.Angular_Spelling)

  </code-example>

* The location of the problem text in the document identified by source line and column as precisely as possible.
  Some messages might not have the exact location of the text that triggered the message.
  The location in this example is:

  问题文本在文档中由源行和列标识的位置，尽可能精确。某些消息可能没有触发消息的文本的确切位置。此示例中的位置是：

  <code-example language="none" hideCopy>

  [Ln 8, Col 1]

  </code-example>

* The style test definition file that produced the message, which is linked to the file.
  The style test definition in this example is:

  生成消息的样式测试定义文件，链接到该文件。此示例中的风格测试定义是：

  <code-example language="none" hideCopy>

  Angular_Spelling.yml[Ln 1, Col 1]: View rule

  </code-example>

<!-- vale Angular.Google_We = YES -->

<!-- vale Angular.Google_Spacing = YES -->

<!-- vale Angular.Angular_Spelling = YES -->

## Strategies to improve your documentation

## 改进文档的策略

These tips can help you improve your documentation and remove documentation linter messages.

这些提示可以帮助你改进文档并删除文档 linter 消息。

### Refer to the style guides

### 请参阅风格指南

The lint tool tests against the styles found in these style guides.
Most style tests include links to relevant sections in these documents for more information.

lint 工具会根据这些风格指南中的风格进行测试。大多数风格测试都包含指向这些文档中相关部分的链接，以获取更多信息。

* [Angular documentation style guide][AioGuideDocsStyleGuide]

  [Angular 文档风格指南][AioGuideDocsStyleGuide]

* [Google Developer Documentation Style Guide][GoogleDevelopersStyle]

  [Google 开发者文档风格指南][GoogleDevelopersStyle]

<div class="alert is-helpful">

Not every style mentioned in the style guides has a test.
Style guides and the style tests can change.

</div>

### Split up long sentences

### 拆分长句子

Generally, shorter sentences are easier to read than longer ones.
Long sentences can occur when you try to say too much at once.
Long sentences, as well as the use of parentheses, semicolons, or words identified as `too-wordy`, generally require rethinking and rewriting.

一般来说，较短的句子比较长的句子更容易阅读。当你尝试一次说太多时，可能会出现长句。长句子，以及使用括号、分号或被标识为 `too-wordy` 单词，通常需要重新考虑和重写。

Consider restructuring a long sentence to break its individual ideas into distinct sentences or bullet points.

考虑重组一个长句子，将其单个想法分解为不同的句子或项目符号。

### Use lists and tables

### 使用列表和表格

Sentences that contain comma-separated lists might be clearer if presented as a bulleted-list or table.

如果以项目符号列表或表格的形式显示，包含逗号分隔列表的句子可能会更清晰。

Consider changing a comma-separated list of items in a sentence to a list of bullets to make those list items easier to read.

考虑将句子中以逗号分隔的条目列表更改为项目符号列表，以使这些列表项更易于阅读。

### Use more common words

### 使用更常见的词

Shorter, more common words are generally easier to read than longer ones.
This does not mean you need to write down to the audience.
Technical docs should still be precise.
Angular docs are read by many people around the world and should use language that the most people can understand.

较短、更常见的单词通常比较长的单词更易于阅读。这并不意味着你需要向观众写下。技术文档应该仍然是精确的。世界各地的许多人都会阅读 Angular 文档，并且应该使用大多数人能理解的语言。

If you think a specific term is required even though it has been flagged as uncommon, try to include a short explanation of the term.
Also, try adding some context around its first mention.

如果你认为即使某个特定术语已被标记为不常见也是需要的，请尝试包含对该术语的简短解释。此外，尝试在第一次提及周围添加一些上下文。

Linking a term to another section or topic is also an option, but consider the disruption that causes to the reader before you use it.
If you force a reader to go to another page for a definition, they might lose their concentration on the current topic and their primary goal.

将术语链接到另一个部分或主题也是一种选择，但在使用之前要考虑对读者造成的干扰。如果你强迫读者转到另一个页面进行定义，他们可能会失去对当前主题和主要目标的专注。

### Use fewer words

### 使用更少的词

If you can remove a word and not lose the meaning of the sentence, leave it out.

如果你可以删除一个单词并且不会失去句子的含义，请将其删除。

One common place where removing words can help is in a list of examples with more than two or three items.
Before you place the items in a bullet list, consider if only one of the items can convey the desired meaning.
Another option might be to replace a list of items with a single term that describes all the elements in your list.

删除单词可以提供帮助的一个常见地方是包含两个或三个以上条目的示例列表。在将条目放入项目符号列表之前，请考虑是否只有一项可以传达所需的含义。另一种选择可能是使用描述列表中所有元素的单个术语替换条目列表。

## More about specific documentation linter messages

## 有关特定文档 linter 消息的更多信息

Most documentation linter messages are self-explanatory and include a link to supplementary documentation.
Some messages identify areas in that the documentation might need more thought.
The following types of messages often occur in areas of the text that should be reconsidered and rewritten to improve the text and remove the message.

大多数文档 linter 消息都是不言自明的，并包含指向补充文档的链接。某些消息会确定文档可能需要更多考虑的领域。以下类型的消息通常出现在应该重新考虑和重写以改进文本和删除消息的文本区域中。

### A word is `too-wordy` or should be replaced by another

### 一个词 `too-wordy` 或应该由另一个词替换

Generally, technical documentation should use a simple and consistent vocabulary to be understood by a wide audience.
Words that trigger this message are usually words for which there's a simpler way to convey the same thought.

一般来说，技术文档应该使用简单而一致的词汇表，以便让广大观众理解。触发此消息的单词通常是可以用更简单的方式来传达相同想法的单词。

<!-- vale Angular.Google_Spacing = NO -->

<!-- vale Angular.Google_Headings = NO -->

<!-- vale Angular.Google_Ellipses = NO -->

<!-- vale Angular.WriteGood_TooWordy = NO -->

<!-- markdownlint-disable-file MD026 -->

#### Angular.WriteGood_TooWordy - See if you can rewrite the sentence...

#### Angular.WriteGood_TooWordy - 看看你是否可以重写句子……

<!-- vale Angular.WriteGood_TooWordy = YES -->

<!-- vale Angular.Google_Ellipses = YES -->

<!-- vale Angular.Google_Headings = YES -->

<!-- vale Angular.Google_Spacing = YES -->

Words identified by this style test can usually be replaced by simpler words.
If not, sentences with these words should be revised to use simpler language and avoid the word in the message.

这种风格测试识别的单词通常可以用更简单的单词替换。如果不是，则应修改带有这些单词的句子以使用更简单的语言并避免消息中的单词。

The following table has some common words detected by this type of message and simpler words to try in their place.

下表有此类消息检测到的一些常见单词，以及可以尝试的更简单的单词。

<!-- vale Angular.WriteGood_TooWordy = NO -->

| `Too-wordy` word | Simpler replacement |
| :--------------- | :------------------ |
| `Too-wordy` 词 | 更换更简单 |
| `accelerate` | `speed up` |
| `accomplish` | `perform` or `finish` |
| `accomplish` | `perform` 或 `finish` |
| `acquire` | `get` |
| `additional` | `more` |
| `adjustment` | `change` |
| `advantageous` | `beneficial` |
| `consequently` | `as a result` |
| `designate` | `assign` |
| `equivalent` | `the same` |
| `exclusively` | `only` |
| `for the most part` | `generally` |
| `have a tendency to` | `tend to` |
| `in addition` | `furthermore` |
| `modify` | `change` or `update` |
| `modify` | `change` 或 `update` |
| `monitor` | `observe` |
| `necessitate` | `require` |
| `one particular` | `one` |
| `point in time` | `moment` |
| `portion` | `part` |
| `similar to` | `like` |
| `validate` | `verify` |
| `whether or not` | `whether` |

<!-- vale Angular.WriteGood_TooWordy = YES -->

<!-- vale Angular.Google_Headings = NO -->

#### `WordList` messages

#### `WordList` 消息

<!-- vale Angular.Google_Headings = YES -->

The messages about words detected by these style tests generally suggest a better alternative.
While the word you used would probably be understood, it most likely triggered this message for one of the following reasons:

这些风格测试检测到的关于单词的消息通常会提出更好的选择。虽然你使用的词可能会被理解，但它很可能由于以下原因之一触发了此消息：

* The suggested works better in a screen-reader context

  建议在屏幕阅读器上下文中效果更好

* The word that you used could produce an unpleasant response in the reader

  你使用的词可能会在读者中产生不愉快的反应

* The suggested word is simpler, shorter, or easier for more people to understand

  建议的字词更简单、更短或更容易让更多人理解

* The word you used has other possible variations.
  The suggested word is the variation to use in the documentation to be consistent.

  你使用的词还有其他可能的变体。建议的词是在文档中使用的变体，以保持一致。

<!-- vale Angular.Angular_Spelling = NO -->

### `Proselint` messages

### `Proselint` 消息

The Proselint style tests test for words that are jargon or that could be offensive to some people.

Proselint 风格测试会测试是否为行话或可能对某些人造成冒犯的单词。

<!-- vale Angular.Angular_Spelling = YES -->

Rewrite the text to replace the jargon or offensive language with more inclusive language.

重写文本，用更具包容性的语言替换行话或攻击性语言。

### `Starting a sentence` messages

### `Starting a sentence` 消息

Some words, such as *so* and *there is/are*, aren't necessary at the beginning of a sentence.
Sentences that start with the words identified by this message can usually be made shorter, simpler, and clearer by rewriting them without those openings.

某些单词，例如*so*和*there is/are* ，在句首不是必须的。以此消息标识的单词开头的句子通常可以通过在没有这些开头的情况下重写它们来变得更短、更简单和更清晰。

### Cliches

### 陈词滥调

Cliches should be replaced by more literal text.

陈词滥调应该用更文字的文本替换。

Cliches make it difficult for people who don't understand English to understand the documentation.
When cliches are translated by online tools such as Google Translate, they can produce confusing results.

陈词滥调使不懂英语的人很难理解文档。当使用 Google 翻译等在线工具翻译陈词滥调时，它们可能会产生令人困惑的结果。

## If all else fails

## 如果一切都失败了

The style rules generally guide you in the direction of clearer content, but sometimes you might need to break the rules.
If you decide that the best choice for the text conflicts with the linter, mark the text as an exception to linting.

风格规则通常会引导你朝着更清晰的内容的方向发展，但有时你可能需要打破规则。如果你认为文本的最佳选择与 linter 冲突，请将文本标记为 linting 的例外。

The documentation linter checks only the content that is rendered as text.
It does not test code-formatted text.
One common source of false problems is code references that are not formatted as code.

文档 linter 仅检查渲染为文本的内容。它不会测试代码格式的文本。错误问题的一个常见来源是未格式化为代码的代码引用。

If you use these exceptions, please limit the amount of text that you exclude from analysis to the fewest lines possible.

如果你使用了这些例外，请将要从分析中排除的文本量限制为尽可能少的行。

When necessary, you can apply these exceptions to your content.

必要时，你可以将这些例外应用于你的内容。

1. **General exception**

   **一般异常**

   A general exception allows you to exclude the specified text from all lint testing.

   一般的异常允许你从所有 lint 测试中排除指定的文本。

   To apply a general exception, surround the text that you do not want the linter to test with the HTML
   `comment` elements shown in this example.

   要应用一般异常，请使用此示例中显示的 HTML `comment` 元素将你不希望 linter 测试的文本括起来。

   <code-example format="html" language="html">

   &lt;!-- vale off --&gt;

   Text the linter does not check for any style problem.

   &lt;!-- vale on --&gt;

   </code-example>

   Be sure to leave a blank line before and after each comment.

   确保在每条注释前后都留一个空行。

1. **Style exception**

   **风格异常**

   A style exception allows you to exclude text from an individual style test.

   样式异常允许你从单个样式测试中排除文本。

   To apply a style exception, surround the text that you do not want the linter to test with these HTML
   `comment` elements.
   Between these comments, the linter ignores the style test in the comment, but
   still tests for all other styles that are in use.

   要应用样式异常，请使用这些 HTML `comment` 元素包围你不希望 linter 测试的文本。在这些注释之间，linter 会忽略注释中的样式测试，但仍会测试正在使用的所有其他样式。

   <code-example format="html" language="html">

   &lt;!-- vale Style.Rule = NO --&gt;
   &lt;!-- vale Style.Rule = YES --&gt;

   </code-example>

   Replace `Style.Rule` in the comments with the style rule reference from the problem message displayed in the IDE.
   For example, imagine that you got this problem message and you want to use the word it identified as a problem.

   将注释中的 `Style.Rule` 替换为 IDE 中显示的问题消息中的样式规则引用。例如，假设你收到此问题消息，并且你想使用它识别为问题的词。

   <code-example format="html" language="html">

   Did you really mean 'inlines'?  It was not found in our dictionary. Vale(Angular.Angular_Spelling) [Ln 24, Col 59]
   Angular_Spelling.yml[Ln 1, Col 1]: View rule

   </code-example>

   The `Style.Rule` for this message is the text inside the parentheses: `Angular.Angular_Spelling` in this case.
   To turn off that style test, use the comments shown in this example.

   此消息的 `Style.Rule` 是括号内的文本：在本例中为 `Angular.Angular_Spelling` 。要关闭该风格测试，请使用此示例中显示的注释。

   <code-example format="html" language="html">

   &lt;!-- vale Angular.Angular_Spelling = NO --&gt;

   'inlines' does not display a problem because this text is not spell-checked.
   Remember that the linter does not check any spelling in this block of text.
   The linter continues to test all other style rules.

   &lt;!-- vale Angular.Angular_Spelling = YES --&gt;

   </code-example>

<!-- links -->

[AioGuideDocsStyleGuide]: https://angular.io/guide/docs-style-guide "Angular documentation style guide | Angular"

<!-- external links -->

[GoogleDevelopersStyle]: https://developers.google.com/style "About this guide | Google developer documentation style guide | Google Developers"

<!-- end links -->

@reviewed 2022-10-12