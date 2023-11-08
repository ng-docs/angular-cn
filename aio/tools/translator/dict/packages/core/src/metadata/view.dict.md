Example

例子

{&commat;example core/ts/metadata/encapsulation.ts region='longform'}



Defines the CSS styles encapsulation policies for the {&commat;link Component} decorator's
`encapsulation` option.

定义可用于 Component 的 {&commat;link Component} 的模板和样式封装选项。

See {&commat;link Component#encapsulation encapsulation}.

请参阅 {&commat;link Component#encapsulation encapsulation}。

Emulates a native Shadow DOM encapsulation behavior by adding a specific attribute to the
component's host element and applying the same attribute to all the CSS selectors provided
via {&commat;link Component#styles styles} or {&commat;link Component#styleUrls styleUrls}.

通过向宿主元素添加包含替代 ID 的属性并预处理通过 {&commat;link Component#styles styles} 或 {&commat;link
Component#styleUrls styleUrls} 提供的样式规则，来模拟 `Native` 所有选择器。

This is the default option.

这是默认选项。

Doesn't provide any sort of CSS style encapsulation, meaning that all the styles provided
via {&commat;link Component#styles styles} or {&commat;link Component#styleUrls styleUrls} are applicable
to any HTML element of the application regardless of their host Component.

不要提供任何模板或样式封装。

Uses the browser's native Shadow DOM API to encapsulate CSS styles, meaning that it creates
a ShadowRoot for the component's host element which is then used to encapsulate
all the Component's styling.

使用浏览器的原生 Shadow DOM API 来封装 CSS 样式，这意味着它会为组件的宿主元素创建一个
ShadowRoot，然后用该元素来封装所有组件的样式。