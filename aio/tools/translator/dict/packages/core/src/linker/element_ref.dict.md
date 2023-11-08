The ElementRef instance to use

要使用的 ElementRef 实例

Creates an ElementRef from the most recent node.

从最近的节点创建一个 ElementRef。

The node for which you'd like an ElementRef

你想要 ElementRef 的节点

The view to which the node belongs

节点所属的视图

Creates an ElementRef given a node.

在给定节点的情况下创建一个 ElementRef。

A wrapper around a native element inside of a View.

对视图中某个原生元素的包装器。

An `ElementRef` is backed by a render-specific element. In the browser, this is usually a DOM
element.

`ElementRef` 的背后是一个可渲染的具体元素。在浏览器中，它通常是一个 DOM 元素。

value to unwrap

要打开的值

`nativeElement` if `ElementRef` otherwise returns value as is.

`nativeElement` 如果 `ElementRef`，否则按原样返回值。

Unwraps `ElementRef` and return the `nativeElement`.

解开 `ElementRef` 并返回 `nativeElement`。