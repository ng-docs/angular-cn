`DestroyRef` lets you set callbacks to run for any cleanup or destruction behavior.
The scope of this destruction depends on where `DestroyRef` is injected. If `DestroyRef`
is injected in a component or directive, the callbacks run when that component or
directive is destroyed. Otherwise the callbacks run when a corresponding injector is destroyed.

`DestroyRef` 允许你设置回调以针对任何清理或销毁行为运行。这种销毁的范围取决于注入 `DestroyRef` 位置。如果将 `DestroyRef` 注入到组件或指令中，则回调会在该组件或指令被销毁时运行。否则回调会在相应的注入器被销毁时运行。

Example

范例

Registers a destroy callback in a given lifecycle scope.  Returns a cleanup function that can
be invoked to unregister the callback.

在给定的生命周期范围内注册销毁回调。返回一个清理函数，可以调用该函数来注销回调。