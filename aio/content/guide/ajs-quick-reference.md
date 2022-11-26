# AngularJS to Angular concepts: Quick reference

# 关于 AngularJS 与 Angular 概念的快速参考

*Angular* is the name for the Angular of today and tomorrow.

*Angular*是现在和未来的 Angular 名称。

*AngularJS* is the name for all v1.x versions of Angular.

*AngularJS*是 Angular 的所有 v1.x 版本的名称。

This guide helps you transition from AngularJS to Angular
by mapping AngularJS syntax to the corresponding Angular syntax.

本章提供了一个快速的参考指南，指出一些常用的 AngularJS 语法及其在 Angular 中的等价物。

**See the Angular syntax in this <live-example name="ajs-quick-reference"></live-example>**.

**参阅 <live-example name="ajs-quick-reference"></live-example> 以学习 Angular 语法**

## Template basics

## 模板基础

Templates are the user-facing part of an Angular application and are written in HTML.
The following table lists some of the key AngularJS template features with their corresponding Angular template syntax.

模板是 Angular 应用中的门面部分，它是用 HTML 写的。下表中是一些 AngularJS 中的关键模板特性及其在 Angular 中的等价语法。

### Bindings / interpolation &rarr; bindings / interpolation

### 绑定/插值 → 绑定/插值

| AngularJS | Angular |
| :-------- | :------ |
| <header>Bindings/interpolation</header> <code-example hideCopy format="html" language="html"> Your favorite hero is: {{vm.favoriteHero}} </code-example> In AngularJS, an expression in curly braces denotes one-way binding. This binds the value of the element to a property in the controller associated with this template. <br /> When using the `controller as` syntax, the binding is prefixed with the controller alias (`vm` or `$ctrl`) because you have to be specific about the source. | <header>Bindings/interpolation</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="interpolation"></code-example> In Angular, a template expression in curly braces still denotes one-way binding. This binds the value of the element to a property of the component. The context of the binding is implied and is always the associated component, so it needs no reference variable. <br /> For more information, see the [Interpolation][AioGuideInterpolation] guide. |
| <header>绑定/插值</header><code-example hideCopy format="html" language="html"> Your favorite hero is: {{vm.favoriteHero}} </code-example>在 AngularJS 中，花括号中的表达式表示单向绑定。这会将元素的值绑定到与此模板关联的控制器中的属性。<br />使用 `controller as` 语法时，绑定要以控制器别名（`vm` 或 `$ctrl`）为前缀，因为你必须特定于此来源。 | <header>绑定/插值</header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="interpolation"></code-example>在 Angular 中，花括号中的模板表达式仍然表示单向绑定。这会将元素的值绑定到组件的属性。绑定的上下文是隐式的，并且始终是与其关联的组件，因此它不需要引用变量。<br />有关更多信息，请参阅[插值][AioGuideInterpolation]指南。 |

### Filters &rarr; pipes

### 过滤器/管道

| AngularJS | Angular |
| :-------- | :------ |
| <header>Filters</header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; uppercase}} &NewLine; &lt;/td&gt; </code-example> To filter output in AngularJS templates, use the pipe (<code>&verbar;</code>) character and one or more filters. <br /> This example filters the `title` property to uppercase. | <header>Pipes</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="uppercase"></code-example> In Angular you use similar syntax with the pipe (<code>&verbar;</code>) character to filter output, but now you call them **pipes**. Many (but not all) of the built-in filters from AngularJS are built-in pipes in Angular. <br /> For more information, see [Filters/pipes][AioGuideAjsQuickReferenceFiltersPipes]. |
| <header>过滤器</header><code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; uppercase}} &NewLine; &lt;/td&gt; </code-example>要过滤 AngularJS 模板中的输出，请使用管道 (<code>&verbar;</code>) 字符和一个或多个过滤器。<br />此示例将 `title` 属性过滤为大写。 | <header>管道</header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="uppercase"></code-example>在 Angular 中，你可以用管道 (<code>&verbar;</code>) 字符来过滤输出，但现在它们改名为**管道**。AngularJS 的许多（但不是全部）内置过滤器都是 Angular 中的内置管道。<br />有关更多信息，请参阅[过滤器/管道][AioGuideAjsQuickReferenceFiltersPipes]。 |

### Local variables &rarr; input variables

### 局部变量 → 输入变量

| AngularJS | Angular |
| :-------- | :------ |
| <header>Local variables</header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in vm.movies"&gt; &NewLine;&nbsp; &lt;td&gt; &NewLine;&nbsp;&nbsp;&nbsp; {{movie.title}} &NewLine;&nbsp; &lt;/td&gt; &NewLine;&lt;/tr&gt; </code-example> Here, `movie` is a user-defined local variable. | <header>Input variables</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="local"></code-example> Angular has true template input variables that are explicitly defined using the `let` keyword. <br /> For more information, see the [Structural directive shorthand][AioGuideStructuralDirectivesStructuralDirectiveShorthand] section of [Structural Directives][AioGuideStructuralDirectives]. |
| <header>局部变量</header><code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in vm.movies"&gt; &NewLine;&nbsp; &lt;td&gt; &NewLine;&nbsp;&nbsp;&nbsp; {{movie.title}} &NewLine;&nbsp; &lt;/td&gt; &NewLine;&lt;/tr&gt; </code-example>在这里，`movie` 是用户定义的局部变量。 | <header>输入变量</header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="local"></code-example>Angular 具有使用 `let` 关键字显式定义的真正的模板输入变量。<br />有关更多信息，请参阅[结构型指令][AioGuideStructuralDirectives]的[结构型指令简写法][AioGuideStructuralDirectivesStructuralDirectiveShorthand]部分。 |

## Template directives

## 模板指令

AngularJS provides more than seventy built-in directives for templates.
Many of them are not needed in Angular because of its more capable and expressive binding system.
The following are some of the key AngularJS built-in directives and their equivalents in Angular.

AngularJS 为模板提供了七十多个内置指令。
在 Angular 中，它们很多都已经不需要了，因为 Angular 有了一个更加强大、快捷的绑定系统。
下面是一些 AngularJS 中的关键指令及其在 Angular 中的等价物。

### `ng-app` &rarr; bootstrapping

### `ng-app` → 引导

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-app</code></header> <code-example hideCopy format="html" language="html"> &lt;body ng-app="movieHunter"&gt; </code-example> The application startup process is called **bootstrapping**. <br /> Although you can bootstrap an AngularJS application in code, many applications bootstrap declaratively with the `ng-app` directive, giving it the name of the module (`movieHunter`) of the application. | <header>Bootstrapping</header> <code-example header="main.ts" format="typescript" hideCopy language="typescript" path="ajs-quick-reference/src/main.ts"></code-example> <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts" header="app.module.ts"></code-example> Angular does not have a bootstrap directive. To launch the application in code, explicitly bootstrap the root module (`AppModule`) of the application in `main.ts` and the root component (`AppComponent`) of the application in `app.module.ts`. |
| <header><code>ng-app</code></header><code-example hideCopy format="html" language="html"> &lt;body ng-app="movieHunter"&gt; </code-example>应用程序启动过程称为**引导**。<br />虽然你也可以在代码中引导 AngularJS 应用程序，但许多应用程序会使用 `ng-app` 指令以声明式进行引导，并为其提供应用程序模块的名称 ( `movieHunter` )。 | <header>引导</header><code-example header="main.ts" format="typescript" hideCopy language="typescript" path="ajs-quick-reference/src/main.ts"></code-example><code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts" header="app.module.ts"></code-example>Angular 没有 bootstrap 指令。要在代码中启动应用程序，请在 `app.module.ts` 中显式引导应用程序的根模块 ( `AppModule` ) 并在 `main.ts` 中显式引导应用程序的根组件 ( `AppComponent` )。 |

### `ng-class` → `ngClass`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-class</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-class="{active: isActive}"&gt; &NewLine; &lt;div ng-class="{active: isActive, shazam: isImportant}"&gt; </code-example> In AngularJS, the `ng-class` directive includes/excludes CSS classes based on an expression. The expression is often a key-value object, with key defined as a CSS class name, and value as a template expression that evaluates to a Boolean. <br /> In the first example, the `active` class is applied to the element if `isActive` is true. <br /> You can specify multiple classes, as shown in the second example. | <header><code>ngClass</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngClass"></code-example> In Angular, the `ngClass` directive works similarly. It includes/excludes CSS classes based on an expression. <br /> In the first example, the `active` class is applied to the element if `isActive` is true. <br /> You can specify multiple classes, as shown in the second example. <br /> Angular also has **class binding**, which is a good way to add or remove a single class, as shown in the third example. <br /> For more information see [Attribute, class, and style bindings][AioGuideAttributeBinding] page. |
| <header><code>ng-class</code></header><code-example hideCopy format="html" language="html"> &lt;div ng-class="{active: isActive}"&gt; &NewLine; &lt;div ng-class="{active: isActive, shazam: isImportant}"&gt; </code-example>在 AngularJS 中，`ng-class` 指令会根据表达式包含/排除 CSS 类。该表达式通常是一个键值控制对象，对象的每个键都定义为一个 CSS 类名，并且每个值都定义为估算为布尔值的模板表达式。<br />在第一个示例中，如果 `isActive` 为 true，则将 `active` 类应用于此元素。<br />你可以指定多个类，如第二个示例所示。 | <header><code>ngClass</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngClass"></code-example>在 Angular 中，`ngClass` 指令的工作方式类似。它基于表达式包含/排除 CSS 类。<br />在第一个示例中，如果 `isActive` 为 true，则将 `active` 类应用于元素。<br />你可以指定多个类，如第二个示例所示。<br />Angular 还具有**类绑定**，这是添加或删除单个类的好方法，如第三个示例所示。<br />有关更多信息，请参阅[属性、类和样式绑定][AioGuideAttributeBinding]页面。 |

### `ng-click` → Bind to the `click` event

### `ng-click` → 绑定到 `click` 事件

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-click</code></header> <code-example hideCopy format="html" language="html"> &lt;button ng-click="vm.toggleImage()"&gt; &NewLine; &lt;button ng-click="vm.toggleImage(&dollar;event)"&gt; </code-example> In AngularJS, the `ng-click` directive allows you to specify custom behavior when an element is clicked. <br /> In the first example, when the user clicks the button, the `toggleImage()` method in the controller referenced by the `vm` `controller as` alias is executed. <br /> The second example demonstrates passing in the `$event` object, which provides details about the event to the controller. | <header>Bind to the <code>click</code> event</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="event-binding"></code-example> AngularJS event-based directives do not exist in Angular. Rather, define one-way binding from the template view to the component using **event binding**. <br /> For event binding, define the name of the target event within parenthesis and specify a template statement, in quotes, to the right of the equals. Angular then sets up an event handler for the target event. When the event is raised, the handler executes the template statement. <br /> In the first example, when a user clicks the button, the `toggleImage()` method in the associated component is executed. <br /> The second example demonstrates passing in the `$event` object, which provides details about the event to the component. <br /> For a list of DOM events, see [Event reference][MdnDocsWebEvents]. <br /> For more information, see the [Event binding][AioGuideEventBinding] page. |
| <header><code>ng-click</code></header><code-example hideCopy format="html" language="html"> &lt;button ng-click="vm.toggleImage()"&gt; &NewLine; &lt;button ng-click="vm.toggleImage(&dollar;event)"&gt; </code-example>在 AngularJS 中，`ng-click` 指令允许你指定单击元素时的自定义行为。<br />在第一个示例中，当用户单击按钮时，会执行 `vm` `controller as` 别名引用的控制器中的 `toggleImage()` 方法。<br />第二个示例演示了传入 `$event` 对象，该对象会向控制器提供有关事件的详细信息。 | <header>绑定到<code>click</code>事件</header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="event-binding"></code-example>Angular 中不存在 AngularJS 基于事件的指令。相反，它使用**事件绑定**来定义从模板视图到组件的单向绑定。<br />对于事件绑定，请在括号中定义目标事件的名称，并在等号的右侧指定一个模板语句，用引号引起来。然后，Angular 为目标事件设置一个事件处理程序。引发事件时，处理程序会执行模板语句。<br />在第一个示例中，当用户单击按钮时，会执行关联组件中的 `toggleImage()` 方法。<br />第二个示例演示了传入 `$event` 对象，该对象会向组件提供有关事件的详细信息。<br />有关 DOM 事件的列表，请参阅[事件参考手册][MdnDocsWebEvents]。<br />有关更多信息，请参阅[事件绑定][AioGuideEventBinding]页面。 |

### `ng-controller` &rarr; component decorator

### `ng-controller` → 组件装饰器

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-controller</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-controller="MovieListCtrl as vm"&gt; </code-example> In AngularJS, the `ng-controller` directive attaches a controller to the view. Using the `ng-controller`, or defining the controller as part of the routing, ties the view to the controller code associated with that view. | <header>Component decorator</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example> In Angular, the template no longer specifies its associated controller. Rather, the component specifies its associated template as part of the component class decorator. <br /> For more information, see [Architecture Overview][AioGuideArchitectureComponents]. |
| <header><code>ng-controller</code></header><code-example hideCopy format="html" language="html"> &lt;div ng-controller="MovieListCtrl as vm"&gt; </code-example>在 AngularJS 中，`ng-controller` 指令会将控制器附加到视图。使用 `ng-controller`（或将控制器定义为路由的一部分）将视图绑定到与该视图关联的控制器代码。 | <header>组件装饰器</header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example>在 Angular 中，模板不需要再指定其关联的控制器。相反，组件将其关联的模板指定为组件类装饰器的一部分。<br />有关更多信息，请参阅[架构概览][AioGuideArchitectureComponents]。 |

### `ng-hide` → Bind to the `hidden` property

### `ng-hide` → 绑定到 `hidden` 属性

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-hide</code></header> In AngularJS, the `ng-hide` directive shows or hides the associated HTML element based on an expression. For more information, see [ng-show][AioGuideAjsQuickReferenceTemplateDirectives]. | <header>Bind to the <code>hidden</code> property</header> In Angular, you use property binding. Angular does not have a built-in *hide* directive. For more information, see [ng-show][AioGuideAjsQuickReferenceTemplateDirectives]. |
| <header><code>ng-hide</code></header>在 AngularJS 中，`ng-hide` 指令会根据表达式显示或隐藏关联的 HTML 元素。有关更多信息，请参阅[ng-show][AioGuideAjsQuickReferenceTemplateDirectives]。 | <header>绑定到<code>hidden</code>属性</header>在 Angular 中，你使用属性绑定；没有内置的*hide*指令。有关更多信息，请参阅[ng-show][AioGuideAjsQuickReferenceTemplateDirectives]。 |

### `ng-href` → Bind to the `href` property

### `ng-href` → 绑定到 `href` 属性

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-href</code></header> <code-example hideCopy format="html" language="html"> &lt;a ng-href="{{ angularDocsUrl }}"&gt; &NewLine; &nbsp; Angular Docs &NewLine; &lt;/a&gt; </code-example> The `ng-href` directive allows AngularJS to preprocess the `href` property. `ng-href` can replace the binding expression with the appropriate URL before the browser fetches from that URL. <br /> In AngularJS, the `ng-href` is often used to activate a route as part of navigation. <br /> <code-example hideCopy format="html" language="html"> &lt;a ng-href="#{{ moviesHash }}"&gt; &NewLine;&nbsp; Movies &NewLine;&lt;/a&gt; </code-example> Routing is handled differently in Angular. | <header>Bind to the <code>href</code> property</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="href"></code-example> Angular uses property binding. Angular does not have a built-in *href* directive. Place the `href` property of the element in square brackets and set it to a quoted template expression. For more information see the [Property binding][AioGuidePropertyBinding] page. In Angular, `href` is no longer used for routing. Routing uses `routerLink`, as shown in the following example. <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="router-link"></code-example> For more information on routing, see [Defining a basic route][AioGuideRouterDefiningABasicRoute] in the [Routing & Navigation][AioGuideRouter] page. |
| <header><code>ng-href</code></header><code-example hideCopy format="html" language="html"> &lt;a ng-href="{{ angularDocsUrl }}"&gt; &NewLine; &nbsp; Angular Docs &NewLine; &lt;/a&gt; </code-example>`ng-href` 指令允许 AngularJS 预处理 `href` 属性，以便在浏览器从 URL 获取之前，它可以用适当的 URL 替换绑定表达式。<br />在 AngularJS 中，`ng-href` 通常用于作为导航的一部分激活路由。<br /><code-example hideCopy format="html" language="html"> &lt;a ng-href="#{{ moviesHash }}"&gt; &NewLine;&nbsp; Movies &NewLine;&lt;/a&gt; </code-example>Angular 中路由的处理方式不同。 | <header>绑定到<code>href</code>属性</header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="href"></code-example>Angular 使用属性绑定；没有内置的*href*指令。将元素的 `href` 属性放在方括号中，并将其设置为带引号的模板表达式。有关更多信息，请参阅[属性绑定][AioGuidePropertyBinding]页面。在 Angular 中，`href` 不再用于路由。路由使用 `routerLink`，如下例所示。<code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="router-link"></code-example>有关路由的更多信息，请参阅[路由和导航][AioGuideRouter]页面中的[定义基本路由][AioGuideRouterDefiningABasicRoute]。 |

### `ng-if` → `*ngIf`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-if</code></header> <code-example hideCopy format="html" language="html"> &lt;table ng-if="movies.length"&gt; </code-example> In AngularJS, the `ng-if` directive removes or recreates a section of the DOM, based on an expression. If the expression is false, the element is removed from the DOM. <br /> In this example, the `<table>` element is removed from the DOM unless the `movies` array has a length greater than zero. | <header><code>\*ngIf</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngIf"></code-example> The `*ngIf` directive in Angular works the same as the `ng-if` directive in AngularJS. It removes or recreates a section of the DOM based on an expression. <br /> In this example, the `<table>` element is removed from the DOM unless the `movies` array has a length. <br /> The (`*`) before `ngIf` is required in this example. For more information, see [Structural Directives][AioGuideStructuralDirectives]. |
| <header><code>ng-if</code></header><code-example hideCopy format="html" language="html"> &lt;table ng-if="movies.length"&gt; </code-example>在 AngularJS 中，`ng-if` 指令会根据表达式删除或重新创建 DOM 的一部分。如果表达式为 false，则从 DOM 中删除该元素。<br />在此示例中，除非 `movies` 数组的长度大于零，否则 `<table>` 元素会从 DOM 中删除。 | <header><code>\*ngIf</code></header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngIf"></code-example>Angular 中的 `*ngIf` 指令与 AngularJS 中的 `ng-if` 指令相同。它根据表达式删除或重新创建 DOM 的一部分。<br />在此示例中，除非 `movies` 数组具有长度，否则 `<table>` 元素会从 DOM 中删除。<br />在此示例中，需要 `ngIf` 之前的 ( `*` )。有关更多信息，请参阅[结构指令][AioGuideStructuralDirectives]。 |

### `ng-model` → `ngModel`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-model</code></header> <code-example hideCopy format="html" language="html"> &lt;input ng-model="vm.favoriteHero" /&gt; </code-example> In AngularJS, the `ng-model` directive binds a form control to a property in the controller associated with the template. This provides **two-way binding** whereby changes result in the value in the view and the model being synchronized. | <header><code>ngModel</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngModel"></code-example> In Angular, **two-way binding** is indicatedr5t by `[()]`, descriptively referred to as a "banana in a box." This syntax is a shortcut for defining both:<ul><li>property binding, from the component to the view</li><li>event binding, from the view to the component</li></ul> thereby providing two-way binding. <br /> For more information on two-way binding with `ngModel`, see the [Displaying and updating properties with `ngModel`][AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel] section of [Built-in directives][AioGuideBuiltInDirectives]. |
| <header><code>ng-model</code></header><code-example hideCopy format="html" language="html"> &lt;input ng-model="vm.favoriteHero" /&gt; </code-example>在 AngularJS 中，`ng-model` 指令将表单控件绑定到控制器中与模板关联的属性。这提供了**双向绑定**，任何更改都会让视图与模型保持同步。 | <header><code>ngModel</code></header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngModel"></code-example>在 Angular 中，**双向绑定**由 `[()]` 表示，形象的称之为“盒子里的香蕉”。此语法是一种快捷方式：<ul><li>从组件到视图的属性绑定</li><li>从视图到组件的事件绑定</li></ul>，从而提供了双向绑定。<br />有关使用 `ngModel` 的双向绑定的更多信息，请参阅[内置指令][AioGuideBuiltInDirectives]的[使用 `ngModel` 显示和更新属性][AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]部分。 |

### `ng-repeat` → `*ngFor`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-repeat</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in vm.movies"&gt; </code-example> In AngularJS, the `ng-repeat` directive repeats the associated DOM element for each item in the specified collection. <br /> In this example, the table row (`<tr>`) element repeats for each movie object in the collection of movies. | <header><code>\*ngFor</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngFor"></code-example> The `*ngFor` directive in Angular is like the `ng-repeat` directive in AngularJS. It repeats the associated DOM element for each item in the specified collection. More accurately, it turns the defined element (`<tr>` in this example) and its contents into a template and uses that template to instantiate a view for each item in the list. <br /> Notice the other syntax differences: <ul><li>The (`*`) before `ngFor` is required</li><li>The `let` keyword identifies `movie` as an input variable</li><li>The list preposition is `of`, not `in`</li></ul>For more information, see [Structural Directives][AioGuideStructuralDirectives]. |
| <header><code>ng-repeat</code></header><code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in vm.movies"&gt; </code-example>在 AngularJS 中，`ng-repeat` 指令为指定集合中的每个条目复写关联的 DOM 元素。<br />在此示例中，表行 ( `<tr>` ) 元素会为电影集合中的每个电影对象复写。 | <header><code>\*ngFor</code></header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngFor"></code-example>Angular 中的 `*ngFor` 指令类似于 AngularJS 中的 `ng-repeat` 指令。它为指定集合中的每个条目重复关联的 DOM 元素。更准确地说，它将定义的元素（在此示例中为 `<tr>`）及其内容转换为模板，并使用该模板为列表中的每个条目实例化一个视图。<br />请注意其他语法区别：`ngFor` 之前的 ( `*` ) 是必需的； `let` 关键字将 `movie` 标识为输入变量；列表介词是 `of`，而不是 `in`。<br />有关更多信息，请参阅[结构指令][AioGuideStructuralDirectives]。 |

### `ng-show` → Bind to the `hidden` property

### `ng-show` → 绑定到 `hidden` 属性

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-show</code></header> <code-example hideCopy format="html" language="html"> &lt;h3 ng-show="vm.favoriteHero"&gt; &NewLine; &nbsp; Your favorite hero is: {{vm.favoriteHero}} &NewLine; &lt;/h3&gt; </code-example> In AngularJS, the `ng-show` directive shows or hides the associated DOM element, based on an expression. <br /> In this example, the `<div>` element is shown if the `favoriteHero` variable is truthy. | <header>Bind to the <code>hidden</code> property</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="hidden"></code-example> Angular uses property binding. Angular has no built-in *show* directive. For hiding and showing elements, bind to the HTML `hidden` property. <br /> To conditionally display an element the `hidden` property of the element can be used. Place the `hidden` property in square brackets and set it to a quoted template expression that evaluates to the *opposite* of *show*. <br /> In this example, the `<div>` element is hidden if the `favoriteHero` variable is not truthy. <br /> For more information on property binding, see the [Property binding][AioGuidePropertyBinding] page. |
| <header><code>ng-show</code></header><code-example hideCopy format="html" language="html"> &lt;h3 ng-show="vm.favoriteHero"&gt; &NewLine; &nbsp; Your favorite hero is: {{vm.favoriteHero}} &NewLine; &lt;/h3&gt; </code-example>在 AngularJS 中，`ng-show` 指令会根据表达式显示或隐藏关联的 DOM 元素。<br />在此示例中，如果 `favoriteHero` 变量为真值，则会显示 `<div>` 元素。 | <header>绑定到<code>hidden</code>属性</header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="hidden"></code-example>Angular 使用属性绑定；没有内置的*show*指令。要隐藏和显示元素，请绑定到 HTML 的 `hidden` 属性。<br />要有条件地显示一个元素，请将元素的 `hidden` 属性放在方括号中，并将其设置为带引号的模板表达式，该表达式的值为*show*的*相反*。<br />在此示例中，如果 `favoriteHero` 变量不是真值，则 `<div>` 元素会被隐藏。<br />有关属性绑定的更多信息，请参阅[属性绑定][AioGuidePropertyBinding]页面。 |

### `ng-src` → Bind to the `src` property

### `ng-src` → 绑定到 `src` 属性

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-src</code></header> <code-example hideCopy format="html" language="html"> &lt;img ng-src="{{movie.imageurl}}"&gt; </code-example> The `ng-src` directive allows AngularJS to preprocess the `src` property. This replaces the binding expression with the appropriate URL before the browser fetches from that URL. | <header>Bind to the <code>src</code> property</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="src"></code-example> Angular uses property binding. Angular has no built-in *src* directive. Place the `src` property in square brackets and set it to a quoted template expression. <br /> For more information on property binding, see the [Property binding][AioGuidePropertyBinding] page. |
| <header><code>ng-src</code></header><code-example hideCopy format="html" language="html"> &lt;img ng-src="{{movie.imageurl}}"&gt; </code-example>`ng-src` 指令允许 AngularJS 预处理 `src` 属性，以便在浏览器从 URL 获取之前，它可以用适当的 URL 替换绑定表达式。 | <header>绑定到<code>src</code>属性</header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="src"></code-example>Angular 使用属性绑定；没有内置的*src*指令。将 `src` 属性放在方括号中，并将其设置为带引号的模板表达式。<br />有关属性绑定的更多信息，请参阅[属性绑定][AioGuidePropertyBinding]页面。 |

### `ng-style` → `ngStyle`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-style</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-style="{color: colorPreference}"&gt; </code-example> In AngularJS, the `ng-style` directive sets a CSS style on an HTML element based on an expression. That expression is often a key-value control object with: <ul><li> each key of the object defined as a CSS property</li><li>each value defined as an expression that evaluates to a value appropriate for the style</li></ul> In the example, the `color` style is set to the current value of the `colorPreference` variable. | <header><code>ngStyle</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngStyle"></code-example> In Angular, the `ngStyle` directive works similarly. It sets a CSS style on an HTML element based on an expression. <br /> In the first example, the `color` style is set to the current value of the `colorPreference` variable. <br /> Angular also has **style binding**, which is good way to set a single style. This is shown in the second example. <br /> For more information on style binding, see the [Style binding][AioGuideAttributeBindingBindingToTheStyleAttribute] section of the [Attribute binding][AioGuideAttributeBinding] page. <br /> For more information on the `ngStyle` directive, see the [NgStyle][AioGuideBuiltInDirectivesSettingInlineStylesWithNgstyle] section of the [Built-in directives][AioGuideBuiltInDirectives] page. |
| <header><code>ng-style</code></header><code-example hideCopy format="html" language="html"> &lt;div ng-style="{color: colorPreference}"&gt; </code-example>在 AngularJS 中，`ng-style` 指令会根据表达式在 HTML 元素上设置 CSS 样式。该表达式通常是一个键值控制对象，对象的每个键都定义为 CSS 属性，并且每个值都定义为一个表达式，可以估算为控制何时应用该风格的值。<br />在此示例中，`color` 样式设置成了 `colorPreference` 变量的当前值。 | <header><code>ngStyle</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngStyle"></code-example>在 Angular 中，`ngStyle` 指令的工作方式类似。它根据表达式在 HTML 元素上设置 CSS 样式。<br />在第一个示例中，`color` 风格设置为 `colorPreference` 变量的当前值。<br />Angular 还具有**样式绑定**，这是设置单个样式的好方法。这在第二个示例中显示。<br />有关样式绑定的更多信息，请参阅[属性绑定][AioGuideAttributeBinding]页面的[样式绑定][AioGuideAttributeBindingBindingToTheStyleAttribute]部分。<br />有关 `ngStyle` 指令的更多信息，请参阅[内置指令][AioGuideBuiltInDirectives]页面的[NgStyle][AioGuideBuiltInDirectivesSettingInlineStylesWithNgstyle]部分。 |

### `ng-switch` → `ngSwitch`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>ng-switch</code></header> <code-example hideCopy format="html" language="html"> &lt;div ng-switch="vm.favoriteHero &amp;&amp; vm.checkMovieHero(vm.favoriteHero)"&gt; &NewLine; &nbsp; &lt;div ng-switch-when="true"&gt; &NewLine; &nbsp; &nbsp; Excellent choice. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &nbsp; &lt;div ng-switch-when="false"&gt; &NewLine; &nbsp; &nbsp; No movie, sorry. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &nbsp; &lt;div ng-switch-default&gt; &NewLine; &nbsp; &nbsp; Please enter your favorite hero. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &lt;/div&gt; </code-example> In AngularJS, the `ng-switch` directive swaps the contents of an element by selecting one of the templates based on the current value of an expression. <br /> In this example, if `favoriteHero` is not set, the template displays "Please enter …". If `favoriteHero` is set, it checks the movie hero by calling a controller method. If that method returns `true`, the template displays "Excellent choice!". If that methods returns `false`, the template displays "No movie, sorry!". | <header><code>ngSwitch</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngSwitch"></code-example> In Angular, the `ngSwitch` directive works similarly. It displays an element whose `*ngSwitchCase` matches the current `ngSwitch` expression value. <br /> In this example, if `favoriteHero` is not set, the `ngSwitch` value is `null` and `*ngSwitchDefault` displays, "Please enter your favorite hero." If `favoriteHero` is set, the application checks the movie hero by calling a component method. If that method returns `true`, the application selects `*ngSwitchCase="true"` and displays: "Excellent choice!" If that methods returns `false`, the application selects `*ngSwitchCase="false"` and displays: "No movie, sorry!" <br /> The (`*`) before `ngSwitchCase` and `ngSwitchDefault` is required in this example. <br /> For more information, see [The NgSwitch directives][AioGuideBuiltInDirectivesSwitchingCasesWithNgswitch] section of the [Built-in directives][AioGuideBuiltInDirectives] page. |
| <header><code>ng-switch</code></header><code-example hideCopy format="html" language="html"> &lt;div ng-switch="vm.favoriteHero &amp;&amp; vm.checkMovieHero(vm.favoriteHero)"&gt; &NewLine; &nbsp; &lt;div ng-switch-when="true"&gt; &NewLine; &nbsp; &nbsp; Excellent choice. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &nbsp; &lt;div ng-switch-when="false"&gt; &NewLine; &nbsp; &nbsp; No movie, sorry. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &nbsp; &lt;div ng-switch-default&gt; &NewLine; &nbsp; &nbsp; Please enter your favorite hero. &NewLine; &nbsp; &lt;/div&gt; &NewLine; &lt;/div&gt; </code-example>在 AngularJS 中，`ng-switch` 指令通过根据表达式的当前值选择模板之一来切换元素的内容。<br />在此示例中，如果未设置 `favoriteHero`，则模板会显示“Please enter your favorite hero.”。如果设置了 `favoriteHero`，它会通过调用控制器方法来检查电影英雄。如果该方法返回 `true`，则模板会显示“Excellent choice!”。如果该方法返回 `false`，则模板会显示“No movie, sorry!”。 | <header><code>ngSwitch</code></header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngSwitch"></code-example>在 Angular 中，`ngSwitch` 指令的工作方式类似。它显示一个元素，其 `*ngSwitchCase` 与当前的 `ngSwitch` 表达式值匹配。<br />在此示例中，如果未设置 `favoriteHero`，则 `ngSwitch` 的值为 `null`，并且 `*ngSwitchDefault` 显示“Please enter …”。如果设置了 `favoriteHero`，应用程序会通过调用组件方法来检查电影英雄。如果该方法返回 `true`，则应用程序会选择 `*ngSwitchCase="true"` 并显示：“Excellent choice!”如果该方法返回 `false`，则应用程序会选择 `*ngSwitchCase="false"` 并显示：“No movie, sorry!”<br />在此示例中，需要 `ngSwitchCase` 和 `ngSwitchDefault` 之前的 ( `*` )。<br />有关更多信息，请参阅[内置指令][AioGuideBuiltInDirectives]页面[的 NgSwitch 指令][AioGuideBuiltInDirectivesSwitchingCasesWithNgswitch]部分。 |

## Filters / pipes

## 过滤器/管道

Angular **pipes** provide formatting and transformation for data in the template, like AngularJS **filters**.
Many of the built-in filters in AngularJS have corresponding pipes in Angular.
For more information on pipes, see [Pipes][AioGuidePipes].

Angular 中的**管道**为模板提供了格式化和数据转换功能，类似于 AngularJS 中的**过滤器**。
AngularJS 中的很多内置过滤器在 Angular 中都有对应的管道。
要了解管道的更多信息，参阅[Pipes][AioGuidePipes]。

### `currency` → `currency`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>currency</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.price &verbar; currency}} &NewLine; &lt;/td&gt; </code-example> Formats a number as currency. | <header><code>currency</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="currency"></code-example> The Angular `currency` pipe is similar although some of the parameters have changed. |
| <header><code>currency</code></header><code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.price &verbar; currency}} &NewLine; &lt;/td&gt; </code-example>将数字格式化为货币。 | <header><code>currency</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="currency"></code-example>尽管某些参数发生了更改，但 Angular `currency` 管道是相似的。 |

### `date` → `date`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>date</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.releaseDate &verbar; date}} &NewLine; &lt;/td&gt; </code-example> Formats a date to a string based on the requested format. | <header><code>date</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="date"></code-example> The Angular `date` pipe is similar. |
| <header><code>date</code></header><code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.releaseDate &verbar; date}} &NewLine; &lt;/td&gt; </code-example>根据请求的格式将日期格式化为字符串。 | <header><code>date</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="date"></code-example>Angular `date` 管道是类似的。 |

### `filter` → none

### `filter` → 无

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>filter</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; filter: {title:listFilter}"&gt; </code-example> Selects a subset of items from the defined collection, based on the filter criteria. | <header>none</header> For performance reasons, no comparable pipe exists in Angular. Do all your filtering in the component. If you need the same filtering code in several templates, consider building a custom pipe. |
| <header><code>filter</code></header><code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; filter: {title:listFilter}"&gt; </code-example>根据过滤条件从定义的集合中选择项目的子集。 | <header>无</header>出于性能原因，Angular 中不存在可类比的管道。请在组件中进行所有过滤。如果你在多个模板中需要相同的过滤代码，请考虑构建自定义管道。 |

### `json` → `json`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>json</code></header> <code-example hideCopy format="html" language="html"> &lt;pre&gt; &NewLine; &nbsp; {{movie &verbar; json}} &NewLine; &lt;/pre&gt; </code-example> Converts a JavaScript object into a JSON string. This is useful for debugging. | <header><code>json</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="json"></code-example> The Angular [`json`][AioApiCommonJsonpipe] pipe does the same thing. |
| <header><code>json</code></header><code-example hideCopy format="html" language="html"> &lt;pre&gt; &NewLine; &nbsp; {{movie &verbar; json}} &NewLine; &lt;/pre&gt; </code-example>将 JavaScript 对象转换为 JSON 字符串。这对于调试很有用。 | <header><code>json</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="json"></code-example>Angular [`json`][AioApiCommonJsonpipe]管道做同样的事情。 |

### `limitTo` → `slice`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>limitTo</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; limitTo:2:0"&gt; </code-example> Selects up to the first parameter `2` number of items from the collection starting optionally at the beginning index `0`. | <header><code>slice</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="slice"></code-example> The `SlicePipe` does the same thing but the *order of the parameters is reversed*, in keeping with the JavaScript `Slice` method. The first parameter is the starting index and the second is the limit. As in AngularJS, coding this operation within the component instead could improve performance. |
| <header><code>limitTo</code></header><code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; limitTo:2:0"&gt; </code-example>从开始索引 `0` 处开始（可选）的集合中选择最多第一个参数 `2` 的条目。 | <header><code>slice</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="slice"></code-example>`SlicePipe` 做同样的事情，但*参数的顺序是相反*的，与 JavaScript `Slice` 方法保持一致。第一个参数是起始索引，第二个是限长。与在 AngularJS 中一样，在组件中对此操作进行编码可以提高性能。 |

### `lowercase` → `lowercase`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>lowercase</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; lowercase}} &NewLine; &lt;/td&gt; </code-example> Converts the string to lowercase. | <header><code>lowercase</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="lowercase"></code-example> The Angular `lowercase` pipe does the same thing. |
| <header><code>lowercase</code></header><code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; lowercase}} &NewLine; &lt;/td&gt; </code-example>将字符串转换为小写。 | <header><code>lowercase</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="lowercase"></code-example>Angular `lowercase` 管道做同样的事情。 |

### `number` → `number`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>number</code></header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.starRating &verbar; number}} &NewLine; &lt;/td&gt; </code-example> Formats a number as text. | <header><code>number</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="number"></code-example> The Angular [`number`][AioApiCommonDecimalpipe] pipe is similar. It provides more capabilities when defining the decimal places, as shown in the preceding second example. <br /> Angular also has a `percent` pipe, which formats a number as a local percentage as shown in the third example. |
| <header><code>number</code></header><code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.starRating &verbar; number}} &NewLine; &lt;/td&gt; </code-example>将数字格式化为文本。 | <header><code>number</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="number"></code-example>Angular [`number`][AioApiCommonDecimalpipe]管道是类似的。它在定义小数位时提供了更多特性，如上面的第二个示例所示。<br />Angular 还有一个 `percent` 管道，它将数字格式化为本地百分比，如第三个示例所示。 |

### `orderBy` → none

### `orderBy` → 无

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>orderBy</code></header> <code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; orderBy : 'title'"&gt; </code-example> Displays the collection in the order specified by the expression. In this example, the movie title orders the `movieList`. | <header>none</header> For performance reasons, no comparable pipe exists in Angular. Instead, use component code to order or sort results. If you need the same ordering or sorting code in several templates, consider building a custom pipe. |
| <header><code>orderBy</code></header><code-example hideCopy format="html" language="html"> &lt;tr ng-repeat="movie in movieList &verbar; orderBy : 'title'"&gt; </code-example>按表达式指定的顺序显示集合。在此示例中，电影标题会按 `movieList` 的顺序。 | <header>无</header>出于性能原因，Angular 中不存在可类比的管道。相反，请使用组件代码对结果进行排序或排序。如果你需要在多个模板中使用相同的排序或排序代码，请考虑构建自定义管道。 |

## Modules / controllers / components

## 模块/控制器/组件

In both AngularJS and Angular, modules help you organize your application into cohesive blocks of features.

无论在 AngularJS 还是 Angular 中，“模块”都会帮你把应用拆分成一些内聚的功能块。

In AngularJS, you write the code that provides the model and the methods for the view in a **controller**.
In Angular, you build a **component**.

在 AngularJS 中，你要在**控制器**中写代码，来为视图提供模型和方法。在 Angular 中，你要创建**组件**。

Because much AngularJS code is in JavaScript, JavaScript code is shown in the AngularJS column.
The Angular code is shown using TypeScript.

因为很多 AngularJS 的代码是用 JavaScript 写的，所以在 AngularJS 列显示的是 JavaScript 代码，而 Angular 列显示的是 TypeScript 代码。

### Immediately invoked function expression (IIFE) &rarr; none

### 即刻调用函数表达式（IIFE） → 无

| AngularJS | Angular |
| :-------- | :------ |
| <header>IIFE</header> <code-example hideCopy format="typescript" language="typescript"> ( &NewLine;&nbsp; function () { &NewLine;&nbsp;&nbsp;&nbsp; &hellip; &NewLine;&nbsp; }() &NewLine;); </code-example> In AngularJS, an IIFE around controller code keeps it out of the global namespace. | <header>none</header> This is a nonissue in Angular because ES 2015 modules handle the namespace for you. <br /> For more information on modules, see the [Modules][AioGuideArchitectureModules] section of the [Architecture Overview][AioGuideArchitecture]. |
| <header>IIFE</header><code-example hideCopy format="typescript" language="typescript"> ( &NewLine;&nbsp; function () { &NewLine;&nbsp;&nbsp;&nbsp; &hellip; &NewLine;&nbsp; }() &NewLine;); </code-example>在 AngularJS 中，IIFE 会围绕控制器代码，以将其排除在全局命名空间之外。 | <header>无</header>这在 Angular 中不是问题，因为 ES 2015 模块会为你处理命名空间。<br />有关模块的更多信息，请参阅[架构概览][AioGuideArchitecture]的[模块][AioGuideArchitectureModules]部分。 |

### Angular modules → `NgModules`

### Angular 模块 → `NgModules`

| AngularJS | Angular |
| :-------- | :------ |
| <header>Angular modules</header> <code-example hideCopy format="typescript" language="typescript"> angular .module( &NewLine;&nbsp; "movieHunter", &NewLine;&nbsp; [ &NewLine;&nbsp;&nbsp;&nbsp; "ngRoute" &NewLine;&nbsp; ] &NewLine;); </code-example> In AngularJS, an Angular module keeps track of controllers, services, and other code. The second argument defines the list of other modules that this module depends upon. | <header><code>NgModules</code></header> <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts"></code-example> NgModules, defined with the `NgModule` decorator, serve the same purpose: <ul> <li>`imports`: specifies the list of other modules that this module depends upon</li> <li>`declaration`: keeps track of your components, pipes, and directives.</li> </ul> For more information on modules, see [NgModules][AioGuideNgmodules]. |
| <header>Angular 模块</header><code-example hideCopy format="typescript" language="typescript"> angular .module( &NewLine;&nbsp; "movieHunter", &NewLine;&nbsp; [ &NewLine;&nbsp;&nbsp;&nbsp; "ngRoute" &NewLine;&nbsp; ] &NewLine;); </code-example>在 AngularJS 中，Angular 模块会跟踪控制器、服务和其他代码。第二个参数定义此模块依赖的其他模块的列表。 | <header><code>NgModules</code></header><code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts"></code-example>使用 `NgModule` 装饰器定义的 NgModules 具有相同的目的：<ul><li>`imports` ：指定此模块依赖的其他模块的列表</li><li>`declaration` : 跟踪你的组件、管道和指令。</li></ul>有关模块的更多信息，请参阅[NgModules][AioGuideNgmodules]。 |

### Controller registration &rarr; component decorator

### 控制器注册 → 组件装饰器

| AngularJS | Angular |
| :-------- | :------ |
| <header>Controller registration</header> <code-example hideCopy format="typescript" language="typescript"> angular .module( &NewLine;&nbsp; "movieHunter" &NewLine;) .controller( &NewLine;&nbsp; "MovieListCtrl", &NewLine;&nbsp; [ &NewLine;&nbsp;&nbsp;&nbsp; "movieService", &NewLine;&nbsp;&nbsp;&nbsp; MovieListCtrl &NewLine;&nbsp; ] &NewLine;); </code-example> AngularJS has code in each controller that looks up an appropriate Angular module and registers the controller with that module. <br /> The first argument is the controller name. The second argument defines the string names of all dependencies injected into this controller, and a reference to the controller function. | <header>Component decorator</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example> Angular adds a decorator to the component class to provide any required metadata. The `@Component` decorator declares that the class is a component and provides metadata about that component such as its selector, or tag, and its template. <br /> This is how you associate a template with logic, which is defined in the component class. <br /> For more information, see the [Components][AioGuideArchitectureComponents] section of the [Architecture Overview][AioGuideArchitecture] page. |
| <header>控制器注册</header><code-example hideCopy format="typescript" language="typescript"> angular .module( &NewLine;&nbsp; "movieHunter" &NewLine;) .controller( &NewLine;&nbsp; "MovieListCtrl", &NewLine;&nbsp; [ &NewLine;&nbsp;&nbsp;&nbsp; "movieService", &NewLine;&nbsp;&nbsp;&nbsp; MovieListCtrl &NewLine;&nbsp; ] &NewLine;); </code-example>AngularJS 在每个控制器中都有代码，可以查找适当的 Angular 模块并将控制器注册到该模块。<br />第一个参数是控制器名称。第二个参数定义注入此控制器的所有依赖项的字符串名称，以及对控制器函数的引用。 | <header>组件装饰器</header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example>Angular 向组件类添加了一个装饰器，以提供任何所需的元数据。`@Component` 装饰器声明类是组件，并提供有关该组件的元数据，例如其选择器（或标签）和模板。<br />这就是你将模板与组件类中定义的逻辑关联起来的方式。<br />有关更多信息，请参阅[架构概览][AioGuideArchitecture]页面的[组件][AioGuideArchitectureComponents]部分。 |

### Controller function &rarr; component class

### 控制器函数 → 组件类

| AngularJS | Angular |
| :-------- | :------ |
| <header>Controller function</header> <code-example hideCopy format="typescript" language="typescript"> function MovieListCtrl(movieService) { &NewLine; } </code-example> In AngularJS, you write the code for the model and methods in a controller function. | <header>Component class</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="class"></code-example> In Angular, you create a component class to contain the data model and control methods. Use the TypeScript <code>export</code> keyword to export the class so that the component can be imported into NgModules. <br /> For more information, see the [Components][AioGuideArchitectureComponents] section of the [Architecture Overview][AioGuideArchitecture] page. |
| <header>Controller 函数</header><code-example hideCopy format="typescript" language="typescript"> function MovieListCtrl(movieService) { &NewLine; } </code-example>在 AngularJS 中，你在控制器函数中为模型和方法编写代码。 | <header>组件类</header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="class"></code-example>在 Angular 中，你创建一个组件类来包含数据模型和控制方法。使用 TypeScript <code>export</code> 关键字来导出类，以便可以将特性导入 NgModules。<br />有关更多信息，请参阅[架构概览][AioGuideArchitecture]页面的[组件][AioGuideArchitectureComponents]部分。 |

### Dependency injection &rarr; dependency injection

### 依赖注入 → 依赖注入

| AngularJS | Angular |
| :-------- | :------ |
| <header>Dependency injection</header> <code-example hideCopy format="typescript" language="typescript"> MovieListCtrl.&dollar;inject = [ &NewLine;&nbsp; 'MovieService' &NewLine;]; &NewLine;function MovieListCtrl(movieService) { &NewLine;} </code-example> In AngularJS, you pass in any dependencies as controller function arguments. This example injects a `MovieService`. <br /> To guard against minification problems, tell Angular explicitly that it should inject an instance of the `MovieService` in the first parameter. | <header>Dependency injection</header> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="di"></code-example> In Angular, you pass in dependencies as arguments to the component class constructor. This example injects a `MovieService`. The TypeScript type of the first parameter tells Angular what to inject, even after minification. <br /> For more information, see the [Dependency injection][AioGuideArchitectureServicesAndDependencyInjection] section of the [Architecture Overview][AioGuideArchitecture]. |
| <header>依赖注入</header><code-example hideCopy format="typescript" language="typescript"> MovieListCtrl.&dollar;inject = [ &NewLine;&nbsp; 'MovieService' &NewLine;]; &NewLine;function MovieListCtrl(movieService) { &NewLine;} </code-example>在 AngularJS 中，你将任何依赖项作为控制器函数参数传入。此示例注入 `MovieService`。<br />为了防止最小化时出现问题，请显式告诉 Angular 它应该在第一个参数中注入一个 `MovieService` 实例。 | <header>依赖注入</header><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="di"></code-example>在 Angular 中，你将依赖项作为参数传递给组件类构造函数。此示例注入 `MovieService`。第一个参数的 TypeScript 类型告诉 Angular 要注入什么，即使是在缩小之后。<br />有关更多信息，请参阅[架构概览][AioGuideArchitecture]的[依赖注入][AioGuideArchitectureServicesAndDependencyInjection]部分。 |

## Style sheets

## 样式表

Style sheets give your application a nice look.
In AngularJS, you specify the style sheets for your entire application.
As the application grows over time, the styles for the many parts of the application merge, which can cause unexpected results.
In Angular, you can still define style sheets for your entire application.
Now you can also encapsulate a style sheet within a specific component.

样式表让你的应用程序看起来更漂亮。
在 AngularJS 中，你要为整个应用程序指定样式表。
随着应用程序的不断成长，为各个部分指定的样式会被合并，导致无法预计的后果。
在 Angular 中，你仍然要为整个应用程序定义样式，不过现在也可以把样式表封装在特定的组件中。

### `Link` tag → `styles` configuration or `styleUrls`

### `Link` 标签 → `styles` 配置或 `styleUrls`

| AngularJS | Angular |
| :-------- | :------ |
| <header><code>Link</code> tag</header> <code-example hideCopy format="html" language="html"> &lt;link href="styles.css" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; rel="stylesheet" /&gt; </code-example> AngularJS, uses a `link` tag in the head section of the `index.html` file to define the styles for the application. | <header><code>styles</code> configuration</header> <code-example hideCopy path="ajs-quick-reference/.angular-cli.1.json" region="styles"></code-example> With the Angular CLI, you can configure your global styles in the `angular.json` file. You can rename the extension to `.scss` to use sass. <br /><br /> <header><code>styleUrls</code></header> In Angular, you can use the `styles` or `styleUrls` property of the `@Component` metadata to define a style sheet for a particular component. <br /> <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="style-url"></code-example> This allows you to set appropriate styles for individual components that do not leak into other parts of the application. |
| <header><code>Link</code>标签</header><code-example hideCopy format="html" language="html"> &lt;link href="styles.css" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; rel="stylesheet" /&gt; </code-example>AngularJS 使用 `index.html` 文件 head 中的 `link` 标签来定义应用程序的样式。 | <header><code>styles</code>配置</header><code-example hideCopy path="ajs-quick-reference/.angular-cli.1.json" region="styles"></code-example>使用 Angular CLI，你可以在 `angular.json` 文件中配置你的全局样式。你可以将扩展名重命名为 `.scss` 以使用 sass。<br /><br /><header><code>styleUrls</code></header>在 Angular 中，你可以用 `@Component` 元数据的 style 或 `styleUrls` 属性来为特定组件定义 `styles` 表。<br /><code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="style-url"></code-example>这允许你为不会泄漏到应用程序其他部分的单个组件设置适当的样式。 |

<!-- links -->

[AioApiCommonDecimalpipe]: api/common/DecimalPipe "DecimalPipe | @angular/common - API | Angular"

[AioApiCommonJsonpipe]: api/common/JsonPipe "JsonPipe | @angular/common - API | Angular"

[AioGuideAjsQuickReferenceFiltersPipes]: guide/ajs-quick-reference#filters--pipes "Filters/pipes - AngularJS to Angular concepts: Quick reference | Angular"
[AioGuideAjsQuickReferenceTemplateDirectives]: guide/ajs-quick-reference#template-directives "Template directives - AngularJS to Angular concepts: Quick reference | Angular"

[AioGuideArchitecture]: guide/architecture "Introduction to Angular concepts | Angular"

[AioGuideArchitectureComponents]: guide/architecture#components "Components - Introduction to Angular concepts | Angular"

[AioGuideArchitectureModules]: guide/architecture#modules "Modules - Introduction to Angular concepts | Angular"

[AioGuideArchitectureServicesAndDependencyInjection]: guide/architecture#services-and-dependency-injection "Services and dependency injection - Introduction to Angular concepts | Angular"

[AioGuideAttributeBinding]: guide/attribute-binding "Attribute, class, and style bindings | Angular"

[AioGuideAttributeBindingBindingToTheStyleAttribute]: guide/class-binding "Class and style binding | Angular"

[AioGuideBuiltInDirectives]: guide/built-in-directives "Built-in directives | Angular"

[AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]: guide/built-in-directives#displaying-and-updating-properties-with-ngmodel "Displaying and updating properties with ngModel - Built-in directives | Angular"

[AioGuideBuiltInDirectivesSettingInlineStylesWithNgstyle]: guide/built-in-directives#setting-inline-styles-with-ngstyle "Setting inline styles with NgStyle - Built-in directives | Angular"

[AioGuideBuiltInDirectivesSwitchingCasesWithNgswitch]: guide/built-in-directives#switching-cases-with-ngswitch "Switching cases with NgSwitch - Built-in directives | Angular"

[AioGuideEventBinding]: guide/event-binding "Event binding | Angular"

[AioGuideInterpolation]: guide/interpolation "Text interpolation | Angular"

[AioGuideNgmodules]: guide/ngmodules "NgModules | Angular"

[AioGuidePipes]: guide/pipes "Transforming Data Using Pipes | Angular"

[AioGuidePropertyBinding]: guide/property-binding "Property binding | Angular"

[AioGuideRouter]: guide/router "Common Routing Tasks | Angular"

[AioGuideRouterDefiningABasicRoute]: guide/router#defining-a-basic-route "Defining a basic route - Common Routing Tasks | Angular"

[AioGuideStructuralDirectives]: guide/structural-directives "Writing structural directives | Angular"

[AioGuideStructuralDirectivesStructuralDirectiveShorthand]: guide/structural-directives#structural-directive-shorthand "Structural directive shorthand - Writing structural directives | Angular"

<!-- external links -->

[MdnDocsWebEvents]: https://developer.mozilla.org/docs/Web/Events "Event reference | MDN"

<!-- end links -->

@reviewed 2022-02-28