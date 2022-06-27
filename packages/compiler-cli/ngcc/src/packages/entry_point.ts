/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath, PathManipulation, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {parseStatementForUmdModule} from '../host/umd_host';
import {JsonObject, loadJson, loadSecondaryEntryPointInfoForApfV14, resolveFileWithPostfixes} from '../utils';

import {NgccConfiguration, NgccEntryPointConfig} from './configuration';

/**
 * The possible values for the format of an entry-point.
 *
 * 入口点格式的可能值。
 *
 */
export type EntryPointFormat = 'esm5'|'esm2015'|'umd'|'commonjs';

/**
 * An object containing information about an entry-point, including paths
 * to each of the possible entry-point formats.
 *
 * 包含有关入口点的信息的对象，包括每种可能的入口点格式的路径。
 *
 */
export interface EntryPoint extends JsonObject {
  /**
   * The name of the entry-point (e.g. `@angular/core` or `@angular/common/http`).
   *
   * 入口点的名称（例如 `@angular/core` 或 `@angular/common/http` ）。
   *
   */
  name: string;
  /**
   * The path to this entry point.
   *
   * 此入口点的路径。
   *
   */
  path: AbsoluteFsPath;
  /**
   * The name of the package that contains this entry-point (e.g. `@angular/core` or
   * `@angular/common`).
   *
   * 包含此入口点的包名（例如 `@angular/core` 或 `@angular/common` ）。
   *
   */
  packageName: string;
  /**
   * The path to the package that contains this entry-point.
   *
   * 包含此入口点的包的路径。
   *
   */
  packagePath: AbsoluteFsPath;
  /**
   * The URL of the repository.
   *
   * 存储库的 URL。
   *
   */
  repositoryUrl: string;
  /**
   * The parsed package.json file for this entry-point.
   *
   * 此入口点的解析后的 package.json 文件。
   *
   */
  packageJson: EntryPointPackageJson;
  /**
   * The path to a typings (.d.ts) file for this entry-point.
   *
   * 此入口点的 Typings (.d.ts) 文件的路径。
   *
   */
  typings: AbsoluteFsPath;
  /**
   * Is this EntryPoint compiled with the Angular View Engine compiler?
   *
   * 此 EntryPoint 是使用 Angular View Engine 编译器编译的吗？
   *
   */
  compiledByAngular: boolean;
  /**
   * Should ngcc ignore missing dependencies and process this entrypoint anyway?
   *
   * ngcc 是否应该忽略缺失的依赖项并处理此入口点？
   *
   */
  ignoreMissingDependencies: boolean;
  /**
   * Should ngcc generate deep re-exports for this entrypoint?
   *
   * ngcc 应该为此入口点生成深度再导出吗？
   *
   */
  generateDeepReexports: boolean;
}

export interface PackageJsonFormatPropertiesMap {
  browser?: string;
  fesm2015?: string;
  fesm5?: string;
  es2015?: string;  // if exists then it is actually FESM2015
  esm2015?: string;
  esm5?: string;
  main?: string;     // UMD
  module?: string;   // if exists then it is actually FESM5
  types?: string;    // Synonymous to `typings` property - see https://bit.ly/2OgWp2H
  typings?: string;  // TypeScript .d.ts files
}

export type PackageJsonFormatProperties = keyof PackageJsonFormatPropertiesMap;

/**
 * The properties that may be loaded from the `package.json` file.
 *
 * 可以从 `package.json` 文件加载的属性。
 *
 */
export interface EntryPointPackageJson extends JsonObject, PackageJsonFormatPropertiesMap {
  name: string;
  version?: string;
  scripts?: Record<string, string>;
  repository?: string|{url: string};
  __processed_by_ivy_ngcc__?: Record<string, string>;
}

export type EntryPointJsonProperty = Exclude<PackageJsonFormatProperties, 'types'|'typings'>;
// We need to keep the elements of this const and the `EntryPointJsonProperty` type in sync.
export const SUPPORTED_FORMAT_PROPERTIES: EntryPointJsonProperty[] =
    ['fesm2015', 'fesm5', 'es2015', 'esm2015', 'esm5', 'main', 'module', 'browser'];


/**
 * The path does not represent an entry-point, i.e. there is no package.json at the path and there
 * is no config to force an entry-point.
 *
 * 该路径不表示入口点，即路径中没有 package.json ，并且没有配置来强制使用入口点。
 *
 */
export const NO_ENTRY_POINT = 'no-entry-point';

/**
 * The path represents an entry-point that is `ignored` by an ngcc config.
 *
 * 该路径表示被 ngcc 配置 `ignored` 的入口点。
 *
 */
export const IGNORED_ENTRY_POINT = 'ignored-entry-point';

/**
 * The path has a package.json, but it is not a valid entry-point for ngcc processing.
 *
 * 该路径有一个 package.json ，但它不是 ngcc 处理的有效入口点。
 *
 */
export const INCOMPATIBLE_ENTRY_POINT = 'incompatible-entry-point';

/**
 * The result of calling `getEntryPointInfo()`.
 *
 * 调用 `getEntryPointInfo()` 的结果。
 *
 * This will be an `EntryPoint` object if an Angular entry-point was identified;
 * Otherwise it will be a flag indicating one of:
 *
 * 如果识别到了 Angular 入口点，这将是一个 `EntryPoint`
 * 对象；否则，它将是一个表明以下情况之一的标志：
 *
 * * NO_ENTRY_POINT - the path is not an entry-point or ngcc is configured to ignore it
 *
 *   NO_ENTRY_POINT - 路径不是入口点，或者 ngcc 配置为忽略它
 *
 * * INCOMPATIBLE_ENTRY_POINT - the path was a non-processable entry-point that should be searched
 *   for sub-entry-points
 *
 *   INCOMPATIBLE_ENTRY_POINT - 路径是不可处理的入口点，应该搜索子入口点
 *
 */
export type GetEntryPointResult =
    EntryPoint|typeof IGNORED_ENTRY_POINT|typeof INCOMPATIBLE_ENTRY_POINT|typeof NO_ENTRY_POINT;


/**
 * Try to create an entry-point from the given paths and properties.
 *
 * 尝试从给定的路径和属性创建一个入口点。
 *
 * @param packagePath the absolute path to the containing npm package
 *
 * 包含 npm 包的绝对路径
 *
 * @param entryPointPath the absolute path to the potential entry-point.
 *
 * 潜在入口点的绝对路径。
 *
 * @returns
 *
 * - An entry-point if it is valid and not ignored.
 *
 *   如果有效且未被忽略，则为入口点。
 *
 * - `NO_ENTRY_POINT` when there is no package.json at the path and there is no config to force an
 *   entry-point,
 *
 *   `NO_ENTRY_POINT` 当路径中没有 package.json 并且没有配置来强制使用入口点时，
 *
 * - `IGNORED_ENTRY_POINT` when the entry-point is ignored by an ngcc config.
 *
 *   当入口点被 ngcc 配置忽略时的 `IGNORED_ENTRY_POINT` 。
 *
 * - `INCOMPATIBLE_ENTRY_POINT` when there is a package.json but it is not a valid Angular compiled
 *   entry-point.
 *
 *   当有 package.json 但它不是有效的 Angular 编译入口点时，是 `INCOMPATIBLE_ENTRY_POINT` 。
 *
 */
export function getEntryPointInfo(
    fs: ReadonlyFileSystem, config: NgccConfiguration, logger: Logger, packagePath: AbsoluteFsPath,
    entryPointPath: AbsoluteFsPath): GetEntryPointResult {
  const packagePackageJsonPath = fs.resolve(packagePath, 'package.json');
  const entryPointPackageJsonPath = fs.resolve(entryPointPath, 'package.json');
  const loadedPackagePackageJson = loadJson<EntryPointPackageJson>(fs, packagePackageJsonPath);
  const loadedEntryPointPackageJson = (packagePackageJsonPath === entryPointPackageJsonPath) ?
      loadedPackagePackageJson :
      loadOrSynthesizeSecondaryPackageJson(
          fs, packagePath, entryPointPath, entryPointPackageJsonPath, loadedPackagePackageJson);
  const {packageName, packageVersion} = getPackageNameAndVersion(
      fs, packagePath, loadedPackagePackageJson, loadedEntryPointPackageJson);
  const repositoryUrl = getRepositoryUrl(loadedPackagePackageJson);

  const packageConfig = config.getPackageConfig(packageName, packagePath, packageVersion);
  const entryPointConfig = packageConfig.entryPoints.get(entryPointPath);
  let entryPointPackageJson: EntryPointPackageJson;

  if (entryPointConfig === undefined) {
    if (loadedEntryPointPackageJson !== null) {
      entryPointPackageJson = loadedEntryPointPackageJson;
    } else if (!fs.exists(entryPointPackageJsonPath)) {
      // No entry-point `package.json` or package `package.json` with exports and no config.
      return NO_ENTRY_POINT;
    } else {
      // `package.json` exists but could not be parsed and there is no redeeming config.
      logger.warn(`Failed to read entry point info from invalid 'package.json' file: ${
          entryPointPackageJsonPath}`);

      return INCOMPATIBLE_ENTRY_POINT;
    }
  } else if (entryPointConfig.ignore === true) {
    // Explicitly ignored entry-point.
    return IGNORED_ENTRY_POINT;
  } else {
    entryPointPackageJson = mergeConfigAndPackageJson(
        fs, loadedEntryPointPackageJson, entryPointConfig, packagePath, entryPointPath);
  }

  const typings = entryPointPackageJson.typings || entryPointPackageJson.types ||
      guessTypingsFromPackageJson(fs, entryPointPath, entryPointPackageJson);
  if (typeof typings !== 'string') {
    // Missing the required `typings` property
    return INCOMPATIBLE_ENTRY_POINT;
  }

  // An entry-point is assumed to be compiled by Angular if there is either:
  // * a `metadata.json` file next to the typings entry-point
  // * a custom config for this entry-point
  const metadataPath =
      fs.resolve(entryPointPath, typings.replace(/\.d\.ts$/, '') + '.metadata.json');
  const compiledByAngular = entryPointConfig !== undefined || fs.exists(metadataPath);

  const entryPointInfo: EntryPoint = {
    name: entryPointPackageJson.name,
    path: entryPointPath,
    packageName,
    packagePath,
    repositoryUrl,
    packageJson: entryPointPackageJson,
    typings: fs.resolve(entryPointPath, typings),
    compiledByAngular,
    ignoreMissingDependencies:
        entryPointConfig !== undefined ? !!entryPointConfig.ignoreMissingDependencies : false,
    generateDeepReexports:
        entryPointConfig !== undefined ? !!entryPointConfig.generateDeepReexports : false,
  };

  return entryPointInfo;
}

export function isEntryPoint(result: GetEntryPointResult): result is EntryPoint {
  return result !== NO_ENTRY_POINT && result !== INCOMPATIBLE_ENTRY_POINT &&
      result !== IGNORED_ENTRY_POINT;
}

/**
 * Convert a package.json property into an entry-point format.
 *
 * 将 package.json 属性转换为入口点格式。
 *
 * @param property The property to convert to a format.
 *
 * 要转换为格式的属性。
 *
 * @returns
 *
 * An entry-point format or `undefined` if none match the given property.
 *
 * 入口点格式，如果不匹配给定属性，则为 `undefined` 。
 *
 */
export function getEntryPointFormat(
    fs: ReadonlyFileSystem, entryPoint: EntryPoint,
    property: EntryPointJsonProperty): EntryPointFormat|undefined {
  switch (property) {
    case 'fesm2015':
      return 'esm2015';
    case 'fesm5':
      return 'esm5';
    case 'es2015':
      return 'esm2015';
    case 'esm2015':
      return 'esm2015';
    case 'esm5':
      return 'esm5';
    case 'browser':
      const browserFile = entryPoint.packageJson['browser'];
      if (typeof browserFile !== 'string') {
        return undefined;
      }
      return sniffModuleFormat(fs, fs.join(entryPoint.path, browserFile));
    case 'main':
      const mainFile = entryPoint.packageJson['main'];
      if (mainFile === undefined) {
        return undefined;
      }
      return sniffModuleFormat(fs, fs.join(entryPoint.path, mainFile));
    case 'module':
      const moduleFilePath = entryPoint.packageJson['module'];
      // As of version 10, the `module` property in `package.json` should point to
      // the ESM2015 format output as per Angular Package format specification. This
      // means that the `module` property captures multiple formats, as old libraries
      // built with the old APF can still be processed. We detect the format by checking
      // the paths that should be used as per APF specification.
      if (typeof moduleFilePath === 'string' && moduleFilePath.includes('esm2015')) {
        return `esm2015`;
      }
      return 'esm5';
    default:
      return undefined;
  }
}

/**
 * Parse the JSON from a secondary `package.json` file. If no such file exists, look for a
 * corresponding entry in the primary `package.json` file's `exports` property (if any) and
 * synthesize the JSON from that.
 *
 * 从辅助 `package.json` 文件解析 JSON。如果不存在这样的文件，请在主 `package.json` 文件的 `exports`
 * 属性（如果有）中查找对应的条目，并从中合成 JSON。
 *
 * @param packagePath The absolute path to the containing npm package.
 *
 * 包含 npm 包的绝对路径。
 *
 * @param entryPointPath The absolute path to the secondary entry-point.
 *
 * 辅助入口点的绝对路径。
 *
 * @param secondaryPackageJsonPath The absolute path to the secondary `package.json` file.
 *
 * 辅助 `package.json` 文件的绝对路径。
 *
 * @param primaryPackageJson The parsed JSON of the primary `package.json` (or `null` if it failed
 *     to be loaded).
 *
 * 主要 `package.json` 的解析后的 JSON（如果加载失败，则为 `null` ）。
 *
 * @returns
 *
 * Parsed JSON (either loaded from a secondary `package.json` file or synthesized from a
 *     primary one) if it is valid, `null` otherwise.
 *
 * 如果有效，则解析 JSON（从辅助 `package.json` 文件加载或从主要文件合成），否则为 `null` 。
 *
 */
function loadOrSynthesizeSecondaryPackageJson(
    fs: ReadonlyFileSystem, packagePath: AbsoluteFsPath, entryPointPath: AbsoluteFsPath,
    secondaryPackageJsonPath: AbsoluteFsPath,
    primaryPackageJson: EntryPointPackageJson|null): EntryPointPackageJson|null {
  // If a secondary `package.json` exists and is valid, load and return that.
  const loadedPackageJson = loadJson<EntryPointPackageJson>(fs, secondaryPackageJsonPath);
  if (loadedPackageJson !== null) {
    return loadedPackageJson;
  }

  // Try to load the entry-point info from the primary `package.json` data.
  const entryPointInfo =
      loadSecondaryEntryPointInfoForApfV14(fs, primaryPackageJson, packagePath, entryPointPath);
  if (entryPointInfo === null) {
    return null;
  }

  // Create a synthesized `package.json`.
  //
  // NOTE:
  // We do not care about being able to update the synthesized `package.json` (for example, updating
  // its `__processed_by_ivy_ngcc__` property), because these packages are generated with Angular
  // v14+ (following the Angular Package Format v14+) and thus are already in Ivy format and do not
  // require processing by `ngcc`.
  const synthesizedPackageJson: EntryPointPackageJson = {
    synthesized: true,
    name: `${primaryPackageJson!.name}/${fs.relative(packagePath, entryPointPath)}`,
  };

  // Update the synthesized `package.json` with any of the supported format and types properties,
  // changing paths to make them relative to the entry-point directory. This makes the synthesized
  // `package.json` similar to how a `package.json` inside the entry-point directory would look
  // like.
  for (const prop of [...SUPPORTED_FORMAT_PROPERTIES, 'types', 'typings']) {
    const packageRelativePath = entryPointInfo[prop];

    if (typeof packageRelativePath === 'string') {
      const absolutePath = fs.resolve(packagePath, packageRelativePath);
      const entryPointRelativePath = fs.relative(entryPointPath, absolutePath);
      synthesizedPackageJson[prop] =
          (fs.isRooted(entryPointRelativePath) || entryPointRelativePath.startsWith('.')) ?
          entryPointRelativePath :
          `./${entryPointRelativePath}`;
    }
  }

  // Return the synthesized JSON.
  return synthesizedPackageJson;
}

function sniffModuleFormat(
    fs: ReadonlyFileSystem, sourceFilePath: AbsoluteFsPath): EntryPointFormat|undefined {
  const resolvedPath = resolveFileWithPostfixes(fs, sourceFilePath, ['', '.js', '/index.js']);
  if (resolvedPath === null) {
    return undefined;
  }

  const sourceFile =
      ts.createSourceFile(sourceFilePath, fs.readFile(resolvedPath), ts.ScriptTarget.ES5);
  if (sourceFile.statements.length === 0) {
    return undefined;
  }
  if (ts.isExternalModule(sourceFile)) {
    return 'esm5';
  } else if (parseStatementForUmdModule(sourceFile.statements[0]) !== null) {
    return 'umd';
  } else {
    return 'commonjs';
  }
}

function mergeConfigAndPackageJson(
    fs: PathManipulation, entryPointPackageJson: EntryPointPackageJson|null,
    entryPointConfig: NgccEntryPointConfig, packagePath: AbsoluteFsPath,
    entryPointPath: AbsoluteFsPath): EntryPointPackageJson {
  if (entryPointPackageJson !== null) {
    return {...entryPointPackageJson, ...entryPointConfig.override};
  } else {
    const name = `${fs.basename(packagePath)}/${fs.relative(packagePath, entryPointPath)}`;
    return {name, ...entryPointConfig.override};
  }
}

function guessTypingsFromPackageJson(
    fs: ReadonlyFileSystem, entryPointPath: AbsoluteFsPath,
    entryPointPackageJson: EntryPointPackageJson): AbsoluteFsPath|null {
  for (const prop of SUPPORTED_FORMAT_PROPERTIES) {
    const field = entryPointPackageJson[prop];
    if (typeof field !== 'string') {
      // Some crazy packages have things like arrays in these fields!
      continue;
    }
    const relativeTypingsPath = field.replace(/\.js$/, '.d.ts');
    const typingsPath = fs.resolve(entryPointPath, relativeTypingsPath);
    if (fs.exists(typingsPath)) {
      return typingsPath;
    }
  }
  return null;
}

/**
 * Find or infer the name and version of a package.
 *
 * 查找或推断包的名称和版本。
 *
 * - The name is computed based on the `name` property of the package's or the entry-point's
 *   `package.json` file (if available) or inferred from the package's path.
 *
 *   该名称是根据包的 `name` 属性或入口点的 `package.json`
 * 文件（如果可用）计算的，或从包的路径推断出来的。
 *
 * - The version is read off of the `version` property of the package's `package.json` file (if
 *   available).
 *
 *   版本是从包的 `package.json` 文件的 `version` 属性（如果可用）中读取的。
 *
 * @param fs The file-system to use for processing `packagePath`.
 *
 * 用于处理 `packagePath` 的文件系统。
 *
 * @param packagePath the absolute path to the package.
 *
 * 包的绝对路径。
 *
 * @param packagePackageJson the parsed `package.json` of the package (if available).
 *
 * 包的解析后的 `package.json` （如果可用）。
 *
 * @param entryPointPackageJson the parsed `package.json` of an entry-point (if available).
 *
 * 入口点的解析后的 `package.json` （如果可用）。
 *
 * @returns
 *
 * the computed name and version of the package.
 *
 * 包的计算名称和版本。
 *
 */
function getPackageNameAndVersion(
    fs: PathManipulation, packagePath: AbsoluteFsPath,
    packagePackageJson: EntryPointPackageJson|null,
    entryPointPackageJson: EntryPointPackageJson|
    null): {packageName: string, packageVersion: string|null} {
  let packageName: string;

  if (packagePackageJson !== null) {
    // We have a valid `package.json` for the package: Get the package name from that.
    packageName = packagePackageJson.name;
  } else if (entryPointPackageJson !== null) {
    // We have a valid `package.json` for the entry-point: Get the package name from that.
    // This might be a secondary entry-point, so make sure we only keep the main package's name
    // (e.g. only keep `@angular/common` from `@angular/common/http`).
    packageName = /^(?:@[^/]+\/)?[^/]*/.exec(entryPointPackageJson.name)![0];
  } else {
    // We don't have a valid `package.json`: Infer the package name from the package's path.
    const lastSegment = fs.basename(packagePath);
    const secondLastSegment = fs.basename(fs.dirname(packagePath));

    packageName =
        secondLastSegment.startsWith('@') ? `${secondLastSegment}/${lastSegment}` : lastSegment;
  }

  return {
    packageName,
    packageVersion: packagePackageJson?.version ?? null,
  };
}

/**
 * Extract the URL of the repository associated with an entry-point
 *
 * 提取与入口点关联的存储库的 URL
 *
 */
function getRepositoryUrl(packageJson: EntryPointPackageJson|null): string {
  if (packageJson?.repository === undefined) {
    return '';
  }
  if (typeof packageJson.repository === 'string') {
    return packageJson.repository;
  }
  return packageJson.repository.url;
}
