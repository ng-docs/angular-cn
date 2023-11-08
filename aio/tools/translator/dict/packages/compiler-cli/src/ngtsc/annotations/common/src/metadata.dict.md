Given a class declaration, generate a call to `setClassMetadata` with the Angular metadata
present on the class or its member fields. An ngDevMode guard is used to allow the call to be
tree-shaken away, as the `setClassMetadata` invocation is only needed for testing purposes.

给定一个类声明，使用类或其成员字段上的 Angular 元数据生成对 `setClassMetadata` 的调用。ngDevMode
保护用于允许对调用进行树形摇动，因为 `setClassMetadata` 调用仅用于测试目的。

If no such metadata is present, this function returns `null`. Otherwise, the call is returned
as a `Statement` for inclusion along with the class.

如果不存在这样的元数据，则此函数返回 `null`。否则，调用将作为 `Statement` 返回，以与类一起包含。

Convert a reflected constructor parameter to metadata.

将反射的构造函数参数转换为元数据。

Convert a reflected class member to metadata.

将反射的类成员转换为元数据。

Convert a reflected decorator to metadata.

将反射装饰器转换为元数据。

Whether a given decorator should be treated as an Angular decorator.

给定的装饰器是否应该被视为 Angular 装饰器。

Either it's used in &commat;angular/core, or it's imported from there.

它可以在 &commat;angular/core 中使用，或者是从那里导入的。

Recursively recreates all of the `Identifier` descendant nodes with a particular name inside
of an AST node, thus removing any references to them. Useful if a particular node has to be
taken from one place any emitted to another one exactly as it has been written.

递归地重新创建 AST 节点中具有特定名称的所有 `Identifier`
后代节点，从而删除对它们的任何引用。如果必须从一个地方获取特定节点，则可能会完全按照写入的方式将其发送到另一个地方。