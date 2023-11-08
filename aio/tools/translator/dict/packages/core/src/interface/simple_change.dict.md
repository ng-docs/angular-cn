Represents a basic change from a previous to a new value for a single
property on a directive instance. Passed as a value in a
{&commat;link SimpleChanges} object to the `ngOnChanges` hook.

表示指令实例上单个属性从先前值到新值的基本变更对象。在 {&commat;link SimpleChanges} 对象中作为值传递给 `ngOnChanges` 挂钩。

Check whether the new value is the first value assigned.

检查新值是否是首次赋值的。

A hashtable of changes represented by {&commat;link SimpleChange} objects stored
at the declared property name they belong to on a Directive or Component. This is
the type passed to the `ngOnChanges` hook.

用 {&commat;link SimpleChange} 对象表示的变更的哈希表，这些对象以声明的属性名称存储在指令或组件上，这些属性属于它们。这是传递给 `ngOnChanges` 钩子的类型。