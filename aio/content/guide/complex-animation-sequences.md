# Complex animation sequences

# 复杂动画序列

## Prerequisites

## 先决条件

A basic understanding of the following concepts:

对下列概念有基本的理解：

* [Introduction to Angular animations](guide/animations)

  [Angular 动画简介](guide/animations)

* [Transition and triggers](guide/transition-and-triggers)

  [转场与触发器](guide/transition-and-triggers)

So far, we've learned simple animations of single HTML elements.
Angular also lets you animate coordinated sequences, such as an entire grid or list of elements as they enter and leave a page.
You can choose to run multiple animations in parallel, or run discrete animations sequentially, one following another.

到目前为止，我们已经学过了单个 HTML 元素的简单动画。Angular 还允许你在进入和离开页面时播放 "动画协调序列"，比如当整个网格或元素列表进入或离开页面时，多个条目的动画之间需要彼此协调时间。你可以选择并行执行多个动画，或者按顺序逐个运行离散动画。

The functions that control complex animation sequences are:

用来控制复杂动画序列的函数如下：

| Functions | Details |
| :-------- | :------ |
| 函数 | 详情 |
| `query()` | Finds one or more inner HTML elements. |
| `stagger()` | Applies a cascading delay to animations for multiple elements. |
| [`group()`](api/animations/group) | Runs multiple animation steps in parallel. |
| `sequence()` | Runs animation steps one after another. |

<a id="complex-sequence"></a>

## The query() function

Most complex animations rely on the `query()` function to find child elements and apply animations to them, basic examples of such are:

| Examples | Details |
| :------- | :------ |
| 例子 | 详情 |
| `query()` followed by `animate()` | Used to query simple HTML elements and directly apply animations to them. |
| `query()` followed by `animateChild()` | Used to query child elements, which themselves have animations metadata applied to them and trigger such animation (which would be otherwise be blocked by the current/parent element's animation). |

The first argument of `query()` is a [css selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) string which can also contain the following Angular-specific tokens:

| Tokens | Details |
| :----- | :------ |
| Tokens | 详情 |
| `:enter` <br /> `:leave` | For entering/leaving elements. |
| `:animating` | For elements currently animating. |
| `@*` <br /> `@triggerName` | For elements with any—or a specific—trigger. |
| `:self` | The animating element itself. |

<div class="callout is-helpful">

<header>Entering and Leaving Elements</header>

Not all child elements are actually considered as entering/leaving; this can, at times, be counterintuitive and confusing. Please see the [query api docs](api/animations/query#entering-and-leaving-elements) for more information.

You can also see an illustration of this in the animations live example (introduced in the animations [introduction section](guide/animations#about-this-guide)) under the Querying tab.

</div>

## Animate multiple elements using query() and stagger() functions

## 使用 `query()` 和 `stagger()`（交错）函数执行多元素动画

After having queried child elements via `query()`, the `stagger()` function lets you define a timing gap between each queried item that is animated and thus animates elements with a delay between them.

The following example demonstrates how to use the `query()` and `stagger()` functions to animate a list (of heroes) adding each in sequence, with a slight delay, from top to bottom.

下面的例子演示了如何使用 `query()` 和 `stagger()` 函数对依次添加的英雄列表从上到下播放动画（有少许延迟）。

* Use `query()` to look for an element entering the page that meets certain criteria

  用 `query()` 查阅正在进入或离开页面的任意元素。该查询会找出那些符合某种匹配 CSS 选择器的元素。

* For each of these elements, use `style()` to set the same initial style for the element.
  Make it transparent and use `transform` to move it out of position so that it can slide into place.

  对每个元素，使用 `style()` 为其设置初始样式。使其变得透明，并使用 `transform` 将其移出位置，以便它能滑入后就位。

* Use `stagger()` to delay each animation by 30 milliseconds

  使用 `stagger()` 来在每个动画之间延迟 30 毫秒。

* Animate each element on screen for 0.5 seconds using a custom-defined easing curve, simultaneously fading it in and un-transforming it

  对屏幕上的每个元素，根据一条自定义缓动曲线播放 0.5 秒的动画，同时将其淡入，而且逐步取消以前的位移效果。

<code-example header="src/app/hero-list-page.component.ts" path="animations/src/app/hero-list-page.component.ts" region="page-animations"></code-example>

## Parallel animation using group() function

## 使用 `group()` 函数播放并行动画

You've seen how to add a delay between each successive animation.
But you might also want to configure animations that happen in parallel.
For example, you might want to animate two CSS properties of the same element but use a different `easing` function for each one.
For this, you can use the animation [`group()`](api/animations/group) function.

<div class="alert is-helpful">

**NOTE**: <br />
The [`group()`](api/animations/group) function is used to group animation *steps*, rather than animated elements.

</div>

The following example uses [`group()`](api/animations/group)s on both `:enter` and `:leave` for two different timing configurations, thus applying two independent animations to the same element in parallel.

<code-example header="src/app/hero-list-groups.component.ts (excerpt)" path="animations/src/app/hero-list-groups.component.ts" region="animationdef"></code-example>

## Sequential vs. parallel animations

## 顺序动画与平行动画

Complex animations can have many things happening at once.
But what if you want to create an animation involving several animations happening one after the other? Earlier you used [`group()`](api/animations/group) to run multiple animations all at the same time, in parallel.

A second function called `sequence()` lets you run those same animations one after the other.
Within `sequence()`, the animation steps consist of either `style()` or `animate()` function calls.

第二个名叫 `sequence()` 的函数会让你一个接一个地运行这些动画。在 `sequence()` 中，这些动画步骤由 `style()` 或 `animate()` 的函数调用组成。

* Use `style()` to apply the provided styling data immediately.

  `style()` 用来立即应用所指定的样式数据。

* Use `animate()` to apply styling data over a given time interval.

  `animate()` 用来在一定的时间间隔内应用样式数据。

## Filter animation example

## 过滤器动画范例

Take a look at another animation on the live example page.
Under the Filter/Stagger tab, enter some text into the **Search Heroes** text box, such as `Magnet` or `tornado`.

来看看范例应用中的另一个动画。在 Filter/Stagger 页，往 **Search Heroes** 文本框中输入一些文本，比如 `Magnet` 或 `tornado`。

The filter works in real time as you type.
Elements leave the page as you type each new letter and the filter gets progressively stricter.
The heroes list gradually re-enters the page as you delete each letter in the filter box.

过滤器会在你输入时实时工作。每当你键入一个新字母时，就会有一些元素离开页面，并且过滤条件也会逐渐变得更加严格。相反，当你删除过滤器中的每个字母时，英雄列表也会逐渐重新进入页面中。

The HTML template contains a trigger called `filterAnimation`.

HTML 模板中包含一个名叫 `filterAnimation` 的触发器。

<code-example header="src/app/hero-list-page.component.html" path="animations/src/app/hero-list-page.component.html" region="filter-animations"></code-example>

The `filterAnimation` in the component's decorator contains three transitions.

该组件装饰器中的 `filterAnimation` 包含三个转场。

<code-example header="src/app/hero-list-page.component.ts" path="animations/src/app/hero-list-page.component.ts" region="filter-animations"></code-example>

The code in this example performs the following tasks:

这个例子中的代码包含下列任务：

* Skips animations when the user first opens or navigates to this page (the filter animation narrows what is already there, so it only works on elements that already exist in the DOM)

  当用户首次打开或导航到此页面时，跳过所有动画（该动画会压扁已经存在的内容，因此它只会作用于那些已经存在于 DOM 中的元素）。

* Filters heroes based on the search input's value

  根据搜索框中的值过滤英雄。

For each change:

对于每次匹配：

* Hides an element leaving the DOM by setting its opacity and width to 0

  通过将元素的不透明度和宽度设置为 0 来隐藏正在离开 DOM 的元素。

* Animates an element entering the DOM over 300 milliseconds.
  During the animation, the element assumes its default width and opacity.

  对正在进入 DOM 的元素，播放一个 300 毫秒的动画。在动画期间，该元素采用其默认宽度和不透明度。

* If there are multiple elements entering or leaving the DOM, staggers each animation starting at the top of the page, with a 50-millisecond delay between each element

  如果有多个匹配的元素正在进入或离开 DOM，则从页面顶部的元素开始对每个元素进行交错（stagger），每个元素之间的延迟为 50 毫秒。

## Animating the items of a reordering list

Although Angular animates correctly `*ngFor` list items out of the box, it will not be able to do so if their ordering changes.
This is because it will lose track of which element is which, resulting in broken animations.
The only way to help Angular keep track of such elements is by assigning a `TrackByFunction` to the `NgForOf` directive.
This makes sure that Angular always knows which element is which, thus allowing it to apply the correct animations to the correct elements all the time.

<div class="alert is-important">

**IMPORTANT**: <br />
If you need to animate the items of an `*ngFor` list and there is a possibility that the order of such items will change during runtime, always use a `TrackByFunction`.

</div>

## Animation sequence summary

## 动画序列总结

Angular functions for animating multiple elements start with `query()` to find inner elements; for example, gathering all images within a `<div>`.
The remaining functions, `stagger()`, [`group()`](api/animations/group), and `sequence()`, apply cascades or let you control how multiple animation steps are applied.

## More on Angular animations

## 关于 Angular 动画的更多知识

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Introduction to Angular animations](guide/animations)

  [Angular 动画简介](guide/animations)

* [Transition and triggers](guide/transition-and-triggers)

  [转场与触发器](guide/transition-and-triggers)

* [Reusable animations](guide/reusable-animations)

  [可复用动画](guide/reusable-animations)

* [Route transition animations](guide/route-animations)

  [路由转场动画](guide/route-animations)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28