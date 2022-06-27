/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import mapHelpers from 'convert-source-map';
import {decode, encode, SourceMapMappings, SourceMapSegment} from 'sourcemap-codec';

import {AbsoluteFsPath, PathManipulation} from '../../file_system';

import {RawSourceMap, SourceMapInfo} from './raw_source_map';
import {compareSegments, offsetSegment, SegmentMarker} from './segment_marker';

export function removeSourceMapComments(contents: string): string {
  return mapHelpers.removeMapFileComments(mapHelpers.removeComments(contents))
      .replace(/\n\n$/, '\n');
}

export class SourceFile {
  /**
   * The parsed mappings that have been flattened so that any intermediate source mappings have been
   * flattened.
   *
   * 已被展平的解析映射，以便任何中间源映射都被展平。
   *
   * The result is that any source file mentioned in the flattened mappings have no source map (are
   * pure original source files).
   *
   * 结果是展平映射中提到的任何源文件都没有源映射（是纯原始源文件）。
   *
   */
  readonly flattenedMappings: Mapping[];
  readonly startOfLinePositions: number[];

  constructor(
      /** The path to this source file. */
      readonly sourcePath: AbsoluteFsPath,
      /** The contents of this source file. */
      readonly contents: string,
      /** The raw source map (if any) referenced by this source file. */
      readonly rawMap: SourceMapInfo|null,
      /** Any source files referenced by the raw source map associated with this source file. */
      readonly sources: (SourceFile|null)[],
      private fs: PathManipulation,
  ) {
    this.contents = removeSourceMapComments(contents);
    this.startOfLinePositions = computeStartOfLinePositions(this.contents);
    this.flattenedMappings = this.flattenMappings();
  }

  /**
   * Render the raw source map generated from the flattened mappings.
   *
   * 渲染从展平映射生成的原始源映射。
   *
   */
  renderFlattenedSourceMap(): RawSourceMap {
    const sources = new IndexedMap<string, string>();
    const names = new IndexedSet<string>();
    const mappings: SourceMapMappings = [];
    const sourcePathDir = this.fs.dirname(this.sourcePath);
    // Computing the relative path can be expensive, and we are likely to have the same path for
    // many (if not all!) mappings.
    const relativeSourcePathCache =
        new Cache<string, string>(input => this.fs.relative(sourcePathDir, input));

    for (const mapping of this.flattenedMappings) {
      const sourceIndex = sources.set(
          relativeSourcePathCache.get(mapping.originalSource.sourcePath),
          mapping.originalSource.contents);
      const mappingArray: SourceMapSegment = [
        mapping.generatedSegment.column,
        sourceIndex,
        mapping.originalSegment.line,
        mapping.originalSegment.column,
      ];
      if (mapping.name !== undefined) {
        const nameIndex = names.add(mapping.name);
        mappingArray.push(nameIndex);
      }

      // Ensure a mapping line array for this mapping.
      const line = mapping.generatedSegment.line;
      while (line >= mappings.length) {
        mappings.push([]);
      }
      // Add this mapping to the line
      mappings[line].push(mappingArray);
    }

    const sourceMap: RawSourceMap = {
      version: 3,
      file: this.fs.relative(sourcePathDir, this.sourcePath),
      sources: sources.keys,
      names: names.values,
      mappings: encode(mappings),
      sourcesContent: sources.values,
    };
    return sourceMap;
  }

  /**
   * Find the original mapped location for the given `line` and `column` in the generated file.
   *
   * 在生成的文件中查找给定 `line` 和 `column` 的原始映射位置。
   *
   * First we search for a mapping whose generated segment is at or directly before the given
   * location. Then we compute the offset between the given location and the matching generated
   * segment. Finally we apply this offset to the original source segment to get the desired
   * original location.
   *
   * 首先，我们搜索一个映射，其生成的段在给定位置或直接在给定位置之前。然后我们计算给定位置和匹配的生成段之间的偏移量。最后，我们将此偏移量应用于原始源段，以获取所需的原始位置。
   *
   */
  getOriginalLocation(line: number, column: number):
      {file: AbsoluteFsPath, line: number, column: number}|null {
    if (this.flattenedMappings.length === 0) {
      return null;
    }

    let position: number;
    if (line < this.startOfLinePositions.length) {
      position = this.startOfLinePositions[line] + column;
    } else {
      // The line is off the end of the file, so just assume we are at the end of the file.
      position = this.contents.length;
    }

    const locationSegment: SegmentMarker = {line, column, position, next: undefined};

    let mappingIndex =
        findLastMappingIndexBefore(this.flattenedMappings, locationSegment, false, 0);
    if (mappingIndex < 0) {
      mappingIndex = 0;
    }
    const {originalSegment, originalSource, generatedSegment} =
        this.flattenedMappings[mappingIndex];
    const offset = locationSegment.position - generatedSegment.position;
    const offsetOriginalSegment =
        offsetSegment(originalSource.startOfLinePositions, originalSegment, offset);

    return {
      file: originalSource.sourcePath,
      line: offsetOriginalSegment.line,
      column: offsetOriginalSegment.column,
    };
  }

  /**
   * Flatten the parsed mappings for this source file, so that all the mappings are to pure original
   * source files with no transitive source maps.
   *
   * 展平此源文件的解析映射，以便所有映射都是到没有可传递源映射的纯原始源文件。
   *
   */
  private flattenMappings(): Mapping[] {
    const mappings =
        parseMappings(this.rawMap && this.rawMap.map, this.sources, this.startOfLinePositions);
    ensureOriginalSegmentLinks(mappings);
    const flattenedMappings: Mapping[] = [];
    for (let mappingIndex = 0; mappingIndex < mappings.length; mappingIndex++) {
      const aToBmapping = mappings[mappingIndex];
      const bSource = aToBmapping.originalSource;
      if (bSource.flattenedMappings.length === 0) {
        // The b source file has no mappings of its own (i.e. it is a pure original file)
        // so just use the mapping as-is.
        flattenedMappings.push(aToBmapping);
        continue;
      }

      // The `incomingStart` and `incomingEnd` are the `SegmentMarker`s in `B` that represent the
      // section of `B` source file that is being mapped to by the current `aToBmapping`.
      //
      // For example, consider the mappings from A to B:
      //
      // src A   src B     mapping
      //
      //   a ----- a       [0, 0]
      //   b       b
      //   f -  /- c       [4, 2]
      //   g  \ /  d
      //   c -/\   e
      //   d    \- f       [2, 5]
      //   e
      //
      // For mapping [0,0] the incoming start and end are 0 and 2 (i.e. the range a, b, c)
      // For mapping [4,2] the incoming start and end are 2 and 5 (i.e. the range c, d, e, f)
      //
      const incomingStart = aToBmapping.originalSegment;
      const incomingEnd = incomingStart.next;

      // The `outgoingStartIndex` and `outgoingEndIndex` are the indices of the range of mappings
      // that leave `b` that we are interested in merging with the aToBmapping.
      // We actually care about all the markers from the last bToCmapping directly before the
      // `incomingStart` to the last bToCmaping directly before the `incomingEnd`, inclusive.
      //
      // For example, if we consider the range 2 to 5 from above (i.e. c, d, e, f) with the
      // following mappings from B to C:
      //
      //   src B   src C     mapping
      //     a
      //     b ----- b       [1, 0]
      //   - c       c
      //  |  d       d
      //  |  e ----- 1       [4, 3]
      //   - f  \    2
      //         \   3
      //          \- e       [4, 6]
      //
      // The range with `incomingStart` at 2 and `incomingEnd` at 5 has outgoing start mapping of
      // [1,0] and outgoing end mapping of [4, 6], which also includes [4, 3].
      //
      let outgoingStartIndex =
          findLastMappingIndexBefore(bSource.flattenedMappings, incomingStart, false, 0);
      if (outgoingStartIndex < 0) {
        outgoingStartIndex = 0;
      }
      const outgoingEndIndex = incomingEnd !== undefined ?
          findLastMappingIndexBefore(
              bSource.flattenedMappings, incomingEnd, true, outgoingStartIndex) :
          bSource.flattenedMappings.length - 1;

      for (let bToCmappingIndex = outgoingStartIndex; bToCmappingIndex <= outgoingEndIndex;
           bToCmappingIndex++) {
        const bToCmapping: Mapping = bSource.flattenedMappings[bToCmappingIndex];
        flattenedMappings.push(mergeMappings(this, aToBmapping, bToCmapping));
      }
    }
    return flattenedMappings;
  }
}

/**
 *
 * @param mappings The collection of mappings whose segment-markers we are searching.
 *
 * 我们正在搜索其段标记的映射集合。
 *
 * @param marker The segment-marker to match against those of the given `mappings`.
 *
 * 要与给定 `mappings` 的段标记匹配的段标记。
 *
 * @param exclusive If exclusive then we must find a mapping with a segment-marker that is
 * exclusively earlier than the given `marker`.
 * If not exclusive then we can return the highest mappings with an equivalent segment-marker to the
 * given `marker`.
 *
 * 如果是互斥的，那么我们必须找到一个带有 segment-marker 的映射，并且比给定的 `marker`
 * 早。如果不是排他的，那么我们可以将使用等效的 Segment-marker 的最高映射返回到给定的 `marker` 。
 *
 * @param lowerIndex If provided, this is used as a hint that the marker we are searching for has an
 * index that is no lower than this.
 *
 * 如果提供，这将用作提示我们正在搜索的标记具有不低于此的索引。
 *
 */
export function findLastMappingIndexBefore(
    mappings: Mapping[], marker: SegmentMarker, exclusive: boolean, lowerIndex: number): number {
  let upperIndex = mappings.length - 1;
  const test = exclusive ? -1 : 0;

  if (compareSegments(mappings[lowerIndex].generatedSegment, marker) > test) {
    // Exit early since the marker is outside the allowed range of mappings.
    return -1;
  }

  let matchingIndex = -1;
  while (lowerIndex <= upperIndex) {
    const index = (upperIndex + lowerIndex) >> 1;
    if (compareSegments(mappings[index].generatedSegment, marker) <= test) {
      matchingIndex = index;
      lowerIndex = index + 1;
    } else {
      upperIndex = index - 1;
    }
  }
  return matchingIndex;
}

/**
 * A Mapping consists of two segment markers: one in the generated source and one in the original
 * source, which indicate the start of each segment. The end of a segment is indicated by the first
 * segment marker of another mapping whose start is greater or equal to this one.
 *
 * 映射由两个段标记组成：一个在生成的源中，一个在原始源中，它们表明每个段的开始。段的结尾由另一个映射的第一个段标记表示，其开始大于或等于此映射。
 *
 * It may also include a name associated with the segment being mapped.
 *
 * 它还可能包括与被映射的段相关联的名称。
 *
 */
export interface Mapping {
  readonly generatedSegment: SegmentMarker;
  readonly originalSource: SourceFile;
  readonly originalSegment: SegmentMarker;
  readonly name?: string;
}



/**
 * Merge two mappings that go from A to B and B to C, to result in a mapping that goes from A to C.
 *
 * 合并从 A 到 B 和 B 到 C 的两个映射，以生成从 A 到 C 的映射。
 *
 */
export function mergeMappings(generatedSource: SourceFile, ab: Mapping, bc: Mapping): Mapping {
  const name = bc.name || ab.name;

  // We need to modify the segment-markers of the new mapping to take into account the shifts that
  // occur due to the combination of the two mappings.
  // For example:

  // * Simple map where the B->C starts at the same place the A->B ends:
  //
  // ```
  // A: 1 2 b c d
  //        |        A->B [2,0]
  //        |              |
  // B:     b c d    A->C [2,1]
  //        |                |
  //        |        B->C [0,1]
  // C:   a b c d e
  // ```

  // * More complicated case where diffs of segment-markers is needed:
  //
  // ```
  // A: b 1 2 c d
  //     \
  //      |            A->B  [0,1*]    [0,1*]
  //      |                   |         |+3
  // B: a b 1 2 c d    A->C  [0,1]     [3,2]
  //    |      /                |+1       |
  //    |     /        B->C [0*,0]    [4*,2]
  //    |    /
  // C: a b c d e
  // ```
  //
  // `[0,1]` mapping from A->C:
  // The difference between the "original segment-marker" of A->B (1*) and the "generated
  // segment-marker of B->C (0*): `1 - 0 = +1`.
  // Since it is positive we must increment the "original segment-marker" with `1` to give [0,1].
  //
  // `[3,2]` mapping from A->C:
  // The difference between the "original segment-marker" of A->B (1*) and the "generated
  // segment-marker" of B->C (4*): `1 - 4 = -3`.
  // Since it is negative we must increment the "generated segment-marker" with `3` to give [3,2].

  const diff = compareSegments(bc.generatedSegment, ab.originalSegment);
  if (diff > 0) {
    return {
      name,
      generatedSegment:
          offsetSegment(generatedSource.startOfLinePositions, ab.generatedSegment, diff),
      originalSource: bc.originalSource,
      originalSegment: bc.originalSegment,
    };
  } else {
    return {
      name,
      generatedSegment: ab.generatedSegment,
      originalSource: bc.originalSource,
      originalSegment:
          offsetSegment(bc.originalSource.startOfLinePositions, bc.originalSegment, -diff),
    };
  }
}

/**
 * Parse the `rawMappings` into an array of parsed mappings, which reference source-files provided
 * in the `sources` parameter.
 *
 * 将 `rawMappings` 解析为解析后的映射数组，该数组会引用 `sources` 参数中提供的 source-files 。
 *
 */
export function parseMappings(
    rawMap: RawSourceMap|null, sources: (SourceFile|null)[],
    generatedSourceStartOfLinePositions: number[]): Mapping[] {
  if (rawMap === null) {
    return [];
  }

  const rawMappings = decode(rawMap.mappings);
  if (rawMappings === null) {
    return [];
  }

  const mappings: Mapping[] = [];
  for (let generatedLine = 0; generatedLine < rawMappings.length; generatedLine++) {
    const generatedLineMappings = rawMappings[generatedLine];
    for (const rawMapping of generatedLineMappings) {
      if (rawMapping.length >= 4) {
        const originalSource = sources[rawMapping[1]!];
        if (originalSource === null || originalSource === undefined) {
          // the original source is missing so ignore this mapping
          continue;
        }
        const generatedColumn = rawMapping[0];
        const name = rawMapping.length === 5 ? rawMap.names[rawMapping[4]] : undefined;
        const line = rawMapping[2]!;
        const column = rawMapping[3]!;
        const generatedSegment: SegmentMarker = {
          line: generatedLine,
          column: generatedColumn,
          position: generatedSourceStartOfLinePositions[generatedLine] + generatedColumn,
          next: undefined,
        };
        const originalSegment: SegmentMarker = {
          line,
          column,
          position: originalSource.startOfLinePositions[line] + column,
          next: undefined,
        };
        mappings.push({name, generatedSegment, originalSegment, originalSource});
      }
    }
  }
  return mappings;
}

/**
 * Extract the segment markers from the original source files in each mapping of an array of
 * `mappings`.
 *
 * 从映射数组的每个 `mappings` 中的原始源文件中提取段标记。
 *
 * @param mappings The mappings whose original segments we want to extract
 *
 * 我们要提取其原始段的映射
 *
 * @returns
 *
 * Return a map from original source-files (referenced in the `mappings`) to arrays of
 * segment-markers sorted by their order in their source file.
 *
 * 返回从原始 source-files （在 `mappings` 中引用）到按源文件中的顺序排序的段标记数组的映射。
 *
 */
export function extractOriginalSegments(mappings: Mapping[]): Map<SourceFile, SegmentMarker[]> {
  const originalSegments = new Map<SourceFile, SegmentMarker[]>();
  for (const mapping of mappings) {
    const originalSource = mapping.originalSource;
    if (!originalSegments.has(originalSource)) {
      originalSegments.set(originalSource, []);
    }
    const segments = originalSegments.get(originalSource)!;
    segments.push(mapping.originalSegment);
  }
  originalSegments.forEach(segmentMarkers => segmentMarkers.sort(compareSegments));
  return originalSegments;
}

/**
 * Update the original segments of each of the given `mappings` to include a link to the next
 * segment in the source file.
 *
 * 更新每个给定 `mappings` 的原始段，以包含到源文件中下一个段的链接。
 *
 * @param mappings the mappings whose segments should be updated
 *
 * 应该更新其段的映射
 *
 */
export function ensureOriginalSegmentLinks(mappings: Mapping[]): void {
  const segmentsBySource = extractOriginalSegments(mappings);
  segmentsBySource.forEach(markers => {
    for (let i = 0; i < markers.length - 1; i++) {
      markers[i].next = markers[i + 1];
    }
  });
}

export function computeStartOfLinePositions(str: string) {
  // The `1` is to indicate a newline character between the lines.
  // Note that in the actual contents there could be more than one character that indicates a
  // newline
  // - e.g. \r\n - but that is not important here since segment-markers are in line/column pairs and
  // so differences in length due to extra `\r` characters do not affect the algorithms.
  const NEWLINE_MARKER_OFFSET = 1;
  const lineLengths = computeLineLengths(str);
  const startPositions = [0];  // First line starts at position 0
  for (let i = 0; i < lineLengths.length - 1; i++) {
    startPositions.push(startPositions[i] + lineLengths[i] + NEWLINE_MARKER_OFFSET);
  }
  return startPositions;
}

function computeLineLengths(str: string): number[] {
  return (str.split(/\n/)).map(s => s.length);
}

/**
 * A collection of mappings between `keys` and `values` stored in the order in which the keys are
 * first seen.
 *
 * `keys` 和 `values` 之间的映射集合，按照键的第一次出现的顺序存储。
 *
 * The difference between this and a standard `Map` is that when you add a key-value pair the index
 * of the `key` is returned.
 *
 * 这与标准 `Map` 之间的区别在于，当你添加键值对时，会返回 `key` 的索引。
 *
 */
class IndexedMap<K, V> {
  private map = new Map<K, number>();

  /**
   * An array of keys added to this map.
   *
   * 添加到此映射表的键数组。
   *
   * This array is guaranteed to be in the order of the first time the key was added to the map.
   *
   * 保证此数组的顺序与键第一次添加到映射表时一样。
   *
   */
  readonly keys: K[] = [];

  /**
   * An array of values added to this map.
   *
   * 添加到此映射表的值数组。
   *
   * This array is guaranteed to be in the order of the first time the associated key was added to
   * the map.
   *
   * 保证此数组的顺序与第一次将关联的键添加到映射表时一样。
   *
   */
  readonly values: V[] = [];

  /**
   * Associate the `value` with the `key` and return the index of the key in the collection.
   *
   * 将 `value` 与 `key` 关联起来，并返回集合中键的索引。
   *
   * If the `key` already exists then the `value` is not set and the index of that `key` is
   * returned; otherwise the `key` and `value` are stored and the index of the new `key` is
   * returned.
   *
   * 如果 `key` 已经存在，则不设置 `value` 并返回该 `key` 的索引；否则存储 `key` 和 `value` 并返回新
   * `key` 的索引。
   *
   * @param key the key to associated with the `value`.
   *
   * 与 `value` 关联的键。
   *
   * @param value the value to associated with the `key`.
   *
   * 与 `key` 关联的值。
   *
   * @returns
   *
   * the index of the `key` in the `keys` array.
   *
   * `keys` 数组中的 `key` 的索引。
   *
   */
  set(key: K, value: V): number {
    if (this.map.has(key)) {
      return this.map.get(key)!;
    }
    const index = this.values.push(value) - 1;
    this.keys.push(key);
    this.map.set(key, index);
    return index;
  }
}

/**
 * A collection of `values` stored in the order in which they were added.
 *
 * 按添加顺序存储的 `values` 的集合。
 *
 * The difference between this and a standard `Set` is that when you add a value the index of that
 * item is returned.
 *
 * 这与标准 `Set` 之间的区别在于，当你添加值时，会返回该条目的索引。
 *
 */
class IndexedSet<V> {
  private map = new Map<V, number>();

  /**
   * An array of values added to this set.
   * This array is guaranteed to be in the order of the first time the value was added to the set.
   *
   * 添加到此集的值数组。保证此数组的顺序与第一次将值添加到集合时一样。
   *
   */
  readonly values: V[] = [];

  /**
   * Add the `value` to the `values` array, if it doesn't already exist; returning the index of the
   * `value` in the `values` array.
   *
   * 将 `value` 添加到 `values` 数组（如果不存在）；返回 `values` 数组中 `value` 的索引。
   *
   * If the `value` already exists then the index of that `value` is returned, otherwise the new
   * `value` is stored and the new index returned.
   *
   * 如果 `value` 已经存在，则返回该 `value` 的索引，否则存储新 `value` 并返回新索引。
   *
   * @param value the value to add to the set.
   *
   * 要添加到集合中的值。
   *
   * @returns
   *
   * the index of the `value` in the `values` array.
   *
   * `values` 数组中的 `value` 的索引。
   *
   */
  add(value: V): number {
    if (this.map.has(value)) {
      return this.map.get(value)!;
    }
    const index = this.values.push(value) - 1;
    this.map.set(value, index);
    return index;
  }
}

class Cache<Input, Cached> {
  private map = new Map<Input, Cached>();
  constructor(private computeFn: (input: Input) => Cached) {}
  get(input: Input): Cached {
    if (!this.map.has(input)) {
      this.map.set(input, this.computeFn(input));
    }
    return this.map.get(input)!;
  }
}
