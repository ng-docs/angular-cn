# Structural directives

# 结构型指令

This guide is about structural directives and provides conceptual information on how such directives work, how Angular interprets their shorthand syntax, and how to add template guard properties to catch template type errors.

本指南是关于结构指令的，并提供了有关此类指令的工作方式、Angular 如何解释它们的速记语法以及如何添加模板保护属性以捕获模板类型错误的概念信息。

Structural directives are directives which change the DOM layout by adding and removing DOM elements.

结构指令是通过添加和删除 DOM 元素来更改 DOM 布局的指令。

Angular provides a set of built-in structural directives (such as `NgIf`, `NgForOf`, `NgSwitch` and others) which are commonly used in all Angular projects. For more information see [Built-in directives](guide/built-in-directives).

Angular 提供了一组内置的结构指令（例如 `NgIf` 、 `NgForOf` 、 `NgSwitch` 等），在所有 Angular 项目中通用。有关更多信息，请参阅[内置指令](guide/built-in-directives)。

<div class="alert is-helpful">

For the example application that this page describes, see the <live-example name="structural-directives"></live-example>.

对于本页面介绍的示例应用程序，请参阅<live-example name="structural-directives"></live-example>.

</div>

<a id="shorthand"></a>
<a id="asterisk"></a>

## Structural directive shorthand

## 结构型指令简写形式

When structural directives are applied they generally are prefixed by an asterisk, `*`,  such as `*ngIf`. This convention is shorthand that Angular interprets and converts into a longer form.
Angular transforms the asterisk in front of a structural directive into an `<ng-template>` that surrounds the host element and its descendants.

应用结构指令时，它们通常以星号 `*` 为前缀，例如 `*ngIf`。本约定是 Angular 解释并转换为更长形式的速记。Angular 会将结构指令前面的星号转换为围绕宿主元素及其后代的 `<ng-template>`。

For example, let's take the following code which uses an `*ngIf` to displays the hero's name if `hero` exists:

例如，让我们采取以下代码，如果 `hero` 存在，则使用 `*ngIf` 来显示英雄的名字：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (asterisk)" region="asterisk"></code-example>

Angular creates an `<ng-template>` element and applies the `*ngIf` directive onto it where it becomes a property binding in square brackets, `[ngIf]`. The rest of the `<div>`, including its class attribute, is then moved inside the `<ng-template>`:

Angular 创建一个 `<ng-template>` 元素，并将 `*ngIf` 指令应用于它，在那里它成为方括号中的属性绑定 `[ngIf]`。然后，`<div>` 的其余部分（包括其 class 属性）会在 `<ng-template>` 中移动：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-template)" region="ngif-template"></code-example>

Note that Angular does not actually create a real `<ng-template>` element, but instead only renders the `<div>` element.

请注意，Angular 实际上并没有创建真正的 `<ng-template>` 元素，而是仅渲染 `<div>` 元素。

```html
<div _ngcontent-c0>Mr. Nice</div>
```

The following example compares the shorthand use of the asterisk in `*ngFor` with the longhand `<ng-template>` form:

`*ngFor` 中的星号的简写形式与非简写的 `<ng-template>` 形式进行比较：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (inside-ngfor)" region="inside-ngfor"></code-example>

Here, everything related to the `ngFor` structural directive is moved to the `<ng-template>`.
All other bindings and attributes on the element apply to the `<div>` element within the `<ng-template>`.
Other modifiers on the host element, in addition to the `ngFor` string, remain in place as the element moves inside the `<ng-template>`.
In this example, the `[class.odd]="odd"` stays on the `<div>`.

在这里，与 `ngFor` 结构指令相关的所有内容都被移动到 `<ng-template>`。元素上的所有其他绑定和属性都适用于 `<ng-template>` 中的 `<div>` 元素。当元素在 `<ng-template>` 中移动时，宿主元素上的其他修饰符（除了 `ngFor` 字符串）会保持在原位。在此示例中，`[class.odd]="odd"` 保留在 `<div>` 上。

The `let` keyword declares a template input variable that you can reference within the template.
The input variables in this example are `hero`, `i`, and `odd`.
The parser translates `let hero`, `let i`, and `let odd` into variables named `let-hero`, `let-i`, and `let-odd`.
The `let-i` and `let-odd` variables become `let i=index` and `let odd=odd`.
Angular sets `i` and `odd` to the current value of the context's `index` and `odd` properties.

`let` 关键字会声明一个模板输入变量，你可以在模板中引用该变量。在这个例子中，是 `hero`、`i` 和 `odd`。解析器将 `let hero`、`let i` 和 `let odd` 转换为名为 `let-hero`、`let-i` 和 `let-odd` 的变量。`let-i` 和 `let-odd` 变量变为 `let i=index` 和 `let odd=odd`。Angular 会将 `i` 和 `odd` 设置为上下文中 `index` 和 `odd` 属性的当前值。

The parser applies PascalCase to all directives and prefixes them with the directive's attribute name, such as ngFor.
For example, the `ngFor` input properties, `of` and `trackBy`, map to `ngForOf` and `ngForTrackBy`.

解析器将 PascalCase 应用于所有指令，并以指令的属性名称为前缀，例如 ngFor。例如，`ngFor` 输入属性 `of` 和 `trackBy` 映射到 `ngForOf` 和 `ngForTrackBy`。

As the `NgFor` directive loops through the list, it sets and resets properties of its own context object.
These properties can include, but aren't limited to, `index`, `odd`, and a special property
named `$implicit`.

当 `NgFor` 指令遍历列表时，它会设置和重置其自己的上下文对象的属性。这些属性可以包括但不限于 `index` 、 `odd` 和名为 `$implicit` 的特殊属性。

Angular sets `let-hero` to the value of the context's `$implicit` property, which `NgFor` has initialized with the hero for the current iteration.

Angular 会将 `let-hero` 设置为上下文的 `$implicit` 属性的值，`NgFor` 已经将其初始化为当前正在迭代的英雄。

For more information, see the [NgFor API](api/common/NgForOf "API: NgFor") and [NgForOf API](api/common/NgForOf) documentation.

有关更多信息，请参见 [NgFor API](api/common/NgForOf "API：NgFor") 和 [NgForOf API](api/common/NgForOf) 文档。

<div class="alert is-helpful">

  Note that Angular's `<ng-template>` element defines a template that doesn't render anything by default, if you just wrap elements in an `<ng-template>` without applying a structural directive those elements will not be rendered.

请注意，Angular 的 `<ng-template>` 元素定义了一个默认不渲染任何内容的模板，如果你只是在 `<ng-template>` 中包装元素而不应用结构指令，则不会渲染这些元素。

  For more information, see the [ng-template API](api/core/ng-template) documentation.

有关更多信息，请参阅[ng-template API](api/core/ng-template)文档。

</div>

<a id="one-per-element"></a>

## One structural directive per element

## 每个元素一个结构指令

It's a quite common use-case to repeat a block of HTML but only when a particular condition is true. An intuitive way to do that is to put both an `*ngFor` and an `*ngIf` on the same element. However, since both `*ngFor` and `*ngIf` are structural directives, this would be treated as an error by the compiler. You may apply only one _structural_ directive to an element.

重复一个 HTML 块是一个很常见的用例，但前提是在特定条件为真时。一种直观的方法是将 `*ngFor` 和 `*ngIf` 放在同一个元素上。但是，由于 `*ngFor` 和 `*ngIf` 都是结构指令，因此编译器会将其视为错误。你只能将一个 _ 结构 _ 指令应用于一个元素。

The reason is simplicity. Structural directives can do complex things with the host element and its descendants.

原因是简单。结构指令可以用宿主元素及其后代做复杂的事情。

When two directives lay claim to the same host element, which one should take precedence?

当两个指令都声称使用了同一个宿主元素时，哪一个应该优先？

Which should go first, the `NgIf` or the `NgFor`? Can the `NgIf` cancel the effect of the `NgFor`?
If so (and it seems like it should be so), how should Angular generalize the ability to cancel for other structural directives?

哪个应该先走，`NgIf` 或 `NgFor` ？ `NgIf` 可以取消 `NgFor` 的效果吗？如果是这样（看起来应该是这样），Angular 应该如何概括其他结构指令的取消能力？

There are no easy answers to these questions. Prohibiting multiple structural directives makes them moot.
There's an easy solution for this use case: put the `*ngIf` on a container element that wraps the `*ngFor` element. One or both elements can be an `<ng-container>` so that no extra DOM elements are generated.

这些问题没有简单的答案。禁止多个结构指令使它们没有实际意义。这个用例有一个简单的解决方案：将 `*ngIf` 放在包装 `*ngFor` 元素的容器元素上。一个或两个元素可以是 `<ng-container>`，以便不会生成额外的 DOM 元素。

<a id="unless"></a>

## Creating a structural directive

## 创建结构型指令

This section guides you through creating an `UnlessDirective` and how to set `condition` values.
The `UnlessDirective` does the opposite of `NgIf`, and `condition` values can be set to `true` or `false`.
`NgIf` displays the template content when the condition is `true`.
`UnlessDirective` displays the content when the condition is `false`.

本节将指导你创建 `UnlessDirective` 以及如何设置 `condition` 值。`UnlessDirective` 与 `NgIf` 相反，并且 `condition` 值可以设置为 `true` 或 `false`。`NgIf` 为 `true` 时显示模板内容；而 `UnlessDirective` 在这个条件为 `false` 时显示内容。

Following is the `UnlessDirective` selector, `appUnless`, applied to the paragraph element.
When `condition` is `false`, the browser displays the sentence.

以下是应用于 p 元素的 `UnlessDirective` 选择器 `appUnless` 当 `condition` 为 `false`，浏览器将显示该句子。

<code-example header="src/app/app.component.html (appUnless-1)" path="structural-directives/src/app/app.component.html" region="appUnless-1"></code-example>

1. Using the Angular CLI, run the following command, where `unless` is the name of the directive:

   使用 Angular CLI，运行以下命令，其中 `unless` 是伪指令的名称：

   <code-example format="shell" language="shell">

   ng generate directive unless

   </code-example>

   Angular creates the directive class and specifies the CSS selector, `appUnless`, that identifies the directive in a template.

   Angular 会创建指令类，并指定 CSS 选择器 `appUnless`，它会在模板中标识指令。

1. Import `Input`, `TemplateRef`, and `ViewContainerRef`.

   导入 `Input`、`TemplateRef` 和 `ViewContainerRef`。

   <code-example header="src/app/unless.directive.ts (skeleton)" path="structural-directives/src/app/unless.directive.ts" region="skeleton"></code-example>

1. Inject `TemplateRef` and `ViewContainerRef` in the directive constructor as private variables.

   在指令的构造函数中将 `TemplateRef` 和 `ViewContainerRef` 注入成私有变量。

   <code-example header="src/app/unless.directive.ts (ctor)" path="structural-directives/src/app/unless.directive.ts" region="ctor"></code-example>

   The `UnlessDirective` creates an [embedded view](api/core/EmbeddedViewRef "API: EmbeddedViewRef") from the Angular-generated `<ng-template>` and inserts that view in a [view container](api/core/ViewContainerRef "API: ViewContainerRef") adjacent to the directive's original `<p>` host element.

   `UnlessDirective` 会通过 Angular 生成的 `<ng-template>` 创建一个[嵌入的视图](api/core/EmbeddedViewRef "API：EmbeddedViewRef")，然后将该视图插入到该指令的原始 `<p>` 宿主元素紧后面的[视图容器](api/core/ViewContainerRef "API：ViewContainerRef")中。

   [`TemplateRef`](api/core/TemplateRef "API: TemplateRef") helps you get to the `<ng-template>` contents and [`ViewContainerRef`](api/core/ViewContainerRef "API: ViewContainerRef") accesses the view container.

   [`TemplateRef`](api/core/TemplateRef "API：TemplateRef")可帮助你获取 `<ng-template>` 的内容，而 [`ViewContainerRef`](api/core/ViewContainerRef "API：ViewContainerRef") 可以访问视图容器。

1. Add an `appUnless` `@Input()` property with a setter.

   添加一个带 setter 的 `@Input()` 属性 `appUnless`。

   <code-example header="src/app/unless.directive.ts (set)" path="structural-directives/src/app/unless.directive.ts" region="set"></code-example>

   Angular sets the `appUnless` property whenever the value of the condition changes.

   每当条件的值更改时，Angular 都会设置 `appUnless` 属性。

   * If the condition is falsy and Angular hasn't created the view previously, the setter causes the view container to create the embedded view from the template

     如果条件是假值，并且 Angular 以前尚未创建视图，则此 setter 会导致视图容器从模板创建出嵌入式视图。

   * If the condition is truthy and the view is currently displayed, the setter clears the container, which disposes of the view

     如果条件为真值，并且当前正显示着视图，则此 setter 会清除容器，这会导致销毁该视图。

The complete directive is as follows:

完整的指令如下：

<code-example header="src/app/unless.directive.ts (excerpt)" path="structural-directives/src/app/unless.directive.ts" region="no-docs"></code-example>

### Testing the directive

### 测试指令

In this section, you'll update your application to test the `UnlessDirective`.

在本节中，你将更新你的应用程序，以测试 `UnlessDirective`。

1. Add a `condition` set to `false` in the `AppComponent`.

   添加一个 `condition` 设置为 `false` 的 `AppComponent`。

   <code-example header="src/app/app.component.ts (excerpt)" path="structural-directives/src/app/app.component.ts" region="condition"></code-example>

1. Update the template to use the directive.
   Here, `*appUnless` is on two `<p>` tags with opposite `condition` values, one `true` and one `false`.

   更新模板以使用指令。这里，`*appUnless` 位于两个具有相反 `condition` 的 `<p>` 标记上，一个为 `true`，一个为 `false`。

   <code-example header="src/app/app.component.html (appUnless)" path="structural-directives/src/app/app.component.html" region="appUnless"></code-example>

   The asterisk is shorthand that marks `appUnless` as a structural directive.
   When the `condition` is falsy, the top (A) paragraph appears and the bottom (B) paragraph disappears.
   When the `condition` is truthy, the top (A) paragraph disappears and the bottom (B) paragraph appears.

   星号是将 `appUnless` 标记为结构型指令的简写形式。如果 `condition` 是假值，则会让顶部段落 A，而底部段落 B 消失。当 `condition` 为真时，顶部段落 A 消失，而底部段落 B 出现。

1. To change and display the value of `condition` in the browser, add markup that displays the status and a button.

   要在浏览器中更改并显示 `condition` 的值，请添加一段标记代码以显示状态和按钮。

   <code-example header="src/app/app.component.html" path="structural-directives/src/app/app.component.html" region="toggle-info"></code-example>

To verify that the directive works, click the button to change the value of `condition`.

要验证指令是否有效，请单击按钮以更改 `condition` 的值。

<div class="lightbox">

<img alt="UnlessDirective in action" src="generated/images/guide/structural-directives/unless-anim.gif">

</div>

## Structural directive syntax reference

## 结构型指令语法参考

When you write your own structural directives, use the following syntax:

当你编写自己的结构型指令时，请使用以下语法：

<code-example format="typescript" hideCopy language="typescript">

&ast;:prefix="( :let &verbar; :expression ) (';' &verbar; ',')? ( :let &verbar; :as &verbar; :keyExp )&ast;"

</code-example>

The following tables describe each portion of the structural directive grammar:

下表描述了结构型指令语法的每个部分：

<code-tabs>
    <code-pane format="typescript" header="as" hideCopy language="typescript"> as = :export "as" :local ";"? </code-pane>
    <code-pane format="typescript" header="keyExp" hideCopy language="typescript"> keyExp = :key ":"? :expression ("as" :local)? ";"? </code-pane>
    <code-pane format="typescript" header="let" hideCopy language="typescript"> let = "let" :local "=" :export ";"? </code-pane>
</code-tabs>

| Keyword | Details |
| :------ | :------ |
| 关键字 | 详情 |
| `prefix` | HTML attribute key |
| `prefix` | HTML 属性的键名 |
| `key` | HTML attribute key |
| `key` | HTML 属性的键名 |
| `local` | Local variable name used in the template |
| `local` | 在模板中使用的局部变量名 |
| `export` | Value exported by the directive under a given name |
| `export` | 该指令以特定名称导出的值 |
| `expression` | Standard Angular expression |
| `expression` | 标准 Angular 表达式 |

### How Angular translates shorthand

### Angular 如何翻译简写形式

Angular translates structural directive shorthand into the normal binding syntax as follows:

Angular 会将结构型指令的简写形式转换为普通的绑定语法，如下所示：

| Shorthand | Translation |
| :-------- | :---------- |
| 简写形式 | 翻译结果 |
| `prefix` and naked `expression` | <code-example format="typescript" hideCopy language="typescript"> [prefix]="expression" </code-example> |
| `prefix` 和裸 `expression` | <code-example format="typescript" hideCopy language="typescript"> [prefix]="expression" </code-example> |
| `keyExp` | <code-example format="typescript" hideCopy language="typescript"> [prefixKey] "expression" (let-prefixKey="export") </code-example> <div class="alert is-helpful"> **NOTE**: <br /> The `prefix` is added to the `key` </div> |
| `keyExp` | <code-example format="typescript" hideCopy language="typescript"> [prefixKey] "expression" (let-prefixKey="export") </code-example> <div class="alert is-helpful"> **注意**: <br /> `prefix` 被加到了 `key` 上</div> |
| `keyExp` | <code-example format="typescript" hideCopy language="typescript"> [prefixKey] "expression" (let-prefixKey="export") </code-example> |
| `let` | <code-example format="typescript" hideCopy language="typescript"> let-local="export" </code-example> |

### Shorthand examples

### 简写形式示例

The following table provides shorthand examples:

下表提供了一些简写形式示例：

| Shorthand | How Angular interprets the syntax |
| :-------- | :-------------------------------- |
| 简写形式 | Angular 如何解释此语法 |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngFor="let item of [1,2,3]" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template ngFor &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-item &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ngForOf]="[1,2,3]"&gt; </code-example> |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngFor="let item of [1,2,3] as items; &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; trackBy: myTrack; index as i" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template ngFor &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-item &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ngForOf]="[1,2,3]" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-items="ngForOf" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ngForTrackBy]="myTrack" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-i="index"&gt; </code-example> |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngIf="exp" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template [ngIf]="exp"&gt; </code-example> |
| <code-example format="typescript" hideCopy language="typescript"> &ast;ngIf="exp as value" </code-example> | <code-example format="html" hideCopy language="html"> &lt;ng-template [ngIf]="exp" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let-value="ngIf"&gt; </code-example> |

<a id="directive-type-checks"></a>

<!--todo: To do follow up PR: move this section to a more general location because it also applies to attribute directives. -->

## Improving template type checking for custom directives

## 改进自定义指令的模板类型检查

You can improve template type checking for custom directives by adding template guard properties to your directive definition.
These properties help the Angular template type checker find mistakes in the template at compile time, which can avoid runtime errors.
These properties are as follows:

你可以通过将模板守卫属性添加到指令定义中来改进自定义指令的模板类型检查。这些属性可帮助 Angular 的模板类型检查器在编译时发现模板中的错误，从而避免运行时错误。这些属性如下：

* A property `ngTemplateGuard_(someInputProperty)` lets you specify a more accurate type for an input expression within the template

  `ngTemplateGuard_(someInputProperty)` 属性使你可以为模板中的输入表达式指定更准确的类型。

* The `ngTemplateContextGuard` static property declares the type of the template context

  静态属性 `ngTemplateContextGuard` 声明了模板上下文的类型。

This section provides examples of both kinds of type-guard property.
For more information, see [Template type checking](guide/template-typecheck "Template type-checking guide").

本节提供了两种类型守卫的示例。欲知详情，请参见[模板类型检查](guide/template-typecheck "模板类型检查指南")。

<a id="narrowing-input-types"></a>

### Making in-template type requirements more specific with template guards

### 使用模板守卫使模板中的类型要求更具体

A structural directive in a template controls whether that template is rendered at run time, based on its input expression.
To help the compiler catch template type errors, you should specify as closely as possible the required type of a directive's input expression when it occurs inside the template.

模板中的结构型指令会根据输入表达式来控制是否要在运行时渲染该模板。为了帮助编译器捕获模板类型中的错误，你应该尽可能详细地指定模板内指令的输入表达式所期待的类型。

A type guard function narrows the expected type of an input expression to a subset of types that might be passed to the directive within the template at run time.
You can provide such a function to help the type-checker infer the proper type for the expression at compile time.

类型保护函数会将输入表达式的预期类型缩小为可能在运行时传递给模板内指令的类型的子集。你可以提供这样的功能来帮助类型检查器在编译时为表达式推断正确的类型。

For example, the `NgIf` implementation uses type-narrowing to ensure that the template is only instantiated if the input expression to `*ngIf` is truthy.
To provide the specific type requirement, the `NgIf` directive defines a [static property `ngTemplateGuard_ngIf: 'binding'`](api/common/NgIf#static-properties).
The `binding` value is a special case for a common kind of type-narrowing where the input expression is evaluated in order to satisfy the type requirement.

比如，`NgIf` 的实现使用类型窄化来确保只有当 `*ngIf` 的输入表达式为真时，模板才会被实例化。为了提供具体的类型要求，`NgIf` 指令定义了一个[静态属性 `ngTemplateGuard_ngIf: 'binding'`](api/common/NgIf#static-properties)。这里的 `binding` 值是一种常见的类型窄化的例子，它会对输入表达式进行求值，以满足类型要求。

To provide a more specific type for an input expression to a directive within the template, add an `ngTemplateGuard_xx` property to the directive, where the suffix to the static property name, `xx`, is the `@Input()` field name.
The value of the property can be either a general type-narrowing function based on its return type, or the string `"binding"`, as in the case of `NgIf`.

要为模板中指令的输入表达式提供更具体的类型，请在指令中添加 `ngTemplateGuard_xx` 属性，其中静态属性名称 `xx` 就是 `@Input()` 字段的名字。该属性的值可以是基于其返回类型的常规类型窄化函数，也可以是字符串，比如 `NgIf` 中的 `"binding"`。

For example, consider the following structural directive that takes the result of a template expression as an input:

比如，考虑以下结构型指令，该指令以模板表达式的结果作为输入：

<code-tabs linenums="true">
  <code-pane
    header="src/app/if-loaded.directive.ts"
    path="structural-directives/src/app/if-loaded.directive.ts">
  </code-pane>
  <code-pane
    header="src/app/loading-state.ts"
    path="structural-directives/src/app/loading-state.ts">
  </code-pane>
  <code-pane
    header="src/app/hero.component.ts"
    path="structural-directives/src/app/hero.component.ts">
  </code-pane>
</code-tabs>

In this example, the `LoadingState<T>` type permits either of two states, `Loaded<T>` or `Loading`.
The expression used as the directive's `state` input (aliased as `appIfLoaded`) is of the umbrella type `LoadingState`, as it's unknown what the loading state is at that point.

在这个例子中，`LoadingState<T>` 类型允许两个状态之一，`Loaded<T>` 或 `Loading`。用作指令的 `state` 输入（别名为 `appIfLoaded`）的表达式是宽泛的伞形类型 `LoadingState`，因为还不知道此时的加载状态是什么。

The `IfLoadedDirective` definition declares the static field `ngTemplateGuard_appIfLoaded`, which expresses the narrowing behavior.
Within the `AppComponent` template, the `*appIfLoaded` structural directive should render this template only when `state` is actually `Loaded<Hero>`.
The type guard lets the type checker infer that the acceptable type of `state` within the template is a `Loaded<T>`, and further infer that `T` must be an instance of `Hero`.

`IfLoadedDirective` 定义声明了静态字段 `ngTemplateGuard_appIfLoaded`，以表示其窄化行为。在 `AppComponent` 模板中，`*appIfLoaded` 结构型指令只有当实际的 `state` 是 `Loaded<Person>` 类型时，才会渲染该模板。类型守护允许类型检查器推断出模板中可接受的 `state` 类型是 `Loaded<T>`，并进一步推断出 `T` 必须是一个 `Hero` 的实例。

<a id="narrowing-context-type"></a>

### Typing the directive's context

### 为指令的上下文指定类型

If your structural directive provides a context to the instantiated template, you can properly type it inside the template by providing a static `ngTemplateContextGuard` function.
The following snippet shows an example of such a function.

如果你的结构型指令要为实例化的模板提供一个上下文，可以通过提供静态的 `ngTemplateContextGuard` 函数在模板中给它提供合适的类型。下面的代码片段展示了该函数的一个例子。

<code-tabs linenums="true">
  <code-pane
    header="src/app/trigonometry.directive.ts"
    path="structural-directives/src/app/trigonometry.directive.ts">
  </code-pane>
  <code-pane
    header="src/app/app.component.html (appTrigonometry)"
    path="structural-directives/src/app/app.component.html"
    region="appTrigonometry">
  </code-pane>
</code-tabs>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28