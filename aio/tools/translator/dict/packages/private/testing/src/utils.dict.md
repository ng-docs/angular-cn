HTML which should be inserted into the `body` of the `document`.

应插入到 `document` `body` 中的 HTML。

function to wrap. The function can return promise or be `async`.

包装功能。该函数可以返回 promise 或 `async`。

Wraps a function in a new function which sets up document and HTML for running a test.

将一个函数包装在一个新函数中，该函数设置文档和 HTML 以运行测试。

This function wraps an existing testing function. The wrapper adds HTML to the `body` element of
the `document` and subsequently tears it down.

这个函数包装了一个现有的测试函数。包装器将 HTML 添加到 `document` 的 `body` 元素，然后将其拆解。

This function can be used with `async await` and `Promise`s. If the wrapped function returns a
promise \(or is `async`\) then the teardown is delayed until that `Promise` is resolved.

此函数可以与 `async await` 和 `Promise` 一起使用。如果包装的函数返回一个 promise（或者是 `async` ），那么拆解将被延迟，直到该 `Promise` 被解决。

In the NodeJS environment this function detects if `document` is present and if not, it creates
one by loading `domino` and installing it.

在 NodeJS 环境中，此函数检测 `document` 是否存在，如果不存在，则通过加载并安装 `domino` 创建一个文档。

Example:

范例：

HTML which should be inserted into the `head` of the `document`.

应该插入 `document` `head` 的 HTML。

This function wraps an existing testing function. The wrapper adds HTML to the `head` element of
the `document` and subsequently tears it down.

这个函数包装了一个现有的测试函数。包装器将 HTML 添加到 `document` 的 `head` 元素，然后将其拆解。

Wraps provided function \(which typically contains the code of a test\) into a new function that
performs the necessary setup of the environment.

将提供的函数（通常包含测试代码）包装到执行必要的环境设置的新函数中。

Runs jasmine expectations against the provided keys for `ngDevMode`.

针对 `ngDevMode` 提供的键运行 jasmine 期望。

Will not perform expectations for keys that are not provided.

不会对未提供的密钥执行期望。

Ensure that global has `Document` if we are in node.js

如果我们在 node.js 中，确保全局有 `Document`

Restore the state of `Document` between tests.

在测试之间恢复 `Document` 的状态。