A folder that is lazily loaded upon first access and then cached.

在首次访问时惰性加载然后缓存的文件夹。

the file-system where the directory is to be loaded.

要加载目录的文件系统。

the path to the directory we want to load.

我们要加载的目录的路径。

the path within the mock file-system where the directory is to be loaded.

要加载目录的模拟文件系统中的路径。

Load real files from the real file-system into a mock file-system.

将真实文件从真实文件系统加载到模拟文件系统中。

Note that this function contains a mix of `FileSystem` calls and NodeJS `fs` calls.
This is because the function is a bridge between the "real" file-system \(via `fs`\) and the "mock"
file-system \(via `FileSystem`\).

请注意，此函数包含 `FileSystem` 调用和 NodeJS `fs`
调用的混合。这是因为该函数是“真实”文件系统（通过 `fs`）和“模拟”文件系统（通过 `FileSystem`
）之间的桥梁。