The route that might have providers

可能有提供者的路由

The parent injector of the `Route`

`Route` 的父注入器

Creates an `EnvironmentInjector` if the `Route` has providers and one does not already exist
and returns the injector. Otherwise, if the `Route` does not have `providers`, returns the
`currentInjector`.

如果 `Route` 有提供者并且不存在，则创建一个 `EnvironmentInjector` 并返回注入器。否则，如果
`Route` 没有 `providers`，则返回 `currentInjector`。

Makes a copy of the config and adds any default required properties.

制作配置的副本并添加任何默认的必需属性。

Returns the `route.outlet` or PRIMARY_OUTLET if none exists.

如果不存在，则返回 `route.outlet` 或 PRIMARY_OUTLET。

Sorts the `routes` such that the ones with an outlet matching `outletName` come first.
The order of the configs is otherwise preserved.

对 `routes` 进行排序，以使具有与 `outletName`
匹配的插座的路径排在第一位。否则配置的顺序会被保留。

Gets the first injector in the snapshot's parent tree.

获取快照的父树中的第一个注入器。

If the `Route` has a static list of providers, the returned injector will be the one created from
those. If it does not exist, the returned injector may come from the parents, which may be from a
loaded config or their static providers.

如果 `Route`
有一个静态提供者列表，则返回的注入器将是从这些提供者创建的。如果不存在，则返回的注入器可能来自父级，它们可能来自加载的配置或它们的静态提供程序。

Returns `null` if there is neither this nor any parents have a stored injector.

如果不存在 this 或任何父级都没有存储的注入器，则返回 `null`。

Generally used for retrieving the injector to use for getting tokens for guards/resolvers and
also used for getting the correct injector to use for creating components.

通常用于检索注入器以获取保护器/解析器的标记，还用于获取正确的注入器以创建组件。