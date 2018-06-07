/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {composeAsyncValidators, composeValidators} from './directives/shared';
import {AsyncValidatorFn, ValidationErrors, ValidatorFn} from './directives/validators';
import {toObservable} from './validators';

/**
 * @description
 * Reports that a FormControl is valid, in that no errors exist in the input value.
 *
 */
export const VALID = 'VALID';

/**
 * @description
 * Reports that a FormControl is invalid, in that an error exists in the input value.
 */
export const INVALID = 'INVALID';

/**
 * @description
 * Reports that a FormControl is pending, in that that async validation is occurring and
 * errors are not yet available for the input value.
 * 
 * @see `markAsPending`
 */
export const PENDING = 'PENDING';

/**
 * @description
 * Reports that a FormControl is disabled, i.e. that the control is exempt from ancestor
 * calculations of validity or value.
 * 
 * @see `markAsDisabled`
 */
export const DISABLED = 'DISABLED';

function _find(control: AbstractControl, path: Array<string|number>| string, delimiter: string) {
  if (path == null) return null;

  if (!(path instanceof Array)) {
    path = (<string>path).split(delimiter);
  }
  if (path instanceof Array && (path.length === 0)) return null;

  return (<Array<string|number>>path).reduce((v: AbstractControl, name) => {
    if (v instanceof FormGroup) {
      return v.controls.hasOwnProperty(name as string) ? v.controls[name] : null;
    }

    if (v instanceof FormArray) {
      return v.at(<number>name) || null;
    }

    return null;
  }, control);
}

function coerceToValidator(
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null): ValidatorFn|
    null {
  const validator =
      (isOptionsObj(validatorOrOpts) ? (validatorOrOpts as AbstractControlOptions).validators :
                                       validatorOrOpts) as ValidatorFn |
      ValidatorFn[] | null;

  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}

function coerceToAsyncValidator(
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, validatorOrOpts?: ValidatorFn |
        ValidatorFn[] | AbstractControlOptions | null): AsyncValidatorFn|null {
  const origAsyncValidator =
      (isOptionsObj(validatorOrOpts) ? (validatorOrOpts as AbstractControlOptions).asyncValidators :
                                       asyncValidator) as AsyncValidatorFn |
      AsyncValidatorFn | null;

  return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) :
                                             origAsyncValidator || null;
}

export type FormHooks = 'change' | 'blur' | 'submit';

/**
 * @description
 *
 * Interface for options provided to an `AbstractControl`.
 *
 * @experimental
 */
export interface AbstractControlOptions {
  /**
   * List of validators applied to control.
   */
  validators?: ValidatorFn|ValidatorFn[]|null;
  /**
   * List of async validators applied to control.
   */
  asyncValidators?: AsyncValidatorFn|AsyncValidatorFn[]|null;
  /**
   * The event name for control to update upon.
   */
  updateOn?: 'change'|'blur'|'submit';
}


function isOptionsObj(
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null): boolean {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
      typeof validatorOrOpts === 'object';
}


/**
 * @description
 *
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 */
export abstract class AbstractControl {
  /** @internal */
  _pendingDirty: boolean;

  /** @internal */
  _pendingTouched: boolean;

  /** @internal */
  _onCollectionChange = () => {};

  /** @internal */
  _updateOn: FormHooks;

  private _parent: FormGroup|FormArray;
  private _asyncValidationSubscription: any;

  /**
   * @description
   * Reports the current value of the control. Only includes
   * the values of enabled controls.
   *
   */
  public readonly value: any;

  /**
   * @description
   * Initialize the AbstractControl instance.
   *
   * @param validator The function that will determine the synchronous validity of this control.
   * @param asyncValidator The function that will determine the asynchronous validity of this
   * control.
   */
  constructor(public validator: ValidatorFn|null, public asyncValidator: AsyncValidatorFn|null) {}

  /**
   * @description
   * The parent control.
   */
  get parent(): FormGroup|FormArray { return this._parent; }

  /**
   * @description
   * The validation status of the control. There are four possible
   * validation status values:
   *
   * * **VALID**: This control has passed all validation checks.
   * * **INVALID**: This control has failed at least one validation check.
   * * **PENDING**: This control is in the midst of conducting a validation check.
   * * **DISABLED**: This control is exempt from validation checks.
   *
   * These status values are mutually exclusive, so a control cannot be
   * both valid AND invalid or invalid AND disabled.
   */
  public readonly status: string;

  /**
   * @description
   * A control is `valid` when its `status` is `VALID`.
   *
   * True if the control has passed all of its validation tests,
   * false otherwise.
   */
  get valid(): boolean { return this.status === VALID; }

  /**
   * @description
   * A control is `invalid` when its `status` is `INVALID`.
   *
   * True if this control has failed one or more of its validation checks,
   * false otherwise.
   */
  get invalid(): boolean { return this.status === INVALID; }

  /**
   * @description
   * A control is `pending` when its `status` is `PENDING`.
   *
   * True if this control is in the process of conducting a validation check,
   * false otherwise.
   */
  get pending(): boolean { return this.status == PENDING; }

  /**
   * @description
   * A control is `disabled` when its `status` is `DISABLED`.
   *
   * True if the control is disabled, false otherwise.
   *
   * Disabled controls are exempt from validation checks and
   * are not included in the aggregate value of their ancestor
   * controls.
   */
  get disabled(): boolean { return this.status === DISABLED; }

  /**
   * @description
   * A control is `enabled` as long as its `status` is not `DISABLED`.
   *
   * True if the control has any status other than 'DISABLED',
   * false if the status is 'DISABLED'.
   *
   */
  get enabled(): boolean { return this.status !== DISABLED; }

  /**
   * @description
   * An object containing any errors generated by failing validation,
   * or null if there are no errors.
   */
  public readonly errors: ValidationErrors|null;

  /**
   * @description
   * A control is `pristine` if the user has not yet changed
   * the value in the UI.
   *
   * True if the user has not yet changed the value in the UI; compare `dirty`.
   * Programmatic changes to a control's value do not mark it dirty.
   */
  public readonly pristine: boolean = true;

  /**
   * @description
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * True if the user has changed the value of this control in the UI; compare `pristine`.
   * Programmatic changes to a control's value do not mark it dirty.
   */
  get dirty(): boolean { return !this.pristine; }

  /**
   * @description
   * A control is marked `touched` once the user has triggered
   * a `blur` event on it.
   */
  public readonly touched: boolean = false;

  /**
   * @description
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   */
  get untouched(): boolean { return !this.touched; }

  /**
   * @description
   * An observable that emits an event every time the value of the control changes, in
   * the UI or programmatically.
   */
  public readonly valueChanges: Observable<any>;

  /**
   * @description
   * An observable that emits an event every time the validation `status` of the control
   * is re-calculated.
   */
  public readonly statusChanges: Observable<any>;

  /**
   * @description
   * Reports the update strategy of the `AbstractControl` (i.e.
   * the event on which the control will update itself).
   * Possible values: `'change'` | `'blur'` | `'submit'`
   * Default value: `'change'`
   */
  get updateOn(): FormHooks {
    return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
  }

  /**
   * @description
   * Sets the synchronous validators that are active on this control.  Calling
   * this will overwrite any existing sync validators.
   */
  setValidators(newValidator: ValidatorFn|ValidatorFn[]|null): void {
    this.validator = coerceToValidator(newValidator);
  }

  /**
   * @description
   * Sets the async validators that are active on this control. Calling this
   * will overwrite any existing async validators.
   */
  setAsyncValidators(newValidator: AsyncValidatorFn|AsyncValidatorFn[]|null): void {
    this.asyncValidator = coerceToAsyncValidator(newValidator);
  }

  /**
   * @description
   * Empties out the sync validator list.
   */
  clearValidators(): void { this.validator = null; }

  /**
   * @description
   * Empties out the async validator list.
   */
  clearAsyncValidators(): void { this.asyncValidator = null; }

  /**
   * @description
   * Marks the control as `touched`. A control is touched by focus and
   * blur events that do not change the value; compare markAsDirty
   *
   *  @param opts Configuration options that how marking is applied.
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors, in order to maintain the model.
   */
  markAsTouched(opts: {onlySelf?: boolean} = {}): void {
    (this as{touched: boolean}).touched = true;

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched(opts);
    }
  }

  /**
   * @description
   * Marks the control as `untouched`.
   *
   * If the control has any children, it will also mark all children as `untouched`
   * to maintain the model, and re-calculate the `touched` status of all parent
   * controls.
   *
   *  @param opts Configuration options that how marking is applied.
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors, in order to maintain the model.
   */
  markAsUntouched(opts: {onlySelf?: boolean} = {}): void {
    (this as{touched: boolean}).touched = false;
    this._pendingTouched = false;

    this._forEachChild(
        (control: AbstractControl) => { control.markAsUntouched({onlySelf: true}); });

    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts);
    }
  }

  /**
   * @description
   * Marks the control as `dirty`. A control is dirty by changing
   * the control; compare `markAsTouched`
   *
   *  @param opts Configuration options that how marking is applied.
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors, in order to maintain the model.
   */
  markAsDirty(opts: {onlySelf?: boolean} = {}): void {
    (this as{pristine: boolean}).pristine = false;

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty(opts);
    }
  }

  /**
   * @description
   * Marks the control as `pristine`.
   *
   * If the control has any children, it will also mark all children as `pristine`
   * to maintain the model, and re-calculate the `pristine` status of all parent
   * controls.
   *
   *  @param opts Configuration options that how marking is applied.
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors, in order to maintain the model.
   */
  markAsPristine(opts: {onlySelf?: boolean} = {}): void {
    (this as{pristine: boolean}).pristine = true;
    this._pendingDirty = false;

    this._forEachChild((control: AbstractControl) => { control.markAsPristine({onlySelf: true}); });

    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts);
    }
  }

  /**
   * @description
   * Marks the control as `pending`.
   *
   * An event will be emitted by `statusChanges` by default.
   *
   *  @param opts Configuration options that how marking is applied.
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors, in order to maintain the model.
   * * `emitEvent`: When false, `statusChanges` will not emit an event.
   *
   */
  markAsPending(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    (this as{status: string}).status = PENDING;

    if (opts.emitEvent !== false) {
      (this.statusChanges as EventEmitter<any>).emit(this.status);
    }

    if (this._parent && !opts.onlySelf) {
      this._parent.markAsPending(opts);
    }
  }

  /**
   * @description
   * Disables the control. This means the control will be exempt from validation checks and
   * excluded from the aggregate value of any parent. Its status is `DISABLED`.
   *
   * If the control has children, all children will be disabled to maintain the model.
   *
   *  @param opts Configuration options that how marking is applied.
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors, in order to maintain the model.
   * * `emitEvent`: When false, `statusChanges` and `valueChanges` will not emit an event.
   * Otherwise,
   * both Observables will emit a status and value event.
   */
  disable(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    (this as{status: string}).status = DISABLED;
    (this as{errors: ValidationErrors | null}).errors = null;
    this._forEachChild(
        (control: AbstractControl) => { control.disable({...opts, onlySelf: true}); });
    this._updateValue();

    if (opts.emitEvent !== false) {
      (this.valueChanges as EventEmitter<any>).emit(this.value);
      (this.statusChanges as EventEmitter<string>).emit(this.status);
    }

    this._updateAncestors(opts);
    this._onDisabledChange.forEach((changeFn) => changeFn(true));
  }

  /**
   * @description
   * Enables the control. This means the control will be included in validation checks and
   * the aggregate value of its parent. Its status is re-calculated based on its value and
   * its validators.
   *
   * By default, if the control has children, all children will be enabled.
   *
   *  @param opts Configure options that happen when marked as untouched
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors, in order to maintain the model.
   * * `emitEvent`: When false, `statusChanges` and `valueChanges` will not emit an event.
   * Otherwise,
   * both Observables will emit a status and value event.
   */
  enable(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    (this as{status: string}).status = VALID;
    this._forEachChild(
        (control: AbstractControl) => { control.enable({...opts, onlySelf: true}); });
    this.updateValueAndValidity({onlySelf: true, emitEvent: opts.emitEvent});

    this._updateAncestors(opts);
    this._onDisabledChange.forEach((changeFn) => changeFn(false));
  }

  private _updateAncestors(opts: {onlySelf?: boolean, emitEvent?: boolean}) {
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
      this._parent._updatePristine();
      this._parent._updateTouched();
    }
  }

  /**
   * @description
   * @param parent Sets the parent of the control
   */
  setParent(parent: FormGroup|FormArray): void { this._parent = parent; }

  /**
   * @description
   * Sets the value of the control. Abstract method (implemented in sub-classes).
   */
  abstract setValue(value: any, options?: Object): void;

  /**
   * @description
   * Patches the value of the control. Abstract method (implemented in sub-classes).
   */
  abstract patchValue(value: any, options?: Object): void;

  /**
   * @description
   * Resets the control. Abstract method (implemented in sub-classes).
   */
  abstract reset(value?: any, options?: Object): void;

  /**
   * Re-calculates the value and validation status of the control.
   *
   * By default, it will also update the value and validity of its ancestors.
   *
   * @param opts Configuration options that control events after updating and
   * validity checks are applied.
   * * `onlySelf`: When true, only update this control. When false or not supplied,
   * update all direct ancestors, in order to maintain the model.
   * * `emitEvent`: When false, `statusChanges` and `valueChanges` will not emit an event.
   * Otherwise,
   * both Observables will emit a status and value event.
   */
  updateValueAndValidity(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._setInitialStatus();
    this._updateValue();

    if (this.enabled) {
      this._cancelExistingSubscription();
      (this as{errors: ValidationErrors | null}).errors = this._runValidator();
      (this as{status: string}).status = this._calculateStatus();

      if (this.status === VALID || this.status === PENDING) {
        this._runAsyncValidator(opts.emitEvent);
      }
    }

    if (opts.emitEvent !== false) {
      (this.valueChanges as EventEmitter<any>).emit(this.value);
      (this.statusChanges as EventEmitter<string>).emit(this.status);
    }

    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
    }
  }

  /** @internal */
  _updateTreeValidity(opts: {emitEvent?: boolean} = {emitEvent: true}) {
    this._forEachChild((ctrl: AbstractControl) => ctrl._updateTreeValidity(opts));
    this.updateValueAndValidity({onlySelf: true, emitEvent: opts.emitEvent});
  }

  private _setInitialStatus() {
    (this as{status: string}).status = this._allControlsDisabled() ? DISABLED : VALID;
  }

  private _runValidator(): ValidationErrors|null {
    return this.validator ? this.validator(this) : null;
  }

  private _runAsyncValidator(emitEvent?: boolean): void {
    if (this.asyncValidator) {
      (this as{status: string}).status = PENDING;
      const obs = toObservable(this.asyncValidator(this));
      this._asyncValidationSubscription =
          obs.subscribe((errors: ValidationErrors | null) => this.setErrors(errors, {emitEvent}));
    }
  }

  private _cancelExistingSubscription(): void {
    if (this._asyncValidationSubscription) {
      this._asyncValidationSubscription.unsubscribe();
    }
  }

  /**
   * @description
   * Sets errors on a form control.
   *
   * This is used when validations are run manually by the user, rather than automatically.
   *
   * Calling `setErrors` will also update the validity of the parent control.
   *
   * ### Manually set the errors for a control
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
   */
  setErrors(errors: ValidationErrors|null, opts: {emitEvent?: boolean} = {}): void {
    (this as{errors: ValidationErrors | null}).errors = errors;
    this._updateControlsErrors(opts.emitEvent !== false);
  }

  /**
   * @description
   * Retrieves a child control given the control's name or path.
   *
   * @param path dot-delimited string or array of string/number values that define the path to the
   * control.
   *
   * ### Retrieve a nested control
   *
   * For example, to get a `name` control nested within a `person` sub-group:
   *
   * * `this.form.get('person.name');`
   *
   * -OR-
   *
   * * `this.form.get(['person', 'name']);`
   */
  get(path: Array<string|number>|string): AbstractControl|null { return _find(this, path, '.'); }

  /**
   * @description
   * Reports error data for a specific error occurring in this control or in another control.
   *
   * @param errorCode The error code for which to retrieve data
   * @param path The path to a control to check. If not supplied, checks for the error in this
   * control.
   * @returns The error data if the control with the given path has the given error, otherwise null
   * or undefined.
   */
  getError(errorCode: string, path?: string[]): any {
    const control = path ? this.get(path) : this;
    return control && control.errors ? control.errors[errorCode] : null;
  }

  /**
   * @description
   * Reports whether the control with the given path has the error specified.
   *
   * @param errorCode The error code for which to retrieve data
   * @param path The path to a control to check. If not supplied, checks for the error in this
   * control.
   * @returns True when the control with the given path has the error, otherwise false.
   */
  hasError(errorCode: string, path?: string[]): boolean { return !!this.getError(errorCode, path); }

  /**
   * @description
   * Retrieves the top-level ancestor of this control.
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
    (this as{status: string}).status = this._calculateStatus();

    if (emitEvent) {
      (this.statusChanges as EventEmitter<string>).emit(this.status);
    }

    if (this._parent) {
      this._parent._updateControlsErrors(emitEvent);
    }
  }

  /** @internal */
  _initObservables() {
    (this as{valueChanges: Observable<any>}).valueChanges = new EventEmitter();
    (this as{statusChanges: Observable<any>}).statusChanges = new EventEmitter();
  }


  private _calculateStatus(): string {
    if (this._allControlsDisabled()) return DISABLED;
    if (this.errors) return INVALID;
    if (this._anyControlsHaveStatus(PENDING)) return PENDING;
    if (this._anyControlsHaveStatus(INVALID)) return INVALID;
    return VALID;
  }

  /** @internal */
  abstract _updateValue(): void;

  /** @internal */
  abstract _forEachChild(cb: Function): void;

  /** @internal */
  abstract _anyControls(condition: Function): boolean;

  /** @internal */
  abstract _allControlsDisabled(): boolean;

  /** @internal */
  abstract _syncPendingControls(): boolean;

  /** @internal */
  _anyControlsHaveStatus(status: string): boolean {
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
    (this as{pristine: boolean}).pristine = !this._anyControlsDirty();

    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts);
    }
  }

  /** @internal */
  _updateTouched(opts: {onlySelf?: boolean} = {}): void {
    (this as{touched: boolean}).touched = this._anyControlsTouched();

    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts);
    }
  }

  /** @internal */
  _onDisabledChange: Function[] = [];

  /** @internal */
  _isBoxedValue(formState: any): boolean {
    return typeof formState === 'object' && formState !== null &&
        Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
  }

  /** @internal */
  _registerOnCollectionChange(fn: () => void): void { this._onCollectionChange = fn; }

  /** @internal */
  _setUpdateStrategy(opts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null): void {
    if (isOptionsObj(opts) && (opts as AbstractControlOptions).updateOn != null) {
      this._updateOn = (opts as AbstractControlOptions).updateOn !;
    }
  }
}

/**
 * @description
 * Tracks the value and validation status of an individual form control.
 *
 * This is one of the three fundamental building blocks of Angular forms, along with
 * `FormGroup` and `FormArray`. It extends the `AbstractControl` class that 
 * implements most of the base functionality for accessing the value, validation status, 
 * user interactions and events.
 * 
 * @see `AbstractControl`
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see [Usage Notes](#usage-notes)
 * 
 * @usageNotes
 *
 * Instantiate a `FormControl`, with an initial value.
 *
 * ```ts
 * const ctrl = new FormControl('some value');
 * console.log(ctrl.value);     // 'some value'
 *```
 *
 * Initializing the control with a form state object.
 *
 * The `value` and `disabled` keys are required when initializing with a form state object.
 *
 * ```ts
 * const ctrl = new FormControl({ value: 'n/a', disabled: true });
 * console.log(ctrl.value);     // 'n/a'
 * console.log(ctrl.status);    // 'DISABLED'
 * ```
 *
 * The following example initializes the control with a sync validator.
 *
 * ```ts
 * const ctrl = new FormControl('', Validators.required);
 * console.log(ctrl.value);      // ''
 * console.log(ctrl.status);     // 'INVALID'
 * ```
 *
 * The example below initializes the control using an options object.
 *
 * ```ts
 * const ctrl = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * ### Configure the control to update on a blur event
 *
 * Set the `updateOn` option to `'blur'` to update on the blur `event`.
 *
 * ```ts
 * const ctrl = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * ### Configure the control to update on a submit event
 *
 * Set the `updateOn` option to `'submit'` to update on a submit `event`.
 *
 * ```ts
 * const ctrl = new FormControl('', { updateOn: 'submit' });
 * ```
 * 
 * ### Reset the control back to an initial value
 * 
 * You can also reset to a specific form state by passing through a standalone
 * value or a form state object that contains both a value and a disabled state
 * (these are the only two properties that cannot be calculated).
 *
 * ```ts
 * const ctrl = new FormControl('Nancy');
 * 
 * console.log(control.value); // 'Nancy'
 * 
 * control.reset('Drew');
 *
 * console.log(control.value); // 'Drew'
 * ```
 *
 * ### Reset the control back to an initial value and disabled
 *
 * ```
 * const ctrl = new FormControl('Nancy');
 * 
 * console.log(control.value); // 'Nancy'
 * console.log(this.control.status); // 'DISABLED'
 * 
 * control.reset({ value: 'Drew', disabled: true });
 *
 * console.log(this.control.value); // 'Drew'
 * console.log(this.control.status); // 'DISABLED'
 *
*/
export class FormControl extends AbstractControl {
  /** @internal */
  _onChange: Function[] = [];

  /** @internal */
  _pendingValue: any;

  /** @internal */
  _pendingChange: any;

  /**
  * @description
  * Creates a new `FormControl` instance.
  *
  * @param formState Initializes the control with an initial state value,
  * or with an object that defines the initial value, status, and options
  * for handling updates and validation.
  *
  * @param validatorOrOpts A synchronous validator function, or an array of
  * such functions, or an `AbstractControlOptions` object that contains validation functions
  * and a validation trigger.
  *
  * @param asyncValidator A single async validator or array of async validator functions
  *
  */
  constructor(
      formState: any = null,
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    super(
        coerceToValidator(validatorOrOpts),
        coerceToAsyncValidator(asyncValidator, validatorOrOpts));
    this._applyFormState(formState);
    this._setUpdateStrategy(validatorOrOpts);
    this.updateValueAndValidity({onlySelf: true, emitEvent: false});
    this._initObservables();
  }

  /**
   * @description
   * Sets a new value for the form control.
   *
   * @param value The new value for the control.
   * @param options Configuration options for how the control emits events when the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   * * `emitModelToViewChange`: When true (the default), each change triggers an `onChange` event to
   * update the view.
   * * `emitViewToModelChange`: When true (the default), each change triggers an `ngModelChange`
   * event to update the model.
   *
   */
  setValue(value: any, options: {
    onlySelf?: boolean,
    emitEvent?: boolean,
    emitModelToViewChange?: boolean,
    emitViewToModelChange?: boolean
  } = {}): void {
    (this as{value: any}).value = this._pendingValue = value;
    if (this._onChange.length && options.emitModelToViewChange !== false) {
      this._onChange.forEach(
          (changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
    }
    this.updateValueAndValidity(options);
  }

  /**
   * @description
   * Patches the value of a control.
   *
   * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
   * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
   * `FormArrays`, where it does behave differently.
   * 
   * @see See `setValue` for options
   */
  patchValue(value: any, options: {
    onlySelf?: boolean,
    emitEvent?: boolean,
    emitModelToViewChange?: boolean,
    emitViewToModelChange?: boolean
  } = {}): void {
    this.setValue(value, options);
  }

  /**
   * @description
   * Resets the form control
   *
   * By default, the following actions happen when the control is reset.
   *
   * * it is marked as `pristine`
   * * it is marked as `untouched`
   * * value is set to null
   *
   * @param formState Initializes the control with an initial state value,
   * or with an object that defines the initial value, status, and options
   * for handling updates and validation.
   *
   * @param options Configuration options for emitting events when the control value changes.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   *
   */
  reset(formState: any = null, options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._applyFormState(formState);
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(this.value, options);
    this._pendingChange = false;
  }

  /**
   * @internal
   */
  _updateValue() {}

  /**
   * @internal
   */
  _anyControls(condition: Function): boolean { return false; }

  /**
   * @internal
   */
  _allControlsDisabled(): boolean { return this.disabled; }

  /**
   * @description
   * Register a listener for change events.
   *
   * @param fn The method that is called when the value changes
   */
  registerOnChange(fn: Function): void { this._onChange.push(fn); }

  /**
   * @internal
   */
  _clearChangeFns(): void {
    this._onChange = [];
    this._onDisabledChange = [];
    this._onCollectionChange = () => {};
  }

  /**
   * @description
   * Register a listener for disabled events.
   *
   * @param fn The method that is called when the disabled status changes.
   */
  registerOnDisabledChange(fn: (isDisabled: boolean) => void): void {
    this._onDisabledChange.push(fn);
  }

  /**
   * @internal
   */
  _forEachChild(cb: Function): void {}

  /** @internal */
  _syncPendingControls(): boolean {
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

  private _applyFormState(formState: any) {
    if (this._isBoxedValue(formState)) {
      (this as{value: any}).value = this._pendingValue = formState.value;
      formState.disabled ? this.disable({onlySelf: true, emitEvent: false}) :
                           this.enable({onlySelf: true, emitEvent: false});
    } else {
      (this as{value: any}).value = this._pendingValue = formState;
    }
  }
}

/**
 * @description
 *
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormArray`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child will be the name under which it is registered.
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * You can also include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you can alternatively choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 */
export class FormGroup extends AbstractControl {
  /**
  * @description
  * Creates a new `FormGroup` instance.
  *
  * @param controls A collection of child controls. The key for each child is the name
  * under which it is registered.
  *
  * @param validatorOrOpts A synchronous validator function, or an array of
  * such functions, or an `AbstractControlOptions` object that contains validation functions
  * and a validation trigger.
  *
  * @param asyncValidator A single async validator or array of async validator functions
  *
  */
  constructor(
      public controls: {[key: string]: AbstractControl},
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    super(
        coerceToValidator(validatorOrOpts),
        coerceToAsyncValidator(asyncValidator, validatorOrOpts));
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({onlySelf: true, emitEvent: false});
  }

  /**
   * @description
   * Registers a control with the group's list of controls.
   *
   * This method does not update the value or validity of the control.
   * Use {@link FormGroup#addControl addControl} instead.
   *
   * @param name The control name to register in the collection
   * @param control Provides the control for the given name
   */
  registerControl(name: string, control: AbstractControl): AbstractControl {
    if (this.controls[name]) return this.controls[name];
    this.controls[name] = control;
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
    return control;
  }

  /**
   * @description
   * Add a control to this group.
   *
   * This method also updates the value and validity of the control.
   *
   * @param name The control name to add to the collection
   * @param control Provides the control for the given name
   */
  addControl(name: string, control: AbstractControl): void {
    this.registerControl(name, control);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * @description
   * Remove a control from this group.
   *
   * @param name The control name to remove from the collection
   */
  removeControl(name: string): void {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {});
    delete (this.controls[name]);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * @description
   * Replace an existing control.
   *
   * @param name The control name to replace in the collection
   * @param control Provides the control for the given name
   */
  setControl(name: string, control: AbstractControl): void {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {});
    delete (this.controls[name]);
    if (control) this.registerControl(name, control);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * @description
   * Check whether there is an enabled control with the given name in the group.
   *
   * It will return false for disabled controls. If you'd like to check for existence in the group
   * only, use {@link AbstractControl#get get} instead.
   *
   * @param name The control name to check for existence in the collection
   */
  contains(controlName: string): boolean {
    return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
  }

  /**
   * @description
   * Sets the value of the `FormGroup`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * ### Set the complete value for the form group
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl(),
   *   last: new FormControl()
   * });
   *
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.setValue({first: 'Nancy', last: 'Drew'});
   * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
   *
   * ```
   * @throws When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you excluding the value of a control.
   *
   * @param value The new value for the control that matches the structure of the group.
   * @param options Configuration options for how the control emits events when the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   */
  setValue(value: {[key: string]: any}, options: {onlySelf?: boolean, emitEvent?: boolean} = {}):
      void {
    this._checkAllValuesPresent(value);
    Object.keys(value).forEach(name => {
      this._throwIfControlMissing(name);
      this.controls[name].setValue(value[name], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this.updateValueAndValidity(options);
  }

  /**
   * @description
   * Patches the value of the `FormGroup`. It accepts an object with control
   * names as keys, and will do its best to match the values to the correct controls
   * in the group.
   *
   * It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   * ### Patch the value for a form group
   *
   *  ```
   *  const form = new FormGroup({
   *     first: new FormControl(),
   *     last: new FormControl()
   *  });
   *  console.log(form.value);   // {first: null, last: null}
   *
   *  form.patchValue({first: 'Nancy'});
   *  console.log(form.value);   // {first: 'Nancy', last: null}
   *
   *  ```
   *
   * @param value The object that matches the structure of the group
   * @param options Configure options that happen when the value is patched
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  patchValue(value: {[key: string]: any}, options: {onlySelf?: boolean, emitEvent?: boolean} = {}):
      void {
    Object.keys(value).forEach(name => {
      if (this.controls[name]) {
        this.controls[name].patchValue(value[name], {onlySelf: true, emitEvent: options.emitEvent});
      }
    });
    this.updateValueAndValidity(options);
  }

  /**
   * @description
   * Resets the `FormGroup`. This means by default:
   *
   * * The group and all descendants are marked `pristine`
   * * The group and all descendants are marked `untouched`
   * * The value of all descendants will be null or null maps
   *
   * You can also reset to a specific form state by passing in a map of states
   * that matches the structure of your form, with control names as keys. The state
   * can be a standalone value or a form state object with both a value and a disabled
   * status.
   *
   * @param value Initializes the control with an initial state value,
   * or with an object that defines the initial value, status,
   * and options for handling updates and validation.
   *
   * @param options Configuration options that happen when the group is reset.
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * @usageNotes
   *
   * ### Reset the form group values
   *
   * ```ts
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * console.log(form.value);  // {first: 'first name', last: 'last name'}
   *
   * form.reset({ first: 'name', last: 'last name' });
   *
   * console.log(form.value);  // {first: 'name', last: 'last name'}
   * ```
   *
   * ### Reset the form group values and disabled status
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * form.reset({
   *   first: {value: 'name', disabled: true},
   *   last: 'last'
   * });
   *
   * console.log(this.form.value);  // {first: 'name', last: 'last name'}
   * console.log(this.form.get('first').status);  // 'DISABLED'
   * ```
   */
  reset(value: any = {}, options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._forEachChild((control: AbstractControl, name: string) => {
      control.reset(value[name], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this.updateValueAndValidity(options);
    this._updatePristine(options);
    this._updateTouched(options);
  }

  /**
   * @description
   * The aggregate value of the `FormGroup`, including any disabled controls.
   *
   * Retrieves all values regardless of disabled status.
   * The `value` property is the best way to get the value of the group, because
   * it excludes disabled controls in the `FormGroup`.
   */
  getRawValue(): any {
    return this._reduceChildren(
        {}, (acc: {[k: string]: AbstractControl}, control: AbstractControl, name: string) => {
          acc[name] = control instanceof FormControl ? control.value : (<any>control).getRawValue();
          return acc;
        });
  }

  /** @internal */
  _syncPendingControls(): boolean {
    let subtreeUpdated = this._reduceChildren(false, (updated: boolean, child: AbstractControl) => {
      return child._syncPendingControls() ? true : updated;
    });
    if (subtreeUpdated) this.updateValueAndValidity({onlySelf: true});
    return subtreeUpdated;
  }

  /** @internal */
  _throwIfControlMissing(name: string): void {
    if (!Object.keys(this.controls).length) {
      throw new Error(`
        There are no form controls registered with this group yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
    }
    if (!this.controls[name]) {
      throw new Error(`Cannot find form control with name: ${name}.`);
    }
  }

  /** @internal */
  _forEachChild(cb: (v: any, k: string) => void): void {
    Object.keys(this.controls).forEach(k => cb(this.controls[k], k));
  }

  /** @internal */
  _setUpControls(): void {
    this._forEachChild((control: AbstractControl) => {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    });
  }

  /** @internal */
  _updateValue(): void { (this as{value: any}).value = this._reduceValue(); }

  /** @internal */
  _anyControls(condition: Function): boolean {
    let res = false;
    this._forEachChild((control: AbstractControl, name: string) => {
      res = res || (this.contains(name) && condition(control));
    });
    return res;
  }

  /** @internal */
  _reduceValue() {
    return this._reduceChildren(
        {}, (acc: {[k: string]: AbstractControl}, control: AbstractControl, name: string) => {
          if (control.enabled || this.disabled) {
            acc[name] = control.value;
          }
          return acc;
        });
  }

  /** @internal */
  _reduceChildren(initValue: any, fn: Function) {
    let res = initValue;
    this._forEachChild(
        (control: AbstractControl, name: string) => { res = fn(res, control, name); });
    return res;
  }

  /** @internal */
  _allControlsDisabled(): boolean {
    for (const controlName of Object.keys(this.controls)) {
      if (this.controls[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }

  /** @internal */
  _checkAllValuesPresent(value: any): void {
    this._forEachChild((control: AbstractControl, name: string) => {
      if (value[name] === undefined) {
        throw new Error(`Must supply a value for form control with name: '${name}'.`);
      }
    });
  }
}

/**
 * @description
 *
 * Tracks the value and validity state of an array of `FormControl`,
 * `FormGroup` or `FormArray` instances.
 *
 * A `FormArray` aggregates the values of each child `FormControl` into an array.
 * It calculates its status by reducing the status values of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormGroup`.
 *
 * @usageNotes
 *
 * ### Create an array of form controls
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy', Validators.minLength(2)),
 *   new FormControl('Drew'),
 * ]);
 *
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * ### Create a form array with array-level validators
 *
 * You can also include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators can be passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
  * ### Set the updateOn property for all controls in a form array
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const arr = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls from a form array
 *
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that will result in strange and unexpected behavior such
 * as broken change detection.
 *
 *
 */
export class FormArray extends AbstractControl {
  /**
  * @description
  * Creates a new `FormArray` instance.
  *
  * @param controls An array of child controls. Each child control will be given an index
  * wheh it is registered.
  *
  * @param validatorOrOpts A synchronous validator function, or an array of
  * such functions, or an `AbstractControlOptions` object that contains validation functions
  * and a validation trigger.
  *
  * @param asyncValidator A single async validator or array of async validator functions
  *
  */
  constructor(
      public controls: AbstractControl[],
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    super(
        coerceToValidator(validatorOrOpts),
        coerceToAsyncValidator(asyncValidator, validatorOrOpts));
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({onlySelf: true, emitEvent: false});
  }

  /**
   * @description
   * Get the `AbstractControl` at the given `index` in the array.
   *
   * @param index Index in the array to retrieve the control
   */
  at(index: number): AbstractControl { return this.controls[index]; }

  /**
   * @description
   * Insert a new `AbstractControl` at the end of the array.
   *
   * @param control Form control to be inserted
   */
  push(control: AbstractControl): void {
    this.controls.push(control);
    this._registerControl(control);
    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * @description
   * Insert a new `AbstractControl` at the given `index` in the array.
   *
   * @param index Index in the array to insert the control
   * @param control Form control to be inserted
   */
  insert(index: number, control: AbstractControl): void {
    this.controls.splice(index, 0, control);

    this._registerControl(control);
    this.updateValueAndValidity();
  }

  /**
   * @description
   * Remove the control at the given `index` in the array.
   *
   * @param index Index in the array to remove the control
   */
  removeAt(index: number): void {
    if (this.controls[index]) this.controls[index]._registerOnCollectionChange(() => {});
    this.controls.splice(index, 1);
    this.updateValueAndValidity();
  }

  /**
   * @description
   * Replace an existing control.
   *
   * @param index Index in the array to replace the control
   * @param control The `AbstractControl` control to replace the existing control
   */
  setControl(index: number, control: AbstractControl): void {
    if (this.controls[index]) this.controls[index]._registerOnCollectionChange(() => {});
    this.controls.splice(index, 1);

    if (control) {
      this.controls.splice(index, 0, control);
      this._registerControl(control);
    }

    this.updateValueAndValidity();
    this._onCollectionChange();
  }

  /**
   * @description
   * Length of the control array.
   */
  get length(): number { return this.controls.length; }

  /**
   * @description
   * Sets the value of the `FormArray`. It accepts an array that matches
   * the structure of the control.
   *
   * This method performs strict checks, so it will throw an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   * ### Set the values for the controls in the form array
   *
   * ```
   * const arr = new FormArray([
   *   new FormControl(),
   *   new FormControl()
   * ]);
   * console.log(arr.value);   // [null, null]
   *
   * arr.setValue(['Nancy', 'Drew']);
   * console.log(arr.value);   // ['Nancy', 'Drew']
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options for emitting events when the control value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  setValue(value: any[], options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._checkAllValuesPresent(value);
    value.forEach((newValue: any, index: number) => {
      this._throwIfControlMissing(index);
      this.at(index).setValue(newValue, {onlySelf: true, emitEvent: options.emitEvent});
    });
    this.updateValueAndValidity(options);
  }

  /**
   * @description
   * Patches the value of the `FormArray`. It accepts an array that matches the
   * structure of the control, and will do its best to match the values to the correct
   * controls in the group.
   *
   * It accepts both super-sets and sub-sets of the array without throwing an error.
   *
   * ### Patch the values for controls in a form array
   *
   * ```
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * console.log(arr.value);   // [null, null]
   *
   * arr.patchValue(['Nancy']);
   * console.log(arr.value);   // ['Nancy', null]
   * ```
   *
   * @param value Array of latest values for the controls
   * @param options Configure options for emitting events when the control value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  patchValue(value: any[], options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    value.forEach((newValue: any, index: number) => {
      if (this.at(index)) {
        this.at(index).patchValue(newValue, {onlySelf: true, emitEvent: options.emitEvent});
      }
    });
    this.updateValueAndValidity(options);
  }

  /**
   * @description
   * Resets the `FormArray`. This means by default:
   *
   * * The array and all descendants are marked `pristine`
   * * The array and all descendants are marked `untouched`
   * * The value of all descendants will be null or null maps
   *
   * You can also reset to a specific form state by passing in an array of states
   * that matches the structure of the control. The state can be a standalone value
   * or a form state object with both a value and a disabled status.
   *
   * ### Reset the values in a form array
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * arr.reset(['name', 'last name']);
   *
   * console.log(this.arr.value);  // ['name', 'last name']
   * ```
   *
   * ### Reset the values in a form array and the disabled status for the first control
   *
   * ```
   * this.arr.reset([
   *   {value: 'name', disabled: true},
   *   'last'
   * ]);
   *
   * console.log(this.arr.value);  // ['name', 'last name']
   * console.log(this.arr.get(0).status);  // 'DISABLED'
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options for emitting events when the control value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true (the default), each change triggers a valueChanges event.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  reset(value: any = [], options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._forEachChild((control: AbstractControl, index: number) => {
      control.reset(value[index], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this.updateValueAndValidity(options);
    this._updatePristine(options);
    this._updateTouched(options);
  }

  /**
   * @description
   * The aggregate value of the array, including any disabled controls.
   *
   * Reports all values regardless of disabled status.
   * For enabled controls only, the `value` property is the best way to get the value of the array.
   */
  getRawValue(): any[] {
    return this.controls.map((control: AbstractControl) => {
      return control instanceof FormControl ? control.value : (<any>control).getRawValue();
    });
  }

  /** @internal */
  _syncPendingControls(): boolean {
    let subtreeUpdated = this.controls.reduce((updated: boolean, child: AbstractControl) => {
      return child._syncPendingControls() ? true : updated;
    }, false);
    if (subtreeUpdated) this.updateValueAndValidity({onlySelf: true});
    return subtreeUpdated;
  }

  /** @internal */
  _throwIfControlMissing(index: number): void {
    if (!this.controls.length) {
      throw new Error(`
        There are no form controls registered with this array yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
    }
    if (!this.at(index)) {
      throw new Error(`Cannot find form control at index ${index}`);
    }
  }

  /** @internal */
  _forEachChild(cb: Function): void {
    this.controls.forEach((control: AbstractControl, index: number) => { cb(control, index); });
  }

  /** @internal */
  _updateValue(): void {
    (this as{value: any}).value =
        this.controls.filter((control) => control.enabled || this.disabled)
            .map((control) => control.value);
  }

  /** @internal */
  _anyControls(condition: Function): boolean {
    return this.controls.some((control: AbstractControl) => control.enabled && condition(control));
  }

  /** @internal */
  _setUpControls(): void {
    this._forEachChild((control: AbstractControl) => this._registerControl(control));
  }

  /** @internal */
  _checkAllValuesPresent(value: any): void {
    this._forEachChild((control: AbstractControl, i: number) => {
      if (value[i] === undefined) {
        throw new Error(`Must supply a value for form control at index: ${i}.`);
      }
    });
  }

  /** @internal */
  _allControlsDisabled(): boolean {
    for (const control of this.controls) {
      if (control.enabled) return false;
    }
    return this.controls.length > 0 || this.disabled;
  }

  private _registerControl(control: AbstractControl) {
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
  }
}
