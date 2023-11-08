Parent LFrame.

父 LFrame。

This is needed when `leaveView` is called to restore the previous state.

当 `leaveView` 来恢复以前的状态时，这是需要的。

Child LFrame.

子 LFrame。

This is used to cache existing LFrames to relieve the memory pressure.

这用于缓存现有的 LFrame 以减轻内存压力。

State of the current view being processed.

正在处理的当前视图的状态。

An array of nodes \(text, element, container, etc\), pipes, their bindings, and
any local variables that need to be stored between invocations.

节点（文本、元素、容器等）、管道、它们的绑定以及需要在调用之间存储的任何局部变量的数组。

Current `TView` associated with the `LFrame.lView`.

与 `TView` 关联的当前 `LFrame.lView`。

One can get `TView` from `lFrame[TVIEW]` however because it is so common it makes sense to
store it in `LFrame` for perf reasons.

可以从 `lFrame[TVIEW]` 获取 `TView`，但是因为它很常见，出于性能的原因将它存储在 `LFrame`
中是有意义的。

Used to set the parent property when nodes are created and track query results.

用于在创建节点时设置 parent 属性并跟踪查询结果。

This is used in conjunction with `isParent`.

这与 `isParent` 结合使用。

If `isParent` is:

如果 `isParent` 是：

`true`: then `currentTNode` points to a parent node.

`true`：然后 `currentTNode` 指向父节点。

`false`: then `currentTNode` points to previous node \(sibling\).

`false`：然后 `currentTNode` 指向前一个节点（同级）。

Index of currently selected element in LView.

LView 中当前所选元素的索引。

Used by binding instructions. Updated as part of advance instruction.

由绑定说明使用。作为预先说明的一部分进行了更新。

Current pointer to the binding index.

指向绑定索引的当前指针。

The last viewData retrieved by nextContext\(\).
Allows building nextContext\(\) and reference\(\) calls.

nextContext\(\) 检索的最后一个 viewData。允许构建 nextContext\(\) 和 reference\(\) 调用。

e.g. const inner = x\(\).$implicit; const outer = x\(\).$implicit;

例如 const inner = x\(\).$implicit; constouter = x\(\).$implicit;

Store the element depth count. This is used to identify the root elements of the template
so that we can then attach patch data `LView` to only those elements. We know that those
are the only places where the patch data could change, this way we will save on number
of places where tha patching occurs.

存储元素深度计数。这用于标识模板的根元素，以便我们可以将补丁数据 `LView`
仅附加到这些元素。我们知道这些是唯一可以更改补丁数据的地方，这样我们将节省发生补丁的地方的数量。

Current namespace to be used when creating elements

创建元素时要使用的当前命名空间

The root index from which pure function instructions should calculate their binding
indices. In component views, this is TView.bindingStartIndex. In a host binding
context, this is the TView.expandoStartIndex + any dirs/hostVars before the given dir.

纯函数指令应该从中计算其绑定索引的根索引。在组件视图中，这是 TView.bindingStartIndex
。在宿主绑定上下文中，这是 TView.expandoStartIndex + 给定目录之前的任何 dirs/hostVars。

Current index of a View or Content Query which needs to be processed next.
We iterate over the list of Queries and increment current query index at every step.

接下来需要处理的视图或内容查询的当前索引。我们迭代查询列表，并在每一步都增加当前查询索引。

When host binding is executing this points to the directive index.
`TView.data[currentDirectiveIndex]` is `DirectiveDef`
`LView[currentDirectiveIndex]` is directive instance.

当执行宿主绑定时，this 指向了指令索引。`TView.data[currentDirectiveIndex]` is `DirectiveDef`
`LView[currentDirectiveIndex]` 是指令实例。

Are we currently in i18n block as denoted by `ɵɵelementStart` and `ɵɵelementEnd`.

我们当前是否在 i18n 块中，用 `ɵɵelementStart` 和 `ɵɵelementEnd` 表示。

This information is needed because while we are in i18n block all elements must be pre-declared
in the translation. \(i.e. `Hello �#2�World�/#2�!` pre-declares element at `�#2�` location.\)
This allocates `TNodeType.Placeholder` element at location `2`. If translator removes `�#2�`
from translation than the runtime must also ensure tha element at `2` does not get inserted
into the DOM. The translation does not carry information about deleted elements. Therefor the
only way to know that an element is deleted is that it was not pre-declared in the translation.

需要这些信息，因为当我们在 i18n 块中时，所有元素都必须在翻译中预先声明。（即 `Hello
�#2�World�/#2�!` 在 `�#2�` 位置预声明元素。）这会在位置 `2` 分配 `TNodeType.Placeholder`
元素。如果翻译器从翻译中删除 `�#2�` ”，则运行时还必须确保 `2` 处的元素不会插入到 DOM
中。翻译不包含有关已删除元素的信息。因此，知道一个元素被删除的唯一方法是它没有在翻译中预先声明。

This flag works by ensuring that elements which are created without pre-declaration
\(`TNodeType.Placeholder`\) are not inserted into the DOM render tree. \(It does mean that the
element still gets instantiated along with all of its behavior [directives]\)

此标志通过确保没有预声明 \( `TNodeType.Placeholder` \) 创建的元素不会插入到 DOM 渲染树来工作。
（这确实意味着该元素仍然与其所有行为[指令][directives]一起被实例化）

All implicit instruction state is stored here.

所有隐式指令状态都存储在这里。

It is useful to have a single object where all of the state is stored as a mental model
\(rather it being spread across many different variables.\)

有一个所有状态都作为心智模型存储的对象会很有用（而不是分散在许多不同的变量中）。

PERF NOTE: Turns out that writing to a true global variable is slower than
having an intermediate object with properties.

PERF 注意：事实证明，写入真正的全局变量比具有具有属性的中间对象慢。

Current `LFrame`

当前 `LFrame`

`null` if we have not called `enterView`

如果我们没有调用 `enterView`，则为 `null`

Stores whether directives should be matched to elements.

存储指令是否应该与元素匹配。

When template contains `ngNonBindable` then we need to prevent the runtime from matching
directives on children of that element.

当模板包含 `ngNonBindable` 时，我们需要防止运行时匹配该元素子项上的指令。

Example:

示例：

Stores the root TNode that has the 'ngSkipHydration' attribute on it for later reference.

存储其上具有“ngSkipHydration”属性的根 TNode 以供以后参考。

In this mode, any changes in bindings will throw an ExpressionChangedAfterChecked error.

在此模式下，绑定中的任何更改都将抛出 ExpressionChangedAfterChecked 错误。

Necessary to support ChangeDetectorRef.checkNoChanges\(\).

支持 ChangeDetectorRef.checkNoChanges\(\) 所必需的。

The `checkNoChanges` function is invoked only in ngDevMode=true and verifies that no unintended
changes exist in the change detector or its children.

`checkNoChanges` 函数仅在 ngDevMode=true 时调用，并验证变更检测器或其子项中不存在意外更改。

Returns true if the instruction state stack is empty.

如果指令状态堆栈为空，则返回 true。

Intended to be called from tests only \(tree shaken otherwise\).

旨在仅从测试中调用（否则树摇晃）。

boolean



Returns true if currently inside a skip hydration block.

如果当前在 skip hydration 块中，则返回 true。

the current TNode

当前 TNode

Returns true if this is the root TNode of the skip hydration block.

如果这是 skip hydration 块的根 TNode，则返回 true。

Enables directive matching on elements.

在元素上启用指令匹配。

Sets a flag to specify that the TNode is in a skip hydration block.

设置一个标志以指定 TNode 处于跳过水合块中。

Disables directive matching on element.

禁用元素上的指令匹配。

Clears the root skip hydration node when leaving a skip hydration block.

离开 skip hydration 块时清除 root skip hydration 节点。

Return the current `LView`.

返回当前的 `LView`。

Return the current `TView`.

返回当前的 `TView`。

The OpaqueViewState instance to restore.

要还原的 OpaqueViewState 实例。

Context of the restored OpaqueViewState instance.

还原的 OpaqueViewState 实例的上下文。

Restores `contextViewData` to the given OpaqueViewState instance.

将 `contextViewData` 恢复到给定的 OpaqueViewState 实例。

Used in conjunction with the getCurrentView\(\) instruction to save a snapshot
of the current view and restore it when listeners are invoked. This allows
walking the declaration view tree in listeners to get vars from parent views.

与 getCurrentView\(\)
指令结合使用，以保存当前视图的快照并在调用侦听器时恢复它。这允许在侦听器中遍历声明视图树以从父视图获取
var。

Clears the view set in `ɵɵrestoreView` from memory. Returns the passed in
value so that it can be used as a return value of an instruction.

从内存中清除 `ɵɵrestoreView` 中设置的视图。返回传入的值，以便它可以作为指令的返回值。

Root index for `hostBindings`

`hostBindings` 的根索引

`TData[currentDirectiveIndex]` will point to the current directive
       whose `hostBindings` are being processed.

`TData[currentDirectiveIndex]` 将指向正在处理其 `hostBindings` 的当前指令。

Set a new binding root index so that host template functions can execute.

设置新的绑定根索引，以便宿主模板函数可以执行。

Bindings inside the host template are 0 index. But because we don't know ahead of time
how many host bindings we have we can't pre-compute them. For this reason they are all
0 index and we just shift the root so that they match next available location in the LView.

宿主模板中的绑定是 0
索引。但因为我们不提前知道我们有多少宿主绑定，所以我们无法预先计算它们。因此，它们都是 0
索引，我们只是移动根，以便它们与 LView 中的下一个可用位置匹配。

When host binding is executing this points to the directive index.
`TView.data[getCurrentDirectiveIndex()]` is `DirectiveDef`
`LView[getCurrentDirectiveIndex()]` is directive instance.

当执行宿主绑定时，this 指向了指令索引。`TView.data[getCurrentDirectiveIndex()]` is
`DirectiveDef` `LView[getCurrentDirectiveIndex()]` 是指令实例。

`TData` index where current directive instance can be found.

可以在其中找到当前指令实例 `TData` 索引。

Sets an index of a directive whose `hostBindings` are being processed.

设置正在处理其 `hostBindings` 的指令的索引。

Current `TData` where the `DirectiveDef` will be looked up at.

将在其中查找 `DirectiveDef` 的当前 `TData`。

Retrieve the current `DirectiveDef` which is active when `hostBindings` instruction is being
executed.

检索正在执行 `hostBindings` 指令时处于活动状态的当前 `DirectiveDef`。

an `LView` that we want to find parent `TNode` for.

我们要为其查找父 `TNode` 的 `LView`。

Returns a `TNode` of the location where the current `LView` is declared at.

返回声明当前 `TNode` 的位置的 `LView`。

`LView` location of the DI context.

`LView` DI 上下文的位置。

`TNode` for DI context

DI 上下文的 `TNode`

DI context flags. if `SkipSelf` flag is set than we walk up the declaration
    tree from `tNode`  until we find parent declared `TElementNode`.

DI 上下文标志。如果设置了 `SkipSelf` 标志，则我们从 `tNode` 声明树向上走，直到找到声明的父
`TElementNode`。

`true` if we have successfully entered DI associated with `tNode` \(or with declared
    `TNode` if `flags` has  `SkipSelf`\). Failing to enter DI implies that no associated
    `NodeInjector` can be found and we should instead use `ModuleInjector`.
    \- If `true` than this call must be fallowed by `leaveDI`
    \- If `false` than this call failed and we should NOT call `leaveDI`

`true` 我们已成功输入与 `tNode` 关联的 DI（或者如果 `flags` 具有 `SkipSelf`，则使用声明的
`TNode`），则为 true。无法输入 DI 意味着无法找到关联 `NodeInjector`，我们应该改用
`ModuleInjector`。- 如果为 `true` 比此调用失败，我们 `false` `leaveDI` 调用 `leaveDI`

This is a light weight version of the `enterView` which is needed by the DI system.

这是 DI 系统所需的 `enterView` 的轻量级版本。

New lView to become active

新的 lView 变为活动状态

the previously active lView;

以前活动的 lView ；

Swap the current lView with a new lView.

使用新的 lView 交换当前的 lView。

For performance reasons we store the lView in the top level of the module.
This way we minimize the number of properties to read. Whenever a new view
is entered we have to store the lView for later, and when the view is
exited the state has to be restored

出于性能原因，我们将 lView
存储在模块的顶级。通过这种方式，我们可以最大限度地减少要读取的属性数量。每当进入新视图时，我们都必须存储
lView 以供以后使用，并且当退出视图时，状态必须恢复

Allocates next free LFrame. This function tries to reuse the `LFrame`s to lower memory pressure.

分配下一个免费的 LFrame。此函数会尝试重用 `LFrame` 以降低内存压力。

A lightweight version of leave which is used with DI.

与 DI 一起使用的 leave 的轻量级版本。

This function only resets `currentTNode` and `LView` as those are the only properties
used with DI \(`enterDI()`\).

此函数仅重置 `currentTNode` 和 `LView`，因为这些是与 DI \( `enterDI()` \) 一起使用的唯一属性。

NOTE: This function is reexported as `leaveDI`. However `leaveDI` has return type of `void` where
as `leaveViewLight` has `LFrame`. This is so that `leaveViewLight` can be used in `leaveView`.

注意：此函数被重新导出为 `leaveDI`。但是，`leaveDI` 的返回类型为 `void`，而 `leaveViewLight`
具有 `LFrame`。这是为了让 `leaveViewLight` 可以在 `leaveView` 中使用。

This is a lightweight version of the `leaveView` which is needed by the DI system.

这是 DI 系统所需的 `leaveView` 的轻量级版本。

NOTE: this function is an alias so that we can change the type of the function to have `void`
return type.

注意：此函数是别名，以便我们可以将函数的类型更改为 `void` 返回类型。

Leave the current `LView`

离开当前的 `LView`

This pops the `LFrame` with the associated `LView` from the stack.

这会从堆栈中弹出带有关联 `LView` 的 `LFrame`。

IMPORTANT: We must zero out the `LFrame` values here otherwise they will be retained. This is
because for performance reasons we don't release `LFrame` but rather keep it for next use.

重要提示：我们必须在此将 `LFrame` 值清零，否则它们将被保留。这是因为出于性能原因，我们不会发布
`LFrame`，而是保留它以供下次使用。

Gets the currently selected element index.

获取当前所选的元素索引。

Used with {&commat;link property} instruction \(and more in the future\) to identify the index in the
current `LView` to act on.

与 {&commat;link property} 指令（以及未来更多）一起使用，以标识当前 `LView` 中要操作的索引。

Sets the most recent index passed to {&commat;link select}

设置传递给 {&commat;link select} 的最新索引

\(Note that if an "exit function" was set earlier \(via `setElementExitFn()`\) then that will be
run if and when the provided `index` value is different from the current selected index value.\)

（请注意，如果较早设置了“退出函数”（通过 `setElementExitFn()`），那么如果提供的 `index`
值与当前所选的索引值不同，它将运行。）

Gets the `tNode` that represents currently selected element.

获取表示当前所选元素的 `tNode`。

Sets the namespace used to create elements to `'http://www.w3.org/2000/svg'` in global state.

在全局状态下，将用于创建元素的命名空间设置为 `'http://www.w3.org/2000/svg'`。

Sets the namespace used to create elements to `'http://www.w3.org/1998/MathML/'` in global state.

在全局状态下，将用于创建元素的命名空间设置为 `'http://www.w3.org/1998/MathML/'`。

Sets the namespace used to create elements to `null`, which forces element creation to use
`createElement` rather than `createElementNS`.

将用于创建元素的命名空间设置为 `null`，这会强制元素创建使用 `createElement` 而不是
`createElementNS`。

Retrieves a global flag that indicates whether the most recent DOM node
was created or hydrated.

检索一个全局标志，该标志指示最近的 DOM 节点是创建的还是水合的。

Sets a global flag to indicate whether the most recent DOM node
was created or hydrated.

设置一个全局标志以指示最近的 DOM 节点是创建的还是水合的。