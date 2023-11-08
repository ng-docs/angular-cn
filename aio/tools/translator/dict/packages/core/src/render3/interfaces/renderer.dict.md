The goal here is to make sure that the browser DOM API is the Renderer.
We do this by defining a subset of DOM API to be the renderer and then
use that at runtime for rendering.

这里的目标是确保浏览器 DOM API 是 Renderer。我们通过定义 DOM API
的一个子集作为渲染器，然后在运行时使用它进行渲染来实现。

At runtime we can then use the DOM api directly, in server or web-worker
it will be easy to implement such API.

然后在运行时，我们可以直接使用 DOM api，在服务器或 Web-worker 中很容易实现这样的 API。

Procedural style of API needed to create elements and text nodes.

创建元素和文本节点所需的 API 的程序风格。

In non-native browser environments \(e.g. platforms such as web-workers\), this is the
facade that enables element manipulation. In practice, this is implemented by `Renderer2`.

在非原生浏览器环境（例如 Web-workers 等平台）中，这是启用元素操作的门面。这也促进了与 Renderer2
的向后兼容。

This property is allowed to be null / undefined,
in which case the view engine won't call it.
This is used as a performance optimization for production mode.

此属性允许为 null / undefined，在这种情况下，视图引擎将不会调用它。这被用作生产模式的性能优化。