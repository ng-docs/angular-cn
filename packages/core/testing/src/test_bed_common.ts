/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken, SchemaMetadata} from '@angular/core';


/**
 * Whether test modules should be torn down by default.
 *
 * 默认情况下是否应该拆除测试模块。
 *
 */
export const TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT = true;

/**
 * Whether unknown elements in templates should throw by default.
 *
 * 默认情况下，模板中的未知元素是否应抛出。
 *
 */
export const THROW_ON_UNKNOWN_ELEMENTS_DEFAULT = false;

/**
 * Whether unknown properties in templates should throw by default.
 *
 * 默认情况下，模板中的未知属性是否应抛出。
 *
 */
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
   *
   * 当组件的模板中存在未知元素时，是否应抛出 NG0304 运行时错误。默认为 `false`
   * ，仅记录错误。如果设置为 `true` ，则抛出错误。
   *
   * @see <https://angular.io/errors/NG8001> for the description of the problem and how to fix it
   *
   * <https://angular.io/errors/NG8001>用于问题的描述以及如何解决它
   *
   */
  errorOnUnknownElements?: boolean;
  /**
   * Whether errors should be thrown when unknown properties are present in component's template.
   * Defaults to `false`, where the error is simply logged.
   * If set to `true`, the error is thrown.
   *
   * 当组件的模板中存在未知属性时是否应抛出错误。默认为 `false` ，仅记录错误。如果设置为 `true`
   * ，则抛出错误。
   *
   * @see <https://angular.io/errors/NG8002> for the description of the error and how to fix it
   *
   * <https://angular.io/errors/NG8002>用于错误的描述以及如何解决它
   *
   */
  errorOnUnknownProperties?: boolean;
}

/**
 * @publicApi
 */
export interface TestEnvironmentOptions {
  /**
   * Configures the test module teardown behavior in `TestBed`.
   *
   * 在 `TestBed` 中配置测试模块的拆卸行为。
   *
   */
  teardown?: ModuleTeardownOptions;
  /**
   * Whether errors should be thrown when unknown elements are present in component's template.
   * Defaults to `false`, where the error is simply logged.
   * If set to `true`, the error is thrown.
   *
   * 当组件的模板中存在未知元素时是否应抛出错误。默认为 `false` ，仅记录错误。如果设置为 `true`
   * ，则抛出错误。
   *
   * @see <https://angular.io/errors/NG8001> for the description of the error and how to fix it
   *
   * <https://angular.io/errors/NG8001>用于错误的描述以及如何解决它
   *
   */
  errorOnUnknownElements?: boolean;
  /**
   * Whether errors should be thrown when unknown properties are present in component's template.
   * Defaults to `false`, where the error is simply logged.
   * If set to `true`, the error is thrown.
   *
   * 当组件的模板中存在未知属性时是否应抛出错误。默认为 `false` ，仅记录错误。如果设置为 `true`
   * ，则抛出错误。
   *
   * @see <https://angular.io/errors/NG8002> for the description of the error and how to fix it
   *
   * <https://angular.io/errors/NG8002>用于错误的描述以及如何解决它
   *
   */
  errorOnUnknownProperties?: boolean;
}

/**
 * Configures the test module teardown behavior in `TestBed`.
 *
 * 在 `TestBed` 中配置测试模块的拆卸行为。
 *
 * @publicApi
 */
export interface ModuleTeardownOptions {
  /**
   * Whether the test module should be destroyed after every test. Defaults to `true`.
   *
   * 是否在每次测试后销毁测试模块。默认为 `true`。
   */
  destroyAfterEach: boolean;

  /**
   * Whether errors during test module destruction should be re-thrown. Defaults to `true`.
   *
   * 是否应该重新抛出测试模块销毁期间的错误。默认为 `true` 。
   *
   */
  rethrowErrors?: boolean;
}
