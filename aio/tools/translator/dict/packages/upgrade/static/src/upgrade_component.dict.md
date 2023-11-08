A helper class that allows an AngularJS component to be used from Angular.

允许从 Angular 使用 AngularJS 组件的帮助器类。

*Part of the [upgrade/static](api?query=upgrade%2Fstatic)
library for hybrid upgrade apps that support AOT compilation.*

*支持 AOT 编译的混合升级应用程序的[upgrade/静态](api?query=upgrade%2Fstatic)库的一部分。*

This helper class should be used as a base class for creating Angular directives
that wrap AngularJS components that need to be "upgraded".

此帮助器类应该用作创建包装需要“升级”的 AngularJS 组件的 Angular 指令的基类。

Examples

例子

Let's assume that you have an AngularJS component called `ng1Hero` that needs
to be made available in Angular templates.

假设你有一个名为 `ng1Hero` 的 AngularJS 组件，需要在 Angular 模板中使用。

{&commat;example upgrade/static/ts/full/module.ts region="ng1-hero"}



We must create a `Directive` that will make this AngularJS component
available inside Angular templates.

我们必须创建一个 `Directive`，使这个 AngularJS 组件在 Angular 模板中可用。

{&commat;example upgrade/static/ts/full/module.ts region="ng1-hero-wrapper"}



In this example you can see that we must derive from the `UpgradeComponent`
base class but also provide an {&commat;link Directive `@Directive`} decorator. This is
because the AOT compiler requires that this information is statically available at
compile time.

在此示例中，你可以看到我们必须从 `UpgradeComponent` 基类派生，但也提供了一个 {&commat;link Directive `@Directive` } 装饰器。这是因为 AOT 编译器要求此信息在编译时静态可用。

Note that we must do the following:

请注意，我们必须执行以下操作：

specify the directive's selector \(`ng1-hero`\)

指定指令的选择器 \( `ng1-hero` \)

specify all inputs and outputs that the AngularJS component expects

指定 AngularJS 组件期望的所有输入和输出

derive from `UpgradeComponent`

派生自 `UpgradeComponent`

call the base class from the constructor, passing

从构造函数调用基类，传递

the AngularJS name of the component \(`ng1Hero`\)

组件的 AngularJS 名称 \( `ng1Hero` \)

the `ElementRef` and `Injector` for the component wrapper

组件包装器的 `ElementRef` 和 `Injector`

Create a new `UpgradeComponent` instance. You should not normally need to do this.
Instead you should derive a new class from this one and call the super constructor
from the base class.

创建一个新的 `UpgradeComponent`
实例。你通常不需要这样做。相反，你应该从中派生一个新类，并从基类调用超级构造函数。

{&commat;example upgrade/static/ts/full/module.ts region="ng1-hero-wrapper" }



The `name` parameter should be the name of the AngularJS directive.

`name` 参数应该是 AngularJS 指令的名称。

The `elementRef` and `injector` parameters should be acquired from Angular by dependency
injection into the base class constructor.

`elementRef` 和 `injector` 参数应该通过依赖注入到基类构造函数的方式从 Angular 获取。