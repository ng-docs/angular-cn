Observer that detects whether an image with `NgOptimizedImage`
is treated as a Largest Contentful Paint \(LCP\) element. If so,
asserts that the image has the `priority` attribute.

检测带有 `NgOptimizedImage` 的图像是否被视为 Largest Contentful Paint \(LCP\) 元素的观察者。如果是，则断言该图像具有 `priority` 属性。

Note: this is a dev-mode only class and it does not appear in prod bundles,
thus there is no `ngDevMode` use in the code.

注意：这是一个仅限开发模式的类，它不会出现在产品包中，因此代码中没有使用 `ngDevMode`。

Based on https://web.dev/lcp/#measure-lcp-in-javascript.

基于 https://web.dev/lcp/#measure-lcp-in-javascript。