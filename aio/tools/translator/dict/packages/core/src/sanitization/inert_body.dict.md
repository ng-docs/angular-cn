This helper is used to get hold of an inert tree of DOM elements containing dirty HTML
that needs sanitizing.
Depending upon browser support we use one of two strategies for doing this.
Default: DOMParser strategy
Fallback: InertDocument strategy

这个助手用于获取包含需要清理的脏 HTML 的惰性 DOM 元素树。根据浏览器支持，我们使用两种策略中的一种来执行此操作。默认值：DOMParser 策略回退：InertDocument 策略

Get an inert DOM element containing DOM created from the dirty HTML string provided.

获取一个惰性 DOM 元素，其中包含从提供的脏 HTML 字符串创建的 DOM。

Uses DOMParser to create and fill an inert body element.
This is the default strategy used in browsers that support it.

使用 DOMParser 创建并填充惰性主体元素。这是支持它的浏览器中使用的默认策略。

Use an HTML5 `template` element to create and fill an inert DOM element.
This is the fallback strategy if the browser does not support DOMParser.

使用 HTML5 `template` 元素创建和填充惰性 DOM 元素。如果浏览器不支持 DOMParser，这是回退策略。

We need to determine whether the DOMParser exists in the global context and
supports parsing HTML; HTML parsing support is not as wide as other formats, see
https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Browser_compatibility.

我们需要判断全局上下文中是否存在 DOMParser，是否支持解析 HTML； HTML 解析支持不如其他格式广泛，请参阅 https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Browser_compatibility。