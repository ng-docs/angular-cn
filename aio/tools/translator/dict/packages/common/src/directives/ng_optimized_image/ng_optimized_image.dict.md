When a Base64-encoded image is passed as an input to the `NgOptimizedImage` directive,
an error is thrown. The image content \(as a string\) might be very long, thus making
it hard to read an error message if the entire string is included. This const defines
the number of characters that should be included into the error message. The rest
of the content is truncated.

当 Base64 编码的图像作为输入传递给 `NgOptimizedImage` 指令时，会抛出错误。图像内容（作为字符串）可能很长，因此如果包含整个字符串，则很难阅读错误消息。此常量定义应包含在错误消息中的字符数。其余内容被截断。

RegExpr to determine whether a src in a srcset is using width descriptors.
Should match something like: "100w, 200w".

用于确定 srcset 中的 src 是否使用宽度描述符的 RegExpr。应该匹配类似：“100w，200w”。

RegExpr to determine whether a src in a srcset is using density descriptors.
Should match something like: "1x, 2x, 50x". Also supports decimals like "1.5x, 1.50x".

用于确定 srcset 中的 src 是否使用密度描述符的 RegExpr。应匹配类似：“1x、2x、50x”的内容。还支持小数，如“1.5x、1.50x”。

Srcset values with a density descriptor higher than this value will actively
throw an error. Such densities are not permitted as they cause image sizes
to be unreasonably large and slow down LCP.

密度描述符高于此值的 Srcset 值将主动抛出错误。这样的密度是不允许的，因为它们会导致图像尺寸过大并减慢 LCP。

Used only in error message text to communicate best practices, as we will
only throw based on the slightly more conservative ABSOLUTE_SRCSET_DENSITY_CAP.

仅在错误消息文本中用于传达最佳实践，因为我们将仅基于稍微保守的 ABSOLUTE_SRCSET_DENSITY_CAP 进行抛出。

Used in generating automatic density-based srcsets

用于生成自动基于密度的 srcsets

Used to determine which breakpoints to use on full-width images

用于确定在全宽图像上使用哪些断点

Used to determine whether two aspect ratios are similar in value.

用于判断两个纵横比值是否相似。

Used to determine whether the image has been requested at an overly
large size compared to the actual rendered image size \(after taking
into account a typical device pixel ratio\). In pixels.

用于确定与实际渲染图像大小相比是否请求了过大的图像（在考虑典型设备像素比之后）。以像素为单位。

Used to limit automatic srcset generation of very large sources for
fixed-size images. In pixels.

用于限制为固定大小图像自动生成超大源的 srcset。以像素为单位。

Info about built-in loaders we can test for.

关于我们可以测试的内置加载器的信息。

A configuration object for the NgOptimizedImage directive. Contains:

NgOptimizedImage 指令的配置对象。包含：

breakpoints: An array of integer breakpoints used to generate
   srcsets for responsive images.

breakpoints：整数断点数组，用于为响应式图像生成 srcsets。

Learn more about the responsive image configuration in [the NgOptimizedImage
guide](guide/image-directive).

在[NgOptimizedImage 指南](guide/image-directive)中了解有关响应式图像配置的更多信息。

Injection token that configures the image optimized image functionality.

配置图像优化图像功能的注入令牌。

The `NgOptimizedImage` directive is marked as [standalone](guide/standalone-components) and can
be imported directly.

`NgOptimizedImage` 指令被标记为[独立的](guide/standalone-components)，可以直接导入。

Follow the steps below to enable and use the directive:

请按照以下步骤启用和使用该指令：

Import it into the necessary NgModule or a standalone Component.

将其导入到必要的 NgModule 或独立组件中。

Optionally provide an `ImageLoader` if you use an image hosting service.

如果你使用图像托管服务，可选择提供 `ImageLoader`。

Update the necessary `<img>` tags in templates and replace `src` attributes with `ngSrc`.

更新模板中必要的 `<img>` 标签，并将 `src` 属性替换为 `ngSrc`。

Using a `ngSrc` allows the directive to control when the `src` gets set, which triggers an image
download.

使用 `ngSrc` 允许指令控制何时设置 `src`，这会触发图像下载。

Step 1: import the `NgOptimizedImage` directive.

第 1 步：导入 `NgOptimizedImage` 指令。

Step 2: configure a loader.

第二步：配置加载器。

To use the **default loader**: no additional code changes are necessary. The URL returned by the
generic loader will always match the value of "src". In other words, this loader applies no
transformations to the resource URL and the value of the `ngSrc` attribute will be used as is.

要使用**默认加载器**：不需要额外的代码更改。通用加载器返回的 URL 将始终匹配“src”的值。换句话说，此加载程序不会对资源 URL 应用任何转换，并且 `ngSrc` 属性的值将按原样使用。

To use an existing loader for a **third-party image service**: add the provider factory for your
chosen service to the `providers` array. In the example below, the Imgix loader is used:

要将现有的加载器用于**第三方图片服务**，请将你选择的服务的提供者工厂添加到 `providers` 数组中。在下面的示例中，使用了 Imgix 加载器：

The `NgOptimizedImage` directive provides the following functions:

`NgOptimizedImage` 指令提供了以下功能：

If you use a different image provider, you can create a custom loader function as described
below.

如果你使用不同的图像提供者，你可以创建一个自定义加载器函数，如下所述。

To use a **custom loader**: provide your loader function as a value for the `IMAGE_LOADER` DI
token.

要使用**自定义加载器**：提供你的加载器函数作为 `IMAGE_LOADER` DI 令牌的值。

Step 3: update `<img>` tags in templates to use `ngSrc` instead of `src`.

第 3 步：更新模板中的 `<img>` 标签以使用 `ngSrc` 而不是 `src`。

Directive that improves image loading performance by enforcing best practices.

通过实施最佳实践来提高图像加载性能的指令。

`NgOptimizedImage` ensures that the loading of the Largest Contentful Paint \(LCP\) image is
prioritized by:

`NgOptimizedImage` 确保 Largest Contentful Paint \(LCP\) 图像的加载优先级为：

Automatically setting the `fetchpriority` attribute on the `<img>` tag

自动设置 `<img>` 标签上的 `fetchpriority` 属性

Lazy loading non-priority images by default

默认延迟加载非优先级图像

Asserting that there is a corresponding preconnect link tag in the document head

断言文档头中有相应的预连接链接标签

In addition, the directive:

此外，该指令：

Generates appropriate asset URLs if a corresponding `ImageLoader` function is provided

如果提供相应的 `ImageLoader` 函数，则生成适当的资产 URL

Automatically generates a srcset

自动生成 srcset

Requires that `width` and `height` are set

要求设置 `width` 和 `height`

Warns if `width` or `height` have been set incorrectly

如果 `width` 或 `height` 设置不正确，则发出警告

Warns if the image will be visually distorted when rendered

警告图像在渲染时是否会在视觉上扭曲

Name of the source image.
Image name will be processed by the image loader and the final URL will be applied as the `src`
property of the image.

源图像的名称。图片名称将由图片加载器处理，最终 URL 将用作图片的 `src` 属性。

A comma separated list of width or density descriptors.
The image name will be taken from `ngSrc` and combined with the list of width or density
descriptors to generate the final `srcset` property of the image.

逗号分隔的宽度或密度描述符列表。图像名称将从 `ngSrc` 中获取，并与宽度或密度描述符列表结合以生成图像的最终 `srcset` 属性。

Example:

范例：

The base `sizes` attribute passed through to the `<img>` element.
Providing sizes causes the image to create an automatic responsive srcset.

传递给 `<img>` 元素的基本 `sizes` 属性。提供尺寸会导致图像创建自动响应 srcset。

For responsive images: the intrinsic width of the image in pixels.
For fixed size images: the desired rendered width of the image in pixels.

对于响应式图像：图像的固有宽度（以像素为单位）。对于固定大小的图像：所需的图像渲染宽度（以像素为单位）。

For responsive images: the intrinsic height of the image in pixels.
For fixed size images: the desired rendered height of the image in pixels.\* The intrinsic
height of the image in pixels.

对于响应式图像：图像的固有高度（以像素为单位）。对于固定大小的图像：所需的图像渲染高度（以像素为单位）。\* 图像的固有高度（以像素为单位）。

The desired loading behavior \(lazy, eager, or auto\).

所需的加载行为（惰性、急切或自动）。

Setting images as loading='eager' or loading='auto' marks them
as non-priority images. Avoid changing this input for priority images.

将图像设置为 loading='eager' 或 loading='auto' 将它们标记为非优先图像。避免为优先图像更改此输入。

Indicates whether this image should have a high priority.

指示此图像是否应具有高优先级。

Data to pass through to custom loaders.

要传递给自定义加载器的数据。

Disables automatic srcset generation for this image.

禁用此图像的自动 srcset 生成。

Sets the image to "fill mode", which eliminates the height/width requirement and adds
styles such that the image fills its containing element.

将图像设置为“填充模式”，这消除了高度/宽度要求并添加样式，使图像填充其包含的元素。

Value of the `src` attribute if set on the host `<img>` element.
This input is exclusively read to assert that `src` is not set in conflict
with `ngSrc` and that images don't start to load until a lazy loading strategy is set.

如果在宿主 `<img>` 元素上设置了 `src` 属性的值。专门读取此输入以断言 `src` 未设置为与 `ngSrc` 冲突，并且在设置延迟加载策略之前图像不会开始加载。

Value of the `srcset` attribute if set on the host `<img>` element.
This input is exclusively read to assert that `srcset` is not set in conflict
with `ngSrcset` and that images don't start to load until a lazy loading strategy is set.

`srcset` 属性的值（如果在宿主 `<img>` 元素上设置）。专门读取此输入以断言 `srcset` 未设置为与 `ngSrcset` 冲突，并且在设置延迟加载策略之前图像不会开始加载。

\*\* Helpers

\*\*帮手

Convert input value to integer.

将输入值转换为整数。

Convert input value to boolean.

将输入值转换为布尔值。

Sorts provided config breakpoints and uses defaults.

对提供的配置断点进行排序并使用默认值。

\*\* Assert functions

\*\* 断言函数

Verifies that there is no `src` set on a host element.

验证没有在宿主元素上设置 `src`。

Verifies that there is no `srcset` set on a host element.

验证宿主元素上没有设置 `srcset`。

Verifies that the `ngSrc` is not a Base64-encoded image.

验证 `ngSrc` 不是 Base64 编码的图像。

Verifies that the 'sizes' only includes responsive values.

验证“尺寸”仅包含响应值。

Verifies that the `ngSrc` is not a Blob URL.

验证 `ngSrc` 不是 Blob URL。

Verifies that the input is set to a non-empty string.

验证输入是否设置为非空字符串。

Verifies that the `ngSrcset` is in a valid format, e.g. "100w, 200w" or "1x, 2x".

验证 `ngSrcset` 的格式是否有效，例如“100w, 200w”或“1x, 2x”。

Creates a `RuntimeError` instance to represent a situation when an input is set after
the directive has initialized.

创建一个 `RuntimeError` 实例来表示在指令初始化后设置输入的情况。

Verify that none of the listed inputs has changed.

确认列出的输入均未更改。

Verifies that a specified input is a number greater than 0.

验证指定的输入是否为大于 0 的数字。

Verifies that the rendered image is not visually distorted. Effectively this is checking:

验证渲染图像在视觉上没有失真。这实际上是在检查：

Whether the "width" and "height" attributes reflect the actual dimensions of the image.

“宽度”和“高度”属性是否反映图像的实际尺寸。

Whether image styling is "correct" \(see below for a longer explanation\).

图片样式是否“正确”（详见下文）。

Verifies that a specified input is set.

验证是否设置了指定的输入。

Verifies that width and height are not set. Used in fill mode, where those attributes don't make
sense.

验证未设置宽度和高度。用于填充模式，其中这些属性没有意义。

Verifies that the rendered image has a nonzero height. If the image is in fill mode, provides
guidance that this can be caused by the containing element's CSS position property.

验证渲染图像具有非零高度。如果图像处于填充模式，则提供指导说明这可能是由包含元素的 CSS position 属性引起的。

Verifies that the `loading` attribute is set to a valid input &
is not used on priority images.

验证 `loading` 属性是否设置为有效输入并且未在优先图像上使用。

Value of the ngSrc attribute

ngSrc 属性的值

ImageLoader provided

提供 ImageLoader

Warns if NOT using a loader \(falling back to the generic loader\) and
the image appears to be hosted on one of the image CDNs for which
we do have a built-in image loader. Suggests switching to the
built-in loader.

如果不使用加载器（回退到通用加载器）并且图像似乎托管在我们有内置图像加载器的图像 CDN 之一上，则会发出警告。建议切换到内置加载器。

Warns if ngSrcset is present and no loader is configured \(i.e. the default one is being used\).

如果 ngSrcset 存在并且没有配置加载器（即正在使用默认加载器），则发出警告。

Warns if loaderParams is present and no loader is configured \(i.e. the default one is being
used\).

如果 loaderParams 存在并且没有配置加载器（即正在使用默认加载器），则发出警告。