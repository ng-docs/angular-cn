You can inject a `SwPush` instance into any component or service
as a dependency.

你可以将 `SwPush` 实例作为依赖项注入任何组件或服务。

To subscribe, call `SwPush.requestSubscription()`, which asks the user for permission.
The call returns a `Promise` with a new
[`PushSubscription`](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
instance.

要订阅，请调用 `SwPush.requestSubscription()`
，它会请求用户许可。该调用会返回带有新的[`PushSubscription`](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)实例的
`Promise`。

A request is rejected if the user denies permission, or if the browser
blocks or does not support the Push API or ServiceWorkers.
Check `SwPush.isEnabled` to confirm status.

如果用户拒绝权限，或者浏览器阻止或不支持 Push API 或 ServiceWorkers，则请求将被拒绝。检查
`SwPush.isEnabled` 以确认状态。

Invoke Push Notifications by pushing a message with the following payload.

通过推送具有以下有效负载的消息来调用 Push Notifications。

Only `title` is required. See `Notification`
[instance
properties](https://developer.mozilla.org/en-US/docs/Web/API/Notification#Instance_properties).

只需要 `title`。请参阅
`Notification`[实例属性](https://developer.mozilla.org/en-US/docs/Web/API/Notification#Instance_properties)。

While the subscription is active, Service Worker listens for
[PushEvent](https://developer.mozilla.org/en-US/docs/Web/API/PushEvent)
occurrences and creates
[Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
instances in response.

在订阅处于活动状态时，Service Worker
会侦听[PushEvent](https://developer.mozilla.org/en-US/docs/Web/API/PushEvent)的发生并创建[Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification)实例作为响应。

Unsubscribe using `SwPush.unsubscribe()`.

使用 `SwPush.unsubscribe()` 取消订阅。

An application can subscribe to `SwPush.notificationClicks` observable to be notified when a user
clicks on a notification. For example:

应用程序可以订阅 `SwPush.notificationClicks` observable，以在用户点击通知时得到通知。例如：

You can read more on handling notification clicks in the [Service worker notifications
guide](guide/service-worker-notifications).

你可以在[Service Worker
通知指南](guide/service-worker-notifications)中读更多关于处理通知点击的内容。

[Push Notifications](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)

[推送通知](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)

[Angular Push Notifications](https://blog.angular-university.io/angular-push-notifications/)

[ Angular 推送通知](https://blog.angular-university.io/angular-push-notifications/)

[MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

[MDN：推送 API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

[MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

[MDN：通知 API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

[MDN: Web Push API Notifications best practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)

[MDN：Web 推送 API
通知最佳实践](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)

Subscribe and listen to
[Web Push
Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices) through
Angular Service Worker.

通过 Angular Service Worker 订阅和侦听[Web
推送通知](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)。

Emits the payloads of the received push notification messages.

发出已接收到的推送通知消息的有效负载。

Emits the payloads of the received push notification messages as well as the action the user
interacted with. If no action was used the `action` property contains an empty string `''`.

发出已接收到的推送通知消息的有效负载以及用户交互的操作。如果未使用任何操作，则 `action`
属性包含空字符串 `''`。

Note that the `notification` property does **not** contain a
[Notification][Mozilla Notification] object but rather a
[NotificationOptions](https://notifications.spec.whatwg.org/#dictdef-notificationoptions)
object that also includes the `title` of the [Notification][Mozilla Notification] object.

请注意，`notification` 属性**不**包含[Notification][Mozilla
Notification]对象，而是包含一个[NotificationOptions](https://notifications.spec.whatwg.org/#dictdef-notificationoptions)对象，该对象还包含[Notification][Mozilla
Notification]对象的 `title`。

Emits the currently active
[PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
associated to the Service Worker registration or `null` if there is no subscription.

发出与 Service Worker
注册关联的当前活动的[PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
，如果没有订阅，则发出 `null`。

True if the Service Worker is enabled \(supported by the browser and enabled via
`ServiceWorkerModule`\).

如果启用了 Service Worker（受浏览器支持并通过 `ServiceWorkerModule` 启用），则为真。

An object containing the `serverPublicKey` string.

包含 `serverPublicKey` 字符串的对象。

A Promise that resolves to the new subscription object.

解析为新订阅对象的 Promise。

Subscribes to Web Push Notifications,
after requesting and receiving user permission.

在请求并接收到用户权限后订阅 Web 推送通知。

A Promise that is resolved when the operation succeeds, or is rejected if there is no
         active subscription or the unsubscribe operation fails.

操作成功时解析的 Promise，如果没有活动订阅或取消订阅操作失败，则被拒绝。

Unsubscribes from Service Worker push notifications.

取消订阅 Service Worker 推送通知。