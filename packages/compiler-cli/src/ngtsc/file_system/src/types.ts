/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A `string` representing a specific type of path, with a particular brand `B`.
 *
 * 表示特定类型的路径的 `string` ，具有特定的品牌 `B` 。
 *
 * A `string` is not assignable to a `BrandedPath`, but a `BrandedPath` is assignable to a `string`.
 * Two `BrandedPath`s with different brands are not mutually assignable.
 *
 * `string` 不能分配给 `BrandedPath` ，但 `BrandedPath` 可以分配给 `string` 。具有不同品牌的两个
 * `BrandedPath` 不能相互分配。
 *
 */
export type BrandedPath<B extends string> = string&{
  _brand: B;
};

/**
 * A fully qualified path in the file system, in POSIX form.
 *
 * 文件系统中的完全限定路径，采用 POSIX 格式。
 *
 */
export type AbsoluteFsPath = BrandedPath<'AbsoluteFsPath'>;

/**
 * A path that's relative to another (unspecified) root.
 *
 * 相对于另一个（未指定）根的路径。
 *
 * This does not necessarily have to refer to a physical file.
 *
 * 这不一定要引用物理文件。
 *
 */
export type PathSegment = BrandedPath<'PathSegment'>;

/**
 * An abstraction over the path manipulation aspects of a file-system.
 *
 * 对文件系统的路径操作方面的抽象。
 *
 */
export interface PathManipulation {
  extname(path: AbsoluteFsPath|PathSegment): string;
  isRoot(path: AbsoluteFsPath): boolean;
  isRooted(path: string): boolean;
  dirname<T extends PathString>(file: T): T;
  extname(path: AbsoluteFsPath|PathSegment): string;
  join<T extends PathString>(basePath: T, ...paths: string[]): T;
  /**
   * Compute the relative path between `from` and `to`.
   *
   * 计算 `from` 和 `to` 之间的相对路径。
   *
   * In file-systems that can have multiple file trees the returned path may not actually be
   * "relative" (i.e. `PathSegment`). For example, Windows can have multiple drives :
   * `relative('c:/a/b', 'd:/a/c')` would be \`d:/a/c'.
   *
   * 在可以有多个文件树的文件系统中，返回的路径实际上可能不是“相对的”（即 `PathSegment`
   * ）。例如，Windows 可以有多个驱动器： `relative('c:/a/b', 'd:/a/c')` 将是 \`d:/a/c'。
   *
   */
  relative<T extends PathString>(from: T, to: T): PathSegment|AbsoluteFsPath;
  basename(filePath: string, extension?: string): PathSegment;
  normalize<T extends PathString>(path: T): T;
  resolve(...paths: string[]): AbsoluteFsPath;
  pwd(): AbsoluteFsPath;
  chdir(path: AbsoluteFsPath): void;
}

/**
 * An abstraction over the read-only aspects of a file-system.
 *
 * 对文件系统只读方面的抽象。
 *
 */
export interface ReadonlyFileSystem extends PathManipulation {
  isCaseSensitive(): boolean;
  exists(path: AbsoluteFsPath): boolean;
  readFile(path: AbsoluteFsPath): string;
  readFileBuffer(path: AbsoluteFsPath): Uint8Array;
  readdir(path: AbsoluteFsPath): PathSegment[];
  lstat(path: AbsoluteFsPath): FileStats;
  stat(path: AbsoluteFsPath): FileStats;
  realpath(filePath: AbsoluteFsPath): AbsoluteFsPath;
  getDefaultLibLocation(): AbsoluteFsPath;
}

/**
 * A basic interface to abstract the underlying file-system.
 *
 * 抽象底层文件系统的基本接口。
 *
 * This makes it easier to provide mock file-systems in unit tests,
 * but also to create clever file-systems that have features such as caching.
 *
 * 这使得在单元测试中提供模拟文件系统变得更容易，同时也可以创建具有缓存等特性的聪明文件系统。
 *
 */
export interface FileSystem extends ReadonlyFileSystem {
  writeFile(path: AbsoluteFsPath, data: string|Uint8Array, exclusive?: boolean): void;
  removeFile(path: AbsoluteFsPath): void;
  symlink(target: AbsoluteFsPath, path: AbsoluteFsPath): void;
  copyFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
  moveFile(from: AbsoluteFsPath, to: AbsoluteFsPath): void;
  ensureDir(path: AbsoluteFsPath): void;
  removeDeep(path: AbsoluteFsPath): void;
}

export type PathString = string|AbsoluteFsPath|PathSegment;

/**
 * Information about an object in the FileSystem.
 * This is analogous to the `fs.Stats` class in Node.js.
 *
 * 有关文件系统中对象的信息。这类似于 Node.js 中的 `fs.Stats` 类。
 *
 */
export interface FileStats {
  isFile(): boolean;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
}
