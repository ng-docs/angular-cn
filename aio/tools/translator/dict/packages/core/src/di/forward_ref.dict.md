Example

例子

{&commat;example core/di/ts/forward_ref/forward_ref_spec.ts region='forward_ref_fn'}



An interface that a function passed into {&commat;link forwardRef} has to implement.

要传给 {&commat;link forwardRef} 的函数时必须实现的接口。

Circular dependency example

循环依赖示例

{&commat;example core/di/ts/forward_ref/forward_ref_spec.ts region='forward_ref'}



Circular standalone reference import example

循环独立引用导入示例

Allows to refer to references which are not yet defined.

允许引用尚未定义的引用。

For instance, `forwardRef` is used when the `token` which we need to refer to for the purposes of
DI is declared, but not yet defined. It is also used when the `token` which we use when creating
a query is not yet defined.

比如，当我们需要为所声明的 DI 而引用此 `token`，但尚未定义该令牌时，将使用
`forwardRef`。当我们创建尚未定义的查询的 `token` 时，也会使用它。

`forwardRef` is also used to break circularities in standalone components imports.

`forwardRef` 还用于打破独立组件导入中的循环。

{&commat;example core/di/ts/forward_ref/forward_ref_spec.ts region='resolve_forward_ref'}



Lazily retrieves the reference value from a forwardRef.

从 forwardRef 惰性检索引用值。

Acts as the identity function when given a non-forward-ref value.

给定非前向引用值时，充当标识函数。

Checks whether a function is wrapped by a `forwardRef`.

检查函数是否被 `forwardRef` 包装。