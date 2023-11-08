first array

第一个数组

second array

第二个数组

Optional function for extracting stable object identity from a value in
    the array.

用于从数组中的值中提取稳定对象标识的可选函数。

Determines if the contents of two arrays is identical

判断两个数组的内容是否相同

Flattens an array.

展平数组。

Array to splice

要拼接的数组

Index of element in array to remove.

要删除的数组中元素的索引。

Number of items to remove.

要删除的项目数。

Remove item from array \(Same as `Array.splice()` but faster.\)

从数组中删除项目（与 `Array.splice()` 相同，但速度更快。）

`Array.splice()` is not as fast because it has to allocate an array for the elements which were
removed. This causes memory pressure and slows down code when most of the time we don't
care about the deleted items array.

`Array.splice()` 没有那么快，因为它必须为被删除的元素分配一个数组。当大多数时候我们不关心已删除的项目数组时，这会导致内存压力并减慢代码速度。

https://jsperf.com/fast-array-splice \(About 20x faster\)

https://jsperf.com/fast-array-splice （大约快 20 倍）

Array to splice.

要拼接的数组。

Index in array where the `value` should be added.

数组中应添加 `value` 索引。

Value to add to array.

要添加到数组的值。

Same as `Array.splice(index, 0, value)` but faster.

与 `Array.splice(index, 0, value)` 相同但速度更快。

`Array.splice()` is not fast because it has to allocate an array for the elements which were
removed. This causes memory pressure and slows down code when most of the time we don't
care about the deleted items array.

`Array.splice()` 并不快，因为它必须为被删除的元素分配一个数组。当大多数时候我们不关心已删除的项目数组时，这会导致内存压力并减慢代码速度。

Same as `Array.splice2(index, 0, value1, value2)` but faster.

与 `Array.splice2(index, 0, value1, value2)` 相同，但速度更快。

A sorted array to binary search.

二进制搜索的排序数组。

The value to look for.

要寻找的价值。

index of the value.

值的索引。

positive index if value found.

如果找到值，则为正索引。

negative index if value not found. \(`~index` to get the value where it should have been
located\)

如果找不到值，则为负索引。（ `~index` 获取它应该位于的值）

Get an index of an `value` in a sorted `array`.

获取排序 `array` 中某个 `value` 的索引。

NOTE:

注意：

This uses binary search algorithm for fast removals.

这使用二进制搜索算法进行快速删除。

`KeyValueArray` is an array where even positions contain keys and odd positions contain values.

`KeyValueArray` 是一个数组，其中偶数位置包含键，奇数位置包含值。

`KeyValueArray` provides a very efficient way of iterating over its contents. For small
sets \(~10\) the cost of binary searching an `KeyValueArray` has about the same performance
characteristics that of a `Map` with significantly better memory footprint.

`KeyValueArray` 提供了一种非常有效的方法来迭代其内容。对于小集合（~10），二进制搜索 `KeyValueArray` 的成本具有与 `Map` 大致相同的性能特征，但内存占用明显更好。

If used as a `Map` the keys are stored in alphabetical order so that they can be binary searched
for retrieval.

如果用作 `Map`，则键按字母顺序存储，以便可以对它们进行二进制搜索以进行检索。

See: `keyValueArraySet`, `keyValueArrayGet`, `keyValueArrayIndexOf`, `keyValueArrayDelete`.

请参阅：`keyValueArraySet` 、 `keyValueArrayGet` 、 `keyValueArrayIndexOf` 、 `keyValueArrayDelete`。

to modify.

修改。

The key to locate or create.

定位或创建的键。

The value to set for a `key`.

为 `key` 设置的值。

index \(always even\) of where the value vas set.

值 vas 设置位置的索引（始终为偶数）。

Set a `value` for a `key`.

为 `key` 设置 `value`。

to search.

寻找。

The key to locate.

定位的关键。

The `value` stored at the `key` location or `undefined` if not found.

存储在 `key` 位置的 `value`，如果未找到则 `undefined`。

Retrieve a `value` for a `key` \(on `undefined` if not found.\)

检索 `key` 的 `value` （如果未找到则 `undefined`。）

index of where the key is \(or should have been.\)

键在哪里（或应该在哪里）的索引。

positive \(even\) index if key found.

如果找到键，则为正（偶）索引。

negative index if key not found. \(`~index` \(even\) to get the index where it should have
been inserted.\)

如果找不到键，则为负索引。（ `~index` \(even\) 获取应该插入的索引。）

Retrieve a `key` index value in the array or `-1` if not found.

检索数组中的 `key` 索引值，如果未找到则为 `-1`。

The key to locate or delete \(if exist\).

要定位或删除的键（如果存在）。

index of where the key was \(or should have been.\)

密钥所在位置（或应该所在位置）的索引。

positive \(even\) index if key found and deleted.

如果找到并删除键，则为正（偶）索引。

negative index if key not found. \(`~index` \(even\) to get the index where it should have
been.\)

如果找不到键，则为负索引。（ `~index` \(even\) 获取它应该在的位置的索引。）

Delete a `key` \(and `value`\) from the `KeyValueArray`.

从 `KeyValueArray` 中删除一个 `key` （和 `value` ）。

grouping shift.

分组转移。

`0` means look at every location

`0` 表示查看每个位置

`1` means only look at every other \(even\) location \(the odd locations are to be ignored as
    they are values.\)

`1` 表示只查看每隔一个（偶数）位置（奇数位置将被忽略，因为它们是值。）

negative index if value not found. \(`~index` to get the value where it should have been
inserted\)

如果找不到值，则为负索引。（ `~index` 获取应该插入的值）

INTERNAL: Get an index of an `value` in a sorted `array` by grouping search by `shift`.

内部：通过按 `shift` 对搜索进行分组来获取排序 `array` 中 `value` 的索引。