Injection token to configure which origins should be excluded
from the preconnect checks. It can either be a single string or an array of strings
to represent a group of origins, for example:

用于配置哪些来源应从预连接检查中排除的注入令牌。它可以是单个字符串或字符串数​​组来表示一组来源，例如：

or:

或者：

Contains the logic to detect whether an image, marked with the "priority" attribute
has a corresponding `<link rel="preconnect">` tag in the `document.head`.

包含检测标有“priority”属性的图像是否在 `document.head` 中具有相应的 `<link rel="preconnect">` 标记的逻辑。

Note: this is a dev-mode only class, which should not appear in prod bundles,
thus there is no `ngDevMode` use in the code.

注意：这是一个仅限开发模式的类，不应出现在产品包中，因此代码中没有使用 `ngDevMode`。

src formatted with loader

使用 loader 格式化的 src

ngSrc value

ngSrc 值

Checks that a preconnect resource hint exists in the head for the
given src.

检查给定 src 的头部是否存在预连接资源提示。

Invokes a callback for each element in the array. Also invokes a callback
recursively for each nested array.

为数组中的每个元素调用回调。还为每个嵌套数组递归调用回调。