The starting node to start the top-down search.

开始自上而下搜索的起始节点。

The target position within the `node`.

`node` 中的目标位置。

Return the node that most tightly encompasses the specified `position`.

返回最紧密地包含指定 `position` 的节点。

Finds TypeScript nodes descending from the provided root which match the given filter.

查找从提供的根降序且与给定过滤器匹配的 TypeScript 节点。

Returns a property assignment from the assignment value if the property name
matches the specified `key`, or `null` if there is no match.

如果属性名称与指定的 `key` 匹配，则从赋值值返回属性赋值，如果不匹配，则返回 `null`。

property assignment

属性赋值

Given a decorator property assignment, return the ClassDeclaration node that corresponds to the
directive class the property applies to.
If the property assignment is not on a class decorator, no declaration is returned.

给定一个装饰器属性赋值，返回与该属性适用的指令类对应的 ClassDeclaration
节点。如果属性赋值不在类装饰器上，则不返回声明。

For example,

例如，

Collects all member methods, including those from base classes.

收集所有成员方法，包括来自基类的方法。

Given an existing array literal expression, update it by pushing a new expression.

给定一个现有的数组文字表达式，通过推送新表达式来更新它。

Given an ObjectLiteralExpression node, extract and return the PropertyAssignment corresponding to
the given key. `null` if no such key exists.

给定一个 ObjectLiteralExpression 节点，提取并返回与给定键对应的
PropertyAssignment。如果不存在这样的键，则为 `null`。

Given an ObjectLiteralExpression node, create or update the specified key, using the provided
callback to generate the new value \(possibly based on an old value\).

给定一个 ObjectLiteralExpression
节点，创建或更新指定的键，使用提供的回调生成新值（可能基于旧值）。

Create a new ArrayLiteralExpression, or accept an existing one.
Ensure the array contains the provided identifier.
Returns the array, either updated or newly created.
If no update is needed, returns `null`.

创建一个新的 ArrayLiteralExpression
，或接受现有的。确保数组包含提供的标识符。返回已更新或新创建的数组。如果不需要更新，则返回 `null`
。

Determine whether this an import of the given `propertyName` from a particular module
specifier already exists. If so, return the local name for that import, which might be an
alias.

确定这是否存在从特定模块说明符的给定 `propertyName`
的导入。如果是这样，请返回该导入的本地名称，这可能是别名。

Determine whether this import declaration already contains an import of the given
`propertyName`, and if so, the name it can be referred to with in the local scope.

确定此导入声明是否已包含对给定 `propertyName` 的导入，如果是，则可以在本地范围内引用它的名称。

Given an unqualified name, determine whether an existing import is already using this name in
the current scope.
TODO: It would be better to check if *any* symbol uses this name in the current scope.

给定一个不合格的名称，确定现有的导入是否已在当前范围中使用此名称。
TODO：最好检查当前范围内是否有*任何*符号使用此名称。

Generator function that yields an infinite sequence of alternative aliases for a given symbol
name.

为给定符号名称生成无限序列的替代别名的生成器函数。

Transform the given import name into an alias that does not collide with any other import
symbol.

将给定的导入名称转换为不与任何其他导入符号冲突的别名。

If the provided trait is standalone, just return it. Otherwise, returns the owning ngModule.

如果提供的特征是独立的，则返回它。否则，返回拥有的 ngModule。

Updates the imports on a TypeScript file, by ensuring the provided import is present.
Returns the text changes, as well as the name with which the imported symbol can be referred to.

通过确保提供的导入存在，更新 TypeScript 文件上的导入。返回文本更改，以及可以引用导入符号的名称。

Updates a given Angular trait, such as an NgModule or standalone Component, by adding
`importName` to the list of imports on the decorator arguments.

通过将 `importName` 添加到装饰器参数的导入列表中，更新给定的 Angular 特征，例如 NgModule 或独立组件。

Return whether a given Angular decorator specifies `standalone: true`.

返回给定的 Angular 装饰器是否指定 `standalone: true`。

Generate a new import. Follows the format:

生成新的导入。遵循以下格式：

If `exportedSpecifierName` is null, or is equal to `name`, then the qualified import alias will
be omitted.

如果 `exportedSpecifierName` 为 null 或等于 `name`，则限定的导入别名将被忽略。

Update an existing named import with a new member.
If `exportedSpecifierName` is null, or is equal to `name`, then the qualified import alias will
be omitted.

使用新成员更新现有的命名导入。如果 `exportedSpecifierName` 为 null 或等于 `name`
，则限定的导入别名将被忽略。

Get a ts.Printer for printing AST nodes, reusing the previous Printer if already created.

获取 ts.Printer 用于打印 AST 节点，如果已经创建，则重用以前的打印机。

Print a given TypeScript node into a string. Used to serialize entirely synthetic generated AST,
which will not have `.text` or `.fullText` set.

将给定的 TypeScript 节点打印为字符串。用于序列化完全合成生成的 AST，它不会设置 `.text` 或
`.fullText`。