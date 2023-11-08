The starting LView to mark dirty

标记为脏的起始 LView

the root LView

根 LView

Marks current view and all ancestors dirty.

将当前视图和所有祖先标记为脏。

Returns the root view because it is found as a byproduct of marking the view tree
dirty, and can be used by methods that consume markViewDirty\(\) to easily schedule
change detection. Otherwise, such methods would need to traverse up the view tree
an additional time to get the root view and schedule a tick on it.

返回根视图，因为它被发现是将视图树标记为脏的副产品，并且可以由使用 markViewDirty\(\) 的方法使用以轻松安排变更检测。否则，此类方法将需要额外遍历视图树以获取根视图并在其上安排一个 tick。