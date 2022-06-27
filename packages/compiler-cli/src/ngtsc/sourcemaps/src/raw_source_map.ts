/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath} from '../../file_system';

import {ContentOrigin} from './content_origin';

/**
 * This interface is the basic structure of the JSON in a raw source map that one might load from
 * disk.
 *
 * 此接口是可能从磁盘加载的原始源映射中 JSON 的基本结构。
 *
 */
export interface RawSourceMap {
  version: number|string;
  file?: string;
  sourceRoot?: string;
  sources: string[];
  names: string[];
  sourcesContent?: (string|null)[];
  mappings: string;
}


/**
 * The path and content of a source-map.
 *
 * source-map 的路径和内容。
 *
 */
export interface MapAndPath {
  /**
   * The path to the source map if it was external or `null` if it was inline.
   *
   * 源映射的路径，如果是外部的，如果是内联的，则为 `null` 。
   *
   */
  mapPath: AbsoluteFsPath|null;
  /**
   * The raw source map itself.
   *
   * 原始源映射本身。
   *
   */
  map: RawSourceMap;
}

/**
 * Information about a loaded source-map.
 *
 * 有关已加载的 source-map 的信息。
 *
 */
export interface SourceMapInfo extends MapAndPath {
  /**
   * From where the content for this source-map came.
   *
   * 此 source-map 的内容来自哪里。
   *
   */
  origin: ContentOrigin;
}
