Represents internal object used to track state of each CSS class. There are 3 different \(boolean\)
flags that, combined together, indicate state of a given CSS class:

表示用于跟踪每个 CSS 类状态的内部对象。有 3 个不同的（布尔值）标志，它们组合在一起，指示给定 CSS 类的状态：

enabled: indicates if a class should be present in the DOM \(true\) or not \(false\);

enabled：指示类是否应存在于 DOM 中（真）或不存在（假）；

changed: tracks if a class was toggled \(added or removed\) during the custom dirty-checking
process; changed classes must be synchronized with the DOM;

更改：跟踪在自定义脏检查过程中是否切换（添加或删除）类； 更改的类必须与 DOM 同步；

touched: tracks if a class is present in the current object bound to the class / ngClass input;
classes that are not present any more can be removed from the internal data structures;

touched：跟踪绑定到类/ngClass 输入的当前对象中是否存在类； 不再存在的类可以从内部数据结构中删除；

Adds and removes CSS classes on an HTML element.

从 HTML 元素上添加和移除 CSS 类。

The CSS classes are updated as follows, depending on the type of the expression evaluation:

CSS 类会根据表达式求值结果进行更新，更新逻辑取决于结果的类型：

`string` - the CSS classes listed in the string \(space delimited\) are added,

`string` - 会把列在字符串中的 CSS 类（空格分隔）添加进来，

`Array` - the CSS classes declared as Array elements are added,

`Array` - 会把数组中的各个元素作为 CSS 类添加进来，

`Object` - keys are CSS classes that get added when the expression given in the value
           evaluates to a truthy value, otherwise they are removed.

`Object` - 每个 key 都是要处理的 CSS 类，当表达式求值为真的时候则添加，为假则移除。