Converts a `string` version into an array of numbers

将 `string` 版本转换为数字数组

The 'left hand' array in the comparison test

比较测试中的“左手”数组

The 'right hand' in the comparison test

比较测试中的“右手”

{-1|0|1} The comparison result: 1 if a is greater, -1 if b is greater, 0 is the two
arrays are equals

比较结果：如果 a 更大，则为 1，如果 b 更大，则为 -1，0 是两个数组相等

Compares two arrays of positive numbers with lexicographical order in mind.

在考虑字典顺序的情况下比较两个正数数组。

However - unlike lexicographical order - for arrays of different length we consider:
`[1, 2, 3] = [1, 2, 3, 0]` instead of `[1, 2, 3] &lt; [1, 2, 3, 0]`

但是 - 与字典顺序不同 - 对于不同长度的数组，我们考虑：`[1, 2, 3] = [1, 2, 3, 0]` 而不是 `[1, 2, 3] &lt; [1, 2, 3, 0]`

The TypeScript version

TypeScript 版本

The minimum version

最低版本

The maximum version

最高版本

Checks if a TypeScript version is:

检查 TypeScript 版本是否是：

greater or equal than the provided `low` version,

大于或等于提供的 `low` 版本，

lower or equal than an optional `high` version.

低于或等于可选 `high` 版本。

The 'left hand' version in the comparison test

比较测试中的“左手”版本

The 'right hand' version in the comparison test

比较测试中的“右手”版本

{-1|0|1} The comparison result: 1 if v1 is greater, -1 if v2 is greater, 0 is the two
versions are equals

比较结果：如果 v1 更大，则为 1，如果 v2 更大，则为 -1，0 是两个版本相等

Compares two versions

比较两个版本