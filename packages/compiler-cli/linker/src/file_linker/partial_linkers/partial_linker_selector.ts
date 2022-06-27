/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import semver from 'semver';

import {AbsoluteFsPath} from '../../../../src/ngtsc/file_system';
import {Logger} from '../../../../src/ngtsc/logging';
import {createGetSourceFile} from '../get_source_file';
import {LinkerEnvironment} from '../linker_environment';

import {PartialClassMetadataLinkerVersion1} from './partial_class_metadata_linker_1';
import {PartialComponentLinkerVersion1} from './partial_component_linker_1';
import {PartialDirectiveLinkerVersion1} from './partial_directive_linker_1';
import {PartialFactoryLinkerVersion1} from './partial_factory_linker_1';
import {PartialInjectableLinkerVersion1} from './partial_injectable_linker_1';
import {PartialInjectorLinkerVersion1} from './partial_injector_linker_1';
import {PartialLinker} from './partial_linker';
import {PartialNgModuleLinkerVersion1} from './partial_ng_module_linker_1';
import {PartialPipeLinkerVersion1} from './partial_pipe_linker_1';

export const ɵɵngDeclareDirective = 'ɵɵngDeclareDirective';
export const ɵɵngDeclareClassMetadata = 'ɵɵngDeclareClassMetadata';
export const ɵɵngDeclareComponent = 'ɵɵngDeclareComponent';
export const ɵɵngDeclareFactory = 'ɵɵngDeclareFactory';
export const ɵɵngDeclareInjectable = 'ɵɵngDeclareInjectable';
export const ɵɵngDeclareInjector = 'ɵɵngDeclareInjector';
export const ɵɵngDeclareNgModule = 'ɵɵngDeclareNgModule';
export const ɵɵngDeclarePipe = 'ɵɵngDeclarePipe';
export const declarationFunctions = [
  ɵɵngDeclareDirective, ɵɵngDeclareClassMetadata, ɵɵngDeclareComponent, ɵɵngDeclareFactory,
  ɵɵngDeclareInjectable, ɵɵngDeclareInjector, ɵɵngDeclareNgModule, ɵɵngDeclarePipe
];

export interface LinkerRange<TExpression> {
  range: semver.Range;
  linker: PartialLinker<TExpression>;
}

/**
 * Create a mapping between partial-declaration call name and collections of partial-linkers.
 *
 * 在部分声明调用名称和部分链接器集合之间创建映射。
 *
 * Each collection of partial-linkers will contain a version range that will be matched against the
 * `minVersion` of the partial-declaration. (Additionally, a partial-linker may modify its behaviour
 * internally based on the `version` property of the declaration.)
 *
 * 部分链接器的每个集合都将包含一个版本范围，该范围将与部分声明的 `minVersion` 匹配。
 * （此外，部分链接器可以根据声明的 `version` 属性在内部修改其行为。）
 *
 * Versions should be sorted in ascending order. The most recent partial-linker will be used as the
 * fallback linker if none of the other version ranges match. For example:
 *
 * 版本应按升序排序。如果其他版本范围都不匹配，最新的部分链接器将用作后备链接器。例如：
 *
 * ```
 * {range: getRange('<=', '13.0.0'), linker PartialDirectiveLinkerVersion2(...) },
 * {range: getRange('<=', '13.1.0'), linker PartialDirectiveLinkerVersion3(...) },
 * {range: getRange('<=', '14.0.0'), linker PartialDirectiveLinkerVersion4(...) },
 * {range: LATEST_VERSION_RANGE, linker: new PartialDirectiveLinkerVersion1(...)},
 * ```
 *
 * If the `LATEST_VERSION_RANGE` is `<=15.0.0` then the fallback linker would be
 * `PartialDirectiveLinkerVersion1` for any version greater than `15.0.0`.
 *
 * 如果 `LATEST_VERSION_RANGE` 是 `<=15.0.0` ，则对于任何大于 `15.0.0` 的版本，后备链接器将是
 * `PartialDirectiveLinkerVersion1` 。
 *
 * When there is a change to a declaration interface that requires a new partial-linker, the
 * `minVersion` of the partial-declaration should be updated, the new linker implementation should
 * be added to the end of the collection, and the version of the previous linker should be updated.
 *
 * 当需要新的部分链接器的声明接口发生更改时，应该更新部分声明的 `minVersion`
 * ，新的链接器实现应该添加到集合的末尾，并且前一个链接器的版本应该被更新。
 *
 */
export function createLinkerMap<TStatement, TExpression>(
    environment: LinkerEnvironment<TStatement, TExpression>, sourceUrl: AbsoluteFsPath,
    code: string): Map<string, LinkerRange<TExpression>[]> {
  const linkers = new Map<string, LinkerRange<TExpression>[]>();
  const LATEST_VERSION_RANGE = getRange('<=', '0.0.0-PLACEHOLDER');

  linkers.set(ɵɵngDeclareDirective, [
    {range: LATEST_VERSION_RANGE, linker: new PartialDirectiveLinkerVersion1(sourceUrl, code)},
  ]);
  linkers.set(ɵɵngDeclareClassMetadata, [
    {range: LATEST_VERSION_RANGE, linker: new PartialClassMetadataLinkerVersion1()},
  ]);
  linkers.set(ɵɵngDeclareComponent, [
    {
      range: LATEST_VERSION_RANGE,
      linker: new PartialComponentLinkerVersion1(
          createGetSourceFile(sourceUrl, code, environment.sourceFileLoader), sourceUrl, code)
    },
  ]);
  linkers.set(ɵɵngDeclareFactory, [
    {range: LATEST_VERSION_RANGE, linker: new PartialFactoryLinkerVersion1()},
  ]);
  linkers.set(ɵɵngDeclareInjectable, [
    {range: LATEST_VERSION_RANGE, linker: new PartialInjectableLinkerVersion1()},
  ]);
  linkers.set(ɵɵngDeclareInjector, [
    {range: LATEST_VERSION_RANGE, linker: new PartialInjectorLinkerVersion1()},
  ]);
  linkers.set(ɵɵngDeclareNgModule, [
    {
      range: LATEST_VERSION_RANGE,
      linker: new PartialNgModuleLinkerVersion1(environment.options.linkerJitMode)
    },
  ]);
  linkers.set(ɵɵngDeclarePipe, [
    {range: LATEST_VERSION_RANGE, linker: new PartialPipeLinkerVersion1()},
  ]);

  return linkers;
}

/**
 * A helper that selects the appropriate `PartialLinker` for a given declaration.
 *
 * 为给定声明选择适当的 `PartialLinker` 的帮助器。
 *
 * The selection is made from a database of linker instances, chosen if their given semver range
 * satisfies the `minVersion` of the partial declaration to be linked.
 *
 * 选择是从链接器实例的数据库中进行的，如果它们的给定 semver 范围满足要链接的部分声明的 `minVersion`
 * ，则选择它。
 *
 * Note that the ranges are checked in order, and the first matching range will be selected. So
 * ranges should be most restrictive first. In practice, since ranges are always `<=X.Y.Z` this
 * means that ranges should be in ascending order.
 *
 * 请注意，这些范围会按顺序检查，并且将选择第一个匹配的范围。因此，范围应该是最具限制性的。在实践中，由于范围始终
 * `<=XYZ` ，这意味着范围应该按升序。
 *
 * Note that any "pre-release" versions are stripped from ranges. Therefore if a `minVersion` is
 * `11.1.0-next.1` then this would match `11.1.0-next.2` and also `12.0.0-next.1`. (This is
 * different to standard semver range checking, where pre-release versions do not cross full version
 * boundaries.)
 *
 * 请注意，任何“预发布”版本都会从范围中删除。因此，如果 `minVersion` 是 `11.1.0-next.1`
 * ，那么这将匹配 `11.1.0-next.2` 以及 `12.0.0-next.1` 。 （这与标准 semver
 * 范围检查不同，其中预发布版本不会跨越完整版本边界。）
 *
 */
export class PartialLinkerSelector<TExpression> {
  constructor(
      private readonly linkers: Map<string, LinkerRange<TExpression>[]>,
      private readonly logger: Logger,
      private readonly unknownDeclarationVersionHandling: 'ignore'|'warn'|'error') {}

  /**
   * Returns true if there are `PartialLinker` classes that can handle functions with this name.
   *
   * 如果有 `PartialLinker` 类可以处理使用此名称的函数，则返回 true。
   *
   */
  supportsDeclaration(functionName: string): boolean {
    return this.linkers.has(functionName);
  }

  /**
   * Returns the `PartialLinker` that can handle functions with the given name and version.
   * Throws an error if there is none.
   *
   * 返回可以处理具有给定名称和版本的函数的 `PartialLinker` 。如果没有，则抛出错误。
   *
   */
  getLinker(functionName: string, minVersion: string, version: string): PartialLinker<TExpression> {
    if (!this.linkers.has(functionName)) {
      throw new Error(`Unknown partial declaration function ${functionName}.`);
    }
    const linkerRanges = this.linkers.get(functionName)!;

    if (version === '0.0.0-PLACEHOLDER') {
      // Special case if the `version` is the same as the current compiler version.
      // This helps with compliance tests where the version placeholders have not been replaced.
      return linkerRanges[linkerRanges.length - 1].linker;
    }

    const declarationRange = getRange('>=', minVersion);
    for (const {range: linkerRange, linker} of linkerRanges) {
      if (semver.intersects(declarationRange, linkerRange)) {
        return linker;
      }
    }

    const message =
        `This application depends upon a library published using Angular version ${version}, ` +
        `which requires Angular version ${minVersion} or newer to work correctly.\n` +
        `Consider upgrading your application to use a more recent version of Angular.`;

    if (this.unknownDeclarationVersionHandling === 'error') {
      throw new Error(message);
    } else if (this.unknownDeclarationVersionHandling === 'warn') {
      this.logger.warn(`${message}\nAttempting to continue using this version of Angular.`);
    }

    // No linker was matched for this declaration, so just use the most recent one.
    return linkerRanges[linkerRanges.length - 1].linker;
  }
}

/**
 * Compute a semver Range from the `version` and comparator.
 *
 * 根据 `version` 和比较器计算 semver Range。
 *
 * The range is computed as any version greater/less than or equal to the given `versionStr`
 * depending upon the `comparator` (ignoring any prerelease versions).
 *
 * 根据 `comparator` 的不同，范围会被计算为大于/小于或等于给定 `versionStr`
 * 的任何版本（忽略任何预发行版本）。
 *
 * @param comparator a string that determines whether the version specifies a minimum or a maximum
 *     range.
 *
 * 一个字符串，用于确定版本是指定最小值还是最大值范围。
 *
 * @param versionStr the version given in the partial declaration
 *
 * 部分声明中给出的版本
 *
 * @returns
 *
 * A semver range for the provided `version` and comparator.
 *
 * 提供的 `version` 和比较器的 semver 范围。
 *
 */
function getRange(comparator: '<='|'>=', versionStr: string): semver.Range {
  const version = new semver.SemVer(versionStr);
  // Wipe out any prerelease versions
  version.prerelease = [];
  return new semver.Range(`${comparator}${version.format()}`);
}
