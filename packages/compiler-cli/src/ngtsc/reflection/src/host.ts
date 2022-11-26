/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

/**
 * Metadata extracted from an instance of a decorator on another declaration, or synthesized from
 * other information about a class.
 *
 * 从另一个声明上的装饰器实例中提取的元数据，或从有关类的其他信息合成。
 *
 */
export type Decorator = ConcreteDecorator|SyntheticDecorator;

export interface BaseDecorator {
  /**
   * Name by which the decorator was invoked in the user's code.
   *
   * 在用户代码中调用装饰器的名称。
   *
   * This is distinct from the name by which the decorator was imported (though in practice they
   * will usually be the same).
   *
   * 这与导入装饰器的名称不同（尽管在实践中它们通常是相同的）。
   *
   */
  name: string;

  /**
   * Identifier which refers to the decorator in the user's code.
   *
   * 引用用户代码中的装饰器的标识符。
   *
   */
  identifier: DecoratorIdentifier|null;

  /**
   * `Import` by which the decorator was brought into the module in which it was invoked, or `null`
   * if the decorator was declared in the same module and not imported.
   *
   * 将装饰器带入调用它的模块的 `Import` ，如果装饰器是在同一个模块中声明且未导入的，则为 `null` 。
   *
   */
  import: Import|null;

  /**
   * TypeScript reference to the decorator itself, or `null` if the decorator is synthesized (e.g.
   * in ngcc).
   *
   * TypeScript 对装饰器本身的引用，如果装饰器是合成的（例如在 ngcc 中），则为 `null` 。
   *
   */
  node: ts.Node|null;

  /**
   * Arguments of the invocation of the decorator, if the decorator is invoked, or `null`
   * otherwise.
   *
   * 装饰器调用的参数（如果调用了装饰器），否则为 `null` 。
   *
   */
  args: ts.Expression[]|null;
}

/**
 * Metadata extracted from an instance of a decorator on another declaration, which was actually
 * present in a file.
 *
 * 从另一个声明上的装饰器实例中提取的元数据，该声明实际上存在于文件中。
 *
 * Concrete decorators always have an `identifier` and a `node`.
 *
 * 具体的装饰器始终有一个 `identifier` 和一个 `node` 。
 *
 */
export interface ConcreteDecorator extends BaseDecorator {
  identifier: DecoratorIdentifier;
  node: ts.Node;
}

/**
 * Synthetic decorators never have an `identifier` or a `node`, but know the node for which they
 * were synthesized.
 *
 * 合成装饰器永远没有 `identifier` 或 `node` ，但知道它们是为哪个节点合成的。
 *
 */
export interface SyntheticDecorator extends BaseDecorator {
  identifier: null;
  node: null;

  /**
   * The `ts.Node` for which this decorator was created.
   *
   * 创建此装饰器的 `ts.Node` 。
   *
   */
  synthesizedFor: ts.Node;
}

export const Decorator = {
  nodeForError: (decorator: Decorator): ts.Node => {
    if (decorator.node !== null) {
      return decorator.node;
    } else {
      // TODO(alxhub): we can't rely on narrowing until TS 3.6 is in g3.
      return (decorator as SyntheticDecorator).synthesizedFor;
    }
  },
};

/**
 * A decorator is identified by either a simple identifier (e.g. `Decorator`) or, in some cases,
 * a namespaced property access (e.g. `core.Decorator`).
 *
 * 装饰器可以通过简单的标识符（例如 `Decorator`
 *）来标识，或者在某些情况下，可以用命名空间属性访问（例如 `core.Decorator`）来标识。
 *
 */
export type DecoratorIdentifier = ts.Identifier|NamespacedIdentifier;
export type NamespacedIdentifier = ts.PropertyAccessExpression&{
  expression: ts.Identifier;
  name: ts.Identifier
};
export function isDecoratorIdentifier(exp: ts.Expression): exp is DecoratorIdentifier {
  return ts.isIdentifier(exp) ||
      ts.isPropertyAccessExpression(exp) && ts.isIdentifier(exp.expression) &&
      ts.isIdentifier(exp.name);
}

/**
 * The `ts.Declaration` of a "class".
 *
 * “类”的 `ts.Declaration` 。
 *
 * Classes are represented differently in different code formats:
 *
 * 类在不同的代码格式中以不同的方式表示：
 *
 * - In TS code, they are typically defined using the `class` keyword.
 *
 *   在 TS 代码中，它们通常使用 `class` 关键字定义。
 *
 * - In ES2015 code, they are usually defined using the `class` keyword, but they can also be
 *   variable declarations, which are initialized to a class expression (e.g.
 *   `let Foo = Foo1 = class Foo {}`).
 *
 *   在 ES2015 代码中，它们通常使用 `class`
 * 关键字定义，但它们也可以是变量声明，被初始化为类表达式（例如 `let Foo = Foo1 = class Foo {}`）。
 *
 * - In ES5 code, they are typically defined as variable declarations being assigned the return
 *   value of an IIFE. The actual "class" is implemented as a constructor function inside the IIFE,
 *   but the outer variable declaration represents the "class" to the rest of the program.
 *
 *   在 ES5 代码中，它们通常被定义为被赋予 IIFE 的返回值的变量声明。实际的“类”作为 IIFE
 * 中的构造函数实现，但外部变量声明对程序的其余部分表示“类”。
 *
 * For `ReflectionHost` purposes, a class declaration should always have a `name` identifier,
 * because we need to be able to reference it in other parts of the program.
 *
 * 出于 `ReflectionHost` 的目的，类声明应该始终有一个 `name`
 * 标识符，因为我们需要能够在程序的其他部分中引用它。
 *
 */
export type ClassDeclaration<T extends DeclarationNode = DeclarationNode> = T&{name: ts.Identifier};

/**
 * An enumeration of possible kinds of class members.
 *
 * 可能种类的类成员的枚举。
 *
 */
export enum ClassMemberKind {
  Constructor,
  Getter,
  Setter,
  Property,
  Method,
}

/**
 * A member of a class, such as a property, method, or constructor.
 *
 * 类的成员，例如属性、方法或构造函数。
 *
 */
export interface ClassMember {
  /**
   * TypeScript reference to the class member itself, or null if it is not applicable.
   *
   * TypeScript 对类成员本身的引用，如果不适用，则为 null 。
   *
   */
  node: ts.Node|null;

  /**
   * Indication of which type of member this is (property, method, etc).
   *
   * 表明这是哪种类型的成员（属性、方法等）。
   *
   */
  kind: ClassMemberKind;

  /**
   * TypeScript `ts.TypeNode` representing the type of the member, or `null` if not present or
   * applicable.
   *
   * 表示成员类型的 TypeScript `ts.TypeNode` ，如果不存在或不适用，则为 `null` 。
   *
   */
  type: ts.TypeNode|null;

  /**
   * Name of the class member.
   *
   * 类成员的名称。
   *
   */
  name: string;

  /**
   * TypeScript `ts.Identifier` or `ts.StringLiteral` representing the name of the member, or `null`
   * if no such node is present.
   *
   * TypeScript `ts.Identifier` 或 `ts.StringLiteral` 表示成员的名称，如果不存在这样的节点，则为
   * `null` 。
   *
   * The `nameNode` is useful in writing references to this member that will be correctly source-
   * mapped back to the original file.
   *
   * `nameNode` 可用于编写对此成员的引用，这些引用将被正确地源映射回原始文件。
   *
   */
  nameNode: ts.Identifier|ts.StringLiteral|null;

  /**
   * TypeScript `ts.Expression` which represents the value of the member.
   *
   * TypeScript `ts.Expression` ，它表示成员的值。
   *
   * If the member is a property, this will be the property initializer if there is one, or null
   * otherwise.
   *
   * 如果成员是属性，如果有，这将是属性初始化器，否则为 null 。
   *
   */
  value: ts.Expression|null;

  /**
   * TypeScript `ts.Declaration` which represents the implementation of the member.
   *
   * TypeScript `ts.Declaration` ，它表示成员的实现。
   *
   * In TypeScript code this is identical to the node, but in downleveled code this should always be
   * the Declaration which actually represents the member's runtime value.
   *
   * 在 TypeScript 代码中，这与节点相同，但在下级代码中，这应该始终是实际表示成员的运行时值的
   * Declaration 。
   *
   * For example, the TS code:
   *
   * 例如，TS 代码：
   *
   * ```
   * class Clazz {
   *   static get property(): string {
   *     return 'value';
   *   }
   * }
   * ```
   *
   * Downlevels to:
   *
   * 降级为：
   *
   * ```
   * var Clazz = (function () {
   *   function Clazz() {
   *   }
   *   Object.defineProperty(Clazz, "property", {
   *       get: function () {
   *           return 'value';
   *       },
   *       enumerable: true,
   *       configurable: true
   *   });
   *   return Clazz;
   * }());
   * ```
   *
   * In this example, for the property "property", the node would be the entire
   * Object.defineProperty ExpressionStatement, but the implementation would be this
   * FunctionDeclaration:
   *
   * 在此示例中，对于属性“property”，节点将是整个 Object.defineProperty ExpressionStatement
   * ，但实现将是此 FunctionDeclaration ：
   *
   * ```
   * function () {
   *   return 'value';
   * },
   * ```
   *
   */
  implementation: ts.Declaration|null;

  /**
   * Whether the member is static or not.
   *
   * 成员是否是静态的。
   *
   */
  isStatic: boolean;

  /**
   * Any `Decorator`s which are present on the member, or `null` if none are present.
   *
   * 成员上存在的任何 `Decorator` ，如果不存在，则为 `null` 。
   *
   */
  decorators: Decorator[]|null;
}

export const enum TypeValueReferenceKind {
  LOCAL,
  IMPORTED,
  UNAVAILABLE,
}

/**
 * A type reference that refers to any type via a `ts.Expression` that's valid within the local file
 * where the type was referenced.
 *
 * 一种类型引用，通过 `ts.Expression` 引用任何类型，在引用类型的本地文件中有效。
 *
 */
export interface LocalTypeValueReference {
  kind: TypeValueReferenceKind.LOCAL;

  /**
   * The synthesized expression to reference the type in a value position.
   *
   * 要在值位置中引用类型的合成表达式。
   *
   */
  expression: ts.Expression;

  /**
   * If the type originates from a default import, the import statement is captured here to be able
   * to track its usages, preventing the import from being elided if it was originally only used in
   * a type-position. See `DefaultImportTracker` for details.
   *
   * 如果类型来自默认导入，则会在此捕获导入语句以跟踪其用法，如果导入最初仅在类型位置中使用，则不会被忽略。有关详细信息，请参阅
   * `DefaultImportTracker` 。
   *
   */
  defaultImportStatement: ts.ImportDeclaration|null;
}

/**
 * A reference that refers to a type that was imported, and gives the symbol `name` and the
 * `moduleName` of the import. Note that this `moduleName` may be a relative path, and thus is
 * likely only valid within the context of the file which contained the original type reference.
 *
 * 引用已导入的类型，并给出导入的符号 `name` 和 `moduleName` 的引用。请注意，此 `moduleName`
 * 可能是相对路径，因此可能仅在包含原始类型引用的文件的上下文中有效。
 *
 */
export interface ImportedTypeValueReference {
  kind: TypeValueReferenceKind.IMPORTED;

  /**
   * The module specifier from which the `importedName` symbol should be imported.
   *
   * 应该从中导入 `importedName` 符号的模块说明符。
   *
   */
  moduleName: string;

  /**
   * The name of the top-level symbol that is imported from `moduleName`. If `nestedPath` is also
   * present, a nested object is being referenced from the top-level symbol.
   *
   * 从 `moduleName` 导入的顶级符号的名称。如果还存在 `nestedPath` ，则正在从顶级符号引用嵌套对象。
   *
   */
  importedName: string;

  /**
   * If present, represents the symbol names that are referenced from the top-level import.
   * When `null` or empty, the `importedName` itself is the symbol being referenced.
   *
   * 如果存在，则表示从顶级导入引用的符号名称。当 `null` 或为空时，`importedName`
   * 本身是被引用的符号。
   *
   */
  nestedPath: string[]|null;

  valueDeclaration: DeclarationNode;
}

/**
 * A representation for a type value reference that is used when no value is available. This can
 * occur due to various reasons, which is indicated in the `reason` field.
 *
 * 没有值可用时使用的类型值引用的表示。这可能是由于各种原因而发生的，这在 `reason`
 * 字段中进行了说明。
 *
 */
export interface UnavailableTypeValueReference {
  kind: TypeValueReferenceKind.UNAVAILABLE;

  /**
   * The reason why no value reference could be determined for a type.
   *
   * 无法为某种类型确定值引用的原因。
   *
   */
  reason: UnavailableValue;
}

/**
 * The various reasons why the compiler may be unable to synthesize a value from a type reference.
 *
 * 编译器可能无法从类型引用合成值的各种原因。
 *
 */
export const enum ValueUnavailableKind {
  /**
   * No type node was available.
   *
   * 没有类型节点可用。
   *
   */
  MISSING_TYPE,

  /**
   * The type does not have a value declaration, e.g. an interface.
   *
   * 该类型没有值声明，例如接口。
   *
   */
  NO_VALUE_DECLARATION,

  /**
   * The type is imported using a type-only imports, so it is not suitable to be used in a
   * value-position.
   *
   * 该类型是使用纯类型导入来导入的，因此不适合在值位置中使用。
   *
   */
  TYPE_ONLY_IMPORT,

  /**
   * The type reference could not be resolved to a declaration.
   *
   * 类型引用无法解析为声明。
   *
   */
  UNKNOWN_REFERENCE,

  /**
   * The type corresponds with a namespace.
   *
   * 该类型与命名空间对应。
   *
   */
  NAMESPACE,

  /**
   * The type is not supported in the compiler, for example union types.
   *
   * 编译器不支持该类型，例如联合类型。
   *
   */
  UNSUPPORTED,
}


export interface UnsupportedType {
  kind: ValueUnavailableKind.UNSUPPORTED;
  typeNode: ts.TypeNode;
}

export interface NoValueDeclaration {
  kind: ValueUnavailableKind.NO_VALUE_DECLARATION;
  typeNode: ts.TypeNode;
  decl: ts.Declaration|null;
}

export interface TypeOnlyImport {
  kind: ValueUnavailableKind.TYPE_ONLY_IMPORT;
  typeNode: ts.TypeNode;
  node: ts.ImportClause|ts.ImportSpecifier;
}

export interface NamespaceImport {
  kind: ValueUnavailableKind.NAMESPACE;
  typeNode: ts.TypeNode;
  importClause: ts.ImportClause;
}

export interface UnknownReference {
  kind: ValueUnavailableKind.UNKNOWN_REFERENCE;
  typeNode: ts.TypeNode;
}

export interface MissingType {
  kind: ValueUnavailableKind.MISSING_TYPE;
}

/**
 * The various reasons why a type node may not be referred to as a value.
 *
 * 类型节点可能不被称为值的各种原因。
 *
 */
export type UnavailableValue =
    UnsupportedType|NoValueDeclaration|TypeOnlyImport|NamespaceImport|UnknownReference|MissingType;

/**
 * A reference to a value that originated from a type position.
 *
 * 对源自类型位置的值的引用。
 *
 * For example, a constructor parameter could be declared as `foo: Foo`. A `TypeValueReference`
 * extracted from this would refer to the value of the class `Foo` (assuming it was actually a
 * type).
 *
 * 例如，构造函数参数可以声明为 `foo: Foo` 。从这里提取的 `TypeValueReference` 将引用 `Foo`
 * 类的值（假设它实际上是一种类型）。
 *
 * See the individual types for additional information.
 *
 * 有关其他信息，请参阅各个类型。
 *
 */
export type TypeValueReference =
    LocalTypeValueReference|ImportedTypeValueReference|UnavailableTypeValueReference;

/**
 * A parameter to a constructor.
 *
 * 构造函数的参数。
 *
 */
export interface CtorParameter {
  /**
   * Name of the parameter, if available.
   *
   * 参数的名称（如果可用）。
   *
   * Some parameters don't have a simple string name (for example, parameters which are destructured
   * into multiple variables). In these cases, `name` can be `null`.
   *
   * 某些参数没有简单的字符串名称（例如，被解构为多个变量的参数）。在这些情况下，`name` 可以是
   * `null` 。
   *
   */
  name: string|null;

  /**
   * TypeScript `ts.BindingName` representing the name of the parameter.
   *
   * 表示参数名称的 TypeScript `ts.BindingName` 。
   *
   * The `nameNode` is useful in writing references to this member that will be correctly source-
   * mapped back to the original file.
   *
   * `nameNode` 可用于编写对此成员的引用，这些引用将被正确地源映射回原始文件。
   *
   */
  nameNode: ts.BindingName;

  /**
   * Reference to the value of the parameter's type annotation, if it's possible to refer to the
   * parameter's type as a value.
   *
   * 引用参数的类型注解的值，如果可以将参数的类型引用为值。
   *
   * This can either be a reference to a local value, a reference to an imported value, or no
   * value if no is present or cannot be represented as an expression.
   *
   * 这可以是对本地值的引用、对导入值的引用，如果不存在或不能表示为表达式，则可以没有值。
   *
   */
  typeValueReference: TypeValueReference;

  /**
   * TypeScript `ts.TypeNode` representing the type node found in the type position.
   *
   * TypeScript `ts.TypeNode` 表示在类型位置中找到的类型节点。
   *
   * This field can be used for diagnostics reporting if `typeValueReference` is `null`.
   *
   * 如果 `typeValueReference` 为 `null` ，则此字段可用于诊断报告。
   *
   * Can be null, if the param has no type declared.
   *
   * 如果参数没有声明类型，可以为 null 。
   *
   */
  typeNode: ts.TypeNode|null;

  /**
   * Any `Decorator`s which are present on the parameter, or `null` if none are present.
   *
   * 参数上存在的任何 `Decorator` ，如果不存在，则为 `null` 。
   *
   */
  decorators: Decorator[]|null;
}

/**
 * Definition of a function or method, including its body if present and any parameters.
 *
 * 函数或方法的定义，包括其主体（如果存在）和任何参数。
 *
 * In TypeScript code this metadata will be a simple reflection of the declarations in the node
 * itself. In ES5 code this can be more complicated, as the default values for parameters may
 * be extracted from certain body statements.
 *
 * 在 TypeScript 代码中，此元数据将是节点本身声明的简单反映。在 ES5
 * 代码中，这可能会更复杂，因为参数的默认值可以从某些主体语句中提取。
 *
 */
export interface FunctionDefinition {
  /**
   * A reference to the node which declares the function.
   *
   * 对声明函数的节点的引用。
   *
   */
  node: ts.MethodDeclaration|ts.FunctionDeclaration|ts.FunctionExpression|ts.VariableDeclaration;

  /**
   * Statements of the function body, if a body is present, or null if no body is present or the
   * function is identified to represent a tslib helper function, in which case `helper` will
   * indicate which helper this function represents.
   *
   * 函数体的语句（如果存在），如果不存在主体或函数被标识为表示 tslib 帮助器函数，则为 null
   * ，在这种情况下，`helper` 将表明此函数表示哪个帮助器。
   *
   * This list may have been filtered to exclude statements which perform parameter default value
   * initialization.
   *
   * 此列表可能已被过滤以排除执行参数默认值初始化的语句。
   *
   */
  body: ts.Statement[]|null;

  /**
   * Metadata regarding the function's parameters, including possible default value expressions.
   *
   * 有关函数参数的元数据，包括可能的默认值表达式。
   *
   */
  parameters: Parameter[];
}

/**
 * Possible declarations of known values, such as built-in objects/functions or TypeScript helpers.
 *
 * 已知值的可能声明，例如内置对象/函数或 TypeScript 帮助器。
 *
 */
export enum KnownDeclaration {
  /**
   * Indicates the JavaScript global `Object` class.
   *
   * 指示 JavaScript 全局 `Object` 类。
   *
   */
  JsGlobalObject,

  /**
   * Indicates the `__assign` TypeScript helper function.
   *
   * 指示 `__assign` TypeScript 帮助器函数。
   *
   */
  TsHelperAssign,

  /**
   * Indicates the `__spread` TypeScript helper function.
   *
   * 表示 `__spread` TypeScript 帮助器函数。
   *
   */
  TsHelperSpread,

  /**
   * Indicates the `__spreadArrays` TypeScript helper function.
   *
   * 指示 `__spreadArrays` TypeScript 帮助器函数。
   *
   */
  TsHelperSpreadArrays,

  /**
   * Indicates the `__spreadArray` TypeScript helper function.
   *
   * 指示 `__spreadArray` TypeScript 帮助器函数。
   *
   */
  TsHelperSpreadArray,

  /**
   * Indicates the `__read` TypeScript helper function.
   *
   * 表示 `__read` TypeScript 帮助器函数。
   *
   */
  TsHelperRead,
}

/**
 * A parameter to a function or method.
 *
 * 函数或方法的参数。
 *
 */
export interface Parameter {
  /**
   * Name of the parameter, if available.
   *
   * 参数的名称（如果可用）。
   *
   */
  name: string|null;

  /**
   * Declaration which created this parameter.
   *
   * 创建此参数的声明。
   *
   */
  node: ts.ParameterDeclaration;

  /**
   * Expression which represents the default value of the parameter, if any.
   *
   * 表示参数的默认值的表达式（如果有）。
   *
   */
  initializer: ts.Expression|null;
}

/**
 * The source of an imported symbol, including the original symbol name and the module from which it
 * was imported.
 *
 * 导入符号的源，包括原始符号名称和导入它的模块。
 *
 */
export interface Import {
  /**
   * The name of the imported symbol under which it was exported (not imported).
   *
   * 从中导出（未导入）的导入符号的名称。
   *
   */
  name: string;

  /**
   * The module from which the symbol was imported.
   *
   * 从中导入符号的模块。
   *
   * This could either be an absolute module name (@angular/core for example) or a relative path.
   *
   * 这可以是绝对模块名称（例如 @angular/core）或相对路径。
   *
   */
  from: string;
}

/**
 * A single enum member extracted from JavaScript when no `ts.EnumDeclaration` is available.
 *
 * 没有 `ts.EnumDeclaration` 可用时从 JavaScript 中提取的单个枚举成员。
 *
 */
export interface EnumMember {
  /**
   * The name of the enum member.
   *
   * 枚举成员的名称。
   *
   */
  name: ts.PropertyName;

  /**
   * The initializer expression of the enum member. Unlike in TypeScript, this is always available
   * in emitted JavaScript.
   *
   * 枚举成员的初始化表达式。与 TypeScript 不同，这在发出的 JavaScript 中始终可用。
   *
   */
  initializer: ts.Expression;
}

/**
 * A type that is used to identify a declaration.
 *
 * 用于标识声明的类型。
 *
 * Declarations are normally `ts.Declaration` types such as variable declarations, class
 * declarations, function declarations etc.
 * But in some cases there is no `ts.Declaration` that can be used for a declaration, such
 * as when they are declared inline as part of an exported expression. Then we must use a
 * `ts.Expression` as the declaration.
 * An example of this is `exports.someVar = 42` where the declaration expression would be
 * `exports.someVar`.
 *
 * 声明通常是 `ts.Declaration`
 * 类型，例如变量声明、类声明、函数声明等。但在某些情况下，没有可用于声明的 `ts.Declaration`
 * ，例如当它们作为导出表达式的一部分内联声明时.然后我们必须使用 `ts.Expression`
 * 作为声明。这方面的一个例子是 `exports.someVar = 42` ，其中的声明表达式将是 `exports.someVar` 。
 *
 */
export type DeclarationNode = ts.Declaration|ts.Expression;

/**
 * The type of a Declaration - whether its node is concrete (ts.Declaration) or inline
 * (ts.Expression). See `ConcreteDeclaration`, `InlineDeclaration` and `DeclarationNode` for more
 * information about this.
 *
 * 声明的类型 - 其节点是具体的 (ts.Declaration) 还是内联的 (ts.Expression)。有关此的更多信息，请参阅
 * `ConcreteDeclaration`、`InlineDeclaration` 和 `DeclarationNode` 。
 *
 */
export const enum DeclarationKind {
  Concrete,
  Inline,
}

/**
 * Base type for all `Declaration`s.
 *
 * 所有 `Declaration` 的基本类型。
 *
 */
export interface BaseDeclaration<T extends DeclarationNode> {
  /**
   * The type of the underlying `node`.
   *
   * 基础 `node` 的类型。
   *
   */
  kind: DeclarationKind;

  /**
   * The absolute module path from which the symbol was imported into the application, if the symbol
   * was imported via an absolute module (even through a chain of re-exports). If the symbol is part
   * of the application and was not imported from an absolute path, this will be `null`.
   *
   * 将符号导入应用程序的绝对模块路径，如果符号是通过绝对模块导入的（即使是通过重新导出链）。如果该符号是应用程序的一部分并且不是从绝对路径导入的，则这将是
   * `null` 。
   *
   */
  viaModule: string|null;

  /**
   * TypeScript reference to the declaration itself, if one exists.
   *
   * TypeScript 对声明本身的引用（如果存在）。
   *
   */
  node: T;

  /**
   * If set, describes the type of the known declaration this declaration resolves to.
   *
   * 如果设置，则描述此声明解析为的已知声明的类型。
   *
   */
  known: KnownDeclaration|null;
}

/**
 * Returns true if the `decl` is a `ConcreteDeclaration` (ie. that its `node` property is a
 * `ts.Declaration`).
 *
 * 如果 `decl` 是 `ConcreteDeclaration`（即其 `node` 属性是 `ts.Declaration`），则返回 true 。
 *
 */
export function isConcreteDeclaration(decl: Declaration): decl is ConcreteDeclaration {
  return decl.kind === DeclarationKind.Concrete;
}

export interface ConcreteDeclaration<T extends ts.Declaration = ts.Declaration> extends
    BaseDeclaration<T> {
  kind: DeclarationKind.Concrete;

  /**
   * Optionally represents a special identity of the declaration, or `null` if the declaration
   * does not have a special identity.
   *
   *（可选）表示声明的特殊标识，如果声明没有特殊标识，则为 `null` 。
   *
   */
  identity: SpecialDeclarationIdentity|null;
}

export type SpecialDeclarationIdentity = DownleveledEnum;

export const enum SpecialDeclarationKind {
  DownleveledEnum,
}

/**
 * A special declaration identity that represents an enum. This is used in downleveled forms where
 * a `ts.EnumDeclaration` is emitted in an alternative form, e.g. an IIFE call that declares all
 * members.
 *
 * 表示枚举的特殊声明标识。这用于低级形式，其中 `ts.EnumDeclaration`
 * 以替代形式发出，例如声明所有成员的 IIFE 调用。
 *
 */
export interface DownleveledEnum {
  kind: SpecialDeclarationKind.DownleveledEnum;
  enumMembers: EnumMember[];
}

/**
 * A declaration that does not have an associated TypeScript `ts.Declaration`.
 *
 * 没有关联的 TypeScript `ts.Declaration` 的声明。
 *
 * This can occur in some downlevelings when an `export const VAR = ...;` (a `ts.Declaration`) is
 * transpiled to an assignment statement (e.g. `exports.VAR = ...;`). There is no `ts.Declaration`
 * associated with `VAR` in that case, only an expression.
 *
 * 当 `export const VAR = ...;` 时，这可能会发生在某些降级中（a `ts.Declaration`
 *）被转换为赋值语句（例如 `exports.VAR = ...;`）。在这种情况下，没有与 `VAR` 关联的
 * `ts.Declaration` ，只有一个表达式。
 *
 */
export interface InlineDeclaration extends
    BaseDeclaration<Exclude<DeclarationNode, ts.Declaration>> {
  kind: DeclarationKind.Inline;
  implementation?: DeclarationNode;
}

/**
 * The declaration of a symbol, along with information about how it was imported into the
 * application.
 *
 * 符号的声明，以及有关它如何导入到应用程序中的信息。
 *
 */
export type Declaration<T extends ts.Declaration = ts.Declaration> =
    ConcreteDeclaration<T>|InlineDeclaration;

/**
 * Abstracts reflection operations on a TypeScript AST.
 *
 * 抽象 TypeScript AST 上的反射操作。
 *
 * Depending on the format of the code being interpreted, different concepts are represented
 * with different syntactical structures. The `ReflectionHost` abstracts over those differences and
 * presents a single API by which the compiler can query specific information about the AST.
 *
 * 根据要解释的代码的格式，不同的概念会用不同的语法结构表示。 `ReflectionHost`
 * 对这些差异进行了抽象，并提供了一个 API，编译器可以通过该 API 查询有关 AST 的特定信息。
 *
 * All operations on the `ReflectionHost` require the use of TypeScript `ts.Node`s with binding
 * information already available (that is, nodes that come from a `ts.Program` that has been
 * type-checked, and are not synthetically created).
 *
 * `ReflectionHost` 上的所有操作都需要使用带有绑定信息的 TypeScript `ts.Node`（即，来自
 * `ts.Program` 的节点已经过类型检查，并且不是综合创建的）。
 *
 */
export interface ReflectionHost {
  /**
   * Examine a declaration (for example, of a class or function) and return metadata about any
   * decorators present on the declaration.
   *
   * 检查声明（例如，类或函数的）并返回有关声明中存在的任何装饰器的元数据。
   *
   * @param declaration a TypeScript `ts.Declaration` node representing the class or function over
   * which to reflect. For example, if the intent is to reflect the decorators of a class and the
   * source is in ES6 format, this will be a `ts.ClassDeclaration` node. If the source is in ES5
   * format, this might be a `ts.VariableDeclaration` as classes in ES5 are represented as the
   * result of an IIFE execution.
   *
   * 一个 TypeScript `ts.Declaration`
   * 节点，表示要反映的类或函数。例如，如果目的是反映类的装饰器，并且源代码是 ES6 格式，这将是
   * `ts.ClassDeclaration` 节点。如果源是 ES5 格式，则可能是 `ts.VariableDeclaration` ，因为 ES5
   * 中的类表示为 IIFE 执行的结果。
   *
   * @returns
   *
   * an array of `Decorator` metadata if decorators are present on the declaration, or
   * `null` if either no decorators were present or if the declaration is not of a decoratable type.
   *
   * 如果声明中存在装饰器，则为 `Decorator` 元数据的数组，如果不存在装饰器或声明不是可装饰类型，则为
   * `null` 。
   *
   */
  getDecoratorsOfDeclaration(declaration: DeclarationNode): Decorator[]|null;

  /**
   * Examine a declaration which should be of a class, and return metadata about the members of the
   * class.
   *
   * 检查应该是类的声明，并返回有关类成员的元数据。
   *
   * @param clazz a `ClassDeclaration` representing the class over which to reflect.
   *
   * 一个 `ClassDeclaration` ，表示要反映的类。
   *
   * @returns
   *
   * an array of `ClassMember` metadata representing the members of the class.
   *
   * 表示类成员的 `ClassMember` 元数据数组。
   *
   * @throws if `declaration` does not resolve to a class declaration.
   *
   * if `declaration` 不会解析为类声明。
   *
   */
  getMembersOfClass(clazz: ClassDeclaration): ClassMember[];

  /**
   * Reflect over the constructor of a class and return metadata about its parameters.
   *
   * 反射类的构造函数并返回有关其参数的元数据。
   *
   * This method only looks at the constructor of a class directly and not at any inherited
   * constructors.
   *
   * 此方法仅直接查看类的构造函数，而不查看任何继承的构造函数。
   *
   * @param clazz a `ClassDeclaration` representing the class over which to reflect.
   *
   * 一个 `ClassDeclaration` ，表示要反映的类。
   *
   * @returns
   *
   * an array of `Parameter` metadata representing the parameters of the constructor, if
   * a constructor exists. If the constructor exists and has 0 parameters, this array will be empty.
   * If the class has no constructor, this method returns `null`.
   *
   * 表示构造函数参数的 `Parameter` 元数据数组（如果存在）。如果构造函数存在并且有 0
   * 个参数，则此数组将是空的。如果类没有构造函数，则此方法返回 `null` 。
   *
   */
  getConstructorParameters(clazz: ClassDeclaration): CtorParameter[]|null;

  /**
   * Reflect over a function and return metadata about its parameters and body.
   *
   * 反射一个函数并返回有关其参数和主体的元数据。
   *
   * Functions in TypeScript and ES5 code have different AST representations, in particular around
   * default values for parameters. A TypeScript function has its default value as the initializer
   * on the parameter declaration, whereas an ES5 function has its default value set in a statement
   * of the form:
   *
   * TypeScript 和 ES5 代码中的函数有不同的 AST 表示，在参数的默认值附近尤为明显。 TypeScript
   * 函数的默认值作为参数声明中的初始化器，而 ES5 函数的默认值在以下形式的语句中设置：
   *
   * if (param === void 0) { param = 3; }
   *
   * This method abstracts over these details, and interprets the function declaration and body to
   * extract parameter default values and the "real" body.
   *
   * 此方法抽象了这些细节，并解释函数声明和主体以提取参数默认值和“真实”主体。
   *
   * A current limitation is that this metadata has no representation for shorthand assignment of
   * parameter objects in the function signature.
   *
   * 当前的限制是此元数据没有函数签名中参数对象的速记分配的表示。
   *
   * @param fn a TypeScript `ts.Declaration` node representing the function over which to reflect.
   *
   * 一个 TypeScript `ts.Declaration` 节点，表示要反映的函数。
   *
   * @returns
   *
   * a `FunctionDefinition` giving metadata about the function definition.
   *
   * 提供有关函数定义的元数据的 `FunctionDefinition` 。
   *
   */
  getDefinitionOfFunction(fn: ts.Node): FunctionDefinition|null;

  /**
   * Determine if an identifier was imported from another module and return `Import` metadata
   * describing its origin.
   *
   * 确定标识符是否是从另一个模块导入的，并返回描述其来源的 `Import` 元数据。
   *
   * @param id a TypeScript `ts.Identifier` to reflect.
   *
   * 要反映的 TypeScript `ts.Identifer` 。
   *
   * @returns
   *
   * metadata about the `Import` if the identifier was imported from another module, or
   * `null` if the identifier doesn't resolve to an import but instead is locally defined.
   *
   * 如果标识符是从另一个模块导入的，则有关 `Import`
   * 的元数据；如果标识符未解析为导入而是本地定义，则为 `null` 。
   *
   */
  getImportOfIdentifier(id: ts.Identifier): Import|null;

  /**
   * Trace an identifier to its declaration, if possible.
   *
   * 如果可能，将标识符跟踪到其声明。
   *
   * This method attempts to resolve the declaration of the given identifier, tracing back through
   * imports and re-exports until the original declaration statement is found. A `Declaration`
   * object is returned if the original declaration is found, or `null` is returned otherwise.
   *
   * 此方法会尝试解析给定标识符的声明，通过导入和重新导出进行追溯，直到找到原始的声明语句。如果找到原始声明，则返回
   * `Declaration` 对象，否则返回 `null` 。
   *
   * If the declaration is in a different module, and that module is imported via an absolute path,
   * this method also returns the absolute path of the imported module. For example, if the code is:
   *
   * 如果声明在不同的模块中，并且该模块是通过绝对路径导入的，则此方法还会返回导入模块的绝对路径。例如，如果代码是：
   *
   * ```
   * import {RouterModule} from '@angular/core';
   *
   * export const ROUTES = RouterModule.forRoot([...]);
   * ```
   *
   * and if `getDeclarationOfIdentifier` is called on `RouterModule` in the `ROUTES` expression,
   * then it would trace `RouterModule` via its import from `@angular/core`, and note that the
   * definition was imported from `@angular/core` into the application where it was referenced.
   *
   * 并且如果在 `ROUTES` 表达式中的 `RouterModule` 上调用 `getDeclarationOfIdentifier`
   * ，那么它将通过从 `@angular/core` 导入来跟踪 `RouterModule` ，并注意该定义是从 `@angular/core`
   * 导入到它被引用的应用程序中的。
   *
   * If the definition is re-exported several times from different absolute module names, only
   * the first one (the one by which the application refers to the module) is returned.
   *
   * 如果定义是从不同的绝对模块名称重新导出几次，则仅返回第一个（应用程序引用模块的）。
   *
   * This module name is returned in the `viaModule` field of the `Declaration`. If The declaration
   * is relative to the application itself and there was no import through an absolute path, then
   * `viaModule` is `null`.
   *
   * 此模块名称会在 `Declaration` 的 `viaModule` 字段中返回。如果
   * 声明是相对于应用程序本身的，并且没有通过绝对路径导入，则 `viaModule` 为 `null` 。
   *
   * @param id a TypeScript `ts.Identifier` to trace back to a declaration.
   *
   * 要追溯到声明的 TypeScript `ts.Identifier` 。
   *
   * @returns
   *
   * metadata about the `Declaration` if the original declaration is found, or `null`
   * otherwise.
   *
   * 如果找到原始声明，则有关此 `Declaration` 的元数据，否则为 `null` 。
   *
   */
  getDeclarationOfIdentifier(id: ts.Identifier): Declaration|null;

  /**
   * Collect the declarations exported from a module by name.
   *
   * 按名称收集从模块导出的声明。
   *
   * Iterates over the exports of a module (including re-exports) and returns a map of export
   * name to its `Declaration`. If an exported value is itself re-exported from another module,
   * the `Declaration`'s `viaModule` will reflect that.
   *
   * 迭代模块的导出（包括重新导出），并将导出名称的映射返回到其 `Declaration`
   * 。如果导出的值本身是从另一个模块重新导出的，则 `Declaration` 的 `viaModule` 将反映这一点。
   *
   * @param node a TypeScript `ts.Node` representing the module (for example a `ts.SourceFile`) for
   * which to collect exports.
   *
   * 一个 TypeScript `ts.Node` ，表示要收集导出的模块（例如 `ts.SourceFile`）。
   *
   * @returns
   *
   * a map of `Declaration`s for the module's exports, by name.
   *
   * 模块导出的 `Declaration` s 的映射表，按名称。
   *
   */
  getExportsOfModule(module: ts.Node): Map<string, Declaration>|null;

  /**
   * Check whether the given node actually represents a class.
   *
   * 检查给定的节点是否真的代表一个类。
   *
   */
  isClass(node: ts.Node): node is ClassDeclaration;

  /**
   * Determines whether the given declaration, which should be a class, has a base class.
   *
   * 确定给定的声明（应该是类）是否具有基类。
   *
   * @param clazz a `ClassDeclaration` representing the class over which to reflect.
   *
   * 一个 `ClassDeclaration` ，表示要反映的类。
   *
   */
  hasBaseClass(clazz: ClassDeclaration): boolean;

  /**
   * Get an expression representing the base class (if any) of the given `clazz`.
   *
   * 获取表示给定 `clazz` 的基类（如果有）的表达式。
   *
   * This expression is most commonly an Identifier, but is possible to inherit from a more dynamic
   * expression.
   *
   * 此表达式通常是标识符，但也可以从更动态的表达式继承。
   *
   * @param clazz the class whose base we want to get.
   *
   * 我们要获取其基的类。
   *
   */
  getBaseClassExpression(clazz: ClassDeclaration): ts.Expression|null;

  /**
   * Get the number of generic type parameters of a given class.
   *
   * 获取给定类的泛型类型参数的数量。
   *
   * @param clazz a `ClassDeclaration` representing the class over which to reflect.
   *
   * 一个 `ClassDeclaration` ，表示要反映的类。
   *
   * @returns
   *
   * the number of type parameters of the class, if known, or `null` if the declaration
   * is not a class or has an unknown number of type parameters.
   *
   * 类的类型参数的数量（如果已知），如果声明不是类或具有未知数量的类型参数，则为 `null` 。
   *
   */
  getGenericArityOfClass(clazz: ClassDeclaration): number|null;

  /**
   * Find the assigned value of a variable declaration.
   *
   * 查找变量声明的赋值。
   *
   * Normally this will be the initializer of the declaration, but where the variable is
   * not a `const` we may need to look elsewhere for the variable's value.
   *
   * 通常，这将是声明的初始化器，但在变量不是 `const` 的地方，我们可能需要在其他地方查找变量的值。
   *
   * @param declaration a TypeScript variable declaration, whose value we want.
   *
   * 一个 TypeScript 变量声明，我们想要其值。
   *
   * @returns
   *
   * the value of the variable, as a TypeScript expression node, or `undefined`
   * if the value cannot be computed.
   *
   * 变量的值，作为 TypeScript 表达式节点，如果无法计算值，则为 `undefined` 。
   *
   */
  getVariableValue(declaration: ts.VariableDeclaration): ts.Expression|null;

  /**
   * Take an exported declaration (maybe a class down-leveled to a variable) and look up the
   * declaration of its type in a separate .d.ts tree.
   *
   * 获取一个导出的声明（可能是一个降级为变量的类），并在单独的 .d.ts 树中查找其类型的声明。
   *
   * This function is allowed to return `null` if the current compilation unit does not have a
   * separate .d.ts tree. When compiling TypeScript code this is always the case, since .d.ts files
   * are produced only during the emit of such a compilation. When compiling .js code, however,
   * there is frequently a parallel .d.ts tree which this method exposes.
   *
   * 如果当前编译单元没有单独的 .d.ts 树，则允许此函数返回 `null` 。编译 TypeScript
   * 代码时，情况总是如此，因为 .d.ts 文件仅在此类编译的发出期间生成。但是，在编译 .js
   * 代码时，此方法通常会公开一个并行 .d.ts 树。
   *
   * Note that the `ts.Declaration` returned from this function may not be from the same
   * `ts.Program` as the input declaration.
   *
   * 请注意，从此函数返回的 `ts.Declaration` 可能与输入声明来自不同的 `ts.Program` 。
   *
   */
  getDtsDeclaration(declaration: DeclarationNode): ts.Declaration|null;

  /**
   * Get a `ts.Identifier` for a given `ClassDeclaration` which can be used to refer to the class
   * within its definition (such as in static fields).
   *
   * 获取给定 `ts.Identifier` 的 `ClassDeclaration` ，它可用于引用其定义中的类（例如在静态字段中）。
   *
   * This can differ from `clazz.name` when ngcc runs over ES5 code, since the class may have a
   * different name within its IIFE wrapper than it does externally.
   *
   * 当 ngcc 在 ES5 代码上运行时，这可能与 `clazz.name` 不同，因为类在其 IIFE
   * 包装器中的名称可能与在外部的名称不同。
   *
   */
  getInternalNameOfClass(clazz: ClassDeclaration): ts.Identifier;

  /**
   * Get a `ts.Identifier` for a given `ClassDeclaration` which can be used to refer to the class
   * from statements that are "adjacent", and conceptually tightly bound, to the class but not
   * actually inside it.
   *
   * 获取给定 `ts.Identifier` 的 `ClassDeclaration`
   * ，它可用于从“相邻”且在概念上紧密绑定但实际上不在类内部的语句中引用类。
   *
   * Similar to `getInternalNameOfClass()`, this name can differ from `clazz.name` when ngcc runs
   * over ES5 code, since these "adjacent" statements need to exist in the IIFE where the class may
   * have a different name than it does externally.
   *
   * 与 `getInternalNameOfClass()` 类似，当 ngcc 在 ES5 代码上运行时，此名称可能与 `clazz.name`
   * 不同，因为这些“相邻”语句需要存在于 IIFE 中，其中的类可能有与外部不同的名称。
   *
   */
  getAdjacentNameOfClass(clazz: ClassDeclaration): ts.Identifier;

  /**
   * Returns `true` if a declaration is exported from the module in which it's defined.
   *
   * 如果声明是从定义它的模块导出的，则返回 `true` 。
   *
   * Not all mechanisms by which a declaration is exported can be statically detected, especially
   * when processing already compiled JavaScript. A `false` result does not indicate that the
   * declaration is never visible outside its module, only that it was not exported via one of the
   * export mechanisms that the `ReflectionHost` is capable of statically checking.
   *
   * 并非所有导出声明的机制都可以被静态检测到，尤其是在处理已经编译的 JavaScript 时。 `false`
   * 的结果并不表明声明在其模块外永远不可见，只是表明它不是通过 `ReflectionHost`
   * 能够静态检查的导出机制之一导出的。
   *
   */
  isStaticallyExported(decl: ts.Node): boolean;
}
