Service worker notifications

Service Worker 通知

Push notifications are a compelling way to engage users.
Through the power of service workers, notifications can be delivered to a device even when your application is not in focus.

推送通知是吸引用户的一种引人注目的方式。通过 Service Worker 的强大功能，即使你的应用程序不在焦点上，也可以将通知发送到设备。

The Angular service worker enables the display of push notifications and the handling of notification click events.

Angular Service Worker 支持显示推送通知和处理通知点击事件。

Prerequisites

前提条件

We recommend you have a basic understanding of the following:

我们建议你对以下内容有基本的了解：

[Getting Started with Service Workers](guide/service-worker-getting-started)

[Service Worker 快速上手](guide/service-worker-getting-started)。

Notification payload

通知负载

Invoke push notifications by pushing a message with a valid payload.
See `SwPush` for guidance.

通过推送具有有效负载的消息来调用推送通知。请参阅 `SwPush` 以获得指导。

Notification click handling

通知点击处理

The default behavior for the `notificationclick` event is to close the notification and notify `SwPush.notificationClicks`.

`notificationclick` 点击事件的默认行为是关闭通知并通知 `SwPush.notificationClicks`。

You can specify an additional operation to be executed on `notificationclick` by adding an `onActionClick` property to the `data` object, and providing a `default` entry.
This is especially useful for when there are no open clients when a notification is clicked.

你可以通过向 `data` 对象添加 `onActionClick` 属性并提供 `default` 条目来指定要在 `notificationclick` 上执行的附加操作。当单击通知时没有打开的客户端时，这尤其有用。

Operations

操作

The Angular service worker supports the following operations:

Angular Service Worker 支持以下操作：

Send a simple GET request to the specified URL.

向指定的 URL 发送简单的 GET 请求。

Focuses the last focused client and navigates it to the specified URL. If there is no client open, then it opens a new tab at the specified URL.

聚焦最后一个有焦点的客户端并将其导航到指定的 URL。如果没有打开客户端，则会在指定的 URL 处打开一个新选项卡。

Focuses the last focused client. If there is no client open, then it opens a new tab at the specified URL.

聚焦最后一个有焦点的客户端。如果没有打开客户端，则会在指定的 URL 处打开一个新选项卡。

Opens a new tab at the specified URL.

在指定的 URL 处打开新选项卡。

Details

详情

Actions

行动

Actions offer a way to customize how the user can interact with a notification.

操作提供了一种自定义用户如何与通知交互的方法。

Using the `actions` property, you can define a set of available actions.
Each action is represented as an action button that the user can click to interact with the notification.

使用 `actions` 属性，你可以定义一组可用的操作。每个动作都表示为一个动作按钮，用户可以单击该按钮与通知进行交互。

In addition, using the `onActionClick` property on the `data` object, you can tie each action to an operation to be performed when the corresponding action button is clicked:

此外，使用 `data` 对象上的 `onActionClick` 属性，你可以将每个操作与单击相应操作按钮时要执行的操作联系起来：

More on Angular service workers

关于 Angular Service Worker 的更多信息

You might also be interested in the following:

你可能还对下列内容感兴趣：

[Service Worker in Production](guide/service-worker-devops)

[生产环境下的 Service Worker](guide/service-worker-devops)。