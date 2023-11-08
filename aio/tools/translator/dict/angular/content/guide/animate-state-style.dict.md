Animate state and style

动画状态和样式

You can define a set of styles together to make up a specific state for animating elements and transitions. These states represent style at certain points in your animations that you can animate to and from. For example, you can animate a state as the starting point to a different state and the end of an animation.

你可以同时定义一组样式来规定动画元素和过渡的特定状态。这些状态代表动画中某些时间点的样式，你可以对其进行动画处理。例如，你可以将一个状态设置为不同状态的起点和动画的结束点。

What is a state?

什么是状态？

A state is the condition of an animation. The Angular state\(\) function takes two parameters: a unique name and a style. There is also an optional parameter.

状态是动画的条件。Angular 的 state\(\) 函数有两个参数：唯一名称和样式。还有一个可选参数。

Why would you want to use state?

你为什么要使用状态？

Aliasing a set of styles and allows you to reference that alias for animations in general. This can make animations more readable or more understandable at a glance. You can give animations a useful and descriptive state name, which allows you to quickly understand the purpose of that animation state.

为一组样式设置别名，并允许你在大多数情况下为动画引用该别名。这可以让动画更具可读性或更加一目了然。你可以为动画提供一个有用的描述性状态名称，这能让你快速了解该动画状态的用途。

Use Angular's [`state()`](api/animations/state) function to define different states to call at the end of each transition.
This function takes two arguments:
A unique name like `open` or `closed` and a `style()` function.

使用 Angular 的 [`state()`](api/animations/state) 函数来定义不同的状态，供每次过渡结束时调用。该函数接受两个参数：一个唯一的名字，比如 `open` 或 `closed` 和一个 `style()` 函数。

Use the `style()` function to define a set of styles to associate with a given state name.
You must use [*camelCase*](guide/glossary#case-conventions) for style attributes that contain dashes, such as `backgroundColor` or wrap them in quotes, such as `'background-color'`.

使用 `style()` 函数来定义一组与指定的状态名相关的样式。名称里带中线的样式属性必须是[*小驼峰*](guide/glossary#case-conventions) 格式的，如 `backgroundColor`，或者把它们包裹到引号里，如 `'background-color'`。

Angular's [`state()`](api/animations/state) function works with the `style()` function to set CSS style attributes.
In this code snippet, multiple style attributes are set at the same time for the state.
In the `open` state, the button has a height of 200 pixels, an opacity of 1, and a yellow background color.

Angular 的[`state()`](api/animations/state)函数与 `style()` 函数一起使用来设置 CSS 样式属性。在这段代码中，同时为状态设置了多个样式属性。在 `open` 状态下，按钮的高度为 200 像素，不透明度为 1，背景色为黄色。

In the following `closed` state, the button has a height of 100 pixels, an opacity of 0.8, and a background color of blue.

在下面这个 `closed` 状态中，按钮的高度是 100 像素，透明度是 0.8，背景色是蓝色。