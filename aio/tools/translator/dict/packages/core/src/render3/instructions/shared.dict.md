Current `TView`.

当前 `TView`。

Current `LView`.

当前的 `LView`。

Invoke `HostBindingsFunction`s for view.

调用 `HostBindingsFunction` 进行查看。

This methods executes `TView.hostBindingOpCodes`. It is used to execute the
`HostBindingsFunction`s associated with the current `LView`.

此方法执行 `TView.hostBindingOpCodes`。它用于执行与当前 `LView` 关联的 `HostBindingsFunction`。

The current `TView`.

当前的 `TView`。

The index at which the TNode should be saved \(null if view, since they are not
saved\).

应该保存 TNode 的索引（如果是视图则为 null，因为它们未被保存）。

The type of TNode to create

要创建的 TNode 的类型

The native element for this node, if applicable

此节点的原生元素（如果适用）

The tag name of the associated native element, if applicable

关联的原生元素的标签名称（如果适用）

Any attrs for the native element, if applicable

原生元素的任何属性（如果适用）

Create and stores the TNode, and hooks it up to the tree.

创建并存储 TNode，并将其挂接到树上。

`TView` associated with `LView`

`TView` 关联 `LView`

The `LView` containing the blueprint to adjust

包含要调整的蓝图的 `LView`

The number of slots to alloc in the LView, should be >0

LView 中要分配的插槽数，应 >0

Initial value to store in blueprint

存储在蓝图中的初始值

When elements are created dynamically after a view blueprint is created \(e.g. through
`i18nApply()`\), we need to adjust the blueprint for future
template passes.

当在创建视图蓝图后动态创建元素时（例如通过 `i18nApply()` ），我们需要为将来的模板通道调整蓝图。

Creates directive instances.

创建指令实例。

Takes a list of local names and indices and pushes the resolved local variable values
to LView in the same order as they are loaded in the template with load\(\).

获取局部名称和索引的列表，并将已解析的局部变量值推送到 LView，其顺序与使用 load\(\) 加载到模板中的顺序相同。

Gets TView from a template function or creates a new TView
if it doesn't already exist.

从模板函数获取 TView 或创建一个新的 TView（如果它尚不存在）。

Type of `TView`.

`TView` 的类型。

Declaration location of this `TView`.

此 `TView` 的声明位置。

Template function

模板功能

The number of nodes, local refs, and pipes in this template

此模板中的节点数、本地引用数和管道数

Registry of directives for this view

此视图的指令注册表

Registry of pipes for this view

此视图的管道注册表

View queries for this view

查看此视图​​的查询

Schemas for this view

此视图的架构

Constants for this view

此视图的常量

Creates a TView instance

创建一个 TView 实例

the renderer used to locate the element.

用于定位元素的渲染器。

Render element or CSS selector to locate the element.

渲染元素或 CSS 选择器以定位元素。

View Encapsulation defined for component that requests host element.

查看为请求宿主元素的组件定义的封装。

Root view injector instance.

根视图注入器实例。

Locates the host native element, used for bootstrapping existing nodes into rendering pipeline.

定位宿主原生元素，用于将现有节点引导到渲染管道中。

the app root HTML Element

应用程序根 HTML 元素

Applies any root element transformations that are needed. If hydration is enabled,
this will process corrupted text nodes.

应用任何需要的根元素转换。如果启用水合，这将处理损坏的文本节点。

Reference to a function that applies transformations to the root HTML element
of an app. When hydration is enabled, this processes any corrupt text nodes
so they are properly hydratable on the client.

对将转换应用到应用程序的根 HTML 元素的函数的引用。启用水合后，这会处理任何损坏的文本节点，以便它们在客户端上可以正确地水合。

Processes text node markers before hydration begins. This replaces any special comment
nodes that were added prior to serialization are swapped out to restore proper text
nodes before hydration.

在水合开始之前处理文本节点标记。这将替换在序列化之前添加的任何特殊注释节点，这些节点在水合之前被换出以恢复正确的文本节点。

Sets the implementation for the `applyRootElementTransform` function.

设置 `applyRootElementTransform` 函数的实现。

Saves context for this cleanup function in LView.cleanupInstances.

在 LView.cleanupInstances 中保存此清理函数的上下文。

On the first template pass, saves in TView:

在第一个模板传递中，保存在 TView 中：

Cleanup function

清理功能

Index of context we just saved in LView.cleanupInstances

我们刚刚保存在 LView.cleanupInstances 中的上下文索引

`TView` to which this `TNode` belongs

此 `TNode` 所属的 `TView`

Parent `TNode`

父 `TNode`

The type of the node

节点的类型

The index of the TNode in TView.data, adjusted for HEADER_OFFSET

TView.data 中 TNode 的索引，针对 HEADER_OFFSET 进行了调整

The tag name of the node

节点的标签名称

The attributes defined on this node

在此节点上定义的属性

the TNode object

TNode 对象

Constructs a TNode object from the arguments.

从参数构造一个 TNode 对象。

Input/output mapping from the directive definition.

来自指令定义的输入/输出映射。

Index of the directive.

指令的索引。

Object in which to store the results.

存储结果的对象。

Object used to alias or filter out properties for host directives.
If the mapping is provided, it'll act as an allowlist, as well as a mapping of what public
name inputs/outputs should be exposed under.

用于为宿主指令设置别名或过滤掉属性的对象。如果提供了映射，它将充当白名单，以及应在其下公开哪些公共名称输入/输出的映射。

Generates the `PropertyAliases` data structure from the provided input/output mapping.

从提供的输入/输出映射生成 `PropertyAliases` 数据结构。

Initializes data structures required to work with directive inputs and outputs.
Initialization is done for all directives matched on a given TNode.

初始化处理指令输入和输出所需的数据结构。对在给定 TNode 上匹配的所有指令进行初始化。

Mapping between attributes names that don't correspond to their element property names.

与其元素属性名称不对应的属性名称之间的映射。

Performance note: this function is written as a series of if checks \(instead of, say, a property
object lookup\) for performance reasons - the series of `if` checks seems to be the fastest way of
mapping property names. Do NOT change without benchmarking.

性能说明：出于性能原因，此函数被编写为一系列 if 检查（而不是属性对象查找）—— `if` 检查系列似乎是映射属性名称的最快方式。不要在没有基准测试的情况下进行更改。

Note: this mapping has to be kept in sync with the equally named mapping in the template
type-checking machinery of ngtsc.

注意：此映射必须与 ngtsc 模板类型检查机制中同名映射保持同步。

If node is an OnPush component, marks its LView dirty.

如果节点是 OnPush 组件，则将其 LView 标记为脏。

Resolve the matched directives on a node.

解析节点上匹配的指令。

Initializes the data structures necessary for a list of directives to be instantiated.

初始化要实例化的指令列表所需的数据结构。

`TView` to which the `hostBindings` should be added.

应将 `hostBindings` 添加到的 `TView`。

`TNode` the element which contains the directive

`TNode` 包含指令的元素

Directive index in view.

指令索引在视图中。

Where will the directive's vars be stored

指令的变量存储在哪里

`ComponentDef`/`DirectiveDef`, which contains the `hostVars`/`hostBindings` to add.

`ComponentDef` / `DirectiveDef`，其中包含要添加的 `hostVars` / `hostBindings`。

Add `hostBindings` to the `TView.hostBindingOpCodes`.

将 `hostBindings` 添加到 `TView.hostBindingOpCodes`。

Returns the last selected element index in the `HostBindingOpCodes`

返回 `HostBindingOpCodes` 中最后选择的元素索引

For perf reasons we don't need to update the selected element index in `HostBindingOpCodes` only
if it changes. This method returns the last index \(or '0' if not found.\)

出于性能原因，我们不需要仅在 `HostBindingOpCodes` 中更改的选定元素索引进行更新。此方法返回最后一个索引（如果未找到，则返回“0”。）

Selected element index are only the ones which are negative.

所选元素索引仅是负数。

Instantiate all the directives that were previously resolved on the current node.

实例化先前在当前节点上解析的所有指令。

`DirectiveDef` which may contain the `hostBindings` function.

可能包含 `hostBindings` 函数的 `DirectiveDef`。

Instance of directive.

指令实例。

Invoke the host bindings in creation mode.

在创建模式下调用宿主绑定。

Matches the current node against all available selectors.
If a component is matched \(at most one\), it is returned in first position in the array.

将当前节点与所有可用的选择器匹配。如果一个组件匹配（最多一个），它将在数组的第一个位置返回。

Marks a given TNode as a component's host. This consists of:

将给定的 TNode 标记为组件的宿主。这包括：

setting the component offset on the TNode.

在 TNode 上设置组件偏移量。

storing index of component's host element so it will be queued for view refresh during CD.

存储组件的宿主元素的索引，因此它将在 CD 期间排队等待视图刷新。

Caches local names and their matching directive indices for query and template lookups.

缓存本地名称及其匹配的指令索引以用于查询和模板查找。

Builds up an export map as directives are created, so local refs can be quickly mapped
to their directive instances.

在创建指令时构建导出映射，因此本地引用可以快速映射到它们的指令实例。

the initial index

初始索引

Initializes the flags on the current node, setting all indices to the initial index,
the directive count to 0, and adding the isComponent flag.

初始化当前节点上的标志，将所有索引设置为初始索引，指令计数为 0，并添加 isComponent 标志。

Index where the directive will be stored in the Expando.

指令将存储在 Expando 中的索引。

Setup directive for instantiation.

用于实例化的设置指令。

We need to create a `NodeInjectorFactory` which is then inserted in both the `Blueprint` as well
as `LView`. `TView` gets the `DirectiveDef`.

我们需要创建一个 `NodeInjectorFactory`，然后将其插入到 `Blueprint` 和 `LView` 中。`TView` 获取 `DirectiveDef`。

Current LView that is being processed.

当前正在处理的 LView。

Index of the directive in directives array

指令数组中指令的索引

Instance of the directive on which to set the initial inputs

设置初始输入的指令实例

The directive def that contains the list of inputs

包含输入列表的指令 def

The static data for this node

该节点的静态数据

Sets initial input properties on directive instances from attribute data

从属性数据设置指令实例的初始输入属性

Input alias map that was generated from the directive def inputs.

从指令 def 输入生成的输入别名映射。

Index of the directive that is currently being processed.

当前正在处理的指令的索引。

Static attrs on this node.

此节点上的静态属性。

Generates initialInputData for a node and stores it in the template's static storage
so subsequent template invocations don't have to recalculate it.

为节点生成 initialInputData 并将其存储在模板的静态存储中，因此后续模板调用不必重新计算它。

initialInputData is an array containing values that need to be set as input properties
for directives on this node, but only once on creation. We need this array to support
the case where you set an &commat;Input property of a directive using attribute-like syntax.
e.g. if you have a `name` &commat;Input, you can set it once like this:

initialInputData 是一个数组，其中包含需要设置为该节点上指令的输入属性的值，但仅在创建时设置一次。我们需要这个数组来支持使用类属性语法设置指令的 &commat;Input 属性的情况。例如，如果你有一个 `name` &commat;Input，你可以像这样设置一次：

<my-component name="Bess"></my-component>



The host element for the LContainer

LContainer 的宿主元素

The host TNode for the LContainer

LContainer 的宿主 TNode

The parent view of the LContainer

LContainer 的父视图

The native comment element

原生评论元素

Optional a flag indicating the ViewContainerRef case

可选的标志，指示 ViewContainerRef 案例

Creates a LContainer, either from a container instruction, or for a ViewContainerRef.

从容器指令或 ViewContainerRef 创建 LContainer。

Refreshes all content queries declared by directives in a given view

刷新给定视图中指令声明的所有内容查询

The view where LView or LContainer should be added

应添加 LView 或 LContainer 的视图

Index of the view's host node in LView\[\], adjusted for header

LView\[\] 中视图宿主节点的索引，针对标头进行了调整

The LView or LContainer to add to the view tree

要添加到视图树的 LView 或 LContainer

The state passed in

国家通过了

Adds LView or LContainer to the end of the current view tree.

将 LView 或 LContainer 添加到当前视图树的末尾。

This structure will be used to traverse through nested views to remove listeners
and call onDestroy callbacks.

该结构将用于遍历嵌套视图以删除侦听器并调用 onDestroy 回调。

`TData` where meta-data will be saved;

将保存元数据的 `TData` ；

`TNode` that is a target of the binding;

作为绑定目标的 `TNode` ；

bound property name;

绑定属性名称；

binding index in `LView`

`LView` 中的绑定索引

static interpolation parts \(for property interpolations\)

静态插值部分（用于属性插值）

Stores meta-data for a property binding to be used by TestBed's `DebugElement.properties`.

存储属性绑定的元数据，以供 TestBed 的 `DebugElement.properties` 使用。

In order to support TestBed's `DebugElement.properties` we need to save, for each binding:

为了支持 TestBed 的 `DebugElement.properties`，我们需要为每个绑定保存：

a bound property name;

绑定的属性名称；

a static parts of interpolated strings;

内插字符串的静态部分；

A given property metadata is saved at the binding's index in the `TView.data` \(in other words, a
property binding metadata will be stored in `TView.data` at the same index as a bound value in
`LView`\). Metadata are represented as `INTERPOLATION_DELIMITER`-delimited string with the
following format:

给定的属性元数据保存在 `TView.data` 中绑定的索引处（换句话说，属性绑定元数据将存储在 `TView.data` 中与 `LView` 中的绑定值相同的索引处）。元数据表示为 `INTERPOLATION_DELIMITER` 分隔的字符串，格式如下：

`propertyName` for bound properties;

绑定属性的 `propertyName` ；

`propertyName�prefix�interpolation_static_part1�..interpolation_static_partN�suffix` for
interpolated properties.

`propertyName�prefix�interpolation_static_part1�..interpolation_static_partN�suffix` ...interpolation_static_partN.插值属性的后缀。

There are cases where the sub component's renderer needs to be included
instead of the current renderer \(see the componentSyntheticHost\* instructions\).

在某些情况下，需要包含子组件的渲染器而不是当前渲染器（请参阅 componentSyntheticHost\* 说明）。

Handles an error thrown in an LView.

处理 LView 中抛出的错误。

The current TView

当前的 TView

the `LView` which contains the directives.

包含指令的 `LView`。

mapping between the public "input" name and privately-known,
       possibly minified, property names to write to.

公共“输入”名称与要写入的私有已知（可能缩小）属性名称之间的映射。

Value to set.

要设置的值。

Set the inputs of directives at the current node to corresponding value.

将当前节点的指令输入设置为相应的值。

Updates a text binding at a given index in a given LView.

更新给定 LView 中给定索引处的文本绑定。