reflector.ts implements static reflection of declarations using the TypeScript `ts.TypeChecker`.

reflector.ts 使用 TypeScript `ts.TypeChecker` 实现声明的静态反射。

the TypeScript identifier to find the import info for.

要查找其导入信息的 TypeScript 标识符。

The import info if this is a namespaced import or `null`.

如果这是命名空间导入或 `null`，则为导入信息。

Try to get the import info for this identifier as though it is a namespaced import.

尝试获取此标识符的导入信息，就好像它是命名空间导入一样。

For example, if the identifier is the `Directive` part of a qualified type chain like:

例如，如果标识符是限定类型链的 `Directive` 部分，例如：

then it might be that `core` is a namespace import such as:

那么可能是 `core` 是一个命名空间导入，例如：

Resolve a `ts.Symbol` to its declaration, keeping track of the `viaModule` along the way.

将 `ts.Symbol` 解析为其声明，同时跟踪 `viaModule`。

The starting property access expression from which we want to compute
the left most identifier.

我们要从中计算最左边的标识符的起始属性访问表达式。

the left most identifier in the chain or `null` if it is not an identifier.

链中最左边的标识符，如果不是标识符，则为 `null`。

Compute the left most identifier in a qualified type chain. E.g. the `a` of `a.b.c.SomeType`.

计算限定类型链中最左边的标识符。例如 `abcSomeType` 的 `a`。

Compute the left most identifier in a property access chain. E.g. the `a` of `a.b.c.d`.

计算属性访问链中最左边的标识符。例如，`abcd` 的 `a`。

Return the ImportDeclaration for the given `node` if it is either an `ImportSpecifier` or a
`NamespaceImport`. If not return `null`.

如果给定 `node` 是 `ImportSpecifier` 或 `NamespaceImport`，则返回给定节点的 ImportDeclaration
。如果不返回 `null`。

Compute the name by which the `decl` was exported, not imported.
If no such declaration can be found \(e.g. it is a namespace import\)
then fallback to the `originalId`.

计算 `decl` 导出而不是导入的名称。如果找不到这样的声明（例如它是命名空间导入），则回退到
`originalId`。

A `ts.SourceFile` expando which includes a cached `Set` of local `ts.Declaration`s that are
exported either directly \(`export class ...`\) or indirectly \(via `export {...}`\).

一个 `ts.SourceFile` expando，包含一个本地的 `ts.Declaration` 的缓存 `Set`，可以直接（`export
class ...`）或间接（通过 `export {...}`）导出。

This cache does not cause memory leaks as:

此缓存不会导致内存泄漏，因为：

The only references cached here are local to the `ts.SourceFile`, and thus also available in
`this.statements`.

此处缓存的唯一引用是 `ts.SourceFile` 本地的，因此在 `this.statements` 中也可用。

The only way this `Set` could change is if the source file itself was changed, which would
   invalidate the entire `ts.SourceFile` object in favor of a new version. Thus, changing the
   source file also invalidates this cache.

此 `Set` 可以更改的唯一方法是源文件本身已更改，这将使整个 `ts.SourceFile`
对象无效以支持新版本。因此，更改源文件也会使此缓存无效。

Cached `Set` of `ts.Declaration`s which are locally declared in this file and are exported
either directly or indirectly.

`ts.Declaration` 的缓存 `Set`，在此文件中本地声明，并直接或间接导出。