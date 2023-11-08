Convert a `TypeValueReference` to an `Expression` which refers to the type as a value.

将 `TypeValueReference` 转换为将类型作为值引用的 `Expression`。

Local references are converted to a `WrappedNodeExpr` of the TypeScript expression, and non-local
references are converted to an `ExternalExpr`. Note that this is only valid in the context of the
file in which the `TypeValueReference` originated.

本地引用会转换为 TypeScript 表达式的 `WrappedNodeExpr`，非本地引用会转换为 `ExternalExpr`
。请注意，这仅在 `TypeValueReference` 源自的文件的上下文中有效。

Unwrap a `ts.Expression`, removing outer type-casts or parentheses until the expression is in its
lowest level form.

展开 `ts.Expression`，删除外部类型转换或括号，直到表达式处于最低级别形式。

For example, the expression `(foo as Type)` unwraps to `foo`.

例如，表达式 `(foo as Type)` 会展开为 `foo`。

the `forwardRef()` expression to resolve

要解析的 `forwardRef()` 表达式

a ReflectionHost

反射宿主

the resolved expression, if the original expression was a `forwardRef()`, or `null`
    otherwise.

解析的表达式（如果原始表达式是 `forwardRef()`），否则为 `null`。

If the given `node` is a `forwardRef()` expression then resolve its inner value, otherwise return
`null`.

如果给定 `node` 是 `forwardRef()` 表达式，则解析其内部值，否则返回 `null`。

a Reference to the declaration of the function being called \(which might be
forwardRef\)

对被调用函数声明的引用（可能是 forwardRef）

the arguments to the invocation of the forwardRef expression

调用 forwardRef 表达式的参数

an unwrapped argument if `ref` pointed to forwardRef, or null otherwise

如果 `ref` 指向 forwardRef，则为未包装的参数，否则为 null

A foreign function resolver for `staticallyResolve` which unwraps `forwardRef()` expressions.

`staticallyResolve` 的外部函数解析器，它解包 `forwardRef()` 表达式。

Resolvers to be combined.

要组合的解析器。

Combines an array of resolver functions into a one.

将一组解析器函数组合为一个。

Expression where functions should be wrapped in parentheses

函数应该用括号括起来的表达式

Wraps all functions in a given expression in parentheses. This is needed to avoid problems
where Tsickle annotations added between analyse and transform phases in Angular may trigger
automatic semicolon insertion, e.g. if a function is the expression in a `return` statement.
More
info can be found in Tsickle source code here:
https://github.com/angular/tsickle/blob/d7974262571c8a17d684e5ba07680e1b1993afdd/src/jsdoc_transformer.ts#L1021

将给定表达式中的所有函数包装在括号中。这是为了避免在 Angular 的分析和转换阶段之间添加的 Tsickle
注解可能会触发自动插入分号的问题，例如，如果函数是 `return` 语句中的表达式。更多信息可以在这里的
Tsickle 源代码中找到：
https://github.com/angular/tsickle/blob/d7974262571c8a17d684e5ba07680e1b1993afdd/src/jsdoc_transformer.ts#L1021

Expression that declared the providers array in the source.

在源中声明 provider 数组的表达式。

Resolves the given `rawProviders` into `ClassDeclarations` and returns
a set containing those that are known to require a factory definition.

将给定的 `rawProviders` 解析为 `ClassDeclarations`
并返回一个集合，其中包含已知需要工厂定义的那些。

Create an R3Reference for a class.

为类创建 R3Reference。

The `value` is the exported declaration of the class from its source file.
The `type` is an expression that would be used in the typings \(.d.ts\) files.

该 `value` 是从源文件中导出的类的声明。该 `type` 是 ngcc 在 typings（.d.ts）文件中使用的表达式。

Creates a ParseSourceSpan for a TypeScript node.

为 TypeScript 节点创建 ParseSourceSpan。

Collate the factory and definition compiled results into an array of CompileResult objects.

将工厂和定义的编译结果整理到 CompileResult 对象数组中。

Determines the most appropriate expression for diagnostic reporting purposes. If `expr` is
contained within `container` then `expr` is used as origin node, otherwise `container` itself is
used.

确定用于诊断报告的最合适的表达式。如果 `expr` 包含在 `container`，则使用 `expr`
作为源节点，否则使用 `container` 本身。