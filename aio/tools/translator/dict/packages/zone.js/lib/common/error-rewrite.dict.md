Extend the Error with additional fields for rewritten stack frames

使用额外的字段来扩展 Error 以用于重写的堆栈帧

Stack trace where extra frames have been removed and zone names added.

已删除额外帧并添加区域名称的堆栈跟踪。

Original stack trace with no modifications

未经修改的原始堆栈跟踪

This is ZoneAwareError which processes the stack frame and cleans up extra frames as well as
adds zone information to it.

这是 ZoneAwareError，它会处理堆栈帧并清理额外的帧以及向其添加区域信息。