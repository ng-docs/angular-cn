This array represents the DOM schema. It encodes inheritance, properties, and events.

此数组表示 DOM 模式。它对继承、属性和事件进行编码。

Overview

概览

Each line represents one kind of element. The `element_inheritance` and properties are joined
using `element_inheritance|properties` syntax.

每行都代表一种元素。使用 `element_inheritance|properties` 语法连接 `element_inheritance` 和
properties。

Element Inheritance

元素继承

The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
Here the individual elements are separated by `,` \(commas\). Every element in the list
has identical properties.

`element_inheritance` 可以进一步细分为 `element1,element2,...^parentElement`。在这里，各个元素用
`,`（逗号）分隔。列表中的每个元素都具有相同的属性。

An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
specified then `""` \(blank\) element is assumed.

`element` 可以从 `parentElement` 继承其他属性如果没有指定 `^parentElement`，则假定为 `""`
（空白）元素。

NOTE: The blank element inherits from root `[Element]` element, the super element of all
elements.

注意：blank 元素继承自根 `[Element]` 元素，这是所有元素的超级元素。

NOTE an element prefix such as `:svg:` has no special meaning to the schema.

注意 `:svg:` 等元素前缀对模式没有特殊含义。

Properties

属性

Each element has a set of properties separated by `,` \(commas\). Each property can be prefixed
by a special character designating its type:

每个元素都有一组用 `,`（逗号）分隔的属性。每个属性都可以以指定其类型的特殊字符为前缀：

\(no prefix\): property is a string.

（无前缀）：属性是一个字符串。

`*`: property represents an event.

`*`：属性表示一个事件。

`!`: property is a boolean.

`!` : 属性是布尔值。

`#`: property is a number.

`#`：属性是一个数字。

`%`: property is an object.

`%`：属性是一个对象。

Query

查询

The class creates an internal squas representation which allows to easily answer the query of
if a given property exist on a given element.

类创建了一个内部 squas 表示，它可以轻松回答给定元素上是否存在给定属性的查询。

NOTE: We don't yet support querying for types or events.
NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
      see dom_element_schema_registry_spec.ts

注意：我们尚不支持查询类型或事件。注意：此模式是从位于 test 文件夹中的 `schema_extractor.ts`
中自动提取的，请参阅 dom_element_schema_registry_spec.ts

securityContext returns the security context for the given property on the given DOM tag.

securityContext 会返回给定 DOM 标签上给定属性的安全上下文。

Tag and property name are statically known and cannot change at runtime, i.e. it is not
possible to bind a value into a changing attribute or tag name.

标签和属性名称是静态已知的，在运行时不能更改，即不可能将值绑定到不断变化的属性或标签名称。

The filtering is based on a list of allowed tags|attributes. All attributes in the schema
above are assumed to have the 'NONE' security context, i.e. that they are safe inert
string values. Only specific well known attack vectors are assigned their appropriate context.

过滤是基于允许的标签|属性列表的。上面的模式中的所有属性都假定具有 'NONE'
安全上下文，即它们是安全的惰性字符串值。只有特定的知名攻击向量才会被分配适当的上下文。