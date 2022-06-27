/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript/lib/tsserverlibrary';

import {LanguageService} from '../../src/language_service';

/**
 * A file that is currently open in the `ts.Project`, with a cursor position.
 *
 * 当前在 `ts.Project` 中打开的文件，带有光标位置。
 *
 */
export class OpenBuffer {
  private _cursor: number = 0;

  constructor(
      private ngLS: LanguageService, private projectFileName: string,
      private scriptInfo: ts.server.ScriptInfo) {}

  get cursor(): number {
    return this._cursor;
  }

  get contents(): string {
    const snapshot = this.scriptInfo.getSnapshot();
    return snapshot.getText(0, snapshot.getLength());
  }

  set contents(newContents: string) {
    const snapshot = this.scriptInfo.getSnapshot();
    this.scriptInfo.editContent(0, snapshot.getLength(), newContents);
    // If the cursor goes beyond the new length of the buffer, clamp it to the end of the buffer.
    if (this._cursor > newContents.length) {
      this._cursor = newContents.length;
    }
  }

  /**
   * Find a snippet of text within the given buffer and position the cursor within it.
   *
   * 在给定的缓冲区中查找文本片段并将光标定位在其中。
   *
   * @param snippetWithCursor a snippet of text which contains the '¦' symbol, representing where
   *     the cursor should be placed within the snippet when located in the larger buffer.
   *
   * 包含 '¦' 符号的文本片段，表示当位于较大的缓冲区中时光标应该放在代码段中的位置。
   *
   */
  moveCursorToText(snippetWithCursor: string): void {
    const {text: snippet, cursor} = extractCursorInfo(snippetWithCursor);
    const snippetIndex = this.contents.indexOf(snippet);
    if (snippetIndex === -1) {
      throw new Error(`Snippet '${snippet}' not found in ${this.projectFileName}`);
    }
    if (this.contents.indexOf(snippet, snippetIndex + 1) !== -1) {
      throw new Error(`Snippet '${snippet}' is not unique within ${this.projectFileName}`);
    }
    this._cursor = snippetIndex + cursor;
  }

  /**
   * Execute the `getDefinitionAndBoundSpan` operation in the Language Service at the cursor
   * location in this buffer.
   *
   * 在此缓冲区中的光标位置处执行语言服务中的 `getDefinitionAndBoundSpan` 操作。
   *
   */
  getDefinitionAndBoundSpan(): ts.DefinitionInfoAndBoundSpan|undefined {
    return this.ngLS.getDefinitionAndBoundSpan(this.scriptInfo.fileName, this._cursor);
  }

  getCompletionsAtPosition(options?: ts.GetCompletionsAtPositionOptions):
      ts.WithMetadata<ts.CompletionInfo>|undefined {
    return this.ngLS.getCompletionsAtPosition(this.scriptInfo.fileName, this._cursor, options);
  }

  getCompletionEntryDetails(
      entryName: string, formatOptions?: ts.FormatCodeOptions|ts.FormatCodeSettings,
      preferences?: ts.UserPreferences, data?: ts.CompletionEntryData): ts.CompletionEntryDetails
      |undefined {
    return this.ngLS.getCompletionEntryDetails(
        this.scriptInfo.fileName, this._cursor, entryName, formatOptions, preferences, data);
  }

  getTcb() {
    return this.ngLS.getTcb(this.scriptInfo.fileName, this._cursor);
  }

  getTemplateLocationForComponent() {
    return this.ngLS.getTemplateLocationForComponent(this.scriptInfo.fileName, this._cursor);
  }

  getQuickInfoAtPosition() {
    return this.ngLS.getQuickInfoAtPosition(this.scriptInfo.fileName, this._cursor);
  }

  getTypeDefinitionAtPosition() {
    return this.ngLS.getTypeDefinitionAtPosition(this.scriptInfo.fileName, this._cursor);
  }

  getReferencesAtPosition() {
    return this.ngLS.getReferencesAtPosition(this.scriptInfo.fileName, this._cursor);
  }

  findRenameLocations() {
    return this.ngLS.findRenameLocations(this.scriptInfo.fileName, this._cursor);
  }

  getRenameInfo() {
    return this.ngLS.getRenameInfo(this.scriptInfo.fileName, this._cursor);
  }

  getSignatureHelpItems() {
    return this.ngLS.getSignatureHelpItems(this.scriptInfo.fileName, this._cursor);
  }
}

/**
 * Given a text snippet which contains exactly one cursor symbol ('¦'), extract both the offset of
 * that cursor within the text as well as the text snippet without the cursor.
 *
 * 给定一个正好包含一个光标符号 ('¦')
 * 的文本片段，请提取该光标在文本中的偏移量以及没有光标的文本片段。
 *
 */
function extractCursorInfo(textWithCursor: string): {cursor: number, text: string} {
  const cursor = textWithCursor.indexOf('¦');
  if (cursor === -1 || textWithCursor.indexOf('¦', cursor + 1) !== -1) {
    throw new Error(`Expected to find exactly one cursor symbol '¦'`);
  }

  return {
    cursor,
    text: textWithCursor.slice(0, cursor) + textWithCursor.slice(cursor + 1),
  };
}
