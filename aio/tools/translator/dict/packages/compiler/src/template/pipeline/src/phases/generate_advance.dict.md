Generate `ir.AdvanceOp`s in between `ir.UpdateOp`s that ensure the runtime's implicit slot
context will be advanced correctly.

在 `ir.UpdateOp` 之间生成 `ir.AdvanceOp` 以确保正确推进运行时的隐式槽上下文。