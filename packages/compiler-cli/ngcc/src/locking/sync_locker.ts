/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {LockFile} from './lock_file';

/**
 * SyncLocker is used to prevent more than one instance of ngcc executing at the same time,
 * when being called in a synchronous context.
 *
 * SyncLocker 用于防止在同步上下文中调用多个 ngcc 实例时同时执行。
 *
 * * When ngcc starts executing, it creates a file in the `compiler-cli/ngcc` folder.
 *
 *   当 ngcc 开始执行时，它会在 `compiler-cli/ngcc` 文件夹中创建一个文件。
 *
 * * If it finds one is already there then it fails with a suitable error message.
 *
 *   如果它发现一个已经在那里，那么它会失败并显示适当的错误消息。
 *
 * * When ngcc completes executing, it removes the file so that future ngcc executions can start.
 *
 *   当 ngcc 完成执行时，它会删除该文件，以便将来的 ngcc 执行可以开始。
 *
 */
export class SyncLocker {
  constructor(private lockFile: LockFile) {}

  /**
   * Run the given function guarded by the lock file.
   *
   * 运行由锁文件保护的给定函数。
   *
   * @param fn the function to run.
   *
   * 要运行的函数。
   *
   * @returns
   *
   * the value returned from the `fn` call.
   *
   * 从 `fn` 调用返回的值。
   *
   */
  lock<T>(fn: () => T): T {
    this.create();
    try {
      return fn();
    } finally {
      this.lockFile.remove();
    }
  }

  /**
   * Write a lock file to disk, or error if there is already one there.
   *
   * 将锁定文件写入磁盘，如果那里已经有一个，则错误。
   *
   */
  protected create(): void {
    try {
      this.lockFile.write();
    } catch (e: any) {
      if (e.code !== 'EEXIST') {
        throw e;
      }
      this.handleExistingLockFile();
    }
  }

  /**
   * The lock-file already exists so raise a helpful error.
   *
   * 锁定文件已经存在，因此请引发一个有用的错误。
   *
   */
  protected handleExistingLockFile(): void {
    const pid = this.lockFile.read();
    throw new Error(
        `ngcc is already running at process with id ${pid}.\n` +
        `If you are running multiple builds in parallel then you might try pre-processing your node_modules via the command line ngcc tool before starting the builds.\n` +
        `(If you are sure no ngcc process is running then you should delete the lock-file at ${
            this.lockFile.path}.)`);
  }
}
