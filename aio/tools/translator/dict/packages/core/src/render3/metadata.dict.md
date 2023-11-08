Adds decorator, constructor, and property metadata to a given type via static metadata fields
on the type.

通过类型上的静态元数据字段将装饰器、构造函数和属性元数据添加到给定类型。

These metadata fields can later be read with Angular's `ReflectionCapabilities` API.

这些元数据字段以后可以用 Angular 的 `ReflectionCapabilities` API 读取。

Calls to `setClassMetadata` can be guarded by ngDevMode, resulting in the metadata assignments
being tree-shaken away during production builds.

对 `setClassMetadata` 的调用可以由 ngDevMode 保护，导致元数据分配在生产构建期间被树形抖动掉。