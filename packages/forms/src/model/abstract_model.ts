/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EventEmitter, ɵRuntimeError as RuntimeError} from '@angular/core';
import {Observable} from 'rxjs';

import {asyncValidatorsDroppedWithOptsWarning, missingControlError, missingControlValueError, noControlsError} from '../directives/reactive_errors';
import {AsyncValidatorFn, ValidationErrors, ValidatorFn} from '../directives/validators';
import {RuntimeErrorCode} from '../errors';
import {FormArray, FormGroup} from '../forms';
import {addValidators, composeAsyncValidators, composeValidators, hasValidator, removeValidators, toObservable} from '../validators';

const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;

/**
 * Reports that a control is valid, meaning that no errors exist in the input value.
 *
 * 报告控件有效，这意味着输入值中不存在错误。
 *
 * @see `status`
 */
export const VALID = 'VALID';

/**
 * Reports that a control is invalid, meaning that an error exists in the input value.
 *
 * 报告控件无效，这意味着输入值中存在错误。
 *
 * @see `status`
 */
export const INVALID = 'INVALID';

/**
 * Reports that a control is pending, meaning that that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * 报告控件处于挂起状态，这意味着正在发生异步验证，并且输入值尚不存在错误。
 *
 * @see `markAsPending`
 * @see `status`
 */
export const PENDING = 'PENDING';

/**
 * Reports that a control is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * 报告某个控件已禁用，这意味着该控件不受有效性或值的祖先计算。
 *
 * @see `markAsDisabled`
 * @see `status`
 */
export const DISABLED = 'DISABLED';

/**
 * A form can have several different statuses. Each
 * possible status is returned as a string literal.
 *
 * 一个表单可以有几种不同的状态。每种可能的状态都作为字符串文字返回。
 *
 * * **VALID**: Reports that a control is valid, meaning that no errors exist in the input
 *   value.
 *
 *   **VALID** ：报告控件有效，这意味着输入值中不存在错误。
 *
 * * **INVALID**: Reports that a control is invalid, meaning that an error exists in the input
 *   value.
 *
 *   **INVALID** ：报告控件无效，这意味着输入值中存在错误。
 *
 * * **PENDING**: Reports that a control is pending, meaning that that async validation is
 *   occurring and errors are not yet available for the input value.
 *
 *   **PENDING** ：报告控件处于挂起状态，这意味着正在发生异步验证，并且输入值尚不存在错误。
 *
 * * **DISABLED**: Reports that a control is
 *   disabled, meaning that the control is exempt from ancestor calculations of validity or value.
 *
 *   **DISABLED** ：报告控件已禁用，这意味着该控件可以免于祖先的有效性或值计算。
 *
 * @publicApi
 */
export type FormControlStatus = 'VALID'|'INVALID'|'PENDING'|'DISABLED';

/**
 * Gets validators from either an options object or given validators.
 *
 * 从 options 对象或给定的验证器获取验证器。
 *
 */
export function pickValidators(validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|
                               null): ValidatorFn|ValidatorFn[]|null {
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}

/**
 * Creates validator function by combining provided validators.
 *
 * 通过组合提供的验证器创建验证器函数。
 *
 */
function coerceToValidator(validator: ValidatorFn|ValidatorFn[]|null): ValidatorFn|null {
  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}

/**
 * Gets async validators from either an options object or given validators.
 *
 * 从 options 对象或给定的验证器获取异步验证器。
 *
 */
export function pickAsyncValidators(
    asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null,
    validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null): AsyncValidatorFn|
    AsyncValidatorFn[]|null {
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    if (isOptionsObj(validatorOrOpts) && asyncValidator) {
      console.warn(asyncValidatorsDroppedWithOptsWarning);
    }
  }
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}

/**
 * Creates async validator function by combining provided async validators.
 *
 * 通过组合提供的异步验证器创建异步验证器函数。
 *
 */
function coerceToAsyncValidator(asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|
                                null): AsyncValidatorFn|null {
  return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) :
                                         asyncValidator || null;
}

export type FormHooks = 'change'|'blur'|'submit';

/**
 * Interface for options provided to an `AbstractControl`.
 *
 * 提供给 `AbstractControl` 的选项的接口。
 *
 * @publicApi
 */
export interface AbstractControlOptions {
  /**
   * @description
   *
   * The list of validators applied to a control.
   *
   * 应用于控件的验证器列表。
   *
   */
  validators?: ValidatorFn|ValidatorFn[]|null;
  /**
   * @description
   *
   * The list of async validators applied to control.
   *
   * 应用于控制的异步验证器列表。
   *
   */
  asyncValidators?: AsyncValidatorFn|AsyncValidatorFn[]|null;
  /**
   * @description
   *
   * The event name for control to update upon.
   *
   * 要更新的控件的事件名称。
   *
   */
  updateOn?: 'change'|'blur'|'submit';
}

export function isOptionsObj(validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|
                             null): validatorOrOpts is AbstractControlOptions {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
      typeof validatorOrOpts === 'object';
}

export function assertControlPresent(parent: any, isGroup: boolean, key: string|number): void {
  const controls = parent.controls as {[key: string|number]: unknown};
  const collection = isGroup ? Object.keys(controls) : controls;
  if (!collection.length) {
    throw new RuntimeError(
        RuntimeErrorCode.NO_CONTROLS, NG_DEV_MODE ? noControlsError(isGroup) : '');
  }
  if (!controls[key]) {
    throw new RuntimeError(
        RuntimeErrorCode.MISSING_CONTROL, NG_DEV_MODE ? missingControlError(isGroup, key) : '');
  }
}

export function assertAllValuesPresent(control: any, isGroup: boolean, value: any): void {
  control._forEachChild((_: unknown, key: string|number) => {
    if (value[key] === undefined) {
      throw new RuntimeError(
          RuntimeErrorCode.MISSING_CONTROL_VALUE,
          NG_DEV_MODE ? missingControlValueError(isGroup, key) : '');
    }
  });
}

// IsAny checks if T is `any`, by checking a condition that couldn't possibly be true otherwise.
export type ɵIsAny<T, Y, N> = 0 extends(1&T) ? Y : N;

/**
 * `TypedOrUntyped` allows one of two different types to be selected, depending on whether the Forms
 * class it's applied to is typed or not.
 *
 * `TypedOrUntyped` 允许选择两种不同的类型之一，具体取决于它应用的 Forms 类是否是类型化的。
 *
 * This is for internal Angular usage to support typed forms; do not directly use it.
 *
 * 这是供内部 Angular 使用以支持类型化表单；不要直接使用它。
 *
 */
export type ɵTypedOrUntyped<T, Typed, Untyped> = ɵIsAny<T, Untyped, Typed>;

/**
 * Value gives the value type corresponding to a control type.
 *
 * value 给出与控件类型对应的值类型。
 *
 * Note that the resulting type will follow the same rules as `.value` on your control, group, or
 * array, including `undefined` for each group element which might be disabled.
 *
 * 请注意，结果类型将遵循与控件、组或数组上的 `.value` 相同的规则，包括每个可能被禁用的 group 元素的
 * `undefined` 。
 *
 * If you are trying to extract a value type for a data model, you probably want {@link RawValue},
 * which will not have `undefined` in group keys.
 *
 * 如果你尝试为数据模型提取值类型，你可能需要 {@link RawValue} ，它在组键中不会有 `undefined` 。
 *
 * @usageNotes
 *
 * ### `FormControl` value type
 *
 * ### `FormControl` 值类型
 *
 * You can extract the value type of a single control:
 *
 * 你可以提取单个控件的值类型：
 *
 * ```ts
 * type NameControl = FormControl<string>;
 * type NameValue = Value<NameControl>;
 * ```
 *
 * The resulting type is `string`.
 *
 * 结果类型是 `string` 。
 *
 * ### `FormGroup` value type
 *
 * ### `FormGroup` 值类型
 *
 * Imagine you have an interface defining the controls in your group. You can extract the shape of
 * the values as follows:
 *
 * 假设你有一个定义组中控件的界面。你可以按如下方式提取值的形状：
 *
 * ```ts
 * interface PartyFormControls {
 *   address: FormControl<string>;
 * }
 *
 * // Value operates on controls; the object must be wrapped in a FormGroup.
 * type PartyFormValues = Value<FormGroup<PartyFormControls>>;
 * ```
 *
 * The resulting type is `{address: string|undefined}`.
 *
 * 结果类型是 `{address: string|undefined}` 。
 *
 * ### `FormArray` value type
 *
 * ### `FormArray` 值类型
 *
 * You can extract values from FormArrays as well:
 *
 * 你也可以从 FormArrays 中提取值：
 *
 * ```ts
 * type GuestNamesControls = FormArray<FormControl<string>>;
 *
 * type NamesValues = Value<GuestNamesControls>;
 * ```
 *
 * The resulting type is `string[]`.
 *
 * 结果类型是 `string[]` 。
 *
 * \*\*Internal: not for public use.
 *
 * \*\*内部：不供公众使用。
 *
 */
export type ɵValue<T extends AbstractControl|undefined> =
    T extends AbstractControl<any, any>? T['value'] : never;

/**
 * RawValue gives the raw value type corresponding to a control type.
 *
 * RawValue 给出与控件类型对应的原始值类型。
 *
 * Note that the resulting type will follow the same rules as `.getRawValue()` on your control,
 * group, or array. This means that all controls inside a group will be required, not optional,
 * regardless of their disabled state.
 *
 * 请注意，结果类型将遵循与控件、组或数组上的 `.getRawValue()`
 * 相同的规则。这意味着组中的所有控件都是必需的，而不是可选的，无论它们的禁用状态如何。
 *
 * You may also wish to use {@link ɵValue}, which will have `undefined` in group keys (which can be
 * disabled).
 *
 * 你可能还希望使用 {@link ɵValue} ，它在组键中将有 `undefined`（可以禁用）。
 *
 * @usageNotes
 *
 * ### `FormGroup` raw value type
 *
 * ### `FormGroup` 原始值类型
 *
 * Imagine you have an interface defining the controls in your group. You can extract the shape of
 * the raw values as follows:
 *
 * 假设你有一个定义组中控件的界面。你可以按如下方式提取原始值的形状：
 *
 * ```ts
 * interface PartyFormControls {
 *   address: FormControl<string>;
 * }
 *
 * // RawValue operates on controls; the object must be wrapped in a FormGroup.
 * type PartyFormValues = RawValue<FormGroup<PartyFormControls>>;
 * ```
 *
 * The resulting type is `{address: string}`. (Note the absence of `undefined`.)
 *
 * 结果类型是 `{address: string}` 。（请注意不存在 `undefined` 。）
 *
 *  **Internal: not for public use.**
 */
export type ɵRawValue<T extends AbstractControl|undefined> = T extends AbstractControl<any, any>?
    (T['setValue'] extends((v: infer R) => void) ? R : never) :
    never;

// Disable clang-format to produce clearer formatting for these multiline types.
// clang-format off

/**
 * Tokenize splits a string literal S by a delimeter D.
 *
 * 标记化会通过分隔符 D 拆分字符串文字 S。
 *
 */
export type ɵTokenize<S extends string, D extends string> =
    string extends S ? string[] : /* S must be a literal */
                      S extends `${infer T}${D}${infer U}` ? [T, ...ɵTokenize<U, D>] :
                      [S] /* Base case */
    ;

/**
 * CoerceStrArrToNumArr accepts an array of strings, and converts any numeric string to a number.
 *
 * CoerceStrArrToNumArr 接受字符串数组，并将任何数字字符串转换为数字。
 *
 */
export type ɵCoerceStrArrToNumArr<S> =
    // Extract the head of the array.
    S extends [infer Head, ...infer Tail] ?
    // Using a template literal type, coerce the head to `number` if possible.
    // Then, recurse on the tail.
    Head extends `${number}` ?
      [number, ...ɵCoerceStrArrToNumArr<Tail>] :
      [Head, ...ɵCoerceStrArrToNumArr<Tail>] :
    [];

/**
 * Navigate takes a type T and an array K, and returns the type of T\[K[0]]\[K[1]]\[K[2]]...
 *
 * Navigate 接受类型 T 和数组 K，并返回 T\[K [0][0] ]\[K [1][1] ]\[K [2][2] ]...的类型
 *
 */
export type ɵNavigate<T, K extends(Array<string|number>)> =
    T extends object ? /* T must be indexable (object or array) */
    (K extends [infer Head, ...infer Tail] ? /* Split K into head and tail */
        (Head extends keyof T ? /* head(K) must index T */
              (Tail extends(string|number)[] ? /* tail(K) must be an array */
              [] extends Tail ? T[Head] : /* base case: K can be split, but Tail is empty */
                  (ɵNavigate<T[Head], Tail>) /* explore T[head(K)] by tail(K) */ :
              any) /* tail(K) was not an array, give up */ :
              never) /* head(K) does not index T, give up */ :
        any) /* K cannot be split, give up */ :
    any /* T is not indexable, give up */
    ;

/**
 * ɵWriteable removes readonly from all keys.
 *
 * ɵWriteable 会从所有键中删除 readonly 。
 *
 */
export type ɵWriteable<T> = {
  -readonly[P in keyof T]: T[P]
};

/**
 * GetProperty takes a type T and some property names or indices K.
 * If K is a dot-separated string, it is tokenized into an array before proceeding.
 * Then, the type of the nested property at K is computed: T\[K[0]]\[K[1]]\[K[2]]...
 * This works with both objects, which are indexed by property name, and arrays, which are indexed
 * numerically.
 *
 * GetProperty 接受类型 T 和一些属性名称或索引 K。如果 K 是点号分隔的字符串，则会在继续之前将其标记化为数组。然后，计算 K 处的嵌套属性的类型： T\[K [0][0] ]\[K [1][1] ]\[K [2][2] ]... 这适用于按属性名称索引的对象和按数字索引的数组。
 *
 * For internal use only.
 *
 * 仅供内部使用。
 *
 */
export type ɵGetProperty<T, K> =
    // K is a string
    K extends string ? ɵGetProperty<T, ɵCoerceStrArrToNumArr<ɵTokenize<K, '.'>>> :
    // Is is an array
    ɵWriteable<K> extends Array<string|number> ? ɵNavigate<T, ɵWriteable<K>> :
    // Fall through permissively if we can't calculate the type of K.
    any;

// clang-format on

/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 * 这是 `FormControl`、`FormGroup` 和 `FormArray` 的基类。
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * 它提供了所有控件和控件组都具有的一些共享行为，例如运行验证器、计算状态和重置状态。它还定义了在所有子类之间共享的属性，例如
 * `value`、`valid` 和 `dirty` 。它不应该直接实例化。
 *
 * The first type parameter TValue represents the value type of the control (`control.value`).
 * The optional type parameter TRawValue  represents the raw value type (`control.getRawValue()`).
 *
 * 第一个类型参数 TValue 表示控件的值类型 ( `control.value` )。可选的类型参数 TRawValue
 * 表示原始值类型 ( `control.getRawValue()` )。
 *
 * @see [Forms Guide](/guide/forms)
 *
 * [表单指南](/guide/forms)
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 * [响应式表单指南](/guide/reactive-forms)
 *
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 * [动态表单指南](/guide/dynamic-form)
 *
 * @publicApi
 */
export abstract class AbstractControl<TValue = any, TRawValue extends TValue = TValue> {
  /** @internal */
  _pendingDirty = false;

  /**
   * Indicates that a control has its own pending asynchronous validation in progress.
   *
   * 表明控件有自己的挂起异步验证正在进行中。
   *
   * @internal
   */
  _hasOwnPendingAsyncValidator = false;

  /** @internal */
  _pendingTouched = false;

  /** @internal */
  _onCollectionChange = () => {};

  /** @internal */
  _updateOn?: FormHooks;

  private _parent: FormGroup|FormArray|null = null;
  private _asyncValidationSubscription: any;

  /**
   * Contains the result of merging synchronous validators into a single validator function
   * (combined using `Validators.compose`).
   *
   * 包含将同步验证器合并到单个验证器函数中的结果（使用 `Validators.compose` 组合）。
   *
   * @internal
   */
  private _composedValidatorFn: ValidatorFn|null;

  /**
   * Contains the result of merging asynchronous validators into a single validator function
   * (combined using `Validators.composeAsync`).
   *
   * 包含将异步验证器合并到单个验证器函数中的结果（使用 `Validators.composeAsync` 组合）。
   *
   * @internal
   */
  private _composedAsyncValidatorFn: AsyncValidatorFn|null;

  /**
   * Synchronous validators as they were provided:
   *
   * 提供的同步验证器：
   *
   * - in `AbstractControl` constructor
   *
   *   在 `AbstractControl` 构造函数中
   *
   * - as an argument while calling `setValidators` function
   *
   *   作为调用 `setValidators` 函数时的参数
   *
   * - while calling the setter on the `validator` field (e.g. `control.validator = validatorFn`)
   *
   *   在调用 `validator` 字段上的设置器时（例如 `control.validator = validatorFn`）
   *
   * @internal
   */
  private _rawValidators: ValidatorFn|ValidatorFn[]|null;

  /**
   * Asynchronous validators as they were provided:
   *
   * 提供的异步验证器：
   *
   * - in `AbstractControl` constructor
   *
   *   在 `AbstractControl` 构造函数中
   *
   * - as an argument while calling `setAsyncValidators` function
   *
   *   作为调用 `setAsyncValidators` 函数时的参数
   *
   * - while calling the setter on the `asyncValidator` field (e.g. `control.asyncValidator =
   *   asyncValidatorFn`)
   *
   *   在调用 `asyncValidator` 字段上的设置器时（例如 `control.asyncValidator = asyncValidatorFn`）
   *
   * @internal
   */
  private _rawAsyncValidators: AsyncValidatorFn|AsyncValidatorFn[]|null;

  /**
   * The current value of the control.
   *
   * 控件的当前值。
   *
   * * For a `FormControl`, the current value.
   *
   *   对于 `FormControl` ，为当前值。
   *
   * * For an enabled `FormGroup`, the values of enabled controls as an object
   *   with a key-value pair for each member of the group.
   *
   *   对于已启用的 `FormGroup` ，已启用控件的值作为对象，为组的每个成员都有一个键值对。
   *
   * * For a disabled `FormGroup`, the values of all controls as an object
   *   with a key-value pair for each member of the group.
   *
   *   对于禁用的 `FormGroup` ，所有控件的值作为对象，并且组的每个成员都有一个键值对。
   *
   * * For a `FormArray`, the values of enabled controls as an array.
   *
   *   对于 `FormArray` ，为数组形式的已启用控件的值。
   *
   */
  public readonly value!: TValue;

  /**
   * Initialize the AbstractControl instance.
   *
   * 初始化 AbstractControl 实例。
   *
   * @param validators The function or array of functions that is used to determine the validity of
   *     this control synchronously.
   *
   * 用于同步确定此控件的有效性的函数或函数数组。
   *
   * @param asyncValidators The function or array of functions that is used to determine validity of
   *     this control asynchronously.
   *
   * 用于异步确定此控件的有效性的函数或函数数组。
   *
   */
  constructor(
      validators: ValidatorFn|ValidatorFn[]|null,
      asyncValidators: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    this._rawValidators = validators;
    this._rawAsyncValidators = asyncValidators;
    this._composedValidatorFn = coerceToValidator(this._rawValidators);
    this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
  }

  /**
   * Returns the function that is used to determine the validity of this control synchronously.
   * If multiple validators have been added, this will be a single composed function.
   * See `Validators.compose()` for additional information.
   *
   * 返回用于同步确定此控件的有效性的函数。如果添加了多个验证器，这将是一个组合函数。有关其他信息，请参阅
   * `Validators.compose()` 。
   *
   */
  get validator(): ValidatorFn|null {
    return this._composedValidatorFn;
  }
  set validator(validatorFn: ValidatorFn|null) {
    this._rawValidators = this._composedValidatorFn = validatorFn;
  }

  /**
   * Returns the function that is used to determine the validity of this control asynchronously.
   * If multiple validators have been added, this will be a single composed function.
   * See `Validators.compose()` for additional information.
   *
   * 返回用于异步确定此控件的有效性的函数。如果添加了多个验证器，这将是一个组合函数。有关其他信息，请参阅
   * `Validators.compose()` 。
   *
   */
  get asyncValidator(): AsyncValidatorFn|null {
    return this._composedAsyncValidatorFn;
  }
  set asyncValidator(asyncValidatorFn: AsyncValidatorFn|null) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
  }

  /**
   * The parent control.
   *
   * 父控件。
   *
   */
  get parent(): FormGroup|FormArray|null {
    return this._parent;
  }

  /**
   * The validation status of the control.
   *
   * 控件的验证状态。
   *
   * @see `FormControlStatus`
   *
   * These status values are mutually exclusive, so a control cannot be
   * both valid AND invalid or invalid AND disabled.
   *
   * 这些状态值是互斥的，因此控件不能同时是有效与无效或无效与禁用。
   *
   */
  public readonly status!: FormControlStatus;

  /**
   * A control is `valid` when its `status` is `VALID`.
   *
   * 当其 `status` 为 `VALID` 时，控件是 `valid` 的。
   *
   * @see { @link AbstractControl.status}
   *
   * @returns
   *
   * True if the control has passed all of its validation tests,
   * false otherwise.
   *
   * 如果控件已通过其所有验证测试，则为 true ，否则为 false 。
   *
   */
  get valid(): boolean {
    return this.status === VALID;
  }

  /**
   * A control is `invalid` when its `status` is `INVALID`.
   *
   * 当 `status` 为 `INVALID` 时，控件 `invalid` 。
   *
   * @see { @link AbstractControl.status}
   *
   * @returns
   *
   * True if this control has failed one or more of its validation checks,
   * false otherwise.
   *
   * 如果此控件未通过其一个或多个验证检查，则为 true ，否则为 false 。
   *
   */
  get invalid(): boolean {
    return this.status === INVALID;
  }

  /**
   * A control is `pending` when its `status` is `PENDING`.
   *
   * 当 `status` 为 `PENDING` 时，控件处于 `pending` 状态。
   *
   * @see { @link AbstractControl.status}
   *
   * @returns
   *
   * True if this control is in the process of conducting a validation check,
   * false otherwise.
   *
   * 如果此控件正在进行验证检查，则为 true ，否则为 false 。
   *
   */
  get pending(): boolean {
    return this.status == PENDING;
  }

  /**
   * A control is `disabled` when its `status` is `DISABLED`.
   *
   * 当控件的 `status` 为 `DISABLED` 时，控件被 `disabled` 。
   *
   * Disabled controls are exempt from validation checks and
   * are not included in the aggregate value of their ancestor
   * controls.
   *
   * 禁用的控件免于验证检查，并且不包含在其祖先控件的汇总值中。
   *
   * @see { @link AbstractControl.status}
   *
   * @returns
   *
   * True if the control is disabled, false otherwise.
   *
   * 如果控件已禁用，则为 true ，否则为 false 。
   *
   */
  get disabled(): boolean {
    return this.status === DISABLED;
  }

  /**
   * A control is `enabled` as long as its `status` is not `DISABLED`.
   *
   * 只要控件的 `status` 不是 `DISABLED` ，则控件就处于 `enabled` 状态。
   *
   * @returns
   *
   * True if the control has any status other than 'DISABLED',
   * false if the status is 'DISABLED'.
   *
   * 如果控件具有“DISABLED”以外的任何状态，则为 true ，如果状态是“DISABLED”，则为 false 。
   *
   * @see { @link AbstractControl.status}
   *
   */
  get enabled(): boolean {
    return this.status !== DISABLED;
  }

  /**
   * An object containing any errors generated by failing validation,
   * or null if there are no errors.
   *
   * 包含因验证失败生成的任何错误的对象，如果没有错误，则为 null 。
   *
   */
  public readonly errors!: ValidationErrors|null;

  /**
   * A control is `pristine` if the user has not yet changed
   * the value in the UI.
   *
   * 如果用户尚未更改 UI 中的值，则控件是 `pristine` 的。
   *
   * @returns
   *
   * True if the user has not yet changed the value in the UI; compare `dirty`.
   * Programmatic changes to a control's value do not mark it dirty.
   *
   * 如果用户尚未更改 UI 中的值，则为 True ；比较 `dirty` 。对控件值的编程更改不会将其标记为脏。
   *
   */
  public readonly pristine: boolean = true;

  /**
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * 如果用户更改了 UI 中的值，则控件是 `dirty` 的。
   *
   * @returns
   *
   * True if the user has changed the value of this control in the UI; compare `pristine`.
   * Programmatic changes to a control's value do not mark it dirty.
   *
   * 如果用户在 UI 中更改了此控件的值，则为 True ；比较 `pristine`
   * 。对控件值的编程更改不会将其标记为脏。
   *
   */
  get dirty(): boolean {
    return !this.pristine;
  }

  /**
   * True if the control is marked as `touched`.
   *
   * 如果控件被标记为 `touched` ，则为真。
   *
   * A control is marked `touched` once the user has triggered
   * a `blur` event on it.
   *
   * 一旦用户在其上触发了 `blur` 事件，则控件就会被标记为已 `touched` 。
   *
   */
  public readonly touched: boolean = false;

  /**
   * True if the control has not been marked as touched
   *
   * 如果控件尚未标记为已触摸，则为 True
   *
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   *
   * 如果用户尚未在其上触发 `blur` 事件，则控件 `untouched` 。
   *
   */
  get untouched(): boolean {
    return !this.touched;
  }

  /**
   * A multicasting observable that emits an event every time the value of the control changes, in
   * the UI or programmatically. It also emits an event each time you call enable() or disable()
   * without passing along {emitEvent: false} as a function argument.
   *
   * 一种多播 observable，每次控件的值发生更改（在 UI
   * 中或以编程方式）时都会发出事件。它还会在你每次调用 enable() 或 disable()
   * 时发出一个事件，而不将 {emitEvent: false} 作为函数参数传递。
   *
   */
  public readonly valueChanges!: Observable<TValue>;

  /**
   * A multicasting observable that emits an event every time the validation `status` of the control
   * recalculates.
   *
   * 每次重新计算控件的验证 `status` 时都会发出事件的多播 observable。
   *
   * @see `FormControlStatus`
   * @see { @link AbstractControl.status}
   *
   */
  public readonly statusChanges!: Observable<FormControlStatus>;

  /**
   * Reports the update strategy of the `AbstractControl` (meaning
   * the event on which the control updates itself).
   * Possible values: `'change'` \| `'blur'` \| `'submit'`
   * Default value: `'change'`
   *
   * 报告 `AbstractControl` 的更新策略（意味着控件更新本身的事件）。可能的值： `'change'` \|
   * `'blur'` \| `'submit'` 默认值： `'change'`
   *
   */
  get updateOn(): FormHooks {
    return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
  }

  /**
   * Sets the synchronous validators that are active on this control.  Calling
   * this overwrites any existing synchronous validators.
   *
   * 设置此控件上处于活动状态的同步验证器。调用此方法会覆盖任何现有的同步验证器。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   * If you want to add a new validator without affecting existing ones, consider
   * using `addValidators()` method instead.
   *
   * 如果你想添加新的验证器而不影响现有的验证器，请考虑改用 `addValidators()` 方法。
   *
   */
  setValidators(validators: ValidatorFn|ValidatorFn[]|null): void {
    this._rawValidators = validators;
    this._composedValidatorFn = coerceToValidator(validators);
  }

  /**
   * Sets the asynchronous validators that are active on this control. Calling this
   * overwrites any existing asynchronous validators.
   *
   * 设置此控件上处于活动状态的异步验证器。调用此方法会覆盖任何现有的异步验证器。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   * If you want to add a new validator without affecting existing ones, consider
   * using `addAsyncValidators()` method instead.
   *
   * 如果你想添加新的验证器而不影响现有的验证器，请考虑改用 `addAsyncValidators()` 方法。
   *
   */
  setAsyncValidators(validators: AsyncValidatorFn|AsyncValidatorFn[]|null): void {
    this._rawAsyncValidators = validators;
    this._composedAsyncValidatorFn = coerceToAsyncValidator(validators);
  }

  /**
   * Add a synchronous validator or validators to this control, without affecting other validators.
   *
   * 向此控件添加一个或多个同步验证器，而不影响其他验证器。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   * Adding a validator that already exists will have no effect. If duplicate validator functions
   * are present in the `validators` array, only the first instance would be added to a form
   * control.
   *
   * 添加已存在的验证器将没有任何效果。如果验证 `validators`
   * 数组中存在重复的验证器函数，则只有第一个实例会添加到表单控件。
   *
   * @param validators The new validator function or functions to add to this control.
   *
   * 要添加到此控件的新验证器函数。
   *
   */
  addValidators(validators: ValidatorFn|ValidatorFn[]): void {
    this.setValidators(addValidators(validators, this._rawValidators));
  }

  /**
   * Add an asynchronous validator or validators to this control, without affecting other
   * validators.
   *
   * 向此控件添加一个或多个异步验证器，而不影响其他验证器。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   * Adding a validator that already exists will have no effect.
   *
   * 添加已存在的验证器将没有任何效果。
   *
   * @param validators The new asynchronous validator function or functions to add to this control.
   *
   * 要添加到此控件的新的异步验证器函数。
   *
   */
  addAsyncValidators(validators: AsyncValidatorFn|AsyncValidatorFn[]): void {
    this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
  }

  /**
   * Remove a synchronous validator from this control, without affecting other validators.
   * Validators are compared by function reference; you must pass a reference to the exact same
   * validator function as the one that was originally set. If a provided validator is not found,
   * it is ignored.
   *
   * 从此控件中删除同步验证器，而不影响其他验证器。验证器会按函数引用进行比较；你必须传递对与最初设置的验证器函数完全相同的验证器函数的引用。如果找不到提供的验证器，则将其忽略。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   * @param validators The validator or validators to remove.
   *
   * 要删除的验证器。
   *
   */
  removeValidators(validators: ValidatorFn|ValidatorFn[]): void {
    this.setValidators(removeValidators(validators, this._rawValidators));
  }

  /**
   * Remove an asynchronous validator from this control, without affecting other validators.
   * Validators are compared by function reference; you must pass a reference to the exact same
   * validator function as the one that was originally set. If a provided validator is not found, it
   * is ignored.
   *
   * 从此控件中删除异步验证器，而不影响其他验证器。验证器会按函数引用进行比较；你必须传递对与最初设置的验证器函数完全相同的验证器函数的引用。如果找不到提供的验证器，则将其忽略。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   * @param validators The asynchronous validator or validators to remove.
   *
   * 要删除的异步验证器或验证器。
   *
   */
  removeAsyncValidators(validators: AsyncValidatorFn|AsyncValidatorFn[]): void {
    this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
  }

  /**
   * Check whether a synchronous validator function is present on this control. The provided
   * validator must be a reference to the exact same function that was provided.
   *
   * 检查此控件上是否存在同步验证器函数。提供的验证器必须是对所提供的完全相同函数的引用。
   *
   * @param validator The validator to check for presence. Compared by function reference.
   *
   * 要检查是否存在的验证器。通过函数引用进行比较。
   *
   * @returns
   *
   * Whether the provided validator was found on this control.
   *
   * 是否在此控件上找到提供的验证器。
   *
   */
  hasValidator(validator: ValidatorFn): boolean {
    return hasValidator(this._rawValidators, validator);
  }

  /**
   * Check whether an asynchronous validator function is present on this control. The provided
   * validator must be a reference to the exact same function that was provided.
   *
   * 检查此控件上是否存在异步验证器函数。提供的验证器必须是对所提供的完全相同函数的引用。
   *
   * @param validator The asynchronous validator to check for presence. Compared by function
   *     reference.
   *
   * 要检查是否存在的异步验证器。通过函数引用进行比较。
   *
   * @returns
   *
   * Whether the provided asynchronous validator was found on this control.
   *
   * 是否在此控件上找到提供的异步验证器。
   *
   */
  hasAsyncValidator(validator: AsyncValidatorFn): boolean {
    return hasValidator(this._rawAsyncValidators, validator);
  }

  /**
   * Empties out the synchronous validator list.
   *
   * 清空同步验证器列表。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   */
  clearValidators(): void {
    this.validator = null;
  }

  /**
   * Empties out the async validator list.
   *
   * 清空异步验证器列表。
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * 在运行时添加或删除验证器时，你必须调用 `updateValueAndValidity()` 以使新验证生效。
   *
   */
  clearAsyncValidators(): void {
    this.asyncValidator = null;
  }

  /**
   * Marks the control as `touched`. A control is touched by focus and
   * blur events that do not change the value.
   *
   * 将控件标记为 `touched` 。不更改值的焦点和模糊事件会触及控件。
   *
   * @see `markAsUntouched()`
   * @see `markAsDirty()`
   * @see `markAsPristine()`
   * @param opts Configuration options that determine how the control propagates changes
   * and emits events after marking is applied.
   *
   * 确定控件在应用标记后如何传播更改和发出事件的配置选项。
   *
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   *   marks all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当为 true 时，仅标记此控件。当 false 或未提供时，标记所有直接祖先。默认为
   * false。
   *
   */
  markAsTouched(opts: {onlySelf?: boolean} = {}): void {
    (this as {touched: boolean}).touched = true;

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched(opts);
    }
  }

  /**
   * Marks the control and all its descendant controls as `touched`.
   *
   * 将控件及其所有后代控件标记为 `touched` 。
   *
   * @see `markAsTouched()`
   */
  markAllAsTouched(): void {
    this.markAsTouched({onlySelf: true});

    this._forEachChild((control: AbstractControl) => control.markAllAsTouched());
  }

  /**
   * Marks the control as `untouched`.
   *
   * 将控件标记为 `untouched` 。
   *
   * If the control has any children, also marks all children as `untouched`
   * and recalculates the `touched` status of all parent controls.
   *
   * 如果控件有任何子项，则会将所有子项标记为 `untouched` ，并重新计算所有父控件的 `touched` 状态。
   *
   * @see `markAsTouched()`
   * @see `markAsDirty()`
   * @see `markAsPristine()`
   * @param opts Configuration options that determine how the control propagates changes
   * and emits events after the marking is applied.
   *
   * 确定控件在应用标记后如何传播更改和发出事件的配置选项。
   *
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   *   marks all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当为 true 时，仅标记此控件。当 false 或未提供时，标记所有直接祖先。默认为
   * false。
   *
   */
  markAsUntouched(opts: {onlySelf?: boolean} = {}): void {
    (this as {touched: boolean}).touched = false;
    this._pendingTouched = false;

    this._forEachChild((control: AbstractControl) => {
      control.markAsUntouched({onlySelf: true});
    });

    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts);
    }
  }

  /**
   * Marks the control as `dirty`. A control becomes dirty when
   * the control's value is changed through the UI; compare `markAsTouched`.
   *
   * 将控件标记为 `dirty` 。当通过 UI 更改控件的值时，控件会变脏；比较 `markAsTouched` 。
   *
   * @see `markAsTouched()`
   * @see `markAsUntouched()`
   * @see `markAsPristine()`
   * @param opts Configuration options that determine how the control propagates changes
   * and emits events after marking is applied.
   *
   * 确定控件在应用标记后如何传播更改和发出事件的配置选项。
   *
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   *   marks all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当为 true 时，仅标记此控件。当 false 或未提供时，标记所有直接祖先。默认为
   * false。
   *
   */
  markAsDirty(opts: {onlySelf?: boolean} = {}): void {
    (this as {pristine: boolean}).pristine = false;

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty(opts);
    }
  }

  /**
   * Marks the control as `pristine`.
   *
   * 将控件标记为 `pristine` 。
   *
   * If the control has any children, marks all children as `pristine`,
   * and recalculates the `pristine` status of all parent
   * controls.
   *
   * 如果控件有任何子项，则将所有子项标记为 `pristine` ，并重新计算所有父控件的 `pristine` 状态。
   *
   * @see `markAsTouched()`
   * @see `markAsUntouched()`
   * @see `markAsDirty()`
   * @param opts Configuration options that determine how the control emits events after
   * marking is applied.
   *
   * 确定应用标记后控件如何发出事件的配置选项。
   *
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   *   marks all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当为 true 时，仅标记此控件。当 false 或未提供时，标记所有直接祖先。默认为
   * false。
   *
   */
  markAsPristine(opts: {onlySelf?: boolean} = {}): void {
    (this as {pristine: boolean}).pristine = true;
    this._pendingDirty = false;

    this._forEachChild((control: AbstractControl) => {
      control.markAsPristine({onlySelf: true});
    });

    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts);
    }
  }

  /**
   * Marks the control as `pending`.
   *
   * 将控件标记为 `pending` 。
   *
   * A control is pending while the control performs async validation.
   *
   * 控件在执行异步验证时处于挂起状态。
   *
   * @see { @link AbstractControl.status}
   *
   * @param opts Configuration options that determine how the control propagates changes and
   * emits events after marking is applied.
   *
   * 确定控件在应用标记后如何传播更改和发出事件的配置选项。
   *
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   *   marks all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当为 true 时，仅标记此控件。当 false 或未提供时，标记所有直接祖先。默认为
   * false。
   *
   * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
   *   observable emits an event with the latest status the control is marked pending.
   *   When false, no events are emitted.
   *
   *   `emitEvent` ：当为 true 或未提供（默认）时，`statusChanges`
   * 可观察到的会发出一个事件，该事件具有该控件被标记为挂起的最新状态。当 false 时，不会发出事件。
   *
   */
  markAsPending(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    (this as {status: FormControlStatus}).status = PENDING;

    if (opts.emitEvent !== false) {
      (this.statusChanges as EventEmitter<FormControlStatus>).emit(this.status);
    }

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsPending(opts);
    }
  }

  /**
   * Disables the control. This means the control is exempt from validation checks and
   * excluded from the aggregate value of any parent. Its status is `DISABLED`.
   *
   * 禁用控件。这意味着此控件免于验证检查，并从任何父级的聚合值中排除。其状态是 `DISABLED` 。
   *
   * If the control has children, all children are also disabled.
   *
   * 如果控件有子项，则所有子项也被禁用。
   *
   * @see {@link AbstractControl.status}
   * @param opts Configuration options that determine how the control propagates
   * changes and emits events after the control is disabled.
   *
   * 确定控件在禁用控件后如何传播更改和发出事件的配置选项。
   *
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   *   marks all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当为 true 时，仅标记此控件。当 false 或未提供时，标记所有直接祖先。默认为
   * false。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control is disabled.
   *   When false, no events are emitted.
   *
   *   `emitEvent` ：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象在禁用控件时会发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  disable(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    // If parent has been marked artificially dirty we don't want to re-calculate the
    // parent's dirtiness based on the children.
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);

    (this as {status: FormControlStatus}).status = DISABLED;
    (this as {errors: ValidationErrors | null}).errors = null;
    this._forEachChild((control: AbstractControl) => {
      control.disable({...opts, onlySelf: true});
    });
    this._updateValue();

    if (opts.emitEvent !== false) {
      (this.valueChanges as EventEmitter<TValue>).emit(this.value);
      (this.statusChanges as EventEmitter<FormControlStatus>).emit(this.status);
    }

    this._updateAncestors({...opts, skipPristineCheck});
    this._onDisabledChange.forEach((changeFn) => changeFn(true));
  }

  /**
   * Enables the control. This means the control is included in validation checks and
   * the aggregate value of its parent. Its status recalculates based on its value and
   * its validators.
   *
   * 启用控件。这意味着该控件包含在验证检查及其父级的聚合值中。其状态会根据其值和验证器重新计算。
   *
   * By default, if the control has children, all children are enabled.
   *
   * 默认情况下，如果控件有子项，则启用所有子项。
   *
   * @see {@link AbstractControl.status}
   * @param opts Configure options that control how the control propagates changes and
   * emits events when marked as untouched
   *
   * 配置用于控制控件在标记为未触摸时传播更改和发出事件的选项
   *
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   *   marks all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当为 true 时，仅标记此控件。当 false 或未提供时，标记所有直接祖先。默认为
   * false。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control is enabled.
   *   When false, no events are emitted.
   *
   *   `emitEvent` ：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象在启用控件时会发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  enable(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    // If parent has been marked artificially dirty we don't want to re-calculate the
    // parent's dirtiness based on the children.
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);

    (this as {status: FormControlStatus}).status = VALID;
    this._forEachChild((control: AbstractControl) => {
      control.enable({...opts, onlySelf: true});
    });
    this.updateValueAndValidity({onlySelf: true, emitEvent: opts.emitEvent});

    this._updateAncestors({...opts, skipPristineCheck});
    this._onDisabledChange.forEach((changeFn) => changeFn(false));
  }

  private _updateAncestors(
      opts: {onlySelf?: boolean, emitEvent?: boolean, skipPristineCheck?: boolean}): void {
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
      if (!opts.skipPristineCheck) {
        this._parent._updatePristine();
      }
      this._parent._updateTouched();
    }
  }

  /**
   * Sets the parent of the control
   *
   * 设置控件的父级
   *
   * @param parent The new parent.
   *
   * 新的父级。
   *
   */
  setParent(parent: FormGroup|FormArray|null): void {
    this._parent = parent;
  }

  /**
   * Sets the value of the control. Abstract method (implemented in sub-classes).
   *
   * 设置控件的值。抽象方法（在子类中实现）。
   *
   */
  abstract setValue(value: TRawValue, options?: Object): void;

  /**
   * Patches the value of the control. Abstract method (implemented in sub-classes).
   *
   * 修补控件的值。抽象方法（在子类中实现）。
   *
   */
  abstract patchValue(value: TValue, options?: Object): void;

  /**
   * Resets the control. Abstract method (implemented in sub-classes).
   *
   * 重置控件。抽象方法（在子类中实现）。
   *
   */
  abstract reset(value?: TValue, options?: Object): void;

  /**
   * The raw value of this control. For most control implementations, the raw value will include
   * disabled children.
   *
   * 此控件的原始值。对于大多数控件实现，原始值将包括禁用的子项。
   *
   */
  getRawValue(): any {
    return this.value;
  }

  /**
   * Recalculates the value and validation status of the control.
   *
   * 重新计算控件的值和验证状态。
   *
   * By default, it also updates the value and validity of its ancestors.
   *
   * 默认情况下，它还会更新其祖先的值和有效性。
   *
   * @param opts Configuration options determine how the control propagates changes and emits events
   * after updates and validity checks are applied.
   *
   * 配置选项确定控件在应用更新和有效性检查后如何传播更改和发出事件。
   *
   * * `onlySelf`: When true, only update this control. When false or not supplied,
   *   update all direct ancestors. Default is false.
   *
   *   `onlySelf` ：当 true 时，仅更新此控件。当 false 或未提供时，更新所有直接祖先。默认为 false。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control is updated.
   *   When false, no events are emitted.
   *
   *   `emitEvent` ：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象会在控件更新时发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  updateValueAndValidity(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._setInitialStatus();
    this._updateValue();

    if (this.enabled) {
      this._cancelExistingSubscription();
      (this as {errors: ValidationErrors | null}).errors = this._runValidator();
      (this as {status: FormControlStatus}).status = this._calculateStatus();

      if (this.status === VALID || this.status === PENDING) {
        this._runAsyncValidator(opts.emitEvent);
      }
    }

    if (opts.emitEvent !== false) {
      (this.valueChanges as EventEmitter<TValue>).emit(this.value);
      (this.statusChanges as EventEmitter<FormControlStatus>).emit(this.status);
    }

    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
    }
  }

  /** @internal */
  _updateTreeValidity(opts: {emitEvent?: boolean} = {emitEvent: true}): void {
    this._forEachChild((ctrl: AbstractControl) => ctrl._updateTreeValidity(opts));
    this.updateValueAndValidity({onlySelf: true, emitEvent: opts.emitEvent});
  }

  private _setInitialStatus() {
    (this as {status: FormControlStatus}).status = this._allControlsDisabled() ? DISABLED : VALID;
  }

  private _runValidator(): ValidationErrors|null {
    return this.validator ? this.validator(this) : null;
  }

  private _runAsyncValidator(emitEvent?: boolean): void {
    if (this.asyncValidator) {
      (this as {status: FormControlStatus}).status = PENDING;
      this._hasOwnPendingAsyncValidator = true;
      const obs = toObservable(this.asyncValidator(this));
      this._asyncValidationSubscription = obs.subscribe((errors: ValidationErrors|null) => {
        this._hasOwnPendingAsyncValidator = false;
        // This will trigger the recalculation of the validation status, which depends on
        // the state of the asynchronous validation (whether it is in progress or not). So, it is
        // necessary that we have updated the `_hasOwnPendingAsyncValidator` boolean flag first.
        this.setErrors(errors, {emitEvent});
      });
    }
  }

  private _cancelExistingSubscription(): void {
    if (this._asyncValidationSubscription) {
      this._asyncValidationSubscription.unsubscribe();
      this._hasOwnPendingAsyncValidator = false;
    }
  }

  /**
   * Sets errors on a form control when running validations manually, rather than automatically.
   *
   * 手动而不是自动运行验证时，在表单控件上设置错误。
   *
   * Calling `setErrors` also updates the validity of the parent control.
   *
   * 调用 `setErrors` 还会更新父控件的有效性。
   *
   * @usageNotes
   *
   * ### Manually set the errors for a control
   *
   * ### 手动设置控件的错误
   *
   * ```
   * const login = new FormControl('someLogin');
   * login.setErrors({
   *   notUnique: true
   * });
   *
   * expect(login.valid).toEqual(false);
   * expect(login.errors).toEqual({ notUnique: true });
   *
   * login.setValue('someOtherLogin');
   *
   * expect(login.valid).toEqual(true);
   * ```
   *
   */
  setErrors(errors: ValidationErrors|null, opts: {emitEvent?: boolean} = {}): void {
    (this as {errors: ValidationErrors | null}).errors = errors;
    this._updateControlsErrors(opts.emitEvent !== false);
  }

  /**
   * Retrieves a child control given the control's name or path.
   *
   * 检索给定控件的名称或路径的子控件。
   *
   * This signature for get supports strings and `const` arrays (`.get(['foo', 'bar'] as const)`).
   *
   * get 的此签名支持字符串和 `const` 数组（`.get(['foo', 'bar'] as const)`）。
   *
   */
  get<P extends string|(readonly(string|number)[])>(path: P):
      AbstractControl<ɵGetProperty<TRawValue, P>>|null;

  /**
   * Retrieves a child control given the control's name or path.
   *
   * 检索给定控件的名称或路径的子控件。
   *
   * This signature for `get` supports non-const (mutable) arrays. Inferred type
   * information will not be as robust, so prefer to pass a `readonly` array if possible.
   *
   * `get` 的此签名支持非常量（可变）数组。推断的类型信息将没有那么健壮，因此如果可能，更喜欢传递
   * `readonly` 数组。
   *
   */
  get<P extends string|Array<string|number>>(path: P):
      AbstractControl<ɵGetProperty<TRawValue, P>>|null;

  /**
   * Retrieves a child control given the control's name or path.
   *
   * 检索给定控件的名称或路径的子控件。
   *
   * @param path A dot-delimited string or array of string/number values that define the path to the
   * control. If a string is provided, passing it as a string literal will result in improved type
   * information. Likewise, if an array is provided, passing it `as const` will cause improved type
   * information to be available.
   *
   * 定义控件路径的以点号分隔的字符串或字符串/数字值数组。如果提供了字符串，则将其作为字符串文字传递将导致类型信息的改进。同样，如果提供了一个数组，则将其
   * `as const` 传递将导致使用改进的类型信息。
   *
   * @usageNotes
   *
   * ### Retrieve a nested control
   *
   * ### 检索嵌套控件
   *
   * For example, to get a `name` control nested within a `person` sub-group:
   *
   * 例如，要获取嵌套在 `person` 子组中的 `name` 控件：
   *
   * * `this.form.get('person.name');`
   *
   * \-OR-
   *
   * \-或-
   *
   * * `this.form.get(['person', 'name'] as const);` // `as const` gives improved typings
   *
   *   `this.form.get(['person', 'name'] as const);` // `as const` 给出了改进的类型
   *
   * ### Retrieve a control in a FormArray
   *
   * ### 检索 FormArray 中的控件
   *
   * When accessing an element inside a FormArray, you can use an element index.
   * For example, to get a `price` control from the first element in an `items` array you can use:
   *
   * 访问 FormArray 中的元素时，可以用元素索引。例如，要从 `items` 数组中的第一个元素获取 `price`
   * 控制，你可以用：
   *
   * * `this.form.get('items.0.price');`
   *
   * \-OR-
   *
   * \-或-
   *
   * * `this.form.get(['items', 0, 'price']);`
   *
   */
  get<P extends string|((string | number)[])>(path: P):
      AbstractControl<ɵGetProperty<TRawValue, P>>|null {
    let currPath: Array<string|number>|string = path;
    if (currPath == null) return null;
    if (!Array.isArray(currPath)) currPath = currPath.split('.');
    if (currPath.length === 0) return null;
    return currPath.reduce(
        (control: AbstractControl|null, name) => control && control._find(name), this);
  }

  /**
   * @description
   *
   * Reports error data for the control with the given path.
   *
   * 报告具有给定路径的控件的错误数据。
   *
   * @param errorCode The code of the error to check
   *
   * 要检查的错误代码
   *
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * 控件名称的列表，指定如何从当前控件移动到要查询错误的控件。
   *
   * @usageNotes
   *
   * For example, for the following `FormGroup`:
   *
   * 例如，对于以下 `FormGroup` ：
   *
   * ```
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * 从根表单到 'street' 控件的路径将是 'address' -> 'street'。
   *
   * It can be provided to this method in one of two formats:
   *
   * 它可以以两种格式之一提供给此方法：
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   *
   *    字符串控件名称的数组，例如 `['address', 'street']`
   *
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   *    一个字符串中以句点分隔的控件名称列表，例如 `'address.street'`
   *
   * @returns
   *
   * error data for that particular error. If the control or error is not present,
   * null is returned.
   *
   * 该特定错误的错误数据。如果不存在控件或错误，则返回 null 。
   *
   */
  getError(errorCode: string, path?: Array<string|number>|string): any {
    const control = path ? this.get(path) : this;
    return control && control.errors ? control.errors[errorCode] : null;
  }

  /**
   * @description
   *
   * Reports whether the control with the given path has the error specified.
   *
   * 报告具有给定路径的控件是否具有指定的错误。
   *
   * @param errorCode The code of the error to check
   *
   * 要检查的错误代码
   *
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * 控件名称的列表，指定如何从当前控件移动到要查询错误的控件。
   *
   * @usageNotes
   *
   * For example, for the following `FormGroup`:
   *
   * 例如，对于以下 `FormGroup` ：
   *
   * ```
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * 从根表单到 'street' 控件的路径将是 'address' -> 'street'。
   *
   * It can be provided to this method in one of two formats:
   *
   * 它可以以两种格式之一提供给此方法：
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   *
   *    字符串控件名称的数组，例如 `['address', 'street']`
   *
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   *    一个字符串中以句点分隔的控件名称列表，例如 `'address.street'`
   *
   * If no path is given, this method checks for the error on the current control.
   *
   * 如果没有给出路径，则此方法会检查当前控件上的错误。
   *
   * @returns
   *
   * whether the given error is present in the control at the given path.
   *
   * 给定错误是否存在于给定路径的控件中。
   *
   * If the control is not present, false is returned.
   *
   * 如果控件不存在，则返回 false 。
   *
   */
  hasError(errorCode: string, path?: Array<string|number>|string): boolean {
    return !!this.getError(errorCode, path);
  }

  /**
   * Retrieves the top-level ancestor of this control.
   *
   * 检索此控件的顶级祖先。
   *
   */
  get root(): AbstractControl {
    let x: AbstractControl = this;

    while (x._parent) {
      x = x._parent;
    }

    return x;
  }

  /** @internal */
  _updateControlsErrors(emitEvent: boolean): void {
    (this as {status: FormControlStatus}).status = this._calculateStatus();

    if (emitEvent) {
      (this.statusChanges as EventEmitter<FormControlStatus>).emit(this.status);
    }

    if (this._parent) {
      this._parent._updateControlsErrors(emitEvent);
    }
  }

  /** @internal */
  _initObservables() {
    (this as {valueChanges: Observable<TValue>}).valueChanges = new EventEmitter();
    (this as {statusChanges: Observable<FormControlStatus>}).statusChanges = new EventEmitter();
  }


  private _calculateStatus(): FormControlStatus {
    if (this._allControlsDisabled()) return DISABLED;
    if (this.errors) return INVALID;
    if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING)) return PENDING;
    if (this._anyControlsHaveStatus(INVALID)) return INVALID;
    return VALID;
  }

  /** @internal */
  abstract _updateValue(): void;

  /** @internal */
  abstract _forEachChild(cb: (c: AbstractControl) => void): void;

  /** @internal */
  abstract _anyControls(condition: (c: AbstractControl) => boolean): boolean;

  /** @internal */
  abstract _allControlsDisabled(): boolean;

  /** @internal */
  abstract _syncPendingControls(): boolean;

  /** @internal */
  _anyControlsHaveStatus(status: FormControlStatus): boolean {
    return this._anyControls((control: AbstractControl) => control.status === status);
  }

  /** @internal */
  _anyControlsDirty(): boolean {
    return this._anyControls((control: AbstractControl) => control.dirty);
  }

  /** @internal */
  _anyControlsTouched(): boolean {
    return this._anyControls((control: AbstractControl) => control.touched);
  }

  /** @internal */
  _updatePristine(opts: {onlySelf?: boolean} = {}): void {
    (this as {pristine: boolean}).pristine = !this._anyControlsDirty();

    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts);
    }
  }

  /** @internal */
  _updateTouched(opts: {onlySelf?: boolean} = {}): void {
    (this as {touched: boolean}).touched = this._anyControlsTouched();

    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts);
    }
  }

  /** @internal */
  _onDisabledChange: Array<(isDisabled: boolean) => void> = [];

  /** @internal */
  _registerOnCollectionChange(fn: () => void): void {
    this._onCollectionChange = fn;
  }

  /** @internal */
  _setUpdateStrategy(opts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null): void {
    if (isOptionsObj(opts) && opts.updateOn != null) {
      this._updateOn = opts.updateOn!;
    }
  }
  /**
   * Check to see if parent has been marked artificially dirty.
   *
   * 检查父级是否被人为标记为脏。
   *
   * @internal
   */
  private _parentMarkedDirty(onlySelf?: boolean): boolean {
    const parentDirty = this._parent && this._parent.dirty;
    return !onlySelf && !!parentDirty && !this._parent!._anyControlsDirty();
  }

  /** @internal */
  _find(name: string|number): AbstractControl|null {
    return null;
  }
}
