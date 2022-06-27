/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export function getClosureSafeProperty<T>(objWithPropertyToExtract: T): string {
  for (let key in objWithPropertyToExtract) {
    if (objWithPropertyToExtract[key] === getClosureSafeProperty as any) {
      return key;
    }
  }
  throw Error('Could not find renamed property on target object.');
}

/**
 * Sets properties on a target object from a source object, but only if
 * the property doesn't already exist on the target object.
 *
 * 从源对象设置目标对象的属性，但前提是目标对象上不存在该属性。
 *
 * @param target The target to set properties on
 *
 * 要设置属性的目标
 *
 * @param source The source of the property keys and values to set
 *
 * 要设置的属性键和值的来源
 *
 */
export function fillProperties(target: {[key: string]: string}, source: {[key: string]: string}) {
  for (const key in source) {
    if (source.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}
