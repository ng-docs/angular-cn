Represents a container where one or more views can be attached to a component.

表示可以将一个或多个视图附着到组件中的容器。

Can contain *host views* \(created by instantiating a
component with the `createComponent()` method\), and *embedded views*
\(created by instantiating a `TemplateRef` with the `createEmbeddedView()` method\).

视图容器的实例还可以包含其它视图容器，以创建[层次化视图](guide/glossary#view-tree)。

A view container instance can contain other view containers,
creating a [view hierarchy](guide/glossary#view-hierarchy).

视图容器实例可以包含其他视图容器，从而创建[视图层次结构](guide/glossary#view-hierarchy)。

Anchor element that specifies the location of this container in the containing view.
Each view container can have only one anchor element, and each anchor element
can have only a single view container.

锚点元素用来指定本容器在父容器视图中的位置。每个视图容器都只能有一个锚点元素，每个锚点元素也只能属于一个视图容器。

Root elements of views attached to this container become siblings of the anchor element in
the rendered view.

可以在元素上放置注入了 `ViewContainerRef` 的 `Directive` 来访问元素的 `ViewContainerRef`。也可以使用 `ViewChild` 进行查询。

Access the `ViewContainerRef` of an element by placing a `Directive` injected
with `ViewContainerRef` on the element, or use a `ViewChild` query.

可以在元素上放置注入了 `ViewContainerRef` 的 `Directive` 来访问元素的 `ViewContainerRef`。也可以使用 `ViewChild` 进行查询。

The [dependency injector](guide/glossary#injector) for this view container.

该视图容器的[依赖注入器](guide/glossary#injector)。

No replacement

无更换

Destroys all views in this container.

销毁本容器中的所有视图。

The 0-based index of the view to retrieve.

所要获取视图的从 0 开始的索引。

The `ViewRef` instance, or null if the index is out of range.

`ViewRef` 实例，如果索引超出范围则为 null。

Retrieves a view from this container.

从该容器中获取一个视图。

The number of views.

观看次数。

Reports how many views are currently attached to this container.

报告目前附加到本容器的视图的数量。

The HTML template that defines the view.

用来定义视图的 HTML 模板。

The data-binding context of the embedded view, as declared
in the `<ng-template>` usage.

这个新视图的上下文环境，继承自所附着的元素。

Extra configuration for the created view. Includes:

创建的视图的额外配置。包括：

index: The 0-based index at which to insert the new view into this container.
       If not specified, appends the new view as the last entry.

index：将新视图插入此容器的从 0 开始的索引。如果未指定，则将新视图作为最后一个条目附加。

injector: Injector to be used within the embedded view.

注入器：要在嵌入式视图中使用的注入器。

The `ViewRef` instance for the newly created view.

新创建的视图的 `ViewRef` 实例。

Instantiates an embedded view and inserts it
into this container.

实例化一个内嵌视图，并把它插入到该容器中。

The 0-based index at which to insert the new view into this container.
If not specified, appends the new view as the last entry.

从 0 开始的索引，表示新视图要插入到当前容器的哪个位置。如果没有指定，就把新的视图追加到最后。

Component Type to use.

要使用的组件类型。

An object that contains extra parameters:

包含额外参数的对象：

index: the index at which to insert the new component's host view into this container.
       If not specified, appends the new view as the last entry.

index：将新组件的宿主视图插入此容器的索引。如果未指定，则将新视图作为最后一个条目附加。

injector: the injector to use as the parent for the new component.

注入器：用作新组件的父级的注入器。

ngModuleRef: an NgModuleRef of the component's NgModule, you should almost always provide
             this to ensure that all expected providers are available for the component
             instantiation.

ngModuleRef：组件的 NgModule 的 NgModuleRef，你几乎应该始终提供它以确保所有预期的提供程序都可用于组件实例化。

environmentInjector: an EnvironmentInjector which will provide the component's environment.
             you should almost always provide this to ensure that all expected providers
             are available for the component instantiation. This option is intended to
             replace the `ngModuleRef` parameter.

EnvironmentInjector：一个 EnvironmentInjector，它将提供组件的环境。你几乎应该始终提供此内容，以确保所有预期的提供者都可用于组件实例化。此选项旨在替换 `ngModuleRef` 参数。

projectableNodes: list of DOM nodes that should be projected through
                  [`<ng-content>`](api/core/ng-content) of the new component instance.

projectableNodes：应该通过新组件实例的[`<ng-content>`](api/core/ng-content)投影的 DOM 节点列表。

The new `ComponentRef` which contains the component instance and the host view.

包含组件实例和宿主视图的新 `ComponentRef`。

Instantiates a single component and inserts its host view into this container.

实例化一个 [`Component`](api/core/Component) 并把它的宿主视图插入到本容器的指定 `index` 处。

Component factory to use.

要使用的工厂。

The index at which to insert the new component's host view into this container.
If not specified, appends the new view as the last entry.

从 0 开始的索引，表示新组件的宿主视图要插入到当前容器的哪个位置。如果没有指定，就把新的视图追加到最后。

The injector to use as the parent for the new component.

一个注入器，将用作新组件的父注入器。

List of DOM nodes that should be projected through
    [`<ng-content>`](api/core/ng-content) of the new component instance.

可选值。默认值为 `undefined`。

An instance of the NgModuleRef that represent an NgModule.
This information is used to retrieve corresponding NgModule injector.

NgModuleRef 的一个实例，表示一个 NgModule。此信息用于检索相应的 NgModule 注入器。

Angular no longer requires component factories to dynamically create components.
    Use different signature of the `createComponent` method, which allows passing
    Component class directly.

Angular 不再需要组件工厂动态创建组件。使用 `createComponent` 方法的不同签名，该方法允许直接传递 Component 类。

The view to insert.

要插入的视图。

The 0-based index at which to insert the view.
If not specified, appends the new view as the last entry.

从 0 开始的索引，表示该视图要插入到当前容器的哪个位置。如果没有指定，就把新的视图追加到最后。

The inserted `ViewRef` instance.

插入的 `ViewRef` 实例。

Inserts a view into this container.

把一个视图插入到当前容器中。

The view to move.

要移动的视图。

The 0-based index of the new location.

新位置的从 0 开始的索引。

The moved `ViewRef` instance.

移动的 `ViewRef` 实例。

Moves a view to a new location in this container.

把一个视图移到容器中的新位置。

The view to query.

要查询的视图。

The 0-based index of the view's position in this container,
or `-1` if this container doesn't contain the view.

此容器中视图位置的从 0 开始的索引，如果此容器不包含视图，则为 `-1`。

Returns the index of a view within the current container.

返回某个视图在当前容器中的索引。

The 0-based index of the view to destroy.
If not specified, the last view in the container is removed.

要销毁的视图的从 0 开始的索引。如果不指定 `index`，则移除容器中的最后一个视图。

Destroys a view attached to this container

销毁附着在该容器中的某个视图

The 0-based index of the view to detach.
If not specified, the last view in the container is detached.

要分离的视图的从 0 开始的索引。如果省略 `index` 参数，则拆出最后一个 [`ViewRef`](api/core/ViewRef)。

Detaches a view from this container without destroying it.
Use along with `insert()` to move a view within the current container.

从当前容器中分离某个视图，但不会销毁它。通常会和 `insert()` 一起使用，在当前容器中移动一个视图。

The ViewContainerRef instance to use

要使用的 ViewContainerRef 实例

Creates a ViewContainerRef and stores it on the injector. Or, if the ViewContainerRef
already exists, retrieves the existing ViewContainerRef.

创建一个 ViewContainerRef 并将其存储在注入器上。或者，如果 ViewContainerRef 已经存在，则检索现有的 ViewContainerRef。

The node that is requesting a ViewContainerRef

请求 ViewContainerRef 的节点

The view to which the node belongs

节点所属的视图

Creates a ViewContainerRef and stores it on the injector.

创建一个 ViewContainerRef 并将其存储在注入器上。

Creates and inserts a comment node that acts as an anchor for a view container.

创建并插入充当视图容器锚点的注释节点。

If the host is a regular element, we have to insert a comment node manually which will
be used as an anchor when inserting elements. In this specific case we use low-level DOM
manipulation to insert it.

如果宿主是常规元素，我们必须手动插入一个注释节点，该节点将在插入元素时用作锚点。在这种特定情况下，我们使用低级 DOM 操作来插入它。

Regular creation mode: an anchor is created and
assigned to the `lContainer[NATIVE]` slot.

常规创建模式：创建一个锚点并将其分配给 `lContainer[NATIVE]` 插槽。

Hydration logic that looks up:

查找的水合逻辑：

an anchor node in the DOM and stores the node in `lContainer[NATIVE]`

DOM 中的锚节点并将该节点存储在 `lContainer[NATIVE]` 中

all dehydrated views in this container and puts them into `lContainer[DEHYDRATED_VIEWS]`

此容器中的所有脱水视图并将它们放入 `lContainer[DEHYDRATED_VIEWS]`