/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {PathManipulation, ReadonlyFileSystem} from '../../../../src/ngtsc/file_system';
import {Logger} from '../../../../src/ngtsc/logging';
import {markAsProcessed} from '../../packages/build_marker';
import {getEntryPointFormat, PackageJsonFormatProperties} from '../../packages/entry_point';
import {PackageJsonUpdater} from '../../writing/package_json_updater';

import {DtsProcessing, Task, TaskCompletedCallback, TaskProcessingOutcome, TaskQueue} from './api';

/**
 * A function that can handle a specific outcome of a task completion.
 *
 * 可以处理任务完成的特定结果的函数。
 *
 * These functions can be composed using the `composeTaskCompletedCallbacks()`
 * to create a `TaskCompletedCallback` function that can be passed to an `Executor`.
 *
 * 可以用 `composeTaskCompletedCallbacks()` 来组合这些函数，以创建一个可以传递给 `Executor` 的
 * `TaskCompletedCallback` 函数。
 *
 */
export type TaskCompletedHandler = (task: Task, message: string|null) => void;

/**
 * Compose a group of TaskCompletedHandlers into a single TaskCompletedCallback.
 *
 * 将一组 TaskCompletedHandlers 组成一个 TaskCompletedCallback 。
 *
 * The compose callback will receive an outcome and will delegate to the appropriate handler based
 * on this outcome.
 *
 * compose 回调将接收到一个结果，并根据此结果委托给适当的处理程序。
 *
 * @param callbacks a map of outcomes to handlers.
 *
 * 处理程序的结果映射表。
 *
 */
export function composeTaskCompletedCallbacks(
    callbacks: Record<TaskProcessingOutcome, TaskCompletedHandler>): TaskCompletedCallback {
  return (task: Task, outcome: TaskProcessingOutcome, message: string|null): void => {
    const callback = callbacks[outcome];
    if (callback === undefined) {
      throw new Error(`Unknown task outcome: "${outcome}" - supported outcomes: ${
          JSON.stringify(Object.keys(callbacks))}`);
    }
    callback(task, message);
  };
}

/**
 * Create a handler that will mark the entry-points in a package as being processed.
 *
 * 创建一个处理程序，将包中的入口点标记为正在处理。
 *
 * @param pkgJsonUpdater The service used to update the package.json
 *
 * 用于更新 package.json 的服务
 *
 */
export function createMarkAsProcessedHandler(
    fs: PathManipulation, pkgJsonUpdater: PackageJsonUpdater): TaskCompletedHandler {
  return (task: Task): void => {
    const {entryPoint, formatPropertiesToMarkAsProcessed, processDts} = task;
    const packageJsonPath = fs.resolve(entryPoint.path, 'package.json');
    const propsToMarkAsProcessed: PackageJsonFormatProperties[] =
        [...formatPropertiesToMarkAsProcessed];
    if (processDts !== DtsProcessing.No) {
      propsToMarkAsProcessed.push('typings');
    }
    markAsProcessed(
        pkgJsonUpdater, entryPoint.packageJson, packageJsonPath, propsToMarkAsProcessed);
  };
}

/**
 * Create a handler that will throw an error.
 *
 * 创建一个将抛出错误的处理程序。
 *
 */
export function createThrowErrorHandler(fs: ReadonlyFileSystem): TaskCompletedHandler {
  return (task: Task, message: string|null): void => {
    throw new Error(createErrorMessage(fs, task, message));
  };
}

/**
 * Create a handler that logs an error and marks the task as failed.
 *
 * 创建一个记录错误并将任务标记为失败的处理程序。
 *
 */
export function createLogErrorHandler(
    logger: Logger, fs: ReadonlyFileSystem, taskQueue: TaskQueue): TaskCompletedHandler {
  return (task: Task, message: string|null): void => {
    taskQueue.markAsFailed(task);
    logger.error(createErrorMessage(fs, task, message));
  };
}

function createErrorMessage(fs: ReadonlyFileSystem, task: Task, message: string|null): string {
  const jsFormat = `\`${task.formatProperty}\` as ${
      getEntryPointFormat(fs, task.entryPoint, task.formatProperty) ?? 'unknown format'}`;
  const format = task.typingsOnly ? `typings only using ${jsFormat}` : jsFormat;
  message = message !== null ? ` due to ${message}` : '';
  return `Failed to compile entry-point ${task.entryPoint.name} (${format})` + message;
}
