# Animate state and style

You can define a set of styles together to make up a specific state for animating elements and transitions. These states represent style at certain points in your animations that you can animate to and from. For example, you can animate a state as the starting point to a different state and the end of an animation.

## What is a state?

A state is the condition of an animation. The Angular state\(\) function takes two parameters: a unique name and a style. There is also an optional parameter.

## Why would you want to use state?

Aliasing a set of styles and allows you to reference that alias for animations in general. This can make animations more readable or more understandable at a glance. You can give animations a useful and descriptive state name, which allows you to quickly understand the purpose of that animation state.

Use Angular's [`state()`](api/animations/state) function to define different states to call at the end of each transition.
This function takes two arguments:
A unique name like `open` or `closed` and a `style()` function.

使用 Angular 的 [`state()`](api/animations/state) 函数来定义不同的状态，供每次转场结束时调用。该函数接受两个参数：一个唯一的名字，比如 `open` 或 `closed` 和一个 `style()` 函数。

Use the `style()` function to define a set of styles to associate with a given state name.
You must use [*camelCase*](guide/glossary#case-conventions) for style attributes that contain dashes, such as `backgroundColor` or wrap them in quotes, such as `'background-color'`.

使用 `style()` 函数来定义一组与指定的状态名相关的样式。名称里带中线的样式属性必须是[*小驼峰*](guide/glossary#case-conventions) 格式的，如 `backgroundColor`，或者把它们包裹到引号里，如 `'background-color'`。

Angular's [`state()`](api/animations/state) function works with the `style⁣­(⁠)` function to set CSS style attributes.
In this code snippet, multiple style attributes are set at the same time for the state.
In the `open` state, the button has a height of 200 pixels, an opacity of 1, and a yellow background color.

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state1"></code-example>

In the following `closed` state, the button has a height of 100 pixels, an opacity of 0.8, and a background color of blue.

在下面这个 `closed` 状态中，按钮的高度是 100 像素，透明度是 0.8，背景色是蓝色。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="state2"></code-example>

@reviewed 2022-10-28
