/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

/**
 * Interface for a class that creates an in-memory database
 *
 * 创建内存数据库的类的接口
 *
 * Its `createDb` method creates a hash of named collections that represents the database
 *
 * 其 `createDb` 方法创建表示数据库的命名集合的哈希
 *
 * For maximum flexibility, the service may define HTTP method overrides.
 * Such methods must match the spelling of an HTTP method in lower case (e.g, "get").
 * If a request has a matching method, it will be called as in
 * `get(info: requestInfo, db: {})` where `db` is the database object described above.
 *
 * 为了获得最大的灵活性，服务可以定义 HTTP 方法覆盖。此类方法必须匹配 HTTP
 * 方法的小写拼写（例如“get”）。如果请求有匹配的方法，它将在 `get(info: requestInfo, db: {})`
 * 中调用，其中 `db` 是上面描述的数据库对象。
 *
 */
export abstract class InMemoryDbService {
  /**
   * Creates an in-memory "database" hash whose keys are collection names
   * and whose values are arrays of collection objects to return or update.
   *
   * 创建一个内存中“数据库”哈希，其键是集合名称，其值是要返回或更新的集合对象数组。
   *
   * returns Observable of the database because could have to create it asynchronously.
   *
   * 返回数据库的 Observable ，因为可能不得不异步创建它。
   *
   * This method must be safe to call repeatedly.
   * Each time it should return a new object with new arrays containing new item objects.
   * This condition allows the in-memory backend service to mutate the collections
   * and their items without touching the original source data.
   *
   * 此方法必须可以安全地重复调用。每次它都应该返回一个新对象，其中的新数组包含新的 item
   * 对象。这种条件允许内存中的后端服务在不接触原始源数据的情况下改变集合及其条目。
   *
   * The in-mem backend service calls this method without a value the first time.
   * The service calls it with the `RequestInfo` when it receives a POST `commands/resetDb` request.
   * Your InMemoryDbService can adjust its behavior accordingly.
   *
   * 内存中后端服务第一次调用此方法时没有值。服务在收到 POST `commands/resetDb` 请求时使用
   * `RequestInfo` 调用它。你的 InMemoryDbService 可以相应地调整其行为。
   *
   */
  abstract createDb(reqInfo?: RequestInfo): {}|Observable<{}>|Promise<{}>;
}

/**
 * Interface for InMemoryBackend configuration options
 *
 * InMemoryBackend 配置选项的接口
 *
 */
export abstract class InMemoryBackendConfigArgs {
  /**
   * The base path to the api, e.g, 'api/'.
   * If not specified than `parseRequestUrl` assumes it is the first path segment in the request.
   *
   * api 的基本路径，例如 'api/'。如果未指定，则 `parseRequestUrl` 假定它是请求中的第一个路径段。
   *
   */
  apiBase?: string;
  /**
   * false (default) if search match should be case insensitive
   *
   * false（默认）如果搜索匹配应该不区分大小写
   *
   */
  caseSensitiveSearch?: boolean;
  /**
   * false (default) put content directly inside the response body.
   * true: encapsulate content in a `data` property inside the response body, `{ data: ... }`.
   *
   * false（默认）将内容直接放在响应正文中。 true ：将内容封装在响应正文中的 `data` 属性中 `{ data:
   * ... }` 。
   *
   */
  dataEncapsulation?: boolean;
  /**
   * delay (in ms) to simulate latency
   *
   * 延迟（以毫秒为单位）以模拟延迟
   *
   */
  delay?: number;
  /**
   * false (default) should 204 when object-to-delete not found; true: 404
   *
   * false（默认）当找不到 object-to-delete 时应该为 204；真： 404
   *
   */
  delete404?: boolean;
  /**
   * host for this service, e.g., 'localhost'
   *
   * 此服务的宿主，例如“localhost”
   *
   */
  host?: string;
  /**
   * false (default) should pass unrecognized request URL through to original backend; true: 404
   *
   * false（默认）应该将无法识别的请求 URL 传递到原始后端；真： 404
   *
   */
  passThruUnknownUrl?: boolean;
  /**
   * true (default) should NOT return the item (204) after a POST. false: return the item (200).
   *
   * true（默认）不应该在 POST 之后返回条目 (204)。 false ：返回条目 (200)。
   *
   */
  post204?: boolean;
  /**
   * false (default) should NOT update existing item with POST. false: OK to update.
   *
   * false（默认）不应使用 POST 更新现有项。 false：可以更新。
   *
   */
  post409?: boolean;
  /**
   * true (default) should NOT return the item (204) after a POST. false: return the item (200).
   *
   * true（默认）不应该在 POST 之后返回条目 (204)。 false ：返回条目 (200)。
   *
   */
  put204?: boolean;
  /**
   * false (default) if item not found, create as new item; false: should 404.
   *
   * false（默认）如果找不到条目，则创建为新条目； false：应该 404。
   *
   */
  put404?: boolean;
  /**
   * root path _before_ any API call, e.g., ''
   *
   * 任何 API 调用 _ 之前 _ 的根路径，例如 ''
   *
   */
  rootPath?: string;
}

/////////////////////////////////
/**
 * InMemoryBackendService configuration options
 *  Usage:
 *    InMemoryWebApiModule.forRoot(InMemHeroService, {delay: 600})
 *
 * InMemoryBackendService 配置选项 用法： InMemoryWebApiModule.forRoot(InMemHeroService, {delay:
 * 600})
 *
 *  or if providing separately:
 *    provide(InMemoryBackendConfig, {useValue: {delay: 600}}),
 *
 * 或者如果单独提供： provide(InMemoryBackendConfig, {useValue: {delay: 600}}),
 *
 */
@Injectable()
export class InMemoryBackendConfig implements InMemoryBackendConfigArgs {
  constructor(config: InMemoryBackendConfigArgs = {}) {
    Object.assign(
        this, {
          // default config:
          caseSensitiveSearch: false,
          dataEncapsulation: false,   // do NOT wrap content within an object with a `data` property
          delay: 500,                 // simulate latency by delaying response
          delete404: false,           // don't complain if can't find entity to delete
          passThruUnknownUrl: false,  // 404 if can't process URL
          post204: true,              // don't return the item after a POST
          post409: false,             // don't update existing item with that ID
          put204: true,               // don't return the item after a PUT
          put404: false,              // create new item if PUT item with that ID not found
          apiBase: undefined,         // assumed to be the first path segment
          host: undefined,     // default value is actually set in InMemoryBackendService ctor
          rootPath: undefined  // default value is actually set in InMemoryBackendService ctor
        },
        config);
  }
}

/**
 * Return information (UriInfo) about a URI
 *
 * 返回有关 URI 的信息 (UriInfo)
 *
 */
export function parseUri(str: string): UriInfo {
  // Adapted from parseuri package - http://blog.stevenlevithan.com/archives/parseuri
  // tslint:disable-next-line:max-line-length
  const URL_REGEX =
      /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
  const m = URL_REGEX.exec(str);
  const uri: UriInfo&{[key: string]: string} = {
    source: '',
    protocol: '',
    authority: '',
    userInfo: '',
    user: '',
    password: '',
    host: '',
    port: '',
    relative: '',
    path: '',
    directory: '',
    file: '',
    query: '',
    anchor: ''
  };
  const keys = Object.keys(uri);
  let i = keys.length;

  while (i--) {
    uri[keys[i]] = m && m[i] || '';
  }
  return uri;
}

/**
 * Interface for the result of the `parseRequestUrl` method:
 *   Given URL "<http://localhost:8080/api/customers/42?foo=1> the default implementation returns
 *     base: 'api/'
 *     collectionName: 'customers'
 *     id: '42'
 *     query: this.createQuery('foo=1')
 *     resourceUrl: '<http://localhost/api/customers/>'
 *
 * `parseRequestUrl` 方法结果的接口：给定 URL “ <http://localhost:8080/api/customers/42?foo=1>
 * ，默认实现返回 base: 'api/' collectionName: 'customers' id: '42' 查询： this.createQuery('foo=1')
 * resourceUrl: ' <http://localhost/api/customers/> '
 *
 */
export interface ParsedRequestUrl {
  apiBase: string;               // the slash-terminated "base" for api requests (e.g. `api/`)
  collectionName: string;        // the name of the collection of data items (e.g.,`customers`)
  id: string;                    // the (optional) id of the item in the collection (e.g., `42`)
  query: Map<string, string[]>;  // the query parameters;
  resourceUrl:
      string;  // the effective URL for the resource (e.g., 'http://localhost/api/customers/')
}

export interface PassThruBackend {
  /**
   * Handle an HTTP request and return an Observable of HTTP response
   * Both the request type and the response type are determined by the supporting HTTP library.
   *
   * 处理 HTTP 请求并返回 HTTP 响应的 Observable 请求类型和响应类型都由支持的 HTTP 库确定。
   *
   */
  handle(req: any): Observable<any>;
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}

/**
 * Minimum definition needed by base class
 *
 * 基类所需的最小定义
 *
 */
export interface RequestCore {
  url: string;             // request URL
  urlWithParams?: string;  // request URL with query parameters added by `HttpParams`
}

/**
 * Interface for object w/ info about the current request url
 * extracted from an Http Request.
 * Also holds utility methods and configuration data from this service
 *
 * 带有从 Http 请求提取的当前请求 url 的信息的对象的接口。还保存来自此服务的实用程序方法和配置数据
 *
 */
export interface RequestInfo {
  req: RequestCore;  // concrete type depends upon the Http library
  apiBase: string;
  collectionName: string;
  collection: any;
  headers: HttpHeaders;
  method: string;
  id: any;
  query: Map<string, string[]>;
  resourceUrl: string;
  url: string;  // request URL
  utils: RequestInfoUtilities;
}

/**
 * Interface for utility methods from this service instance.
 * Useful within an HTTP method override
 *
 * 此服务实例中的实用程序方法的接口。在 HTTP 方法覆盖中很有用
 *
 */
export interface RequestInfoUtilities {
  /**
   * Create a cold response Observable from a factory for ResponseOptions
   * the same way that the in-mem backend service does.
   *
   * 从工厂为 ResponseOptions 创建冷响应 Observable ，方式与 in-mem 后端服务相同。
   *
   * @param resOptionsFactory - creates ResponseOptions when observable is subscribed
   *
   *   订阅 observable 时创建 ResponseOptions
   *
   * @param withDelay - if true (default), add simulated latency delay from configuration
   *
   *   如果为 true（默认），则从配置中添加模拟的延迟延迟
   *
   */
  createResponse$: (resOptionsFactory: () => ResponseOptions) => Observable<any>;

  /**
   * Find first instance of item in collection by `item.id`
   *
   * 按 `item.id` 查找集合中条目的第一个实例
   *
   * @param collection
   * @param id
   */
  findById<T extends {id: any}>(collection: T[], id: any): T|undefined;

  /**
   * return the current, active configuration which is a blend of defaults and overrides
   *
   * 返回当前的活动配置，它是默认值和覆盖的混合体
   *
   */
  getConfig(): InMemoryBackendConfigArgs;

  /**
   * Get the in-mem service's copy of the "database"
   *
   * 获取“数据库”的内存服务副本
   *
   */
  getDb(): {};

  /**
   * Get JSON body from the request object
   *
   * 从请求对象获取 JSON 正文
   *
   */
  getJsonBody(req: any): any;

  /**
   * Get location info from a url, even on server where `document` is not defined
   *
   * 从 url 获取位置信息，即使在未定义 `document` 的服务器上
   *
   */
  getLocation(url: string): UriInfo;

  /**
   * Get (or create) the "real" backend
   *
   * 获取（或创建）“真实”后端
   *
   */
  getPassThruBackend(): PassThruBackend;

  /**
   * return true if can determine that the collection's `item.id` is a number
   *
   * 如果可以确定集合的 `item.id` 是数字，则返回 true
   *
   */
  isCollectionIdNumeric<T extends {id: any}>(collection: T[], collectionName: string): boolean;

  /**
   * Parses the request URL into a `ParsedRequestUrl` object.
   * Parsing depends upon certain values of `config`: `apiBase`, `host`, and `urlRoot`.
   *
   * 将请求 URL 解析为 `ParsedRequestUrl` 对象。解析取决于 `config` 的某些值： `apiBase`、`host`
   * 和 `urlRoot` 。
   *
   */
  parseRequestUrl(url: string): ParsedRequestUrl;
}

/**
 * Provide a `responseInterceptor` method of this type in your `inMemDbService` to
 * morph the response options created in the `collectionHandler`.
 *
 * 在你的 `inMemDbService` 中提供此类型的 `responseInterceptor` 方法，以变形在 `collectionHandler`
 * 中创建的响应选项。
 *
 */
export type ResponseInterceptor = (res: ResponseOptions, ri: RequestInfo) => ResponseOptions;

export interface ResponseOptions {
  /**
   * String, Object, ArrayBuffer or Blob representing the body of the {@link Response}.
   *
   * 表示 {@link Response} 的主体的 String、Object、ArrayBuffer 或 Blob。
   *
   */
  body?: string|Object|ArrayBuffer|Blob;

  /**
   * Response headers
   *
   * 响应标头
   *
   */
  headers?: HttpHeaders;

  /**
   * Http {@link <https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html> status code}
   * associated with the response.
   *
   * 与响应关联的 HTTP {@link <https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html>状态代码}。
   *
   */
  status?: number;

  /**
   * Status text for the status code
   *
   * 状态代码的状态文本
   *
   */
  statusText?: string;
  /**
   * request url
   *
   * 请求网址
   *
   */
  url?: string;
}

/**
 * Interface of information about a Uri
 *
 * 有关 Uri 的信息接口
 *
 */
export interface UriInfo {
  source: string;
  protocol: string;
  authority: string;
  userInfo: string;
  user: string;
  password: string;
  host: string;
  port: string;
  relative: string;
  path: string;
  directory: string;
  file: string;
  query: string;
  anchor: string;
}
