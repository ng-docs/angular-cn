/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {createHash} from 'crypto';
import module from 'module';
import semver from 'semver';
import * as vm from 'vm';

import {AbsoluteFsPath, PathManipulation, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';

import {PackageJsonFormatPropertiesMap} from './entry_point';

/**
 * The format of a project level configuration file.
 *
 * 项目级配置文件的格式。
 *
 */
export interface NgccProjectConfig {
  /**
   * The packages that are configured by this project config.
   *
   * 此项目 config 配置的包。
   *
   */
  packages?: {[packagePath: string]: RawNgccPackageConfig|undefined};
  /**
   * Options that control how locking the process is handled.
   *
   * 控制如何处理锁定进程的选项。
   *
   */
  locking?: ProcessLockingConfiguration;
  /**
   * Name of hash algorithm used to generate hashes of the configuration.
   *
   * 用于生成配置哈希的哈希算法名称。
   *
   * Defaults to `sha256`.
   *
   * 默认为 `sha256` 。
   *
   */
  hashAlgorithm?: string;
}

/**
 * Options that control how locking the process is handled.
 *
 * 控制如何处理锁定进程的选项。
 *
 */
export interface ProcessLockingConfiguration {
  /**
   * The number of times the AsyncLocker will attempt to lock the process before failing.
   * Defaults to 500.
   *
   * AsyncLocker 在失败之前尝试锁定进程的次数。默认为 500。
   *
   */
  retryAttempts?: number;
  /**
   * The number of milliseconds between attempts to lock the process.
   * Defaults to 500ms.
   *
   * 尝试锁定进程之间的毫秒数。默认为 500 毫秒。
   *
   */
  retryDelay?: number;
}

/**
 * The raw format of a package level configuration (as it appears in configuration files).
 *
 * 包级配置的原始格式（出现在配置文件中）。
 *
 */
export interface RawNgccPackageConfig {
  /**
   * The entry-points to configure for this package.
   *
   * 要为此包配置的入口点。
   *
   * In the config file the keys are paths relative to the package path.
   *
   * 在配置文件中，键是相对于包路径的路径。
   *
   */
  entryPoints?: {[entryPointPath: string]: NgccEntryPointConfig};

  /**
   * A collection of regexes that match deep imports to ignore, for this package, rather than
   * displaying a warning.
   *
   * 对于此包，与深度导入匹配的正则表达式集合要 ignore ，而不是显示警告。
   *
   */
  ignorableDeepImportMatchers?: RegExp[];
}

/**
 * Configuration options for an entry-point.
 *
 * 入口点的配置选项。
 *
 * The existence of a configuration for a path tells ngcc that this should be considered for
 * processing as an entry-point.
 *
 * 路径配置的存在告诉 ngcc 应该考虑将其作为入口点进行处理。
 *
 */
export interface NgccEntryPointConfig {
  /**
   * Do not process (or even acknowledge the existence of) this entry-point, if true.
   *
   * 如果为真，则不处理（甚至不承认存在）此入口点。
   *
   */
  ignore?: boolean;

  /**
   * This property, if provided, holds values that will override equivalent properties in an
   * entry-point's package.json file.
   *
   * 此属性（如果提供）包含的值将覆盖入口点的 package.json 文件中的等效属性。
   *
   */
  override?: PackageJsonFormatPropertiesMap;

  /**
   * Normally, ngcc will skip compilation of entrypoints that contain imports that can't be resolved
   * or understood. If this option is specified, ngcc will proceed with compiling the entrypoint
   * even in the face of such missing dependencies.
   *
   * 通常，ngcc
   * 将跳过包含无法解析或理解的导入的入口点的编译。如果指定了此选项，即使面对这种缺失的依赖项，ngcc
   * 将继续编译入口点。
   *
   */
  ignoreMissingDependencies?: boolean;

  /**
   * Enabling this option for an entrypoint tells ngcc that deep imports might be used for the files
   * it contains, and that it should generate private re-exports alongside the NgModule of all the
   * directives/pipes it makes available in support of those imports.
   *
   * 为入口点启用此选项告诉 ngcc
   * 可能对它包含的文件使用深度导入，并且它应该与它为支持这些导入而提供的所有指令/管道的 NgModule
   * 一起生成私有重新导出。
   *
   */
  generateDeepReexports?: boolean;
}

interface VersionedPackageConfig extends RawNgccPackageConfig {
  versionRange: string;
}

/**
 * The internal representation of a configuration file. Configured packages are transformed into
 * `ProcessedNgccPackageConfig` when a certain version is requested.
 *
 * 配置文件的内部表示。当请求某个版本时，配置的包会转换为 `ProcessedNgccPackageConfig` 。
 *
 */
export class PartiallyProcessedConfig {
  /**
   * The packages that are configured by this project config, keyed by package name.
   *
   * 此项目配置配置的包，由包名键入。
   *
   */
  packages = new Map<string, VersionedPackageConfig[]>();
  /**
   * Options that control how locking the process is handled.
   *
   * 控制如何处理锁定进程的选项。
   *
   */
  locking: ProcessLockingConfiguration = {};
  /**
   * Name of hash algorithm used to generate hashes of the configuration.
   *
   * 用于生成配置哈希的哈希算法名称。
   *
   * Defaults to `sha256`.
   *
   * 默认为 `sha256` 。
   *
   */
  hashAlgorithm = 'sha256';

  constructor(projectConfig: NgccProjectConfig) {
    // locking configuration
    if (projectConfig.locking !== undefined) {
      this.locking = projectConfig.locking;
    }

    // packages configuration
    for (const packageNameAndVersion in projectConfig.packages) {
      const packageConfig = projectConfig.packages[packageNameAndVersion];
      if (packageConfig) {
        const [packageName, versionRange = '*'] = this.splitNameAndVersion(packageNameAndVersion);
        this.addPackageConfig(packageName, {...packageConfig, versionRange});
      }
    }

    // hash algorithm config
    if (projectConfig.hashAlgorithm !== undefined) {
      this.hashAlgorithm = projectConfig.hashAlgorithm;
    }
  }

  private splitNameAndVersion(packageNameAndVersion: string): [string, string|undefined] {
    const versionIndex = packageNameAndVersion.lastIndexOf('@');
    // Note that > 0 is because we don't want to match @ at the start of the line
    // which is what you would have with a namespaced package, e.g. `@angular/common`.
    return versionIndex > 0 ?
        [
          packageNameAndVersion.substring(0, versionIndex),
          packageNameAndVersion.substring(versionIndex + 1),
        ] :
        [packageNameAndVersion, undefined];
  }

  /**
   * Registers the configuration for a particular version of the provided package.
   *
   * 注册所提供包的特定版本的配置。
   *
   */
  private addPackageConfig(packageName: string, config: VersionedPackageConfig): void {
    if (!this.packages.has(packageName)) {
      this.packages.set(packageName, []);
    }
    this.packages.get(packageName)!.push(config);
  }

  /**
   * Finds the configuration for a particular version of the provided package.
   *
   * 查找所提供包的特定版本的配置。
   *
   */
  findPackageConfig(packageName: string, version: string|null): VersionedPackageConfig|null {
    if (!this.packages.has(packageName)) {
      return null;
    }

    const configs = this.packages.get(packageName)!;
    if (version === null) {
      // The package has no version (!) - perhaps the entry-point was from a deep import, which made
      // it impossible to find the package.json.
      // So just return the first config that matches the package name.
      return configs[0];
    }
    return configs.find(
               config =>
                   semver.satisfies(version, config.versionRange, {includePrerelease: true})) ??
        null;
  }

  /**
   * Converts the configuration into a JSON representation that is used to compute a hash of the
   * configuration.
   *
   * 将配置转换为 JSON 表示，用于计算配置的哈希。
   *
   */
  toJson(): string {
    return JSON.stringify(this, (key: string, value: unknown) => {
      if (value instanceof Map) {
        const res: Record<string, unknown> = {};
        for (const [k, v] of value) {
          res[k] = v;
        }
        return res;
      } else {
        return value;
      }
    });
  }
}

/**
 * The default configuration for ngcc.
 *
 * ngcc 的默认配置。
 *
 * This is the ultimate fallback configuration that ngcc will use if there is no configuration
 * for a package at the package level or project level.
 *
 * 如果没有包级别或项目级别的包配置，这是 ngcc 将使用的最终后备配置。
 *
 * This configuration is for packages that are "dead" - i.e. no longer maintained and so are
 * unlikely to be fixed to work with ngcc, nor provide a package level config of their own.
 *
 * 此配置适用于“死”的包 - 即不再维护，因此不太可能被修复以使用 ngcc，也不提供自己的包级别配置。
 *
 * The fallback process for looking up configuration is:
 *
 * 查找配置的后备过程是：
 *
 * Project -> Package -> Default
 *
 * 项目 -> 包 -> 默认
 *
 * If a package provides its own configuration then that would override this default one.
 *
 * 如果一个包提供了自己的配置，那么这将覆盖此默认配置。
 *
 * Also application developers can always provide configuration at their project level which
 * will override everything else.
 *
 * 此外，应用程序开发人员可以随时在他们的项目级别提供配置，这将覆盖其他所有内容。
 *
 * Note that the fallback is package based not entry-point based.
 * For example, if a there is configuration for a package at the project level this will replace all
 * entry-point configurations that may have been provided in the package level or default level
 * configurations, even if the project level configuration does not provide for a given entry-point.
 *
 * 请注意，回退是基于包的，而不是基于入口点的。例如，如果在项目级别有包的配置，这将替换可能在包级别或默认级别配置中提供的所有入口点配置，即使项目级别配置不提供给定条目点。
 *
 */
export const DEFAULT_NGCC_CONFIG: NgccProjectConfig = {
  packages: {
    // Add default package configuration here. For example:
    // '@angular/fire@^5.2.0': {
    //   entryPoints: {
    //     './database-deprecated': {ignore: true},
    //   },
    // },

    // The package does not contain any `.metadata.json` files in the root directory but only inside
    // `dist/`. Without this config, ngcc does not realize this is a ViewEngine-built Angular
    // package that needs to be compiled to Ivy.
    'angular2-highcharts': {
      entryPoints: {
        '.': {
          override: {
            main: './index.js',
          },
        },
      },
    },

    // The `dist/` directory has a duplicate `package.json` pointing to the same files, which (under
    // certain configurations) can causes ngcc to try to process the files twice and fail.
    // Ignore the `dist/` entry-point.
    'ng2-dragula': {
      entryPoints: {
        './dist': {ignore: true},
      },
    },
  },
  locking: {
    retryDelay: 500,
    retryAttempts: 500,
  }
};

const NGCC_CONFIG_FILENAME = 'ngcc.config.js';

// CommonJS/ESM interop for determining the current file name and containing
// directory. The path is needed for loading the user configuration.
const isCommonJS = typeof require !== 'undefined';
const currentFileUrl = isCommonJS ? null : __ESM_IMPORT_META_URL__;

/**
 * The processed package level configuration as a result of processing a raw package level config.
 *
 * 由于处理原始包级别配置而处理的包级别配置。
 *
 */
export class ProcessedNgccPackageConfig implements Omit<RawNgccPackageConfig, 'entryPoints'> {
  /**
   * The absolute path to this instance of the package.
   * Note that there may be multiple instances of a package inside a project in nested
   * `node_modules/`. For example, one at `<project-root>/node_modules/some-package/` and one at
   * `<project-root>/node_modules/other-package/node_modules/some-package/`.
   *
   * 此包实例的绝对路径。请注意，嵌套 `node_modules/` 中的项目中可能有多个包实例。例如，一个在
   * `<project-root>/node_modules/some-package/` ，一个在
   * `<project-root>/node_modules/other-package/node_modules/some-package/` 。
   *
   */
  packagePath: AbsoluteFsPath;

  /**
   * The entry-points to configure for this package.
   *
   * 要为此包配置的入口点。
   *
   * In contrast to `RawNgccPackageConfig`, the paths are absolute and take the path of the specific
   * instance of the package into account.
   *
   * 与 `RawNgccPackageConfig` ，路径是绝对的，并且会考虑包特定实例的路径。
   *
   */
  entryPoints: Map<AbsoluteFsPath, NgccEntryPointConfig>;

  /**
   * A collection of regexes that match deep imports to ignore, for this package, rather than
   * displaying a warning.
   *
   * 对于此包，与深度导入匹配的正则表达式集合要 ignore ，而不是显示警告。
   *
   */
  ignorableDeepImportMatchers: RegExp[];

  constructor(fs: PathManipulation, packagePath: AbsoluteFsPath, {
    entryPoints = {},
    ignorableDeepImportMatchers = [],
  }: RawNgccPackageConfig) {
    const absolutePathEntries: [AbsoluteFsPath, NgccEntryPointConfig][] =
        Object.entries(entryPoints).map(([
                                          relativePath, config
                                        ]) => [fs.resolve(packagePath, relativePath), config]);

    this.packagePath = packagePath;
    this.entryPoints = new Map(absolutePathEntries);
    this.ignorableDeepImportMatchers = ignorableDeepImportMatchers;
  }
}

/**
 * Ngcc has a hierarchical configuration system that lets us "fix up" packages that do not
 * work with ngcc out of the box.
 *
 * Ngcc 有一个分层配置系统，可以让我们“修复”开箱即用 ngcc 无法使用的包。
 *
 * There are three levels at which configuration can be declared:
 *
 * 可以在三个级别声明配置：
 *
 * * Default level - ngcc comes with built-in configuration for well known cases.
 *
 *   默认级别 - ngcc 带有针对众所周知的情况的内置配置。
 *
 * * Package level - a library author publishes a configuration with their package to fix known
 *   issues.
 *
 *   包级别 - 库作者使用他们的包发布配置以解决已知问题。
 *
 * * Project level - the application developer provides a configuration that fixes issues specific
 *   to the libraries used in their application.
 *
 *   项目级别 - 应用程序开发人员提供了一种配置，可以解决特定于其应用程序中使用的库的问题。
 *
 * Ngcc will match configuration based on the package name but also on its version. This allows
 * configuration to provide different fixes to different version ranges of a package.
 *
 * Ngcc 将根据包名称及其版本来匹配配置。这允许配置为包的不同版本范围提供不同的修复。
 *
 * * Package level configuration is specific to the package version where the configuration is
 *   found.
 *
 *   包级配置特定于找到配置的包版本。
 *
 * * Default and project level configuration should provide version ranges to ensure that the
 *   configuration is only applied to the appropriate versions of a package.
 *
 *   默认和项目级配置应提供版本范围，以确保配置仅应用于适当的包版本。
 *
 * When getting a configuration for a package (via `getConfig()`) the caller should provide the
 * version of the package in question, if available. If it is not provided then the first available
 * configuration for a package is returned.
 *
 * 获取包的配置（通过 `getConfig()`
 * ）时，调用者应提供相关包的版本（如果可用）。如果未提供，则返回包的第一个可用配置。
 *
 */
export class NgccConfiguration {
  private defaultConfig: PartiallyProcessedConfig;
  private projectConfig: PartiallyProcessedConfig;
  private cache = new Map<string, VersionedPackageConfig>();
  readonly hash: string;
  readonly hashAlgorithm: string;

  constructor(private fs: ReadonlyFileSystem, baseDir: AbsoluteFsPath) {
    this.defaultConfig = new PartiallyProcessedConfig(DEFAULT_NGCC_CONFIG);
    this.projectConfig = new PartiallyProcessedConfig(this.loadProjectConfig(baseDir));
    this.hashAlgorithm = this.projectConfig.hashAlgorithm;
    this.hash = this.computeHash();
  }

  /**
   * Get the configuration options for locking the ngcc process.
   *
   * 获取用于锁定 ngcc 进程的配置选项。
   *
   */
  getLockingConfig(): Required<ProcessLockingConfiguration> {
    let {retryAttempts, retryDelay} = this.projectConfig.locking;
    if (retryAttempts === undefined) {
      retryAttempts = this.defaultConfig.locking.retryAttempts!;
    }
    if (retryDelay === undefined) {
      retryDelay = this.defaultConfig.locking.retryDelay!;
    }
    return {retryAttempts, retryDelay};
  }

  /**
   * Get a configuration for the given `version` of a package at `packagePath`.
   *
   * 在 `packagePath` 获取给定 `version` 的包的配置。
   *
   * @param packageName The name of the package whose config we want.
   *
   * 我们想要其配置的包名。
   *
   * @param packagePath The path to the package whose config we want.
   *
   * 我们想要其配置的包的路径。
   *
   * @param version The version of the package whose config we want, or `null` if the package's
   * package.json did not exist or was invalid.
   *
   * 我们想要其配置的包的版本，如果包的 package.json 不存在或无效，则为 `null` 。
   *
   */
  getPackageConfig(packageName: string, packagePath: AbsoluteFsPath, version: string|null):
      ProcessedNgccPackageConfig {
    const rawPackageConfig = this.getRawPackageConfig(packageName, packagePath, version);
    return new ProcessedNgccPackageConfig(this.fs, packagePath, rawPackageConfig);
  }

  private getRawPackageConfig(
      packageName: string, packagePath: AbsoluteFsPath,
      version: string|null): VersionedPackageConfig {
    const cacheKey = packageName + (version !== null ? `@${version}` : '');
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const projectLevelConfig = this.projectConfig.findPackageConfig(packageName, version);
    if (projectLevelConfig !== null) {
      this.cache.set(cacheKey, projectLevelConfig);
      return projectLevelConfig;
    }

    const packageLevelConfig = this.loadPackageConfig(packagePath, version);
    if (packageLevelConfig !== null) {
      this.cache.set(cacheKey, packageLevelConfig);
      return packageLevelConfig;
    }

    const defaultLevelConfig = this.defaultConfig.findPackageConfig(packageName, version);
    if (defaultLevelConfig !== null) {
      this.cache.set(cacheKey, defaultLevelConfig);
      return defaultLevelConfig;
    }

    return {versionRange: '*'};
  }

  private loadProjectConfig(baseDir: AbsoluteFsPath): NgccProjectConfig {
    const configFilePath = this.fs.join(baseDir, NGCC_CONFIG_FILENAME);
    if (this.fs.exists(configFilePath)) {
      try {
        return this.evalSrcFile(configFilePath);
      } catch (e) {
        throw new Error(
            `Invalid project configuration file at "${configFilePath}": ` + (e as Error).message);
      }
    } else {
      return {packages: {}};
    }
  }

  private loadPackageConfig(packagePath: AbsoluteFsPath, version: string|null):
      VersionedPackageConfig|null {
    const configFilePath = this.fs.join(packagePath, NGCC_CONFIG_FILENAME);
    if (this.fs.exists(configFilePath)) {
      try {
        const packageConfig = this.evalSrcFile(configFilePath);
        return {
          ...packageConfig,
          versionRange: version || '*',
        };
      } catch (e) {
        throw new Error(
            `Invalid package configuration file at "${configFilePath}": ` + (e as Error).message);
      }
    } else {
      return null;
    }
  }

  private evalSrcFile(srcPath: AbsoluteFsPath): any {
    const requireFn = isCommonJS ? require : module.createRequire(currentFileUrl!);
    const src = this.fs.readFile(srcPath);
    const theExports = {};
    const sandbox = {
      module: {exports: theExports},
      exports: theExports,
      require: requireFn,
      __dirname: this.fs.dirname(srcPath),
      __filename: srcPath
    };
    vm.runInNewContext(src, sandbox, {filename: srcPath});
    return sandbox.module.exports;
  }

  private computeHash(): string {
    return createHash(this.hashAlgorithm).update(this.projectConfig.toJson()).digest('hex');
  }
}
