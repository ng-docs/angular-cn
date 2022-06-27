/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {XhrFactory} from '@angular/common';
import {HttpBackend} from '@angular/common/http';
import {ModuleWithProviders, NgModule, Type} from '@angular/core';

import {HttpClientBackendService} from './http-client-backend-service';
import {InMemoryBackendConfig, InMemoryBackendConfigArgs, InMemoryDbService} from './interfaces';

// Internal - Creates the in-mem backend for the HttpClient module
// AoT requires factory to be exported
export function httpClientInMemBackendServiceFactory(
    dbService: InMemoryDbService, options: InMemoryBackendConfig,
    xhrFactory: XhrFactory): HttpBackend {
  return new HttpClientBackendService(dbService, options, xhrFactory) as HttpBackend;
}

@NgModule()
export class HttpClientInMemoryWebApiModule {
  /**
   * Redirect the Angular `HttpClient` XHR calls
   *  to in-memory data store that implements `InMemoryDbService`.
   *  with class that implements InMemoryDbService and creates an in-memory database.
   *
   * 将 Angular `HttpClient` XHR 调用重定向到实现 `InMemoryDbService` 的内存数据存储。使用实现
   * InMemoryDbService 并创建内存数据库的类。
   *
   *  Usually imported in the root application module.
   *  Can import in a lazy feature module too, which will shadow modules loaded earlier
   *
   * 通常在根应用程序模块中导入。也可以导入延迟特性模块，这将影响更早加载的模块
   *
   * @param dbCreator - Class that creates seed data for in-memory database. Must implement
   *     InMemoryDbService.
   *
   *   为内存数据库创建种子数据的类。必须实现 InMemoryDbService。
   *
   * @param [options]
   * @example
   * HttpInMemoryWebApiModule.forRoot(dbCreator);
   * HttpInMemoryWebApiModule.forRoot(dbCreator, {useValue: {delay:600}});
   */
  static forRoot(dbCreator: Type<InMemoryDbService>, options?: InMemoryBackendConfigArgs):
      ModuleWithProviders<HttpClientInMemoryWebApiModule> {
    return {
      ngModule: HttpClientInMemoryWebApiModule,
      providers: [
        {provide: InMemoryDbService, useClass: dbCreator},
        {provide: InMemoryBackendConfig, useValue: options}, {
          provide: HttpBackend,
          useFactory: httpClientInMemBackendServiceFactory,
          deps: [InMemoryDbService, InMemoryBackendConfig, XhrFactory]
        }
      ]
    };
  }
  /**
   * Enable and configure the in-memory web api in a lazy-loaded feature module.
   * Same as `forRoot`.
   * This is a feel-good method so you can follow the Angular style guide for lazy-loaded modules.
   *
   * 在延迟加载的特性模块中启用和配置内存 Web api。与 `forRoot`
   * 相同。这是一种感觉良好的方法，因此你可以按照延迟加载模块的 Angular 风格指南进行操作。
   *
   */
  static forFeature(dbCreator: Type<InMemoryDbService>, options?: InMemoryBackendConfigArgs):
      ModuleWithProviders<HttpClientInMemoryWebApiModule> {
    return HttpClientInMemoryWebApiModule.forRoot(dbCreator, options);
  }
}
