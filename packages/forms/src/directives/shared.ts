/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, InjectionToken, ɵRuntimeError as RuntimeError} from '@angular/core';

import {RuntimeErrorCode} from '../errors';
import {AbstractControl} from '../model/abstract_model';
import {FormArray} from '../model/form_array';
import {FormControl} from '../model/form_control';
import {FormGroup} from '../model/form_group';
import {getControlAsyncValidators, getControlValidators, mergeValidators} from '../validators';

import {AbstractControlDirective} from './abstract_control_directive';
import {AbstractFormGroupDirective} from './abstract_form_group_directive';
import {ControlContainer} from './control_container';
import {BuiltInControlValueAccessor, ControlValueAccessor} from './control_value_accessor';
import {DefaultValueAccessor} from './default_value_accessor';
import {NgControl} from './ng_control';
import {FormArrayName} from './reactive_directives/form_group_name';
import {ngModelWarning} from './reactive_errors';
import {AsyncValidatorFn, Validator, ValidatorFn} from './validators';

/**
 * Token to provide to allow SetDisabledState to always be called when a CVA is added, regardless of
 * whether the control is disabled or enabled.
 *
 * 要提供以允许在添加 CVA 时始终调用 SetDisabledState 的标记，无论控件是禁用还是启用。
 *
 * @see `FormsModule.withConfig`
 */
export const CALL_SET_DISABLED_STATE = new InjectionToken(
    'CallSetDisabledState', {providedIn: 'root', factory: () => setDisabledStateDefault});

/**
 * The type for CALL_SET_DISABLED_STATE. If `always`, then ControlValueAccessor will always call
 * `setDisabledState` when attached, which is the most correct behavior. Otherwise, it will only be
 * called when disabled, which is the legacy behavior for compatibility.
 *
 * CALL_SET_DISABLED_STATE 的类型。如果 `always` ，则 ControlValueAccessor 将在附加时始终调用 `setDisabledState` ，这是最正确的行为。否则，它只会在禁用时被调用，这是为了兼容的传统行为。
 *
 * @publicApi
 * @see `FormsModule.withConfig`
 */
export type SetDisabledStateOption = 'whenDisabledForLegacyCode'|'always';

/**
 * Whether to use the fixed setDisabledState behavior by default.
 *
 * 默认情况下，是否使用固定的 setDisabledState 行为。
 *
 */
export const setDisabledStateDefault: SetDisabledStateOption = 'always';

export function controlPath(name: string|null, parent: ControlContainer): string[] {
  return [...parent.path!, name!];
}

/**
 * Links a Form control and a Form directive by setting up callbacks (such as `onChange`) on both
 * instances. This function is typically invoked when form directive is being initialized.
 *
 * 通过在两个实例上设置回调（例如 `onChange`）来链接 Form 控件和 Form 指令。此函数通常在初始化 form
 * 指令时调用。
 *
 * @param control Form control instance that should be linked.
 *
 * 应该链接的表单控件实例。
 *
 * @param dir Directive that should be linked with a given control.
 *
 * 应该与给定控件链接的指令。
 *
 */
export function setUpControl(
    control: FormControl, dir: NgControl,
    callSetDisabledState: SetDisabledStateOption = setDisabledStateDefault): void {
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    if (!control) _throwError(dir, 'Cannot find control with');
    if (!dir.valueAccessor) _throwMissingValueAccessorError(dir);
  }

  setUpValidators(control, dir);

  dir.valueAccessor!.writeValue(control.value);

  // The legacy behavior only calls the CVA's `setDisabledState` if the control is disabled.
  // If the `callSetDisabledState` option is set to `always`, then this bug is fixed and
  // the method is always called.
  if (control.disabled || callSetDisabledState === 'always') {
    dir.valueAccessor!.setDisabledState?.(control.disabled);
  }

  setUpViewChangePipeline(control, dir);
  setUpModelChangePipeline(control, dir);

  setUpBlurPipeline(control, dir);

  setUpDisabledChangeHandler(control, dir);
}

/**
 * Reverts configuration performed by the `setUpControl` control function.
 * Effectively disconnects form control with a given form directive.
 * This function is typically invoked when corresponding form directive is being destroyed.
 *
 * `setUpControl` 控制函数执行的配置。有效地断开表单控制与给定的表单指令的连接。此函数通常在相应的
 * form 指令被销毁时调用。
 *
 * @param control Form control which should be cleaned up.
 *
 * 应该清理的表单控件。
 *
 * @param dir Directive that should be disconnected from a given control.
 *
 * 应该与给定控件断开连接的指令。
 *
 * @param validateControlPresenceOnChange Flag that indicates whether onChange handler should
 *     contain asserts to verify that it's not called once directive is destroyed. We need this flag
 *     to avoid potentially breaking changes caused by better control cleanup introduced in #39235.
 *
 * 指示 onChange
 * 处理程序是否应该包含断言的标志，以验证在指令被销毁后不会调用它。我们需要此标志来避免由于 #39235
 * 中引入的更好的控件清理而引起的潜在破坏性更改。
 *
 */
export function cleanUpControl(
    control: FormControl|null, dir: NgControl,
    validateControlPresenceOnChange: boolean = true): void {
  const noop = () => {
    if (validateControlPresenceOnChange && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      _noControlError(dir);
    }
  };

  // The `valueAccessor` field is typically defined on FromControl and FormControlName directive
  // instances and there is a logic in `selectValueAccessor` function that throws if it's not the
  // case. We still check the presence of `valueAccessor` before invoking its methods to make sure
  // that cleanup works correctly if app code or tests are setup to ignore the error thrown from
  // `selectValueAccessor`. See https://github.com/angular/angular/issues/40521.
  if (dir.valueAccessor) {
    dir.valueAccessor.registerOnChange(noop);
    dir.valueAccessor.registerOnTouched(noop);
  }

  cleanUpValidators(control, dir);

  if (control) {
    dir._invokeOnDestroyCallbacks();
    control._registerOnCollectionChange(() => {});
  }
}

function registerOnValidatorChange<V>(validators: (V|Validator)[], onChange: () => void): void {
  validators.forEach((validator: V|Validator) => {
    if ((<Validator>validator).registerOnValidatorChange)
      (<Validator>validator).registerOnValidatorChange!(onChange);
  });
}

/**
 * Sets up disabled change handler function on a given form control if ControlValueAccessor
 * associated with a given directive instance supports the `setDisabledState` call.
 *
 * 如果与给定指令实例关联的 ControlValueAccessor 支持 `setDisabledState`
 * 调用，则在给定的表单控件上设置禁用的更改处理程序函数。
 *
 * @param control Form control where disabled change handler should be setup.
 *
 * 应该设置禁用的更改处理程序的表单控件。
 *
 * @param dir Corresponding directive instance associated with this control.
 *
 * 与此控件关联的对应指令实例。
 *
 */
export function setUpDisabledChangeHandler(control: FormControl, dir: NgControl): void {
  if (dir.valueAccessor!.setDisabledState) {
    const onDisabledChange = (isDisabled: boolean) => {
      dir.valueAccessor!.setDisabledState!(isDisabled);
    };
    control.registerOnDisabledChange(onDisabledChange);

    // Register a callback function to cleanup disabled change handler
    // from a control instance when a directive is destroyed.
    dir._registerOnDestroy(() => {
      control._unregisterOnDisabledChange(onDisabledChange);
    });
  }
}

/**
 * Sets up sync and async directive validators on provided form control.
 * This function merges validators from the directive into the validators of the control.
 *
 * 在提供的表单控件上设置同步和异步指令验证器。此函数将指令中的验证器合并到控件的验证器中。
 *
 * @param control Form control where directive validators should be setup.
 *
 * 表单控制应该设置指令验证器的位置。
 *
 * @param dir Directive instance that contains validators to be setup.
 *
 * 包含要设置的验证器的指令实例。
 *
 */
export function setUpValidators(control: AbstractControl, dir: AbstractControlDirective): void {
  const validators = getControlValidators(control);
  if (dir.validator !== null) {
    control.setValidators(mergeValidators<ValidatorFn>(validators, dir.validator));
  } else if (typeof validators === 'function') {
    // If sync validators are represented by a single validator function, we force the
    // `Validators.compose` call to happen by executing the `setValidators` function with
    // an array that contains that function. We need this to avoid possible discrepancies in
    // validators behavior, so sync validators are always processed by the `Validators.compose`.
    // Note: we should consider moving this logic inside the `setValidators` function itself, so we
    // have consistent behavior on AbstractControl API level. The same applies to the async
    // validators logic below.
    control.setValidators([validators]);
  }

  const asyncValidators = getControlAsyncValidators(control);
  if (dir.asyncValidator !== null) {
    control.setAsyncValidators(
        mergeValidators<AsyncValidatorFn>(asyncValidators, dir.asyncValidator));
  } else if (typeof asyncValidators === 'function') {
    control.setAsyncValidators([asyncValidators]);
  }

  // Re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
  const onValidatorChange = () => control.updateValueAndValidity();
  registerOnValidatorChange<ValidatorFn>(dir._rawValidators, onValidatorChange);
  registerOnValidatorChange<AsyncValidatorFn>(dir._rawAsyncValidators, onValidatorChange);
}

/**
 * Cleans up sync and async directive validators on provided form control.
 * This function reverts the setup performed by the `setUpValidators` function, i.e.
 * removes directive-specific validators from a given control instance.
 *
 * 清理提供的表单控件上的同步和异步指令验证器。此函数会恢复 `setUpValidators`
 * 函数执行的设置，即从给定的控件实例中删除特定于指令的验证器。
 *
 * @param control Form control from where directive validators should be removed.
 *
 * 应该从中删除指令验证器的表单控件。
 *
 * @param dir Directive instance that contains validators to be removed.
 *
 * 包含要删除的验证器的指令实例。
 *
 * @returns
 *
 * true if a control was updated as a result of this action.
 *
 * 如果控件由于此操作而更新，则为 true 。
 *
 */
export function cleanUpValidators(
    control: AbstractControl|null, dir: AbstractControlDirective): boolean {
  let isControlUpdated = false;
  if (control !== null) {
    if (dir.validator !== null) {
      const validators = getControlValidators(control);
      if (Array.isArray(validators) && validators.length > 0) {
        // Filter out directive validator function.
        const updatedValidators = validators.filter((validator) => validator !== dir.validator);
        if (updatedValidators.length !== validators.length) {
          isControlUpdated = true;
          control.setValidators(updatedValidators);
        }
      }
    }

    if (dir.asyncValidator !== null) {
      const asyncValidators = getControlAsyncValidators(control);
      if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
        // Filter out directive async validator function.
        const updatedAsyncValidators =
            asyncValidators.filter((asyncValidator) => asyncValidator !== dir.asyncValidator);
        if (updatedAsyncValidators.length !== asyncValidators.length) {
          isControlUpdated = true;
          control.setAsyncValidators(updatedAsyncValidators);
        }
      }
    }
  }

  // Clear onValidatorChange callbacks by providing a noop function.
  const noop = () => {};
  registerOnValidatorChange<ValidatorFn>(dir._rawValidators, noop);
  registerOnValidatorChange<AsyncValidatorFn>(dir._rawAsyncValidators, noop);

  return isControlUpdated;
}

function setUpViewChangePipeline(control: FormControl, dir: NgControl): void {
  dir.valueAccessor!.registerOnChange((newValue: any) => {
    control._pendingValue = newValue;
    control._pendingChange = true;
    control._pendingDirty = true;

    if (control.updateOn === 'change') updateControl(control, dir);
  });
}

function setUpBlurPipeline(control: FormControl, dir: NgControl): void {
  dir.valueAccessor!.registerOnTouched(() => {
    control._pendingTouched = true;

    if (control.updateOn === 'blur' && control._pendingChange) updateControl(control, dir);
    if (control.updateOn !== 'submit') control.markAsTouched();
  });
}

function updateControl(control: FormControl, dir: NgControl): void {
  if (control._pendingDirty) control.markAsDirty();
  control.setValue(control._pendingValue, {emitModelToViewChange: false});
  dir.viewToModelUpdate(control._pendingValue);
  control._pendingChange = false;
}

function setUpModelChangePipeline(control: FormControl, dir: NgControl): void {
  const onChange = (newValue?: any, emitModelEvent?: boolean) => {
    // control -> view
    dir.valueAccessor!.writeValue(newValue);

    // control -> ngModel
    if (emitModelEvent) dir.viewToModelUpdate(newValue);
  };
  control.registerOnChange(onChange);

  // Register a callback function to cleanup onChange handler
  // from a control instance when a directive is destroyed.
  dir._registerOnDestroy(() => {
    control._unregisterOnChange(onChange);
  });
}

/**
 * Links a FormGroup or FormArray instance and corresponding Form directive by setting up validators
 * present in the view.
 *
 * 通过设置视图中的验证器来链接 FormGroup 或 FormArray 实例和对应的 Form 指令。
 *
 * @param control FormGroup or FormArray instance that should be linked.
 *
 * 应该链接的 FormGroup 或 FormArray 实例。
 *
 * @param dir Directive that provides view validators.
 *
 * 提供视图验证器的指令。
 *
 */
export function setUpFormContainer(
    control: FormGroup|FormArray, dir: AbstractFormGroupDirective|FormArrayName) {
  if (control == null && (typeof ngDevMode === 'undefined' || ngDevMode))
    _throwError(dir, 'Cannot find control with');
  setUpValidators(control, dir);
}

/**
 * Reverts the setup performed by the `setUpFormContainer` function.
 *
 * `setUpFormContainer` 函数执行的设置。
 *
 * @param control FormGroup or FormArray instance that should be cleaned up.
 *
 * 应该清理的 FormGroup 或 FormArray 实例。
 *
 * @param dir Directive that provided view validators.
 *
 * 提供视图验证器的指令。
 *
 * @returns
 *
 * true if a control was updated as a result of this action.
 *
 * 如果控件由于此操作而更新，则为 true 。
 *
 */
export function cleanUpFormContainer(
    control: FormGroup|FormArray, dir: AbstractFormGroupDirective|FormArrayName): boolean {
  return cleanUpValidators(control, dir);
}

function _noControlError(dir: NgControl) {
  return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}

function _throwError(dir: AbstractControlDirective, message: string): void {
  const messageEnd = _describeControlLocation(dir);
  throw new Error(`${message} ${messageEnd}`);
}

function _describeControlLocation(dir: AbstractControlDirective): string {
  const path = dir.path;
  if (path && path.length > 1) return `path: '${path.join(' -> ')}'`;
  if (path?.[0]) return `name: '${path}'`;
  return 'unspecified name attribute';
}

function _throwMissingValueAccessorError(dir: AbstractControlDirective) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(
      RuntimeErrorCode.NG_MISSING_VALUE_ACCESSOR, `No value accessor for form control ${loc}.`);
}

function _throwInvalidValueAccessorError(dir: AbstractControlDirective) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(
      RuntimeErrorCode.NG_VALUE_ACCESSOR_NOT_PROVIDED,
      `Value accessor was not provided as an array for form control with ${loc}. ` +
          `Check that the \`NG_VALUE_ACCESSOR\` token is configured as a \`multi: true\` provider.`);
}

export function isPropertyUpdated(changes: {[key: string]: any}, viewModel: any): boolean {
  if (!changes.hasOwnProperty('model')) return false;
  const change = changes['model'];

  if (change.isFirstChange()) return true;
  return !Object.is(viewModel, change.currentValue);
}

export function isBuiltInAccessor(valueAccessor: ControlValueAccessor): boolean {
  // Check if a given value accessor is an instance of a class that directly extends
  // `BuiltInControlValueAccessor` one.
  return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}

export function syncPendingControls(form: FormGroup, directives: Set<NgControl>|NgControl[]): void {
  form._syncPendingControls();
  directives.forEach((dir: NgControl) => {
    const control = dir.control as FormControl;
    if (control.updateOn === 'submit' && control._pendingChange) {
      dir.viewToModelUpdate(control._pendingValue);
      control._pendingChange = false;
    }
  });
}

// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
export function selectValueAccessor(
    dir: NgControl, valueAccessors: ControlValueAccessor[]): ControlValueAccessor|null {
  if (!valueAccessors) return null;

  if (!Array.isArray(valueAccessors) && (typeof ngDevMode === 'undefined' || ngDevMode))
    _throwInvalidValueAccessorError(dir);

  let defaultAccessor: ControlValueAccessor|undefined = undefined;
  let builtinAccessor: ControlValueAccessor|undefined = undefined;
  let customAccessor: ControlValueAccessor|undefined = undefined;

  valueAccessors.forEach((v: ControlValueAccessor) => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwError(dir, 'More than one built-in value accessor matches form control with');
      builtinAccessor = v;
    } else {
      if (customAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwError(dir, 'More than one custom value accessor matches form control with');
      customAccessor = v;
    }
  });

  if (customAccessor) return customAccessor;
  if (builtinAccessor) return builtinAccessor;
  if (defaultAccessor) return defaultAccessor;

  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    _throwError(dir, 'No valid value accessor for form control with');
  }
  return null;
}

export function removeListItem<T>(list: T[], el: T): void {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}

// TODO(kara): remove after deprecation period
export function _ngModelWarning(
    name: string, type: {_ngModelWarningSentOnce: boolean},
    instance: {_ngModelWarningSent: boolean}, warningConfig: string|null) {
  if (warningConfig === 'never') return;

  if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
      (warningConfig === 'always' && !instance._ngModelWarningSent)) {
    console.warn(ngModelWarning(name));
    type._ngModelWarningSentOnce = true;
    instance._ngModelWarningSent = true;
  }
}
