# Understanding template variables

# 理解模板变量

Template variables help you use data from one part of a template in another part of the template.
Use template variables to perform tasks such as respond to user input or finely tune your application's forms.

模板变量可以帮助你在模板的另一部分使用这个部分的数据。使用模板变量，你可以执行某些任务，比如响应用户输入或微调应用的表单。

A template variable can refer to the following:

模板变量可以引用这些东西：

* a DOM element within a template

  模板中的 DOM 元素

* a directive or component

  指令或组件

* a [TemplateRef](api/core/TemplateRef) from an [ng-template](api/core/ng-template)

  来自 [ng-template](api/core/ng-template) 的 [TemplateRef](api/core/TemplateRef)

* a <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">web component</a>

  [Web 组件](https://developer.mozilla.org/en-US/docs/Web/Web_Components "MDN：Web Components")

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

本章包含代码片段的工作实例参阅<live-example></live-example>。

</div>

## Prerequisites

## 前提条件

* [Understanding templates](guide/template-overview)

  [了解模板](guide/template-overview)

## Syntax

## 语法

In the template, you use the hash symbol, `#`, to declare a template variable.
The following template variable, `#phone`, declares a `phone` variable with the `<input>` element as its value.

在模板中，要使用井号 `#` 来声明一个模板变量。下列模板变量 `#phone` 声明了一个名为 `phone` 的变量，其值为此 `<input>` 元素。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

Refer to a template variable anywhere in the component's template.
Here, a `<button>` further down the template refers to the `phone` variable.

可以在组件模板中的任何地方引用某个模板变量。这里的 `<button>` 就引用了 `phone` 变量。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

## How Angular assigns values to template variables

## Angular 是如何为模板变量赋值的

Angular assigns a template variable a value based on where you declare the variable:

Angular 根据你所声明的变量的位置给模板变量赋值：

* If you declare the variable on a component, the variable refers to the component instance.

  如果在组件上声明变量，该变量就会引用该组件实例。

* If you declare the variable on a standard HTML tag, the variable refers to the element.

  如果在标准的 HTML 标记上声明变量，该变量就会引用该元素。

* If you declare the variable on an `<ng-template>` element, the variable refers to a `TemplateRef` instance which represents the template.
  For more information on `<ng-template>`, see [How Angular uses the asterisk, `*`, syntax](guide/structural-directives#asterisk) in [Structural directives](guide/structural-directives).

  如果你在 `<ng-template>` 元素上声明变量，该变量就会引用一个 `TemplateRef` 实例来代表此模板。关于 `<ng-template>` 的更多信息，请参阅[结构型指令](guide/structural-directives#asterisk) 中的 [Angular 如何使用 `*` 语法](guide/structural-directives#asterisk)部分。

## Variable specifying a name

## 指定名称的变量

* If the variable specifies a name on the right-hand side, such as `#var="ngModel"`, the variable refers to the directive or component on the element with a matching `exportAs` name.

  如果该变量在右侧指定了一个名字，比如 `#var="ngModel"` ，那么该变量就会引用所在元素上具有这个 `exportAs` 名字的指令或组件。

  <!-- What does the second half of this mean?^^ Can we explain this more fully? Could I see a working example? -kw -->

### Using `NgForm` with template variables

### 将 `NgForm` 与模板变量一起使用

In most cases, Angular sets the template variable's value to the element on which it occurs.
In the previous example, `phone` refers to the phone number `<input>`.
The button's click handler passes the `<input>` value to the component's `callPhone()` method.

在大多数情况下，Angular 会把模板变量的值设置为它所在的元素。在前面的例子中， `phone` 引用的是电话号码 `<input>` 。该按钮的 click 处理程序会把这个 `<input>` 的值传给该组件的 `callPhone()` 方法。

The `NgForm` directive demonstrates getting a reference to a different value by referencing a directive's `exportAs` name.
In the following example, the template variable, `itemForm`, appears three times separated by HTML.

这里的 `NgForm` 指令演示了如何通过引用指令的的 `exportAs` 名字来引用不同的值。在下面的例子中，模板变量 `itemForm` 在 HTML 中分别出现了三次。

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

Without the `ngForm` attribute value, the reference value of `itemForm` would be
the [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement), `<form>`.
If an element is an Angular Component, a reference with no attribute value will automatically reference the component instance. Otherwise, a reference with no value will reference the DOM element, even if the element has one or more directives applied to it.

如果没有 `ngForm` 这个属性值，`itemForm` 引用的值将是 [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) 也就是 `<form>` 元素。如果某元素是一个 Angular 组件，则不带属性值的引用会自动引用此组件的实例。否则，不带属性值的引用会引用此 DOM 元素，而不管此元素上有一个或多个指令。

<!-- What is the train of thought from talking about a form element to the difference between a component and a directive? Why is the component directive conversation relevant here?  -kw I agree -alex -->

## Template variable scope

## 模板变量的作用域

Just like variables in JavaScript or TypeScript code, template variables are scoped to the template that declares them.

就像 JavaScript 或 TypeScript 代码中的变量一样，模板变量的范围为声明它们的模板。

Similarly, [Structural directives](guide/built-in-directives) such as `*ngIf` and `*ngFor`, or `<ng-template>` declarations create a new nested template scope, much like JavaScript's control flow statements like `if` and `for` create new lexical scopes. You cannot access template variables within one of these structural directives from outside of its boundaries.

同样，诸如 `*ngIf` 和 `*ngFor` 类的[结构指令](guide/built-in-directives)或 `<ng-template>` 声明会创建一个新的嵌套模板范围，就像 JavaScript 的控制流语句（例如 `if` 和 `for` 创建新的词法范围。你不能从边界外访问这些结构指令之一中的模板变量。

<div class="alert is-helpful">

Define a variable only once in the template so the runtime value remains predictable.

同名变量在模板中只能定义一次，这样运行时它的值就是可预测的。

</div>

### Accessing in a nested template

### 在嵌套模板中访问

An inner template can access template variables that the outer template defines.

内部模板可以访问外模板定义的模板变量。

In the following example, changing the text in the `<input>` changes the value in the `<span>` because Angular immediately updates changes through the template variable, `ref1`.

在下面的例子中，修改 `<input>` 中的文本值也会改变 `<span>` 中的值，因为 Angular 会立即通过模板变量 `ref1` 来更新这种变化。

<code-example path="template-reference-variables/src/app/app.component.html" region="template-ref-vars-scope1" header="src/app/app.component.html"></code-example>

In this case, the `*ngIf` on `<span>` creates a new template scope, which includes the `ref1` variable from its parent scope.

在这种情况下， `<span>` 上的 `*ngIf` 会创建一个新的模板范围，其中包括其父范围中的 `ref1` 变量。

However, accessing a template variable from a child scope in the parent template doesn't work:

但是，从外部的父模板访问子范围中的变量是行不通的。

```html
  <input *ngIf="true" #ref2 type="text" [(ngModel)]="secondExample" />
  <span>Value: {{ ref2?.value }}</span> <!-- doesn't work -->
```

Here, `ref2` is declared in the child scope created by `*ngIf`, and is not accessible from the parent template.

在这里， `ref2` 是在 `*ngIf` 创建的子范围中声明的，并且无法从父模板访问。

{@a template-input-variable}

{@a template-input-variables}

## Template input variable

## 模板输入变量

A _template input variable_ is a variable with a value that is set when an instance of that template is created. See: [Writing structural directives](https://angular.io/guide/structural-directives)

_ 模板输入变量 _ 是一个具有在创建该模板实例时设置的值的变量。请参阅：[编写结构指令](https://angular.io/guide/structural-directives)

Template input variables can be seen in action in the long-form usage of `NgFor`:

可以在 `NgFor` 的长格式用法中看到模板输入变量的作用：

```html
<ul>
  <ng-template ngFor let-hero [ngForOf]="heroes">
    <li>{{hero.name}}
  </ng-template>
</ul>
```

The `NgFor` directive will instantiate this <ng-template> once for each hero in the `heroes` array, and will set the `hero` variable for each instance accordingly.

`NgFor` 指令将实例化此<ng-template>为 hero 数组中的每个 `heroes` 一次，并将为每个实例相应地设置 `hero` 变量。

When an `<ng-template>` is instantiated, multiple named values can be passed which can be bound to different template input variables. The right-hand side of the `let-` declaration of an input variable can specify which value should be used for that variable.

实例化 `<ng-template>` 时，可以传递多个命名值，这些值可以绑定到不同的模板输入变量。输入变量的 `let-` 声明的右侧可以指定应该用于该变量的值。

`NgFor` for example also provides access to the `index` of each hero in the array:

例如， `NgFor` 还提供了对数组中每个英雄的 `index` 的访问：

```html
<ul>
  <ng-template ngFor let-hero let-i="index" [ngForOf]="heroes">
    <li>Hero number {{i}}: {{hero.name}}
  </ng-template>
</ul>
```

## What’s next

## 下一步呢？

[Writing structural directives](https://angular.io/guide/structural-directives)

[编写结构指令](https://angular.io/guide/structural-directives)

@reviewed 2022-05-12