/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TNode} from './node';
import {RComment, RElement} from './renderer_dom';
import {HOST, LView, NEXT, PARENT, T_HOST, TRANSPLANTED_VIEWS_TO_REFRESH} from './view';



/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 *
 * 可以轻松识别类型的特殊位置。如果我们有一个从 `LView` 检索到的数组，并且该数组在 `TYPE` 位置为
 * `true` ，我们就知道它是 `LContainer` 。
 *
 */
export const TYPE = 1;

/**
 * Below are constants for LContainer indices to help us look up LContainer members
 * without having to remember the specific indices.
 * Uglify will inline these when minifying so there shouldn't be a cost.
 *
 * 下面是 LContainer 索引的常量，可帮助我们查找 LContainer 成员，而无需记住特定的索引。 Uglify
 * 会在缩小时内联这些，因此不应该有成本。
 *
 */

/**
 * Flag to signify that this `LContainer` may have transplanted views which need to be change
 * detected. (see: `LView[DECLARATION_COMPONENT_VIEW])`.
 *
 * 标志以表明此 `LContainer` 可能已经移植了需要检测更改的视图。（请参阅：
 * `LView[DECLARATION_COMPONENT_VIEW])` 。
 *
 * This flag, once set, is never unset for the `LContainer`. This means that when unset we can skip
 * a lot of work in `refreshEmbeddedViews`. But when set we still need to verify
 * that the `MOVED_VIEWS` are transplanted and on-push.
 *
 * 此标志一旦设置，就永远不会为 `LContainer` 取消设置。这意味着当未设置时，我们可以跳过
 * `refreshEmbeddedViews` 中的许多工作。但是当设置时，我们仍然需要验证 `MOVED_VIEWS`
 * 是否被移植并且是 on-push 。
 *
 */
export const HAS_TRANSPLANTED_VIEWS = 2;

// PARENT, NEXT, TRANSPLANTED_VIEWS_TO_REFRESH are indices 3, 4, and 5
// As we already have these constants in LView, we don't need to re-create them.

// T_HOST is index 6
// We already have this constants in LView, we don't need to re-create it.

export const NATIVE = 7;
export const VIEW_REFS = 8;
export const MOVED_VIEWS = 9;


/**
 * Size of LContainer's header. Represents the index after which all views in the
 * container will be inserted. We need to keep a record of current views so we know
 * which views are already in the DOM (and don't need to be re-added) and so we can
 * remove views from the DOM when they are no longer required.
 *
 * LContainer
 * 标头的大小。表示将插入容器中所有视图的索引。我们需要保留当前视图的记录，以便知道哪些视图已经在
 * DOM 中（并且不需要重新添加），以便我们可以在不再需要时从 DOM 中删除视图。
 *
 */
export const CONTAINER_HEADER_OFFSET = 10;

/**
 * The state associated with a container.
 *
 * 与容器关联的状态。
 *
 * This is an array so that its structure is closer to LView. This helps
 * when traversing the view tree (which is a mix of containers and component
 * views), so we can jump to viewOrContainer[NEXT] in the same way regardless
 * of type.
 *
 * 这是一个数组，因此其结构更接近
 * LView。这在遍历视图树（它是容器和组件视图的混合）时会很有帮助，因此我们可以用相同的方式跳转到
 * viewOrContainer [NEXT][NEXT] ，无论类型如何。
 *
 */
export interface LContainer extends Array<any> {
  /**
   * The host element of this LContainer.
   *
   * 此 LContainer 的主机元素。
   *
   * The host could be an LView if this container is on a component node.
   * In that case, the component LView is its HOST.
   *
   * 如果此容器在组件节点上，则主机可以是 LView。在这种情况下，组件 LView 是其 HOST。
   *
   */
  readonly[HOST]: RElement|RComment|LView;

  /**
   * This is a type field which allows us to differentiate `LContainer` from `StylingContext` in an
   * efficient way. The value is always set to `true`
   *
   * 这是一个类型字段，允许我们以有效的方式区分 `LContainer` 和 `StylingContext` 。该值始终设置为
   * `true`
   *
   */
  [TYPE]: true;

  /**
   * Flag to signify that this `LContainer` may have transplanted views which need to be change
   * detected. (see: `LView[DECLARATION_COMPONENT_VIEW])`.
   *
   * 标志以表明此 `LContainer` 可能已经移植了需要检测更改的视图。（请参阅：
   * `LView[DECLARATION_COMPONENT_VIEW])` 。
   *
   * This flag, once set, is never unset for the `LContainer`.
   *
   * 此标志一旦设置，就永远不会为 `LContainer` 取消设置。
   *
   */
  [HAS_TRANSPLANTED_VIEWS]: boolean;

  /**
   * Access to the parent view is necessary so we can propagate back
   * up from inside a container to parent[NEXT].
   *
   * 对父视图的访问是必要的，因此我们可以从容器内部向上传播到父[NEXT][NEXT] 。
   *
   */
  [PARENT]: LView;

  /**
   * This allows us to jump from a container to a sibling container or component
   * view with the same parent, so we can remove listeners efficiently.
   *
   * 这允许我们从容器跳转到具有相同父级的同级容器或组件视图，因此我们可以有效地删除侦听器。
   *
   */
  [NEXT]: LView|LContainer|null;

  /**
   * The number of direct transplanted views which need a refresh or have descendants themselves
   * that need a refresh but have not marked their ancestors as Dirty. This tells us that during
   * change detection we should still descend to find those children to refresh, even if the parents
   * are not `Dirty`/`CheckAlways`.
   *
   * 需要刷新或有后代本身需要刷新但未将其祖先标记为“脏”的直接移植视图的数量。这告诉我们，在变更检测期间，我们仍然应该下降以查找这些要刷新的子项，即使父项不是
   * `Dirty` / `CheckAlways` 。
   *
   */
  [TRANSPLANTED_VIEWS_TO_REFRESH]: number;

  /**
   * A collection of views created based on the underlying `<ng-template>` element but inserted into
   * a different `LContainer`. We need to track views created from a given declaration point since
   * queries collect matches from the embedded view declaration point and _not_ the insertion point.
   *
   * 根据基础 `<ng-template>` 元素创建但插入到不同的 `LContainer`
   * 中的视图集合。我们需要跟踪从给定声明点创建的视图，因为查询是从嵌入式视图声明点而 _ 不是 _
   * 插入点收集匹配项。
   *
   */
  [MOVED_VIEWS]: LView[]|null;

  /**
   * Pointer to the `TNode` which represents the host of the container.
   *
   * 指向表示容器主机的 `TNode` 的指针。
   *
   */
  [T_HOST]: TNode;

  /**
   * The comment element that serves as an anchor for this LContainer.
   *
   * 作为此 LContainer 的锚点的注释元素。
   *
   */
  readonly[NATIVE]:
      RComment;  // TODO(misko): remove as this value can be gotten by unwrapping `[HOST]`

  /**
   * Array of `ViewRef`s used by any `ViewContainerRef`s that point to this container.
   *
   * 指向此容器的任何 `ViewContainerRef` 使用的 `ViewRef` 数组。
   *
   * This is lazily initialized by `ViewContainerRef` when the first view is inserted.
   *
   * 这是在插入第一个视图时由 `ViewContainerRef` 延迟初始化的。
   *
   * NOTE: This is stored as `any[]` because render3 should really not be aware of `ViewRef` and
   * doing so creates circular dependency.
   *
   * 注意：这存储为 `any[]` ，因为 render3 真的不应该知道 `ViewRef` ，并且这样做会创建循环依赖。
   *
   */
  [VIEW_REFS]: unknown[]|null;
}

// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;
