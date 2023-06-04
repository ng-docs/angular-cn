/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '@angular/core';

/**
 * A DI Token representing the main rendering context.
 * In a browser and SSR this is the DOM Document.
 * When using SSR, that document is created by [Domino](https://github.com/angular/domino).
 *
 * 代表主要渲染上下文的 DI 令牌。在浏览器和 SSR 中，这是 DOM 文档。使用 SSR 时，该文档由[Domino](https://github.com/angular/domino)创建。
 *
 * @publicApi
 */
export const DOCUMENT = new InjectionToken<Document>('DocumentToken');
