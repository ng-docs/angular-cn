Helper function to extract metadata from a `Directive` or `Component`. `Directive`s without a
selector are allowed to be used for abstract base classes. These abstract directives should not
appear in the declarations of an `NgModule` and additional verification is done when processing
the module.

从 `Directive` 或 `Component` 中提取元数据的帮助器函数。允许将不带选择器的 `Directive`
用于抽象基类。这些抽象指令不应该出现在 `NgModule` 的声明中，并且在处理模块时会进行额外的验证。

Whether or not this query should collect only static results \(see view/api.ts\)

此查询是否应该仅收集静态结果（请参阅 view/api.ts）

Parse property decorators \(e.g. `Input` or `Output`\) and invoke callback with the parsed data.

解析属性装饰器（例如 `Input` 或 `Output`）并返回形状正确的元数据对象。

Parses the `inputs` array of a directive/component decorator.

解析指令/组件装饰器的 `inputs` 数组。

Parses the class members that are decorated as inputs.

解析装饰为输入的类成员。

Parses the `transform` function and its type of a specific input.

解析特定输入的 `transform` 函数及其类型。

Verifies that a type and all types contained within
it can be referenced in a specific context file.

验证类型和其中包含的所有类型是否可以在特定上下文文件中引用。

Parses the `outputs` array of a directive/component.

解析指令/组件的 `outputs` 数组。

Parses the class members that are decorated as outputs.

解析装饰为输出的类成员。

Expression that defined the `hostDirectives`.

定义 `hostDirectives` 的表达式。

Extracts and prepares the host directives metadata from an array literal expression.

从数组文字表达式中提取并准备宿主指令元数据。

Name of the field that is being parsed.

正在解析的字段的名称。

Evaluated value of the expression that defined the field.

定义字段的表达式的计算值。

Reference to the host directive class.

引用宿主指令类。

Expression that the host directive is referenced in.

引用宿主指令的表达式。

Parses the expression that defines the `inputs` or `outputs` of a host directive.

解析定义宿主指令的 `inputs` 或 `outputs` 表达式。

Converts the parsed host directive information into metadata.

将解析的宿主指令信息转换为元数据。

Converts the parsed input information into metadata.

将解析的输入信息转换为元数据。