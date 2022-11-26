# View encapsulation

# 视图封装

In Angular, a component's styles can be encapsulated within the component's host element so that they don't affect the rest of the application.

在 Angular 中，组件的样式可以封装在组件的宿主元素中，这样它们就不会影响应用程序的其余部分。

The `Component` decorator provides the [`encapsulation`](api/core/Component#encapsulation) option which can be used to control how the encapsulation is applied on a *per component* basis.

`Component` 的装饰器提供了 [`encapsulation`](api/core/Component#encapsulation) 选项，可用来控制如何基于*每个组件*应用视图封装。

Choose from the following modes:

从以下模式中选择：

<!-- vale off -->

| Modes | Details |
| :---- | :------ |
| 模式 | 详情 |
| `ViewEncapsulation.ShadowDom` | Angular uses the browser's built-in [Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Shadow_DOM) to enclose the component's view inside a ShadowRoot, used as the component's host element, and apply the provided styles in an isolated manner. <div class="alert is-important"> `ViewEncapsulation.ShadowDom` only works on browsers that have built-in support for the shadow DOM (see [Can I use - Shadow DOM v1](https://caniuse.com/shadowdomv1)). Not all browsers support it, which is why the `ViewEncapsulation.Emulated` is the recommended and default mode. </div> |
| `ViewEncapsulation.ShadowDom` | Angular 使用浏览器内置的 [Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Shadow_DOM) 将组件的视图包含在 ShadowRoot（用作组件的宿主元素）中，并以隔离的方式应用所提供的样式。<div class="alert is-important"> `ViewEncapsulation.ShadowDom` 仅适用于内置支持 shadow DOM 的浏览器（请参阅 [Can I use - Shadow DOM v1](https://caniuse.com/shadowdomv1)）。并非所有浏览器都支持它，这就是为什么 `ViewEncapsulation.Emulated` 是推荐和默认模式的原因。</div> |
| `ViewEncapsulation.Emulated` | Angular modifies the component's CSS selectors so that they are only applied to the component's view and do not affect other elements in the application, *emulating* Shadow DOM behavior. For more details, see [Inspecting generated CSS](guide/view-encapsulation#inspect-generated-css). |
| `ViewEncapsulation.Emulated` | Angular 会修改组件的 CSS 选择器，使它们只应用于组件的视图，不影响应用程序中的其他元素（*模拟 *Shadow DOM 行为）。有关更多详细信息，请参阅[查看生成的 CSS](guide/view-encapsulation#inspect-generated-css)。 |
| `ViewEncapsulation.None` | Angular does not apply any sort of view encapsulation meaning that any styles specified for the component are actually globally applied and can affect any HTML element present within the application. This mode is essentially the same as including the styles into the HTML itself. |
| `ViewEncapsulation.None` | Angular 不应用任何形式的视图封装，这意味着为组件指定的任何样式实际上都是全局应用的，并且可以影响应用程序中存在的任何 HTML 元素。这种模式本质上与将样式包含在 HTML 本身中是一样的。 |

<a id="inspect-generated-css"></a>

## Inspecting generated CSS

## 查看生成的 CSS

<!-- vale on -->

When using the emulated view encapsulation, Angular pre-processes all the component's styles so that they are only applied to the component's view.

使用模拟视图封装时，Angular 会预处理所有组件的样式，以便它们仅应用于组件的视图。

In the DOM of a running Angular application, elements belonging to components using emulated view encapsulation have some extra attributes attached to them:

在正运行的 Angular 应用程序的 DOM 中，使用模拟视图封装模式的组件所在的元素附加了一些额外的属性：

<code-example language="html">

&lt;hero-details _nghost-pmm-5&gt;
  &lt;h2 _ngcontent-pmm-5&gt;Mister Fantastic&lt;/h2&gt;
  &lt;hero-team &lowbar;ngcontent-pmm-5 &lowbar;nghost-pmm-6&gt;
    &lt;h3 _ngcontent-pmm-6&gt;Team&lt;/h3&gt;
  &lt;/hero-team&gt;
&lt;/hero-details&gt;

</code-example>

Two kinds of these attributes exist:

有两种这样的属性：

| Attributes | Details |
| :--------- | :------ |
| 属性 | 详情 |
| `_nghost` | Are added to elements that enclose a component's view and that would be ShadowRoots in a native Shadow DOM encapsulation. This is typically the case for components' host elements. |
| `_nghost` | 被添加到包裹组件视图的元素中，这将是本机 Shadow DOM 封装中的 ShadowRoots。组件的宿主元素通常就是这种情况。 |
| `_ngcontent` | Are added to child element within a component's view, those are used to match the elements with their respective emulated ShadowRoots (host elements with a matching `_nghost` attribute). |
| `_ngcontent` | 被添加到组件视图中的子元素上，这些属性用于将元素与其各自模拟的 ShadowRoots（具有匹配 `_nghost` 属性的宿主元素）相匹配。 |

The exact values of these attributes are a private implementation detail of Angular.
They are automatically created and you should never refer to them in application code.

这些属性的确切值是 Angular 的私有实现细节。它们是自动生成的，你不应在应用程序代码中引用它们。

They are targeted by the created component styles, which are injected in the `<head>` section of the DOM:

它们以生成的组件样式为目标，这些样式会被注入到 DOM 的 `<head>` 部分：

<code-example format="css" language="css">

[_nghost-pmm-5] {
  display: block;
  border: 1px solid black;
}
h3[_ngcontent-pmm-6] {
  background-color: white;
  border: 1px solid #777;
}

</code-example>

These styles are post-processed so that each CSS selector is augmented with the appropriate `_nghost` or `_ngcontent` attribute.
These modified selectors make sure the styles to be applied to components' views in an isolated and targeted fashion.

这些样式经过后期处理，以便每个 CSS 选择器都使用适当的 `_nghost` 或 `_ngcontent` 属性进行扩充。这些修改后的选择器可以确保样式以隔离和有针对性的方式应用于组件的视图。

## Mixing encapsulation modes

## 混合封装模式

As mentioned earlier, you specify the encapsulation mode in the Component's decorator on a *per component* basis. This means that within your application you can have different components using different encapsulation strategies.

如前所述，你可以在组件的装饰器中针对*每个组件*指定封装模式，这意味着在你的应用程序中，不同的组件可以使用不同的封装策略。

Although possible, this is not recommended.
If it is really needed, you should be aware of how the styles of components using different encapsulation modes interact with each other:

尽管可能，但不建议这样做。如果真的需要，你应该知道使用不同封装模式的组件的样式会如何彼此交互：

| Modes | Details |
| :---- | :------ |
| 模式 | 详情 |
| `ViewEncapsulation.Emulated` | The styles of components are added to the `<head>` of the document, making them available throughout the application, but their selectors only affect elements within their respective components' templates. |
| `ViewEncapsulation.Emulated` | 组件的样式会添加到文档的 `<head>` 中，使它们在整个应用程序中可用，但它们的选择器只会影响它们各自组件模板中的元素。 |
| `ViewEncapsulation.None` | The styles of components are added to the `<head>` of the document, making them available throughout the application, so are completely global and affect any matching elements within the document. |
| `ViewEncapsulation.None` | 组件的样式会添加到文档的 `<head>` 中，使它们在整个应用程序中可用，因此是完全全局的，会影响文档中的任何匹配元素。 |
| `ViewEncapsulation.ShadowDom` | The styles of components are only added to the shadow DOM host, ensuring that they only affect elements within their respective components' views. |
| `ViewEncapsulation.ShadowDom` | 组件样式仅添加到 shadow DOM 宿主中，确保它们仅影响各自组件视图中的元素。 |

<div class="alert is-helpful">

Styles of `ViewEncapsulation.Emulated` and `ViewEncapsulation.None` components are also added to the shadow DOM host of each `ViewEncapsulation.ShadowDom` component.

`ViewEncapsulation.Emulated` 和 `ViewEncapsulation.None` 组件的样式也会添加到每个 `ViewEncapsulation.ShadowDom` 组件的 shadow DOM 宿主中。

This means that styles for components with `ViewEncapsulation.None` affect matching elements within the shadow DOM.

这意味着带有 `ViewEncapsulation.None` 的组件的样式将影响 shadow DOM 中的匹配元素。

This approach may seem counter-intuitive at first. But without it a component with `ViewEncapsulation.None` would be rendered differently within a component using `ViewEncapsulation.ShadowDom`, since its styles would not be available.

这种方法乍一看似乎有违直觉，但如果没有它，带有 `ViewEncapsulation.None` 的组件将在使用 `ViewEncapsulation.ShadowDom` 的组件内呈现不同的效果，因为其样式将不可用。

</div>

### Examples

### 例子

This section shows examples of how the styling of components with different `ViewEncapsulation` interact.

本节展示了具有不同 `ViewEncapsulation` 的组件的样式如何交互的示例。

See the <live-example noDownload></live-example> to try out these components yourself.

请参阅 <live-example noDownload></live-example> 以自己尝试这些组件。

#### No encapsulation

#### 无封装

The first example shows a component that has `ViewEncapsulation.None`.
This component colors its template elements red.

第一个示例显示了一个具有 `ViewEncapsulation.None` 的组件。此组件将其模板元素着色为红色。

<code-example header="src/app/no-encapsulation.component.ts" path="view-encapsulation/src/app/no-encapsulation.component.ts"></code-example>

Angular adds the styles for this component as global styles to the `<head>` of the document.

Angular 将此组件的样式作为全局样式添加到文档的 `<head>` 中。

As already mentioned, Angular also adds the styles to all shadow DOM hosts, making the styles available throughout the whole application.

如前所述，Angular 还会将这些样式添加到所有 shadow DOM 宿主。因此，样式在整个应用程序中都可用。

<div class="lightbox">

<img alt="component with no encapsulation" src="generated/images/guide/view-encapsulation/no-encapsulation.png">

</div>

#### Emulated encapsulation

#### 模拟封装

The second example shows a component that has `ViewEncapsulation.Emulated`.
This component colors its template elements green.

第二个示例显示了一个具有 `ViewEncapsulation.Emulated` 的组件。此组件将其模板元素着色为绿色。

<code-example header="src/app/emulated-encapsulation.component.ts" path="view-encapsulation/src/app/emulated-encapsulation.component.ts"></code-example>

Comparable to `ViewEncapsulation.None`, Angular adds the styles for this component to the `<head>` of the document, but with "scoped" styles.

与 `ViewEncapsulation.None` 类似，Angular 会将此组件的样式添加到文档的 `<head>` 中，但它们是带有“作用域”的样式。

Only the elements directly within this component's template are going to match its styles.
Since the "scoped" styles from the `EmulatedEncapsulationComponent` are specific, they override the global styles from the `NoEncapsulationComponent`.

只有直接在该组件模板中的元素才会匹配其样式。由于来自 `EmulatedEncapsulationComponent` 的样式是特化的，因此它们会覆盖来自 `NoEncapsulationComponent` 的全局样式。

In this example, the `EmulatedEncapsulationComponent` contains a `NoEncapsulationComponent`, but `NoEncapsulationComponent` is still styled as expected since the `EmulatedEncapsulationComponent` 's "scoped" styles do not match elements in its template.

在此示例中，`EmulatedEncapsulationComponent` 包含着 `NoEncapsulationComponent`，但 `NoEncapsulationComponent` 仍然如预期般生效了，因为 `EmulatedEncapsulationComponent` 的“范围化”样式与其模板中的元素并不匹配。

<div class="lightbox">

<img alt="component with no encapsulation" src="generated/images/guide/view-encapsulation/emulated-encapsulation.png">

</div>

#### Shadow DOM encapsulation

#### Shadow DOM 封装

The third example shows a component that has `ViewEncapsulation.ShadowDom`.
This component colors its template elements blue.

第三个示例显示了一个具有 `ViewEncapsulation.ShadowDom` 的组件。此组件会将其模板元素着色为蓝色。

<code-example header="src/app/shadow-dom-encapsulation.component.ts" path="view-encapsulation/src/app/shadow-dom-encapsulation.component.ts"></code-example>

Angular adds styles for this component only to the shadow DOM host, so they are not visible outside the shadow DOM.

Angular 仅将此组件的样式添加到 shadow DOM 宿主，因此它们在 shadow DOM 之外是不可见的。

<div class="alert is-helpful">

**NOTE**: <br />
Angular also adds the global styles from the `NoEncapsulationComponent` and `EmulatedEncapsulationComponent` to the shadow DOM host. Those styles are still available to the elements in the template of this component.

**注意**：<br />
Angular 还将 `NoEncapsulationComponent` 和 `EmulatedEncapsulationComponent` 的全局样式添加到了 shadow DOM 宿主中，因此这些样式仍然可用于该组件的模板中的元素。

</div>

In this example, the `ShadowDomEncapsulationComponent` contains both a `NoEncapsulationComponent` and `EmulatedEncapsulationComponent`.

在这个例子中，`ShadowDomEncapsulationComponent` 包含一个 `NoEncapsulationComponent` 和 `EmulatedEncapsulationComponent`。

The styles added by the `ShadowDomEncapsulationComponent` component are available throughout the shadow DOM of this component, and so to both the `NoEncapsulationComponent` and `EmulatedEncapsulationComponent`.

`ShadowDomEncapsulationComponent` 组件添加的样式在该组件的整个 shadow DOM 中都可用，在 `NoEncapsulationComponent` 和 `EmulatedEncapsulationComponent` 中也是如此。

The `EmulatedEncapsulationComponent` has specific "scoped" styles, so the styling of this component's template is unaffected.

`EmulatedEncapsulationComponent` 具有特化的“范围化”样式，因此该组件模板的样式不受影响。

Since styles from `ShadowDomEncapsulationComponent` are added to the shadow host after the global styles, the `h2` style overrides the style from the `NoEncapsulationComponent`.
The result is that the `<h2>` element in the `NoEncapsulationComponent` is colored blue rather than red, which may not be what the component's author intended.

由于 `ShadowDomEncapsulationComponent` 中的样式是在全局样式之后添加到 Shadow Host 中的，因此 `h2` 样式会覆盖 `NoEncapsulationComponent` 中的样式。结果是 `NoEncapsulationComponent` 中的 `<h2>` 元素被着色为蓝色而不是红色，这可能不是组件作者的本意。

<div class="lightbox">

<img alt="component with no encapsulation" src="generated/images/guide/view-encapsulation/shadow-dom-encapsulation.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28