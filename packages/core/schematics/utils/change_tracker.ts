/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ImportManager} from './import_manager';

/**
 * Function that can be used to remap a generated import.
 *
 * 可用于重新映射生成的导入的函数。
 *
 */
export type ImportRemapper = (moduleName: string, inFile: string) => string;

/**
 * Mapping between a source file and the changes that have to be applied to it.
 *
 * 源文件与必须对其应用的更改之间的映射。
 *
 */
export type ChangesByFile = ReadonlyMap<ts.SourceFile, PendingChange[]>;

/**
 * Change that needs to be applied to a file.
 *
 * 需要应用于文件的更改。
 *
 */
export interface PendingChange {
  /**
   * Index at which to start changing the file.
   *
   * 开始更改文件的索引。
   *
   */
  start: number;
  /**
   * Amount of text that should be removed after the `start`.
   * No text will be removed if omitted.
   *
   * `start` 后应删除的文本量。 如果省略，则不会删除任何文本。
   *
   */
  removeLength?: number;
  /**
   * New text that should be inserted.
   *
   * 应插入的新文本。
   *
   */
  text: string;
}

/**
 * Tracks changes that have to be made for specific files.
 *
 * 跟踪必须对特定文件进行的更改。
 *
 */
export class ChangeTracker {
  private readonly _changes = new Map<ts.SourceFile, PendingChange[]>();
  private readonly _importManager: ImportManager;

  constructor(private _printer: ts.Printer, private _importRemapper?: ImportRemapper) {
    this._importManager = new ImportManager(
        currentFile => ({
          addNewImport: (start, text) => this.insertText(currentFile, start, text),
          updateExistingImport: (namedBindings, text) => this.replaceText(
              currentFile, namedBindings.getStart(), namedBindings.getWidth(), text),
        }),
        this._printer);
  }

  /**
   * Tracks the insertion of some text.
   *
   * 跟踪一些文本的插入。
   *
   * @param sourceFile File in which the text is being inserted.
   *
   * 插入文本的文件。
   *
   * @param start Index at which the text is insert.
   *
   * 插入文本的索引。
   *
   * @param text Text to be inserted.
   *
   * 要插入的文本。
   *
   */
  insertText(sourceFile: ts.SourceFile, index: number, text: string): void {
    this._trackChange(sourceFile, {start: index, text});
  }

  /**
   * Replaces text within a file.
   *
   * 替换文件中的文本。
   *
   * @param sourceFile File in which to replace the text.
   *
   * 要替换文本的文件。
   *
   * @param start Index from which to replace the text.
   *
   * 从中替换文本的索引。
   *
   * @param removeLength Length of the text being replaced.
   *
   * 被替换文本的长度。
   *
   * @param text Text to be inserted instead of the old one.
   *
   * 要插入的文本而不是旧文本。
   *
   */
  replaceText(sourceFile: ts.SourceFile, start: number, removeLength: number, text: string): void {
    this._trackChange(sourceFile, {start, removeLength, text});
  }

  /**
   * Replaces the text of an AST node with a new one.
   *
   * 将 AST 节点的文本替换为新的文本。
   *
   * @param oldNode Node to be replaced.
   *
   * 要更换的节点。
   *
   * @param newNode New node to be inserted.
   *
   * 要插入的新节点。
   *
   * @param emitHint Hint when formatting the text of the new node.
   *
   * 格式化新节点的文本时提示。
   *
   * @param sourceFileWhenPrinting File to use when printing out the new node. This is important
   * when copying nodes from one file to another, because TypeScript might not output literal nodes
   * without it.
   *
   * 打印出新节点时要使用的文件。 这在将节点从一个文件复制到另一个文件时很重要，因为没有它，TypeScript 可能不会输出文字节点。
   *
   */
  replaceNode(
      oldNode: ts.Node, newNode: ts.Node, emitHint = ts.EmitHint.Unspecified,
      sourceFileWhenPrinting?: ts.SourceFile): void {
    const sourceFile = oldNode.getSourceFile();
    this.replaceText(
        sourceFile, oldNode.getStart(), oldNode.getWidth(),
        this._printer.printNode(emitHint, newNode, sourceFileWhenPrinting || sourceFile));
  }

  /**
   * Removes the text of an AST node from a file.
   *
   * 从文件中删除 AST 节点的文本。
   *
   * @param node Node whose text should be removed.
   *
   * 应删除其文本的节点。
   *
   */
  removeNode(node: ts.Node): void {
    this._trackChange(
        node.getSourceFile(), {start: node.getStart(), removeLength: node.getWidth(), text: ''});
  }

  /**
   * Adds an import to a file.
   *
   * 向文件添加导入。
   *
   * @param sourceFile File to which to add the import.
   *
   * 要向其添加导入的文件。
   *
   * @param symbolName Symbol being imported.
   *
   * 正在导入的符号。
   *
   * @param moduleName Module from which the symbol is imported.
   *
   * 从中导入符号的模块。
   *
   */
  addImport(
      sourceFile: ts.SourceFile, symbolName: string, moduleName: string,
      alias: string|null = null): ts.Expression {
    if (this._importRemapper) {
      moduleName = this._importRemapper(moduleName, sourceFile.fileName);
    }

    // It's common for paths to be manipulated with Node's `path` utilties which
    // can yield a path with back slashes. Normalize them since outputting such
    // paths will also cause TS to escape the forward slashes.
    moduleName = normalizePath(moduleName);

    return this._importManager.addImportToSourceFile(sourceFile, symbolName, moduleName, alias);
  }

  /**
   * Gets the changes that should be applied to all the files in the migration.
   * The changes are sorted in the order in which they should be applied.
   *
   * 获取应应用于迁移中所有文件的更改。 更改按应应用的顺序排序。
   *
   */
  recordChanges(): ChangesByFile {
    this._importManager.recordChanges();
    return this._changes;
  }

  /**
   * Adds a change to a `ChangesByFile` map.
   * @param file File that the change is associated with.
   * @param change Change to be added.
   */
  private _trackChange(file: ts.SourceFile, change: PendingChange): void {
    const changes = this._changes.get(file);

    if (changes) {
      // Insert the changes in reverse so that they're applied in reverse order.
      // This ensures that the offsets of subsequent changes aren't affected by
      // previous changes changing the file's text.
      const insertIndex = changes.findIndex(current => current.start <= change.start);

      if (insertIndex === -1) {
        changes.push(change);
      } else {
        changes.splice(insertIndex, 0, change);
      }
    } else {
      this._changes.set(file, [change]);
    }
  }
}

/**
 * Normalizes a path to use posix separators.
 *
 * 规范化路径以使用 posix 分隔符。
 *
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}
