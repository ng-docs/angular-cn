/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';

/**
 * A `Symbol` which is used to patch extension data onto `ts.SourceFile`s.
 *
 * 一个 `Symbol` ，用于将扩展名数据修补到 `ts.SourceFile` s。
 *
 */
export const NgExtension = Symbol('NgExtension');

/**
 * Contents of the `NgExtension` property of a `ts.SourceFile`.
 *
 * ts.SourceFile 的 `NgExtension` 属性的 `ts.SourceFile` 。
 *
 */
export interface NgExtensionData {
  isTopLevelShim: boolean;
  fileShim: NgFileShimData|null;

  /**
   * The contents of the `referencedFiles` array, before modification by a `ShimReferenceTagger`.
   *
   * `referencedFiles` 数组的内容，在被 `ShimReferenceTagger` 修改之前。
   *
   */
  originalReferencedFiles: ReadonlyArray<ts.FileReference>|null;

  /**
   * The contents of the `referencedFiles` array, after modification by a `ShimReferenceTagger`.
   *
   * 由 `ShimReferenceTagger` 修改后的 `referencedFiles` 数组的内容。
   *
   */
  taggedReferenceFiles: ReadonlyArray<ts.FileReference>|null;
}

/**
 * A `ts.SourceFile` which may or may not have `NgExtension` data.
 *
 * 一个 `ts.SourceFile` ，可能有也可能没有 `NgExtension` 数据。
 *
 */
interface MaybeNgExtendedSourceFile extends ts.SourceFile {
  [NgExtension]?: NgExtensionData;
}

/**
 * A `ts.SourceFile` which has `NgExtension` data.
 *
 * 具有 `ts.SourceFile` 数据的 `NgExtension` 。
 *
 */
export interface NgExtendedSourceFile extends ts.SourceFile {
  /**
   * Overrides the type of `referencedFiles` to be writeable.
   *
   * 将 `referencedFiles` 的类型覆盖为可写。
   *
   */
  referencedFiles: ts.FileReference[];

  [NgExtension]: NgExtensionData;
}

/**
 * Narrows a `ts.SourceFile` if it has an `NgExtension` property.
 *
 * 如果 `NgExtension` `ts.SourceFile` ，则缩小它。
 *
 */
export function isExtended(sf: ts.SourceFile): sf is NgExtendedSourceFile {
  return (sf as MaybeNgExtendedSourceFile)[NgExtension] !== undefined;
}

/**
 * Returns the `NgExtensionData` for a given `ts.SourceFile`, adding it if none exists.
 *
 * 返回给定 `NgExtensionData` 的 `ts.SourceFile` ，如果不存在，则添加它。
 *
 */
export function sfExtensionData(sf: ts.SourceFile): NgExtensionData {
  const extSf = sf as MaybeNgExtendedSourceFile;
  if (extSf[NgExtension] !== undefined) {
    // The file already has extension data, so return it directly.
    return extSf[NgExtension]!;
  }

  // The file has no existing extension data, so add it and return it.
  const extension: NgExtensionData = {
    isTopLevelShim: false,
    fileShim: null,
    originalReferencedFiles: null,
    taggedReferenceFiles: null,
  };
  extSf[NgExtension] = extension;
  return extension;
}

/**
 * Data associated with a per-shim instance `ts.SourceFile`.
 *
 * 与每个 shim 实例 `ts.SourceFile` 关联的数据。
 *
 */
export interface NgFileShimData {
  generatedFrom: AbsoluteFsPath;
  extension: string;
}

/**
 * An `NgExtendedSourceFile` that is a per-file shim and has `NgFileShimData`.
 *
 * 一个 `NgExtendedSourceFile` ，它是每个文件的 shim 并具有 `NgFileShimData` 。
 *
 */
export interface NgFileShimSourceFile extends NgExtendedSourceFile {
  [NgExtension]: NgExtensionData&{
    fileShim: NgFileShimData,
  };
}

/**
 * Check whether `sf` is a per-file shim `ts.SourceFile`.
 *
 * 检查 `sf` 是否是每个文件的 shim `ts.SourceFile` 。
 *
 */
export function isFileShimSourceFile(sf: ts.SourceFile): sf is NgFileShimSourceFile {
  return isExtended(sf) && sf[NgExtension].fileShim !== null;
}

/**
 * Check whether `sf` is a shim `ts.SourceFile` (either a per-file shim or a top-level shim).
 *
 * 检查 `sf` 是否是 shim `ts.SourceFile`（每个文件的 shim 或顶级 shim）。
 *
 */
export function isShim(sf: ts.SourceFile): boolean {
  return isExtended(sf) && (sf[NgExtension].fileShim !== null || sf[NgExtension].isTopLevelShim);
}

/**
 * Copy any shim data from one `ts.SourceFile` to another.
 *
 * 将任何 shim 数据从一个 `ts.SourceFile` 到另一个。
 *
 */
export function copyFileShimData(from: ts.SourceFile, to: ts.SourceFile): void {
  if (!isFileShimSourceFile(from)) {
    return;
  }
  sfExtensionData(to).fileShim = sfExtensionData(from).fileShim;
}

/**
 * For those `ts.SourceFile`s in the `program` which have previously been tagged by a
 * `ShimReferenceTagger`, restore the original `referencedFiles` array that does not have shim tags.
 *
 * 对于 `program` 中以前被 `ShimReferenceTagger` `ts.SourceFile` 恢复没有 shim 标签的原始
 * `referencedFiles` 数组。
 *
 */
export function untagAllTsFiles(program: ts.Program): void {
  for (const sf of program.getSourceFiles()) {
    untagTsFile(sf);
  }
}

/**
 * For those `ts.SourceFile`s in the `program` which have previously been tagged by a
 * `ShimReferenceTagger`, re-apply the effects of tagging by updating the `referencedFiles` array to
 * the tagged version produced previously.
 *
 * 对于 `program` 中以前被 `ShimReferenceTagger` `ts.SourceFile` 请通过将 `referencedFiles`
 * 数组更新为以前生成的标记版本来重新应用标记的效果。
 *
 */
export function retagAllTsFiles(program: ts.Program): void {
  for (const sf of program.getSourceFiles()) {
    retagTsFile(sf);
  }
}

/**
 * Restore the original `referencedFiles` for the given `ts.SourceFile`.
 *
 * 恢复给定 `ts.SourceFile` 的原始 `referencedFiles` 。
 *
 */
export function untagTsFile(sf: ts.SourceFile): void {
  if (sf.isDeclarationFile || !isExtended(sf)) {
    return;
  }

  const ext = sfExtensionData(sf);
  if (ext.originalReferencedFiles !== null) {
    sf.referencedFiles = ext.originalReferencedFiles as Array<ts.FileReference>;
  }
}

/**
 * Apply the previously tagged `referencedFiles` to the given `ts.SourceFile`, if it was previously
 * tagged.
 *
 * 将以前标记的 `referencedFiles` 应用于给定的 `ts.SourceFile`（如果以前被标记）。
 *
 */
export function retagTsFile(sf: ts.SourceFile): void {
  if (sf.isDeclarationFile || !isExtended(sf)) {
    return;
  }

  const ext = sfExtensionData(sf);
  if (ext.taggedReferenceFiles !== null) {
    sf.referencedFiles = ext.taggedReferenceFiles as Array<ts.FileReference>;
  }
}
