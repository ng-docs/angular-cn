Type of the Directive decorator / constructor function.

指令装饰器/构造函数的类型。

To define a directive, mark the class with the decorator and provide metadata.

要想定义一个指令，请为该类加上此装饰器，并提供元数据。

Declaring directives

声明指令

In order to make a directive available to other components in your application, you should do
one of the following:

为了使指令可用于你应用程序中的其他组件，你应该执行以下操作之一：

either mark the directive as [standalone](guide/standalone-components),

要么将指令标记为[Standalone](guide/standalone-components)，

or declare it in an NgModule by adding it to the `declarations` and `exports` fields.

或者通过将其添加到 `declarations` 和 `exports` 字段来在 NgModule 中声明它。

** Marking a directive as standalone **

**将指令标记为独立的**

You can add the `standalone: true` flag to the Directive decorator metadata to declare it as
[standalone](guide/standalone-components):

你可以将 `standalone: true` 标志添加到 Directive 装饰器元数据中，以将其声明为[Standalone](guide/standalone-components)：

When marking a directive as standalone, please make sure that the directive is not already
declared in an NgModule.

将指令标记为独立时，请确保该指令尚未在 NgModule 中声明。

** Declaring a directive in an NgModule **

**在 NgModule 中声明指令**

Another approach is to declare a directive in an NgModule:

另一种方法是在 NgModule 中声明一个指令：

When declaring a directive in an NgModule, please make sure that:

在 NgModule 中声明指令时，请确保：

the directive is declared in exactly one NgModule.

该指令正好在一个 NgModule 中声明。

the directive is not standalone.

该指令不是独立的。

you do not re-declare a directive imported from another module.

你不会重新声明从另一个模块导入的指令。

the directive is included into the `exports` field as well if you want this directive to be
accessible for components outside of the NgModule.

如果你希望 `exports` 之外的组件可以访问此指令，则该指令也包含在 export 字段中。

Decorator that marks a class as an Angular directive.
You can define your own directives to attach custom behavior to elements in the DOM.

将类标记为 Angular 指令的装饰器。你可以定义自己的指令，以将自定义行为附加到 DOM 中的元素。

The options provide configuration metadata that determines
how the directive should be processed, instantiated and used at
runtime.

像组件类一样，指令类也可以实现[生命周期钩子](guide/lifecycle-hooks)，以影响它们的配置和行为。

Directive classes, like component classes, can implement
[life-cycle hooks](guide/lifecycle-hooks) to influence their configuration and behavior.

像组件类一样，指令类也可以实现[生命周期钩子](guide/lifecycle-hooks)，以影响它们的配置和行为。

See the `Directive` decorator.

请参阅 `Directive` 装饰器。

Directive decorator and metadata.

指令装饰器和元数据。

The CSS selector that identifies this directive in a template
and triggers instantiation of the directive.

这个 CSS 选择器用于在模板中标记出该指令，并触发该指令的实例化。

Declare as one of the following:

可使用下列形式之一：

`element-name`: Select by element name.

`element-name`：根据元素名选取。

`.class`: Select by class name.

`.class`：根据类名选取。

`[attribute]`: Select by attribute name.

`[attribute]`：根据属性名选取。

`[attribute=value]`: Select by attribute name and value.

`[attribute=value]`：根据属性名和属性值选取。

`:not(sub_selector)`: Select only if the element does not match the `sub_selector`.

`:not(sub_selector)`：只有当元素不匹配子选择器 `sub_selector` 的时候才选取。

`selector1, selector2`: Select if either `selector1` or `selector2` matches.

`selector1, selector2`：无论 `selector1` 还是 `selector2` 匹配时都选取。

Angular only allows directives to apply on CSS selectors that do not cross
element boundaries.

对于下列模板 HTML，带有 `input[type=text]` 选择器的指令只会在 `<input type="text">` 元素上实例化。

For the following template HTML, a directive with an `input[type=text]` selector,
would be instantiated only on the `<input type="text">` element.

对于下列模板 HTML，带有 `input[type=text]` 选择器的指令只会在 `<input type="text">` 元素上实例化。

The following example creates a component with two data-bound properties.

下面的例子创建了一个带有两个可绑定属性的组件。

Enumerates the set of data-bound input properties for a directive

列举某个指令的一组可供数据绑定的输入属性

Angular automatically updates input properties during change detection.
The `inputs` property accepts either strings or object literals that configure the directive
properties that should be exposed as inputs.

Angular 在变更检测期间自动更新输入属性。`inputs` 属性接受配置应作为输入公开的指令属性的字符串或对象文字。

When an object literal is passed in, the `name` property indicates which property on the
class the input should write to, while the `alias` determines the name under
which the input will be available in template bindings. The `required` property indicates that
the input is required which will trigger a compile-time error if it isn't passed in when the
directive is used.

传入对象文字时，`name` 属性指示输入应写入类的哪个属性，而 `alias` 确定输入在模板绑定中可用的名称。`required` 属性指示输入是必需的，如果在使用指令时未传入，将触发编译时错误。

When a string is passed into the `inputs` array, it can have a format of `'name'` or
`'name: alias'` where `name` is the property on the class that the directive should write
to, while the `alias` determines the name under which the input will be available in
template bindings. String-based input definitions are assumed to be optional.

当一个字符串被传递到 `inputs` 数组时，它的格式可以是 `'name'` 或 `'name: alias'`，其中 `name` 是指令应该写入的类的属性，而 `alias` 确定输入的名称将在模板绑定中可用。假定基于字符串的输入定义是可选的。

Enumerates the set of event-bound output properties.

列举一组可供事件绑定的输出属性。

When an output property emits an event, an event handler attached to that event
in the template is invoked.

`outputs` 属性定义了一组从 `directiveProperty` 指向 `bindingProperty` 的配置项：。

The `outputs` property defines a set of `directiveProperty` to `alias`
configuration:

`outputs` 属性定义了一组 `directiveProperty` 来 `alias` 配置：

`directiveProperty` specifies the component property that emits events.

`directiveProperty` 用于指定要发出事件的指令属性。

`alias` specifies the DOM property the event handler is attached to.

`alias` 指定事件处理程序附加到的 DOM 属性。

Configures the [injector](guide/glossary#injector) of this
directive or component with a [token](guide/glossary#di-token)
that maps to a [provider](guide/glossary#provider) of a dependency.

一组依赖注入令牌，它允许 DI 系统为这个指令或组件提供依赖。

Defines the name that can be used in the template to assign this directive to a variable.

定义一个名字，用于在模板中把该指令赋值给一个变量。

The following example shows how queries are defined
and when their results are available in lifecycle hooks:

下面的范例展示了如何定义这些查询以及到生命周期钩子中的哪个步骤才会有结果：

Configures the queries that will be injected into the directive.

配置一些查询，它们将被注入到该指令中。

Content queries are set before the `ngAfterContentInit` callback is called.
View queries are set before the `ngAfterViewInit` callback is called.

下面的范例展示了如何定义这些查询以及到生命周期钩子中的哪个步骤才会有结果：。

Maps class properties to host element bindings for properties,
attributes, and events, using a set of key-value pairs.

使用一组键-值对，把类的属性映射到宿主元素的绑定（Property、Attribute 和事件）。

Angular automatically checks host property bindings during change detection.
If a binding changes, Angular updates the directive's host element.

对于事件处理：。

When the key is a property of the host element, the property value is
the propagated to the specified DOM property.

当 key 是宿主元素的 Property 时，这个 Property 值就会传播到指定的 DOM 属性。

When the key is a static attribute in the DOM, the attribute value
is propagated to the specified property in the host element.

当 key 是 DOM 中的静态 Attribute 时，这个 Attribute 值就会传播到宿主元素上指定的 Property 去。

For event handling:

对于事件处理：

The key is the DOM event that the directive listens to.
To listen to global events, add the target to the event name.
The target can be `window`, `document` or `body`.

它的 key 就是该指令想要监听的 DOM 事件。要想监听全局事件，请把要监听的目标添加到事件名的前面。这个目标可以是 `window`、`document` 或 `body`。

The value is the statement to execute when the event occurs. If the
statement evaluates to `false`, then `preventDefault` is applied on the DOM
event. A handler method can refer to the `$event` local variable.

它的 value 就是当该事件发生时要执行的语句。如果该语句返回 `false`，那么就会调用这个 DOM 事件的 `preventDefault` 函数。这个语句中可以引用局部变量 `$event` 来获取事件数据。

When present, this directive/component is ignored by the AOT compiler.
It remains in distributed code, and the JIT compiler attempts to compile it
at run time, in the browser.
To ensure the correct behavior, the app must import `@angular/compiler`.

如果存在，则该指令/组件将被 AOT 编译器忽略。它会保留在发布代码中，并且 JIT 编译器会尝试在运行时在浏览器中对其进行编译。为了确保其行为正确，该应用程序必须导入 `@angular/compiler`。

Angular directives marked as `standalone` do not need to be declared in an NgModule. Such
directives don't depend on any "intermediate context" of an NgModule \(ex. configured
providers\).

标记为 `standalone` 的 Angular 指令不需要在 NgModule 中声明。此类指令不依赖于 NgModule 的任何“中间上下文”（例如配置的提供程序）。

More information about standalone components, directives, and pipes can be found in [this
guide](guide/standalone-components).

有关独立组件、指令和管道的更多信息，请参阅[本指南](guide/standalone-components)。

// TODO\(signals\): Remove internal and add public documentation

// TODO\(signals\): 删除内部文档并添加公共文档

Standalone directives that should be applied to the host whenever the directive is matched.
By default, none of the inputs or outputs of the host directives will be available on the host,
unless they are specified in the `inputs` or `outputs` properties.

指令匹配时应该应用于宿主的独立指令。默认情况下，host 指令的任何输入或输出在宿主上都不可用，除非它们在 `inputs` 或 `outputs` 属性中指定。

You can additionally alias inputs and outputs by putting a colon and the alias after the
original input or output name. For example, if a directive applied via `hostDirectives`
defines an input named `menuDisabled`, you can alias this to `disabled` by adding
`'menuDisabled: disabled'` as an entry to `inputs`.

你可以通过在原始输入或输出名称后面放一个冒号和别名来为输入和输出额外别名。例如，如果通过 `hostDirectives` 应用的指令定义了一个名为 `menuDisabled` 的 `inputs`，你可以通过将 `'menuDisabled: disabled'` `disabled` 条目添加到 sources 来将其别名为 enabled。

Type of the Directive metadata.

指令元数据的类型。

Component decorator interface

组件装饰器接口

Setting component inputs

设置组件的输入属性

The following example creates a component with two data-bound properties,
specified by the `inputs` value.

下免得例子创建了一个带有两个数据绑定属性的组件，它是通过 `inputs` 值来指定的。

Setting component outputs

设置组件的输出属性

The following example shows two event emitters that emit on an interval. One
emits an output every second, while the other emits every five seconds.

下面的例子展示了两个事件发生器，它们定时发出事件。一个每隔一秒发出一个输出事件，另一个则隔五秒。

{&commat;example core/ts/metadata/directives.ts region='component-output-interval'}



Injecting a class with a view provider

使用视图提供者注入一个类

The following simple example injects a class into a component
using the view provider specified in component metadata:

下面的例子示范了如何在组件元数据中使用视图提供者来把一个类注入到组件中：

Preserving whitespace

保留空格

Removing whitespace can greatly reduce AOT-generated code size and speed up view creation.
As of Angular 6, the default for `preserveWhitespaces` is false \(whitespace is removed\).
To change the default setting for all components in your application, set
the `preserveWhitespaces` option of the AOT compiler.

删除空格可以大大减少 AOT 生成的代码大小并加快视图创建。从 Angular 6 开始，`preserveWhitespaces` 的默认值为 false（删除空格）。要更改应用程序中所有组件的默认设置，请设置 AOT 编译器的 `preserveWhitespaces` 选项。

By default, the AOT compiler removes whitespace characters as follows:

默认情况下，AOT 编译器会删除空白字符，如下所示：

Trims all whitespaces at the beginning and the end of a template.

修剪模板开头和结尾的所有空格。

Removes whitespace-only text nodes. For example,

删除只有空白的文本节点。例如，

becomes:

变成：

Replaces a series of whitespace characters in text nodes with a single space.
For example, `<span>\n some text\n</span>` becomes `<span> some text </span>`.

用单个空格替换文本节点中的一系列空白字符。例如，`<span>\n some text\n</span>` 变成了 `<span> some text </span>`。

Does NOT alter text nodes inside HTML tags such as `<pre>` or `<textarea>`,
where whitespace characters are significant.

不改变 HTML 标签内的文本节点，例如 `<pre>` 或 `<textarea>`，其中空白字符很重要。

Note that these transformations can influence DOM nodes layout, although impact
should be minimal.

请注意，这些转换会影响 DOM 节点布局，尽管影响应该很小。

You can override the default behavior to preserve whitespace characters
in certain fragments of a template. For example, you can exclude an entire
DOM sub-tree by using the `ngPreserveWhitespaces` attribute:

你可以覆盖默认行为以在模板的某些片段中保留空白字符。例如，你可以使用 `ngPreserveWhitespaces` 属性排除整个 DOM 子树：

You can force a single space to be preserved in a text node by using `&ngsp;`,
which is replaced with a space character by Angular's template
compiler:

你可以使用 `&ngsp;`，它被 Angular 的模板编译器替换为空格字符：

Note that sequences of `&ngsp;` are still collapsed to just one space character when
the `preserveWhitespaces` option is set to `false`.

请注意 `&ngsp;` 的序列当 `preserveWhitespaces` 选项设置为 `false` 时，它​​们仍然折叠为只有一个空格字符。

To preserve sequences of whitespace characters, use the
`ngPreserveWhitespaces` attribute.

要保留空白字符序列，请使用 `ngPreserveWhitespaces` 属性。

Decorator that marks a class as an Angular component and provides configuration
metadata that determines how the component should be processed,
instantiated, and used at runtime.

一个装饰器，用于把某个类标记为 Angular 组件，并为它配置一些元数据，以决定该组件在运行期间该如何处理、实例化和使用。

Components are the most basic UI building block of an Angular app.
An Angular app contains a tree of Angular components.

注意，除了这些用来对指令进行配置的选项之外，你还可以通过实现生命周期钩子来控制组件的运行期行为。要了解更多，参见 [生命周期钩子](guide/lifecycle-hooks) 章。

Angular components are a subset of directives, always associated with a template.
Unlike other directives, only one component can be instantiated for a given element in a
template.

Angular 的组件是指令的一个子集，它总是有一个与之关联的模板。和其它指令不同，模板中的每个元素只能具有一个组件实例。

A component must belong to an NgModule in order for it to be available
to another component or application. To make it a member of an NgModule,
list it in the `declarations` field of the `NgModule` metadata.

组件必须从属于某个 NgModule 才能被其它组件或应用使用。要想让它成为某个 NgModule 中的一员，请把它列在 `@NgModule` 元数据的 `declarations` 字段中。

Note that, in addition to these options for configuring a directive,
you can control a component's runtime behavior by implementing
life-cycle hooks. For more information, see the
[Lifecycle Hooks](guide/lifecycle-hooks) guide.

注意，除了这些用来对指令进行配置的选项之外，你还可以通过实现生命周期钩子来控制组件的运行期行为。要了解更多，参见 [生命周期钩子](guide/lifecycle-hooks) 章。

See the `Component` decorator.

请参阅 `Component` 装饰器。

Supplies configuration metadata for an Angular component.

为 Angular 组件提供配置元数据。

The change-detection strategy to use for this component.

用于当前组件的变更检测策略。

When a component is instantiated, Angular creates a change detector,
which is responsible for propagating the component's bindings.
The strategy is one of:

当组件实例化之后，Angular 就会创建一个变更检测器，它负责传播组件各个绑定值的变化。该策略是下列值之一：

`ChangeDetectionStrategy#OnPush` sets the strategy to `CheckOnce` \(on demand\).

`ChangeDetectionStrategy#OnPush` 把策略设置为 `CheckOnce`（按需）。

`ChangeDetectionStrategy#Default` sets the strategy to `CheckAlways`.

`ChangeDetectionStrategy#Default` 把策略设置为 `CheckAlways`。

Defines the set of injectable objects that are visible to its view DOM children.
See [example](#injecting-a-class-with-a-view-provider).

定义对其视图 DOM 子级可见的可注入对象集。请参见[示例](#injecting-a-class-with-a-view-provider)。

This option does not have any effect. Will be removed in Angular v17.

该选项没有任何作用。将在 Angular v17 中删除。

The module ID of the module that contains the component.
The component must be able to resolve relative URLs for templates and styles.
SystemJS exposes the `__moduleName` variable within each module.
In CommonJS, this can  be set to `module.id`.

包含该组件的那个模块的 ID。该组件必须能解析模板和样式表中使用的相对 URL。SystemJS 在每个模块中都导出了 `__moduleName` 变量。在 CommonJS 中，它可以设置为 `module.id`。

The relative path or absolute URL of a template file for an Angular component.
If provided, do not supply an inline template using `template`.

Angular 组件模板文件的 URL。如果提供了它，就不要再用 `template` 来提供内联模板了。

An inline template for an Angular component. If provided,
do not supply a template file using `templateUrl`.

Angular 组件的内联模板。如果提供了它，就不要再用 `templateUrl` 提供模板了。

One or more relative paths or absolute URLs for files containing CSS stylesheets to use
in this component.

一个或多个 URL，指向包含本组件 CSS 样式表的文件。

One or more inline CSS stylesheets to use
in this component.

本组件用到的一个或多个内联 CSS 样式。

One or more animation `trigger()` calls, containing
[`state()`](api/animations/state) and `transition()` definitions.
See the [Animations guide](/guide/animations) and animations API documentation.

一个或多个动画 `trigger()` 调用，包含一些 `state()` 和 `transition()` 定义。参见[动画](/guide/animations)和相关的 API 文档。

An encapsulation policy for the component's styling.
Possible values:

供模板和 CSS 样式使用的样式封装策略。取值为：

`ViewEncapsulation.Emulated`: Apply modified component styles in order to emulate
                              a native Shadow DOM CSS encapsulation behavior.

`ViewEncapsulation.Emulated`：使用垫片（shimmed\) CSS 来模拟原生行为。

`ViewEncapsulation.None`: Apply component styles globally without any sort of encapsulation.

`ViewEncapsulation.None`：使用不带任何封装的全局 CSS。

`ViewEncapsulation.ShadowDom`: Use the browser's native Shadow DOM API to encapsulate styles.

`ViewEncapsulation.ShadowDom`：使用 Shadow DOM v1，封装样式。

If not supplied, the value is taken from the `CompilerOptions`
which defaults to `ViewEncapsulation.Emulated`.

如果没有提供，该值就会从 `CompilerOptions` 中获取它。默认的编译器选项是 `ViewEncapsulation.Emulated`。

If the policy is `ViewEncapsulation.Emulated` and the component has no
{&commat;link Component#styles styles} nor {&commat;link Component#styleUrls styleUrls},
the policy is automatically switched to `ViewEncapsulation.None`.

如果策略是 `ViewEncapsulation.Emulated` 并且组件没有 {&commat;link Component#styles styles} 也没有 {&commat;link Component#styleUrls styleUrls}，策略会自动切换到 `ViewEncapsulation.None`。

Overrides the default interpolation start and end delimiters \(`{{` and `}}`\).

改写默认的插值表达式起止分界符（`{{` 和 `}}`）。

True to preserve or false to remove potentially superfluous whitespace characters
from the compiled template. Whitespace characters are those matching the `\s`
character class in JavaScript regular expressions. Default is false, unless
overridden in compiler options.

为 `true` 则保留，为 `false` 则从编译后的模板中移除可能多余的空白字符。空白字符就是指那些能在 JavaScript 正则表达式中匹配 `\s` 的字符。默认为 `false`，除非通过编译器选项改写了它。

Angular components marked as `standalone` do not need to be declared in an NgModule. Such
components directly manage their own template dependencies \(components, directives, and pipes
used in a template\) via the imports property.

标记为 `standalone` 的 Angular 组件不需要在 NgModule 中声明。此类组件通过 imports 属性直接管理它们自己的模板依赖项（模板中使用的组件、指令和管道）。

// TODO\(signals\): Remove internal and add public documentation.

// TODO\(signals\): 删除内部文档并添加公共文档。

The imports property specifies the standalone component's template dependencies — those
directives, components, and pipes that can be used within its template. Standalone components
can import other standalone components, directives, and pipes as well as existing NgModules.

imports 属性指定独立组件的模板依赖项——那些可以在其模板中使用的指令、组件和管道。独立组件可以导入其他独立组件、指令和管道以及现有的 NgModule。

This property is only available for standalone components - specifying it for components
declared in an NgModule generates a compilation error.

此属性仅适用于独立组件 - 为 NgModule 中声明的组件指定它会生成编译错误。

The set of schemas that declare elements to be allowed in a standalone component. Elements and
properties that are neither Angular components nor directives must be declared in a schema.

声明要在独立组件中允许的元素的模式集。既不是 Angular 组件也不是指令的元素和属性必须在模式中声明。

Component decorator and metadata.

组件装饰器和元数据。

Type of the Pipe decorator / constructor function.

管道装饰器/构造函数的类型。

[Style Guide: Pipe Names](guide/styleguide#02-09)

[样式指南：管道名称](guide/styleguide#02-09)

Decorator that marks a class as pipe and supplies configuration metadata.

本装饰器用于将类标记为管道并提供配置元数据。

A pipe class must implement the `PipeTransform` interface.
For example, if the name is "myPipe", use a template binding expression
such as the following:

管道类必须实现 `PipeTransform` 接口。比如，如果其名称为 “myPipe”，则使用模板绑定表达式，比如：

The result of the expression is passed to the pipe's `transform()` method.

表达式的结果被传递给管道的 `transform()` 方法。

A pipe must belong to an NgModule in order for it to be available
to a template. To make it a member of an NgModule,
list it in the `declarations` field of the `NgModule` metadata.

管道必须属于某个 NgModule，才能用于模板。要使其成为 NgModule 的成员，请把它加入 `NgModule` 元数据的 `declarations` 中。

See the `Pipe` decorator.

请参阅 `Pipe` 装饰器。

Type of the Pipe metadata.

管道元数据的类型。

The pipe name to use in template bindings.
Typically uses [lowerCamelCase](guide/glossary#case-types)
because the name cannot contain hyphens.

在模板中绑定时使用的管道名。通常使用 [lowerCamelCase](guide/glossary#case-types) 拼写方式，因为名字中不允许包含减号（-）。

When true, the pipe is pure, meaning that the
`transform()` method is invoked only when its input arguments
change. Pipes are pure by default.

为 `true` 时，该管道是纯管道，也就是说 `transform()` 方法只有在其输入参数变化时才会被调用。管道默认都是纯管道。

If the pipe has internal state \(that is, the result
depends on state other than its arguments\), set `pure` to false.
In this case, the pipe is invoked on each change-detection cycle,
even if the arguments have not changed.

如果该管道具有内部状态（也就是说，其结果会依赖内部状态，而不仅仅依赖参数），就要把 `pure` 设置为 `false`。这种情况下，该管道会在每个变更检测周期中都被调用一次 —— 即使其参数没有发生任何变化。

Angular pipes marked as `standalone` do not need to be declared in an NgModule. Such
pipes don't depend on any "intermediate context" of an NgModule \(ex. configured providers\).

标记为 `standalone` 的 Angular 管道不需要在 NgModule 中声明。此类管道不依赖于 NgModule 的任何“中间上下文”（例如配置的提供程序）。

You can supply an optional name to use in templates when the
component is instantiated, that maps to the
name of the bound property. By default, the original
name of the bound property is used for input binding.

下面的例子创建了一个带有两个输入属性的组件，其中一个还指定了绑定名。

The following example creates a component with two input properties,
one of which is given a special binding name.

下面的例子创建了一个带有两个输入属性的组件，其中一个还指定了绑定名。

[Input and Output properties](guide/inputs-outputs)

[输入和输出属性](guide/inputs-outputs)

Decorator that marks a class field as an input property and supplies configuration metadata.
The input property is bound to a DOM property in the template. During change detection,
Angular automatically updates the data property with the DOM property's value.

一个装饰器，用来把某个类字段标记为输入属性，并提供配置元数据。该输入属性会绑定到模板中的某个 DOM 属性。当变更检测时，Angular 会自动使用这个 DOM 属性的值来更新此数据属性。

Type of metadata for an `Input` property.

`Input` 属性的元数据类型。

The name of the DOM property to which the input property is bound.

输入属性绑定到的 DOM 属性的名字，。

Whether the input is required for the directive to function.

输入是否是指令运行所必需的。

Function with which to transform the input value before assigning it to the directive instance.

在将输入值分配给指令实例之前转换输入值的函数。

Type of the Output decorator / constructor function.

输出装饰器/构造函数的类型。

You can supply an optional name to use in templates when the
component is instantiated, that maps to the
name of the bound property. By default, the original
name of the bound property is used for output binding.

参见 `@Input` 的例子了解如何指定一个绑定名。

See `Input` decorator for an example of providing a binding name.

参见 `@Input` 的例子了解如何指定一个绑定名。

Decorator that marks a class field as an output property and supplies configuration metadata.
The DOM property bound to the output property is automatically updated during change detection.

一个装饰器，用于把一个类字段标记为输出属性，并提供配置元数据。凡是绑定到输出属性上的 DOM 属性，Angular 在变更检测期间都会自动进行更新。

Type of the Output metadata.

输出元数据的类型。

The name of the DOM property to which the output property is bound.

输出属性绑定到的 DOM 属性的名称。

Type of the HostBinding decorator / constructor function.

HostBinding 装饰器/构造函数的类型。

The following example creates a directive that sets the `valid` and `invalid`
properties on the DOM element that has an `ngModel` directive on it.

下面的例子创建了一个指令，它会对具有 `ngModel` 指令的 DOM 元素设置 `valid` 和 `invalid` 属性。

Decorator that marks a DOM property as a host-binding property and supplies configuration
metadata.
Angular automatically checks host property bindings during change detection, and
if a binding changes it updates the host element of the directive.

一个装饰器，用于把一个 DOM 属性标记为绑定到宿主的属性，并提供配置元数据。Angular 在变更检测期间会自动检查宿主属性绑定，如果这个绑定变化了，它就会更新该指令所在的宿主元素。

Type of the HostBinding metadata.

HostBinding 元数据的类型。

The DOM property that is bound to a data property.

要绑定到数据属性的 DOM 属性。

Type of the HostListener decorator / constructor function.

HostListener 装饰器/构造函数的类型。

Decorator that declares a DOM event to listen for,
and provides a handler method to run when that event occurs.

一个装饰器，用于声明要监听的 DOM 事件，并提供在该事件发生时要运行的处理器方法。

Angular invokes the supplied handler method when the host element emits the specified event,
and updates the bound element with the result.

当宿主元素发出指定的事件时，Angular 会调用提供的处理程序方法，并使用结果更新绑定元素。

If the handler method returns false, applies `preventDefault` on the bound element.

如果处理程序方法返回 false，则在绑定元素上应用 `preventDefault`。

Type of the HostListener metadata.

HostListener 元数据的类型。

The DOM event to listen for.

要监听的事件。

A set of arguments to pass to the handler method when the event occurs.

当该事件发生时传给处理器方法的一组参数。

The following example declares a directive
that attaches a click listener to a button and counts clicks.

下面的例子声明了一个指令，它会为按钮附加一个 `click` 监听器，并统计点击次数。

The following example registers another DOM event handler that listens for `Enter` key-press
events on the global `window`.

以下示例注册了另一个 DOM 事件处理程序，它会侦听全局 `window` 上的 `Enter` 按键事件。

The list of valid key names for `keydown` and `keyup` events
can be found here:
https://www.w3.org/TR/DOM-Level-3-Events-key/#named-key-attribute-values

可以在此处找到 `keydown` 和 `keyup` 事件的有效键名列表：https&#x3A; [//www.w3.org/TR/DOM-Level-3-Events-key/#named-key-attribute-values](https://www.w3.org/TR/DOM-Level-3-Events-key/#named-key-attribute-values)

Note that keys can also be combined, e.g. `@HostListener('keydown.shift.a')`.

请注意，键也可以组合，例如 `@HostListener('keydown.shift.a')`。

The global target names that can be used to prefix an event name are
`document:`, `window:` and `body:`.

可用于事件名称前缀的全局目标名称是 `document:` 、 `window:` 和 `body:`。

Decorator that binds a DOM event to a host listener and supplies configuration metadata.
Angular invokes the supplied handler method when the host element emits the specified event,
and updates the bound element with the result.

将 DOM 事件绑定到宿主侦听器并提供配置元数据的装饰器。当宿主元素发出指定事件时，Angular 调用提供的处理程序方法，并用结果更新绑定元素。