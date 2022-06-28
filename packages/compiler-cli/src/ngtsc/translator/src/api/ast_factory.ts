/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Used to create transpiler specific AST nodes from Angular Output AST nodes in an abstract way.
 *
 * 用于以抽象的方式从 Angular 输出 AST 节点创建转译器特定的 AST 节点。
 *
 * Note that the `AstFactory` makes no assumptions about the target language being generated.
 * It is up to the caller to do this - e.g. only call `createTaggedTemplate()` or pass
 * `let`\|`const` to `createVariableDeclaration()` if the final JS will allow it.
 *
 * 请注意，`AstFactory` 不对正在生成的目标语言做任何假设。这取决于调用者 - 例如仅调用
 * `createTaggedTemplate()` 或通过 `let` |如果最终的 JS 允许，则 `const` 为
 * `createVariableDeclaration()` 。
 *
 */
export interface AstFactory<TStatement, TExpression> {
  /**
   * Attach the `leadingComments` to the given `statement` node.
   *
   * 将 `leadingComments` 附加到给定的 `statement` 节点。
   *
   * @param statement the statement where the comments are to be attached.
   *
   * 要附加注释的声明。
   *
   * @param leadingComments the comments to attach.
   *
   * 要附加的注释。
   *
   */
  attachComments(statement: TStatement, leadingComments: LeadingComment[]): void;

  /**
   * Create a literal array expresion (e.g. `[expr1, expr2]`).
   *
   * 创建一个文字数组表达式（例如 `[expr1, expr2]`）。
   *
   * @param elements a collection of the expressions to appear in each array slot.
   *
   * 要出现在每个数组槽中的表达式的集合。
   *
   */
  createArrayLiteral(elements: TExpression[]): TExpression;

  /**
   * Create an assignment expression (e.g. `lhsExpr = rhsExpr`).
   *
   * 创建一个赋值表达式（例如 `lhsExpr = rhsExpr`）。
   *
   * @param target an expression that evaluates to the left side of the assignment.
   *
   * 计算结果为赋值左侧的表达式。
   *
   * @param value an expression that evaluates to the right side of the assignment.
   *
   * 估算为赋值右侧的表达式。
   *
   */
  createAssignment(target: TExpression, value: TExpression): TExpression;

  /**
   * Create a binary expression (e.g. `lhs && rhs`).
   *
   * 创建一个二进制表达式（例如 `lhs && rhs`）。
   *
   * @param leftOperand an expression that will appear on the left of the operator.
   *
   * 将出现在运算符左侧的表达式。
   *
   * @param operator the binary operator that will be applied.
   *
   * 将应用的二元运算符。
   *
   * @param rightOperand an expression that will appear on the right of the operator.
   *
   * 将出现在运算符右侧的表达式。
   *
   */
  createBinaryExpression(
      leftOperand: TExpression, operator: BinaryOperator, rightOperand: TExpression): TExpression;

  /**
   * Create a block of statements (e.g. `{ stmt1; stmt2; }`).
   *
   * 创建一个语句块（例如 `{ stmt1; stmt2; }`）。
   *
   * @param body an array of statements to be wrapped in a block.
   *
   * 要包装在块中的语句数组。
   *
   */
  createBlock(body: TStatement[]): TStatement;

  /**
   * Create an expression that is calling the `callee` with the given `args`.
   *
   * 创建一个使用给定 `args` 调用 `callee` 的表达式。
   *
   * @param callee an expression that evaluates to a function to be called.
   *
   * 估算为要调用的函数的表达式。
   *
   * @param args the arugments to be passed to the call.
   *
   * 要传递给调用的参数。
   *
   * @param pure whether to mark the call as pure (having no side-effects).
   *
   * 是否将调用标记为纯（没有副作用）。
   *
   */
  createCallExpression(callee: TExpression, args: TExpression[], pure: boolean): TExpression;

  /**
   * Create a ternary expression (e.g. `testExpr ? trueExpr : falseExpr`).
   *
   * 创建一个三元表达式（例如 `testExpr ? trueExpr : falseExpr`）。
   *
   * @param condition an expression that will be tested for truthiness.
   *
   * 将要测试其真实性的表达式。
   *
   * @param thenExpression an expression that is executed if `condition` is truthy.
   *
   * 如果 `condition` 为真，则执行的表达式。
   *
   * @param elseExpression an expression that is executed if `condition` is falsy.
   *
   * 如果 `condition` 为 false ，则执行的表达式。
   *
   */
  createConditional(
      condition: TExpression, thenExpression: TExpression,
      elseExpression: TExpression): TExpression;

  /**
   * Create an element access (e.g. `obj[expr]`).
   *
   * 创建元素访问（例如 `obj[expr]`）。
   *
   * @param expression an expression that evaluates to the object to be accessed.
   *
   * 估算为要访问的对象的表达式。
   *
   * @param element an expression that evaluates to the element on the object.
   *
   * 估算为对象上元素的表达式。
   *
   */
  createElementAccess(expression: TExpression, element: TExpression): TExpression;

  /**
   * Create a statement that is simply executing the given `expression` (e.g. `x = 10;`).
   *
   * 创建一个仅执行给定 `expression` 的语句（例如 `x = 10;`）。
   *
   * @param expression the expression to be converted to a statement.
   *
   * 要转换为语句的表达式。
   *
   */
  createExpressionStatement(expression: TExpression): TStatement;

  /**
   * Create a statement that declares a function (e.g. `function foo(param1, param2) { stmt; }`).
   *
   * 创建一个声明函数的语句（例如 `function foo(param1, param2) { stmt; }`）。
   *
   * @param functionName the name of the function.
   *
   * 函数的名称。
   *
   * @param parameters the names of the function's parameters.
   *
   * 函数参数的名称。
   *
   * @param body a statement (or a block of statements) that are the body of the function.
   *
   * 作为函数体的语句（或语句块）。
   *
   */
  createFunctionDeclaration(functionName: string, parameters: string[], body: TStatement):
      TStatement;

  /**
   * Create an expression that represents a function
   * (e.g. `function foo(param1, param2) { stmt; }`).
   *
   * 创建一个表示函数的表达式（例如 `function foo(param1, param2) { stmt; }`）。
   *
   * @param functionName the name of the function.
   *
   * 函数的名称。
   *
   * @param parameters the names of the function's parameters.
   *
   * 函数参数的名称。
   *
   * @param body a statement (or a block of statements) that are the body of the function.
   *
   * 作为函数体的语句（或语句块）。
   *
   */
  createFunctionExpression(functionName: string|null, parameters: string[], body: TStatement):
      TExpression;

  /**
   * Create an identifier.
   *
   * 创建一个标识符。
   *
   * @param name the name of the identifier.
   *
   * 标识符的名称。
   *
   */
  createIdentifier(name: string): TExpression;

  /**
   * Create an if statement (e.g. `if (testExpr) { trueStmt; } else { falseStmt; }`).
   *
   * 创建一个 if 语句（例如 `if (testExpr) { trueStmt; } else { falseStmt; }`）。
   *
   * @param condition an expression that will be tested for truthiness.
   *
   * 将要测试其真实性的表达式。
   *
   * @param thenStatement a statement (or block of statements) that is executed if `condition` is
   *     truthy.
   *
   * 如果 `condition` 为真，则执行的语句（或语句块）。
   *
   * @param elseStatement a statement (or block of statements) that is executed if `condition` is
   *     falsy.
   *
   * 在 `condition` 为 falsy 时执行的语句（或语句块）。
   *
   */
  createIfStatement(
      condition: TExpression, thenStatement: TStatement,
      elseStatement: TStatement|null): TStatement;

  /**
   * Create a simple literal (e.g. `"string"`, `123`, `false`, etc).
   *
   * 创建一个简单的文字（例如 `"string"`、`123`、`false` 等）。
   *
   * @param value the value of the literal.
   *
   * 文字的值。
   *
   */
  createLiteral(value: string|number|boolean|null|undefined): TExpression;

  /**
   * Create an expression that is instantiating the `expression` as a class.
   *
   * 创建一个将表达式实例化为类的 `expression` 。
   *
   * @param expression an expression that evaluates to a constructor to be instantiated.
   *
   * 估算为要实例化的构造函数的表达式。
   *
   * @param args the arguments to be passed to the constructor.
   *
   * 要传递给构造函数的参数。
   *
   */
  createNewExpression(expression: TExpression, args: TExpression[]): TExpression;

  /**
   * Create a literal object expression (e.g. `{ prop1: expr1, prop2: expr2 }`).
   *
   * 创建一个文字对象表达式（例如 `{ prop1: expr1, prop2: expr2 }`）。
   *
   * @param properties the properties (key and value) to appear in the object.
   *
   * 要出现在对象中的属性（键和值）。
   *
   */
  createObjectLiteral(properties: ObjectLiteralProperty<TExpression>[]): TExpression;

  /**
   * Wrap an expression in parentheses.
   *
   * 将表达式放在括号中。
   *
   * @param expression the expression to wrap in parentheses.
   *
   * 要括在括号中的表达式。
   *
   */
  createParenthesizedExpression(expression: TExpression): TExpression;

  /**
   * Create a property access (e.g. `obj.prop`).
   *
   * 创建属性访问（例如 `obj.prop`）。
   *
   * @param expression an expression that evaluates to the object to be accessed.
   *
   * 估算为要访问的对象的表达式。
   *
   * @param propertyName the name of the property to access.
   *
   * 要访问的属性的名称。
   *
   */
  createPropertyAccess(expression: TExpression, propertyName: string): TExpression;

  /**
   * Create a return statement (e.g `return expr;`).
   *
   * 创建一个 return 语句（例如 `return expr;`）。
   *
   * @param expression the expression to be returned.
   *
   * 要返回的表达式。
   *
   */
  createReturnStatement(expression: TExpression|null): TStatement;

  /**
   * Create a tagged template literal string. E.g.
   *
   * 创建标记模板文字字符串。例如
   *
   * ```
   * tag`str1${expr1}str2${expr2}str3`
   * ```
   *
   * @param tag an expression that is applied as a tag handler for this template string.
   *
   * 一个表达式，用作此模板字符串的标记处理程序。
   *
   * @param template the collection of strings and expressions that constitute an interpolated
   *     template literal.
   *
   * 构成内插模板文字的字符串和表达式的集合。
   *
   */
  createTaggedTemplate(tag: TExpression, template: TemplateLiteral<TExpression>): TExpression;

  /**
   * Create a throw statement (e.g. `throw expr;`).
   *
   * 创建一个 throw 语句（例如 `throw expr;`）。
   *
   * @param expression the expression to be thrown.
   *
   * 要抛出的表达式。
   *
   */
  createThrowStatement(expression: TExpression): TStatement;

  /**
   * Create an expression that extracts the type of an expression (e.g. `typeof expr`).
   *
   * 创建一个提取表达式类型的表达式（例如 `typeof expr`）。
   *
   * @param expression the expression whose type we want.
   *
   * 我们想要其类型的表达式。
   *
   */
  createTypeOfExpression(expression: TExpression): TExpression;

  /**
   * Prefix the `operand` with the given `operator` (e.g. `-expr`).
   *
   * 使用给定的 `operator`（例如 `-expr`）为 `operand` 添加前缀。
   *
   * @param operator the text of the operator to apply (e.g. `+`, `-` or `!`).
   *
   * 要应用的运算符的文本（例如 `+`、`-` 或 `!`）。
   *
   * @param operand the expression that the operator applies to.
   *
   * 运算符适用的表达式。
   *
   */
  createUnaryExpression(operator: UnaryOperator, operand: TExpression): TExpression;

  /**
   * Create an expression that declares a new variable, possibly initialized to `initializer`.
   *
   * 创建一个声明一个新变量的表达式，可能初始化为 `initializer` 。
   *
   * @param variableName the name of the variable.
   *
   * 变量的名称。
   *
   * @param initializer if not `null` then this expression is assigned to the declared variable.
   *
   * 如果不为 `null` ，则此表达式被分配给声明的变量。
   *
   * @param type whether this variable should be declared as `var`, `let` or `const`.
   *
   * 此变量是应该声明为 `var`、`let` 或 `const` 。
   *
   */
  createVariableDeclaration(
      variableName: string, initializer: TExpression|null,
      type: VariableDeclarationType): TStatement;

  /**
   * Attach a source map range to the given node.
   *
   * 将源映射范围附加到给定节点。
   *
   * @param node the node to which the range should be attached.
   *
   * 范围应该附加到的节点。
   *
   * @param sourceMapRange the range to attach to the node, or null if there is no range to attach.
   *
   * 要附加到节点的范围，如果没有要附加的范围，则为 null 。
   *
   * @returns
   *
   * the `node` with the `sourceMapRange` attached.
   *
   * 附加了 `sourceMapRange` 的 `node` 。
   *
   */
  setSourceMapRange<T extends TStatement|TExpression>(node: T, sourceMapRange: SourceMapRange|null):
      T;
}

/**
 * The type of a variable declaration.
 *
 * 变量声明的类型。
 *
 */
export type VariableDeclarationType = 'const'|'let'|'var';

/**
 * The unary operators supported by the `AstFactory`.
 *
 * `AstFactory` 支持的一元运算符。
 *
 */
export type UnaryOperator = '+'|'-'|'!';

/**
 * The binary operators supported by the `AstFactory`.
 *
 * `AstFactory` 支持的二元运算符。
 *
 */
export type BinaryOperator =
    '&&'|'>'|'>='|'&'|'/'|'=='|'==='|'<'|'<='|'-'|'%'|'*'|'!='|'!=='|'||'|'+'|'??';

/**
 * The original location of the start or end of a node created by the `AstFactory`.
 *
 * `AstFactory` 创建的节点开始或结束的原始位置。
 *
 */
export interface SourceMapLocation {
  /**
   * 0-based character position of the location in the original source file.
   *
   * 该位置在原始源文件中的从 0 开始的字符位置。
   *
   */
  offset: number;
  /**
   * 0-based line index of the location in the original source file.
   *
   * 原始源文件中位置的从 0 开始的行索引。
   *
   */
  line: number;
  /**
   * 0-based column position of the location in the original source file.
   *
   * 原始源文件中此位置的从 0 开始的列位置。
   *
   */
  column: number;
}

/**
 * The original range of a node created by the `AstFactory`.
 *
 * `AstFactory` 创建的节点的原始范围。
 *
 */
export interface SourceMapRange {
  url: string;
  content: string;
  start: SourceMapLocation;
  end: SourceMapLocation;
}

/**
 * Information used by the `AstFactory` to create a property on an object literal expression.
 *
 * `AstFactory` 用于在对象文字表达式上创建属性的信息。
 *
 */
export interface ObjectLiteralProperty<TExpression> {
  propertyName: string;
  value: TExpression;
  /**
   * Whether the `propertyName` should be enclosed in quotes.
   *
   * `propertyName` 是否应该用引号引起来。
   *
   */
  quoted: boolean;
}

/**
 * Information used by the `AstFactory` to create a template literal string (i.e. a back-ticked
 * string with interpolations).
 *
 * `AstFactory` 用于创建模板文字字符串（即带有插值的反引号字符串）的信息。
 *
 */
export interface TemplateLiteral<TExpression> {
  /**
   * A collection of the static string pieces of the interpolated template literal string.
   *
   * 内插模板文字字符串的静态字符串片段的集合。
   *
   */
  elements: TemplateElement[];
  /**
   * A collection of the interpolated expressions that are interleaved between the elements.
   *
   * 在元素之间交错的插值表达式的集合。
   *
   */
  expressions: TExpression[];
}

/**
 * Information about a static string piece of an interpolated template literal string.
 *
 * 有关内插模板文字字符串的静态字符串的信息。
 *
 */
export interface TemplateElement {
  /**
   * The raw string as it was found in the original source code.
   *
   * 在原始源代码中找到的原始字符串。
   *
   */
  raw: string;
  /**
   * The parsed string, with escape codes etc processed.
   *
   * 已处理的解析后的字符串，带有转义代码等。
   *
   */
  cooked: string;
  /**
   * The original location of this piece of the template literal string.
   *
   * 这段模板文字字符串的原始位置。
   *
   */
  range: SourceMapRange|null;
}

/**
 * Information used by the `AstFactory` to prepend a comment to a statement that was created by the
 * `AstFactory`.
 *
 * `AstFactory` 用于将注释添加到 `AstFactory` 创建的语句的信息。
 *
 */
export interface LeadingComment {
  toString(): string;
  multiline: boolean;
  trailingNewline: boolean;
}
