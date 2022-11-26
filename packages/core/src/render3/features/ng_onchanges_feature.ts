/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {OnChanges} from '../../interface/lifecycle_hooks';
import {SimpleChange, SimpleChanges} from '../../interface/simple_change';
import {assertString} from '../../util/assert';
import {EMPTY_OBJ} from '../../util/empty';
import {DirectiveDef, DirectiveDefFeature} from '../interfaces/definition';

/**
 * The NgOnChangesFeature decorates a component with support for the ngOnChanges
 * lifecycle hook, so it should be included in any component that implements
 * that hook.
 *
 * NgOnChangesFeature 使用对 ngOnChanges
 * 生命周期钩子的支持来装饰组件，因此它应该包含在任何实现该钩子的组件中。
 *
 * If the component or directive uses inheritance, the NgOnChangesFeature MUST
 * be included as a feature AFTER {@link InheritDefinitionFeature}, otherwise
 * inherited properties will not be propagated to the ngOnChanges lifecycle
 * hook.
 *
 * 如果组件或指令使用继承，则 NgOnChangesFeature 必须作为特性 AFTER {@link InheritDefinitionFeature}
 * 包含，否则继承的属性将不会传播到 ngOnChanges 生命周期钩子。
 *
 * Example usage:
 *
 * 示例用法：
 *
 * ```
 * static ɵcmp = defineComponent({
 *   ...
 *   inputs: {name: 'publicName'},
 *   features: [NgOnChangesFeature]
 * });
 * ```
 *
 * @codeGenApi
 */
export function ɵɵNgOnChangesFeature<T>(): DirectiveDefFeature {
  return NgOnChangesFeatureImpl;
}

export function NgOnChangesFeatureImpl<T>(definition: DirectiveDef<T>) {
  if (definition.type.prototype.ngOnChanges) {
    definition.setInput = ngOnChangesSetInput;
  }
  return rememberChangeHistoryAndInvokeOnChangesHook;
}

// This option ensures that the ngOnChanges lifecycle hook will be inherited
// from superclasses (in InheritDefinitionFeature).
/** @nocollapse */
// tslint:disable-next-line:no-toplevel-property-access
(ɵɵNgOnChangesFeature as DirectiveDefFeature).ngInherit = true;

/**
 * This is a synthetic lifecycle hook which gets inserted into `TView.preOrderHooks` to simulate
 * `ngOnChanges`.
 *
 * 这是一个合成的生命周期钩子，它被插入 `TView.preOrderHooks` 以模拟 `ngOnChanges` 。
 *
 * The hook reads the `NgSimpleChangesStore` data from the component instance and if changes are
 * found it invokes `ngOnChanges` on the component instance.
 *
 * 该钩子从组件实例中读取 `NgSimpleChangesStore` 数据，如果发现更改，它会调用组件实例上的
 * `ngOnChanges` 。
 *
 * @param this Component instance. Because this function gets inserted into `TView.preOrderHooks`,
 *     it is guaranteed to be called with component instance.
 *
 * 组件实例。因为此函数被插入到 `TView.preOrderHooks` 中，所以可以保证使用组件实例调用它。
 *
 */
function rememberChangeHistoryAndInvokeOnChangesHook(this: OnChanges) {
  const simpleChangesStore = getSimpleChangesStore(this);
  const current = simpleChangesStore?.current;

  if (current) {
    const previous = simpleChangesStore!.previous;
    if (previous === EMPTY_OBJ) {
      simpleChangesStore!.previous = current;
    } else {
      // New changes are copied to the previous store, so that we don't lose history for inputs
      // which were not changed this time
      for (let key in current) {
        previous[key] = current[key];
      }
    }
    simpleChangesStore!.current = null;
    this.ngOnChanges(current);
  }
}


function ngOnChangesSetInput<T>(
    this: DirectiveDef<T>, instance: T, value: any, publicName: string, privateName: string): void {
  const declaredName = (this.declaredInputs as {[key: string]: string})[publicName];
  ngDevMode && assertString(declaredName, 'Name of input in ngOnChanges has to be a string');
  const simpleChangesStore = getSimpleChangesStore(instance) ||
      setSimpleChangesStore(instance, {previous: EMPTY_OBJ, current: null});
  const current = simpleChangesStore.current || (simpleChangesStore.current = {});
  const previous = simpleChangesStore.previous;
  const previousChange = previous[declaredName];
  current[declaredName] = new SimpleChange(
      previousChange && previousChange.currentValue, value, previous === EMPTY_OBJ);

  (instance as any)[privateName] = value;
}

const SIMPLE_CHANGES_STORE = '__ngSimpleChanges__';

function getSimpleChangesStore(instance: any): null|NgSimpleChangesStore {
  return instance[SIMPLE_CHANGES_STORE] || null;
}

function setSimpleChangesStore(instance: any, store: NgSimpleChangesStore): NgSimpleChangesStore {
  return instance[SIMPLE_CHANGES_STORE] = store;
}

/**
 * Data structure which is monkey-patched on the component instance and used by `ngOnChanges`
 * life-cycle hook to track previous input values.
 *
 * 在组件实例上进行了猴子修补的数据结构，供 `ngOnChanges` 生命周期钩子用于跟踪以前的输入值。
 *
 */
interface NgSimpleChangesStore {
  previous: SimpleChanges;
  current: SimpleChanges|null;
}
