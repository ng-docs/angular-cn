In SSR scenarios, a preload `<link>` element is generated for priority images.
Having a large number of preload tags may negatively affect the performance,
so we warn developers \(by throwing an error\) if the number of preloaded images
is above a certain threshold. This const specifies this threshold.

在 SSR 场景下，会为优先级图片生成一个 preload `<link>` 元素。拥有大量预加载标签可能会对性能产生负面影响，因此如果预加载图像的数量超过特定阈值，我们会警告开发人员（通过抛出错误）。此 const 指定此阈值。

Helps to keep track of priority images that already have a corresponding
preload tag \(to avoid generating multiple preload tags with the same URL\).

帮助跟踪已经具有相应预加载标签的优先图像（以避免生成具有相同 URL 的多个预加载标签）。

This Set tracks the original src passed into the `ngSrc` input not the src after it has been
run through the specified `IMAGE_LOADER`.

此 Set 跟踪传递到 `ngSrc` 输入的原始 src，而不是通过指定的 `IMAGE_LOADER` 运行后的 src。