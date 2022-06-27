/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * A marker that indicates the start of a segment in a mapping.
 *
 * 一个标记，用于指示映射中段的开始。
 *
 * The end of a segment is indicated by the first segment-marker of another mapping whose start
 * is greater or equal to this one.
 *
 * 段的结尾由另一个映射的第一个段标记表示，其开始大于或等于这个。
 *
 */
export interface SegmentMarker {
  readonly line: number;
  readonly column: number;
  readonly position: number;
  next: SegmentMarker|undefined;
}

/**
 * Compare two segment-markers, for use in a search or sorting algorithm.
 *
 * 比较两个段标记，用于搜索或排序算法。
 *
 * @returns
 *
 * a positive number if `a` is after `b`, a negative number if `b` is after `a`
 * and zero if they are at the same position.
 *
 * 如果 `a` 在 `b` 之后，则为正数，如果 `b` 在 `a` 之后，则为负数，如果它们在同一个位置，则为零。
 *
 */
export function compareSegments(a: SegmentMarker, b: SegmentMarker): number {
  return a.position - b.position;
}

/**
 * Return a new segment-marker that is offset by the given number of characters.
 *
 * 返回一个由给定字符数偏移的新段标记。
 *
 * @param startOfLinePositions the position of the start of each line of content of the source file
 * whose segment-marker we are offsetting.
 *
 * 我们要偏移其段标记的源文件的每一行内容的开始位置。
 *
 * @param marker the segment to offset.
 *
 * 要偏移的段。
 *
 * @param offset the number of character to offset by.
 *
 * 要偏移的字符数。
 *
 */
export function offsetSegment(
    startOfLinePositions: number[], marker: SegmentMarker, offset: number): SegmentMarker {
  if (offset === 0) {
    return marker;
  }

  let line = marker.line;
  const position = marker.position + offset;
  while (line < startOfLinePositions.length - 1 && startOfLinePositions[line + 1] <= position) {
    line++;
  }
  while (line > 0 && startOfLinePositions[line] > position) {
    line--;
  }
  const column = position - startOfLinePositions[line];
  return {line, column, position, next: undefined};
}
