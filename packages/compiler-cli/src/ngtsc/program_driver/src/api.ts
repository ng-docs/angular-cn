/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';

export interface FileUpdate {
  /**
   * The source file text.
   *
   * 源文件文本。
   *
   */
  newText: string;

  /**
   * Represents the source file from the original program that is being updated. If the file update
   * targets a shim file then this is null, as shim files do not have an associated original file.
   *
   * 表示正在更新的原始程序中的源文件。如果文件更新的目标是 shim 文件，则为 null ，因为 shim
   * 文件没有关联的原始文件。
   *
   */
  originalFile: ts.SourceFile|null;
}

export const NgOriginalFile = Symbol('NgOriginalFile');

/**
 * If an updated file has an associated original source file, then the original source file
 * is attached to the updated file using the `NgOriginalFile` symbol.
 *
 * 如果更新后的文件有关联的原始源文件，则会使用 `NgOriginalFile`
 * 符号将原始源文件附加到更新后的文件。
 *
 */
export interface MaybeSourceFileWithOriginalFile extends ts.SourceFile {
  [NgOriginalFile]?: ts.SourceFile;
}

export interface ProgramDriver {
  /**
   * Whether this strategy supports modifying user files (inline modifications) in addition to
   * modifying type-checking shims.
   *
   * 除了修改类型检查填充程序之外，此策略是否支持修改用户文件（内联修改）。
   *
   */
  readonly supportsInlineOperations: boolean;

  /**
   * Retrieve the latest version of the program, containing all the updates made thus far.
   *
   * 检索最新版本的程序，包含迄今为止所做的所有更新。
   *
   */
  getProgram(): ts.Program;

  /**
   * Incorporate a set of changes to either augment or completely replace the type-checking code
   * included in the type-checking program.
   *
   * 合并一组更改以增加或完全替换类型检查程序中包含的类型检查代码。
   *
   */
  updateFiles(contents: Map<AbsoluteFsPath, FileUpdate>, updateMode: UpdateMode): void;

  /**
   * Retrieve a string version for a given `ts.SourceFile`, which much change when the contents of
   * the file have changed.
   *
   * 检索给定 `ts.SourceFile` 的字符串版本，当文件内容更改时，该版本会发生很大变化。
   *
   * If this method is present, the compiler will use these versions in addition to object identity
   * for `ts.SourceFile`s to determine what's changed between two incremental programs. This is
   * valuable for some clients (such as the Language Service) that treat `ts.SourceFile`s as mutable
   * objects.
   *
   * 如果存在此方法，编译器将使用这些版本以及 `ts.SourceFile` s
   * 的对象标识来确定两个增量程序之间发生的更改。这对于某些将 `ts.SourceFile`
   * 视为可变对象的客户端（例如语言服务）很有价值。
   *
   */
  getSourceFileVersion?(sf: ts.SourceFile): string;
}

export enum UpdateMode {
  /**
   * A complete update creates a completely new overlay of type-checking code on top of the user's
   * original program, which doesn't include type-checking code from previous calls to
   * `updateFiles`.
   *
   * 完整的更新会在用户的原始程序之上创建一个全新的类型检查代码覆盖，其中不包括以前对 `updateFiles`
   * 调用的类型检查代码。
   *
   */
  Complete,

  /**
   * An incremental update changes the contents of some files in the type-checking program without
   * reverting any prior changes.
   *
   * 增量更新会更改类型检查程序中某些文件的内容，而不恢复任何以前的更改。
   *
   */
  Incremental,
}
