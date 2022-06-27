# Special Elements

# 特殊元素

Each sub-directory below this contains documentation that describes "special elements".
These are elements that can appear in templates that have special meaning and behaviour in the Angular framework.

此下方的每个子目录都包含描述“特殊元素”的文档。这些是可以出现在 Angular 框架中具有特殊含义和行为的模板中的元素。

Each element should have a markdown file with the same file name as the element's tag name (for example, `ng-container.md`).
The file should be stored in a directory whose name is that of the Angular package under which this element should appear in the docs (usually `core`).

每个元素都应该有一个与元素的标签名相同的文件名的 markdown 文件（例如 `ng-container.md` ）。该文件应该存储在一个目录中，其名称是 Angular 包的名称，文档中此元素应该出现在该目录下（通常是 `core` ）。

## Short description

## 简短描述

The file should contain a "short description" of the element. This is the first paragraph in the file.

该文件应包含元素的“简短描述”。这是文件中的第一段。

## Long description

## 详细描述

All the paragraphs after the short description are collected as an additional longer description.

简短描述之后的所有段落都被收集为额外的较长描述。

## Element attributes

## 元素属性

If the special element accepts one or more attributes that have special meaning to Angular, then these should be documented using the `@elementAttribute` tag.
These tags should come after the description.

如果特殊元素接受对 Angular 具有特殊含义的一个或多个属性，则应该使用 `@elementAttribute` 标签对这些属性进行记录。这些标签应该在描述之后。

The format of this tag is:

此标签的格式是：

```typescript
@elementAttribute attr="value"

Description of the attribute and value.
```

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28