Path to the test case sources.

测试用例源的路径。

Search the `test_cases` directory, in the real file-system, for all the compliance tests.

在真实文件系统中的 `test_cases` 目录中搜索所有合规性测试。

Test are indicated by a `TEST_CASES.json` file which contains one or more test cases.

测试由包含一个或多个测试用例的 `TEST_CASES.json` 文件表示。

Absolute disk path of the `TEST_CASES.json` file that describes the tests.

描述测试的 `TEST_CASES.json` 文件的绝对磁盘路径。

Extract all the compliance tests from the TEST_CASES.json file at the `testConfigPath`.

从 `testConfigPath` 的 TEST_CASES.json 文件中提取所有合规性测试。

Search the file-system from the `current` path to find all paths that satisfy the `predicate`.

从 `current` 路径搜索文件系统以查找满足 `predicate` 的所有路径。

Describes a compliance test, as defined in a `TEST_CASES.json` file.

描述在 `TEST_CASES.json` 文件中定义的合规性测试。

The path, relative to the test_cases directory, of the directory containing this test.

包含此测试的目录的相对于 test_cases 目录的路径。

The absolute path \(on the real file-system\) to the test case containing this test.

包含此测试的测试用例的绝对路径（在真实文件系统上）。

A description of this particular test.

此特定测试的描述。

Any additional options to pass to the TypeScript compiler when compiling this test's source
files. These are equivalent to what you would put in `tsconfig.json`.

编译此测试的源文件时要传递给 TypeScript 编译器的任何其他选项。这些相当于你在 `tsconfig.json`
中放入的内容。

Any additional options to pass to the Angular compiler when compiling this test's source
files. These are equivalent to what you would put in `tsconfig.json`.

编译此测试的源文件时要传递给 Angular 编译器的任何其他选项。这些相当于你在 `tsconfig.json`
中放入的内容。

A list of paths to source files that should be compiled for this test case.

应该为此测试用例编译的源文件的路径列表。

Only run this test when the input files are compiled using the given compilation
modes. The default is to run for all modes.

仅在使用给定的编译模式编译输入文件时运行此测试。默认值是为所有模式运行。

A list of expectations to check for this test case.

要检查此测试用例的期望列表。

If set to `true`, then focus on this test \(equivalent to jasmine's `fit()`\).

如果设置为 `true`，则专注于此测试（等效于 jasmine 的 `fit()`）。

If set to `true`, then exclude this test \(equivalent to jasmine's `xit()`\).

如果设置为 `true`，则排除此测试（等效于 jasmine 的 `xit()`）。

The message to display if this expectation fails.

如果此预期失败，则要显示的消息。

A list of pairs of paths to expected and generated files to compare.

要比较的预期文件和生成文件的路径对列表。

A collection of errors that should be reported when compiling the generated file.

编译生成的文件时应该报告的错误集合。

Additional checks to run against the generated code.

针对生成的代码运行的额外检查。

A pair of paths to expected and generated files that should be compared in an `Expectation`.

应该在 `Expectation` 中比较的预期和生成文件的路径对。

Regular expressions that should match an error message.

应该匹配错误消息的正则表达式。

The name \(or name and arguments\) of a function to call to run additional checks against the
generated code.

要调用的函数的名称（或名称和参数），以对生成的代码运行额外检查。

Options to pass to configure the compiler.

要传递的选项以配置编译器。

Interface espressing the type for the json object found at ../test_cases/test_case_schema.json.

表示在 ../test_cases/test_case_schema.json 找到的 json 对象的类型的接口。