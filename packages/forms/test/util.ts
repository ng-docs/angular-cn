/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EventEmitter} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {of} from 'rxjs';

function createValidationPromise(
    result: ValidationErrors|null, timeout: number): Promise<ValidationErrors|null> {
  return new Promise(resolve => {
    if (timeout == 0) {
      resolve(result);
    } else {
      setTimeout(() => {
        resolve(result);
      }, timeout);
    }
  });
}

/**
 * Returns a promise-based async validator that emits, after a delay, either:
 *
 * 返回一个基于 Promise 的异步验证器，它会在延迟后发出：
 *
 * - an error `{async: true}` if the control value does not match the expected value
 *
 *   如果控制值与预期值不匹配，则出现错误 `{async: true}`
 *
 * - or null, otherwise
 *   The delay is either:
 *
 *   或 null ，否则延迟是：
 *
 * - defined in `timeouts` parameter, as the association to the control value
 *
 *   在 `timeouts` 参数中定义，作为与控制值的关联
 *
 * - or 0ms otherwise
 *
 *   或 0ms 否则
 *
 * @param expected The expected control value
 *
 * 预期控制值
 *
 * @param timeouts A dictionary associating a control value to when the validation will trigger for
 *     that value
 *
 * 将控件值与何时触发该值的验证相关联的字典
 *
 */
export function asyncValidator(expected: string, timeouts = {}): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const timeout = (timeouts as any)[control.value] ?? 0;
    const result = control.value != expected ? {async: true} : null;
    return createValidationPromise(result, timeout);
  };
}

/**
 * Returns an async validator that emits null or a custom error after a specified delay.
 * If the delay is set to 0ms, the validator emits synchronously.
 *
 * 返回在指定延迟后发出 null 或自定义错误的异步验证器。如果延迟设置为 0ms，则验证器会同步发出。
 *
 * @param timeout Indicates when the validator will emit
 *
 * 表明验证器何时发出
 *
 * @param shouldFail When true, a validation error is emitted, otherwise null is emitted
 *
 * 当为 true 时，会发出验证错误，否则会发出 null
 *
 * @param customError When supplied, overrides the default error `{async: true}`
 *
 * 提供时，覆盖默认错误 `{async: true}`
 *
 */
export function simpleAsyncValidator({
  timeout = 0,
  shouldFail,
  customError =
  {
    async: true
  }
}: {timeout?: number, shouldFail: boolean, customError?: any}): AsyncValidatorFn {
  const result = shouldFail ? customError : null;
  return (c: AbstractControl) =>
             timeout === 0 ? of(result) : createValidationPromise(result, timeout);
}

/**
 * Returns the asynchronous validation state of each provided control
 *
 * 返回每个提供的控件的异步验证状态
 *
 * @param controls A collection of controls
 *
 * 控件的集合
 *
 */
export function currentStateOf(controls: AbstractControl[]):
    {errors: any; pending: boolean; status: string;}[] {
  return controls.map(c => ({errors: c.errors, pending: c.pending, status: c.status}));
}

/**
 * Returns an `EventEmitter` emitting the default error `{'async': true}`
 *
 * 返回一个发出默认错误 `{'async': true}` 的 `EventEmitter`
 *
 * @param c The control instance
 *
 * 控制实例
 *
 */
export function asyncValidatorReturningObservable(c: AbstractControl): EventEmitter<any> {
  const e = new EventEmitter();
  Promise.resolve(null).then(() => {
    e.emit({'async': true});
  });
  return e;
}
