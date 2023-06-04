/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {BehaviorSubject} from 'rxjs';

import {Injectable} from './di';
import {OnDestroy} from './interface/lifecycle_hooks';

/**
 * *Internal* service that keeps track of pending tasks happening in the system
 * during the initial rendering. No tasks are tracked after an initial
 * rendering.
 *
 * 跟踪初始渲染期间系统中发生的未决任务的*内部*服务。初始渲染后不会跟踪任何任务。
 *
 * This information is needed to make sure that the serialization on the server
 * is delayed until all tasks in the queue \(such as an initial navigation or a
 * pending HTTP request\) are completed.
 *
 * 需要此信息来确保服务器上的序列化延迟到队列中的所有任务（例如初始导航或挂起的 HTTP 请求）完成后。
 *
 */
@Injectable({providedIn: 'root'})
export class InitialRenderPendingTasks implements OnDestroy {
  private taskId = 0;
  private pendingTasks = new Set<number>();
  hasPendingTasks = new BehaviorSubject<boolean>(false);

  add(): number {
    this.hasPendingTasks.next(true);
    const taskId = this.taskId++;
    this.pendingTasks.add(taskId);
    return taskId;
  }

  remove(taskId: number): void {
    this.pendingTasks.delete(taskId);
    if (this.pendingTasks.size === 0) {
      this.hasPendingTasks.next(false);
    }
  }

  ngOnDestroy(): void {
    this.pendingTasks.clear();
    this.hasPendingTasks.next(false);
  }
}
