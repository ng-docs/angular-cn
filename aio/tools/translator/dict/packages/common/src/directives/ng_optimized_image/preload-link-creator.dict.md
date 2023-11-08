Contains the logic needed to track and add preload link tags to the `<head>` tag. It
will also track what images have already had preload link tags added so as to not duplicate link
tags.

包含跟踪预加载链接标签并将其添加到 `<head>` 标签所需的逻辑。它还将跟踪哪些图像已经添加了预加载链接标签，以免重复链接标签。

In dev mode this service will validate that the number of preloaded images does not exceed the
configured default preloaded images limit: {&commat;link DEFAULT_PRELOADED_IMAGES_LIMIT}.

在开发模式下，此服务将验证预加载图像的数量是否不超过配置的默认预加载图像限制：{&commat;link DEFAULT_PRELOADED_IMAGES_LIMIT}。

Add a preload `<link>` to the `<head>` of the `index.html` that is served from the
server while using Angular Universal and SSR to kick off image loads for high priority images.

将预加载 `<link>` 添加到服务器提供的 `index.html` 的 `<head>` 中，同时使用 Angular Universal 和 SSR 启动高优先级图像的图像加载。

The `sizes` \(passed in from the user\) and `srcset` \(parsed and formatted from `ngSrcset`\)
properties used to set the corresponding attributes, `imagesizes` and `imagesrcset`
respectively, on the preload `<link>` tag so that the correctly sized image is preloaded from
the CDN.

`sizes` （从用户传入）和 `srcset` （从 `ngSrcset` 解析和格式化）属性分别用于在 preload `<link>` 标签上设置相应的属性 `imagesizes` 和 `imagesrcset`，以便从 CDN 预加载正确大小的图像。

{&commat;link https://web.dev/preload-responsive-images/#imagesrcset-and-imagesizes}



The `Renderer2` passed in from the directive

从指令传入的 `Renderer2`

The original src of the image that is set on the `ngSrc` input.

在 `ngSrc` 输入上设置的图像的原始 src。

The parsed and formatted srcset created from the `ngSrcset` input

从 `ngSrcset` 输入创建的经过解析和格式化的 srcset

The value of the `sizes` attribute passed in to the `<img>` tag

传递给 `<img>` 标签的 `sizes` 属性的值