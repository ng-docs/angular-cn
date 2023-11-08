This should fire off `ActivationStart` events for each route being activated at this
level.
In other words, if you're activating `a` and `b` below, `path` will contain the
`ActivatedRouteSnapshot`s for both and we will fire `ActivationStart` for both. Always
return
`true` so checks continue to run.

这应该为在此级别激活的每个路由触发 `ActivationStart` 事件。换句话说，如果你要激活下面 `a` 和 `b`
，`path` 将包含两者的 `ActivatedRouteSnapshot`，我们将为两者触发 `ActivationStart`。始终返回
`true`，以便检查继续运行。

This should fire off `ChildActivationStart` events for each route being activated at this
level.
In other words, if you're activating `a` and `b` below, `path` will contain the
`ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
return
`true` so checks continue to run.

这应该为在此级别激活的每个路由触发 `ChildActivationStart` 事件。换句话说，如果你要激活下面 `a` 和
`b`，则 `path` 将包含两者的 `ActivatedRouteSnapshot`，我们将为两者触发 `ChildActivationStart`
。始终返回 `true`，以便检查继续运行。