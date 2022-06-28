/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ClassDeclaration, ClassMember, ClassMemberKind, Declaration, DeclarationKind, Decorator, FunctionDefinition, isNamedFunctionDeclaration, KnownDeclaration, Parameter, reflectObjectLiteral} from '../../../src/ngtsc/reflection';
import {getTsHelperFnFromDeclaration, getTsHelperFnFromIdentifier, hasNameIdentifier} from '../utils';

import {Esm2015ReflectionHost, getOuterNodeFromInnerDeclaration, getPropertyValueFromSymbol, isAssignmentStatement, ParamInfo} from './esm2015_host';
import {NgccClassSymbol} from './ngcc_host';


/**
 * ESM5 packages contain ECMAScript IIFE functions that act like classes. For example:
 *
 * ESM5 包包含类似于类的 ECMAScript IIFE 函数。例如：
 *
 * ```
 * var CommonModule = (function () {
 *  function CommonModule() {
 *  }
 *  CommonModule.decorators = [ ... ];
 *  return CommonModule;
 * ```
 *
 * * "Classes" are decorated if they have a static property called `decorators`.
 *
 *   如果“类”有一个名为 `decorators` 的静态属性，它们就会被装饰。
 *
 * * Members are decorated if there is a matching key on a static property
 *   called `propDecorators`.
 *
 *   如果名为 `propDecorators` 的静态属性上有匹配的键，则成员被装饰。
 *
 * * Constructor parameters decorators are found on an object returned from
 *   a static method called `ctorParameters`.
 *
 *   构造函数参数装饰器可以在从名为 `ctorParameters` 的静态方法返回的对象上找到。
 *
 */
export class Esm5ReflectionHost extends Esm2015ReflectionHost {
  override getBaseClassExpression(clazz: ClassDeclaration): ts.Expression|null {
    const superBaseClassExpression = super.getBaseClassExpression(clazz);
    if (superBaseClassExpression !== null) {
      return superBaseClassExpression;
    }

    const iife = getIifeFn(this.getClassSymbol(clazz));
    if (iife === null) return null;

    if (iife.parameters.length !== 1 || !isSuperIdentifier(iife.parameters[0].name)) {
      return null;
    }

    if (!ts.isCallExpression(iife.parent)) {
      return null;
    }

    return iife.parent.arguments[0];
  }

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
   * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE.
   * If we are looking for the declaration of the identifier of the inner function expression, we
   * will get hold of the outer "class" variable declaration and return its identifier instead. See
   * `getClassDeclarationFromInnerFunctionDeclaration()` for more info.
   *
   * 在 ES5 中，类的实现是隐藏在 IIFE
   * 中的函数表达式。如果我们正在查找内部函数表达式的标识符的声明，我们将获取外部的“class”变量声明并返回其标识符。有关更多信息，请参阅
   * `getClassDeclarationFromInnerFunctionDeclaration()` 。
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
  override getDeclarationOfIdentifier(id: ts.Identifier): Declaration|null {
    const declaration = super.getDeclarationOfIdentifier(id);

    if (declaration === null) {
      const nonEmittedNorImportedTsHelperDeclaration = getTsHelperFnFromIdentifier(id);
      if (nonEmittedNorImportedTsHelperDeclaration !== null) {
        // No declaration could be found for this identifier and its name matches a known TS helper
        // function. This can happen if a package is compiled with `noEmitHelpers: true` and
        // `importHelpers: false` (the default). This is, for example, the case with
        // `@nativescript/angular@9.0.0-next-2019-11-12-155500-01`.
        return {
          kind: DeclarationKind.Inline,
          node: id,
          known: nonEmittedNorImportedTsHelperDeclaration,
          viaModule: null,
        };
      }
    }

    if (declaration === null || declaration.node === null || declaration.known !== null) {
      return declaration;
    }

    if (!ts.isVariableDeclaration(declaration.node) || declaration.node.initializer !== undefined ||
        // VariableDeclaration => VariableDeclarationList => VariableStatement => IIFE Block
        !ts.isBlock(declaration.node.parent.parent.parent)) {
      return declaration;
    }

    // We might have an alias to another variable declaration.
    // Search the containing iife body for it.
    const block = declaration.node.parent.parent.parent;
    const aliasSymbol = this.checker.getSymbolAtLocation(declaration.node.name);
    for (let i = 0; i < block.statements.length; i++) {
      const statement = block.statements[i];
      // Looking for statement that looks like: `AliasedVariable = OriginalVariable;`
      if (isAssignmentStatement(statement) && ts.isIdentifier(statement.expression.left) &&
          ts.isIdentifier(statement.expression.right) &&
          this.checker.getSymbolAtLocation(statement.expression.left) === aliasSymbol) {
        return this.getDeclarationOfIdentifier(statement.expression.right);
      }
    }

    return declaration;
  }

  /**
   * Parse a function declaration to find the relevant metadata about it.
   *
   * 解析函数声明以查找关于它的相关元数据。
   *
   * In ESM5 we need to do special work with optional arguments to the function, since they get
   * their own initializer statement that needs to be parsed and then not included in the "body"
   * statements of the function.
   *
   * 在 ESM5
   * 中，我们需要对函数的可选参数做特殊的工作，因为它们都有自己的初始化器语句，需要解析，然后不包含在函数的“body”语句中。
   *
   * @param node the function declaration to parse.
   *
   * 要解析的函数声明。
   *
   * @returns
   *
   * an object containing the node, statements and parameters of the function.
   *
   * 包含函数的节点、语句和参数的对象。
   *
   */
  override getDefinitionOfFunction(node: ts.Node): FunctionDefinition|null {
    const definition = super.getDefinitionOfFunction(node);
    if (definition === null) {
      return null;
    }

    // Filter out and capture parameter initializers
    if (definition.body !== null) {
      let lookingForInitializers = true;
      const statements = definition.body.filter(s => {
        lookingForInitializers =
            lookingForInitializers && captureParamInitializer(s, definition.parameters);
        // If we are no longer looking for parameter initializers then we include this statement
        return !lookingForInitializers;
      });
      definition.body = statements;
    }

    return definition;
  }

  /**
   * Check whether a `Declaration` corresponds with a known declaration, such as a TypeScript helper
   * function, and set its `known` property to the appropriate `KnownDeclaration`.
   *
   * 检查 `Declaration` 是否与已知声明对应，例如 TypeScript 帮助器函数，并将其 `known`
   * 属性设置为适当的 `KnownDeclaration` 。
   *
   * @param decl The `Declaration` to check.
   *
   * 要检查的 `Declaration` 。
   *
   * @return The passed in `Declaration` (potentially enhanced with a `KnownDeclaration`).
   *
   * 传入的 `Declaration`（可能使用 `KnownDeclaration` 增强）。
   *
   */
  override detectKnownDeclaration<T extends Declaration>(decl: T): T {
    decl = super.detectKnownDeclaration(decl);

    // Also check for TS helpers
    if (decl.known === null && decl.node !== null) {
      decl.known = getTsHelperFnFromDeclaration(decl.node);
    }

    return decl;
  }


  ///////////// Protected Helpers /////////////

  /**
   * In ES5, the implementation of a class is a function expression that is hidden inside an IIFE,
   * whose value is assigned to a variable (which represents the class to the rest of the program).
   * So we might need to dig around to get hold of the "class" declaration.
   *
   * 在 ES5 中，类的实现是隐藏在 IIFE
   * 中的函数表达式，其值被分配给一个变量（对程序的其余部分表示类）。所以我们可能需要四处挖掘以获取
   * “class” 声明。
   *
   * This method extracts a `NgccClassSymbol` if `declaration` is the function declaration inside
   * the IIFE. Otherwise, undefined is returned.
   *
   * 如果 `declaration` 是 IIFE 中的函数声明，则此方法会提取 `NgccClassSymbol` 。否则，返回
   * undefined 。
   *
   * @param declaration the declaration whose symbol we are finding.
   *
   * 我们要查找其符号的声明。
   *
   * @returns
   *
   * the symbol for the node or `undefined` if it is not a "class" or has no symbol.
   *
   * 节点的符号，如果它不是“类”或没有符号，则为 `undefined` 。
   *
   */
  protected override getClassSymbolFromInnerDeclaration(declaration: ts.Node): NgccClassSymbol
      |undefined {
    const classSymbol = super.getClassSymbolFromInnerDeclaration(declaration);
    if (classSymbol !== undefined) {
      return classSymbol;
    }

    if (!isNamedFunctionDeclaration(declaration)) {
      return undefined;
    }

    const outerNode = getOuterNodeFromInnerDeclaration(declaration);
    if (outerNode === null || !hasNameIdentifier(outerNode)) {
      return undefined;
    }

    return this.createClassSymbol(outerNode.name, declaration);
  }

  /**
   * Find the declarations of the constructor parameters of a class identified by its symbol.
   *
   * 查找由其符号标识的类的构造函数参数的声明。
   *
   * In ESM5, there is no "class" so the constructor that we want is actually the inner function
   * declaration inside the IIFE, whose return value is assigned to the outer variable declaration
   * (that represents the class to the rest of the program).
   *
   * 在 ESM5 中，没有“类”，因此我们想要的构造函数实际上是 IIFE
   * 中的内部函数声明，其返回值被分配给外部变量声明（代表程序其余部分的类）。
   *
   * @param classSymbol the symbol of the class (i.e. the outer variable declaration) whose
   * parameters we want to find.
   *
   * 我们要查找其参数的类的符号（即外部变量声明）。
   *
   * @returns
   *
   * an array of `ts.ParameterDeclaration` objects representing each of the parameters in
   * the class's constructor or `null` if there is no constructor.
   *
   * 表示类构造函数中每个参数的 `ts.ParameterDeclaration` 对象数组，如果没有构造函数，则为 `null` 。
   *
   */
  protected override getConstructorParameterDeclarations(classSymbol: NgccClassSymbol):
      ts.ParameterDeclaration[]|null {
    const constructor = classSymbol.implementation.valueDeclaration;
    if (!ts.isFunctionDeclaration(constructor)) return null;

    if (constructor.parameters.length > 0) {
      return Array.from(constructor.parameters);
    }

    if (this.isSynthesizedConstructor(constructor)) {
      return null;
    }

    return [];
  }

  /**
   * Get the parameter type and decorators for the constructor of a class,
   * where the information is stored on a static method of the class.
   *
   * 获取类的构造函数的参数类型和装饰器，其中信息存储在类的静态方法中。
   *
   * In this case the decorators are stored in the body of a method
   * (`ctorParatemers`) attached to the constructor function.
   *
   * 在这种情况下，装饰器存储在附加到构造函数的方法 ( `ctorParatemers` ) 的主体中。
   *
   * Note that unlike ESM2015 this is a function expression rather than an arrow
   * function:
   *
   * 请注意，与 ESM2015 不同，这是一个函数表达式，而不是箭头函数：
   *
   * ```
   * SomeDirective.ctorParameters = function() { return [
   *   { type: ViewContainerRef, },
   *   { type: TemplateRef, },
   *   { type: IterableDiffers, },
   *   { type: undefined, decorators: [{ type: Inject, args: [INJECTED_TOKEN,] },] },
   * ]; };
   * ```
   *
   * @param paramDecoratorsProperty the property that holds the parameter info we want to get.
   *
   * 包含我们要获取的参数信息的属性。
   *
   * @returns
   *
   * an array of objects containing the type and decorators for each parameter.
   *
   * 包含每个参数的类型和装饰器的对象数组。
   *
   */
  protected override getParamInfoFromStaticProperty(paramDecoratorsProperty: ts.Symbol):
      ParamInfo[]|null {
    const paramDecorators = getPropertyValueFromSymbol(paramDecoratorsProperty);
    // The decorators array may be wrapped in a function. If so unwrap it.
    const returnStatement = getReturnStatement(paramDecorators);
    const expression = returnStatement ? returnStatement.expression : paramDecorators;
    if (expression && ts.isArrayLiteralExpression(expression)) {
      const elements = expression.elements;
      return elements.map(reflectArrayElement).map(paramInfo => {
        const typeExpression = paramInfo && paramInfo.has('type') ? paramInfo.get('type')! : null;
        const decoratorInfo =
            paramInfo && paramInfo.has('decorators') ? paramInfo.get('decorators')! : null;
        const decorators = decoratorInfo && this.reflectDecorators(decoratorInfo);
        return {typeExpression, decorators};
      });
    } else if (paramDecorators !== undefined) {
      this.logger.warn(
          'Invalid constructor parameter decorator in ' + paramDecorators.getSourceFile().fileName +
              ':\n',
          paramDecorators.getText());
    }
    return null;
  }

  /**
   * Reflect over a symbol and extract the member information, combining it with the
   * provided decorator information, and whether it is a static member.
   *
   * 反射一个符号并提取成员信息，将其与提供的装饰器信息相结合，以及它是否是静态成员。
   *
   * If a class member uses accessors (e.g getters and/or setters) then it gets downleveled
   * in ES5 to a single `Object.defineProperty()` call. In that case we must parse this
   * call to extract the one or two ClassMember objects that represent the accessors.
   *
   * 如果类成员使用了访问器（例如 getter 和/或 setter），那么它在 ES5 中将被降级为单个
   * `Object.defineProperty()` 调用。在这种情况下，我们必须解析此调用以提取表示访问器的一或两个
   * ClassMember 对象。
   *
   * @param symbol the symbol for the member to reflect over.
   *
   * 要反映的成员的符号。
   *
   * @param decorators an array of decorators associated with the member.
   *
   * 与成员关联的装饰器数组。
   *
   * @param isStatic true if this member is static, false if it is an instance property.
   *
   * 如果此成员是静态成员，则为 true ；如果是实例属性，则为 false 。
   *
   * @returns
   *
   * the reflected member information, or null if the symbol is not a member.
   *
   * 反射的成员信息，如果此符号不是成员，则为 null 。
   *
   */
  protected override reflectMembers(
      symbol: ts.Symbol, decorators?: Decorator[], isStatic?: boolean): ClassMember[]|null {
    const node = symbol.valueDeclaration || symbol.declarations && symbol.declarations[0];
    const propertyDefinition = node && getPropertyDefinition(node);
    if (propertyDefinition) {
      const members: ClassMember[] = [];
      if (propertyDefinition.setter) {
        members.push({
          node: node!,
          implementation: propertyDefinition.setter,
          kind: ClassMemberKind.Setter,
          type: null,
          name: symbol.name,
          nameNode: null,
          value: null,
          isStatic: isStatic || false,
          decorators: decorators || [],
        });

        // Prevent attaching the decorators to a potential getter. In ES5, we can't tell where the
        // decorators were originally attached to, however we only want to attach them to a single
        // `ClassMember` as otherwise ngtsc would handle the same decorators twice.
        decorators = undefined;
      }
      if (propertyDefinition.getter) {
        members.push({
          node: node!,
          implementation: propertyDefinition.getter,
          kind: ClassMemberKind.Getter,
          type: null,
          name: symbol.name,
          nameNode: null,
          value: null,
          isStatic: isStatic || false,
          decorators: decorators || [],
        });
      }
      return members;
    }

    const members = super.reflectMembers(symbol, decorators, isStatic);
    members && members.forEach(member => {
      if (member && member.kind === ClassMemberKind.Method && member.isStatic && member.node &&
          ts.isPropertyAccessExpression(member.node) && member.node.parent &&
          ts.isBinaryExpression(member.node.parent) &&
          ts.isFunctionExpression(member.node.parent.right)) {
        // Recompute the implementation for this member:
        // ES5 static methods are variable declarations so the declaration is actually the
        // initializer of the variable assignment
        member.implementation = member.node.parent.right;
      }
    });
    return members;
  }

  /**
   * Find statements related to the given class that may contain calls to a helper.
   *
   * 查找与给定类相关的、可能包含对帮助器调用的语句。
   *
   * In ESM5 code the helper calls are hidden inside the class's IIFE.
   *
   * 在 ESM5 代码中，帮助器调用隐藏在类的 IIFE 中。
   *
   * @param classSymbol the class whose helper calls we are interested in. We expect this symbol
   * to reference the inner identifier inside the IIFE.
   *
   * 我们感兴趣的帮助器调用的类。我们希望此符号引用 IIFE 中的内部标识符。
   *
   * @returns
   *
   * an array of statements that may contain helper calls.
   *
   * 可能包含帮助器调用的语句数组。
   *
   */
  protected override getStatementsForClass(classSymbol: NgccClassSymbol): ts.Statement[] {
    const classDeclarationParent = classSymbol.implementation.valueDeclaration.parent;
    return ts.isBlock(classDeclarationParent) ? Array.from(classDeclarationParent.statements) : [];
  }

  ///////////// Host Private Helpers /////////////

  /**
   * A constructor function may have been "synthesized" by TypeScript during JavaScript emit,
   * in the case no user-defined constructor exists and e.g. property initializers are used.
   * Those initializers need to be emitted into a constructor in JavaScript, so the TypeScript
   * compiler generates a synthetic constructor.
   *
   * 在不存在用户定义的构造函数并且使用了例如属性初始化器的情况下，TypeScript 可能在 JavaScript
   * 发出期间“合成”了构造函数。这些初始化器需要发出到 JavaScript 中的构造函数中，因此 TypeScript
   * 编译器会生成一个合成构造函数。
   *
   * We need to identify such constructors as ngcc needs to be able to tell if a class did
   * originally have a constructor in the TypeScript source. For ES5, we can not tell an
   * empty constructor apart from a synthesized constructor, but fortunately that does not
   * matter for the code generated by ngtsc.
   *
   * 我们需要识别这样的构造函数，因为 ngcc 需要能够判断一个类最初在 TypeScript
   * 源代码中是否有构造函数。对于 ES5，我们无法区分合成构造函数和空构造函数，但幸运的是，这对于
   * ngtsc 生成的代码无关紧要。
   *
   * When a class has a superclass however, a synthesized constructor must not be considered
   * as a user-defined constructor as that prevents a base factory call from being created by
   * ngtsc, resulting in a factory function that does not inject the dependencies of the
   * superclass. Hence, we identify a default synthesized super call in the constructor body,
   * according to the structure that TypeScript's ES2015 to ES5 transformer generates in
   * <https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1082-L1098>
   *
   * 但是，当一个类有超类时，合成构造函数不能被视为用户定义的构造函数，因为这会阻止 ngtsc
   * 创建基础工厂调用，从而导致工厂函数不会注入超类的依赖项。因此，我们根据 TypeScript 的 ES2015 到
   * ES5
   * 转换器在[https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/](https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1082-L1098)中生成的结构，在构造函数主体中标识一个默认的合成超级调用[es2015.ts#L1082-L1098](https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1082-L1098)
   *
   * Additionally, we handle synthetic delegate constructors that are emitted when TypeScript
   * downlevel's ES2015 synthetically generated to ES5. These vary slightly from the default
   * structure mentioned above because the ES2015 output uses a spread operator, for delegating
   * to the parent constructor, that is preserved through a TypeScript helper in ES5. e.g.
   *
   * 此外，我们还会处理当 TypeScript 下级的 ES2015 综合生成为 ES5
   * 时发出的合成委托构造函数。这些与上面提到的默认结构略有不同，因为 ES2015
   * 输出使用扩展运算符来委托给父构造函数，该结构通过 ES5 中的 TypeScript 帮助器保留。例如
   *
   * ```
   * return _super.apply(this, tslib.__spread(arguments)) || this;
   * ```
   *
   * or, since TypeScript 4.2 it would be
   *
   * 或者，从 TypeScript 4.2 开始，它将是
   *
   * ```
   * return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
   * ```
   *
   * Such constructs can be still considered as synthetic delegate constructors as they are
   * the product of a common TypeScript to ES5 synthetic constructor, just being downleveled
   * to ES5 using `tsc`. See: <https://github.com/angular/angular/issues/38453>.
   *
   * 此类构造仍然可以被认为是合成委托构造函数，因为它们是通用 TypeScript 到 ES5
   * 合成构造函数的产物，只是使用 `tsc` 降级到 ES5。请参阅：
   * <https://github.com/angular/angular/issues/38453> 。
   *
   * @param constructor a constructor function to test
   *
   * 要测试的构造函数
   *
   * @returns
   *
   * true if the constructor appears to have been synthesized
   *
   * 如果构造函数似乎已合成，则为 true
   *
   */
  private isSynthesizedConstructor(constructor: ts.FunctionDeclaration): boolean {
    if (!constructor.body) return false;

    const firstStatement = constructor.body.statements[0];
    if (!firstStatement) return false;

    return this.isSynthesizedSuperThisAssignment(firstStatement) ||
        this.isSynthesizedSuperReturnStatement(firstStatement);
  }

  /**
   * Identifies synthesized super calls which pass-through function arguments directly and are
   * being assigned to a common `_this` variable. The following patterns we intend to match:
   *
   * 标识直接传递函数参数并被分配给通用 `_this` 变量的合成超级调用。我们打算匹配的以下模式：
   *
   * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
   *
   *    TypeScript 在直接发出 ES5 时发出的委托调用。
   *
   *    ```
   *    var _this = _super !== null && _super.apply(this, arguments) || this;
   *    ```
   *
   * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
   *
   *    将 TypeScript 的 ES2015 降级到 ES5 时发出的委托调用。
   *
   *    ```
   *    var _this = _super.apply(this, tslib.__spread(arguments)) || this;
   *    ```
   *
   *    or using the syntax emitted since TypeScript 4.2:
   *
   *    或使用自 TypeScript 4.2 以来发出的语法：
   *
   *    ```
   *    return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
   *    ```
   *
   * @param statement a statement that may be a synthesized super call
   *
   * 可能是合成超级调用的语句
   *
   * @returns
   *
   * true if the statement looks like a synthesized super call
   *
   * 如果语句看起来像合成的 super 调用，则为 true
   *
   */
  private isSynthesizedSuperThisAssignment(statement: ts.Statement): boolean {
    if (!ts.isVariableStatement(statement)) return false;

    const variableDeclarations = statement.declarationList.declarations;
    if (variableDeclarations.length !== 1) return false;

    const variableDeclaration = variableDeclarations[0];
    if (!ts.isIdentifier(variableDeclaration.name) ||
        !variableDeclaration.name.text.startsWith('_this'))
      return false;

    const initializer = variableDeclaration.initializer;
    if (!initializer) return false;

    return this.isSynthesizedDefaultSuperCall(initializer);
  }
  /**
   * Identifies synthesized super calls which pass-through function arguments directly and
   * are being returned. The following patterns correspond to synthetic super return calls:
   *
   * 标识直接传递函数参数并正在返回的合成超级调用。以下模式对应于合成的超级返回调用：
   *
   * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
   *
   *    TypeScript 在直接发出 ES5 时发出的委托调用。
   *
   *    ```
   *    return _super !== null && _super.apply(this, arguments) || this;
   *    ```
   *
   * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
   *
   *    将 TypeScript 的 ES2015 降级到 ES5 时发出的委托调用。
   *
   *    ```
   *    return _super.apply(this, tslib.__spread(arguments)) || this;
   *    ```
   *
   *    or using the syntax emitted since TypeScript 4.2:
   *
   *    或使用自 TypeScript 4.2 以来发出的语法：
   *
   *    ```
   *    return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
   *    ```
   *
   * @param statement a statement that may be a synthesized super call
   *
   * 可能是合成超级调用的语句
   *
   * @returns
   *
   * true if the statement looks like a synthesized super call
   *
   * 如果语句看起来像合成的 super 调用，则为 true
   *
   */
  private isSynthesizedSuperReturnStatement(statement: ts.Statement): boolean {
    if (!ts.isReturnStatement(statement)) return false;

    const expression = statement.expression;
    if (!expression) return false;

    return this.isSynthesizedDefaultSuperCall(expression);
  }

  /**
   * Identifies synthesized super calls which pass-through function arguments directly. The
   * synthetic delegate super call match the following patterns we intend to match:
   *
   * 标识直接传递函数参数的合成超级调用。合成委托的超级调用与我们打算匹配的以下模式匹配：
   *
   * 1. Delegate call emitted by TypeScript when it emits ES5 directly.
   *
   *    TypeScript 在直接发出 ES5 时发出的委托调用。
   *
   *    ```
   *    _super !== null && _super.apply(this, arguments) || this;
   *    ```
   *
   * 2. Delegate call emitted by TypeScript when it downlevel's ES2015 to ES5.
   *
   *    将 TypeScript 的 ES2015 降级到 ES5 时发出的委托调用。
   *
   *    ```
   *    _super.apply(this, tslib.__spread(arguments)) || this;
   *    ```
   *
   *    or using the syntax emitted since TypeScript 4.2:
   *
   *    或使用自 TypeScript 4.2 以来发出的语法：
   *
   *    ```
   *    return _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
   *    ```
   *
   * @param expression an expression that may represent a default super call
   *
   * 可能表示默认超级调用的表达式
   *
   * @returns
   *
   * true if the expression corresponds with the above form
   *
   * 如果表达式对应于上面的形式，则为 true
   *
   */
  private isSynthesizedDefaultSuperCall(expression: ts.Expression): boolean {
    if (!isBinaryExpr(expression, ts.SyntaxKind.BarBarToken)) return false;
    if (expression.right.kind !== ts.SyntaxKind.ThisKeyword) return false;

    const left = expression.left;
    if (isBinaryExpr(left, ts.SyntaxKind.AmpersandAmpersandToken)) {
      return isSuperNotNull(left.left) && this.isSuperApplyCall(left.right);
    } else {
      return this.isSuperApplyCall(left);
    }
  }

  /**
   * Tests whether the expression corresponds to a `super` call passing through
   * function arguments without any modification. e.g.
   *
   * 测试表达式是否对应于在不进行任何修改的情况下通过函数参数的 `super` 调用。例如
   *
   * ```
   * _super !== null && _super.apply(this, arguments) || this;
   * ```
   *
   * This structure is generated by TypeScript when transforming ES2015 to ES5, see
   * <https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1148-L1163>
   *
   * 此结构是由 TypeScript 在将 ES2015 转换为 ES5
   * 时生成的，请参阅<https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/transformers/es2015.ts#L1148-L1163>
   *
   * Additionally, we also handle cases where `arguments` are wrapped by a TypeScript spread
   * helper.
   * This can happen if ES2015 class output contain auto-generated constructors due to class
   * members. The ES2015 output will be using `super(...arguments)` to delegate to the superclass,
   * but once downleveled to ES5, the spread operator will be persisted through a TypeScript spread
   * helper. For example:
   *
   * 此外，我们还处理了 `arguments` 由 TypeScript 传播帮助器包装的情况。如果 ES2015
   * 类输出由于类成员而包含自动生成的构造函数，则可能会发生这种情况。 ES2015 输出将使用
   * `super(...arguments)` 委托给超类，但一旦降级到 ES5，传播运算符将通过 TypeScript
   * 传播帮助器进行持久化。例如：
   *
   * ```
   * _super.apply(this, __spread(arguments)) || this;
   * ```
   *
   * or, since TypeScript 4.2 it would be
   *
   * 或者，从 TypeScript 4.2 开始，它将是
   *
   * ```
   * _super.apply(this, tslib.__spreadArray([], tslib.__read(arguments))) || this;
   * ```
   *
   * More details can be found in: <https://github.com/angular/angular/issues/38453>.
   *
   * 更多详细信息，请参阅： <https://github.com/angular/angular/issues/38453> 。
   *
   * @param expression an expression that may represent a default super call
   *
   * 可能表示默认超级调用的表达式
   *
   * @returns
   *
   * true if the expression corresponds with the above form
   *
   * 如果表达式对应于上面的形式，则为 true
   *
   */
  private isSuperApplyCall(expression: ts.Expression): boolean {
    if (!ts.isCallExpression(expression) || expression.arguments.length !== 2) return false;

    const targetFn = expression.expression;
    if (!ts.isPropertyAccessExpression(targetFn)) return false;
    if (!isSuperIdentifier(targetFn.expression)) return false;
    if (targetFn.name.text !== 'apply') return false;

    const thisArgument = expression.arguments[0];
    if (thisArgument.kind !== ts.SyntaxKind.ThisKeyword) return false;

    const argumentsExpr = expression.arguments[1];

    // If the super is directly invoked with `arguments`, return `true`. This represents the
    // common TypeScript output where the delegate constructor super call matches the following
    // pattern: `super.apply(this, arguments)`.
    if (isArgumentsIdentifier(argumentsExpr)) {
      return true;
    }

    // The other scenario we intend to detect: The `arguments` variable might be wrapped with the
    // TypeScript spread helper (either through tslib or inlined). This can happen if an explicit
    // delegate constructor uses `super(...arguments)` in ES2015 and is downleveled to ES5 using
    // `--downlevelIteration`.
    return this.isSpreadArgumentsExpression(argumentsExpr);
  }

  /**
   * Determines if the provided expression is one of the following call expressions:
   *
   * 确定提供的表达式是否是以下调用表达式之一：
   *
   * 1. `__spread(arguments)`
   *
   * 2. `__spreadArray([], __read(arguments))`
   *
   * 3. `__spreadArray([], __read(arguments), false)`
   *
   * The tslib helpers may have been emitted inline as in the above example, or they may be read
   * from a namespace import.
   *
   * tslib 帮助器可能是如上面的示例中的内联发出的，或者它们可以是从命名空间导入中读取的。
   *
   */
  private isSpreadArgumentsExpression(expression: ts.Expression): boolean {
    const call = this.extractKnownHelperCall(expression);
    if (call === null) {
      return false;
    }

    if (call.helper === KnownDeclaration.TsHelperSpread) {
      // `__spread(arguments)`
      return call.args.length === 1 && isArgumentsIdentifier(call.args[0]);
    } else if (call.helper === KnownDeclaration.TsHelperSpreadArray) {
      // `__spreadArray([], __read(arguments), false)`
      if (call.args.length !== 2 && call.args.length !== 3) {
        return false;
      }

      const firstArg = call.args[0];
      if (!ts.isArrayLiteralExpression(firstArg) || firstArg.elements.length !== 0) {
        return false;
      }

      const secondArg = this.extractKnownHelperCall(call.args[1]);
      if (secondArg === null || secondArg.helper !== KnownDeclaration.TsHelperRead) {
        return false;
      }

      return secondArg.args.length === 1 && isArgumentsIdentifier(secondArg.args[0]);
    } else {
      return false;
    }
  }

  /**
   * Inspects the provided expression and determines if it corresponds with a known helper function
   * as receiver expression.
   *
   * 检查提供的表达式并确定它是否与已知的帮助器函数作为接收器表达式相对应。
   *
   */
  private extractKnownHelperCall(expression: ts.Expression):
      {helper: KnownDeclaration, args: ts.NodeArray<ts.Expression>}|null {
    if (!ts.isCallExpression(expression)) {
      return null;
    }

    const receiverExpr = expression.expression;

    // The helper could be globally available, or accessed through a namespaced import. Hence we
    // support a property access here as long as it resolves to the actual known TypeScript helper.
    let receiver: Declaration|null = null;
    if (ts.isIdentifier(receiverExpr)) {
      receiver = this.getDeclarationOfIdentifier(receiverExpr);
    } else if (ts.isPropertyAccessExpression(receiverExpr) && ts.isIdentifier(receiverExpr.name)) {
      receiver = this.getDeclarationOfIdentifier(receiverExpr.name);
    }

    if (receiver === null || receiver.known === null) {
      return null;
    }

    return {
      helper: receiver.known,
      args: expression.arguments,
    };
  }
}

///////////// Internal Helpers /////////////

/**
 * Represents the details about property definitions that were set using `Object.defineProperty`.
 *
 * 表示有关使用 `Object.defineProperty` 设置的属性定义的详细信息。
 *
 */
interface PropertyDefinition {
  setter: ts.FunctionExpression|null;
  getter: ts.FunctionExpression|null;
}

/**
 * In ES5, getters and setters have been downleveled into call expressions of
 * `Object.defineProperty`, such as
 *
 * 在 ES5 中，getter 和 setter 已被降级为 `Object.defineProperty` 的调用表达式，例如
 *
 * ```
 * Object.defineProperty(Clazz.prototype, "property", {
 *   get: function () {
 *       return 'value';
 *   },
 *   set: function (value) {
 *       this.value = value;
 *   },
 *   enumerable: true,
 *   configurable: true
 * });
 * ```
 *
 * This function inspects the given node to determine if it corresponds with such a call, and if so
 * extracts the `set` and `get` function expressions from the descriptor object, if they exist.
 *
 * 此函数会检查给定节点以确定它是否与这样的调用对应，如果是，则从描述符对象中提取 `set` 和 `get`
 * 函数表达式（如果存在）。
 *
 * @param node The node to obtain the property definition from.
 *
 * 要从中获取属性定义的节点。
 *
 * @returns
 *
 * The property definition if the node corresponds with accessor, null otherwise.
 *
 * 如果节点与访问器相对应，则为属性定义，否则为 null 。
 *
 */
function getPropertyDefinition(node: ts.Node): PropertyDefinition|null {
  if (!ts.isCallExpression(node)) return null;

  const fn = node.expression;
  if (!ts.isPropertyAccessExpression(fn) || !ts.isIdentifier(fn.expression) ||
      fn.expression.text !== 'Object' || fn.name.text !== 'defineProperty')
    return null;

  const descriptor = node.arguments[2];
  if (!descriptor || !ts.isObjectLiteralExpression(descriptor)) return null;

  return {
    setter: readPropertyFunctionExpression(descriptor, 'set'),
    getter: readPropertyFunctionExpression(descriptor, 'get'),
  };
}

function readPropertyFunctionExpression(object: ts.ObjectLiteralExpression, name: string) {
  const property = object.properties.find(
      (p): p is ts.PropertyAssignment =>
          ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === name);

  return property && ts.isFunctionExpression(property.initializer) && property.initializer || null;
}

function getReturnStatement(declaration: ts.Expression|undefined): ts.ReturnStatement|undefined {
  return declaration && ts.isFunctionExpression(declaration) ?
      declaration.body.statements.find(ts.isReturnStatement) :
      undefined;
}

function reflectArrayElement(element: ts.Expression) {
  return ts.isObjectLiteralExpression(element) ? reflectObjectLiteral(element) : null;
}

function isArgumentsIdentifier(expression: ts.Expression): boolean {
  return ts.isIdentifier(expression) && expression.text === 'arguments';
}

function isSuperNotNull(expression: ts.Expression): boolean {
  return isBinaryExpr(expression, ts.SyntaxKind.ExclamationEqualsEqualsToken) &&
      isSuperIdentifier(expression.left);
}

function isBinaryExpr(
    expression: ts.Expression, operator: ts.BinaryOperator): expression is ts.BinaryExpression {
  return ts.isBinaryExpression(expression) && expression.operatorToken.kind === operator;
}

function isSuperIdentifier(node: ts.Node): boolean {
  // Verify that the identifier is prefixed with `_super`. We don't test for equivalence
  // as TypeScript may have suffixed the name, e.g. `_super_1` to avoid name conflicts.
  // Requiring only a prefix should be sufficiently accurate.
  return ts.isIdentifier(node) && node.text.startsWith('_super');
}

/**
 * Parse the statement to extract the ESM5 parameter initializer if there is one.
 * If one is found, add it to the appropriate parameter in the `parameters` collection.
 *
 * 解析语句以提取 ESM5 参数初始化器（如果有）。如果找到，请将其添加到 arguments 集合中的适当
 * `parameters` 。
 *
 * The form we are looking for is:
 *
 * 我们正在寻找的形式是：
 *
 * ```
 * if (arg === void 0) { arg = initializer; }
 * ```
 *
 * @param statement a statement that may be initializing an optional parameter
 *
 * 可能正在初始化可选参数的语句
 *
 * @param parameters the collection of parameters that were found in the function definition
 *
 * 在函数定义中找到的参数集合
 *
 * @returns
 *
 * true if the statement was a parameter initializer
 *
 * 如果语句是参数初始化器，则为 true
 *
 */
function captureParamInitializer(statement: ts.Statement, parameters: Parameter[]) {
  if (ts.isIfStatement(statement) && isUndefinedComparison(statement.expression) &&
      ts.isBlock(statement.thenStatement) && statement.thenStatement.statements.length === 1) {
    const ifStatementComparison = statement.expression;           // (arg === void 0)
    const thenStatement = statement.thenStatement.statements[0];  // arg = initializer;
    if (isAssignmentStatement(thenStatement)) {
      const comparisonName = ifStatementComparison.left.text;
      const assignmentName = thenStatement.expression.left.text;
      if (comparisonName === assignmentName) {
        const parameter = parameters.find(p => p.name === comparisonName);
        if (parameter) {
          parameter.initializer = thenStatement.expression.right;
          return true;
        }
      }
    }
  }
  return false;
}

function isUndefinedComparison(expression: ts.Expression): expression is ts.Expression&
    {left: ts.Identifier, right: ts.Expression} {
  return ts.isBinaryExpression(expression) &&
      expression.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken &&
      ts.isVoidExpression(expression.right) && ts.isIdentifier(expression.left);
}

/**
 * Parse the declaration of the given `classSymbol` to find the IIFE wrapper function.
 *
 * 解析给定 `classSymbol` 的声明以查找 IIFE 包装器函数。
 *
 * This function may accept a `_super` argument if there is a base class.
 *
 * 如果有基类，则此函数可以接受 `_super` 参数。
 *
 * ```
 * var TestClass = (function (_super) {
 *   __extends(TestClass, _super);
 *   function TestClass() {}
 *   return TestClass;
 * }(BaseClass));
 * ```
 *
 * @param classSymbol the class whose iife wrapper function we want to get.
 *
 * 我们要获取其 iife 包装器函数的类。
 *
 * @returns
 *
 * the IIFE function or null if it could not be parsed.
 *
 * IIFE 函数，如果无法解析，则为 null 。
 *
 */
function getIifeFn(classSymbol: NgccClassSymbol|undefined): ts.FunctionExpression|null {
  if (classSymbol === undefined) {
    return null;
  }

  const innerDeclaration = classSymbol.implementation.valueDeclaration;
  const iifeBody = innerDeclaration.parent;
  if (!ts.isBlock(iifeBody)) {
    return null;
  }

  const iifeWrapper = iifeBody.parent;
  return iifeWrapper && ts.isFunctionExpression(iifeWrapper) ? iifeWrapper : null;
}
