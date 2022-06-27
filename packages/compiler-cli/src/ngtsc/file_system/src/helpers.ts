/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {InvalidFileSystem} from './invalid_file_system';
import {AbsoluteFsPath, FileSystem, PathSegment, PathString} from './types';
import {normalizeSeparators} from './util';

let fs: FileSystem = new InvalidFileSystem();
export function getFileSystem(): FileSystem {
  return fs;
}
export function setFileSystem(fileSystem: FileSystem) {
  fs = fileSystem;
}

/**
 * Convert the path `path` to an `AbsoluteFsPath`, throwing an error if it's not an absolute path.
 *
 * 将路径 `path` 转换为 `AbsoluteFsPath` ，如果不是绝对路径，则会抛出错误。
 *
 */
export function absoluteFrom(path: string): AbsoluteFsPath {
  if (!fs.isRooted(path)) {
    throw new Error(`Internal Error: absoluteFrom(${path}): path is not absolute`);
  }
  return fs.resolve(path);
}

const ABSOLUTE_PATH = Symbol('AbsolutePath');

/**
 * Extract an `AbsoluteFsPath` from a `ts.SourceFile`-like object.
 *
 * 从 `ts.SourceFile` 类对象中提取 `AbsoluteFsPath` 。
 *
 */
export function absoluteFromSourceFile(sf: {fileName: string}): AbsoluteFsPath {
  const sfWithPatch = sf as {fileName: string, [ABSOLUTE_PATH]?: AbsoluteFsPath};

  if (sfWithPatch[ABSOLUTE_PATH] === undefined) {
    sfWithPatch[ABSOLUTE_PATH] = fs.resolve(sfWithPatch.fileName);
  }

  // Non-null assertion needed since TS doesn't narrow the type of fields that use a symbol as a key
  // apparently.
  return sfWithPatch[ABSOLUTE_PATH]!;
}

/**
 * Convert the path `path` to a `PathSegment`, throwing an error if it's not a relative path.
 *
 * 将路径 `path` 转换为 `PathSegment` ，如果不是相对路径，则抛出错误。
 *
 */
export function relativeFrom(path: string): PathSegment {
  const normalized = normalizeSeparators(path);
  if (fs.isRooted(normalized)) {
    throw new Error(`Internal Error: relativeFrom(${path}): path is not relative`);
  }
  return normalized as PathSegment;
}

/**
 * Static access to `dirname`.
 *
 * 对 `dirname` 的静态访问。
 *
 */
export function dirname<T extends PathString>(file: T): T {
  return fs.dirname(file);
}

/**
 * Static access to `join`.
 *
 * 要 `join` 的静态访问。
 *
 */
export function join<T extends PathString>(basePath: T, ...paths: string[]): T {
  return fs.join(basePath, ...paths);
}

/**
 * Static access to `resolve`s.
 *
 * 对 `resolve` 的静态访问。
 *
 */
export function resolve(basePath: string, ...paths: string[]): AbsoluteFsPath {
  return fs.resolve(basePath, ...paths);
}

/**
 * Returns true when the path provided is the root path.
 *
 * 当提供的路径是根路径时返回 true。
 *
 */
export function isRoot(path: AbsoluteFsPath): boolean {
  return fs.isRoot(path);
}

/**
 * Static access to `isRooted`.
 *
 * 对 `isRooted` 的静态访问。
 *
 */
export function isRooted(path: string): boolean {
  return fs.isRooted(path);
}

/**
 * Static access to `relative`.
 *
 * 对 `relative` 的静态访问。
 *
 */
export function relative<T extends PathString>(from: T, to: T): PathSegment|AbsoluteFsPath {
  return fs.relative(from, to);
}

/**
 * Static access to `basename`.
 *
 * 对 `basename` 的静态访问。
 *
 */
export function basename(filePath: PathString, extension?: string): PathSegment {
  return fs.basename(filePath, extension) as PathSegment;
}

/**
 * Returns true if the given path is locally relative.
 *
 * 如果给定的路径是本地相对的，则返回 true 。
 *
 * This is used to work out if the given path is relative (i.e. not absolute) but also is not
 * escaping the current directory.
 *
 * 这用于确定给定的路径是否是相对的（即不是绝对的），但也没有转义当前目录。
 *
 */
export function isLocalRelativePath(relativePath: string): boolean {
  return !isRooted(relativePath) && !relativePath.startsWith('..');
}

/**
 * Converts a path to a form suitable for use as a relative module import specifier.
 *
 * 将路径转换为适合用作相对模块导入说明符的形式。
 *
 * In other words it adds the `./` to the path if it is locally relative.
 *
 * 换句话说，如果 ./ 是本地相对的，则会将 `./` 添加到路径中。
 *
 */
export function toRelativeImport(relativePath: PathSegment|AbsoluteFsPath): PathSegment|
    AbsoluteFsPath {
  return isLocalRelativePath(relativePath) ? `./${relativePath}` as PathSegment : relativePath;
}
