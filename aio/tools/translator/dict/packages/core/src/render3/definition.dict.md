Directive type, needed to configure the injector.

指令类型，需要配置注入器。

The selectors that will be used to match nodes to this directive.

将用于将节点与此指令匹配的选择器。

A map of input names.

输入名称的映射。

The format is in: `{[actualPropertyName: string]:(string|[string, string, Function])}`.

格式为：`{[actualPropertyName: string]:(string|[string, string, Function])}`。

Given:

给定：

is described as:

被描述为：

Which the minifier may translate to:

缩小器可能会翻译成：

This allows the render to re-construct the minified, public, and declared names
of properties.

这允许渲染器重新构造缩小的、公共的和声明的属性名称。

NOTE:

注意：

Because declared and public name are usually same we only generate the array
`['declared', 'public']` format when they differ.

因为声明名称和公共名称通常相同，所以我们只在它们不同时生成数组 `['declared', 'public']` 格式。

The reason why this API and `outputs` API is not the same is that `NgOnChanges` has
inconsistent behavior in that it uses declared names rather than minified or public. For
this reason `NgOnChanges` will be deprecated and removed in future version and this
API will be simplified to be consistent with `output`.

此 API 和 `outputs` API 不同的原因是 `NgOnChanges` 具有不一致的行为，因为它使用声明的名称而不是缩小的或公共的。出于这个原因，`NgOnChanges` 将在未来的版本中被弃用和删除，并且这个 API 将被简化以与 `output` 保持一致。

A map of output names.

输出名称的映射。

The format is in: `{[actualPropertyName: string]:string}`.

格式为：`{[actualPropertyName: string]:string}`。

Which the minifier may translate to: `{[minifiedPropertyName: string]:string}`.

缩小器可能会翻译成：`{[minifiedPropertyName: string]:string}`。

This allows the render to re-construct the minified and non-minified names
of properties.

这允许渲染器重新构造属性的缩小和非缩小名称。

A list of optional features to apply.

要应用的可选功能列表。

See: {&commat;link NgOnChangesFeature}, {&commat;link ProvidersFeature}, {&commat;link InheritDefinitionFeature}

请参阅：{&commat;link NgOnChangesFeature}、{&commat;link ProvidersFeature}、{&commat;link InheritDefinitionFeature}

Function executed by the parent template to allow child directive to apply host bindings.

由父模板执行以允许子指令应用宿主绑定的函数。

The number of bindings in this directive `hostBindings` \(including pure fn bindings\).

此指令 `hostBindings` 中的绑定数量（包括纯 fn 绑定）。

Used to calculate the length of the component's LView array, so we
can pre-fill the array and set the host binding start index.

用于计算组件的 LView 数组的长度，因此我们可以预填充数组并设置宿主绑定开始索引。

Assign static attribute values to a host element.

将静态属性值分配给宿主元素。

This property will assign static attribute values as well as class and style
values to a host element. Since attribute values can consist of different types of values,
the `hostAttrs` array must include the values in the following format:

此属性会将静态属性值以及 class 和 style
值分配给宿主元素。由于属性值可以由不同类型的值组成，因此 `hostAttrs` 数组必须包含以下格式的值：

All non-class and non-style attributes must be defined at the start of the list
first before all class and style values are set. When there is a change in value
type \(like when classes and styles are introduced\) a marker must be used to separate
the entries. The marker values themselves are set via entries found in the
[AttributeMarker] enum.

在设置所有类和样式值之前，必须首先在列表的开头定义所有非类和非样式属性。当值类型发生变化时（例如引入类和样式时），必须使用标记来分隔条目。标记值本身是通过在[AttributeMarker][AttributeMarker]枚举中找到的条目设置的。

Function to create instances of content queries associated with a given directive.

创建与给定指令关联的内容查询实例的函数。

Additional set of instructions specific to view query processing. This could be seen as a
set of instructions to be inserted into the template function.

特定于视图查询处理的附加指令集。这可以看作是一组要插入到模板函数中的指令。

Defines the name that can be used in the template to assign this directive to a variable.

定义一个名字，用于在模板中把该指令赋值给一个变量。

See: {&commat;link Directive.exportAs}

参见：{&commat;link Directive.exportAs}

Whether this directive/component is standalone.

此指令/组件是否独立。

Whether this directive/component is signal-based.

此指令/组件是否基于信号。

The number of nodes, local refs, and pipes in this component template.

此组件模板中的节点、本地引用和管道的数量。

Used to calculate the length of this component's LView array, so we
can pre-fill the array and set the binding start index.

用于计算这个组件的 LView 数组的长度，所以我们可以预填充数组并设置绑定起始索引。

The number of bindings in this component template \(including pure fn bindings\).

此组件模板中的绑定数量（包括纯 fn 绑定）。

Used to calculate the length of this component's LView array, so we
can pre-fill the array and set the host binding start index.

用于计算这个组件的 LView 数组的长度，所以我们可以预填充数组并设置宿主绑定起始索引。

Template function use for rendering DOM.

用于渲染 DOM 的模板函数。

This function has following structure.

该函数具有以下结构。

Common instructions are:
Creation mode instructions:

常用指令有：创建模式指令：

`elementStart`, `elementEnd`



Binding update instructions:

绑定更新说明：

Constants for the nodes in the component's view.
Includes attribute arrays, local definition arrays etc.

组件视图中节点的常量。包括属性数组、局部定义数组等。

An array of `ngContent[selector]` values that were found in the template.

在模板中找到的 `ngContent[selector]` 值的数组。

See: {&commat;link NgOnChangesFeature}, {&commat;link ProvidersFeature}

请参阅：{&commat;link NgOnChangesFeature}、{&commat;link ProvidersFeature}

Defines template and style encapsulation options available for Component's {&commat;link Component}.

定义可用于 Component 的 {&commat;link Component} 的模板和样式封装选项。

Defines arbitrary developer-defined data to be stored on a renderer instance.
This is useful for renderers that delegate to other renderers.

定义要存储在渲染器实例上的任意由开发人员定义的数据。这对于要委托其他渲染器实现的渲染器很有用。

see: animation

参见：动画

A set of styles that the component needs to be present for component to render correctly.

组件需要存在的一组样式，以便组件正确渲染。

The strategy that the default change detector uses to detect changes.
When set, takes effect the next time change detection is triggered.

默认变更检测器用来检测更改的策略。设置后，将在下次触发变更检测时生效。

Registry of directives, components, and pipes that may be found in this component's view.

可以在此组件的视图中找到的指令、组件和管道的注册表。

This property is either an array of types or a function that returns the array of types. This
function may be necessary to support forward declarations.

此属性是类型数组或返回类型数组的函数。此功能可能是支持前向声明所必需的。

The set of schemas that declare elements to be allowed in the component's template.

声明组件模板中允许的元素的模式集。

Create a component definition object.

创建组件定义对象。

Example

范例

Generated next to NgModules to monkey-patch directive and pipe references onto a component's
definition, when generating a direct reference in the component file would otherwise create an
import cycle.

在 NgModules 旁边生成，用于 monkey-patch 指令和管道引用到组件的定义，当在组件文件中生成直接引用时，否则会创建一个导入循环。

See [this explanation](https://hackmd.io/Odw80D0pR6yfsOjg_7XCJg?view) for more details.

有关更多详细信息，请参阅[此说明](https://hackmd.io/Odw80D0pR6yfsOjg_7XCJg?view)。

Token representing the module. Used by DI.

表示模块的标记。由 DI 使用。

List of components to bootstrap.

要引导的组件列表。

List of components, directives, and pipes declared by this module.

此模块声明的组件、指令和管道的列表。

List of modules or `ModuleWithProviders` imported by this module.

此模块导入的模块或 `ModuleWithProviders` 列表。

List of modules, `ModuleWithProviders`, components, directives, or pipes exported by this
module.

此模块导出的模块、 `ModuleWithProviders` 、组件、指令或管道的列表。

The set of schemas that declare elements to be allowed in the NgModule.

声明 NgModule 中允许的元素的模式集。

Unique ID for the module that is used with `getModuleFactory`.

与 `getModuleFactory` 一起使用的模块的唯一 ID。

Adds the module metadata that is necessary to compute the module's transitive scope to an
existing module definition.

将计算模块的传递范围所需的模块元数据添加到现有模块定义中。

Scope metadata of modules is not used in production builds, so calls to this function can be
marked pure to tree-shake it from the bundle, allowing for all referenced declarations
to become eligible for tree-shaking as well.

模块的范围元数据不在生产构建中使用，因此可以将对该函数的调用标记为 pure 以从 bundle 中对其进行 tree-shaking，从而允许所有引用的声明也有资格进行 tree-shaking。

Inverts an inputs or outputs lookup such that the keys, which were the
minified keys, are part of the values, and the values are parsed so that
the publicName of the property is the new key

反转输入或输出查找，使得作为缩小键的键成为值的一部分，并且解析值以便属性的 publicName 成为新键

e.g. for

例如为了

will be serialized as

将被序列化为

which is than translated by the minifier as:

然后由缩小器翻译为：

becomes: \(public name => minifiedName\)

变成：（公共名称=> minifiedName）

Optionally the function can take `secondary` which will result in: \(public name => declared name\)

可选地，函数可以采取 `secondary`，这将导致：（公共名称=>声明的名称）

Create a directive definition object.

创建指令定义对象。

Pipe definition generated by the compiler

编译器生成的管道定义

Create a pipe definition object.

创建管道定义对象。

Name of the pipe. Used for matching pipes in template to pipe defs.

管道的名称。用于将模板中的管道匹配到管道定义。

Pipe class reference. Needed to extract pipe lifecycle hooks.

管道类参考。需要提取管道生命周期挂钩。

Whether the pipe is pure.

管道是否纯净。

Whether the pipe is standalone.

管道是否是独立的。

The following getter methods retrieve the definition from the type. Currently the retrieval
honors inheritance, but in the future we may change the rule to require that definitions are
explicit. This would require some sort of migration strategy.

以下 getter 方法从类型中检索定义。目前检索尊重继承，但将来我们可能会更改规则以要求定义是明确的。这将需要某种迁移策略。

A reference to a Component, Directive or Pipe.

对组件、指令或管道的引用。

Checks whether a given Component, Directive or Pipe is marked as standalone.
This will return false if passed anything other than a Component, Directive, or Pipe class
See [this guide](/guide/standalone-components) for additional information:

检查给定的组件、指令或管道是否被标记为独立的。如果传递的不是组件、指令或管道类，这将返回 false 请参阅[本指南](/guide/standalone-components)以获取更多信息：

A map that contains the generated component IDs and type.

包含生成的组件 ID 和类型的映射。

A method can returns a component ID from the component definition using a variant of DJB2 hash
algorithm.

方法可以使用 DJB2 哈希算法的变体从组件定义中返回组件 ID。