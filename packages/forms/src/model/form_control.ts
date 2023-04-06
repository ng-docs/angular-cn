/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AsyncValidatorFn, ValidatorFn} from '../directives/validators';
import {removeListItem} from '../util';

import {AbstractControl, AbstractControlOptions, isOptionsObj, pickAsyncValidators, pickValidators} from './abstract_model';

/**
 * FormControlState is a boxed form value. It is an object with a `value` key and a `disabled` key.
 *
 * FormControlState 是一个装箱的表单值。它是一个带有 `value` 键和 `disabled` 键的对象。
 *
 * @publicApi
 */
export interface FormControlState<T> {
  value: T;
  disabled: boolean;
}

/**
 * Interface for options provided to a `FormControl`.
 *
 * 提供给 `FormControl` 的选项的接口。
 *
 * This interface extends all options from {@link AbstractControlOptions}, plus some options
 * unique to `FormControl`.
 *
 * @publicApi
 */
export interface FormControlOptions extends AbstractControlOptions {
  /**
   * @description
   *
   * Whether to use the initial value used to construct the `FormControl` as its default value
   * as well. If this option is false or not provided, the default value of a FormControl is `null`.
   * When a FormControl is reset without an explicit value, its value reverts to
   * its default value.
   *
   * 是否也使用用于构造 `FormControl` 的初始值作为其默认值。如果此选项为 false 或未提供，则 FormControl 的默认值为 `null` 。当没有显式值的情况下重置 FormControl 时，其值将恢复为默认值。
   *
   */
  nonNullable?: boolean;

  /**
   * @deprecated Use `nonNullable` instead.
   */
  initialValueIsDefault?: boolean;
}

/**
 * Tracks the value and validation status of an individual form control.
 *
 * 追踪单个表单控件的值和验证状态。
 *
 * This is one of the four fundamental building blocks of Angular forms, along with
 * `FormGroup`, `FormArray` and `FormRecord`. It extends the `AbstractControl` class that
 * implements most of the base functionality for accessing the value, validation status,
 * user interactions and events.
 *
 * 这是 Angular 表单的四个基本构建块之一，与 `FormGroup`、`FormArray` 和 `FormRecord` 。它扩展了 `AbstractControl` 类，该类实现了用于访问值、验证状态、用户交互和事件的大多数基础特性。
 *
 * `FormControl` takes a single generic argument, which describes the type of its value. This
 * argument always implicitly includes `null` because the control can be reset. To change this
 * behavior, set `nonNullable` or see the usage notes below.
 *
 * `FormControl` 接受一个通用参数，该参数描述其值的类型。此参数始终隐式包含 `null` ，因为控件可以重置。要更改此行为，请设置 `nonNullable` 或查看下面的使用说明。
 *
 * See [usage examples below](#usage-notes).
 *
 * @see `AbstractControl`
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * [响应式表单](/guide/reactive-forms)
 *
 * @see [Usage Notes](#usage-notes)
 * @publicApi
 * @overriddenImplementation ɵFormControlCtor
 * @usageNotes
 *
 * ### Initializing Form Controls
 *
 * ### 初始化表单控件
 *
 * Instantiate a `FormControl`, with an initial value.
 *
 * 用一个初始值初始化 `FormControl`。
 *
 * ```ts
 * const control = new FormControl('some value');
 * console.log(control.value);     // 'some value'
 * ```
 *
 * The following example initializes the control with a form state object. The `value`
 * and `disabled` keys are required in this case.
 *
 * 下面的例子用一个表单状态对象初始化控件。这里用到的是 `value` 和 `disabled` 键。
 *
 * ```ts
 * const control = new FormControl({ value: 'n/a', disabled: true });
 * console.log(control.value);     // 'n/a'
 * console.log(control.status);    // 'DISABLED'
 * ```
 *
 * The following example initializes the control with a synchronous validator.
 *
 * 以下示例使用同步验证器初始化控件。
 *
 * ```ts
 * const control = new FormControl('', Validators.required);
 * console.log(control.value);      // ''
 * console.log(control.status);     // 'INVALID'
 * ```
 *
 * The following example initializes the control using an options object.
 *
 * 下面的例子使用一个配置对象初始化了该控件。
 *
 * ```ts
 * const control = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * ### The single type argument
 *
 * ### 单一类型参数
 *
 * `FormControl` accepts a generic argument, which describes the type of its value.
 * In most cases, this argument will be inferred.
 *
 * `FormControl` 接受一个通用参数，该参数描述了其值的类型。在大多数情况下，将推断此参数。
 *
 * If you are initializing the control to `null`, or you otherwise wish to provide a
 * wider type, you may specify the argument explicitly:
 *
 * 如果你将控件初始化为 `null` ，或者你希望提供更广泛的类型，你可以显式指定参数：
 *
 * ```
 * let fc = new FormControl<string|null>(null);
 * fc.setValue('foo');
 * ```
 *
 * You might notice that `null` is always added to the type of the control.
 * This is because the control will become `null` if you call `reset`. You can change
 * this behavior by setting `{nonNullable: true}`.
 *
 * 你可能会注意到 `null` 始终添加到控件的类型。这是因为如果你调用 `reset` ，控件将变为 `null` 。你可以通过设置 `{nonNullable: true}` 来更改此行为。
 *
 * ### Configure the control to update on a blur event
 *
 * ### 配置该控件，使其在发生 `blur` 事件时更新
 *
 * Set the `updateOn` option to `'blur'` to update on the blur `event`.
 *
 * 把 `updateOn` 选项设置为 `'blur'`，可以在发生 `blur` 事件时更新。
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * ### Configure the control to update on a submit event
 *
 * ### 配置该控件，使其在发生 `submit` 事件时更新
 *
 * Set the `updateOn` option to `'submit'` to update on a submit `event`.
 *
 * 把 `updateOn` 选项设置为 `'submit'`，可以在发生 `submit` 事件时更新。
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'submit' });
 * ```
 *
 * ### Reset the control back to a specific value
 *
 * ### 将控件重置为特定值
 *
 * You reset to a specific form state by passing through a standalone
 * value or a form state object that contains both a value and a disabled state
 * (these are the only two properties that cannot be calculated).
 *
 * 通过传递包含值和禁用状态的独立值或表单状态对象，可以将其重置为特定的表单状态（这是所支持的仅有的两个非计算状态）。
 *
 * ```ts
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 *
 * control.reset('Drew');
 *
 * console.log(control.value); // 'Drew'
 * ```
 *
 * ### Reset the control to its initial value
 *
 * ### 将控件重置为其初始值
 *
 * If you wish to always reset the control to its initial value (instead of null),
 * you can pass the `nonNullable` option:
 *
 * 如果你希望始终将控件重置为其初始值（而不是 null），可以传递 `nonNullable` 选项：
 *
 * ```
 * const control = new FormControl('Nancy', {nonNullable: true});
 *
 * console.log(control.value); // 'Nancy'
 *
 * control.reset();
 *
 * console.log(control.value); // 'Nancy'
 * ```
 *
 * ### Reset the control back to an initial value and disabled
 *
 * ### 把该控件重置回初始值并禁用。
 *
 * ```
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 * console.log(control.status); // 'VALID'
 *
 * control.reset({ value: 'Drew', disabled: true });
 *
 * console.log(control.value); // 'Drew'
 * console.log(control.status); // 'DISABLED'
 * ```
 *
 */
export interface FormControl<TValue = any> extends AbstractControl<TValue> {
  /**
   * The default value of this FormControl, used whenever the control is reset without an explicit
   * value. See {@link FormControlOptions#nonNullable} for more information on configuring
   * a default value.
   */
  readonly defaultValue: TValue;

  /** @internal */
  _onChange: Function[];

  /**
   * This field holds a pending value that has not yet been applied to the form's value.
   * @internal
   */
  _pendingValue: TValue;

  /** @internal */
  _pendingChange: boolean;

  /**
   * Sets a new value for the form control.
   *
   * 设置该表单控件的新值。
   *
   * @param value The new value for the control.
   *
   * 控件的新值。
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events when the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   *   false.
   *
   *   `onlySelf`:：如果为 `true`，则每个变更仅仅影响当前控件，而不会影响父控件。默认为 `false`。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control value is updated.
   *   When false, no events are emitted.
   *
   *   `emitEvent`：如果为 `true` 或未提供（默认），则当控件值变化时， `statusChanges` 和 `valueChanges` 这两个 Observable 都会以最近的状态和值发出事件。 如果为 `false`，则不会发出事件。
   *
   * * `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an
   *   `onChange` event to
   *   update the view.
   *
   *   `emitModelToViewChange`：如果为 `true` 或未提供（默认），则每次变化都会触发一个 `onChange` 事件以更新视图。
   *
   * * `emitViewToModelChange`: When true or not supplied (the default), each change triggers an
   *   `ngModelChange`
   *   event to update the model.
   *
   *   `emitViewToModelChange`：如果为 `true` 或未提供（默认），则每次变化都会触发一个 `ngModelChange` 事件以更新模型。
   *
   */
  setValue(value: TValue, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean,
    emitModelToViewChange?: boolean,
    emitViewToModelChange?: boolean
  }): void;

  /**
   * Patches the value of a control.
   *
   * 修补控件的值。
   *
   * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
   * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
   * `FormArrays`, where it does behave differently.
   *
   * @see `setValue` for options
   *
   * `setValue` 的配置项
   *
   */
  patchValue(value: TValue, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean,
    emitModelToViewChange?: boolean,
    emitViewToModelChange?: boolean
  }): void;

  /**
   * Resets the form control, marking it `pristine` and `untouched`, and resetting
   * the value. The new value will be the provided value (if passed), `null`, or the initial value
   * if `nonNullable` was set in the constructor via {@link FormControlOptions}.
   *
   * ```ts
   * // By default, the control will reset to null.
   * const dog = new FormControl('spot');
   * dog.reset(); // dog.value is null
   *
   * // If this flag is set, the control will instead reset to the initial value.
   * const cat = new FormControl('tabby', {nonNullable: true});
   * cat.reset(); // cat.value is "tabby"
   *
   * // A value passed to reset always takes precedence.
   * const fish = new FormControl('finn', {nonNullable: true});
   * fish.reset('bubble'); // fish.value is "bubble"
   * ```
   *
   * @param formState Resets the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * 使用初始值或一个包含初始值和禁用状态的对象来重置该控件。
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events after the value changes.
   *
   * 当值发生变化时，该配置项会决定控件如何传播变更以及发出事件。
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   *   false.
   *
   *   `onlySelf`:：如果为 `true`，则每个变更仅仅影响当前控件，而不会影响父控件。默认为 `false`。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control is reset.
   *   When false, no events are emitted.
   *
   *   `emitEvent`：如果为 `true` 或未提供（默认），则当控件被重置时， `statusChanges` 和 `valueChanges` 这两个 Observable 都会以最近的状态和值发出事件。 如果为 `false`，则不会发出事件。
   *
   */
  reset(formState?: TValue|FormControlState<TValue>, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean
  }): void;

  /**
   * For a simple FormControl, the raw value is equivalent to the value.
   *
   * 对于简单的 FormControl ，原始值等于 值。
   *
   */
  getRawValue(): TValue;

  /**
   * @internal
   */
  _updateValue(): void;

  /**
   * @internal
   */
  _anyControls(condition: (c: AbstractControl) => boolean): boolean;

  /**
   * @internal
   */
  _allControlsDisabled(): boolean;


  /**
   * Register a listener for change events.
   *
   * 注册变更事件的监听器。
   *
   * @param fn The method that is called when the value changes
   *
   * 当值变化时，就会调用该方法。
   *
   */
  registerOnChange(fn: Function): void;


  /**
   * Internal function to unregister a change events listener.
   * @internal
   */
  _unregisterOnChange(fn: (value?: any, emitModelEvent?: boolean) => void): void;

  /**
   * Register a listener for disabled events.
   *
   * 注册禁用事件的监听器。
   *
   * @param fn The method that is called when the disabled status changes.
   *
   * 当禁用状态发生变化时，就会调用该方法。
   *
   */
  registerOnDisabledChange(fn: (isDisabled: boolean) => void): void;

  /**
   * Internal function to unregister a disabled event listener.
   * @internal
   */
  _unregisterOnDisabledChange(fn: (isDisabled: boolean) => void): void;

  /**
   * @internal
   */
  _forEachChild(cb: (c: AbstractControl) => void): void;

  /** @internal */
  _syncPendingControls(): boolean;
}

// This internal interface is present to avoid a naming clash, resulting in the wrong `FormControl`
// symbol being used.
type FormControlInterface<TValue = any> = FormControl<TValue>;

/**
 * Various available constructors for `FormControl`.
 * Do not use this interface directly. Instead, use `FormControl`:
 *
 * ```
 * const fc = new FormControl('foo');
 * ```
 *
 * This symbol is prefixed with ɵ to make plain that it is an internal symbol.
 *
 */
export interface ɵFormControlCtor {
  /**
   * Construct a FormControl with no initial value or validators.
   *
   * 构造一个没有初始值或验证器的 FormControl 。
   *
   */
  new(): FormControl<any>;

  /**
   * Creates a new `FormControl` instance.
   *
   * 创建新的 `FormControl` 实例。
   *
   * @param formState Initializes the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * 使用一个初始值或定义了初始值和禁用状态的对象初始化该控件。
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or a `FormControlOptions` object that contains validation functions
   * and a validation trigger.
   * @param asyncValidator A single async validator or array of async validator functions
   *
   * 单个的异步验证器函数或其数组。
   *
   */
  new<T = any>(value: FormControlState<T>|T, opts: FormControlOptions&{nonNullable: true}):
      FormControl<T>;

  /**
   * @deprecated Use `nonNullable` instead.
   */
  new<T = any>(value: FormControlState<T>|T, opts: FormControlOptions&{
    initialValueIsDefault: true
  }): FormControl<T>;

  /**
   * @deprecated When passing an `options` argument, the `asyncValidator` argument has no effect.
   */
  new<T = any>(
      value: FormControlState<T>|T, opts: FormControlOptions,
      asyncValidator: AsyncValidatorFn|AsyncValidatorFn[]): FormControl<T|null>;

  new<T = any>(
      value: FormControlState<T>|T,
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|FormControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormControl<T|null>;

  /**
   * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
   * manually inspect the prototype chain.
   *
   * 显式 `prototype` 属性的存在为手动检查原型链的应用程序提供了向后兼容。
   *
   */
  prototype: FormControl<any>;
}

function isFormControlState(formState: unknown): formState is FormControlState<unknown> {
  return typeof formState === 'object' && formState !== null &&
      Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
}

export const FormControl: ɵFormControlCtor =
    (class FormControl<TValue = any> extends AbstractControl<
         TValue> implements FormControlInterface<TValue> {
      /** @publicApi */
      public readonly defaultValue: TValue = null as unknown as TValue;

      /** @internal */
      _onChange: Array<Function> = [];

      /** @internal */
      _pendingValue!: TValue;

      /** @internal */
      _pendingChange: boolean = false;

      constructor(
          // formState and defaultValue will only be null if T is nullable
          formState: FormControlState<TValue>|TValue = null as unknown as TValue,
          validatorOrOpts?: ValidatorFn|ValidatorFn[]|FormControlOptions|null,
          asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
        super(
            pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this._initObservables();
        this.updateValueAndValidity({
          onlySelf: true,
          // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
          // `VALID` or `INVALID`.
          // The status should be broadcasted via the `statusChanges` observable, so we set
          // `emitEvent` to `true` to allow that during the control creation process.
          emitEvent: !!this.asyncValidator
        });
        if (isOptionsObj(validatorOrOpts) &&
            (validatorOrOpts.nonNullable || validatorOrOpts.initialValueIsDefault)) {
          if (isFormControlState(formState)) {
            this.defaultValue = formState.value;
          } else {
            this.defaultValue = formState;
          }
        }
      }

      override setValue(value: TValue, options: {
        onlySelf?: boolean,
        emitEvent?: boolean,
        emitModelToViewChange?: boolean,
        emitViewToModelChange?: boolean
      } = {}): void {
        (this as {value: TValue}).value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
          this._onChange.forEach(
              (changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
        }
        this.updateValueAndValidity(options);
      }

      override patchValue(value: TValue, options: {
        onlySelf?: boolean,
        emitEvent?: boolean,
        emitModelToViewChange?: boolean,
        emitViewToModelChange?: boolean
      } = {}): void {
        this.setValue(value, options);
      }

      override reset(
          formState: TValue|FormControlState<TValue> = this.defaultValue,
          options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
      }

      /**  @internal */
      override _updateValue(): void {}

      /**  @internal */
      override _anyControls(condition: (c: AbstractControl) => boolean): boolean {
        return false;
      }

      /**  @internal */
      override _allControlsDisabled(): boolean {
        return this.disabled;
      }

      registerOnChange(fn: Function): void {
        this._onChange.push(fn);
      }

      /** @internal */
      _unregisterOnChange(fn: (value?: any, emitModelEvent?: boolean) => void): void {
        removeListItem(this._onChange, fn);
      }

      registerOnDisabledChange(fn: (isDisabled: boolean) => void): void {
        this._onDisabledChange.push(fn);
      }

      /** @internal */
      _unregisterOnDisabledChange(fn: (isDisabled: boolean) => void): void {
        removeListItem(this._onDisabledChange, fn);
      }

      /** @internal */
      override _forEachChild(cb: (c: AbstractControl) => void): void {}

      /** @internal */
      override _syncPendingControls(): boolean {
        if (this.updateOn === 'submit') {
          if (this._pendingDirty) this.markAsDirty();
          if (this._pendingTouched) this.markAsTouched();
          if (this._pendingChange) {
            this.setValue(this._pendingValue, {onlySelf: true, emitModelToViewChange: false});
            return true;
          }
        }
        return false;
      }

      private _applyFormState(formState: FormControlState<TValue>|TValue) {
        if (isFormControlState(formState)) {
          (this as {value: TValue}).value = this._pendingValue = formState.value;
          formState.disabled ? this.disable({onlySelf: true, emitEvent: false}) :
                               this.enable({onlySelf: true, emitEvent: false});
        } else {
          (this as {value: TValue}).value = this._pendingValue = formState;
        }
      }
    });

interface UntypedFormControlCtor {
  new(): UntypedFormControl;

  new(formState?: any, validatorOrOpts?: ValidatorFn|ValidatorFn[]|FormControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): UntypedFormControl;

  /**
   * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
   * manually inspect the prototype chain.
   *
   * 显式 `prototype` 属性的存在为手动检查原型链的应用程序提供了向后兼容。
   *
   */
  prototype: FormControl<any>;
}

/**
 * UntypedFormControl is a non-strongly-typed version of `FormControl`.
 */
export type UntypedFormControl = FormControl<any>;

export const UntypedFormControl: UntypedFormControlCtor = FormControl;

/**
 * @description
 * Asserts that the given control is an instance of `FormControl`
 *
 * @publicApi
 */
export const isFormControl = (control: unknown): control is FormControl =>
    control instanceof FormControl;
