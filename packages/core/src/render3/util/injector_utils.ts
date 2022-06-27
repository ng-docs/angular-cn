/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertGreaterThan, assertNotEqual, assertNumber} from '../../util/assert';
import {NO_PARENT_INJECTOR, RelativeInjectorLocation, RelativeInjectorLocationFlags} from '../interfaces/injector';
import {DECLARATION_VIEW, HEADER_OFFSET, LView} from '../interfaces/view';


/// Parent Injector Utils ///////////////////////////////////////////////////////////////
export function hasParentInjector(parentLocation: RelativeInjectorLocation): boolean {
  return parentLocation !== NO_PARENT_INJECTOR;
}

export function getParentInjectorIndex(parentLocation: RelativeInjectorLocation): number {
  ngDevMode && assertNumber(parentLocation, 'Number expected');
  ngDevMode && assertNotEqual(parentLocation as any, -1, 'Not a valid state.');
  const parentInjectorIndex =
      (parentLocation as any as number) & RelativeInjectorLocationFlags.InjectorIndexMask;
  ngDevMode &&
      assertGreaterThan(
          parentInjectorIndex, HEADER_OFFSET,
          'Parent injector must be pointing past HEADER_OFFSET.');
  return (parentLocation as any as number) & RelativeInjectorLocationFlags.InjectorIndexMask;
}

export function getParentInjectorViewOffset(parentLocation: RelativeInjectorLocation): number {
  return (parentLocation as any as number) >> RelativeInjectorLocationFlags.ViewOffsetShift;
}

/**
 * Unwraps a parent injector location number to find the view offset from the current injector,
 * then walks up the declaration view tree until the view is found that contains the parent
 * injector.
 *
 * 展开父注入器位置号以查找距当前注入器的视图偏移量，然后沿着声明视图树走，直到找到包含父注入器的视图。
 *
 * @param location The location of the parent injector, which contains the view offset
 *
 * 父注入器的位置，包含视图偏移
 *
 * @param startView The LView instance from which to start walking up the view tree
 *
 * 要开始沿着视图树向上走的 LView 实例
 *
 * @returns
 *
 * The LView instance that contains the parent injector
 *
 * 包含父注入器的 LView 实例
 *
 */
export function getParentInjectorView(location: RelativeInjectorLocation, startView: LView): LView {
  let viewOffset = getParentInjectorViewOffset(location);
  let parentView = startView;
  // For most cases, the parent injector can be found on the host node (e.g. for component
  // or container), but we must keep the loop here to support the rarer case of deeply nested
  // <ng-template> tags or inline views, where the parent injector might live many views
  // above the child injector.
  while (viewOffset > 0) {
    parentView = parentView[DECLARATION_VIEW]!;
    viewOffset--;
  }
  return parentView;
}
