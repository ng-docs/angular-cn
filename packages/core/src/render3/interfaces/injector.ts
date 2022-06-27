/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectFlags} from '../../di/interface/injector';
import {ProviderToken} from '../../di/provider_token';
import {assertDefined, assertEqual} from '../../util/assert';

import {TDirectiveHostNode} from './node';
import {LView, TData} from './view';

/**
 * Offsets of the `NodeInjector` data structure in the expando.
 *
 * expando 中 `NodeInjector` 数据结构的偏移量。
 *
 * `NodeInjector` is stored in both `LView` as well as `TView.data`. All storage requires 9 words.
 * First 8 are reserved for bloom filter and the 9th is reserved for the associated `TNode` as well
 * as parent `NodeInjector` pointer. All indexes are starting with `index` and have an offset as
 * shown.
 *
 * `NodeInjector` 存储在 `LView` 以及 `TView.data` 中。所有存储都需要 9 个字。前 8
 * 个为布隆过滤器保留，第 9 个为关联的 `TNode` 以及父 `NodeInjector` 指针保留。所有索引都以 `index`
 * 开头，并有一个如图所示的偏移量。
 *
 * `LView` layout:
 *
 * `LView` 布局：
 *
 * ```
 * index + 0: cumulative bloom filter
 * index + 1: cumulative bloom filter
 * index + 2: cumulative bloom filter
 * index + 3: cumulative bloom filter
 * index + 4: cumulative bloom filter
 * index + 5: cumulative bloom filter
 * index + 6: cumulative bloom filter
 * index + 7: cumulative bloom filter
 * index + 8: cumulative bloom filter
 * index + PARENT: Index to the parent injector. See `RelativeInjectorLocation`
 *                 `const parent = lView[index + NodeInjectorOffset.PARENT]`
 * ```
 *
 * `TViewData` layout:
 *
 * `TViewData` 布局：
 *
 * ```
 * index + 0: cumulative bloom filter
 * index + 1: cumulative bloom filter
 * index + 2: cumulative bloom filter
 * index + 3: cumulative bloom filter
 * index + 4: cumulative bloom filter
 * index + 5: cumulative bloom filter
 * index + 6: cumulative bloom filter
 * index + 7: cumulative bloom filter
 * index + 8: cumulative bloom filter
 * index + TNODE: TNode associated with this `NodeInjector`
 *                `const tNode = tView.data[index + NodeInjectorOffset.TNODE]`
 * ```
 *
 */
export const enum NodeInjectorOffset {
  TNODE = 8,
  PARENT = 8,
  BLOOM_SIZE = 8,
  SIZE = 9,
}

/**
 * Represents a relative location of parent injector.
 *
 * 表示父注入器的相对位置。
 *
 * The interfaces encodes number of parents `LView`s to traverse and index in the `LView`
 * pointing to the parent injector.
 *
 * 这些接口会编码要遍历的父 `LView` 的数量，并在指向父注入器的 `LView` 中编制索引。
 *
 */
export interface RelativeInjectorLocation {
  __brand__: 'RelativeInjectorLocationFlags';
}

export const enum RelativeInjectorLocationFlags {
  InjectorIndexMask = 0b111111111111111,
  ViewOffsetShift = 16,
  NO_PARENT = -1,
}

export const NO_PARENT_INJECTOR: RelativeInjectorLocation = -1 as any;

/**
 * Each injector is saved in 9 contiguous slots in `LView` and 9 contiguous slots in
 * `TView.data`. This allows us to store information about the current node's tokens (which
 * can be shared in `TView`) as well as the tokens of its ancestor nodes (which cannot be
 * shared, so they live in `LView`).
 *
 * 每个注入器都保存在 `LView` 的 9 个连续插槽和 `TView.data` 的 9
 * 个连续插槽中。这允许我们存储有关当前节点的标记（可以在 `TView`
 * 中共享）以及其祖先节点的标记（无法共享，因此它们位于 `LView` 中）的信息。
 *
 * Each of these slots (aside from the last slot) contains a bloom filter. This bloom filter
 * determines whether a directive is available on the associated node or not. This prevents us
 * from searching the directives array at this level unless it's probable the directive is in it.
 *
 * 这些插槽中的每一个（除了最后一个插槽）都包含一个布隆过滤器。此布隆过滤器确定指令在关联节点上是否可用。这使我们无法在此级别搜索指令数组，除非指令可能在其中。
 *
 * See: <https://en.wikipedia.org/wiki/Bloom_filter> for more about bloom filters.
 *
 * 有关布隆过滤器的更多信息，请参阅： <https://en.wikipedia.org/wiki/Bloom_filter> 。
 *
 * Because all injectors have been flattened into `LView` and `TViewData`, they cannot typed
 * using interfaces as they were previously. The start index of each `LInjector` and `TInjector`
 * will differ based on where it is flattened into the main array, so it's not possible to know
 * the indices ahead of time and save their types here. The interfaces are still included here
 * for documentation purposes.
 *
 * 因为所有注入器都已被展平为 `LView` 和 `TViewData`
 * ，所以它们不能像以前一样使用接口进行类型化。每个 `LInjector` 和 `TInjector`
 * 的开始索引将根据它在主数组中展平的位置而不同，因此不可能提前知道索引并在此保存它们的类型。出于文档目的，这些接口仍包含在此。
 *
 * export interface LInjector extends Array<any> {
 *
 * 导出接口 LInjector 扩展了 Array<any>{
 *
 *    // Cumulative bloom for directive IDs 0-31  (IDs are % BLOOM_SIZE)
 *
 * // 指令 ID 0-31 的累积绽放（ID 是 % BLOOM_SIZE）
 *
 * [0]: number;
 *
 *    // Cumulative bloom for directive IDs 32-63
 *
 * // 指令 ID 32-63 的累积绽放
 *
 * [1]: number;
 *
 *    // Cumulative bloom for directive IDs 64-95
 *
 * // 指令 ID 64-95 的累积 bloom
 *
 * [2]: number;
 *
 *    // Cumulative bloom for directive IDs 96-127
 *
 * // 指令 ID 96-127 的累积绽放
 *
 * [3]: number;
 *
 *    // Cumulative bloom for directive IDs 128-159
 *
 * // 指令 ID 128-159 的累积绽放
 *
 * [4]: number;
 *
 *    // Cumulative bloom for directive IDs 160 - 191
 *
 * // 指令 ID 160 - 191 的累积 bloom
 *
 * [5]: number;
 *
 *    // Cumulative bloom for directive IDs 192 - 223
 *
 * // 指令 ID 192 - 223 的累积 bloom
 *
 * [6]: number;
 *
 *    // Cumulative bloom for directive IDs 224 - 255
 *
 * // 指令 ID 224 - 255 的累积 bloom
 *
 * [7]: number;
 *
 *    // We need to store a reference to the injector's parent so DI can keep looking up
 *    // the injector tree until it finds the dependency it's looking for.
 *
 * // 我们需要存储对注入器父级的引用，以便 DI 可以继续查找 // 注入器树，直到找到它要查找的依赖项。
 *
 * [PARENT_INJECTOR]: number;
 *
 * }
 *
 * export interface TInjector extends Array<any> {
 *
 * 导出接口 TInjector 扩展了 Array<any>{
 *
 *    // Shared node bloom for directive IDs 0-31  (IDs are % BLOOM_SIZE)
 *
 * // 指令 ID 0-31 的共享节点 bloom（ID 是 % BLOOM_SIZE）
 *
 * [0]: number;
 *
 *    // Shared node bloom for directive IDs 32-63
 *
 * // 指令 ID 32-63 的共享节点 bloom
 *
 * [1]: number;
 *
 *    // Shared node bloom for directive IDs 64-95
 *
 * // 指令 ID 64-95 的共享节点 bloom
 *
 * [2]: number;
 *
 *    // Shared node bloom for directive IDs 96-127
 *
 * // 指令 ID 96-127 的共享节点 bloom
 *
 * [3]: number;
 *
 *    // Shared node bloom for directive IDs 128-159
 *
 * // 指令 ID 128-159 的共享节点 bloom
 *
 * [4]: number;
 *
 *    // Shared node bloom for directive IDs 160 - 191
 *
 * // 指令 ID 160 - 191 的共享节点 bloom
 *
 * [5]: number;
 *
 *    // Shared node bloom for directive IDs 192 - 223
 *
 * // 指令 ID 192 - 223 的共享节点 bloom
 *
 * [6]: number;
 *
 *    // Shared node bloom for directive IDs 224 - 255
 *
 * // 指令 ID 224 - 255 的共享节点 bloom
 *
 * [7]: number;
 *
 *    // Necessary to find directive indices for a particular node.
 *
 * // 有必要查找特定节点的指令索引。
 *
 * [TNODE]: TElementNode|TElementContainerNode|TContainerNode;
 *
 *  }
 *
 */

/**
 * Factory for creating instances of injectors in the NodeInjector.
 *
 * 用于在 NodeInjector 中创建注入器实例的工厂。
 *
 * This factory is complicated by the fact that it can resolve `multi` factories as well.
 *
 * 这家工厂很复杂，因为它也可以解析 `multi` 工厂。
 *
 * NOTE: Some of the fields are optional which means that this class has two hidden classes.
 *
 * 注：某些字段是可选的，这意味着此类有两个隐藏类。
 *
 * - One without `multi` support (most common)
 *
 *   一个没有 `multi` 支持的（最常见）
 *
 * - One with `multi` values, (rare).
 *
 *   一个具有 `multi` 值，（罕见）。
 *
 * Since VMs can cache up to 4 inline hidden classes this is OK.
 *
 * 由于 VM 可以缓存多达 4 个内联隐藏类，这是可以的。
 *
 * - Single factory: Only `resolving` and `factory` is defined.
 *
 *   单个工厂：仅定义 `resolving` 和 `factory` 。
 *
 * - `providers` factory: `componentProviders` is a number and `index = -1`.
 *
 *   `providers` 工厂： `componentProviders` 是一个数字，并且 `index = -1` 。
 *
 * - `viewProviders` factory: `componentProviders` is a number and `index` points to `providers`.
 *
 *   `viewProviders` 工厂： `componentProviders` 是一个数字，并且 `index` 指向 `providers` 。
 *
 */
export class NodeInjectorFactory {
  /**
   * The inject implementation to be activated when using the factory.
   *
   * 使用工厂时要激活的注入实现。
   *
   */
  injectImpl: null|(<T>(token: ProviderToken<T>, flags?: InjectFlags) => T);

  /**
   * Marker set to true during factory invocation to see if we get into recursive loop.
   * Recursive loop causes an error to be displayed.
   *
   * 在工厂调用期间将标记设置为 true 以查看我们是否进入递归循环。递归循环会导致显示错误。
   *
   */
  resolving = false;

  /**
   * Marks that the token can see other Tokens declared in `viewProviders` on the same node.
   *
   * 标记此标记可以看到同一节点上的 `viewProviders` 中声明的其他 Token。
   *
   */
  canSeeViewProviders: boolean;

  /**
   * An array of factories to use in case of `multi` provider.
   *
   * 在 `multi` 提供者的情况下使用的工厂数组。
   *
   */
  multi?: Array<() => any>;

  /**
   * Number of `multi`-providers which belong to the component.
   *
   * 属于组件的 `multi` 提供者的数量。
   *
   * This is needed because when multiple components and directives declare the `multi` provider
   * they have to be concatenated in the correct order.
   *
   * 这是需要的，因为当多个组件和指令声明 `multi` 提供程序时，它们必须按正确的顺序连接。
   *
   * Example:
   *
   * 示例：
   *
   * If we have a component and directive active an a single element as declared here
   *
   * 如果我们有一个处于活动状态的组件和指令，则是在此声明的单个元素
   *
   * ```
   * component:
   *   provides: [ {provide: String, useValue: 'component', multi: true} ],
   *   viewProvides: [ {provide: String, useValue: 'componentView', multi: true} ],
   *
   * directive:
   *   provides: [ {provide: String, useValue: 'directive', multi: true} ],
   * ```
   *
   * Then the expected results are:
   *
   * 那么预期的结果是：
   *
   * ```
   * providers: ['component', 'directive']
   * viewProviders: ['component', 'componentView', 'directive']
   * ```
   *
   * The way to think about it is that the `viewProviders` have been inserted after the component
   * but before the directives, which is why we need to know how many `multi`s have been declared by
   * the component.
   *
   * 考虑它的方式是 `viewProviders`
   * 已经插入到组件之后、指令之前，这就是为什么我们需要知道组件声明了多少 `multi` 。
   *
   */
  componentProviders?: number;

  /**
   * Current index of the Factory in the `data`. Needed for `viewProviders` and `providers` merging.
   * See `providerFactory`.
   *
   * `data` 中 Factory 的当前索引。合并 `viewProviders` 和 `providers` 时需要。请参阅
   * `providerFactory` 。
   *
   */
  index?: number;

  /**
   * Because the same `multi` provider can be declared in `provides` and `viewProvides` it is
   * possible for `viewProvides` to shadow the `provides`. For this reason we store the
   * `provideFactory` of the `providers` so that `providers` can be extended with `viewProviders`.
   *
   * 因为可以在 sources 和 `viewProvides` 中声明同一个 `multi` `provides` 程序，所以 viewProvides
   * `provides` `viewProvides` 。出于这个原因，我们存储了 `providers` `providers` `provideFactory`
   * ，以便可以用 `viewProviders` 扩展提供者。
   *
   * Example:
   *
   * 示例：
   *
   * Given:
   *
   * 给定：
   *
   * ```
   * provides: [ {provide: String, useValue: 'all', multi: true} ],
   * viewProvides: [ {provide: String, useValue: 'viewOnly', multi: true} ],
   * ```
   *
   * We have to return `['all']` in case of content injection, but `['all', 'viewOnly']` in case
   * of view injection. We further have to make sure that the shared instances (in our case
   * `all`) are the exact same instance in both the content as well as the view injection. (We
   * have to make sure that we don't double instantiate.) For this reason the `viewProvides`
   * `Factory` has a pointer to the shadowed `provides` factory so that it can instantiate the
   * `providers` (`['all']`) and then extend it with `viewProviders` (`['all'] + ['viewOnly'] =
   * ['all', 'viewOnly']`).
   *
   * 在内容注入的情况下，我们必须返回 `['all']` ，但在视图注入的情况下必须返回 \[' `['all',
   * 'viewOnly']` 。我们还必须确保共享实例（在我们的示例中为 `all`
   * ）在内容和视图注入中是完全相同的实例。 （我们必须确保我们不会双重实例化。）因此，
   * `viewProvides` `Factory` 有一个指向影子 sources 工厂的指针，以便它可以实例化 `provides`
   * `providers` （ `['all']` ），然后使用 `viewProviders` （ `['all'] + ['viewOnly'] = ['all',
   * 'viewOnly']` ）。
   *
   */
  providerFactory?: NodeInjectorFactory|null;


  constructor(
      /**
       * Factory to invoke in order to create a new instance.
       */
      public factory:
          (this: NodeInjectorFactory, _: undefined,
           /**
            * array where injectables tokens are stored. This is used in
            * case of an error reporting to produce friendlier errors.
            */
           tData: TData,
           /**
            * array where existing instances of injectables are stored. This is used in case
            * of multi shadow is needed. See `multi` field documentation.
            */
           lView: LView,
           /**
            * The TNode of the same element injector.
            */
           tNode: TDirectiveHostNode) => any,
      /**
       * Set to `true` if the token is declared in `viewProviders` (or if it is component).
       */
      isViewProvider: boolean,
      injectImplementation: null|(<T>(token: ProviderToken<T>, flags?: InjectFlags) => T)) {
    ngDevMode && assertDefined(factory, 'Factory not specified');
    ngDevMode && assertEqual(typeof factory, 'function', 'Expected factory function.');
    this.canSeeViewProviders = isViewProvider;
    this.injectImpl = injectImplementation;
  }
}

export function isFactory(obj: any): obj is NodeInjectorFactory {
  return obj instanceof NodeInjectorFactory;
}

// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;
