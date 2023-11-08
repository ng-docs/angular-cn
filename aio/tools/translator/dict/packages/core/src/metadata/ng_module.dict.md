Type of the NgModule decorator / constructor function.

NgModule 装饰器/构造函数的类型。

Decorator that marks a class as an NgModule and supplies configuration metadata.

把一个类标记为 NgModule，并提供配置元数据。

Type of the NgModule metadata.

NgModule 元数据的类型。

[Dependency Injection guide](guide/dependency-injection)

[“依赖注入指南”](guide/dependency-injection)。

[NgModule guide](guide/providers)

[NgModule 指南](guide/providers)

Dependencies whose providers are listed here become available for injection
into any component, directive, pipe or service that is a child of this injector.
The NgModule used for bootstrapping uses the root injector, and can provide dependencies
to any part of the app.

惰性加载的模块有自己的注入器，通常它是根注入器的一个子注入器。惰性加载的服务，其作用范围局限于这个惰性加载模块的注入器。如果惰性加载模块也提供了 `UserService`，则任何在该模块的上下文中创建的组件（比如通过路由导航）都会获得该服务的一个局部实例，而不是根注入器中的全局实例。而外部模块中的组件仍然会使用由它们的注入器提供的实例。

A lazy-loaded module has its own injector, typically a child of the app root injector.
Lazy-loaded services are scoped to the lazy-loaded module's injector.
If a lazy-loaded module also provides the `UserService`, any component created
within that module's context \(such as by router navigation\) gets the local instance
of the service, not the instance in the root injector.
Components in external modules continue to receive the instance provided by their injectors.

惰性加载的模块有自己的注入器，通常它是根注入器的一个子注入器。惰性加载的服务，其作用范围局限于这个惰性加载模块的注入器。如果惰性加载模块也提供了 `UserService`，则任何在该模块的上下文中创建的组件（比如通过路由导航）都会获得该服务的一个局部实例，而不是根注入器中的全局实例。而外部模块中的组件仍然会使用由它们的注入器提供的实例。

Example

范例

The following example defines a class that is injected in
the HelloWorld NgModule:

下面的例子定义了一个类，它被注册在 HelloWorld 这个 NgModule 的注入器下：

The set of injectable objects that are available in the injector
of this module.

在当前模块的注入器中可用的一组可注入对象。

The set of selectors that are available to a template include those declared here, and
those that are exported from imported NgModules.

可声明对象必须属于也只能属于一个模块。如果你尝试把同一个类声明在多个模块中，那么编译器就会报错。要注意不能声明那些从其它模块中导入的类。

Declarables must belong to exactly one module.
The compiler emits an error if you try to declare the same class in more than one module.
Be careful not to declare a class that is imported from another module.

可声明对象必须属于也只能属于一个模块。如果你尝试把同一个类声明在多个模块中，那么编译器就会报错。要注意不能声明那些从其它模块中导入的类。

The following example allows the CommonModule to use the `NgFor`
directive.

下面的例子允许 CommonModule 使用 `NgFor` 指令。

The set of components, directives, and pipes \([declarables](guide/glossary#declarable)\)
that belong to this module.

属于该模块的一组组件、指令和管道（统称[可声明对象](guide/glossary#declarable)）。

A template can use exported declarables from any
imported module, including those from modules that are imported indirectly
and re-exported.
For example, `ModuleA` imports `ModuleB`, and also exports
it, which makes the declarables from `ModuleB` available
wherever `ModuleA` is imported.

模板可以使用来自任何导入模块中所导出的可声明对象，包括它们从别的模块导入后重新导出的。比如，`ModuleA` 导入了 `ModuleB` 并导出了它，就会让 `ModuleB` 中的可声明对象也同样在那些导入了 `ModuleA` 的模块中可用。

The following example allows MainModule to use anything exported by
`CommonModule`:

下列例子允许 `MainModule` 使用 `CommonModule` 中导入的任意可声明对象：

The set of NgModules whose exported [declarables](guide/glossary#declarable)
are available to templates in this module.

这里列出的 NgModule 所导出的[可声明对象](guide/glossary#declarable)可用在当前模块内的模板中。

Declarations are private by default.
If this ModuleA does not export UserComponent, then only the components within this
ModuleA can use UserComponent.

默认情况下，可声明对象是私有的。如果 ModuleA 不导出 UserComponent，那么只有这个 ModuleA 中的组件才能使用 UserComponent。

ModuleA can import ModuleB and also export it, making exports from ModuleB
available to an NgModule that imports ModuleA.

导出具有传递性。ModuleA 可以导入 ModuleB 并将其导出，这会让所有 ModuleB 中的导出同样可用在导入了 ModuleA 的那些模块中。

The following example exports the `NgFor` directive from CommonModule.

下面的例子导出了来自 `CommonModule` 的 `NgFor` 指令。

The set of components, directives, and pipes declared in this
NgModule that can be used in the template of any component that is part of an
NgModule that imports this NgModule. Exported declarations are the module's public API.

此 NgModule 中声明的一组组件、指令和管道可以在导入了本模块的模块下任何组件的模板中使用。导出的这些可声明对象就是该模块的公共 API。

A declarable belongs to one and only one NgModule.
A module can list another module among its exports, in which case all of that module's
public declaration are exported.

导出具有传递性。ModuleA 可以导入 ModuleB 并将其导出，这会让所有 ModuleB 中的导出同样可用在导入了 ModuleA 的那些模块中。

The set of components that are bootstrapped when this module is bootstrapped.

引导此模块时引导的一组组件。

The set of schemas that declare elements to be allowed in the NgModule.
Elements and properties that are neither Angular components nor directives
must be declared in a schema.

该 NgModule 中允许使用的声明元素的 schema（HTML 架构）。元素和属性（无论是 Angular 组件还是指令）都必须声明在 schema 中。

Allowed value are `NO_ERRORS_SCHEMA` and `CUSTOM_ELEMENTS_SCHEMA`.

允许的取值包括 `NO_ERRORS_SCHEMA` 和 `CUSTOM_ELEMENTS_SCHEMA`。

A name or path that uniquely identifies this NgModule in `getNgModuleById`.
If left `undefined`, the NgModule is not registered with `getNgModuleById`.

当前 NgModule 在 `getModuleFactory` 中的名字或唯一标识符。如果为 `undefined`，则该模块不会被注册进 `getModuleFactory` 中。

When present, this module is ignored by the AOT compiler.
It remains in distributed code, and the JIT compiler attempts to compile it
at run time, in the browser.
To ensure the correct behavior, the app must import `@angular/compiler`.

如果存在，则该指令/组件将被 AOT 编译器忽略。它会保留在发布代码中，并且 JIT 编译器会尝试在运行时在浏览器中对其进行编译。为了确保其行为正确，该应用程序必须导入 `@angular/compiler`。

Decorator that marks the following class as an NgModule, and supplies
configuration metadata for it.

将以下类标记为 NgModule 的装饰器，并为其提供配置元数据。

The `declarations` option configures the compiler
with information about what belongs to the NgModule.

`declarations` 选项用关于什么属于 NgModule 的信息配置编译器。

The `providers` options configures the NgModule's injector to provide
dependencies the NgModule members.

`providers` 选项配置 NgModule 的注入器来为 NgModule 成员提供依赖。

The `imports` and `exports` options bring in members from other modules, and make
this module's members available to others.

`imports` 和 `exports` 选项从其他模块引入成员，并使该模块的成员对其他人可用。