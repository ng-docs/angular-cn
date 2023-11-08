For Angular `HttpClient` simulate the behavior of a RESTy web api
backed by the simple in-memory data store provided by the injected `InMemoryDbService`.
Conforms mostly to behavior described here:
https://www.restapitutorial.com/lessons/httpmethods.html

对于 Angular `HttpClient`，模拟由注入的 `InMemoryDbService` 提供的简单内存数据存储支持的 RESTy
Web api 的行为。主要符合此处描述的行为：
https://www.restapitutorial.com/lessons/httpmethods.html

Usage

用法

Create an in-memory data store class that implements `InMemoryDbService`.
Call `config` static method with this service class and optional configuration object:

创建一个实现 `InMemoryDbService` 的内存数据存储类。使用此服务类和可选的配置对象调用 `config`
静态方法：