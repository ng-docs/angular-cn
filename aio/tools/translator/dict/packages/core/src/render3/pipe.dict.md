Pipe index where the pipe will be stored.

将存储管道的管道索引。

The name of the pipe

管道的名称

T the instance of the pipe.

T 管道的实例。

Create a pipe.

创建一个管道。

Name of pipe to resolve

要解析的管道名称

Full list of available pipes

可用管道的完整列表

Matching PipeDef

匹配 PipeDef

Searches the pipe registry for a pipe with the given name. If one is found,
returns the pipe. Otherwise, an error is thrown because the pipe cannot be resolved.

在管道注册表中搜索具有给定名称的管道。如果找到，则返回管道。否则，会由于无法解析管道而抛出错误。

Name of the missing pipe

缺失的管道名称

The error message

错误消息

Generates a helpful error message for the user when a pipe is not found.

找不到管道时为用户生成有用的错误消息。

Pipe index where the pipe was stored on creation.

创建时存储管道的管道索引。

the offset in the reserved slot space

保留插槽空间中的偏移量

1st argument to {&commat;link PipeTransform#transform}.

{&commat;link PipeTransform#transform} 的第一个参数。

Invokes a pipe with 1 arguments.

调用带有 1 参数的管道。

This instruction acts as a guard to {&commat;link PipeTransform#transform} invoking
the pipe only when an input to the pipe changes.

此指令仅作为 {&commat;link PipeTransform#transform} 的保护，仅当管道的输入更改时才调用管道。

2nd argument to {&commat;link PipeTransform#transform}.

{&commat;link PipeTransform#transform} 的第二个参数。

Invokes a pipe with 2 arguments.

调用带有 2 个参数的管道。

4rd argument to {&commat;link PipeTransform#transform}.

{&commat;link PipeTransform#transform} 的第四个参数。

Invokes a pipe with 3 arguments.

调用带有 3 个参数的管道。

3rd argument to {&commat;link PipeTransform#transform}.

{&commat;link PipeTransform#transform} 的第三个参数。

4th argument to {&commat;link PipeTransform#transform}.

{&commat;link PipeTransform#transform} 的第四个参数。

Invokes a pipe with 4 arguments.

调用带有 4 个参数的管道。

Array of arguments to pass to {&commat;link PipeTransform#transform} method.

要传递给 {&commat;link PipeTransform#transform} 方法的参数数组。

Invokes a pipe with variable number of arguments.

调用具有可变数量的参数的管道。