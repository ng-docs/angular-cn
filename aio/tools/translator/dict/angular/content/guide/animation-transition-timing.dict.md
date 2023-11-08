Animation transition and timing

动画的过渡与计时

An animation *transition* specifies changes that occur between one state and another. Set the transition to make the change less abrupt. An animation *transition* specifies the changes that occur between one state and another.

动画*过渡*用于指定一种状态与另一种状态之间发生的变化。设置过渡可以使变化不那么突然。

Animation `transition()` function defined

动画 `transition()` 函数定义

The `transition()` function accepts two arguments:

`transition()` 函数接受两个参数：

An expression that defines the direction between two transition states
An expression that accepts one or a series of `animate()` steps

定义两个过渡状态之间方向的表达式，和定义一个或一系列 `animate()` 步骤的表达式

Use the `animate()` function of a transition to define:

使用过渡的 `animate()` 函数来定义：

Length

时长

Delay

延迟

Easing

缓动

Style function for defining styles while transitions are taking place

用于在发生转换时定义样式的样式函数

Use the `animate()` function to define the `keyframes()` function for multi-step animations.
These definitions are placed in the second argument of the `animate()` function.

使用 `animate()` 函数定义多步动画的 `keyframes()` 函数。这些定义作为 `animate()` 函数的第二个参数传入。

Animation metadata: duration, delay, and easing

动画元数据：持续时间、延迟和缓动效果

The `animate()` function accepts the `timings` and `styles` input parameters.

`animate()` 函数接受 `timings` 和 `styles` 输入参数。

The `timings` parameter takes either a number or a string defined in three parts.

`timings` 参数可以接受一个数字或由三部分组成的字符串。

or

或者

The first part, `duration`, is required.
The duration can be expressed in milliseconds as a number without quotes, or in seconds with quotes and a time specifier.
For example, a duration of a tenth of a second can be expressed as follows:

第一部分 `duration`（持续时间）是必须的。这个持续时间可以表示成一个不带引号的纯数字（表示毫秒），或一个带引号的有单位的时间（表示秒数）。比如，0.1 秒的持续时间有如下表示方式：

As a plain number, in milliseconds:
`100`

作为纯数字，毫秒为单位：`100`

In a string, as milliseconds:
`'100ms'`

作为字符串，毫秒为单位：`'100ms'`

In a string, as seconds:
`'0.1s'`

作为字符串，秒为单位：`'0.1s'`

The second argument, `delay`, has the same syntax as `duration`.
For example:

第二个参数 `delay` 的语法和 `duration` 一样。比如：

Wait for 100 ms and then run for 200 ms: `'0.2s 100ms'`

等待 100 毫秒，然后运行 200 毫秒表示为：`'0.2s 100ms'`

The third argument, `easing`, controls how the animation [accelerates and decelerates](https://easings.net) during its runtime.
For example, `ease-in` causes the animation to begin slowly, and to pick up speed as it progresses.

第三个参数 `easing` 控制动画在运行期间如何进行[加速和减速](http://easings.net)。比如 `ease-in` 表示动画开始时很慢，然后逐渐加速。

Wait for 100 ms, run for 200 ms.
Use a deceleration curve to start out fast and slowly decelerate to a resting point:

等待 100 毫秒，运行 200 毫秒。使用减速曲线快速开始并缓慢减速到静止点：

Run for 200 ms, with no delay.
Use a standard curve to start slow, speed up in the middle, and then decelerate slowly at the end:

运行 200 毫秒，没有延迟。用一条标准曲线开始慢，中间加速，最后慢慢减速：

Start immediately, run for 200 ms.
Use an acceleration curve to start slow and end at full velocity:

立即开始，运行 200 毫秒。使用加速曲线以缓慢开始并以全速结束：

This example provides a state transition from `open` to `closed` with a 1-second transition between states.

下面的例子提供了一个从 `open` 到 `closed` 的持续一秒的状态过渡。

In the preceding code snippet, the `=>` operator indicates unidirectional transitions, and `<=>` is bidirectional.
Within the transition, `animate()` specifies how long the transition takes.
In this case, the state change from `open` to `closed` takes 1 second, expressed here as `1s`.

在上面的代码片段中，`=>` 操作符表示单向过渡，而 `<=>` 表示双向过渡。在过渡过程中，`animate()` 指定了过渡需要花费的时间。在这里，从 `open` 到 `closed` 状态的转换要花费 1 秒中，表示成 `1s`。

This example adds a state transition from the `closed` state to the `open` state with a 0.5-second transition animation arc.

下面的例子添加了一个从 `closed` 到 `open` 的状态过渡，过渡动画持续 0.5 秒。