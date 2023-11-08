Result type of visiting a node that's typically an entry in a list, which allows specifying that
nodes should be added before the visited node in the output.

访问节点的结果类型，通常是列表中的条目，它允许指定应该在输出中被访问的节点之前添加节点。

Visit a node with the given visitor and return a transformed copy.

使用给定的访问者访问节点并返回转换后的副本。

Abstract base class for visitors, which processes certain nodes specially to allow insertion
of other nodes before them.

访问者的抽象基类，它会专门处理某些节点以允许在它们之前插入其他节点。

Visit a class declaration, returning at least the transformed declaration and optionally other
nodes to insert before the declaration.

访问一个类声明，至少返回转换后的声明和可选的要在声明之前插入的其他节点。

Visit types of nodes which don't have their own explicit visitor.

访问没有自己显式访问者的节点类型。