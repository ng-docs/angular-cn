/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// This file contains types that will be published to npm in library typings files.

/**
 * @publicApi
 */
export type ɵɵDirectiveDeclaration<
    T, Selector extends string, ExportAs extends
        string[], InputMap extends {[key: string]: string},
                                   OutputMap extends {[key: string]: string},
                                                     QueryFields extends string[]> = unknown;

/**
 * @publicApi
 */
export type ɵɵComponentDeclaration < T, Selector extends String, ExportAs extends string[],
                                                                                  InputMap extends {
  [key: string]: string;
}
, OutputMap extends {
  [key: string]: string;
}
, QueryFields extends string[], NgContentSelectors extends string[] > = unknown;

/**
 * @publicApi
 */
export type ɵɵNgModuleDeclaration<T, Declarations, Imports, Exports> = unknown;

/**
 * @publicApi
 */
export type ɵɵPipeDeclaration<T, Name extends string> = unknown;

/**
 * @publicApi
 */
export type ɵɵInjectorDeclaration<T> = unknown;

/**
 * @publicApi
 */
export type ɵɵFactoryDeclaration<T, CtorDependencies extends CtorDependency[]> = unknown;

/**
 * An object literal of this type is used to represent the metadata of a constructor dependency.
 * The type itself is never referred to from generated code.
 *
 * @publicApi
 */
export type CtorDependency = {
  /**
   * If an `@Attribute` decorator is used, this represents the injected attribute's name. If the
   * attribute name is a dynamic expression instead of a string literal, this will be the unknown
   * type.
   */
  attribute?: string|unknown;

  /**
   * If `@Optional()` is used, this key is set to true.
   */
  optional?: true;

  /**
   * If `@Host` is used, this key is set to true.
   */
  host?: true;

  /**
   * If `@Self` is used, this key is set to true.
   */
  self?: true;

  /**
   * If `@SkipSelf` is used, this key is set to true.
   */
  skipSelf?: true;
}|null;
