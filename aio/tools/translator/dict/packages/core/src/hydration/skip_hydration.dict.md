The name of an attribute that can be added to the hydration boundary node
\(component host node\) to disable hydration for the content within that boundary.

可以添加到水合边界节点（组件宿主节点）以禁用该边界内内容的水合的属性的名称。

Helper function to check if a given node has the 'ngSkipHydration' attribute

检查给定节点是否具有“ngSkipHydration”属性的辅助函数

Checks whether a TNode has a flag to indicate that it's a part of
a skip hydration block.

检查 TNode 是否有一个标志来指示它是跳过水合块的一部分。

Helper function that determines if a given node is within a skip hydration block
by navigating up the TNode tree to see if any parent nodes have skip hydration
attribute.

通过向上导航 TNode 树以查看是否有任何父节点具有跳过水合属性来确定给定节点是否在跳过水合块内的辅助函数。

TODO\(akushnir\): this function should contain the logic of `hasInSkipHydrationBlockFlag`,
there is no need to traverse parent nodes when we have a TNode flag \(which would also
make this lookup O\(1\)\).

TODO\(akushnir\)：这个函数应该包含 `hasInSkipHydrationBlockFlag` 的逻辑，当我们有一个 TNode 标志时不需要遍历父节点（这也会使这个查找 O\(1\)）。