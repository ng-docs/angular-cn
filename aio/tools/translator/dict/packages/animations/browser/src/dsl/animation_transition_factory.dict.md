The built timelines for the current instruction.

当前指令的构建时间表。

The name of the trigger for the current instruction.

当前指令的触发器名称。

Animation driver used to perform the check.

用于执行检查的动画驱动程序。

Checks inside a set of timelines if they try to animate a css property which is not considered
animatable, in that case it prints a warning on the console.
Besides that the function doesn't have any other effect.

如果他们试图为一个不被认为是可动画的 css 属性设置动画，则检查一组时间线，在这种情况下，它会在控制台上打印一条警告。除此之外，该功能没有任何其他效果。

Note: this check is done here after the timelines are built instead of doing on a lower level so
that we can make sure that the warning appears only once per instruction \(we can aggregate here
all the issues instead of finding them separately\).

注意：此检查是在构建时间线之后在这里完成的，而不是在较低级别上进行的，这样我们可以确保每个指令只出现一次警告（我们可以在这里汇总所有问题，而不是单独查找它们）。