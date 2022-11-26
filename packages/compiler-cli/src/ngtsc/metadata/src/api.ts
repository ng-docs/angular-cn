/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DirectiveMeta as T2DirectiveMeta, SchemaMetadata} from '@angular/compiler';
import ts from 'typescript';

import {Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';

import {ClassPropertyMapping, ClassPropertyName} from './property_mapping';

/**
 * Metadata collected for an `NgModule`.
 *
 * 为 `NgModule` 收集的元数据。
 *
 */
export interface NgModuleMeta {
  kind: MetaKind.NgModule;
  ref: Reference<ClassDeclaration>;
  declarations: Reference<ClassDeclaration>[];
  imports: Reference<ClassDeclaration>[];
  exports: Reference<ClassDeclaration>[];
  schemas: SchemaMetadata[];

  /**
   * The raw `ts.Expression` which gave rise to `declarations`, if one exists.
   *
   * 产生 `declarations` 的原始 `ts.Expression`（如果存在）。
   *
   * If this is `null`, then either no declarations exist, or no expression was available (likely
   * because the module came from a .d.ts file).
   *
   * 如果这是 `null` ，则不存在声明，或没有表达式可用（可能是因为模块来自 .d.ts 文件）。
   *
   */
  rawDeclarations: ts.Expression|null;

  /**
   * The raw `ts.Expression` which gave rise to `imports`, if one exists.
   *
   * 产生 `imports` 的原始 `ts.Expression`（如果存在）。
   *
   * If this is `null`, then either no imports exist, or no expression was available (likely
   * because the module came from a .d.ts file).
   *
   * 如果这是 `null` ，则不存在导入，或没有表达式可用（可能是因为模块来自 .d.ts 文件）。
   *
   */
  rawImports: ts.Expression|null;

  /**
   * The raw `ts.Expression` which gave rise to `exports`, if one exists.
   *
   * 导致 `exports` 的原始 `ts.Expression`（如果存在）。
   *
   * If this is `null`, then either no exports exist, or no expression was available (likely
   * because the module came from a .d.ts file).
   *
   * 如果这是 `null` ，则不存在导出，或没有表达式可用（可能是因为模块来自 .d.ts 文件）。
   *
   */
  rawExports: ts.Expression|null;

  /**
   * The primary decorator associated with this `ngModule`.
   *
   * If this is `null`, no decorator exists, meaning it's probably from a .d.ts file.
   */
  decorator: ts.Decorator|null;
}

/**
 * Typing metadata collected for a directive within an NgModule's scope.
 *
 * 在 NgModule 范围内键入为指令收集的元数据。
 *
 */
export interface DirectiveTypeCheckMeta {
  /**
   * List of static `ngTemplateGuard_xx` members found on the Directive's class.
   *
   * 在 Directive 的类上找到的静态 `ngTemplateGuard_xx` 成员列表。
   *
   * @see `TemplateGuardMeta`
   */
  ngTemplateGuards: TemplateGuardMeta[];

  /**
   * Whether the Directive's class has a static ngTemplateContextGuard function.
   *
   * 指令的类是否具有静态 ngTemplateContextGuard 函数。
   *
   */
  hasNgTemplateContextGuard: boolean;

  /**
   * The set of input fields which have a corresponding static `ngAcceptInputType_` on the
   * Directive's class. This allows inputs to accept a wider range of types and coerce the input to
   * a narrower type with a getter/setter. See <https://angular.io/guide/template-typecheck>.
   *
   * 在 Directive 的类上具有对应的静态 `ngAcceptInputType_`
   * 的输入字段集。这允许输入接受更广泛的类型，并使用 getter/setter
   * 将输入强制转换为更窄的类型。请参阅<https://angular.io/guide/template-typecheck> 。
   *
   */
  coercedInputFields: Set<ClassPropertyName>;

  /**
   * The set of input fields which map to `readonly`, `private`, or `protected` members in the
   * Directive's class.
   *
   * 映射到 Directive 类中的 `readonly`、`private` 或 `protected` 成员的输入字段集。
   *
   */
  restrictedInputFields: Set<ClassPropertyName>;

  /**
   * The set of input fields which are declared as string literal members in the Directive's class.
   * We need to track these separately because these fields may not be valid JS identifiers so
   * we cannot use them with property access expressions when assigning inputs.
   *
   * 在 Directive
   * 类中声明为字符串文字成员的输入字段集。我们需要单独跟踪这些，因为这些字段可能不是有效的 JS
   * 标识符，因此我们在分配输入时不能将它们与属性访问表达式一起使用。
   *
   */
  stringLiteralInputFields: Set<ClassPropertyName>;

  /**
   * The set of input fields which do not have corresponding members in the Directive's class.
   *
   * 在 Directive 类中没有对应成员的输入字段集。
   *
   */
  undeclaredInputFields: Set<ClassPropertyName>;

  /**
   * Whether the Directive's class is generic, i.e. `class MyDir<T> {...}`.
   *
   * 指令的类是否是通用的，即 `class MyDir<T> {...}` 。
   *
   */
  isGeneric: boolean;
}

/**
 * Disambiguates different kinds of compiler metadata objects.
 *
 * 消除不同类型的编译器元数据对象的歧义。
 *
 */
export enum MetaKind {
  Directive,
  Pipe,
  NgModule,
}

/**
 * Possible ways that a directive can be matched.
 */
export enum MatchSource {
  /** The directive was matched by its selector. */
  Selector,

  /** The directive was applied as a host directive. */
  HostDirective,
}

/**
 * Metadata collected for a directive within an NgModule's scope.
 *
 * 在 NgModule 范围内为指令收集的元数据。
 *
 */
export interface DirectiveMeta extends T2DirectiveMeta, DirectiveTypeCheckMeta {
  kind: MetaKind.Directive;

  /** Way in which the directive was matched. */
  matchSource: MatchSource;

  ref: Reference<ClassDeclaration>;
  /**
   * Unparsed selector of the directive, or null if the directive does not have a selector.
   *
   * 指令的未解析的选择器，如果指令没有选择器，则为 null 。
   *
   */
  selector: string|null;
  queries: string[];

  /**
   * A mapping of input field names to the property names.
   *
   * 输入字段名称到属性名称的映射。
   *
   */
  inputs: ClassPropertyMapping;

  /**
   * A mapping of output field names to the property names.
   *
   * 输出字段名称到属性名称的映射。
   *
   */
  outputs: ClassPropertyMapping;

  /**
   * A `Reference` to the base class for the directive, if one was detected.
   *
   * 对指令的基类的 `Reference`（如果检测到）。
   *
   * A value of `'dynamic'` indicates that while the analyzer detected that this directive extends
   * another type, it could not statically determine the base class.
   *
   * 值 `'dynamic'` 表示尽管分析器检测到此指令扩展了另一种类型，但它无法静态确定基类。
   *
   */
  baseClass: Reference<ClassDeclaration>|'dynamic'|null;

  /**
   * Whether the directive had some issue with its declaration that means it might not have complete
   * and reliable metadata.
   *
   * 该指令的声明是否存在问题，这意味着它可能没有完整且可靠的元数据。
   *
   */
  isPoisoned: boolean;

  /**
   * Whether the directive is likely a structural directive (injects `TemplateRef`).
   *
   * 该指令是否可能是结构指令（注入 `TemplateRef`）。
   *
   */
  isStructural: boolean;

  /**
   * Whether the directive is a standalone entity.
   *
   * 指令是否是独立实体。
   *
   */
  isStandalone: boolean;

  /**
   * For standalone components, the list of imported types.
   *
   * 对于独立组件，为导入的类型列表。
   *
   */
  imports: Reference<ClassDeclaration>[]|null;

  /**
   * For standalone components, the list of schemas declared.
   *
   * 对于独立组件，为声明的模式列表。
   *
   */
  schemas: SchemaMetadata[]|null;

  /**
   * The primary decorator associated with this directive.
   *
   * If this is `null`, no decorator exists, meaning it's probably from a .d.ts file.
   */
  decorator: ts.Decorator|null;

  /** Additional directives applied to the directive host. */
  hostDirectives: HostDirectiveMeta[]|null;
}

/** Metadata collected about an additional directive that is being applied to a directive host. */
export interface HostDirectiveMeta {
  /** Reference to the host directive class. */
  directive: Reference<ClassDeclaration>;

  /** Whether the reference to the host directive is a forward reference. */
  isForwardReference: boolean;

  /** Inputs from the host directive that have been exposed. */
  inputs: {[publicName: string]: string}|null;

  /** Outputs from the host directive that have been exposed. */
  outputs: {[publicName: string]: string}|null;
}

/**
 * Metadata that describes a template guard for one of the directive's inputs.
 *
 * 描述指令输入之一的模板防护的元数据。
 *
 */
export interface TemplateGuardMeta {
  /**
   * The input name that this guard should be applied to.
   *
   * 应应用此防护的输入名称。
   *
   */
  inputName: string;

  /**
   * Represents the type of the template guard.
   *
   * 表示模板防护的类型。
   *
   * - 'invocation' means that a call to the template guard function is emitted so that its return
   *   type can result in narrowing of the input type.
   *
   *   “调用” 意味着发出对模板保护函数的调用，以便其返回类型可以导致输入类型的缩小。
   *
   * - 'binding' means that the input binding expression itself is used as template guard.
   *
   *   “binding” 意味着输入绑定表达式本身被用作模板保护。
   *
   */
  type: 'invocation'|'binding';
}

/**
 * Metadata for a pipe within an NgModule's scope.
 *
 * NgModule 范围内的管道的元数据。
 *
 */
export interface PipeMeta {
  kind: MetaKind.Pipe;
  ref: Reference<ClassDeclaration>;
  name: string;
  nameExpr: ts.Expression|null;
  isStandalone: boolean;
  decorator: ts.Decorator|null;
}

/**
 * Reads metadata for directives, pipes, and modules from a particular source, such as .d.ts files
 * or a registry.
 *
 * 从特定源（例如 .d.ts 文件或注册表）读取指令、管道和模块的元数据。
 *
 */
export interface MetadataReader {
  getDirectiveMetadata(node: Reference<ClassDeclaration>): DirectiveMeta|null;
  getNgModuleMetadata(node: Reference<ClassDeclaration>): NgModuleMeta|null;
  getPipeMetadata(node: Reference<ClassDeclaration>): PipeMeta|null;
}

/**
 * A MetadataReader which also allows access to the set of all known directive classes.
 */
export interface MetadataReaderWithIndex extends MetadataReader {
  getKnownDirectives(): Iterable<ClassDeclaration>;
}

/**
 * Registers new metadata for directives, pipes, and modules.
 *
 * 为指令、管道和模块注册新的元数据。
 *
 */
export interface MetadataRegistry {
  registerDirectiveMetadata(meta: DirectiveMeta): void;
  registerNgModuleMetadata(meta: NgModuleMeta): void;
  registerPipeMetadata(meta: PipeMeta): void;
}
