/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AbsoluteFsPath} from '../../../../src/ngtsc/file_system';
import {JsonObject} from '../../utils';
import {PackageJsonChange} from '../../writing/package_json_updater';
import {Task, TaskProcessingOutcome} from '../tasks/api';

/**
 * A message reporting that the worker is ready for retrieving tasks.
 *
 * 报告此工作器已准备好检索任务的消息。
 *
 */
export interface ReadyMessage extends JsonObject {
  type: 'ready';
}

/**
 * A message reporting that an unrecoverable error occurred.
 *
 * 报告发生不可恢复的错误的消息。
 *
 */
export interface ErrorMessage extends JsonObject {
  type: 'error';
  error: string;
}

/**
 * A message requesting the processing of a task.
 *
 * 请求处理任务的消息。
 *
 */
export interface ProcessTaskMessage extends JsonObject {
  type: 'process-task';
  task: Task;
}

/**
 * A message reporting the result of processing the currently assigned task.
 *
 * 报告处理当前分配的任务的结果的消息。
 *
 * NOTE: To avoid the communication overhead, the task is not included in the message. Instead, the
 *       master is responsible for keeping a mapping of workers to their currently assigned tasks.
 *
 * 注：为避免通信开销，该任务不包含在消息中。相反，master 负责保留 Worker
 * 到它们当前分配的任务的映射。
 *
 */
export interface TaskCompletedMessage extends JsonObject {
  type: 'task-completed';
  outcome: TaskProcessingOutcome;
  message: string|null;
}

/**
 * A message listing the paths to transformed files about to be written to disk.
 *
 * 列出要写入磁盘的转换文件的路径的消息。
 *
 */
export interface TransformedFilesMessage extends JsonObject {
  type: 'transformed-files';
  files: AbsoluteFsPath[];
}

/**
 * A message requesting the update of a `package.json` file.
 *
 * 请求更新 `package.json` 文件的消息。
 *
 */
export interface UpdatePackageJsonMessage extends JsonObject {
  type: 'update-package-json';
  packageJsonPath: AbsoluteFsPath;
  changes: PackageJsonChange[];
}

/**
 * The type of messages sent from cluster workers to the cluster master.
 *
 * 从集群工作器发送到集群主控器的消息类型。
 *
 */
export type MessageFromWorker =
    ReadyMessage|ErrorMessage|TaskCompletedMessage|TransformedFilesMessage|UpdatePackageJsonMessage;

/**
 * The type of messages sent from the cluster master to cluster workers.
 *
 * 从集群主控器发送给集群工作器的消息类型。
 *
 */
export type MessageToWorker = ProcessTaskMessage;
