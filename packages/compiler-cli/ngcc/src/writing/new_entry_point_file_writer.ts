
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {absoluteFromSourceFile, AbsoluteFsPath, FileSystem, isLocalRelativePath} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {isDtsPath} from '../../../src/ngtsc/util/src/typescript';
import {EntryPoint, EntryPointJsonProperty} from '../packages/entry_point';
import {EntryPointBundle} from '../packages/entry_point_bundle';
import {FileToWrite} from '../rendering/utils';

import {InPlaceFileWriter} from './in_place_file_writer';
import {PackageJsonUpdater} from './package_json_updater';

export const NGCC_DIRECTORY = '__ivy_ngcc__';
export const NGCC_PROPERTY_EXTENSION = '_ivy_ngcc';

/**
 * This FileWriter creates a copy of the original entry-point, then writes the transformed
 * files onto the files in this copy, and finally updates the package.json with a new
 * entry-point format property that points to this new entry-point.
 *
 * 此 FileWriter
 * 会创建原始入口点的副本，然后将转换后的文件写入此副本中的文件，最后使用指向这个新入口点的新入口点格式属性更新
 * package.json。
 *
 * If there are transformed typings files in this bundle, they are updated in-place (see the
 * `InPlaceFileWriter`).
 *
 * 如果此包中存在转换后的类型文件，它们会就地更新（请参阅 `InPlaceFileWriter` ）。
 *
 */
export class NewEntryPointFileWriter extends InPlaceFileWriter {
  constructor(
      fs: FileSystem, logger: Logger, errorOnFailedEntryPoint: boolean,
      private pkgJsonUpdater: PackageJsonUpdater) {
    super(fs, logger, errorOnFailedEntryPoint);
  }

  override writeBundle(
      bundle: EntryPointBundle, transformedFiles: FileToWrite[],
      formatProperties: EntryPointJsonProperty[]) {
    // The new folder is at the root of the overall package
    const entryPoint = bundle.entryPoint;
    const ngccFolder = this.fs.join(entryPoint.packagePath, NGCC_DIRECTORY);
    this.copyBundle(bundle, entryPoint.packagePath, ngccFolder, transformedFiles);
    transformedFiles.forEach(file => this.writeFile(file, entryPoint.packagePath, ngccFolder));
    this.updatePackageJson(entryPoint, formatProperties, ngccFolder);
  }

  override revertBundle(
      entryPoint: EntryPoint, transformedFilePaths: AbsoluteFsPath[],
      formatProperties: EntryPointJsonProperty[]): void {
    // IMPLEMENTATION NOTE:
    //
    // The changes made by `copyBundle()` are not reverted here. The non-transformed copied files
    // are identical to the original ones and they will be overwritten when re-processing the
    // entry-point anyway.
    //
    // This way, we avoid the overhead of having to inform the master process about all source files
    // being copied in `copyBundle()`.

    // Revert the transformed files.
    for (const filePath of transformedFilePaths) {
      this.revertFile(filePath, entryPoint.packagePath);
    }

    // Revert any changes to `package.json`.
    this.revertPackageJson(entryPoint, formatProperties);
  }

  protected copyBundle(
      bundle: EntryPointBundle, packagePath: AbsoluteFsPath, ngccFolder: AbsoluteFsPath,
      transformedFiles: FileToWrite[]) {
    const doNotCopy = new Set(transformedFiles.map(f => f.path));
    bundle.src.program.getSourceFiles().forEach(sourceFile => {
      const originalPath = absoluteFromSourceFile(sourceFile);
      if (doNotCopy.has(originalPath)) {
        return;
      }
      const relativePath = this.fs.relative(packagePath, originalPath);
      const isInsidePackage = isLocalRelativePath(relativePath);
      if (!sourceFile.isDeclarationFile && isInsidePackage) {
        const newPath = this.fs.resolve(ngccFolder, relativePath);
        this.fs.ensureDir(this.fs.dirname(newPath));
        this.fs.copyFile(originalPath, newPath);
        this.copyAndUpdateSourceMap(originalPath, newPath);
      }
    });
  }

  /**
   * If a source file has an associated source-map, then copy this, while updating its sourceRoot
   * accordingly.
   *
   * 如果源文件有关联的 source-map ，则复制它，同时相应地更新其 sourceRoot 。
   *
   * For now don't try to parse the source for inline source-maps or external source-map links,
   * since that is more complex and will slow ngcc down.
   * Instead just check for a source-map file residing next to the source file, which is by far
   * the most common case.
   *
   * 现在不要尝试解析内联 source-maps 或外部 source-map 链接的源代码，因为这更复杂，并且会减慢 ngcc
   * 的速度。而是检查位于源文件旁边的 source-map 文件，这是迄今为止最常见的情况。
   *
   * @param originalSrcPath absolute path to the original source file being copied.
   *
   * 要复制的原始源文件的绝对路径。
   *
   * @param newSrcPath absolute path to where the source will be written.
   *
   * 将写入源代码的绝对路径。
   *
   */
  protected copyAndUpdateSourceMap(originalSrcPath: AbsoluteFsPath, newSrcPath: AbsoluteFsPath):
      void {
    const sourceMapPath = (originalSrcPath + '.map') as AbsoluteFsPath;
    if (this.fs.exists(sourceMapPath)) {
      try {
        const sourceMap =
            JSON.parse(this.fs.readFile(sourceMapPath)) as {sourceRoot: string, [key: string]: any};
        const newSourceMapPath = (newSrcPath + '.map') as AbsoluteFsPath;
        const relativePath =
            this.fs.relative(this.fs.dirname(newSourceMapPath), this.fs.dirname(sourceMapPath));
        sourceMap.sourceRoot = this.fs.join(relativePath, sourceMap.sourceRoot || '.');
        this.fs.ensureDir(this.fs.dirname(newSourceMapPath));
        this.fs.writeFile(newSourceMapPath, JSON.stringify(sourceMap));
      } catch (e) {
        this.logger.warn(`Failed to process source-map at ${sourceMapPath}`);
        this.logger.warn((e as Error).message ?? e);
      }
    }
  }

  protected writeFile(file: FileToWrite, packagePath: AbsoluteFsPath, ngccFolder: AbsoluteFsPath):
      void {
    if (isDtsPath(file.path.replace(/\.map$/, ''))) {
      // This is either `.d.ts` or `.d.ts.map` file
      super.writeFileAndBackup(file);
    } else {
      const relativePath = this.fs.relative(packagePath, file.path);
      const newFilePath = this.fs.resolve(ngccFolder, relativePath);
      this.fs.ensureDir(this.fs.dirname(newFilePath));
      this.fs.writeFile(newFilePath, file.contents);
    }
  }

  protected revertFile(filePath: AbsoluteFsPath, packagePath: AbsoluteFsPath): void {
    if (isDtsPath(filePath.replace(/\.map$/, ''))) {
      // This is either `.d.ts` or `.d.ts.map` file
      super.revertFileAndBackup(filePath);
    } else if (this.fs.exists(filePath)) {
      const relativePath = this.fs.relative(packagePath, filePath);
      const newFilePath = this.fs.resolve(packagePath, NGCC_DIRECTORY, relativePath);
      this.fs.removeFile(newFilePath);
    }
  }

  protected updatePackageJson(
      entryPoint: EntryPoint, formatProperties: EntryPointJsonProperty[],
      ngccFolder: AbsoluteFsPath) {
    if (formatProperties.length === 0) {
      // No format properties need updating.
      return;
    }

    const packageJson = entryPoint.packageJson;
    const packageJsonPath = this.fs.join(entryPoint.path, 'package.json');

    // All format properties point to the same format-path.
    const oldFormatProp = formatProperties[0]!;
    const oldFormatPath = packageJson[oldFormatProp]!;
    const oldAbsFormatPath = this.fs.resolve(entryPoint.path, oldFormatPath);
    const newAbsFormatPath =
        this.fs.resolve(ngccFolder, this.fs.relative(entryPoint.packagePath, oldAbsFormatPath));
    const newFormatPath = this.fs.relative(entryPoint.path, newAbsFormatPath);

    // Update all properties in `package.json` (both in memory and on disk).
    const update = this.pkgJsonUpdater.createUpdate();

    for (const formatProperty of formatProperties) {
      if (packageJson[formatProperty] !== oldFormatPath) {
        throw new Error(
            `Unable to update '${packageJsonPath}': Format properties ` +
            `(${formatProperties.join(', ')}) map to more than one format-path.`);
      }

      update.addChange(
          [`${formatProperty}${NGCC_PROPERTY_EXTENSION}`], newFormatPath, {before: formatProperty});
    }

    update.writeChanges(packageJsonPath, packageJson);
  }

  protected revertPackageJson(entryPoint: EntryPoint, formatProperties: EntryPointJsonProperty[]) {
    if (formatProperties.length === 0) {
      // No format properties need reverting.
      return;
    }

    const packageJson = entryPoint.packageJson;
    const packageJsonPath = this.fs.join(entryPoint.path, 'package.json');

    // Revert all properties in `package.json` (both in memory and on disk).
    // Since `updatePackageJson()` only adds properties, it is safe to just remove them (if they
    // exist).
    const update = this.pkgJsonUpdater.createUpdate();

    for (const formatProperty of formatProperties) {
      update.addChange([`${formatProperty}${NGCC_PROPERTY_EXTENSION}`], undefined);
    }

    update.writeChanges(packageJsonPath, packageJson);
  }
}
