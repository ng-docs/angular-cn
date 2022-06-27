/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {IncrementalState} from './state';

/**
 * Strategy used to manage the association between a `ts.Program` and the `IncrementalDriver` which
 * represents the reusable Angular part of its compilation.
 *
 * 用于管理 `ts.Program` 和 `IncrementalDriver` 之间关联的策略，IncrementalDriver 表示其编译的可重用
 * Angular 部分。
 *
 */
export interface IncrementalBuildStrategy {
  /**
   * Determine the Angular `IncrementalDriver` for the given `ts.Program`, if one is available.
   *
   * 确定给定 `ts.Program` 的 Angular `IncrementalDriver` （如果有）。
   *
   */
  getIncrementalState(program: ts.Program): IncrementalState|null;

  /**
   * Associate the given `IncrementalDriver` with the given `ts.Program` and make it available to
   * future compilations.
   *
   * 将给定的 `IncrementalDriver` 与给定的 `ts.Program` ，并使其可用于将来的编译。
   *
   */
  setIncrementalState(driver: IncrementalState, program: ts.Program): void;

  /**
   * Convert this `IncrementalBuildStrategy` into a possibly new instance to be used in the next
   * incremental compilation (may be a no-op if the strategy is not stateful).
   *
   * 将此 `IncrementalBuildStrategy`
   * 转换为要在下一次增量编译中使用的可能新实例（如果策略是无状态的，可能是无操作）。
   *
   */
  toNextBuildStrategy(): IncrementalBuildStrategy;
}

/**
 * A noop implementation of `IncrementalBuildStrategy` which neither returns nor tracks any
 * incremental data.
 *
 * `IncrementalBuildStrategy` 的 noop 实现，它既不返回也不跟踪任何增量数据。
 *
 */
export class NoopIncrementalBuildStrategy implements IncrementalBuildStrategy {
  getIncrementalState(): null {
    return null;
  }

  setIncrementalState(): void {}

  toNextBuildStrategy(): IncrementalBuildStrategy {
    return this;
  }
}

/**
 * Tracks an `IncrementalDriver` within the strategy itself.
 *
 * 跟踪策略本身中的 `IncrementalDriver` 。
 *
 */
export class TrackedIncrementalBuildStrategy implements IncrementalBuildStrategy {
  private state: IncrementalState|null = null;
  private isSet: boolean = false;

  getIncrementalState(): IncrementalState|null {
    return this.state;
  }

  setIncrementalState(state: IncrementalState): void {
    this.state = state;
    this.isSet = true;
  }

  toNextBuildStrategy(): TrackedIncrementalBuildStrategy {
    const strategy = new TrackedIncrementalBuildStrategy();
    // Only reuse state that was explicitly set via `setIncrementalState`.
    strategy.state = this.isSet ? this.state : null;
    return strategy;
  }
}

/**
 * Manages the `IncrementalDriver` associated with a `ts.Program` by monkey-patching it onto the
 * program under `SYM_INCREMENTAL_DRIVER`.
 *
 * 管理与 `ts.Program` 关联的 `IncrementalDriver` ，方法是通过将其添加到 `SYM_INCREMENTAL_DRIVER`
 * 下的程序上的猴子补丁来管理。
 *
 */
export class PatchedProgramIncrementalBuildStrategy implements IncrementalBuildStrategy {
  getIncrementalState(program: ts.Program): IncrementalState|null {
    const state = (program as MayHaveIncrementalState)[SYM_INCREMENTAL_STATE];
    if (state === undefined) {
      return null;
    }
    return state;
  }

  setIncrementalState(state: IncrementalState, program: ts.Program): void {
    (program as MayHaveIncrementalState)[SYM_INCREMENTAL_STATE] = state;
  }

  toNextBuildStrategy(): IncrementalBuildStrategy {
    return this;
  }
}


/**
 * Symbol under which the `IncrementalDriver` is stored on a `ts.Program`.
 *
 * 在 `ts.Program` 上存储 `IncrementalDriver` 的符号。
 *
 * The TS model of incremental compilation is based around reuse of a previous `ts.Program` in the
 * construction of a new one. The `NgCompiler` follows this abstraction - passing in a previous
 * `ts.Program` is sufficient to trigger incremental compilation. This previous `ts.Program` need
 * not be from an Angular compilation (that is, it need not have been created from `NgCompiler`).
 *
 * 增量编译的 TS 模型是基于在构建新的 `ts.Program` 中重用以前的 ts.Program 。 `NgCompiler`
 * 遵循这种抽象 - 传入以前的 `ts.Program` 足以触发增量编译。以前的 `ts.Program` 无需来自 Angular
 * 编译（即，它无需是从 `NgCompiler` 创建的）。
 *
 * If it is, though, Angular can benefit from reusing previous analysis work. This reuse is managed
 * by the `IncrementalDriver`, which is inherited from the old program to the new program. To
 * support this behind the API of passing an old `ts.Program`, the `IncrementalDriver` is stored on
 * the `ts.Program` under this symbol.
 *
 * 不过，如果是这样，Angular 可以从重用以前的分析工作中受益。这种重用由 `IncrementalDriver`
 * 管理，它是从旧程序继承到新程序的。为了在传递旧 `ts.Program` 的 API 后面支持这一点，
 * `IncrementalDriver` 存储在此符号下的 `ts.Program` 中。
 *
 */
const SYM_INCREMENTAL_STATE = Symbol('NgIncrementalState');

interface MayHaveIncrementalState {
  [SYM_INCREMENTAL_STATE]?: IncrementalState;
}
