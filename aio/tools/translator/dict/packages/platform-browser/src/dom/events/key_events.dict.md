Defines supported modifiers for key events.

为键事件定义支持的修饰符。

Retrieves modifiers from key-event objects.

从键事件对象中检索修饰符。

A browser plug-in that provides support for handling of key events in Angular.

一个浏览器插件，用来为 Angular 中的键盘事件处理提供支持。

The document in which key events will be detected.

要检测键盘事件的 document。

Initializes an instance of the browser plug-in.

初始化浏览器插件的实例。

The event name to query.

要查询的事件名称。

True if the named key event is supported.

如果支持这个名字的键盘事件，则为 True。

Reports whether a named key event is supported.

报告是否支持指定名字的键盘事件。

The HTML element to receive event notifications.

要接收事件通知的 HTML 元素。

The name of the key event to listen for.

要监听的键盘事件的名称。

A function to call when the notification occurs. Receives the
event object as an argument.

当事件发生时要调用的函数。接收一个事件对象作为参数。

The key event that was registered.

已注册的键盘事件。

Registers a handler for a specific element and key event.

注册特定元素和键盘事件的处理器。

an object with the full, normalized string, and the dom event name
or null in the case when the event doesn't match a keyboard event.

具有完整规范化字符串和 dom 事件名称的对象，或者在事件与键盘事件不匹配的情况下为 null。

Parses the user provided full keyboard event definition and normalizes it for
later internal use. It ensures the string is all lowercase, converts special
characters to a standard spelling, and orders all the values consistently.

解析用户提供的完整键盘事件定义并将其规范化以供以后内部使用。它确保字符串全部为小写，将特殊字符转换为标准拼写，并对所有值进行一致排序。

The keyboard event.

键盘事件。

The normalized user defined expected key event string

规范化的用户定义的预期键事件字符串

boolean.



Determines whether the actual keys pressed match the configured key code string.
The `fullKeyCode` event is normalized in the `parseEventName` method when the
event is attached to the DOM during the `addEventListener` call. This is unseen
by the end user and is normalized for internal consistency and parsing.

确定实际按下的键是否与配置的键代码字符串匹配。当在 `addEventListener` 调用期间将事件附加到 DOM 时，`fullKeyCode` 事件在 `parseEventName` 方法中被规范化。这是最终用户看不到的，并且针对内部一致性和解析进行了规范化。

The event name that combines all simultaneous keystrokes.

组合了所有同时按下的键盘事件的名称。

The function that responds to the key event.

响应键盘事件的函数。

The zone in which the event occurred.

事件发生时所在的 Zone。

A callback function.

回调函数。

Configures a handler callback for a key event.

为键盘事件配置处理器回调。