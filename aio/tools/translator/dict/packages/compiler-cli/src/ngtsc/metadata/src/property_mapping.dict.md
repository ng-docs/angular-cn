The name of a class property that backs an input or output declared by a directive or component.

支持由指令或组件声明的输入或输出的类属性名称。

This type exists for documentation only.

此类型仅用于文档。

The name by which an input or output of a directive or component is bound in an Angular template.

指令或组件的输入或输出在 Angular 模板中绑定的名称。

An input or output of a directive that has both a named JavaScript class property on a component
or directive class, as well as an Angular template property name used for binding.

指令的输入或输出，它同时具有组件或指令类上的命名 JavaScript 类属性，以及用于绑定的 Angular
模板属性名称。

The name of the JavaScript property on the component or directive instance for this input or
output.

此输入或输出的组件或指令实例上的 JavaScript 属性名称。

The property name used to bind this input or output in an Angular template.

用于在 Angular 模板中绑定此输入或输出的属性名称。

A mapping of component property and template binding property names, for example containing the
inputs of a particular directive or component.

组件属性和模板绑定属性名称的映射，例如包含特定指令或组件的输入。

A single component property has exactly one input/output annotation \(and therefore one binding
property name\) associated with it, but the same binding property name may be shared across many
component property names.

单个组件属性只有一个关联的输入/输出注解（因此有一个绑定属性名称），但同一个绑定属性名称可以在许多组件属性名称之间共享。

Allows bidirectional querying of the mapping - looking up all inputs/outputs with a given
property name, or mapping from a specific class property to its binding property name.

允许双向查询映射 - 查找具有给定属性名称的所有输入/输出，或从特定的类属性映射到其绑定属性名称。

Construct a `ClassPropertyMapping` with no entries.

构造一个没有条目的 `ClassPropertyMapping`。

Construct a `ClassPropertyMapping` from a primitive JS object which maps class property names
to either binding property names or an array that contains both names, which is used in on-disk
metadata formats \(e.g. in .d.ts files\).

从原始 JS 对象构造一个 `ClassPropertyMapping`
，该对象将类属性名称映射到绑定属性名称或包含这两个名称的数组，用于磁盘上的元数据格式（例如
.d.ts 文件）。

Merge two mappings into one, with class properties from `b` taking precedence over class
properties from `a`.

将两个映射合并为一个，来自 `b` 的类属性优先于来自 `a` 的类属性。

All class property names mapped in this mapping.

在此映射中映射的所有类属性名称。

All binding property names mapped in this mapping.

在此映射中映射的所有绑定属性名称。

Check whether a mapping for the given property name exists.

检查给定属性名称的映射是否存在。

Lookup all `InputOrOutput`s that use this `propertyName`.

查找使用此 `propertyName` 的所有 `InputOrOutput`。

Lookup the `InputOrOutput` associated with a `classPropertyName`.

查找与 `InputOrOutput` 关联的 `classPropertyName`。

Convert this mapping to a primitive JS object which maps each class property directly to the
binding property name associated with it.

将此映射转换为原始 JS 对象，该对象将每个类属性直接映射到与其关联的绑定属性名称。

Function used to transform the values of the generated map.

用于转换生成的地图的值的函数。

Convert this mapping to a primitive JS object which maps each class property either to itself
\(for cases where the binding property name is the same\) or to an array which contains both
names if they differ.

将此映射转换为原始 JS
对象，该对象将每个类属性映射到本身（对于绑定属性名称相同的情况），或者映射到包含两个名称（如果不同）的数组。

This object format is used when mappings are serialized \(for example into .d.ts files\).

序列化映射（例如转换为 .d.ts 文件）时会使用此对象格式。

Implement the iterator protocol and return entry objects which contain the class and binding
property names \(and are useful for destructuring\).

实现迭代器协议并返回包含类和绑定属性名称（并且可用于解构）的条目对象。