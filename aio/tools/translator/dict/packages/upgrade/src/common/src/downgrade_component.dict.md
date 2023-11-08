A helper function that allows an Angular component to be used from AngularJS.

允许从 AngularJS 使用 Angular 组件的帮助器函数。

*Part of the [upgrade/static](api?query=upgrade%2Fstatic)
library for hybrid upgrade apps that support AOT compilation*

*支持 AOT 编译的混合升级应用程序的[upgrade/静态](api?query=upgrade%2Fstatic)库的一部分*

This helper function returns a factory function to be used for registering
an AngularJS wrapper directive for "downgrading" an Angular component.

此帮助器函数返回一个工厂函数，用于注册 AngularJS 包装器指令以“降级” Angular 组件。

Examples

例子

Let's assume that you have an Angular component called `ng2Heroes` that needs
to be made available in AngularJS templates.

假设你有一个名为 `ng2Heroes` 的 Angular 组件，需要在 AngularJS 模板中提供。

{&commat;example upgrade/static/ts/full/module.ts region="ng2-heroes"}



We must create an AngularJS [directive](https://docs.angularjs.org/guide/directive)
that will make this Angular component available inside AngularJS templates.
The `downgradeComponent()` function returns a factory function that we
can use to define the AngularJS directive that wraps the "downgraded" component.

我们必须创建一个 AngularJS[指令](https://docs.angularjs.org/guide/directive)，使这个 Angular 组件在 AngularJS 模板中可用。`downgradeComponent()` 函数返回一个工厂函数，我们可以使用它来定义包装“降级”组件的 AngularJS 指令。

{&commat;example upgrade/static/ts/full/module.ts region="ng2-heroes-wrapper"}



For more details and examples on downgrading Angular components to AngularJS components please
visit the [Upgrade guide](guide/upgrade#using-angular-components-from-angularjs-code).

有关将 Angular 组件降级为 AngularJS 组件的更多详细信息和示例，请访问[升级指南](guide/upgrade#using-angular-components-from-angularjs-code)。

contains information about the Component that is being downgraded:

包含有关要降级的组件的信息：

`component: Type<any>`: The type of the Component that will be downgraded

`component: Type<any>`：将被降级的组件的类型

`downgradedModule?: string`: The name of the downgraded module \(if any\) that the component
  "belongs to", as returned by a call to `downgradeModule()`. It is the module, whose
  corresponding Angular module will be bootstrapped, when the component needs to be instantiated.
  <br />
  \(This option is only necessary when using `downgradeModule()` to downgrade more than one
  Angular module.\)

`downgradedModule?: string`：组件“属于”的降级模块（如果有）的名称，由对 `downgradeModule()`
的调用返回。当需要实例化组件时，正是此模块，其对应的 Angular 模块将被引导。<br />（仅在使用
`downgradeModule()` 降级多个 Angular 模块时才需要此选项。）

`propagateDigest?: boolean`: Whether to perform {&commat;link ChangeDetectorRef#detectChanges
    change detection} on the component on every
    [$digest](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest). If set to `false`,
    change detection will still be performed when any of the component's inputs changes.
    \(Default: true\)

`propagateDigest?: boolean` :
  是否在每个[$digest](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest)上对组件执行 {&commat;link
  ChangeDetectorRef#detectChanges 变更检测}。如果设置为 `false`
，当任何组件的输入更改时，仍将执行变更检测。（默认：true）

a factory function that can be used to register the component in an
AngularJS module.

一个工厂函数，可用于在 AngularJS 模块中注册组件。

since v4. This parameter is no longer used

从 v4.不再使用此参数

Synchronous promise-like object to wrap parent injectors,
to preserve the synchronous nature of AngularJS's `$compile`.

用于包装父注入器的同步类 Promise 对象，以保留 AngularJS 的 `$compile` 的同步特性。