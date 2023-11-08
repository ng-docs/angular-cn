The literal style url extracted from the decorator, along with metadata for diagnostics.

从装饰器中提取的文字风格 url，以及用于诊断的元数据。

Information about the origin of a resource in the application code. This is used for creating
diagnostics, so we can point to the root cause of an error in the application code.

应用程序代码中有关资源来源的信息。这用于创建诊断，因此我们可以指出应用程序代码中错误的根本原因。

A template resource comes from the `templateUrl` property on the component decorator.

模板资源来自组件装饰器上的 `templateUrl` 属性。

Stylesheets resources can come from either the `styleUrls` property on the component decorator,
or from inline `style` tags and style links on the external template.

样式表资源可以来自组件装饰器上的 `styleUrls` 属性，也可以来自外部模板上的内联 `style`
标签和样式链接。

Information about the template which was extracted during parsing.

有关解析期间提取的模板的信息。

This contains the actual parsed template as well as any metadata collected during its parsing,
some of which might be useful for re-parsing the template with different options.

这包含实际解析的模板以及在其解析期间收集的任何元数据，其中一些可能可用于使用不同的选项重新解析模板。

The template AST, parsed in a manner which preserves source map information for diagnostics.

模板 AST，以保留源映射信息以进行诊断的方式解析。

Not useful for emit.

对发射没有用。

The `ParseSourceFile` for the template.

模板的 `ParseSourceFile`。

The string contents of the template.

模板的字符串内容。

Common fields extracted from the declaration of a template.

从模板声明中提取的通用字段。

Information extracted from the declaration of an inline template.

从内联模板声明中提取的信息。

Information extracted from the declaration of an external template.

从外部模板的声明中提取的信息。

The declaration of a template extracted from a component decorator.

从组件装饰器中提取的模板的声明。

This data is extracted and stored separately to facilitate re-interpreting the template
declaration whenever the compiler is notified of a change to a template file. With this
information, `ComponentDecoratorHandler` is able to re-read the template and update the component
record without needing to parse the original decorator again.

这些数据会被单独提取和存储，以方便每当编译器被通知模板文件发生更改时重新解释模板声明。使用这些信息，
`ComponentDecoratorHandler` 可以重新读取模板并更新组件记录，而无需再次解析原始装饰器。

Determines the node to use for debugging purposes for the given TemplateDeclaration.

确定要用于给定 TemplateDeclaration 的调试目的的节点。

Transforms the given decorator to inline external resources. i.e. if the decorator
resolves to `@Component`, the `templateUrl` and `styleUrls` metadata fields will be
transformed to their semantically-equivalent inline variants.

将给定的装饰器转换为内联外部资源。即，如果装饰器解析为 `@Component`，则 `templateUrl` 和
`styleUrls` 元数据字段将被转换为它们在语义上等效的内联变体。

This method is used for serializing decorators into the class metadata. The emitted
class metadata should not refer to external resources as this would be inconsistent
with the component definitions/declarations which already inline external resources.

此方法用于将装饰器序列化为类元数据。发出的类元数据不应引用外部资源，因为这将与已经内联外部资源的组件定义/声明不一致。

Additionally, the references to external resources would require libraries to ship
external resources exclusively for the class metadata.

此外，对外部资源的引用将要求库专门为类元数据提供外部资源。