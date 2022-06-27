/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ConstantPool, Expression, Statement, Type} from '@angular/compiler';
import ts from 'typescript';

import {Reexport} from '../../imports';
import {SemanticSymbol} from '../../incremental/semantic_graph';
import {IndexingContext} from '../../indexer';
import {ClassDeclaration, Decorator} from '../../reflection';
import {ImportManager} from '../../translator';
import {TypeCheckContext} from '../../typecheck/api';
import {ExtendedTemplateChecker} from '../../typecheck/extended/api';
import {Xi18nContext} from '../../xi18n';

/**
 * Specifies the compilation mode that is used for the compilation.
 *
 * 指定用于编译的编译模式。
 *
 */
export enum CompilationMode {
  /**
   * Generates fully AOT compiled code using Ivy instructions.
   *
   * 使用 Ivy 指令生成完全 AOT 编译的代码。
   *
   */
  FULL,

  /**
   * Generates code using a stable, but intermediate format suitable to be published to NPM.
   *
   * 使用适合发布到 NPM 的稳定但中间格式生成代码。
   *
   */
  PARTIAL,
}

export enum HandlerPrecedence {
  /**
   * Handler with PRIMARY precedence cannot overlap - there can only be one on a given class.
   *
   * 具有 PRIMARY 优先级的处理程序不能重叠 - 给定类上只能有一个。
   *
   * If more than one PRIMARY handler matches a class, an error is produced.
   *
   * 如果多个 PRIMARY 处理程序与一个类匹配，则会产生错误。
   *
   */
  PRIMARY,

  /**
   * Handlers with SHARED precedence can match any class, possibly in addition to a single PRIMARY
   * handler.
   *
   * 具有 SHARED 优先级的处理程序可以匹配任何类，可能是除了单个 PRIMARY 处理程序。
   *
   * It is not an error for a class to have any number of SHARED handlers.
   *
   * 类具有任意数量的 SHARED 处理程序不是错误。
   *
   */
  SHARED,

  /**
   * Handlers with WEAK precedence that match a class are ignored if any handlers with stronger
   * precedence match a class.
   *
   * 如果任何具有更高优先级的处理程序与类匹配，则与类匹配的具有 WEAK 优先级的处理程序将被忽略。
   *
   */
  WEAK,
}

/**
 * A set of options which can be passed to a `DecoratorHandler` by a consumer, to tailor the output
 * of compilation beyond the decorators themselves.
 *
 * 消费者可以传递给 `DecoratorHandler` 的一组选项，用于定制装饰器本身之外的编译输出。
 *
 */
export enum HandlerFlags {
  /**
   * No flags set.
   *
   * 没有设置标志。
   *
   */
  NONE = 0x0,

  /**
   * Indicates that this decorator is fully inherited from its parent at runtime. In addition to
   * normally inherited aspects such as inputs and queries, full inheritance applies to every aspect
   * of the component or directive, such as the template function itself.
   *
   * 表明此装饰器在运行时从其父级完全继承。除了通常继承的方面（例如输入和查询）之外，完全继承还适用于组件或指令的每个方面，例如模板函数本身。
   *
   * Its primary effect is to cause the `CopyDefinitionFeature` to be applied to the definition
   * being compiled. See that class for more information.
   *
   * 其主要效果是使 `CopyDefinitionFeature` 应用于正在编译的定义。有关更多信息，请参阅该类。
   *
   */
  FULL_INHERITANCE = 0x00000001,
}


/**
 * Provides the interface between a decorator compiler from @angular/compiler and the Typescript
 * compiler/transform.
 *
 * 提供来自 @angular/compiler 的装饰器编译器与 Typescript 编译器/转换之间的接口。
 *
 * The decorator compilers in @angular/compiler do not depend on Typescript. The handler is
 * responsible for extracting the information required to perform compilation from the decorators
 * and Typescript source, invoking the decorator compiler, and returning the result.
 *
 * @param `D` The type of decorator metadata produced by `detect`.
 * @param `A` The type of analysis metadata produced by `analyze`.
 * @param `R` The type of resolution metadata produced by `resolve`.
 */
export interface DecoratorHandler<D, A, S extends SemanticSymbol|null, R> {
  readonly name: string;

  /**
   * The precedence of a handler controls how it interacts with other handlers that match the same
   * class.
   *
   * 处理程序的优先级控制着它与匹配同一个类的其他处理程序的交互方式。
   *
   * See the descriptions on `HandlerPrecedence` for an explanation of the behaviors involved.
   *
   * 有关所涉及行为的解释，请参阅 `HandlerPrecedence` 上的描述。
   *
   */
  readonly precedence: HandlerPrecedence;

  /**
   * Scan a set of reflected decorators and determine if this handler is responsible for compilation
   * of one of them.
   *
   * 扫描一组反射装饰器并确定此处理程序是否负责编译它们中的一个。
   *
   */
  detect(node: ClassDeclaration, decorators: Decorator[]|null): DetectResult<D>|undefined;


  /**
   * Asynchronously perform pre-analysis on the decorator/class combination.
   *
   * 对装饰器/类组合异步执行预分析。
   *
   * `preanalyze` is optional and is not guaranteed to be called through all compilation flows. It
   * will only be called if asynchronicity is supported in the CompilerHost.
   *
   * `preanalyze` 是可选的，不保证会通过所有编译流来调用。只有在 CompilerHost 支持异步时才会调用它。
   *
   */
  preanalyze?(node: ClassDeclaration, metadata: Readonly<D>): Promise<void>|undefined;

  /**
   * Perform analysis on the decorator/class combination, extracting information from the class
   * required for compilation.
   *
   * 对装饰器/类组合执行分析，从编译所需的类中提取信息。
   *
   * Returns analyzed metadata if successful, or an array of diagnostic messages if the analysis
   * fails or the decorator isn't valid.
   *
   * 如果成功，则返回分析的元数据，如果分析失败或装饰器无效，则返回诊断消息数组。
   *
   * Analysis should always be a "pure" operation, with no side effects. This is because the
   * detect/analysis steps might be skipped for files which have not changed during incremental
   * builds. Any side effects required for compilation (e.g. registration of metadata) should happen
   * in the `register` phase, which is guaranteed to run even for incremental builds.
   *
   * 分析应该始终是“纯”操作，没有副作用。这是因为对于增量构建期间未更改的文件，可能会跳过检测/分析步骤。编译所需的任何副作用（例如元数据的注册）都应该发生在
   * `register` 阶段，即使对于增量构建也可以保证运行。
   *
   */
  analyze(node: ClassDeclaration, metadata: Readonly<D>, handlerFlags?: HandlerFlags):
      AnalysisOutput<A>;

  /**
   * React to a change in a resource file by updating the `analysis` or `resolution`, under the
   * assumption that nothing in the TypeScript code has changed.
   *
   * 在 TypeScript 代码中没有任何更改的假设下，通过更新 `analysis` 或 `resolution`
   * 来响应资源文件中的更改。
   *
   */
  updateResources?(node: ClassDeclaration, analysis: A, resolution: R): void;

  /**
   * Produces a `SemanticSymbol` that represents the class, which is registered into the semantic
   * dependency graph. The symbol is used in incremental compilations to let the compiler determine
   * how a change to the class affects prior emit results. See the `incremental` target's README for
   * details on how this works.
   *
   * 生成一个表示类的 `SemanticSymbol`
   * ，该类已注册到语义依赖图中。该符号用于增量编译，以让编译器确定对类的更改如何影响之前的发出结果。有关其工作原理的详细信息，请参阅
   * `incremental` 目标的 README。
   *
   * The symbol is passed in to `resolve`, where it can be extended with references into other parts
   * of the compilation as needed.
   *
   * 该符号会传入到 `resolve` ，在那里可以根据需要使用对编译的其他部分的引用来扩展它。
   *
   * Only primary handlers are allowed to have symbols; handlers with `precedence` other than
   * `HandlerPrecedence.PRIMARY` must return a `null` symbol.
   *
   * 只有主要处理程序可以有符号； `precedence` 不是 `HandlerPrecedence.PRIMARY` 的处理程序必须返回
   * `null` 符号。
   *
   */
  symbol(node: ClassDeclaration, analysis: Readonly<A>): S;

  /**
   * Post-process the analysis of a decorator/class combination and record any necessary information
   * in the larger compilation.
   *
   * 后处理对装饰器/类组合的分析，并在较大的编译中记录任何必要的信息。
   *
   * Registration always occurs for a given decorator/class, regardless of whether analysis was
   * performed directly or whether the analysis results were reused from the previous program.
   *
   * 注册始终针对给定的装饰器/类发生，无论是直接执行分析还是分析结果是从以前的程序中重用的。
   *
   */
  register?(node: ClassDeclaration, analysis: A): void;

  /**
   * Registers information about the decorator for the indexing phase in a
   * `IndexingContext`, which stores information about components discovered in the
   * program.
   *
   * 在 `IndexingContext` 中注册有关索引阶段的装饰器的信息，它存储有关程序中找到的组件的信息。
   *
   */
  index?
      (context: IndexingContext, node: ClassDeclaration, analysis: Readonly<A>,
       resolution: Readonly<R>): void;

  /**
   * Perform resolution on the given decorator along with the result of analysis.
   *
   * 对给定的装饰器以及分析结果执行解析。
   *
   * The resolution phase happens after the entire `ts.Program` has been analyzed, and gives the
   * `DecoratorHandler` a chance to leverage information from the whole compilation unit to enhance
   * the `analysis` before the emit phase.
   *
   * 解析阶段发生在整个 `ts.Program` 被分析之后，并让 `DecoratorHandler`
   * 有机会利用整个编译单元中的信息来增强发出阶段之前的 `analysis` 。
   *
   */
  resolve?(node: ClassDeclaration, analysis: Readonly<A>, symbol: S): ResolveResult<R>;

  /**
   * Extract i18n messages into the `Xi18nContext`, which is useful for generating various formats
   * of message file outputs.
   *
   * 将 i18n 消息提取到 `Xi18nContext` 中，这可用于生成各种格式的消息文件输出。
   *
   */
  xi18n?(bundle: Xi18nContext, node: ClassDeclaration, analysis: Readonly<A>): void;

  typeCheck?
      (ctx: TypeCheckContext, node: ClassDeclaration, analysis: Readonly<A>,
       resolution: Readonly<R>): void;

  extendedTemplateCheck?
      (component: ts.ClassDeclaration, extendedTemplateChecker: ExtendedTemplateChecker):
          ts.Diagnostic[];

  /**
   * Generate a description of the field which should be added to the class, including any
   * initialization code to be generated.
   *
   * 生成应该添加到类的字段的描述，包括要生成的任何初始化代码。
   *
   * If the compilation mode is configured as partial, and an implementation of `compilePartial` is
   * provided, then this method is not called.
   *
   * 如果编译模式配置为部分编译，并且提供了 `compilePartial` 的实现，则不会调用此方法。
   *
   */
  compileFull(
      node: ClassDeclaration, analysis: Readonly<A>, resolution: Readonly<R>,
      constantPool: ConstantPool): CompileResult|CompileResult[];

  /**
   * Generates code for the decorator using a stable, but intermediate format suitable to be
   * published to NPM. This code is meant to be processed by the linker to achieve the final AOT
   * compiled code.
   *
   * 使用适合发布到 NPM 的稳定但中间格式为装饰器生成代码。此代码旨在由链接器处理以实现最终的 AOT
   * 编译代码。
   *
   * If present, this method is used if the compilation mode is configured as partial, otherwise
   * `compileFull` is.
   *
   * 如果存在，如果编译模式配置为部分，则使用此方法，否则 `compileFull` 。
   *
   */
  compilePartial?
      (node: ClassDeclaration, analysis: Readonly<A>, resolution: Readonly<R>): CompileResult
      |CompileResult[];
}

/**
 * The output of detecting a trait for a declaration as the result of the first phase of the
 * compilation pipeline.
 *
 * 作为编译管道第一阶段的结果，检测声明的特性的输出。
 *
 */
export interface DetectResult<M> {
  /**
   * The node that triggered the match, which is typically a decorator.
   *
   * 触发匹配的节点，通常是装饰器。
   *
   */
  trigger: ts.Node|null;

  /**
   * Refers to the decorator that was recognized for this detection, if any. This can be a concrete
   * decorator that is actually present in a file, or a synthetic decorator as inserted
   * programmatically.
   *
   * 指为此检测而识别的装饰器（如果有）。这可以是实际存在于文件中的具体装饰器，也可以是以编程方式插入的合成装饰器。
   *
   */
  decorator: Decorator|null;

  /**
   * An arbitrary object to carry over from the detection phase into the analysis phase.
   *
   * 从检测阶段延续到分析阶段的任意对象。
   *
   */
  metadata: Readonly<M>;
}

/**
 * The output of an analysis operation, consisting of possibly an arbitrary analysis object (used as
 * the input to code generation) and potentially diagnostics if there were errors uncovered during
 * analysis.
 *
 * 分析操作的输出，可能由一个任意分析对象（用作代码生成的输入）组成，如果分析期间发现了错误，则可能是诊断信息。
 *
 */
export interface AnalysisOutput<A> {
  analysis?: Readonly<A>;
  diagnostics?: ts.Diagnostic[];
}

/**
 * A description of the static field to add to a class, including an initialization expression
 * and a type for the .d.ts file.
 *
 * 要添加到类的静态字段的描述，包括初始化表达式和 .d.ts 文件的类型。
 *
 */
export interface CompileResult {
  name: string;
  initializer: Expression;
  statements: Statement[];
  type: Type;
}

export interface ResolveResult<R> {
  reexports?: Reexport[];
  diagnostics?: ts.Diagnostic[];
  data?: Readonly<R>;
}

export interface DtsTransform {
  transformClassElement?(element: ts.ClassElement, imports: ImportManager): ts.ClassElement;
  transformFunctionDeclaration?
      (element: ts.FunctionDeclaration, imports: ImportManager): ts.FunctionDeclaration;
  transformClass?
      (clazz: ts.ClassDeclaration, elements: ReadonlyArray<ts.ClassElement>,
       imports: ImportManager): ts.ClassDeclaration;
}
