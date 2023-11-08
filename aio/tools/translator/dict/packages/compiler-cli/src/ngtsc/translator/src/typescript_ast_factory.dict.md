Different optimizers use different annotations on a function or method call to indicate its pure
status.

不同的优化器在函数或方法调用上使用不同的注解来表明其纯状态。

Closure's annotation for purity is `@pureOrBreakMyCode`, but this needs to be in a semantic
\(jsdoc\) enabled comment. Thus, the actual comment text for Closure must include the `*` that
turns a `/*` comment into a `/**` comment, as well as surrounding whitespace.

Closure 的纯度注解是 `@pureOrBreakMyCode`，但这需要在启用语义（jsdoc
）的注释中。因此，Closure 的实际注释文本必须包含将 `/*` `*` 转换为 `/**` 注释的 \*
以及周围的空格。

A TypeScript flavoured implementation of the AstFactory.

AstFactory 的 TypeScript 风格的实现。

The statement that will have comments attached.

将附加注释的声明。

The comments to attach to the statement.

要附加到声明的注释。

Attach the given `leadingComments` to the `statement` node.

将给定的 `leadingComments` 附加到 `statement` 节点。