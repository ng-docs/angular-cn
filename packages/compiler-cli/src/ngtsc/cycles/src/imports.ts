/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {PerfPhase, PerfRecorder} from '../../perf';

/**
 * A cached graph of imports in the `ts.Program`.
 *
 * `ts.Program` 中的缓存导入图。
 *
 * The `ImportGraph` keeps track of dependencies (imports) of individual `ts.SourceFile`s. Only
 * dependencies within the same program are tracked; imports into packages on NPM are not.
 *
 * `ImportGraph` 会跟踪单个 `ts.SourceFile` 的依赖项（导入）。仅跟踪同一程序中的依赖项；导入到 NPM
 * 上的包中的则不是。
 *
 */
export class ImportGraph {
  private imports = new Map<ts.SourceFile, Set<ts.SourceFile>>();

  constructor(private checker: ts.TypeChecker, private perf: PerfRecorder) {}

  /**
   * List the direct (not transitive) imports of a given `ts.SourceFile`.
   *
   * 列出给定 `ts.SourceFile` 的直接（不可传递）导入。
   *
   * This operation is cached.
   *
   * 此操作被缓存。
   *
   */
  importsOf(sf: ts.SourceFile): Set<ts.SourceFile> {
    if (!this.imports.has(sf)) {
      this.imports.set(sf, this.scanImports(sf));
    }
    return this.imports.get(sf)!;
  }

  /**
   * Find an import path from the `start` SourceFile to the `end` SourceFile.
   *
   * 查找从 `start` SourceFile 到 `end` SourceFile 的导入路径。
   *
   * This function implements a breadth first search that results in finding the
   * shortest path between the `start` and `end` points.
   *
   * 此函数实现了广度优先搜索，以查找 `start` 和 `end` 之间的最短路径。
   *
   * @param start the starting point of the path.
   *
   * 路径的起点。
   *
   * @param end the ending point of the path.
   *
   * 路径的终点。
   *
   * @returns
   *
   * an array of source files that connect the `start` and `end` source files, or `null` if
   *     no path could be found.
   *
   * 连接 `start` 和 `end` 源文件的源文件数组，如果找不到路径，则为 `null` 。
   *
   */
  findPath(start: ts.SourceFile, end: ts.SourceFile): ts.SourceFile[]|null {
    if (start === end) {
      // Escape early for the case where `start` and `end` are the same.
      return [start];
    }

    const found = new Set<ts.SourceFile>([start]);
    const queue: Found[] = [new Found(start, null)];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const imports = this.importsOf(current.sourceFile);
      for (const importedFile of imports) {
        if (!found.has(importedFile)) {
          const next = new Found(importedFile, current);
          if (next.sourceFile === end) {
            // We have hit the target `end` path so we can stop here.
            return next.toPath();
          }
          found.add(importedFile);
          queue.push(next);
        }
      }
    }
    return null;
  }

  /**
   * Add a record of an import from `sf` to `imported`, that's not present in the original
   * `ts.Program` but will be remembered by the `ImportGraph`.
   *
   * 添加从 `sf` 到 enabled 的 `imported` 记录，该记录在原始 `ts.Program` 中不存在，但会被
   * `ImportGraph` 记住。
   *
   */
  addSyntheticImport(sf: ts.SourceFile, imported: ts.SourceFile): void {
    if (isLocalFile(imported)) {
      this.importsOf(sf).add(imported);
    }
  }

  private scanImports(sf: ts.SourceFile): Set<ts.SourceFile> {
    return this.perf.inPhase(PerfPhase.CycleDetection, () => {
      const imports = new Set<ts.SourceFile>();
      // Look through the source file for import and export statements.
      for (const stmt of sf.statements) {
        if ((!ts.isImportDeclaration(stmt) && !ts.isExportDeclaration(stmt)) ||
            stmt.moduleSpecifier === undefined) {
          continue;
        }

        if (ts.isImportDeclaration(stmt) && stmt.importClause !== undefined &&
            isTypeOnlyImportClause(stmt.importClause)) {
          // Exclude type-only imports as they are always elided, so they don't contribute to
          // cycles.
          continue;
        }

        const symbol = this.checker.getSymbolAtLocation(stmt.moduleSpecifier);
        if (symbol === undefined || symbol.valueDeclaration === undefined) {
          // No symbol could be found to skip over this import/export.
          continue;
        }
        const moduleFile = symbol.valueDeclaration;
        if (ts.isSourceFile(moduleFile) && isLocalFile(moduleFile)) {
          // Record this local import.
          imports.add(moduleFile);
        }
      }
      return imports;
    });
  }
}

function isLocalFile(sf: ts.SourceFile): boolean {
  return !sf.isDeclarationFile;
}

function isTypeOnlyImportClause(node: ts.ImportClause): boolean {
  // The clause itself is type-only (e.g. `import type {foo} from '...'`).
  if (node.isTypeOnly) {
    return true;
  }

  // All the specifiers in the cause are type-only (e.g. `import {type a, type b} from '...'`).
  if (node.namedBindings !== undefined && ts.isNamedImports(node.namedBindings) &&
      node.namedBindings.elements.every(specifier => specifier.isTypeOnly)) {
    return true;
  }

  return false;
}

/**
 * A helper class to track which SourceFiles are being processed when searching for a path in
 * `getPath()` above.
 *
 * 一个帮助器类，用于在上面的 `getPath()` 中搜索路径时跟踪正在处理的 SourceFiles。
 *
 */
class Found {
  constructor(readonly sourceFile: ts.SourceFile, readonly parent: Found|null) {}

  /**
   * Back track through this found SourceFile and its ancestors to generate an array of
   * SourceFiles that form am import path between two SourceFiles.
   *
   * 通过此找到的 SourceFile 及其祖先进行回溯，以生成一个 SourceFiles 数组，这些数组形成两个
   * SourceFile 之间的导入路径。
   *
   */
  toPath(): ts.SourceFile[] {
    const array: ts.SourceFile[] = [];
    let current: Found|null = this;
    while (current !== null) {
      array.push(current.sourceFile);
      current = current.parent;
    }
    // Pushing and then reversing, O(n), rather than unshifting repeatedly, O(n^2), avoids
    // manipulating the array on every iteration: https://stackoverflow.com/a/26370620
    return array.reverse();
  }
}
