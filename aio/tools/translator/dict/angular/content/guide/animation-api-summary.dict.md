Animation API summary

动画 API 汇总

The functional API provided by the `@angular/animations` module provides a domain-specific language \(DSL\) for creating and controlling animations in Angular applications.
See the [API reference](api/animations) for a complete listing and syntax details of the core functions and related data structures.

`@angular/animations` 模块提供的这些功能性 API 提供了一种领域特定语言（DSL），用于在 Angular 应用中创建和控制动画效果。到 [API 参考手册](api/animations)中查看完整的列表以及这些核心功能、相关数据结构的详细语法。

Allows animations on child components to be run within the same timeframe as the parent.

允许子组件上的动画和父组件在同一个时间范围（timeframe）内执行。

Activates a reusable animation. Used with `animation()`.

激活一个可复用动画。和 `animation()` 一起使用。

Produces a reusable animation that can be invoked from elsewhere. Used together with `useAnimation()`.

生成可在其它地方调用的可复用动画。与 `useAnimation()` 一起使用。

Staggers the starting time for animations for multiple elements.

交错安排多元素动画的开始时间。

Specifies a list of animation steps that are run sequentially, one by one.

指定一个动画步骤列表，它们会逐个顺序执行。

Finds one or more inner HTML elements within the current element.

找出当前元素中的一个或多个内部 HTML 元素。

[`group()`](api/animations/group)

[`group()`](api/animations/group)

Specifies a group of animation steps \(*inner animations*\) to be run in parallel. Animation continues only after all inner animation steps have completed. Used within `sequence()` or `transition()`.

指定要并行运行的一组动画步骤（*内部动画*）。该动画只有当所有内部动画步骤都完成之后才会继续。用于 `sequence()` 或 `transition()` 中。

Allows a sequential change between styles within a specified time interval. Use within `animate()`. Can include multiple `style()` calls within each `keyframe()`. Uses array syntax.

允许以特定的时间间隔对样式进行顺序更改。用于 `animate()` 中。每个 `keyframe()` 中都可以包含多个 `style()` 调用。使用数组语法。

Defines the animation sequence between two named states. Uses array syntax.

定义两个命名状态之间的动画序列。使用数组语法。

Specifies the timing information for a transition. Optional values for `delay` and `easing`. Can contain `style()` calls within.

指定过渡的时序信息。`delay` 和 `easing` 是可选值。其中可以包含 `style()` 调用。

[`state()`](api/animations/state)

[`state()`](api/animations/state)

Creates a named set of CSS styles that should be applied on successful transition to a given state. The state can then be referenced by name within other animation functions.

创建一组有名字的 CSS 样式，它会在成功转换到指定的状态时应用到元素上。该状态可以在其它动画函数中通过名字进行引用。

Defines one or more CSS styles to use in animations. Controls the visual appearance of HTML elements during animations. Uses object syntax.

定义一个或多个要用于动画中的 CSS 样式。用于在动画期间控制 HTML 元素的视觉外观。要使用对象语法。

Kicks off the animation and serves as a container for all other animation function calls. HTML template binds to `triggerName`. Use the first argument to declare a unique trigger name. Uses array syntax.

开始动画，并充当所有其它动画函数的容器。HTML 模板可以绑定到 `triggerName`。使用第一个参数来声明唯一的触发器名称。要使用数组语法。

Function name

函数名

What it does

用途