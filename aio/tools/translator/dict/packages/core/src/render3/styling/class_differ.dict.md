A string containing classes \(whitespace separated\)

包含类的字符串（空格分隔）

A class name to locate

要定位的类名

Starting location of search

搜索的开始位置

an index of the located class \(or -1 if not found\)

定位的类的索引（如果找不到，则为 -1）

Returns an index of `classToSearch` in `className` taking token boundaries into account.

考虑标记边界，返回 `className` 中 `classToSearch` 的索引。

`classIndexOf('AB A', 'A', 0)` will be 3 \(not 0 since `AB!==A`\)

`classIndexOf('AB A', 'A', 0)` 将是 3（不是 0，因为 `AB!==A`）