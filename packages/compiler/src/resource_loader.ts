/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * An interface for retrieving documents by URL that the compiler uses to
 * load templates.
 *
 * 一个接口，用于通过 URL 检索文档，编译器用来加载模板。
 *
 * This is an abstract class, rather than an interface, so that it can be used
 * as injection token.
 *
 * 这是一个抽象类，而不是接口，因此可以作为注入标记。
 *
 */
export abstract class ResourceLoader {
  abstract get(url: string): Promise<string>|string;
}
