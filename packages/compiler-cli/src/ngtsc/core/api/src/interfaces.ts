/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

/**
 * A host backed by a build system which has a unified view of the module namespace.
 *
 * 由构建系统支持的主机，它具有模块命名空间的统一视图。
 *
 * Such a build system supports the `fileNameToModuleName` method provided by certain build system
 * integrations (such as the integration with Bazel). See the docs on `fileNameToModuleName` for
 * more details.
 *
 * 这样的构建系统支持某些构建系统集成（例如与 Bazel 的集成）提供的 `fileNameToModuleName`
 * 方法。有关更多详细信息，请参阅 `fileNameToModuleName` 上的文档。
 *
 */
export interface UnifiedModulesHost {
  /**
   * Converts a file path to a module name that can be used as an `import ...`.
   *
   * 将文件路径转换为可用作 `import ...` 的模块名称。
   *
   * For example, such a host might determine that `/absolute/path/to/monorepo/lib/importedFile.ts`
   * should be imported using a module specifier of `monorepo/lib/importedFile`.
   *
   * 例如，这样的主机可能会确定 `/absolute/path/to/monorepo/lib/importedFile.ts` 应该使用
   * `monorepo/lib/importedFile` 模块说明符来导入。
   *
   */
  fileNameToModuleName(importedFilePath: string, containingFilePath: string): string;
}

/**
 * A host which additionally tracks and produces "resources" (HTML templates, CSS
 * files, etc).
 *
 * 额外跟踪和生成“资源”（HTML 模板、CSS 文件等）的主机。
 *
 */
export interface ResourceHost {
  /**
   * Converts a file path for a resource that is used in a source file or another resource
   * into a filepath.
   *
   * 将源文件或另一个资源中使用的资源的文件路径转换为文件路径。
   *
   * The optional `fallbackResolve` method can be used as a way to attempt a fallback resolution if
   * the implementation's `resourceNameToFileName` resolution fails.
   *
   * 如果实现的 `resourceNameToFileName` 解析失败，可选的 `fallbackResolve`
   * 方法可以作为尝试后备解析的一种方式。
   *
   */
  resourceNameToFileName(
      resourceName: string, containingFilePath: string,
      fallbackResolve?: (url: string, fromFile: string) => string | null): string|null;

  /**
   * Load a referenced resource either statically or asynchronously. If the host returns a
   * `Promise<string>` it is assumed the user of the corresponding `Program` will call
   * `loadNgStructureAsync()`. Returning  `Promise<string>` outside `loadNgStructureAsync()` will
   * cause a diagnostics error or an exception to be thrown.
   *
   * 静态或异步加载引用的资源。如果主机返回 `Promise<string>` ，则假定相应 `Program` 的用户将调用
   * `loadNgStructureAsync()` 。在 `loadNgStructureAsync()` 之外返回 `Promise<string>`
   * 将导致诊断错误或抛出异常。
   *
   */
  readResource(fileName: string): Promise<string>|string;

  /**
   * Get the absolute paths to the changed files that triggered the current compilation
   * or `undefined` if this is not an incremental build.
   *
   * 获取触发当前编译的已更改文件的绝对路径，如果这不是增量构建，则获取 `undefined` 。
   *
   */
  getModifiedResourceFiles?(): Set<string>|undefined;

  /**
   * Transform an inline or external resource asynchronously.
   * It is assumed the consumer of the corresponding `Program` will call
   * `loadNgStructureAsync()`. Using outside `loadNgStructureAsync()` will
   * cause a diagnostics error or an exception to be thrown.
   * Only style resources are currently supported.
   *
   * 异步转换内联或外部资源。假定相应 `Program` 的使用者将调用 `loadNgStructureAsync()` 。使用外部
   * `loadNgStructureAsync()` 将导致诊断错误或抛出异常。当前仅支持样式资源。
   *
   * @param data The resource data to transform.
   *
   * 要转换的资源数据。
   *
   * @param context Information regarding the resource such as the type and containing file.
   *
   * 有关资源的信息，例如类型和包含文件。
   *
   * @returns
   *
   * A promise of either the transformed resource data or null if no transformation occurs.
   *
   * 转换后的资源数据的承诺，如果不发生转换，则为 null 。
   *
   */
  transformResource?
      (data: string, context: ResourceHostContext): Promise<TransformResourceResult|null>;
}

/**
 * Contextual information used by members of the ResourceHost interface.
 *
 * ResourceHost 接口成员使用的上下文信息。
 *
 */
export interface ResourceHostContext {
  /**
   * The type of the component resource. Templates are not yet supported.
   *
   * 组件资源的类型。尚不支持模板。
   *
   * * Resources referenced via a component's `styles` or `styleUrls` properties are of
   *   type `style`.
   *
   *   通过组件的 `styles` 或 `styleUrls` 属性引用的资源是 `style` 类型。
   *
   */
  readonly type: 'style';
  /**
   * The absolute path to the resource file. If the resource is inline, the value will be null.
   *
   * 资源文件的绝对路径。如果资源是内联的，则值为 null。
   *
   */
  readonly resourceFile: string|null;
  /**
   * The absolute path to the file that contains the resource or reference to the resource.
   *
   * 包含资源或对资源引用的文件的绝对路径。
   *
   */
  readonly containingFile: string;
}

/**
 * The successful transformation result of the `ResourceHost.transformResource` function.
 * This interface may be expanded in the future to include diagnostic information and source mapping
 * support.
 *
 * `ResourceHost.transformResource`
 * 函数的成功转换结果。将来可能会扩展此接口，以包括诊断信息和源映射支持。
 *
 */
export interface TransformResourceResult {
  /**
   * The content generated by the transformation.
   *
   * 转换生成的内容。
   *
   */
  content: string;
}

/**
 * A `ts.CompilerHost` interface which supports some number of optional methods in addition to the
 * core interface.
 *
 * 一个 `ts.CompilerHost` 接口，除了核心接口之外，它还支持某些数量的可选方法。
 *
 */
export interface ExtendedTsCompilerHost extends ts.CompilerHost, Partial<ResourceHost>,
                                                Partial<UnifiedModulesHost> {}
