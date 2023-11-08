Tracks whether the linked route of an element is currently active, and allows you
to specify one or more CSS classes to add to the element when the linked route
is active.

跟踪元素上的链接路由当前是否处于活动状态，并允许你指定一个或多个 CSS
类，以便在链接路由处于活动状态时添加到该元素。

Use this directive to create a visual distinction for elements associated with an active route.
For example, the following code highlights the word "Bob" when the router
activates the associated route:

使用此指令为与活动路径关联的元素创建视觉差异。比如，以下代码会在路由器激活关联的路由时突出显示单词
“Bob”：

Whenever the URL is either '/user' or '/user/bob', the "active-link" class is
added to the anchor tag. If the URL changes, the class is removed.

当浏览器的当前 url 是 '/user' 或 '/user/bob' 时，就会往 `a` 标签上添加 `active-link` 类；
如果 url 发生了变化，则移除它。

You can set more than one class using a space-separated string or an array.
For example:

你可以设置一个或多个类，比如：

To add the classes only when the URL matches the link exactly, add the option `exact: true`:

你可以通过传入 `exact: true` 来配置 RouterLinkActive。这样，只有当 url
和此链接精确匹配时才会添加这些类。

To directly check the `isActive` status of the link, assign the `RouterLinkActive`
instance to a template variable.
For example, the following checks the status without assigning any CSS classes:

要直接检查 `isActive` 状态，请将 `RouterLinkActive`
实例分配给模板变量。比如，以下代码会在不分配任何 CSS 类的情况下检查状态：

You can apply the `RouterLinkActive` directive to an ancestor of linked elements.
For example, the following sets the active-link class on the `<div>`  parent tag
when the URL is either '/user/jim' or '/user/bob'.

最后，你还可以把 `RouterLinkActive` 指令用在 `RouterLink` 的各级祖先节点上。

The `RouterLinkActive` directive can also be used to set the aria-current attribute
to provide an alternative distinction for active elements to visually impaired users.

`RouterLinkActive` 指令也可用于设置 aria-current 属性，以为视障用户提供活动元素的另一种区别。

For example, the following code adds the 'active' class to the Home Page link when it is
indeed active and in such case also sets its aria-current attribute to 'page':

例如，以下代码在确实处于活动状态时将 'active' 类添加到主页链接，并在这种情况下将其 aria-current
属性设置为 'page'：

Router.isActive



Options to configure how to determine if the router link is active.

用于配置如何确定路由器链接是否处于活动状态的选项。

These options are passed to the `Router.isActive()` function.

这些选项会传递给 `Router.isActive()` 函数。

Aria-current attribute to apply when the router link is active.

路由器链接处于活动状态时要应用的 Aria-current 属性。

Possible values: `'page'` \| `'step'` \| `'location'` \| `'date'` \| `'time'` \| `true` \|
`false`.

可能的值：`'page'` \| `'step'` \| `'location'` \| `'date'` \| `'time'` \| `true` `false` 的。

You can use the output `isActiveChange` to get notified each time the link becomes
active or inactive.

你可以用输出 `isActiveChange` 来在每次链接变为活动或非活动时获取通知。

Emits:
true  -> Route is active
false -> Route is inactive

发出：true -> 路由处于活动状态 false -> 路由处于非活动状态

Use instead of `'paths' in options` to be compatible with property renaming

`'paths' in options` 与属性重命名兼容