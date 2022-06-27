/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getLocalePluralCase} from './locale_data_api';

const pluralMapping = ['zero', 'one', 'two', 'few', 'many'];

/**
 * Returns the plural case based on the locale
 *
 * 根据区域设置返回复数大小写
 *
 */
export function getPluralCase(value: string, locale: string): string {
  const plural = getLocalePluralCase(locale)(parseInt(value, 10));
  const result = pluralMapping[plural];
  return (result !== undefined) ? result : 'other';
}

/**
 * The locale id that the application is using by default (for translations and ICU expressions).
 *
 * 默认情况下应用程序使用的区域设置 id（用于翻译和 ICU 表达式）。
 *
 */
export const DEFAULT_LOCALE_ID = 'en-US';

/**
 * USD currency code that the application uses by default for CurrencyPipe when no
 * DEFAULT_CURRENCY_CODE is provided.
 *
 * 在未提供 DEFAULT_CURRENCY_CODE 时，应用程序默认用于 CurrencyPipe 的美元货币代码。
 *
 */
export const USD_CURRENCY_CODE = 'USD';
