# Reusable animations

# 可复用动画

This topic provides some examples of how to create reusable animations.

本主题提供了一些关于如何创建可复用动画的例子。

## Prerequisites

## 先决条件

Before continuing with this topic, you should be familiar with the following:

在继续本主题前，你需要熟悉下列知识：

* [Introduction to Angular animations](guide/animations)

  [Angular 动画简介](guide/animations)

* [Transition and triggers](guide/transition-and-triggers)

  [转场与触发器](guide/transition-and-triggers)

## Creating reusable animations

## 创建可复用动画

To create a reusable animation, use the [`animation()`](api/animations/animation) function to define an animation in a separate `.ts` file and declare this animation definition as a `const` export variable.
You can then import and reuse this animation in any of your application components using the [`useAnimation()`](api/animations/useAnimation) function.

<code-example header="src/app/animations.ts" path="animations/src/app/animations.1.ts" region="animation-const"></code-example>

In the preceding code snippet, `transitionAnimation` is made reusable by declaring it as an export variable.

在上面的代码片段中，通过把 `transitionAnimation` 声明为一个导出的变量，就让它变成了可复用的。

<div class="alert is-helpful">

**NOTE**: <br />
The `height`, `opacity`, `backgroundColor`, and `time` inputs are replaced during runtime.

</div>

You can also export a part of an animation.
For example, the following snippet exports the animation `trigger`.

你还可以导出某个动画的一部分。比如，下列代码片段会导出 `trigger` 这个动画。

<code-example header="src/app/animations.1.ts" path="animations/src/app/animations.1.ts" region="trigger-const"></code-example>

From this point, you can import reusable animation variables in your component class.
For example, the following code snippet imports the `transitionAnimation` variable and uses it via the `useAnimation()` function.

从现在起，你可以在组件类中导入这些可复用动画变量。比如下面的代码片段就导入了 `transitionAnimation` 变量，并通过 `useAnimation()` 函数来复用它。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.3.ts" region="reusable"></code-example>

## More on Angular animations

## 关于 Angular 动画的更多知识

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Introduction to Angular animations](guide/animations)

  [Angular 动画简介](guide/animations)

* [Transition and triggers](guide/transition-and-triggers)

  [转场与触发器](guide/transition-and-triggers)

* [Complex animation Sequences](guide/complex-animation-sequences)

  [复杂动画序列](guide/complex-animation-sequences)

* [Route transition animations](guide/route-animations)

  [路由转场动画](guide/route-animations)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28