an instance of `SpecialCasedStyles` if any special styles are detected otherwise `null`

如果检测到任何特殊样式，则为 `SpecialCasedStyles` 的实例，否则为 `null`

Returns an instance of `SpecialCasedStyles` if and when any special \(non animateable\) styles are
detected.

如果检测到任何特殊（不可动画）样式，则返回 `SpecialCasedStyles` 的实例。

In CSS there exist properties that cannot be animated within a keyframe animation
\(whether it be via CSS keyframes or web-animations\) and the animation implementation
will ignore them. This function is designed to detect those special cased styles and
return a container that will be executed at the start and end of the animation.

在 CSS 中，存在无法在关键帧动画中设置动画的属性（无论是通过 CSS 关键帧还是 Web
动画），并且动画实现将忽略它们。此函数旨在检测这些特殊的大小写风格，并返回一个将在动画开始和结束时执行的容器。

Designed to be executed during a keyframe-based animation to apply any special-cased styles.

旨在在基于关键帧的动画期间执行以应用任何特殊情况的样式。

When started \(when the `start()` method is run\) then the provided `startStyles`
will be applied. When finished \(when the `finish()` method is called\) the
`endStyles` will be applied as well any any starting styles. Finally when
`destroy()` is called then all styles will be removed.

当启动时（运行 `start()` 方法时），将应用提供的 `startStyles`。完成后（调用 final `finish()`
方法时），`endStyles` 以及任何任何起始样式都将被应用。最后，当调用 `destroy()`
时，所有样式都将被删除。

An enum of states reflective of what the status of `SpecialCasedStyles` is.

反映 `SpecialCasedStyles` 状态的状态枚举。

Depending on how `SpecialCasedStyles` is interacted with, the start and end
styles may not be applied in the same way. This enum ensures that if and when
the ending styles are applied then the starting styles are applied. It is
also used to reflect what the current status of the special cased styles are
which helps prevent the starting/ending styles not be applied twice. It is
also used to cleanup the styles once `SpecialCasedStyles` is destroyed.

根据与 `SpecialCasedStyles`
的交互方式，开始和结束样式的应用方式可能不同。此枚举可确保如果以及当应用了结束样式时，则会应用起始样式。它还用于反映特殊大小写样式的当前状态，这有助于防止开始/结束样式不会被应用两次。一旦
`SpecialCasedStyles` 被销毁，它还用于清理样式。