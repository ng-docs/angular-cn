Metadata extracted from an instance of a decorator on another declaration.

从另一个声明的装饰器实例中提取的元数据。

Name by which the decorator was invoked in the user's code.

在用户代码中调用装饰器的名称。

This is distinct from the name by which the decorator was imported \(though in practice they
will usually be the same\).

这与导入装饰器的名称不同（尽管实际上它们通常是相同的）。

Identifier which refers to the decorator in the user's code.

标识符，它指的是用户代码中的装饰器。

`Import` by which the decorator was brought into the module in which it was invoked, or `null`
if the decorator was declared in the same module and not imported.

将装饰器引入调用它的模块的 `Import`，如果装饰器是在同一模块中声明但未导入，则为 `null`。

Note: this field is declared using computed property syntax to work around a clang-format bug
that resulted in inconsistent indentation of this comment block.

注意：此字段是使用计算属性语法声明的，以解决导致此注释块缩进不一致的 clang 格式错误。

TypeScript reference to the decorator itself.

TypeScript 对装饰器本身的引用。

Arguments of the invocation of the decorator, if the decorator is invoked, or `null`
otherwise.

装饰器调用的参数，如果装饰器被调用，否则为 `null`。

A decorator is identified by either a simple identifier \(e.g. `Decorator`\) or, in some cases,
a namespaced property access \(e.g. `core.Decorator`\).

装饰器由一个简单的标识符（例如 `Decorator` ）标识，或者在某些情况下，一个命名空间属性访问（例如 `core.Decorator` ）标识。

The `ts.Declaration` of a "class".

“类”的 `ts.Declaration`。

Classes are represented differently in different code formats:

类在不同的代码格式中有不同的表示：

In TS code, they are typically defined using the `class` keyword.

在 TS 代码中，它们通常使用 `class` 关键字定义。

In ES2015 code, they are usually defined using the `class` keyword, but they can also be
variable declarations, which are initialized to a class expression \(e.g.
`let Foo = Foo1 = class Foo {}`\).

在 ES2015 代码中，它们通常使用 `class` 关键字定义，但它们也可以是变量声明，被初始化为类表达式（例如 `let Foo = Foo1 = class Foo {}` ）。

In ES5 code, they are typically defined as variable declarations being assigned the return
value of an IIFE. The actual "class" is implemented as a constructor function inside the IIFE,
but the outer variable declaration represents the "class" to the rest of the program.

在 ES5 代码中，它们通常被定义为变量声明，并被赋予 IIFE 的返回值。实际的“类”在 IIFE 中作为构造函数实现，但外部变量声明代表程序其余部分的“类”。

For `ReflectionHost` purposes, a class declaration should always have a `name` identifier,
because we need to be able to reference it in other parts of the program.

出于 `ReflectionHost` 目的，类声明应始终具有 `name` 标识符，因为我们需要能够在程序的其他部分引用它。

An enumeration of possible kinds of class members.

可能种类的类成员的枚举。

A member of a class, such as a property, method, or constructor.

类的成员，例如属性、方法或构造函数。

TypeScript reference to the class member itself, or null if it is not applicable.

对类成员本身的 TypeScript 引用，如果不适用则为 null。

Indication of which type of member this is \(property, method, etc\).

指示这是哪种类型的成员（属性、方法等）。

TypeScript `ts.TypeNode` representing the type of the member, or `null` if not present or
applicable.

表示成员类型的 TypeScript `ts.TypeNode`，如果不存在或不适用，则为 `null`。

Name of the class member.

班级成员的姓名。

TypeScript `ts.Identifier` or `ts.StringLiteral` representing the name of the member, or `null`
if no such node is present.

表示成员名称的 TypeScript `ts.Identifier` 或 `ts.StringLiteral`，如果不存在此类节点，则为 `null`。

The `nameNode` is useful in writing references to this member that will be correctly source-
mapped back to the original file.

`nameNode` 在编写对该成员的引用时很有用，该成员将被正确地源映射回原始文件。

TypeScript `ts.Expression` which represents the value of the member.

代表成员值的 TypeScript `ts.Expression`。

If the member is a property, this will be the property initializer if there is one, or null
otherwise.

如果该成员是一个属性，则如果有一个，这将是属性初始值设定项，否则为 null。

TypeScript `ts.Declaration` which represents the implementation of the member.

TypeScript `ts.Declaration` 表示成员的实现。

In TypeScript code this is identical to the node, but in downleveled code this should always be
the Declaration which actually represents the member's runtime value.

在 TypeScript 代码中，这与节点相同，但在下层代码中，这应该始终是实际表示成员运行时值的声明。

For example, the TS code:

例如 TS 代码：

Downlevels to:

下层到：

In this example, for the property "property", the node would be the entire
Object.defineProperty ExpressionStatement, but the implementation would be this
FunctionDeclaration:

在此示例中，对于属性“property”，节点将是整个 Object.defineProperty ExpressionStatement，但实现将是此 FunctionDeclaration：

Whether the member is static or not.

成员是否是静态的。

Any `Decorator`s which are present on the member, or `null` if none are present.

成员上存在的任何 `Decorator`，如果不存在则为 `null`。

A type reference that refers to any type via a `ts.Expression` that's valid within the local file
where the type was referenced.

通过在引用类型的本地文件中有效的 `ts.Expression` 引用任何类型的类型引用。

The synthesized expression to reference the type in a value position.

在值位置引用类型的合成表达式。

If the type originates from a default import, the import statement is captured here to be able
to track its usages, preventing the import from being elided if it was originally only used in
a type-position. See `DefaultImportTracker` for details.

如果类型源自默认导入，则会在此处捕获导入语句以便能够跟踪其用法，从而防止导入最初仅用于类型位置时被忽略。有关详细信息，请参阅 `DefaultImportTracker`。

A reference that refers to a type that was imported, and gives the symbol `name` and the
`moduleName` of the import. Note that this `moduleName` may be a relative path, and thus is
likely only valid within the context of the file which contained the original type reference.

引用导入的类型的引用，并提供导入的符号 `name` 和 `moduleName`。请注意，此 `moduleName` 可能是相对路径，因此可能仅在包含原始类型引用的文件的上下文中有效。

The module specifier from which the `importedName` symbol should be imported.

应从中导入 `importedName` 符号的模块说明符。

The name of the top-level symbol that is imported from `moduleName`. If `nestedPath` is also
present, a nested object is being referenced from the top-level symbol.

从 `moduleName` 导入的顶级符号的名称。如果 `nestedPath` 也存在，则嵌套对象是从顶级符号引用的。

If present, represents the symbol names that are referenced from the top-level import.
When `null` or empty, the `importedName` itself is the symbol being referenced.

如果存在，则表示从顶级导入中引用的符号名称。当为 `null` 或为空时，`importedName` 本身就是被引用的符号。

A representation for a type value reference that is used when no value is available. This can
occur due to various reasons, which is indicated in the `reason` field.

在没有值可用时使用的类型值引用的表示。这可能由于各种原因而发生，这在 `reason` 字段中指示。

The reason why no value reference could be determined for a type.

无法确定类型的值引用的原因。

The various reasons why the compiler may be unable to synthesize a value from a type reference.

编译器可能无法从类型引用合成值的各种原因。

No type node was available.

没有类型节点可用。

The type does not have a value declaration, e.g. an interface.

该类型没有值声明，例如接口。

The type is imported using a type-only imports, so it is not suitable to be used in a
value-position.

该类型是使用 type-only imports 导入的，因此不适合在 value-position 中使用。

The type reference could not be resolved to a declaration.

类型引用无法解析为声明。

The type corresponds with a namespace.

该类型对应于命名空间。

The type is not supported in the compiler, for example union types.

编译器不支持该类型，例如联合类型。

The various reasons why a type node may not be referred to as a value.

类型节点可能不被称为值的各种原因。

A reference to a value that originated from a type position.

对源自类型位置的值的引用。

For example, a constructor parameter could be declared as `foo: Foo`. A `TypeValueReference`
extracted from this would refer to the value of the class `Foo` \(assuming it was actually a
type\).

例如，构造函数参数可以声明为 `foo: Foo`。从中提取的 `TypeValueReference` 将引用类 `Foo` 的值（假设它实际上是一个类型）。

See the individual types for additional information.

有关其他信息，请参阅各个类型。

A parameter to a constructor.

构造函数的参数。

Name of the parameter, if available.

参数的名称（如果可用）。

Some parameters don't have a simple string name \(for example, parameters which are destructured
into multiple variables\). In these cases, `name` can be `null`.

有些参数没有简单的字符串名称（例如，被解构为多个变量的参数）。在这些情况下，`name` 可以为 `null`。

TypeScript `ts.BindingName` representing the name of the parameter.

TypeScript `ts.BindingName` 表示参数的名称。

Reference to the value of the parameter's type annotation, if it's possible to refer to the
parameter's type as a value.

引用参数的类型注释的值，如果可以将参数的类型作为值引用的话。

This can either be a reference to a local value, a reference to an imported value, or no
value if no is present or cannot be represented as an expression.

这可以是对本地值的引用、对导入值的引用，或者如果不存在或不能表示为表达式则没有值。

TypeScript `ts.TypeNode` representing the type node found in the type position.

TypeScript `ts.TypeNode` 表示在类型位置找到的类型节点。

This field can be used for diagnostics reporting if `typeValueReference` is `null`.

如果 `typeValueReference` 为 `null` 则此字段可用于诊断报告。

Can be null, if the param has no type declared.

如果参数没有声明类型，则可以为 null。

Any `Decorator`s which are present on the parameter, or `null` if none are present.

参数上存在的任何 `Decorator`，如果不存在则为 `null`。

Definition of a function or method, including its body if present and any parameters.

函数或方法的定义，包括其主体（如果存在）和任何参数。

In TypeScript code this metadata will be a simple reflection of the declarations in the node
itself. In ES5 code this can be more complicated, as the default values for parameters may
be extracted from certain body statements.

在 TypeScript 代码中，此元数据将是节点本身声明的简单反映。在 ES5 代码中，这可能更复杂，因为参数的默认值可能会从某些主体语句中提取。

A reference to the node which declares the function.

对声明函数的节点的引用。

Statements of the function body, if a body is present, or null if no body is present or the
function is identified to represent a tslib helper function, in which case `helper` will
indicate which helper this function represents.

函数主体的语句，如果存在主体，或者如果主体不存在或函数被标识为表示 tslib 辅助函数，则为 null，在这种情况下，`helper` 将指示该函数代表哪个辅助函数。

This list may have been filtered to exclude statements which perform parameter default value
initialization.

此列表可能已被过滤以排除执行参数默认值初始化的语句。

Metadata regarding the function's parameters, including possible default value expressions.

有关函数参数的元数据，包括可能的默认值表达式。

Generic type parameters of the function.

函数的通用类型参数。

Number of known signatures of the function.

函数的已知签名数。

A parameter to a function or method.

函数或方法的参数。

Declaration which created this parameter.

创建此参数的声明。

Expression which represents the default value of the parameter, if any.

表示参数默认值的表达式（如果有）。

Type of the parameter.

参数的类型。

The source of an imported symbol, including the original symbol name and the module from which it
was imported.

导入符号的来源，包括原始符号名称和导入它的模块。

The name of the imported symbol under which it was exported \(not imported\).

在其下导出（未导入）的导入符号的名称。

The module from which the symbol was imported.

从中导入符号的模块。

This could either be an absolute module name \(&commat;angular/core for example\) or a relative path.

这可以是绝对模块名称（例如&commat;angular/core）或相对路径。

A type that is used to identify a declaration.

用于标识声明的类型。

The declaration of a symbol, along with information about how it was imported into the
application.

符号的声明，以及有关如何将其导入应用程序的信息。

The absolute module path from which the symbol was imported into the application, if the symbol
was imported via an absolute module \(even through a chain of re-exports\). If the symbol is part
of the application and was not imported from an absolute path, this will be `null`.

如果符号是通过绝对模块导入的（甚至通过重新导出链），则符号从中导入应用程序的绝对模块路径。如果该符号是应用程序的一部分并且不是从绝对路径导入的，则这将为 `null`。

TypeScript reference to the declaration itself, if one exists.

TypeScript 对声明本身的引用（如果存在）。

Abstracts reflection operations on a TypeScript AST.

抽象 TypeScript AST 上的反射操作。

Depending on the format of the code being interpreted, different concepts are represented
with different syntactical structures. The `ReflectionHost` abstracts over those differences and
presents a single API by which the compiler can query specific information about the AST.

根据被解释代码的格式，不同的概念用不同的句法结构表示。`ReflectionHost` 对这些差异进行了抽象，并提供了一个 API，编译器可以通过该 API 查询有关 AST 的特定信息。

All operations on the `ReflectionHost` require the use of TypeScript `ts.Node`s with binding
information already available \(that is, nodes that come from a `ts.Program` that has been
type-checked, and are not synthetically created\).

`ReflectionHost` 上的所有操作都需要使用带有绑定信息的 TypeScript `ts.Node` s（即来自 `ts.Program` 的节点已经过类型检查，并且不是合成创建的）。

a TypeScript `ts.Declaration` node representing the class or function over
which to reflect. For example, if the intent is to reflect the decorators of a class and the
source is in ES6 format, this will be a `ts.ClassDeclaration` node. If the source is in ES5
format, this might be a `ts.VariableDeclaration` as classes in ES5 are represented as the
result of an IIFE execution.

一个 TypeScript `ts.Declaration` 节点，表示要反映的类或函数。例如，如果意图是反映一个类的装饰器并且源是 ES6 格式，这将是一个 `ts.ClassDeclaration` 节点。如果源是 ES5 格式，这可能是一个 `ts.VariableDeclaration`，因为 ES5 中的类表示为 IIFE 执行的结果。

an array of `Decorator` metadata if decorators are present on the declaration, or
`null` if either no decorators were present or if the declaration is not of a decoratable type.

如果声明中存在装饰器，则为 `Decorator` 元数据数组；如果不存在装饰器或声明不是可装饰类型，则为 `null`。

Examine a declaration \(for example, of a class or function\) and return metadata about any
decorators present on the declaration.

检查声明（例如，类或函数的声明）并返回有关声明中存在的任何装饰器的元数据。

a `ClassDeclaration` representing the class over which to reflect.

一个 `ClassDeclaration` 表示要反映的类。

an array of `ClassMember` metadata representing the members of the class.

表示类成员的 `ClassMember` 数据数组。

if `declaration` does not resolve to a class declaration.

如果 `declaration` 未解析为类声明。

Examine a declaration which should be of a class, and return metadata about the members of the
class.

检查应该属于某个类的声明，并返回有关该类成员的元数据。

an array of `Parameter` metadata representing the parameters of the constructor, if
a constructor exists. If the constructor exists and has 0 parameters, this array will be empty.
If the class has no constructor, this method returns `null`.

如果存在构造函数，则表示构造函数参数的 `Parameter` 数据数组。如果构造函数存在且参数为 0，则此数组将为空。如果该类没有构造函数，则此方法返回 `null`。

Reflect over the constructor of a class and return metadata about its parameters.

反映类的构造函数并返回有关其参数的元数据。

This method only looks at the constructor of a class directly and not at any inherited
constructors.

此方法只直接查看类的构造函数，而不查看任何继承的构造函数。

a TypeScript `ts.Declaration` node representing the function over which to reflect.

一个 TypeScript `ts.Declaration` 节点，表示要反映的函数。

a `FunctionDefinition` giving metadata about the function definition.

一个 `FunctionDefinition` 给出关于函数定义的元数据。

Reflect over a function and return metadata about its parameters and body.

反映一个函数并返回有关其参数和主体的元数据。

Functions in TypeScript and ES5 code have different AST representations, in particular around
default values for parameters. A TypeScript function has its default value as the initializer
on the parameter declaration, whereas an ES5 function has its default value set in a statement
of the form:

TypeScript 和 ES5 代码中的函数具有不同的 AST 表示，特别是围绕参数的默认值。TypeScript 函数将其默认值作为参数声明的初始值设定项，而 ES5 函数将其默认值设置在以下形式的语句中：

if \(param === void 0\) { param = 3; }

如果（参数 === void 0）{ 参数 = 3; }

This method abstracts over these details, and interprets the function declaration and body to
extract parameter default values and the "real" body.

该方法对这些细节进行抽象，并解释函数声明和主体以提取参数默认值和“真实”主体。

A current limitation is that this metadata has no representation for shorthand assignment of
parameter objects in the function signature.

当前的限制是此元数据没有表示函数签名中参数对象的速记分配。

a TypeScript `ts.Identifier` to reflect.

要反映的 TypeScript `ts.Identifier`。

metadata about the `Import` if the identifier was imported from another module, or
`null` if the identifier doesn't resolve to an import but instead is locally defined.

如果标识符是从另一个模块导入的，则有关 `Import` 数据；如果标识符未解析为导入而是在本地定义，则为 `null`。

Determine if an identifier was imported from another module and return `Import` metadata
describing its origin.

确定标识符是否是从另一个模块导入的，并返回描述其来源的 `Import` 元数据。

a TypeScript `ts.Identifier` to trace back to a declaration.

一个 TypeScript `ts.Identifier` 来追溯到一个声明。

metadata about the `Declaration` if the original declaration is found, or `null`
otherwise.

如果找到原始声明，则有关 `Declaration` 元数据，否则为 `null`。

Trace an identifier to its declaration, if possible.

如果可能的话，追踪一个标识符到它的声明。

This method attempts to resolve the declaration of the given identifier, tracing back through
imports and re-exports until the original declaration statement is found. A `Declaration`
object is returned if the original declaration is found, or `null` is returned otherwise.

此方法尝试解析给定标识符的声明，通过导入和重新导出进行追溯，直到找到原始声明语句。如果找到原始声明，则返回一个 `Declaration` 对象，否则返回 `null`。

If the declaration is in a different module, and that module is imported via an absolute path,
this method also returns the absolute path of the imported module. For example, if the code is:

如果声明在不同的模块中，并且该模块是通过绝对路径导入的，则此方法还会返回导入模块的绝对路径。例如，如果代码是：

and if `getDeclarationOfIdentifier` is called on `RouterModule` in the `ROUTES` expression,
then it would trace `RouterModule` via its import from `@angular/core`, and note that the
definition was imported from `@angular/core` into the application where it was referenced.

如果在 `ROUTES` 表达式中的 `RouterModule` 上调用了 `getDeclarationOfIdentifier`，那么它将通过从 `@angular/core` 导入来跟踪 `RouterModule`，并注意该定义是从 `@angular/core` 导入到引用它的应用程序中的。

If the definition is re-exported several times from different absolute module names, only
the first one \(the one by which the application refers to the module\) is returned.

如果从不同的绝对模块名称中多次重新导出定义，则仅返回第一个（应用程序引用模块的名称）。

This module name is returned in the `viaModule` field of the `Declaration`. If The declaration
is relative to the application itself and there was no import through an absolute path, then
`viaModule` is `null`.

该模块名称在 `Declaration` 的 `viaModule` 字段中返回。如果声明是相对于应用程序本身的，并且没有通过绝对路径导入，则 `viaModule` 为 `null`。

a TypeScript `ts.Node` representing the module \(for example a `ts.SourceFile`\) for
which to collect exports.

表示要为其收集导出的模块（例如 `ts.SourceFile` ）的 TypeScript `ts.Node`。

a map of `Declaration`s for the module's exports, by name.

模块导出的 `Declaration` 映射，按名称。

Collect the declarations exported from a module by name.

按名称收集从模块导出的声明。

Iterates over the exports of a module \(including re-exports\) and returns a map of export
name to its `Declaration`. If an exported value is itself re-exported from another module,
the `Declaration`'s `viaModule` will reflect that.

迭代模块的导出（包括重新导出）并将导出名称的映射返回到它的 `Declaration`。如果导出的值本身是从另一个模块重新导出的，则 `Declaration` 的 `viaModule` 将反映这一点。

Check whether the given node actually represents a class.

检查给定的节点是否真的代表一个类。

Determines whether the given declaration, which should be a class, has a base class.

确定给定的声明（应为类）是否具有基类。

the class whose base we want to get.

我们想要获得其基础的班级。

Get an expression representing the base class \(if any\) of the given `clazz`.

获取表示给定 `clazz` 的基类（如果有）的表达式。

This expression is most commonly an Identifier, but is possible to inherit from a more dynamic
expression.

此表达式最常见的是标识符，但可以从更动态的表达式继承。

the number of type parameters of the class, if known, or `null` if the declaration
is not a class or has an unknown number of type parameters.

类的类型参数的数量（如果已知）；如果声明不是类或具有未知数量的类型参数，则 `null`。

Get the number of generic type parameters of a given class.

获取给定类的泛型类型参数的数量。

a TypeScript variable declaration, whose value we want.

一个 TypeScript 变量声明，它的值是我们想要的。

the value of the variable, as a TypeScript expression node, or `undefined`
if the value cannot be computed.

变量的值，作为 TypeScript 表达式节点，如果无法计算值，则为 `undefined`。

Find the assigned value of a variable declaration.

查找变量声明的赋值。

Normally this will be the initializer of the declaration, but where the variable is
not a `const` we may need to look elsewhere for the variable's value.

通常这将是声明的初始值设定项，但如果变量不是 `const`，我们可能需要在别处查找变量的值。

Returns `true` if a declaration is exported from the module in which it's defined.

如果声明是从定义它的模块中导出的，则返回 `true`。

Not all mechanisms by which a declaration is exported can be statically detected, especially
when processing already compiled JavaScript. A `false` result does not indicate that the
declaration is never visible outside its module, only that it was not exported via one of the
export mechanisms that the `ReflectionHost` is capable of statically checking.

并非所有导出声明的机制都可以静态检测到，尤其是在处理已编译的 JavaScript 时。`false` 结果并不表示声明在其模块外永远不可见，只是它不是通过 `ReflectionHost` 能够静态检查的导出机制之一导出的。