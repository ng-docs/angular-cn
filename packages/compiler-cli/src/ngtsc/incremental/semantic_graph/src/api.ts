/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {absoluteFromSourceFile, AbsoluteFsPath} from '../../../file_system';
import {ClassDeclaration} from '../../../reflection';

/**
 * Represents a symbol that is recognizable across incremental rebuilds, which enables the captured
 * metadata to be compared to the prior compilation. This allows for semantic understanding of
 * the changes that have been made in a rebuild, which potentially enables more reuse of work
 * from the prior compilation.
 *
 * 表示一个可在增量重建中识别的符号，它可以将捕获的元数据与之前的编译进行比较。这允许对重建中所做的更改进行语义理解，这可能会允许更多地重用先前编译中的工作。
 *
 */
export abstract class SemanticSymbol {
  /**
   * The path of the file that declares this symbol.
   *
   * 声明此符号的文件的路径。
   *
   */
  public readonly path: AbsoluteFsPath;

  /**
   * The identifier of this symbol, or null if no identifier could be determined. It should
   * uniquely identify the symbol relative to `file`. This is typically just the name of a
   * top-level class declaration, as that uniquely identifies the class within the file.
   *
   * 此符号的标识符，如果无法确定标识符，则为 null 。它应该唯一地标识相对于 `file`
   * 的符号。这通常只是顶级类声明的名称，因为它可以唯一标识文件中的类。
   *
   * If the identifier is null, then this symbol cannot be recognized across rebuilds. In that
   * case, the symbol is always assumed to have semantically changed to guarantee a proper
   * rebuild.
   *
   * 如果标识符为 null
   * ，则无法在重建中识别此符号。在这种情况下，始终假定符号在语义上已发生更改，以确保正确重建。
   *
   */
  public readonly identifier: string|null;

  constructor(
      /**
       * The declaration for this symbol.
       */
      public readonly decl: ClassDeclaration,
  ) {
    this.path = absoluteFromSourceFile(decl.getSourceFile());
    this.identifier = getSymbolIdentifier(decl);
  }

  /**
   * Allows the symbol to be compared to the equivalent symbol in the previous compilation. The
   * return value indicates whether the symbol has been changed in a way such that its public API
   * is affected.
   *
   * 允许将符号与以前编译中的等效符号进行比较。返回值表明符号是否已以影响其公共 API 的方式更改。
   *
   * This method determines whether a change to _this_ symbol require the symbols that
   * use to this symbol to be re-emitted.
   *
   * 此方法确定 _ 对此 _ 符号的更改是否需要重新发出用于此符号的符号。
   *
   * Note: `previousSymbol` is obtained from the most recently succeeded compilation. Symbols of
   * failed compilations are never provided.
   *
   * 注： `previousSymbol` 是从最近成功的编译中获取的。永远不会提供编译失败的符号。
   *
   * @param previousSymbol The symbol from a prior compilation.
   *
   * 先前编译中的符号。
   *
   */
  abstract isPublicApiAffected(previousSymbol: SemanticSymbol): boolean;

  /**
   * Allows the symbol to determine whether its emit is affected. The equivalent symbol from a prior
   * build is given, in addition to the set of symbols of which the public API has changed.
   *
   * 允许符号确定其发射是否受到影响。除了公共 API
   * 已更改的符号集之外，还会给出来自先前构建的等效符号。
   *
   * This method determines whether a change to _other_ symbols, i.e. those present in
   * `publicApiAffected`, should cause _this_ symbol to be re-emitted.
   *
   * 此方法确定对 _ 其他 _ 符号（即 `publicApiAffected` 中存在的那些）的更改是否会导致 _ 此 _
   * 符号被重新发出。
   *
   * @param previousSymbol The equivalent symbol from a prior compilation. Note that it may be a
   * different type of symbol, if e.g. a Component was changed into a Directive with the same name.
   *
   * 先前编译中的等效符号。请注意，它可能是不同类型的符号，例如，如果组件更改为具有相同名称的指令。
   *
   * @param publicApiAffected The set of symbols of which the public API has changed.
   *
   * 公共 API 已更改的符号集。
   *
   */
  isEmitAffected?(previousSymbol: SemanticSymbol, publicApiAffected: Set<SemanticSymbol>): boolean;

  /**
   * Similar to `isPublicApiAffected`, but here equivalent symbol from a prior compilation needs
   * to be compared to see if the type-check block of components that use this symbol is affected.
   *
   * 类似于 `isPublicApiAffected`
   * ，但在这里需要比较来自先前编译的等效符号，以查看使用此符号的组件的类型检查块是否受到影响。
   *
   * This method determines whether a change to _this_ symbol require the symbols that
   * use to this symbol to have their type-check block regenerated.
   *
   * 此方法确定 _ 对此 _ 符号的更改是否需要重新生成其类型检查块。
   *
   * Note: `previousSymbol` is obtained from the most recently succeeded compilation. Symbols of
   * failed compilations are never provided.
   *
   * 注： `previousSymbol` 是从最近成功的编译中获取的。永远不会提供编译失败的符号。
   *
   * @param previousSymbol The symbol from a prior compilation.
   *
   * 先前编译中的符号。
   *
   */
  abstract isTypeCheckApiAffected(previousSymbol: SemanticSymbol): boolean;

  /**
   * Similar to `isEmitAffected`, but focused on the type-check block of this symbol. This method
   * determines whether a change to _other_ symbols, i.e. those present in `typeCheckApiAffected`,
   * should cause _this_ symbol's type-check block to be regenerated.
   *
   * 类似于 `isEmitAffected` ，但专注于此符号的类型检查块。此方法确定对 _ 其他 _ 符号（即
   * `typeCheckApiAffected` 中存在的符号）的更改是否会导致重新生成 _ 此 _ 符号的类型检查块。
   *
   * @param previousSymbol The equivalent symbol from a prior compilation. Note that it may be a
   * different type of symbol, if e.g. a Component was changed into a Directive with the same name.
   *
   * 先前编译中的等效符号。请注意，它可能是不同类型的符号，例如，如果组件更改为具有相同名称的指令。
   *
   * @param typeCheckApiAffected The set of symbols of which the type-check API has changed.
   *
   * 类型检查 API 已更改的符号集。
   *
   */
  isTypeCheckBlockAffected?
      (previousSymbol: SemanticSymbol, typeCheckApiAffected: Set<SemanticSymbol>): boolean;
}

/**
 * Represents a reference to a semantic symbol that has been emitted into a source file. The
 * reference may refer to the symbol using a different name than the semantic symbol's declared
 * name, e.g. in case a re-export under a different name was chosen by a reference emitter.
 * Consequently, to know that an emitted reference is still valid not only requires that the
 * semantic symbol is still valid, but also that the path by which the symbol is imported has not
 * changed.
 *
 * 表示对已发出到源文件中的语义符号的引用。引用可以用与语义符号的声明名称不同的名称来引用符号，例如，以防引用发射器选择了不同名称的重新导出。因此，要知道发出的引用仍然有效，不仅需要语义符号仍然有效，而且导入符号的路径没有更改。
 *
 */
export interface SemanticReference {
  symbol: SemanticSymbol;

  /**
   * The path by which the symbol has been referenced.
   *
   * 引用符号的路径。
   *
   */
  importPath: string|null;
}

function getSymbolIdentifier(decl: ClassDeclaration): string|null {
  if (!ts.isSourceFile(decl.parent)) {
    return null;
  }

  // If this is a top-level class declaration, the class name is used as unique identifier.
  // Other scenarios are currently not supported and causes the symbol not to be identified
  // across rebuilds, unless the declaration node has not changed.
  return decl.name.text;
}
