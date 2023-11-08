Performs the given action once the router finishes its next/current navigation.

一旦路由器完成其下一个/当前导航，就执行给定的操作。

The navigation is considered complete under the following conditions:

在下列条件下，导航被认为是完成的：

`NavigationCancel` event emits and the code is not `NavigationCancellationCode.Redirect` or
`NavigationCancellationCode.SupersededByNewNavigation`. In these cases, the
redirecting/superseding navigation must finish.

`NavigationCancel` 事件发出并且代码不是 `NavigationCancellationCode.Redirect` 或 `NavigationCancellationCode.SupersededByNewNavigation`。在这些情况下，重定向/取代导航必须完成。

`NavigationError`, `NavigationEnd`, or `NavigationSkipped` event emits

`NavigationError` 、 `NavigationEnd` 或 `NavigationSkipped` 事件发出