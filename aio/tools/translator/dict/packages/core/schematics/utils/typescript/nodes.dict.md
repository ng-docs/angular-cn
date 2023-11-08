Checks whether the given TypeScript node has the specified modifier set.

检查给定的 TypeScript 节点是否具有指定的修饰符集。

Find the closest parent node of a particular kind.

查找特定种类的最近父节点。

Checks whether a particular node is part of a null check. E.g. given:
`foo.bar ? foo.bar.value : null` the null check would be `foo.bar`.

检查特定节点是否是空检查的一部分。例如给出：`foo.bar ? foo.bar.value : null` `foo.bar ? foo.bar.value : null` 空检查将是 `foo.bar`。

Checks whether a property access is safe \(e.g. `foo.parent?.value`\).

检查属性访问是否安全（例如 `foo.parent?.value` ）。