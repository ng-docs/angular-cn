/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TI18n, TIcu} from '@angular/core/src/render3/interfaces/i18n';
import {TNode} from '@angular/core/src/render3/interfaces/node';
import {TView} from '@angular/core/src/render3/interfaces/view';

/**
 * A type used to create a runtime representation of a shape of object which matches the declared
 * interface at compile time.
 *
 * 一种用于创建与编译时声明的接口匹配的对象形状的运行时表示的类型。
 *
 * The purpose of this type is to ensure that the object must match all of the properties of a type.
 * This is later used by `isShapeOf` method to ensure that a particular object has a particular
 * shape.
 *
 * 这种类型的目的是确保对象必须匹配一种类型的所有属性。 `isShapeOf`
 * 方法后来用它来确保特定对象具有特定的形状。
 *
 * ```
 * interface MyShape {
 *   foo: string,
 *   bar: number
 * }
 *
 * const myShapeObj: {foo: '', bar: 0};
 * const ExpectedPropertiesOfShape = {foo: true, bar: true};
 *
 * isShapeOf(myShapeObj, ExpectedPropertiesOfShape);
 * ```
 *
 * The above code would verify that `myShapeObj` has `foo` and `bar` properties. However if later
 * `MyShape` is refactored to change a set of properties we would like to have a compile time error
 * that the `ExpectedPropertiesOfShape` also needs to be changed.
 *
 * 上面的代码将验证 `myShapeObj` 是否具有 `foo` 和 `bar` 属性。但是，如果后来 `MyShape`
 * 被重构以更改一组属性，我们希望有一个编译时错误，即 `ExpectedPropertiesOfShape` 也需要更改。
 *
 * ```
 * const ExpectedPropertiesOfShape = <ShapeOf<MyShape>>{foo: true, bar: true};
 * ```
 *
 * The above code will force through compile time checks that the `ExpectedPropertiesOfShape` match
 * that of `MyShape`.
 *
 * 上面的代码将强制通过编译时检查 `ExpectedPropertiesOfShape` 是否与 `MyShape` 匹配。
 *
 * See: `isShapeOf`
 *
 * 请参阅： `isShapeOf`
 *
 */
export type ShapeOf<T> = {
  [P in keyof T]: true;
};

/**
 * Determines if a particular object is of a given shape (duck-type version of `instanceof`.)
 *
 * 确定特定对象是否具有给定的形状（`instanceof` 的鸭型版本。）
 *
 * ```
 * isShapeOf(someObj, {foo: true, bar: true});
 * ```
 *
 * The above code will be true if the `someObj` has both `foo` and `bar` property
 *
 * 如果 `someObj` 同时具有 `foo` 和 `bar` 属性，则上面的代码将成立
 *
 * @param obj Object to test for.
 *
 * 要测试的对象。
 *
 * @param shapeOf Desired shape.
 *
 * 所需的形状。
 *
 */
export function isShapeOf<T>(obj: any, shapeOf: ShapeOf<T>): obj is T {
  if (typeof obj === 'object' && obj) {
    return Object.keys(shapeOf).reduce(
        (prev, key) => prev && obj.hasOwnProperty(key), true as boolean);
  }
  return false;
}

/**
 * Determines if `obj` matches the shape `TI18n`.
 *
 * 确定 `obj` 是否与形状 `TI18n` 匹配。
 *
 * @param obj
 */
export function isTI18n(obj: any): obj is TI18n {
  return isShapeOf<TI18n>(obj, ShapeOfTI18n);
}
const ShapeOfTI18n: ShapeOf<TI18n> = {
  create: true,
  update: true,
};


/**
 * Determines if `obj` matches the shape `TIcu`.
 *
 * 确定 `obj` 是否与形状 `TIcu` 匹配。
 *
 * @param obj
 */
export function isTIcu(obj: any): obj is TIcu {
  return isShapeOf<TIcu>(obj, ShapeOfTIcu);
}
const ShapeOfTIcu: ShapeOf<TIcu> = {
  type: true,
  anchorIdx: true,
  currentCaseLViewIndex: true,
  cases: true,
  create: true,
  remove: true,
  update: true
};


/**
 * Determines if `obj` matches the shape `TView`.
 *
 * 确定 `obj` 是否与形状 `TView` 匹配。
 *
 * @param obj
 */
export function isTView(obj: any): obj is TView {
  return isShapeOf<TView>(obj, ShapeOfTView);
}
const ShapeOfTView: ShapeOf<TView> = {
  type: true,
  blueprint: true,
  template: true,
  viewQuery: true,
  declTNode: true,
  firstCreatePass: true,
  firstUpdatePass: true,
  data: true,
  bindingStartIndex: true,
  expandoStartIndex: true,
  staticViewQueries: true,
  staticContentQueries: true,
  firstChild: true,
  hostBindingOpCodes: true,
  directiveRegistry: true,
  pipeRegistry: true,
  preOrderHooks: true,
  preOrderCheckHooks: true,
  contentHooks: true,
  contentCheckHooks: true,
  viewHooks: true,
  viewCheckHooks: true,
  destroyHooks: true,
  cleanup: true,
  components: true,
  queries: true,
  contentQueries: true,
  schemas: true,
  consts: true,
  incompleteFirstPass: true,
};


/**
 * Determines if `obj` matches the shape `TI18n`.
 *
 * 确定 `obj` 是否与形状 `TI18n` 匹配。
 *
 * @param obj
 */
export function isTNode(obj: any): obj is TNode {
  return isShapeOf<TNode>(obj, ShapeOfTNode);
}
const ShapeOfTNode: ShapeOf<TNode> = {
  type: true,
  index: true,
  insertBeforeIndex: true,
  injectorIndex: true,
  directiveStart: true,
  directiveEnd: true,
  directiveStylingLast: true,
  componentOffset: true,
  propertyBindings: true,
  flags: true,
  providerIndexes: true,
  value: true,
  attrs: true,
  mergedAttrs: true,
  localNames: true,
  initialInputs: true,
  inputs: true,
  outputs: true,
  tViews: true,
  next: true,
  projectionNext: true,
  child: true,
  parent: true,
  projection: true,
  styles: true,
  stylesWithoutHost: true,
  residualStyles: true,
  classes: true,
  classesWithoutHost: true,
  residualClasses: true,
  classBindings: true,
  styleBindings: true,
};

/**
 * Determines if `obj` is DOM `Node`.
 *
 * 确定 `obj` 是否为 DOM `Node` 。
 *
 */
export function isDOMNode(obj: any): obj is Node {
  return obj instanceof Node;
}

/**
 * Determines if `obj` is DOM `Text`.
 *
 * 确定 `obj` 是否为 DOM `Text` 。
 *
 */
export function isDOMElement(obj: any): obj is Element {
  return obj instanceof Element;
}

/**
 * Determines if `obj` is DOM `Text`.
 *
 * 确定 `obj` 是否为 DOM `Text` 。
 *
 */
export function isDOMText(obj: any): obj is Text {
  return obj instanceof Text;
}
