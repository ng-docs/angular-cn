Definition of what a factory function should look like.

工厂函数应该是什么样子的定义。

Subclasses without an explicit constructor call through to the factory of their base
definition, providing it with their own constructor to instantiate.

没有显式构造函数的子类会调用其基础定义的工厂，为它提供自己的构造函数来实例化。

If no constructor to instantiate is provided, an instance of type T itself is created.

如果没有提供要实例化的构造函数，则会创建 T 本身的实例。