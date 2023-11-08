A file in the test program, along with any template information for components within the file.

测试程序中的文件，以及文件中组件的任何模板信息。

Path to the file in the virtual test filesystem.

虚拟测试文件系统中文件的路径。

Raw source code for the file.

文件的原始源代码。

If this is omitted, source code for the file will be generated based on any expected component
classes.

如果省略，则将根据任何预期的组件类生成文件的源代码。

A map of component class names to string templates for that component.

组件类名到该组件的字符串模板的映射。

Any declarations \(e.g. directives\) which should be considered as part of the scope for the
components in this file.

应被视为此文件中组件范围的一部分的任何声明（例如指令）。

Create a testing environment for template type-checking which contains a number of given test
targets.

创建一个包含许多给定测试目标的模板类型检查的测试环境。

A full Angular environment is not necessary to exercise the template type-checking system.
Components only need to be classes which exist, with templates specified in the target
configuration. In many cases, it's not even necessary to include source code for test files, as
that can be auto-generated based on the provided target configuration.

练习模板类型检查系统不需要完整的 Angular
环境。组件只需要是存在的类，并在目标配置中指定模板。在许多情况下，甚至没有必要包含测试文件的源代码，因为它可以根据提供的目标配置自动生成。

Synthesize `ScopeData` metadata from an array of `TestDeclaration`s.

从 `TestDeclaration` 数组合成 `ScopeData` 元数据。