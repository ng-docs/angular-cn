Values of ngDevMode
Depending on the current state of the application, ngDevMode may have one of several values.

ngDevMode 的值根据应用程序的当前状态，ngDevMode 可能有几个值之一。

For convenience, the “truthy” value which enables dev mode is also an object which contains
Angular’s performance counters. This is not necessary, but cuts down on boilerplate for the
perf counters.

为方便起见，启用 dev 模式的“truthy”值也是一个包含 Angular
性能计数器的对象。这不是必要的，但减少了 perf 计数器的样板。

ngDevMode may also be set to false. This can happen in one of a few ways:

ngDevMode 也可以设置为 false。这可以通过以下几种方式之一发生：

The user explicitly sets `window.ngDevMode = false` somewhere in their app.

用户在他们的应用程序中的某处显式设置 `window.ngDevMode = false`。

The user calls `enableProdMode()`.

用户调用 `enableProdMode()`。

The URL contains a `ngDevMode=false` text.
Finally, ngDevMode may not have been defined at all.

URL 包含 `ngDevMode=false` 文本。最后，可能根本没有定义 ngDevMode。

This function checks to see if the `ngDevMode` has been set. If yes,
then we honor it, otherwise we default to dev mode with additional checks.

此函数会检查是否已设置 `ngDevMode`。如果是，那么我们就会尊重它，否则我们默认为 dev
模式并进行额外的检查。

The idea is that unless we are doing production build where we explicitly
set `ngDevMode == false` we should be helping the developer by providing
as much early warning and errors as possible.

这个想法是，除非我们进行显式设置 `ngDevMode == false`
的生产构建，否则我们应该通过提供尽可能多的早期警告和错误来帮助开发人员。

`ɵɵdefineComponent` is guaranteed to have been called before any component template functions
\(and thus Ivy instructions\), so a single initialization there is sufficient to ensure ngDevMode
is defined for the entire instruction set.

`ɵɵdefineComponent` 保证已在任何组件模板函数（因此是 Ivy
指令）之前调用，因此那里的单个初始化足以确保为整个指令集定义 ngDevMode。

When checking `ngDevMode` on toplevel, always init it before referencing it
\(e.g. `((typeof ngDevMode === 'undefined' || ngDevMode) && initNgDevMode())`\), otherwise you can
 get a `ReferenceError` like in https://github.com/angular/angular/issues/31595.

在 toplevel 上检查 `ngDevMode` 时，请始终在引用它之前初始化它（例如 `((typeof ngDevMode ===
'undefined' || ngDevMode) && initNgDevMode())`
），否则你会得到像 https://github.com/angular/angular/issues/31595 中那样的
`ReferenceError`。
。

Details on possible values for `ngDevMode` can be found on its docstring.

有关 `ngDevMode` 可能值的详细信息，请参阅其文档字符串。

NOTE:

注意：

changes to the `ngDevMode` name must be synced with `compiler-cli/src/tooling.ts`.

对 `ngDevMode` 名称的更改必须与 `compiler-cli/src/tooling.ts`。