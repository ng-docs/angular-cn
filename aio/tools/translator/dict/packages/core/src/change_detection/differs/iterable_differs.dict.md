A type describing supported iterable types.

描述受支持的可迭代类型的类型。

A strategy for tracking changes over time to an iterable. Used by {&commat;link NgForOf} to
respond to changes in an iterable by effecting equivalent changes in the DOM.

用来跟踪一个迭代内的更改的策略。{&commat;link NgForOf} 使用它通过对 DOM
进行等效更改来响应此迭代内的更改。

containing the new value.

包含新值。

an object describing the difference. The return value is only valid until the next
`diff()` invocation.

描述差异的对象。返回值仅在下一次 `diff()` 调用之前有效。

Compute a difference between the previous state and the new `object` state.

计算先前状态和新 `object` 状态之间的差异。

An object describing the changes in the `Iterable` collection since last time
`IterableDiffer#diff()` was invoked.

本对象描述自上次调用 `IterableDiffer#diff()` 以来 `Iterable` 集合中的变更。

Iterate over all changes. `IterableChangeRecord` will contain information about changes
to each item.

遍历所有更改。`IterableChangeRecord` 将包含有关每个条目更改的信息。

A change which needs to be applied

需要应用的更改

The `IterableChangeRecord#previousIndex` of the `record` refers to the
       original `Iterable` location, where as `previousIndex` refers to the transient location
       of the item, after applying the operations up to this point.

此 `record` 的 `IterableChangeRecord#previousIndex` 是指原来 `Iterable` 中的位置，这个
`previousIndex` 是指应用此操作之后条目的瞬时位置。

The `IterableChangeRecord#currentIndex` of the `record` refers to the
       original `Iterable` location, where as `currentIndex` refers to the transient location
       of the item, after applying the operations up to this point.

此 `record` 的 `IterableChangeRecord#currentIndex` 是指原来 `Iterable` 中的位置，这个
`currentIndex` 是指应用此操作之后条目的瞬时位置。

Iterate over a set of operations which when applied to the original `Iterable` will produce the
new `Iterable`.

遍历一组操作，将这些操作应用于原始 `Iterable`，将产生新的 `Iterable`。

NOTE: These are not necessarily the actual operations which were applied to the original
`Iterable`, rather these are a set of computed operations which may not be the same as the
ones applied.

注意：这些不一定是应用于原始 `Iterable`
的实际操作，而是这些计算的操作集合，可能与所应用的操作不同。

Iterate over changes in the order of original `Iterable` showing where the original items
have moved.

按原始 `Iterable` 中的顺序遍历这些变更，以找出原始条目移动到的位置。

Iterate over all added items.

遍历所有添加的条目。

Iterate over all moved items.

遍历所有移动过的条目。

Iterate over all removed items.

遍历所有已删除的条目。

Iterate over all items which had their identity \(as computed by the `TrackByFunction`\)
changed.

遍历所有更改过标识（由 `TrackByFunction` 计算）的条目。

Record representing the item change information.

代表条目变更信息的记录。

Current index of the item in `Iterable` or null if removed.

此条目在 `Iterable` 中的当前索引，如果已删除则为 null。

Previous index of the item in `Iterable` or null if added.

此条目在 `Iterable` 中以前的索引，如果是新添加的则为 null。

The item.

本条目。

Track by identity as computed by the `TrackByFunction`.

通过 `TrackByFunction` 计算出的标识进行跟踪。

[`NgForOf#ngForTrackBy`](api/common/NgForOf#ngForTrackBy)



A function optionally passed into the `NgForOf` directive to customize how `NgForOf` uniquely
identifies items in an iterable.

一个可选地传入 `NgForOf` 指令的函数，以自定义 `NgForOf` 如何唯一标识迭代中的条目。

`NgForOf` needs to uniquely identify items in the iterable to correctly perform DOM updates
when items in the iterable are reordered, new items are added, or existing items are removed.

`NgForOf` 需要唯一标识 iterable 中的条目，以在对 iterable
中的条目重新排序、添加新条目或删除现有条目时正确执行 DOM 更新。

In all of these scenarios it is usually desirable to only update the DOM elements associated
with the items affected by the change. This behavior is important to:

在所有这些场景中，通常希望仅更新与受更改影响的条目关联的 DOM 元素。此行为对以下内容很重要：

preserve any DOM-specific UI state \(like cursor position, focus, text selection\) when the
iterable is modified

修改迭代器时保留任何特定于 DOM 的 UI 状态（例如光标位置、焦点、文本选择）

enable animation of item addition, removal, and iterable reordering

启用条目添加、删除和可迭代重新排序的动画

preserve the value of the `<select>` element when nested `<option>` elements are dynamically
populated using `NgForOf` and the bound iterable is updated

当使用 `NgForOf` 动态填充嵌套 `<option>` 元素并更新绑定迭代器时，保留 `<select>` 元素的值

A common use for custom `trackBy` functions is when the model that `NgForOf` iterates over
contains a property with a unique identifier. For example, given a model:

自定义 `trackBy` 函数的一个常见用途是当 `NgForOf`
迭代的模型包含具有唯一标识符的属性时。例如，给定一个模型：

a custom `trackBy` function could look like the following:

自定义 `trackBy` 函数可能类似于以下内容：

A custom `trackBy` function must have several properties:

自定义 `trackBy` 函数必须具有几个属性：

be [idempotent](https://en.wikipedia.org/wiki/Idempotence) \(be without side effects, and always
return the same value for a given input\)

[幂等](https://en.wikipedia.org/wiki/Idempotence)（没有副作用，并且对于给定输入始终返回相同的值）

return unique value for all unique inputs

返回所有唯一输入的唯一值

be fast

快点

The index of the item within the iterable.

可迭代项中条目的索引。

The item in the iterable.

可迭代项中的项。

Provides a factory for {&commat;link IterableDiffer}.

提供 {&commat;link IterableDiffer} 的工厂。

A repository of different iterable diffing strategies used by NgFor, NgClass, and others.

NgFor、NgClass 等使用的不同迭代策略的存储库。

Example

例子

The following example shows how to extend an existing list of factories,
which will only be applied to the injector for this component and its children.
This step is all that's required to make a new {&commat;link IterableDiffer} available.

以下示例演示了如何扩展现有工厂列表，该列表仅适用于该组件及其子组件的注入器。这就是使新的 {&commat;link
IterableDiffer} 可用的全部步骤。

Takes an array of {&commat;link IterableDifferFactory} and returns a provider used to extend the
inherited {&commat;link IterableDiffers} instance with the provided factories and return a new
{&commat;link IterableDiffers} instance.

接受一个 {&commat;link IterableDifferFactory}
数组，并返回一个提供者，用于扩展继承的带有提供者工厂的 {&commat;link IterableDiffers}
实例，并返回一个新的 {&commat;link IterableDiffers} 实例。