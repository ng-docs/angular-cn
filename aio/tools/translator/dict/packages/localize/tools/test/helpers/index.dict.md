Only run these tests on the "native" file-system.

仅在“原生”文件系统上运行这些测试。

Babel uses the `path.resolve()` function internally, which makes it very hard to mock out the
file-system from the outside. We run these tests on Unix and Windows in our CI jobs, so there is
test coverage.

Babel 在内部使用 `path.resolve()` 函数，这使得从外部模拟文件系统变得非常困难。我们在 CI 作业中在
Unix 和 Windows 上运行这些测试，因此有测试覆盖率。