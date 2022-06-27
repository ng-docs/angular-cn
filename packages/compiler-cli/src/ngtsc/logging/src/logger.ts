/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Implement this interface if you want to provide different logging
 * output from the standard ConsoleLogger.
 *
 * 如果你想提供与标准 ConsoleLogger 不同的日志输出，请实现此接口。
 *
 */
export interface Logger {
  level: LogLevel;
  debug(...args: string[]): void;
  info(...args: string[]): void;
  warn(...args: string[]): void;
  error(...args: string[]): void;
}

export enum LogLevel {
  debug,
  info,
  warn,
  error,
}
