SVG as templates

SVG 作为模板

You can use SVG files as templates in your Angular applications.
When you use an SVG as the template, you are able to use directives and bindings just like with HTML templates.
Use these features to dynamically generate interactive graphics.

你可以在 Angular 应用程序中将 SVG 文件用作模板。当你使用 SVG 作为模板时，就可以像 HTML 模板一样使用指令和绑定。使用这些功能，你可以动态生成交互式图形。

SVG syntax example

SVG 语法示例

The following example shows the syntax for using an SVG as a template.

以下示例展示了将 SVG 用作模板的语法。

To see property and event binding in action, add the following code to your `svg.component.svg` file:

要想查看属性和事件绑定的实际效果，请把以下代码添加到你的 `svg.component.svg` 文件中：

The example given uses a `click()` event binding and the property binding syntax \(`[attr.fill]="fillColor"`\).

这个例子使用了事件绑定语法 `click()` 和属性绑定语法（`[attr.fill]="fillColor"`）。