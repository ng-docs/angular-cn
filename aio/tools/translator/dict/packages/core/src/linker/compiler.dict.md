Ivy JIT mode doesn't require accessing this symbol.
See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for
additional context.

Ivy JIT 模式不需要访问此符号。有关其他上下文，请参阅[由于 ViewEngine 弃用导致的 JIT API
更改](guide/deprecations#jit-api-changes)。

Combination of NgModuleFactory and ComponentFactories.

NgModuleFactory 和一些 ComponentFactory 的组合。

Low-level service for running the angular compiler during runtime
to create {&commat;link ComponentFactory}s, which
can later be used to create and render a Component instance.

本底层服务用于供 Angular 编译器在运行期间创建 {&commat;link
ComponentFactory}，该工厂以后可用于创建和渲染组件实例。

Each `@NgModule` provides an own `Compiler` to its injector,
that will use the directives/pipes of the ng module for compilation
of components.

每个 `@NgModule` 为其注入器提供一个自己的编译器，它将使用此 NgModule 的指令/管道来编译组件。

Compiles the given NgModule and all of its components. All templates of the components
have to be inlined.

编译给定的 NgModule 及其所有组件。必须内联 `entryComponents` 列出的组件的所有模板。

Compiles the given NgModule and all of its components

编译给定的 NgModule 及其所有组件

Same as {&commat;link #compileModuleSync} but also creates ComponentFactories for all components.

与 {&commat;link #compileModuleSync} 相同，但还会为所有组件创建 ComponentFactory。

Same as {&commat;link #compileModuleAsync} but also creates ComponentFactories for all components.

与 {&commat;link #compileModuleAsync} 相同，但还会为所有组件创建 ComponentFactory。

Clears all caches.

清除所有缓存。

Clears the cache for the given component/ngModule.

清除给定组件/ngModule 的缓存。

Returns the id for a given NgModule, if one is defined and known to the compiler.

返回给定 NgModule 的 ID（如果已定义且对编译器已知）。

Options for creating a compiler.

创建编译器的选项。

Note: the `useJit` and `missingTranslation` config options are not used in Ivy, passing them has
no effect. Those config options are deprecated since v13.

用于创建编译器的选项

not used at all in Ivy, providing this config option has no effect.

在 Ivy 中根本不使用，提供此配置选项没有效果。

Token to provide CompilerOptions in the platform injector.

在平台注入器中提供 CompilerOptions 的令牌。

A factory for creating a Compiler

用于创建编译器的工厂