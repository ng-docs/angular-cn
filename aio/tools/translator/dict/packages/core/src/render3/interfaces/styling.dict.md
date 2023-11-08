Value stored in the `TData` which is needed to re-concatenate the styling.

存储在 `TData` 中的值，需要重新连接样式。

See: `TStylingKeyPrimitive` and `TStylingStatic`

请参阅：`TStylingKeyPrimitive` 和 `TStylingStatic`

The primitive portion \(`TStylingStatic` removed\) of the value stored in the `TData` which is
needed to re-concatenate the styling.

存储在 `TData` 中的值的原始部分（`TStylingStatic` 已删除），需要重新连接样式。

`string`: Stores the property name. Used with `ɵɵstyleProp`/`ɵɵclassProp` instruction.

`string`：存储属性名称。与 `ɵɵstyleProp` / `ɵɵclassProp` 指令一起使用。

`null`: Represents map, so there is no name. Used with `ɵɵstyleMap`/`ɵɵclassMap`.

`null`：表示映射，因此没有名称。与 `ɵɵstyleMap` / `ɵɵclassMap` 使用。

`false`: Represents an ignore case. This happens when `ɵɵstyleProp`/`ɵɵclassProp` instruction
  is combined with directive which shadows its input `@Input('class')`. That way the binding
  should not participate in the styling resolution.

`false`：表示忽略大小写。当 `ɵɵstyleProp` / `ɵɵclassProp` 指令与隐藏其输入 `@Input('class')`
指令结合使用时，会发生这种情况。这样，绑定不应该参与样式解析。

Store the static values for the styling binding.

存储样式绑定的静态值。

The `TStylingStatic` is just `KeyValueArray` where key `""` \(stored at location 0\) contains the
`TStylingKey` \(stored at location 1\). In other words this wraps the `TStylingKey` such that the
`""` contains the wrapped value.

`TStylingStatic` 只是 `KeyValueArray`，其中的键 `""`（存储在位置 0）包含 `TStylingKey`
（存储在位置 1）。换句话说，这会包装 `TStylingKey`，以便 `""` 包含包装后的值。

When instructions are resolving styling they may need to look forward or backwards in the linked
list to resolve the value. For this reason we have to make sure that he linked list also contains
the static values. However the list only has space for one item per styling instruction. For this
reason we store the static values here as part of the `TStylingKey`. This means that the
resolution function when looking for a value needs to first look at the binding value, and than
at `TStylingKey` \(if it exists\).

当操作指南解析样式时，它们可能需要在链表中向前或向后查找以解析值。出于这个原因，我们必须确保他的链表还包含静态值。但是，该列表中每个样式说明只有一项空间。出于这个原因，我们将静态值作为
`TStylingKey` 的一部分存储在这里。这意味着查找值时的解析函数需要首先查看绑定值，而不是
`TStylingKey`（如果存在）。

Imagine we have:

假设我们有：

In the above case the linked list will contain one item:

在上述情况下，链表将包含一项：

So when the function is resolving styling value, it first needs to look into the linked list
\(there is none\) and than into the static `TStylingStatic` too see if there is a default value for
`dynamic` \(there is not\). Therefore it is safe to remove it.

因此，当函数解析样式值时，它首先需要查看链表（没有），然后查看静态 `TStylingStatic` 是否有 `dynamic` 默认值（没有）。因此将其移除是安全的。

If setting `true` case:

如果设置 `true` 情况：

So when the function is resolving styling value, it first needs to look into the linked list
\(there is none\) and than into `TNode.residualClass` \(TNode.residualStyle\) which contains

因此，当函数解析样式值时，它首先需要查看链表（没有链表），然后查看包含的 `TNode.residualClass` \(TNode.residualStyle\)

This means that it is safe to add class.

这意味着添加类是安全的。

This is a branded number which contains previous and next index.

这是一个包含上一个和下一个索引的品牌编号。

When we come across styling instructions we need to store the `TStylingKey` in the correct
order so that we can re-concatenate the styling value in the desired priority.

当我们遇到样式说明时，我们需要按正确的顺序存储 `TStylingKey`
，以便我们可以按所需的优先级重新连接样式值。

The insertion can happen either at the:

插入可以发生在：

end of template as in the case of coming across additional styling instruction in the template

模板的结尾，就像在模板中遇到额外的样式操作指南一样

in front of the template in the case of coming across additional instruction in the
`hostBindings`.

在遇到 `hostBindings` 中的额外指令的情况下，在模板前面。

We use `TStylingRange` to store the previous and next index into the `TData` where the template
bindings can be found.

我们使用 `TStylingRange` 将上一个和下一个索引存储到可以找到模板绑定的 `TData` 中。

bit 0 is used to mark that the previous index has a duplicate for current value.

位 0 用于标记前一个索引与当前值有重复。

bit 1 is used to mark that the next index has a duplicate for the current value.

第 1 位用于标记下一个索引与当前值有重复。

bits 2-16 are used to encode the next/tail of the template.

第 2-16 位用于编码模板的下一个/尾部。

bits 17-32 are used to encode the previous/head of template.

第 17-32 位用于编码模板的前一个/头部。

NODE: *duplicate* false implies that it is statically known that this binding will not collide
with other bindings and therefore there is no need to check other bindings. For example the
bindings in `<div [style.color]="exp" [style.width]="exp">` will never collide and will have
their bits set accordingly. Previous duplicate means that we may need to check previous if the
current binding is `null`. Next duplicate means that we may need to check next bindings if the
current binding is not `null`.

NODE: *duplicate* false 意味着静态已知此绑定不会与其他绑定冲突，因此无需检查其他绑定。例如，
`<div [style.color]="exp" [style.width]="exp">`
中的绑定将永远不会冲突，并且它们的位会相应设置。上一个重复意味着我们可能需要检查当前绑定是否为
`null`。下一个重复意味着如果当前绑定不为 `null`，我们可能需要检查下一个绑定。

NOTE: `0` has special significance and represents `null` as in no additional pointer.

注意：`0` 具有特殊意义，并且表示 `null`，因为没有额外的指针。

Shift and masks constants for encoding two numbers into and duplicate info into a single number.

将两个数字编码为单个数字并将信息复制为单个数字的 Shift 和 mask 常量。

This bit is set if the previous bindings contains a binding which could possibly cause a
duplicate. For example: `<div [style]="map" [style.width]="width">`, the `width` binding will
have previous duplicate set. The implication is that if `width` binding becomes `null`, it is
necessary to defer the value to `map.width`. \(Because `width` overwrites `map.width`.\)

如果以前的绑定包含可能导致重复的绑定，则设置此位。例如：`<div [style]="map"
[style.width]="width">`，`width` 绑定将有以前的重复集。这意味着，如果 `width` 绑定变为 `null`
，则有必要将值延迟为 `map.width`。（因为 `width` 会覆盖 `map.width`。）

This bit is set to if the next binding contains a binding which could possibly cause a
duplicate. For example: `<div [style]="map" [style.width]="width">`, the `map` binding will
have next duplicate set. The implication is that if `map.width` binding becomes not `null`, it
is necessary to defer the value to `width`. \(Because `width` overwrites `map.width`.\)

如果下一个绑定包含可能导致重复的绑定，则此位设置为。例如：`<div [style]="map"
[style.width]="width">`，`map` 绑定将有下一个重复集。这意味着，如果 `map.width` 绑定变得不为
`null`，则有必要将值延迟为 `width`。（因为 `width` 会覆盖 `map.width`。）