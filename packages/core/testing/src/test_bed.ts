/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Directive, InjectFlags, NgModule, Pipe, PlatformRef, ProviderToken, Type} from '@angular/core';

import {ComponentFixture} from './component_fixture';
import {MetadataOverride} from './metadata_override';
import {_getTestBedRender3, TestBedRender3} from './r3_test_bed';
import {TestBedStatic, TestEnvironmentOptions, TestModuleMetadata} from './test_bed_common';

/**
 * @publicApi
 */
export interface TestBed {
  platform: PlatformRef;

  ngModule: Type<any>|Type<any>[];

  /**
   * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
   * angular module. These are common to every test in the suite.
   *
   * 使用编译器工厂、PlatformRef 和 angular
   * 模块来初始化测试环境。这些对于套件中的每个测试都是公共的。
   *
   * This may only be called once, to set up the common providers for the current test
   * suite on the current platform. If you absolutely need to change the providers,
   * first use `resetTestEnvironment`.
   *
   * 这只能调用一次，以在当前平台上为当前测试套件设置公用提供者。如果你必须要更改提供者，请首先使用
   * `resetTestEnvironment` 。
   *
   * Test modules and platforms for individual platforms are available from
   * '@angular/<platform_name>/testing'.
   *
   * 可从 '@angular/&lt;platform_name>/testing' 获得适用于各个平台的测试模块和平台。
   *
   */
  initTestEnvironment(
      ngModule: Type<any>|Type<any>[], platform: PlatformRef,
      options?: TestEnvironmentOptions): void;

  /**
   * Reset the providers for the test injector.
   *
   * 重置测试注入器的提供者。
   *
   */
  resetTestEnvironment(): void;

  resetTestingModule(): void;

  configureCompiler(config: {providers?: any[], useJit?: boolean}): void;

  configureTestingModule(moduleDef: TestModuleMetadata): void;

  compileComponents(): Promise<any>;

  inject<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  inject<T>(token: ProviderToken<T>, notFoundValue: null, flags?: InjectFlags): T|null;

  /**
   * @deprecated from v9.0.0 use TestBed.inject
   *
   * 从 v9.0.0 开始使用 TestBed.inject
   *
   */
  get<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): any;
  /**
   * @deprecated from v9.0.0 use TestBed.inject
   *
   * 从 v9.0.0 开始使用 TestBed.inject
   *
   */
  get(token: any, notFoundValue?: any): any;

  execute(tokens: any[], fn: Function, context?: any): any;

  overrideModule(ngModule: Type<any>, override: MetadataOverride<NgModule>): void;

  overrideComponent(component: Type<any>, override: MetadataOverride<Component>): void;

  overrideDirective(directive: Type<any>, override: MetadataOverride<Directive>): void;

  overridePipe(pipe: Type<any>, override: MetadataOverride<Pipe>): void;

  /**
   * Overwrites all providers for the given token with the given provider definition.
   *
   * 使用给定的提供者定义覆盖给定令牌的所有提供者。
   *
   */
  overrideProvider(token: any, provider: {
    useFactory: Function,
    deps: any[],
  }): void;
  overrideProvider(token: any, provider: {useValue: any;}): void;
  overrideProvider(token: any, provider: {useFactory?: Function, useValue?: any, deps?: any[]}):
      void;

  overrideTemplateUsingTestingModule(component: Type<any>, template: string): void;

  createComponent<T>(component: Type<T>): ComponentFixture<T>;
}

/**
 * @description
 * Configures and initializes environment for unit testing and provides methods for
 * creating components and services in unit tests.
 *
 * 配置和初始化用于单元测试的环境，并提供用于在单元测试中创建组件和服务的方法。
 *
 * `TestBed` is the primary api for writing unit tests for Angular applications and libraries.
 *
 * `TestBed` 是用于为 Angular 应用程序和库编写单元测试的主要 API。
 *
 * Note: Use `TestBed` in tests. It will be set to either `TestBedViewEngine` or `TestBedRender3`
 * according to the compiler used.
 *
 * 注意：在测试中使用 `TestBed`。根据使用的编译器不同，它将被设置为 `TestBedViewEngine` 或
 * `TestBedRender3`。
 *
 * @publicApi
 */
export const TestBed: TestBedStatic = TestBedRender3;

/**
 * Returns a singleton of the applicable `TestBed`.
 *
 * 返回适用的 `TestBed` 单例。
 *
 * It will be either an instance of `TestBedViewEngine` or `TestBedRender3`.
 *
 * 这将是 `TestBedViewEngine` 或 `TestBedRender3` 的实例。
 *
 * @publicApi
 */
export const getTestBed: () => TestBed = _getTestBedRender3;

/**
 * Allows injecting dependencies in `beforeEach()` and `it()`. Note: this function
 * (imported from the `@angular/core/testing` package) can **only** be used to inject dependencies
 * in tests. To inject dependencies in your application code, use the [`inject`](api/core/inject)
 * function from the `@angular/core` package instead.
 *
 * 允许在 `beforeEach()` 和 `it()` 中注入依赖项。
 *
 * Example:
 *
 * 例如：
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * @publicApi
 */
export function inject(tokens: any[], fn: Function): () => any {
  const testBed = getTestBed();
  // Not using an arrow function to preserve context passed from call site
  return function(this: unknown) {
    return testBed.execute(tokens, fn, this);
  };
}

/**
 * @publicApi
 */
export class InjectSetupWrapper {
  constructor(private _moduleDef: () => TestModuleMetadata) {}

  private _addModule() {
    const moduleDef = this._moduleDef();
    if (moduleDef) {
      getTestBed().configureTestingModule(moduleDef);
    }
  }

  inject(tokens: any[], fn: Function): () => any {
    const self = this;
    // Not using an arrow function to preserve context passed from call site
    return function(this: unknown) {
      self._addModule();
      return inject(tokens, fn).call(this);
    };
  }
}

/**
 * @publicApi
 */
export function withModule(moduleDef: TestModuleMetadata): InjectSetupWrapper;
export function withModule(moduleDef: TestModuleMetadata, fn: Function): () => any;
export function withModule(moduleDef: TestModuleMetadata, fn?: Function|null): (() => any)|
    InjectSetupWrapper {
  if (fn) {
    // Not using an arrow function to preserve context passed from call site
    return function(this: unknown) {
      const testBed = getTestBed();
      if (moduleDef) {
        testBed.configureTestingModule(moduleDef);
      }
      return fn.apply(this);
    };
  }
  return new InjectSetupWrapper(() => moduleDef);
}
