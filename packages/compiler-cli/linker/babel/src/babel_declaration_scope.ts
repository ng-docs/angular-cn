/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NodePath, Scope} from '@babel/traverse';

import {DeclarationScope} from '../../../linker';

import {types as t} from './babel_core';

export type ConstantScopePath =
    NodePath<t.FunctionDeclaration>|NodePath<t.FunctionExpression>|NodePath<t.Program>;

/**
 * This class represents the lexical scope of a partial declaration in Babel source code.
 *
 * 此类表示 Babel 源代码中部分声明的词法范围。
 *
 * Its only responsibility is to compute a reference object for the scope of shared constant
 * statements that will be generated during partial linking.
 *
 * 它的唯一职责是为部分链接期间生成的共享常量语句的范围计算引用对象。
 *
 */
export class BabelDeclarationScope implements DeclarationScope<ConstantScopePath, t.Expression> {
  /**
   * Construct a new `BabelDeclarationScope`.
   *
   * 构造一个新的 `BabelDeclarationScope` 。
   *
   * @param declarationScope the Babel scope containing the declaration call expression.
   *
   * 包含声明调用表达式的 Babel 范围。
   *
   */
  constructor(private declarationScope: Scope) {}

  /**
   * Compute the Babel `NodePath` that can be used to reference the lexical scope where any
   * shared constant statements would be inserted.
   *
   * 计算可用于引用将插入任何共享常量语句的词法范围的 Babel `NodePath` 。
   *
   * There will only be a shared constant scope if the expression is in an ECMAScript module, or a
   * UMD module. Otherwise `null` is returned to indicate that constant statements must be emitted
   * locally to the generated linked definition, to avoid polluting the global scope.
   *
   * 只有当表达式在 ECMAScript 模块或 UMD 模块中时，才会有共享常量范围。否则，返回 `null`
   * 以表明必须在本地向生成的链接定义发出常量语句，以避免污染全局范围。
   *
   * @param expression the expression that points to the Angular core framework import.
   *
   * 指向 Angular 核心框架导入的表达式。
   *
   */
  getConstantScopeRef(expression: t.Expression): ConstantScopePath|null {
    // If the expression is of the form `a.b.c` then we want to get the far LHS (e.g. `a`).
    let bindingExpression = expression;
    while (t.isMemberExpression(bindingExpression)) {
      bindingExpression = bindingExpression.object;
    }

    if (!t.isIdentifier(bindingExpression)) {
      return null;
    }

    // The binding of the expression is where this identifier was declared.
    // This could be a variable declaration, an import namespace or a function parameter.
    const binding = this.declarationScope.getBinding(bindingExpression.name);
    if (binding === undefined) {
      return null;
    }

    // We only support shared constant statements if the binding was in a UMD module (i.e. declared
    // within a function) or an ECMASCript module (i.e. declared at the top level of a
    // `t.Program` that is marked as a module).
    const path = binding.scope.path;
    if (!path.isFunctionDeclaration() && !path.isFunctionExpression() &&
        !(path.isProgram() && path.node.sourceType === 'module')) {
      return null;
    }

    return path;
  }
}
