Keep track of which input bindings in `ɵɵi18nExp` have changed.

跟踪 `ɵɵi18nExp` 中的哪些输入绑定发生了更改。

This is used to efficiently update expressions in i18n only when the corresponding input has
changed.

这用于仅当对应的输入发生更改时才有效地更新 i18n 中的表达式。

Each bit represents which of the `ɵɵi18nExp` has changed.

每个位都表示 `ɵɵi18nExp` 中的哪个发生了变化。

There are 32 bits allowed in JS.

JS 中允许使用 32 位。

Bit 32 is special as it is shared for all changes past 32. \(In other words if you have more
than 32 `ɵɵi18nExp` then all changes past 32nd `ɵɵi18nExp` will be mapped to same bit. This means
that we may end up changing more than we need to. But i18n expressions with 32 bindings is rare
so in practice it should not be an issue.\)

第 32 位是特殊的，因为它是为 32 以后的所有更改共享的。（换句话说，如果你有超过 32 `ɵɵi18nExp`，那么超过 32nd `ɵɵi18nExp` 的所有更改都将映射到同一个位。这意味着我们最终可能会更改超过我们需要。但具有 32 个绑定的 i18n 表达式很少见，因此在实践中这应该不是问题。）

Keeps track of which bit needs to be updated in `changeMask`

跟踪需要在 `changeMask` 中更新的位

This value gets incremented on every call to `ɵɵi18nExp`

每次调用 `ɵɵi18nExp` 时，此值都会增加

did `ɵɵi18nExp` detect a change.

`ɵɵi18nExp` 检测到更改。

`setMaskBit` gets invoked by each call to `ɵɵi18nExp`.

每次调用 `setMaskBit` 都会调用 `ɵɵi18nExp`。

Current lView

当前的 lView

Set of op-codes to apply

要应用的操作码集

Parent node \(so that direct children can be added eagerly\) or `null` if it is
    a root node.

父节点（以便可以立即添加直接子项），如果是根节点，则为 `null`。

DOM node that should be used as an anchor.

应该用作锚点的 DOM 节点。

Apply `I18nCreateOpCodes` op-codes as stored in `TI18n.create`.

应用存储在 `TI18n.create` 中的 `I18nCreateOpCodes` 操作码。

Creates text \(and comment\) nodes which are internationalized.

创建国际化的文本（和注释）节点。

Current `TView`

当前 `TView`

Mutable OpCodes to process

要处理的可变操作码

Current `LView`

当前 `LView`

place where the i18n node should be inserted.

应该插入 i18n 节点的地方。

Apply `I18nMutateOpCodes` OpCodes.

应用 `I18nMutateOpCodes`。

OpCodes to process

要处理的操作码

Location of the first `ɵɵi18nApply`

第一个 `ɵɵi18nApply` 的位置

Each bit corresponds to a `ɵɵi18nExp` \(Counting backwards from
    `bindingsStartIndex`\)

每个位对应一个 `ɵɵi18nExp`（从 `bindingsStartIndex` 倒数）

Apply `I18nUpdateOpCodes` OpCodes

应用 `I18nUpdateOpCodes`

Current `TIcu`

当前 `TIcu`

Apply OpCodes associated with updating an existing ICU.

应用与更新现有 ICU 相关的 OpCode。

Value of the case to update to.

要更新到的案例的值。

Apply OpCodes associated with switching a case on ICU.

应用与在 ICU 上切换病例相关的 OpCodes。

This involves tearing down existing case and than building up a new case.

这涉及拆除现有的案例，而不是建立一个新的案例。

Apply OpCodes associated with tearing ICU case.

应用与撕裂 ICU 病例相关的 OpCodes。

The value of the main binding used by this ICU expression

此 ICU 表达式使用的主绑定的值

Returns the index of the current case of an ICU expression depending on the main binding value

根据主绑定值返回 ICU 表达式的当前案例的索引