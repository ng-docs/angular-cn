/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {Type} from '../interface/type';
import {NgModuleType} from '../metadata/ng_module_def';
import {getNgModuleDef} from '../render3/definition';
import {stringify} from '../util/stringify';

/**
 * Map of module-id to the corresponding NgModule.
 *
 * module-id 到相应 NgModule 的映射。
 *
 */
const modules = new Map<string, NgModuleType>();

/**
 * Whether to check for duplicate NgModule registrations.
 *
 * 是否检查重复的 NgModule 注册。
 *
 * This can be disabled for testing.
 *
 * 可以禁用此以进行测试。
 *
 */
let checkForDuplicateNgModules = true;

function assertSameOrNotExisting(id: string, type: Type<any>|null, incoming: Type<any>): void {
  if (type && type !== incoming && checkForDuplicateNgModules) {
    throw new Error(
        `Duplicate module registered for ${id} - ${stringify(type)} vs ${stringify(type.name)}`);
  }
}

/**
 * Adds the given NgModule type to Angular's NgModule registry.
 *
 * 将给定的 NgModule 类型添加到 Angular 的 NgModule 注册表。
 *
 * This is generated as a side-effect of NgModule compilation. Note that the `id` is passed in
 * explicitly and not read from the NgModule definition. This is for two reasons: it avoids a
 * megamorphic read, and in JIT there's a chicken-and-egg problem where the NgModule may not be
 * fully resolved when it's registered.
 *
 * 这是作为 NgModule 编译的副作用生成的。请注意， `id` 是显式传入的，而不是从 NgModule
 * 定义中读取的。这有两个原因：它避免了大态读取，并且在 JIT 中存在一个先有鸡还是先有蛋的问题，即
 * NgModule 在注册时可能无法完全解决。
 *
 * @codeGenApi
 */
export function registerNgModuleType(ngModuleType: NgModuleType, id: string): void {
  const existing = modules.get(id) || null;
  assertSameOrNotExisting(id, existing, ngModuleType);
  modules.set(id, ngModuleType);
}

export function clearModulesForTest(): void {
  modules.clear();
}

export function getRegisteredNgModuleType(id: string): NgModuleType|undefined {
  return modules.get(id);
}

/**
 * Control whether the NgModule registration system enforces that each NgModule type registered has
 * a unique id.
 *
 * 控制 NgModule 注册系统是否强制注册的每个 NgModule 类型都有一个唯一的 id。
 *
 * This is useful for testing as the NgModule registry cannot be properly reset between tests with
 * Angular's current API.
 *
 * 这对于测试很有用，因为 NgModule 注册表无法在使用 Angular 当前的 API 的测试之间正确重置。
 *
 */
export function setAllowDuplicateNgModuleIdsForTest(allowDuplicates: boolean): void {
  checkForDuplicateNgModules = !allowDuplicates;
}
