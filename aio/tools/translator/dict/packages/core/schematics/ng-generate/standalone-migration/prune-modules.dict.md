Keeps track of the places from which we need to remove AST nodes.

跟踪我们需要从中删除 AST 节点的位置。

Module being removed.

正在删除的模块。

Collects all the nodes that a module needs to be removed from.

收集需要从中删除模块的所有节点。

Locations from which to remove the references.

要从中删除引用的位置。

Tracker in which to register the changes.

在其中注册更改的跟踪器。

Removes all tracked array references.

删除所有跟踪的数组引用。

Removes all tracked import references.

删除所有跟踪的导入引用。

Removes all tracked export references.

删除所有跟踪的导出引用。

Class that is being checked.

正在检查的类。

Determines whether an `@NgModule` class is safe to remove. A module is safe to remove if:

确定 `@NgModule` 类是否可以安全删除。在以下情况下可以安全删除模块：

It has no `declarations`.

它没有 `declarations`。

It has no `providers`.

它没有 `providers`。

It has no `bootstrap` components.

它没有 `bootstrap` 组件。

It has no `ModuleWithProviders` in its `imports`.

它的 `imports` 中没有 `ModuleWithProviders`。

It has no class members. Empty construstors are ignored.

它没有类成员。空的构造器被忽略。

Node to be checked.

要检查的节点。

Checks whether a node is a non-empty property from an NgModule's metadata. This is defined as a
property assignment with a static name, initialized to an array literal with more than one
element.

从 NgModule 的元数据中检查节点是否为非空属性。这被定义为具有静态名称的属性分配，初始化为具有多个元素的数组文字。

File that is being checked.

正在检查的文件。

Nodes that are being removed as a part of the migration.

作为迁移的一部分被删除的节点。

Determines if a file is safe to delete. A file is safe to delete if all it contains are
import statements, class declarations that are about to be deleted and non-exported code.

确定文件是否可以安全删除。如果一个文件只包含导入语句、将要删除的类声明和非导出代码，则可以安全删除该文件。

Parent node that may contain the child.

可能包含子节点的父节点。

Child node that is being checked.

正在检查的子节点。

Gets whether an AST node contains another AST node.

获取一个 AST 节点是否包含另一个 AST 节点。

Array from which to remove the nodes.

要从中删除节点的数组。

Nodes that should be removed.

应删除的节点。

Removes AST nodes from a node array.

从节点数组中删除 AST 节点。

Returns whether a node as an empty constructor.

返回一个节点是否为空构造函数。

Nodes to which to add the TODO.

要添加 TODO 的节点。

Adds TODO comments to nodes that couldn't be removed manually.

将 TODO 注释添加到无法手动删除的节点。

Finds the `NgModule` decorator in a class, if it exists.

查找类中的 `NgModule` 装饰器（如果存在）。