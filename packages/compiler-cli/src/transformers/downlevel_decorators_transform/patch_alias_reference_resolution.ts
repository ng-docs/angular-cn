/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

/**
 * Describes a TypeScript transformation context with the internal emit
 * resolver exposed. There are requests upstream in TypeScript to expose
 * that as public API: <https://github.com/microsoft/TypeScript/issues/17516.>.
 *
 * 描述公开了内部发出解析器的 TypeScript 转换上下文。 TypeScript 上游有一些请求将其公开为公共 API：
 * [https://github.com/microsoft/TypeScript/issues/17516
 * 。](https://github.com/microsoft/TypeScript/issues/17516.) .
 *
 */
interface TransformationContextWithResolver extends ts.TransformationContext {
  getEmitResolver: () => EmitResolver;
}

const patchedReferencedAliasesSymbol = Symbol('patchedReferencedAliases');

/**
 * Describes a subset of the TypeScript internal emit resolver.
 *
 * 描述 TypeScript 内部发出解析器的子集。
 *
 */
interface EmitResolver {
  isReferencedAliasDeclaration?(node: ts.Node, ...args: unknown[]): void;
  [patchedReferencedAliasesSymbol]?: Set<ts.Declaration>;
}

/**
 * Patches the alias declaration reference resolution for a given transformation context
 * so that TypeScript knows about the specified alias declarations being referenced.
 *
 * 修补给定转换上下文的别名声明引用解析，以便 TypeScript 知道被引用的指定别名声明。
 *
 * This exists because TypeScript performs analysis of import usage before transformers
 * run and doesn't refresh its state after transformations. This means that imports
 * for symbols used as constructor types are elided due to their original type-only usage.
 *
 * 这是存在的，因为 TypeScript
 * 在转换器运行之前会执行导入使用情况分析，并且在转换后不会刷新其状态。这意味着，用作构造函数类型的符号的导入由于它们最初的仅类型用法而被忽略。
 *
 * In reality though, since we downlevel decorators and constructor parameters, we want
 * these symbols to be retained in the JavaScript output as they will be used as values
 * at runtime. We can instruct TypeScript to preserve imports for such identifiers by
 * creating a mutable clone of a given import specifier/clause or namespace, but that
 * has the downside of preserving the full import in the JS output. See:
 * <https://github.com/microsoft/TypeScript/blob/3eaa7c65f6f076a08a5f7f1946fd0df7c7430259/src/compiler/transformers/ts.ts#L242-L250>.
 *
 * 但实际上，由于我们降低了装饰器和构造函数参数的级别，我们希望这些符号保留在 JavaScript
 * 输出中，因为它们将在运行时用作值。我们可以通过创建给定导入说明符/子句或命名空间的可变克隆来指示
 * TypeScript 保留此类标识符的导入，但这有一个缺点是在 JS 输出中保留完全导入。请参阅：
 * <https://github.com/microsoft/TypeScript/blob/3eaa7c65f6f076a08a5f7f1946fd0df7c7430259/src/compiler/transformers/ts.ts#L242-L250>
 * 。
 *
 * This is a trick the CLI used in the past  for constructor parameter downleveling in JIT:
 * <https://github.com/angular/angular-cli/blob/b3f84cc5184337666ce61c07b7b9df418030106f/packages/ngtools/webpack/src/transformers/ctor-parameters.ts#L323-L325>
 * The trick is not ideal though as it preserves the full import (as outlined before), and it
 * results in a slow-down due to the type checker being involved multiple times. The CLI worked
 * around this import preserving issue by having another complex post-process step that detects and
 * elides unused imports. Note that these unused imports could cause unused chunks being generated
 * by Webpack if the application or library is not marked as side-effect free.
 *
 * 这是 CLI 过去用于 JIT 中构造函数参数降级的技巧：
 * [https://github.com/angular/angular-cli/blob/b3f84cc5184337666ce61c07b7b9df418030106f/packages/ngtools/webpack/src/transformers/ctor-parameters.ts
 * #L323-L325](https://github.com/angular/angular-cli/blob/b3f84cc5184337666ce61c07b7b9df418030106f/packages/ngtools/webpack/src/transformers/ctor-parameters.ts#L323-L325)虽然这个技巧并不理想，因为它保留了完全导入（如前所述），并且由于类型检查器涉及多次，它会导致速度变慢。
 * CLI
 * 通过有另一个复杂的后处理步骤来检测和删除未使用的导入，从而解决了此导入保留问题。请注意，如果未将应用程序或库标记为无副作用，这些未使用的导入可能会导致
 * Webpack 生成未使用的块。
 *
 * This is not ideal though, as we basically re-implement the complex import usage resolution
 * from TypeScript. We can do better by letting TypeScript do the import eliding, but providing
 * information about the alias declarations (e.g. import specifiers) that should not be elided
 * because they are actually referenced (as they will now appear in static properties).
 *
 * 但这并不理想，因为我们基本上是从 TypeScript 重新实现了复杂的导入使用解析。我们可以通过让
 * TypeScript
 * 进行导入删除来做得更好，但要提供有关别名声明的信息（例如导入说明符），因为它们实际上是被引用的（因为它们现在将出现在静态属性中）。
 *
 * More information about these limitations with transformers can be found in:
 *   1\. <https://github.com/Microsoft/TypeScript/issues/17552>.
 *   2\. <https://github.com/microsoft/TypeScript/issues/17516>.
 *   3\. <https://github.com/angular/tsickle/issues/635>.
 *
 * 有关转换器的这些限制的更多信息，请参阅： 1.
 * <https://github.com/Microsoft/TypeScript/issues/17552> 。 2.
 * <https://github.com/microsoft/TypeScript/issues/17516> 。 3.
 * <https://github.com/angular/tsickle/issues/635> 。
 *
 * The patch we apply to tell TypeScript about actual referenced aliases (i.e. imported symbols),
 * matches conceptually with the logic that runs internally in TypeScript when the
 * `emitDecoratorMetadata` flag is enabled. TypeScript basically surfaces the same problem and
 * solves it conceptually the same way, but obviously doesn't need to access an `@internal` API.
 *
 * 我们用来告诉 TypeScript 实际引用的别名（即导入的符号）的补丁，在概念上与启用
 * `emitDecoratorMetadata` 标志时在 TypeScript 内部运行的逻辑匹配。 TypeScript
 * 基本上会出现相同的问题，并且在概念上以相同的方式解决它，但显然不需要访问 `@internal` API。
 *
 * The set that is returned by this function is meant to be filled with import declaration nodes
 * that have been referenced in a value-position by the transform, such the installed patch can
 * ensure that those import declarations are not elided.
 *
 * 此函数返回的集旨在填充已在 value-position
 * 中被转换引用的导入声明节点，例如安装的补丁可以确保不会忽略这些导入声明。
 *
 * See below. Note that this uses sourcegraph as the TypeScript checker file doesn't display on
 * Github.
 * <https://sourcegraph.com/github.com/microsoft/TypeScript@3eaa7c65f6f076a08a5f7f1946fd0df7c7430259/-/blob/src/compiler/checker.ts#L31219-31257>
 *
 * 见下文。请注意，这使用 sourcegraph 作为 TypeScript 检查器文件不会显示在 Github 上。
 * <https://sourcegraph.com/github.com/microsoft/TypeScript@3eaa7c65f6f076a08a5f7f1946fd0df7c7430259/-/blob/src/compiler/checker.ts#L31219-31257>
 *
 */
export function loadIsReferencedAliasDeclarationPatch(context: ts.TransformationContext):
    Set<ts.Declaration> {
  // If the `getEmitResolver` method is not available, TS most likely changed the
  // internal structure of the transformation context. We will abort gracefully.
  if (!isTransformationContextWithEmitResolver(context)) {
    throwIncompatibleTransformationContextError();
  }
  const emitResolver = context.getEmitResolver();

  // The emit resolver may have been patched already, in which case we return the set of referenced
  // aliases that was created when the patch was first applied.
  // See https://github.com/angular/angular/issues/40276.
  const existingReferencedAliases = emitResolver[patchedReferencedAliasesSymbol];
  if (existingReferencedAliases !== undefined) {
    return existingReferencedAliases;
  }

  const originalIsReferencedAliasDeclaration = emitResolver.isReferencedAliasDeclaration;
  // If the emit resolver does not have a function called `isReferencedAliasDeclaration`, then
  // we abort gracefully as most likely TS changed the internal structure of the emit resolver.
  if (originalIsReferencedAliasDeclaration === undefined) {
    throwIncompatibleTransformationContextError();
  }

  const referencedAliases = new Set<ts.Declaration>();
  emitResolver.isReferencedAliasDeclaration = function(node, ...args) {
    if (isAliasImportDeclaration(node) && referencedAliases.has(node)) {
      return true;
    }
    return originalIsReferencedAliasDeclaration.call(emitResolver, node, ...args);
  };
  return emitResolver[patchedReferencedAliasesSymbol] = referencedAliases;
}

/**
 * Gets whether a given node corresponds to an import alias declaration. Alias
 * declarations can be import specifiers, namespace imports or import clauses
 * as these do not declare an actual symbol but just point to a target declaration.
 *
 * 获取给定节点是否对应于导入别名声明。别名声明可以是导入说明符、命名空间导入或导入子句，因为这些不会声明实际的符号，而只是指向一个
 * target 声明。
 *
 */
export function isAliasImportDeclaration(node: ts.Node): node is ts.ImportSpecifier|
    ts.NamespaceImport|ts.ImportClause {
  return ts.isImportSpecifier(node) || ts.isNamespaceImport(node) || ts.isImportClause(node);
}

/**
 * Whether the transformation context exposes its emit resolver.
 *
 * 转换上下文是否公开其发出解析器。
 *
 */
function isTransformationContextWithEmitResolver(context: ts.TransformationContext):
    context is TransformationContextWithResolver {
  return (context as Partial<TransformationContextWithResolver>).getEmitResolver !== undefined;
}


/**
 * Throws an error about an incompatible TypeScript version for which the alias
 * declaration reference resolution could not be monkey-patched. The error will
 * also propose potential solutions that can be applied by developers.
 *
 * 抛出有关无法为其别名声明引用解析的不兼容 TypeScript
 * 版本的错误。该错误还将提出可供开发人员应用的潜在解决方案。
 *
 */
function throwIncompatibleTransformationContextError(): never {
  throw Error(
      'Unable to downlevel Angular decorators due to an incompatible TypeScript ' +
      'version.\nIf you recently updated TypeScript and this issue surfaces now, consider ' +
      'downgrading.\n\n' +
      'Please report an issue on the Angular repositories when this issue ' +
      'surfaces and you are using a supposedly compatible TypeScript version.');
}
