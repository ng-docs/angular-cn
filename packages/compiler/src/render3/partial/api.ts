/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ChangeDetectionStrategy, ViewEncapsulation} from '../../core';
import * as o from '../../output/output_ast';

export interface R3PartialDeclaration {
  /**
   * The minimum version of the compiler that can process this partial declaration.
   *
   * 可以处理此部分声明的编译器的最低版本。
   *
   */
  minVersion: string;

  /**
   * Version number of the Angular compiler that was used to compile this declaration. The linker
   * will be able to detect which version a library is using and interpret its metadata accordingly.
   *
   * 用于编译此声明的 Angular
   * 编译器的版本号。链接器将能够检测到库正在使用的版本并相应地解释其元数据。
   *
   */
  version: string;

  /**
   * A reference to the `@angular/core` ES module, which allows access
   * to all Angular exports, including Ivy instructions.
   *
   * 对 `@angular/core` ES 模块的引用，它允许访问所有 Angular 导出，包括 Ivy 指令。
   *
   */
  ngImport: o.Expression;

  /**
   * Reference to the decorated class, which is subject to this partial declaration.
   *
   * 对受此部分声明的装饰类的引用。
   *
   */
  type: o.Expression;
}

/**
 * Describes the shape of the object that the `ɵɵngDeclareDirective()` function accepts.
 *
 * 描述 `ɵɵngDeclareDirective()` 函数接受的对象的形状。
 *
 */
export interface R3DeclareDirectiveMetadata extends R3PartialDeclaration {
  /**
   * Unparsed selector of the directive.
   *
   * 指令的未解析的选择器。
   *
   */
  selector?: string;

  /**
   * A mapping of inputs from class property names to binding property names, or to a tuple of
   * binding property name and class property name if the names are different.
   *
   * 输入从类属性名称到绑定属性名称的映射，如果名称不同，则映射到绑定属性名称和类属性名称的元组。
   *
   */
  inputs?: {[classPropertyName: string]: string|[string, string]};

  /**
   * A mapping of outputs from class property names to binding property names.
   *
   * 输出从类属性名称到绑定属性名称的映射。
   *
   */
  outputs?: {[classPropertyName: string]: string};

  /**
   * Information about host bindings present on the component.
   *
   * 有关组件上存在的主机绑定的信息。
   *
   */
  host?: {
    /**
     * A mapping of attribute names to their value expression.
     *
     * 属性名称到它们的值表达式的映射。
     *
     */
    attributes?: {[key: string]: o.Expression};

    /**
     * A mapping of event names to their unparsed event handler expression.
     *
     * 事件名称到其未解析的事件处理程序表达式的映射。
     *
     */
    listeners: {[key: string]: string};

    /**
     * A mapping of bound properties to their unparsed binding expression.
     *
     * 绑定属性到其未解析的绑定表达式的映射。
     *
     */
    properties?: {[key: string]: string};

    /**
     * The value of the class attribute, if present. This is stored outside of `attributes` as its
     * string value must be known statically.
     *
     * 类属性的值（如果存在）。这存储在 `attributes` 之外，因为其字符串值必须是静态已知的。
     *
     */
    classAttribute?: string;

    /**
     * The value of the style attribute, if present. This is stored outside of `attributes` as its
     * string value must be known statically.
     *
     * style 属性的值（如果存在）。这存储在 `attributes` 之外，因为其字符串值必须是静态已知的。
     *
     */
    styleAttribute?: string;
  };

  /**
   * Information about the content queries made by the directive.
   *
   * 有关该指令进行的内容查询的信息。
   *
   */
  queries?: R3DeclareQueryMetadata[];

  /**
   * Information about the view queries made by the directive.
   *
   * 有关该指令进行的视图查询的信息。
   *
   */
  viewQueries?: R3DeclareQueryMetadata[];

  /**
   * The list of providers provided by the directive.
   *
   * 指令提供的提供者列表。
   *
   */
  providers?: o.Expression;

  /**
   * The names by which the directive is exported.
   *
   * 导出指令所用的名称。
   *
   */
  exportAs?: string[];

  /**
   * Whether the directive has an inheritance clause. Defaults to false.
   *
   * 指令是否有继承子句。默认为 false 。
   *
   */
  usesInheritance?: boolean;

  /**
   * Whether the directive implements the `ngOnChanges` hook. Defaults to false.
   *
   * 指令是否实现 `ngOnChanges` 钩子。默认为 false 。
   *
   */
  usesOnChanges?: boolean;

  /**
   * Whether the directive is standalone. Defaults to false.
   *
   * 该指令是否是独立的。默认为 false。
   *
   */
  isStandalone?: boolean;
}

/**
 * Describes the shape of the object that the `ɵɵngDeclareComponent()` function accepts.
 *
 * 描述 `ɵɵngDeclareComponent()` 函数接受的对象的形状。
 *
 */
export interface R3DeclareComponentMetadata extends R3DeclareDirectiveMetadata {
  /**
   * The component's unparsed template string as opaque expression. The template is represented
   * using either a string literal or template literal without substitutions, but its value is
   * not read directly. Instead, the template parser is given the full source file's text and
   * the range of this expression to parse directly from source.
   *
   * 作为不透明表达式的组件的未解析模板字符串。模板可以使用字符串文字或不带替换的模板文字来表示，但不会直接读取其值。相反，模板解析器会获得完整的源文件文本以及要直接从源代码解析的此表达式的范围。
   *
   */
  template: o.Expression;

  /**
   * Whether the template was inline (using `template`) or external (using `templateUrl`).
   * Defaults to false.
   *
   * 模板是内联的（使用 `template` ）还是外部的（使用 `templateUrl` ）。默认为 false。
   *
   */
  isInline?: boolean;

  /**
   * CSS from inline styles and included styleUrls.
   *
   * 来自内联样式的 CSS，并包含 styleUrls。
   *
   */
  styles?: string[];

  /**
   * List of components which matched in the template, including sufficient
   * metadata for each directive to attribute bindings and references within
   * the template to each directive specifically, if the runtime instructions
   * support this.
   *
   * 模板中匹配的组件列表，包括每个指令的足够元数据，以属性绑定和模板中对每个指令的引用（如果运行时指令支持）。
   *
   */
  components?: R3DeclareDirectiveDependencyMetadata[];

  /**
   * List of directives which matched in the template, including sufficient
   * metadata for each directive to attribute bindings and references within
   * the template to each directive specifically, if the runtime instructions
   * support this.
   *
   * 模板中匹配的指令列表，包括每个指令的足够元数据，以属性绑定和模板中对每个指令的引用（如果运行时指令支持）。
   *
   */
  directives?: R3DeclareDirectiveDependencyMetadata[];

  /**
   * List of dependencies which matched in the template, including sufficient
   * metadata for each directive/pipe to attribute bindings and references within
   * the template to each directive specifically, if the runtime instructions
   * support this.
   *
   * 模板中匹配的依赖项列表，包括每个指令/管道的足够元数据，以进行属性绑定以及模板中对每个指令的引用（如果运行时指令支持）。
   *
   */
  dependencies?: R3DeclareTemplateDependencyMetadata[];

  /**
   * A map of pipe names to an expression referencing the pipe type (possibly a forward reference
   * wrapped in a `forwardRef` invocation) which are used in the template.
   *
   * 管道名称到引用模板中使用的管道类型的表达式（可能是包装在 `forwardRef`
   * 调用中的前向引用）的映射。
   *
   */
  pipes?: {[pipeName: string]: o.Expression|(() => o.Expression)};

  /**
   * The list of view providers defined in the component.
   *
   * 组件中定义的视图提供者列表。
   *
   */
  viewProviders?: o.Expression;

  /**
   * A collection of animation triggers that will be used in the component template.
   *
   * 将在组件模板中使用的动画触发器的集合。
   *
   */
  animations?: o.Expression;

  /**
   * Strategy used for detecting changes in the component.
   * Defaults to `ChangeDetectionStrategy.Default`.
   *
   * 用于检测组件更改的策略。默认为 `ChangeDetectionStrategy.Default` 。
   *
   */
  changeDetection?: ChangeDetectionStrategy;

  /**
   * An encapsulation policy for the component's styling.
   * Defaults to `ViewEncapsulation.Emulated`.
   *
   * 组件样式的封装策略。默认为 `ViewEncapsulation.Emulated` 。
   *
   */
  encapsulation?: ViewEncapsulation;

  /**
   * Overrides the default interpolation start and end delimiters. Defaults to {{ and }}.
   *
   * 覆盖默认的插值开始和结束分隔符。默认为 {{ 和 }}。
   *
   */
  interpolation?: [string, string];

  /**
   * Whether whitespace in the template should be preserved. Defaults to false.
   *
   * 是否应保留模板中的空格。默认为 false 。
   *
   */
  preserveWhitespaces?: boolean;
}

export type R3DeclareTemplateDependencyMetadata = R3DeclareDirectiveDependencyMetadata|
    R3DeclarePipeDependencyMetadata|R3DeclareNgModuleDependencyMetadata;

export interface R3DeclareDirectiveDependencyMetadata {
  kind: 'directive'|'component';

  /**
   * Selector of the directive.
   *
   * 指令的选择器。
   *
   */
  selector: string;

  /**
   * Reference to the directive class (possibly a forward reference wrapped in a `forwardRef`
   * invocation).
   *
   * 对指令类的引用（可能是包装在 `forwardRef` 调用中的前向引用）。
   *
   */
  type: o.Expression|(() => o.Expression);

  /**
   * Property names of the directive's inputs.
   *
   * 指令输入的属性名称。
   *
   */
  inputs?: string[];

  /**
   * Event names of the directive's outputs.
   *
   * 指令输出的事件名称。
   *
   */
  outputs?: string[];

  /**
   * Names by which this directive exports itself for references.
   *
   * 此指令用于导出自身以供引用的名称。
   *
   */
  exportAs?: string[];
}

export interface R3DeclarePipeDependencyMetadata {
  kind: 'pipe';

  name: string;

  /**
   * Reference to the pipe class (possibly a forward reference wrapped in a `forwardRef`
   * invocation).
   *
   * 对管道类的引用（可能是包装在 `forwardRef` 调用中的前向引用）。
   *
   */
  type: o.Expression|(() => o.Expression);
}

export interface R3DeclareNgModuleDependencyMetadata {
  kind: 'ngmodule';

  type: o.Expression|(() => o.Expression);
}

export interface R3DeclareQueryMetadata {
  /**
   * Name of the property on the class to update with query results.
   *
   * 要使用查询结果更新的类属性的名称。
   *
   */
  propertyName: string;

  /**
   * Whether to read only the first matching result, or an array of results. Defaults to false.
   *
   * 是仅读取第一个匹配的结果，还是读取结果数组。默认为 false。
   *
   */
  first?: boolean;

  /**
   * Either an expression representing a type (possibly wrapped in a `forwardRef()`) or
   * `InjectionToken` for the query predicate, or a set of string selectors.
   *
   * 查询谓词的表示类型（可能包含在 `forwardRef()` 中）或 `InjectionToken`
   * 的表达式，或一组字符串选择器。
   *
   */
  predicate: o.Expression|string[];

  /**
   * Whether to include only direct children or all descendants. Defaults to false.
   *
   * 是仅包括直接子项还是包括所有后代。默认为 false。
   *
   */
  descendants?: boolean;

  /**
   * True to only fire changes if there are underlying changes to the query.
   *
   * 仅在查询有基础更改时才触发更改。
   *
   */
  emitDistinctChangesOnly?: boolean;

  /**
   * An expression representing a type to read from each matched node, or null if the default value
   * for a given node is to be returned.
   *
   * 表示要从每个匹配的节点读取的类型的表达式，如果要返回给定节点的默认值，则为 null 。
   *
   */
  read?: o.Expression;

  /**
   * Whether or not this query should collect only static results. Defaults to false.
   *
   * 此查询是否应该仅收集静态结果。默认为 false 。
   *
   * If static is true, the query's results will be set on the component after nodes are created,
   * but before change detection runs. This means that any results that relied upon change detection
   * to run (e.g. results inside *ngIf or *ngFor views) will not be collected. Query results are
   * available in the ngOnInit hook.
   *
   * 如果 static 为
   * true，则查询的结果将在创建节点之后、更改检测运行之前在组件上设置。这意味着任何依赖更改检测运行的结果（例如*ngIf
   * 或*ngFor 视图中的结果）都不会被收集。查询结果在 ngOnInit 钩子中提供。
   *
   * If static is false, the query's results will be set on the component after change detection
   * runs. This means that the query results can contain nodes inside *ngIf or *ngFor views, but
   * the results will not be available in the ngOnInit hook (only in the ngAfterContentInit for
   * content hooks and ngAfterViewInit for view hooks).
   *
   * 如果 static 为 false，则查询的结果将在更改检测运行后在组件上设置。这意味着查询结果可以包含*ngIf
   * 或*ngFor 视图中的节点，但结果将在 ngOnInit 钩子中不可用（仅在 ngAfterContentInit
   * 中用于内容钩子，在 ngAfterViewInit 中用于视图钩子）。
   *
   */
  static?: boolean;
}

/**
 * Describes the shape of the objects that the `ɵɵngDeclareNgModule()` accepts.
 *
 * 描述 `ɵɵngDeclareNgModule()` 接受的对象的形状。
 *
 */
export interface R3DeclareNgModuleMetadata extends R3PartialDeclaration {
  /**
   * An array of expressions representing the bootstrap components specified by the module.
   *
   * 表示模块指定的引导组件的表达式数组。
   *
   */
  bootstrap?: o.Expression[];

  /**
   * An array of expressions representing the directives and pipes declared by the module.
   *
   * 表示模块声明的指令和管道的表达式数组。
   *
   */
  declarations?: o.Expression[];

  /**
   * An array of expressions representing the imports of the module.
   *
   * 表示模块导入的表达式数组。
   *
   */
  imports?: o.Expression[];

  /**
   * An array of expressions representing the exports of the module.
   *
   * 表示模块导出的表达式数组。
   *
   */
  exports?: o.Expression[];

  /**
   * The set of schemas that declare elements to be allowed in the NgModule.
   *
   * 声明 NgModule 中允许的元素的模式集。
   *
   */
  schemas?: o.Expression[];

  /**
   * Unique ID or expression representing the unique ID of an NgModule.
   *
   * 表示 NgModule 的唯一 ID 的唯一 ID 或表达式。
   *
   */
  id?: o.Expression;
}

/**
 * Describes the shape of the objects that the `ɵɵngDeclareInjector()` accepts.
 *
 * 描述 `ɵɵngDeclareInjector()` 接受的对象的形状。
 *
 */
export interface R3DeclareInjectorMetadata extends R3PartialDeclaration {
  /**
   * The list of providers provided by the injector.
   *
   * 注入器提供的提供者列表。
   *
   */
  providers?: o.Expression;
  /**
   * The list of imports into the injector.
   *
   * 注入器的导入列表。
   *
   */
  imports?: o.Expression[];
}

/**
 * Describes the shape of the object that the `ɵɵngDeclarePipe()` function accepts.
 *
 * 描述 `ɵɵngDeclarePipe()` 函数接受的对象的形状。
 *
 * This interface serves primarily as documentation, as conformance to this interface is not
 * enforced during linking.
 *
 * 此接口主要用作文档，因为在链接期间不会强制执行对此接口的一致性。
 *
 */
export interface R3DeclarePipeMetadata extends R3PartialDeclaration {
  /**
   * The name to use in templates to refer to this pipe.
   *
   * 在模板中使用以引用此管道的名称。
   *
   */
  name: string;

  /**
   * Whether this pipe is "pure".
   *
   * 此管道是否是“纯的”。
   *
   * A pure pipe's `transform()` method is only invoked when its input arguments change.
   *
   * 纯管道的 `transform()` 方法仅在其输入参数更改时才会调用。
   *
   * Default: true.
   *
   * 默认值： true 。
   *
   */
  pure?: boolean;

  /**
   * Whether the pipe is standalone.
   *
   * 管道是否是独立的。
   *
   * Default: false.
   *
   * 默认值： false 。
   *
   */
  isStandalone?: boolean;
}


/**
 * Describes the shape of the object that the `ɵɵngDeclareFactory()` function accepts.
 *
 * 描述 `ɵɵngDeclareFactory()` 函数接受的对象的形状。
 *
 * This interface serves primarily as documentation, as conformance to this interface is not
 * enforced during linking.
 *
 * 此接口主要用作文档，因为在链接期间不会强制执行对此接口的一致性。
 *
 */
export interface R3DeclareFactoryMetadata extends R3PartialDeclaration {
  /**
   * A collection of dependencies that this factory relies upon.
   *
   * 此工厂依赖的依赖项的集合。
   *
   * If this is `null`, then the type's constructor is nonexistent and will be inherited from an
   * ancestor of the type.
   *
   * 如果这是 `null` ，则该类型的构造函数不存在，将继承自该类型的祖先。
   *
   * If this is `'invalid'`, then one or more of the parameters wasn't resolvable and any attempt to
   * use these deps will result in a runtime error.
   *
   * 如果这是 `'invalid'` ，则一个或多个参数不可解析，并且任何使用这些 deps
   * 的尝试都将导致运行时错误。
   *
   */
  deps: R3DeclareDependencyMetadata[]|'invalid'|null;

  /**
   * Type of the target being created by the factory.
   *
   * 工厂正在创建的目标的类型。
   *
   */
  target: FactoryTarget;
}

export enum FactoryTarget {
  Directive = 0,
  Component = 1,
  Injectable = 2,
  Pipe = 3,
  NgModule = 4,
}

/**
 * Describes the shape of the object that the `ɵɵngDeclareInjectable()` function accepts.
 *
 * 描述 `ɵɵngDeclareInjectable()` 函数接受的对象的形状。
 *
 * This interface serves primarily as documentation, as conformance to this interface is not
 * enforced during linking.
 *
 * 此接口主要用作文档，因为在链接期间不会强制执行对此接口的一致性。
 *
 */
export interface R3DeclareInjectableMetadata extends R3PartialDeclaration {
  /**
   * If provided, specifies that the declared injectable belongs to a particular injector:
   *
   * 如果提供，则指定声明的 injectionable 属于特定的注入器：
   *
   * - `InjectorType` such as `NgModule`,
   *
   *   `InjectorType` 类型，例如 `NgModule` ，
   *
   * - `'root'` the root injector
   *
   *   `'root'` 根注入器
   *
   * - `'any'` all injectors.
   *   If not provided, then it does not belong to any injector. Must be explicitly listed in the
   *   providers of an injector.
   *
   *   `'any'` 所有喷油器。如果未提供，则它不属于任何注入器。必须在注入器的提供者中显式列出。
   *
   */
  providedIn?: o.Expression;

  /**
   * If provided, an expression that evaluates to a class to use when creating an instance of this
   * injectable.
   *
   * 如果提供了一个表达式，该表达式的值为创建此注入的实例时要使用的类。
   *
   */
  useClass?: o.Expression;

  /**
   * If provided, an expression that evaluates to a function to use when creating an instance of
   * this injectable.
   *
   * 如果提供了一个表达式，该表达式的值为创建此注入的实例时要使用的函数。
   *
   */
  useFactory?: o.Expression;

  /**
   * If provided, an expression that evaluates to a token of another injectable that this injectable
   * aliases.
   *
   * 如果提供了一个表达式，则计算结果为此可注入别名的另一个可注入的标记。
   *
   */
  useExisting?: o.Expression;

  /**
   * If provided, an expression that evaluates to the value of the instance of this injectable.
   *
   * 如果提供了一个表达式，其值为此注入的实例的值。
   *
   */
  useValue?: o.Expression;

  /**
   * An array of dependencies to support instantiating this injectable via `useClass` or
   * `useFactory`.
   *
   * 支持通过 `useClass` 或 `useFactory` 实例化此注入器的依赖项数组。
   *
   */
  deps?: R3DeclareDependencyMetadata[];
}

/**
 * Metadata indicating how a dependency should be injected into a factory.
 *
 * 指示应如何将依赖项注入工厂的元数据。
 *
 */
export interface R3DeclareDependencyMetadata {
  /**
   * An expression representing the token or value to be injected, or `null` if the dependency is
   * not valid.
   *
   * 表示要注入的标记或值的表达式，如果依赖项无效，则为 `null` 。
   *
   * If this dependency is due to the `@Attribute()` decorator, then this is an expression
   * evaluating to the name of the attribute.
   *
   * 如果此依赖项是由于 `@Attribute()` 装饰器引起的，那么这是一个估算为属性名称的表达式。
   *
   */
  token: o.Expression|null;

  /**
   * Whether the dependency is injecting an attribute value.
   * Default: false.
   *
   * 依赖项是否注入属性值。默认值： false 。
   *
   */
  attribute?: boolean;

  /**
   * Whether the dependency has an @Host qualifier.
   * Default: false,
   *
   * 依赖项是否具有 @Host 限定符。默认： false ，
   *
   */
  host?: boolean;

  /**
   * Whether the dependency has an @Optional qualifier.
   * Default: false,
   *
   * 依赖项是否具有 @Optional 限定符。默认： false ，
   *
   */
  optional?: boolean;

  /**
   * Whether the dependency has an @Self qualifier.
   * Default: false,
   *
   * 依赖项是否具有 @Self 限定符。默认： false ，
   *
   */
  self?: boolean;

  /**
   * Whether the dependency has an @SkipSelf qualifier.
   * Default: false,
   *
   * 依赖项是否具有 @SkipSelf 限定符。默认： false ，
   *
   */
  skipSelf?: boolean;
}

/**
 * Describes the shape of the object that the `ɵɵngDeclareClassMetadata()` function accepts.
 *
 * 描述 `ɵɵngDeclareClassMetadata()` 函数接受的对象的形状。
 *
 * This interface serves primarily as documentation, as conformance to this interface is not
 * enforced during linking.
 *
 * 此接口主要用作文档，因为在链接期间不会强制执行对此接口的一致性。
 *
 */
export interface R3DeclareClassMetadata extends R3PartialDeclaration {
  /**
   * The Angular decorators of the class.
   *
   * 类的 Angular 装饰器。
   *
   */
  decorators: o.Expression;

  /**
   * Optionally specifies the constructor parameters, their types and the Angular decorators of each
   * parameter. This property is omitted if the class does not have a constructor.
   *
   * （可选）指定构造函数参数、它们的类型和每个参数的 Angular
   * 装饰器。如果类没有构造函数，则忽略此属性。
   *
   */
  ctorParameters?: o.Expression;

  /**
   * Optionally specifies the Angular decorators applied to the class properties. This property is
   * omitted if no properties have any decorators.
   *
   * （可选）指定应用于类属性的 Angular 装饰器。如果没有属性有任何装饰器，则忽略此属性。
   *
   */
  propDecorators?: o.Expression;
}
