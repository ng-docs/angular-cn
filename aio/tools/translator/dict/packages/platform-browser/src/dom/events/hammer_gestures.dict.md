Supported HammerJS recognizer event names.

支持的 HammerJS 识别器事件名称。

DI token for providing [HammerJS](https://hammerjs.github.io/) support to Angular.

DI 令牌，用于为 [Angular 提供 HammerJS](https://hammerjs.github.io/)支持。

Function that loads HammerJS, returning a promise that is resolved once HammerJs is loaded.

加载 HammerJS 的函数，返回一个在 HammerJs 加载后解析的 Promise。

Injection token used to provide a {&commat;link HammerLoader} to Angular.

用于向 Angular 提供 {&commat;link HammerLoader} 的注入令牌。

An injectable [HammerJS Manager](https://hammerjs.github.io/api/#hammermanager)
for gesture recognition. Configures specific event recognition.

用于手势识别的可注入 [HammerJS
管理器](https://hammerjs.github.io/api/#hammermanager)。配置事件识别的选项。

A set of supported event names for gestures to be used in Angular.
Angular supports all built-in recognizers, as listed in
[HammerJS documentation](https://hammerjs.github.io/).

Angular 中所用的一组受支持的手势事件名。Angular 支持所有的内置识别器，如 [HammerJS
文档中](https://hammerjs.github.io/)所列。

Maps gesture event names to a set of configuration options
that specify overrides to the default values for specific properties.

将手势事件名映射到一组配置选项，这些配置选项用于覆盖特定属性的默认值。

The key is a supported event name to be configured,
and the options object contains a set of properties, with override values
to be applied to the named recognizer event.
For example, to disable recognition of the rotate event, specify
 `{"rotate": {"enable": false}}`.

键名是要配置的受支持事件名称，options
对象包含一组属性，以及将套用到命名识别器事件的替代值。比如，要禁用对 Rotate 事件的识别，请指定
`{"rotate": {"enable": false}}`。

Properties that are not present take the HammerJS default values.
For information about which properties are supported for which events,
and their allowed and default values, see
[HammerJS documentation](https://hammerjs.github.io/).

未提供的属性采用 HammerJS
默认值。有关哪些事件支持哪些属性以及它们的允许值和默认值的信息，请参见 [HammerJS
文档](https://hammerjs.github.io/)。

Properties whose default values can be overridden for a given event.
Different sets of properties apply to different events.
For information about which properties are supported for which events,
and their allowed and default values, see
[HammerJS documentation](https://hammerjs.github.io/).

用来为给定事件覆盖其默认值的属性。不同的属性集适用于不同的事件。有关哪些事件支持哪些属性以及它们的允许值和默认值的信息，请参见
[HammerJS 文档](https://hammerjs.github.io/)。

The element that will recognize gestures.

要识别手势的元素。

A HammerJS event-manager object.

一个 HammerJS 事件管理器对象。

Creates a [HammerJS Manager](https://hammerjs.github.io/api/#hammermanager)
and attaches it to a given HTML element.

创建一个 [HammerJS](https://hammerjs.github.io/api/#hammermanager) 管理器，并将其附加到给定的
HTML 元素。

Event plugin that adds Hammer support to an application.

向应用程序添加 Hammer 支持的事件插件。

Adds support for HammerJS.

添加了对 HammerJS 的支持。

Import this module at the root of your application so that Angular can work with
HammerJS to detect gesture events.

将此模块导入应用程序的根模块，以便 Angular 可以与 HammerJS 一起使用以检测手势事件。

Note that applications still need to include the HammerJS script itself. This module
simply sets up the coordination layer between HammerJS and Angular's EventManager.

请注意，应用程序仍需要包含 HammerJS 脚本本身。该模块只是在 HammerJS 和 Angular 的 EventManager
之间建立了一个协调层。