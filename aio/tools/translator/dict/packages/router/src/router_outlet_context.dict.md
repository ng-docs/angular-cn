Store contextual information about a `RouterOutlet`

存储关于 `RouterOutlet` 的上下文信息

Store contextual information about the children \(= nested\) `RouterOutlet`

存储关于子级（=嵌套）`RouterOutlet` 的上下文信息。

Called when a `RouterOutlet` directive is instantiated

实例化 `RouterOutlet` 指令时调用。

Called when a `RouterOutlet` directive is destroyed.
We need to keep the context as the outlet could be destroyed inside a NgIf and might be
re-created later.

`RouterOutlet` 指令被销毁时调用。我们需要保留上下文，因为此出口可能在 NgIf 内部被销毁，并可能在以后重新创建。

Called when the corresponding route is deactivated during navigation.
Because the component get destroyed, all children outlet are destroyed.

在导航期间停用相应的路由时调用。由于组件被销毁，所有子出口也都被销毁了。