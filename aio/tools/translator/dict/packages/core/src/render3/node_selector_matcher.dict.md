`TAttributes` to search through.

要搜索的 `TAttributes`。

class to match \(lowercase\)

要匹配的类（小写）

Whether or not class matching should look into the attribute `class` in
   addition to the `AttributeMarker.Classes`.

除了 `AttributeMarker.Classes` 之外，类匹配是否应该查看属性 `class`。

Search the `TAttributes` to see if it contains `cssClassToMatch` \(case insensitive\)

搜索 `TAttributes` 以查看它是否包含 `cssClassToMatch`（不区分大小写）

current TNode

当前 TNode

Checks whether the `tNode` represents an inline template \(e.g. `*ngFor`\).

检查 `tNode` 是否表示内联模板（例如 `*ngFor`）。

Function that checks whether a given tNode matches tag-based selector and has a valid type.

检查给定 tNode 是否与基于标签的选择器匹配并且具有有效类型的函数。

Matching can be performed in 2 modes: projection mode \(when we project nodes\) and regular
directive matching mode:

匹配可以在 2 种模式下执行：投影模式（当我们投影节点时）和正则指令匹配模式：

in the "directive matching" mode we do _not_ take TContainer's tagName into account if it is
    different from NG_TEMPLATE_SELECTOR \(value different from NG_TEMPLATE_SELECTOR indicates that
a tag name was extracted from \* syntax so we would match the same directive twice\);

在“指令匹配”模式下，如果 TContainer 的 tagName 与 NG_TEMPLATE_SELECTOR 不同，我们就 _ 不会\_
  考虑它（与 NG_TEMPLATE_SELECTOR 不同的值表明标签名称是从 \*
  语法中提取的，因此我们将匹配同一个指令两次）；

in the "projection" mode, we use a tag name potentially extracted from the \* syntax processing
\(applicable to TNodeType.Container only\).

在“投影”模式下，我们使用可能从 \* 语法处理中提取的标签名称（仅适用于 TNodeType.Container）。

static data of the node to match

要匹配的节点的静态数据

The selector to try matching against the node.

要尝试与节点匹配的选择器。

if `true` we are matching for content projection, otherwise we are doing
directive matching.

如果为 `true`，我们正在匹配内容投影，否则我们正在进行指令匹配。

true if node matches the selector.

如果节点与选择器匹配，则为 true。

A utility function to match an Ivy node static data against a simple CSS selector

一种将 Ivy 节点静态数据与简单 CSS 选择器进行匹配的工具函数

the name of the attribute to find

要查找的属性名称

the attribute array to examine

要检查的属性数组

true if the node being matched is an inline template \(e.g. `*ngFor`\)
rather than a manually expanded template node \(e.g `<ng-template>`\).

如果要匹配的节点是内联模板（例如 `*ngFor`）而不是手动扩展的模板节点（例如 `<ng-template>`
），则为 true。

true if we are matching against content projection otherwise we are
matching against directives.

如果我们要与内容投影匹配，则为 true，否则我们正在匹配指令。

Examines the attribute's definition array for a node to find the index of the
attribute that matches the given `name`.

检查节点的属性定义数组，以查找与给定 `name` 匹配的属性的索引。

NOTE: This will not match namespaced attributes.

注意：这将不匹配命名空间属性。

Attribute matching depends upon `isInlineTemplate` and `isProjectionMode`.
The following table summarizes which types of attributes we attempt to match:

属性匹配取决于 `isInlineTemplate` 和 `isProjectionMode`。下表总结了我们尝试匹配的属性类型：

===========================================================================================================
Modes                   | Normal Attributes | Bindings Attributes | Template Attributes | I18n

==================================================
================================================== ======= 模式|普通属性|绑定属性|模板属性| I18n

Attributes

属性

Inline + Projection     | YES               | YES                 | NO                  | YES

内联+投影|是|是是|是没有|是

Inline + Directive      | NO                | NO                  | YES                 | NO

内联+指令|没有|没有|是|是否

Non-inline + Projection | YES               | YES                 | NO                  | YES

非内联+投影|是|是是|是没有|是

Non-inline + Directive  | YES               | YES                 | NO                  | YES

非内联+ 指令|是|是是|是没有|是

Selector to be checked.

要检查的选择器。

List in which to look for the selector.

要在其中查找选择器的列表。

Checks whether a selector is inside a CssSelectorList

检查选择器是否在 CssSelectorList 中

selector in parsed form

解析形式的选择器

string representation of a given selector

给定选择器的字符串表示

Generates string representation of CSS selector in parsed form.

以解析的形式生成 CSS 选择器的字符串表示。

ComponentDef and DirectiveDef are generated with the selector in parsed form to avoid doing
additional parsing at runtime \(for example, for directive matching\). However in some cases \(for
example, while bootstrapping a component\), a string version of the selector is required to query
for the host element on the page. This function takes the parsed form of a selector and returns
its string representation.

ComponentDef 和 DirectiveDef
是使用已解析形式的选择器生成的，以避免在运行时进行额外的解析（例如，用于指令匹配）。但是在某些情况下（例如，引导组件时），需要选择器的字符串版本来查询页面上的宿主元素。此函数采用选择器的解析形式，并返回其字符串表示。

CSS selector in parsed form \(in a form of array\)

解析后的 CSS 选择器（数组形式）

object with `attrs` and `classes` fields that contain extracted information

具有包含提取信息的 `attrs` 和 `classes` 字段的对象

Extracts attributes and classes information from a given CSS selector.

从给定的 CSS 选择器中提取属性和类信息。

This function is used while creating a component dynamically. In this case, the host element
\(that is created dynamically\) should contain attributes and classes specified in component's CSS
selector.

动态创建组件时使用此函数。在这种情况下，宿主元素（动态创建的）应该包含组件的 CSS
选择器中指定的属性和类。