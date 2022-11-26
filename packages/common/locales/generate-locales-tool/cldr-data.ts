/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {runfiles} from '@bazel/runfiles';
import {CldrStatic} from 'cldrjs';
import glob from 'glob';

// TypeScript doesn't allow us to import the default export without the `esModuleInterop`. We use
// the NodeJS require function instead as specifying a custom tsconfig complicates the setup
// unnecessarily.
// TODO: See if we can improve this by having better types for `cldrjs`.
const cldrjs: typeof import('cldrjs') = require('cldrjs');

/**
 * Globs that match CLDR JSON data files that should be fetched. We limit these intentionally
 * as loading unused data results in significant slow-down of the generation
 * (noticeable in local development if locale data is re-generated).
 *
 * 与应该提取的 CLDR JSON 数据文件匹配的
 * Glob。我们故意限制这些，因为加载未使用的数据会导致生成显着减慢（如果重新生成语言环境数据，在本地开发中会很明显）。
 *
 */
const CLDR_DATA_GLOBS = [
  'cldr-core/scriptMetadata.json',
  'cldr-core/supplemental/*.json',
  'cldr-dates-full/main/**/*.json',
  'cldr-numbers-full/main/**/*.json',
];

/**
 * Path to the CLDR available locales file.
 *
 * CLDR 可用的语言环境文件的路径。
 *
 */
const CLDR_AVAILABLE_LOCALES_PATH = 'cldr-core/availableLocales.json';

/**
 * Path to the CLDR locale aliases file.
 *
 * CLDR 区域设置别名文件的路径。
 *
 */
const CLDR_LOCALE_ALIASES_PATH = 'cldr-core/supplemental/aliases.json';

/**
 * Instance providing access to a locale's CLDR data. This type extends the `cldrjs`
 * instance type with the missing `bundle` attribute property.
 *
 * 提供对区域设置的 CLDR 数据的访问的实例。此类型使用缺少的 `bundle` 属性属性扩展了 `cldrjs`
 * 实例类型。
 *
 */
export type CldrLocaleData = CldrStatic&{
  attributes: {
    /**
     * Resolved bundle name for the locale.
     * More details: <http://www.unicode.org/reports/tr35/#Bundle_vs_Item_Lookup>
     *
     * 区域设置的解析包名称。更多详细信息：
     * [http](http://www.unicode.org/reports/tr35/#Bundle_vs_Item_Lookup)
     * ://www.unicode.org/reports/tr35/#Bundle_vs_Item_Lookup
     *
     */
    bundle: string;
  }
};

/**
 * Possible reasons for an alias in the CLDR supplemental data. See:
 * <https://unicode.org/reports/tr35/tr35-info.html#Appendix_Supplemental_Metadata>.
 *
 * CLDR 补充数据中存在别名的可能原因。请参阅：
 * <https://unicode.org/reports/tr35/tr35-info.html#Appendix_Supplemental_Metadata> 。
 *
 */
export type CldrLocaleAliasReason =
    'deprecated'|'overlong'|'macrolanguage'|'legacy'|'bibliographic';

/**
 * Class that provides access to the CLDR JSON data downloaded as part of
 * the `@cldr_json_data` Bazel repository.
 *
 * 提供对作为 `@cldr_json_data` Bazel 存储库的一部分下载的 CLDR JSON 数据的访问的类。
 *
 */
export class CldrData {
  /**
   * Path to the CLDR JSON data Bazel repository. i.e. `@cldr_json_data//`.
   *
   * CLDR JSON 数据 Bazel 存储库的路径。即 `@cldr_json_data//` 。
   *
   */
  readonly cldrDataDir = runfiles.resolve('cldr_json_data');

  /**
   * List of all available locales CLDR provides data for.
   *
   * CLDR 为其提供数据的所有可用区域设置的列表。
   *
   */
  readonly availableLocales: readonly CldrLocaleData[];

  constructor() {
    this._loadAndPopulateCldrData();
    this.availableLocales = this._getAvailableLocales();
  }

  /**
   * Gets the CLDR data for the specified locale.
   *
   * 获取指定区域设置的 CLDR 数据。
   *
   */
  getLocaleData(localeName: string): CldrLocaleData|null {
    // Cast to `CldrLocaleData` because the default `cldrjs` types from `DefinitelyTyped`
    // are outdated and do not capture the `bundle` attribute. See:
    // https://github.com/rxaviers/cldrjs#instantiate-a-locale-and-get-it-normalized.
    const localeData = new cldrjs(localeName) as CldrLocaleData;

    // In case a locale has been requested for which no data is available, we return
    // `null` immediately instead of returning an empty `CldrStatic` instance.
    if (localeData.attributes.bundle === null) {
      return null;
    }

    return localeData;
  }

  /**
   * Gets the CLDR language aliases.
   * <http://cldr.unicode.org/index/cldr-spec/language-tag-equivalences>.
   *
   * 获取 CLDR 语言别名。 <http://cldr.unicode.org/index/cldr-spec/language-tag-equivalences> 。
   *
   */
  getLanguageAliases():
      {[localeName: string]: {_reason: CldrLocaleAliasReason, _replacement: string}} {
    return require(`${this.cldrDataDir}/${CLDR_LOCALE_ALIASES_PATH}`)
        .supplemental.metadata.alias.languageAlias;
  }

  /**
   * Gets a list of all locales CLDR provides data for.
   *
   * 获取 CLDR 为其提供数据的所有区域设置的列表。
   *
   */
  private _getAvailableLocales(): CldrLocaleData[] {
    const allLocales =
        require(`${this.cldrDataDir}/${CLDR_AVAILABLE_LOCALES_PATH}`).availableLocales.full;
    const localesWithData: CldrLocaleData[] = [];

    for (const localeName of allLocales) {
      const localeData = this.getLocaleData(localeName);

      if (localeData === null) {
        throw new Error(`Missing locale data for the "${localeName}" locale.`);
      }

      localesWithData.push(localeData);
    }

    return localesWithData;
  }

  /**
   * Loads the CLDR data and populates the `cldrjs` library with it.
   *
   * 加载 CLDR 数据并使用它填充 `cldrjs` 库。
   *
   */
  private _loadAndPopulateCldrData() {
    const localeData = this._readCldrDataFromRepository();

    if (localeData.length === 0) {
      throw Error('No CLDR data could be found.');
    }

    // Populate the `cldrjs` library with the locale data. Note that we need this type cast
    // to satisfy the first `cldrjs.load` parameter which cannot be undefined.
    cldrjs.load(...localeData as [object, ...object[]]);
  }

  /**
   * Reads the CLDR JSON data from the Bazel repository.
   *
   * 从 Bazel 存储库读取 CLDR JSON 数据。
   *
   * @returns
   *
   * a list of read JSON objects representing the CLDR data.
   *
   * 表示 CLDR 数据的已读取 JSON 对象的列表。
   *
   */
  private _readCldrDataFromRepository(): object[] {
    const jsonFiles =
        CLDR_DATA_GLOBS.map(pattern => glob.sync(pattern, {cwd: this.cldrDataDir, absolute: true}))
            .reduce((acc, dataFiles) => [...acc, ...dataFiles], []);

    // Read the JSON for all determined CLDR json files.
    return jsonFiles.map(filePath => {
      const parsed = require(filePath);

      // Guards against cases where non-CLDR data files are accidentally picked up
      // by the glob above and would throw-off the bundle lookup in `cldrjs`.
      if (parsed.main !== undefined && typeof parsed.main !== 'object') {
        throw Error('Unexpected CLDR json file with "main" field which is not an object.');
      }

      return parsed;
    });
  }
}
