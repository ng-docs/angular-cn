Object used to configure the behavior of {&commat;link BrowserAnimationsModule}

用于配置 {&commat;link BrowserAnimationsModule} 行为的对象

Whether animations should be disabled. Passing this is identical to providing the
`NoopAnimationsModule`, but it can be controlled based on a runtime value.

是否应禁用动画。传递它与提供 `NoopAnimationsModule` 相同，但它可以根据运行时值进行控制。

Exports `BrowserModule` with additional [dependency-injection providers](guide/glossary#provider)
for use with animations. See [Animations](guide/animations).

导出带有附加[依赖项注入提供者](guide/glossary#provider) 的 `BrowserModule`
以便与动画一起使用。请参阅[动画](guide/animations)。

Object used to configure the behavior of the `BrowserAnimationsModule`.

用于配置 `BrowserAnimationsModule` 行为的对象。

When registering the `BrowserAnimationsModule`, you can use the `withConfig`
function as follows:

注册 `BrowserAnimationsModule` 时，你可以用 `withConfig` 函数，如下所示：

Configures the module based on the specified object.

根据指定的对象配置模块。

The function is useful when you want to enable animations in an application
bootstrapped using the `bootstrapApplication` function. In this scenario there
is no need to import the `BrowserAnimationsModule` NgModule at all, just add
providers returned by this function to the `providers` list as show below.

当你想要在使用 `bootstrapApplication` 函数引导的应用程序中启用动画时，该函数很有用。在这种情况下，根本不需要导入 `BrowserAnimationsModule` NgModule，只需将此函数返回的提供者添加到 `providers` 列表中，如下所示。

Returns the set of [dependency-injection providers](guide/glossary#provider)
to enable animations in an application. See [animations guide](guide/animations)
to learn more about animations in Angular.

返回一组[依赖注入提供程序](guide/glossary#provider)以在应用程序中启用动画。请参阅[动画指南](guide/animations)以了解有关 Angular 中动画的更多信息。

A null player that must be imported to allow disabling of animations.

必须导入一个空播放器以支持禁用动画。

The function is useful when you want to bootstrap an application using
the `bootstrapApplication` function, but you need to disable animations
\(for example, when running tests\).

当你想使用 `bootstrapApplication` 函数引导应用程序时，该函数很有用，但你需要禁用动画（例如，在运行测试时）。

Returns the set of [dependency-injection providers](guide/glossary#provider)
to disable animations in an application. See [animations guide](guide/animations)
to learn more about animations in Angular.

返回一组[依赖注入提供程序](guide/glossary#provider)以禁用应用程序中的动画。请参阅[动画指南](guide/animations)以了解有关 Angular 中动画的更多信息。