untrusted `html`, typically from the user.

不受信任的 `html`，通常来自用户。

`html` string which is safe to display to user, because all of the dangerous javascript
and urls have been removed.

可以安全地显示给用户的 `html` 字符串，因为所有危险的 javascript 和 url 都已删除。

An `html` sanitizer which converts untrusted `html` **string** into trusted string by removing
dangerous content.

一种 `html` 清洁器，可通过删除危险内容将不受信任的 `html`**字符串**转换为受信任的字符串。

This method parses the `html` and locates potentially dangerous content \(such as urls and
javascript\) and removes it.

此方法会解析 `html` 并定位具有潜在危险的内容（例如 urls 和 javascript）并将其删除。

It is possible to mark a string as trusted by calling {&commat;link bypassSanitizationTrustHtml}.

可以通过调用 {&commat;link bypassSanitizationTrustHtml} 来将字符串标记为受信任。

untrusted `style`, typically from the user.

不受信任的 `style`，通常来自用户。

`style` string which is safe to bind to the `style` properties.

可以安全地绑定到 `style` 属性的 `style` 字符串。

A `style` sanitizer which converts untrusted `style` **string** into trusted string by removing
dangerous content.

一种 `style` 消毒器，可通过删除危险内容将不受信任的 `style`**字符串**转换为受信任的字符串。

It is possible to mark a string as trusted by calling {&commat;link bypassSanitizationTrustStyle}.

可以通过调用 {&commat;link bypassSanitizationTrustStyle} 来将字符串标记为受信任。

untrusted `url`, typically from the user.

不受信任的 `url`，通常来自用户。

`url` string which is safe to bind to the `src` properties such as `<img src>`, because
all of the dangerous javascript has been removed.

可以安全绑定到 `src` 属性的 `url` 字符串，例如 `<img src>`，因为所有危险的 javascript 都已删除。

A `url` sanitizer which converts untrusted `url` **string** into trusted string by removing
dangerous
content.

一种 `url` 清洁器，可通过删除危险内容将不受信任的 `url`**字符串**转换为受信任的字符串。

This method parses the `url` and locates potentially dangerous content \(such as javascript\) and
removes it.

此方法会解析 `url` 并定位具有潜在危险的内容（例如 javascript）并将其删除。

It is possible to mark a string as trusted by calling {&commat;link bypassSanitizationTrustUrl}.

可以通过调用 {&commat;link bypassSanitizationTrustUrl} 来将字符串标记为受信任。

`url` string which is safe to bind to the `src` properties such as `<img src>`, because
only trusted `url`s have been allowed to pass.

可以安全地绑定到 `src` 属性的 `url` 字符串，例如 `<img src>`，因为只有受信任的 `url`
被允许通过。

A `url` sanitizer which only lets trusted `url`s through.

一种 `url` 清洁器，仅允许受信任的 `url` 通过。

This passes only `url`s marked trusted by calling {&commat;link bypassSanitizationTrustResourceUrl}.

这仅通过调用 {&commat;link bypassSanitizationTrustResourceUrl} 来传递标记为受信任的 `url`。

untrusted `script`, typically from the user.

不受信任的 `script`，通常来自用户。

`url` string which is safe to bind to the `<script>` element such as `<img src>`,
because only trusted `scripts` have been allowed to pass.

可以安全绑定到 `<script>` 元素的 `url` 字符串，例如 `<img src>`，因为只有受信任的 `scripts`
被允许通过。

A `script` sanitizer which only lets trusted javascript through.

一种 `script` 清洁器，仅允许受信任的 javascript 通过。

This passes only `script`s marked trusted by calling {&commat;link bypassSanitizationTrustScript}.

这只会通过调用 {&commat;link bypassSanitizationTrustScript} 来传递标记为受信任的 `script`。

constant template literal containing trusted HTML.

包含受信任的 HTML 的常量模板文字。

TrustedHTML wrapping `html`.

TrustedHTML 包装 `html`。

A template tag function for promoting the associated constant literal to a
TrustedHTML. Interpolation is explicitly not allowed.

用于将关联的常量文字提升为 TrustedHTML 的模板标记函数。显式不允许插值。

constant template literal containing a trusted script URL.

包含受信任的脚本 URL 的常量模板文字。

TrustedScriptURL wrapping `url`.

TrustedScriptURL 包装 `url`。

A template tag function for promoting the associated constant literal to a
TrustedScriptURL. Interpolation is explicitly not allowed.

用于将关联的常量文字提升为 TrustedScriptURL 的模板标记函数。显式不允许插值。

Detects which sanitizer to use for URL property, based on tag name and prop name.

根据标签名称和道具名称检测要用于 URL 属性的清洁器。

The rules are based on the RESOURCE_URL context config from
`packages/compiler/src/schema/dom_security_schema.ts`.
If tag and prop names don't match Resource URL schema, use URL sanitizer.

这些规则基于 `packages/compiler/src/schema/dom_security_schema.ts` 中的 RESOURCE_URL
上下文配置。如果标记和道具名称与资源 URL 架构不匹配，请使用 URL sanitizer。

target element tag name.

目标元素标记名称。

name of the property that contains the value.

包含该值的属性的名称。

`url` string which is safe to bind.

可以安全绑定的 `url` 字符串。

Sanitizes URL, selecting sanitizer function based on tag and property names.

清理 URL，根据标签和属性名称选择 sanitizer 函数。

This function is used in case we can't define security context at compile time, when only prop
name is available. This happens when we generate host bindings for Directives/Components. The
host element is unknown at compile time, so we defer calculation of specific sanitizer to
runtime.

如果我们无法在编译时定义安全上下文，则可以用此函数，当时只有 prop
名称可用。当我们为指令/组件生成宿主绑定时，会发生这种情况。宿主元素在编译时是未知的，因此我们将特定清洁剂的计算推迟到运行时。