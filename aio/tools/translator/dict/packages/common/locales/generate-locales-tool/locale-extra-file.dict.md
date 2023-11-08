Generate the contents for the extra data file

生成额外数据文件的内容

Generates the "extra" locale data array \(in JS-code as a string\) for the given locale.

为给定的区域设置生成“额外的”区域设置数据数组（在 JS 代码中为字符串）。

The array follows the data and indices as specified in the `ExtraLocaleDataIndex`
enum from `packages/core/src/i18n/locale_data_api.ts`.

该数组遵循 `packages/core/src/i18n/locale_data_api.ts` 的 `ExtraLocaleDataIndex` 枚举中指定的数据和索引。

Extra data currently consists of day period names and rules. The non-extra locale
data by default only contains the universal `AM/PM` day period names.

额外数据当前由日期间名称和规则组成。默认情况下，非额外区域设置数据仅包含通用的 `AM/PM` 日期间名称。

NOTE: Instances of `undefined` in the array have been replaced with the `u` identifier.
      This identifier is used to shorten the generated code of unprocessed locale files.

收集日期间规则和延长的日期间数据。