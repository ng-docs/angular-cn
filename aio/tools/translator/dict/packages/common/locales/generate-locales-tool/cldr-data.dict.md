Globs that match CLDR JSON data files that should be fetched. We limit these intentionally
as loading unused data results in significant slow-down of the generation
\(noticeable in local development if locale data is re-generated\).

与应该提取的 CLDR JSON 数据文件匹配的
Glob。我们故意限制这些，因为加载未使用的数据会导致生成显着减慢（如果重新生成语言环境数据，在本地开发中会很明显）。

Path to the CLDR available locales file.

CLDR 可用的语言环境文件的路径。

Path to the CLDR locale aliases file.

CLDR 区域设置别名文件的路径。

Instance providing access to a locale's CLDR data. This type extends the `cldrjs`
instance type with the missing `bundle` attribute property.

提供对区域设置的 CLDR 数据的访问的实例。此类型使用缺少的 `bundle` 属性属性扩展了 `cldrjs`
实例类型。

Resolved bundle name for the locale.
More details: http://www.unicode.org/reports/tr35/#Bundle_vs_Item_Lookup

区域设置的解析包名称。更多详细信息：
http://www.unicode.org/reports/tr35/#Bundle_vs_Item_Lookup

Possible reasons for an alias in the CLDR supplemental data. See:
https://unicode.org/reports/tr35/tr35-info.html#Appendix_Supplemental_Metadata.

CLDR 补充数据中存在别名的可能原因。请参阅：
https://unicode.org/reports/tr35/tr35-info.html#Appendix_Supplemental_Metadata。

Class that provides access to the CLDR JSON data downloaded as part of
the `@cldr_json_data` Bazel repository.

提供对作为 `@cldr_json_data` Bazel 存储库的一部分下载的 CLDR JSON 数据的访问的类。

Path to the CLDR JSON data Bazel repository. i.e. `@cldr_json_data//`.

CLDR JSON 数据 Bazel 存储库的路径。即 `@cldr_json_data//`。

List of all available locales CLDR provides data for.

CLDR 为其提供数据的所有可用区域设置的列表。

Gets the CLDR data for the specified locale.

获取指定区域设置的 CLDR 数据。

Gets the CLDR language aliases.
http://cldr.unicode.org/index/cldr-spec/language-tag-equivalences.

获取 CLDR 语言别名。http://cldr.unicode.org/index/cldr-spec/language-tag-equivalences。