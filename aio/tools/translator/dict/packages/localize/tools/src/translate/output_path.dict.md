A function that will return an absolute path to where a file is to be written, given a locale and
a relative path.

在给定区域设置和相对路径的情况下，将返回要写入文件的位置的绝对路径的函数。

An absolute path to the folder containing this set of translations.

包含这组翻译的文件夹的绝对路径。

Create a function that will compute the absolute path to where a translated file should be
written.

创建一个函数，该函数将计算应写入已翻译文件的绝对路径。

The special `{{LOCALE}}` marker will be replaced with the locale code of the current translation.

特殊的 `{{LOCALE}}` 标记将被替换为当前翻译的区域设置代码。