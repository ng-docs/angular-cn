/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/// <reference types="node" />

import cluster from 'cluster';

import {MessageFromWorker, MessageToWorker} from './api';



/**
 * Expose a `Promise` instance as well as APIs for resolving/rejecting it.
 *
 * 公开一个 `Promise` 实例以及用于解析/拒绝它的 API。
 *
 */
export class Deferred<T> {
  /**
   * Resolve the associated promise with the specified value.
   * If the value is a rejection (constructed with `Promise.reject()`), the promise will be rejected
   * instead.
   *
   * 使用指定的值解析关联的 Promise。如果值为拒绝（使用 `Promise.reject()` 构造），则 Promise
   * 将被拒绝。
   *
   * @param value The value to resolve the promise with.
   *
   * 解析 promise 时使用的值。
   *
   */
  resolve!: (value: T) => void;

  /**
   * Rejects the associated promise with the specified reason.
   *
   * 使用指定的原因拒绝关联的 Promise。
   *
   * @param reason The rejection reason.
   *
   * 拒绝的原因。
   *
   */
  reject!: (reason: any) => void;

  /**
   * The `Promise` instance associated with this deferred.
   *
   * 与此 deferred 关联的 `Promise` 实例。
   *
   */
  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

/**
 * Send a message to the cluster master.
 * (This function should be invoked from cluster workers only.)
 *
 * 向集群主控发送消息。（此函数应该仅从集群工作人员调用。）
 *
 * @param msg The message to send to the cluster master.
 *
 * 要发送到集群主控器的消息。
 *
 * @return A promise that is resolved once the message has been sent.
 *
 * 发送消息后就会解析的 Promise。
 *
 */
export const sendMessageToMaster = (msg: MessageFromWorker): Promise<void> => {
  if (cluster.isMaster) {
    throw new Error('Unable to send message to the master process: Already on the master process.');
  }

  return new Promise((resolve, reject) => {
    if (process.send === undefined) {
      // Theoretically, this should never happen on a worker process.
      throw new Error('Unable to send message to the master process: Missing `process.send()`.');
    }

    process.send(msg, (err: Error|null) => (err === null) ? resolve() : reject(err));
  });
};

/**
 * Send a message to a cluster worker.
 * (This function should be invoked from the cluster master only.)
 *
 * 向集群工作程序发送消息。（此函数应该仅从集群主控器调用。）
 *
 * @param workerId The ID of the recipient worker.
 *
 * 收件人工作人员的 ID。
 *
 * @param msg The message to send to the worker.
 *
 * 要发送给工作人员的消息。
 *
 * @return A promise that is resolved once the message has been sent.
 *
 * 发送消息后就会解析的 Promise。
 *
 */
export const sendMessageToWorker = (workerId: number, msg: MessageToWorker): Promise<void> => {
  if (!cluster.isMaster) {
    throw new Error('Unable to send message to worker process: Sender is not the master process.');
  }

  const worker = cluster.workers[workerId];

  if ((worker === undefined) || worker.isDead() || !worker.isConnected()) {
    throw new Error(
        'Unable to send message to worker process: Recipient does not exist or has disconnected.');
  }

  return new Promise((resolve, reject) => {
    worker.send(msg, undefined, (err: Error|null) => (err === null) ? resolve() : reject(err));
  });
};
