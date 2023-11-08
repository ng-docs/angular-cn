Definition of what a template rendering function should look like for a component.

定义组件的模板渲染函数应该是什么样的。

Definition of what a view queries function should look like.

视图查询函数应该是什么样子的定义。

Definition of what a content queries function should look like.

内容查询函数应该是什么样子的定义。

Flags passed into template functions to determine which blocks \(i.e. creation, update\)
should be executed.

传递给模板函数的标志，以确定应该执行哪些块（即创建、更新）。

Typically, a template runs both the creation block and the update block on initialization and
subsequent runs only execute the update block. However, dynamically created views require that
the creation block be executed separately from the update block \(for backwards compat\).

通常，模板在初始化时会同时运行 Creation 块和 update 块，随后的运行仅执行 update
块。但是，动态创建的视图要求创建块与更新块分开执行（用于向后兼容）。

A subclass of `Type` which has a static `ɵcmp`:`ComponentDef` field making it
consumable for rendering.

`Type` 的子类，具有静态 `ɵcmp` : `ComponentDef` 字段，使其可用于渲染。

A subclass of `Type` which has a static `ɵdir`:`DirectiveDef` field making it
consumable for rendering.

`Type` 的子类，具有静态 `ɵdir` : `DirectiveDef` 字段，使其可用于渲染。

A subclass of `Type` which has a static `ɵpipe`:`PipeDef` field making it
consumable for rendering.

`Type` 的子类，具有静态 `ɵpipe` : `PipeDef` 字段，使其可用于渲染。

type metadata specifying the selector of the directive or component

指定指令或组件的选择器的类型元数据

See: {&commat;link defineDirective}

请参阅：{&commat;link defineDirective}

Runtime link information for Directives.

指令的运行时链接信息。

This is an internal data structure used by the render to link
directives into templates.

这是渲染器用来将指令链接到模板的内部数据结构。

NOTE: Always use `defineDirective` function to create this object,
never create the object directly since the shape of this object
can change between versions.

注意：始终使用 `defineDirective`
函数来创建此对象，永远不要直接创建对象，因为此对象的形状可以在版本之间更改。

A dictionary mapping the inputs' minified property names to their public API names, which
are their aliases if any, or their original unminified property names
\(as in `@Input('alias') propertyName: any;`\).

将输入的缩小属性名称映射到它们的公共 API
名称的字典，这些名称是它们的别名（如果有）或它们的原始未缩小属性名称（如 `@Input('alias')
propertyName: any;`）。

A dictionary mapping the private names of inputs to their transformation functions.
Note: the private names are used for the keys, rather than the public ones, because public
names can be re-aliased in host directives which would invalidate the lookup.

将输入的私有名称映射到它们的转换函数的字典。注意：私有名称用于密钥，而不是公共名称，因为公共名称可以在宿主指令中重新命名，这会使查找无效。

Contains the raw input information produced by the compiler. Can be
used to do further processing after the `inputs` have been inverted.

包含编译器生成的原始输入信息。可用于在 `inputs` 反转后进行进一步处理。

This is only here because `NgOnChanges` incorrectly uses declared name instead of
public or minified name.

这只是在这里，因为 `NgOnChanges` 错误地使用了声明的名称而不是公共名称或缩小名称。

A dictionary mapping the outputs' minified property names to their public API names, which
are their aliases if any, or their original unminified property names
\(as in `@Output('alias') propertyName: any;`\).

将输出的缩小属性名称映射到它们的公共 API
名称的字典，这些名称是它们的别名（如果有）或它们的原始未缩小属性名称（如 `@Output('alias')
propertyName: any;`）。

Function to create and refresh content queries associated with a given directive.

用于创建和刷新与给定指令关联的内容查询的函数。

Query-related instructions for a directive. Note that while directives don't have a
view and as such view queries won't necessarily do anything, there might be
components that extend the directive.

指令的与查询相关的操作指南。请注意，尽管指令没有视图，因此视图查询也不一定会做任何事情，但可能会有扩展该指令的组件。

Refreshes host bindings on the associated directive.

刷新关联指令上的宿主绑定。

The number of bindings in this directive `hostBindings` \(including pure fn bindings\).

此指令 `hostBindings` 中的绑定数量（包括纯 fn 绑定）。

Used to calculate the length of the component's LView array, so we
can pre-fill the array and set the host binding start index.

用于计算组件的 LView 数组的长度，因此我们可以预填充数组并设置宿主绑定开始索引。

Assign static attribute values to a host element.

将静态属性值分配给宿主元素。

This property will assign static attribute values as well as class and style
values to a host element. Since attribute values can consist of different types of values, the
`hostAttrs` array must include the values in the following format:

此属性会将静态属性值以及 class 和 style
值分配给宿主元素。由于属性值可以由不同类型的值组成，因此 `hostAttrs` 数组必须包含以下格式的值：

attrs = \[
  // static attributes \(like `title`, `name`, `id`...\)
  attr1, value1, attr2, value,

attrs = \[ // 静态属性（例如 `title` , `name` , `id` ...）attr1, value1, attr2, value,

// a single namespace value \(like `x:id`\)
  NAMESPACE_MARKER, namespaceUri1, name1, value1,

// 单个命名空间值（例如 `x:id`）NAMESPACE_MARKER, namespaceUri1, name1, value1,

// another single namespace value \(like `x:name`\)
  NAMESPACE_MARKER, namespaceUri2, name2, value2,

// 另一个单个命名空间值（例如 `x:name`）NAMESPACE_MARKER, namespaceUri2, name2, value2,

// a series of CSS classes that will be applied to the element \(no spaces\)
  CLASSES_MARKER, class1, class2, class3,

// 将应用于元素的一系列 CSS 类（无空格）CLASSES_MARKER, class1, class2, class3,

// a series of CSS styles \(property + value\) that will be applied to the element
  STYLES_MARKER, prop1, value1, prop2, value2
\]

// 将应用于元素 STYLES_MARKER,prop1, value1,prop2, value2 的一系列 CSS 样式（property + value）

All non-class and non-style attributes must be defined at the start of the list
first before all class and style values are set. When there is a change in value
type \(like when classes and styles are introduced\) a marker must be used to separate
the entries. The marker values themselves are set via entries found in the
`[AttributeMarker]` enum.

在设置所有类和风格值之前，必须首先在列表的开头定义所有非类和非风格属性。当值类型发生更改时（例如介绍类和样式时），必须使用标记来分隔条目。标记值本身是通过 `[AttributeMarker]` 枚举中的条目设置的。

Token representing the directive. Used by DI.

表示指令的标记。由 DI 使用。

Function that resolves providers and publishes them into the DI system.

解析提供程序并将它们发布到 DI 系统的函数。

The selectors that will be used to match nodes to this directive.

将用于将节点与此指令匹配的选择器。

Name under which the directive is exported \(for use with local references in template\)

导出指令的名称（与模板中的本地引用一起使用）

Whether this directive \(or component\) is standalone.

此指令（或组件）是否是独立的。

Whether this directive \(or component\) uses the signals authoring experience.

此指令（或组件）是否使用信号创作经验。

Factory function used to create a new directive instance. Will be null initially.
Populated when the factory is first requested by directive instantiation logic.

用于创建新指令实例的工厂函数。最初将为 null。在指令实例化逻辑首次请求工厂时填充。

The features applied to this directive

适用于本指令的特性

Definition that has been matched.

已匹配的定义。

List of all matches for a specified node. Will be mutated to include the
host directives.

指定节点的所有匹配列表。将被变异以包含宿主指令。

Mapping of directive definitions to their host directive
configuration. Host directives will be added to the map as they're being matched to the node.

将指令定义映射到它们的宿主指令配置。宿主指令将在与节点匹配时添加到地图中。

Function that will add the host directives to the list of matches during directive matching.
Patched onto the definition by the `HostDirectivesFeature`.

在指令匹配期间将宿主指令添加到匹配列表的函数。由 `HostDirectivesFeature` 修补到定义上。

Additional directives to be applied whenever the directive has been matched.

每当指令匹配时要应用的附加指令。

Runtime link information for Components.

组件的运行时链接信息。

This is an internal data structure used by the render to link
components into templates.

这是渲染器用来将组件链接到模板的内部数据结构。

NOTE: Always use `defineComponent` function to create this object,
never create the object directly since the shape of this object
can change between versions.

注意：始终使用 `defineComponent`
函数来创建此对象，切勿直接创建对象，因为此对象的形状可以在版本之间更改。

See: {&commat;link defineComponent}

请参阅：{&commat;link defineComponent}

Unique ID for the component. Used in view encapsulation and
to keep track of the injector in standalone components.

组件的唯一 ID。用于视图封装以及跟踪独立组件中的注入器。

The View template of the component.

组件的 View 模板。

Constants associated with the component's view.

与组件视图关联的常量。

An array of `ngContent[selector]` values that were found in the template.

在模板中找到的 `ngContent[selector]` 值的数组。

A set of styles that the component needs to be present for component to render correctly.

组件需要存在的一组样式，以便组件正确渲染。

The number of nodes, local refs, and pipes in this component template.

此组件模板中的节点、本地引用和管道的数量。

Used to calculate the length of the component's LView array, so we
can pre-fill the array and set the binding start index.

用于计算组件的 LView 数组的长度，因此我们可以预填充数组并设置绑定开始索引。

The number of bindings in this component template \(including pure fn bindings\).

此组件模板中的绑定数量（包括纯 fn 绑定）。

Query-related instructions for a component.

组件的与查询相关的操作指南。

The view encapsulation type, which determines how styles are applied to
DOM elements. One of

视图封装类型，它确定如何将样式应用于 DOM 元素。之一

`Emulated` \(default\): Emulate native scoping of styles.

`Emulated`（默认）：模拟样式的原生范围。

`Native`: Use the native encapsulation mechanism of the renderer.

`Native`：使用渲染器的原生封装机制。

`ShadowDom`: Use modern [ShadowDOM](https://w3c.github.io/webcomponents/spec/shadow/) and
    create a ShadowRoot for component's host element.

`ShadowDom`
：使用现代[ShadowDOM](https://w3c.github.io/webcomponents/spec/shadow/)并为组件的宿主元素创建一个
  ShadowRoot。

`None`: Do not provide any template or style encapsulation.

`None`：不提供任何模板或样式封装。

Defines arbitrary developer-defined data to be stored on a renderer instance.
This is useful for renderers that delegate to other renderers.

定义要存储在渲染器实例上的任意开发人员定义的数据。这对于委托给其他渲染器的渲染器很有用。

Whether or not this component's ChangeDetectionStrategy is OnPush

此组件的 ChangeDetectionStrategy 是否为 OnPush

Whether or not this component is signal-based.

该组件是否基于信号。

Registry of directives and components that may be found in this view.

可以在此视图中找到的指令和组件的注册表。

The property is either an array of `DirectiveDef`s or a function which returns the array of
`DirectiveDef`s. The function is necessary to be able to support forward declarations.

该属性是 `DirectiveDef` s 的数组或返回 `DirectiveDef` s
数组的函数。该函数是支持前向声明所必需的。

Registry of pipes that may be found in this view.

可以在此视图中找到的管道注册表。

The property is either an array of `PipeDefs`s or a function which returns the array of
`PipeDefs`s. The function is necessary to be able to support forward declarations.

该属性是 `PipeDefs` s 的数组或返回 `PipeDefs` s 数组的函数。该函数是支持前向声明所必需的。

Unfiltered list of all dependencies of a component, or `null` if none.

组件所有依赖项的未过滤列表，如果没有，则为 `null`。

The set of schemas that declare elements to be allowed in the component's template.

声明组件模板中允许的元素的模式集。

Ivy runtime uses this place to store the computed tView for the component. This gets filled on
the first run of component.

Ivy 运行时使用这个地方来存储组件的计算出的 tView。这会在组件第一次运行时填充。

A function added by the {&commat;link ɵɵStandaloneFeature} and used by the framework to create
standalone injectors.

由 {&commat;link ɵɵStandaloneFeature} 添加的函数，框架用它来创建独立的注入器。

Used to store the result of `noSideEffects` function so that it is not removed by closure
compiler. The property should never be read.

用于存储 `noSideEffects` 函数的结果，以便它不会被闭包编译器删除。永远不应该读取该属性。

Runtime link information for Pipes.

Pipes 的运行时链接信息。

This is an internal data structure used by the renderer to link
pipes into templates.

这是渲染器用来将管道链接到模板的内部数据结构。

NOTE: Always use `definePipe` function to create this object,
never create the object directly since the shape of this object
can change between versions.

注意：始终使用 `definePipe`
函数来创建此对象，切勿直接创建对象，因为此对象的形状可以在版本之间更改。

See: {&commat;link definePipe}

请参阅：{&commat;link definePipe}

Token representing the pipe.

表示管道的标记。

Pipe name.

管道名称。

Used to resolve pipe in templates.

用于解析模板中的管道。

Factory function used to create a new pipe instance. Will be null initially.
Populated when the factory is first requested by pipe instantiation logic.

用于创建新管道实例的工厂函数。最初将为 null。在管道实例化逻辑首次请求工厂时填充。

Whether or not the pipe is pure.

管道是否纯净。

Pure pipes result only depends on the pipe input and not on internal
state of the pipe.

纯管道的结果仅取决于管道输入，而不取决于管道的内部状态。

Whether this pipe is standalone.

此管道是否是独立的。

Marks a feature as something that {&commat;link InheritDefinitionFeature} will execute
during inheritance.

将特性标记为 {&commat;link InheritDefinitionFeature} 将在继承期间执行的东西。

NOTE: DO NOT SET IN ROOT OF MODULE! Doing so will result in tree-shakers/bundlers
identifying the change as a side effect, and the feature will be included in
every bundle.

注意：不要在模块根中设置！这样做将导致 tree-shakers/bundlers
将更改识别为副作用，并且该特性将包含在每个包中。

Runtime information used to configure a host directive.

用于配置宿主指令的运行时信息。

Class representing the host directive.

表示宿主指令的类。

Directive inputs that have been exposed.

已公开的指令输入。

Directive outputs that have been exposed.

已公开的指令输出。

Mapping between the public aliases of directive bindings and the underlying inputs/outputs that
they represent. Also serves as an allowlist of the inputs/outputs from the host directive that
the author has decided to expose.

指令绑定的公共别名与其表示的基础输入/输出之间的映射。还用作作者决定公开的宿主指令的输入/输出的白名单。

Mapping between a directive that was used as a host directive
and the configuration that was used to define it as such.

用作宿主指令的指令与用于定义它的配置之间的映射。

Function that can be used to transform incoming input values.

可用于转换传入输入值的函数。

Type used for directiveDefs on component definition.

用于组件定义上的 DirectiveDefs 的类型。

The function is necessary to be able to support forward declarations.

该函数是支持前向声明所必需的。

Type used for PipeDefs on component definition.

组件定义上用于 PipeDefs 的类型。