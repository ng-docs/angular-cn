v4.0.0 - Should not be part of public API.

v4.0.0-不应成为公共 API 的一部分。

Reset the state of the change objects to show no changes. This means set previousKey to
currentKey, and clear all of the queues \(additions, moves, removals\).
Set the previousIndexes of moved and added items to their currentIndexes
Reset the list of additions, moves and removals

重置更改对象的状态以便不显示任何更改。这意味着将 previousKey 设置为
currentKey，并清除所有队列（添加、移动、移除）。将已移动和已添加条目的 previousIndexes 设置为其
currentIndexes。重置包含添加、移动和删除的列表

This is the core function which handles differences between collections.

这是处理集合之间差异的核心函数。

`record` is the record which we saw at this position last time. If null then it is a new
item.

`record` 是我们上次在此位置看到的记录。如果为 null，则为新条目。

`item` is the current item in the collection

`item` 是集合中的当前条目

`index` is the position of the item in the collection

`index` 是条目在集合中的位置

This check is only needed if an array contains duplicates. \(Short circuit of nothing dirty\)

仅当数组包含重复项时才需要进行此检查。（不脏时跳过）

Use case: `[a, a]` => `[b, a, a]`

用例：`[a, a]` => `[b, a, a]`

If we did not have this check then the insertion of `b` would:

如果我们不做这项检查，则插入 `b` 时会：

evict first `a`

移出第一个 `a`

insert `b` at `0` index.

把 `b` 插入在 `0` 号索引处。

leave `a` at index `1` as is. &lt;-- this is wrong!

把 `a` 留在现在的 `1` 号索引处。&lt;-- 这是错的！

reinsert `a` at index 2. &lt;-- this is wrong!

重新把 `a` 插入在 `2` 号索引处。&lt;-- 这是错的！

The correct behavior is:

正确的行为是：

reinsert `a` at index 1.

把 `a` 插入在 `1` 号索引处。

move `a` at from `1` to `2`.

把 `a` 从 `1` 号位移到 `2` 号位。

Double check that we have not evicted a duplicate item. We need to check if the item type may
have already been removed:
The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
at the end.

再次确认我们没有移出重复的条目。我们需要检查此条目类型是否已被删除：插入 b 将移出第一个
“a”。如果我们现在不重新插入，它将重新在最后插入。这将表现为两个 “a”
调换了位置。这是不正确的，因为更好的方法是插入 “b”，而不是将 “a” 和 “b” 互换，然后在末尾添加
“a”。

Get rid of any excess {&commat;link IterableChangeRecord\_}s from the previous collection

摆脱上一个集合中任何多余的 {&commat;link IterableChangeRecord\_}

`record` The first excess {&commat;link IterableChangeRecord\_}.

`record` 是指第一个多余的{&commat;link IterableChangeRecord\_}。

Append the record to the list of duplicates.

将记录附加到重复项列表。

Note: by design all records in the list of duplicates hold the same value in record.item.

注意：按照设计，重复列表中的所有记录在 Record.item 中都包含相同的值。

Remove one {&commat;link IterableChangeRecord\_} from the list of duplicates.

从重复项列表中删除一个 {&commat;link IterableChangeRecord\_}。

Returns whether the list of duplicates is empty.

返回重复项列表是否为空。

Retrieve the `value` using key. Because the IterableChangeRecord\_ value may be one which we
have already iterated over, we use the `atOrAfterIndex` to pretend it is not there.

使用键检索 `value`。因为 IterableChangeRecord\_ 的值可能是我们已经迭代过的值，所以我们用
`atOrAfterIndex` 来假装它不存在。

Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
have any more `a`s needs to return the second `a`.

用例：`[a, b, c, a, a]` 如果我们在索引 `3` 处，这是第二个 `a` 那么询问我们是否还有 `a` s
需要返回第二个 `a`。

Removes a {&commat;link IterableChangeRecord\_} from the list of duplicates.

从重复项列表中删除 {&commat;link IterableChangeRecord\_}。

The list of duplicates also is removed from the map if it gets empty.

如果重复列表为空，也会从地图中删除。