/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * Base locale used as foundation for other locales. For example: A base locale allows
 * generation of a file containing all currencies with their corresponding symbols. If we
 * generate other locales, they can override currency symbols which are different in the base
 * locale. This means that we do not need re-generate all currencies w/ symbols multiple times,
 * and allows us to reduce the locale data payload as the base locale is always included.
 *
 * 用作其他区域设置的基础的基本区域设置。例如：基本语言环境允许生成包含所有货币及其对应符号的文件。如果我们生成其他语言环境，它们可以覆盖基础语言环境中不同的货币符号。这意味着我们不需要多次重新生成所有带有符号的货币，并允许我们减少区域设置数据有效负载，因为始终包含基本区域设置。
 *
 */
export const BASE_LOCALE = 'en';
