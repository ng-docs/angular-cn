Map used to look up nodes based on their positions in a source file.

Map 用于根据节点在源文件中的位置查找节点。

Utility to type a class declaration with a name.

使用名称键入类声明的实用程序。

Text span of an AST node.

AST 节点的文本跨度。

Mapping between a file name and spans for node references inside of it.

文件名和其中节点引用的跨度之间的映射。

Utility class used to track a one-to-many relationship where all the items are unique.

用于跟踪所有项目都是唯一的一对多关系的实用程序类。

Resolves references to nodes.

解析对节点的引用。

Finds all references to a node within the entire project.

查找整个项目中对某个节点的所有引用。

Finds all references to a node within a single file.

在单个文件中查找对节点的所有引用。

Creates a NodeLookup object from a source file.

从源文件创建一个 NodeLookup 对象。

Data structure used to look up nodes at particular positions.

用于在特定位置查找节点的数据结构。

Offsets of the nodes.

节点的偏移量。

Set in which to store the results.

设置存储结果的位置。

Converts node offsets to the nodes they correspond to.

将节点偏移量转换为它们对应的节点。

Node referring to a class declaration.

引用类声明的节点。

Finds the class declaration that is being referred to by a node.

查找节点引用的类声明。

Finds a property with a specific name in an object literal expression.

在对象文字表达式中查找具有特定名称的属性。

Gets a relative path between two files that can be used inside a TypeScript import.

获取可在 TypeScript 导入中使用的两个文件之间的相对路径。

Function used to remap the generated `imports` for a component to known shorter aliases.

用于将组件生成的 `imports` 重新映射到已知的较短别名的函数。

Node from which to start the search.

开始搜索的节点。

Predicate that the result needs to pass.

谓结果需要通过。

Gets the closest node that matches a predicate, including the node that the search started from.

获取与谓词匹配的最近节点，包括搜索开始的节点。

Node that is being checked.

正在检查的节点。

Name of the class that the node might be referring to.

节点可能引用的类的名称。

Name of the Angular module that should contain the class.

应包含该类的 Angular 模块的名称。

Checks whether a node is referring to a specific class declaration.

检查节点是否引用特定的类声明。