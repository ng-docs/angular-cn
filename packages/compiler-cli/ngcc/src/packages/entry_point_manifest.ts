/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {createHash} from 'crypto';

import {AbsoluteFsPath, FileSystem, PathSegment} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {EntryPointWithDependencies} from '../dependencies/dependency_host';

import {NGCC_VERSION} from './build_marker';
import {NgccConfiguration} from './configuration';
import {getEntryPointInfo, isEntryPoint, PackageJsonFormatProperties} from './entry_point';

/**
 * Manages reading and writing a manifest file that contains a list of all the entry-points that
 * were found below a given basePath.
 *
 * 管理读写清单文件，该文件包含在给定 basePath 下找到的所有入口点的列表。
 *
 * This is a super-set of the entry-points that are actually processed for a given run of ngcc,
 * since some may already be processed, or excluded if they do not have the required format.
 *
 * 这是为给定的 ngcc
 * 运行实际处理的入口点的超集，因为某些可能已经被处理，如果它们不具有所需的格式，则可能会被排除。
 *
 */
export class EntryPointManifest {
  constructor(private fs: FileSystem, private config: NgccConfiguration, private logger: Logger) {}

  /**
   * Try to get the entry-point info from a manifest file for the given `basePath` if it exists and
   * is not out of date.
   *
   * 尝试从给定的 `basePath` 的清单文件中获取入口点信息（如果存在并且尚未过时）。
   *
   * Reasons for the manifest to be out of date are:
   *
   * 清单已过时的原因是：
   *
   * * the file does not exist
   *
   *   该文件不存在
   *
   * * the ngcc version has changed
   *
   *   ngcc 版本已更改
   *
   * * the package lock-file (i.e. yarn.lock or package-lock.json) has changed
   *
   *   包 lock-file （即 spring.lock 或 package-lock.json ）已更改
   *
   * * the project configuration has changed
   *
   *   项目配置已更改
   *
   * * one or more entry-points in the manifest are not valid
   *
   *   清单中的一个或多个入口点无效
   *
   * @param basePath The path that would contain the entry-points and the manifest file.
   *
   * 包含入口点和清单文件的路径。
   *
   * @returns
   *
   * an array of entry-point information for all entry-points found below the given
   * `basePath` or `null` if the manifest was out of date.
   *
   * 在给定 `basePath` 下找到的所有入口点的入口点信息数组，如果清单已过时，则为 `null` 。
   *
   */
  readEntryPointsUsingManifest(basePath: AbsoluteFsPath): EntryPointWithDependencies[]|null {
    try {
      if (this.fs.basename(basePath) !== 'node_modules') {
        return null;
      }

      const manifestPath = this.getEntryPointManifestPath(basePath);
      if (!this.fs.exists(manifestPath)) {
        return null;
      }

      const computedLockFileHash = this.computeLockFileHash(basePath);
      if (computedLockFileHash === null) {
        return null;
      }

      const {ngccVersion, configFileHash, lockFileHash, entryPointPaths} =
          JSON.parse(this.fs.readFile(manifestPath)) as EntryPointManifestFile;
      if (ngccVersion !== NGCC_VERSION || configFileHash !== this.config.hash ||
          lockFileHash !== computedLockFileHash) {
        return null;
      }

      this.logger.debug(`Entry-point manifest found for ${
          basePath} so loading entry-point information directly.`);
      const startTime = Date.now();

      const entryPoints: EntryPointWithDependencies[] = [];
      for (const
               [packagePath, entryPointPath, dependencyPaths = [], missingPaths = [],
                                             deepImportPaths = []] of entryPointPaths) {
        const result = getEntryPointInfo(
            this.fs, this.config, this.logger, this.fs.resolve(basePath, packagePath),
            this.fs.resolve(basePath, entryPointPath));
        if (!isEntryPoint(result)) {
          throw new Error(`The entry-point manifest at ${
              manifestPath} contained an invalid pair of package paths: [${packagePath}, ${
              entryPointPath}]`);
        } else {
          entryPoints.push({
            entryPoint: result,
            depInfo: {
              dependencies: new Set(dependencyPaths),
              missing: new Set(missingPaths),
              deepImports: new Set(deepImportPaths),
            }
          });
        }
      }
      const duration = Math.round((Date.now() - startTime) / 100) / 10;
      this.logger.debug(`Reading entry-points using the manifest entries took ${duration}s.`);
      return entryPoints;
    } catch (e) {
      this.logger.warn(
          `Unable to read the entry-point manifest for ${basePath}:\n`,
          (e as Error).stack || (e as Error).toString());
      return null;
    }
  }

  /**
   * Write a manifest file at the given `basePath`.
   *
   * 在给定的 `basePath` 处写入清单文件。
   *
   * The manifest includes the current ngcc version and hashes of the package lock-file and current
   * project config. These will be used to check whether the manifest file is out of date. See
   * `readEntryPointsUsingManifest()`.
   *
   * 清单包括当前的 ngcc 版本以及包 lock-file
   * 和当前项目配置的哈希。这些将用于检查清单文件是否已过时。请参阅 `readEntryPointsUsingManifest()`
   * 。
   *
   * @param basePath The path where the manifest file is to be written.
   *
   * 要写入清单文件的路径。
   *
   * @param entryPoints A collection of entry-points to record in the manifest.
   *
   * 要记录在清单中的入口点的集合。
   *
   */
  writeEntryPointManifest(basePath: AbsoluteFsPath, entryPoints: EntryPointWithDependencies[]):
      void {
    if (this.fs.basename(basePath) !== 'node_modules') {
      return;
    }

    const lockFileHash = this.computeLockFileHash(basePath);
    if (lockFileHash === null) {
      return;
    }
    const manifest: EntryPointManifestFile = {
      ngccVersion: NGCC_VERSION,
      configFileHash: this.config.hash,
      lockFileHash: lockFileHash,
      entryPointPaths: entryPoints.map(e => {
        const entryPointPaths: EntryPointPaths = [
          this.fs.relative(basePath, e.entryPoint.packagePath),
          this.fs.relative(basePath, e.entryPoint.path),
        ];
        // Only add depInfo arrays if needed.
        if (e.depInfo.dependencies.size > 0) {
          entryPointPaths[2] = Array.from(e.depInfo.dependencies);
        } else if (e.depInfo.missing.size > 0 || e.depInfo.deepImports.size > 0) {
          entryPointPaths[2] = [];
        }
        if (e.depInfo.missing.size > 0) {
          entryPointPaths[3] = Array.from(e.depInfo.missing);
        } else if (e.depInfo.deepImports.size > 0) {
          entryPointPaths[3] = [];
        }
        if (e.depInfo.deepImports.size > 0) {
          entryPointPaths[4] = Array.from(e.depInfo.deepImports);
        }
        return entryPointPaths;
      }),
    };
    this.fs.writeFile(this.getEntryPointManifestPath(basePath), JSON.stringify(manifest));
  }

  private getEntryPointManifestPath(basePath: AbsoluteFsPath) {
    return this.fs.resolve(basePath, '__ngcc_entry_points__.json');
  }

  private computeLockFileHash(basePath: AbsoluteFsPath): string|null {
    const directory = this.fs.dirname(basePath);
    for (const lockFileName of ['yarn.lock', 'package-lock.json']) {
      const lockFilePath = this.fs.resolve(directory, lockFileName);
      if (this.fs.exists(lockFilePath)) {
        const lockFileContents = this.fs.readFile(lockFilePath);
        return createHash(this.config.hashAlgorithm).update(lockFileContents).digest('hex');
      }
    }
    return null;
  }
}

/**
 * A specialized implementation of the `EntryPointManifest` that can be used to invalidate the
 * current manifest file.
 *
 * `EntryPointManifest` 的专门实现，可用于使当前的清单文件无效。
 *
 * It always returns `null` from the `readEntryPointsUsingManifest()` method, which forces a new
 * manifest to be created, which will overwrite the current file when `writeEntryPointManifest()`
 * is called.
 *
 * 它始终从 `readEntryPointsUsingManifest()` 方法返回 `null`
 * ，这会强制创建一个新的清单，该清单将在调用 `writeEntryPointManifest()` 时覆盖当前文件。
 *
 */
export class InvalidatingEntryPointManifest extends EntryPointManifest {
  override readEntryPointsUsingManifest(_basePath: AbsoluteFsPath):
      EntryPointWithDependencies[]|null {
    return null;
  }
}

export type EntryPointPaths = [
  string,
  string,
  Array<AbsoluteFsPath>?,
  Array<AbsoluteFsPath|PathSegment>?,
  Array<AbsoluteFsPath>?,
];

/**
 * The JSON format of the manifest file that is written to disk.
 *
 * 写入磁盘的清单文件的 JSON 格式。
 *
 */
export interface EntryPointManifestFile {
  ngccVersion: string;
  configFileHash: string;
  lockFileHash: string;
  entryPointPaths: EntryPointPaths[];
}


/**
 * The JSON format of the entrypoint properties.
 *
 * 入口点属性的 JSON 格式。
 *
 */
export type NewEntryPointPropertiesMap = {
  [Property in PackageJsonFormatProperties as `${Property}_ivy_ngcc`]?: string;
};
