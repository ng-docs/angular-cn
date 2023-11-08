the messages to consolidate.

要合并的消息。

a function that will compute the message id of a message.

一个将计算消息的消息 id 的函数。

an array of message groups, where each group is an array of messages that have the same
    id.

消息组的数组，其中每个组都是具有相同 id 的消息数组。

Consolidate messages into groups that have the same id.

将消息合并到具有相同 id 的组中。

Messages with the same id are grouped together so that we can quickly deduplicate messages when
rendering into translation files.

具有相同 id 的消息会被分组在一起，以便我们在渲染到翻译文件时可以快速删除重复消息。

To ensure that messages are rendered in a deterministic order:

为确保消息以确定的顺序渲染：

the messages within a group are sorted by location \(file path, then start position\)

组中的消息按位置（文件路径，然后是开始位置）排序

the groups are sorted by the location of the first message in the group

组会按组中第一条消息的位置排序

Does the given message have a location property?

给定的消息是否具有 location 属性？