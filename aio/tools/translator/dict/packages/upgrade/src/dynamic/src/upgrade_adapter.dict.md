Mental Model

心理模型

When reasoning about how a hybrid application works it is useful to have a mental model which
describes what is happening and explains what is happening at the lowest level.

在推理混合应用程序的工作方式时，有一个心智模型会很有用，它可以描述正在发生的事情并在最低级别解释正在发生的事情。

There are two independent frameworks running in a single application, each framework treats
the other as a black box.

在单个应用程序中运行有两个独立的框架，每个框架都将另一个框架视为黑盒。

Each DOM element on the page is owned exactly by one framework. Whichever framework
instantiated the element is the owner. Each framework only updates/interacts with its own
DOM elements and ignores others.

页面上的每个 DOM 元素都归一个框架所有。无论哪个框架实例化此元素，都是所有者。每个框架都只更新自己的 DOM 元素/交互，而忽略其他框架。

AngularJS directives always execute inside AngularJS framework codebase regardless of
where they are instantiated.

AngularJS 指令始终在 AngularJS 框架代码库中执行，无论它们是在哪里实例化的。

Angular components always execute inside Angular framework codebase regardless of
where they are instantiated.

Angular 组件始终在 Angular 框架代码库中执行，无论它们在哪里实例化。

An AngularJS component can be upgraded to an Angular component. This creates an
Angular directive, which bootstraps the AngularJS component directive in that location.

AngularJS 组件可以升级为 Angular 组件。这会创建一个 Angular 指令，它会引导该位置的 AngularJS 组件指令。

An Angular component can be downgraded to an AngularJS component directive. This creates
an AngularJS directive, which bootstraps the Angular component in that location.

Angular 组件可以降级为 AngularJS 组件指令。这会创建一个 AngularJS 指令，该指令会引导该位置的 Angular 组件。

Whenever an adapter component is instantiated the host element is owned by the framework
doing the instantiation. The other framework then instantiates and owns the view for that
component. This implies that component bindings will always follow the semantics of the
instantiation framework. The syntax is always that of Angular syntax.

每当实例化适配器组件时，宿主元素都归进行实例化的框架所有。然后，另一个框架会实例化并拥有该组件的视图。这意味着组件绑定将始终遵循实例化框架的语义。语法始终是 Angular 语法。

AngularJS is always bootstrapped first and owns the bottom most view.

AngularJS 始终首先引导并拥有最底部的视图。

The new application is running in Angular zone, and therefore it no longer needs calls to
`$apply()`.

新应用程序在 Angular 区域中运行，因此它不再需要调用 `$apply()`。

Example

范例

Deprecated since v5. Use `upgrade/static` instead, which also supports
[Ahead-of-Time compilation](guide/aot-compiler).

自 v5 后已弃用。使用 `upgrade/static` 代替，它也支持[Ahead-of-Time compilation](guide/aot-compiler)。

Use `UpgradeAdapter` to allow AngularJS and Angular to coexist in a single application.

使用 `UpgradeAdapter` 允许 AngularJS 和 Angular 在单个应用程序中共存。

The `UpgradeAdapter` allows:

`UpgradeAdapter` 允许：

creation of Angular component from AngularJS component directive
\(See [UpgradeAdapter#upgradeNg1Component()]\)

从 AngularJS 组件指令创建 Angular 组件（参见[UpgradeAdapter#upgradeNg1Component\(\)][UpgradeAdapter#upgradeNg1Component()] ）

creation of AngularJS directive from Angular component.
\(See [UpgradeAdapter#downgradeNg2Component()]\)

从 Angular 组件创建 AngularJS 指令。（参见[UpgradeAdapter#downgradeNg2Component\(\)][UpgradeAdapter#downgradeNg2Component()] ）

Bootstrapping of a hybrid Angular application which contains both of the frameworks
coexisting in a single application.

混合 Angular 应用程序的引导，该应用程序包含在单个应用程序中共存的两个框架。

The component is instantiated by being listed in AngularJS template. This means that the
host element is controlled by AngularJS, but the component's view will be controlled by
Angular.

该组件是通过在 AngularJS 模板中列出来实例化的。这意味着宿主元素由 AngularJS 控制，但组件的视图将由 Angular 控制。

Even thought the component is instantiated in AngularJS, it will be using Angular
syntax. This has to be done, this way because we must follow Angular components do not
declare how the attributes should be interpreted.

即使组件是在 AngularJS 中实例化的，它也将使用 Angular 语法。必须这样做，因为我们必须遵循 Angular 组件，而不是声明应该如何解释属性。

`ng-model` is controlled by AngularJS and communicates with the downgraded Angular component
by way of the `ControlValueAccessor` interface from `@angular/forms`. Only components that
implement this interface are eligible.



Supported Features

支持的特性

Bindings:

绑定：

Attribute: `<comp name="World">`

属性：`<comp name="World">`

Interpolation:  `<comp greeting="Hello {{name}}!">`

插值：`<comp greeting="Hello {{name}}!">`

Expression:  `<comp [name]="username">`

表达式：`<comp [name]="username">`

Event:  `<comp (close)="doSomething()">`

事件：`<comp (close)="doSomething()">`

ng-model: `<comp ng-model="name">`



Content projection: yes



Allows Angular Component to be used from AngularJS.

允许从 AngularJS 使用 Angular 组件。

Use `downgradeNg2Component` to create an AngularJS Directive Definition Factory from
Angular Component. The adapter will bootstrap Angular component from within the
AngularJS template.

使用 `downgradeNg2Component` 从 Angular 组件创建 AngularJS 指令定义工厂。适配器将从 AngularJS 模板中引导 Angular 组件。

The component is instantiated by being listed in Angular template. This means that the
host element is controlled by Angular, but the component's view will be controlled by
AngularJS.

该组件是通过在 Angular 模板中列出来实例化的。这意味着宿主元素由 Angular 控制，但组件的视图将由 AngularJS 控制。

Transclusion: yes

透传：是

Only some of the features of
[Directive Definition Object](https://docs.angularjs.org/api/ng/service/$compile) are
supported:

仅支持[指令定义对象](https://docs.angularjs.org/api/ng/service/$compile)的某些特性：

`compile`: not supported because the host element is owned by Angular, which does
not allow modifying DOM structure during compilation.

`compile`：不支持，因为宿主元素归 Angular 所有，它不允许在编译期间修改 DOM 结构。

`controller`: supported. \(NOTE: injection of `$attrs` and `$transclude` is not supported.\)

`controller`：支持。（注意：不支持注入 `$attrs` 和 `$transclude`。）

`controllerAs`: supported.

`controllerAs`：支持。

`bindToController`: supported.

`bindToController`：支持。

`link`: supported. \(NOTE: only pre-link function is supported.\)

`link`：支持。（注意：仅支持预链接功能。）

`name`: supported.

`name`：支持。

`priority`: ignored.

`priority`：忽略。

`replace`: not supported.

`replace`：不支持。

`require`: supported.

`require`：支持。

`restrict`: must be set to 'E'.

`restrict`：必须设置为 'E'。

`scope`: supported.

`scope`：支持。

`template`: supported.

`template`：支持。

`templateUrl`: supported.

`templateUrl`：支持。

`terminal`: ignored.

`terminal`：被忽略。

`transclude`: supported.

`transclude`：支持。

Allows AngularJS Component to be used from Angular.

允许从 Angular 使用 AngularJS 组件。

Use `upgradeNg1Component` to create an Angular component from AngularJS Component
directive. The adapter will bootstrap AngularJS component from within the Angular
template.

使用 `upgradeNg1Component` 从 AngularJS Component 指令创建一个 Angular 组件。适配器将从 Angular 模板中引导 AngularJS 组件。

any AngularJS modules that the upgrade module should depend upon

可选值。默认值为 `undefined`。

an `UpgradeAdapterRef`, which lets you register a `ready()` callback to
run assertions once the Angular components are ready to test through AngularJS.

一个 `UpgradeAdapterRef`，一旦 Angular 组件准备好通过 AngularJS 进行测试，它允许你注册一个 `ready()` 回调来运行断言。

Registers the adapter's AngularJS upgrade module for unit testing in AngularJS.
Use this instead of `angular.mock.module()` to load the upgrade module into
the AngularJS testing injector.

注册适配器的 AngularJS 升级模块以在 AngularJS 中进行单元测试。使用它而不是 `angular.mock.module()` 将升级模块加载到 AngularJS 测试注入器中。

Bootstrap a hybrid AngularJS / Angular application.

引导混合 AngularJS / Angular 应用程序。

This `bootstrap` method is a direct replacement \(takes same arguments\) for AngularJS
[`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) method. Unlike
AngularJS, this bootstrap is asynchronous.

此 `bootstrap` 方法是 AngularJS [`bootstrap`](https://docs.angularjs.org/api/ng/function/angular.bootstrap)方法的直接替换（采用相同的参数）。与 AngularJS 不同，此引导程序是异步的。

Allows AngularJS service to be accessible from Angular.

允许从 Angular 访问 AngularJS 服务。

Allows Angular service to be accessible from AngularJS.

允许从 AngularJS 访问 Angular 服务。

Use `UpgradeAdapterRef` to control a hybrid AngularJS / Angular application.

使用 `UpgradeAdapterRef` 来控制混合 AngularJS / Angular 应用程序。

Register a callback function which is notified upon successful hybrid AngularJS / Angular
application has been bootstrapped.

注册一个回调函数，该函数会在成功的混合 AngularJS/Angular 应用程序被引导时收到通知。

The `ready` callback function is invoked inside the Angular zone, therefore it does not
require a call to `$apply()`.

`ready` 回调函数是在 Angular 区域内调用的，因此它不需要调用 `$apply()`。

Dispose of running hybrid AngularJS / Angular application.

处置正在运行的混合 AngularJS / Angular 应用程序。