/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {SemanticReference, SemanticSymbol} from './api';

/**
 * Determines whether the provided symbols represent the same declaration.
 *
 * 确定提供的符号是否表示同一个声明。
 *
 */
export function isSymbolEqual(a: SemanticSymbol, b: SemanticSymbol): boolean {
  if (a.decl === b.decl) {
    // If the declaration is identical then it must represent the same symbol.
    return true;
  }

  if (a.identifier === null || b.identifier === null) {
    // Unidentifiable symbols are assumed to be different.
    return false;
  }

  return a.path === b.path && a.identifier === b.identifier;
}

/**
 * Determines whether the provided references to a semantic symbol are still equal, i.e. represent
 * the same symbol and are imported by the same path.
 *
 * 确定提供的对语义符号的引用是否仍然相等，即表示同一个符号并通过相同的路径导入。
 *
 */
export function isReferenceEqual(a: SemanticReference, b: SemanticReference): boolean {
  if (!isSymbolEqual(a.symbol, b.symbol)) {
    // If the reference's target symbols are different, the reference itself is different.
    return false;
  }

  // The reference still corresponds with the same symbol, now check that the path by which it is
  // imported has not changed.
  return a.importPath === b.importPath;
}

export function referenceEquality<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * Determines if the provided arrays are equal to each other, using the provided equality tester
 * that is called for all entries in the array.
 *
 * 使用为数组中的所有条目调用的提供的相等测试器来确定提供的数组是否彼此相等。
 *
 */
export function isArrayEqual<T>(
    a: readonly T[]|null, b: readonly T[]|null,
    equalityTester: (a: T, b: T) => boolean = referenceEquality): boolean {
  if (a === null || b === null) {
    return a === b;
  }

  if (a.length !== b.length) {
    return false;
  }

  return !a.some((item, index) => !equalityTester(item, b[index]));
}

/**
 * Determines if the provided sets are equal to each other, using the provided equality tester.
 * Sets that only differ in ordering are considered equal.
 *
 * 使用提供的相等测试器确定提供的集是否彼此相等。仅顺序不同的集被认为是相等的。
 *
 */
export function isSetEqual<T>(
    a: ReadonlySet<T>|null, b: ReadonlySet<T>|null,
    equalityTester: (a: T, b: T) => boolean = referenceEquality): boolean {
  if (a === null || b === null) {
    return a === b;
  }

  if (a.size !== b.size) {
    return false;
  }

  for (const itemA of a) {
    let found = false;
    for (const itemB of b) {
      if (equalityTester(itemA, itemB)) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }

  return true;
}
