A marker that indicates the start of a segment in a mapping.

一个标记，用于指示映射中段的开始。

The end of a segment is indicated by the first segment-marker of another mapping whose start
is greater or equal to this one.

段的结尾由另一个映射的第一个段标记表示，其开始大于或等于这个。

a positive number if `a` is after `b`, a negative number if `b` is after `a`
and zero if they are at the same position.

如果 `a` 在 `b` 之后，则为正数，如果 `b` 在 `a` 之后，则为负数，如果它们在同一个位置，则为零。

Compare two segment-markers, for use in a search or sorting algorithm.

比较两个段标记，用于搜索或排序算法。

the position of the start of each line of content of the source file
whose segment-marker we are offsetting.

我们要偏移其段标记的源文件的每一行内容的开始位置。

the segment to offset.

要偏移的段。

the number of character to offset by.

要偏移的字符数。

Return a new segment-marker that is offset by the given number of characters.

返回一个由给定字符数偏移的新段标记。