Fixture for debugging and testing a component.

用于调试和测试组件的夹具。

The DebugElement associated with the root element of this component.

与该组件的根元素关联的 DebugElement。

The instance of the root component class.

根组件类的实例。

The native element at the root of the component.

组件根部的原生元素。

The ElementRef for the element at the root of the component.

位于组件根目录的元素的 ElementRef。

The ChangeDetectorRef for the component

组件的 ChangeDetectorRef

Trigger a change detection cycle for the component.

触发组件的变更检测周期。

Do a change detection run to make sure there were no changes.

进行变更检测以确保没有更改。

Set whether the fixture should autodetect changes.

设置夹具是否应自动检测变化。

Also runs detectChanges once so that any existing change is detected.

还运行一次 detectChanges，以检测出任何现有更改。

Return whether the fixture is currently stable or has async tasks that have not been completed
yet.

返回此夹具当前是否稳定或具有尚未完成的异步任务。

Get a promise that resolves when the fixture is stable.

当夹具稳定时解析的 Promise。

This can be used to resume testing after events have triggered asynchronous activity or
asynchronous change detection.

当事件已触发异步活动或异步变更检测后，可用此方法继续执行测试。

Get a promise that resolves when the ui state is stable following animations.

获得一个 Promise，可以解决以下动画中 ui 状态何时稳定的问题。

Trigger component destruction.

触发组件的销毁。