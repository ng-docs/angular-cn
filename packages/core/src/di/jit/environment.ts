/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {resolveForwardRef} from '../forward_ref';
import {ɵɵinject, ɵɵinvalidFactoryDep} from '../injector_compatibility';
import {ɵɵdefineInjectable, ɵɵdefineInjector} from '../interface/defs';

/**
 * A mapping of the @angular/core API surface used in generated expressions to the actual symbols.
 *
 * 生成的表达式中使用的 @angular/core API 图面到实际符号的映射。
 *
 * This should be kept up to date with the public exports of @angular/core.
 *
 * 这应该与 @angular/core 的公共导出保持最新。
 *
 */
export const angularCoreDiEnv: {[name: string]: Function} = {
  'ɵɵdefineInjectable': ɵɵdefineInjectable,
  'ɵɵdefineInjector': ɵɵdefineInjector,
  'ɵɵinject': ɵɵinject,
  'ɵɵinvalidFactoryDep': ɵɵinvalidFactoryDep,
  'resolveForwardRef': resolveForwardRef,
};
