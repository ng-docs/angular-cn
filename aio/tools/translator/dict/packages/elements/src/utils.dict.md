Provide methods for scheduling the execution of a callback.

提供用于调度回调执行的方法。

Schedule a callback to be called after some delay.

安排在一段时间后调用的回调。

Returns a function that when executed will cancel the scheduled function.

返回一个函数，执行时将取消计划的函数。

Schedule a callback to be called before the next render.
\(If `window.requestAnimationFrame()` is not available, use `scheduler.schedule()` instead.\)

安排要在下一次渲染之前调用的回调。（如果 `window.requestAnimationFrame()` 不可用，请改用
`scheduler.schedule()`。）

Convert a camelCased string to kebab-cased.

将 camelCased 字符串转换为 kebab-cased。

Check whether the input is an `Element`.

检查输入是否是 `Element`。

Check whether the input is a function.

检查输入是否是函数。

Convert a kebab-cased string to camelCased.

将 kebab 大小写的字符串转换为 camelCased。

Check whether an `Element` matches a CSS selector.
NOTE: this is duplicated from &commat;angular/upgrade, and can
be consolidated in the future

检查 `Element` 是否与 CSS 选择器匹配。注意：这是从 &commat;angular/upgrade 复制的，并且可以在将来合并

Test two values for strict equality, accounting for the fact that `NaN !== NaN`.

测试两个值的严格相等，考虑 `NaN !== NaN` 的事实。

Gets a map of default set of attributes to observe and the properties they affect.

获取要观察的默认属性集及其影响的属性的映射。

Gets a component's set of inputs. Uses the injector to get the component factory where the inputs
are defined.

获取组件的输入集。使用注入器来获取定义输入的组件工厂。