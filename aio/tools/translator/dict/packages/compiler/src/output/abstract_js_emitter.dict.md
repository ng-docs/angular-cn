In TypeScript, tagged template functions expect a "template object", which is an array of
"cooked" strings plus a `raw` property that contains an array of "raw" strings. This is
typically constructed with a function called `__makeTemplateObject(cooked, raw)`, but it may not
be available in all environments.

在 TypeScript
中，标记的模板函数需要一个“模板对象”，它是一个“cooked”字符串数组加上一个包含“原始”字符串数组的
`raw` 属性。这通常是使用名为 `__makeTemplateObject(cooked, raw)`
的函数构造的，但它可能并非在所有环境中都可用。

This is a JavaScript polyfill that uses `__makeTemplateObject` when it's available, but otherwise
creates an inline helper with the same functionality.

这是一个 JavaScript polyfill，它在可用时使用 `__makeTemplateObject`
，但否则会创建一个具有相同特性的内联帮助器。

In the inline function, if `Object.defineProperty` is available we use that to attach the `raw`
array.

在内联函数中，如果 `Object.defineProperty` 可用，我们用它来附加 `raw` 数组。