Use this class to load a collection of translation files from disk.

使用此类从磁盘加载翻译文件的集合。

An array, per locale, of absolute paths to translation files.

每个区域设置的翻译文件绝对路径的数组。

For each locale to be translated, there is an element in `translationFilePaths`. Each element
is an array of absolute paths to translation files for that locale.
If the array contains more than one translation file, then the translations are merged.
If allowed by the `duplicateTranslation` property, when more than one translation has the same
message id, the message from the earlier translation file in the array is used.
For example, if the files are `[app.xlf, lib-1.xlf, lib-2.xlif]` then a message that appears in
`app.xlf` will override the same message in `lib-1.xlf` or `lib-2.xlf`.

对于每个要翻译的区域设置，`translationFilePaths`
中都有一个元素。每个元素都是该区域设置的翻译文件的绝对路径数组。如果数组包含多个翻译文件，则会合并这些翻译。如果
`duplicateTranslation` 属性允许，当多个翻译具有相同的消息 id
时，会使用数组中靠前的翻译文件中的消息。例如，如果文件是 `[app.xlf, lib-1.xlf, lib-2.xlif]`
，则出现在 `app.xlf` 中的消息将覆盖 `lib-1.xlf` 或 `lib-2.xlf` 中的同一消息.

An array of locales for each of the translation files.

每个翻译文件的区域设置数组。

If there is a locale provided in `translationFileLocales` then this is used rather than a
locale extracted from the file itself.
If there is neither a provided locale nor a locale parsed from the file, then an error is
thrown.
If there are both a provided locale and a locale parsed from the file, and they are not the
same, then a warning is reported.

如果 `translationFileLocales`
中提供了区域设置，则会使用此区域设置，而不是从文件本身提取的区域设置。如果既没有提供的区域设置，也没有从文件解析的区域设置，则会抛出错误。如果同时存在提供的区域设置和从文件解析的区域设置，并且它们不相同，则会报告警告。

Load and parse the translation files into a collection of `TranslationBundles`.

加载翻译文件并将其解析到 `TranslationBundles` 的集合中。