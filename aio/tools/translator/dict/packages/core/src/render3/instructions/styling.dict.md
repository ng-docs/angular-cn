A valid CSS property.

有效的 CSS 属性。

New value to write \(`null` or an empty string to remove\).

要写入的新值（`null` 或要删除的空字符串）。

Optional suffix. Used with scalar values to add unit such as `px`.

可选的后缀。与标量值一起使用以添加单位，例如 `px`。

Note that this will apply the provided style value to the host element if this function is called
within a host binding function.

请注意，如果此函数在宿主绑定函数中调用，这会将提供的 style 值应用于宿主元素。

Update a style binding on an element with the provided value.

使用提供的值更新元素上的样式绑定。

If the style value is falsy then it will be removed from the element
\(or assigned a different value depending if there are any styles placed
on the element with `styleMap` or any static styles that are
present from when the element was created with `styling`\).

如果 style 值为 falsy，则将其从元素中删除（或分配不同的值，具体取决于是否使用 `styleMap`
在元素上放置了任何样式或使用 Style 创建元素时存在的任何静态 `styling`）。

Note that the styling element is updated as part of `stylingApply`.

请注意，样式元素是作为 `stylingApply` 的一部分更新的。

A valid CSS class \(only one\).

有效的 CSS 类（只有一个）。

A true/false value which will turn the class on or off.

一个 true/false 值，它将打开或关闭类。

Note that this will apply the provided class value to the host element if this function
is called within a host binding function.

请注意，如果在宿主绑定函数中调用此函数，这会将提供的 class 值应用于宿主元素。

Update a class binding on an element with the provided value.

使用提供的值更新元素上的类绑定。

This instruction is meant to handle the `[class.foo]="exp"` case and,
therefore, the class binding itself must already be allocated using
`styling` within the creation block.

此指令旨在处理 `[class.foo]="exp"` 情况，因此，类绑定本身必须已经使用创建块中的 `styling`
进行分配。

A key/value style map of the styles that will be applied to the given element.
       Any missing styles \(that have already been applied to the element beforehand\) will be
       removed \(unset\) from the element's styling.

将应用于给定元素的样式的键/值样式映射。任何缺失的样式（已经预先应用于元素）都将从元素的样式中删除（取消设置）。

Note that this will apply the provided styleMap value to the host element if this function
is called within a host binding.

请注意，如果在宿主绑定中调用此函数，这会将提供的 styleMap 值应用于宿主元素。

Update style bindings using an object literal on an element.

使用元素上的对象文字更新样式绑定。

This instruction is meant to apply styling via the `[style]="exp"` template bindings.
When styles are applied to the element they will then be updated with respect to
any styles/classes set via `styleProp`. If any styles are set to falsy
then they will be removed from the element.

本操作指南旨在通过 `[style]="exp"` 模板绑定来应用样式。当样式应用于元素时，它们将根据通过
`styleProp` 设置的任何样式/类进行更新。如果任何样式设置为 falsy，那么它们将被从元素中删除。

Note that the styling instruction will not be applied until `stylingApply` is called.

请注意，在调用 `stylingApply` 之前，不会应用样式指令。

KeyValueArray to add parsed values to.

要添加解析值的 KeyValueArray。

text to parse.

要解析的文本。

Parse text as style and add values to KeyValueArray.

将文本解析为样式并将值添加到 KeyValueArray。

This code is pulled out to a separate function so that it can be tree shaken away if it is not
needed. It is only referenced from `ɵɵstyleMap`.

此代码被提取到一个单独的函数中，以便在不需要时可以将其从树上摇掉。它仅从 `ɵɵstyleMap` 引用。

A key/value map or string of CSS classes that will be added to the
       given element. Any missing classes \(that have already been applied to the element
       beforehand\) will be removed \(unset\) from the element's list of CSS classes.

将添加到给定元素的键/值映射或 CSS 类的字符串。任何缺失的类（已事先应用于元素）都将从元素的 CSS
类列表中删除（取消设置）。

Update class bindings using an object literal or class-string on an element.

使用元素上的对象文字或类字符串更新类绑定。

This instruction is meant to apply styling via the `[class]="exp"` template bindings.
When classes are applied to the element they will then be updated with
respect to any styles/classes set via `classProp`. If any
classes are set to falsy then they will be removed from the element.

本操作指南旨在通过 `[class]="exp"` 模板绑定来应用样式。当类应用于元素时，它们将根据通过
`classProp` 设置的任何样式/类进行更新。如果任何类设置为 falsy，那么它们将被从元素中删除。

Note that the styling instruction will not be applied until `stylingApply` is called.
Note that this will the provided classMap value to the host element if this function is called
within a host binding.

请注意，在调用 `stylingApply`
之前，不会应用样式指令。请注意，如果此函数在宿主绑定中调用，这将提供给宿主元素的 classMap 值。

Parse text as class and add values to KeyValueArray.

将文本解析为类，并将值添加到 KeyValueArray。

This code is pulled out to a separate function so that it can be tree shaken away if it is not
needed. It is only referenced from `ɵɵclassMap`.

此代码被提取到一个单独的函数中，以便在不需要时可以将其从树上摇掉。它仅从 `ɵɵclassMap` 引用。

property name.

属性名称。

binding value.

绑定值。

suffix for the property \(e.g. `em` or `px`\)

属性的后缀（例如 `em` 或 `px`）

`true` if `class` change \(`false` if `style`\)

如果是基于 `class` 更改的，则为 `true`（如果基于 `style` 则为 `false`）

Common code between `ɵɵclassProp` and `ɵɵstyleProp`.

`ɵɵclassProp` 和 `ɵɵstyleProp` 之间的通用代码。

\(See `keyValueArraySet` in "util/array_utils"\) Gets passed in as a
       function so that `style` can be processed. This is done for tree shaking purposes.

（请参阅“util/array_utils”中的 `keyValueArraySet`）作为函数传入，以便可以处理 `style`
。这样做是为了摇树的目的。

Parser used to parse `value` if `string`. \(Passed in as `style` and `class`
       have different parsers.\)

解析器用于解析 `string` 的 `value`。（作为 `style` 传入，并且 `class` 有不同的解析器。）

bound value from application

来自应用程序的绑定值

Common code between `ɵɵclassMap` and `ɵɵstyleMap`.

`ɵɵclassMap` 和 `ɵɵstyleMap` 之间的通用代码。

Current `TView`

当前 `TView`

index of binding which we would like if it is in `hostBindings`

如果它在 `hostBindings` 中，我们想要的绑定索引

Determines when the binding is in `hostBindings` section

确定绑定何时在 `hostBindings` 部分

`TView` where the binding linked list will be stored.

将存储绑定链表的 `TView`。

Property/key of the binding.

绑定的属性/键。

Index of binding associated with the `prop`

与 `prop` 关联的绑定索引

Collects the necessary information to insert the binding into a linked list of style bindings
using `insertTStylingBinding`.

使用 `insertTStylingBinding` 收集必要的信息以将绑定插入到样式绑定的链表中。

`TData` where the linked list is stored.

存储链表的 `TData`。

`TNode` for which the styling is being computed.

正在计算其样式的 `TNode`。

`TStylingKeyPrimitive` which may need to be wrapped into `TStylingKey`

可能需要包装到 `TStylingKeyPrimitive` 中的 `TStylingKey`

`true` if `class` \(`false` if `style`\)

如果是基于 `class` 的，则为 `true`（如果是基于 `style` 的，则为 `false`）

Adds static styling information to the binding if applicable.

如果适用，将静态样式信息添加到绑定。

The linked list of styles not only stores the list and keys, but also stores static styling
information on some of the keys. This function determines if the key should contain the styling
information and computes it.

样式链表不仅存储列表和键，还会在某些键上存储静态样式信息。此函数确定键是否应包含样式信息并进行计算。

See `TStylingStatic` for more details.

有关更多详细信息，请参阅 `TStylingStatic`。

`TStylingKey` if found or `undefined` if not found.

如果找到，`TStylingKey`，如果找不到，则为 `undefined`。

Retrieve the `TStylingKey` for the template styling instruction.

检索模板样式说明的 `TStylingKey`。

This is needed since `hostBinding` styling instructions are inserted after the template
instruction. While the template instruction needs to update the residual in `TNode` the
`hostBinding` instructions need to update the `TStylingKey` of the template instruction because
the template instruction is downstream from the `hostBindings` instructions.

这是需要的，因为 `hostBinding` 样式说明是在模板指令之后插入的。虽然模板指令需要更新 `hostBinding`
`TNode` 需要更新模板指令的 `TStylingKey`，因为模板指令是 `hostBindings` 指令的下游。

New `TStylingKey` which is replacing the old one.

新的 `TStylingKey` 正在替换旧的。

Update the `TStylingKey` of the first template instruction in `TNode`.

更新 `TStylingKey` 中第一个模板指令的 `TNode`。

Logically `hostBindings` styling instructions are of lower priority than that of the template.
However, they execute after the template styling instructions. This means that they get inserted
in front of the template styling instructions.

从逻辑上讲，`hostBindings`
样式说明的优先级低于模板的优先级。但是，它们会在模板样式说明之后执行。这意味着它们会被插入到模板样式说明的前面。

If we have a template styling instruction and a new `hostBindings` styling instruction is
executed it means that it may need to steal static fields from the template instruction. This
method allows us to update the first template instruction `TStylingKey` with a new value.

如果我们有模板样式指令并执行了新的 `hostBindings`
样式指令，则意味着它可能需要从模板指令中窃取静态字段。此方法允许我们使用新值更新第一个模板指令
`TStylingKey`。

Assume:

假设：

`TData` where the `DirectiveDefs` are stored.

存储 `DirectiveDefs` 的 `TData`。

`TNode` which contains the directive range.

包含指令范围的 `TNode`。

Collect all static values after the current `TNode.directiveStylingLast` index.

收集当前 `TNode.directiveStylingLast` 索引之后的所有静态值。

Collect the remaining styling information which has not yet been collected by an existing
styling instruction.

收集现有样式指令尚未收集的其余样式信息。

`DirectiveDef` for which we want to collect lower priority static
       styling. \(Or `null` if template styling\)

我们要为其收集较低优先级的静态样式的 `DirectiveDef`。（如果是模板样式，则为 `null`）

Existing `TStylingKey` to update or wrap.

要更新或包装的现有 `TStylingKey`。

Collect the static styling information with lower priority than `hostDirectiveDef`.

收集优先级低于 `hostDirectiveDef` 的静态样式信息。

\(This is opposite of residual styling.\)

（这与残留样式相反。）

existing `TStylingKey` to update or wrap.

要更新或包装的现有 `TStylingKey`。

`TAttributes` to process.

要处理的 `TAttributes`。

Convert `TAttrs` into `TStylingStatic`.

将 `TAttrs` 转换为 `TStylingStatic`。

\(See `keyValueArraySet` in "util/array_utils"\) Gets passed in as a
       function so that `style` can be processed. This is done
       for tree shaking purposes.

（请参阅“util/array_utils”中的 `keyValueArraySet`）作为函数传入，以便可以处理 `style`
。这样做是为了摇树的目的。

The parser is passed in so that it will be tree shakable. See
       `styleStringParser` and `classStringParser`

传入解析器，以便它是可摇树的。请参阅 `styleStringParser` 和 `classStringParser`

The value to parse/convert to `KeyValueArray`

要解析/转换为 `KeyValueArray` 的值

Convert user input to `KeyValueArray`.

将用户输入转换为 `KeyValueArray`。

This function takes user input which could be `string`, Object literal, or iterable and converts
it into a consistent representation. The output of this is `KeyValueArray` \(which is an array
where
even indexes contain keys and odd indexes contain values for those keys\).

此函数接受用户输入，可以是 `string`、Object 文字或 iterable
，并将其转换为一致的表示。它的输出是 `KeyValueArray`
（这是一个数组，其中偶数索引包含键，奇数索引包含这些键的值）。

The advantage of converting to `KeyValueArray` is that we can perform diff in an input
independent
way.
\(ie we can compare `foo bar` to `['bar', 'baz']` and determine a set of changes which need to be
applied\)

转换为 `KeyValueArray` 的优势是我们可以以与输入无关的方式执行 diff。（即我们可以将 `foo bar` 与
`['bar', 'baz']` 进行比较，并确定需要应用的一组更改）

The fact that `KeyValueArray` is sorted is very important because it allows us to compute the
difference in linear fashion without the need to allocate any additional data.

`KeyValueArray`
已排序的事实非常重要，因为它允许我们以线性方式计算差值，而无需分配任何额外的数据。

For example if we kept this as a `Map` we would have to iterate over previous `Map` to determine
which values need to be deleted, over the new `Map` to determine additions, and we would have to
keep additional `Map` to keep track of duplicates or items which have not yet been visited.

例如，如果我们将其保留为 `Map`，我们将不得不迭代以前的 `Map` 来确定需要删除哪些值，遍历新 `Map`
来确定要添加的值，并且我们将不得不保留额外的 `Map` 以跟踪重复项或条目尚未访问。

KeyValueArray to add to.

要添加到的 KeyValueArray。

Style key to add.

要添加的样式键。

The value to set.

要设置的值。

Set a `value` for a `key`.

为 `key` 设置 `value`。

See: `keyValueArraySet` for details

有关详细信息，请参阅：`keyValueArraySet`

Class-binding-specific function for setting the `value` for a `key`.

用于设置 `value` 的特定于 `key` 绑定的函数。

Associated `TView.data` contains the linked list of binding priorities.

关联的 `TView.data` 包含绑定优先级的链表。

`TNode` where the binding is located.

绑定所在的 `TNode`。

`LView` contains the values associated with other styling binding at this `TNode`.

`LView` 包含与此 `TNode` 上的其他样式绑定关联的值。

Renderer to use if any updates.

如果有任何更新，要使用的渲染器。

Previous value represented as `KeyValueArray`

表示为 `KeyValueArray` 的前一个值

Current value represented as `KeyValueArray`

表示为 `KeyValueArray` 的当前值

Binding index of the binding.

绑定的绑定索引。

Update map based styling.

更新基于地图的样式。

Map based styling could be anything which contains more than one binding. For example `string`,
or object literal. Dealing with all of these types would complicate the logic so
instead this function expects that the complex input is first converted into normalized
`KeyValueArray`. The advantage of normalization is that we get the values sorted, which makes it
very cheap to compute deltas between the previous and current value.

基于映射的样式可以是任何包含多个绑定的东西。例如 `string`
或对象文字。处理所有这些类型会使逻辑复杂化，因此此函数期望复杂的输入首先转换为规范化的
`KeyValueArray`
。归一化的优势是我们对值进行了排序，这使得计算前一个值和当前值之间的差值变得非常便宜。

Either style property name or a class name.

样式属性名或类名。

Either style value for `prop` or `true`/`false` if `prop` is class.

`prop` 的样式值，如果 `prop` 是 class，则为 `true` / `false`。

Update a simple \(property name\) styling.

更新简单（属性名称）样式。

This function takes `prop` and updates the DOM to that value. The function takes the binding
value as well as binding priority into consideration to determine which value should be written
to DOM. \(For example it may be determined that there is a higher priority overwrite which blocks
the DOM write, or if the value goes to `undefined` a lower priority overwrite may be consulted.\)

此函数接受 `prop` 并将 DOM 更新为该值。该函数会考虑绑定值以及绑定优先级来确定应该将哪个值写入
DOM。（例如，可以确定有较高优先级的覆盖会阻止 DOM 写入，或者如果值变为 `undefined`
，则可以咨询较低优先级的覆盖。）

`TData` used for traversing the priority.

用于遍历优先级的 `TData`。

`TNode` to use for resolving static styling. Also controls search direction.

用于解析静态样式的 `TNode`。还控制搜索方向。

`TNode` search next and quit as soon as `isStylingValuePresent(value)` is true.
   If no value found consult `tNode.residualStyle`/`tNode.residualClass` for default value.

`TNode` 搜索下一个并在 `isStylingValuePresent(value)` 为 true 时立即退出。如果找不到值，请参阅
`tNode.residualStyle` / `tNode.residualClass` 作为默认值。

`null` search prev and go all the way to end. Return last value where
`isStylingValuePresent(value)` is true.

`null` 搜索 prev 并一直到 end。返回 `isStylingValuePresent(value)` 为 true 的最后一个值。

`LView` used for retrieving the actual values.

`LView` 用于检索实际值。

Property which we are interested in.

我们感兴趣的属性。

Starting index in the linked list of styling bindings where the search should start.

应该开始搜索的样式绑定链接列表中的起始索引。

Search for styling value with higher priority which is overwriting current value, or a
value of lower priority to which we should fall back if the value is `undefined`.

搜索具有较高优先级的样式值，它会覆盖当前值，或者搜索优先级较低的值，如果值为 `undefined`
，我们应该回退到。

When value is being applied at a location, related values need to be consulted.

在某个位置应用值时，需要参考相关值。

If there is a higher priority binding, we should be using that one instead.
  For example `<div  [style]="{color:exp1}" [style.color]="exp2">` change to `exp1`
  requires that we check `exp2` to see if it is set to value other than `undefined`.

如果有更高优先级的绑定，我们应该改用那个绑定。例如 `<div [style]="{color:exp1}"
[style.color]="exp2">` 更改为 `exp1` 需要我们检查 `exp2` 以查看它是否设置为 `undefined`
以外的值。

If there is a lower priority binding and we are changing to `undefined`
  For example `<div  [style]="{color:exp1}" [style.color]="exp2">` change to `exp2` to
  `undefined` requires that we check `exp1` \(and static values\) and use that as new value.

如果有较低优先级的绑定并且我们要更改为 `undefined` 例如 `<div [style]="{color:exp1}"
[style.color]="exp2">` 将 `exp2` 更改为 `undefined` 要求我们检查 `exp1`
（和静态值）并将其作为新值。

NOTE: The styling stores two values.

注意：此样式存储两个值。

The raw value which came from the application is stored at `index + 0` location. \(This value
is used for dirty checking\).

来自应用程序的原始值存储在 `index + 0` 位置。（此值用于脏检查）。

The normalized value is stored at `index + 1`.

归一化值存储在 `index + 1` 处。

Binding style value.

绑定样式值。

Determines if the binding value should be used \(or if the value is 'undefined' and hence priority
resolution should be used.\)

确定是否应该使用绑定值（或者该值是否为 'undefined'，因此应该使用优先级解析。）

Normalizes and/or adds a suffix to the value.

对值进行规范化和/或添加后缀。

If value is `null`/`undefined` no suffix is added

如果值为 `null` / `undefined`，则不添加后缀

`TNode` which we would like to see if it has shadow.

我们想查看它是否有阴影的 `TNode`。

Tests if the `TNode` has input shadow.

测试 `TNode` 是否有输入阴影。

An input shadow is when a directive steals \(shadows\) the input by using `@Input('style')` or
`@Input('class')` as input.

输入阴影是指指令使用 `@Input('style')` 或 `@Input('class')` 作为输入来窃取（阴影）输入。