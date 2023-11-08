Absolute disk path of the `TEST_CASES.json` file that describes the tests.

描述测试的 `TEST_CASES.json` 文件的绝对磁盘路径。

Generate the golden partial output for the tests described in the `testConfigPath` config file.

为 `testConfigPath` 配置文件中描述的测试生成黄金部分输出。

The mock file-system to use when compiling partials.

编译 partials 时要使用的模拟文件系统。

The information about the test being compiled.

有关正在编译的测试的信息。

Partially compile the source files specified by the given `test`.

部分编译给定的 `test` 指定的源文件。

The partially compiled files.

部分编译的文件。

Write the partially compiled files to the appropriate output destination.

将部分编译的文件写入适当的输出目标。

For now just push the concatenated partial files to standard out.

现在只需将连接的部分文件推送到标准输出。