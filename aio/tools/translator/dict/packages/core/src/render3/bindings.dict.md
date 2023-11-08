Updates binding and returns the value.

更新绑定并返回值。

Gets the current binding value.

获取当前的绑定值。

current `LView`

当前的 `LView`

The binding in the `LView` to check

要检查的 `LView` 中的绑定

New value to check against `lView[bindingIndex]`

要检查 `lView[bindingIndex]` 的新值

`true` if the bindings has changed. \(Throws if binding has changed during
         `CheckNoChangesMode`\)

如果绑定已更改，则为 `true`。（如果在 `CheckNoChangesMode` 期间绑定已更改，则抛出）

Updates binding if changed, then returns whether it was updated.

如果更改，则更新绑定，然后返回它是否已更新。

This function also checks the `CheckNoChangesMode` and throws if changes are made.
Some changes \(Objects/iterables\) during `CheckNoChangesMode` are exempt to comply with VE
behavior.

此函数还会检查 `CheckNoChangesMode`，如果进行了更改，则抛出。`CheckNoChangesMode`
期间的某些更改（对象/iterables）可豁免以符合 VE 行为。

Updates 2 bindings if changed, then returns whether either was updated.

如果更改，则更新 2 绑定，然后返回两者之一是否已更新。

Updates 3 bindings if changed, then returns whether any was updated.

如果更改，则更新 3 绑定，然后返回是否已更新。

Updates 4 bindings if changed, then returns whether any was updated.

如果更改，则更新 4 个绑定，然后返回是否已更新。