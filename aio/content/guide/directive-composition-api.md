# Directive composition API

# 指令组合 API

Angular directives offer a great way to encapsulate reusable behaviors— directives can apply
attributes, CSS classes, and event listeners to an element.

Angular 指令提供了一种封装可复用行为的好方法 —— 指令可以将属性、CSS 类和事件侦听器应用于元素。

The *directive composition API* lets you apply directives to a component's host element from
_within_ the component.

*指令组合 API* 允许你从组件*内部*将指令应用于此组件的宿主元素。

## Adding directives to a component

## 向组件添加指令

You apply directives to a component by adding a `hostDirectives` property to a component's
decorator. We call such directives *host directives*.

你可以通过将 `hostDirectives` 属性添加到组件的装饰器来将指令应用于组件。我们称这样的指令为*宿主指令*。

In this example, we apply the directive `MenuBehavior` to the host element of `AdminMenu`. This
works similarly to applying the `MenuBehavior` to the `<admin-menu>` element in a template.

在此示例中，我们将指令 `MenuBehavior` 应用于 `AdminMenu` 的宿主元素。这类似于将 `MenuBehavior` 应用于模板中的 `<admin-menu>` 元素。

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

When the framework renders a component, Angular also creates an instance of each host directive. The
directives' host bindings apply to the component's host element. By default, host directive inputs
and outputs are not exposed as part of the component's public API. See
[Including inputs and outputs](#including-inputs-and-outputs) below for more information.

当框架渲染组件时，Angular 还会创建每个宿主指令的实例。指令的宿主绑定被应用于组件的宿主元素。默认情况下，宿主指令的输入和输出不会作为组件公共 API 的一部分公开。有关更多信息，请参阅下面的[包含输入属性和输出属性](#including-inputs-and-outputs)。

**Angular applies host directives statically at compile time.** You cannot dynamically add
directives at runtime.

**Angular 会在编译时静态应用宿主指令**。你不能在运行时动态添加指令。

**Directives used in `hostDirectives` must be `standalone: true`.**

**`hostDirectives` 中使用的指令必须是 `standalone: true` 的。**

**Angular ignores the `selector` of directives applied in the `hostDirectives` property.**

**Angular 会忽略 `hostDirectives` 属性中所应用的那些指令的 `selector` 。**

## Including inputs and outputs

## 包含输入属性和输出属性

When you apply `hostDirectives` to your component, the inputs and outputs from the host directives
are not included in your component's API by default. You can explicitly include inputs and outputs
in your component's API by expanding the entry in `hostDirectives`:

默认情况下，当你将 `hostDirectives` 应用于组件时，宿主指令的输入属性和输出属性不会包含在组件的 API 中。你可以通过扩展 `hostDirectives` 中的条目来在组件的 API 中显式包含输入和输出：

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId'],
    outputs: ['menuClosed'],
  }],
})
export class AdminMenu { }
```

By explicitly specifying the inputs and outputs, consumers of the component with `hostDirective` can
bind them in a template:

通过显式指定输入和输出，使用 `hostDirective` 的组件的使用者可以将它们绑定在模板中：

```html
<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()">
```

Furthermore, you can alias inputs and outputs from `hostDirective` to customize the API of your
component:

此外，你可以为 `hostDirective` 的输入和输出起别名来自定义组件的 API：

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId: id'],
    outputs: ['menuClosed: closed'],
  }],
})
export class AdminMenu { }
```

```html
<admin-menu id="top-menu" (closed)="logMenuClosed()">
```

## Adding directives to another directive

## 将指令添加到另一个指令

You can also add `hostDirectives` to other directives, in addition to components. This enables the
transitive aggregation of multiple behaviors.

除了组件之外，你还可以将 `hostDirectives` 添加到其他指令。这启用了多个行为的可传递聚合能力。

In the following example, we define two directives, `Menu` and `Tooltip`. We then compose the behavior
of these two directives in `MenuWithTooltip`. Finally, we apply `MenuWithTooltip`
to `SpecializedMenuWithTooltip`.

在以下示例中，我们定义了两个指令，`Menu` 和 `Tooltip`。然后，我们会在 `MenuWithTooltip` 中组合这两个指令的行为。最后，我们将 `MenuWithTooltip` 应用到 `SpecializedMenuWithTooltip` 上。

When `SpecializedMenuWithTooltip` is used in a template, it creates instances of all of `Menu`
, `Tooltip`, and `MenuWithTooltip`. Each of these directives' host bindings apply to the host
element of `SpecializedMenuWithTooltip`.

在模板中使用 `SpecializedMenuWithTooltip` 时，它会创建 `Menu`、`Tooltip` 和 `MenuWithTooltip` 的所有实例。这些指令的宿主绑定中的每一个都会应用于 `SpecializedMenuWithTooltip` 的宿主元素。

```typescript
@Directive({...})
export class Menu { }

@Directive({...})
export class Tooltip { }

// MenuWithTooltip can compose behaviors from multiple other directives
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }

// CustomWidget can apply the already-composed behaviors from MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```

## Host directive semantics

##宿主指令的语义

### Directive execution order

### 指令的执行顺序

Host directives go through the same lifecycle as components and directives used directly in a
template. However, host directives always execute their constructor, lifecycle hooks, and bindings _
before_ the component or directive on which they are applied.

宿主指令和直接在模板中使用的组件和指令会经历相同的生命周期。但是，宿主指令总是会在应用它们的组件或指令*之前*执行它们的构造函数、生命周期钩子和绑定。

The following example shows minimal use of a host directive:

以下示例显示了宿主指令的最小化使用：

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

The order of execution here is:

这里的执行顺序是：

1. `MenuBehavior` instantiated

   `MenuBehavior` 实例化

2. `AdminMenu` instantiated

   `AdminMenu` 实例化

3. `MenuBehavior` receives inputs (`ngOnInit`)

   `MenuBehavior` 接收输入（ `ngOnInit` ）

4. `AdminMenu` receives inputs (`ngOnInit`)

   `AdminMenu` 接收输入 ( `ngOnInit` )

5. `MenuBehavior` applies host bindings

   `MenuBehavior` 应用宿主绑定

6. `AdminMenu` applies host bindings

   `AdminMenu` 应用宿主绑定

This order of operations means that components with `hostDirectives` can override any host bindings
specified by a host directive.

这种操作顺序意味着带有 `hostDirectives` 的组件可以改写（override）宿主指令指定的任何宿主绑定。

This order of operations extends to nested chains of host directives, as shown in the following
example.

展开宿主指令的嵌套链的操作顺序，如下例所示。

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```

In the example above, the order of execution is:

在上面的示例中，执行顺序是：

1. `Tooltip` instantiated

   `Tooltip` 实例化

2. `CustomTooltip` instantiated

   `CustomTooltip` 实例化

3. `EvenMoreCustomTooltip` instantiated

   `EvenMoreCustomTooltip` 实例化

4. `Tooltip` receives inputs (`ngOnInit`)

   `Tooltip` 接收输入 ( `ngOnInit` )

5. `CustomTooltip` receives inputs (`ngOnInit`)

   `CustomTooltip` 接收输入 ( `ngOnInit` )

6. `EvenMoreCustomTooltip` receives inputs (`ngOnInit`)

   `EvenMoreCustomTooltip` 接收输入 ( `ngOnInit` )

7. `Tooltip` applies host bindings

   `Tooltip` 应用宿主绑定

8. `CustomTooltip` applies host bindings

   `CustomTooltip` 应用宿主绑定

9. `EvenMoreCustomTooltip` applies host bindings

   `EvenMoreCustomTooltip` 应用宿主绑定

### Dependency injection

### 依赖注入

A component or directive that specifies `hostDirectives` can inject the instances of those host
directives and vice versa.

指定了 `hostDirectives` 的组件或指令可以注入这些宿主指令的实例，反之亦然。

When applying host directives to a component, both the component and host directives can define
providers.

当把宿主指令应用于组件时，组件和宿主指令都可以定义提供者。

If a component or directive with `hostDirectives` and those host directives both provide the same
injection token, the providers defined by class with `hostDirectives` take precedence over providers
defined by the host directives.

如果带有 `hostDirectives` 的组件或指令以及这些宿主指令都提供相同的注入令牌，则带有 `hostDirectives` 的类定义的提供者会优先于宿主指令定义的提供者。

### Performance

### 性能

While the directive composition API offers a powerful tool for reusing common behaviors, excessive
use of host directives can impact your application's memory use. If you create components or
directives that use _many_ host directives, you may inadvertently balloon the memory used by your
application.

虽然指令组合 API 提供了一个强大的工具来复用常见行为，但过度使用宿主指令会影响应用程序的内存使用。如果你创建使用*许多个*宿主指令的组件或指令，你可能会无意中让应用程序占用的内存膨胀。

The following example shows a component that applies several host directives.

以下示例显示了一个应用多个宿主指令的组件。

```typescript
@Component({
  hostDirectives: [
    DisabledState,
    RequiredState,
    ValidationState,
    ColorState,
    RippleBehavior,
  ],
})
export class CustomCheckbox { }
```

This example declares a custom checkbox component that includes five host directives. This
means that Angular will create six objects each time a `CustomCheckbox` renders— one for the
component and one for each host directive. For a few checkboxes on a page, this won't pose any
significant issues. However, if your page renders _hundreds_ of checkboxes, such as in a table, then
you could start to see an impact of the additional object allocations. Always be sure to profile
your application to determine the right composition pattern for your use case.

此示例声明了一个自定义复选框组件，其中包含五个宿主指令。这意味着每次 `CustomCheckbox` 渲染时，Angular 将创建六个对象 —— 组件用一个，每个宿主指令用一个。对于页面上的少量复选框，这不会构成任何重大问题。但是，如果你的页面渲染*数百个*复选框（例如在表格中），那么你可能会开始看到额外对象分配的影响。始终确保对你的应用程序进行性能剖析，以便为你的用例确定正确的组合模式。