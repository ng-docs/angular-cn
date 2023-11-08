A class that is used to generate imports when translating from Angular Output AST to an AST to
render, such as Babel.

一个类，用于在从 Angular 输出 AST 转换为要渲染的 AST 时生成导入，例如 Babel。

Note that, in the linker, there can only be imports from `@angular/core` and that these imports
must be achieved by property access on an `ng` namespace identifier, which is passed in via the
constructor.

请注意，在链接器中，只能从 `@angular/core` 导入，并且这些导入必须通过对 `ng`
命名空间标识符的属性访问来实现，该标识符是通过构造函数传入的。