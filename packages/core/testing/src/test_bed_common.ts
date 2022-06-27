/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Directive, InjectFlags, InjectionToken, NgModule, Pipe, PlatformRef, ProviderToken, SchemaMetadata, Type} from '@angular/core';

import {ComponentFixture} from './component_fixture';
import {MetadataOverride} from './metadata_override';
import {TestBed} from './test_bed';

/** Whether test modules should be torn down by default. */
export const TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT = true;

/** Whether unknown elements in templates should throw by default. */
export const THROW_ON_UNKNOWN_ELEMENTS_DEFAULT = false;

/** Whether unknown properties in templates should throw by default. */
export const THROW_ON_UNKNOWN_PROPERTIES_DEFAULT = false;

/**
 * An abstract class for inserting the root test component element in a platform independent way.
 *
 * 一个用于以与平台无关的方式插入根测试组件元素的抽象类。
 *
 * @publicApi
 */
export class TestComponentRenderer {
  insertRootElement(rootElementId: string) {}
  removeAllRootElements?() {}
}

/**
 * @publicApi
 */
export const ComponentFixtureAutoDetect =
    new InjectionToken<boolean[]>('ComponentFixtureAutoDetect');

/**
 * @publicApi
 */
export const ComponentFixtureNoNgZone = new InjectionToken<boolean[]>('ComponentFixtureNoNgZone');

/**
 * @publicApi
 */
export interface TestModuleMetadata {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array<SchemaMetadata|any[]>;
  teardown?: ModuleTeardownOptions;
  /**
   * Whether NG0304 runtime errors should be thrown when unknown elements are present in component's
   * template. Defaults to `false`, where the error is simply logged. If set to `true`, the error is
   * thrown.
   * @see https://angular.io/errors/NG8001 for the description of the problem and how to fix it
   */
  errorOnUnknownElements?: boolean;
  /**
   * Whether errors should be thrown when unknown properties are present in component's template.
   * Defaults to `false`, where the error is simply logged.
   * If set to `true`, the error is thrown.
   * @see https://angular.io/errors/NG8002 for the description of the error and how to fix it
   */
  errorOnUnknownProperties?: boolean;
}

/**
 * @publicApi
 */
export interface TestEnvironmentOptions {
  /**
   * Configures the test module teardown behavior in `TestBed`.
   */
  teardown?: ModuleTeardownOptions;
  /**
   * Whether errors should be thrown when unknown elements are present in component's template.
   * Defaults to `false`, where the error is simply logged.
   * If set to `true`, the error is thrown.
   * @see https://angular.io/errors/NG8001 for the description of the error and how to fix it
   */
  errorOnUnknownElements?: boolean;
  /**
   * Whether errors should be thrown when unknown properties are present in component's template.
   * Defaults to `false`, where the error is simply logged.
   * If set to `true`, the error is thrown.
   * @see https://angular.io/errors/NG8002 for the description of the error and how to fix it
   */
  errorOnUnknownProperties?: boolean;
}

/**
 * Configures the test module teardown behavior in `TestBed`.
 * @publicApi
 */
export interface ModuleTeardownOptions {
  /** Whether the test module should be destroyed after every test. */
  destroyAfterEach: boolean;

  /** Whether errors during test module destruction should be re-thrown. Defaults to `true`. */
  rethrowErrors?: boolean;
}

/**
 * Static methods implemented by the `TestBedViewEngine` and `TestBedRender3`
 *
 * `TestBedViewEngine` 和 `TestBedRender3` 实现的静态方法
 *
 * @publicApi
 */
export interface TestBedStatic {
  new(...args: any[]): TestBed;

  /**
   * Initialize the environment for testing with a compiler factory, a PlatformRef, and an
   * angular module. These are common to every test in the suite.
   *
   * This may only be called once, to set up the common providers for the current test
   * suite on the current platform. If you absolutely need to change the providers,
   * first use `resetTestEnvironment`.
   *
   * Test modules and platforms for individual platforms are available from
   * '@angular/<platform_name>/testing'.
   */
  initTestEnvironment(
      ngModule: Type<any>|Type<any>[], platform: PlatformRef,
      options?: TestEnvironmentOptions): TestBed;

  /**
   * Reset the providers for the test injector.
   *
   * 重置测试注入器的提供者。
   *
   */
  resetTestEnvironment(): void;

  resetTestingModule(): TestBedStatic;

  /**
   * Allows overriding default compiler providers and settings
   * which are defined in test_injector.js
   *
   * 允许覆盖在 test_injector.js 中定义的默认编译器提供者和设置
   *
   */
  configureCompiler(config: {providers?: any[]; useJit?: boolean;}): TestBedStatic;

  /**
   * Allows overriding default providers, directives, pipes, modules of the test injector,
   * which are defined in test_injector.js
   *
   * 允许覆盖测试注入器的默认提供者、指令、管道、模块，它们在 test_injector.js 中定义
   *
   */
  configureTestingModule(moduleDef: TestModuleMetadata): TestBedStatic;

  /**
   * Compile components with a `templateUrl` for the test's NgModule.
   * It is necessary to call this function
   * as fetching urls is asynchronous.
   *
   * 使用测试用的 NgModule `templateUrl` 编译组件。由于提取网址是异步的，因此必须调用此函数。
   *
   */
  compileComponents(): Promise<any>;

  overrideModule(ngModule: Type<any>, override: MetadataOverride<NgModule>): TestBedStatic;

  overrideComponent(component: Type<any>, override: MetadataOverride<Component>): TestBedStatic;

  overrideDirective(directive: Type<any>, override: MetadataOverride<Directive>): TestBedStatic;

  overridePipe(pipe: Type<any>, override: MetadataOverride<Pipe>): TestBedStatic;

  overrideTemplate(component: Type<any>, template: string): TestBedStatic;

  /**
   * Overrides the template of the given component, compiling the template
   * in the context of the TestingModule.
   *
   * 覆盖给定组件的模板，在 TestingModule 的上下文中编译该模板。
   *
   * Note: This works for JIT and AOTed components as well.
   *
   * 注意：这也适用于 JIT 和 AOT 的组件。
   */
  overrideTemplateUsingTestingModule(component: Type<any>, template: string): TestBedStatic;

  /**
   * Overwrites all providers for the given token with the given provider definition.
   *
   * 使用给定的提供者定义覆盖给定令牌的所有提供者。
   *
   * Note: This works for JIT and AOTed components as well.
   *
   * 注意：这也适用于 JIT 和 AOT 的组件。
   *
   */
  overrideProvider(token: any, provider: {
    useFactory: Function,
    deps: any[],
  }): TestBedStatic;
  overrideProvider(token: any, provider: {useValue: any;}): TestBedStatic;
  overrideProvider(token: any, provider: {
    useFactory?: Function,
    useValue?: any,
    deps?: any[],
  }): TestBedStatic;

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

  createComponent<T>(component: Type<T>): ComponentFixture<T>;
}
