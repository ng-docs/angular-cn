`makeStateKey` has moved, please import `makeStateKey` from `@angular/core` instead.

`makeStateKey` 已移动，请改为从 `@angular/core` 导入 `makeStateKey`。

Create a `StateKey<T>` that can be used to store value of type T with `TransferState`.

创建一个 `StateKey<T>`，可用于把 T 类型的值存储在 `TransferState` 中。

Example:

范例：

`TransferState` has moved, please import `TransferState` from `@angular/core`
    instead.

`TransferState` 已移动，请改为从 `@angular/core` 导入 `TransferState`。

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

`StateKey` has moved, please import `StateKey` from `@angular/core` instead.

`StateKey` 已移动，请改为从 `@angular/core` 导入 `StateKey`。

A type-safe key to use with `TransferState`.

与 `TransferState` 一起使用的类型安全的键名。