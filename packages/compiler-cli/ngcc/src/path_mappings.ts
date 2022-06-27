/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, PathManipulation} from '../../src/ngtsc/file_system';
import {ParsedConfiguration} from '../../src/perform_compile';

export type PathMappings = {
  baseUrl: string,
  paths: {[key: string]: string[]}
};

/**
 * If `pathMappings` is not provided directly, then try getting it from `tsConfig`, if available.
 *
 * 如果未直接提供 `pathMappings` ，请尝试从 `tsConfig` （如果可用）获取它。
 *
 */
export function getPathMappingsFromTsConfig(
    fs: PathManipulation, tsConfig: ParsedConfiguration|null,
    projectPath: AbsoluteFsPath): PathMappings|undefined {
  if (tsConfig !== null && tsConfig.options.baseUrl !== undefined &&
      tsConfig.options.paths !== undefined) {
    return {
      baseUrl: fs.resolve(projectPath, tsConfig.options.baseUrl),
      paths: tsConfig.options.paths,
    };
  }
}
