Defines a scroll position manager. Implemented by `BrowserViewportScroller`.

定义滚动位置管理器。由 `BrowserViewportScroller` 实现。

A position in screen coordinates \(a tuple with x and y values\)
or a function that returns the top offset position.

屏幕坐标中的位置（具有 x 和 y 值的元组）或返回顶部偏移位置的函数。

Configures the top offset used when scrolling to an anchor.

配置滚动到锚点时使用的顶部偏移量。

A position in screen coordinates \(a tuple with x and y values\).

屏幕坐标中的位置（具有 x 和 y 值的元组）。

Retrieves the current scroll position.

检索当前的滚动位置。

Scrolls to a specified position.

滚动到指定位置。

The ID of the anchor element.

锚点元素的 ID。

Scrolls to an anchor element.

滚动到锚点元素。

Disables automatic scroll restoration provided by the browser.
See also [window.history.scrollRestoration
info](https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration).

禁用浏览器提供的自动滚动恢复功能。另请参见 [window.history.scrollRestoration
信息](https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration)。

Manages the scroll position for a browser window.

管理浏览器窗口的滚动位置。

The position in screen coordinates.

屏幕坐标中的位置。

The new position in screen coordinates.

屏幕坐标中的新位置。

Sets the scroll position.

设置滚动位置。

The ID of an element or name of the anchor.

元素的 ID 或锚点的名称。

https://html.spec.whatwg.org/#the-indicated-part-of-the-document



https://html.spec.whatwg.org/#scroll-to-fragid



Scrolls to an element and attempts to focus the element.

滚动到一个元素并尝试聚焦该元素。

Note that the function name here is misleading in that the target string may be an ID for a
non-anchor element.

请注意，这里的函数名具有误导性，因为目标字符串可能是非锚元素的 ID。

Disables automatic scroll restoration provided by the browser.

禁用浏览器提供的自动滚动恢复。

Provides an empty implementation of the viewport scroller.

提供视口滚动器的空实现。

Empty implementation

空实现