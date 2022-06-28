/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {AbsoluteFsPath} from '../../../file_system';
import {FactoryTracker} from '../../../shims/api';

import {ExtendedTsCompilerHost, UnifiedModulesHost} from './interfaces';

/**
 * Names of methods from `ExtendedTsCompilerHost` that need to be provided by the
 * `NgCompilerAdapter`.
 *
 * `ExtendedTsCompilerHost` 中需要由 `NgCompilerAdapter` 提供的方法名称。
 *
 */
export type ExtendedCompilerHostMethods =
    // Used to normalize filenames for the host system. Important for proper case-sensitive file
    // handling.
    'getCanonicalFileName'|
    // An optional method of `ts.CompilerHost` where an implementer can override module resolution.
    'resolveModuleNames'|
    // Retrieve the current working directory. Unlike in `ts.ModuleResolutionHost`, this is a
    // required method.
    'getCurrentDirectory'|
    // Additional methods of `ExtendedTsCompilerHost` related to resource files (e.g. HTML
    // templates). These are optional.
    'getModifiedResourceFiles'|'readResource'|'resourceNameToFileName'|'transformResource';

/**
 * Adapter for `NgCompiler` that allows it to be used in various circumstances, such as
 * command-line `ngc`, as a plugin to `ts_library` in Bazel, or from the Language Service.
 *
 * `NgCompiler` 的适配器，允许它在各种情况下使用，例如命令行 `ngc` 、作为 Bazel 中 `ts_library`
 * 的插件或来自语言服务。
 *
 * `NgCompilerAdapter` is a subset of the `NgCompilerHost` implementation of `ts.CompilerHost`
 * which is relied upon by `NgCompiler`. A consumer of `NgCompiler` can therefore use the
 * `NgCompilerHost` or implement `NgCompilerAdapter` itself.
 *
 * `NgCompilerAdapter` 是 ts.CompilerHost 的 `NgCompilerHost` 实现的子集，`ts.CompilerHost` 依赖于
 * `NgCompiler` 。因此，`NgCompiler` 的使用者可以使用 `NgCompilerHost` 或实现 `NgCompilerAdapter`
 * 本身。
 *
 */
export interface NgCompilerAdapter extends
    // getCurrentDirectory is removed from `ts.ModuleResolutionHost` because it's optional, and
    // incompatible with the `ts.CompilerHost` version which isn't. The combination of these two
    // still satisfies `ts.ModuleResolutionHost`.
        Omit<ts.ModuleResolutionHost, 'getCurrentDirectory'>,
    Pick<ExtendedTsCompilerHost, 'getCurrentDirectory'|ExtendedCompilerHostMethods>,
    SourceFileTypeIdentifier {
  /**
   * A path to a single file which represents the entrypoint of an Angular Package Format library,
   * if the current program is one.
   *
   * 单个文件的路径，如果当前程序是 1，则表示 Angular 包格式库的入口点。
   *
   * This is used to emit a flat module index if requested, and can be left `null` if that is not
   * required.
   *
   * 如果请求，这用于发出平面模块索引，如果不需要，可以保留为 `null` 。
   *
   */
  readonly entryPoint: AbsoluteFsPath|null;

  /**
   * An array of `ts.Diagnostic`s that occurred during construction of the `ts.Program`.
   *
   * 在 `ts.Diagnostic` 构建期间发生的 `ts.Program` 。
   *
   */
  readonly constructionDiagnostics: ts.Diagnostic[];

  /**
   * A `Set` of `ts.SourceFile`s which are internal to the program and should not be emitted as JS
   * files.
   *
   * 一 `Set` `ts.SourceFile` ，是程序内部的，不应作为 JS 文件发出。
   *
   * Often these are shim files such as `ngtypecheck` shims used for template type-checking in
   * command-line ngc.
   *
   * 通常这些是 shim 文件，例如 `ngtypecheck` shims，用于在命令行 ngc 中进行模板类型检查。
   *
   */
  readonly ignoreForEmit: Set<ts.SourceFile>;

  /**
   * A tracker for usage of symbols in `.ngfactory` shims.
   *
   * 用于 `.ngfactory` shims 中符号使用情况的跟踪器。
   *
   * This can be left `null` if such shims are not a part of the `ts.Program`.
   *
   * 如果这样的垫片不是 `ts.Program` 的一部分，可以将其保留为 `null` 。
   *
   */
  readonly factoryTracker: FactoryTracker|null;

  /**
   * A specialized interface provided in some environments (such as Bazel) which overrides how
   * import specifiers are generated.
   *
   * 在某些环境（例如 Bazel）中提供的专门接口，它会覆盖导入说明符的生成方式。
   *
   * If not required, this can be `null`.
   *
   * 如果不需要，这可以是 `null` 。
   *
   */
  readonly unifiedModulesHost: UnifiedModulesHost|null;

  /**
   * Resolved list of root directories explicitly set in, or inferred from, the tsconfig.
   *
   * 在 tsconfig 中显式设置或推断的根目录的解析列表。
   *
   */
  readonly rootDirs: ReadonlyArray<AbsoluteFsPath>;
}

export interface SourceFileTypeIdentifier {
  /**
   * Distinguishes between shim files added by Angular to the compilation process (both those
   * intended for output, like ngfactory files, as well as internal shims like ngtypecheck files)
   * and original files in the user's program.
   *
   * 区分 Angular 添加到编译过程的 shim 文件（用于输出的文件，例如 ngfactory 文件，以及内部
   * shim，例如 ngtypecheck 文件）和用户程序中的原始文件。
   *
   * This is mostly used to limit type-checking operations to only user files. It should return
   * `true` if a file was written by the user, and `false` if a file was added by the compiler.
   *
   * 这主要用于将类型检查操作限制为仅用户文件。如果文件是由用户编写的，它应该返回 `true`
   * ，如果是编译器添加的文件，则应该返回 `false` 。
   *
   */
  isShim(sf: ts.SourceFile): boolean;

  /**
   * Distinguishes between resource files added by Angular to the project and original files in the
   * user's program.
   *
   * 区分 Angular 添加到项目的资源文件和用户程序中的原始文件。
   *
   * This is necessary only for the language service because it adds resource files as root files
   * when they are read. This is done to indicate to TS Server that these resources are part of the
   * project and ensures that projects are retained properly when navigating around the workspace.
   *
   * 这仅对于语言服务是必要的，因为它在读取资源文件时将它们添加为根文件。这样做是为了向 TS
   * 服务器表明这些资源是项目的一部分，并确保项目在工作区导航时被正确保留。
   *
   */
  isResource(sf: ts.SourceFile): boolean;
}
