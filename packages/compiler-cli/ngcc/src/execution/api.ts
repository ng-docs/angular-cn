/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {FileToWrite} from '../rendering/utils';

import {Task, TaskCompletedCallback, TaskQueue} from './tasks/api';

/**
 * The type of the function that analyzes entry-points and creates the list of tasks.
 *
 * 分析入口点并创建任务列表的函数的类型。
 *
 * @return A list of tasks that need to be executed in order to process the necessary format
 *         properties for all entry-points.
 *
 * 为了处理所有入口点的必要格式属性，需要执行的任务列表。
 *
 */
export type AnalyzeEntryPointsFn = () => TaskQueue;

/**
 * The type of the function that can process/compile a task.
 *
 * 可以处理/编译任务的函数的类型。
 *
 */
export type CompileFn<T> = (task: Task) => void|T;

/**
 * The type of the function that creates the `CompileFn` function used to process tasks.
 *
 * 创建用于处理任务的 `CompileFn` 函数的函数的类型。
 *
 */
export type CreateCompileFn = <T extends void|Promise<void>>(
    beforeWritingFiles: (transformedFiles: FileToWrite[]) => T,
    onTaskCompleted: TaskCompletedCallback) => CompileFn<T>;

/**
 * A class that orchestrates and executes the required work (i.e. analyzes the entry-points,
 * processes the resulting tasks, does book-keeping and validates the final outcome).
 *
 * 一个编排和执行所需工作的类（即分析入口点、处理结果任务、记账并验证最终结果）。
 *
 */
export interface Executor {
  execute(analyzeEntryPoints: AnalyzeEntryPointsFn, createCompileFn: CreateCompileFn):
      void|Promise<void>;
}
