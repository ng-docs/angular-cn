/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {DepGraph} from 'dependency-graph';

import {DtsProcessing, PartiallyOrderedTasks} from '../../src/execution/tasks/api';
import {EntryPoint, EntryPointJsonProperty} from '../../src/packages/entry_point';

/**
 * Create a set of tasks and a graph of their interdependencies.
 *
 * 创建一组任务和它们的相互依赖关系图。
 *
 * NOTE 1: The first task for each entry-point generates typings (which is similar to what happens
 *         in the actual code).
 * NOTE 2: The `computeTaskDependencies()` implementation relies on the fact that tasks are sorted
 * in such a way that a task can only depend upon earlier tasks (i.e. dependencies always come
 *         before dependents in the list of tasks).
 *         To preserve this attribute, you need to ensure that entry-points will only depend on
 *         entry-points with a lower index. Take this into account when defining `entryPointDeps`.
 *         (Failing to do so, will result in an error.)
 *
 * 注 1：每个入口点的第一个任务都会生成类型（类似于实际代码中发生的）。注 2：
 * `computeTaskDependencies()`
 * 实现依赖于这样一个事实，即任务的排序方式使得任务只能依赖于靠前的任务（即依赖项在任务列表中始终位于依赖项之前）。要保留此属性，你需要确保
 * entry-points 仅依赖于索引较低的 entry-points。在定义 `entryPointDeps` 时要考虑到这一点。
 * （否则，将导致错误。）
 *
 * @param entryPointCount The number of different entry-points to mock.
 *
 * 要模拟的不同入口点的数量。
 *
 * @param tasksPerEntryPointCount The number of tasks to generate per entry-point (i.e. simulating
 *                                processing multiple format properties).
 *
 * 每个入口点要生成的任务数（即模拟处理多种格式属性）。
 *
 * @param entryPointDeps An object mapping an entry-point to its dependencies. Keys are
 *                       entry-point indices and values are arrays of entry-point indices that the
 *                       entry-point corresponding to the key depends on.
 *                       For example, if entry-point #2 depends on entry-points #0 and #1,
 *                       `entryPointDeps` would be `{2: [0, 1]}`.
 *
 * 将入口点映射到其依赖项的对象。键是入口点索引，值是与键对应的入口点所依赖的入口点索引数组。例如，如果
 * entry-point #2 依赖于 entry-points #0 和 #1， `entryPointDeps` 将是 `{2: [0, 1]}` 。
 *
 * @return An object with the following properties:
 *         \- `tasks`: The (partially ordered) list of generated mock tasks.
 *         \- `graph`: The dependency graph for the generated mock entry-point.
 *
 * 具有以下属性的对象： - `tasks` ：生成的模拟任务的（部分排序）列表。 - `graph`
 * ：生成的模拟入口点的依赖图。
 *
 */
export function createTasksAndGraph(
    entryPointCount: number, tasksPerEntryPointCount = 1,
    entryPointDeps: {[entryPointIndex: string]: number[]} = {}):
    {tasks: PartiallyOrderedTasks, graph: DepGraph<EntryPoint>} {
  const entryPoints: EntryPoint[] = [];
  const tasks: PartiallyOrderedTasks = [] as any;
  const graph = new DepGraph<EntryPoint>();

  // Create the entry-points and the associated tasks.
  for (let epIdx = 0; epIdx < entryPointCount; epIdx++) {
    const entryPoint = {
      name: `entry-point-${epIdx}`,
      path: `/path/to/entry/point/${epIdx}`,
    } as EntryPoint;

    entryPoints.push(entryPoint);
    graph.addNode(entryPoint.path);

    for (let tIdx = 0; tIdx < tasksPerEntryPointCount; tIdx++) {
      const processDts = tIdx === 0 ? DtsProcessing.Yes : DtsProcessing.No;
      const formatProperty = `prop-${tIdx}` as unknown as EntryPointJsonProperty;
      tasks.push({
        entryPoint,
        formatProperty: formatProperty,
        formatPropertiesToMarkAsProcessed: [],
        processDts
      });
    }
  }

  // Define entry-point interdependencies.
  for (const epIdx of Object.keys(entryPointDeps).map(strIdx => +strIdx)) {
    const fromPath = entryPoints[epIdx].path;
    for (const depIdx of entryPointDeps[epIdx]) {
      // Ensure that each entry-point only depends on entry-points at a lower index.
      if (depIdx >= epIdx) {
        throw Error(
            'Invalid `entryPointDeps`: Entry-points can only depend on entry-points at a lower ' +
            `index, but entry-point #${epIdx} depends on #${depIdx} in: ` +
            JSON.stringify(entryPointDeps, null, 2));
      }

      const toPath = entryPoints[depIdx].path;
      graph.addDependency(fromPath, toPath);
    }
  }

  return {tasks, graph};
}
