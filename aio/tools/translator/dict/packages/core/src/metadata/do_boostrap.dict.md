Hook for manual bootstrapping of the application instead of using `bootstrap` array in `@NgModule`
annotation. This hook is invoked only when the `bootstrap` array is empty or not provided.

挂钩应用程序的手动引导，而不使用 `@NgModule` 标记中的 bootstrap 数组。这个钩子只有在 bootstrap
数组为空或未提供时才会被调用。

Reference to the current application is provided as a parameter.



See ["Bootstrapping"](guide/bootstrapping).



The example below uses `ApplicationRef.bootstrap()` to render the
`AppComponent` on the page.

下面的示例使用 `ApplicationRef.bootstrap()` 来在页面上渲染 `AppComponent`。