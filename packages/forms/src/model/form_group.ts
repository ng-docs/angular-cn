/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AsyncValidatorFn, ValidatorFn} from '../directives/validators';

import {AbstractControl, AbstractControlOptions, assertAllValuesPresent, assertControlPresent, pickAsyncValidators, pickValidators, ɵRawValue, ɵTypedOrUntyped, ɵValue} from './abstract_model';

/**
 * FormGroupValue extracts the type of `.value` from a FormGroup's inner object type. The untyped
 * case falls back to {[key: string]&#x3A; any}.
 *
 * FormGroupValue 会从 FormGroup 的内部对象类型中提取 `.value` 的类型。无类型的情况会回到 { [key:
 * string][key: string] : any} 。
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 *
 * Angular 在内部使用此类型来支持类型化表单；不要直接使用它。
 *
 * For internal use only.
 *
 * 仅供内部使用。
 *
 */
export type ɵFormGroupValue<T extends {[K in keyof T]?: AbstractControl<any>}> =
    ɵTypedOrUntyped<T, Partial<{[K in keyof T]: ɵValue<T[K]>}>, {[key: string]: any}>;

/**
 * FormGroupRawValue extracts the type of `.getRawValue()` from a FormGroup's inner object type. The
 * untyped case falls back to {[key: string]&#x3A; any}.
 *
 * FormGroupRawValue 会从 FormGroup 的内部对象类型中提取 `.getRawValue()`
 * 的类型。无类型的情况会回到 { [key: string][key: string] : any} 。
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 *
 * Angular 在内部使用此类型来支持类型化表单；不要直接使用它。
 *
 * For internal use only.
 *
 * 仅供内部使用。
 *
 */
export type ɵFormGroupRawValue<T extends {[K in keyof T]?: AbstractControl<any>}> =
    ɵTypedOrUntyped<T, {[K in keyof T]: ɵRawValue<T[K]>}, {[key: string]: any}>;

/**
 * OptionalKeys returns the union of all optional keys in the object.
 *
 * OptionalKeys 返回对象中所有可选键的并集。
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 *
 * Angular 在内部使用此类型来支持类型化表单；不要直接使用它。
 *
 */
export type ɵOptionalKeys<T> = {
  [K in keyof T] -?: undefined extends T[K] ? K : never
}[keyof T];

/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * 跟踪一组 `FormControl` 实例的值和有效状态。
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` 每个子 `FormControl`
 * 的值聚合到一个对象中，以每个控件名称作为键。它通过减少其子项的状态值来计算其状态。例如，如果组中的某个控件无效，则整个组都将变得无效。
 *
 * `FormGroup` is one of the four fundamental building blocks used to define forms in Angular,
 * along with `FormControl`, `FormArray`, and `FormRecord`.
 *
 * `FormGroup` 是用于在 Angular 中定义表单的四个基本构建块之一，与 `FormControl`、`FormArray` 和
 * `FormRecord` 。
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * 实例化 `FormGroup` 时，请传入子控件的集合作为第一个参数。每个子项的键都会注册控件的名称。
 *
 * `FormGroup` is intended for use cases where the keys are known ahead of time.
 * If you need to dynamically add and remove controls, use {@link FormRecord} instead.
 *
 * `FormGroup` 旨在用于提前已知键的用例。如果需要动态添加和删除控件，请改用 {@link FormRecord} 。
 *
 * `FormGroup` accepts an optional type parameter `TControl`, which is an object type with inner
 * control types as values.
 *
 * `FormGroup` 接受一个可选的类型参数 `TControl` ，它是一种以内部控件类型作为值的对象类型。
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ### 创建带有 2 个控件的表单组
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
 * ### The type argument, and optional controls
 *
 * ### 类型参数和可选控件
 *
 * `FormGroup` accepts one generic argument, which is an object containing its inner controls.
 * This type will usually be inferred automatically, but you can always specify it explicitly if you
 * wish.
 *
 * `FormGroup`
 * 接受一个通用参数，该参数是一个包含其内部控件的对象。这种类型通常会被自动推断，但如果你愿意，你始终可以显式指定它。
 *
 * If you have controls that are optional (i.e. they can be removed, you can use the `?` in the
 * type):
 *
 * 如果你有可选的控件（即它们可以被删除，你可以在类型中使用 `?`）：
 *
 * ```
 * const form = new FormGroup<{
 *   first: FormControl<string|null>,
 *   middle?: FormControl<string|null>, // Middle name is optional.
 *   last: FormControl<string|null>,
 * }>({
 *   first: new FormControl('Nancy'),
 *   last: new FormControl('Drew'),
 * });
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * ### 创建使用组级验证器的表单组
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * 你将组级验证器作为第二个 arg 包含在内，或将组级异步验证器作为第三个 arg
 * 包含在内。当你要执行考虑多个子控件的值的验证时，它们会派上用场。
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * 与 `FormControl` 实例一样，你选择作为 options 对象的一部分传入验证器和异步验证器。
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
 * ### 为表单组中的所有控件设置 updateOn 属性
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * options 对象用于为每个子控件的 `updateOn` 属性设置默认值。如果你在组级别将 `updateOn` 设置为
 * `'blur'` ，则所有子控件都默认为 'blur'，除非子项显式指定不同的 `updateOn` 值。
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 *
 * ### Using a FormGroup with optional controls
 *
 * ### 使用带有可选控件的 FormGroup
 *
 * It is possible to have optional controls in a FormGroup. An optional control can be removed later
 * using `removeControl`, and can be omitted when calling `reset`. Optional controls must be
 * declared optional in the group's type.
 *
 * FormGroup 中可以有可选控件。可选控件可以在以后使用 `removeControl` 删除，并且在调用 `reset`
 * 时可以省略。可选控件必须在组的类型中声明为 optional。
 *
 * ```ts
 * const c = new FormGroup<{one?: FormControl<string>}>({
 *   one: new FormControl('')
 * });
 * ```
 *
 * Notice that `c.value.one` has type `string|null|undefined`. This is because calling `c.reset({})`
 * without providing the optional key `one` will cause it to become `null`.
 *
 * 请注意，`c.value.one` 的类型为 `string|null|undefined` 。这是因为在不提供可选键 `one`
 * 的情况下调用 `c.reset({})` 将导致它变为 `null` 。
 *
 * @publicApi
 */
export class FormGroup<TControl extends {[K in keyof TControl]: AbstractControl<any>} = any> extends
    AbstractControl<
        ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any>,
        ɵTypedOrUntyped<TControl, ɵFormGroupRawValue<TControl>, any>> {
  /**
   * Creates a new `FormGroup` instance.
   *
   * 创建一个新的 `FormGroup` 实例。
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * 子控件的集合。每个子项的键是它注册的名称。
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * 同步验证器函数，或此类函数的数组，或包含验证函数和验证触发器的 `AbstractControlOptions` 对象。
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   * 单个异步验证器或异步验证器函数数组
   *
   */
  constructor(
      controls: TControl, validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
      // so we set `emitEvent` to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
  }

  public controls: ɵTypedOrUntyped<TControl, TControl, {[key: string]: AbstractControl<any>}>;

  /**
   * Registers a control with the group's list of controls. In a strongly-typed group, the control
   * must be in the group's type (possibly as an optional key).
   *
   * 使用组的控件列表注册控件。在强类型组中，控件必须是组的类型（可能作为可选键）。
   *
   * This method does not update the value or validity of the control.
   * Use {@link FormGroup#addControl addControl} instead.
   *
   * 此方法不会更新控件的值或有效性。改用 {@link FormGroup#addControl addControl} 。
   *
   * @param name The control name to register in the collection
   *
   * 要在集合中注册的控件名称
   *
   * @param control Provides the control for the given name
   *
   * 提供给定名称的控件
   *
   */
  registerControl<K extends string&keyof TControl>(name: K, control: TControl[K]): TControl[K];
  registerControl(
      this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string,
      control: AbstractControl<any>): AbstractControl<any>;

  registerControl<K extends string&keyof TControl>(name: K, control: TControl[K]): TControl[K] {
    if (this.controls[name]) return (this.controls as any)[name];
    this.controls[name] = control;
    control.setParent(this as FormGroup);
    control._registerOnCollectionChange(this._onCollectionChange);
    return control;
  }

  /**
   * Add a control to this group. In a strongly-typed group, the control must be in the group's type
   * (possibly as an optional key).
   *
   * 向此组添加控件。在强类型组中，控件必须是组的类型（可能作为可选键）。
   *
   * If a control with a given name already exists, it would *not* be replaced with a new one.
   * If you want to replace an existing control, use the {@link FormGroup#setControl setControl}
   * method instead. This method also updates the value and validity of the control.
   *
   * 如果已存在具有给定名称的控件，*则不*会将其替换为新名称。如果要替换现有控件，请改用 {@link
   * FormGroup#setControl setControl} 方法。此方法还会更新控件的值和有效性。
   *
   * @param name The control name to add to the collection
   *
   * 要添加到集合的控件名称
   *
   * @param control Provides the control for the given name
   *
   * 提供给定名称的控件
   *
   * @param options Specifies whether this FormGroup instance should emit events after a new
   *     control is added.
   *
   * 指定此 FormGroup 实例是否应在添加新控件后发出事件。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control is
   *   added. When false, no events are emitted.
   *
   *   `emitEvent` ：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象在添加控件时会发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  addControl(
      this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string,
      control: AbstractControl, options?: {emitEvent?: boolean}): void;
  addControl<K extends string&keyof TControl>(name: K, control: Required<TControl>[K], options?: {
    emitEvent?: boolean
  }): void;

  addControl<K extends string&keyof TControl>(name: K, control: Required<TControl>[K], options: {
    emitEvent?: boolean
  } = {}): void {
    this.registerControl(name, control);
    this.updateValueAndValidity({emitEvent: options.emitEvent});
    this._onCollectionChange();
  }

  removeControl(this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string, options?: {
    emitEvent?: boolean;
  }): void;
  removeControl<S extends string>(name: ɵOptionalKeys<TControl>&S, options?: {
    emitEvent?: boolean;
  }): void;

  /**
   * Remove a control from this group. In a strongly-typed group, required controls cannot be
   * removed.
   *
   * 从此组中删除控件。在强类型组中，无法删除所需的控件。
   *
   * This method also updates the value and validity of the control.
   *
   * 此方法还会更新控件的值和有效性。
   *
   * @param name The control name to remove from the collection
   *
   * 要从集合中删除的控件名称
   *
   * @param options Specifies whether this FormGroup instance should emit events after a
   *     control is removed.
   *
   * 指定此 FormGroup 实例是否应在删除控件后发出事件。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control is
   *   removed. When false, no events are emitted.
   *
   *   `emitEvent` ：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象会在删除控件时发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  removeControl(name: string, options: {emitEvent?: boolean;} = {}): void {
    if ((this.controls as any)[name])
      (this.controls as any)[name]._registerOnCollectionChange(() => {});
    delete ((this.controls as any)[name]);
    this.updateValueAndValidity({emitEvent: options.emitEvent});
    this._onCollectionChange();
  }

  /**
   * Replace an existing control. In a strongly-typed group, the control must be in the group's type
   * (possibly as an optional key).
   *
   * 替换现有的控件。在强类型组中，控件必须是组的类型（可能作为可选键）。
   *
   * If a control with a given name does not exist in this `FormGroup`, it will be added.
   *
   * 如果此 `FormGroup` 中不存在具有给定名称的控件，则将添加它。
   *
   * @param name The control name to replace in the collection
   *
   * 集合中要替换的控件名称
   *
   * @param control Provides the control for the given name
   *
   * 提供给定名称的控件
   *
   * @param options Specifies whether this FormGroup instance should emit events after an
   *     existing control is replaced.
   *
   * 指定此 FormGroup 实例是否应在替换现有控件后发出事件。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control is
   *   replaced with a new one. When false, no events are emitted.
   *
   *   `emitEvent` ：当为 true 或不提供（默认）时，当控件被替换为新控件时，`statusChanges` 和
   * `valueChanges` 可观察对象都会发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  setControl<K extends string&keyof TControl>(name: K, control: TControl[K], options?: {
    emitEvent?: boolean
  }): void;
  setControl(
      this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string,
      control: AbstractControl, options?: {emitEvent?: boolean}): void;

  setControl<K extends string&keyof TControl>(name: K, control: TControl[K], options: {
    emitEvent?: boolean
  } = {}): void {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {});
    delete (this.controls[name]);
    if (control) this.registerControl(name, control);
    this.updateValueAndValidity({emitEvent: options.emitEvent});
    this._onCollectionChange();
  }

  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * 检查组中是否存在具有给定名称的启用控件。
   *
   * Reports false for disabled controls. If you'd like to check for existence in the group
   * only, use {@link AbstractControl#get get} instead.
   *
   * 为禁用的控件报告 false 。如果你只想检查组中是否存在，请改用 {@link AbstractControl#get get} 。
   *
   * @param controlName The control name to check for existence in the collection
   *
   * 要检查集合中是否存在的控件名称
   *
   * @returns
   *
   * false for disabled controls, true otherwise.
   *
   * 禁用的控件为 false ，否则为 true 。
   *
   */
  contains<K extends string>(controlName: K): boolean;
  contains(this: FormGroup<{[key: string]: AbstractControl<any>}>, controlName: string): boolean;

  contains<K extends string&keyof TControl>(controlName: K): boolean {
    return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
  }

  /**
   * Sets the value of the `FormGroup`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * 设置 `FormGroup` 的值。它接受一个与组结构匹配的对象，以控件名称作为键。
   *
   * @usageNotes
   *
   * ### Set the complete value for the form group
   *
   * ### 设置表单组的完整值
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
   * ```
   *
   * @throws When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   *
   * 当严格检查失败时，例如设置不存在的控件的值或者排除确实存在的控件的值。
   *
   * @param value The new value for the control that matches the structure of the group.
   *
   * 与组结构匹配的控件的新值。
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events after the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * 确定控件如何传播更改并在值更改后发出事件的配置选项。配置选项会传递给 {@link
   * AbstractControl#updateValueAndValidity updateValueAndValidity} 方法。
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   *   false.
   *
   *   `onlySelf` ：当为 true 时，每次更改只影响此控件，而不影响其父控件。默认为 false。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control value is updated.
   *   When false, no events are emitted.
   *
   *   `emitEvent` ：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象会在更新控件值时发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  override setValue(value: ɵFormGroupRawValue<TControl>, options: {
    onlySelf?: boolean,
    emitEvent?: boolean
  } = {}): void {
    assertAllValuesPresent(this, true, value);
    (Object.keys(value) as Array<keyof TControl>).forEach(name => {
      assertControlPresent(this, true, name as any);
      (this.controls as any)[name].setValue(
          (value as any)[name], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this.updateValueAndValidity(options);
  }

  /**
   * Patches the value of the `FormGroup`. It accepts an object with control
   * names as keys, and does its best to match the values to the correct controls
   * in the group.
   *
   * 修补 `FormGroup` 的值。它接受以控件名称作为键的对象，并尽力将值与组中的正确控件进行匹配。
   *
   * It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   * 它接受组的超集和子集，而不会抛出错误。
   *
   * @usageNotes
   *
   * ### Patch the value for a form group
   *
   * ### 修补表单组的值
   *
   * ```
   * const form = new FormGroup({
   *    first: new FormControl(),
   *    last: new FormControl()
   * });
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.patchValue({first: 'Nancy'});
   * console.log(form.value);   // {first: 'Nancy', last: null}
   * ```
   *
   * @param value The object that matches the structure of the group.
   *
   * 与组结构匹配的对象。
   *
   * @param options Configuration options that determine how the control propagates changes and
   * emits events after the value is patched.
   *
   * 一些配置选项，用于确定控件在修补值后如何传播更改和发出事件。
   *
   * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
   *   true.
   *
   *   `onlySelf` ：当为 true 时，每次更改都只影响此控件，而不影响其父级。默认为 true。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control
   * value is updated. When false, no events are emitted. The configuration options are passed to
   *   the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   *
   *   `emitEvent` ：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象会在更新控件值时发出具有最新状态和值的事件。当 false
   * 时，不会发出事件。配置选项会传递给 {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} 方法。
   *
   */
  override patchValue(value: ɵFormGroupValue<TControl>, options: {
    onlySelf?: boolean,
    emitEvent?: boolean
  } = {}): void {
    // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
    // `patchValue` can be called recursively and inner data structures might have these values, so
    // we just ignore such cases when a field containing FormGroup instance receives `null` or
    // `undefined` as a value.
    if (value == null /* both `null` and `undefined` */) return;
    (Object.keys(value) as Array<keyof TControl>).forEach(name => {
      // The compiler cannot see through the uninstantiated conditional type of `this.controls`, so
      // `as any` is required.
      const control = (this.controls as any)[name];
      if (control) {
        control.patchValue(
            /* Guaranteed to be present, due to the outer forEach. */ value
                [name as keyof ɵFormGroupValue<TControl>]!,
            {onlySelf: true, emitEvent: options.emitEvent});
      }
    });
    this.updateValueAndValidity(options);
  }

  /**
   * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
   * the value of all descendants to their default values, or null if no defaults were provided.
   *
   * 重置 `FormGroup` ，将所有后代标记为 `pristine` 和 `untouched`
   * ，并将所有后代的值设置为默认值，如果没有提供默认值，则为 null 。
   *
   * You reset to a specific form state by passing in a map of states
   * that matches the structure of your form, with control names as keys. The state
   * is a standalone value or a form state object with both a value and a disabled
   * status.
   *
   * 你通过传入与表单结构匹配的状态映射表（以控件名称作为键）来重置为特定的表单状态。状态是独立值或具有值和禁用状态的表单状态对象。
   *
   * @param value Resets the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * 使用初始值或定义初始值和禁用状态的对象重置控件。
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events when the group is reset.
   *
   * 配置选项，确定控件在重置组时如何传播更改和发出事件。
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   *   false.
   *
   *   `onlySelf` ：当为 true 时，每次更改只影响此控件，而不影响其父控件。默认为 false。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control is reset.
   *   When false, no events are emitted.
   *   The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   *   updateValueAndValidity} method.
   *
   *   `emitEvent` ：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges`
   * 可观察对象会在控件重置时发出具有最新状态和值的事件。当 false
   * 时，不会发出事件。配置选项会传递给 {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} 方法。
   *
   * @usageNotes
   *
   * ### Reset the form group values
   *
   * ### 重置表单组的值
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
   * ### 重置表单组的值和禁用状态
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
   * console.log(form.value);  // {last: 'last'}
   * console.log(form.get('first').status);  // 'DISABLED'
   * ```
   *
   */
  override reset(
      value: ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any> = {} as unknown as
          ɵFormGroupValue<TControl>,
      options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._forEachChild((control, name) => {
      control.reset((value as any)[name], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this._updatePristine(options);
    this._updateTouched(options);
    this.updateValueAndValidity(options);
  }

  /**
   * The aggregate value of the `FormGroup`, including any disabled controls.
   *
   * `FormGroup` 的聚合值，包括任何禁用的控件。
   *
   * Retrieves all values regardless of disabled status.
   *
   * 无论禁用状态如何，都检索所有值。
   *
   */
  override getRawValue(): ɵTypedOrUntyped<TControl, ɵFormGroupRawValue<TControl>, any> {
    return this._reduceChildren({}, (acc, control, name) => {
      (acc as any)[name] = (control as any).getRawValue();
      return acc;
    }) as any;
  }

  /** @internal */
  override _syncPendingControls(): boolean {
    let subtreeUpdated = this._reduceChildren(false, (updated: boolean, child) => {
      return child._syncPendingControls() ? true : updated;
    });
    if (subtreeUpdated) this.updateValueAndValidity({onlySelf: true});
    return subtreeUpdated;
  }

  /** @internal */
  override _forEachChild(cb: (v: any, k: any) => void): void {
    Object.keys(this.controls).forEach(key => {
      // The list of controls can change (for ex. controls might be removed) while the loop
      // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
      // have to null check before invoking the callback.
      const control = (this.controls as any)[key];
      control && cb(control, key);
    });
  }

  /** @internal */
  _setUpControls(): void {
    this._forEachChild((control) => {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    });
  }

  /** @internal */
  override _updateValue(): void {
    (this as {value: any}).value = this._reduceValue();
  }

  /** @internal */
  override _anyControls(condition: (c: AbstractControl) => boolean): boolean {
    for (const [controlName, control] of Object.entries(this.controls)) {
      if (this.contains(controlName as any) && condition(control as any)) {
        return true;
      }
    }
    return false;
  }

  /** @internal */
  _reduceValue(): Partial<TControl> {
    let acc: Partial<TControl> = {};
    return this._reduceChildren(acc, (acc, control, name) => {
      if (control.enabled || this.disabled) {
        acc[name] = control.value;
      }
      return acc;
    });
  }

  /** @internal */
  _reduceChildren<T, K extends keyof TControl>(
      initValue: T, fn: (acc: T, control: TControl[K], name: K) => T): T {
    let res = initValue;
    this._forEachChild((control: TControl[K], name: K) => {
      res = fn(res, control, name);
    });
    return res;
  }

  /** @internal */
  override _allControlsDisabled(): boolean {
    for (const controlName of (Object.keys(this.controls) as Array<keyof TControl>)) {
      if ((this.controls as any)[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }

  /** @internal */
  override _find(name: string|number): AbstractControl|null {
    return this.controls.hasOwnProperty(name as string) ?
        (this.controls as any)[name as keyof TControl] :
        null;
  }
}

interface UntypedFormGroupCtor {
  new(controls: {[key: string]: AbstractControl},
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): UntypedFormGroup;

  /**
   * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
   * manually inspect the prototype chain.
   *
   * 显式 `prototype` 属性的存在为手动检查原型链的应用程序提供了向后兼容。
   *
   */
  prototype: FormGroup<any>;
}

/**
 * UntypedFormGroup is a non-strongly-typed version of @see FormGroup.
 *
 * UntypedFormGroup 是 @see FormGroup 的非强类型版本。
 *
 */
export type UntypedFormGroup = FormGroup<any>;

export const UntypedFormGroup: UntypedFormGroupCtor = FormGroup;

export const isFormGroup = (control: unknown): control is FormGroup => control instanceof FormGroup;

/**
 * Tracks the value and validity state of a collection of `FormControl` instances, each of which has
 * the same value type.
 *
 * 跟踪 `FormControl` 实例集合的值和有效状态，每个实例都具有相同的值类型。
 *
 * `FormRecord` is very similar to {@link FormGroup}, except it can be used with a dynamic keys,
 * with controls added and removed as needed.
 *
 * `FormRecord` 与 {@link FormGroup}
 * 非常相似，只是它可以与动态键一起使用，并可以根据需要添加和删除控件。
 *
 * `FormRecord` accepts one generic argument, which describes the type of the controls it contains.
 *
 * `FormRecord` 接受一个通用参数，该参数描述了它包含的控件的类型。
 *
 * @usageNotes
 *
 * ```
 * let numbers = new FormRecord({bill: '415-123-456'});
 * numbers.addControl('bob', '415-234-567');
 * numbers.removeControl('bill');
 * ```
 * @publicApi
 */
export class FormRecord<TControl extends AbstractControl<ɵValue<TControl>, ɵRawValue<TControl>> =
                                             AbstractControl> extends
    FormGroup<{[key: string]: TControl}> {}

export interface FormRecord<TControl> {
  /**
   * Registers a control with the records's list of controls.
   *
   * 使用记录的控件列表注册一个控件。
   *
   * See `FormGroup#registerControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#registerControl` 。
   *
   */
  registerControl(name: string, control: TControl): TControl;

  /**
   * Add a control to this group.
   *
   * 向此组添加控件。
   *
   * See `FormGroup#addControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#addControl` 。
   *
   */
  addControl(name: string, control: TControl, options?: {emitEvent?: boolean}): void;

  /**
   * Remove a control from this group.
   *
   * 从此组中删除控件。
   *
   * See `FormGroup#removeControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#removeControl` 。
   *
   */
  removeControl(name: string, options?: {emitEvent?: boolean}): void;

  /**
   * Replace an existing control.
   *
   * 替换现有的控件。
   *
   * See `FormGroup#setControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#setControl` 。
   *
   */
  setControl(name: string, control: TControl, options?: {emitEvent?: boolean}): void;

  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * 检查组中是否存在具有给定名称的启用控件。
   *
   * See `FormGroup#contains` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#contains` 。
   *
   */
  contains(controlName: string): boolean;

  /**
   * Sets the value of the `FormRecord`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * 设置 `FormRecord` 的值。它接受一个与组结构匹配的对象，以控件名称作为键。
   *
   * See `FormGroup#setValue` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#setValue` 。
   *
   */
  setValue(value: {[key: string]: ɵValue<TControl>}, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean
  }): void;

  /**
   * Patches the value of the `FormRecord`. It accepts an object with control
   * names as keys, and does its best to match the values to the correct controls
   * in the group.
   *
   * 修补 `FormRecord` 的值。它接受以控件名称作为键的对象，并尽力将值与组中的正确控件进行匹配。
   *
   * See `FormGroup#patchValue` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#patchValue` 。
   *
   */
  patchValue(value: {[key: string]: ɵValue<TControl>}, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean
  }): void;

  /**
   * Resets the `FormRecord`, marks all descendants `pristine` and `untouched` and sets
   * the value of all descendants to null.
   *
   * 重置 `FormRecord` ，将所有后代标记为 `pristine` 和 `untouched` ，并将所有后代的值设置为 null 。
   *
   * See `FormGroup#reset` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#reset` 。
   *
   */
  reset(value?: {[key: string]: ɵValue<TControl>}, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean
  }): void;

  /**
   * The aggregate value of the `FormRecord`, including any disabled controls.
   *
   * `FormRecord` 的聚合值，包括任何禁用的控件。
   *
   * See `FormGroup#getRawValue` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#getRawValue` 。
   *
   */
  getRawValue(): {[key: string]: ɵRawValue<TControl>};
}

export const isFormRecord = (control: unknown): control is FormRecord =>
    control instanceof FormRecord;
