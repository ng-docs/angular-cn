/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {WrappedNodeExpr} from '@angular/compiler';
import ts from 'typescript';

import {getSourceFile} from '../../util/src/typescript';

const DefaultImportDeclaration = Symbol('DefaultImportDeclaration');

interface WithDefaultImportDeclaration {
  [DefaultImportDeclaration]?: ts.ImportDeclaration;
}

/**
 * Attaches a default import declaration to `expr` to indicate the dependency of `expr` on the
 * default import.
 *
 * 将默认导入声明附加到 `expr` 以表明 `expr` 对默认导入的依赖关系。
 *
 */
export function attachDefaultImportDeclaration(
    expr: WrappedNodeExpr<unknown>, importDecl: ts.ImportDeclaration): void {
  (expr as WithDefaultImportDeclaration)[DefaultImportDeclaration] = importDecl;
}

/**
 * Obtains the default import declaration that `expr` depends on, or `null` if there is no such
 * dependency.
 *
 * 获取 `expr` 依赖的默认导入声明，如果不存在这样的依赖项，则获取 `null` 。
 *
 */
export function getDefaultImportDeclaration(expr: WrappedNodeExpr<unknown>): ts.ImportDeclaration|
    null {
  return (expr as WithDefaultImportDeclaration)[DefaultImportDeclaration] ?? null;
}

/**
 * TypeScript has trouble with generating default imports inside of transformers for some module
 * formats. The issue is that for the statement:
 *
 * TypeScript 无法在某些模块格式的转换器中生成默认导入。问题是对于声明：
 *
 * import X from 'some/module';
 * console.log(X);
 *
 * 从 'some/module' 导入 X； console.log(X);
 *
 * TypeScript will not use the "X" name in generated code. For normal user code, this is fine
 * because references to X will also be renamed. However, if both the import and any references are
 * added in a transformer, TypeScript does not associate the two, and will leave the "X" references
 * dangling while renaming the import variable. The generated code looks something like:
 *
 * TypeScript 不会在生成的代码中使用“X”名称。对于普通用户代码，这很好，因为对 X
 * 的引用也会被重命名。但是，如果导入和任何引用都在转换器中添加，TypeScript
 * 不会将两者关联起来，并且在重命名导入变量时将保持“X”引用悬空。生成的代码类似于：
 *
 * const module_1 = require('some/module');
 * console.log(X); // now X is a dangling reference.
 *
 * const module_1 = require('some/module'); console.log(X); // 现在 X 是一个悬挂引用。
 *
 * Therefore, we cannot synthetically add default imports, and must reuse the imports that users
 * include. Doing this poses a challenge for imports that are only consumed in the type position in
 * the user's code. If Angular reuses the imported symbol in a value position (for example, we
 * see a constructor parameter of type Foo and try to write "inject(Foo)") we will also end up with
 * a dangling reference, as TS will elide the import because it was only used in the type position
 * originally.
 *
 * 因此，我们不能综合添加默认导入，必须重用用户包含的导入。这样做对仅在用户代码中的类型位置使用的导入提出了挑战。如果
 * Angular 在值位置重用导入的符号（例如，我们看到一个 Foo 类型的构造函数参数并尝试写为
 * "inject(Foo)"），我们最终将有一个悬挂引用，因为 TS 将省略导入，因为它最初仅用于类型位置。
 *
 * To avoid this, the compiler must "touch" the imports with `ts.getMutableClone`, and should
 * only do this for imports which are actually consumed. The `DefaultImportTracker` keeps track of
 * these imports as they're encountered and emitted, and implements a transform which can correctly
 * flag the imports as required.
 *
 * 为避免这种情况，编译器必须使用 `ts.getMutableClone`
 * “接触”导入，并且应该仅对实际使用的导入执行此操作。 `DefaultImportTracker`
 * 会在遇到和发出这些导入时跟踪它们，并实现可以根据需要正确标记导入的转换。
 *
 * This problem does not exist for non-default imports as the compiler can easily insert
 * "import \* as X" style imports for those, and the "X" identifier survives transformation.
 *
 * 对于非默认导入，不存在此问题，因为编译器可以轻松地为这些导入插入“import \* as
 * X”风格的导入，并且“X”标识符在转换中幸存下来。
 *
 */
export class DefaultImportTracker {
  /**
   * A `Map` which tracks the `Set` of `ts.ImportDeclaration`s for default imports that were used in
   * a given `ts.SourceFile` and need to be preserved.
   *
   * 一个 `Map` ，它跟踪 `ts.ImportDeclaration` 的 `Set` 以进行默认导入，这些导入在给定的
   * `ts.SourceFile` 中使用并需要保留。
   *
   */
  private sourceFileToUsedImports = new Map<ts.SourceFile, Set<ts.ImportDeclaration>>();

  recordUsedImport(importDecl: ts.ImportDeclaration): void {
    const sf = getSourceFile(importDecl);

    // Add the default import declaration to the set of used import declarations for the file.
    if (!this.sourceFileToUsedImports.has(sf)) {
      this.sourceFileToUsedImports.set(sf, new Set<ts.ImportDeclaration>());
    }
    this.sourceFileToUsedImports.get(sf)!.add(importDecl);
  }

  /**
   * Get a `ts.TransformerFactory` which will preserve default imports that were previously marked
   * as used.
   *
   * 获取一个 `ts.TransformerFactory` ，它将保留以前标记为已使用的默认导入。
   *
   * This transformer must run after any other transformers which call `recordUsedImport`.
   *
   * 此转换器必须在调用 `recordUsedImport` 的任何其他转换器之后运行。
   *
   */
  importPreservingTransformer(): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => {
      return (sf: ts.SourceFile) => {
        return this.transformSourceFile(sf);
      };
    };
  }

  /**
   * Process a `ts.SourceFile` and replace any `ts.ImportDeclaration`s.
   *
   * 处理 `ts.SourceFile` 并替换任何 `ts.ImportDeclaration` 。
   *
   */
  private transformSourceFile(sf: ts.SourceFile): ts.SourceFile {
    const originalSf = ts.getOriginalNode(sf) as ts.SourceFile;
    // Take a fast path if no import declarations need to be preserved in the file.
    if (!this.sourceFileToUsedImports.has(originalSf)) {
      return sf;
    }

    // There are declarations that need to be preserved.
    const importsToPreserve = this.sourceFileToUsedImports.get(originalSf)!;

    // Generate a new statement list which preserves any imports present in `importsToPreserve`.
    const statements = sf.statements.map(stmt => {
      if (ts.isImportDeclaration(stmt) && importsToPreserve.has(stmt)) {
        // Preserving an import that's marked as unreferenced (type-only) is tricky in TypeScript.
        //
        // Various approaches have been tried, with mixed success:
        //
        // 1. Using `ts.updateImportDeclaration` does not cause the import to be retained.
        //
        // 2. Using `ts.factory.createImportDeclaration` with the same `ts.ImportClause` causes the
        //    import to correctly be retained, but when emitting CommonJS module format code,
        //    references to the imported value will not match the import variable.
        //
        // 3. Emitting "import * as" imports instead generates the correct import variable, but
        //    references are missing the ".default" access. This happens to work for tsickle code
        //    with goog.module transformations as tsickle strips the ".default" anyway.
        //
        // 4. It's possible to trick TypeScript by setting `ts.NodeFlag.Synthesized` on the import
        //    declaration. This causes the import to be correctly retained and generated, but can
        //    violate invariants elsewhere in the compiler and cause crashes.
        //
        // 5. Using `ts.getMutableClone` seems to correctly preserve the import and correctly
        //    generate references to the import variable across all module types.
        //
        // Therefore, option 5 is the one used here. It seems to be implemented as the correct way
        // to perform option 4, which preserves all the compiler's invariants.
        //
        // TODO(alxhub): discuss with the TypeScript team and determine if there's a better way to
        // deal with this issue.
        // tslint:disable-next-line: ban
        stmt = ts.getMutableClone(stmt);
      }
      return stmt;
    });

    // Save memory - there's no need to keep these around once the transform has run for the given
    // file.
    this.sourceFileToUsedImports.delete(originalSf);

    return ts.factory.updateSourceFile(sf, statements);
  }
}
