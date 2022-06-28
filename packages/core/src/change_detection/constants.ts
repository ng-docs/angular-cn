/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * The strategy that the default change detector uses to detect changes.
 * When set, takes effect the next time change detection is triggered.
 *
 * 默认变更检测器用来检测更改的策略。设置后，将在下次触发变更检测时生效。
 *
 * @see {@link ChangeDetectorRef#usage-notes Change detection usage}
 *
 * {@link ChangeDetectorRef#usage-notes 变更检测的用法}
 *
 * @publicApi
 */
export enum ChangeDetectionStrategy {
  /**
   * Use the `CheckOnce` strategy, meaning that automatic change detection is deactivated
   * until reactivated by setting the strategy to `Default` (`CheckAlways`).
   * Change detection can still be explicitly invoked.
   * This strategy applies to all child directives and cannot be overridden.
   *
   * 使用 `CheckOnce` 策略，这意味着把此策略设置为 `Default`（`CheckAlways`
   *）将禁用自动变更检测，直到重新激活。变更检测仍然可以显式调用。此策略适用于所有子指令，并且不能被覆盖。
   *
   */
  OnPush = 0,

  /**
   * Use the default `CheckAlways` strategy, in which change detection is automatic until
   * explicitly deactivated.
   *
   * 使用默认的 `CheckAlways` 策略，在该策略中，变更检测将自动执行，直到显式停用为止。
   *
   */
  Default = 1,
}

/**
 * Defines the possible states of the default change detector.
 *
 * 定义默认变更检测器的可能状态。
 *
 * @see `ChangeDetectorRef`
 */
export enum ChangeDetectorStatus {
  /**
   * A state in which, after calling `detectChanges()`, the change detector
   * state becomes `Checked`, and must be explicitly invoked or reactivated.
   *
   * 一种状态，在调用 `detectChanges()` 之后，变更检测器状态变为 `Checked`
   * ，并且必须显式调用或重新激活。
   *
   */
  CheckOnce,

  /**
   * A state in which change detection is skipped until the change detector mode
   * becomes `CheckOnce`.
   *
   * 在变更检测器模式变为 `CheckOnce` 之前跳过变更检测的状态。
   *
   */
  Checked,

  /**
   * A state in which change detection continues automatically until explicitly
   * deactivated.
   *
   * 变更检测会自动继续直到显式禁用的状态。
   *
   */
  CheckAlways,

  /**
   * A state in which a change detector sub tree is not a part of the main tree and
   * should be skipped.
   *
   * 变更检测器子树不是主树的一部分，应该被跳过的状态。
   *
   */
  Detached,

  /**
   * Indicates that the change detector encountered an error checking a binding
   * or calling a directive lifecycle method and is now in an inconsistent state. Change
   * detectors in this state do not detect changes.
   *
   * 表明变更检测器在检查绑定或调用指令生命周期方法时遇到错误，现在处于不一致的状态。在此状态下的变更检测器不会检测到更改。
   *
   */
  Errored,

  /**
   * Indicates that the change detector has been destroyed.
   *
   * 表明变更检测器已被销毁。
   *
   */
  Destroyed,
}

/**
 * Reports whether a given strategy is currently the default for change detection.
 *
 * 报告给定策略当前是否是变更检测的默认策略。
 *
 * @param changeDetectionStrategy The strategy to check.
 *
 * 要检查的策略。
 *
 * @returns
 *
 * True if the given strategy is the current default, false otherwise.
 *
 * 如果给定的策略是当前的默认值，则为 true ，否则为 false 。
 *
 * @see `ChangeDetectorStatus`
 * @see `ChangeDetectorRef`
 */
export function isDefaultChangeDetectionStrategy(changeDetectionStrategy: ChangeDetectionStrategy):
    boolean {
  return changeDetectionStrategy == null ||
      changeDetectionStrategy === ChangeDetectionStrategy.Default;
}
