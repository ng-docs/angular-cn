/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {DepGraph} from 'dependency-graph';

import {EntryPoint} from '../../packages/entry_point';

import {DtsProcessing, PartiallyOrderedTasks, Task, TaskDependencies} from './api';

/**
 * Stringify a task for debugging purposes.
 *
 * 出于调试目的对任务进行字符串化。
 *
 */
export const stringifyTask = (task: Task): string =>
    `{entryPoint: ${task.entryPoint.name}, formatProperty: ${task.formatProperty}, ` +
    `processDts: ${DtsProcessing[task.processDts]}}`;

/**
 * Compute a mapping of tasks to the tasks that are dependent on them (if any).
 *
 * 计算任务到依赖它们的任务（如果有）的映射。
 *
 * Task A can depend upon task B, if either:
 *
 * 任务 A 可以依赖于任务 B，如果是：
 *
 * * A and B have the same entry-point _and_ B is generating the typings for that entry-point
 *   (i.e. has `processDts: true`).
 *
 *   A 和 B 具有相同的入口点\_，并且\_B 正在为该入口点生成类型（即具有 `processDts: true`）。
 *
 * * A's entry-point depends on B's entry-point _and_ B is also generating typings.
 *
 *   A 的入口点依赖于 B 的入口点 _，_ B 也在生成类型。
 *
 * NOTE: If a task is not generating typings, then it cannot affect anything which depends on its
 *       entry-point, regardless of the dependency graph. To put this another way, only the task
 *       which produces the typings for a dependency needs to have been completed.
 *
 * 注意：如果一项任务不生成分型，则无论依赖图如何，它都不会影响依赖于其入口点的任何内容。换句话说，只需要完成为依赖项生成类型的任务。
 *
 * As a performance optimization, we take into account the fact that `tasks` are sorted in such a
 * way that a task can only depend on earlier tasks (i.e. dependencies always come before
 * dependents in the list of tasks).
 *
 * 作为一种性能优化，我们考虑到这样一个事实，即 `tasks`
 * 的排序方式使得任务只能依赖于靠前的任务（即依赖项在任务列表中始终位于依赖项之前）。
 *
 * @param tasks A (partially ordered) list of tasks.
 *
 * 任务的（部分排序）列表。
 *
 * @param graph The dependency graph between entry-points.
 *
 * 入口点之间的依赖图。
 *
 * @return A map from each task to those tasks directly dependent upon it.
 *
 * 从每个任务到直接依赖于它的那些任务的映射。
 *
 */
export function computeTaskDependencies(
    tasks: PartiallyOrderedTasks, graph: DepGraph<EntryPoint>): TaskDependencies {
  const dependencies = new TaskDependencies();
  const candidateDependencies = new Map<string, Task>();

  tasks.forEach(task => {
    const entryPointPath = task.entryPoint.path;

    // Find the earlier tasks (`candidateDependencies`) that this task depends upon.
    const deps = graph.dependenciesOf(entryPointPath);
    const taskDependencies = deps.filter(dep => candidateDependencies.has(dep))
                                 .map(dep => candidateDependencies.get(dep)!);

    // If this task has dependencies, add it to the dependencies and dependents maps.
    if (taskDependencies.length > 0) {
      for (const dependency of taskDependencies) {
        const taskDependents = getDependentsSet(dependencies, dependency);
        taskDependents.add(task);
      }
    }

    if (task.processDts !== DtsProcessing.No) {
      // SANITY CHECK:
      // There should only be one task per entry-point that generates typings (and thus can be a
      // dependency of other tasks), so the following should theoretically never happen, but check
      // just in case.
      if (candidateDependencies.has(entryPointPath)) {
        const otherTask = candidateDependencies.get(entryPointPath)!;
        throw new Error(
            'Invariant violated: Multiple tasks are assigned generating typings for ' +
            `'${entryPointPath}':\n  - ${stringifyTask(otherTask)}\n  - ${stringifyTask(task)}`);
      }
      // This task can potentially be a dependency (i.e. it generates typings), so add it to the
      // list of candidate dependencies for subsequent tasks.
      candidateDependencies.set(entryPointPath, task);
    } else {
      // This task is not generating typings so we need to add it to the dependents of the task that
      // does generate typings, if that exists
      if (candidateDependencies.has(entryPointPath)) {
        const typingsTask = candidateDependencies.get(entryPointPath)!;
        const typingsTaskDependents = getDependentsSet(dependencies, typingsTask);
        typingsTaskDependents.add(task);
      }
    }
  });

  return dependencies;
}

export function getDependentsSet(map: TaskDependencies, task: Task): Set<Task> {
  if (!map.has(task)) {
    map.set(task, new Set());
  }
  return map.get(task)!;
}

/**
 * Invert the given mapping of Task dependencies.
 *
 * 反转给定的 Task 依赖项的映射。
 *
 * @param dependencies The mapping of tasks to the tasks that depend upon them.
 *
 * 任务到依赖它们的任务的映射。
 *
 * @returns
 *
 * A mapping of tasks to the tasks that they depend upon.
 *
 * 任务到它们依赖的任务的映射。
 *
 */
export function getBlockedTasks(dependencies: TaskDependencies): Map<Task, Set<Task>> {
  const blockedTasks = new Map<Task, Set<Task>>();
  for (const [dependency, dependents] of dependencies) {
    for (const dependent of dependents) {
      const dependentSet = getDependentsSet(blockedTasks, dependent);
      dependentSet.add(dependency);
    }
  }
  return blockedTasks;
}

/**
 * Sort a list of tasks by priority.
 *
 * 按优先级对任务列表进行排序。
 *
 * Priority is determined by the number of other tasks that a task is (transitively) blocking:
 * The more tasks a task is blocking the higher its priority is, because processing it will
 * potentially unblock more tasks.
 *
 * 优先级由任务正在（可传递）阻塞的其他任务的数量确定：任务阻塞的任务越多，其优先级就越高，因为处理它可能会解锁更多任务。
 *
 * To keep the behavior predictable, if two tasks block the same number of other tasks, their
 * relative order in the original `tasks` lists is preserved.
 *
 * 为了保持行为的可预测性，如果两个任务阻塞了相同数量的其他任务，则会保留它们在原始 `tasks`
 * 列表中的相对顺序。
 *
 * @param tasks A (partially ordered) list of tasks.
 *
 * 任务的（部分排序）列表。
 *
 * @param dependencies The mapping of tasks to the tasks that depend upon them.
 *
 * 任务到依赖它们的任务的映射。
 *
 * @return The list of tasks sorted by priority.
 *
 * 按优先级排序的任务列表。
 *
 */
export function sortTasksByPriority(
    tasks: PartiallyOrderedTasks, dependencies: TaskDependencies): PartiallyOrderedTasks {
  const priorityPerTask = new Map<Task, [number, number]>();
  const computePriority = (task: Task, idx: number):
      [number, number] => [dependencies.has(task) ? dependencies.get(task)!.size : 0, idx];

  tasks.forEach((task, i) => priorityPerTask.set(task, computePriority(task, i)));

  return tasks.slice().sort((task1, task2) => {
    const [p1, idx1] = priorityPerTask.get(task1)!;
    const [p2, idx2] = priorityPerTask.get(task2)!;

    return (p2 - p1) || (idx1 - idx2);
  });
}
