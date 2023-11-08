Map from tagName|propertyName to SecurityContext. Properties applying to all tags use '\*'.

从 tagName|propertyName 映射到 SecurityContext。适用于所有标签的属性使用“\*”。

The set of security-sensitive attributes of an `<iframe>` that *must* be
applied as a static attribute only. This ensures that all security-sensitive
attributes are taken into account while creating an instance of an `<iframe>`
at runtime.

`<iframe>` 的一组安全敏感属性，*必须*仅作为静态属性应用。这确保在运行时创建 `<iframe>` 实例时考虑所有安全敏感属性。

Note: avoid using this set directly, use the `isIframeSecuritySensitiveAttr` function
in the code instead.

注意：避免直接使用此设置，而是使用代码中的 `isIframeSecuritySensitiveAttr` 函数。

Checks whether a given attribute name might represent a security-sensitive
attribute of an <iframe>.

检查给定的属性名称是否可能代表一个安全敏感的属性