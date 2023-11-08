NOTE: The word `styling` is used interchangeably as style or class styling.

注意：`styling` 一词可与样式或类样式互换使用。

This file contains code to link styling instructions together so that they can be replayed in
priority order. The file exists because Ivy styling instruction execution order does not match
that of the priority order. The purpose of this code is to create a linked list so that the
instructions can be traversed in priority order when computing the styles.

此文件包含将样式说明链接在一起的代码，以便可以按优先级顺序重放它们。该文件存在，因为 Ivy
样式化指令的执行顺序与优先级顺序不匹配。此代码的目的是创建一个链表，以便在计算样式时可以按优先级顺序遍历这些指令。

Assume we are dealing with the following code:

假设我们正在处理以下代码：

The Order of instruction execution is:

指令执行顺序为：

NOTE: the comment binding location is for illustrative purposes only.

注意：注释绑定位置仅用于说明目的。

The correct priority order of concatenation is:

正确的串联优先顺序是：

What color should be rendered?

应该渲染什么颜色？

Once the items are correctly sorted in the list, the answer is simply the last item in the
concatenation list which is `#002`.

一旦项目在列表中正确排序，答案就是串联列表中的最后一项，即 `#002`。

To do so we keep a linked list of all of the bindings which pertain to this element.
Notice that the bindings are inserted in the order of execution, but the `TView.data` allows
us to traverse them in the order of priority.

为此，我们保留了与此元素相关的所有绑定的链接列表。请注意，绑定是按执行顺序插入的，但 `TView.data` 允许我们按优先级顺序遍历它们。

31



...



30



29



28



27



26



25



24



23



22



21



20



13



12



11



10



Idx

Idx

Notes

说明

The above data structure allows us to re-concatenate the styling no matter which data binding
changes.

上面的数据结构允许我们重新连接样式，无论哪个数据绑定发生变化。

NOTE: in addition to keeping track of next/previous index the `TView.data` also stores prev/next
duplicate bit. The duplicate bit if true says there either is a binding with the same name or
there is a map \(which may contain the name\). This information is useful in knowing if other
styles with higher priority need to be searched for overwrites.

注意：除了跟踪下一个/上一个索引之外，`TView.data` 还存储上一个/下一个重复位。如果为真，则重复位表示存在具有相同名称的绑定或存在映射（可能包含名称）。此信息有助于了解是否需要搜索具有更高优先级的其他样式以进行覆盖。

NOTE: See `should support example in 'tnode_linked_list.ts' documentation` in
`tnode_linked_list_spec.ts` for working example.

注意：有关工作示例，请参阅 `tnode_linked_list_spec.ts` `should support example in 'tnode_linked_list.ts' documentation`。

The `TData` to insert into.

要插入的 `TData`。

`TNode` associated with the styling element.

与样式元素关联的 `TNode`。

See `TStylingKey`.

请参阅 `TStylingKey`。

location of where `tStyleValue` should be stored \(and linked into list.\)

应该存储 `tStyleValue` 的位置（并链接到列表中。）

`true` if the insertion is for a `hostBinding`. \(insertion is in front of
              template.\)

`true` 插入是针对 `hostBinding` 的，则为 true。（插入在模板前面。）

True if the associated `tStylingKey` as a `class` styling.
                      `tNode.classBindings` should be used \(or `tNode.styleBindings` otherwise.\)

如果关联的 `tStylingKey` 作为 `class` 样式，则为真。应使用 `tNode.classBindings`（或否则使用
`tNode.styleBindings`。）

Insert new `tStyleValue` at `TData` and link existing style bindings such that we maintain linked
list of styles and compute the duplicate flag.

在 `tStyleValue` 处插入新的 `TData` 并链接现有的样式绑定，以便我们维护样式的链表并计算重复标志。

Note: this function is executed during `firstUpdatePass` only to populate the `TView.data`.

注意：此函数在 `firstUpdatePass` 期间执行，仅用于填充 `TView.data`。

The function works by keeping track of `tStylingRange` which contains two pointers pointing to
the head/tail of the template portion of the styles.

该函数通过跟踪 `tStylingRange` 来工作，它包含两个指向样式模板部分的头/尾的指针。

if `isHost === false` \(we are template\) then insertion is at tail of `TStylingRange`

如果 `isHost === false`（我们是模板），则插入在 `TStylingRange` 的尾部

if `isHost === true` \(we are host binding\) then insertion is at head of `TStylingRange`

如果 `isHost === true`（我们是宿主绑定），则插入在 `TStylingRange` 的头部

`TNode` where the residual is stored.

存储残差的 `TNode`。

`TStylingKey` to store.

要存储的 `TStylingKey`。

`TData` associated with the current `LView`.

与当前 `TData` 关联的 `LView`。

Look into the residual styling to see if the current `tStylingKey` is duplicate of residual.

查看残差样式以查看当前的 `tStylingKey` 是否是 persistence 的副本。

`TData` where the linked list is stored.

存储链表的 `TData`。

`TStylingKeyPrimitive` which contains the value to compare to other keys in
       the linked list.

`TStylingKeyPrimitive`，其中包含要与链表中其他键进行比较的值。

Starting location in the linked list to search from

链表中要搜索的起始位置

Direction.
       \- `true` for previous \(lower priority\);
       \- `false` for next \(higher priority\).

方向。- 上一个为 `true`（优先级较低）； - 下一个为 `false`（更高优先级）。

Marks `TStyleValue`s as duplicates if another style binding in the list has the same
`TStyleValue`.

如果列表中的另一个样式绑定具有相同的 `TStyleValue`，则将 `TStyleValue` 标记为重复。

NOTE: this function is intended to be called twice once with `isPrevDir` set to `true` and once
with it set to `false` to search both the previous as well as next items in the list.

注意：此函数旨在在 `isPrevDir` 设置为 `true` 的情况下调用两次，在设置为 `false`
的情况下调用一次，以搜索列表中的上一个和下一个条目。

No duplicate case

没有重复的案例

In the above case adding `[style.width.px]` to the existing `[style.color]` produces no
duplicates because `width` is not found in any other part of the linked list.

在上述情况下，将 `[style.width.px]` 添加到现有的 `[style.color]`
不会产生重复项，因为在链表的任何其他部分都找不到 `width`。

Duplicate case

重复案例

In the above case adding `[style.width.px]` will produce a duplicate with `[style.width.em]`
because `width` is found in the chain.

在上述情况下，添加 `[style.width.px]` 将生成带有 `[style.width.em]` 的副本，因为 `width`
是在链中找到的。

Map case 1

地图案例 1

In the above case adding `[style]` will produce a duplicate with any other bindings because
`[style]` is a Map and as such is fully dynamic and could produce `color` or `width`.

在上述情况下，添加 `[style]` 将生成与任何其他绑定的副本，因为 `[style]` 是 Map
，因此是完全动态的，可以生成 `color` 或 `width`。

Map case 2

地图案例 2

In the above case adding `[style.color]` will produce a duplicate because there is already a
`[style]` binding which is a Map and as such is fully dynamic and could produce `color` or
`width`.

在上述情况下，添加 `[style.color]` 将产生重复，因为已经有了一个 `[style]` 绑定，它是 Map
，因此是完全动态的，可以生成 `color` 或 `width`。

NOTE: Once `[style]` \(Map\) is added into the system all things are mapped as duplicates.
NOTE: We use `style` as example, but same logic is applied to `class`es as well.

注意：一旦 `[style]`（Map）添加到系统中，所有东西都被映射为副本。注意：我们使用 `style`
作为示例，但相同的逻辑也适用于 `class` es。

Determines if two `TStylingKey`s are a match.

确定两个 `TStylingKey` 是否匹配。

When computing whether a binding contains a duplicate, we need to compare if the instruction
`TStylingKey` has a match.

在计算绑定是否包含重复项时，我们需要比较 `TStylingKey` 指令是否有匹配项。

Here are examples of `TStylingKey`s which match given `tStylingKeyCursor` is:

以下是与给定 `tStylingKeyCursor` 匹配的 `TStylingKey` 的示例：

`color`    // Match another color

`color` // 匹配另一种颜色

`null`     // That means that `tStylingKey` is a `classMap`/`styleMap` instruction

`null` // 这意味着 `tStylingKey` 是 `classMap` / `styleMap` 指令

`['', 'color', 'other', true]` // wrapped `color` so match

`['', 'color', 'other', true]` // 包装的 `color` 以便匹配

`['', null, 'other', true]`       // wrapped `null` so match

`['', null, 'other', true]` // 包装 `null` 以进行匹配

`['', 'width', 'color', 'value']` // wrapped static value contains a match on `'color'`

`['', 'width', 'color', 'value']` // 包装的静态值包含 `'color'` 上的匹配项

`null`       // `tStylingKeyCursor` always match as it is `classMap`/`styleMap` instruction

`null` // `tStylingKeyCursor` 始终匹配，因为它是 `classMap` / `styleMap` 指令