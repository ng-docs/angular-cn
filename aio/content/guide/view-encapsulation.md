# View encapsulation

# 视图封装模式

In Angular, component CSS styles are encapsulated into the component's view and don't
affect the rest of the application.

在 Angular 中，组件的 CSS 样式被封装进了自己的视图中，而不会影响到应用程序的其它部分。

To control how this encapsulation happens on a _per
component_ basis, set the _view encapsulation mode_ in the component metadata.
Choose from the following modes:

通过在组件的元数据上设置*视图封装模式*，你可以分别控制*每个组件*的封装模式。
可选的封装模式一共有如下几种：

* `ShadowDom` view encapsulation uses the browser's built-in shadow DOM implementation (see
  [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM))
  to attach a shadow DOM to the component's host element, and then puts the component
  view inside that shadow DOM. The component's styles are included within the shadow DOM.

   `ShadowDom` 模式使用浏览器内置的 Shadow DOM 实现（参阅 [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)）来为组件的宿主元素附加一个 Shadow DOM。组件的视图被附加到这个 Shadow DOM 中，组件的样式也被包含在这个 Shadow DOM 中。(译注：不进不出，没有样式能进来，组件样式出不去。)

* `Emulated` view encapsulation (the default) emulates the behavior of shadow DOM by preprocessing
  (and renaming) the CSS code to effectively scope the CSS to the component's view.
  For details, see [Inspecting generated CSS](guide/view-encapsulation#inspect-generated-css).

   `Emulated` 模式（**默认值**）通过预处理（并改名）CSS 代码来模拟 Shadow DOM 的行为，以达到把 CSS 样式局限在组件视图中的目的。
  更多信息，见[附录 1](guide/view-encapsulation#inspect-generated-css)。(译注：只进不出，全局样式能进来，组件样式出不去)

* `None` means that Angular does no view encapsulation.
  Angular adds the CSS to the global styles.
  The scoping rules, isolations, and protections discussed earlier don't apply.
  This mode is essentially the same as pasting the component's styles into the HTML.

   `None` 意味着 Angular 不使用视图封装。
  Angular 会把 CSS 添加到全局样式中。而不会应用上前面讨论过的那些作用域规则、隔离和保护等。
  从本质上来说，这跟把组件的样式直接放进 HTML 是一样的。(译注：能进能出。)

To set the component's encapsulation mode, use the `encapsulation` property in the component metadata:

通过组件元数据中的 `encapsulation` 属性来设置组件封装模式：

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.shadow" header="src/app/quest-summary.component.ts"></code-example>

`ShadowDom` view encapsulation only works on browsers that have built-in support
for shadow DOM (see [Can I use - Shadow DOM v1](https://caniuse.com/shadowdomv1)).
The support is still limited, which is why `Emulated` view encapsulation is the default mode and recommended in most cases.

`ShadowDom` 模式只适用于提供了原生 Shadow DOM 支持的浏览器（参阅 [Can I use](https://caniuse.com/) 上的 [Shadow DOM v1](https://caniuse.com/shadowdomv1) 部分）。
它仍然受到很多限制，这就是为什么仿真 (`Emulated`) 模式是默认选项，并建议将其用于大多数情况。

{@a inspect-generated-css}

## Inspecting generated CSS

## 查看生成的 CSS

When using emulated view encapsulation, Angular preprocesses
all component styles so that they approximate the standard shadow CSS scoping rules.

当使用默认的仿真模式时，Angular 会对组件的所有样式进行预处理，让它们模仿出标准的 Shadow CSS 作用域规则。

In the DOM of a running Angular application with emulated view
encapsulation enabled, each DOM element has some extra attributes
attached to it:

在启用了仿真模式的 Angular 应用的 DOM 树中，每个 DOM 元素都被加上了一些额外的属性。

<code-example format="">
&lt;hero-details _nghost-pmm-5>
  &lt;h2 _ngcontent-pmm-5>Mister Fantastic&lt;/h2>
  &lt;hero-team _ngcontent-pmm-5 _nghost-pmm-6>
    &lt;h3 _ngcontent-pmm-6>Team&lt;/h3>
  &lt;/hero-team>
&lt;/hero-detail>
</code-example>

There are two kinds of generated attributes:

生成出的属性分为两种：

* An element that would be a shadow DOM host in native encapsulation has a
  generated `_nghost` attribute. This is typically the case for component host elements.

   一个元素在原生封装方式下可能是 Shadow DOM 的宿主，在这里被自动添加上一个 `_nghost` 属性。
  这是组件宿主元素的典型情况。

* An element within a component's view has a `_ngcontent` attribute
that identifies to which host's emulated shadow DOM this element belongs.

   组件视图中的每一个元素，都有一个 `_ngcontent` 属性，它会标记出该元素属于哪个宿主的模拟 Shadow DOM。

The exact values of these attributes aren't important. They are automatically
generated and you should never refer to them in application code. But they are targeted
by the generated component styles, which are in the `<head>` section of the DOM:

这些属性的具体值并不重要。它们是自动生成的，并且你永远不会在程序代码中直接引用到它们。
但它们会作为生成的组件样式的目标，就像 DOM 的 `<head>` 中一样：

<code-example format="">
[_nghost-pmm-5] {
  display: block;
  border: 1px solid black;
}

h3[_ngcontent-pmm-6] {
  background-color: white;
  border: 1px solid #777;
}
</code-example>

These styles are post-processed so that each selector is augmented
with `_nghost` or `_ngcontent` attribute selectors.
These extra selectors enable the scoping rules described in this page.

这些就是那些样式被处理后的结果，每个选择器都被增加了 `_nghost` 或 `_ngcontent` 属性选择器。
这些额外的选择器实现了本文所描述的这些作用域规则。

## Mixing encapsulation modes

## 混用封装模式

Avoid mixing components that use different view encapsulation. Where it is necessary, you should be aware of how the component styles will interact.

避免混合使用不同视图封装模式的组件。在必要时，你应该仔细想想组件样式之间将如何互动。

- The styles of components with `ViewEncapsulation.Emulated` are added to the `<head>` of the document, making them available throughout the application, but are "scoped" so they only affect elements within the component's template.

  带有 `ViewEncapsulation.Emulated` 的组件的样式被添加到文档的 `<head>` 中，使它们在整个应用程序中可用，但它们是“范围化”的，因此它们只影响本组件模板中的元素。

- The styles of components with `ViewEncapsulation.None` are added to the `<head>` of the document, making them available throughout the application, and are not "scoped" so they can affect any element in the application.

  带有 `ViewEncapsulation.None` 的组件样式被添加到文档的 `<head>` 中，使它们在整个应用程序中可用，并且没有“范围化”，因此它们可以影响应用程序中的任何元素。

- The styles of components with `ViewEncapsulation.ShadowDom` are only added to the shadow DOM host, ensuring that they only affect elements within the component's template.

  带有 `ViewEncapsulation.ShadowDom` 的组件样式仅添加到 shadow DOM 宿主元素中，这会确保它们仅影响组件模板中的元素。

**All the styles for `ViewEncapsulation.Emulated` and `ViewEncapsulation.None` components are also added to the shadow DOM host of each `ViewEncapsulation.ShadowDom` component.**

**`ViewEncapsulation.Emulated` 和 `ViewEncapsulation.None` 组件的所有样式也会添加到每个 `ViewEncapsulation.ShadowDom` 组件的 shadow DOM 宿主元素中。**

The result is that styling for components with `ViewEncapsulation.None` will affect matching elements within the shadow DOM.

其结果是使用 `ViewEncapsulation.None` 的组件样式将影响 shadow DOM 中的那些可匹配元素。

This approach may seem counter-intuitive at first, but without it a component with `ViewEncapsulation.None` could not be used within a component with `ViewEncapsulation.ShadowDom`, since its styles would not be available.

这种方法乍一看有点反直觉，但如果没有它，带有 `ViewEncapsulation.None` 的组件将无法在带有 `ViewEncapsulation.ShadowDom` 的组件中生效，因为其样式将不可用。

### Examples

### 例子

This section shows examples of how the styling of components with different `ViewEncapsulation` interact.

本节展示了一些具有不同 `ViewEncapsulation` 的组件样式如何互动的例子。

See the <live-example noDownload></live-example> to try out these components yourself.

请参阅<live-example noDownload></live-example>来自行试用这些组件。

#### No encapsulation

#### 无封装

The first example shows a component that has `ViewEncapsulation.None`. This component colors its template elements red.

第一个例子展示了一个具有 `ViewEncapsulation.None` 的组件。此组件将其模板中的元素染为红色。

<code-example path="view-encapsulation/src/app/no-encapsulation.component.ts" header="src/app/no-encapsulation.component.ts"></code-example>>

Angular adds the styles for this component as global styles to the `<head>` of the document.

Angular 会将此组件的样式作为全局样式添加到文档的 `<head>` 中。

**Angular also adds the styles to all shadow DOM hosts.** Therefore, the styles are available throughout the application.

**Angular 还会将这些样式添加到所有 shadow DOM 宿主元素中。**因此，这些样式在整个应用程序中都是可用的。

<img src="generated/images/guide/view-encapsulation/no-encapsulation.png" alt="component with no encapsulation">

#### Emulated encapsulation

#### 模拟封装

The second example shows a component that has `ViewEncapsulation.Emulated`. This component colors its template elements green.

第二个例子展示了一个具有 `ViewEncapsulation.Emulated` 的组件。此组件将其模板元素染为绿色。

<code-example path="view-encapsulation/src/app/emulated-encapsulation.component.ts" header="src/app/emulated-encapsulation.component.ts"></code-example>>

Similar to `ViewEncapsulation.None`, Angular adds the styles for this component to the `<head>` of the document, and to all the shadow DOM hosts.
But in this case, the styles are "scoped" by the attributes described in ["Inspecting generated CSS"](#inspecting-generated-css).

与 `ViewEncapsulation.None` 类似，Angular 会将此组件的样式添加到文档的 `<head>` 以及所有 shadow DOM 宿主元素中。但在这里，这些样式被[“检查生成的 CSS”](#inspecting-generated-css) 中所讲的属性“范围化”了。

Therefore, only the elements directly within this component's template will match its styles.
Since the "scoped" styles from the `EmulatedEncapsulationComponent` are very specific, they override the global styles from the `NoEncapsulationComponent`.

因此，只有直接在该组件模板中的元素才会匹配其样式。由于来自 `EmulatedEncapsulationComponent` 的样式更具特异性，因此它们会覆盖来自 `NoEncapsulationComponent` 的全局样式。

In this example, the `EmulatedEncapsulationComponent` contains a `NoEncapsulationComponent`.
The `NoEncapsulationComponent` is styled as expected because the scoped styles do not match elements in its template.

在此例子中，`EmulatedEncapsulationComponent` 包含 `NoEncapsulationComponent` 。
`NoEncapsulationComponent` 会按预期般设置样式，因为这些范围化样式与其模板中的元素不匹配。

<img src="generated/images/guide/view-encapsulation/emulated-encapsulation.png" alt="component with no encapsulation">

#### Shadow DOM encapsulation

#### Shadow DOM 封装

The third example shows a component that has `ViewEncapsulation.ShadowDom`. This component colors its template elements blue.

第三个例子展示了一个具有 `ViewEncapsulation.ShadowDom` 的组件。此组件将其模板元素染为蓝色。

<code-example path="view-encapsulation/src/app/shadow-dom-encapsulation.component.ts" header="src/app/shadow-dom-encapsulation.component.ts"></code-example>>

Angular adds styles for this component only to the shadow DOM host, so they are not visible outside the shadow DOM.

Angular 仅将此组件的样式添加到 shadow DOM 宿主元素中，因此它们在 shadow DOM 之外是不可见的。

Note that Angular also adds the global styles from the `NoEncapsulationComponent` and `ViewEncapsulationComponent` to the shadow DOM host, so those styles are still available to the elements in the template of this component.

请注意，Angular 还将 `NoEncapsulationComponent` 和 `ViewEncapsulationComponent` 的全局样式添加到了 shadow DOM 宿主元素中，因此这些样式仍然可用于该组件模板中的元素。

In this example, the `ShadowDomEncapsulationComponent` contains both a `NoEncapsulationComponent` and `ViewEncapsulationComponent`.

在此例子中， `ShadowDomEncapsulationComponent` 包含着 `NoEncapsulationComponent` 和 `ViewEncapsulationComponent` 。

The styles added by the `ShadowDomEncapsulationComponent` component are available throughout the shadow DOM of this component, and so to both the `NoEncapsulationComponent` and `ViewEncapsulationComponent`.

`ShadowDomEncapsulationComponent` 组件添加的样式在该组件的整个 shadow DOM 中都可用，`NoEncapsulationComponent` 和 `ViewEncapsulationComponent` 也是如此。

The `EmulatedEncapsulationComponent` has specific "scoped" styles, so the styling of this component's template is unaffected.

`EmulatedEncapsulationComponent` 具有特定的“范围化”样式，因此该组件模板的样式不受影响。

But since styles from `ShadowDomEncapsulationComponent` are added to the shadow host after the global styles, the `h2` style overrides the style from the `NoEncapsulationComponent`.
The result is that the `<h2>` element in the `NoEncapsulationComponent` is colored blue rather than red, which may not be what the component author intended.

但是由于 `ShadowDomEncapsulationComponent` 中的样式是在全局样式之后添加到 Shadow DOM 宿主中的，因此 `h2` 样式会覆盖 `NoEncapsulationComponent` 中的样式。结果是 `NoEncapsulationComponent` 中的 `<h2>` 元素被染为蓝色而不是红色，这可能不符合组件作者的意图。

<img src="generated/images/guide/view-encapsulation/shadow-dom-encapsulation.png" alt="component with no encapsulation">
