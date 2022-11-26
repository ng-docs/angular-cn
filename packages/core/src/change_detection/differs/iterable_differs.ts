/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵɵdefineInjectable} from '../../di/interface/defs';
import {StaticProvider} from '../../di/interface/provider';
import {Optional, SkipSelf} from '../../di/metadata';
import {RuntimeError, RuntimeErrorCode} from '../../errors';
import {DefaultIterableDifferFactory} from '../differs/default_iterable_differ';



/**
 * A type describing supported iterable types.
 *
 * 描述受支持的可迭代类型的类型。
 *
 * @publicApi
 */
export type NgIterable<T> = Array<T>|Iterable<T>;

/**
 * A strategy for tracking changes over time to an iterable. Used by {@link NgForOf} to
 * respond to changes in an iterable by effecting equivalent changes in the DOM.
 *
 * 用来跟踪一个迭代内的更改的策略。{@link NgForOf} 使用它通过对 DOM
 * 进行等效更改来响应此迭代内的更改。
 *
 * @publicApi
 */
export interface IterableDiffer<V> {
  /**
   * Compute a difference between the previous state and the new `object` state.
   *
   * 计算先前状态和新 `object` 状态之间的差异。
   *
   * @param object containing the new value.
   *
   * 包含新值。
   *
   * @returns an object describing the difference. The return value is only valid until the next
   * `diff()` invocation.
   *
   * 描述差异的对象。返回值仅在下一次 `diff()` 调用之前有效。
   *
   */
  diff(object: NgIterable<V>|undefined|null): IterableChanges<V>|null;
}

/**
 * An object describing the changes in the `Iterable` collection since last time
 * `IterableDiffer#diff()` was invoked.
 *
 * 本对象描述自上次调用 `IterableDiffer#diff()` 以来 `Iterable` 集合中的变更。
 *
 * @publicApi
 */
export interface IterableChanges<V> {
  /**
   * Iterate over all changes. `IterableChangeRecord` will contain information about changes
   * to each item.
   *
   * 遍历所有更改。`IterableChangeRecord` 将包含有关每个条目更改的信息。
   *
   */
  forEachItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /**
   * Iterate over a set of operations which when applied to the original `Iterable` will produce the
   * new `Iterable`.
   *
   * 遍历一组操作，将这些操作应用于原始 `Iterable`，将产生新的 `Iterable` 。
   *
   * NOTE: These are not necessarily the actual operations which were applied to the original
   * `Iterable`, rather these are a set of computed operations which may not be the same as the
   * ones applied.
   *
   * 注意：这些不一定是应用于原始 `Iterable`
   * 的实际操作，而是这些计算的操作集合，可能与所应用的操作不同。
   *
   * @param record A change which needs to be applied
   *
   * 需要应用的更改
   *
   * @param previousIndex The `IterableChangeRecord#previousIndex` of the `record` refers to the
   *        original `Iterable` location, where as `previousIndex` refers to the transient location
   *        of the item, after applying the operations up to this point.
   *
   * 此 `record` 的 `IterableChangeRecord#previousIndex` 是指原来 `Iterable` 中的位置，这个
   * `previousIndex` 是指应用此操作之后条目的瞬时位置。
   *
   * @param currentIndex The `IterableChangeRecord#currentIndex` of the `record` refers to the
   *        original `Iterable` location, where as `currentIndex` refers to the transient location
   *        of the item, after applying the operations up to this point.
   *
   * 此 `record` 的 `IterableChangeRecord#currentIndex` 是指原来 `Iterable` 中的位置，这个
   * `currentIndex` 是指应用此操作之后条目的瞬时位置。
   *
   */
  forEachOperation(
      fn:
          (record: IterableChangeRecord<V>, previousIndex: number|null,
           currentIndex: number|null) => void): void;

  /**
   * Iterate over changes in the order of original `Iterable` showing where the original items
   * have moved.
   *
   * 按原始 `Iterable` 中的顺序遍历这些变更，以找出原始条目移动到的位置。
   *
   */
  forEachPreviousItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /**
   * Iterate over all added items.
   *
   * 遍历所有添加的条目。
   *
   */
  forEachAddedItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /**
   * Iterate over all moved items.
   *
   * 遍历所有移动过的条目。
   *
   */
  forEachMovedItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /**
   * Iterate over all removed items.
   *
   * 遍历所有已删除的条目。
   *
   */
  forEachRemovedItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /**
   * Iterate over all items which had their identity (as computed by the `TrackByFunction`)
   * changed.
   *
   * 遍历所有更改过标识（由 `TrackByFunction` 计算）的条目。
   *
   */
  forEachIdentityChange(fn: (record: IterableChangeRecord<V>) => void): void;
}

/**
 * Record representing the item change information.
 *
 * 代表条目变更信息的记录。
 *
 * @publicApi
 */
export interface IterableChangeRecord<V> {
  /**
   * Current index of the item in `Iterable` or null if removed.
   *
   * 此条目在 `Iterable` 中的当前索引，如果已删除则为 null。
   *
   */
  readonly currentIndex: number|null;

  /**
   * Previous index of the item in `Iterable` or null if added.
   *
   * 此条目在 `Iterable` 中以前的索引，如果是新添加的则为 null。
   *
   */
  readonly previousIndex: number|null;

  /**
   * The item.
   *
   * 本条目。
   *
   */
  readonly item: V;

  /**
   * Track by identity as computed by the `TrackByFunction`.
   *
   * 通过 `TrackByFunction` 计算出的标识进行跟踪。
   *
   */
  readonly trackById: any;
}

/**
 * A function optionally passed into the `NgForOf` directive to customize how `NgForOf` uniquely
 * identifies items in an iterable.
 *
 * 一个可选地传入 `NgForOf` 指令的函数，以自定义 `NgForOf` 如何唯一标识迭代中的条目。
 *
 * `NgForOf` needs to uniquely identify items in the iterable to correctly perform DOM updates
 * when items in the iterable are reordered, new items are added, or existing items are removed.
 *
 * `NgForOf` 需要唯一标识 iterable 中的条目，以在对 iterable
 * 中的条目重新排序、添加新条目或删除现有条目时正确执行 DOM 更新。
 *
 * In all of these scenarios it is usually desirable to only update the DOM elements associated
 * with the items affected by the change. This behavior is important to:
 *
 * 在所有这些场景中，通常希望仅更新与受更改影响的条目关联的 DOM 元素。此行为对以下内容很重要：
 *
 * - preserve any DOM-specific UI state (like cursor position, focus, text selection) when the
 *   iterable is modified
 *
 *   修改迭代器时保留任何特定于 DOM 的 UI 状态（例如光标位置、焦点、文本选择）
 *
 * - enable animation of item addition, removal, and iterable reordering
 *
 *   启用条目添加、删除和可迭代重新排序的动画
 *
 * - preserve the value of the `<select>` element when nested `<option>` elements are dynamically
 *   populated using `NgForOf` and the bound iterable is updated
 *
 *   当使用 `NgForOf` 动态填充嵌套 `<option>` 元素并更新绑定迭代器时，保留 `<select>` 元素的值
 *
 * A common use for custom `trackBy` functions is when the model that `NgForOf` iterates over
 * contains a property with a unique identifier. For example, given a model:
 *
 * 自定义 `trackBy` 函数的一个常见用途是当 `NgForOf`
 * 迭代的模型包含具有唯一标识符的属性时。例如，给定一个模型：
 *
 * ```ts
 * class User {
 *   id: number;
 *   name: string;
 *   ...
 * }
 * ```
 *
 * a custom `trackBy` function could look like the following:
 *
 * 自定义 `trackBy` 函数可能类似于以下内容：
 *
 * ```ts
 * function userTrackBy(index, user) {
 *   return user.id;
 * }
 * ```
 *
 * A custom `trackBy` function must have several properties:
 *
 * 传给 `NgForOf` 指令的可选函数，该函数定义如何跟踪可迭代对象中条目的更改。该函数接受迭代索引和条目
 * ID 作为参数。提供后，Angular 将根据函数的返回值的变化进行跟踪。
 *
 * - be [idempotent](https://en.wikipedia.org/wiki/Idempotence) (be without side effects, and always
 *   return the same value for a given input)
 *
 *   [幂等](https://en.wikipedia.org/wiki/Idempotence)（没有副作用，并且对于给定输入始终返回相同的值）
 *
 * - return unique value for all unique inputs
 *
 *   返回所有唯一输入的唯一值
 *
 * - be fast
 *
 *   快点
 *
 * @see [`NgForOf#ngForTrackBy`](api/common/NgForOf#ngForTrackBy)
 * @publicApi
 */
export interface TrackByFunction<T> {
  // Note: the type parameter `U` enables more accurate template type checking in case a trackBy
  // function is declared using a base type of the iterated type. The `U` type gives TypeScript
  // additional freedom to infer a narrower type for the `item` parameter type, instead of imposing
  // the trackBy's declared item type as the inferred type for `T`.
  // See https://github.com/angular/angular/issues/40125

  /**
   * @param index The index of the item within the iterable.
   *
   * 可迭代项中条目的索引。
   *
   * @param item The item in the iterable.
   *
   * 可迭代项中的项。
   *
   */
  <U extends T>(index: number, item: T&U): any;
}

/**
 * Provides a factory for {@link IterableDiffer}.
 *
 * 提供 {@link IterableDiffer} 的工厂。
 *
 * @publicApi
 */
export interface IterableDifferFactory {
  supports(objects: any): boolean;
  create<V>(trackByFn?: TrackByFunction<V>): IterableDiffer<V>;
}

export function defaultIterableDiffersFactory() {
  return new IterableDiffers([new DefaultIterableDifferFactory()]);
}

/**
 * A repository of different iterable diffing strategies used by NgFor, NgClass, and others.
 *
 * NgFor、NgClass 等使用的不同迭代策略的存储库。
 *
 * @publicApi
 */
export class IterableDiffers {
  /** @nocollapse */
  static ɵprov = /** @pureOrBreakMyCode */ ɵɵdefineInjectable(
      {token: IterableDiffers, providedIn: 'root', factory: defaultIterableDiffersFactory});

  /**
   * @deprecated v4.0.0 - Should be private
   *
   * v4.0.0-应该是私有的
   *
   */
  factories: IterableDifferFactory[];
  constructor(factories: IterableDifferFactory[]) {
    this.factories = factories;
  }

  static create(factories: IterableDifferFactory[], parent?: IterableDiffers): IterableDiffers {
    if (parent != null) {
      const copied = parent.factories.slice();
      factories = factories.concat(copied);
    }

    return new IterableDiffers(factories);
  }

  /**
   * Takes an array of {@link IterableDifferFactory} and returns a provider used to extend the
   * inherited {@link IterableDiffers} instance with the provided factories and return a new
   * {@link IterableDiffers} instance.
   *
   * 接受一个 {@link IterableDifferFactory}
   * 数组，并返回一个提供者，用于扩展继承的带有提供者工厂的 {@link IterableDiffers}
   * 实例，并返回一个新的 {@link IterableDiffers} 实例。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * The following example shows how to extend an existing list of factories,
   * which will only be applied to the injector for this component and its children.
   * This step is all that's required to make a new {@link IterableDiffer} available.
   *
   * 以下示例演示了如何扩展现有工厂列表，该列表仅适用于该组件及其子组件的注入器。这就是使新的 {@link
   * IterableDiffer} 可用的全部步骤。
   *
   * ```
   * @Component ({
   *   viewProviders: [
   *     IterableDiffers.extend([new ImmutableListDiffer()])
   *   ]
   * })
   * ```
   */
  static extend(factories: IterableDifferFactory[]): StaticProvider {
    return {
      provide: IterableDiffers,
      useFactory: (parent: IterableDiffers|null) => {
        // if parent is null, it means that we are in the root injector and we have just overridden
        // the default injection mechanism for IterableDiffers, in such a case just assume
        // `defaultIterableDiffersFactory`.
        return IterableDiffers.create(factories, parent || defaultIterableDiffersFactory());
      },
      // Dependency technically isn't optional, but we can provide a better error message this way.
      deps: [[IterableDiffers, new SkipSelf(), new Optional()]]
    };
  }

  find(iterable: any): IterableDifferFactory {
    const factory = this.factories.find(f => f.supports(iterable));
    if (factory != null) {
      return factory;
    } else {
      throw new RuntimeError(
          RuntimeErrorCode.NO_SUPPORTING_DIFFER_FACTORY,
          ngDevMode &&
              `Cannot find a differ supporting object '${iterable}' of type '${
                  getTypeNameForDebugging(iterable)}'`);
    }
  }
}

export function getTypeNameForDebugging(type: any): string {
  return type['name'] || typeof type;
}
