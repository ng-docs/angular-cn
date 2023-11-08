Marker interface for a value that's safe to use in a particular context.

标记界面，可在特定上下文中安全使用值。

Marker interface for a value that's safe to use as HTML.

标记界面，可安全用作 HTML 值。

Marker interface for a value that's safe to use as style \(CSS\).

标记界面，可安全用作样式（CSS）。

Marker interface for a value that's safe to use as JavaScript.

标记界面，可安全用作 JavaScript 的值。

Marker interface for a value that's safe to use as a URL linking to a document.

标记界面，用于安全地用作链接到文档的 URL 的值。

Marker interface for a value that's safe to use as a URL to load executable code from.

标记接口，用于安全地用作 URL 的值，以从中加载可执行代码。

`html` string which needs to be implicitly trusted.

需要隐式信任的 `html` 字符串。

a `html` which has been branded to be implicitly trusted.

已被标记为隐式信任的 `html`。

Mark `html` string as trusted.

将 `html` 字符串标记为受信任。

This function wraps the trusted string in `String` and brands it in a way which makes it
recognizable to {&commat;link htmlSanitizer} to be trusted implicitly.

此函数将受信任的字符串包装在 `String` 中，并以一种使 {&commat;link htmlSanitizer}
可识别为隐式信任的方式对它进行标记。

`style` string which needs to be implicitly trusted.

需要隐式信任的 `style` 字符串。

a `style` hich has been branded to be implicitly trusted.

一种被认为是隐式信任的 `style`。

Mark `style` string as trusted.

将 `style` 字符串标记为受信任。

This function wraps the trusted string in `String` and brands it in a way which makes it
recognizable to {&commat;link styleSanitizer} to be trusted implicitly.

此函数将受信任的字符串包装在 `String` 中，并以一种使 {&commat;link styleSanitizer}
可识别为隐式信任的方式对它进行标记。

`script` string which needs to be implicitly trusted.

需要隐式信任的 `script` 字符串。

a `script` which has been branded to be implicitly trusted.

已被标记为隐式信任的 `script`。

Mark `script` string as trusted.

将 `script` 字符串标记为受信任。

This function wraps the trusted string in `String` and brands it in a way which makes it
recognizable to {&commat;link scriptSanitizer} to be trusted implicitly.

此函数将受信任的字符串包装在 `String` 中，并以一种使 {&commat;link scriptSanitizer}
可识别为隐式信任的方式对它进行标记。

`url` string which needs to be implicitly trusted.

需要隐式信任的 `url` 字符串。

a `url`  which has been branded to be implicitly trusted.

已被标记为隐式信任的 `url`。

Mark `url` string as trusted.

将 `url` 字符串标记为受信任。

This function wraps the trusted string in `String` and brands it in a way which makes it
recognizable to {&commat;link urlSanitizer} to be trusted implicitly.

此函数将受信任的字符串包装在 `String` 中，并以一种使 {&commat;link urlSanitizer}
可识别为隐式信任的方式对它进行标记。

a `url` which has been branded to be implicitly trusted.

已被标记为隐式信任的 `url`。

This function wraps the trusted string in `String` and brands it in a way which makes it
recognizable to {&commat;link resourceUrlSanitizer} to be trusted implicitly.

此函数将受信任的字符串包装在 `String` 中，并以一种使 {&commat;link resourceUrlSanitizer}
可识别为隐式信任的方式对它进行标记。