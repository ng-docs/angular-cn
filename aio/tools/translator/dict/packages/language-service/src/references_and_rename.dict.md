The context needed to perform a rename of a pipe name.

执行重命名管道名称所需的上下文。

The string literal for the pipe name that appears in the &commat;Pipe meta



The location to use for querying the native TS LS for rename positions. This will be the
pipe's transform method.

用于查询原生 TS LS 以获取重命名位置的位置。这将是管道的 transform 方法。

The context needed to perform a rename of a directive/component selector.

执行重命名指令/组件选择器所需的上下文。

The string literal that appears in the directive/component metadata.

出现在指令/组件元数据中的字符串文字。

The location to use for querying the native TS LS for rename positions. This will be the
component/directive class itself. Doing so will allow us to find the location of the
directive/component instantiations, which map to template elements.

用于查询原生 TS LS
以获取重命名位置的位置。这将是组件/指令类本身。这样做将让我们找到映射到模板元素的指令/组件实例化的位置。

The node that is being renamed.

正在重命名的节点。

The position in the TCB file to use as the request to the native TSLS for renaming.

TCB 文件中的位置，用作对原生 TSLS 的重命名请求。

The position in the template the request originated from.

发出请求的模板中的位置。

The target node in the template AST that corresponds to the template position.

模板 AST 中与模板位置对应的目标节点。

From the provided `RenameRequest`, determines what text we should expect all produced
`ts.RenameLocation`s to have and creates an initial entry for indirect renames \(one which is
required for the rename operation, but cannot be found by the native TS LS\).

从提供的 `RenameRequest`，确定我们应该期望所有生成的 `ts.RenameLocation`
具有的文本，并为间接重命名创建一个初始条目（重命名操作所需，但原生 TS LS 找不到）。

Given a `RenameRequest`, determines the `FilePosition` to use asking the native TS LS for rename
locations.

给定 `RenameRequest`，确定要用于向原生 TS LS 请求重命名位置的 `FilePosition`。