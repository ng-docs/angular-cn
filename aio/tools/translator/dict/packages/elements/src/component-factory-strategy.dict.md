Time in milliseconds to wait before destroying the component ref when disconnected.

断开连接时销毁组件 ref 之前等待的时间（以毫秒为单位）。

Factory that creates new ComponentNgElementStrategy instance. Gets the component factory with the
constructor's injector's factory resolver and passes that factory to each strategy.

创建新的 ComponentNgElementStrategy 实例的工厂。使用构造函数的注入器的工厂解析器获取组件工厂，并将该工厂传递给每个策略。

Creates and destroys a component ref using a component factory and handles change detection
in response to input changes.

使用组件工厂创建和销毁组件引用，并处理变更检测以响应输入更改。

Merged stream of the component's output events.

组件输出事件的合并流。

Initializes a new component if one has not yet been created and cancels any scheduled
destruction.

如果尚未创建一个新组件，则初始化一个新组件，并取消任何计划的销毁。

Schedules the component to be destroyed after some small delay in case the element is just
being moved across the DOM.

安排组件在一些小的延迟后销毁，以防元素刚刚在 DOM 中移动。

Returns the component property value. If the component has not yet been created, the value is
retrieved from the cached initialization values.

返回组件属性值。如果尚未创建组件，则从缓存的初始化值中检索该值。

Sets the input value for the property. If the component has not yet been created, the value is
cached and set when the component is created.

设置属性的输入值。如果尚未创建组件，则在创建组件时缓存并设置该值。

Creates a new component through the component factory with the provided element host and
sets up its initial inputs, listens for outputs changes, and runs an initial change detection.

使用提供的元素宿主通过组件工厂创建一个新组件，并设置其初始输入，侦听输出更改，并运行初始变更检测。

Set any stored initial inputs on the component's properties.

在组件的属性上设置任何存储的初始输入。

Sets up listeners for the component's outputs so that the events stream emits the events.

为组件的输出设置侦听器，以便事件流发出事件。

Calls ngOnChanges with all the inputs that have changed since the last call.

使用自上次调用以来已更改的所有输入调用 ngOnChanges。

Marks the component view for check, if necessary.
\(NOTE: This is required when the `ChangeDetectionStrategy` is set to `OnPush`.\)

如有必要，标记要检查的组件视图。（注意：当 `ChangeDetectionStrategy` 设置为 `OnPush` 时，这是必需的。）

Schedules change detection to run on the component.
Ignores subsequent calls if already scheduled.

安排变更检测在组件上运行。如果已经安排，则忽略后续呼叫。

Records input changes so that the component receives SimpleChanges in its onChanges function.

记录输入更改，以便组件在其 onChanges 函数中接收 SimpleChanges。

Runs change detection on the component.

在组件上运行变更检测。