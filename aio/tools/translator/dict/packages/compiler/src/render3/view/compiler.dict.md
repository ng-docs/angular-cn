Add features to the definition map.

将特性添加到定义地图。

Compile a directive for the render3 runtime as defined by the `R3DirectiveMetadata`.

为 R3DirectiveMetadata 定义的 `R3DirectiveMetadata` 运行时编译指令。

Compile a component for the render3 runtime as defined by the `R3ComponentMetadata`.

为 R3ComponentMetadata 定义的 `R3ComponentMetadata` 运行时编译组件。

Creates the type specification from the component meta. This type is inserted into .d.ts files
to be consumed by upstream compilations.

从组件元创建类型规范。此类型会插入到 .d.ts 文件中以供上游编译使用。

Compiles the array literal of declarations into an expression according to the provided emit
mode.

根据提供的发出模式，将声明的数组文字编译为表达式。

A set of flags to be used with Queries.

要与查询一起使用的一组标志。

NOTE: Ensure changes here are in sync with `packages/core/src/render3/interfaces/query.ts`

注意：确保此处的更改与 `packages/core/src/render3/interfaces/query.ts`

No flags

没有标志

Whether or not the query should descend into children.

查询是否应该下降到子项。

The query can be computed statically and hence can be assigned eagerly.

查询可以静态计算，因此可以立即分配。

NOTE: Backwards compatibility with ViewEngine.

注意：与 ViewEngine 的向后兼容。

If the `QueryList` should fire change event only if actual change to query was computed \(vs old
behavior where the change was fired whenever the query was recomputed, even if the recomputed
query resulted in the same list.\)

如果仅在计算了对查询的实际更改时，`QueryList` 应该触发 change
事件（与旧行为相比，每当重新计算查询时都会触发更改，即使重新计算的查询产生了同一个列表。）

Translates query flags into `TQueryFlags` type in packages/core/src/render3/interfaces/query.ts

将查询标志转换为 packages/core/src/render3/interfaces/query.ts 中的 `TQueryFlags` 类型

Creates the type specification from the directive meta. This type is inserted into .d.ts files
to be consumed by upstream compilations.

从指令元创建类型规范。此类型会插入到 .d.ts 文件中以供上游编译使用。

set of host bindings to verify.

要验证的一组宿主绑定。

source span where host bindings were defined.

定义宿主绑定的源跨度。

array of errors associated with a given set of host bindings.

与给定的宿主绑定集相关的错误数组。

Verifies host bindings and returns the list of errors \(if any\). Empty array indicates that a
given set of host bindings has no errors.

验证宿主绑定并返回错误列表（如果有）。空数组表示给定的一组宿主绑定没有错误。

Converts an input/output mapping object literal into an array where the even keys are the
public name of the binding and the odd ones are the name it was aliased to. E.g.
`{inputOne: 'aliasOne', inputTwo: 'aliasTwo'}` will become
`['inputOne', 'aliasOne', 'inputTwo', 'aliasTwo']`.

将输入/输出映射对象文字转换为数组，其中偶数键是绑定的公共名称，奇数键是它的别名。例如 `{inputOne: 'aliasOne', inputTwo: 'aliasTwo'}` 将变为 `['inputOne', 'aliasOne', 'inputTwo', 'aliasTwo']`。

This conversion is necessary, because hosts bind to the public name of the host directive and
keeping the mapping in an object literal will break for apps using property renaming.

这种转换是必要的，因为宿主绑定到宿主指令的公共名称，并且将映射保留在对象文字中会破坏使用属性重命名的应用程序。