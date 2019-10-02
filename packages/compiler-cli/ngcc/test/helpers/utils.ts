/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import {AbsoluteFsPath, NgtscCompilerHost, absoluteFrom, getFileSystem} from '../../../src/ngtsc/file_system';
import {TestFile} from '../../../src/ngtsc/file_system/testing';
import {BundleProgram, makeBundleProgram} from '../../src/packages/bundle_program';
import {EntryPoint, EntryPointFormat} from '../../src/packages/entry_point';
import {EntryPointBundle} from '../../src/packages/entry_point_bundle';
import {NgccSourcesCompilerHost} from '../../src/packages/ngcc_compiler_host';

export function makeTestEntryPoint(
    entryPointName: string, packageName: string = entryPointName): EntryPoint {
  return {
    name: entryPointName,
    packageJson: {name: entryPointName},
    package: absoluteFrom(`/node_modules/${packageName}`),
    path: absoluteFrom(`/node_modules/${entryPointName}`),
    typings: absoluteFrom(`/node_modules/${entryPointName}/index.d.ts`),
    compiledByAngular: true,
    ignoreMissingDependencies: false,
  };
}

/**
 *
 * @param format The format of the bundle.
 * @param files The source files to include in the bundle.
 * @param dtsFiles The typings files to include the bundle.
 */
export function makeTestEntryPointBundle(
    packageName: string, format: EntryPointFormat, isCore: boolean, srcRootNames: AbsoluteFsPath[],
    dtsRootNames?: AbsoluteFsPath[]): EntryPointBundle {
  const entryPoint = makeTestEntryPoint(packageName);
  const src = makeTestBundleProgram(srcRootNames[0], isCore);
  const dts =
      dtsRootNames ? makeTestDtsBundleProgram(dtsRootNames[0], entryPoint.package, isCore) : null;
  const isFlatCore = isCore && src.r3SymbolsFile === null;
  return {entryPoint, format, rootDirs: [absoluteFrom('/')], src, dts, isCore, isFlatCore};
}

export function makeTestBundleProgram(
    path: AbsoluteFsPath, isCore: boolean = false,
    additionalFiles?: AbsoluteFsPath[]): BundleProgram {
  const fs = getFileSystem();
  const entryPointPath = fs.dirname(path);
  const rootDir = fs.dirname(entryPointPath);
  const options: ts.CompilerOptions =
      {allowJs: true, maxNodeModuleJsDepth: Infinity, checkJs: false, rootDir, rootDirs: [rootDir]};
  const host = new NgccSourcesCompilerHost(fs, options, entryPointPath);
  return makeBundleProgram(
      fs, isCore, rootDir, path, 'r3_symbols.js', options, host, additionalFiles);
}

export function makeTestDtsBundleProgram(
    path: AbsoluteFsPath, packagePath: AbsoluteFsPath, isCore: boolean = false): BundleProgram {
  const fs = getFileSystem();
  const options = {};
  const host = new NgtscCompilerHost(fs, options);
  return makeBundleProgram(fs, isCore, packagePath, path, 'r3_symbols.d.ts', options, host);
}

export function convertToDirectTsLibImport(filesystem: TestFile[]) {
  return filesystem.map(file => {
    const contents =
        file.contents
            .replace(
                `import * as tslib_1 from 'tslib';`,
                `import { __decorate, __metadata, __read, __values, __param, __extends, __assign } from 'tslib';`)
            .replace(/tslib_1\./g, '');
    return {...file, contents};
  });
}

export function convertToInlineTsLib(filesystem: TestFile[], suffix: string = '') {
  return filesystem.map(file => {
    const contents = file.contents
                         .replace(`import * as tslib_1 from 'tslib';`, `
var __decorate${suffix} = null;
var __metadata${suffix} = null;
var __read${suffix} = null;
var __values${suffix} = null;
var __param${suffix} = null;
var __extends${suffix} = null;
var __assign${suffix} = null;
`).replace(/tslib_1\.([_a-z]+)/gi, '$1' + suffix.replace('$', '$$'));
    return {...file, contents};
  });
}

export function getRootFiles(testFiles: TestFile[]): AbsoluteFsPath[] {
  return testFiles.filter(f => f.isRoot !== false).map(f => absoluteFrom(f.name));
}
