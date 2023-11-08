The `[ngSwitch]` directive on a container specifies an expression to match against.
The expressions to match are provided by `ngSwitchCase` directives on views within the container.

容器上的 `[ngSwitch]` 指令指定要匹配的表达式。匹配的表达式由容器内视图上的 `ngSwitchCase`
指令提供。

Every view that matches is rendered.

如果有匹配项，则渲染匹配的视图。

If there are no matches, a view with the `ngSwitchDefault` directive is rendered.

如果没有匹配项，则渲染 `ngSwitchDefault`

Elements within the `[NgSwitch]` statement but outside of any `NgSwitchCase`
or `ngSwitchDefault` directive are preserved at the location.

`[NgSwitch]` 语句中但任何 `NgSwitchCase` 或 `ngSwitchDefault` 指令之外的元素都会保留在该位置。

Define a container element for the directive, and specify the switch expression
to match against as an attribute:

为指令定义一个容器元素，并指定要匹配的 switch 表达式作为属性：

Within the container, `*ngSwitchCase` statements specify the match expressions
as attributes. Include `*ngSwitchDefault` as the final case.

在容器内，`*ngSwitchCase` 语句将匹配表达式指定为属性。包括用 `*ngSwitchDefault`
作为最后一种情况。

Usage Examples

使用范例

The following example shows how to use more than one case to display the same view:

下面的示例演示如何使用多个分支来显示同一视图：

The following example shows how cases can be nested:

以下示例演示如何嵌套案例：

[Structural Directives](guide/structural-directives)

[结构型指令](guide/structural-directives)

Provides a switch case expression to match against an enclosing `ngSwitch` expression.
When the expressions match, the given `NgSwitchCase` template is rendered.
If multiple match expressions match the switch expression value, all of them are displayed.

提供一个 switch case 表达式来匹配一个封闭的 `ngSwitch` 表达式。当表达式匹配时，将渲染给定的
`NgSwitchCase` 模板。如果多个匹配表达式与开关表达式值相匹配，则会全部显示。

Within a switch container, `*ngSwitchCase` statements specify the match expressions
as attributes. Include `*ngSwitchDefault` as the final case.

在开关容器中，`*ngSwitchCase` 语句将匹配表达式指定为属性。包括用 `*ngSwitchDefault`
作为最后一种情况。

Each switch-case statement contains an in-line HTML template or template reference
that defines the subtree to be selected if the value of the match expression
matches the value of the switch expression.

每个 switch-case 语句包含一个内联 HTML 模板或模板引用，该模板或模板引用定义了 match 表达式的值与
switch 表达式的值匹配时要选择的子树。

Unlike JavaScript, which uses strict equality, Angular uses loose equality.
This means that the empty string, `""` matches 0.

与 JavaScript 使用严格相等性的方式不同，Angular 使用宽松相等性。这意味着空字符串 `""` 能匹配 0。

Stores the HTML template to be selected on match.

存储要在匹配时选择的 HTML 模板。

Performs case matching. For internal use only.

执行大小写匹配。仅限内部使用。

Creates a view that is rendered when no `NgSwitchCase` expressions
match the `NgSwitch` expression.
This statement should be the final case in an `NgSwitch`.

创建一个当没有任何 `NgSwitchCase` 表达式能匹配 `NgSwitch` 表达时要渲染的视图。该语句应该是
`NgSwitch` 的最后一种情况。