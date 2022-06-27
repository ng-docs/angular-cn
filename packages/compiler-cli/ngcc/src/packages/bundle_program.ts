/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';

import {patchTsGetExpandoInitializer, restoreGetExpandoInitializer} from './patch_ts_expando_initializer';

/**
 * An entry point bundle contains one or two programs, e.g. `src` and `dts`,
 * that are compiled via TypeScript.
 *
 * 入口点包包含一个或两个通过 TypeScript 编译的程序，例如 `src` 和 `dts` 。
 *
 * To aid with processing the program, this interface exposes the program itself,
 * as well as path and TS file of the entry-point to the program and the r3Symbols
 * file, if appropriate.
 *
 * 为了帮助处理程序，此接口会公开程序本身，以及程序入口点的路径和 TS 文件以及 r3Symbols
 * 文件（如果适当）。
 *
 */
export interface BundleProgram {
  program: ts.Program;
  options: ts.CompilerOptions;
  host: ts.CompilerHost;
  path: AbsoluteFsPath;
  file: ts.SourceFile;
  package: AbsoluteFsPath;
  r3SymbolsPath: AbsoluteFsPath|null;
  r3SymbolsFile: ts.SourceFile|null;
}

/**
 * Create a bundle program.
 *
 * 创建一个包程序。
 *
 */
export function makeBundleProgram(
    fs: ReadonlyFileSystem, isCore: boolean, pkg: AbsoluteFsPath, path: AbsoluteFsPath,
    r3FileName: string, options: ts.CompilerOptions, host: ts.CompilerHost,
    additionalFiles: AbsoluteFsPath[] = []): BundleProgram {
  const r3SymbolsPath = isCore ? findR3SymbolsPath(fs, fs.dirname(path), r3FileName) : null;
  let rootPaths =
      r3SymbolsPath ? [path, r3SymbolsPath, ...additionalFiles] : [path, ...additionalFiles];

  const originalGetExpandoInitializer = patchTsGetExpandoInitializer();
  const program = ts.createProgram(rootPaths, options, host);
  // Ask for the typeChecker to trigger the binding phase of the compilation.
  // This will then exercise the patched function.
  program.getTypeChecker();
  restoreGetExpandoInitializer(originalGetExpandoInitializer);

  const file = program.getSourceFile(path)!;
  const r3SymbolsFile = r3SymbolsPath && program.getSourceFile(r3SymbolsPath) || null;

  return {program, options, host, package: pkg, path, file, r3SymbolsPath, r3SymbolsFile};
}

/**
 * Search the given directory hierarchy to find the path to the `r3_symbols` file.
 *
 * 搜索给定的目录层次结构以查找 `r3_symbols` 文件的路径。
 *
 */
export function findR3SymbolsPath(
    fs: ReadonlyFileSystem, directory: AbsoluteFsPath, filename: string): AbsoluteFsPath|null {
  const r3SymbolsFilePath = fs.resolve(directory, filename);
  if (fs.exists(r3SymbolsFilePath)) {
    return r3SymbolsFilePath;
  }

  const subDirectories =
      fs.readdir(directory)
          // Not interested in hidden files
          .filter(p => !p.startsWith('.'))
          // Ignore node_modules
          .filter(p => p !== 'node_modules')
          // Only interested in directories (and only those that are not symlinks)
          .filter(p => {
            const stat = fs.lstat(fs.resolve(directory, p));
            return stat.isDirectory() && !stat.isSymbolicLink();
          });

  for (const subDirectory of subDirectories) {
    const r3SymbolsFilePath = findR3SymbolsPath(fs, fs.resolve(directory, subDirectory), filename);
    if (r3SymbolsFilePath) {
      return r3SymbolsFilePath;
    }
  }

  return null;
}
