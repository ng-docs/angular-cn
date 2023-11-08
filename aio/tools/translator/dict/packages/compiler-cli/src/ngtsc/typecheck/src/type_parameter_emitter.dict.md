See `TypeEmitter` for more information on the emitting process.

有关发出过程的更多信息，请参阅 `TypeEmitter`。

Determines whether the type parameters can be emitted. If this returns true, then a call to
`emit` is known to succeed. Vice versa, if false is returned then `emit` should not be
called, as it would fail.

确定是否可以发出类型参数。如果返回 true，则已知对 `emit` 的调用成功。反之亦然，如果返回 false
，则不应该调用 `emit`，因为它会失败。

Emits the type parameters using the provided emitter function for `Reference`s.

使用为 `Reference` 提供的发射器函数发出类型参数。