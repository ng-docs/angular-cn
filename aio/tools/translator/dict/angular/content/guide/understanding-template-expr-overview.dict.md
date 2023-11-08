Understanding template expressions

了解模板表达式

This topic explores some aspects of Angular text interpolation.

本主题探讨了 Angular 文本插值的某些方面。

Syntax

语法

Template expressions are similar to JavaScript.
Many JavaScript expressions are legal template expressions, with the following exceptions.

模板表达式和 JavaScript 很相似。许多 JavaScript 表达式都是合法的模板表达式，但以下情况除外。

You can't use JavaScript expressions that have or promote side effects, including:

你不能使用那些具有或可能引发副作用的 JavaScript 表达式，包括：

Assignments \(`=`, `+=`, `-=`, `...`\)

赋值（`=`, `+=`, `-=`, `...`）

Operators such as `new`, `typeof`, or `instanceof`

运算符，比如 `new`、`typeof` 或 `instanceof` 等。

Chaining expressions with <code>;</code> or <code>,</code>

链接表达式<code>;</code>或<code>，</code>

The increment and decrement operators `++` and `--`

自增和自减运算符：`++` 和 `--`

Some of the ES2015+ operators

一些 ES2015+ 版本的运算符

Other notable differences from JavaScript syntax include:

和 JavaScript 语法的其它显著差异包括：

No support for the bitwise operators such as `|` and `&`

不支持位运算，比如 `|` 和 `&`

New [template expression operators](guide/template-expression-operators), such as `|`, `?.` and `!`

新的[模板表达式运算符](guide/template-expression-operators)，比如 `|`，`?.` 和 `!`

Expression context

表达式上下文

Interpolated expressions have a context—a particular part of the application to which the expression belongs.
Typically, this context is the component instance.

插值表达式具有上下文 —— 表达式所属应用中的特定部分。通常，此上下文就是组件实例。

In the following snippet, the expression `recommended` and the expression `itemImageUrl2` refer to properties of the `AppComponent`.

在下面的代码片段中，表达式 `recommended` 和 `itemImageUrl2` 表达式所引用的都是 `AppComponent` 中的属性。

An expression can also refer to properties of the _template's_ context such as a [template input variable](guide/structural-directives#shorthand) or a [template reference variable](guide/template-reference-variables).

表达式还可以引用*模板上下文*的属性，例如[模板输入变量](guide/structural-directives#shorthand)或[模板引用变量](guide/template-reference-variables)。

The following example uses a template input variable of `customer`.

下面的例子就使用了模板输入变量 `customer`。

This next example features a template reference variable, `#customerInput`.

接下来的例子使用了模板引用变量 `#customerInput`。

Preventing name collisions

防止命名冲突

The context against which an expression evaluates is the union of the template variables, the directive's context object—if it has one—and the component's members.
If you reference a name that belongs to more than one of these namespaces, Angular applies the following logic to determine the context:

表达式求值的上下文是模板变量、指令的上下文对象（如果有的话）以及组件成员的并集。如果所引用的名称在多个命名空间都有，则 Angular 将应用以下逻辑来确定上下文：

The template variable name.

模板变量的名称。

A name in the directive's context.

指令上下文中的名称。

The component's member names.

组件成员的名称。

To avoid variables shadowing variables in another context, keep variable names unique.
In the following example, the `AppComponent` template greets the `customer`, Padma.

为避免变量遮盖另一个上下文中的变量，请保持变量名称唯一。在以下示例中，`AppComponent` 模板在问候 `customer` Padma。

An `ngFor` then lists each `customer` in the `customers` array.

然后，一个 `ngFor` 列出了 `customers` 数组中的每个 `customer`。

The `customer` within the `ngFor` is in the context of an `<ng-template>` and so refers to the `customer` in the `customers` array, in this case Ebony and Chiho.
This list does not feature Padma because `customer` outside of the `ngFor` is in a different context.
Conversely, `customer` in the `<h1>` doesn't include Ebony or Chiho because the context for this `customer` is the class and the class value for `customer` is Padma.

`ngFor` 中的 `customer` 处于一个 `<ng-template>` 的上下文中，所以它指向的是 `customers` 数组中的 `customer`，在这里是 Ebony 和 Chiho。此列表中不包含 Padma，因为那个 `customer` 位于 `ngFor` 以外的另一个上下文中。反之，`<h1>` 中的 `customer` 不包括 Ebony 或 Chiho，因为该 `customer` 的上下文是组件类，而这个类中 `customer` 的值是 Padma。

Expression best practices

表达式最佳实践

When using template expressions, follow these best practices:

使用模板表达式时，请遵循以下最佳实践：

**Use short expressions**

**使用短表达式**

Use property names or method calls whenever possible.
Keep application and business logic in the component, where it is accessible to develop and test.

尽可能使用属性名称或方法调用。将应用和业务逻辑保留在组件中，这里更便于开发和测试。

**Quick execution**

**快速执行**

Angular executes template expressions after every [change detection](guide/glossary#change-detection) cycle.
Many asynchronous activities trigger change detection cycles, such as promise resolutions, HTTP results, timer events, key presses, and mouse moves.

Angular 会在每个[变更检测](guide/glossary#change-detection)周期之后执行模板表达式。许多异步活动都会触发变更检测周期，比如解析 Promise、HTTP 结果、计时器事件、按键和鼠标移动。

Expressions should finish quickly to keep the user experience as efficient as possible, especially on slower devices.
Consider caching values when their computation requires greater resources.

表达式应尽快完成，以保持用户体验的性能，尤其是在速度较慢的设备上。当计算值需要更多资源时，请考虑缓存值。

**No visible side effects**

**没有可见的副作用**

According to Angular's [unidirectional data flow model](guide/glossary#unidirectional-data-flow), a template expression should not change any application state other than the value of the target property.
Reading a component value should not change some other displayed value.
The view should be stable throughout a single rendering pass.

根据 Angular 的[单向数据流模型](guide/glossary#unidirectional-data-flow)，除了目标属性的值之外，模板表达式不应更改任何应用状态。读取组件值不应更改其他显示值。该视图应在整个渲染过程中保持稳定。

What's next

下一步呢？

Property bindings

属性绑定