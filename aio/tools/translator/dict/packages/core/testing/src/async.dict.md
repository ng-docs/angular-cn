Wraps a test function in an asynchronous test zone. The test will automatically
complete when all asynchronous calls within this zone are done. Can be used
to wrap an {&commat;link inject} call.

把一个测试函数包装进一个异步测试 Zone。当该 Zone 中的所有异步调用都已完成时，该测试将会自动完成。
可用于包装 {&commat;link inject} 调用。

Example:

例子：

use `waitForAsync()`, \(expected removal in v12\)

改用 `waitForAsync()`（将在 v12 中删除）