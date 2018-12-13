export declare abstract class AbstractControl {
    asyncValidator: AsyncValidatorFn | null;
    readonly dirty: boolean;
    readonly disabled: boolean;
    readonly enabled: boolean;
    readonly errors: ValidationErrors | null;
    readonly invalid: boolean;
    readonly parent: FormGroup | FormArray;
    readonly pending: boolean;
    readonly pristine: boolean;
    readonly root: AbstractControl;
    readonly status: string;
    readonly statusChanges: Observable<any>;
    readonly touched: boolean;
    readonly untouched: boolean;
    readonly updateOn: FormHooks;
    readonly valid: boolean;
    validator: ValidatorFn | null;
    readonly value: any;
    readonly valueChanges: Observable<any>;
    constructor(validator: ValidatorFn | null, asyncValidator: AsyncValidatorFn | null);
    clearAsyncValidators(): void;
    clearValidators(): void;
    disable(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    enable(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    get(path: Array<string | number> | string): AbstractControl | null;
    getError(errorCode: string, path?: Array<string | number> | string): any;
    hasError(errorCode: string, path?: Array<string | number> | string): boolean;
    markAsDirty(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsPending(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    markAsPristine(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsTouched(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsUntouched(opts?: {
        onlySelf?: boolean;
    }): void;
    abstract patchValue(value: any, options?: Object): void;
    abstract reset(value?: any, options?: Object): void;
    setAsyncValidators(newValidator: AsyncValidatorFn | AsyncValidatorFn[] | null): void;
    setErrors(errors: ValidationErrors | null, opts?: {
        emitEvent?: boolean;
    }): void;
    setParent(parent: FormGroup | FormArray): void;
    setValidators(newValidator: ValidatorFn | ValidatorFn[] | null): void;
    abstract setValue(value: any, options?: Object): void;
    updateValueAndValidity(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
}

export declare abstract class AbstractControlDirective {
    abstract readonly control: AbstractControl | null;
    readonly dirty: boolean | null;
    readonly disabled: boolean | null;
    readonly enabled: boolean | null;
    readonly errors: ValidationErrors | null;
    readonly invalid: boolean | null;
    readonly path: string[] | null;
    readonly pending: boolean | null;
    readonly pristine: boolean | null;
    readonly status: string | null;
    readonly statusChanges: Observable<any> | null;
    readonly touched: boolean | null;
    readonly untouched: boolean | null;
    readonly valid: boolean | null;
    readonly value: any;
    readonly valueChanges: Observable<any> | null;
    getError(errorCode: string, path?: Array<string | number> | string): any;
    hasError(errorCode: string, path?: Array<string | number> | string): boolean;
    reset(value?: any): void;
}

export interface AbstractControlOptions {
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
    updateOn?: 'change' | 'blur' | 'submit';
    validators?: ValidatorFn | ValidatorFn[] | null;
}

export declare class AbstractFormGroupDirective extends ControlContainer implements OnInit, OnDestroy {
    readonly asyncValidator: AsyncValidatorFn | null;
    readonly control: FormGroup;
    readonly formDirective: Form | null;
    readonly path: string[];
    readonly validator: ValidatorFn | null;
    ngOnDestroy(): void;
    ngOnInit(): void;
}

export interface AsyncValidator extends Validator {
    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}

export interface AsyncValidatorFn {
    (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}

export declare class CheckboxControlValueAccessor implements ControlValueAccessor {
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    registerOnChange(fn: (_: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
}

export declare class CheckboxRequiredValidator extends RequiredValidator {
    validate(control: AbstractControl): ValidationErrors | null;
}

export declare const COMPOSITION_BUFFER_MODE: InjectionToken<boolean>;

export declare abstract class ControlContainer extends AbstractControlDirective {
    readonly formDirective: Form | null;
    name: string;
    readonly path: string[] | null;
}

export interface ControlValueAccessor {
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    writeValue(obj: any): void;
}

export declare class DefaultValueAccessor implements ControlValueAccessor {
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _compositionMode: boolean);
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
}

export declare class EmailValidator implements Validator {
    email: boolean | string;
    registerOnValidatorChange(fn: () => void): void;
    validate(control: AbstractControl): ValidationErrors | null;
}

export interface Form {
    addControl(dir: NgControl): void;
    addFormGroup(dir: AbstractFormGroupDirective): void;
    getControl(dir: NgControl): FormControl;
    getFormGroup(dir: AbstractFormGroupDirective): FormGroup;
    removeControl(dir: NgControl): void;
    removeFormGroup(dir: AbstractFormGroupDirective): void;
    updateModel(dir: NgControl, value: any): void;
}

export declare class FormArray extends AbstractControl {
    controls: AbstractControl[];
    readonly length: number;
    constructor(controls: AbstractControl[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    at(index: number): AbstractControl;
    getRawValue(): any[];
    insert(index: number, control: AbstractControl): void;
    patchValue(value: any[], options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    push(control: AbstractControl): void;
    removeAt(index: number): void;
    reset(value?: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    setControl(index: number, control: AbstractControl): void;
    setValue(value: any[], options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
}

export declare class FormArrayName extends ControlContainer implements OnInit, OnDestroy {
    readonly asyncValidator: AsyncValidatorFn | null;
    readonly control: FormArray;
    readonly formDirective: FormGroupDirective | null;
    name: string;
    readonly path: string[];
    readonly validator: ValidatorFn | null;
    constructor(parent: ControlContainer, validators: any[], asyncValidators: any[]);
    ngOnDestroy(): void;
    ngOnInit(): void;
}

export declare class FormBuilder {
    array(controlsConfig: any[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormArray;
    control(formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControl;
    group(controlsConfig: {
        [key: string]: any;
    }, options?: AbstractControlOptions | {
        [key: string]: any;
    } | null): FormGroup;
}

export declare class FormControl extends AbstractControl {
    constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    patchValue(value: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    }): void;
    registerOnChange(fn: Function): void;
    registerOnDisabledChange(fn: (isDisabled: boolean) => void): void;
    reset(formState?: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    setValue(value: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    }): void;
}

export declare class FormControlDirective extends NgControl implements OnChanges {
    readonly asyncValidator: AsyncValidatorFn | null;
    readonly control: FormControl;
    form: FormControl;
    isDisabled: boolean;
    /** @deprecated */ model: any;
    readonly path: string[];
    /** @deprecated */ update: EventEmitter<{}>;
    readonly validator: ValidatorFn | null;
    viewModel: any;
    constructor(validators: Array<Validator | ValidatorFn>, asyncValidators: Array<AsyncValidator | AsyncValidatorFn>, valueAccessors: ControlValueAccessor[], _ngModelWarningConfig: string | null);
    ngOnChanges(changes: SimpleChanges): void;
    viewToModelUpdate(newValue: any): void;
}

export declare class FormControlName extends NgControl implements OnChanges, OnDestroy {
    readonly asyncValidator: AsyncValidatorFn;
    readonly control: FormControl;
    readonly formDirective: any;
    isDisabled: boolean;
    /** @deprecated */ model: any;
    name: string;
    readonly path: string[];
    /** @deprecated */ update: EventEmitter<{}>;
    readonly validator: ValidatorFn | null;
    constructor(parent: ControlContainer, validators: Array<Validator | ValidatorFn>, asyncValidators: Array<AsyncValidator | AsyncValidatorFn>, valueAccessors: ControlValueAccessor[], _ngModelWarningConfig: string | null);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    viewToModelUpdate(newValue: any): void;
}

export declare class FormGroup extends AbstractControl {
    controls: {
        [key: string]: AbstractControl;
    };
    constructor(controls: {
        [key: string]: AbstractControl;
    }, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    addControl(name: string, control: AbstractControl): void;
    contains(controlName: string): boolean;
    getRawValue(): any;
    patchValue(value: {
        [key: string]: any;
    }, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    registerControl(name: string, control: AbstractControl): AbstractControl;
    removeControl(name: string): void;
    reset(value?: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    setControl(name: string, control: AbstractControl): void;
    setValue(value: {
        [key: string]: any;
    }, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
}

export declare class FormGroupDirective extends ControlContainer implements Form, OnChanges {
    readonly control: FormGroup;
    directives: FormControlName[];
    form: FormGroup;
    readonly formDirective: Form;
    ngSubmit: EventEmitter<{}>;
    readonly path: string[];
    readonly submitted: boolean;
    constructor(_validators: any[], _asyncValidators: any[]);
    addControl(dir: FormControlName): FormControl;
    addFormArray(dir: FormArrayName): void;
    addFormGroup(dir: FormGroupName): void;
    getControl(dir: FormControlName): FormControl;
    getFormArray(dir: FormArrayName): FormArray;
    getFormGroup(dir: FormGroupName): FormGroup;
    ngOnChanges(changes: SimpleChanges): void;
    onReset(): void;
    onSubmit($event: Event): boolean;
    removeControl(dir: FormControlName): void;
    removeFormArray(dir: FormArrayName): void;
    removeFormGroup(dir: FormGroupName): void;
    resetForm(value?: any): void;
    updateModel(dir: FormControlName, value: any): void;
}

export declare class FormGroupName extends AbstractFormGroupDirective implements OnInit, OnDestroy {
    name: string;
    constructor(parent: ControlContainer, validators: any[], asyncValidators: any[]);
}

export declare class FormsModule {
    static withConfig(opts: { warnOnDeprecatedNgFormSelector?: 'never' | 'once' | 'always';
    }): ModuleWithProviders<FormsModule>;
}

export declare class MaxLengthValidator implements Validator, OnChanges {
    maxlength: string;
    ngOnChanges(changes: SimpleChanges): void;
    registerOnValidatorChange(fn: () => void): void;
    validate(control: AbstractControl): ValidationErrors | null;
}

export declare class MinLengthValidator implements Validator, OnChanges {
    minlength: string;
    ngOnChanges(changes: SimpleChanges): void;
    registerOnValidatorChange(fn: () => void): void;
    validate(control: AbstractControl): ValidationErrors | null;
}

export declare const NG_ASYNC_VALIDATORS: InjectionToken<(Function | Validator)[]>;

export declare const NG_VALIDATORS: InjectionToken<(Function | Validator)[]>;

export declare const NG_VALUE_ACCESSOR: InjectionToken<ControlValueAccessor>;

export declare abstract class NgControl extends AbstractControlDirective {
    readonly asyncValidator: AsyncValidatorFn | null;
    name: string | null;
    readonly validator: ValidatorFn | null;
    valueAccessor: ControlValueAccessor | null;
    abstract viewToModelUpdate(newValue: any): void;
}

export declare class NgControlStatus extends AbstractControlStatus {
    constructor(cd: NgControl);
}

export declare class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd: ControlContainer);
}

export declare class NgForm extends ControlContainer implements Form, AfterViewInit {
    readonly control: FormGroup;
    readonly controls: {
        [key: string]: AbstractControl;
    };
    form: FormGroup;
    readonly formDirective: Form;
    ngSubmit: EventEmitter<{}>;
    options: {
        updateOn?: FormHooks;
    };
    readonly path: string[];
    readonly submitted: boolean;
    constructor(validators: any[], asyncValidators: any[]);
    addControl(dir: NgModel): void;
    addFormGroup(dir: NgModelGroup): void;
    getControl(dir: NgModel): FormControl;
    getFormGroup(dir: NgModelGroup): FormGroup;
    ngAfterViewInit(): void;
    onReset(): void;
    onSubmit($event: Event): boolean;
    removeControl(dir: NgModel): void;
    removeFormGroup(dir: NgModelGroup): void;
    resetForm(value?: any): void;
    setValue(value: {
        [key: string]: any;
    }): void;
    updateModel(dir: NgControl, value: any): void;
}

/** @deprecated */
export declare class NgFormSelectorWarning {
    constructor(ngFormWarning: string | null);
}

export declare class NgModel extends NgControl implements OnChanges, OnDestroy {
    readonly asyncValidator: AsyncValidatorFn | null;
    readonly control: FormControl;
    readonly formDirective: any;
    isDisabled: boolean;
    model: any;
    name: string;
    options: {
        name?: string;
        standalone?: boolean;
        updateOn?: FormHooks;
    };
    readonly path: string[];
    update: EventEmitter<{}>;
    readonly validator: ValidatorFn | null;
    viewModel: any;
    constructor(parent: ControlContainer, validators: Array<Validator | ValidatorFn>, asyncValidators: Array<AsyncValidator | AsyncValidatorFn>, valueAccessors: ControlValueAccessor[]);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    viewToModelUpdate(newValue: any): void;
}

export declare class NgModelGroup extends AbstractFormGroupDirective implements OnInit, OnDestroy {
    name: string;
    constructor(parent: ControlContainer, validators: any[], asyncValidators: any[]);
}

export declare class NgSelectOption implements OnDestroy {
    id: string;
    ngValue: any;
    value: any;
    constructor(_element: ElementRef, _renderer: Renderer2, _select: SelectControlValueAccessor);
    ngOnDestroy(): void;
}

export declare class NumberValueAccessor implements ControlValueAccessor {
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    registerOnChange(fn: (_: number | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: number): void;
}

export declare class PatternValidator implements Validator, OnChanges {
    pattern: string | RegExp;
    ngOnChanges(changes: SimpleChanges): void;
    registerOnValidatorChange(fn: () => void): void;
    validate(control: AbstractControl): ValidationErrors | null;
}

export declare class RadioControlValueAccessor implements ControlValueAccessor, OnDestroy, OnInit {
    formControlName: string;
    name: string;
    onChange: () => void;
    onTouched: () => void;
    value: any;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _registry: RadioControlRegistry, _injector: Injector);
    fireUncheck(value: any): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    registerOnChange(fn: (_: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
}

export declare class RangeValueAccessor implements ControlValueAccessor {
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    registerOnChange(fn: (_: number | null) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
}

export declare class ReactiveFormsModule {
    static withConfig(opts: { warnOnNgModelWithFormControl: 'never' | 'once' | 'always';
    }): ModuleWithProviders<ReactiveFormsModule>;
}

export declare class RequiredValidator implements Validator {
    required: boolean | string;
    registerOnValidatorChange(fn: () => void): void;
    validate(control: AbstractControl): ValidationErrors | null;
}

export declare class SelectControlValueAccessor implements ControlValueAccessor {
    compareWith: (o1: any, o2: any) => boolean;
    onChange: (_: any) => void;
    onTouched: () => void;
    value: any;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
}

export declare class SelectMultipleControlValueAccessor implements ControlValueAccessor {
    compareWith: (o1: any, o2: any) => boolean;
    onChange: (_: any) => void;
    onTouched: () => void;
    value: any;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
}

export declare type ValidationErrors = {
    [key: string]: any;
};

export interface Validator {
    registerOnValidatorChange?(fn: () => void): void;
    validate(control: AbstractControl): ValidationErrors | null;
}

export interface ValidatorFn {
    (control: AbstractControl): ValidationErrors | null;
}

export declare class Validators {
    static compose(validators: (ValidatorFn | null | undefined)[]): ValidatorFn | null;
    static compose(validators: null): null;
    static composeAsync(validators: (AsyncValidatorFn | null)[]): AsyncValidatorFn | null;
    static email(control: AbstractControl): ValidationErrors | null;
    static max(max: number): ValidatorFn;
    static maxLength(maxLength: number): ValidatorFn;
    static min(min: number): ValidatorFn;
    static minLength(minLength: number): ValidatorFn;
    static nullValidator(control: AbstractControl): ValidationErrors | null;
    static pattern(pattern: string | RegExp): ValidatorFn;
    static required(control: AbstractControl): ValidationErrors | null;
    static requiredTrue(control: AbstractControl): ValidationErrors | null;
}

export declare const VERSION: Version;
