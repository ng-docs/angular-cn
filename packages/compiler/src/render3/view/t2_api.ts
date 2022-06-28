/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AST} from '../../expression_parser/ast';
import {BoundAttribute, BoundEvent, Element, Node, Reference, Template, TextAttribute, Variable} from '../r3_ast';


/*
 * t2 is the replacement for the `TemplateDefinitionBuilder`. It handles the operations of
 * analyzing Angular templates, extracting semantic info, and ultimately producing a template
 * definition function which renders the template using Ivy instructions.
 *
 * t2 data is also utilized by the template type-checking facilities to understand a template enough
 * to generate type-checking code for it.
 */

/**
 * A logical target for analysis, which could contain a template or other types of bindings.
 *
 * 要分析的逻辑目标，可以包含模板或其他类型的绑定。
 *
 */
export interface Target {
  template?: Node[];
}

/**
 * A data structure which can indicate whether a given property name is present or not.
 *
 * 一种数据结构，可以表明给定属性名称是否存在。
 *
 * This is used to represent the set of inputs or outputs present on a directive, and allows the
 * binder to query for the presence of a mapping for property names.
 *
 * 这用于表示指令上存在的输入或输出集，并允许绑定器查询是否存在属性名称的映射。
 *
 */
export interface InputOutputPropertySet {
  hasBindingPropertyName(propertyName: string): boolean;
}

/**
 * A data structure which captures the animation trigger names that are statically resolvable
 * and whether some names could not be statically evaluated.
 *
 * 一种数据结构，它捕获可静态解析的动画触发器名称以及某些名称是否无法静态估算。
 *
 */
export interface AnimationTriggerNames {
  includesDynamicAnimations: boolean;
  staticTriggerNames: string[];
}

/**
 * Metadata regarding a directive that's needed to match it against template elements. This is
 * provided by a consumer of the t2 APIs.
 *
 * 有关将其与模板元素匹配所需的指令的元数据。这是由 t2 API 的使用者提供的。
 *
 */
export interface DirectiveMeta {
  /**
   * Name of the directive class (used for debugging).
   *
   * 指令类的名称（用于调试）。
   *
   */
  name: string;

  /**
   * The selector for the directive or `null` if there isn't one.
   *
   * 指令的选择器，如果没有，则为 `null` 。
   *
   */
  selector: string|null;

  /**
   * Whether the directive is a component.
   *
   * 指令是否是组件。
   *
   */
  isComponent: boolean;

  /**
   * Set of inputs which this directive claims.
   *
   * 本指令声明的输入集。
   *
   * Goes from property names to field names.
   *
   * 从属性名称到字段名称。
   *
   */
  inputs: InputOutputPropertySet;

  /**
   * Set of outputs which this directive claims.
   *
   * 本指令声明的输出集。
   *
   * Goes from property names to field names.
   *
   * 从属性名称到字段名称。
   *
   */
  outputs: InputOutputPropertySet;

  /**
   * Name under which the directive is exported, if any (exportAs in Angular).
   *
   * 导出指令的名称（如果有）（在 Angular 中为 exportAs）。
   *
   * Null otherwise
   *
   * 否则为 null
   *
   */
  exportAs: string[]|null;

  isStructural: boolean;

  /**
   * The name of animations that the user defines in the component.
   * Only includes the animation names.
   *
   * 用户在组件中定义的动画的名称。仅包含动画名称。
   *
   */
  animationTriggerNames: AnimationTriggerNames|null;
}

/**
 * Interface to the binding API, which processes a template and returns an object similar to the
 * `ts.TypeChecker`.
 *
 * 绑定 API 的接口，它处理模板并返回类似于 `ts.TypeChecker` 的对象。
 *
 * The returned `BoundTarget` has an API for extracting information about the processed target.
 *
 * 返回的 `BoundTarget` 有一个 API，用于提取有关已处理目标的信息。
 *
 */
export interface TargetBinder<D extends DirectiveMeta> {
  bind(target: Target): BoundTarget<D>;
}

/**
 * Result of performing the binding operation against a `Target`.
 *
 * 对 `Target` 执行绑定操作的结果。
 *
 * The original `Target` is accessible, as well as a suite of methods for extracting binding
 * information regarding the `Target`.
 *
 * 原始的 `Target` 以及一组用于提取有关 `Target` 绑定信息的方法是可访问的。
 *
 * @param DirectiveT directive metadata type
 *
 * 指令元数据类型
 *
 */
export interface BoundTarget<DirectiveT extends DirectiveMeta> {
  /**
   * Get the original `Target` that was bound.
   *
   * 获取绑定的原始 `Target` 。
   *
   */
  readonly target: Target;

  /**
   * For a given template node (either an `Element` or a `Template`), get the set of directives
   * which matched the node, if any.
   *
   * 对于给定的模板节点（`Element` 或 `Template`），获取与该节点匹配的指令集（如果有）。
   *
   */
  getDirectivesOfNode(node: Element|Template): DirectiveT[]|null;

  /**
   * For a given `Reference`, get the reference's target - either an `Element`, a `Template`, or
   * a directive on a particular node.
   *
   * 对于给定的 `Reference` ，获取引用的目标 - `Element`、`Template` 或特定节点上的指令。
   *
   */
  getReferenceTarget(ref: Reference): {directive: DirectiveT, node: Element|Template}|Element
      |Template|null;

  /**
   * For a given binding, get the entity to which the binding is being made.
   *
   * 对于给定的绑定，获取要进行绑定的实体。
   *
   * This will either be a directive or the node itself.
   *
   * 这将是指令或节点本身。
   *
   */
  getConsumerOfBinding(binding: BoundAttribute|BoundEvent|TextAttribute): DirectiveT|Element
      |Template|null;

  /**
   * If the given `AST` expression refers to a `Reference` or `Variable` within the `Target`, then
   * return that.
   *
   * 如果给定的 `AST` 表达式引用了 `Target` 中的 `Reference` 或 `Variable` ，则返回它。
   *
   * Otherwise, returns `null`.
   *
   * 否则，返回 `null` 。
   *
   * This is only defined for `AST` expressions that read or write to a property of an
   * `ImplicitReceiver`.
   *
   * 这仅针对读取或写入 `ImplicitReceiver` 的属性的 `AST` 表达式定义。
   *
   */
  getExpressionTarget(expr: AST): Reference|Variable|null;

  /**
   * Given a particular `Reference` or `Variable`, get the `Template` which created it.
   *
   * 给定特定的 `Reference` 或 `Variable` ，获取创建它的 `Template` 。
   *
   * All `Variable`s are defined on templates, so this will always return a value for a `Variable`
   * from the `Target`. For `Reference`s this only returns a value if the `Reference` points to a
   * `Template`. Returns `null` otherwise.
   *
   * 所有 `Variable` 都是在模板上定义的，因此这将始终从 `Target` 中返回 `Variable` 的值。对于
   * `Reference` s，只有在 `Reference` 指向了 `Template` 时才会返回值。否则返回 `null` 。
   *
   */
  getTemplateOfSymbol(symbol: Reference|Variable): Template|null;

  /**
   * Get the nesting level of a particular `Template`.
   *
   * 获取特定 `Template` 的嵌套级别。
   *
   * This starts at 1 for top-level `Template`s within the `Target` and increases for `Template`s
   * nested at deeper levels.
   *
   * 对于 `Target` 中的顶级 `Template` ，这从 1 开始，对于嵌套在更深级别的 `Template` s 会增加。
   *
   */
  getNestingLevel(template: Template): number;

  /**
   * Get all `Reference`s and `Variables` visible within the given `Template` (or at the top level,
   * if `null` is passed).
   *
   * 获取给定 `Template` 中的所有 `Reference` 和 `Variables`（或在顶级，如果传递了 `null`）。
   *
   */
  getEntitiesInTemplateScope(template: Template|null): ReadonlySet<Reference|Variable>;

  /**
   * Get a list of all the directives used by the target.
   *
   * 获取目标使用的所有指令的列表。
   *
   */
  getUsedDirectives(): DirectiveT[];

  /**
   * Get a list of all the pipes used by the target.
   *
   * 获取目标使用的所有管道的列表。
   *
   */
  getUsedPipes(): string[];
}
