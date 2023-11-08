Iterator which provides ability to visit all of the `TIcuContainerNode` root `RNode`s.

迭代器，它提供了访问所有 `TIcuContainerNode` 根 `RNode` 的能力。

Ensures that `IcuContainerVisitor`'s implementation is present.

确保存在 `IcuContainerVisitor` 的实现。

This function is invoked when i18n instruction comes across an ICU. The purpose is to allow the
bundler to tree shake ICU logic and only load it if ICU instruction is executed.

当 i18n 指令遇到 ICU 时，会调用此函数。目的是允许打包器对 ICU 逻辑进行树形抖动，并且仅在执行 ICU
指令时才加载它。