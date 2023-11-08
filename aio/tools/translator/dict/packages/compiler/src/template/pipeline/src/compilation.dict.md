Compilation-in-progress of a whole component's template, including the main template and any
embedded views or host bindings.

正在编译整个组件的模板，包括主模板和任何嵌入式视图或宿主绑定。

Map of view IDs to `ViewCompilation`s.

视图 ID 到 `ViewCompilation` 的映射。

Constant expressions used by operations within this component's compilation.

此组件编译中的操作使用的常量表达式。

This will eventually become the `consts` array in the component definition.

这最终将成为组件定义中的 `consts` 数组。

The root view, representing the component's template.

根视图，代表组件的模板。

Add a `ViewCompilation` for a new embedded view to this compilation.

将新嵌入式视图的 `ViewCompilation` 添加到此编译中。

Generate a new unique `ir.XrefId`.

生成一个新的唯一 `ir.XrefId`。

Add a constant `o.Expression` to the compilation and return its index in the `consts` array.

将常量 `o.Expression` 添加到编译中，并返回其在 `consts` 数组中的索引。

Compilation-in-progress of an individual view within a template.

模板中单个视图的编译正在进行中。

Name of the function which will be generated for this view.

将为该视图生成的函数的名称。

May be `null` if not yet determined.

如果尚未确定，则可能为 `null`。

List of creation operations for this view.

此视图的创建操作列表。

Creation operations may internally contain other operations, including update operations.

创建操作可能在内部包含其他操作，包括更新操作。

List of update operations for this view.

此视图的更新操作列表。

Map of declared variables available within this view to the property on the context object
which they alias.

此视图中可用的已声明变量映射到它们别名的上下文对象上的属性。

Number of declaration slots used within this view, or `null` if slots have not yet been
allocated.

此视图中使用的声明插槽数，如果尚未分配插槽，则为 `null`。

Number of variable slots used within this view, or `null` if variables have not yet been
counted.

此视图中使用的变量槽数，如果尚未计算变量，则为 `null`。

Iterate over all `ir.Op`s within this view.

遍历此视图中的所有 `ir.Op`。

Some operations may have child operations, which this iterator will visit.

某些操作可能有子操作，此迭代器将访问这些子操作。