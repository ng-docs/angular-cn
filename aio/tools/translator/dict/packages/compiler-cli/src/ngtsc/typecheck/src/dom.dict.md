Checks every non-Angular element/property processed in a template and potentially produces
`ts.Diagnostic`s related to improper usage.

检查模板中处理的每个非 Angular 元素/属性，并可能生成与使用不当相关的 `ts.Diagnostic`。

A `DomSchemaChecker`'s job is to check DOM nodes and their attributes written used in templates
and produce `ts.Diagnostic`s if the nodes don't conform to the DOM specification. It acts as a
collector for these diagnostics, and can be queried later to retrieve the list of any that have
been generated.

`DomSchemaChecker` 的工作是检查模板中使用的 DOM 节点及其编写的属性，如果节点不符合 DOM
规范，则生成 `ts.Diagnostic`
。它充当这些诊断的收集器，并且可以在以后查询以检索已生成的任何诊断的列表。

Get the `ts.Diagnostic`s that have been generated via `checkElement` and `checkProperty` calls
thus far.

获取 `ts.Diagnostic` 已通过 `checkElement` 和 `checkProperty` 调用生成的 ts.Diagnostic。

the template ID, suitable for resolution with a `TcbSourceResolver`.

模板 ID，适合使用 `TcbSourceResolver`。

the element node in question.

有问题的元素节点。

any active schemas for the template, which might affect the validity of the
element.

模板的任何活动模式，这可能会影响元素的有效性。

boolean indicating whether the element's host is a standalone
    component.

布尔值，指示元素的宿主是否是独立组件。

Check a non-Angular element and record any diagnostics about it.

检查一个非 Angular 元素并记录关于它的任何诊断。

the name of the property being checked.

正在检查的属性的名称。

the source span of the binding. This is redundant with `element.attributes` but is
passed separately to avoid having to look up the particular property name.

绑定的源范围。这与 `element.attributes` 是多余的，但要单独传递以避免查找特定的属性名称。

any active schemas for the template, which might affect the validity of the
property.

模板的任何活动模式，这可能会影响属性的有效性。

Check a property binding on an element and record any diagnostics about it.

检查元素上的属性绑定并记录有关它的任何诊断。

Checks non-Angular elements and properties against the `DomElementSchemaRegistry`, a schema
maintained by the Angular team via extraction from a browser IDL.

根据 DomElementSchemaRegistry 检查非 Angular 元素和属性，`DomElementSchemaRegistry` 是由 Angular
团队通过从浏览器 IDL 中提取来维护的模式。