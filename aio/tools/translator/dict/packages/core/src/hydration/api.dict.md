Indicates whether the hydration-related code was added,
prevents adding it multiple times.

指示是否添加了与水合相关的代码，防止多次添加。

Defines a period of time that Angular waits for the `ApplicationRef.isStable` to emit `true`.
If there was no event with the `true` value during this time, Angular reports a warning.

定义 Angular 等待 `ApplicationRef.isStable` 发出 `true` 时间段。如果在这段时间内没有任何具有 `true` 值的事件，Angular 会报告一个警告。

Brings the necessary hydration code in tree-shakable manner.
The code is only present when the `provideClientHydration` is
invoked. Otherwise, this code is tree-shaken away during the
build optimization step.

以 tree-shakable 的方式带来必要的水合代码。该代码仅在调用 `provideClientHydration` 时出现。否则，这段代码会在构建优化步骤中被摇树掉。

This technique allows us to swap implementations of methods so
tree shaking works appropriately when hydration is disabled or
enabled. It brings in the appropriate version of the method that
supports hydration only when enabled.

这种技术允许我们交换方法的实现，以便在禁用或启用水合时 tree shaking 适当地工作。它引入了仅在启用时才支持水合的方法的适当版本。

Detects whether the code is invoked in a browser.
Later on, this check should be replaced with a tree-shakable
flag \(e.g. `!isServer`\).

检测代码是否在浏览器中被调用。稍后，此检查应替换为 tree-shakable 标志（例如 `!isServer` ）。

Outputs a message with hydration stats into a console.

将包含水合统计信息的消息输出到控制台。

Returns a Promise that is resolved when an application becomes stable.

返回一个在应用程序变得稳定时解决的承诺。

Returns a set of providers required to setup hydration support
for an application that is server side rendered. This function is
included into the `provideClientHydration` public API function from
the `platform-browser` package.

返回为服务端渲染的应用程序设置水合支持所需的一组提供程序。该函数包含在 `platform-browser` 包中的 `provideClientHydration` 公共 API 函数中。

The function sets up an internal flag that would be recognized during
the server side rendering time as well, so there is no need to
configure or change anything in NgUniversal to enable the feature.

该函数设置了一个内部标志，该标志也会在服务端渲染期间被识别，因此无需在 NgUniversal 中配置或更改任何内容即可启用该功能。

The time in ms until the stable timedout warning message is logged

记录稳定超时警告消息之前的时间（以毫秒为单位）