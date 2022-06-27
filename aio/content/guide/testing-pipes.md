# Testing Pipes

# 测试管道

You can test [pipes](guide/pipes) without the Angular testing utilities.

你可以在没有 Angular 测试工具的情况下[测试管道](guide/pipes)。

<div class="alert is-helpful">

If you'd like to experiment with the application that this guide describes, <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

  如果你要试验本指南中所讲的应用，请<live-example name="testing" noDownload>在浏览器中运行它</live-example>或<live-example name="testing" downloadOnly>下载并在本地运行它</live-example>。

</div>

## Testing the `TitleCasePipe`

## 测试 `TitleCasePipe`

A pipe class has one method, `transform`, that manipulates the input value into a transformed output value.
The `transform` implementation rarely interacts with the DOM.
Most pipes have no dependence on Angular other than the `@Pipe` metadata and an interface.

这个管道类有一个方法 `transform` ，它把输入值变成一个转换后的输出值。 `transform` 的实现很少会与 DOM 交互。除了 `@Pipe` 元数据和一个接口之外，大多数管道都不依赖于 Angular。

Consider a `TitleCasePipe` that capitalizes the first letter of each word.
Here's an implementation with a regular expression.

考虑一个 `TitleCasePipe` ，它会把每个单词的第一个字母大写。这里是通过正则表达式实现的。

<code-example header="app/shared/title-case.pipe.ts" path="testing/src/app/shared/title-case.pipe.ts"></code-example>

Anything that uses a regular expression is worth testing thoroughly.
Use simple Jasmine to explore the expected cases and the edge cases.

任何使用正则表达式的东西都值得彻底测试。使用简单的 Jasmine 来探索预期的案例和边缘情况。

<code-example header="app/shared/title-case.pipe.spec.ts" path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt"></code-example>

<a id="write-tests"></a>

## Writing DOM tests to support a pipe test

## 编写 DOM 测试来支持管道测试

These are tests of the pipe *in isolation*.
They can't tell if the `TitleCasePipe` is working properly as applied in the application components.

这些都是对管道进行*隔离*测试的。他们无法判断当 `TitleCasePipe` 应用于组件中时是否能正常运行。

Consider adding component tests such as this one:

考虑添加这样的组件测试：

<code-example header="app/hero/hero-detail.component.spec.ts (pipe test)" path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe"></code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28