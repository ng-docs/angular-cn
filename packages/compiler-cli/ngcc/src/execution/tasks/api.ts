/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {EntryPoint, EntryPointJsonProperty} from '../../packages/entry_point';
import {JsonObject, PartiallyOrderedList} from '../../utils';

/**
 * Represents a unit of work to be undertaken by an `Executor`.
 *
 * 表示要由 `Executor` 承担的工作单元。
 *
 * A task consists of processing a specific format property of an entry-point.
 * This may or may not also include processing the typings for that entry-point, which only needs to
 * happen once across all the formats.
 *
 * 任务由处理入口点的特定格式属性组成。这可能包括也可能不包括处理该入口点的类型，这只需要在所有格式中发生一次。
 *
 */
export interface Task extends JsonObject {
  /**
   * The `EntryPoint` which needs to be processed as part of the task.
   *
   * 需要作为任务的一部分处理的 `EntryPoint` 。
   *
   */
  entryPoint: EntryPoint;

  /**
   * The `package.json` format property to process (i.e. the property which points to the file that
   * is the program entry-point).
   *
   * 要处理的 `package.json` 格式属性（即指向作为程序入口点的文件的属性）。
   *
   */
  formatProperty: EntryPointJsonProperty;

  /**
   * The list of all format properties (including `task.formatProperty`) that should be marked as
   * processed once the task has been completed, because they point to the format-path that will be
   * processed as part of the task.
   *
   * 任务完成后应标记为已处理的所有格式属性（包括 `task.formatProperty`
   * ）的列表，因为它们指向了将作为任务的一部分处理的 format-path 。
   *
   */
  formatPropertiesToMarkAsProcessed: EntryPointJsonProperty[];

  /**
   * Whether to process typings for this entry-point as part of the task.
   *
   * 是否将此入口点的类型作为任务的一部分处理。
   *
   */
  processDts: DtsProcessing;
}

/**
 * The options for processing Typescript typings (.d.ts) files.
 *
 * 处理 Typescript 键入 (.d.ts) 文件的选项。
 *
 */
export enum DtsProcessing {
  /**
   * Yes, process the typings for this entry point as part of the task.
   *
   * 是的，作为任务的一部分处理此入口点的类型。
   *
   */
  Yes,
  /**
   * No, do not process the typings as part of this task - they must have already been processed by
   * another task or previous ngcc process.
   *
   * 不，不要将键入的内容作为此任务的一部分处理 - 它们必须已被另一个任务或以前的 ngcc 进程处理。
   *
   */
  No,
  /**
   * Only process the typings for this entry-point; do not render any JavaScript files for the
   * `formatProperty` of this task.
   *
   * 仅处理此入口点的类型；不要为此任务的 `formatProperty` 呈现任何 JavaScript 文件。
   *
   */
  Only,
}

/**
 * Represents a partially ordered list of tasks.
 *
 * 表示任务的部分排序列表。
 *
 * The ordering/precedence of tasks is determined by the inter-dependencies between their associated
 * entry-points. Specifically, the tasks' order/precedence is such that tasks associated to
 * dependent entry-points always come after tasks associated with their dependencies.
 *
 * 任务的顺序/优先级由它们关联的入口点之间的相互依赖关系确定。具体来说，任务的顺序/优先级是这样的，即与依赖入口点关联的任务始终在与其依赖项关联的任务之后。
 *
 * As result of this ordering, it is guaranteed that - by processing tasks in the order in which
 * they appear in the list - a task's dependencies will always have been processed before processing
 * the task itself.
 *
 * 作为这种顺序的结果，可以保证 - 通过按照任务出现在列表中的顺序处理任务 -
 * 任务的依赖项将始终在处理任务本身之前被处理。
 *
 * See `DependencyResolver#sortEntryPointsByDependency()`.
 *
 * 请参阅 `DependencyResolver#sortEntryPointsByDependency()` 。
 *
 */
export type PartiallyOrderedTasks = PartiallyOrderedList<Task>;

/**
 * A mapping from Tasks to the Tasks that depend upon them (dependents).
 *
 * 从任务到依赖它们的任务（depends）的映射。
 *
 */
export type TaskDependencies = Map<Task, Set<Task>>;
export const TaskDependencies = Map;

/**
 * A function to create a TaskCompletedCallback function.
 *
 * 用于创建 TaskCompletedCallback 函数的函数。
 *
 */
export type CreateTaskCompletedCallback = (taskQueue: TaskQueue) => TaskCompletedCallback;

/**
 * A function to be called once a task has been processed.
 *
 * 处理任务后要调用的函数。
 *
 */
export type TaskCompletedCallback =
    (task: Task, outcome: TaskProcessingOutcome, message: string|null) => void;

/**
 * Represents the outcome of processing a `Task`.
 *
 * 表示处理 `Task` 的结果。
 *
 */
export const enum TaskProcessingOutcome {
  /**
   * Successfully processed the target format property.
   *
   * 已成功处理目标格式属性。
   *
   */
  Processed,
  /**
   * Failed to process the target format.
   *
   * 无法处理目标格式。
   *
   */
  Failed,
}

/**
 * A wrapper around a list of tasks and providing utility methods for getting the next task of
 * interest and determining when all tasks have been completed.
 *
 * 任务列表的包装器，并提供一些实用程序方法来获取下一个感兴趣的任务并确定所有任务何时完成。
 *
 * (This allows different implementations to impose different constraints on when a task's
 * processing can start.)
 *
 * （这允许不同的实现对任务处理的开始时间施加不同的约束。）
 *
 */
export interface TaskQueue {
  /**
   * Whether all tasks have been completed.
   *
   * 是否所有任务都已完成。
   *
   */
  allTasksCompleted: boolean;

  /**
   * Get the next task whose processing can start (if any).
   *
   * 获取下一个可以开始处理的任务（如果有）。
   *
   * This implicitly marks the task as in-progress.
   * (This information is used to determine whether all tasks have been completed.)
   *
   * 这会隐式将任务标记为进行中。 （此信息用于确定是否所有任务都已完成。）
   *
   * @return The next task available for processing or `null`, if no task can be processed at the
   *         moment (including if there are no more unprocessed tasks).
   *
   * 下一个可用于处理的任务或 `null` ，如果目前没有任务可以处理（包括如果没有更多未处理的任务）。
   *
   */
  getNextTask(): Task|null;

  /**
   * Mark a task as completed.
   *
   * 将任务标记为已完成。
   *
   * This removes the task from the internal list of in-progress tasks.
   * (This information is used to determine whether all tasks have been completed.)
   *
   * 这会从内部进行中任务的列表中删除任务。 （此信息用于确定是否所有任务都已完成。）
   *
   * @param task The task to mark as completed.
   *
   * 要标记为已完成的任务。
   *
   */
  markAsCompleted(task: Task): void;

  /**
   * Mark a task as failed.
   *
   * 将任务标记为失败。
   *
   * Do not process the tasks that depend upon the given task.
   *
   * 不要处理依赖于给定任务的任务。
   *
   */
  markAsFailed(task: Task): void;

  /**
   * Mark a task as not processed (i.e. add an in-progress task back to the queue).
   *
   * 将任务标记为未处理（即将进行中的任务添加回队列）。
   *
   * This removes the task from the internal list of in-progress tasks and adds it back to the list
   * of pending tasks.
   *
   * 这会从内部进行中任务的列表中删除任务，并将其添加到挂起任务列表中。
   *
   * @param task The task to mark as not processed.
   *
   * 要标记为未处理的任务。
   *
   */
  markAsUnprocessed(task: Task): void;

  /**
   * Return a string representation of the task queue (for debugging purposes).
   *
   * 返回任务队列的字符串表示（用于调试）。
   *
   * @return A string representation of the task queue.
   *
   * 任务队列的字符串表示。
   *
   */
  toString(): string;
}
