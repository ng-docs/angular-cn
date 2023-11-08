A special element that can hold structural directives without adding new elements to the DOM.

一种特殊元素，可以在不向 DOM 添加新元素的情况下承载结构型指令。

The `<ng-container>` allows us to use structural directives without any extra element, making sure that the only DOM changes being applied are those dictated by the directives themselves.

`<ng-container>` 允许我们在没有任何额外元素的情况下使用结构型指令，确保对应用 DOM 的唯一更改就是由指令本身决定的。

This not only increases performance \(even so slightly\) since the browser ends up rendering less elements but can also be a valuable asset in having cleaner DOMs and styles alike.

这不仅提高了性能（即使是轻微的），因为浏览器最终渲染的元素更少，而且你能得到更干净的 DOM 和样式。

It can for example enable us to use structural directives without breaking styling dependent on a precise DOM structure \(as for example the ones we get when using flex containers, margins, the child combinator selector, etc.\).

例如，它能让我们使用结构型指令，而不会破坏依赖于精确 DOM 结构的样式（例如，我们在使用 flex 容器、边距、子组合器选择器等时需要的样式）。

With `*NgIf`s

与 `*NgIf` 等一起使用

One common use case of `<ng-container>` is alongside the `*ngIf` structural directive. By using the special element we can produce very clean templates easy to understand and work with.

`<ng-container>` 的一个常见用例是与结构型指令 `*ngIf` 一起使用。通过使用这种特殊元素，我们可以生成非常干净、易于理解和使用的模板。

For example, we may want to have a number of elements shown conditionally but they do not need to be all under the same root element. That can be easily done by wrapping them in such a block:

例如，我们可能希望根据条件显示多个元素，但它们不需要都位于同一个根元素下。这可以通过将它们包装在这样一个块中来轻松实现：

This can also be augmented with an `else` statement alongside an `<ng-template>` as:

这也可以通过 `<ng-template>` 旁边的 `else` 语句进行扩充，如下所示：

Combination of multiple structural directives

组合使用多个结构型指令

Multiple structural directives cannot be used on the same element; if you need to take advantage of more than one structural directive, it is advised to use an `<ng-container>` per structural directive.

不能在同一个元素上使用多个结构型指令；如果你需要利用多个结构型指令，建议为每个结构型指令分别使用一个 `<ng-container>` 。

The most common scenario is with `*ngIf` and `*ngFor`. For example, let's imagine that we have a list of items but each item needs to be displayed only if a certain condition is true. We could be tempted to try something like:

最常见的情况是使用 `*ngIf` 和 `*ngFor`。例如，假设我们有一个条目列表，但只有在特定条件为真时才需要显示每个条目。我们可能会想这么做：

As we said that would not work, what we can do is to simply move one of the structural directives to an `<ng-container>` element, which would then wrap the other one, like so:

正如我们所说的，这行不通，我们可以做的就是简单地将结构型指令之一移动到 `<ng-container>` 元素，然后用它包裹另一个，如下所示：

This would work as intended without introducing any new unnecessary elements in the DOM.

这会如预期般工作，但不会在 DOM 中引入任何新的不必要的元素。

For more information see [one structural directive per element](guide/structural-directives#one-per-element).

有关更多信息，参阅[每个元素只能有一个结构型指令](guide/structural-directives#one-per-element)。

Use alongside ngTemplateOutlet

与 ngTemplateOutlet 一起使用

The `NgTemplateOutlet` directive can be applied to any element but most of the time it's applied to `<ng-container>` ones. By combining the two, we get a very clear and easy to follow HTML and DOM structure in which no extra elements are necessary and template views are instantiated where requested.

`NgTemplateOutlet` 指令可以应用于任何元素，但大多数时候它都会应用在 `<ng-container>` 元素上。通过将两者结合起来，我们得到了一个非常清晰且易于遵循的 HTML 和 DOM 结构，其中不需要额外的元素，并且模板视图在被用到时才会实例化。

For example, imagine a situation in which we have a large HTML, in which a small portion needs to be repeated in different places. A simple solution is to define an `<ng-template>` containing our repeating HTML and render that where necessary by using `<ng-container>` alongside an `NgTemplateOutlet`.

例如，想象一下我们有一个很大的 HTML，其中一小部分需要在不同的地方重复。一个简单的解决方案是定义一个包含我们要重复的 HTML 的 `<ng-template>` 并在必要时通过使用 `<ng-container>` 和 `NgTemplateOutlet` 来渲染它。

Like so:

像这样：

For more information regarding `NgTemplateOutlet`, see the [`NgTemplateOutlet`s api documentation page](api/common/NgTemplateOutlet).

有关 `NgTemplateOutlet` 的更多信息，请参阅 [`NgTemplateOutlet` 的 API 文档页面](api/common/NgTemplateOutlet)。