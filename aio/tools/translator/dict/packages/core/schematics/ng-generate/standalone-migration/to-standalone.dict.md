Function that can be used to prcess the dependencies that
are going to be added to the imports of a component.

可用于处理将要添加到组件导入的依赖项的函数。

Files that should be migrated.

应迁移的文件。

Optional function that can be used to remap file-level imports.

可用于重新映射文​​件级导入的可选函数。

Optional function that can be used to remap component-level
imports.

可用于重新映射组件级导入的可选函数。

Converts all declarations in the specified files to standalone.

将指定文件中的所有声明转换为独立的。

Declaration being converted.

正在转换的声明。

Tracker used to track the file changes.

Tracker 用于跟踪文件更改。

All the declarations that are being converted as a part of this migration.

作为此迁移的一部分正在转换的所有声明。

Converts a single declaration defined through an NgModule to standalone.

将通过 NgModule 定义的单个声明转换为独立的。

Component class declaration.

组件类声明。

Gets the expressions that should be added to a component's
`imports` array based on its template dependencies.

获取应根据其模板依赖项添加到组件的 `imports` 数组的表达式。

Class being migrated.

正在迁移的类。

Moves all of the declarations of a class decorated with `@NgModule` to its imports.

将用 `@NgModule` 装饰的类的所有声明移动到它的导入中。

Object literal used to configure the module that should be migrated.

用于配置应迁移的模块的对象文字。

Moves all the symbol references from the `declarations` array to the `imports`
array of an `NgModule` class and removes the `declarations`.

将所有符号引用从 `declarations` 数组移动到 `NgModule` 类的 `imports` 数组并删除 `declarations`。

Adds `standalone: true` to a decorator node.

将 `standalone: true` 添加到装饰器节点。

Decorator to which to add the property.

要向其添加属性的装饰器。

Property to add.

要添加的属性。

Adds a property to an Angular decorator node.

向 Angular 装饰器节点添加一个属性。

Checks if a node is a `PropertyAssignment` with a name.

检查节点是否为具有名称的 `PropertyAssignment`。

Dependency that we're searching for.

我们正在寻找的依赖关系。

Component in which the dependency is used.

使用依赖项的组件。

Mode in which to resolve the import target.

解析导入目标的模式。

Finds the import from which to bring in a template dependency of a component.

查找要从中引入组件模板依赖项的导入。

Checks whether a node is an `NgModule` metadata element with at least one element.
E.g. `declarations: [Foo]` or `declarations: SOME_VAR` would match this description,
but not `declarations: []`.

检查节点是否是具有至少一个元素的 `NgModule` 元数据元素。例如 `declarations: [Foo]` 或 `declarations: SOME_VAR` 将匹配此描述，但不匹配 `declarations: []`。

Finds all modules whose declarations can be migrated.

查找其声明可以迁移的所有模块。

Finds all testing object literals that need to be migrated.

查找所有需要迁移的测试对象文字。

Component in whose template we're looking for dependencies.

我们正在其模板中查找依赖项的组件。

Finds the classes corresponding to dependencies used in a component's template.

查找与组件模板中使用的依赖项对应的类。

Anaalyzed declarations of the module.

模块的分析声明。

Module whote declarations are being filtered.

正在过滤声明的模块。

Removes any declarations that are a part of a module's `bootstrap`
array from an array of declarations.

从声明数组中删除作为模块 `bootstrap` 数组一部分的任何声明。

Module whose declarations are being extraced.

正在提取其声明的模块。

Extracts all classes that are referenced in a module's `declarations` array.

提取模块的 `declarations` 数组中引用的所有类。

Object literals used to configure the testing modules.

用于配置测试模块的对象文字。

Non-testing declarations that are part of this migration.

作为此迁移一部分的非测试声明。

Migrates the `declarations` from a unit test file to standalone.

将 `declarations` 从单元测试文件迁移到独立文件。

Object literals that should be analyzed.

应该分析的对象字面量。

Analyzes a set of objects used to configure testing modules and returns the AST
nodes that need to be migrated and the imports that should be added to the imports
of any declared components.

分析一组用于配置测试模块的对象，并返回需要迁移的 AST 节点和应该添加到任何已声明组件的导入中的导入。

Object literal that may contain the declarations.

可能包含声明的对象文字。

Finds the class declarations that are being referred
to in the `declarations` of an object literal.

查找在对象文字 `declarations` 中引用的类声明。

Extracts the metadata object literal from an Angular decorator.

从 Angular 装饰器中提取元数据对象字面量。

Class being checked.

正在检查的类。

Classes that are being converted to standalone in this migration.

在此迁移中被转换为独立的类。

Checks whether a class is a standalone declaration.

检查类是否是独立声明。