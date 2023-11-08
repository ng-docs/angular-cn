Provides programmatic control of a reusable animation sequence,
built using the <code>[AnimationBuilder.build](api/animations/AnimationBuilder#build)\(\)</code>
method which returns an `AnimationFactory`, whose
<code>[create](api/animations/AnimationFactory#create)\(\)</code> method instantiates and
initializes this interface.

提供对可复用动画序列的编程控制，该动画序列是使用 `AnimationBuilder` 的 `build()` 方法构建的。
`build()` 方法返回一个工厂，其 `create()` 方法将实例化并初始化此接口。

The callback function.

回调函数。

Provides a callback to invoke when the animation finishes.

提供当动画结束时要调用的回调。

Provides a callback to invoke when the animation starts.

提供当动画启动时要调用的回调。

Provides a callback to invoke after the animation is destroyed.

提供当动画销毁后要调用的回调。

Initializes the animation.

初始化本动画。

True if the animation has started, false otherwise.

如果动画已开始，则为 true，否则为 false。

Reports whether the animation has started.

报告动画是否已开始。

Runs the animation, invoking the `onStart()` callback.

运行动画，并调用 `onStart()` 回调。

Pauses the animation.

暂停动画。

Restarts the paused animation.

重新开始已暂停的动画。

Ends the animation, invoking the `onDone()` callback.

结束动画，并调用 `onDone()` 回调。

Destroys the animation, after invoking the `beforeDestroy()` callback.
Calls the `onDestroy()` callback when destruction is completed.

在调用 `beforeDestroy()` 回调后销毁动画。销毁完成时调用 `onDestroy()`。

Resets the animation to its initial state.

将动画重置为其初始状态。

A 0-based offset into the duration, in milliseconds.

持续时间中从 0 开始的偏移量，以毫秒为单位。

Sets the position of the animation.

设置动画的位置。

Reports the current position of the animation.

报告动画的当前位置。

The parent of this player, if any.

此播放器的父项（如果有）。

The total run time of the animation, in milliseconds.

动画的总运行时间（以毫秒为单位）。

Provides a callback to invoke before the animation is destroyed.

提供在动画销毁之前要调用的回调。

An empty programmatic controller for reusable animations.
Used internally when animations are disabled, to avoid
checking for the null case when an animation player is expected.

用于可复用动画的空白程序控制器。当禁用动画时在内部使用，以免在要用动画播放器时检查其是否为 null。