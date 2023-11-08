A mock file system impacting configuration files.
Queries for all other files are deferred to the underlying filesystem.

影响配置文件的模拟文件系统。对所有其他文件的查询被延迟到底层文件系统。

Create a ConfiguredProject and an actual program for the test project located
in packages/language-service/test/legacy/project. Project creation exercises the
actual code path, but a mock host is used for the filesystem to intercept
and modify test files.

为位于 packages/language-service/test/legacy/project 中的测试项目创建一个 ConfiguredProject
和一个实际程序。项目创建会练习实际的代码路径，但文件系统会使用模拟宿主来截获和修改测试文件。

Position of the cursor, -1 if there isn't one.

光标的位置，如果没有，则为 -1。

Overwritten content without the cursor.

没有光标的覆盖内容。

Overwrite the entire content of `fileName` with `newText`. If cursor is
present in `newText`, it will be removed and the position of the cursor
will be returned.

使用 `newText` 覆盖 `fileName` 的全部内容。如果 `newText`
中存在光标，它将被删除并返回光标的位置。

Overwrite an inline template defined in `fileName` and return the entire
content of the source file \(not just the template\). If a cursor is present
in `newTemplate`, it will be removed and the position of the cursor in the
source file will be returned.

覆盖 `fileName` 中定义的内联模板，并返回源文件的全部内容（而不仅仅是模板）。如果 `newTemplate`
中存在游标，它将被删除，并返回光标在源文件中的位置。

Replace at most one occurence that matches `regex` in the specified
`searchText` with the specified `replaceText`. Throw an error if there is
more than one occurrence.

使用指定的 `replaceText` `searchText` 与 `regex` 匹配的位置。如果出现多次，则抛出错误。