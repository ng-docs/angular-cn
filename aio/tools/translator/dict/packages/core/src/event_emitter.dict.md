Extends
[RxJS `Subject`](https://rxjs.dev/api/index/class/Subject)
for Angular by adding the `emit()` method.

通过添加 `emit()` 方法来扩展 [Angular 的 RxJS
`Subject`](https://rxjs.dev/api/index/class/Subject)。

In the following example, a component defines two output properties
that create event emitters. When the title is clicked, the emitter
emits an open or close event to toggle the current visibility state.

在以下示例中，组件定义了两个创建事件发射器的输出属性。单击标题后，发射器将发出打开或关闭事件以切换当前可见性状态。

Access the event object with the `$event` argument passed to the output event
handler:

使用传递给输出事件处理程序的 `$event` 参数访问事件对象：

[Observables in Angular](guide/observables-in-angular)

[Angular 中的可观察对象](guide/observables-in-angular)

Use in components with the `@Output` directive to emit custom events
synchronously or asynchronously, and register handlers for those events
by subscribing to an instance.

用在带有 `@Output`
指令的组件中，以同步或异步方式发出自定义事件，并通过订阅实例来为这些事件注册处理器。

When true, deliver events asynchronously.

当为 true 时，异步传递事件。

Creates an instance of this class that can
deliver events synchronously or asynchronously.

创建此类的实例，该实例可以同步或异步发送事件。

The value to emit.

要发出的值。

Emits an event containing a given value.

发出包含给定值的事件。

When supplied, a custom handler for emitted events.

如果提供，则为所发出事件的自定义处理器。

When supplied, a custom handler for an error notification from this emitter.

提供时，来自此发射器的错误通知的自定义处理程序。

When supplied, a custom handler for a completion notification from this
    emitter.

提供时，此发射器的完成通知的自定义处理程序。

Registers handlers for events emitted by this instance.

注册此实例发出的事件的处理程序。

When supplied, a custom handler for emitted events, or an observer
    object.

提供时，为已发出事件的自定义处理程序或观察者对象。