/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, FileStats, FileSystem, PathSegment, PathString} from './types';

/**
 * The default `FileSystem` that will always fail.
 *
 * 始终失败的 `FileSystem` 系统。
 *
 * This is a way of ensuring that the developer consciously chooses and
 * configures the `FileSystem` before using it; particularly important when
 * considering static functions like `absoluteFrom()` which rely on
 * the `FileSystem` under the hood.
 *
 * 这是一种确保开发人员在使用之前有 `FileSystem` 地选择和配置文件系统的方法；在考虑像
 * `absoluteFrom()` 之类的依赖于引擎盖下的 `FileSystem` 的静态函数时尤为重要。
 *
 */
export class InvalidFileSystem implements FileSystem {
  exists(path: AbsoluteFsPath): boolean {
    throw makeError();
  }
  readFile(path: AbsoluteFsPath): string {
    throw makeError();
  }
  readFileBuffer(path: AbsoluteFsPath): Uint8Array {
    throw makeError();
  }
  writeFile(path: AbsoluteFsPath, data: string|Uint8Array, exclusive?: boolean): void {
    throw makeError();
  }
  removeFile(path: AbsoluteFsPath): void {
    throw makeError();
  }
  symlink(target: AbsoluteFsPath, path: AbsoluteFsPath): void {
    throw makeError();
  }
  readdir(path: AbsoluteFsPath): PathSegment[] {
    throw makeError();
  }
  lstat(path: AbsoluteFsPath): FileStats {
    throw makeError();
  }
  stat(path: AbsoluteFsPath): FileStats {
    throw makeError();
  }
  pwd(): AbsoluteFsPath {
    throw makeError();
  }
  chdir(path: AbsoluteFsPath): void {
    throw makeError();
  }
  extname(path: AbsoluteFsPath|PathSegment): string {
    throw makeError();
  }
  copyFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void {
    throw makeError();
  }
  moveFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void {
    throw makeError();
  }
  ensureDir(path: AbsoluteFsPath): void {
    throw makeError();
  }
  removeDeep(path: AbsoluteFsPath): void {
    throw makeError();
  }
  isCaseSensitive(): boolean {
    throw makeError();
  }
  resolve(...paths: string[]): AbsoluteFsPath {
    throw makeError();
  }
  dirname<T extends PathString>(file: T): T {
    throw makeError();
  }
  join<T extends PathString>(basePath: T, ...paths: string[]): T {
    throw makeError();
  }
  isRoot(path: AbsoluteFsPath): boolean {
    throw makeError();
  }
  isRooted(path: string): boolean {
    throw makeError();
  }
  relative<T extends PathString>(from: T, to: T): PathSegment|AbsoluteFsPath {
    throw makeError();
  }
  basename(filePath: string, extension?: string): PathSegment {
    throw makeError();
  }
  realpath(filePath: AbsoluteFsPath): AbsoluteFsPath {
    throw makeError();
  }
  getDefaultLibLocation(): AbsoluteFsPath {
    throw makeError();
  }
  normalize<T extends PathString>(path: T): T {
    throw makeError();
  }
}

function makeError() {
  return new Error(
      'FileSystem has not been configured. Please call `setFileSystem()` before calling this method.');
}
