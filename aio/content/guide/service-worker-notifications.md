# Service worker notifications

# Service Worker 通知

Push notifications are a compelling way to engage users.
Through the power of service workers, notifications can be delivered to a device even when your application is not in focus.

推送通知是吸引用户的一种引人注目的方式。通过 Service Worker 的强大功能，即使你的应用程序不在焦点上，也可以将通知发送到设备。

The Angular service worker enables the display of push notifications and the handling of notification click events.

Angular Service Worker 支持显示推送通知和处理通知点击事件。

<div class="alert is-helpful">

When using the Angular service worker, push notification interactions are handled using the `SwPush` service.
To learn more about the browser APIs involved see [Push API](https://developer.mozilla.org/docs/Web/API/Push_API) and [Using the Notifications API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API).

使用 Angular Service Worker 时，推送通知交互是使用 `SwPush` 服务处理的。要了解有关所涉及的浏览器 API 的更多信息，请参阅[推送 API](https://developer.mozilla.org/docs/Web/API/Push_API)和[使用通知 API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API)。

</div>

## Prerequisites

## 前提条件

We recommend you have a basic understanding of the following:

我们建议你对以下内容有基本的了解：

* [Getting Started with Service Workers](guide/service-worker-getting-started)

  [Service Worker 快速上手](guide/service-worker-getting-started)。

## Notification payload

## 通知负载

Invoke push notifications by pushing a message with a valid payload.
See `SwPush` for guidance.

通过推送具有有效负载的消息来调用推送通知。请参阅 `SwPush` 以获得指导。

<div class="alert is-helpful">

In Chrome, you can test push notifications without a backend.
Open Devtools -> Application -> Service Workers and use the `Push` input to send a JSON notification payload.

在 Chrome 中，你可以在没有后端的情况下测试推送通知。打开 Devtools -> Application -> Service Workers 并使用 `Push` 输入发送 JSON 通知负载。

</div>

## Notification click handling

## 通知点击处理

The default behavior for the `notificationclick` event is to close the notification and notify `SwPush.notificationClicks`.

`notificationclick` 点击事件的默认行为是关闭通知并通知 `SwPush.notificationClicks`。

You can specify an additional operation to be executed on `notificationclick` by adding an `onActionClick` property to the `data` object, and providing a `default` entry.
This is especially useful for when there are no open clients when a notification is clicked.

你可以通过向 `data` 对象添加 `onActionClick` 属性并提供 `default` 条目来指定要在 `notificationclick` 上执行的附加操作。当单击通知时没有打开的客户端时，这尤其有用。

<code-example format="json" language="json">

{
  "notification": {
    "title": "New Notification!",
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow", "url": "foo"}
      }
    }
  }
}

</code-example>

### Operations

### 操作

The Angular service worker supports the following operations:

Angular Service Worker 支持以下操作：

| Operations | Details |
| :--------- | :------ |
| 操作 | 详情 |
| `openWindow` | Opens a new tab at the specified URL. |
| `focusLastFocusedOrOpen` | Focuses the last focused client. If there is no client open, then it opens a new tab at the specified URL. |
| `navigateLastFocusedOrOpen` | Focuses the last focused client and navigates it to the specified URL. If there is no client open, then it opens a new tab at the specified URL. |
| `sendRequest` | Send a simple GET request to the specified URL. |

<div class="alert is-important">

URLs are resolved relative to the service worker's registration scope.<br />
If an `onActionClick` item does not define a `url`, then the service worker's registration scope is used.

如果 `onActionClick` 项未定义 `url`，则使用 Service Worker 的注册范围。
</div>

### Actions

### 行动

Actions offer a way to customize how the user can interact with a notification.

操作提供了一种自定义用户如何与通知交互的方法。

Using the `actions` property, you can define a set of available actions.
Each action is represented as an action button that the user can click to interact with the notification.

使用 `actions` 属性，你可以定义一组可用的操作。每个动作都表示为一个动作按钮，用户可以单击该按钮与通知进行交互。

In addition, using the `onActionClick` property on the `data` object, you can tie each action to an operation to be performed when the corresponding action button is clicked:

此外，使用 `data` 对象上的 `onActionClick` 属性，你可以将每个操作与单击相应操作按钮时要执行的操作联系起来：

<code-example format="typescript" language="typescript">

{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Send request in the background"}
      {"action": "other", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
        "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
      }
    }
  }
}

</code-example>

<div class="alert is-important">

If an action does not have a corresponding `onActionClick` entry, then the notification is closed and `SwPush.notificationClicks` is notified on existing clients.

如果操作没有相应的 `onActionClick` 条目，则通知将关闭并在现有客户端上通知 `SwPush.notificationClicks`。

</div>

## More on Angular service workers

## 关于 Angular Service Worker 的更多信息

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Service Worker in Production](guide/service-worker-devops)

  [生产环境下的 Service Worker](guide/service-worker-devops)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28