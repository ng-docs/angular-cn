Complex animation sequences

复杂动画序列

Prerequisites

前提条件

A basic understanding of the following concepts:

对下列概念有基本的理解：

[Introduction to Angular animations](guide/animations)

[Angular 动画简介](guide/animations)

[Transition and triggers](guide/transition-and-triggers)

[过渡与触发器](guide/transition-and-triggers)

So far, we've learned simple animations of single HTML elements.
Angular also lets you animate coordinated sequences, such as an entire grid or list of elements as they enter and leave a page.
You can choose to run multiple animations in parallel, or run discrete animations sequentially, one following another.

到目前为止，我们已经学过了单个 HTML 元素的简单动画。Angular 还允许你在进入和离开页面时播放 "动画协调序列"，比如当整个网格或元素列表进入或离开页面时，多个条目的动画之间需要彼此协调时间。你可以选择并行执行多个动画，或者按顺序逐个运行离散动画。

The functions that control complex animation sequences are:

用来控制复杂动画序列的函数如下：

Runs animation steps one after another.

用于逐个顺序执行多个动画步骤。

[`group()`](api/animations/group)

[`group()`](api/animations/group)

Runs multiple animation steps in parallel.

用于并行执行多个动画步骤。

Applies a cascading delay to animations for multiple elements.

用于为多元素动画应用级联延迟。

Finds one or more inner HTML elements.

用于查找一个或多个内部 HTML 元素。

Functions

函数

Details

详情

<a id="complex-sequence"></a>



The `query()` function

`query()` 函数

Most complex animations rely on the `query()` function to find child elements and apply animations to them, basic examples of such are:

大多数复杂动画都依赖 `query()` 函数来查找子元素并对其应用动画，基本的例子是：

`query()` followed by `animateChild()`

`query()` 后跟 `animateChild()`

Used to query child elements, which themselves have animations metadata applied to them and trigger such animation \(which would be otherwise be blocked by the current/parent element's animation\).

用于查询子元素，这些元素本身就应用了动画元数据并触发这样的动画（否则将被当前/父元素的动画阻止）。

`query()` followed by `animate()`

`query()` 后跟 `animate()`

Used to query simple HTML elements and directly apply animations to them.

用于查询简单的 HTML 元素并直接对它们应用动画。

Examples

例子

The first argument of `query()` is a [css selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) string which can also contain the following Angular-specific tokens:

`query()` 的第一个参数是一个 [css 选择器](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)字符串，它还可以包含以下 Angular 特定的标记：

The animating element itself.

动画元素本身。

`@*` <br /> `@triggerName`

`@*` <br /> `@triggerName`

For elements with any—or a specific—trigger.

对于具有任何（或特定）触发器的元素。

For elements currently animating.

对于当前正在播放动画的元素。

`:enter` <br /> `:leave`

`:enter`<br />`:leave`

For entering/leaving elements.

用于进入/离开元素。

Tokens

标记

Animate multiple elements using `query()` and `stagger()` functions

使用 `query()` 和 `stagger()`（交错）函数执行多元素动画

After having queried child elements via `query()`, the `stagger()` function lets you define a timing gap between each queried item that is animated and thus animates elements with a delay between them.

通过 `query()` 查询子元素后，`stagger()` 函数允许你定义每个查询的动画项之间的时间间隙，从而为元素之间延迟设置动画。

The following example demonstrates how to use the `query()` and `stagger()` functions to animate a list \(of heroes\) adding each in sequence, with a slight delay, from top to bottom.

下面的例子演示了如何使用 `query()` 和 `stagger()` 函数对依次添加的英雄列表从上到下播放动画（有少许延迟）。

Use `query()` to look for an element entering the page that meets certain criteria

用 `query()` 查阅正在进入或离开页面的任意元素。该查询会找出那些符合某种特定标准的元素

For each of these elements, use `style()` to set the same initial style for the element.
Make it transparent and use `transform` to move it out of position so that it can slide into place.

对每个元素，使用 `style()` 为其设置初始样式。使其变得透明，并使用 `transform` 将其移出位置，以便它能滑入后就位。

Use `stagger()` to delay each animation by 30 milliseconds

使用 `stagger()` 来在每个动画之间延迟 30 毫秒

Animate each element on screen for 0.5 seconds using a custom-defined easing curve, simultaneously fading it in and un-transforming it

对屏幕上的每个元素，根据一条自定义缓动曲线播放 0.5 秒的动画，同时将其淡入，而且逐步取消以前的位移效果

Parallel animation using `group()` function

使用 `group()` 函数播放并行动画

You've seen how to add a delay between each successive animation.
But you might also want to configure animations that happen in parallel.
For example, you might want to animate two CSS properties of the same element but use a different `easing` function for each one.
For this, you can use the animation [`group()`](api/animations/group) function.

你已经了解了如何在两个连续的动画之间添加延迟。不过你可能还想配置一些并行的动画。比如，你可能希望为同一个元素的两个 CSS 属性设置动画，但要为每个属性使用不同的 `easing` 函数。这时，你可以使用动画函数 [`group()`](api/animations/group)。

The following example uses [`group()`](api/animations/group)s on both `:enter` and `:leave` for two different timing configurations, thus applying two independent animations to the same element in parallel.

在下面的例子中，对 `:enter` 和 `:leave` 使用分组，可以配置两种不同的时序。它们会同时作用于同一个元素，但彼此独立运行。

Sequential vs. parallel animations

顺序动画与平行动画

Complex animations can have many things happening at once.
But what if you want to create an animation involving several animations happening one after the other? Earlier you used [`group()`](api/animations/group) to run multiple animations all at the same time, in parallel.

复杂动画中可以同时发生很多事情。但是当你要创建一个需要让几个子动画逐个执行的动画时，该怎么办呢？以前我们使用 [`group()`](api/animations/group) 来同时并行运行多个动画。

A second function called `sequence()` lets you run those same animations one after the other.
Within `sequence()`, the animation steps consist of either `style()` or `animate()` function calls.

第二个名叫 `sequence()` 的函数会让你一个接一个地运行这些动画。在 `sequence()` 中，这些动画步骤由 `style()` 或 `animate()` 的函数调用组成。

Use `style()` to apply the provided styling data immediately.

`style()` 用来立即应用所指定的样式数据。

Use `animate()` to apply styling data over a given time interval.

`animate()` 用来在一定的时间间隔内应用样式数据。

Filter animation example

过滤器动画范例

Take a look at another animation on the live example page.
Under the Filter/Stagger tab, enter some text into the **Search Heroes** text box, such as `Magnet` or `tornado`.

来看看范例应用中的另一个动画。在 Filter/Stagger 页，往 **Search Heroes** 文本框中输入一些文本，比如 `Magnet` 或 `tornado`。

The filter works in real time as you type.
Elements leave the page as you type each new letter and the filter gets progressively stricter.
The heroes list gradually re-enters the page as you delete each letter in the filter box.

过滤器会在你输入时实时工作。每当你键入一个新字母时，就会有一些元素离开页面，并且过滤条件也会逐渐变得更加严格。相反，当你删除过滤器中的每个字母时，英雄列表也会逐渐重新进入页面中。

The HTML template contains a trigger called `filterAnimation`.

HTML 模板中包含一个名叫 `filterAnimation` 的触发器。

The `filterAnimation` in the component's decorator contains three transitions.

该组件装饰器中的 `filterAnimation` 包含三个过渡。

The code in this example performs the following tasks:

这个例子中的代码包含下列任务：

Skips animations when the user first opens or navigates to this page \(the filter animation narrows what is already there, so it only works on elements that already exist in the DOM\)

当用户首次打开或导航到此页面时，跳过所有动画（该动画会压扁已经存在的内容，因此它只会作用于那些已经存在于 DOM 中的元素）

Filters heroes based on the search input's value

根据搜索框中的值过滤英雄

For each change:

对于每次匹配：

Hides an element leaving the DOM by setting its opacity and width to 0

通过将元素的不透明度和宽度设置为 0 来隐藏正在离开 DOM 的元素

Animates an element entering the DOM over 300 milliseconds.
During the animation, the element assumes its default width and opacity.

对正在进入 DOM 的元素，播放一个 300 毫秒的动画。在动画期间，该元素采用其默认宽度和不透明度。

If there are multiple elements entering or leaving the DOM, staggers each animation starting at the top of the page, with a 50-millisecond delay between each element

如果有多个匹配的元素正在进入或离开 DOM，则从页面顶部的元素开始对每个元素进行交错（stagger），每个元素之间的延迟为 50 毫秒

Animating the items of a reordering list

在重新排序列表的条目时设置动画

Although Angular animates correctly `*ngFor` list items out of the box, it will not be able to do so if their ordering changes.
This is because it will lose track of which element is which, resulting in broken animations.
The only way to help Angular keep track of such elements is by assigning a `TrackByFunction` to the `NgForOf` directive.
This makes sure that Angular always knows which element is which, thus allowing it to apply the correct animations to the correct elements all the time.

尽管 Angular 开箱即用的支持 `*ngFor` 列表项动画，但如果只是它们的顺序变化了，就无法支持。因为 Angular 会忘记哪个元素是哪个元素，从而导致这些动画被破坏。帮助 Angular 跟踪此类元素的唯一方法是将 `TrackByFunction` 分配给 `NgForOf` 指令。这可确保 Angular 始终知道哪个元素是哪个，从而允许它始终将正确的动画应用于正确的元素。

Animations and Component View Encapsulation

动画和组件视图封装

Angular animations are based on the components DOM structure and do not directly take [View Encapsulation](/guide/view-encapsulation) into account, this means that components using `ViewEncapsulation.Emulated` behave exactly as if they were using `ViewEncapsulation.None` \(`ViewEncapsulation.ShadowDom` behaves differently as we'll discuss shortly\).

Angular 动画基于组件的 DOM 结构，不会直接考虑[视图封装](/guide/view-encapsulation)，这意味着使用 `ViewEncapsulation.Emulated` 的组件的行为方式与使用 `ViewEncapsulation.None` （ `ViewEncapsulation.ShadowDom` 行为方式不同，我们将很快讨论） .

For example if the `query()` function \(which you'll see more of in the rest of the Animations guide\) were to be applied at the top of a tree of components using the emulated view encapsulation, such query would be able to identify \(and thus animate\) DOM elements on any depth of the tree.

例如，如果要在使用模拟（emulated）视图封装的组件树的顶级组件中应用 `query()` 函数（你还会在动画指南的其余部分看到更多此类函数），则这样的查询将能够识别（并播放动画）此树的任何深度上的 DOM 元素。

On the other hand the `ViewEncapsulation.ShadowDom` changes the component's DOM structure by "hiding" DOM elements inside [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) elements. Such DOM manipulations do prevent some of the animations implementation to work properly since it relies on simple DOM structures and doesn't take `ShadowRoot` elements into account. Therefore it is advised to avoid applying animations to views incorporating components using the ShadowDom view encapsulation.

另一方面，`ViewEncapsulation.ShadowDom` 会通过在 [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) 元素中“隐藏” DOM 元素来更改组件的 DOM 结构。此类 DOM 操作就会阻碍某些动画实现的正常工作，因为它只能工作在简单的 DOM 结构上，并没有考虑 `ShadowRoot` 元素。因此，建议避免使用 ShadowDom 视图封装将动画应用到包含组件的视图。

Animation sequence summary

动画序列总结

Angular functions for animating multiple elements start with `query()` to find inner elements; for example, gathering all images within a `<div>`.
The remaining functions, `stagger()`, [`group()`](api/animations/group), and `sequence()`, apply cascades or let you control how multiple animation steps are applied.

Angular 中这些用于多元素动画的函数，都要从 `query()` 开始，查找出内部元素，比如找出某个 `<div>` 中的所有图片。其余函数 `stagger()`、[`group()`](api/animations/group) 和 `sequence()` 会以级联方式或你的自定义逻辑来控制要如何应用多个动画步骤。

More on Angular animations

关于 Angular 动画的更多知识

You might also be interested in the following:

你可能还对下列内容感兴趣：

[Reusable animations](guide/reusable-animations)

[可复用动画](guide/reusable-animations)

[Route transition animations](guide/route-animations)

[路由过渡动画](guide/route-animations)