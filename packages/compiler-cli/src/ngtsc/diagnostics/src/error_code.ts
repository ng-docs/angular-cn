/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @publicApi
 */
export enum ErrorCode {
  DECORATOR_ARG_NOT_LITERAL = 1001,
  DECORATOR_ARITY_WRONG = 1002,
  DECORATOR_NOT_CALLED = 1003,
  DECORATOR_UNEXPECTED = 1005,

  /**
   * This error code indicates that there are incompatible decorators on a type or a class field.
   *
   * 此错误代码表明某个类型或类字段上有不兼容的装饰器。
   *
   */
  DECORATOR_COLLISION = 1006,

  VALUE_HAS_WRONG_TYPE = 1010,
  VALUE_NOT_LITERAL = 1011,

  COMPONENT_MISSING_TEMPLATE = 2001,
  PIPE_MISSING_NAME = 2002,
  PARAM_MISSING_TOKEN = 2003,
  DIRECTIVE_MISSING_SELECTOR = 2004,

  /**
   * Raised when an undecorated class is passed in as a provider to a module or a directive.
   *
   * 当未装饰的类作为模块或指令的提供者传入时引发。
   *
   */
  UNDECORATED_PROVIDER = 2005,

  /**
   * Raised when a Directive inherits its constructor from a base class without an Angular
   * decorator.
   *
   * 当 Directive 从没有 Angular 装饰器的基类继承其构造函数时引发。
   *
   */
  DIRECTIVE_INHERITS_UNDECORATED_CTOR = 2006,

  /**
   * Raised when an undecorated class that is using Angular features
   * has been discovered.
   *
   * 在发现使用 Angular 特性的未装饰类时引发。
   *
   */
  UNDECORATED_CLASS_USING_ANGULAR_FEATURES = 2007,

  /**
   * Raised when an component cannot resolve an external resource, such as a template or a style
   * sheet.
   *
   * 当组件无法解析外部资源（例如模板或样式表）时引发。
   *
   */
  COMPONENT_RESOURCE_NOT_FOUND = 2008,

  /**
   * Raised when a component uses `ShadowDom` view encapsulation, but its selector
   * does not match the shadow DOM tag name requirements.
   *
   * 当组件使用 `ShadowDom` 视图封装，但其选择器不符合 shadow DOM 标签名要求时引发。
   *
   */
  COMPONENT_INVALID_SHADOW_DOM_SELECTOR = 2009,

  /**
   * Raised when a component has `imports` but is not marked as `standalone: true`.
   *
   * 当组件具有 `imports` 但未标记为 `standalone: true` 时引发。
   *
   */
  COMPONENT_NOT_STANDALONE = 2010,

  /**
   * Raised when a type in the `imports` of a component is a directive or pipe, but is not
   * standalone.
   *
   * 当组件 `imports` 中的类型是指令或管道但不是独立的时引发。
   *
   */
  COMPONENT_IMPORT_NOT_STANDALONE = 2011,

  /**
   * Raised when a type in the `imports` of a component is not a directive, pipe, or NgModule.
   *
   * 当组件 `imports` 中的类型不是指令、管道或 NgModule 时引发。
   *
   */
  COMPONENT_UNKNOWN_IMPORT = 2012,

  /**
   * Raised when the compiler wasn't able to resolve the metadata of a host directive.
   */
  HOST_DIRECTIVE_INVALID = 2013,

  /**
   * Raised when a host directive isn't standalone.
   */
  HOST_DIRECTIVE_NOT_STANDALONE = 2014,

  /**
   * Raised when a host directive is a component.
   */
  HOST_DIRECTIVE_COMPONENT = 2015,

  /**
   * Raised when a type with Angular decorator inherits its constructor from a base class
   * which has a constructor that is incompatible with Angular DI.
   */
  INJECTABLE_INHERITS_INVALID_CONSTRUCTOR = 2016,

  /** Raised when a host tries to alias a host directive binding that does not exist. */
  HOST_DIRECTIVE_UNDEFINED_BINDING = 2017,

  /**
   * Raised when a host tries to alias a host directive
   * binding to a pre-existing binding's public name.
   */
  HOST_DIRECTIVE_CONFLICTING_ALIAS = 2018,

  SYMBOL_NOT_EXPORTED = 3001,
  /**
   * Raised when a relationship between directives and/or pipes would cause a cyclic import to be
   * created that cannot be handled, such as in partial compilation mode.
   *
   * 当指令和/或管道之间的关系将导致创建无法处理的循环导入时引发，例如在部分编译模式下。
   *
   */
  IMPORT_CYCLE_DETECTED = 3003,

  /**
   * Raised when the compiler is unable to generate an import statement for a reference.
   *
   * 当编译器无法为引用生成导入语句时引发。
   *
   */
  IMPORT_GENERATION_FAILURE = 3004,

  CONFIG_FLAT_MODULE_NO_INDEX = 4001,
  CONFIG_STRICT_TEMPLATES_IMPLIES_FULL_TEMPLATE_TYPECHECK = 4002,
  CONFIG_EXTENDED_DIAGNOSTICS_IMPLIES_STRICT_TEMPLATES = 4003,
  CONFIG_EXTENDED_DIAGNOSTICS_UNKNOWN_CATEGORY_LABEL = 4004,
  CONFIG_EXTENDED_DIAGNOSTICS_UNKNOWN_CHECK = 4005,

  /**
   * Raised when a host expression has a parse error, such as a host listener or host binding
   * expression containing a pipe.
   *
   * 在主机表达式存在解析错误时引发，例如主机侦听器或包含管道的主机绑定表达式。
   *
   */
  HOST_BINDING_PARSE_ERROR = 5001,

  /**
   * Raised when the compiler cannot parse a component's template.
   *
   * 当编译器无法解析组件的模板时引发。
   *
   */
  TEMPLATE_PARSE_ERROR = 5002,

  /**
   * Raised when an NgModule contains an invalid reference in `declarations`.
   *
   * 当 NgModule 在 `declarations` 中包含无效引用时引发。
   *
   */
  NGMODULE_INVALID_DECLARATION = 6001,

  /**
   * Raised when an NgModule contains an invalid type in `imports`.
   *
   * 当 NgModule 在 `imports` 中包含无效类型时引发。
   *
   */
  NGMODULE_INVALID_IMPORT = 6002,

  /**
   * Raised when an NgModule contains an invalid type in `exports`.
   *
   * 当 `exports` 在 dependencies 中包含无效类型时引发。
   *
   */
  NGMODULE_INVALID_EXPORT = 6003,

  /**
   * Raised when an NgModule contains a type in `exports` which is neither in `declarations` nor
   * otherwise imported.
   *
   * 当 NgModule 在 `exports` 中包含一种既不在 `declarations` 中也不是以其他方式导入的类型时引发。
   *
   */
  NGMODULE_INVALID_REEXPORT = 6004,

  /**
   * Raised when a `ModuleWithProviders` with a missing
   * generic type argument is passed into an `NgModule`.
   *
   * 在将缺少泛型类型参数的 ModuleWithProviders 传递给 `ModuleWithProviders` `NgModule` 。
   *
   */
  NGMODULE_MODULE_WITH_PROVIDERS_MISSING_GENERIC = 6005,

  /**
   * Raised when an NgModule exports multiple directives/pipes of the same name and the compiler
   * attempts to generate private re-exports within the NgModule file.
   *
   * 当 NgModule 导出多个同名的指令/管道并且编译器尝试在 NgModule 文件中生成私有重新导出时引发。
   *
   */
  NGMODULE_REEXPORT_NAME_COLLISION = 6006,

  /**
   * Raised when a directive/pipe is part of the declarations of two or more NgModules.
   *
   * 当指令/管道是两个或多个 NgModule 声明的一部分时引发。
   *
   */
  NGMODULE_DECLARATION_NOT_UNIQUE = 6007,

  /**
   * Raised when a standalone directive/pipe is part of the declarations of an NgModule.
   *
   * 当独立指令/管道是 NgModule 声明的一部分时引发。
   *
   */
  NGMODULE_DECLARATION_IS_STANDALONE = 6008,

  /**
   * Raised when a standalone component is part of the bootstrap list of an NgModule.
   *
   * 当独立组件是 NgModule 的引导列表的一部分时引发。
   *
   */
  NGMODULE_BOOTSTRAP_IS_STANDALONE = 6009,

  /**
   * Indicates that an NgModule is declared with `id: module.id`. This is an anti-pattern that is
   * disabled explicitly in the compiler, that was originally based on a misunderstanding of
   * `NgModule.id`.
   *
   * 表明一个 NgModule 是使用 `id: module.id`
   * 声明的。这是一个在编译器中显式禁用的反模式，最初是基于对 `NgModule.id` 的误解。
   *
   */
  WARN_NGMODULE_ID_UNNECESSARY = 6100,

  /**
   * Not actually raised by the compiler, but reserved for documentation of a View Engine error when
   * a View Engine build depends on an Ivy-compiled NgModule.
   *
   * 实际上不是由编译器引发的，而是在 View Engine 构建依赖于 Ivy 编译的 NgModule 时保留用于记录 View
   * Engine 错误。
   *
   */
  NGMODULE_VE_DEPENDENCY_ON_IVY_LIB = 6999,

  /**
   * An element name failed validation against the DOM schema.
   *
   * 元素名称无法针对 DOM 架构进行验证。
   *
   */
  SCHEMA_INVALID_ELEMENT = 8001,

  /**
   * An element's attribute name failed validation against the DOM schema.
   *
   * 元素的属性名称无法针对 DOM 架构进行验证。
   *
   */
  SCHEMA_INVALID_ATTRIBUTE = 8002,

  /**
   * No matching directive was found for a `#ref="target"` expression.
   *
   * 没有为 `#ref="target"` 表达式找到匹配的指令。
   *
   */
  MISSING_REFERENCE_TARGET = 8003,

  /**
   * No matching pipe was found for a
   *
   * 没有为 a 找到匹配的管道
   *
   */
  MISSING_PIPE = 8004,

  /**
   * The left-hand side of an assignment expression was a template variable. Effectively, the
   * template looked like:
   *
   * 赋值表达式的左侧是模板变量。实际上，模板类似于：
   *
   * ```
   * <ng-template let-something>
   *   <button (click)="something = ...">...</button>
   * </ng-template>
   * ```
   *
   * Template variables are read-only.
   *
   * 模板变量是只读的。
   *
   */
  WRITE_TO_READ_ONLY_VARIABLE = 8005,

  /**
   * A template variable was declared twice. For example:
   *
   * 模板变量被声明了两次。例如：
   *
   * ```html
   * <div *ngFor="let i of items; let i = index">
   * </div>
   * ```
   *
   */
  DUPLICATE_VARIABLE_DECLARATION = 8006,

  /**
   * A template has a two way binding (two bindings created by a single syntactical element)
   * in which the input and output are going to different places.
   *
   * 模板有一个双向绑定（由单个语法元素创建的两个绑定），其中的输入和输出将发送到不同的位置。
   *
   */
  SPLIT_TWO_WAY_BINDING = 8007,

  /**
   * A two way binding in a template has an incorrect syntax,
   * parentheses outside brackets. For example:
   *
   * 模板中的双向绑定的语法不正确，括号外的括号。例如：
   *
   * ```
   * <div ([foo])="bar" />
   * ```
   *
   */
  INVALID_BANANA_IN_BOX = 8101,

  /**
   * The left side of a nullish coalescing operation is not nullable.
   *
   * 为空的合并操作的左侧不能为空。
   *
   * ```
   * {{ foo ?? bar }}
   * ```
   *
   * When the type of foo doesn't include `null` or `undefined`.
   *
   * 当 foo 的类型不包括 `null` 或 `undefined` 时。
   *
   */
  NULLISH_COALESCING_NOT_NULLABLE = 8102,

  /**
   * A known control flow directive (e.g. `*ngIf`) is used in a template,
   * but the `CommonModule` is not imported.
   */
  MISSING_CONTROL_FLOW_DIRECTIVE = 8103,

  /**
   * A text attribute is not interpreted as a binding but likely intended to be.
   *
   * For example:
   * ```
   * <div
   *   attr.x="value"
   *   class.blue="true"
   *   style.margin-right.px="5">
   * </div>
   * ```
   *
   * All of the above attributes will just be static text attributes and will not be interpreted as
   * bindings by the compiler.
   */
  TEXT_ATTRIBUTE_NOT_BINDING = 8104,

  /**
   * NgForOf is used in a template, but the user forgot to include let
   * in their statement.
   *
   * For example:
   * ```
   * <ul><li *ngFor="item of items">{{item["name"]}};</li></ul>
   * ```
   */
  MISSING_NGFOROF_LET = 8105,
  /**
   * Indicates that the binding suffix is not supported
   *
   * Style bindings support suffixes like `style.width.px`, `.em`, and `.%`.
   * These suffixes are _not_ supported for attribute bindings.
   *
   * For example `[attr.width.px]="5"` becomes `width.px="5"` when bound.
   * This is almost certainly unintentional and this error is meant to
   * surface this mistake to the developer.
   */
  SUFFIX_NOT_SUPPORTED = 8106,

  /**
   * The left side of an optional chain operation is not nullable.
   *
   * ```
   * {{ foo?.bar }}
   * {{ foo?.['bar'] }}
   * {{ foo?.() }}
   * ```
   * When the type of foo doesn't include `null` or `undefined`.
   */
  OPTIONAL_CHAIN_NOT_NULLABLE = 8107,

  /**
   * The template type-checking engine would need to generate an inline type check block for a
   * component, but the current type-checking environment doesn't support it.
   *
   * 模板类型检查引擎将需要为组件生成一个内联类型检查块，但当前的类型检查环境不支持它。
   *
   */
  INLINE_TCB_REQUIRED = 8900,

  /**
   * The template type-checking engine would need to generate an inline type constructor for a
   * directive or component, but the current type-checking environment doesn't support it.
   *
   * 模板类型检查引擎将需要为指令或组件生成内联类型构造函数，但当前的类型检查环境不支持它。
   *
   */
  INLINE_TYPE_CTOR_REQUIRED = 8901,

  /**
   * An injectable already has a `ɵprov` property.
   *
   * 可注入物已经具有 `ɵprov` 属性。
   *
   */
  INJECTABLE_DUPLICATE_PROV = 9001,

  // 10XXX error codes are reserved for diagnostics with categories other than
  // `ts.DiagnosticCategory.Error`. These diagnostics are generated by the compiler when configured
  // to do so by a tool such as the Language Service, or by the Language Service itself.

  /**
   * Suggest users to enable `strictTemplates` to make use of full capabilities
   * provided by Angular language service.
   *
   * 建议用户启用 `strictTemplates` 以利用 Angular 语言服务提供的全部特性。
   *
   */
  SUGGEST_STRICT_TEMPLATES = 10001,

  /**
   * Indicates that a particular structural directive provides advanced type narrowing
   * functionality, but the current template type-checking configuration does not allow its usage in
   * type inference.
   *
   * 表明特定的结构指令提供了高级类型缩小特性，但当前的模板类型检查配置不允许在类型推断中使用它。
   *
   */
  SUGGEST_SUBOPTIMAL_TYPE_INFERENCE = 10002,
}
