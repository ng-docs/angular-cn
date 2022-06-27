/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {URL} from 'url';

/**
 * This uses a dynamic import to load a module which may be ESM.
 * CommonJS code can load ESM code via a dynamic import. Unfortunately, TypeScript
 * will currently, unconditionally downlevel dynamic import into a require call.
 * require calls cannot load ESM code and will result in a runtime error. To workaround
 * this, a Function constructor is used to prevent TypeScript from changing the dynamic import.
 * Once TypeScript provides support for keeping the dynamic import this workaround can
 * be dropped.
 * This is only intended to be used with Angular framework packages.
 *
 * 这使用动态导入来加载可能是 ESM 的模块。 CommonJS 代码可以通过动态导入来加载 ESM
 * 代码。不幸的是，TypeScript 当前将无条件地将动态导入降级为 require 调用。 require 调用无法加载 ESM
 * 代码，并将导致运行时错误。为了解决这个问题，可以用 Function 构造函数来防止 TypeScript
 * 更改动态导入。一旦 TypeScript 提供对保留动态导入的支持，就可以删除此解决方法。这只旨在与 Angular
 * 框架包一起使用。
 *
 * @param modulePath The path of the module to load.
 *
 * 要加载的模块的路径。
 *
 * @returns
 *
 * A Promise that resolves to the dynamically imported module.
 *
 * 解析为动态导入的模块的 Promise。
 *
 */
export async function loadEsmModule<T>(modulePath: string|URL): Promise<T> {
  const namespaceObject =
      (await new Function('modulePath', `return import(modulePath);`)(modulePath));

  // If it is not ESM then the values needed will be stored in the `default` property.
  // TODO_ESM: This can be removed once `@angular/*` packages are ESM only.
  if (namespaceObject.default) {
    return namespaceObject.default;
  } else {
    return namespaceObject;
  }
}

/**
 * Attempt to load the new `@angular/compiler-cli/private/migrations` entry. If not yet present
 * the previous deep imports are used to constructor an equivalent object.
 *
 * 尝试加载新的 `@angular/compiler-cli/private/migrations`
 * 条目。如果尚不存在，则以前的深度导入用于构造等效对象。
 *
 * @returns
 *
 * A Promise that resolves to the dynamically imported compiler-cli private migrations
 * entry or an equivalent object if not available.
 *
 * 解析为动态导入的 compiler-cli 私有迁移条目或等效对象（如果不可用）的 Promise。
 *
 */
export async function loadCompilerCliMigrationsModule():
    Promise<typeof import('@angular/compiler-cli/private/migrations')> {
  try {
    return await loadEsmModule('@angular/compiler-cli/private/migrations');
  } catch {
    // rules_nodejs currently does not support exports field entries. This is a temporary workaround
    // that leverages devmode currently being CommonJS. If that changes before rules_nodejs supports
    // exports then this workaround needs to be reworked.
    // TODO_ESM: This can be removed once Bazel supports exports fields.
    return require('@angular/compiler-cli/private/migrations.js');
  }
}
