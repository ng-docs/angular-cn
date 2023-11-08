Information needed to compile a directive for the render3 runtime.

为 render3 运行时编译指令所需的信息。

Name of the directive type.

指令类型的名称。

An expression representing a reference to the directive itself.

表示对指令本身的引用的表达式。

Number of generic type parameters of the type itself.

类型本身的泛型类型参数的数量。

A source span for the directive type.

指令类型的源范围。

Dependencies of the directive's constructor.

指令构造函数的依赖项。

Unparsed selector of the directive, or `null` if there was no selector.

指令的未解析的选择器，如果没有选择器，则为 `null`。

Information about the content queries made by the directive.

有关该指令进行的内容查询的信息。

Information about the view queries made by the directive.

有关该指令进行的视图查询的信息。

Mappings indicating how the directive interacts with its host element \(host bindings,
listeners, etc\).

指示指令如何与其宿主元素（宿主绑定、侦听器等）交互的映射。

Information about usage of specific lifecycle events which require special treatment in the
code generator.

有关需要在代码生成器中特殊处理的特定生命周期事件的使用情况的信息。

Whether the directive uses NgOnChanges.

指令是否使用 NgOnChanges。

A mapping of inputs from class property names to binding property names, or to a tuple of
binding property name and class property name if the names are different.

输入从类属性名称到绑定属性名称的映射，如果名称不同，则映射到绑定属性名称和类属性名称的元组。

A mapping of outputs from class property names to binding property names, or to a tuple of
binding property name and class property name if the names are different.

输出从类属性名称到绑定属性名称的映射，如果名称不同，则映射到绑定属性名称和类属性名称的元组。

Whether or not the component or directive inherits from another class

组件或指令是否继承自另一个类

Whether or not the component or directive inherits its entire decorator from its base class.

组件或指令是否从其基类继承其整个装饰器。

Reference name under which to export the directive's type in a template,
if any.

在模板中导出指令类型的引用名称（如果有）。

The list of providers defined in the directive.

指令中定义的提供者列表。

Whether or not the component or directive is standalone.

组件或指令是否是独立的。

Whether or not the component or directive is signal-based.

组件或指令是否基于信号。

Additional directives applied to the directive host.

应用于指令宿主的附加指令。

Specifies how a list of declaration type references should be emitted into the generated code.

指定应如何将声明类型引用列表发出到生成的代码中。

The list of declarations is emitted into the generated code as is.

声明列表会按原样发出到生成的代码中。

The list of declarations is emitted into the generated code wrapped inside a closure, which
is needed when at least one declaration is a forward reference.

声明列表会发出到包装在闭包中的生成代码中，当至少有一个声明是前向引用时，需要它。

Similar to `Closure`, with the addition that the list of declarations can contain individual
items that are themselves forward references. This is relevant for JIT compilations, as
unwrapping the forwardRef cannot be done statically so must be deferred. This mode emits
the declaration list using a mapping transform through `resolveForwardRef` to ensure that
any forward references within the list are resolved when the outer closure is invoked.

类似于 `Closure`，只是声明列表可以包含本身是前向引用的单个条目。这与 JIT
编译有关，因为无法静态完成 forwardRef 的解包，因此必须延迟。此模式使用通过 `resolveForwardRef`
的映射转换来发出声明列表，以确保在调用外闭包时解析列表中的任何前向引用。

Consider the case where the runtime has captured two declarations in two distinct values:

考虑运行时捕获了两个不同值中的两个声明的情况：

This mode would emit the declarations captured in `dirA` and `dirB` as follows:

此模式将发出在 `dirA` 和 `dirB` 中捕获的声明，如下所示：

Information needed to compile a component for the render3 runtime.

为 render3 运行时编译组件所需的信息。

Information about the component's template.

有关组件模板的信息。

Parsed nodes of the template.

模板的解析节点。

Any ng-content selectors extracted from the template. Contains `*` when an ng-content
element without selector is present.

从模板中提取的任何 ng-content 选择器。当存在不带选择器的 ng-content 元素时包含 `*`。

Specifies how the 'directives' and/or `pipes` array, if generated, need to be emitted.

指定需要如何发出“directives”和/或 `pipes` 数组（如果生成）。

A collection of styling data that will be applied and scoped to the component.

将应用于组件并限定其范围的样式数据的集合。

An encapsulation policy for the component's styling.
Possible values:

组件样式的封装策略。可能的值：

`ViewEncapsulation.Emulated`: Apply modified component styles in order to emulate
                              a native Shadow DOM CSS encapsulation behavior.

`ViewEncapsulation.Emulated`：应用修改后的组件样式以模拟原生 Shadow DOM CSS 封装行为。

`ViewEncapsulation.None`: Apply component styles globally without any sort of encapsulation.

`ViewEncapsulation.None`：全局应用组件样式，无需任何类型的封装。

`ViewEncapsulation.ShadowDom`: Use the browser's native Shadow DOM API to encapsulate styles.

`ViewEncapsulation.ShadowDom`：使用浏览器的原生 Shadow DOM API 来封装样式。

A collection of animation triggers that will be used in the component template.

将在组件模板中使用的动画触发器的集合。

The list of view providers defined in the component.

组件中定义的视图提供者列表。

Path to the .ts file in which this template's generated code will be included, relative to
the compilation root. This will be used to generate identifiers that need to be globally
unique in certain contexts \(such as g3\).

将包含此模板生成的代码的 .ts
文件的路径，相对于编译根。这将用于生成在某些上下文中需要全局唯一的标识符（例如 g3）。

Whether translation variable name should contain external message id
\(used by Closure Compiler's output of `goog.getMsg` for transition period\).

转换变量名称是否应该包含外部消息 id（供 Closure Compiler 的 `goog.getMsg` 输出在过渡期使用）。

Overrides the default interpolation start and end delimiters \({{ and }}\).

覆盖默认的插值开始和结束分隔符（{{ 和 }}）。

Strategy used for detecting changes in the component.

用于检测组件更改的策略。

Metadata for an individual input on a directive.

指令中单个输入的元数据。

A dependency that's used within a component template.

在组件模板中使用的依赖项。

The type of the dependency as an expression.

作为表达式的依赖项的类型。

A dependency that's used within a component template

在组件模板中使用的依赖项

Information about a directive that is used in a component template. Only the stable, public
facing information of the directive is stored here.

有关组件模板中使用的指令的信息。只有该指令的稳定、面向公众的信息会存储在这里。

The selector of the directive.

指令的选择器。

The binding property names of the inputs of the directive.

指令输入的绑定属性名称。

The binding property names of the outputs of the directive.

指令输出的绑定属性名称。

Name under which the directive is exported, if any \(exportAs in Angular\). Null otherwise.

导出指令的名称（如果有）（在 Angular 中为 exportAs）。否则为空。

If true then this directive is actually a component; otherwise it is not.

如果为 true，则此指令实际上是一个组件；否则不是。

Information needed to compile a query \(view or content\).

编译查询（视图或内容）所需的信息。

Name of the property on the class to update with query results.

要使用查询结果更新的类属性的名称。

Whether to read only the first matching result, or an array of results.

是仅读取第一个匹配的结果，还是读取结果数组。

Either an expression representing a type or `InjectionToken` for the query
predicate, or a set of string selectors.

表示查询谓词的类型或 `InjectionToken` 的表达式，或一组字符串选择器。

Whether to include only direct children or all descendants.

是仅包括直接子项还是包括所有后代。

If the `QueryList` should fire change event only if actual change to query was computed \(vs old
behavior where the change was fired whenever the query was recomputed, even if the recomputed
query resulted in the same list.\)

如果仅在计算了对查询的实际更改时，`QueryList` 应该触发 change
事件（与旧行为相比，每当重新计算查询时都会触发更改，即使重新计算的查询产生了同一个列表。）

An expression representing a type to read from each matched node, or null if the default value
for a given node is to be returned.

表示要从每个匹配的节点读取的类型的表达式，如果要返回给定节点的默认值，则为 null。

Whether or not this query should collect only static results.

此查询是否应该仅收集静态结果。

If static is true, the query's results will be set on the component after nodes are created,
but before change detection runs. This means that any results that relied upon change detection
to run \(e.g. results inside *ngIf or *ngFor views\) will not be collected. Query results are
available in the ngOnInit hook.

如果 static 为
true，则查询的结果将在创建节点之后、变更检测运行之前在组件上设置。这意味着任何依赖变更检测运行的结果（例如*ngIf
或*ngFor 视图中的结果）都不会被收集。查询结果在 ngOnInit 钩子中提供。

If static is false, the query's results will be set on the component after change detection
runs. This means that the query results can contain nodes inside *ngIf or *ngFor views, but
the results will not be available in the ngOnInit hook \(only in the ngAfterContentInit for
content hooks and ngAfterViewInit for view hooks\).

如果 static 为 false，则查询的结果将在变更检测运行后在组件上设置。这意味着查询结果可以包含*ngIf
或*ngFor 视图中的节点，但结果将在 ngOnInit 钩子中不可用（仅在 ngAfterContentInit
中用于内容钩子，在 ngAfterViewInit 中用于视图钩子）。

Mappings indicating how the class interacts with its
host element \(host bindings, listeners, etc\).

表明类如何与其宿主元素（宿主绑定、侦听器等）交互的映射。

A mapping of attribute binding keys to `o.Expression`s.

属性绑定键到 `o.Expression` 的映射。

A mapping of event binding keys to unparsed expressions.

事件绑定键到未解析的表达式的映射。

A mapping of property binding keys to unparsed expressions.

属性绑定键到未解析表达式的映射。

Information needed to compile a host directive for the render3 runtime.

为 render3 运行时编译宿主指令所需的信息。

An expression representing the host directive class itself.

表示宿主指令类本身的表达式。

Whether the expression referring to the host directive is a forward reference.

引用宿主指令的表达式是否为前向引用。

Inputs from the host directive that will be exposed on the host.

来自将在宿主上公开的宿主指令的输入。

Outputs from the host directive that will be exposed on the host.

将在宿主上公开的宿主指令的输出。