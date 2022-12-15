/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {Decorator, ReflectionHost} from '../../ngtsc/reflection';
import {combineModifiers, createClassDeclaration, createGetAccessorDeclaration, createMethodDeclaration, createPropertyDeclaration, createSetAccessorDeclaration, getDecorators, getModifiers, ModifierLike, updateConstructorDeclaration, updateParameterDeclaration} from '../../ngtsc/ts_compatibility';

import {isAliasImportDeclaration, loadIsReferencedAliasDeclarationPatch} from './patch_alias_reference_resolution';

/**
 * Whether a given decorator should be treated as an Angular decorator.
 * Either it's used in @angular/core, or it's imported from there.
 *
 * 给定的装饰器是否应该被视为 Angular 装饰器。它可以在 @angular/core 中使用，或者是从那里导入的。
 *
 */
function isAngularDecorator(decorator: Decorator, isCore: boolean): boolean {
  return isCore || (decorator.import !== null && decorator.import.from === '@angular/core');
}

/*
 #####################################################################
  Code below has been extracted from the tsickle decorator downlevel transformer
  and a few local modifications have been applied:

    1. Tsickle by default processed all decorators that had the `@Annotation` JSDoc.
       We modified the transform to only be concerned with known Angular decorators.
    2. Tsickle by default added `@nocollapse` to all generated `ctorParameters` properties.
       We only do this when `annotateForClosureCompiler` is enabled.
    3. Tsickle does not handle union types for dependency injection. i.e. if a injected type
       is denoted with `@Optional`, the actual type could be set to `T | null`.
       See: https://github.com/angular/angular-cli/commit/826803d0736b807867caff9f8903e508970ad5e4.
    4. Tsickle relied on `emitDecoratorMetadata` to be set to `true`. This is due to a limitation
       in TypeScript transformers that never has been fixed. We were able to work around this
       limitation so that `emitDecoratorMetadata` doesn't need to be specified.
       See: `patchAliasReferenceResolution` for more details.

  Here is a link to the tsickle revision on which this transformer is based:
  https://github.com/angular/tsickle/blob/fae06becb1570f491806060d83f29f2d50c43cdd/src/decorator_downlevel_transformer.ts
 #####################################################################
*/

const DECORATOR_INVOCATION_JSDOC_TYPE = '!Array<{type: !Function, args: (undefined|!Array<?>)}>';

/**
 * Extracts the type of the decorator (the function or expression invoked), as well as all the
 * arguments passed to the decorator. Returns an AST with the form:
 *
 * 提取装饰器的类型（调用的函数或表达式），以及传递给装饰器的所有参数。返回具有以下形式的 AST：
 *
 * ```
 * // For @decorator(arg1, arg2)
 * { type: decorator, args: [arg1, arg2] }
 * ```
 *
 */
function extractMetadataFromSingleDecorator(
    decorator: ts.Decorator, diagnostics: ts.Diagnostic[]): ts.ObjectLiteralExpression {
  const metadataProperties: ts.ObjectLiteralElementLike[] = [];
  const expr = decorator.expression;
  switch (expr.kind) {
    case ts.SyntaxKind.Identifier:
      // The decorator was a plain @Foo.
      metadataProperties.push(ts.factory.createPropertyAssignment('type', expr));
      break;
    case ts.SyntaxKind.CallExpression:
      // The decorator was a call, like @Foo(bar).
      const call = expr as ts.CallExpression;
      metadataProperties.push(ts.factory.createPropertyAssignment('type', call.expression));
      if (call.arguments.length) {
        const args: ts.Expression[] = [];
        for (const arg of call.arguments) {
          args.push(arg);
        }
        const argsArrayLiteral =
            ts.factory.createArrayLiteralExpression(ts.factory.createNodeArray(args, true));
        metadataProperties.push(ts.factory.createPropertyAssignment('args', argsArrayLiteral));
      }
      break;
    default:
      diagnostics.push({
        file: decorator.getSourceFile(),
        start: decorator.getStart(),
        length: decorator.getEnd() - decorator.getStart(),
        messageText:
            `${ts.SyntaxKind[decorator.kind]} not implemented in gathering decorator metadata.`,
        category: ts.DiagnosticCategory.Error,
        code: 0,
      });
      break;
  }
  return ts.factory.createObjectLiteralExpression(metadataProperties);
}

/**
 * createCtorParametersClassProperty creates a static 'ctorParameters' property containing
 * downleveled decorator information.
 *
 * createCtorParametersClassProperty 会创建一个包含降级装饰器信息的静态 'ctorParameters' 属性。
 *
 * The property contains an arrow function that returns an array of object literals of the shape:
 *     static ctorParameters = () => \[{
 *       type: SomeClass|undefined,  // the type of the param that's decorated, if it's a value.
 *       decorators: \[{
 *         type: DecoratorFn,  // the type of the decorator that's invoked.
 *         args: [ARGS],       // the arguments passed to the decorator.
 *       }]
 *     }];
 *
 * 该属性包含一个箭头函数，该函数会返回一个具有以下形状的对象文字的数组： static ctorParameters = ()
 * => \[{ type: SomeClass|undefined, // 被装饰的参数的类型，如果是值。 decorator: \[{ type:
 * DecoratorFn, // 被调用的装饰器的类型。 args: [ARGS][ARGS] , // 传递给装饰器的参数。 }] }];
 *
 */
function createCtorParametersClassProperty(
    diagnostics: ts.Diagnostic[],
    entityNameToExpression: (n: ts.EntityName) => ts.Expression | undefined,
    ctorParameters: ParameterDecorationInfo[],
    isClosureCompilerEnabled: boolean): ts.PropertyDeclaration {
  const params: ts.Expression[] = [];

  for (const ctorParam of ctorParameters) {
    if (!ctorParam.type && ctorParam.decorators.length === 0) {
      params.push(ts.factory.createNull());
      continue;
    }

    const paramType = ctorParam.type ?
        typeReferenceToExpression(entityNameToExpression, ctorParam.type) :
        undefined;
    const members = [ts.factory.createPropertyAssignment(
        'type', paramType || ts.factory.createIdentifier('undefined'))];

    const decorators: ts.ObjectLiteralExpression[] = [];
    for (const deco of ctorParam.decorators) {
      decorators.push(extractMetadataFromSingleDecorator(deco, diagnostics));
    }
    if (decorators.length) {
      members.push(ts.factory.createPropertyAssignment(
          'decorators', ts.factory.createArrayLiteralExpression(decorators)));
    }
    params.push(ts.factory.createObjectLiteralExpression(members));
  }

  const initializer = ts.factory.createArrowFunction(
      undefined, undefined, [], undefined,
      ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      ts.factory.createArrayLiteralExpression(params, true));
  const ctorProp = createPropertyDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.StaticKeyword)], 'ctorParameters', undefined, undefined,
      initializer);
  if (isClosureCompilerEnabled) {
    ts.setSyntheticLeadingComments(ctorProp, [
      {
        kind: ts.SyntaxKind.MultiLineCommentTrivia,
        text: [
          `*`,
          ` * @type {function(): !Array<(null|{`,
          ` *   type: ?,`,
          ` *   decorators: (undefined|${DECORATOR_INVOCATION_JSDOC_TYPE}),`,
          ` * })>}`,
          ` * @nocollapse`,
          ` `,
        ].join('\n'),
        pos: -1,
        end: -1,
        hasTrailingNewLine: true,
      },
    ]);
  }
  return ctorProp;
}

/**
 * Returns an expression representing the (potentially) value part for the given node.
 *
 * 返回一个表示给定节点的（可能）值部分的表达式。
 *
 * This is a partial re-implementation of TypeScript's serializeTypeReferenceNode. This is a
 * workaround for <https://github.com/Microsoft/TypeScript/issues/17516> (serializeTypeReferenceNode
 * not being exposed). In practice this implementation is sufficient for Angular's use of type
 * metadata.
 *
 * 这是 TypeScript 的 serializeTypeReferenceNode
 * 的部分重新实现。这是<https://github.com/Microsoft/TypeScript/issues/17516>的解决方法（不会公开
 * serializeTypeReferenceNode）。在实践中，此实现对于 Angular 使用类型元数据就足够了。
 *
 */
function typeReferenceToExpression(
    entityNameToExpression: (n: ts.EntityName) => ts.Expression | undefined,
    node: ts.TypeNode): ts.Expression|undefined {
  let kind = node.kind;
  if (ts.isLiteralTypeNode(node)) {
    // Treat literal types like their base type (boolean, string, number).
    kind = node.literal.kind;
  }
  switch (kind) {
    case ts.SyntaxKind.FunctionType:
    case ts.SyntaxKind.ConstructorType:
      return ts.factory.createIdentifier('Function');
    case ts.SyntaxKind.ArrayType:
    case ts.SyntaxKind.TupleType:
      return ts.factory.createIdentifier('Array');
    case ts.SyntaxKind.TypePredicate:
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
    case ts.SyntaxKind.BooleanKeyword:
      return ts.factory.createIdentifier('Boolean');
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.StringKeyword:
      return ts.factory.createIdentifier('String');
    case ts.SyntaxKind.ObjectKeyword:
      return ts.factory.createIdentifier('Object');
    case ts.SyntaxKind.NumberKeyword:
    case ts.SyntaxKind.NumericLiteral:
      return ts.factory.createIdentifier('Number');
    case ts.SyntaxKind.TypeReference:
      const typeRef = node as ts.TypeReferenceNode;
      // Ignore any generic types, just return the base type.
      return entityNameToExpression(typeRef.typeName);
    case ts.SyntaxKind.UnionType:
      const childTypeNodes =
          (node as ts.UnionTypeNode)
              .types.filter(
                  t => !(ts.isLiteralTypeNode(t) && t.literal.kind === ts.SyntaxKind.NullKeyword));
      return childTypeNodes.length === 1 ?
          typeReferenceToExpression(entityNameToExpression, childTypeNodes[0]) :
          undefined;
    default:
      return undefined;
  }
}

/**
 * Checks whether a given symbol refers to a value that exists at runtime (as distinct from a type).
 *
 * 检查给定的符号是否引用了运行时存在的值（与类型不同）。
 *
 * Expands aliases, which is important for the case where
 *   import \* as x from 'some-module';
 * and x is now a value (the module object).
 *
 * 扩展别名，这对于 import \* as x from 'some-module' 的情况很重要；并且 x
 * 现在是一个值（模块对象）。
 *
 */
function symbolIsRuntimeValue(typeChecker: ts.TypeChecker, symbol: ts.Symbol): boolean {
  if (symbol.flags & ts.SymbolFlags.Alias) {
    symbol = typeChecker.getAliasedSymbol(symbol);
  }

  // Note that const enums are a special case, because
  // while they have a value, they don't exist at runtime.
  return (symbol.flags & ts.SymbolFlags.Value & ts.SymbolFlags.ConstEnumExcludes) !== 0;
}

/**
 * ParameterDecorationInfo describes the information for a single constructor parameter.
 *
 * ParameterDecorationInfo 描述单个构造函数参数的信息。
 *
 */
interface ParameterDecorationInfo {
  /**
   * The type declaration for the parameter. Only set if the type is a value (e.g. a class, not an
   * interface).
   *
   * 参数的类型声明。只有在类型是值（例如类，而不是接口）时才设置。
   *
   */
  type: ts.TypeNode|null;
  /**
   * The list of decorators found on the parameter, null if none.
   *
   * 在参数上找到的装饰器列表，如果没有，则为 null 。
   *
   */
  decorators: ts.Decorator[];
}

/**
 * Gets a transformer for downleveling Angular decorators.
 *
 * 获取用于下级 Angular 装饰器的转换器。
 *
 * @param typeChecker Reference to the program's type checker.
 *
 * 对程序的类型检查器的引用。
 *
 * @param host Reflection host that is used for determining decorators.
 *
 * 用于确定装饰器的反射宿主。
 *
 * @param diagnostics List which will be populated with diagnostics if any.
 *
 * 如果有，将使用诊断信息填充的列表。
 *
 * @param isCore Whether the current TypeScript program is for the `@angular/core` package.
 *
 * 当前的 TypeScript 程序是否用于 `@angular/core` 包。
 *
 * @param isClosureCompilerEnabled Whether closure annotations need to be added where needed.
 *
 * 是否需要在需要的地方添加闭包注解。
 *
 * @param skipClassDecorators Whether class decorators should be skipped from downleveling.
 *   This is useful for JIT mode where class decorators should be preserved as they could rely
 *   on immediate execution. e.g. downleveling `@Injectable` means that the injectable factory
 *   is not created, and injecting the token will not work. If this decorator would not be
 *   downleveled, the `Injectable` decorator will execute immediately on file load, and
 *   Angular will generate the corresponding injectable factory.
 *
 * 是否应该从降级中跳过类装饰器。这对于应该保留类装饰器的 JIT
 * 模式很有用，因为它们可以依赖于立即执行。例如，`@Injectable`
 * 意味着不会创建可注入工厂，并且注入令牌将不起作用。如果此装饰器不会被降级，则 `Injectable`
 * 装饰器将在文件加载时立即执行，并且 Angular 将生成相应的可注入工厂。
 *
 */
export function getDownlevelDecoratorsTransform(
    typeChecker: ts.TypeChecker, host: ReflectionHost, diagnostics: ts.Diagnostic[],
    isCore: boolean, isClosureCompilerEnabled: boolean,
    skipClassDecorators: boolean): ts.TransformerFactory<ts.SourceFile> {
  function addJSDocTypeAnnotation(node: ts.Node, jsdocType: string): void {
    if (!isClosureCompilerEnabled) {
      return;
    }

    ts.setSyntheticLeadingComments(node, [
      {
        kind: ts.SyntaxKind.MultiLineCommentTrivia,
        text: `* @type {${jsdocType}} `,
        pos: -1,
        end: -1,
        hasTrailingNewLine: true,
      },
    ]);
  }

  /**
   * Takes a list of decorator metadata object ASTs and produces an AST for a
   * static class property of an array of those metadata objects.
   *
   * 获取装饰器元数据对象 AST 的列表，并为这些元数据对象数组的静态类属性生成 AST。
   *
   */
  function createDecoratorClassProperty(decoratorList: ts.ObjectLiteralExpression[]) {
    const modifier = ts.factory.createToken(ts.SyntaxKind.StaticKeyword);
    const initializer = ts.factory.createArrayLiteralExpression(decoratorList, true);
    // NB: the .decorators property does not get a @nocollapse property. There
    // is no good reason why - it means .decorators is not runtime accessible
    // if you compile with collapse properties, whereas propDecorators is,
    // which doesn't follow any stringent logic. However this has been the
    // case previously, and adding it back in leads to substantial code size
    // increases as Closure fails to tree shake these props
    // without @nocollapse.
    const prop =
        createPropertyDeclaration([modifier], 'decorators', undefined, undefined, initializer);
    addJSDocTypeAnnotation(prop, DECORATOR_INVOCATION_JSDOC_TYPE);
    return prop;
  }

  /**
   * createPropDecoratorsClassProperty creates a static 'propDecorators'
   * property containing type information for every property that has a
   * decorator applied.
   *
   * createPropDecoratorsClassProperty 会创建一个静态 'propDecorators'
   * 属性，其中包含应用了装饰器的每个属性的类型信息。
   *
   * ```
   * static propDecorators: {[key: string]: {type: Function, args?:
   * ```
   *
   * any\[]}\[]} = { propA: \[{type: MyDecorator, args: [1, 2]}, ...],
   *       ...
   *     };
   *
   * any\[]}\[]} = { propA: \[{type: MyDecorator, args: [1, 2][1, 2] }, ...], ... };
   *
   */
  function createPropDecoratorsClassProperty(
      diagnostics: ts.Diagnostic[],
      properties: Map<string, ts.Decorator[]>): ts.PropertyDeclaration {
    //  `static propDecorators: {[key: string]: ` + {type: Function, args?:
    //  any[]}[] + `} = {\n`);
    const entries: ts.ObjectLiteralElementLike[] = [];
    for (const [name, decorators] of properties.entries()) {
      entries.push(ts.factory.createPropertyAssignment(
          name,
          ts.factory.createArrayLiteralExpression(
              decorators.map(deco => extractMetadataFromSingleDecorator(deco, diagnostics)))));
    }
    const initializer = ts.factory.createObjectLiteralExpression(entries, true);
    const prop = createPropertyDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.StaticKeyword)], 'propDecorators', undefined,
        undefined, initializer);
    addJSDocTypeAnnotation(prop, `!Object<string, ${DECORATOR_INVOCATION_JSDOC_TYPE}>`);
    return prop;
  }

  return (context: ts.TransformationContext) => {
    // Ensure that referenced type symbols are not elided by TypeScript. Imports for
    // such parameter type symbols previously could be type-only, but now might be also
    // used in the `ctorParameters` static property as a value. We want to make sure
    // that TypeScript does not elide imports for such type references. Read more
    // about this in the description for `loadIsReferencedAliasDeclarationPatch`.
    const referencedParameterTypes = loadIsReferencedAliasDeclarationPatch(context);

    /**
     * Converts an EntityName (from a type annotation) to an expression (accessing a value).
     *
     * 将 EntityName（从类型注解）转换为表达式（访问值）。
     *
     * For a given qualified name, this walks depth first to find the leftmost identifier,
     * and then converts the path into a property access that can be used as expression.
     *
     * 对于给定的限定名，这会首先深入了解以查找最左边的标识符，然后将路径转换为可以用作表达式的属性访问。
     *
     */
    function entityNameToExpression(name: ts.EntityName): ts.Expression|undefined {
      const symbol = typeChecker.getSymbolAtLocation(name);
      // Check if the entity name references a symbol that is an actual value. If it is not, it
      // cannot be referenced by an expression, so return undefined.
      if (!symbol || !symbolIsRuntimeValue(typeChecker, symbol) || !symbol.declarations ||
          symbol.declarations.length === 0) {
        return undefined;
      }
      // If we deal with a qualified name, build up a property access expression
      // that could be used in the JavaScript output.
      if (ts.isQualifiedName(name)) {
        const containerExpr = entityNameToExpression(name.left);
        if (containerExpr === undefined) {
          return undefined;
        }
        return ts.factory.createPropertyAccessExpression(containerExpr, name.right);
      }
      const decl = symbol.declarations[0];
      // If the given entity name has been resolved to an alias import declaration,
      // ensure that the alias declaration is not elided by TypeScript, and use its
      // name identifier to reference it at runtime.
      if (isAliasImportDeclaration(decl)) {
        referencedParameterTypes.add(decl);
        // If the entity name resolves to an alias import declaration, we reference the
        // entity based on the alias import name. This ensures that TypeScript properly
        // resolves the link to the import. Cloning the original entity name identifier
        // could lead to an incorrect resolution at local scope. e.g. Consider the following
        // snippet: `constructor(Dep: Dep) {}`. In such a case, the local `Dep` identifier
        // would resolve to the actual parameter name, and not to the desired import.
        // This happens because the entity name identifier symbol is internally considered
        // as type-only and therefore TypeScript tries to resolve it as value manually.
        // We can help TypeScript and avoid this non-reliable resolution by using an identifier
        // that is not type-only and is directly linked to the import alias declaration.
        if (decl.name !== undefined) {
          return ts.setOriginalNode(ts.factory.createIdentifier(decl.name.text), decl.name);
        }
      }
      // Clone the original entity name identifier so that it can be used to reference
      // its value at runtime. This is used when the identifier is resolving to a file
      // local declaration (otherwise it would resolve to an alias import declaration).
      return ts.setOriginalNode(ts.factory.createIdentifier(name.text), name);
    }

    /**
     * Transforms a class element. Returns a three tuple of name, transformed element, and
     * decorators found. Returns an undefined name if there are no decorators to lower on the
     * element, or the element has an exotic name.
     *
     * 转换类元素。返回由名称、转换后的元素和找到的装饰器组成的三元组。如果元素上没有要降低的装饰器，或者元素具有外来名称，则返回未定义的名称。
     *
     */
    function transformClassElement(element: ts.ClassElement):
        [string|undefined, ts.ClassElement, ts.Decorator[]] {
      element = ts.visitEachChild(element, decoratorDownlevelVisitor, context);
      const decoratorsToKeep: ts.Decorator[] = [];
      const toLower: ts.Decorator[] = [];
      const decorators = host.getDecoratorsOfDeclaration(element) || [];
      for (const decorator of decorators) {
        // We only deal with concrete nodes in TypeScript sources, so we don't
        // need to handle synthetically created decorators.
        const decoratorNode = decorator.node! as ts.Decorator;
        if (!isAngularDecorator(decorator, isCore)) {
          decoratorsToKeep.push(decoratorNode);
          continue;
        }
        toLower.push(decoratorNode);
      }
      if (!toLower.length) return [undefined, element, []];

      if (!element.name || !ts.isIdentifier(element.name)) {
        // Method has a weird name, e.g.
        //   [Symbol.foo]() {...}
        diagnostics.push({
          file: element.getSourceFile(),
          start: element.getStart(),
          length: element.getEnd() - element.getStart(),
          messageText: `Cannot process decorators for class element with non-analyzable name.`,
          category: ts.DiagnosticCategory.Error,
          code: 0,
        });
        return [undefined, element, []];
      }

      const modifiers = decoratorsToKeep.length ?
          ts.setTextRange(
              ts.factory.createNodeArray(combineModifiers(decoratorsToKeep, getModifiers(element))),
              element.modifiers) :
          getModifiers(element);

      return [element.name.text, cloneClassElementWithModifiers(element, modifiers), toLower];
    }

    /**
     * Transforms a constructor. Returns the transformed constructor and the list of parameter
     * information collected, consisting of decorators and optional type.
     *
     * 转换构造函数。返回转换后的构造函数和收集的参数信息列表，由装饰器和可选类型组成。
     *
     */
    function transformConstructor(ctor: ts.ConstructorDeclaration):
        [ts.ConstructorDeclaration, ParameterDecorationInfo[]] {
      ctor = ts.visitEachChild(ctor, decoratorDownlevelVisitor, context);

      const newParameters: ts.ParameterDeclaration[] = [];
      const oldParameters = ctor.parameters;
      const parametersInfo: ParameterDecorationInfo[] = [];

      for (const param of oldParameters) {
        const decoratorsToKeep: ts.Decorator[] = [];
        const paramInfo: ParameterDecorationInfo = {decorators: [], type: null};
        const decorators = host.getDecoratorsOfDeclaration(param) || [];

        for (const decorator of decorators) {
          // We only deal with concrete nodes in TypeScript sources, so we don't
          // need to handle synthetically created decorators.
          const decoratorNode = decorator.node! as ts.Decorator;
          if (!isAngularDecorator(decorator, isCore)) {
            decoratorsToKeep.push(decoratorNode);
            continue;
          }
          paramInfo!.decorators.push(decoratorNode);
        }
        if (param.type) {
          // param has a type provided, e.g. "foo: Bar".
          // The type will be emitted as a value expression in entityNameToExpression, which takes
          // care not to emit anything for types that cannot be expressed as a value (e.g.
          // interfaces).
          paramInfo!.type = param.type;
        }
        parametersInfo.push(paramInfo);
        const newParam = updateParameterDeclaration(
            param,
            combineModifiers(
                // Must pass 'undefined' to avoid emitting decorator metadata.
                decoratorsToKeep.length ? decoratorsToKeep : undefined, getModifiers(param)),
            param.dotDotDotToken, param.name, param.questionToken, param.type, param.initializer);
        newParameters.push(newParam);
      }
      const updated =
          updateConstructorDeclaration(ctor, getModifiers(ctor), newParameters, ctor.body);
      return [updated, parametersInfo];
    }

    /**
     * Transforms a single class declaration:
     *
     * 转换单个类声明：
     *
     * - dispatches to strip decorators on members
     *
     *   调度以剥离成员上的装饰器
     *
     * - converts decorators on the class to annotations
     *
     *   将类上的装饰器转换为注解
     *
     * - creates a ctorParameters property
     *
     *   创建一个 ctorParameters 属性
     *
     * - creates a propDecorators property
     *
     *   创建一个 propDecorators 属性
     *
     */
    function transformClassDeclaration(classDecl: ts.ClassDeclaration): ts.ClassDeclaration {
      const newMembers: ts.ClassElement[] = [];
      const decoratedProperties = new Map<string, ts.Decorator[]>();
      let classParameters: ParameterDecorationInfo[]|null = null;

      for (const member of classDecl.members) {
        switch (member.kind) {
          case ts.SyntaxKind.PropertyDeclaration:
          case ts.SyntaxKind.GetAccessor:
          case ts.SyntaxKind.SetAccessor:
          case ts.SyntaxKind.MethodDeclaration: {
            const [name, newMember, decorators] = transformClassElement(member);
            newMembers.push(newMember);
            if (name) decoratedProperties.set(name, decorators);
            continue;
          }
          case ts.SyntaxKind.Constructor: {
            const ctor = member as ts.ConstructorDeclaration;
            if (!ctor.body) break;
            const [newMember, parametersInfo] =
                transformConstructor(member as ts.ConstructorDeclaration);
            classParameters = parametersInfo;
            newMembers.push(newMember);
            continue;
          }
          default:
            break;
        }
        newMembers.push(ts.visitEachChild(member, decoratorDownlevelVisitor, context));
      }

      // The `ReflectionHost.getDecoratorsOfDeclaration()` method will not return certain kinds of
      // decorators that will never be Angular decorators. So we cannot rely on it to capture all
      // the decorators that should be kept. Instead we start off with a set of the raw decorators
      // on the class, and only remove the ones that have been identified for downleveling.
      const decoratorsToKeep = new Set<ts.Decorator>(getDecorators(classDecl));
      const possibleAngularDecorators = host.getDecoratorsOfDeclaration(classDecl) || [];

      let hasAngularDecorator = false;
      const decoratorsToLower = [];
      for (const decorator of possibleAngularDecorators) {
        // We only deal with concrete nodes in TypeScript sources, so we don't
        // need to handle synthetically created decorators.
        const decoratorNode = decorator.node! as ts.Decorator;
        const isNgDecorator = isAngularDecorator(decorator, isCore);

        // Keep track if we come across an Angular class decorator. This is used
        // to determine whether constructor parameters should be captured or not.
        if (isNgDecorator) {
          hasAngularDecorator = true;
        }

        if (isNgDecorator && !skipClassDecorators) {
          decoratorsToLower.push(extractMetadataFromSingleDecorator(decoratorNode, diagnostics));
          decoratorsToKeep.delete(decoratorNode);
        }
      }

      if (decoratorsToLower.length) {
        newMembers.push(createDecoratorClassProperty(decoratorsToLower));
      }
      if (classParameters) {
        if (hasAngularDecorator || classParameters.some(p => !!p.decorators.length)) {
          // Capture constructor parameters if the class has Angular decorator applied,
          // or if any of the parameters has decorators applied directly.
          newMembers.push(createCtorParametersClassProperty(
              diagnostics, entityNameToExpression, classParameters, isClosureCompilerEnabled));
        }
      }
      if (decoratedProperties.size) {
        newMembers.push(createPropDecoratorsClassProperty(diagnostics, decoratedProperties));
      }

      const members = ts.setTextRange(
          ts.factory.createNodeArray(newMembers, classDecl.members.hasTrailingComma),
          classDecl.members);

      return createClassDeclaration(
          combineModifiers(
              decoratorsToKeep.size ? Array.from(decoratorsToKeep) : undefined,
              getModifiers(classDecl)),
          classDecl.name, classDecl.typeParameters, classDecl.heritageClauses, members);
    }

    /**
     * Transformer visitor that looks for Angular decorators and replaces them with
     * downleveled static properties. Also collects constructor type metadata for
     * class declaration that are decorated with an Angular decorator.
     *
     * 寻找 Angular 装饰器并用降级的静态属性替换它们的 Transformer 访问器。还收集使用 Angular
     * 装饰器装饰的类声明的构造函数类型元数据。
     *
     */
    function decoratorDownlevelVisitor(node: ts.Node): ts.Node {
      if (ts.isClassDeclaration(node)) {
        return transformClassDeclaration(node);
      }
      return ts.visitEachChild(node, decoratorDownlevelVisitor, context);
    }

    return (sf: ts.SourceFile) => {
      // Downlevel decorators and constructor parameter types. We will keep track of all
      // referenced constructor parameter types so that we can instruct TypeScript to
      // not elide their imports if they previously were only type-only.
      return ts.visitEachChild(sf, decoratorDownlevelVisitor, context);
    };
  };
}

function cloneClassElementWithModifiers(
    node: ts.ClassElement, modifiers: readonly ModifierLike[]|undefined): ts.ClassElement {
  let clone: ts.ClassElement;

  if (ts.isMethodDeclaration(node)) {
    clone = createMethodDeclaration(
        modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters,
        node.parameters, node.type, node.body);
  } else if (ts.isPropertyDeclaration(node)) {
    clone = createPropertyDeclaration(
        modifiers, node.name, node.questionToken, node.type, node.initializer);
  } else if (ts.isGetAccessor(node)) {
    clone =
        createGetAccessorDeclaration(modifiers, node.name, node.parameters, node.type, node.body);
  } else if (ts.isSetAccessor(node)) {
    clone = createSetAccessorDeclaration(modifiers, node.name, node.parameters, node.body);
  } else {
    throw new Error(`Unsupported decorated member with kind ${ts.SyntaxKind[node.kind]}`);
  }

  return ts.setOriginalNode(clone, node);
}
