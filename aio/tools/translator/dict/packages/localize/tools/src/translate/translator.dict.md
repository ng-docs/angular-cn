An object that holds information to be used to translate files.

包含要用于翻译文件的信息的对象。

Implement this interface to provide a class that can handle translation for the given resource in
an appropriate manner.

实现此接口以提供一个可以以适当的方式处理给定资源的翻译的类。

For example, source code files will need to be transformed if they contain `$localize` tagged
template strings, while most static assets will just need to be copied.

例如，如果源代码文件包含 `$localize` 标记的模板字符串，则需要转换，而大多数静态资产只需要复制。

A relative path from the sourceRoot to the resource file to handle.

从 sourceRoot 到要处理的资源文件的相对路径。

The contents of the file to handle.

要处理的文件的内容。

Returns true if the given file can be translated by this handler.

如果此处理程序可以翻译给定文件，则返回 true。

An object for collecting translation diagnostic messages.

用于收集翻译诊断消息的对象。

An absolute path to the root of the files being translated.

正在翻译的文件的根目录的绝对路径。

A relative path from the sourceRoot to the file to translate.

从 sourceRoot 到要翻译的文件的相对路径。

The contents of the file to translate.

要翻译的文件的内容。

A function that returns an absolute path where the output file should be
written.

一个函数，它会返回应该写入输出文件的绝对路径。

A collection of translations to apply to this file.

要应用于此文件的翻译集合。

The locale of the original application source. If provided then an
additional copy of the application is created under this locale just with the `$localize` calls
stripped out.

原始应用程序源的区域设置。如果提供了，则会在此区域设置下创建应用程序的额外副本，只是删除了
`$localize` 调用。

Translate the file at `relativeFilePath` containing `contents`, using the given `translations`,
and write the translated content to the path computed by calling `outputPathFn()`.

使用给定的 `translations`，翻译包含 `contents` 的 `relativeFilePath`
文件路径的文件，并将翻译后的内容写入通过调用 `outputPathFn()` 计算的路径。

Translate each file \(e.g. source file or static asset\) using the given `TranslationHandler`s.
The file will be translated by the first handler that returns true for `canTranslate()`.

使用给定的 `TranslationHandler` 翻译每个文件（例如源文件或静态资产）。该文件将由第一个为
`canTranslate()` 返回 true 的处理程序翻译。