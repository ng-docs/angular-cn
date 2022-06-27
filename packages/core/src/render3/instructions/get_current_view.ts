/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {OpaqueViewState} from '../interfaces/view';
import {getLView} from '../state';

/**
 * Returns the current OpaqueViewState instance.
 *
 * 返回当前的 OpaqueViewState 实例。
 *
 * Used in conjunction with the restoreView() instruction to save a snapshot
 * of the current view and restore it when listeners are invoked. This allows
 * walking the declaration view tree in listeners to get vars from parent views.
 *
 * 与 restoreView()
 * 指令结合使用，以保存当前视图的快照并在调用侦听器时恢复它。这允许在侦听器中遍历声明视图树以从父视图获取
 * var。
 *
 * @codeGenApi
 */
export function ɵɵgetCurrentView(): OpaqueViewState {
  return getLView() as any as OpaqueViewState;
}
