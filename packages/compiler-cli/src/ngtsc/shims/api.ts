/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath} from '../file_system';

/**
 * Generates a single shim file for the entire program.
 *
 * 为整个程序生成单个 shim 文件。
 *
 */
export interface TopLevelShimGenerator {
  /**
   * Whether this shim should be emitted during TypeScript emit.
   *
   * 是否应在 TypeScript 发出期间发出此 shim。
   *
   */
  readonly shouldEmit: boolean;

  /**
   * Create a `ts.SourceFile` representing the shim, with the correct filename.
   *
   * 使用正确的文件名创建一个表示 shim 的 `ts.SourceFile` 。
   *
   */
  makeTopLevelShim(): ts.SourceFile;
}

/**
 * Generates a shim file for each original `ts.SourceFile` in the user's program, with a file
 * extension prefix.
 *
 * 为用户程序中的每个原始 `ts.SourceFile` 生成一个 shim 文件，带有文件扩展名前缀。
 *
 */
export interface PerFileShimGenerator {
  /**
   * The extension prefix which will be used for the shim.
   *
   * 将用于 shim 的扩展前缀。
   *
   * Knowing this allows the `ts.CompilerHost` implementation which is consuming this shim generator
   * to predict the shim filename, which is useful when a previous `ts.Program` already includes a
   * generated version of the shim.
   *
   * 知道这一点，可以让使用此 shim 生成器的 `ts.CompilerHost` 实现来预测 shim 文件名，这在以前的
   * `ts.Program` 已经包含生成的 shim 版本时会很有用。
   *
   */
  readonly extensionPrefix: string;

  /**
   * Whether shims produced by this generator should be emitted during TypeScript emit.
   *
   * 此生成器生成的 shim 是否应在 TypeScript 发出期间发出。
   *
   */
  readonly shouldEmit: boolean;

  /**
   * Generate the shim for a given original `ts.SourceFile`, with the given filename.
   *
   * 使用给定的文件名，为给定的原始 `ts.SourceFile` 生成 shim。
   *
   */
  generateShimForFile(
      sf: ts.SourceFile, genFilePath: AbsoluteFsPath,
      priorShimSf: ts.SourceFile|null): ts.SourceFile;
}

/**
 * Maintains a mapping of which symbols in a .ngfactory file have been used.
 *
 * 维护已使用 .ngfactory 文件中的哪些符号的映射。
 *
 * .ngfactory files are generated with one symbol per defined class in the source file, regardless
 * of whether the classes in the source files are NgModules (because that isn't known at the time
 * the factory files are generated). A `FactoryTracker` supports removing factory symbols which
 * didn't end up being NgModules, by tracking the ones which are.
 *
 * .ngfactory 文件的生成时，源文件中每个定义的类都有一个符号，无论源文件中的类是否是 NgModules
 * （因为在生成工厂文件时还不知道）。 `FactoryTracker` 支持通过跟踪最终不是 NgModules
 * 的工厂符号来删除它们。
 *
 */
export interface FactoryTracker {
  readonly sourceInfo: Map<string, FactoryInfo>;

  track(sf: ts.SourceFile, moduleInfo: ModuleInfo): void;
}

export interface FactoryInfo {
  sourceFilePath: string;
  moduleSymbols: Map<string, ModuleInfo>;
}

export interface ModuleInfo {
  name: string;
}
