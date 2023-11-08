The location of the parent injector, which contains the view offset

父注入器的位置，包含视图偏移

The LView instance from which to start walking up the view tree

要开始沿着视图树向上走的 LView 实例

The LView instance that contains the parent injector

包含父注入器的 LView 实例

Unwraps a parent injector location number to find the view offset from the current injector,
then walks up the declaration view tree until the view is found that contains the parent
injector.

展开父注入器位置号以查找距当前注入器的视图偏移量，然后沿着声明视图树走，直到找到包含父注入器的视图。