Keeps track of `DtsTransform`s per source file, so that it is known which source files need to
have their declaration file transformed.

跟踪每个源文件的 `DtsTransform`，以便知道哪些源文件需要转换其声明文件。

Gets the dts transforms to be applied for the given source file, or `null` if no transform is
necessary.

获取要应用于给定源文件的 dts 转换，如果不需要转换，则为 `null`。

Processes .d.ts file text and adds static field declarations, with types.

处理 .d.ts 文件文本并添加带有类型的静态字段声明。

Transform the declaration file and add any declarations which were recorded.

转换声明文件并添加记录的任何声明。