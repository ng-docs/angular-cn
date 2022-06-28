/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath, FileSystem, PathManipulation, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {initMockFileSystem} from '../../../src/ngtsc/file_system/testing';
import {loadStandardTestFiles, loadTestDirectory, NgtscTestCompilerHost} from '../../../src/ngtsc/testing';
import {performCompilation} from '../../../src/perform_compile';
import {CompilerOptions} from '../../../src/transformers/api';

import {ConfigOptions} from './get_compliance_tests';

/**
 * Setup a mock file-system that is used to generate the partial files.
 *
 * 设置一个用于生成部分文件的模拟文件系统。
 *
 * @param realTestPath Absolute path (on the real file-system) to the test case being processed.
 *
 * 正在处理的测试用例的绝对路径（在真实文件系统上）。
 *
 * @returns
 *
 * a mock file-system containing the test case files.
 *
 * 包含测试用例文件的模拟文件系统。
 *
 */
export function initMockTestFileSystem(realTestPath: AbsoluteFsPath): FileSystem {
  const fs = initMockFileSystem('Native');
  const testFiles = loadStandardTestFiles();
  fs.init(testFiles);
  loadTestDirectory(fs, realTestPath, getRootDirectory(fs));
  monkeyPatchReadFile(fs);
  return fs;
}

/**
 * The result of compiling a test-case.
 *
 * 编译测试用例的结果。
 *
 */
export interface CompileResult {
  emittedFiles: AbsoluteFsPath[];
  errors: string[];
}

/**
 * Compile the input source `files` stored in `fs`, writing the generated files to `fs`.
 *
 * 编译存储在 `fs` 中的输入源 `files` ，将生成的文件写入 `fs` 。
 *
 * @param fs The mock file-system where the input and generated files live.
 *
 * 输入和生成文件所在的模拟文件系统。
 *
 * @param files An array of paths (relative to the testPath) of input files to be compiled.
 *
 * 要编译的输入文件的路径数组（相对于 testPath）。
 *
 * @param compilerOptions Any extra options to pass to the TypeScript compiler.
 *
 * 要传递给 TypeScript 编译器的任何额外选项。
 *
 * @param angularCompilerOptions Any extra options to pass to the Angular compiler.
 *
 * 要传递给 Angular 编译器的任何额外选项。
 *
 * @returns
 *
 * A collection of paths of the generated files (absolute within the mock file-system).
 *
 * 生成的文件的路径集合（在模拟文件系统中）。
 *
 */
export function compileTest(
    fs: FileSystem, files: string[], compilerOptions: ConfigOptions|undefined,
    angularCompilerOptions: ConfigOptions|undefined): CompileResult {
  const rootDir = getRootDirectory(fs);
  const outDir = getBuildOutputDirectory(fs);
  const options = getOptions(rootDir, outDir, compilerOptions, angularCompilerOptions);
  const rootNames = files.map(f => fs.resolve(f));
  const host = new NgtscTestCompilerHost(fs, options);
  const {diagnostics, emitResult} = performCompilation({rootNames, host, options});
  const emittedFiles = emitResult ? emitResult.emittedFiles!.map(p => fs.resolve(rootDir, p)) : [];
  const errors = parseDiagnostics(diagnostics);
  return {errors, emittedFiles};
}

/**
 * Gets an absolute path (in the mock file-system) of the root directory where the compilation is to
 * be done.
 *
 * 获取要在其中完成编译的根目录的绝对路径（在模拟文件系统中）。
 *
 * @param fs the mock file-system where the compilation is happening.
 *
 * 发生编译的模拟文件系统。
 *
 */
export function getRootDirectory(fs: PathManipulation): AbsoluteFsPath {
  return fs.resolve('/');
}

/**
 * Gets an absolute path (in the mock file-system) of the directory where the compiled files are
 * stored.
 *
 * 获取存储已编译文件的目录的绝对路径（在模拟文件系统中）。
 *
 * @param fs the mock file-system where the compilation is happening.
 *
 * 发生编译的模拟文件系统。
 *
 */
export function getBuildOutputDirectory(fs: PathManipulation): AbsoluteFsPath {
  return fs.resolve('/built');
}

/**
 * Get the options object to pass to the compiler.
 *
 * 获取要传递给编译器的 options 对象。
 *
 * @param rootDir The absolute path (within the mock file-system) that is the root of the
 *     compilation.
 *
 * 作为编译的根的绝对路径（在模拟文件系统中）。
 *
 * @param outDir The absolute path (within the mock file-system) where compiled files will be
 *     written.
 *
 * 将写入已编译文件的绝对路径（在模拟文件系统中）。
 *
 * @param compilerOptions Additional options for the TypeScript compiler.
 *
 * TypeScript 编译器的其他选项。
 *
 * @param angularCompilerOptions Additional options for the Angular compiler.
 *
 * Angular 编译器的其他选项。
 *
 */
function getOptions(
    rootDir: AbsoluteFsPath, outDir: AbsoluteFsPath, compilerOptions: ConfigOptions|undefined,
    angularCompilerOptions: ConfigOptions|undefined): CompilerOptions {
  const convertedCompilerOptions = ts.convertCompilerOptionsFromJson(compilerOptions, rootDir);
  if (convertedCompilerOptions.errors.length > 0) {
    throw new Error(
        'Invalid compilerOptions in test-case::\n' +
        convertedCompilerOptions.errors.map(d => d.messageText).join('\n'));
  }
  return {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    skipLibCheck: true,
    noImplicitAny: true,
    noEmitOnError: true,
    listEmittedFiles: true,
    strictNullChecks: true,
    outDir,
    rootDir,
    baseUrl: '.',
    allowJs: true,
    declaration: true,
    target: ts.ScriptTarget.ES2015,
    newLine: ts.NewLineKind.LineFeed,
    module: ts.ModuleKind.ES2015,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    typeRoots: ['node_modules/@types'],
    ...convertedCompilerOptions.options,
    enableIvy: true,
    enableI18nLegacyMessageIdFormat: false,
    ...angularCompilerOptions,
  };
}

/**
 * Replace escaped line-ending markers (\\r\\n) with real line-ending characters.
 *
 * 将转义的行结尾标记 ( \\r\\n ) 替换为真实的行结尾字符。
 *
 * This allows us to simulate, more reliably, files that have `\r\n` line-endings.
 * (See `test_cases/r3_view_compiler_i18n/line_ending_normalization/template.html`.)
 *
 * 这允许我们更可靠地模拟具有 `\r\n` 行结尾的文件。（请参阅
 * `test_cases/r3_view_compiler_i18n/line_ending_normalization/template.html` 。）
 *
 */
function monkeyPatchReadFile(fs: ReadonlyFileSystem): void {
  const originalReadFile = fs.readFile;
  fs.readFile = (path: AbsoluteFsPath): string => {
    const file = originalReadFile.call(fs, path);
    return file
        // First convert actual `\r\n` sequences to `\n`
        .replace(/\r\n/g, '\n')
        // unescape `\r\n` at the end of a line
        .replace(/\\r\\n\n/g, '\r\n')
        // unescape `\\r\\n`, at the end of a line, to `\r\n`
        .replace(/\\\\r\\\\n(\r?\n)/g, '\\r\\n$1');
  };
}

/**
 * Parse the `diagnostics` to extract an error message string.
 *
 * 解析 `diagnostics` 信息以提取错误消息字符串。
 *
 * The error message includes the location if available.
 *
 * 错误消息包括位置（如果可用）。
 *
 * @param diagnostics The diagnostics to parse.
 *
 * 要解析的诊断信息。
 *
 */
function parseDiagnostics(diagnostics: readonly ts.Diagnostic[]): string[] {
  return diagnostics.map(diagnostic => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if ('file' in diagnostic && diagnostic.file !== undefined && diagnostic.start !== undefined) {
      const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
    } else {
      return message;
    }
  });
}
