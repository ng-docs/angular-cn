Enqueues moduleDef to be checked later to see if scope can be set on its
component declarations.

将 moduleDef 入队以供稍后检查，以查看是否可以在其组件声明上设置范围。

Loops over queued module definitions, if a given module definition has all of its
declarations resolved, it dequeues that module definition and sets the scope on
its declarations.

循环排队的模块定义，如果给定的模块定义已解析其所有声明，它将使该模块定义出队并在其声明中设置范围。

Returns truthy if a declaration has resolved. If the declaration happens to be
an array of declarations, it will recurse to check each declaration in that array
\(which may also be arrays\).

如果声明已解析，则返回
truthy。如果声明恰好是声明数组，它将递归检查该数组中的每个声明（也可以是数组）。

Compiles a module in JIT mode.

以 JIT 模式编译模块。

This function automatically gets called when a class has a `@NgModule` decorator.

当类具有 `@NgModule` 装饰器时，此函数会自动调用。

Compiles and adds the `ɵmod`, `ɵfac` and `ɵinj` properties to the module class.

编译 `ɵmod`、`ɵfac` 和 `ɵinj` 属性并将其添加到模块类。

It's possible to compile a module via this API which will allow duplicate declarations in its
root.

可以通过此 API 编译模块，这将允许在其根中进行重复声明。

Keep track of compiled components. This is needed because in tests we often want to compile the
same component with more than one NgModule. This would cause an error unless we reset which
NgModule the component belongs to. We keep the list of compiled components here so that the
TestBed can reset it later.

跟踪已编译的组件。这是需要的，因为在测试中我们通常希望使用多个 NgModule
编译同一个组件。除非我们重置组件属于哪个
NgModule，否则这将导致错误。我们在此保留已编译组件的列表，以便 TestBed 稍后可以重置它。

Computes the combined declarations of explicit declarations, as well as declarations inherited by
traversing the exports of imported modules.

计算显式声明的组合声明，以及通过遍历导入模块的导出来继承的声明。

Some declared components may be compiled asynchronously, and thus may not have their
ɵcmp set yet. If this is the case, then a reference to the module is written into
the `ngSelectorScope` property of the declared type.

某些声明的组件可能会被异步编译，因此可能尚未设置它们的 ɵcmp
。如果是这种情况，则会将对模块的引用写入声明类型的 `ngSelectorScope` 属性。

Patch the definition of a component with directives and pipes from the compilation scope of
a given module.

使用给定模块编译范围中的指令和管道修补组件的定义。

Compute the pair of transitive scopes \(compilation scope and exported scope\) for a given type
\(either a NgModule or a standalone component / directive / pipe\).

计算给定类型（NgModule 或独立组件/指令/管道）的一对可传递范围（编译范围和导出范围）。

module that transitive scope should be calculated for.

应该计算可传递范围的模块。

Compute the pair of transitive scopes \(compilation scope and exported scope\) for a given module.

计算给定模块的一对可传递范围（编译范围和导出范围）。

This operation is memoized and the result is cached on the module's definition. This function can
be called on modules with components that have not fully compiled yet, but the result should not
be used until they have.

此操作是被记忆的，并且结果会缓存在模块的定义中。可以在具有尚未完全编译的组件的模块上调用此函数，但在完成之前不要使用结果。