The parsed mappings that have been flattened so that any intermediate source mappings have been
flattened.

已被展平的解析映射，以便任何中间源映射都被展平。

The result is that any source file mentioned in the flattened mappings have no source map \(are
pure original source files\).

结果是展平映射中提到的任何源文件都没有源映射（是纯原始源文件）。

Render the raw source map generated from the flattened mappings.

渲染从展平映射生成的原始源映射。

Find the original mapped location for the given `line` and `column` in the generated file.

在生成的文件中查找给定 `line` 和 `column` 的原始映射位置。

First we search for a mapping whose generated segment is at or directly before the given
location. Then we compute the offset between the given location and the matching generated
segment. Finally we apply this offset to the original source segment to get the desired
original location.

首先，我们搜索一个映射，其生成的段在给定位置或直接在给定位置之前。然后我们计算给定位置和匹配的生成段之间的偏移量。最后，我们将此偏移量应用于原始源段，以获取所需的原始位置。

The collection of mappings whose segment-markers we are searching.

我们正在搜索其段标记的映射集合。

The segment-marker to match against those of the given `mappings`.

要与给定 `mappings` 的段标记匹配的段标记。

If exclusive then we must find a mapping with a segment-marker that is
exclusively earlier than the given `marker`.
If not exclusive then we can return the highest mappings with an equivalent segment-marker to the
given `marker`.

如果是互斥的，那么我们必须找到一个带有 segment-marker 的映射，并且比给定的 `marker`
早。如果不是排他的，那么我们可以将使用等效的 Segment-marker 的最高映射返回到给定的 `marker`。

If provided, this is used as a hint that the marker we are searching for has an
index that is no lower than this.

如果提供，这将用作提示我们正在搜索的标记具有不低于此的索引。

A Mapping consists of two segment markers: one in the generated source and one in the original
source, which indicate the start of each segment. The end of a segment is indicated by the first
segment marker of another mapping whose start is greater or equal to this one.

映射由两个段标记组成：一个在生成的源中，一个在原始源中，它们表明每个段的开始。段的结尾由另一个映射的第一个段标记表示，其开始大于或等于此映射。

It may also include a name associated with the segment being mapped.

它还可能包括与被映射的段相关联的名称。

Merge two mappings that go from A to B and B to C, to result in a mapping that goes from A to C.

合并从 A 到 B 和 B 到 C 的两个映射，以生成从 A 到 C 的映射。

Parse the `rawMappings` into an array of parsed mappings, which reference source-files provided
in the `sources` parameter.

将 `rawMappings` 解析为解析后的映射数组，该数组会引用 `sources` 参数中提供的 source-files。

The mappings whose original segments we want to extract

我们要提取其原始段的映射

Return a map from original source-files \(referenced in the `mappings`\) to arrays of
segment-markers sorted by their order in their source file.

返回从原始 source-files（在 `mappings` 中引用）到按源文件中的顺序排序的段标记数组的映射。

Extract the segment markers from the original source files in each mapping of an array of
`mappings`.

从映射数组的每个 `mappings` 中的原始源文件中提取段标记。

the mappings whose segments should be updated

应该更新其段的映射

Update the original segments of each of the given `mappings` to include a link to the next
segment in the source file.

更新每个给定 `mappings` 的原始段，以包含到源文件中下一个段的链接。

A collection of mappings between `keys` and `values` stored in the order in which the keys are
first seen.

`keys` 和 `values` 之间的映射集合，按照键的第一次出现的顺序存储。

The difference between this and a standard `Map` is that when you add a key-value pair the index
of the `key` is returned.

这与标准 `Map` 之间的区别在于，当你添加键值对时，会返回 `key` 的索引。

An array of keys added to this map.

添加到此映射表的键数组。

This array is guaranteed to be in the order of the first time the key was added to the map.

保证此数组的顺序与键第一次添加到映射表时一样。

An array of values added to this map.

添加到此映射表的值数组。

This array is guaranteed to be in the order of the first time the associated key was added to
the map.

保证此数组的顺序与第一次将关联的键添加到映射表时一样。

the key to associated with the `value`.

与 `value` 关联的键。

the value to associated with the `key`.

与 `key` 关联的值。

the index of the `key` in the `keys` array.

`keys` 数组中的 `key` 的索引。

Associate the `value` with the `key` and return the index of the key in the collection.

将 `value` 与 `key` 关联起来，并返回集合中键的索引。

If the `key` already exists then the `value` is not set and the index of that `key` is
returned; otherwise the `key` and `value` are stored and the index of the new `key` is
returned.

如果 `key` 已经存在，则不设置 `value` 并返回该 `key` 的索引；否则存储 `key` 和 `value` 并返回新
`key` 的索引。

A collection of `values` stored in the order in which they were added.

按添加顺序存储的 `values` 的集合。

The difference between this and a standard `Set` is that when you add a value the index of that
item is returned.

这与标准 `Set` 之间的区别在于，当你添加值时，会返回该条目的索引。

An array of values added to this set.
This array is guaranteed to be in the order of the first time the value was added to the set.

添加到此集的值数组。保证此数组的顺序与第一次将值添加到集合时一样。

the value to add to the set.

要添加到集合中的值。

the index of the `value` in the `values` array.

`values` 数组中的 `value` 的索引。

Add the `value` to the `values` array, if it doesn't already exist; returning the index of the
`value` in the `values` array.

将 `value` 添加到 `values` 数组（如果不存在）；返回 `values` 数组中 `value` 的索引。

If the `value` already exists then the index of that `value` is returned, otherwise the new
`value` is stored and the new index returned.

如果 `value` 已经存在，则返回该 `value` 的索引，否则存储新 `value` 并返回新索引。