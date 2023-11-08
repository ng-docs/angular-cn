fix [invalid banana-in-box](https://angular.io/extended-diagnostics/NG8101)

修复[无效的 banana-in-box](https://angular.io/extended-diagnostics/NG8101)

This diagnostic has detected a likely mistake that puts the square brackets inside the
parens \(the BoundEvent `([thing])`\) when it should be the other way around `[(thing)]` so
this function is trying to find the bound event in order to flip the syntax.

此诊断检测到一个可能的错误，该错误将方括号放在括号内（BoundEvent `([thing])`，而它应该是 `[(thing)]` 另一种方式，因此此函数试图找到绑定事件以便翻转语法。

Flip the invalid "box in a banana" `([thing])` to the correct "banana in a box" `[(thing)]`.

将无效的“box in a banana” `([thing])` 翻转为正确的“banana in a box” `[(thing)]`。