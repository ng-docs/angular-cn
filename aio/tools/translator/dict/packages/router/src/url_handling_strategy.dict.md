Provides a way to migrate AngularJS applications to Angular.

提供一种将 AngularJS 应用程序迁移到 Angular 的方法。

Tells the router if this URL should be processed.

告诉路由器是否应处理此 URL。

When it returns true, the router will execute the regular navigation.
When it returns false, the router will set the router state to an empty state.
As a result, all the active components will be destroyed.

当返回 true 时，路由器将执行常规导航。当返回 false 时，路由器会将路由器状态设置为空状态。结果，所有活动组件都将被破坏。

Extracts the part of the URL that should be handled by the router.
The rest of the URL will remain untouched.

提取应由路由器处理的 URL 部分。URL 的其余部分将保持不变。

Merges the URL fragment with the rest of the URL.

将 URL 片段与 URL 的其余部分合并。