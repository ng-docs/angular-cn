A base class that can be used to implement a Render3 Template AST visitor.
Schematics are also currently required to be CommonJS to support execution within the Angular
CLI. As a result, the ESM `@angular/compiler` package must be loaded via a native dynamic import.
Using a dynamic import makes classes extending from classes present in `@angular/compiler`
complicated due to the class not being present at module evaluation time. The classes using a
base class found within `@angular/compiler` must be wrapped in a factory to allow the class value
to be accessible at runtime after the dynamic import has completed. This class implements the
interface of the `TmplAstRecursiveVisitor` class \(but does not extend\) as the
`TmplAstRecursiveVisitor` as an interface provides the required set of visit methods. The base
interface `Visitor<T>` is not exported.

可用于实现 Render3 模板 AST 访问器的基类。使用此类，而不是在 `@angular/compiler` 中找到的
`NullVisitor`，因为 `NullVisitor` 需要深度导入，从 v13 开始，ESM
捆绑包不再支持这种导入。当前还要求 Schematics 是 CommonJS 以支持在 Angular CLI
中执行。因此，必须通过原生动态导入加载 ESM `@angular/compiler` 包。使用动态导入会使从
`@angular/compiler` 中存在的类扩展的类变得复杂，因为该类在模块估算时不存在。使用
`@angular/compiler`
中找到的基类的类必须包装在工厂中，以允许在动态导入完成后在运行时访问类值。此类实现了
`TmplAstRecursiveVisitor` 类的接口（但不扩展），因为 `TmplAstRecursiveVisitor`
作为接口提供了所需的访问方法集。不会导出基础接口 `Visitor<T>`。

The compiler instance that should be used within the visitor.

应该在访问器中使用的编译器实例。

Creates a new Render3 Template AST visitor using an instance of the `@angular/compiler`
package. Passing in the compiler is required due to the need to dynamically import the
ESM `@angular/compiler` into a CommonJS schematic.

使用 `@angular/compiler` 包的实例创建一个新的 Render3 模板 AST 访问器。由于需要将 ESM
`@angular/compiler` 动态导入到 CommonJS 原理图中，因此需要传入编译器。

An iterable of nodes to visit using this visitor.

使用此访问器访问的节点的迭代。

Visits all the provided nodes in order using this Visitor's visit methods.
This is a simplified variant of the `visitAll` function found inside of \(but not
exported from\) the `@angular/compiler` that does not support returning a value
since the migrations do not directly transform the nodes.

使用此 Visitor 的 visit 方法按顺序访问所有提供的节点。这是在 `@angular/compiler`
中找到（但不从中导出）的 `visitAll` 函数的简化变体，它不支持返回值，因为迁移不会直接转换节点。