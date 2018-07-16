/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * resolver.ts implements partial computation of expressions, resolving expressions to static
 * values where possible and returning a `DynamicValue` signal when not.
 */

import {Expression, ExternalExpr, ExternalReference, WrappedNodeExpr} from '@angular/compiler';
import * as path from 'path';
import * as ts from 'typescript';

import {ClassMemberKind, ReflectionHost} from '../../host';

const TS_DTS_EXTENSION = /(\.d)?\.ts$/;

/**
 * Represents a value which cannot be determined statically.
 *
 * Use `isDynamicValue` to determine whether a `ResolvedValue` is a `DynamicValue`.
 */
export class DynamicValue {
  /**
   * This is needed so the "is DynamicValue" assertion of `isDynamicValue` actually has meaning.
   *
   * Otherwise, "is DynamicValue" is akin to "is {}" which doesn't trigger narrowing.
   */
  private _isDynamic = true;
}

/**
 * An internal flyweight for `DynamicValue`. Eventually the dynamic value will carry information
 * on the location of the node that could not be statically computed.
 */
const DYNAMIC_VALUE: DynamicValue = new DynamicValue();

/**
 * Used to test whether a `ResolvedValue` is a `DynamicValue`.
 */
export function isDynamicValue(value: any): value is DynamicValue {
  return value === DYNAMIC_VALUE;
}

/**
 * A value resulting from static resolution.
 *
 * This could be a primitive, collection type, reference to a `ts.Node` that declares a
 * non-primitive value, or a special `DynamicValue` type which indicates the value was not
 * available statically.
 */
export type ResolvedValue = number | boolean | string | null | undefined | Reference |
    ResolvedValueArray | ResolvedValueMap | DynamicValue;

/**
 * An array of `ResolvedValue`s.
 *
 * This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueArray`
 * ->
 * `ResolvedValue`.
 */
export interface ResolvedValueArray extends Array<ResolvedValue> {}

/**
 * A map of strings to `ResolvedValue`s.
 *
 * This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueMap` ->
 * `ResolvedValue`.
 */ export interface ResolvedValueMap extends Map<string, ResolvedValue> {}

/**
 * Tracks the scope of a function body, which includes `ResolvedValue`s for the parameters of that
 * body.
 */
type Scope = Map<ts.ParameterDeclaration, ResolvedValue>;

export enum ImportMode {
  UseExistingImport,
  ForceNewImport,
}

/**
 * A reference to a `ts.Node`.
 *
 * For example, if an expression evaluates to a function or class definition, it will be returned
 * as a `Reference` (assuming references are allowed in evaluation).
 */
export abstract class Reference<T extends ts.Node = ts.Node> {
  constructor(readonly node: T) {}

  /**
   * Whether an `Expression` can be generated which references the node.
   */
  // TODO(issue/24571): remove '!'.
  readonly expressable !: boolean;

  /**
   * Generate an `Expression` representing this type, in the context of the given SourceFile.
   *
   * This could be a local variable reference, if the symbol is imported, or it could be a new
   * import if needed.
   */
  abstract toExpression(context: ts.SourceFile, importMode?: ImportMode): Expression|null;

  abstract addIdentifier(identifier: ts.Identifier): void;
}

/**
 * A reference to a node only, without any ability to get an `Expression` representing that node.
 *
 * This is used for returning references to things like method declarations, which are not directly
 * referenceable.
 */
export class NodeReference<T extends ts.Node = ts.Node> extends Reference<T> {
  constructor(node: T, readonly moduleName: string|null) { super(node); }

  toExpression(context: ts.SourceFile): null { return null; }

  addIdentifier(identifier: ts.Identifier): void {}
}

/**
 * A reference to a node which has a `ts.Identifier` and can be resolved to an `Expression`.
 *
 * Imports generated by `ResolvedReference`s are always relative.
 */
export class ResolvedReference<T extends ts.Node = ts.Node> extends Reference<T> {
  protected identifiers: ts.Identifier[] = [];

  constructor(node: T, protected primaryIdentifier: ts.Identifier) { super(node); }

  readonly expressable = true;

  toExpression(context: ts.SourceFile, importMode: ImportMode = ImportMode.UseExistingImport):
      Expression {
    const localIdentifier =
        pickIdentifier(context, this.primaryIdentifier, this.identifiers, importMode);
    if (localIdentifier !== null) {
      return new WrappedNodeExpr(localIdentifier);
    } else {
      // Relative import from context -> this.node.getSourceFile().
      // TODO(alxhub): investigate the impact of multiple source roots here.
      // TODO(alxhub): investigate the need to map such paths via the Host for proper g3 support.
      let relative =
          path.posix.relative(path.dirname(context.fileName), this.node.getSourceFile().fileName)
              .replace(TS_DTS_EXTENSION, '');

      // path.relative() does not include the leading './'.
      if (!relative.startsWith('.')) {
        relative = `./${relative}`;
      }

      // path.relative() returns the empty string (converted to './' above) if the two paths are the
      // same.
      if (relative === './') {
        // Same file after all.
        return new WrappedNodeExpr(this.primaryIdentifier);
      } else {
        return new ExternalExpr(new ExternalReference(relative, this.primaryIdentifier.text));
      }
    }
  }

  addIdentifier(identifier: ts.Identifier): void { this.identifiers.push(identifier); }
}

/**
 * A reference to a node which has a `ts.Identifer` and an expected absolute module name.
 *
 * An `AbsoluteReference` can be resolved to an `Expression`, and if that expression is an import
 * the module specifier will be an absolute module name, not a relative path.
 */
export class AbsoluteReference extends Reference {
  private identifiers: ts.Identifier[] = [];
  constructor(
      node: ts.Node, private primaryIdentifier: ts.Identifier, readonly moduleName: string,
      readonly symbolName: string) {
    super(node);
  }

  readonly expressable = true;

  toExpression(context: ts.SourceFile, importMode: ImportMode = ImportMode.UseExistingImport):
      Expression {
    const localIdentifier =
        pickIdentifier(context, this.primaryIdentifier, this.identifiers, importMode);
    if (localIdentifier !== null) {
      return new WrappedNodeExpr(localIdentifier);
    } else {
      return new ExternalExpr(new ExternalReference(this.moduleName, this.symbolName));
    }
  }

  addIdentifier(identifier: ts.Identifier): void { this.identifiers.push(identifier); }
}

function pickIdentifier(
    context: ts.SourceFile, primary: ts.Identifier, secondaries: ts.Identifier[],
    mode: ImportMode): ts.Identifier|null {
  context = ts.getOriginalNode(context) as ts.SourceFile;
  let localIdentifier: ts.Identifier|null = null;
  if (ts.getOriginalNode(primary).getSourceFile() === context) {
    return primary;
  } else if (mode === ImportMode.UseExistingImport) {
    return secondaries.find(id => ts.getOriginalNode(id).getSourceFile() === context) || null;
  } else {
    return null;
  }
}

/**
 * Statically resolve the given `ts.Expression` into a `ResolvedValue`.
 *
 * @param node the expression to statically resolve if possible
 * @param checker a `ts.TypeChecker` used to understand the expression
 * @param foreignFunctionResolver a function which will be used whenever a "foreign function" is
 * encountered. A foreign function is a function which has no body - usually the result of calling
 * a function declared in another library's .d.ts file. In these cases, the foreignFunctionResolver
 * will be called with the function's declaration, and can optionally return a `ts.Expression`
 * (possibly extracted from the foreign function's type signature) which will be used as the result
 * of the call.
 * @returns a `ResolvedValue` representing the resolved value
 */
export function staticallyResolve(
    node: ts.Expression, host: ReflectionHost, checker: ts.TypeChecker,
    foreignFunctionResolver?:
        (node: Reference<ts.FunctionDeclaration|ts.MethodDeclaration>, args: ts.Expression[]) =>
            ts.Expression | null): ResolvedValue {
  return new StaticInterpreter(host, checker).visit(node, {
    absoluteModuleName: null,
    scope: new Map<ts.ParameterDeclaration, ResolvedValue>(), foreignFunctionResolver,
  });
}

interface BinaryOperatorDef {
  literal: boolean;
  op: (a: any, b: any) => ResolvedValue;
}

function literalBinaryOp(op: (a: any, b: any) => any): BinaryOperatorDef {
  return {op, literal: true};
}

function referenceBinaryOp(op: (a: any, b: any) => any): BinaryOperatorDef {
  return {op, literal: false};
}

const BINARY_OPERATORS = new Map<ts.SyntaxKind, BinaryOperatorDef>([
  [ts.SyntaxKind.PlusToken, literalBinaryOp((a, b) => a + b)],
  [ts.SyntaxKind.MinusToken, literalBinaryOp((a, b) => a - b)],
  [ts.SyntaxKind.AsteriskToken, literalBinaryOp((a, b) => a * b)],
  [ts.SyntaxKind.SlashToken, literalBinaryOp((a, b) => a / b)],
  [ts.SyntaxKind.PercentToken, literalBinaryOp((a, b) => a % b)],
  [ts.SyntaxKind.AmpersandToken, literalBinaryOp((a, b) => a & b)],
  [ts.SyntaxKind.BarToken, literalBinaryOp((a, b) => a | b)],
  [ts.SyntaxKind.CaretToken, literalBinaryOp((a, b) => a ^ b)],
  [ts.SyntaxKind.LessThanToken, literalBinaryOp((a, b) => a < b)],
  [ts.SyntaxKind.LessThanEqualsToken, literalBinaryOp((a, b) => a <= b)],
  [ts.SyntaxKind.GreaterThanToken, literalBinaryOp((a, b) => a > b)],
  [ts.SyntaxKind.GreaterThanEqualsToken, literalBinaryOp((a, b) => a >= b)],
  [ts.SyntaxKind.LessThanLessThanToken, literalBinaryOp((a, b) => a << b)],
  [ts.SyntaxKind.GreaterThanGreaterThanToken, literalBinaryOp((a, b) => a >> b)],
  [ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken, literalBinaryOp((a, b) => a >>> b)],
  [ts.SyntaxKind.AsteriskAsteriskToken, literalBinaryOp((a, b) => Math.pow(a, b))],
  [ts.SyntaxKind.AmpersandAmpersandToken, referenceBinaryOp((a, b) => a && b)],
  [ts.SyntaxKind.BarBarToken, referenceBinaryOp((a, b) => a || b)]
]);

const UNARY_OPERATORS = new Map<ts.SyntaxKind, (a: any) => any>([
  [ts.SyntaxKind.TildeToken, a => ~a], [ts.SyntaxKind.MinusToken, a => -a],
  [ts.SyntaxKind.PlusToken, a => +a], [ts.SyntaxKind.ExclamationToken, a => !a]
]);

interface Context {
  absoluteModuleName: string|null;
  scope: Scope;
  foreignFunctionResolver?
      (ref: Reference<ts.FunctionDeclaration|ts.MethodDeclaration|ts.FunctionExpression>,
       args: ReadonlyArray<ts.Expression>): ts.Expression|null;
}

class StaticInterpreter {
  constructor(private host: ReflectionHost, private checker: ts.TypeChecker) {}

  visit(node: ts.Expression, context: Context): ResolvedValue {
    return this.visitExpression(node, context);
  }

  private visitExpression(node: ts.Expression, context: Context): ResolvedValue {
    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return true;
    } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return false;
    } else if (ts.isStringLiteral(node)) {
      return node.text;
    } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
      return node.text;
    } else if (ts.isTemplateExpression(node)) {
      return this.visitTemplateExpression(node, context);
    } else if (ts.isNumericLiteral(node)) {
      return parseFloat(node.text);
    } else if (ts.isObjectLiteralExpression(node)) {
      return this.visitObjectLiteralExpression(node, context);
    } else if (ts.isIdentifier(node)) {
      return this.visitIdentifier(node, context);
    } else if (ts.isPropertyAccessExpression(node)) {
      return this.visitPropertyAccessExpression(node, context);
    } else if (ts.isCallExpression(node)) {
      return this.visitCallExpression(node, context);
    } else if (ts.isConditionalExpression(node)) {
      return this.visitConditionalExpression(node, context);
    } else if (ts.isPrefixUnaryExpression(node)) {
      return this.visitPrefixUnaryExpression(node, context);
    } else if (ts.isBinaryExpression(node)) {
      return this.visitBinaryExpression(node, context);
    } else if (ts.isArrayLiteralExpression(node)) {
      return this.visitArrayLiteralExpression(node, context);
    } else if (ts.isParenthesizedExpression(node)) {
      return this.visitParenthesizedExpression(node, context);
    } else if (ts.isElementAccessExpression(node)) {
      return this.visitElementAccessExpression(node, context);
    } else if (ts.isAsExpression(node)) {
      return this.visitExpression(node.expression, context);
    } else if (ts.isNonNullExpression(node)) {
      return this.visitExpression(node.expression, context);
    } else if (isPossibleClassDeclaration(node) && this.host.isClass(node)) {
      return this.visitDeclaration(node, context);
    } else {
      return DYNAMIC_VALUE;
    }
  }

  private visitArrayLiteralExpression(node: ts.ArrayLiteralExpression, context: Context):
      ResolvedValue {
    const array: ResolvedValueArray = [];
    for (let i = 0; i < node.elements.length; i++) {
      const element = node.elements[i];
      if (ts.isSpreadElement(element)) {
        const spread = this.visitExpression(element.expression, context);
        if (isDynamicValue(spread)) {
          return DYNAMIC_VALUE;
        }
        if (!Array.isArray(spread)) {
          throw new Error(`Unexpected value in spread expression: ${spread}`);
        }

        array.push(...spread);
      } else {
        const result = this.visitExpression(element, context);
        if (isDynamicValue(result)) {
          return DYNAMIC_VALUE;
        }

        array.push(result);
      }
    }
    return array;
  }

  private visitObjectLiteralExpression(node: ts.ObjectLiteralExpression, context: Context):
      ResolvedValue {
    const map: ResolvedValueMap = new Map<string, ResolvedValue>();
    for (let i = 0; i < node.properties.length; i++) {
      const property = node.properties[i];
      if (ts.isPropertyAssignment(property)) {
        const name = this.stringNameFromPropertyName(property.name, context);

        // Check whether the name can be determined statically.
        if (name === undefined) {
          return DYNAMIC_VALUE;
        }

        map.set(name, this.visitExpression(property.initializer, context));
      } else if (ts.isShorthandPropertyAssignment(property)) {
        const symbol = this.checker.getShorthandAssignmentValueSymbol(property);
        if (symbol === undefined || symbol.valueDeclaration === undefined) {
          return DYNAMIC_VALUE;
        }
        map.set(property.name.text, this.visitDeclaration(symbol.valueDeclaration, context));
      } else if (ts.isSpreadAssignment(property)) {
        const spread = this.visitExpression(property.expression, context);
        if (isDynamicValue(spread)) {
          return DYNAMIC_VALUE;
        }
        if (!(spread instanceof Map)) {
          throw new Error(`Unexpected value in spread assignment: ${spread}`);
        }
        spread.forEach((value, key) => map.set(key, value));
      } else {
        return DYNAMIC_VALUE;
      }
    }
    return map;
  }

  private visitTemplateExpression(node: ts.TemplateExpression, context: Context): ResolvedValue {
    const pieces: string[] = [node.head.text];
    for (let i = 0; i < node.templateSpans.length; i++) {
      const span = node.templateSpans[i];
      const value = this.visit(span.expression, context);
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ||
          value == null) {
        pieces.push(`${value}`);
      } else {
        return DYNAMIC_VALUE;
      }
      pieces.push(span.literal.text);
    }
    return pieces.join('');
  }

  private visitIdentifier(node: ts.Identifier, context: Context): ResolvedValue {
    const decl = this.host.getDeclarationOfIdentifier(node);
    if (decl === null) {
      return DYNAMIC_VALUE;
    }
    const result = this.visitDeclaration(
        decl.node, {...context, absoluteModuleName: decl.viaModule || context.absoluteModuleName});
    if (result instanceof Reference) {
      result.addIdentifier(node);
    }
    return result;
  }

  private visitDeclaration(node: ts.Declaration, context: Context): ResolvedValue {
    if (this.host.isClass(node)) {
      return this.getReference(node, context);
    } else if (ts.isVariableDeclaration(node)) {
      if (!node.initializer) {
        return undefined;
      }
      return this.visitExpression(node.initializer, context);
    } else if (ts.isParameter(node) && context.scope.has(node)) {
      return context.scope.get(node) !;
    } else if (ts.isExportAssignment(node)) {
      return this.visitExpression(node.expression, context);
    } else if (ts.isSourceFile(node)) {
      return this.visitSourceFile(node, context);
    } else {
      return this.getReference(node, context);
    }
  }

  private visitElementAccessExpression(node: ts.ElementAccessExpression, context: Context):
      ResolvedValue {
    const lhs = this.visitExpression(node.expression, context);
    if (node.argumentExpression === undefined) {
      throw new Error(`Expected argument in ElementAccessExpression`);
    }
    if (isDynamicValue(lhs)) {
      return DYNAMIC_VALUE;
    }
    const rhs = this.visitExpression(node.argumentExpression, context);
    if (isDynamicValue(rhs)) {
      return DYNAMIC_VALUE;
    }
    if (typeof rhs !== 'string' && typeof rhs !== 'number') {
      throw new Error(
          `ElementAccessExpression index should be string or number, got ${typeof rhs}: ${rhs}`);
    }

    return this.accessHelper(lhs, rhs, context);
  }

  private visitPropertyAccessExpression(node: ts.PropertyAccessExpression, context: Context):
      ResolvedValue {
    const lhs = this.visitExpression(node.expression, context);
    const rhs = node.name.text;
    // TODO: handle reference to class declaration.
    if (isDynamicValue(lhs)) {
      return DYNAMIC_VALUE;
    }

    return this.accessHelper(lhs, rhs, context);
  }

  private visitSourceFile(node: ts.SourceFile, context: Context): ResolvedValue {
    const declarations = this.host.getExportsOfModule(node);
    if (declarations === null) {
      return DYNAMIC_VALUE;
    }
    const map = new Map<string, ResolvedValue>();
    declarations.forEach((decl, name) => {
      const value = this.visitDeclaration(decl.node, {
        ...context,
        absoluteModuleName: decl.viaModule || context.absoluteModuleName,
      });
      map.set(name, value);
    });
    return map;
  }

  private accessHelper(lhs: ResolvedValue, rhs: string|number, context: Context): ResolvedValue {
    const strIndex = `${rhs}`;
    if (lhs instanceof Map) {
      if (lhs.has(strIndex)) {
        return lhs.get(strIndex) !;
      } else {
        throw new Error(`Invalid map access: [${Array.from(lhs.keys())}] dot ${rhs}`);
      }
    } else if (Array.isArray(lhs)) {
      if (rhs === 'length') {
        return lhs.length;
      }
      if (typeof rhs !== 'number' || !Number.isInteger(rhs)) {
        return DYNAMIC_VALUE;
      }
      if (rhs < 0 || rhs >= lhs.length) {
        throw new Error(`Index out of bounds: ${rhs} vs ${lhs.length}`);
      }
      return lhs[rhs];
    } else if (lhs instanceof Reference) {
      const ref = lhs.node;
      if (isPossibleClassDeclaration(ref) && this.host.isClass(ref)) {
        let absoluteModuleName = context.absoluteModuleName;
        if (lhs instanceof NodeReference || lhs instanceof AbsoluteReference) {
          absoluteModuleName = lhs.moduleName || absoluteModuleName;
        }
        let value: ResolvedValue = undefined;
        const member = this.host.getMembersOfClass(ref).find(
            member => member.isStatic && member.name === strIndex);
        if (member !== undefined) {
          if (member.value !== null) {
            value = this.visitExpression(member.value, context);
          } else if (member.implementation !== null) {
            value = new NodeReference(member.implementation, absoluteModuleName);
          } else if (member.node) {
            value = new NodeReference(member.node, absoluteModuleName);
          }
        }
        return value;
      }
    }
    throw new Error(`Invalid dot property access: ${lhs} dot ${rhs}`);
  }

  private visitCallExpression(node: ts.CallExpression, context: Context): ResolvedValue {
    const lhs = this.visitExpression(node.expression, context);
    if (!(lhs instanceof Reference)) {
      throw new Error(`attempting to call something that is not a function: ${lhs}`);
    } else if (!isFunctionOrMethodReference(lhs)) {
      throw new Error(
          `calling something that is not a function declaration? ${ts.SyntaxKind[lhs.node.kind]} (${node.getText()})`);
    }

    const fn = lhs.node;

    // If the function is foreign (declared through a d.ts file), attempt to resolve it with the
    // foreignFunctionResolver, if one is specified.
    if (fn.body === undefined) {
      let expr: ts.Expression|null = null;
      if (context.foreignFunctionResolver) {
        expr = context.foreignFunctionResolver(lhs, node.arguments);
      }
      if (expr === null) {
        throw new Error(
            `could not resolve foreign function declaration: ${node.getSourceFile().fileName} ${(lhs.node.name as ts.Identifier).text}`);
      }

      // If the function is declared in a different file, resolve the foreign function expression
      // using the absolute module name of that file (if any).
      let absoluteModuleName: string|null = context.absoluteModuleName;
      if (lhs instanceof NodeReference || lhs instanceof AbsoluteReference) {
        absoluteModuleName = lhs.moduleName || absoluteModuleName;
      }

      return this.visitExpression(expr, {...context, absoluteModuleName});
    }

    const body = fn.body;
    if (body.statements.length !== 1 || !ts.isReturnStatement(body.statements[0])) {
      throw new Error('Function body must have a single return statement only.');
    }
    const ret = body.statements[0] as ts.ReturnStatement;

    const newScope: Scope = new Map<ts.ParameterDeclaration, ResolvedValue>();
    fn.parameters.forEach((param, index) => {
      let value: ResolvedValue = undefined;
      if (index < node.arguments.length) {
        const arg = node.arguments[index];
        value = this.visitExpression(arg, context);
      }
      if (value === undefined && param.initializer !== undefined) {
        value = this.visitExpression(param.initializer, context);
      }
      newScope.set(param, value);
    });

    return ret.expression !== undefined ?
        this.visitExpression(ret.expression, {...context, scope: newScope}) :
        undefined;
  }

  private visitConditionalExpression(node: ts.ConditionalExpression, context: Context):
      ResolvedValue {
    const condition = this.visitExpression(node.condition, context);
    if (isDynamicValue(condition)) {
      return condition;
    }

    if (condition) {
      return this.visitExpression(node.whenTrue, context);
    } else {
      return this.visitExpression(node.whenFalse, context);
    }
  }

  private visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression, context: Context):
      ResolvedValue {
    const operatorKind = node.operator;
    if (!UNARY_OPERATORS.has(operatorKind)) {
      throw new Error(`Unsupported prefix unary operator: ${ts.SyntaxKind[operatorKind]}`);
    }

    const op = UNARY_OPERATORS.get(operatorKind) !;
    const value = this.visitExpression(node.operand, context);
    return isDynamicValue(value) ? DYNAMIC_VALUE : op(value);
  }

  private visitBinaryExpression(node: ts.BinaryExpression, context: Context): ResolvedValue {
    const tokenKind = node.operatorToken.kind;
    if (!BINARY_OPERATORS.has(tokenKind)) {
      throw new Error(`Unsupported binary operator: ${ts.SyntaxKind[tokenKind]}`);
    }

    const opRecord = BINARY_OPERATORS.get(tokenKind) !;
    let lhs: ResolvedValue, rhs: ResolvedValue;
    if (opRecord.literal) {
      lhs = literal(this.visitExpression(node.left, context));
      rhs = literal(this.visitExpression(node.right, context));
    } else {
      lhs = this.visitExpression(node.left, context);
      rhs = this.visitExpression(node.right, context);
    }

    return isDynamicValue(lhs) || isDynamicValue(rhs) ? DYNAMIC_VALUE : opRecord.op(lhs, rhs);
  }

  private visitParenthesizedExpression(node: ts.ParenthesizedExpression, context: Context):
      ResolvedValue {
    return this.visitExpression(node.expression, context);
  }

  private stringNameFromPropertyName(node: ts.PropertyName, context: Context): string|undefined {
    if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
      return node.text;
    } else {  // ts.ComputedPropertyName
      const literal = this.visitExpression(node.expression, context);
      return typeof literal === 'string' ? literal : undefined;
    }
  }

  private getReference(node: ts.Declaration, context: Context): Reference {
    const id = identifierOfDeclaration(node);
    if (id === undefined) {
      throw new Error(`Don't know how to refer to ${ts.SyntaxKind[node.kind]}`);
    }
    if (context.absoluteModuleName !== null) {
      // TODO(alxhub): investigate whether this can get symbol names wrong in the event of
      // re-exports under different names.
      return new AbsoluteReference(node, id, context.absoluteModuleName, id.text);
    } else {
      return new ResolvedReference(node, id);
    }
  }
}

function isFunctionOrMethodReference(ref: Reference<ts.Node>):
    ref is Reference<ts.FunctionDeclaration|ts.MethodDeclaration|ts.FunctionExpression> {
  return ts.isFunctionDeclaration(ref.node) || ts.isMethodDeclaration(ref.node);
}

function literal(value: ResolvedValue): any {
  if (value === null || value === undefined || typeof value === 'string' ||
      typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (isDynamicValue(value)) {
    return DYNAMIC_VALUE;
  }
  throw new Error(`Value ${value} is not literal and cannot be used in this context.`);
}

function identifierOfDeclaration(decl: ts.Declaration): ts.Identifier|undefined {
  if (ts.isClassDeclaration(decl)) {
    return decl.name;
  } else if (ts.isFunctionDeclaration(decl)) {
    return decl.name;
  } else if (ts.isVariableDeclaration(decl) && ts.isIdentifier(decl.name)) {
    return decl.name;
  } else if (ts.isShorthandPropertyAssignment(decl)) {
    return decl.name;
  } else {
    return undefined;
  }
}

function isPossibleClassDeclaration(node: ts.Node): node is ts.Declaration {
  return ts.isClassDeclaration(node) || ts.isVariableDeclaration(node);
}
