Used by `RendererFactory2` to associate custom rendering data and styles
with a rendering implementation.

供 `RendererFactory2` 用于将自定义渲染数据和样式与某个渲染器的实现相关联。

A unique identifying string for the new renderer, used when creating
unique styles for encapsulation.

创建新的封装样式时使用的新渲染器的唯一标识字符串。

The view encapsulation type, which determines how styles are applied to
DOM elements. One of

视图封装类型，它确定如何将样式应用于 DOM 元素。为下列值之一

`Emulated` \(default\): Emulate native scoping of styles.

`Emulated`（默认）：模拟样式的原生作用域。

`Native`: Use the native encapsulation mechanism of the renderer.

`Native`：使用渲染器的原生封装机制。

`ShadowDom`: Use modern [Shadow
  DOM](https://w3c.github.io/webcomponents/spec/shadow/) and
  create a ShadowRoot for component's host element.

`ShadowDom`：使用现代[Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/)并为组件的宿主元素创建一个 ShadowRoot。

`None`: Do not provide any template or style encapsulation.

`None`：不提供任何模板或样式封装。

Defines CSS styles to be stored on a renderer instance.

定义要存储在渲染器实例上的 CSS 样式。

Defines arbitrary developer-defined data to be stored on a renderer instance.
This is useful for renderers that delegate to other renderers.

定义要存储在渲染器实例上的任意由开发人员定义的数据。这对于要委托其他渲染器实现的渲染器很有用。

Flags for renderer-specific style modifiers.

渲染器特有样式修饰符的标志。

Marks a style as important.

将样式标记为重要。

Marks a style as using dash case naming \(this-is-dash-case\).

将样式标记为使用中线命名法（this-is-dash-case）。