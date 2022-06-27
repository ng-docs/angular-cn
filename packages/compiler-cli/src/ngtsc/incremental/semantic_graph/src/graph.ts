/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Expression, ExternalExpr} from '@angular/compiler';

import {AbsoluteFsPath} from '../../../file_system';
import {ClassDeclaration} from '../../../reflection';

import {SemanticReference, SemanticSymbol} from './api';

export interface SemanticDependencyResult {
  /**
   * The files that need to be re-emitted.
   *
   * 需要重新发出的文件。
   *
   */
  needsEmit: Set<AbsoluteFsPath>;

  /**
   * The files for which the type-check block should be regenerated.
   *
   * 应该重新生成类型检查块的文件。
   *
   */
  needsTypeCheckEmit: Set<AbsoluteFsPath>;

  /**
   * The newly built graph that represents the current compilation.
   *
   * 表示当前编译的新建图。
   *
   */
  newGraph: SemanticDepGraph;
}

/**
 * Represents a declaration for which no semantic symbol has been registered. For example,
 * declarations from external dependencies have not been explicitly registered and are represented
 * by this symbol. This allows the unresolved symbol to still be compared to a symbol from a prior
 * compilation.
 *
 * 表示没有注册语义符号的声明。例如，来自外部依赖项的声明尚未被显式注册，并由此符号表示。这允许仍将未解析的符号与先前编译中的符号进行比较。
 *
 */
class OpaqueSymbol extends SemanticSymbol {
  override isPublicApiAffected(): false {
    return false;
  }

  override isTypeCheckApiAffected(): false {
    return false;
  }
}

/**
 * The semantic dependency graph of a single compilation.
 *
 * 单个编译的语义依赖图。
 *
 */
export class SemanticDepGraph {
  readonly files = new Map<AbsoluteFsPath, Map<string, SemanticSymbol>>();
  readonly symbolByDecl = new Map<ClassDeclaration, SemanticSymbol>();

  /**
   * Registers a symbol in the graph. The symbol is given a unique identifier if possible, such that
   * its equivalent symbol can be obtained from a prior graph even if its declaration node has
   * changed across rebuilds. Symbols without an identifier are only able to find themselves in a
   * prior graph if their declaration node is identical.
   *
   * 在图中注册一个符号。如果可能，该符号会被赋予唯一标识符，以便即使其声明节点在重建中发生了更改，也可以从先前的图中获得其等效符号。没有标识符的符号只有在它们的声明节点相同时才能在前面的图中找到自己。
   *
   */
  registerSymbol(symbol: SemanticSymbol): void {
    this.symbolByDecl.set(symbol.decl, symbol);

    if (symbol.identifier !== null) {
      // If the symbol has a unique identifier, record it in the file that declares it. This enables
      // the symbol to be requested by its unique name.
      if (!this.files.has(symbol.path)) {
        this.files.set(symbol.path, new Map<string, SemanticSymbol>());
      }
      this.files.get(symbol.path)!.set(symbol.identifier, symbol);
    }
  }

  /**
   * Attempts to resolve a symbol in this graph that represents the given symbol from another graph.
   * If no matching symbol could be found, null is returned.
   *
   * 尝试解析此图中的一个符号，该符号表示另一个图中的给定符号。如果找不到匹配的符号，则返回 null 。
   *
   * @param symbol The symbol from another graph for which its equivalent in this graph should be
   * found.
   *
   * 另一个图中的符号，应该在此图中找到其等效项。
   *
   */
  getEquivalentSymbol(symbol: SemanticSymbol): SemanticSymbol|null {
    // First lookup the symbol by its declaration. It is typical for the declaration to not have
    // changed across rebuilds, so this is likely to find the symbol. Using the declaration also
    // allows to diff symbols for which no unique identifier could be determined.
    let previousSymbol = this.getSymbolByDecl(symbol.decl);
    if (previousSymbol === null && symbol.identifier !== null) {
      // The declaration could not be resolved to a symbol in a prior compilation, which may
      // happen because the file containing the declaration has changed. In that case we want to
      // lookup the symbol based on its unique identifier, as that allows us to still compare the
      // changed declaration to the prior compilation.
      previousSymbol = this.getSymbolByName(symbol.path, symbol.identifier);
    }

    return previousSymbol;
  }

  /**
   * Attempts to find the symbol by its identifier.
   *
   * 尝试通过其标识符查找符号。
   *
   */
  private getSymbolByName(path: AbsoluteFsPath, identifier: string): SemanticSymbol|null {
    if (!this.files.has(path)) {
      return null;
    }
    const file = this.files.get(path)!;
    if (!file.has(identifier)) {
      return null;
    }
    return file.get(identifier)!;
  }

  /**
   * Attempts to resolve the declaration to its semantic symbol.
   *
   * 尝试将声明解析为其语义符号。
   *
   */
  getSymbolByDecl(decl: ClassDeclaration): SemanticSymbol|null {
    if (!this.symbolByDecl.has(decl)) {
      return null;
    }
    return this.symbolByDecl.get(decl)!;
  }
}

/**
 * Implements the logic to go from a previous dependency graph to a new one, along with information
 * on which files have been affected.
 *
 * 实现从上一个依赖图转到新依赖图的逻辑，以及有关哪些文件受到影响的信息。
 *
 */
export class SemanticDepGraphUpdater {
  private readonly newGraph = new SemanticDepGraph();

  /**
   * Contains opaque symbols that were created for declarations for which there was no symbol
   * registered, which happens for e.g. external declarations.
   *
   * 包含为没有注册符号的声明创建的不透明符号，例如外部声明会发生这种情况。
   *
   */
  private readonly opaqueSymbols = new Map<ClassDeclaration, OpaqueSymbol>();

  constructor(
      /**
       * The semantic dependency graph of the most recently succeeded compilation, or null if this
       * is the initial build.
       */
      private priorGraph: SemanticDepGraph|null) {}

  /**
   * Registers the symbol in the new graph that is being created.
   *
   * 在正在创建的新图中注册符号。
   *
   */
  registerSymbol(symbol: SemanticSymbol): void {
    this.newGraph.registerSymbol(symbol);
  }

  /**
   * Takes all facts that have been gathered to create a new semantic dependency graph. In this
   * process, the semantic impact of the changes is determined which results in a set of files that
   * need to be emitted and/or type-checked.
   *
   * 采用已收集的所有事实来创建新的语义依赖图。在此过程中，确定更改的语义影响，这会产生一组需要发出和/或类型检查的文件。
   *
   */
  finalize(): SemanticDependencyResult {
    if (this.priorGraph === null) {
      // If no prior dependency graph is available then this was the initial build, in which case
      // we don't need to determine the semantic impact as everything is already considered
      // logically changed.
      return {
        needsEmit: new Set<AbsoluteFsPath>(),
        needsTypeCheckEmit: new Set<AbsoluteFsPath>(),
        newGraph: this.newGraph,
      };
    }

    const needsEmit = this.determineInvalidatedFiles(this.priorGraph);
    const needsTypeCheckEmit = this.determineInvalidatedTypeCheckFiles(this.priorGraph);
    return {
      needsEmit,
      needsTypeCheckEmit,
      newGraph: this.newGraph,
    };
  }

  private determineInvalidatedFiles(priorGraph: SemanticDepGraph): Set<AbsoluteFsPath> {
    const isPublicApiAffected = new Set<SemanticSymbol>();

    // The first phase is to collect all symbols which have their public API affected. Any symbols
    // that cannot be matched up with a symbol from the prior graph are considered affected.
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null || symbol.isPublicApiAffected(previousSymbol)) {
        isPublicApiAffected.add(symbol);
      }
    }

    // The second phase is to find all symbols for which the emit result is affected, either because
    // their used declarations have changed or any of those used declarations has had its public API
    // affected as determined in the first phase.
    const needsEmit = new Set<AbsoluteFsPath>();
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      if (symbol.isEmitAffected === undefined) {
        continue;
      }

      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null || symbol.isEmitAffected(previousSymbol, isPublicApiAffected)) {
        needsEmit.add(symbol.path);
      }
    }

    return needsEmit;
  }

  private determineInvalidatedTypeCheckFiles(priorGraph: SemanticDepGraph): Set<AbsoluteFsPath> {
    const isTypeCheckApiAffected = new Set<SemanticSymbol>();

    // The first phase is to collect all symbols which have their public API affected. Any symbols
    // that cannot be matched up with a symbol from the prior graph are considered affected.
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null || symbol.isTypeCheckApiAffected(previousSymbol)) {
        isTypeCheckApiAffected.add(symbol);
      }
    }

    // The second phase is to find all symbols for which the emit result is affected, either because
    // their used declarations have changed or any of those used declarations has had its public API
    // affected as determined in the first phase.
    const needsTypeCheckEmit = new Set<AbsoluteFsPath>();
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      if (symbol.isTypeCheckBlockAffected === undefined) {
        continue;
      }

      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null ||
          symbol.isTypeCheckBlockAffected(previousSymbol, isTypeCheckApiAffected)) {
        needsTypeCheckEmit.add(symbol.path);
      }
    }

    return needsTypeCheckEmit;
  }

  /**
   * Creates a `SemanticReference` for the reference to `decl` using the expression `expr`. See
   * the documentation of `SemanticReference` for details.
   *
   * 使用表达式 `expr` 为对 `decl` 的引用创建一个 `SemanticReference` 。有关详细信息，请参阅
   * `SemanticReference` 的文档。
   *
   */
  getSemanticReference(decl: ClassDeclaration, expr: Expression): SemanticReference {
    return {
      symbol: this.getSymbol(decl),
      importPath: getImportPath(expr),
    };
  }

  /**
   * Gets the `SemanticSymbol` that was registered for `decl` during the current compilation, or
   * returns an opaque symbol that represents `decl`.
   *
   * 获取在当前编译期间为 `decl` 注册的 `SemanticSymbol` ，或返回表示 `decl` 的不透明符号。
   *
   */
  getSymbol(decl: ClassDeclaration): SemanticSymbol {
    const symbol = this.newGraph.getSymbolByDecl(decl);
    if (symbol === null) {
      // No symbol has been recorded for the provided declaration, which would be the case if the
      // declaration is external. Return an opaque symbol in that case, to allow the external
      // declaration to be compared to a prior compilation.
      return this.getOpaqueSymbol(decl);
    }
    return symbol;
  }

  /**
   * Gets or creates an `OpaqueSymbol` for the provided class declaration.
   *
   * 获取或为提供的类声明创建 `OpaqueSymbol` 。
   *
   */
  private getOpaqueSymbol(decl: ClassDeclaration): OpaqueSymbol {
    if (this.opaqueSymbols.has(decl)) {
      return this.opaqueSymbols.get(decl)!;
    }

    const symbol = new OpaqueSymbol(decl);
    this.opaqueSymbols.set(decl, symbol);
    return symbol;
  }
}

function getImportPath(expr: Expression): string|null {
  if (expr instanceof ExternalExpr) {
    return `${expr.value.moduleName}\$${expr.value.name}`;
  } else {
    return null;
  }
}
