A type-safe key to use with `TransferState`.

与 `TransferState` 一起使用的类型安全的键名。

Example:

范例：

Create a `StateKey<T>` that can be used to store value of type T with `TransferState`.

创建一个 `StateKey<T>`，可用于把 T 类型的值存储在 `TransferState` 中。

A key value store that is transferred from the application on the server side to the application
on the client side.

从服务端的应用程序传到客户端的应用程序的键值存储。

The `TransferState` is available as an injectable token.
On the client, just inject this token using DI and use it, it will be lazily initialized.
On the server it's already included if `renderApplication` function is used. Otherwise, import
the `ServerTransferStateModule` module to make the `TransferState` available.

`TransferState` 可用作可注入令牌。在客户端，只需使用 DI 注入此令牌并使用它，它将被延迟初始化。如果使用 `renderApplication` 函数，它已经包含在服务器上。否则，导入 `ServerTransferStateModule` 模块以使 `TransferState` 可用。

The values in the store are serialized/deserialized using JSON.stringify/JSON.parse. So only
boolean, number, string, null and non-class objects will be serialized and deserialized in a
non-lossy manner.

这里会使用 JSON.stringify/JSON.parse 对存储中的值进行序列化/反序列化。因此，仅布尔、数字、字符串、null 和非类对象能以无损的方式进行序列化和反序列化。

Get the value corresponding to a key. Return `defaultValue` if key is not found.

获取与键名对应的值。如果找不到键名，则返回 `defaultValue`。

Set the value corresponding to a key.

设置与键名对应的值。

Remove a key from the store.

从商店中取出键名。

Test whether a key exists in the store.

测试存储中是否存在键名。

Indicates whether the state is empty.

指示状态是否为空。

Register a callback to provide the value for a key when `toJson` is called.

注册一个回调，以在调用 `toJson` 时为指定的键名提供一个值。

Serialize the current state of the store to JSON.

将存储的当前状态序列化为 JSON。