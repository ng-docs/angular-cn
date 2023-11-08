The root path of the files to translate, either absolute or relative to the current working
directory. E.g. `dist/en`

要翻译的文件的根路径，相对于当前工作目录的绝对或相对路径。例如 `dist/en`

The files to translate, relative to the `root` path.

要翻译的文件，相对于 `root` 路径。

An array of paths to the translation files to load, either absolute or relative to the current
working directory.

要加载的翻译文件的路径数组，可以是绝对路径，也可以是当前工作目录的相对路径。

For each locale to be translated, there should be an element in `translationFilePaths`.
Each element is either an absolute path to the translation file, or an array of absolute paths
to translation files, for that locale.

对于每个要翻译的区域设置，`translationFilePaths`
中应该有一个元素。对于该区域设置，每个元素都是翻译文件的绝对路径，或者是翻译文件的绝对路径数组。

If the element contains more than one translation file, then the translations are merged.

如果元素包含多个翻译文件，则会合并这些翻译。

If allowed by the `duplicateTranslation` property, when more than one translation has the same
message id, the message from the earlier translation file in the array is used.

如果 `duplicateTranslation` 属性允许，当多个翻译具有相同的消息 id
时，会使用数组中靠前的翻译文件中的消息。

For example, if the files are `[app.xlf, lib-1.xlf, lib-2.xlif]` then a message that appears in
`app.xlf` will override the same message in `lib-1.xlf` or `lib-2.xlf`.

例如，如果文件是 `[app.xlf, lib-1.xlf, lib-2.xlif]`，则出现在 `app.xlf` 中的消息将覆盖
`lib-1.xlf` 或 `lib-2.xlf` 中的同一消息.

A collection of the target locales for the translation files.

翻译文件的目标区域设置的集合。

If there is a locale provided in `translationFileLocales` then this is used rather than a
locale extracted from the file itself.
If there is neither a provided locale nor a locale parsed from the file, then an error is
thrown.
If there are both a provided locale and a locale parsed from the file, and they are not the
same, then a warning is reported.

如果 `translationFileLocales`
中提供了区域设置，则会使用此区域设置，而不是从文件本身提取的区域设置。如果既没有提供的区域设置，也没有从文件解析的区域设置，则会抛出错误。如果同时存在提供的区域设置和从文件解析的区域设置，并且它们不相同，则会报告警告。

A function that computes the output path of where the translated files will be
written. The marker `{{LOCALE}}` will be replaced with the target locale. E.g.
`dist/{{LOCALE}}`.

计算将要写入已翻译文件的输出路径的函数。标记 `{{LOCALE}}` 将被替换为目标区域设置。例如
`dist/{{LOCALE}}`。

An object that will receive any diagnostics messages due to the processing.

由于此处理，将接收任何诊断消息的对象。

How to handle missing translations.

如何处理缺失的翻译。

How to handle duplicate translations.

如何处理重复的翻译。

The locale of the source files.
If this is provided then a copy of the application will be created with no translation but just
the `$localize` calls stripped out.

源文件的区域设置。如果提供了此内容，则将创建应用程序的副本，不进行任何翻译，但只会删除
`$localize` 调用。