[HTML meta tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta)

[HTML 元标记](https://developer.mozilla.org/docs/Web/HTML/Element/meta)

Represents the attributes of an HTML `<meta>` element. The element itself is
represented by the internal `HTMLMetaElement`.

表示 HTML `<meta>` 元素的属性。该元素本身由一个内部 `HTMLMetaElement` 表示。

Factory to create a `Meta` service instance for the current DOM document.

为当前 DOM 文档创建 `Meta` 服务实例的工厂。

[Document.querySelector\(\)](https://developer.mozilla.org/docs/Web/API/Document/querySelector)

[文档.querySelector\(\)](https://developer.mozilla.org/docs/Web/API/Document/querySelector)

A service for managing HTML `<meta>` tags.

用于管理 HTML `<meta>` 标记的服务。

Properties of the `MetaDefinition` object match the attributes of the
HTML `<meta>` tag. These tags define document metadata that is important for
things like configuring a Content Security Policy, defining browser compatibility
and security settings, setting HTTP Headers, defining rich content for social sharing,
and Search Engine Optimization \(SEO\).

`MetaDefinition` 对象的属性与 HTML `<meta>`
标记的属性一一对应。这些标记定义了文档的元数据，这些元数据对于配置内容安全策略、定义浏览器兼容性和安全设置、设置
HTTP 标头、定义用于社交共享的富内容以及搜索引擎优化（SEO）等都很重要。

To identify specific `<meta>` tags in a document, use an attribute selection
string in the format `"tag_attribute='value string'"`.
For example, an `attrSelector` value of `"name='description'"` matches a tag
whose `name` attribute has the value `"description"`.
Selectors are used with the `querySelector()` Document method,
in the format `meta[{attrSelector}]`.

要在 document 中标识特定的 `<meta>` 标签，请使用格式为 `"tag_attribute='value string'"`
的属性选择字符串。比如，`"name='description'"` 的 `attrSelector` 值，与一个 `name` 属性值为
`"description"` 的标签匹配。这些选择器可以和 document 的 `querySelector()` 方法一起使用，格式为
`meta[{attrSelector}]`。

The definition of a `<meta>` element to match or create.

要匹配或创建的 `<meta>` 元素定义。

True to create a new element without checking whether one already exists.

如果为 True，则只创建新元素而不检查是否已经存在。

The existing element with the same attributes and values if found,
the new element if no match is found, or `null` if the tag parameter is not defined.

如果找到具有相同属性和值的现有元素，则找到新元素；如果找不到匹配项，则为新元素；如果未定义 tag
参数，则为 `null`

Retrieves or creates a specific `<meta>` tag element in the current HTML document.
In searching for an existing tag, Angular attempts to match the `name` or `property` attribute
values in the provided tag definition, and verifies that all other attribute values are equal.
If an existing element is found, it is returned and is not modified in any way.

在当前 HTML 文档中检索或创建特定的 `<meta>`。在搜索现有标签时，Angular 会尝试匹配 `name` 或
`property`
属性值，并验证所有其他属性值是否相等。如果找到现有元素，则将其返回，并且不会进行任何修改。

An array of tag definitions to match or create.

要匹配或创建的标签定义的数组。

True to create new elements without checking whether they already exist.

如果为 True，则创建新元素而不检查其是否已存在。

The matching elements if found, or the new elements.

匹配的元素（如果找到）或新元素。

Retrieves or creates a set of `<meta>` tag elements in the current HTML document.
In searching for an existing tag, Angular attempts to match the `name` or `property` attribute
values in the provided tag definition, and verifies that all other attribute values are equal.

在当前 HTML 文档中检索或创建一组 `<meta>`。在搜索现有标签时，Angular 会尝试在所提供的 Tag
定义中匹配 `name` 或 `property` 属性值并验证所有其他属性值是否也相等。

The tag attribute and value to match against, in the format
`"tag_attribute='value string'"`.

要匹配的标签属性和值，格式为 `"tag_attribute='value string'"`。

The matching element, if any.

要匹配的元素（如果有）。

Retrieves a `<meta>` tag element in the current HTML document.

检索当前 HTML 文档中的 `<meta>`

The matching elements, if any.

匹配到的元素（如果有）。

Retrieves a set of `<meta>` tag elements in the current HTML document.

在当前 HTML 文档中检索一组 `<meta>` 标签。

The tag description with which to replace the existing tag content.

用于替换现有标签内容的标签说明。

A tag attribute and value to match against, to identify
an existing tag. A string in the format `"tag_attribute=`value string`"`.
If not supplied, matches a tag with the same `name` or `property` attribute value as the
replacement tag.

要匹配的标签属性和值，以标识现有标签。格式为 `"tag_attribute='value string'"`
字符串。如果没有提供，则改为匹配具有相同 `name` 或 `property` 属性值的标签。

The modified element.

修改后的元素。

Modifies an existing `<meta>` tag element in the current HTML document.

修改当前 HTML 文档中现有的 `<meta>` 标签元素。

A tag attribute and value to match against, to identify
an existing tag. A string in the format `"tag_attribute=`value string`"`.

要匹配的标签属性和值，以标识现有标签。格式为 `"tag_attribute='value string'"` 字符串。

Removes an existing `<meta>` tag element from the current HTML document.

从当前 HTML 文档中删除现有的 `<meta>`

The tag definition to match against to identify an existing tag.

需要匹配以标识出现有标签的标签定义。

Mapping for MetaDefinition properties with their correct meta attribute names

使用正确的元属性名称映射 MetaDefinition 属性