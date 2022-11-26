/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * An interface that describes the date pipe configuration, which can be provided using the
 * `DATE_PIPE_DEFAULT_OPTIONS` token.
 *
 * 描述日期管道配置的接口，可以用 `DATE_PIPE_DEFAULT_OPTIONS` 令牌提供。
 *
 * @see `DATE_PIPE_DEFAULT_OPTIONS`
 * @publicApi
 */
export interface DatePipeConfig {
  dateFormat: string;
  timezone: string;
}

/**
 * The default date format of Angular date pipe, which corresponds to the following format:
 * `'MMM d,y'` (e.g. `Jun 15, 2015`)
 *
 * Angular 日期管道的默认日期格式，对应于以下格式： `'MMM d,y'` （例如 `Jun 15, 2015` ）
 *
 */
export const DEFAULT_DATE_FORMAT = 'mediumDate';
