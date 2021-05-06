/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';

/**
 * A host backed by a build system which has a unified view of the module namespace.
 *
 * Such a build system supports the `fileNameToModuleName` method provided by certain build system
 * integrations (such as the integration with Bazel). See the docs on `fileNameToModuleName` for
 * more details.
 */
export interface UnifiedModulesHost {
  /**
   * Converts a file path to a module name that can be used as an `import ...`.
   *
   * For example, such a host might determine that `/absolute/path/to/monorepo/lib/importedFile.ts`
   * should be imported using a module specifier of `monorepo/lib/importedFile`.
   */
  fileNameToModuleName(importedFilePath: string, containingFilePath: string): string;
}

/**
 * A host which additionally tracks and produces "resources" (HTML templates, CSS
 * files, etc).
 */
export interface ResourceHost {
  /**
   * Converts a file path for a resource that is used in a source file or another resource
   * into a filepath.
   *
   * The optional `fallbackResolve` method can be used as a way to attempt a fallback resolution if
   * the implementation's `resourceNameToFileName` resolution fails.
   */
  resourceNameToFileName(
      resourceName: string, containingFilePath: string,
      fallbackResolve?: (url: string, fromFile: string) => string | null): string|null;

  /**
   * Load a referenced resource either statically or asynchronously. If the host returns a
   * `Promise<string>` it is assumed the user of the corresponding `Program` will call
   * `loadNgStructureAsync()`. Returning  `Promise<string>` outside `loadNgStructureAsync()` will
   * cause a diagnostics diagnostic error or an exception to be thrown.
   */
  readResource(fileName: string): Promise<string>|string;

  /**
   * Get the absolute paths to the changed files that triggered the current compilation
   * or `undefined` if this is not an incremental build.
   */
  getModifiedResourceFiles?(): Set<string>|undefined;

  /**
   * Transform an inline or external resource asynchronously.
   * It is assumed the consumer of the corresponding `Program` will call
   * `loadNgStructureAsync()`. Using outside `loadNgStructureAsync()` will
   * cause a diagnostics error or an exception to be thrown.
   * Only style resources are currently supported.
   *
   * @param data The resource data to transform.
   * @param context Information regarding the resource such as the type and containing file.
   * @returns A promise of either the transformed resource data or null if no transformation occurs.
   */
  transformResource?
      (data: string, context: ResourceHostContext): Promise<TransformResourceResult|null>;
}

/**
 * Contextual information used by members of the ResourceHost interface.
 */
export interface ResourceHostContext {
  /**
   * The type of the component resource. Templates are not yet supported.
   * * Resources referenced via a component's `styles` or `styleUrls` properties are of
   * type `style`.
   */
  readonly type: 'style';
  /**
   * The absolute path to the resource file. If the resource is inline, the value will be null.
   */
  readonly resourceFile: string|null;
  /**
   * The absolute path to the file that contains the resource or reference to the resource.
   */
  readonly containingFile: string;
}

/**
 * The successful transformation result of the `ResourceHost.transformResource` function.
 * This interface may be expanded in the future to include diagnostic information and source mapping
 * support.
 */
export interface TransformResourceResult {
  /**
   * The content generated by the transformation.
   */
  content: string;
}

/**
 * A `ts.CompilerHost` interface which supports some number of optional methods in addition to the
 * core interface.
 */
export interface ExtendedTsCompilerHost extends ts.CompilerHost, Partial<ResourceHost>,
                                                Partial<UnifiedModulesHost> {}

export interface LazyRoute {
  route: string;
  module: {name: string, filePath: string};
  referencedModule: {name: string, filePath: string};
}
