Whether a given decorator should be treated as an Angular decorator.
Either it's used in &commat;angular/core, or it's imported from there.

给定的装饰器是否应该被视为 Angular 装饰器。它可以在 &commat;angular/core 中使用，或者是从那里导入的。

Extracts the type of the decorator \(the function or expression invoked\), as well as all the
arguments passed to the decorator. Returns an AST with the form:

提取装饰器的类型（调用的函数或表达式），以及传递给装饰器的所有参数。返回具有以下形式的 AST：

createCtorParametersClassProperty creates a static 'ctorParameters' property containing
downleveled decorator information.

createCtorParametersClassProperty 会创建一个包含降级装饰器信息的静态 'ctorParameters' 属性。

The property contains an arrow function that returns an array of object literals of the shape:

该属性包含一个箭头函数，该函数会返回一个具有以下形状的对象文字的数组：

Returns an expression representing the \(potentially\) value part for the given node.

返回一个表示给定节点的（可能）值部分的表达式。

This is a partial re-implementation of TypeScript's serializeTypeReferenceNode. This is a
workaround for https://github.com/Microsoft/TypeScript/issues/17516 \(serializeTypeReferenceNode
not being exposed\). In practice this implementation is sufficient for Angular's use of type
metadata.

这是 TypeScript 的 serializeTypeReferenceNode
的部分重新实现。这是 https://github.com/Microsoft/TypeScript/issues/17516 的解决方法（不会公开
serializeTypeReferenceNode）。在实践中，此实现对于 Angular 使用类型元数据就足够了。

Checks whether a given symbol refers to a value that exists at runtime \(as distinct from a type\).

检查给定的符号是否引用了运行时存在的值（与类型不同）。

Expands aliases, which is important for the case where
  import \* as x from 'some-module';
and x is now a value \(the module object\).

扩展别名，这对于 import \* as x from 'some-module' 的情况很重要；并且 x
现在是一个值（模块对象）。

ParameterDecorationInfo describes the information for a single constructor parameter.

ParameterDecorationInfo 描述单个构造函数参数的信息。

The type declaration for the parameter. Only set if the type is a value \(e.g. a class, not an
interface\).

参数的类型声明。只有在类型是值（例如类，而不是接口）时才设置。

The list of decorators found on the parameter, null if none.

在参数上找到的装饰器列表，如果没有，则为 null。

Reference to the program's type checker.

对程序的类型检查器的引用。

Reflection host that is used for determining decorators.

用于确定装饰器的反射宿主。

List which will be populated with diagnostics if any.

如果有，将使用诊断信息填充的列表。

Whether the current TypeScript program is for the `@angular/core` package.

当前的 TypeScript 程序是否用于 `@angular/core` 包。

Whether closure annotations need to be added where needed.

是否需要在需要的地方添加闭包注解。

Gets a transformer for downleveling Angular constructor parameter and property decorators.

获取用于降低 Angular 构造函数参数和属性装饰器级别的转换器。

Note that Angular class decorators are never processed as those rely on side effects that
would otherwise no longer be executed. i.e. the creation of a component definition.

请注意，Angular 类装饰器永远不会被处理，因为它们依赖于否则将不再执行的副作用。即创建组件定义。

createPropDecoratorsClassProperty creates a static 'propDecorators'
property containing type information for every property that has a
decorator applied.

createPropDecoratorsClassProperty 会创建一个静态 'propDecorators'
属性，其中包含应用了装饰器的每个属性的类型信息。

Converts an EntityName \(from a type annotation\) to an expression \(accessing a value\).

将 EntityName（从类型注解）转换为表达式（访问值）。

For a given qualified name, this walks depth first to find the leftmost identifier,
and then converts the path into a property access that can be used as expression.

对于给定的限定名，这会首先深入了解以查找最左边的标识符，然后将路径转换为可以用作表达式的属性访问。

Transforms a class element. Returns a three tuple of name, transformed element, and
decorators found. Returns an undefined name if there are no decorators to lower on the
element, or the element has an exotic name.

转换类元素。返回由名称、转换后的元素和找到的装饰器组成的三元组。如果元素上没有要降低的装饰器，或者元素具有外来名称，则返回未定义的名称。

Transforms a constructor. Returns the transformed constructor and the list of parameter
information collected, consisting of decorators and optional type.

转换构造函数。返回转换后的构造函数和收集的参数信息列表，由装饰器和可选类型组成。

Transforms a single class declaration:

转换单个类声明：

dispatches to strip decorators on members

调度以剥离成员上的装饰器

converts decorators on the class to annotations

将类上的装饰器转换为注解

creates a ctorParameters property

创建一个 ctorParameters 属性

creates a propDecorators property

创建一个 propDecorators 属性

Transformer visitor that looks for Angular decorators and replaces them with
downleveled static properties. Also collects constructor type metadata for
class declaration that are decorated with an Angular decorator.

寻找 Angular 装饰器并用降级的静态属性替换它们的 Transformer 访问器。还收集使用 Angular
装饰器装饰的类声明的构造函数类型元数据。