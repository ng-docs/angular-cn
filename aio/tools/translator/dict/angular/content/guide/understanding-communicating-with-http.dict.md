Understanding communicating with backend services using HTTP

了解使用 HTTP 与后端服务通信

Most front-end applications need to communicate with a server over the HTTP protocol, to download or upload data and access other back-end services. Angular provides a client HTTP API for Angular applications, the `HttpClient` service class in `@angular/common/http`.

大多数前端应用都要通过 HTTP 协议与服务器通讯，才能下载或上传数据并访问其它后端服务。Angular 给应用提供了一个 HTTP 客户端 API，也就是 `@angular/common/http` 中的 `HttpClient` 服务类。

Prerequisites

前提条件

Before working with the `HttpClientModule`, you should have a basic understanding of the following:

在使用 `HttpClientModule` 之前，你应该对下列内容有基本的了解：

TypeScript programming

TypeScript 编程

Usage of the HTTP protocol

HTTP 协议的用法

Angular application-design fundamentals, as described in [Angular Concepts](guide/architecture)

Angular 的应用设计基础，就像[Angular 基本概念](guide/architecture)中描述的那样

Observable techniques and operators.
See the [Observables guide](guide/observables).

Observable 的技术和运算符。请参阅 [Observables 指南](guide/observables)。

HTTP client service features

HTTP 客户端服务特性

The HTTP client service offers the following major features.

HTTP 客户端服务提供了以下主要功能。

The ability to request [typed response objects](guide/http-request-data-from-server)

请求[类型化响应对象](guide/http-request-data-from-server)的能力

Streamlined [error handling](guide/http-handle-request-errors)

管道式[错误处理](guide/http-handle-request-errors)

[Testability](guide/http-test-requests) features

[可测试性](guide/http-test-requests)的特性

Request and response [interception](guide/http-intercept-requests-and-responses)

对请求和响应的[拦截](guide/http-intercept-requests-and-responses)

What's next

下一步呢？

[Setup for server communication](guide/http-server-communication)

[建立服务器通信](guide/http-server-communication)