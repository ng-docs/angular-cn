a function which is responsible for returning a `Promise` to the
contents of the resolved URL. Browser's `fetch()` method is a good default implementation.

一个函数，负责将 `Promise` 返回到已解析的 URL 的内容。浏览器的 `fetch()`
方法是一个很好的默认实现。

Used to resolve resource URLs on `@Component` when used with JIT compilation.

与 JIT 编译一起使用时，用于解析 `@Component` 上的资源 URL。

Example:

示例：

NOTE: In AOT the resolution happens during compilation, and so there should be no need
to call this method outside JIT mode.

注意：在 AOT 中，解析发生在编译期间，因此应该没有必要在 JIT 模式之外调用此方法。