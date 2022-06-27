/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * To create smaller locale files, we remove duplicated data.
 * To make this work we store the data in arrays, where `undefined` indicates that the
 * value is a duplicate of the previous value in the array.
 * e.g. consider an array like: [x, y, undefined, z, undefined, undefined]
 * The first `undefined` is equivalent to y, the second and third are equivalent to z
 * Note that the first value in an array is always defined.
 *
 * 为了创建较小的语言环境文件，我们会删除重复的数据。为了完成这项工作，我们将数据存储在数组中，其中
 * `undefined` 表示该值是数组中前一个值的副本。例如，考虑一个数组，如下所示： [x, y, undefined, z,
 * undefined, undefined][x, y, undefined, z, undefined, undefined]第一个 `undefined` 等效于
 * y，第二个和第三个等效于 z 请注意，数组中的第一个值始终是定义的。
 *
 * Also since we need to know which data is assumed similar, it is important that we store those
 * similar data in arrays to mark the delimitation between values that have different meanings
 * (e.g. months and days).
 *
 * 此外，由于我们需要知道哪些数据被假定为相似，因此将这些相似的数据存储在数组中以标记具有不同含义的值（例如月和日）之间的分隔符很重要。
 *
 * For further size improvements, "undefined" values will be replaced by a constant in the arrays
 * as the last step of the file generation (in generateLocale and generateLocaleExtra).
 * e.g.: [x, y, undefined, z, undefined, undefined] will be [x, y, u, z, u, u]
 *
 * 为了进一步提高大小，作为文件生成的最后一步（在 generateLocale 和 generateLocaleExtra
 * 中），“未定义”值将被数组中的常量替换。例如： [x, y, undefined, z, undefined , undefined][x, y,
 * undefined, z, undefined, undefined]将是[x, y, u, z, u, u][x, y, u, z, u, u]
 *
 */
export function removeDuplicates(data: unknown[]) {
  const dedup = [data[0]];
  let prevStringified = JSON.stringify(data[0]);
  let nextStringified;

  for (let i = 1; i < data.length; i++) {
    nextStringified = JSON.stringify(data[i]);
    if (nextStringified !== prevStringified) {
      prevStringified = nextStringified;
      dedup.push(data[i]);
    } else {
      dedup.push(undefined);
    }
  }

  return dedup;
}
