Defines if the call to `inject` should include `viewProviders` in its resolution.

定义对 `inject` 的调用是否应在其解析中包含 `viewProviders`。

This is set to true when we try to instantiate a component. This value is reset in
`getNodeInjectable` to a value which matches the declaration location of the token about to be
instantiated. This is done so that if we are injecting a token which was declared outside of
`viewProviders` we don't accidentally pull `viewProviders` in.

当我们尝试实例化组件时，这设置为 true。此值在 `getNodeInjectable`
中被重置为与要实例化的标记的声明位置匹配的值。这样做是为了如果我们注入在 `viewProviders`
之外声明的标记，我们不会意外地将 `viewProviders` 拉入。

Example:

示例：

The number of slots in each bloom filter \(used by DI\). The larger this number, the fewer
directives that will share slots, and thus, the fewer false positives when checking for
the existence of a directive.

每个布隆过滤器中的插槽数（供 DI
使用）。这个数字越大，共享槽的指令就越少，因此检查指令是否存在时的误报就越少。

The number of bits that is represented by a single bloom bucket. JS bit operations are 32 bits,
so each bucket represents 32 distinct tokens which accounts for log2\(32\) = 5 bits of a bloom hash
number.

单个布隆桶表示的位数。JS 位操作是 32 位，因此每个存储桶表示 32 个不同的标记，它们占 log2\(32\) = 5
位的 bloom 哈希值。

Counter used to generate unique IDs for directives.

用于为指令生成唯一 ID 的计数器。

Value used when something wasn't found by an injector.

当注入器找不到某些东西时使用的值。

The index of the node injector where this token should be registered

应注册此标记的节点注入器的索引

The TView for the injector's bloom filters

注入器的布隆过滤器的 TView

The directive token to register

要注册的指令标记

Registers this directive as present in its node's injector by flipping the directive's
corresponding bit in the injector's bloom filter.

通过翻转注入器的布隆过滤器中指令的对应位，将此指令注册为存在于其节点的注入器中。

for which an injector should be retrieved / created.

应该为其检索/创建注入器的。

View where the node is stored

查看节点的存储位置

Node injector

节点注入器

Creates \(or gets an existing\) injector for a given element or container.

为给定元素或容器创建（或获取现有的）注入器。

Returns a number that is the combination of the number of LViews that we have to go up
to find the LView containing the parent inject AND the index of the injector within that LView.

返回一个数字，该数字是我们为了查找包含父注入的 LView 必须上升的 LView 数量与该 LView
中注入器的索引的组合。

Finds the index of the parent injector, with a view offset if applicable. Used to set the
parent injector initially.

查找父注入器的索引，如果适用，带有视图偏移量。用于最初设置父注入器。

The node injector in which a directive will be added

将添加指令的节点注入器

The type or the injection token to be made public

要公开的类型或注入标记

Makes a type or an injection token public to the DI system by adding it to an
injector's bloom filter.

通过将类型或注入标记添加到注入器的布隆过滤器来向 DI 系统公开。

Inject static attribute value into directive constructor.

将静态属性值注入到指令构造函数中。

This method is used with `factory` functions which are generated as part of
`defineDirective` or `defineComponent`. The method retrieves the static value
of an attribute. \(Dynamic attributes are not supported since they are not resolved
 at the time of injection and can change over time.\)

本方法与 `factory` 函数一起使用，这些工厂函数是 `defineDirective` 或 `defineComponent`
生成物的一部分。该方法会检索属性的静态值。（不支持动态属性，因为它们在注入时尚无法解析，并且会随着时间变化。）

Example

例

Given:

给定：

When instantiated with

当使用下列方式实例化时

Then factory method generated is:

所生成的工厂方法是：

The `LView` that contains the `tNode`

包含 `LView` 的 `tNode`

The token to look for

要查找的标记

Injection flags

注入标志

The value to return when the injection flags is `InjectFlags.Optional`

当注入标志为 `InjectFlags.Optional` 时要返回的值

the value from the injector or throws an exception

来自注入器的值或抛出异常

Returns the value associated to the given token from the ModuleInjector or throws exception

从 ModuleInjector 返回与给定标记关联的值或抛出异常

The Node where the search for the injector should start

应该开始搜索注入器的节点

the value from the injector, `null` when not found, or `notFoundValue` if provided

来自注入器的值，找不到时为 `null`，如果提供了 `notFoundValue`

Returns the value associated to the given token from the NodeInjectors => ModuleInjector.

从 NodeInjectors => ModuleInjector 返回与给定标记关联的值。

Look for the injector providing the token by walking up the node injector tree and then
the module injector tree.

通过向上走节点注入器树然后走模块注入器树来寻找提供标记的注入器。

This function patches `token` with `__NG_ELEMENT_ID__` which contains the id for the bloom
filter. `-1` is reserved for injecting `Injector` \(implemented by `NodeInjector`\)

此函数使用包含布隆过滤器的 id 的 `__NG_ELEMENT_ID__` 来修补 `token`。`-1` 保留用于注入
`Injector`（由 `NodeInjector` 实现）

Returns the value associated to the given token from the node injector.

从节点注入器返回与给定标记关联的值。

TNode on which directives are present.

存在指令的 TNode。

The tView we are currently processing

我们当前正在处理的 tView

Provider token or type of a directive to look for.

要查找的提供者标记或指令的类型。

Whether view providers should be considered.

是否应该考虑视图提供程序。

Whether the host special case applies.

宿主特殊情况是否适用。

Index of a found directive or provider, or null when none found.

找到的指令或提供程序的索引，如果找不到，则为 null。

Searches for the given token among the node's directives and providers.

在节点的指令和提供者中搜索给定的标记。

Retrieve or instantiate the injectable from the `LView` at particular `index`.

从 `LView` 的特定 `index` 处检索或实例化可注入。

This function checks to see if the value has already been instantiated and if so returns the
cached `injectable`. Otherwise if it detects that the value is still a factory it
instantiates the `injectable` and caches the value.

此函数会检查值是否已被实例化，如果是则返回缓存的 `injectable`
。否则，如果它检测到该值仍然是工厂，它会实例化 `injectable` 并缓存该值。

the injection token

注入标记

the matching bit to check in the bloom filter or `null` if the token is not known.
  When the returned value is negative then it represents special values such as `Injector`.

要在布隆过滤器中检查的匹配位，如果不知道标记，则为 `null`。当返回值为负数时，它表示特殊值，例如
`Injector`。

Returns the bit in an injector's bloom filter that should be used to determine whether or not
the directive might be provided by the injector.

返回注入器的布隆过滤器中应该用于确定该指令是否可以由注入器提供的位。

When a directive is public, it is added to the bloom filter and given a unique ID that can be
retrieved on the Type. When the directive isn't public or the token is not a directive `null`
is returned as the node injector can not possibly provide that token.

当指令是 public 时，它会被添加到布隆过滤器中，并给定一个可以在 Type 上检索的唯一 ID。当指令不是
public 或标记不是指令时，会返回 `null`，因为节点注入器无法提供该标记。

Returns true if flags prevent parent injector from being searched for tokens

如果标志阻止在父注入器中搜索标记，则返回 true

Creates a `NodeInjector` for the current node.

为当前节点创建 `NodeInjector`。

Returns a value from the closest embedded or node injector.

返回最近的嵌入式或节点注入器的值。

Gets the TNode associated with an LView inside of the declaration view.

获取与声明视图中的 LView 关联的 TNode。