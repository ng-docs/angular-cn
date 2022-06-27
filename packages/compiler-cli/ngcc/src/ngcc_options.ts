/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as os from 'os';

import {absoluteFrom, AbsoluteFsPath, FileSystem, getFileSystem, PathManipulation} from '../../src/ngtsc/file_system';
import {ConsoleLogger, Logger, LogLevel} from '../../src/ngtsc/logging';
import {ParsedConfiguration, readConfiguration} from '../../src/perform_compile';

import {SUPPORTED_FORMAT_PROPERTIES} from './packages/entry_point';
import {getPathMappingsFromTsConfig, PathMappings} from './path_mappings';
import {FileWriter} from './writing/file_writer';
import {InPlaceFileWriter} from './writing/in_place_file_writer';
import {NewEntryPointFileWriter} from './writing/new_entry_point_file_writer';
import {PackageJsonUpdater} from './writing/package_json_updater';

/**
 * The options to configure the ngcc compiler for synchronous execution.
 *
 * 将 ngcc 编译器配置为同步执行的选项。
 *
 */
export interface SyncNgccOptions {
  /**
   * The absolute path to the `node_modules` folder that contains the packages to process.
   *
   * 包含要处理的包的 `node_modules` 文件夹的绝对路径。
   *
   */
  basePath: string;

  /**
   * The path to the primary package to be processed. If not absolute then it must be relative to
   * `basePath`.
   *
   * 要处理的主包的路径。如果不是绝对的，则它必须是相对于 `basePath` 。
   *
   * All its dependencies will need to be processed too.
   *
   * 它的所有依赖项也需要被处理。
   *
   * If this property is provided then `errorOnFailedEntryPoint` is forced to true.
   *
   * 如果提供了此属性，则 `errorOnFailedEntryPoint` 会强制为 true。
   *
   */
  targetEntryPointPath?: string;

  /**
   * Which entry-point properties in the package.json to consider when processing an entry-point.
   * Each property should hold a path to the particular bundle format for the entry-point.
   * Defaults to all the properties in the package.json.
   *
   * 处理入口点时要考虑 package.json
   * 中的哪些入口点属性。每个属性都应该包含入口点特定包格式的路径。默认为 package.json
   * 中的所有属性。
   *
   */
  propertiesToConsider?: string[];

  /**
   * Whether to only process the typings files for this entry-point.
   *
   * 是否仅处理此入口点的类型文件。
   *
   * This is useful when running ngcc only to provide typings files to downstream tooling such as
   * the Angular Language Service or ng-packagr. Defaults to `false`.
   *
   * 当运行 ngcc 仅向下游工具提供类型化文件时，这会很有用，例如 Angular 语言服务或
   * ng-packagr。默认为 `false` 。
   *
   * If this is set to `true` then `compileAllFormats` is forced to `false`.
   *
   * 如果将其设置为 `true` ，则 `compileAllFormats` 会强制为 `false` 。
   *
   */
  typingsOnly?: boolean;

  /**
   * Whether to process all formats specified by (`propertiesToConsider`)  or to stop processing
   * this entry-point at the first matching format.
   *
   * 是处理 ( `propertiesToConsider` ) 指定的所有格式，还是在第一个匹配的格式处停止处理此入口点。
   *
   * Defaults to `true`, but is forced to `false` if `typingsOnly` is `true`.
   *
   * 默认为 `true` ，但如果 `typingsOnly` 为 `true` ，则强制为 `false` 。
   *
   */
  compileAllFormats?: boolean;

  /**
   * Whether to create new entry-points bundles rather than overwriting the original files.
   *
   * 是否创建新的入口点包，而不是覆盖原始文件。
   *
   */
  createNewEntryPointFormats?: boolean;

  /**
   * Provide a logger that will be called with log messages.
   *
   * 提供一个将使用日志消息调用的记录器。
   *
   */
  logger?: Logger;

  /**
   * Paths mapping configuration (`paths` and `baseUrl`), as found in `ts.CompilerOptions`.
   * These are used to resolve paths to locally built Angular libraries.
   *
   * 路径映射配置（ `paths` 和 `baseUrl` ），在 `ts.CompilerOptions` 中找到。这些用于解析本地构建的
   * Angular 库的路径。
   *
   * Note that `pathMappings` specified here take precedence over any `pathMappings` loaded from a
   * TS config file.
   *
   * 请注意，此处指定的 `pathMappings` 优先于从 TS 配置文件加载的任何 `pathMappings` 。
   *
   */
  pathMappings?: PathMappings;

  /**
   * Provide a file-system service that will be used by ngcc for all file interactions.
   *
   * 提供 ngcc 将用于所有文件交互的文件系统服务。
   *
   */
  fileSystem?: FileSystem;

  /**
   * Whether the compilation should run and return asynchronously. Allowing asynchronous execution
   * may speed up the compilation by utilizing multiple CPU cores (if available).
   *
   * 编译是否应该异步运行和返回。允许异步执行可以通过利用多个 CPU 核心（如果可用）来加速编译。
   *
   * Default: `false` (i.e. run synchronously)
   *
   * 默认： `false` （即同步运行）
   *
   */
  async?: false;

  /**
   * Set to true in order to terminate immediately with an error code if an entry-point fails to be
   * processed.
   *
   * 设置为 true 以在入口点无法处理时立即终止并显示错误代码。
   *
   * If `targetEntryPointPath` is provided then this property is always true and cannot be
   * changed. Otherwise the default is false.
   *
   * 如果提供了 `targetEntryPointPath` ，则此属性始终为 true 并且不能更改。否则，默认值为 false 。
   *
   * When set to false, ngcc will continue to process entry-points after a failure. In which case it
   * will log an error and resume processing other entry-points.
   *
   * 当设置为 false 时，ngcc
   * 将在失败后继续处理入口点。在这种情况下，它将记录错误并继续处理其他入口点。
   *
   */
  errorOnFailedEntryPoint?: boolean;

  /**
   * Render `$localize` messages with legacy format ids.
   *
   * 使用旧版格式 ID 渲染 `$localize` 消息。
   *
   * The default value is `true`. Only set this to `false` if you do not want legacy message ids to
   * be rendered. For example, if you are not using legacy message ids in your translation files
   * AND are not doing compile-time inlining of translations, in which case the extra message ids
   * would add unwanted size to the final source bundle.
   *
   * 默认值为 `true` 。如果你不希望呈现旧版消息 ID，请仅将其设置为 `false`
   * 。例如，如果你没有在翻译文件中使用旧版消息
   * ID，并且没有对翻译进行编译时内联，在这种情况下，额外的消息 ID 会为最终的源包添加不需要的大小。
   *
   * It is safe to leave this set to true if you are doing compile-time inlining because the extra
   * legacy message ids will all be stripped during translation.
   *
   * 如果你要进行编译时内联，可以将此设置保留为 true 是安全的，因为额外的旧消息 ID
   * 将在翻译期间被删除。
   *
   */
  enableI18nLegacyMessageIdFormat?: boolean;

  /**
   * Whether to invalidate any entry-point manifest file that is on disk. Instead, walk the
   * directory tree looking for entry-points, and then write a new entry-point manifest, if
   * possible.
   *
   * 是否使磁盘上的任何入口点清单文件无效。相反，如果可能，请遍历目录树查找入口点，然后编写新的入口点清单。
   *
   * Default: `false` (i.e. the manifest will be used if available)
   *
   * 默认： `false` （即，如果可用，将使用清单）
   *
   */
  invalidateEntryPointManifest?: boolean;

  /**
   * An absolute path to a TS config file (e.g. `tsconfig.json`) or a directory containing one, that
   * will be used to configure module resolution with things like path mappings, if not specified
   * explicitly via the `pathMappings` property to `mainNgcc`.
   *
   * TS 配置文件（例如 `tsconfig.json` ）或包含文件的目录的绝对路径，如果未通过 `mainNgcc` 的
   * `pathMappings` 属性显式指定，则将用于使用路径映射等配置模块解析。
   *
   * If `undefined`, ngcc will attempt to load a `tsconfig.json` file from the directory above the
   * `basePath`.
   *
   * 如果 `undefined` ，ngcc 将尝试从 `basePath` 上面的目录加载 `tsconfig.json` 文件。
   *
   * If `null`, ngcc will not attempt to load any TS config file at all.
   *
   * 如果 `null` ，则 ngcc 将根本不会尝试加载任何 TS 配置文件。
   *
   */
  tsConfigPath?: string|null;

  /**
   * Use the program defined in the loaded tsconfig.json (if available - see
   * `tsConfigPath` option) to identify the entry-points that should be processed.
   * If this is set to `true` then only the entry-points reachable from the given
   * program (and their dependencies) will be processed.
   *
   * 使用加载的 tsconfig.json 中定义的程序（如果可用-请参阅 `tsConfigPath`
   * 选项）来识别应该处理的入口点。如果将其设置为 `true`
   * ，则只会处理从给定程序（及其依赖项）可到达的入口点。
   *
   */
  findEntryPointsFromTsConfigProgram?: boolean;
}

/**
 * The options to configure the ngcc compiler for asynchronous execution.
 *
 * 将 ngcc 编译器配置为异步执行的选项。
 *
 */
export type AsyncNgccOptions = Omit<SyncNgccOptions, 'async'>&{async: true};

/**
 * The options to configure the ngcc compiler.
 *
 * 配置 ngcc 编译器的选项。
 *
 */
export type NgccOptions = AsyncNgccOptions|SyncNgccOptions;

export type OptionalNgccOptionKeys =
    'targetEntryPointPath'|'tsConfigPath'|'pathMappings'|'findEntryPointsFromTsConfigProgram';
export type RequiredNgccOptions = Required<Omit<NgccOptions, OptionalNgccOptionKeys>>;
export type OptionalNgccOptions = Pick<NgccOptions, OptionalNgccOptionKeys>;
export type SharedSetup = {
  fileSystem: FileSystem; absBasePath: AbsoluteFsPath; projectPath: AbsoluteFsPath;
  tsConfig: ParsedConfiguration | null;
  getFileWriter(pkgJsonUpdater: PackageJsonUpdater): FileWriter;
};

/**
 * Instantiate common utilities that are always used and fix up options with defaults, as necessary.
 *
 * 实例化始终使用的通用工具，并根据需要使用默认值修复选项。
 *
 * NOTE: Avoid eagerly instantiating anything that might not be used when running sync/async.
 *
 * 注意：避免急切实例化运行 sync/async 时可能不会使用的任何内容。
 *
 */
export function getSharedSetup(options: NgccOptions): SharedSetup&RequiredNgccOptions&
    OptionalNgccOptions {
  const fileSystem = getFileSystem();
  const absBasePath = absoluteFrom(options.basePath);
  const projectPath = fileSystem.dirname(absBasePath);
  const tsConfig =
      options.tsConfigPath !== null ? getTsConfig(options.tsConfigPath || projectPath) : null;

  let {
    basePath,
    targetEntryPointPath,
    propertiesToConsider = SUPPORTED_FORMAT_PROPERTIES,
    typingsOnly = false,
    compileAllFormats = true,
    createNewEntryPointFormats = false,
    logger = new ConsoleLogger(LogLevel.info),
    pathMappings = getPathMappingsFromTsConfig(fileSystem, tsConfig, projectPath),
    async = false,
    errorOnFailedEntryPoint = false,
    enableI18nLegacyMessageIdFormat = true,
    invalidateEntryPointManifest = false,
    tsConfigPath,
  } = options;

  if (!!targetEntryPointPath) {
    // targetEntryPointPath forces us to error if an entry-point fails.
    errorOnFailedEntryPoint = true;
  }

  if (typingsOnly) {
    // If we only want to process the typings then we do not want to waste time trying to process
    // multiple JS formats.
    compileAllFormats = false;
  }

  checkForSolutionStyleTsConfig(fileSystem, logger, projectPath, options.tsConfigPath, tsConfig);

  return {
    basePath,
    targetEntryPointPath,
    propertiesToConsider,
    typingsOnly,
    compileAllFormats,
    createNewEntryPointFormats,
    logger,
    pathMappings,
    async,
    errorOnFailedEntryPoint,
    enableI18nLegacyMessageIdFormat,
    invalidateEntryPointManifest,
    tsConfigPath,
    fileSystem,
    absBasePath,
    projectPath,
    tsConfig,
    getFileWriter: (pkgJsonUpdater: PackageJsonUpdater) => createNewEntryPointFormats ?
        new NewEntryPointFileWriter(fileSystem, logger, errorOnFailedEntryPoint, pkgJsonUpdater) :
        new InPlaceFileWriter(fileSystem, logger, errorOnFailedEntryPoint),
  };
}

let tsConfigCache: ParsedConfiguration|null = null;
let tsConfigPathCache: string|null = null;

/**
 * Get the parsed configuration object for the given `tsConfigPath`.
 *
 * 获取给定 `tsConfigPath` 的解析后的配置对象。
 *
 * This function will cache the previous parsed configuration object to avoid unnecessary processing
 * of the tsconfig.json in the case that it is requested repeatedly.
 *
 * 此函数将缓存以前解析的配置对象，以避免在重复请求的情况下对 tsconfig.json 进行不必要的处理。
 *
 * This makes the assumption, which is true as of writing, that the contents of tsconfig.json and
 * its dependencies will not change during the life of the process running ngcc.
 *
 * 这做出了这样的假设，在撰写本文时是正确的，即 tsconfig.json 的内容及其依赖项在运行 ngcc
 * 的进程的生命周期中不会更改。
 *
 */
function getTsConfig(tsConfigPath: string): ParsedConfiguration|null {
  if (tsConfigPath !== tsConfigPathCache) {
    tsConfigPathCache = tsConfigPath;
    tsConfigCache = readConfiguration(tsConfigPath);
  }
  return tsConfigCache;
}

export function clearTsConfigCache() {
  tsConfigPathCache = null;
  tsConfigCache = null;
}

function checkForSolutionStyleTsConfig(
    fileSystem: PathManipulation, logger: Logger, projectPath: AbsoluteFsPath,
    tsConfigPath: string|null|undefined, tsConfig: ParsedConfiguration|null): void {
  if (tsConfigPath !== null && !tsConfigPath && tsConfig !== null &&
      tsConfig.rootNames.length === 0 && tsConfig.projectReferences !== undefined &&
      tsConfig.projectReferences.length > 0) {
    logger.warn(
        `The inferred tsconfig file "${tsConfig.project}" appears to be "solution-style" ` +
        `since it contains no root files but does contain project references.\n` +
        `This is probably not wanted, since ngcc is unable to infer settings like "paths" mappings from such a file.\n` +
        `Perhaps you should have explicitly specified one of the referenced projects using the --tsconfig option. For example:\n\n` +
        tsConfig.projectReferences.map(ref => `  ngcc ... --tsconfig "${ref.originalPath}"\n`)
            .join('') +
        `\nFind out more about solution-style tsconfig at https://devblogs.microsoft.com/typescript/announcing-typescript-3-9/#solution-style-tsconfig.\n` +
        `If you did intend to use this file, then you can hide this warning by providing it explicitly:\n\n` +
        `  ngcc ... --tsconfig "${fileSystem.relative(projectPath, tsConfig.project)}"`);
  }
}

/**
 * Determines the maximum number of workers to use for parallel execution. This can be set using the
 * NGCC_MAX_WORKERS environment variable, or is computed based on the number of available CPUs. One
 * CPU core is always reserved for the master process, so we take the number of CPUs minus one, with
 * a maximum of 4 workers. We don't scale the number of workers beyond 4 by default, as it takes
 * considerably more memory and CPU cycles while not offering a substantial improvement in time.
 *
 * 确定要用于并行执行的最大工作程序数。这可以用 NGCC_MAX_WORKERS 环境变量来设置，也可以根据可用的
 * CPU 数量计算。一个 CPU 核心始终为主进程保留，因此我们将 CPU 数量减一，最多 4
 * 名工作人员。默认情况下，我们不会将工作器的数量扩展到 4 之外，因为它需要更多的内存和 CPU
 * 周期，同时没有提供时间上的实质性改进。
 *
 */
export function getMaxNumberOfWorkers(): number {
  const maxWorkers = process.env.NGCC_MAX_WORKERS;
  if (maxWorkers === undefined) {
    // Use up to 4 CPU cores for workers, always reserving one for master.
    return Math.max(1, Math.min(4, os.cpus().length - 1));
  }

  const numericMaxWorkers = +maxWorkers.trim();
  if (!Number.isInteger(numericMaxWorkers)) {
    throw new Error('NGCC_MAX_WORKERS should be an integer.');
  } else if (numericMaxWorkers < 1) {
    throw new Error('NGCC_MAX_WORKERS should be at least 1.');
  }
  return numericMaxWorkers;
}
