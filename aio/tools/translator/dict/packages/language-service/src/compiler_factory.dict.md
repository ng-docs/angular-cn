Manages the `NgCompiler` instance which backs the language service, updating or replacing it as
needed to produce an up-to-date understanding of the current program.

管理支持语言服务的 `NgCompiler` 实例，根据需要更新或替换它，以产生对当前程序的最新了解。

TODO\(alxhub\): currently the options used for the compiler are specified at `CompilerFactory`
construction, and are not changeable. In a real project, users can update `tsconfig.json`. We
need to properly handle a change in the compiler options, either by having an API to update the
`CompilerFactory` to use new options, or by replacing it entirely.

TODO\(alxhub\)：当前用于编译器的选项是在 `CompilerFactory`
构造时指定的，并且不可更改。在真实项目中，用户可以更新 `tsconfig.json`
。我们需要正确处理编译器选项的更改，方法是让 API 更新 `CompilerFactory`
以使用新选项，或完全替换它。