Type of the Attribute decorator / constructor function.

属性装饰器/构造函数的类型。

Suppose we have an `<input>` element and want to know its `type`.

假设我们有一个 `<input>` 元素，并且想知道它的 `type`。

The following example uses the decorator to inject the string literal `text` in a directive.

以下示例使用装饰器将字符串文字 `text` 注入指令中。

{&commat;example core/ts/metadata/metadata.ts region='attributeMetadata'}



The following example uses the decorator in a component constructor.

以下示例在组件构造函数中使用装饰器。

{&commat;example core/ts/metadata/metadata.ts region='attributeFactory'}



Parameter decorator for a directive constructor that designates
a host-element attribute whose value is injected as a constant string literal.

指令构造函数的参数修饰器，用于指定宿主元素属性，其值作为常量字符串文字注入。

Type of the Attribute metadata.

属性元数据的类型。

The name of the attribute whose value can be injected.

可以注入其值的属性的名称。

Attribute decorator and metadata.

属性装饰器和元数据。