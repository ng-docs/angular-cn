no longer needed, you can inject the `TransferState` in an app without providing
    this module.

不再需要，你可以在不提供此模块的情况下将 `TransferState` 注入应用程序。

NgModule to install on the server side while using the `TransferState` to transfer state from
server to client.

要安装在服务端的 NgModule，它同时会使用 `TransferState` 将状态从服务器传输到客户端。

Note: this module is not needed if the `renderApplication` function is used.
The `renderApplication` makes all providers from this module available in the application.

注意：如果使用了 `renderApplication` 函数，则不需要此模块。`renderApplication` 使此模块中的所有提供者在应用程序中可用。