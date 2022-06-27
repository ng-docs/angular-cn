/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertEqual, assertLessThanOrEqual} from './assert';

/**
 * Equivalent to ES6 spread, add each item to an array.
 *
 * 等效于 ES6 扩展，将每个条目添加到数组中。
 *
 * @param items The items to add
 *
 * 要添加的条目
 *
 * @param arr The array to which you want to add the items
 *
 * 要添加条目的数组
 *
 */
export function addAllToArray(items: any[], arr: any[]) {
  for (let i = 0; i < items.length; i++) {
    arr.push(items[i]);
  }
}

/**
 * Determines if the contents of two arrays is identical
 *
 * 确定两个数组的内容是否相同
 *
 * @param a first array
 *
 * 第一个数组
 *
 * @param b second array
 *
 * 第二个数组
 *
 * @param identityAccessor Optional function for extracting stable object identity from a value in
 *     the array.
 *
 * 从数组中的值提取稳定对象标识的可选函数。
 *
 */
export function arrayEquals<T>(a: T[], b: T[], identityAccessor?: (value: T) => unknown): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    let valueA = a[i];
    let valueB = b[i];
    if (identityAccessor) {
      valueA = identityAccessor(valueA) as any;
      valueB = identityAccessor(valueB) as any;
    }
    if (valueB !== valueA) {
      return false;
    }
  }
  return true;
}


/**
 * Flattens an array.
 *
 * 展平数组。
 *
 */
export function flatten(list: any[], dst?: any[]): any[] {
  if (dst === undefined) dst = list;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    if (Array.isArray(item)) {
      // we need to inline it.
      if (dst === list) {
        // Our assumption that the list was already flat was wrong and
        // we need to clone flat since we need to write to it.
        dst = list.slice(0, i);
      }
      flatten(item, dst);
    } else if (dst !== list) {
      dst.push(item);
    }
  }
  return dst;
}

export function deepForEach<T>(input: (T|any[])[], fn: (value: T) => void): void {
  input.forEach(value => Array.isArray(value) ? deepForEach(value, fn) : fn(value));
}

export function addToArray(arr: any[], index: number, value: any): void {
  // perf: array.push is faster than array.splice!
  if (index >= arr.length) {
    arr.push(value);
  } else {
    arr.splice(index, 0, value);
  }
}

export function removeFromArray(arr: any[], index: number): any {
  // perf: array.pop is faster than array.splice!
  if (index >= arr.length - 1) {
    return arr.pop();
  } else {
    return arr.splice(index, 1)[0];
  }
}

export function newArray<T = any>(size: number): T[];
export function newArray<T>(size: number, value: T): T[];
export function newArray<T>(size: number, value?: T): T[] {
  const list: T[] = [];
  for (let i = 0; i < size; i++) {
    list.push(value!);
  }
  return list;
}

/**
 * Remove item from array (Same as `Array.splice()` but faster.)
 *
 * 从数组中删除条目（与 `Array.splice()` 相同，但更快。）
 *
 * `Array.splice()` is not as fast because it has to allocate an array for the elements which were
 * removed. This causes memory pressure and slows down code when most of the time we don't
 * care about the deleted items array.
 *
 * `Array.splice()`
 * 没有那么快，因为它必须为被删除的元素分配一个数组。当大多数时候我们不关心已删除的条目数组时，这会导致内存压力并减慢代码。
 *
 * <https://jsperf.com/fast-array-splice> (About 20x faster)
 *
 * <https://jsperf.com/fast-array-splice> （快约 20 倍）
 *
 * @param array Array to splice
 *
 * 要拼接的数组
 *
 * @param index Index of element in array to remove.
 *
 * 要删除的数组中元素的索引。
 *
 * @param count Number of items to remove.
 *
 * 要删除的条目数。
 *
 */
export function arraySplice(array: any[], index: number, count: number): void {
  const length = array.length - count;
  while (index < length) {
    array[index] = array[index + count];
    index++;
  }
  while (count--) {
    array.pop();  // shrink the array
  }
}

/**
 * Same as `Array.splice(index, 0, value)` but faster.
 *
 * 与 `Array.splice(index, 0, value)` 相同，但更快。
 *
 * `Array.splice()` is not fast because it has to allocate an array for the elements which were
 * removed. This causes memory pressure and slows down code when most of the time we don't
 * care about the deleted items array.
 *
 * `Array.splice()`
 * 并不快，因为它必须为被删除的元素分配一个数组。当大多数时候我们不关心已删除的条目数组时，这会导致内存压力并减慢代码。
 *
 * @param array Array to splice.
 *
 * 要拼接的数组。
 *
 * @param index Index in array where the `value` should be added.
 *
 * 数组中应该添加 `value` 的索引。
 *
 * @param value Value to add to array.
 *
 * 要添加到数组的值。
 *
 */
export function arrayInsert(array: any[], index: number, value: any): void {
  ngDevMode && assertLessThanOrEqual(index, array.length, 'Can\'t insert past array end.');
  let end = array.length;
  while (end > index) {
    const previousEnd = end - 1;
    array[end] = array[previousEnd];
    end = previousEnd;
  }
  array[index] = value;
}

/**
 * Same as `Array.splice2(index, 0, value1, value2)` but faster.
 *
 * 与 `Array.splice2(index, 0, value1, value2)` 相同，但更快。
 *
 * `Array.splice()` is not fast because it has to allocate an array for the elements which were
 * removed. This causes memory pressure and slows down code when most of the time we don't
 * care about the deleted items array.
 *
 * `Array.splice()`
 * 并不快，因为它必须为被删除的元素分配一个数组。当大多数时候我们不关心已删除的条目数组时，这会导致内存压力并减慢代码。
 *
 * @param array Array to splice.
 *
 * 要拼接的数组。
 *
 * @param index Index in array where the `value` should be added.
 *
 * 数组中应该添加 `value` 的索引。
 *
 * @param value1 Value to add to array.
 *
 * 要添加到数组的值。
 *
 * @param value2 Value to add to array.
 *
 * 要添加到数组的值。
 *
 */
export function arrayInsert2(array: any[], index: number, value1: any, value2: any): void {
  ngDevMode && assertLessThanOrEqual(index, array.length, 'Can\'t insert past array end.');
  let end = array.length;
  if (end == index) {
    // inserting at the end.
    array.push(value1, value2);
  } else if (end === 1) {
    // corner case when we have less items in array than we have items to insert.
    array.push(value2, array[0]);
    array[0] = value1;
  } else {
    end--;
    array.push(array[end - 1], array[end]);
    while (end > index) {
      const previousEnd = end - 2;
      array[end] = array[previousEnd];
      end--;
    }
    array[index] = value1;
    array[index + 1] = value2;
  }
}

/**
 * Insert a `value` into an `array` so that the array remains sorted.
 *
 * 将 `value` 插入 `array` ，以使数组保持排序。
 *
 * NOTE:
 *
 * 注：
 *
 * - Duplicates are not allowed, and are ignored.
 *
 *   不允许重复，并且被忽略。
 *
 * - This uses binary search algorithm for fast inserts.
 *
 *   这使用二进制搜索算法进行快速插入。
 *
 * @param array A sorted array to insert into.
 *
 * 要插入的排序数组。
 *
 * @param value The value to insert.
 *
 * 要插入的值。
 *
 * @returns
 *
 * index of the inserted value.
 *
 * 插入值的索引。
 *
 */
export function arrayInsertSorted(array: string[], value: string): number {
  let index = arrayIndexOfSorted(array, value);
  if (index < 0) {
    // if we did not find it insert it.
    index = ~index;
    arrayInsert(array, index, value);
  }
  return index;
}

/**
 * Remove `value` from a sorted `array`.
 *
 * 从已排序 `array` 中删除 `value` 。
 *
 * NOTE:
 *
 * 注：
 *
 * - This uses binary search algorithm for fast removals.
 *
 *   这使用二进制搜索算法进行快速删除。
 *
 * @param array A sorted array to remove from.
 *
 * 要从中删除的排序数组。
 *
 * @param value The value to remove.
 *
 * 要删除的值。
 *
 * @returns
 *
 * index of the removed value.
 *
 * 已删除值的索引。
 *
 * - positive index if value found and removed.
 *
 *   如果找到并删除了值，则为正索引。
 *
 * - negative index if value not found. (`~index` to get the value where it should have been
 *   inserted)
 *
 *   如果找不到值，则为负索引。 （ `~index` 来获取它应该插入的值）
 *
 */
export function arrayRemoveSorted(array: string[], value: string): number {
  const index = arrayIndexOfSorted(array, value);
  if (index >= 0) {
    arraySplice(array, index, 1);
  }
  return index;
}


/**
 * Get an index of an `value` in a sorted `array`.
 *
 * 获取已排序 `array` 中 `value` 的索引。
 *
 * NOTE:
 *
 * 注：
 *
 * - This uses binary search algorithm for fast removals.
 *
 *   这使用二进制搜索算法进行快速删除。
 *
 * @param array A sorted array to binary search.
 *
 * 要二进制搜索的排序数组。
 *
 * @param value The value to look for.
 *
 * 要查找的值。
 *
 * @returns
 *
 * index of the value.
 *
 * 值的索引。
 *
 * - positive index if value found.
 *
 *   如果找到值，则为正索引。
 *
 * - negative index if value not found. (`~index` to get the value where it should have been
 *   located)
 *
 *   如果找不到值，则为负索引。 （ `~index` 来获取它应该位于的值）
 *
 */
export function arrayIndexOfSorted(array: string[], value: string): number {
  return _arrayIndexOfSorted(array, value, 0);
}


/**
 * `KeyValueArray` is an array where even positions contain keys and odd positions contain values.
 *
 * `KeyValueArray` 是一个数组，其中偶数位置包含键，奇数位置包含值。
 *
 * `KeyValueArray` provides a very efficient way of iterating over its contents. For small
 * sets (~10) the cost of binary searching an `KeyValueArray` has about the same performance
 * characteristics that of a `Map` with significantly better memory footprint.
 *
 * `KeyValueArray` 提供了一种非常有效的方式来迭代其内容。对于小型集（~10），二分搜索的成本
 * `KeyValueArray` 具有与 `Map` 大致相同的性能特性，但内存占用明显更好。
 *
 * If used as a `Map` the keys are stored in alphabetical order so that they can be binary searched
 * for retrieval.
 *
 * 如果用作 `Map` ，则键会按字母顺序存储，以便可以对它们进行二进制搜索以进行检索。
 *
 * See: `keyValueArraySet`, `keyValueArrayGet`, `keyValueArrayIndexOf`, `keyValueArrayDelete`.
 *
 * 请参阅： `keyValueArraySet` 、 `keyValueArrayGet` 、 `keyValueArrayIndexOf` 、
 * `keyValueArrayDelete` 。
 *
 */
export interface KeyValueArray<VALUE> extends Array<VALUE|string> {
  __brand__: 'array-map';
}

/**
 * Set a `value` for a `key`.
 *
 * 为 `key` 设置 `value` 。
 *
 * @param keyValueArray to modify.
 *
 * 进行修改。
 *
 * @param key The key to locate or create.
 *
 * 要定位或创建的键。
 *
 * @param value The value to set for a `key`.
 *
 * 要为 `key` 设置的值。
 *
 * @returns
 *
 * index (always even) of where the value vas set.
 *
 * 值 vas 设置的位置的索引（始终是偶数）。
 *
 */
export function keyValueArraySet<V>(
    keyValueArray: KeyValueArray<V>, key: string, value: V): number {
  let index = keyValueArrayIndexOf(keyValueArray, key);
  if (index >= 0) {
    // if we found it set it.
    keyValueArray[index | 1] = value;
  } else {
    index = ~index;
    arrayInsert2(keyValueArray, index, key, value);
  }
  return index;
}

/**
 * Retrieve a `value` for a `key` (on `undefined` if not found.)
 *
 * 检索 `key` 的 `value` （如果找不到，则在 `undefined` 上。）
 *
 * @param keyValueArray to search.
 *
 * 搜索。
 *
 * @param key The key to locate.
 *
 * 要定位的键。
 *
 * @return The `value` stored at the `key` location or \`undefined if not found.
 *
 * 存储在 `key` 位置的 `value` ，如果找不到，则为 \`undefined 。
 *
 */
export function keyValueArrayGet<V>(keyValueArray: KeyValueArray<V>, key: string): V|undefined {
  const index = keyValueArrayIndexOf(keyValueArray, key);
  if (index >= 0) {
    // if we found it retrieve it.
    return keyValueArray[index | 1] as V;
  }
  return undefined;
}

/**
 * Retrieve a `key` index value in the array or `-1` if not found.
 *
 * 检索数组中的 `key` 索引值，如果找不到，则检索 `-1` 。
 *
 * @param keyValueArray to search.
 *
 * 搜索。
 *
 * @param key The key to locate.
 *
 * 要定位的键。
 *
 * @returns
 *
 * index of where the key is (or should have been.)
 *
 * 键在（或应该在）位置的索引
 *
 * - positive (even) index if key found.
 *
 *   如果找到键，则为正（偶数）索引。
 *
 * - negative index if key not found. (`~index` (even) to get the index where it should have
 *   been inserted.)
 *
 *   如果找不到键，则为负索引。 （ `~index` (even) 来获取应该插入它的索引。）
 *
 */
export function keyValueArrayIndexOf<V>(keyValueArray: KeyValueArray<V>, key: string): number {
  return _arrayIndexOfSorted(keyValueArray as string[], key, 1);
}

/**
 * Delete a `key` (and `value`) from the `KeyValueArray`.
 *
 * 从 `KeyValueArray` 中删除 `key` （和 `value` ）。
 *
 * @param keyValueArray to modify.
 *
 * 进行修改。
 *
 * @param key The key to locate or delete (if exist).
 *
 * 要定位或删除的键（如果存在）。
 *
 * @returns
 *
 * index of where the key was (or should have been.)
 *
 * 键在哪里（或应该在哪里）的索引
 *
 * - positive (even) index if key found and deleted.
 *
 *   如果找到并删除了键，则为正（偶数）索引。
 *
 * - negative index if key not found. (`~index` (even) to get the index where it should have
 *   been.)
 *
 *   如果找不到键，则为负索引。 （ `~index` (even) 来获取它应该在的位置。）
 *
 */
export function keyValueArrayDelete<V>(keyValueArray: KeyValueArray<V>, key: string): number {
  const index = keyValueArrayIndexOf(keyValueArray, key);
  if (index >= 0) {
    // if we found it remove it.
    arraySplice(keyValueArray, index, 2);
  }
  return index;
}


/**
 * INTERNAL: Get an index of an `value` in a sorted `array` by grouping search by `shift`.
 *
 * 内部：通过按 `shift` 分组搜索来获取已排序 `array` 中 `value` 的索引。
 *
 * NOTE:
 *
 * 注：
 *
 * - This uses binary search algorithm for fast removals.
 *
 *   这使用二进制搜索算法进行快速删除。
 *
 * @param array A sorted array to binary search.
 *
 * 要二进制搜索的排序数组。
 *
 * @param value The value to look for.
 *
 * 要查找的值。
 *
 * @param shift grouping shift.
 *
 * 分组移位。
 *
 * - `0` means look at every location
 *
 *   `0` 表示查看每个位置
 *
 * - `1` means only look at every other (even) location (the odd locations are to be ignored as
 *       they are values.)
 *
 *   `1` 意味着仅查看每隔一个（偶数）位置（奇数位置将被忽略，因为它们是值。）
 *
 * @returns
 *
 * index of the value.
 *
 * 值的索引。
 *
 * - positive index if value found.
 *
 *   如果找到值，则为正索引。
 *
 * - negative index if value not found. (`~index` to get the value where it should have been
 *   inserted)
 *
 *   如果找不到值，则为负索引。 （ `~index` 来获取它应该插入的值）
 *
 */
function _arrayIndexOfSorted(array: string[], value: string, shift: number): number {
  ngDevMode && assertEqual(Array.isArray(array), true, 'Expecting an array');
  let start = 0;
  let end = array.length >> shift;
  while (end !== start) {
    const middle = start + ((end - start) >> 1);  // find the middle.
    const current = array[middle << shift];
    if (value === current) {
      return (middle << shift);
    } else if (current > value) {
      end = middle;
    } else {
      start = middle + 1;  // We already searched middle so make it non-inclusive by adding 1
    }
  }
  return ~(end << shift);
}
