`ResourceLoader` which delegates to an `NgCompilerAdapter`'s resource loading methods.

`ResourceLoader`，它委托给 `NgCompilerAdapter` 的资源加载方法。

The, possibly relative, url of the resource.

资源的可能是相对的 url。

The path to the file that contains the URL of the resource.

包含资源 URL 的文件的路径。

A resolved url of resource.

资源的解析 url。

An error if the resource cannot be resolved.

如果无法解析资源，则会出现错误。

Resolve the url of a resource relative to the file that contains the reference to it.
The return value of this method can be used in the `load()` and `preload()` methods.

解析资源相对于包含对它的引用的文件的 url。此方法的返回值可在 `load()` 和 `preload()`
方法中使用。

Uses the provided CompilerHost if it supports mapping resources to filenames.
Otherwise, uses a fallback mechanism that searches the module resolution candidates.

如果支持将资源映射到文件名，则使用提供的 CompilerHost
。否则，使用搜索模块解析候选者的后备机制。

The url \(resolved by a call to `resolve()`\) of the resource to preload.

要预加载的资源的 url（通过调用 `resolve()` 来解析）。

Information about the resource such as the type and containing file.

有关资源的信息，例如类型和包含文件。

A Promise that is resolved once the resource has been loaded or `undefined` if the
file has already been loaded.

加载资源后解析的 Promise，如果已加载文件，则为 `undefined`。

An Error if pre-loading is not available.

如果预加载不可用，则会出现错误。

Preload the specified resource, asynchronously.

异步预加载指定的资源。

Once the resource is loaded, its value is cached so it can be accessed synchronously via the
`load()` method.

加载资源后，它的值会被缓存，以便可以通过 `load()` 方法同步访问它。

The existing content data from the inline resource.

内联资源中的现有内容数据。

Information regarding the resource such as the type and containing file.

有关资源的信息，例如类型和包含文件。

A Promise that resolves to the processed data. If no processing occurs, the
same data string that was passed to the function will be resolved.

解析为已处理数据的 Promise。如果不发生处理，则将解析传递给函数的同一个数据字符串。

Preprocess the content data of an inline resource, asynchronously.

异步预处理内联资源的内容数据。

The url \(resolved by a call to `resolve()`\) of the resource to load.

要加载的资源的 url（通过调用 `resolve()` 来解析）。

The contents of the resource.

资源的内容。

Load the resource at the given url, synchronously.

同步加载给定 url 的资源。

The contents of the resource may have been cached by a previous call to `preload()`.

资源的内容可能已通过先前对 `preload()` 的调用而被缓存。

Invalidate the entire resource cache.

使整个资源缓存无效。

If the user specified styleUrl points to *.scss, but the Sass compiler was run before
Angular, then the resource may have been generated as *.css. Simply try the resolution
again.

如果用户指定的 styleUrl 指向了*.scss，但 Sass 编译器是在 Angular
之前运行的，则资源可能已生成为*.css。只需再次尝试此解析。

Derives a `ts.ModuleResolutionHost` from a compiler adapter that recognizes the special resource
marker and does not go to the filesystem for these requests, as they are known not to exist.

从可识别特殊资源标记的编译器适配器派生一个 `ts.ModuleResolutionHost`
，并且不会转到这些请求的文件系统，因为已知它们不存在。