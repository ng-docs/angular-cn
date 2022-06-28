/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AbsoluteSourceSpan, BoundTarget, DirectiveMeta, ParseSourceSpan, SchemaMetadata} from '@angular/compiler';
import ts from 'typescript';

import {ErrorCode} from '../../diagnostics';
import {AbsoluteFsPath} from '../../file_system';
import {Reference} from '../../imports';
import {ClassPropertyMapping, DirectiveTypeCheckMeta} from '../../metadata';
import {ClassDeclaration} from '../../reflection';


/**
 * Extension of `DirectiveMeta` that includes additional information required to type-check the
 * usage of a particular directive.
 *
 * `DirectiveMeta` 的扩展，包括对特定指令的用法进行类型检查所需的其他信息。
 *
 */
export interface TypeCheckableDirectiveMeta extends DirectiveMeta, DirectiveTypeCheckMeta {
  ref: Reference<ClassDeclaration>;
  queries: string[];
  inputs: ClassPropertyMapping;
  outputs: ClassPropertyMapping;
}

export type TemplateId = string&{__brand: 'TemplateId'};

/**
 * A `ts.Diagnostic` with additional information about the diagnostic related to template
 * type-checking.
 *
 * 一个 `ts.Diagnostic` ，其中包含有关与模板类型检查相关的诊断的其他信息。
 *
 */
export interface TemplateDiagnostic extends ts.Diagnostic {
  /**
   * The component with the template that resulted in this diagnostic.
   *
   * 带有导致此诊断的模板的组件。
   *
   */
  componentFile: ts.SourceFile;

  /**
   * The template id of the component that resulted in this diagnostic.
   *
   * 导致此诊断的组件的模板 ID。
   *
   */
  templateId: TemplateId;
}

/**
 * A `TemplateDiagnostic` with a specific error code.
 *
 * 具有特定错误代码的 `TemplateDiagnostic` 。
 *
 */
export type NgTemplateDiagnostic<T extends ErrorCode> = TemplateDiagnostic&{__ngCode: T};

/**
 * Metadata required in addition to a component class in order to generate a type check block (TCB)
 * for that component.
 *
 * 除了组件类之外，为该组件生成类型检查块 (TCB) 所需的元数据。
 *
 */
export interface TypeCheckBlockMetadata {
  /**
   * A unique identifier for the class which gave rise to this TCB.
   *
   * 产生此 TCB 的类的唯一标识符。
   *
   * This can be used to map errors back to the `ts.ClassDeclaration` for the component.
   *
   * 这可用于将错误映射回组件的 `ts.ClassDeclaration` 。
   *
   */
  id: TemplateId;

  /**
   * Semantic information about the template of the component.
   *
   * 有关组件模板的语义信息。
   *
   */
  boundTarget: BoundTarget<TypeCheckableDirectiveMeta>;

  /*
   * Pipes used in the template of the component.
   */
  pipes: Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>;

  /**
   * Schemas that apply to this template.
   *
   * 适用于此模板的架构。
   *
   */
  schemas: SchemaMetadata[];

  /*
   * A boolean indicating whether the component is standalone.
   */
  isStandalone: boolean;
}

export interface TypeCtorMetadata {
  /**
   * The name of the requested type constructor function.
   *
   * 请求的类型构造函数的名称。
   *
   */
  fnName: string;

  /**
   * Whether to generate a body for the function or not.
   *
   * 是否为函数生成主体。
   *
   */
  body: boolean;

  /**
   * Input, output, and query field names in the type which should be included as constructor input.
   *
   * 应作为构造函数输入的类型的输入、输出和查询字段名称。
   *
   */
  fields: {inputs: string[]; outputs: string[]; queries: string[];};

  /**
   * `Set` of field names which have type coercion enabled.
   *
   * 启用类型强制的字段名称 `Set` 。
   *
   */
  coercedInputFields: Set<string>;
}

export interface TypeCheckingConfig {
  /**
   * Whether to check the left-hand side type of binding operations.
   *
   * 是否检查左侧的绑定操作类型。
   *
   * For example, if this is `false` then the expression `[input]="expr"` will have `expr` type-
   * checked, but not the assignment of the resulting type to the `input` property of whichever
   * directive or component is receiving the binding. If set to `true`, both sides of the assignment
   * are checked.
   *
   * 例如，如果 this 为 `false` ，则表达式 `[input]="expr"` 将进行 `expr`
   * 类型检查，但不会将结果类型分配给正在接收绑定的任何指令或组件的 `input` 属性。如果设置为 `true`
   * ，则会检查赋值的两边。
   *
   * This flag only affects bindings to components/directives. Bindings to the DOM are checked if
   * `checkTypeOfDomBindings` is set.
   *
   * 此标志仅影响与组件/指令的绑定。如果设置了 `checkTypeOfDomBindings` ，则会检查与 DOM 的绑定。
   *
   */
  checkTypeOfInputBindings: boolean;

  /**
   * Whether to honor the access modifiers on input bindings for the component/directive.
   *
   * 是否遵守组件/指令的输入绑定上的访问修饰符。
   *
   * If a template binding attempts to assign to an input that is private/protected/readonly,
   * this will produce errors when enabled but will not when disabled.
   *
   * 如果模板绑定尝试分配给 private/protected/readonly
   * 的输入，则启用时将产生错误，但禁用时不会产生错误。
   *
   */
  honorAccessModifiersForInputBindings: boolean;

  /**
   * Whether to use strict null types for input bindings for directives.
   *
   * 是否对指令的输入绑定使用严格的 null 类型。
   *
   * If this is `true`, applications that are compiled with TypeScript's `strictNullChecks` enabled
   * will produce type errors for bindings which can evaluate to `undefined` or `null` where the
   * inputs's type does not include `undefined` or `null` in its type. If set to `false`, all
   * binding expressions are wrapped in a non-null assertion operator to effectively disable strict
   * null checks. This may be particularly useful when the directive is from a library that is not
   * compiled with `strictNullChecks` enabled.
   *
   * 如果为 `true` ，在启用 TypeScript 的 `strictNullChecks`
   * 的情况下编译的应用程序将产生绑定类型错误，如果输入的类型不包含 `undefined` 或 `null`
   * ，则可以估算为 `undefined` 或 `null` 。如果设置为 `false` ，则所有绑定表达式都包含在非 null
   * 断言运算符中，以有效禁用严格的 null 检查。当指令来自未启用 `strictNullChecks`
   * 编译的库时，这可能会特别有用。
   *
   * If `checkTypeOfInputBindings` is set to `false`, this flag has no effect.
   *
   * 如果 `checkTypeOfInputBindings` 设置为 `false` ，则此标志无效。
   *
   */
  strictNullInputBindings: boolean;

  /**
   * Whether to check text attributes that happen to be consumed by a directive or component.
   *
   * 是否检查恰好被指令或组件使用的文本属性。
   *
   * For example, in a template containing `<input matInput disabled>` the `disabled` attribute ends
   * up being consumed as an input with type `boolean` by the `matInput` directive. At runtime, the
   * input will be set to the attribute's string value, which is an empty string for attributes
   * without a value, so with this flag set to `true`, an error would be reported. If set to
   * `false`, text attributes will never report an error.
   *
   * 例如，在包含 `<input matInput disabled>` 的模板中，`disabled` 属性最终会被 `matInput` 指令作为
   * `boolean`
   * 类型的输入使用。在运行时，输入将设置为属性的字符串值，对于没有值的属性，这是一个空字符串，因此在此标志设置为
   * `true` 的情况下，将报告错误。如果设置为 `false` ，则文本属性将永远不会报告错误。
   *
   * Note that if `checkTypeOfInputBindings` is set to `false`, this flag has no effect.
   *
   * 请注意，如果 `checkTypeOfInputBindings` 设置为 `false` ，则此标志无效。
   *
   */
  checkTypeOfAttributes: boolean;

  /**
   * Whether to check the left-hand side type of binding operations to DOM properties.
   *
   * 是否检查对 DOM 属性的绑定操作的左侧类型。
   *
   * As `checkTypeOfBindings`, but only applies to bindings to DOM properties.
   *
   * 与 `checkTypeOfBindings` ，但仅适用于对 DOM 属性的绑定。
   *
   * This does not affect the use of the `DomSchemaChecker` to validate the template against the DOM
   * schema. Rather, this flag is an experimental, not yet complete feature which uses the
   * lib.dom.d.ts DOM typings in TypeScript to validate that DOM bindings are of the correct type
   * for assignability to the underlying DOM element properties.
   *
   * 这不会影响使用 `DomSchemaChecker` 来根据 DOM
   * 模式验证模板。相反，此标志是一个实验性的、尚未完成的特性，它使用 TypeScript 中的 lib.dom.d.ts
   * DOM 类型来验证 DOM 绑定是否是可分配给基础 DOM 元素属性的正确类型。
   *
   */
  checkTypeOfDomBindings: boolean;

  /**
   * Whether to infer the type of the `$event` variable in event bindings for directive outputs or
   * animation events.
   *
   * 是在指令输出或动画事件的事件绑定中推断 `$event` 变量的类型。
   *
   * If this is `true`, the type of `$event` will be inferred based on the generic type of
   * `EventEmitter`/`Subject` of the output. If set to `false`, the `$event` variable will be of
   * type `any`.
   *
   * 如果为 `true` ，则 `$event` 的类型将根据输出的 `EventEmitter` / `Subject`
   * 的泛型类型来推断。如果设置为 `false` ，则 `$event` 变量将是 `any` 类型。
   *
   */
  checkTypeOfOutputEvents: boolean;

  /**
   * Whether to infer the type of the `$event` variable in event bindings for animations.
   *
   * 是否在动画的事件绑定中推断 `$event` 变量的类型。
   *
   * If this is `true`, the type of `$event` will be `AnimationEvent` from `@angular/animations`.
   * If set to `false`, the `$event` variable will be of type `any`.
   *
   * 如果为 `true` ，则 `$event` 的类型将是来自 `@angular/animations` 的 `AnimationEvent`
   * 。如果设置为 `false` ，则 `$event` 变量将是 `any` 类型。
   *
   */
  checkTypeOfAnimationEvents: boolean;

  /**
   * Whether to infer the type of the `$event` variable in event bindings to DOM events.
   *
   * 是否在到 DOM 事件的事件绑定中推断 `$event` 变量的类型。
   *
   * If this is `true`, the type of `$event` will be inferred based on TypeScript's
   * `HTMLElementEventMap`, with a fallback to the native `Event` type. If set to `false`, the
   * `$event` variable will be of type `any`.
   *
   * 如果为 `true` ，则 `$event` 的类型将根据 TypeScript 的 `HTMLElementEventMap` 推断，并回退到本机
   * `Event` 类型。如果设置为 `false` ，则 `$event` 变量将是 `any` 类型。
   *
   */
  checkTypeOfDomEvents: boolean;

  /**
   * Whether to infer the type of local references to DOM elements.
   *
   * 是否推断对 DOM 元素的本地引用的类型。
   *
   * If this is `true`, the type of a `#ref` variable on a DOM node in the template will be
   * determined by the type of `document.createElement` for the given DOM node type. If set to
   * `false`, the type of `ref` for DOM nodes will be `any`.
   *
   * 如果为 `true` ，则模板中 DOM 节点上的 `#ref` 变量的类型将由给定 DOM 节点类型的
   * `document.createElement` 类型确定。如果设置为 `false` ，则 DOM 节点的 `ref` 类型将是 `any` 。
   *
   */
  checkTypeOfDomReferences: boolean;


  /**
   * Whether to infer the type of local references.
   *
   * 是否推断本地引用的类型。
   *
   * If this is `true`, the type of a `#ref` variable that points to a directive or `TemplateRef` in
   * the template will be inferred correctly. If set to `false`, the type of `ref` for will be
   * `any`.
   *
   * 如果为 `true` ，则将正确推断模板中指向指令或 `TemplateRef` 的 `#ref` 变量的类型。如果设置为
   * `false` ，则 `ref` 的类型将是 `any` 。
   *
   */
  checkTypeOfNonDomReferences: boolean;

  /**
   * Whether to adjust the output of the TCB to ensure compatibility with the `TemplateTypeChecker`.
   *
   * 是否调整 TCB 的输出以确保与 `TemplateTypeChecker` 兼容。
   *
   * The statements generated in the TCB are optimized for performance and producing diagnostics.
   * These optimizations can result in generating a TCB that does not have all the information
   * needed by the `TemplateTypeChecker` for retrieving `Symbol`s. For example, as an optimization,
   * the TCB will not generate variable declaration statements for directives that have no
   * references, inputs, or outputs. However, the `TemplateTypeChecker` always needs these
   * statements to be present in order to provide `ts.Symbol`s and `ts.Type`s for the directives.
   *
   * TCB 中生成的语句针对性能和生成诊断进行了优化。这些优化可能会导致生成的 TCB 不具有
   * `TemplateTypeChecker` 检索 `Symbol` 所需的所有信息。例如，作为一种优化，TCB
   * 将不会为没有引用、输入或输出的指令生成变量声明语句。但是，`TemplateTypeChecker`
   * 始终需要存在这些语句，以便为指令提供 `ts.Symbol` 和 `ts.Type` 。
   *
   * When set to `false`, enables TCB optimizations for template diagnostics.
   * When set to `true`, ensures all information required by `TemplateTypeChecker` to
   * retrieve symbols for template nodes is available in the TCB.
   *
   * 当设置为 `false` 时，为模板诊断启用 TCB 优化。当设置为 `true` 时，确保 `TemplateTypeChecker`
   * 为检索模板节点的符号所需的所有信息在 TCB 中可用。
   *
   */
  enableTemplateTypeChecker: boolean;

  /**
   * Whether to include type information from pipes in the type-checking operation.
   *
   * 是否在类型检查操作中包含来自管道的类型信息。
   *
   * If this is `true`, then the pipe's type signature for `transform()` will be used to check the
   * usage of the pipe. If this is `false`, then the result of applying a pipe will be `any`, and
   * the types of the pipe's value and arguments will not be matched against the `transform()`
   * method.
   *
   * 如果为 `true` ，则管道的 `transform()` 类型签名将用于检查管道的使用情况。如果这是 `false`
   * ，则应用管道的结果将是 `any` ，并且管道的值和参数的类型将不会与 `transform()` 方法匹配。
   *
   */
  checkTypeOfPipes: boolean;

  /**
   * Whether to narrow the types of template contexts.
   *
   * 是否缩小模板上下文的类型。
   *
   */
  applyTemplateContextGuards: boolean;

  /**
   * Whether to use a strict type for null-safe navigation operations.
   *
   * 是否将严格类型用于 null 安全的导航操作。
   *
   * If this is `false`, then the return type of `a?.b` or `a?()` will be `any`. If set to `true`,
   * then the return type of `a?.b` for example will be the same as the type of the ternary
   * expression `a != null ? a.b : a`.
   *
   * 如果这是 `false` ，则 `a?.b` 或 `a?()` 的返回类型将是 `any` 。如果设置为 `true` ，则 `a?.b`
   * 的返回类型将与三元表达式 `a != null ? ab : a` 的类型相同 `a != null ? ab : a` 。
   *
   */
  strictSafeNavigationTypes: boolean;

  /**
   * Whether to descend into template bodies and check any bindings there.
   *
   * 是否下降到模板体并检查那里的任何绑定。
   *
   */
  checkTemplateBodies: boolean;

  /**
   * Whether to always apply DOM schema checks in template bodies, independently of the
   * `checkTemplateBodies` setting.
   *
   * 是否始终在模板正文中应用 DOM 模式检查，与 `checkTemplateBodies` 设置无关。
   *
   */
  alwaysCheckSchemaInTemplateBodies: boolean;

  /**
   * Whether to check resolvable queries.
   *
   * 是否检查可解析的查询。
   *
   * This is currently an unsupported feature.
   *
   * 这是当前不支持的特性。
   *
   */
  checkQueries: false;

  /**
   * Whether to use any generic types of the context component.
   *
   * 是否使用上下文组件的任何泛型类型。
   *
   * If this is `true`, then if the context component has generic types, those will be mirrored in
   * the template type-checking context. If `false`, any generic type parameters of the context
   * component will be set to `any` during type-checking.
   *
   * 如果为 `true` ，则如果上下文组件具有泛型类型，则这些将在模板类型检查上下文中被镜像。如果
   * `false` ，则上下文组件的任何泛型类型参数都将在类型检查期间设置为 `any` 。
   *
   */
  useContextGenericType: boolean;

  /**
   * Whether or not to infer types for object and array literals in the template.
   *
   * 是否推断模板中对象和数组文字的类型。
   *
   * If this is `true`, then the type of an object or an array literal in the template will be the
   * same type that TypeScript would infer if the literal appeared in code. If `false`, then such
   * literals are cast to `any` when declared.
   *
   * 如果为 `true` ，则模板中对象或数组文字的类型将与 TypeScript
   * 推断的文字出现在代码中的类型相同。如果 `false` ，则此类文字在声明时会转换为 `any` 。
   *
   */
  strictLiteralTypes: boolean;

  /**
   * Whether to use inline type constructors.
   *
   * 是否使用内联类型构造函数。
   *
   * If this is `true`, create inline type constructors when required. For example, if a type
   * constructor's parameters has private types, it cannot be created normally, so we inline it in
   * the directives definition file.
   *
   * 如果为 `true`
   * ，请在需要时创建内联类型构造函数。例如，如果类型构造函数的参数具有私有类型，则无法正常创建，因此我们在指令定义文件中内联它。
   *
   * If false, do not create inline type constructors. Fall back to using `any` type for
   * constructors that normally require inlining.
   *
   * 如果为 false，则不要创建内联类型构造函数。回退到对通常需要内联的构造函数使用 `any` 类型。
   *
   * This option requires the environment to support inlining. If the environment does not support
   * inlining, this must be set to `false`.
   *
   * 此选项需要环境支持内联。如果环境不支持内联，则必须将其设置为 `false` 。
   *
   */
  useInlineTypeConstructors: boolean;

  /**
   * Whether or not to produce diagnostic suggestions in cases where the compiler could have
   * inferred a better type for a construct, but was prevented from doing so by the current type
   * checking configuration.
   *
   * 在编译器本可以为构造推断更好的类型但被当前的类型检查配置阻止这样做的情况下，是否生成诊断建议。
   *
   * For example, if the compiler could have used a template context guard to infer a better type
   * for a structural directive's context and `let-` variables, but the user is in
   * `fullTemplateTypeCheck` mode and such guards are therefore disabled.
   *
   * 例如，如果编译器本可以使用模板上下文保护来为结构指令的上下文和 `let-`
   * 变量推断更好的类型，但用户处于 `fullTemplateTypeCheck` 模式，因此此类保护被禁用。
   *
   * This mode is useful for clients like the Language Service which want to inform users of
   * opportunities to improve their own developer experience.
   *
   * 此模式对于像 Language Service 等希望告诉用户有机会改善自己的开发人员体验的客户端很有用。
   *
   */
  suggestionsForSuboptimalTypeInference: boolean;
}


export type TemplateSourceMapping =
    DirectTemplateSourceMapping|IndirectTemplateSourceMapping|ExternalTemplateSourceMapping;

/**
 * A mapping to an inline template in a TS file.
 *
 * 到 TS 文件中内联模板的映射。
 *
 * `ParseSourceSpan`s for this template should be accurate for direct reporting in a TS error
 * message.
 *
 * 此模板的 `ParseSourceSpan` 应该对于在 TS 错误消息中直接报告是准确的。
 *
 */
export interface DirectTemplateSourceMapping {
  type: 'direct';
  node: ts.StringLiteral|ts.NoSubstitutionTemplateLiteral;
}

/**
 * A mapping to a template which is still in a TS file, but where the node positions in any
 * `ParseSourceSpan`s are not accurate for one reason or another.
 *
 * 到仍然在 TS 文件中的模板的映射，但任何 `ParseSourceSpan` 中的节点位置由于某种原因不准确。
 *
 * This can occur if the template expression was interpolated in a way where the compiler could not
 * construct a contiguous mapping for the template string. The `node` refers to the `template`
 * expression.
 *
 * 如果模板表达式的插值方式为编译器无法为模板字符串构造连续映射，则可能会发生这种情况。 `node` 引用
 * `template` 表达式。
 *
 */
export interface IndirectTemplateSourceMapping {
  type: 'indirect';
  componentClass: ClassDeclaration;
  node: ts.Expression;
  template: string;
}

/**
 * A mapping to a template declared in an external HTML file, where node positions in
 * `ParseSourceSpan`s represent accurate offsets into the external file.
 *
 * 到在外部 HTML 文件中声明的模板的映射，其中 `ParseSourceSpan`
 * 中的节点位置表示到外部文件的准确偏移量。
 *
 * In this case, the given `node` refers to the `templateUrl` expression.
 *
 * 在这种情况下，给定的 `node` 是指 `templateUrl` 表达式。
 *
 */
export interface ExternalTemplateSourceMapping {
  type: 'external';
  componentClass: ClassDeclaration;
  node: ts.Expression;
  template: string;
  templateUrl: string;
}

/**
 * A mapping of a TCB template id to a span in the corresponding template source.
 *
 * TCB 模板 id 到相应模板源中的 span 的映射。
 *
 */
export interface SourceLocation {
  id: TemplateId;
  span: AbsoluteSourceSpan;
}

/**
 * A representation of all a node's template mapping information we know. Useful for producing
 * diagnostics based on a TCB node or generally mapping from a TCB node back to a template location.
 *
 * 我们知道的所有节点的模板映射信息的表示。可用于基于 TCB 节点生成诊断，或者通常从 TCB
 * 节点映射回模板位置。
 *
 */
export interface FullTemplateMapping {
  sourceLocation: SourceLocation;
  templateSourceMapping: TemplateSourceMapping;
  span: ParseSourceSpan;
}
