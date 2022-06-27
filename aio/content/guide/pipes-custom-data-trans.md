# Creating pipes for custom data transformations

# 为自定义数据转换创建管道

Create custom pipes to encapsulate transformations that are not provided with the built-in pipes.
Then, use your custom pipe in template expressions, the same way you use built-in pipes—to transform input values to output values for display.

创建自定义管道来封装那些内置管道没有提供的转换。然后就可以在模板表达式中使用自定义管道了，像内置管道一样，把输入值转换成显示输出。

## Marking a class as a pipe

## 把一个类标记为一个管道

To mark a class as a pipe and supply configuration metadata, apply the [`@Pipe`](/api/core/Pipe "API reference for Pipe") [decorator](/guide/glossary#decorator--decoration "Definition for decorator") to the class.

Use [UpperCamelCase](guide/glossary#case-types "Definition of case types") (the general convention for class names) for the pipe class name, and [camelCase](guide/glossary#case-types "Definition of case types") for the corresponding `name` string.
Do not use hyphens in the `name`.

For details and more examples, see [Pipe names](guide/styleguide#pipe-names "Pipe names in the Angular coding style guide").

Use `name` in template expressions as you would for a built-in pipe.

在模板表达式中使用 `name` 就像在内置管道中一样。

<div class="alert is-important">

* Include your pipe in the `declarations` field of the `NgModule` metadata in order for it to be available to a template. See the `app.module.ts` file in the example application (<live-example></live-example>). For details, see [NgModules](guide/ngmodules "NgModules introduction").

* Register your custom pipes. The [Angular CLI](cli "CLI Overview and Command Reference") [`ng generate pipe`](cli/generate#pipe "ng generate pipe in the CLI Command Reference") command registers the pipe automatically.

  注册自定义管道。[Angular CLI](cli "CLI 概述和命令参考") 的 [`ng generate pipe`](cli/generate#pipe "ng 在 CLI Command Reference 中生成管道") 命令会自动注册该管道。

</div>

## Using the PipeTransform interface

## 使用 PipeTransform 接口

Implement the [`PipeTransform`](/api/core/PipeTransform "API reference for PipeTransform") interface in your custom pipe class to perform the transformation.

在自定义管道类中实现 [`PipeTransform`](/api/core/PipeTransform "PipeTransform 的 API 参考") 接口来执行转换。

Angular invokes the `transform` method with the value of a binding as the first argument, and any parameters as the second argument in list form, and returns the transformed value.

Angular 调用 `transform` 方法，该方法使用绑定的值作为第一个参数，把其它任何参数都以列表的形式作为第二个参数，并返回转换后的值。

## Example: Transforming a value exponentially

## 范例：指数级转换

In a game, you might want to implement a transformation that raises a value exponentially to increase a hero's power.
For example, if the hero's score is 2, boosting the hero's power exponentially by 10 produces a score of 1024.
Use a custom pipe for this transformation.

在游戏中，可能希望实现一种指数级转换，以指数级增加英雄的力量。例如，如果英雄的得分是 2，那么英雄的能量会指数级增长 10 次，最终得分为 1024。你可以使用自定义管道进行这种转换。

The following code example shows two component definitions:

下列代码范例显示了两个组件定义：

* The `exponential-strength.pipe.ts` component defines a custom pipe named `exponentialStrength` with the `transform` method that performs the transformation.
  It defines an argument to the `transform` method (`exponent`) for a parameter passed to the pipe.

  `exponential-strength.pipe.ts` 通过一个执行转换的 `transform` 方法定义了一个名为 `exponentialStrength` 的自定义管道。它为传给管道的参数定义了 `transform` 方法的一个参数（`exponent`）。

* The `power-booster.component.ts` component demonstrates how to use the pipe, specifying a value (`2`) and the exponent parameter (`10`).

  `power-booster.component.ts` 组件演示了如何使用该管道，指定了一个值（ `2` ）和一个 exponent 参数（ `10` ）。

<code-tabs>
    <code-pane header="src/app/exponential-strength.pipe.ts" path="pipes/src/app/exponential-strength.pipe.ts"></code-pane>
    <code-pane header="src/app/power-booster.component.ts" path="pipes/src/app/power-booster.component.ts"></code-pane>
</code-tabs>

The browser displays the following:

浏览器显示如下：

<code-example language="none">

Power Booster

Superpower boost: 1024

</code-example>

<div class="alert is-helpful">

To examine the behavior of the `exponentialStrength` pipe in the <live-example></live-example>, change the value and optional exponent in the template.

</div>

@reviewed 2022-04-01