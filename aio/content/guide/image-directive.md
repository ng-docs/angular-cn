# Getting started with NgOptimizedImage

# NgOptimizedImage 入门

The `NgOptimizedImage` directive makes it easy to adopt performance best practices for loading images.

`NgOptimizedImage` 指令可以轻松采用关于性能的最佳实践来加载图片。

The directive ensures that the loading of the [Largest Contentful Paint (LCP)](http://web.dev/lcp) image is prioritized by:

该指令可确保[最大内容绘制 (LCP)](http://web.dev/lcp)图片的加载优先级为：

* Automatically setting the `fetchpriority` attribute on the `<img>` tag

  自动设置 `<img>` 标签上的 `fetchpriority` 属性

* Lazy loading other images by default

  默认惰性加载其他图片

* Asserting that there is a corresponding preconnect link tag in the document head

  断言文档头中有相应的预连接链接标签

* Automatically generating a `srcset` attribute

  自动生成 `srcset` 属性

* Generating a [preload hint](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload) if app is using SSR

  如果应用程序使用 SSR，则生成[预加载提示](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)

In addition to optimizing the loading of the LCP image, `NgOptimizedImage` enforces a number of image best practices, such as:

除了优化 LCP 图片的加载之外，`NgOptimizedImage` 还实施了许多图片最佳实践，例如：

* Using [image CDN URLs to apply image optimizations](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)

  使用[图片 CDN URL 应用图片优化](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)

* Preventing layout shift by requiring `width` and `height`

  通过要求 `width` 和 `height` 来防止布局偏移

* Warning if `width` or `height` have been set incorrectly

  如果 `width` 或 `height` 设置不正确，则会发出警告

* Warning if the image will be visually distorted when rendered

  给出渲染时图片是否会在视觉上失真的警告

## Getting Started

## 快速上手

#### Step 1: Import NgOptimizedImage

#### 步骤 1：导入 NgOptimizedImage

<code-example format="typescript" language="typescript">

import { NgOptimizedImage } from '@angular/common'

</code-example>

The directive is defined as a [standalone directive](/guide/standalone-components), so components should import it directly.

该指令被定义为[独立指令](/guide/standalone-components)，因此组件应该直接导入它。

#### Step 2: (Optional) Set up a Loader

#### 第 2 步：（可选）设置加载器

An image loader is not **required** in order to use NgOptimizedImage, but using one with an image CDN enables powerful performance features, including automatic `srcset`s for your images.

使用 NgOptimizedImage **不一定需要**图片加载器，但使用带有图片 CDN 的加载器可以实现强大的性能特性，包括为图片自动设置 `srcset` 。

A brief guide for setting up a loader can be found in the [Configuring an Image Loader](#configuring-an-image-loader-for-ngoptimizedimage) section at the end of this page.

有关设置加载器的简短指南，请参阅本页末尾的[配置图片加载器](#configuring-an-image-loader-for-ngoptimizedimage)部分。

#### Step 3: Enable the directive

#### 第 3 步：启用该指令

To activate the `NgOptimizedImage` directive, replace your image's `src` attribute with `ngSrc`.

要激活 `NgOptimizedImage` 指令，请将图片的 `src` 属性替换为 `ngSrc` 。

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg"&gt;

</code-example>

If you're using a [built-in third-party loader](#built-in-loaders), make sure to omit the base URL path from `src`, as that will be prepended automatically by the loader.

如果你使用的是[内置的第三方加载器](#built-in-loaders)，请确保忽略了 `src` 中的基本 URL 路径，因为它会由此加载器自动附加。

#### Step 4: Mark images as `priority`

#### 步骤 4：将图片标记为 `priority`

Always mark the [LCP image](https://web.dev/lcp/#what-elements-are-considered) on your page as `priority` to prioritize its loading.

始终将页面上的 [LCP 图片](https://web.dev/lcp/#what-elements-are-considered) 标记为 `priority` 的，以优先加载它。

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200" priority&gt;

</code-example>

Marking an image as `priority` applies the following optimizations:

将图片标记为 `priority` 会应用以下优化：

* Sets `fetchpriority=high` (read more about priority hints [here](https://web.dev/priority-hints))

  设置 `fetchpriority=high` （在[这里](https://web.dev/priority-hints)阅读有关优先级提示的更多内容）

* Sets `loading=eager` (read more about native lazy loading [here](https://web.dev/browser-level-image-lazy-loading))

  设置 `loading=eager` （在[这里](https://web.dev/browser-level-image-lazy-loading)阅读有关原生惰性加载的更多信息）

* Automatically generates a [preload link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload) if [rendering on the server](/guide/universal).

  如果做[服务器端渲染](/guide/universal)，则会自动生成[预加载链接元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)。

Angular displays a warning during development if the LCP element is an image that does not have the `priority` attribute. A page’s LCP element can vary based on a number of factors - such as the dimensions of a user's screen, so a page may have multiple images that should be marked `priority`. See [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) for more details.

如果 LCP 元素是不具有 `priority` 属性的图片，则 Angular 会在开发过程中显示警告。页面的 LCP 元素可能会因许多因素而异 - 例如用户屏幕的尺寸，因此一个页面可能有多个应该标记为 `priority` 的图片。有关更多详细信息，请参阅 [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) 。

#### Step 5: Include Height and Width

#### 第 5 步：包括高度和宽度

In order to prevent [image-related layout shifts](https://web.dev/css-web-vitals/#images-and-layout-shifts), NgOptimizedImage requires that you specify a height and width for your image, as follows:

为了防止[与图片相关的布局移位](https://web.dev/css-web-vitals/#images-and-layout-shifts)，NgOptimizedImage 要求你为图片指定高度和宽度，如下所示：

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" width="400" height="200"&gt;

</code-example>

For **responsive images** (images which you've styled to grow and shrink relative to the viewport), the `width` and `height` attributes should be the instrinsic size of the image file.

对于**响应式图片**（会相对于视口而增长和缩小的图片），`width` 和 `height` 属性应该是图片文件的内在大小。

For **fixed size images**, the `width` and `height` attributes should reflect the desired rendered size of the image. The aspect ratio of these attributes should always match the intrinsic aspect ratio of the image.

对于**固定大小的图片**，`width` 和 `height` 属性应该反映图片的所需渲染的大小。这些属性的纵横比应始终与图片的固有纵横比匹配。

Note: If you don't know the size of your images, consider using "fill mode" to inherit the size of the parent container, as described below:

注意：如果你不知道图片的大小，请考虑使用“填充（`fill`）模式”来继承父容器的大小，如下所述：

### Using `fill` mode

### 使用 `fill` 模式

In cases where you want to have an image fill a containing element, you can use the `fill` attribute. This is often useful when you want to achieve a "background image" behavior. It can also be helpful when you don't know the exact width and height of your image, but you do have a parent container with a known size that you'd like to fit your image into (see "object-fit" below).

如果你希望让图片填充其容器元素，可以用 `fill` 属性。当你想实现“背景图片”行为时，这通常会很有用。当你不知道图片的确切宽度和高度时，它也会很有帮助，但如果你确实有一个具有已知大小的父容器，可能希望将图片适配进其中（请参阅下面的“object-fit”） .

When you add the `fill` attribute to your image, you do not need and should not include a `width` and `height`, as in this example:

当你将 `fill` 属性添加到图片时，不需要也不应该包含 `width` 和 `height` ，如下例所示：

<code-example format="typescript" language="typescript">

&lt;img ngSrc="cat.jpg" fill&gt;

</code-example>

You can use the [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property to change how the image will fill its container. If you style your image with `object-fit: "contain"`, the image will maintain its aspect ratio and be "letterboxed" to fit the element. If you set `object-fit: "cover"`, the element will retain its aspect ratio, fully fill the element, and some content may be "cropped" off. 

你可以用 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) 这个 CSS 属性来更改图片填充其容器的方式。如果你使用 `object-fit: "contain"` 来设置图片的样式，则图片将保持其纵横比并被黑边化（译注：类似于电影在不同分辨率播放时加黑边）以适配此元素。如果你设置了 `object-fit: "cover"` ，则元素将保留其长宽比，完全填充元素，并且某些内容可能会被“裁剪”。

See visual examples of the above at the [MDN object-fit documentation.](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)

请在 [MDN object-fit 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)中查看上述内容的可视化示例。

You can also style your image with the [object-position property](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) to adjust its position within its containing element.

你还可以用 [object-location 属性来设置](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position)图片的样式，以调整其在容器元素中的位置。

**Important note:** For the "fill" image to render properly, its parent element **must** be styled with `position: "relative"`, `position: "fixed"`, or `position: "absolute"`. 

**重要说明**：为了正确渲染“fill”图片，其父元素**必须**使用 `position: "relative"`、`position: "fixed"` 或 `position: "absolute"` 来设置样式。

### Adjusting image styling

### 调整图片样式

Depending on the image's styling, adding `width` and `height` attributes may cause the image to render differently. `NgOptimizedImage` warns you if your image styling renders the image at a distorted aspect ratio.

根据图片的样式，添加 `width` 和 `height` 属性可能会导致图片的渲染方式不同。如果你的图片样式正在以扭曲的纵横比渲染图片， `NgOptimizedImage` 会发出警告。

You can typically fix this by adding `height: auto` or `width: auto` to your image styles. For more information, see the [web.dev article on the `<img>` tag](https://web.dev/patterns/web-vitals-patterns/images/img-tag).

你通常可以通过将 `height: auto` 或 `width: auto` 添加到图片的样式中来解决此问题。有关更多信息，请参阅[关于 `<img>` 标签的 web.dev 文章](https://web.dev/patterns/web-vitals-patterns/images/img-tag)。

If the `height` and `width` attribute on the image are preventing you from sizing the image the way you want with CSS, consider using "fill" mode instead, and styling the image's parent element.

如果图片上的 `height` 和 `width` 属性让你无法用 CSS 以你想要的方式调整图片大小，请考虑改用“填充”模式，并为图片的父元素设置样式。

## Performance Features

## 性能优化特性

NgOptimizedImage includes a number of features designed to improve loading performance in your app. These features are described in this section.

NgOptimizedImage 包含许多旨在提高应用程序加载性能的特性。本节会介绍这些特性。

### Add resource hints

### 添加资源提示

You can add a [`preconnect` resource hint](https://web.dev/preconnect-and-dns-prefetch) for your image origin to ensure that the LCP image loads as quickly as possible. Always put resource hints in the `<head>` of the document.

你可以为图片源添加 [`preconnect` 资源提示](https://web.dev/preconnect-and-dns-prefetch)，以确保 LCP 图片尽快加载。始终将资源提示放在文档的 `<head>` 中。

<code-example format="html" language="html">

&lt;link rel="preconnect" href="https://my.cdn.origin" /&gt;

</code-example>

By default, if you use a loader for a third-party image service, the `NgOptimizedImage` directive will warn during development if it detects that there is no `preconnect` resource hint for the origin that serves the LCP image.

默认情况下，如果你使用第三方图片服务的加载器，当 `NgOptimizedImage` 指令检测到提供 LCP 图片的源缺少 `preconnect` 资源提示时，它将在开发期间发出警告。

To disable these warnings, inject the `PRECONNECT_CHECK_BLOCKLIST` token:

要禁用这些警告，请注入 `PRECONNECT_CHECK_BLOCKLIST` 标记：

<code-example format="typescript" language="typescript">

providers: [
  {provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

</code-example>

### Request images at the correct size with automatic `srcset`

### 使用自动 `srcset` 请求正确大小的图片

Defining a [`srcset` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset) ensures that the browser requests an image at the right size for your user's viewport, so it doesn't waste time downloading an image that's too large. `NgOptimizedImage` generates an appropriate `srcset` for the image, based on the presence and value of the [`sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) on the image tag.

定义 [`srcset` 属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset)可确保浏览器为用户的视口请求正确大小的图片，因此不会浪费时间下载太大的图片。 `NgOptimizedImage` 会根据 img 标签上 [`sizes`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) 属性的存在与否和值来为图片生成适当的 `srcset`。

#### Fixed-size images

#### 固定大小的图片

If your image should be "fixed" in size  (i.e. the same size across devices, except for [pixel density](https://web.dev/codelab-density-descriptors/)), there is no need to set a `sizes` attribute. A `srcset` can be generated automatically from the image's width and height attributes with no further input required. 

如果你的图片的大小应该是“固定的”（即跨设备的大小相同，除了[像素密度](https://web.dev/codelab-density-descriptors/)不同），则无需设置 `sizes` 属性。可以从图片的 `width` 和 `height` 属性自动生成 `srcset`，无需更多的输入属性。

Example srcset generated: `<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x">`

生成的示例 srcset： `<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x">`

#### Responsive images

#### 响应式图片

If your image should be responsive (i.e. grow and shrink according to viewport size), then you will need to define a [`sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) to generate the `srcset`.

如果你的图片应该是响应式的（即会根据视口大小放大和缩小），那么你需要定义一个 [`sizes`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) 属性来生成 `srcset` 。

If you haven't used `sizes` before, a good place to start is to set it based on viewport width. For example, if your CSS causes the image to fill 100% of viewport width, set `sizes` to `100vw` and the browser will select the image in the `srcset` that is closest to the viewport width (after accounting for pixel density). If your image is only likely to take up half the screen (ex: in a sidebar), set `sizes` to `50vw` to ensure the browser selects a smaller image. And so on.

如果你以前没有使用过 `sizes` ，一个很好的起点是根据视口宽度来设置它。例如，如果你的 CSS 要让图片填充视口宽度的 100% ，则将 `sizes` 设置为 `100vw` ，浏览器将选择 `srcset` 中最接近视口宽度的图片（在考虑像素密度之后）。如果你的图片只可能占屏幕的一半（例如：在侧边栏中），请将 `sizes` 设置为 `50vw` 以确保浏览器选择较小的图片。以此类推。

If you find that the above does not cover your desired image behavior, see the documentation on [advanced sizes values](#advanced-sizes-values).

如果你发现上述内容无法涵盖你所需的图片行为，请参阅有关[高级尺寸值](#advanced-sizes-values)的文档。

By default, the responsive breakpoints are:

默认情况下，响应式断点是：

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

If you would like to customize these breakpoints, you can do so using the `IMAGE_CONFIG` provider:

如果你想自定义这些断点，可以用 `IMAGE_CONFIG` 提供者来实现：

<code-example format="typescript" language="typescript">
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
</code-example>

If you would like to manually define a `srcset` attribute, you can provide your own using the `ngSrcset` attribute:

如果你想手动定义 `srcset` 属性，可以用 `ngSrcset` 属性提供自己的：

<code-example format="html" language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w"&gt;

</code-example>

If the `ngSrcset` attribute is present, `NgOptimizedImage` generates and sets the `srcset` based on the sizes included. Do not include image file names in `ngSrcset` - the directive infers this information from `ngSrc`. The directive supports both width descriptors (e.g. `100w`) and density descriptors (e.g. `1x`).

如果存在 `ngSrcset` 属性，则 `NgOptimizedImage` 会根据包含的大小生成并设置 `srcset` 。不要在 `ngSrcset` 中包含图片文件名 - 该指令会从 `ngSrc` 推断此信息。该指令支持宽度描述符（例如 `100w` ）和密度描述符（例如 `1x` ）。

<code-example format="html" language="html">

&lt;img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw"&gt;

</code-example>

### Disabling automatic srcset generation

### 禁用自动 srcset 生成

To disable srcset generation for a single image, you can add the `disableOptimizedSrcset` attribute on the image:

要禁用单个图片的 srcset 生成，你可以在图片上添加 `disableOptimizedSrcset` 属性：

<code-example format="html" language="html">

&lt;img ngSrc="about.jpg" disableOptimizedSrcset&gt;

</code-example>

### Disabling image lazy loading

### 禁用图片惰性加载

By default, `NgOptimizedImage` sets `loading=lazy` for all images that are not marked `priority`. You can disable this behavior for non-priority images by setting the `loading` attribute. This attribute accepts values: `eager`, `auto`, and `lazy`. [See the documentation for the standard image `loading` attribute for details](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading#value).

默认情况下， `NgOptimizedImage` 为所有未标记 `priority` 的图片设置 `loading=lazy` 。你可以通过设置 `loading` 属性来为非优先图片禁用此行为。此属性会接受值： `eager` 、 `auto` 和 `lazy` 。[有关详细信息，请参阅标准图片 `loading` 属性的文档](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading#value)。

<code-example format="html" language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" loading="eager"&gt;

</code-example>

### Advanced 'sizes' values

### 高级的 `sizes` 值

You may want to have images displayed at varying widths on differently-sized screens. A common example of this pattern is a grid- or column-based layout that renders a single column on mobile devices, and two columns on larger devices. You can capture this behavior in the `sizes` attribute, using a "media query" syntax, such as the following:

你可能希望在不同大小的屏幕上以不同的宽度显示图片。这种模式的一个常见例子是基于网格或列的布局，它在移动设备上渲染为单列，在较大的设备上渲染为两列。你可以用“媒体查询”语法在 `sizes` 属性中捕获此行为，例如以下内容：

<code-example format="html" language="html">

&lt;img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw"&gt;

</code-example>

The `sizes` attribute in the above example says "I expect this image to be 100 percent of the screen width on devices under 768px wide. Otherwise, I expect it to be 50 percent of the screen width.

上面的示例中的 `sizes` 属性表示“我希望此图片在 768px 宽的设备上是屏幕宽度的 100% 。否则，我希望它是屏幕宽度的 50% 。

For additional information about the `sizes` attribute, see [web.dev](https://web.dev/learn/design/responsive-images/#sizes) or [mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes).

有关 [size 属性的其它信息，请参阅 web.dev](https://web.dev/learn/design/responsive-images/#sizes) `sizes` [mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) 。

## Configuring an image loader for `NgOptimizedImage`

## 为 `NgOptimizedImage` 配置图片加载器

A "loader" is a function that generates an [image transformation URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) for a given image file. When appropriate, `NgOptimizedImage` sets the size, format, and image quality transformations for an image.

“加载器”是一个为给定图片文件生成[图片转换 URL](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)的函数。如果合适，`NgOptimizedImage` 就会设置图片的大小、格式和图片质量转换。

`NgOptimizedImage` provides both a generic loader that applies no transformations, as well as loaders for various third-party image services. It also supports writing your own custom loader.

`NgOptimizedImage` 提供了一个不应用转换的通用加载器和一个用于各种第三方图片服务的加载器。它还支持编写你自己的自定义加载器。

| Loader type | Behavior |
| :---------- | :------- |
| 加载器类型 | 行为 |
| Generic loader | The URL returned by the generic loader will always match the value of `src`. In other words, this loader applies no transformations. Sites that use Angular to serve images are the primary intended use case for this loader. |
| 通用加载器 | 通用加载器返回的 URL 将始终与 `src` 的值匹配。换句话说，此加载器不应用任何转换。使用 Angular 来提供图片的站点是此加载器的主要预期用例。 |
| Loaders for third-party image services | The URL returned by the loaders for third-party image services will follow API conventions used by that particular image service. |
| 第三方图片服务的加载器 | 此加载器为第三方图片服务返回的 URL 将遵循该特定图片服务使用的 API 约定。 |
| Custom loaders | A custom loader's behavior is defined by its developer. You should use a custom loader if your image service isn't supported by the loaders that come preconfigured with `NgOptimizedImage`. |
| 自定义加载器 | 自定义加载器的行为由其开发人员定义。如果使用 `NgOptimizedImage` 预配置的加载器不支持你想要的图片服务，就应该使用自定义加载器。 |

Based on the image services commonly used with Angular applications, `NgOptimizedImage` provides loaders preconfigured to work with the following image services:

基于 Angular 应用程序常用的图片服务，`NgOptimizedImage` 提供了预配置的加载器以使用以下图片服务：

| Image Service | Angular API | Documentation |
| :------------ | :---------- | :------------ |
| 图片服务 | Angular API | 文档 |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [Documentation](https://developers.cloudflare.com/images/image-resizing/) |
| Cloudflare 图片大小调整 | `provideCloudflareLoader` | [文档](https://developers.cloudflare.com/images/image-resizing/) |
| Cloudinary | `provideCloudinaryLoader` | [Documentation](https://cloudinary.com/documentation/resizing_and_cropping) |
| Cloudinary | `provideCloudinaryLoader` | [文档](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit | `provideImageKitLoader` | [Documentation](https://docs.imagekit.io/) |
| ImageKit | `provideImageKitLoader` | [文档](https://docs.imagekit.io/) |
| Imgix | `provideImgixLoader` | [Documentation](https://docs.imgix.com/) |
| Imgix | `provideImgixLoader` | [文档](https://docs.imgix.com/) |

To use the **generic loader** no additional code changes are necessary. This is the default behavior.

要使用**通用加载器**，无需额外的代码更改。这是默认行为。

### Built-in Loaders

### 内置加载器

To use an existing loader for a **third-party image service**, add the provider factory for your chosen service to the `providers` array. In the example below, the Imgix loader is used:

要将现有的加载器用于**第三方图片服务**，请将你选择的服务的提供者工厂添加到 `providers` 数组中。在下面的示例中，使用了 Imgix 加载器：

<code-example format="typescript" language="typescript">
providers: [
  provideImgixLoader('https://my.base.url/'),
],
</code-example>

The base URL for your image assets should be passed to the provider factory as an argument. For most sites, this base URL should match one of the following patterns:

图片资产的基本 URL 应作为参数传递给提供者工厂。对于大多数网站，此基本 URL 应匹配以下模式之一：

* <https://yoursite.yourcdn.com>

* <https://subdomain.yoursite.com>

* <https://subdomain.yourcdn.com/yoursite>

You can learn more about the base URL structure in the docs of a corresponding CDN provider.

你可以在相应 CDN 提供者的文档中了解有关基本 URL 结构的更多信息。

### Custom Loaders

### 自定义加载器

To use a **custom loader**, provide your loader function as a value for the `IMAGE_LOADER` DI token. In the example below, the custom loader function returns a URL starting with `https://example.com` that includes `src` and `width` as URL parameters.

要使用**自定义加载器**，请提供你的加载器函数作为 `IMAGE_LOADER` DI 标记的值。在下面的示例中，自定义加载器函数会返回一个以 `https://example.com` 开头的 URL，其中包含 `src` 和 `width` 作为 URL 参数。

<code-example format="typescript" language="typescript">
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}`;
    },
  },
],
</code-example>

A loader function for the `NgOptimizedImage` directive takes an object with the `ImageLoaderConfig` type (from `@angular/common`) as its argument and returns the absolute URL of the image asset. The `ImageLoaderConfig` object contains the `src` and `width` properties.

`NgOptimizedImage` 指令的加载器函数接受 `ImageLoaderConfig` 类型的对象（来自 `@angular/common` ）作为其参数，并返回图片资产的绝对 URL。 `ImageLoaderConfig` 对象包含 `src` 和 `width` 属性。

Note: a custom loader must support requesting images at various widths in order for `ngSrcset` to work properly.

注意：自定义加载器必须支持请求各种宽度的图片，以便 `ngSrcset` 正常工作。

<!-- links -->

<!-- external links -->

<!--end links -->

@reviewed 2022-11-07