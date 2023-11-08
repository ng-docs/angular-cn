Name of the event

活动名称

The function to be called when event emits

事件发出时要调用的函数

Whether or not to use capture in event listener - this argument is a reminder
    from the Renderer3 infrastructure and should be removed from the instruction arguments

是否在事件侦听器中使用捕获 - 此参数是来自 Renderer3 基础结构的提醒，应从指令参数中删除

Function that returns global target information in case this listener
should be attached to a global object like window, document or body

返回全局目标信息的函数，以防此侦听器应附加到全局对象（如窗口、文档或正文）

Adds an event listener to the current node.

向当前节点添加事件侦听器。

If an output exists on one of the node's directives, it also subscribes to the output
and saves the subscription for later cleanup.

如果节点的指令之一存在输出，它还会订阅输出并保存订阅以供以后清理。

Whether or not to use capture in event listener

是否在事件监听器中使用捕获

Registers a synthetic host listener \(e.g. `(@foo.start)`\) on a component or directive.

在组件或指令上注册合成宿主侦听器（例如 `(@foo.start)` ）。

This instruction is for compatibility purposes and is designed to ensure that a
synthetic host listener \(e.g. `@HostListener('@foo.start')`\) properly gets rendered
in the component's renderer. Normally all host listeners are evaluated with the
parent component's renderer, but, in the case of animation &commat;triggers, they need
to be evaluated with the sub component's renderer \(because that's where the
animation triggers are defined\).

此指令用于兼容性目的，旨在确保合成宿主侦听器（例如 `@HostListener('@foo.start')` ）在组件的渲染器中正确渲染。通常所有宿主侦听器都使用父组件的渲染器进行评估，但是，在动画&commat;triggers 的情况下，它们需要使用子组件的渲染器进行评估（因为这是定义动画触发器的地方）。

Do not use this instruction as a replacement for `listener`. This instruction
only exists to ensure compatibility with the ViewEngine's host binding behavior.

不要将此指令用作 `listener` 的替代品。此指令仅用于确保与 ViewEngine 的宿主绑定行为兼容。

A utility function that checks if a given element has already an event handler registered for an
event with a specified name. The TView.cleanup data structure is used to find out which events
are registered for a given element.

一个实用程序函数，用于检查给定元素是否已经为具有指定名称的事件注册了事件处理程序。TView.cleanup 数据结构用于找出为给定元素注册了哪些事件。

The TNode associated with this listener

与此侦听器关联的 TNode

The LView that contains this listener

包含此侦听器的 LView

The listener function to call

要调用的侦听器函数

Whether or not to prevent default behavior
\(the procedural renderer does this already, so in those cases, we should skip\)

是否阻止默认行为（程序渲染器已经这样做了，所以在那些情况下，我们应该跳过）

Wraps an event listener with a function that marks ancestors dirty and prevents default behavior,
if applicable.

如果适用，使用将祖先标记为脏并防止默认行为的函数包装事件侦听器。