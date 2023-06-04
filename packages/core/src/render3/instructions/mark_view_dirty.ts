/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {isRootView} from '../interfaces/type_checks';
import {FLAGS, LView, LViewFlags} from '../interfaces/view';
import {getLViewParent} from '../util/view_traversal_utils';

/**
 * Marks current view and all ancestors dirty.
 *
 * 将当前视图和所有祖先标记为脏。
 *
 * Returns the root view because it is found as a byproduct of marking the view tree
 * dirty, and can be used by methods that consume markViewDirty\(\) to easily schedule
 * change detection. Otherwise, such methods would need to traverse up the view tree
 * an additional time to get the root view and schedule a tick on it.
 *
 * 返回根视图，因为它被发现是将视图树标记为脏的副产品，并且可以由使用 markViewDirty\(\) 的方法使用以轻松安排变更检测。否则，此类方法将需要额外遍历视图树以获取根视图并在其上安排一个 tick。
 *
 * @param lView The starting LView to mark dirty
 *
 * 标记为脏的起始 LView
 *
 * @returns
 *
 * the root LView
 *
 * 根 LView
 *
 */
export function markViewDirty(lView: LView): LView|null {
  while (lView) {
    lView[FLAGS] |= LViewFlags.Dirty;
    const parent = getLViewParent(lView);
    // Stop traversing up as soon as you find a root view that wasn't attached to any container
    if (isRootView(lView) && !parent) {
      return lView;
    }
    // continue otherwise
    lView = parent!;
  }
  return null;
}
