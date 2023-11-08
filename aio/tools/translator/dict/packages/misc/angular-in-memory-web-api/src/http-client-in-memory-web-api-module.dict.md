Class that creates seed data for in-memory database. Must implement
  InMemoryDbService.

为内存数据库创建种子数据的类。必须实现 InMemoryDbService。

Redirect the Angular `HttpClient` XHR calls
 to in-memory data store that implements `InMemoryDbService`.
 with class that implements InMemoryDbService and creates an in-memory database.

将 Angular `HttpClient` XHR 调用重定向到实现 `InMemoryDbService` 的内存数据存储。使用实现
InMemoryDbService 并创建内存数据库的类。

Usually imported in the root application module.
 Can import in a lazy feature module too, which will shadow modules loaded earlier

通常在根应用程序模块中导入。也可以导入延迟特性模块，这将影响更早加载的模块

Enable and configure the in-memory web api in a lazy-loaded feature module.
Same as `forRoot`.
This is a feel-good method so you can follow the Angular style guide for lazy-loaded modules.

在惰性加载的特性模块中启用和配置内存 Web api。与 `forRoot`
相同。这是一种感觉良好的方法，因此你可以按照惰性加载模块的 Angular 风格指南进行操作。