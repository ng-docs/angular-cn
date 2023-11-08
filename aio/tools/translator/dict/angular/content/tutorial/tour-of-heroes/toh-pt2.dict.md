Display a selection list

显示英雄列表

This tutorial shows you how to:

本教程向你展示了如何：

Expand the Tour of Heroes application to display a list of heroes.

展开《英雄之旅》应用以显示英雄列表。

Allow users to select a hero and display the hero's details.

允许用户选择英雄并显示英雄的详细信息。

Create mock heroes

创建模拟（mock）的英雄数据

The first step is to create some heroes to display.

第一步是创建一些要显示的英雄。

Create a file called `mock-heroes.ts` in the `src/app/` directory.
Define a `HEROES` constant as an array of ten heroes and export it.
The file should look like this.

在 `src/app/` 目录下创建一个名叫 `mock-heroes.ts` 的文件。定义一个包含十个英雄的常量数组 `HEROES`，并导出它。该文件是这样的。

Displaying heroes

显示这些英雄

Open the `HeroesComponent` class file and import the mock `HEROES`.

打开 `HeroesComponent` 类文件，并导入模拟的 `HEROES`。

In `HeroesComponent` class, define a component property called `heroes` to expose the `HEROES` array for binding.

往类中添加一个 `heroes` 属性，这样可以暴露出这个 `HEROES` 数组，以供绑定。

List heroes with `*ngFor`

使用 `*ngFor` 列出这些英雄

Open the `HeroesComponent` template file and make the following changes:

打开 `HeroesComponent` 的模板文件，并做如下修改：

Add an `<h2>` at the top.

在顶部添加 `<h2>`，。

Below the `<h2>`, add a `<ul>` element.

在 `<h2>` 下方，添加 `<ul>` 元素。

In the `<ul>` element, insert an `<li>`.

在 `<ul>` 元素中，插入 `<li>`。

Place a `<button>` inside the `<li>` that displays properties of a `hero` inside `<span>` elements.

在 `<li>` 中放一个 `<button>` 元素，以便在 `<span>` 元素中显示单个 `hero` 的属性。

Add CSS classes to style the component.

添加 CSS 类以设置组件的样式。

to look like this:

做完之后应该是这样的：

That displays an error since the `hero` property doesn't exist.
To have access to each individual hero and list them all, add an `*ngFor` to the `<li>` to iterate through the list of heroes:

由于属性 `hero` 不存在，因此会显示一个错误。要访问每个英雄并列出所有英雄，请在 `<li>` 上添加 `*ngFor` 以遍历英雄列表：

The [`*ngFor`](guide/built-in-directives#ngFor) is Angular's *repeater* directive.
It repeats the host element for each element in a list.

[`*ngFor`](guide/built-in-directives#ngFor) 是一个 Angular 的复写器（repeater）指令。它会为列表中的每项数据复写它的宿主元素。

The syntax in this example is as follows:

这个例子中涉及的语法如下：

Holds the current hero object for each iteration through the list.

保存列表每次迭代的当前 hero 对象。

Holds the mock heroes list from the `HeroesComponent` class, the mock heroes list.

来自 `HeroesComponent` 类的存放模拟（mock）英雄的列表。

The host element.

宿主元素。

Syntax

语法

Details

详情

After the browser refreshes, the list of heroes appears.

浏览器刷新之后，英雄列表出现了。

<a id="styles"></a>



Style the heroes

给英雄列表“美容”

The heroes list should be attractive and should respond visually when users
hover over and select a hero from the list.

英雄列表应该富有吸引力，并且当用户把鼠标移到某个英雄上和从列表中选中某个英雄时，应该给出视觉反馈。

In the [first tutorial](tutorial/tour-of-heroes/toh-pt0#app-wide-styles), you set the basic styles for the entire application in `styles.css`.
That style sheet didn't include styles for this list of heroes.

在[教程的第一章](tutorial/tour-of-heroes/toh-pt0#app-wide-styles)，你曾在 `styles.css` 中为整个应用设置了一些基础的样式。但那个样式表并不包含英雄列表所需的样式。

You could add more styles to `styles.css` and keep growing that style sheet as you add components.

固然，你可以把更多样式加入到 `styles.css`，并且放任它随着你添加更多组件而不断膨胀。

You may prefer instead to define private styles for a specific component. This keeps everything a component needs, such as the code, the HTML, and the CSS, together in one place.

你可以定义属于特定组件的私有样式。这会让组件所需的一切（比如代码、HTML 和 CSS）都放在一起。

This approach makes it easier to re-use the component somewhere else and deliver the component's intended appearance even if the global styles are different.

这种方式让你在其它地方复用该组件更加容易，并且即使全局样式和这里不一样，组件也仍然具有期望的外观。

You define private styles either inline in the `@Component.styles` array or as style sheet files identified in the `@Component.styleUrls` array.

你可以用多种方式定义私有样式，或者内联在 `@Component.styles` 数组中，或者在 `@Component.styleUrls` 所指出的样式表文件中。

When the `ng generate` created the `HeroesComponent`, it created an empty `heroes.component.css` style sheet for the `HeroesComponent` and pointed to it in `@Component.styleUrls` like this.

当 `ng generate` 创建 `HeroesComponent` 时，它也同时为 `HeroesComponent` 创建了空白的 `heroes.component.css` 样式表文件，并且让 `@Component.styleUrls` 指向它，就像这样。

Open the `heroes.component.css` file and paste in the private CSS styles for the `HeroesComponent` from the [final code review](#final-code-review).

打开 `heroes.component.css` 文件，并且把 `HeroesComponent` 的私有 CSS 样式粘贴进去。
你可以在[查看最终代码](#final-code-review)中找到它们。

Viewing details

查看详情

When the user clicks a hero in the list, the component should display the selected hero's details at the bottom of the page.

当用户在此列表中点击一个英雄时，该组件应该在页面底部显示所选英雄的详情。

The code in this section listens for the hero item click event and display/update the hero details.

本节中的代码会监听英雄条目的点击事件，并显示与更新英雄的详情。

Add a click event binding

添加 `click` 事件绑定

Add a click event binding to the `<button>` in the `<li>` like this:

为 `<li>` 中的 `<button>` 上添加一个点击事件的绑定代码：

This is an example of Angular's [event binding](guide/event-binding) syntax.

这是 Angular [事件绑定](guide/event-binding) 语法的例子。

The parentheses around `click` tell Angular to listen for the `<button>` element's `click` event.
When the user clicks in the `<button>`, Angular executes the `onSelect(hero)` expression.

`click` 外面的圆括号会让 Angular 监听这个 `<button>` 元素的 `click` 事件。
当用户点击 `<button>` 时，Angular 就会执行表达式 `onSelect(hero)`。

In the next section, define an `onSelect()` method in `HeroesComponent` to display the hero that was defined in the `*ngFor` expression.

下一部分，会在 `HeroesComponent` 上定义一个 `onSelect()` 方法，用来显示 `*ngFor` 表达式所定义的那个英雄（`hero`）。

Add the click event handler

添加 `click` 事件处理器

Rename the component's `hero` property to `selectedHero` but don't assign any value to it since there is no *selected hero* when the application starts.

把该组件的 `hero` 属性改名为 `selectedHero`，但不要为它赋值。
因为应用刚刚启动时并没有*所选英雄*。

Add the following `onSelect()` method, which assigns the clicked hero from the template to the component's `selectedHero`.

添加如下 `onSelect()` 方法，它会把模板中被点击的英雄赋值给组件的 `selectedHero` 属性。

Add a details section

添加详情区

Currently, you have a list in the component template.
To show details about a hero when you click their name in the list, add a section
in the template that displays their details.
Add the following to `heroes.component.html` beneath the list section:

现在，组件的模板中有一个列表。要想在点击列表中英雄的名字时显示该英雄的详情，就要在模板中添加一个区域，用来显示这些详情。在 `heroes.component.html` 中该列表的紧下方，添加如下代码：

The hero details should only be displayed when a hero is selected. When a component is created initially, there is no selected hero. Add the `*ngIf` directive to the `<div>` that wraps the hero details. This directive tells Angular to render the section only when the `selectedHero` is defined after it has been selected by clicking on a hero.

只有在选择英雄时才会显示英雄详细信息。最初创建组件时，没有所选的 hero。将 `*ngIf` 指令添加到包装 hero 详细信息的 `<div>` 中。该指令会告诉 Angular 仅在实际定义 `selectedHero` 时（在它被通过点击英雄来选择）。

Style the selected hero

为选定的英雄设置样式

To help identify the selected hero, you can use the `.selected` CSS class in the [styles you added earlier](#styles).
To apply the `.selected` class to the `<li>` when the user clicks it, use class binding.

为了标出选定的英雄，你可以在[以前添加过的样式中](#styles)增加 CSS 类 `.selected`。若要把 `.selected` 类应用于此 `<li>` 上，请使用类绑定。

Angular's [class binding](guide/class-binding) can add and remove a CSS class conditionally.
Add `[class.some-css-class]="some-condition"` to the element you want to style.

Angular 的[类绑定](guide/class-binding)可以有条件地添加和删除 CSS 类。只需将 `[class.some-css-class]="some-condition"` 添加到要设置样式的元素即可。

Add the following `[class.selected]` binding to the `<button>` in the `HeroesComponent` template:

在 `HeroesComponent` 模板中的 `<button>` 元素上添加 `[class.selected]` 绑定，代码如下：

When the current row hero is the same as the `selectedHero`, Angular adds the `selected` CSS class.
When the two heroes are different, Angular removes the class.

如果当前行的英雄和 `selectedHero` 相同，Angular 就会添加 CSS 类 `selected`，否则就会移除它。

The finished `<li>` looks like this:

最终的 `<li>` 是这样的：

<a id="final-code-review"></a>



Final code review

查看最终代码

Here are the code files discussed on this page, including the `HeroesComponent` styles.

下面是本页面中所提及的代码文件，包括 `HeroesComponent` 的样式。

Summary

小结

The Tour of Heroes application displays a list of heroes with a detail view.

英雄之旅应用在一个主从视图中显示了英雄列表。

The user can select a hero and see that hero's details.

用户可以选择一个英雄，并查看该英雄的详情。

You used `*ngFor` to display a list.

你使用 `*ngFor` 显示了一个列表。

You used `*ngIf` to conditionally include or exclude a block of HTML.

你使用 `*ngIf` 来根据条件包含或排除了一段 HTML。

You can toggle a CSS style class with a `class` binding.

你可以用 `class` 绑定来切换 CSS 的样式类。