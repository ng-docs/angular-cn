Angular's `<ng-template>` element defines a template that is not rendered by default.

Angular 的 `<ng-template>` 元素定义了一个默认不渲染的模板。

With `<ng-template>`, you can define template content that is only being rendered by Angular when you, whether directly or indirectly, specifically instruct it to do so, allowing you to have full control over how and when the content is displayed.

使用 `<ng-template>`，你可以定义一段模板内容，且仅当你直接或间接地明确指示 Angular 渲染时，Angular 才会渲染它，从而让你可以完全控制内容的显示方式和时机。

Structural Directives

结构型指令

One of the main uses for `<ng-template>` is to hold template content that will be used by [Structural directives](guide/structural-directives). Those directives can add and remove copies of the template content based on their own logic.

`<ng-template>` 的主要用途之一是保存将由[结构型指令](guide/structural-directives)使用的模板内容。这些指令可以根据自己的逻辑添加和删除模板内容的副本。

When using the [structural directive shorthand](guide/structural-directives#structural-directive-shorthand), Angular creates an `<ng-template>` element behind the scenes.

当使用[结构型指令简写法](guide/structural-directives#structural-directive-shorthand)时，Angular 会在幕后创建了一个 `<ng-template>` 元素。

`<ng-template>` elements are represented as instances of the `TemplateRef` class.

`<ng-template>` 元素表示为 `TemplateRef` 类的实例。

To add copies of the template to the DOM, pass this object to the `ViewContainerRef` method `createEmbeddedView()`.

要将模板的副本添加到 DOM 中，请将此对象传给 `ViewContainerRef` 的 `createEmbeddedView()` 方法。

Template Variables

模板变量

`<ng-template>` elements can be referenced in templates using [standard template variables](guide/template-reference-variables#how-angular-assigns-values-to-template-variables).

`<ng-template>` 元素可以使用[标准模板变量](guide/template-reference-variables#how-angular-assigns-values-to-template-variables)在模板中引用。

*This is how `<ng-template>` elements are used as `ngIf` else clauses.*

*这就是 `<ng-template>` 元素如何用作 `ngIf` 中 `else` 子句的方式。*

Such template variables can be used in conjunction with `ngTemplateOutlet` directives to render the content defined inside `<ng-template>` tags.

此类模板变量可以与 `ngTemplateOutlet` 指令结合使用，以渲染 `<ng-template>` 标签内定义的内容。

Querying

查询

A [Query](api/core/Query) \(such as `ViewChild`\) can find the `TemplateRef` associated to an `<ng-template>` element so that it can be used programmatically; for instance, to pass it to the `ViewContainerRef` method `createEmbeddedView()`.

[查询](api/core/Query)（例如 `ViewChild` ）可以找到与 `<ng-template>` 元素关联的 `TemplateRef` ，以便可以以编程方式使用它；例如，将其传递给 `ViewContainerRef` 方法 `createEmbeddedView()` 。

Context

上下文

Inside the `<ng-template>` tags you can reference variables present in the surrounding outer template.
Additionally, a context object can be associated with `<ng-template>` elements.
Such an object contains variables that can be accessed from within the template contents via template \(`let` and `as`\) declarations.

在 `<ng-template>` 标签内，你可以引用周围外部模板中存在的变量。此外，上下文对象可以与 `<ng-template>` 元素相关联。这样的对象包含可以通过模板（ `let` 和 `as` ）来声明可从模板内容中访问的变量。