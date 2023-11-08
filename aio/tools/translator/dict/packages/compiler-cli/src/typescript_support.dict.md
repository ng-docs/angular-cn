Minimum supported TypeScript version
∀ supported typescript version v, v >= MIN_TS_VERSION

支持的最低 TypeScript 版本 ∀ 支持的 typescript 版本 v, v >= MIN_TS_VERSION

Note: this check is disabled in g3, search for
`angularCompilerOptions.disableTypeScriptVersionCheck` config param value in g3.

注意：此检查在 g3 中禁用，请在 g3 中搜索 `angularCompilerOptions.disableTypeScriptVersionCheck`
配置参数值。

Supremum of supported TypeScript versions
∀ supported typescript version v, v &lt; MAX_TS_VERSION
MAX_TS_VERSION is not considered as a supported TypeScript version

受支持的 TypeScript 版本的上限 ∀ 支持的 typescript 版本 v，v &lt; MAX_TS_VERSION MAX_TS_VERSION
不被视为受支持的 TypeScript 版本

The currently used version of TypeScript, which can be adjusted for testing purposes using
`setTypeScriptVersionForTesting` and `restoreTypeScriptVersionForTesting` below.

当前使用的 TypeScript 版本，可以用下面的 `setTypeScriptVersionForTesting` 和
`restoreTypeScriptVersionForTesting` 来出于测试目的进行调整。

The version on which the check will be performed

将执行检查的版本

The lower bound version. A valid version needs to be greater than minVersion

下限版本。有效版本需要大于 minVersion

The upper bound version. A valid version needs to be strictly less than
maxVersion

上限版本。有效版本需要严格小于 maxVersion

Will throw an error if the given version ∉ \[minVersion, maxVersion\[

如果给定版本 ∉ \[minVersion, maxVersion\[

Checks whether a given version ∈ \[minVersion, maxVersion\[.
An error will be thrown when the given version ∉ \[minVersion, maxVersion\[.

检查给定的版本 ∈ \[minVersion, maxVersion\[。当给定版本 ∉ \[minVersion, maxVersion\[.