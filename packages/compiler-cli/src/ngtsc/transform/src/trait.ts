/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {SemanticSymbol} from '../../incremental/semantic_graph';

import {DecoratorHandler, DetectResult} from './api';

export enum TraitState {
  /**
   * Pending traits are freshly created and have never been analyzed.
   *
   * 待处理的特性是新创建的，从未被分析过。
   *
   */
  Pending,

  /**
   * Analyzed traits have successfully been analyzed, but are pending resolution.
   *
   * 分析的特性已成功分析，但有待解决。
   *
   */
  Analyzed,

  /**
   * Resolved traits have successfully been analyzed and resolved and are ready for compilation.
   *
   * 解析的特性已被成功分析和解析，可以编译了。
   *
   */
  Resolved,

  /**
   * Skipped traits are no longer considered for compilation.
   *
   * 不再考虑编译跳过的特性。
   *
   */
  Skipped,
}

/**
 * An Ivy aspect added to a class (for example, the compilation of a component definition).
 *
 * 添加到类的 Ivy 切面（例如，组件定义的编译）。
 *
 * Traits are created when a `DecoratorHandler` matches a class. Each trait begins in a pending
 * state and undergoes transitions as compilation proceeds through the various steps.
 *
 * 当 `DecoratorHandler`
 * 与类匹配时，会创建特性。每个特性都以挂起状态开始，并随着编译通过各个步骤的进行而经历转换。
 *
 * In practice, traits are instances of the private class `TraitImpl` declared below. Through the
 * various interfaces included in this union type, the legal API of a trait in any given state is
 * represented in the type system. This includes any possible transitions from one type to the next.
 *
 * 在实践中，特征是在下面声明的私有类 `TraitImpl`
 * 的实例。通过此联合类型中包含的各种接口，任何给定状态的特性的合法 API
 * 都在类型系统中表示。这包括从一种类型到另一种类型的任何可能的转换。
 *
 * This not only simplifies the implementation, but ensures traits are monomorphic objects as
 * they're all just "views" in the type system of the same object (which never changes shape).
 *
 * 这不仅简化了实现，还确保了 trait
 * 是单态对象，因为它们都是同一个对象类型系统中的“视图”（它永远不会改变形状）。
 *
 */
export type Trait<D, A, S extends SemanticSymbol|null, R> = PendingTrait<D, A, S, R>|
    SkippedTrait<D, A, S, R>|AnalyzedTrait<D, A, S, R>|ResolvedTrait<D, A, S, R>;

/**
 * The value side of `Trait` exposes a helper to create a `Trait` in a pending state (by delegating
 * to `TraitImpl`).
 *
 * `Trait` 的值侧公开了一个帮助器，以创建处于挂起状态的 `Trait`（通过委托给 `TraitImpl`）。
 *
 */
export const Trait = {
  pending: <D, A, S extends SemanticSymbol|null, R>(
      handler: DecoratorHandler<D, A, S, R>, detected: DetectResult<D>): PendingTrait<D, A, S, R> =>
      TraitImpl.pending(handler, detected),
};

/**
 * The part of the `Trait` interface that's common to all trait states.
 *
 * `Trait` 接口中对所有 trait 状态通用的部分。
 *
 */
export interface TraitBase<D, A, S extends SemanticSymbol|null, R> {
  /**
   * Current state of the trait.
   *
   * 特性的当前状态。
   *
   * This will be narrowed in the interfaces for each specific state.
   *
   * 这将在每个特定状态的接口中缩小。
   *
   */
  state: TraitState;

  /**
   * The `DecoratorHandler` which matched on the class to create this trait.
   *
   * 在类上匹配以创建此 trait 的 `DecoratorHandler` 。
   *
   */
  handler: DecoratorHandler<D, A, S, R>;

  /**
   * The detection result (of `handler.detect`) which indicated that this trait applied to the
   * class.
   *
   *（`handler.detect` 的）检测结果，表明此特性适用于类。
   *
   * This is mainly used to cache the detection between pre-analysis and analysis.
   *
   * 这主要用于缓存预分析和分析之间的检测。
   *
   */
  detected: DetectResult<D>;
}

/**
 * A trait in the pending state.
 *
 * 处于挂起状态的特性。
 *
 * Pending traits have yet to be analyzed in any way.
 *
 * 待定特性尚未以任何方式分析。
 *
 */
export interface PendingTrait<D, A, S extends SemanticSymbol|null, R> extends
    TraitBase<D, A, S, R> {
  state: TraitState.Pending;

  /**
   * This pending trait has been successfully analyzed, and should transition to the "analyzed"
   * state.
   *
   * 此待处理的特性已被成功分析，应该转换到“已分析”状态。
   *
   */
  toAnalyzed(analysis: A|null, diagnostics: ts.Diagnostic[]|null, symbol: S):
      AnalyzedTrait<D, A, S, R>;

  /**
   * During analysis it was determined that this trait is not eligible for compilation after all,
   * and should be transitioned to the "skipped" state.
   *
   * 在分析过程中，确定此特性根本不符合编译条件，应该转换到“跳过”状态。
   *
   */
  toSkipped(): SkippedTrait<D, A, S, R>;
}

/**
 * A trait in the "skipped" state.
 *
 * 处于“跳过”状态的特性。
 *
 * Skipped traits aren't considered for compilation.
 *
 * 跳过的特性不会被考虑进行编译。
 *
 * This is a terminal state.
 *
 * 这是一个终端状态。
 *
 */
export interface SkippedTrait<D, A, S extends SemanticSymbol|null, R> extends
    TraitBase<D, A, S, R> {
  state: TraitState.Skipped;
}

/**
 * A trait in the "analyzed" state.
 *
 * 处于“已分析”状态的特性。
 *
 * Analyzed traits have analysis results available, and are eligible for resolution.
 *
 * 分析的性状有可用的分析结果，并且有资格进行解析。
 *
 */
export interface AnalyzedTrait<D, A, S extends SemanticSymbol|null, R> extends
    TraitBase<D, A, S, R> {
  state: TraitState.Analyzed;
  symbol: S;

  /**
   * Analysis results of the given trait (if able to be produced), or `null` if analysis failed
   * completely.
   *
   * 给定性状的分析结果（如果能够生成），如果分析完全失败，则为 `null` 。
   *
   */
  analysis: Readonly<A>|null;

  /**
   * Any diagnostics that resulted from analysis, or `null` if none.
   *
   * 从分析产生的任何诊断，如果没有，则为 `null` 。
   *
   */
  analysisDiagnostics: ts.Diagnostic[]|null;

  /**
   * This analyzed trait has been successfully resolved, and should be transitioned to the
   * "resolved" state.
   *
   * 此分析的特性已成功解析，应该转换到“已解决”状态。
   *
   */
  toResolved(resolution: R|null, diagnostics: ts.Diagnostic[]|null): ResolvedTrait<D, A, S, R>;
}

/**
 * A trait in the "resolved" state.
 *
 * 处于“已解决”状态的特性。
 *
 * Resolved traits have been successfully analyzed and resolved, contain no errors, and are ready
 * for the compilation phase.
 *
 * Resolved trait 已被成功分析和解析，不包含错误，并已为编译阶段做好准备。
 *
 * This is a terminal state.
 *
 * 这是一个终端状态。
 *
 */
export interface ResolvedTrait<D, A, S extends SemanticSymbol|null, R> extends
    TraitBase<D, A, S, R> {
  state: TraitState.Resolved;
  symbol: S;

  /**
   * Resolved traits must have produced valid analysis results.
   *
   * 已解析的性状必须产生有效的分析结果。
   *
   */
  analysis: Readonly<A>;

  /**
   * Analysis may have still resulted in diagnostics.
   *
   * 分析可能仍会产生诊断。
   *
   */
  analysisDiagnostics: ts.Diagnostic[]|null;

  /**
   * Diagnostics resulting from resolution are tracked separately from
   *
   * 由解决方案产生的诊断会与
   *
   */
  resolveDiagnostics: ts.Diagnostic[]|null;

  /**
   * The results returned by a successful resolution of the given class/`DecoratorHandler`
   * combination.
   *
   * 成功解析给定的 class/ `DecoratorHandler` 组合所返回的结果。
   *
   */
  resolution: Readonly<R>|null;
}

/**
 * An implementation of the `Trait` type which transitions safely between the various
 * `TraitState`s.
 *
 * `Trait` 类型的实现，可以在各种 `TraitState` 之间安全地转换。
 *
 */
class TraitImpl<D, A, S extends SemanticSymbol|null, R> {
  state: TraitState = TraitState.Pending;
  handler: DecoratorHandler<D, A, S, R>;
  detected: DetectResult<D>;
  analysis: Readonly<A>|null = null;
  symbol: S|null = null;
  resolution: Readonly<R>|null = null;
  analysisDiagnostics: ts.Diagnostic[]|null = null;
  resolveDiagnostics: ts.Diagnostic[]|null = null;

  constructor(handler: DecoratorHandler<D, A, S, R>, detected: DetectResult<D>) {
    this.handler = handler;
    this.detected = detected;
  }

  toAnalyzed(analysis: A|null, diagnostics: ts.Diagnostic[]|null, symbol: S):
      AnalyzedTrait<D, A, S, R> {
    // Only pending traits can be analyzed.
    this.assertTransitionLegal(TraitState.Pending, TraitState.Analyzed);
    this.analysis = analysis;
    this.analysisDiagnostics = diagnostics;
    this.symbol = symbol;
    this.state = TraitState.Analyzed;
    return this as AnalyzedTrait<D, A, S, R>;
  }

  toResolved(resolution: R|null, diagnostics: ts.Diagnostic[]|null): ResolvedTrait<D, A, S, R> {
    // Only analyzed traits can be resolved.
    this.assertTransitionLegal(TraitState.Analyzed, TraitState.Resolved);
    if (this.analysis === null) {
      throw new Error(`Cannot transition an Analyzed trait with a null analysis to Resolved`);
    }
    this.resolution = resolution;
    this.state = TraitState.Resolved;
    this.resolveDiagnostics = diagnostics;
    return this as ResolvedTrait<D, A, S, R>;
  }

  toSkipped(): SkippedTrait<D, A, S, R> {
    // Only pending traits can be skipped.
    this.assertTransitionLegal(TraitState.Pending, TraitState.Skipped);
    this.state = TraitState.Skipped;
    return this as SkippedTrait<D, A, S, R>;
  }

  /**
   * Verifies that the trait is currently in one of the `allowedState`s.
   *
   * 验证特性当前是否处于 `allowedState` 之一。
   *
   * If correctly used, the `Trait` type and transition methods prevent illegal transitions from
   * occurring. However, if a reference to the `TraitImpl` instance typed with the previous
   * interface is retained after calling one of its transition methods, it will allow for illegal
   * transitions to take place. Hence, this assertion provides a little extra runtime protection.
   *
   * 如果使用正确，`Trait`
   * 类型和转换方法可以防止发生非法转换。但是，如果在调用其转换方法之一之后保留对使用前一个接口键入的
   * `TraitImpl` 实例的引用，它将允许发生非法转换。因此，此断言提供了一些额外的运行时保护。
   *
   */
  private assertTransitionLegal(allowedState: TraitState, transitionTo: TraitState): void {
    if (!(this.state === allowedState)) {
      throw new Error(`Assertion failure: cannot transition from ${TraitState[this.state]} to ${
          TraitState[transitionTo]}.`);
    }
  }

  /**
   * Construct a new `TraitImpl` in the pending state.
   *
   * 构造一个处于挂起状态的新 `TraitImpl` 。
   *
   */
  static pending<D, A, S extends SemanticSymbol|null, R>(
      handler: DecoratorHandler<D, A, S, R>, detected: DetectResult<D>): PendingTrait<D, A, S, R> {
    return new TraitImpl(handler, detected) as PendingTrait<D, A, S, R>;
  }
}
