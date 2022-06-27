/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, FileSystem, ReadonlyFileSystem} from '../../../../src/ngtsc/file_system';
import {needsCleaning} from '../../packages/build_marker';
import {EntryPoint} from '../../packages/entry_point';

import {BackupFileCleaner, CleaningStrategy, NgccDirectoryCleaner, PackageJsonCleaner} from './cleaning_strategies';
import {isLocalDirectory} from './utils';

/**
 * A class that can clean ngcc artifacts from a directory.
 *
 * 一个可以从目录中清理 ngcc 工件的类。
 *
 */
export class PackageCleaner {
  constructor(private fs: ReadonlyFileSystem, private cleaners: CleaningStrategy[]) {}

  /**
   * Recurse through the file-system cleaning files and directories as determined by the configured
   * cleaning-strategies.
   *
   * 递归由配置的清理策略确定的文件系统清理文件和目录。
   *
   * @param directory the current directory to clean
   *
   * 要清理的当前目录
   *
   */
  clean(directory: AbsoluteFsPath) {
    const basenames = this.fs.readdir(directory);
    for (const basename of basenames) {
      if (basename === 'node_modules') {
        continue;
      }

      const path = this.fs.resolve(directory, basename);
      for (const cleaner of this.cleaners) {
        if (cleaner.canClean(path, basename)) {
          cleaner.clean(path, basename);
          break;
        }
      }
      // Recurse into subdirectories (note that a cleaner may have removed this path)
      if (isLocalDirectory(this.fs, path)) {
        this.clean(path);
      }
    }
  }
}


/**
 * Iterate through the given `entryPoints` identifying the package for each that has at least one
 * outdated processed format, then cleaning those packages.
 *
 * 迭代给定的 `entryPoints` ，为每个具有至少一种过时的处理格式的包标识，然后清理这些包。
 *
 * Note that we have to clean entire packages because there is no clear file-system boundary
 * between entry-points within a package. So if one entry-point is outdated we have to clean
 * everything within that package.
 *
 * 请注意，我们必须清理整个包，因为包中的入口点之间没有明确的文件系统边界。因此，如果一个入口点已过时，我们必须清理该包中的所有内容。
 *
 * @param fileSystem the current file-system
 *
 * 当前的文件系统
 *
 * @param entryPoints the entry-points that have been collected for this run of ngcc
 *
 * 为本次 ngcc 运行收集的入口点
 *
 * @returns
 *
 * true if packages needed to be cleaned.
 *
 * 如果需要清洁包，则为 true 。
 *
 */
export function cleanOutdatedPackages(fileSystem: FileSystem, entryPoints: EntryPoint[]): boolean {
  const packagesToClean = new Set<AbsoluteFsPath>();
  for (const entryPoint of entryPoints) {
    if (needsCleaning(entryPoint.packageJson)) {
      packagesToClean.add(entryPoint.packagePath);
    }
  }

  const cleaner = new PackageCleaner(fileSystem, [
    new PackageJsonCleaner(fileSystem),
    new NgccDirectoryCleaner(fileSystem),
    new BackupFileCleaner(fileSystem),
  ]);
  for (const packagePath of packagesToClean) {
    cleaner.clean(packagePath);
  }

  return packagesToClean.size > 0;
}
