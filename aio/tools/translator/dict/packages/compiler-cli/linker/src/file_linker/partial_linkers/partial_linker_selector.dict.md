Create a mapping between partial-declaration call name and collections of partial-linkers.

在部分声明调用名称和部分链接器集合之间创建映射。

Each collection of partial-linkers will contain a version range that will be matched against the
`minVersion` of the partial-declaration. \(Additionally, a partial-linker may modify its behaviour
internally based on the `version` property of the declaration.\)

部分链接器的每个集合都将包含一个版本范围，该范围将与部分声明的 `minVersion` 匹配。
（此外，部分链接器可以根据声明的 `version` 属性在内部修改其行为。）

Versions should be sorted in ascending order. The most recent partial-linker will be used as the
fallback linker if none of the other version ranges match. For example:

版本应按升序排序。如果其他版本范围都不匹配，最新的部分链接器将用作后备链接器。例如：

If the `LATEST_VERSION_RANGE` is `<=15.0.0` then the fallback linker would be
`PartialDirectiveLinkerVersion1` for any version greater than `15.0.0`.

如果 `LATEST_VERSION_RANGE` 是 `<=15.0.0`，则对于任何大于 `15.0.0` 的版本，后备链接器将是
`PartialDirectiveLinkerVersion1`。

When there is a change to a declaration interface that requires a new partial-linker, the
`minVersion` of the partial-declaration should be updated, the new linker implementation should
be added to the end of the collection, and the version of the previous linker should be updated.

当需要新的部分链接器的声明接口发生更改时，应该更新部分声明的 `minVersion`
，新的链接器实现应该添加到集合的末尾，并且前一个链接器的版本应该被更新。

A helper that selects the appropriate `PartialLinker` for a given declaration.

为给定声明选择适当的 `PartialLinker` 的帮助器。

The selection is made from a database of linker instances, chosen if their given semver range
satisfies the `minVersion` of the partial declaration to be linked.

选择是从链接器实例的数据库中进行的，如果它们的给定 semver 范围满足要链接的部分声明的 `minVersion`
，则选择它。

Note that the ranges are checked in order, and the first matching range will be selected. So
ranges should be most restrictive first. In practice, since ranges are always `<=X.Y.Z` this
means that ranges should be in ascending order.

请注意，这些范围会按顺序检查，并且将选择第一个匹配的范围。因此，范围应该是最具限制性的。在实践中，由于范围始终
`<=XYZ`，这意味着范围应该按升序。

Note that any "pre-release" versions are stripped from ranges. Therefore if a `minVersion` is
`11.1.0-next.1` then this would match `11.1.0-next.2` and also `12.0.0-next.1`. \(This is
different to standard semver range checking, where pre-release versions do not cross full version
boundaries.\)

请注意，任何“预发布”版本都会从范围中删除。因此，如果 `minVersion` 是 `11.1.0-next.1`
，那么这将匹配 `11.1.0-next.2` 以及 `12.0.0-next.1`。（这与标准 semver
范围检查不同，其中预发布版本不会跨越完整版本边界。）

Returns true if there are `PartialLinker` classes that can handle functions with this name.

如果有 `PartialLinker` 类可以处理使用此名称的函数，则返回 true。

Returns the `PartialLinker` that can handle functions with the given name and version.
Throws an error if there is none.

返回可以处理具有给定名称和版本的函数的 `PartialLinker`。如果没有，则抛出错误。

a string that determines whether the version specifies a minimum or a maximum
    range.

一个字符串，用于确定版本是指定最小值还是最大值范围。

the version given in the partial declaration

部分声明中给出的版本

A semver range for the provided `version` and comparator.

提供的 `version` 和比较器的 semver 范围。

Compute a semver Range from the `version` and comparator.

根据 `version` 和比较器计算 semver Range。

The range is computed as any version greater/less than or equal to the given `versionStr`
depending upon the `comparator` \(ignoring any prerelease versions\).

根据 `comparator` 的不同，范围会被计算为大于/小于或等于给定 `versionStr`
的任何版本（忽略任何预发行版本）。