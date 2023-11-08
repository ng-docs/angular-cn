Understanding Angular animation

理解 Angular 动画

Animation provides the illusion of motion: HTML elements change styling over time. Well-designed animations can make your application more fun and straightforward to use, but they aren't just cosmetic.

动画提供了运动的错觉：HTML 元素会随时间改变样式。精心设计的动画可以让你的应用程序更加有趣和易于使用，但它们不仅仅是装饰性的。

Prerequisites

前提条件

Before learning Angular animations, you should be familiar with building basic Angular apps:

在学习 Angular 动画之前，你应该已熟悉如何构建基本的 Angular 应用程序：

[Tutorial](tutorial)

[教程](tutorial)

[Architecture Overview](guide/architecture)

[架构概览](guide/architecture)

Animations can improve your application and user experience in many ways:

动画可以通过多种方式改善你的应用程序和用户体验：

Without animations, web page transitions can seem abrupt and jarring

没有动画，Web 页面的过渡就会显得突兀、不协调

Motion greatly enhances the user experience, so animations give users a chance to detect the application's response to their actions

运动能极大地提升用户体验，因此动画可以让用户察觉到应用对他们的操作做出了响应

Good animations intuitively call the user's attention to where it is needed

良好的动画可以直观的把用户的注意力吸引到要留意的地方

Typically, animations involve multiple style *transformations* over time.
An HTML element can move, change color, grow, shrink, fade, or slide off the page. These changes can occur simultaneously or sequentially. You can control the timing of each transformation.

通常，动画会随时间进行多种样式*转换*。HTML 元素可以移动、改变颜色、增大、缩小、淡化或滑出页面。这些变化可以同时或依次发生。你可以控制每个转换的时间。

Angular's animation system is built on CSS capability, which means you can animate any property that the browser considers animatable. This includes positions, sizes, transforms, colors, borders, and more.

Angular 的动画系统建立在 CSS 能力之上，这意味着你可以对浏览器认为可设置动画的任何属性设置动画。这包括位置、大小、变换、颜色、边框等。

The W3C maintains a list of animatable properties on its [CSS Transitions](https://www.w3.org/TR/css-transitions-1) page.

W3C 在其 [CSS Transitions](https://www.w3.org/TR/css-transitions-1) 页面上维护了一个动画属性列表。

Animation transition states

动画过渡状态

Animation transition states represent a style at certain points in your animations that you can animate to and from. For example, you can animate a state as the starting point to a different state and the end of an animation.

动画过渡状态表示动画中某些点的样式，你可以对其进行动画处理。例如，你可以将一个状态设置为不同状态的起点和动画的结束点。

Animate a transition that changes a single HTML element from one state to another. For example, you can specify that a button displays either **Open** or **Closed** based on the user's last action. When the button is in the `open` state, it's visible and yellow. When it's in the `closed` state, it's translucent and blue.

为将单个 HTML 元素从一种状态更改为另一种状态之间的过渡设置动画。例如，你可以指定按钮根据用户的最后一个操作显示**打开**或**关闭**。当按钮处于 `open` 状态时，它是完全可见的黄色。当它处于 `closed` 状态时，它是半透明的蓝色。

In HTML, these attributes are set using ordinary CSS styles such as color and opacity. In Angular, use the `style()` function to specify a set of CSS styles for use with animations. Collect a set of styles in an animation state, and give the state a name, such as `open` or `closed`.

在 HTML 中，这些属性都使用普通的 CSS 样式，比如颜色（color）和透明度（opacity）。在 Angular 中，使用 `style()` 函数来指定一组用作动画的 CSS 样式。可以为动画状态指定一组样式，并为该状态指定一个名字，比如 `open` 或 `closed`。