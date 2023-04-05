/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AST, LiteralPrimitive, ParseSourceSpan, PropertyRead, SafePropertyRead, TmplAstElement, TmplAstNode, TmplAstTemplate, TmplAstTextAttribute} from '@angular/compiler';
import ts from 'typescript';

import {AbsoluteFsPath} from '../../../../src/ngtsc/file_system';
import {ErrorCode} from '../../diagnostics';
import {Reference} from '../../imports';
import {NgModuleMeta, PipeMeta} from '../../metadata';
import {ClassDeclaration} from '../../reflection';

import {FullTemplateMapping, NgTemplateDiagnostic, TypeCheckableDirectiveMeta} from './api';
import {GlobalCompletion} from './completion';
import {PotentialDirective, PotentialImport, PotentialImportMode, PotentialPipe} from './scope';
import {ElementSymbol, Symbol, TcbLocation, TemplateSymbol} from './symbols';

/**
 * Interface to the Angular Template Type Checker to extract diagnostics and intelligence from the
 * compiler's understanding of component templates.
 *
 * 与 Angular 模板类型检查器的接口，从编译器对组件模板的理解中提取诊断和智能。
 *
 * This interface is analogous to TypeScript's own `ts.TypeChecker` API.
 *
 * 此接口类似于 TypeScript 自己的 `ts.TypeChecker` API。
 *
 * In general, this interface supports two kinds of operations:
 *
 * 一般来说，此接口支持两种操作：
 *
 * - updating Type Check Blocks (TCB)s that capture the template in the form of TypeScript code
 *
 *   更新以 TypeScript 代码形式捕获模板的类型检查块 (TCB)
 *
 * - querying information about available TCBs, including diagnostics
 *
 *   查询有关可用 TCB 的信息，包括诊断
 *
 * Once a TCB is available, information about it can be queried. If no TCB is available to answer a
 * query, depending on the method either `null` will be returned or an error will be thrown.
 *
 * 一旦 TCB 可用，就可以查询有关它的信息。如果没有 TCB 可用于回答查询，则根据方法的不同，将返回
 * `null` 或抛出错误。
 *
 */
export interface TemplateTypeChecker {
  /**
   * Retrieve the template in use for the given component.
   *
   * 检索给定组件正在使用的模板。
   *
   */
  getTemplate(component: ts.ClassDeclaration): TmplAstNode[]|null;

  /**
   * Get all `ts.Diagnostic`s currently available for the given `ts.SourceFile`.
   *
   * 获取当前可用于给定 `ts.SourceFile` `ts.Diagnostic`
   *
   * This method will fail (throw) if there are components within the `ts.SourceFile` that do not
   * have TCBs available.
   *
   * 如果 `ts.SourceFile` 中有没有可用的 TCB 的组件，此方法将失败（抛出）。
   *
   * Generating a template type-checking program is expensive, and in some workflows (e.g. checking
   * an entire program before emit), it should ideally only be done once. The `optimizeFor` flag
   * allows the caller to hint to `getDiagnosticsForFile` (which internally will create a template
   * type-checking program if needed) whether the caller is interested in just the results of the
   * single file, or whether they plan to query about other files in the program. Based on this
   * flag, `getDiagnosticsForFile` will determine how much of the user's program to prepare for
   * checking as part of the template type-checking program it creates.
   *
   * 生成模板类型检查程序的成本很高，并且在某些工作流中（例如在发出之前检查整个程序），理想情况下应该只完成一次。
   * `getDiagnosticsForFile` `optimizeFor`
   * 如果需要，它将在内部创建一个模板类型检查程序），调用者是只对单个文件的结果感兴趣，或者他们是否计划查询程序中的其他文件.根据此标志，
   * `getDiagnosticsForFile` 将确定作为它创建的模板类型检查程序的一部分，要准备检查多少用户程序。
   *
   */
  getDiagnosticsForFile(sf: ts.SourceFile, optimizeFor: OptimizeFor): ts.Diagnostic[];

  /**
   * Given a `shim` and position within the file, returns information for mapping back to a template
   * location.
   *
   * 给定文件中的 `shim` 和位置，返回用于映射回模板位置的信息。
   *
   */
  getTemplateMappingAtTcbLocation(tcbLocation: TcbLocation): FullTemplateMapping|null;

  /**
   * Get all `ts.Diagnostic`s currently available that pertain to the given component.
   *
   * 获取当前可用的与给定组件有关的所有 `ts.Diagnostic` 。
   *
   * This method always runs in `OptimizeFor.SingleFile` mode.
   *
   * 此方法始终在 `OptimizeFor.SingleFile` 模式下运行。
   *
   */
  getDiagnosticsForComponent(component: ts.ClassDeclaration): ts.Diagnostic[];

  /**
   * Ensures shims for the whole program are generated. This type of operation would be required by
   * operations like "find references" and "refactor/rename" because references may appear in type
   * check blocks generated from templates anywhere in the program.
   *
   * 确保生成整个程序的 shim。
   * “查找引用”和“重构/重命名”等操作将需要这种类型的操作，因为引用可能出现在从程序中任何地方的模板生成的类型检查块中。
   *
   */
  generateAllTypeCheckBlocks(): void;

  /**
   * Returns `true` if the given file is in the record of known shims generated by the compiler,
   * `false` if we cannot find the file in the shim records.
   *
   * 如果给定文件在编译器生成的已知 shim 记录中，则返回 `true` ，如果我们在 shim
   * 记录中找不到文件，则返回 `false` 。
   *
   */
  isTrackedTypeCheckFile(filePath: AbsoluteFsPath): boolean;

  /**
   * Retrieve the top-level node representing the TCB for the given component.
   *
   * 检索表示给定组件的 TCB 的顶级节点。
   *
   * This can return `null` if there is no TCB available for the component.
   *
   * 如果没有可用于组件的 TCB，这可以返回 `null` 。
   *
   * This method always runs in `OptimizeFor.SingleFile` mode.
   *
   * 此方法始终在 `OptimizeFor.SingleFile` 模式下运行。
   *
   */
  getTypeCheckBlock(component: ts.ClassDeclaration): ts.Node|null;

  /**
   * Retrieves a `Symbol` for the node in a component's template.
   *
   * 检索组件模板中节点的 `Symbol` 。
   *
   * This method can return `null` if a valid `Symbol` cannot be determined for the node.
   *
   * 如果无法为节点确定有效的 `Symbol` ，此方法可以返回 `null` 。
   *
   * @see Symbol
   *
   * 符号
   *
   */
  getSymbolOfNode(node: TmplAstElement, component: ts.ClassDeclaration): ElementSymbol|null;
  getSymbolOfNode(node: TmplAstTemplate, component: ts.ClassDeclaration): TemplateSymbol|null;
  getSymbolOfNode(node: AST|TmplAstNode, component: ts.ClassDeclaration): Symbol|null;

  /**
   * Get "global" `Completion`s in the given context.
   *
   * 在给定的上下文中获取“全局” `Completion` 。
   *
   * Global completions are completions in the global context, as opposed to completions within an
   * existing expression. For example, completing inside a new interpolation expression (`{{|}}`) or
   * inside a new property binding \`[input]="|" should retrieve global completions, which will
   * include completions from the template's context component, as well as any local references or
   * template variables which are in scope for that expression.
   *
   * 全局自动完成是全局上下文中的自动完成，而不是现有表达式中的自动完成。例如，在新的插值表达式 (
   * `{{|}}` ) 或新属性绑定 \` [input][input] ="|"
   * 中完成应该检索全局自动完成，这将包括来自模板上下文组件的自动完成，以及该表达式范围内的任何本地引用或模板变量。
   *
   */
  getGlobalCompletions(
      context: TmplAstTemplate|null, component: ts.ClassDeclaration,
      node: AST|TmplAstNode): GlobalCompletion|null;


  /**
   * For the given expression node, retrieve a `TcbLocation` that can be used to perform
   * autocompletion at that point in the expression, if such a location exists.
   *
   * 对于给定的表达式节点，检索一个 `TcbLocation` ，如果存在，则可用于在表达式中的该点执行自动完成。
   *
   */
  getExpressionCompletionLocation(
      expr: PropertyRead|SafePropertyRead, component: ts.ClassDeclaration): TcbLocation|null;

  /**
   * For the given node represents a `LiteralPrimitive`(the `TextAttribute` represents a string
   * literal), retrieve a `TcbLocation` that can be used to perform autocompletion at that point in
   * the node, if such a location exists.
   *
   * 对于给定的节点表示 `LiteralPrimitive`（`TextAttribute` 表示字符串文字），请检索一个
   * `TcbLocation` ，如果存在，请检索可用于在节点中的该点执行自动完成的 TcbLocation 。
   *
   */
  getLiteralCompletionLocation(
      strNode: LiteralPrimitive|TmplAstTextAttribute, component: ts.ClassDeclaration): TcbLocation
      |null;

  /**
   * Get basic metadata on the directives which are in scope or can be imported for the given
   * component.
   *
   * 获取给定组件范围内的指令的基本元数据。
   *
   */
  getPotentialTemplateDirectives(component: ts.ClassDeclaration): PotentialDirective[];

  /**
   * Get basic metadata on the pipes which are in scope or can be imported for the given component.
   *
   * 获取给定组件范围内的管道上的基本元数据。
   *
   */
  getPotentialPipes(component: ts.ClassDeclaration): PotentialPipe[];

  /**
   * Retrieve a `Map` of potential template element tags, to either the `PotentialDirective` that
   * declares them (if the tag is from a directive/component), or `null` if the tag originates from
   * the DOM schema.
   *
   * 检索潜在模板元素标签的 `Map` ，到声明它们的 `DirectiveInScope`
   *（如果标签来自指令/组件），如果标签来自 DOM 模式，则为 `null` 。
   *
   */
  getPotentialElementTags(component: ts.ClassDeclaration): Map<string, PotentialDirective|null>;

  /**
   * In the context of an Angular trait, generate potential imports for a directive.
   */
  getPotentialImportsFor(
      toImport: Reference<ClassDeclaration>, inComponent: ts.ClassDeclaration,
      importMode: PotentialImportMode): ReadonlyArray<PotentialImport>;

  /**
   * Get the primary decorator for an Angular class (such as @Component). This does not work for
   * `@Injectable`.
   */
  getPrimaryAngularDecorator(target: ts.ClassDeclaration): ts.Decorator|null;

  /**
   * Get the class of the NgModule that owns this Angular trait. If the result is `null`, that
   * probably means the provided component is standalone.
   */
  getOwningNgModule(component: ts.ClassDeclaration): ts.ClassDeclaration|null;

  /**
   * Retrieve any potential DOM bindings for the given element.
   *
   * 检索给定元素的任何潜在 DOM 绑定。
   *
   * This returns an array of objects which list both the attribute and property names of each
   * binding, which are usually identical but can vary if the HTML attribute name is for example a
   * reserved keyword in JS, like the `for` attribute which corresponds to the `htmlFor` property.
   *
   * 这会返回一个对象数组，其中列出了每个绑定的属性名称，它们通常是相同的，但如果 HTML 属性名称是 JS
   * 中的保留关键字，就像与 `htmlFor` 属性相对应的 `for` 属性，则可能会有所不同。
   *
   */
  getPotentialDomBindings(tagName: string): {attribute: string, property: string}[];

  /**
   * Retrieve any potential DOM events.
   *
   * 检索任何潜在的 DOM 事件。
   *
   */
  getPotentialDomEvents(tagName: string): string[];

  /**
   * Retrieve the type checking engine's metadata for the given directive class, if available.
   *
   * 检索给定指令类的类型检查引擎的元数据（如果可用）。
   *
   */
  getDirectiveMetadata(dir: ts.ClassDeclaration): TypeCheckableDirectiveMeta|null;

  /**
   * Retrieve the type checking engine's metadata for the given NgModule class, if available.
   */
  getNgModuleMetadata(module: ts.ClassDeclaration): NgModuleMeta|null;

  /**
   * Retrieve the type checking engine's metadata for the given pipe class, if available.
   */
  getPipeMetadata(pipe: ts.ClassDeclaration): PipeMeta|null;

  /**
   * Gets the directives that have been used in a component's template.
   */
  getUsedDirectives(component: ts.ClassDeclaration): TypeCheckableDirectiveMeta[]|null;

  /**
   * Gets the pipes that have been used in a component's template.
   */
  getUsedPipes(component: ts.ClassDeclaration): string[]|null;

  /**
   * Reset the `TemplateTypeChecker`'s state for the given class, so that it will be recomputed on
   * the next request.
   *
   * 重置给定类的 `TemplateTypeChecker` 的状态，以便在下一个请求时重新计算它。
   *
   */
  invalidateClass(clazz: ts.ClassDeclaration): void;

  /**
   * Constructs a `ts.Diagnostic` for a given `ParseSourceSpan` within a template.
   *
   * 在模板中为给定的 `ParseSourceSpan` 构造 `ts.Diagnostic` 。
   *
   */
  makeTemplateDiagnostic<T extends ErrorCode>(
      clazz: ts.ClassDeclaration, sourceSpan: ParseSourceSpan, category: ts.DiagnosticCategory,
      errorCode: T, message: string, relatedInformation?: {
        text: string,
        start: number,
        end: number,
        sourceFile: ts.SourceFile,
      }[]): NgTemplateDiagnostic<T>;
}

/**
 * Describes the scope of the caller's interest in template type-checking results.
 *
 * 描述调用者对模板类型检查结果的兴趣范围。
 *
 */
export enum OptimizeFor {
  /**
   * Indicates that a consumer of a `TemplateTypeChecker` is only interested in results for a
   * given file, and wants them as fast as possible.
   *
   * 表明 `TemplateTypeChecker` 的使用者只对给定文件的结果感兴趣，并希望尽快获得它们。
   *
   * Calling `TemplateTypeChecker` methods successively for multiple files while specifying
   * `OptimizeFor.SingleFile` can result in significant unnecessary overhead overall.
   *
   * 在指定 `OptimizeFor.SingleFile` 的同时为多个文件连续调用 `TemplateTypeChecker`
   * 方法可能会导致整体上出现大量不必要的开销。
   *
   */
  SingleFile,

  /**
   * Indicates that a consumer of a `TemplateTypeChecker` intends to query for results pertaining
   * to the entire user program, and so the type-checker should internally optimize for this case.
   *
   * 表明 `TemplateTypeChecker`
   * 的使用者打算查询与整个用户程序有关的结果，因此类型检查器应该针对这种情况在内部进行优化。
   *
   * Initial calls to retrieve type-checking information may take longer, but repeated calls to
   * gather information for the whole user program will be significantly faster with this mode of
   * optimization.
   *
   * 检索类型检查信息的初始调用可能需要更长时间，但使用这种优化模式，重复调用为整个用户程序收集信息将显着快得多。
   *
   */
  WholeProgram,
}
