Run all transformation phases in the correct order against a `ComponentCompilation`. After this
processing, the compilation should be in a state where it can be emitted via `emitTemplateFn`.s

针对 `ComponentCompilation` 以正确的顺序运行所有转换阶段。在这个处理之后，编译应该处于可以通过 `emitTemplateFn` 发出的状态

Compile all views in the given `ComponentCompilation` into the final template function, which may
reference constants defined in a `ConstantPool`.

将给定 `ComponentCompilation` 中的所有视图编译到最终模板函数中，该函数可能引用在 `ConstantPool` 中定义的常量。

Emit a template function for an individual `ViewCompilation` \(which may be either the root view
or an embedded view\).

为单个 `ViewCompilation` （可以是根视图或嵌入式视图）发出模板函数。