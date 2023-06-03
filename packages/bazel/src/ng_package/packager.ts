/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface describing a file captured in the Bazel action.
 * https://docs.bazel.build/versions/main/skylark/lib/File.html.
 *
 * 描述在 Bazel 操作中捕获的文件的接口。
 * https://docs.bazel.build/versions/main/skylark/lib/File.html 。
 *
 */
interface BazelFileInfo {
  /**
   * Execroot-relative path pointing to the file.
   *
   * 指向文件的 Execroot 相对路径。
   *
   */
  path: string;
  /**
   * The path of this file relative to its root. e.g. omitting `bazel-out/<..>/bin`.
   *
   * 此文件相对于其根目录的路径。例如，省略 `bazel-out/<..>/bin` 。
   *
   */
  shortPath: string;
}

/**
 * Interface describing an entry-point.
 *
 * 描述入口点的接口。
 *
 */
interface EntryPointInfo {
  /**
   * ES2022 index file for the APF entry-point.
   *
   * APF 入口点的 ES2022 索引文件。
   *
   */
  index: BazelFileInfo;
  /**
   * Flat ES2022 ES module bundle file.
   *
   * 平面 ES2022 ES 模块包文件。
   *
   */
  fesm2022Bundle: BazelFileInfo;
  /**
   * Flat ES2015 ES module bundle file.
   *
   * 平面 ES2015 ES 模块包文件。
   *
   */
  fesm2015Bundle: BazelFileInfo;
  /**
   * Index type definition file for the APF entry-point.
   *
   * APF 入口点的索引类型定义文件。
   *
   */
  typings: BazelFileInfo;
  /**
   * Whether the index or typing paths have been guessed. For entry-points built
   * through `ts_library`, there is no explicit setting that declares the entry-point
   * so the index file is guessed.
   *
   * 是否已猜测到索引或键入路径。对于通过 `ts_library`
   * 构建的入口点，没有显式设置来声明入口点，因此会猜测索引文件。
   *
   */
  guessedPaths: boolean;
}

/**
 * Interface capturing relevant metadata for packaging.
 *
 * 捕获相关元数据以进行打包的接口。
 *
 */
interface PackageMetadata {
  /**
   * NPM package name of the output.
   *
   * 输出的 NPM 包名称。
   *
   */
  npmPackageName: string;
  /**
   * Record of entry-points \(including the primary one\) and their info.
   *
   * 入口点（包括主要入口点）及其信息的记录。
   *
   */
  entryPoints: Record<string, EntryPointInfo>;
}

/**
 * List of known `package.json` fields which provide information about
 * supported package formats and their associated entry paths.
 *
 * 已知的 `package.json` 字段的列表，这些字段提供有关受支持的包格式及其关联的条目路径的信息。
 *
 */
const knownFormatPackageJsonFormatFields = [
  'main',
  'esm2022',
  'esm',
  'typings',
  'module',
] as const;

/**
 * Union type matching known `package.json` format fields.
 *
 * 与已知 `package.json` 格式字段匹配的联合类型。
 *
 */
type KnownPackageJsonFormatFields = typeof knownFormatPackageJsonFormatFields[number];

/**
 * Type describing the conditional exports descriptor for an entry-point.
 * https://nodejs.org/api/packages.html#packages_conditional_exports
 *
 * 描述入口点的条件导出描述符的类型。
 * https://nodejs.org/api/packages.html#packages_conditional_exports
 *
 */
type ConditionalExport = {
  types?: string;
  esm2022?: string;
  esm?: string;
  default?: string;
};

/**
 * Type describing a `package.json` the packager deals with.
 *
 * 描述打包器处理的 `package.json` 的类型。
 *
 */
type PackageJson = {
  [key in KnownPackageJsonFormatFields]?: string;
}&{
  name: string;
  type?: string;
  exports?: Record<string, ConditionalExport>;
};

// Main entry-point.
main(process.argv.slice(2));

function main(args: string[]): void {
  // This utility expects all of its arguments to be specified in a params file generated by
  // bazel (see https://docs.bazel.build/versions/master/skylark/lib/Args.html#use_param_file).
  const paramFilePath = args[0];

  // Bazel params may be surrounded with quotes
  function unquoteParameter(s: string) {
    return s.replace(/^'(.*)'$/, '$1');
  }

  // Parameters are specified in the file one per line.
  const params = fs.readFileSync(paramFilePath, 'utf-8').split('\n').map(unquoteParameter);

  const [
      // Output directory for the npm package.
      outputDirExecPath,

      // The package segment of the ng_package rule's label (e.g. 'package/common').
      owningPackageName,

      // JSON data capturing metadata of the package being built. See `PackageMetadata`.
      metadataArg,

      // Path to the package's README.md.
      readmeMd,

      // List of rolled-up flat ES2022 modules
      fesm2022Arg,

      // List of individual ES2022 modules
      esm2022Arg,

      // List of static files that should be copied into the package.
      staticFilesArg,

      // List of all type definitions that need to packaged into the ng_package.
      typeDefinitionsArg,
  ] = params;

  const fesm2022 = JSON.parse(fesm2022Arg) as BazelFileInfo[];
  const esm2022 = JSON.parse(esm2022Arg) as BazelFileInfo[];
  const typeDefinitions = JSON.parse(typeDefinitionsArg) as BazelFileInfo[];
  const staticFiles = JSON.parse(staticFilesArg) as BazelFileInfo[];
  const metadata = JSON.parse(metadataArg) as PackageMetadata;

  if (readmeMd) {
    copyFile(readmeMd, 'README.md');
  }

  /**
   * Writes a file with the specified content into the package output.
   *
   * 将具有指定内容的文件写入包输出。
   *
   * @param outputRelativePath Relative path in the output directory where the
   *   file is written to.
   *
   * 写入文件的输出目录中的相对路径。
   *
   * @param fileContent Content of the file.
   *
   * 文件的内容。
   *
   */
  function writeFile(outputRelativePath: string, fileContent: string|Buffer) {
    const outputPath = path.join(outputDirExecPath, outputRelativePath);

    // Always ensure that the target directory exists.
    fs.mkdirSync(path.dirname(outputPath), {recursive: true});
    fs.writeFileSync(outputPath, fileContent);
  }

  /**
   * Copies a file into the package output to the specified location.
   *
   * 将文件复制到包输出中的指定位置。
   *
   * @param inputPath File that should be copied.
   *
   * 应该复制的文件。
   *
   * @param outputRelativePath Relative path in the output directory where the
   *   file is written to.
   *
   * 写入文件的输出目录中的相对路径。
   *
   */
  function copyFile(inputPath: string, outputRelativePath: string) {
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    writeFile(outputRelativePath, fileContent);
  }

  /**
   * Gets the relative path for the given file within the owning package. This
   * assumes the file is contained in the owning package.
   *
   * 获取给定文件在所属包中的相对路径。这假定文件包含在拥有的包中。
   *
   * e.g. consider the owning package is `packages/core` and the input file
   * is `packages/core/testing/index.d.ts`. This function would return the
   * relative path as followed: `testing/index.d.ts`.
   *
   * 例如，考虑拥有的包是 `packages/core` ，输入文件是 `packages/core/testing/index.d.ts`
   * 。此函数将返回相对路径： `testing/index.d.ts` 。
   *
   */
  function getOwningPackageRelativePath(file: BazelFileInfo): string {
    return path.relative(owningPackageName, file.shortPath);
  }

  /**
   * Writes an ESM file into the `esm2022` output directory.
   *
   * 将 ESM 文件写入 `esm2022` 输出目录。
   *
   */
  function writeEsm2022File(file: BazelFileInfo) {
    // Note: files which do not belong to the owning package of this `ng_package` are omitted.
    // this prevents us from accidentally bringing in transitive node module dependencies.
    const packageRelativePath = getOwningPackageRelativePath(file);
    if (!packageRelativePath.startsWith('..')) {
      copyFile(file.path, getEsm2022OutputRelativePath(file));
    }
  }

  /**
   * Gets the output-relative path where the given flat ESM file should be written to.
   *
   * 获取应写入给定平面 ESM 文件的输出相对路径。
   *
   */
  function getFlatEsmOutputRelativePath(file: BazelFileInfo) {
    // Flat ESM files should be put into their owning package relative sub-path. e.g. if
    // there is a bundle in `packages/animations/fesm2022/browser/testing.mjs` then we
    // want the bundle to be stored in `fesm2022/browser/testing.mjs`. Same thing applies
    // for the `fesm2022` bundles. The directory name for `fesm` is already declared as
    // part of the Bazel action generating these files. See `ng_package.bzl`.
    return getOwningPackageRelativePath(file);
  }

  /**
   * Gets the output-relative path where a non-flat ESM2022 file should be written to.
   *
   * 获取应写入非平面 ESM2022 文件的输出相对路径。
   *
   */
  function getEsm2022OutputRelativePath(file: BazelFileInfo) {
    // Path computed relative to the current package in bazel-bin. e.g. a ES2022 output file
    // in `bazel-out/<..>/packages/core/src/di.mjs` should be stored in `esm2022/src/di.mjs`.
    return path.join('esm2022', getOwningPackageRelativePath(file));
  }

  /**
   * Gets the output-relative path where the typing file is being written to.
   *
   * 获取要写入键入文件的输出相对路径。
   *
   */
  function getTypingOutputRelativePath(file: BazelFileInfo) {
    // Type definitions are intended to be copied into the package output while preserving the
    // sub-path from the owning package. e.g. a file like `packages/animations/browser/__index.d.ts`
    // will end up being written to `<pkg-out>/browser/index.d.ts`. Note that types are bundled
    // as a separate action in the `ng_package` Starlark rule and prefixed with `__` to avoid
    // conflicts with source `index.d.ts` files. We remove this prefix here.
    return getOwningPackageRelativePath(file).replace(/__index\.d\.ts$/, 'index.d.ts');
  }

  /**
   * Gets the entry-point sub-path from the package root. e.g. if the package name
   * is `@angular/cdk`, then for `@angular/cdk/a11y` just `a11y` would be returned.
   *
   * 从包根获取入口点子路径。例如，如果包名是 `@angular/cdk` ，那么对于 `@angular/cdk/a11y` `a11y`
   * 返回 a11y 。
   *
   */
  function getEntryPointSubpath(moduleName: string): string {
    return moduleName.slice(`${metadata.npmPackageName}/`.length);
  }

  /**
   * Gets whether the given module name resolves to a secondary entry-point.
   * e.g. if the package name is `@angular/cdk`, then for `@angular/cdk/a11y`
   * this would return `true`.
   *
   * 获取给定的模块名称是否解析为辅助入口点。例如，如果包名是 `@angular/cdk` ，那么对于
   * `@angular/cdk/a11y` ，这将返回 `true` 。
   *
   */
  function isSecondaryEntryPoint(moduleName: string): boolean {
    return getEntryPointSubpath(moduleName) !== '';
  }

  esm2022.forEach(file => writeEsm2022File(file));

  // Copy all FESM files into the package output.
  fesm2022.forEach(f => copyFile(f.path, getFlatEsmOutputRelativePath(f)));

  // Copy all type definitions into the package, preserving the sub-path from the
  // owning package. e.g. a file like `packages/animations/browser/__index.d.ts` will
  // end up in `browser/index.d.ts`
  typeDefinitions.forEach(f => copyFile(f.path, getTypingOutputRelativePath(f)));

  for (const file of staticFiles) {
    // We copy all files into the package output while preserving the sub-path from
    // the owning package. e.g. `packages/core/package.json` ends up `<pkg-out>/package.json`.
    const outputRelativePath = getOwningPackageRelativePath(file);
    let content = fs.readFileSync(file.path, 'utf8');

    // Check and modify package.json files as necessary for publishing
    if (path.basename(file.path) === 'package.json') {
      const isPrimaryPackageJson = outputRelativePath === 'package.json';
      const packageJson = JSON.parse(content) as PackageJson;
      const packageName = packageJson['name'];

      // Prevent non-primary `package.json` files which would throw-off resolution.
      // Resolution in the package should only be based on the top-level `package.json`.
      if (!isPrimaryPackageJson) {
        throw Error(
            `Found a nested "package.json" file in the package output: ${file.shortPath}.\n` +
            `All information of the package should reside in the primary package file.`);
      }

      // Check if the `name` field of the `package.json` files are matching with
      // name of the NPM package. This is an additional safety check.
      if (packageName !== metadata.npmPackageName) {
        throw Error(
            `Primary "package.json" has mismatching package name. Expected the ` +
            `package to be named "${metadata.npmPackageName}", but is set to: ${packageName}.`);
      }

      let newPackageJson =
          insertFormatFieldsIntoPackageJson(outputRelativePath, packageJson, false);

      newPackageJson = updatePrimaryPackageJson(newPackageJson);

      // Update the content with the new `package.json` file content.
      content = JSON.stringify(newPackageJson, null, 2);
    }

    writeFile(outputRelativePath, content);
  }

  /**
   * Inserts or edits properties into the package.json file\(s\) in the package so that
   * they point to all the right generated artifacts.
   *
   * 将属性插入或编辑到包中的 package.json 文件中，以使它们指向所有正确生成的工件。
   *
   * @param packageJsonOutRelativePath Path where the `package.json` is stored in
   *   the package output.
   *
   * `package.json` 存储在包输出中的路径。
   * @param parsedPackage Parsed package.json content
   *
   * 解析的 package.json 内容
   * @param isGeneratedPackageJson Whether the passed package.json has been generated.
   *
   * 是否已生成传递的 package.json 。
   */
  function insertFormatFieldsIntoPackageJson(
      packageJsonOutRelativePath: string, parsedPackage: Readonly<PackageJson>,
      isGeneratedPackageJson: boolean): PackageJson {
    const packageJson: PackageJson = {...parsedPackage};
    const packageName = packageJson['name'];
    const entryPointInfo = metadata.entryPoints[packageName];
    const packageJsonContainingDir = path.dirname(packageJsonOutRelativePath);

    // If a package json file has been discovered that does not match any
    // entry-point in the metadata, we report a warning as most likely the target
    // is configured incorrectly (e.g. missing `module_name` attribute).
    if (!entryPointInfo) {
      // Ideally we should throw here, as we got an entry point that doesn't
      // have flat module metadata / bundle index, so it may have been an
      // ng_module that's missing a module_name attribute.
      // However, @angular/compiler can't be an ng_module, as it's the internals
      // of the ngc compiler, yet we want to build an ng_package for it.
      // So ignore package.json files when we are missing data.
      console.error('WARNING: no module metadata for package', packageName);
      console.error('   Not updating the package.json file to point to it');
      console.error(
          '   The ng_module for this package is possibly missing the module_name attribute ');
      return packageJson;
    }

    // If we guessed the index paths for a module, and it contains an explicit `package.json`
    // file that already sets format properties, we skip automatic insertion of format
    // properties but report a warning in case properties have been set by accident.
    if (entryPointInfo.guessedPaths && !isGeneratedPackageJson &&
        hasExplicitFormatProperties(packageJson)) {
      console.error('WARNING: `package.json` explicitly sets format properties (like `main`).');
      console.error(
          '    Skipping automatic insertion of format properties as explicit ' +
          'format properties are set.');
      console.error('    Ignore this warning if explicit properties are set intentionally.');
      return packageJson;
    }

    const fesm2022RelativeOutPath = getFlatEsmOutputRelativePath(entryPointInfo.fesm2022Bundle);
    const typingsRelativeOutPath = getTypingOutputRelativePath(entryPointInfo.typings);

    packageJson.module =
        normalizePath(path.relative(packageJsonContainingDir, fesm2022RelativeOutPath));
    packageJson.typings =
        normalizePath(path.relative(packageJsonContainingDir, typingsRelativeOutPath));

    return packageJson;
  }

  /**
   * Updates the primary `package.json` file of the NPM package to specify
   * the module conditional exports and the ESM module type.
   *
   * 更新 NPM 包的主要 `package.json` 文件以指定模块条件导出和 ESM 模块类型。
   *
   */
  function updatePrimaryPackageJson(packageJson: Readonly<PackageJson>): PackageJson {
    if (packageJson.type !== undefined) {
      throw Error(
          'The primary "package.json" file of the package sets the "type" field ' +
          'that is controlled by the packager. Please unset it.');
    }

    const newPackageJson: PackageJson = {...packageJson};

    newPackageJson.type = 'module';

    // The `package.json` file is made publicly accessible for tools that
    // might want to query information from the Angular NPM package.
    insertExportMappingOrError(newPackageJson, './package.json', {default: './package.json'});

    // Capture all entry-points in the `exports` field using the subpath export declarations:
    // https://nodejs.org/api/packages.html#packages_subpath_exports.
    for (const [moduleName, entryPoint] of Object.entries(metadata.entryPoints)) {
      const subpath =
          isSecondaryEntryPoint(moduleName) ? `./${getEntryPointSubpath(moduleName)}` : '.';
      const esmIndexOutRelativePath = getEsm2022OutputRelativePath(entryPoint.index);
      const fesm2022OutRelativePath = getFlatEsmOutputRelativePath(entryPoint.fesm2022Bundle);
      const typesOutRelativePath = getTypingOutputRelativePath(entryPoint.typings);

      // Insert the export mapping for the entry-point. We set `default` to the FESM 2022
      // output, and also set the `types` condition which will be respected by TS 4.5.
      // https://github.com/microsoft/TypeScript/pull/45884.
      insertExportMappingOrError(newPackageJson, subpath, {
        types: normalizePath(typesOutRelativePath),
        esm2022: normalizePath(esmIndexOutRelativePath),
        esm: normalizePath(esmIndexOutRelativePath),
        // Note: The default conditions needs to be the last one.
        default: normalizePath(fesm2022OutRelativePath),
      });
    }

    return newPackageJson;
  }

  /**
   * Inserts a subpath export mapping into the specified `package.json` object.
   *
   * 将子路径导出映射插入指定的 `package.json` 对象。
   *
   * @throws An error if the mapping is already defined and would conflict.
   *
   * 如果映射已定义并且会冲突，则会出现错误。
   *
   */
  function insertExportMappingOrError(
      packageJson: PackageJson, subpath: string, mapping: ConditionalExport) {
    if (packageJson.exports === undefined) {
      packageJson.exports = {};
    }
    if (packageJson.exports[subpath] === undefined) {
      packageJson.exports[subpath] = {};
    }

    const subpathExport = packageJson.exports[subpath];

    // Go through all conditions that should be inserted. If the condition is already
    // manually set of the subpath export, we throw an error. In general, we allow for
    // additional conditions to be set. These will always precede the generated ones.
    for (const conditionName of Object.keys(mapping) as [keyof ConditionalExport]) {
      if (subpathExport[conditionName] !== undefined) {
        throw Error(
            `Found a conflicting export condition for "${subpath}". The "${conditionName}" ` +
            `condition would be overridden by the packager. Please unset it.`);
      }

      // **Note**: The order of the conditions is preserved even though we are setting
      // the conditions once at a time (the latest assignment will be at the end).
      subpathExport[conditionName] = mapping[conditionName];
    }
  }

  /**
   * Whether the package explicitly sets any of the format properties \(like `main`\).
   *
   * 包是否显式设置任何格式属性（例如 `main`）。
   *
   */
  function hasExplicitFormatProperties(parsedPackage: Readonly<PackageJson>): boolean {
    return Object.keys(parsedPackage)
        .some(
            (fieldName: KnownPackageJsonFormatFields) =>
                knownFormatPackageJsonFormatFields.includes(fieldName));
  }

  /**
   * Normalizes the specified path by replacing backslash separators with Posix
   * forward slash separators.
   *
   * 通过使用 Posix 正斜杠分隔符替换反斜杠分隔符来规范化指定路径。
   *
   */
  function normalizePath(path: string): string {
    const result = path.replace(/\\/g, '/');
    return result.startsWith('.') ? result : `./${result}`;
  }
}
