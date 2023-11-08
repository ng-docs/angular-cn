Minimum amount of binding slots required in the runtime for style/class bindings.

运行时中样式/类绑定所需的最小绑定槽量。

Styling in Angular uses up two slots in the runtime LView/TData data structures to
record binding data, property information and metadata.

Angular 中的样式设置会使用运行时 LView/TData
数据结构中的两个插槽来记录绑定数据、属性信息和元数据。

When a binding is registered it will place the following information in the `LView`:

注册绑定时，它将将以下信息放在 `LView` 中：

slot 1\) binding value
slot 2\) cached value \(all other values collected before it in string form\)

插槽 1）绑定值插槽 2）缓存值（在它之前以字符串形式收集的所有其他值）

When a binding is registered it will place the following information in the `TData`:

注册绑定时，它将将以下信息放在 `TData` 中：

slot 1\) prop name
slot 2\) binding index that points to the previous style/class binding \(and some extra config
values\)

插槽 1）道具名称插槽 2）指向前一个样式/类绑定（以及一些额外的配置值）的绑定索引

Let's imagine we have a binding that looks like so:

假设我们有一个看起来像这样的绑定：

Our `LView` and `TData` data-structures look like so:

我们的 `LView` 和 `TData` 数据结构如下所示：

A styling expression summary that is to be processed by the compiler

要由编译器处理的样式表达式摘要

Calls to individual styling instructions. Used when chaining calls to the same instruction.

调用单个样式说明。在链接对同一条指令的调用时使用。

An internal record of the input data for a styling binding

样式绑定的输入数据的内部记录

Produces creation/update instructions for all styling bindings \(class and style\)

为所有样式绑定（类和风格）生成创建/更新操作指南

It also produces the creation instruction to register all initial styling values
\(which are all the static class="..." and style="..." attribute values that exist
on an element within a template\).

它还会生成创建指令来注册所有初始样式值（这是模板中元素上存在的所有 static class="..." 和
style="..." 属性值）。

The builder class below handles producing instructions for the following cases:

下面的构建器类会处理针对以下情况的生成操作指南：

Static style/class attributes \(style="..." and class="..."\)

静态样式/类属性（style="..." 和 class="..."）

Dynamic style/class map bindings \(`[style]="map"` and `[class]="map|string"`\)

动态样式/类映射绑定（`[style]="map"` 和 `[class]="map|string"`）

Dynamic style/class property bindings \(`[style.prop]="exp"` and `[class.name]="exp"`\)

动态样式/类属性绑定（ `[style.prop]="exp"` 和 `[class.name]="exp"` ）

Due to the complex relationship of all of these cases, the instructions generated
for these attributes/properties/bindings must be done so in the correct order. The
order which these must be generated is as follows:

由于所有这些情况下的复杂关系，为这些属性/属性/绑定生成的指令必须按正确的顺序完成。这些必须生成的顺序如下：

if \(createMode\) {
  styling\(...\)
}
if \(updateMode\) {
  styleMap\(...\)
  classMap\(...\)
  styleProp\(...\)
  classProp\(...\)
}



The creation/update methods within the builder class produce these instructions.

构建器类中的创建/更新方法会生成这些操作指南。

Whether or not there are any styling bindings present
 \(i.e. `[style]`, `[class]`, `[style.prop]` or `[class.name]`\)

是否存在任何样式绑定（即 `[style]`、`[class]`、`[style.prop]` 或 `[class.name]`）

Registers a given input to the styling builder to be later used when producing AOT code.

将给定的输入注册到样式构建器，以供以后生成 AOT 代码时使用。

The code below will only accept the input if it is somehow tied to styling \(whether it be
style/class bindings or static style/class attributes\).

下面的代码仅在输入以某种方式与样式绑定（无论是样式/类绑定还是静态样式/类属性）时才接受输入。

the style string \(e.g. `width:100px; height:200px;`\)

样式字符串（例如 `width:100px; height:200px;`）

Registers the element's static style string value to the builder.

将元素的静态样式字符串值注册到构建器。

the className string \(e.g. `disabled gold zoom`\)

className 字符串（例如 `disabled gold zoom`）

Registers the element's static class string value to the builder.

将元素的静态类字符串值注册到构建器。

an existing array where each of the styling expressions
will be inserted into.

将在其中插入每个样式表达式的现有数组。

Appends all styling-related expressions to the provided attrs array.

将所有与样式相关的表达式附加到提供的 attrs 数组。

Builds an instruction with all the expressions and parameters for `elementHostAttrs`.

使用 `elementHostAttrs` 的所有表达式和参数构建指令。

The instruction generation code below is used for producing the AOT statement code which is
responsible for registering initial styles \(within a directive hostBindings' creation block\),
as well as any of the provided attribute values, to the directive host element.

下面的指令生成代码用于生成 AOT 语句代码，该代码负责将初始样式（在指令 hostBindings
的创建块中）以及提供的任何属性值注册到指令宿主元素。

Builds an instruction with all the expressions and parameters for `classMap`.

使用 `classMap` 的所有表达式和参数构建指令。

The instruction data will contain all expressions for `classMap` to function
which includes the `[class]` expression params.

指令数据将包含 `classMap` to function 的所有表达式，其中包括 `[class]` 表达式参数。

Builds an instruction with all the expressions and parameters for `styleMap`.

使用 `styleMap` 的所有表达式和参数构建指令。

The instruction data will contain all expressions for `styleMap` to function
which includes the `[style]` expression params.

指令数据将包含 `styleMap` to function 的所有表达式，其中包括 `[style]` 表达式参数。

Constructs all instructions which contain the expressions that will be placed
into the update block of a template function or a directive hostBindings function.

构造包含将被放入模板函数或指令 hostBindings 函数的 update 块中的表达式的所有指令。

An Interpolation AST

插值 AST

Gets the instruction to generate for an interpolated class map.

获取要为插值类映射表生成的指令。

Gets the instruction to generate for an interpolated style map.

获取要为内插样式映射表生成的指令。

Gets the instruction to generate for an interpolated style prop.

获取要为内插样式道具生成的指令。

Checks whether property name is a custom CSS property.
See: https://www.w3.org/TR/css-variables-1

检查属性名称是否是自定义 CSS 属性。请参阅：https://www.w3.org/TR/css-variables-1