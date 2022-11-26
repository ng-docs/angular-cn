/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../../di/injector';
import {ProviderToken} from '../../di/provider_token';
import {Type} from '../../interface/type';
import {SchemaMetadata} from '../../metadata/schema';
import {Sanitizer} from '../../sanitization/sanitizer';

import {LContainer} from './container';
import {ComponentDef, ComponentTemplate, DirectiveDef, DirectiveDefList, HostBindingsFunction, PipeDef, PipeDefList, ViewQueriesFunction} from './definition';
import {I18nUpdateOpCodes, TI18n, TIcu} from './i18n';
import {TConstants, TNode} from './node';
import {LQueries, TQueries} from './query';
import {Renderer, RendererFactory} from './renderer';
import {RComment, RElement} from './renderer_dom';
import {TStylingKey, TStylingRange} from './styling';



// Below are constants for LView indices to help us look up LView members
// without having to remember the specific indices.
// Uglify will inline these when minifying so there shouldn't be a cost.
export const HOST = 0;
export const TVIEW = 1;
export const FLAGS = 2;
export const PARENT = 3;
export const NEXT = 4;
export const TRANSPLANTED_VIEWS_TO_REFRESH = 5;
export const T_HOST = 6;
export const CLEANUP = 7;
export const CONTEXT = 8;
export const INJECTOR = 9;
export const RENDERER_FACTORY = 10;
export const RENDERER = 11;
export const SANITIZER = 12;
export const CHILD_HEAD = 13;
export const CHILD_TAIL = 14;
// FIXME(misko): Investigate if the three declarations aren't all same thing.
export const DECLARATION_VIEW = 15;
export const DECLARATION_COMPONENT_VIEW = 16;
export const DECLARATION_LCONTAINER = 17;
export const PREORDER_HOOK_FLAGS = 18;
export const QUERIES = 19;
export const ID = 20;
export const EMBEDDED_VIEW_INJECTOR = 21;
/**
 * Size of LView's header. Necessary to adjust for it when setting slots.
 *
 * LView 标头的大小。设置插槽时需要对其进行调整。
 *
 * IMPORTANT: `HEADER_OFFSET` should only be referred to the in the `ɵɵ*` instructions to translate
 * instruction index into `LView` index. All other indexes should be in the `LView` index space and
 * there should be no need to refer to `HEADER_OFFSET` anywhere else.
 *
 * 重要提示： `HEADER_OFFSET` 应该仅在 `ɵɵ*` 指令中被引用，以将指令索引转换为 `LView`
 * 索引。所有其他索引应该在 `LView` 索引空间中，并且应该没有必要在其他任何地方引用 `HEADER_OFFSET`
 * 。
 *
 */
export const HEADER_OFFSET = 22;


// This interface replaces the real LView interface if it is an arg or a
// return value of a public instruction. This ensures we don't need to expose
// the actual interface, which should be kept private.
export interface OpaqueViewState {
  '__brand__': 'Brand for OpaqueViewState that nothing will match';
}


/**
 * `LView` stores all of the information needed to process the instructions as
 * they are invoked from the template. Each embedded view and component view has its
 * own `LView`. When processing a particular view, we set the `viewData` to that
 * `LView`. When that view is done processing, the `viewData` is set back to
 * whatever the original `viewData` was before (the parent `LView`).
 *
 * `LView` 存储从模板调用指令时处理指令所需的所有信息。每个嵌入式视图和组件视图都有自己的 `LView`
 * 。在处理特定视图时，我们将 `viewData` 设置为该 `LView` 。当该视图完成处理时，`viewData`
 * 被设置回原始 `viewData` 之前的任何内容（父 `LView`）。
 *
 * Keeping separate state for each view facilities view insertion / deletion, so we
 * don't have to edit the data array based on which views are present.
 *
 * 为每个视图工具视图插入/删除保持单独的状态，因此我们无需根据存在的视图来编辑数据数组。
 *
 */
export interface LView<T = unknown> extends Array<any> {
  /**
   * Human readable representation of the `LView`.
   *
   * `LView` 的人类可读表示。
   *
   * NOTE: This property only exists if `ngDevMode` is set to `true` and it is not present in
   * production. Its presence is purely to help debug issue in development, and should not be relied
   * on in production application.
   *
   * 注意：仅当 `ngDevMode` 设置为 `true`
   * 并且生产中不存在此属性时才存在。它的存在纯粹是为了帮助调试开发中的问题，不应在生产应用程序中依赖。
   *
   */
  debug?: LViewDebug;

  /**
   * The node into which this `LView` is inserted.
   *
   * 插入此 `LView` 的节点。
   *
   */
  [HOST]: RElement|null;

  /**
   * The static data for this view. We need a reference to this so we can easily walk up the
   * node tree in DI and get the TView.data array associated with a node (where the
   * directive defs are stored).
   *
   * 此视图的静态数据。我们需要对 this 的引用，以便我们可以轻松地在 DI
   * 中沿着节点树走，并获取与节点关联的 TView.data 数组（存储指令 defs 的地方）。
   *
   */
  readonly[TVIEW]: TView;

  /**
   * Flags for this view. See LViewFlags for more info.
   *
   * 此视图的标志。有关更多信息，请参阅 LViewFlags 。
   *
   */
  [FLAGS]: LViewFlags;

  /**
   * This may store an {@link LView} or {@link LContainer}.
   *
   * 这可能会存储 {@link LView} 或 {@link LContainer} 。
   *
   * `LView` - The parent view. This is needed when we exit the view and must restore the previous
   * LView. Without this, the render method would have to keep a stack of
   * views as it is recursively rendering templates.
   *
   * `LView` - 父视图。当我们退出视图并且必须恢复以前的 LView 时，这是需要的。没有这个，render
   * 方法将不得不保留一组视图，因为它是递归渲染模板。
   *
   * `LContainer` - The current view is part of a container, and is an embedded view.
   *
   * `LContainer` - 当前视图是容器的一部分，并且是嵌入式视图。
   *
   */
  [PARENT]: LView|LContainer|null;

  /**
   * The next sibling LView or LContainer.
   *
   * 下一个同级 LView 或 LContainer。
   *
   * Allows us to propagate between sibling view states that aren't in the same
   * container. Embedded views already have a node.next, but it is only set for
   * views in the same container. We need a way to link component views and views
   * across containers as well.
   *
   * 允许我们在不在同一个容器中的同级视图状态之间传播。嵌入式视图已经有一个 node.next
   * ，但它只是为同一个容器中的视图设置。我们还需要一种方法来链接组件视图和跨容器的视图。
   *
   */
  [NEXT]: LView|LContainer|null;

  /**
   * Queries active for this view - nodes from a view are reported to those queries.
   *
   * 此视图的活动查询 - 视图中的节点会报告给这些查询。
   *
   */
  [QUERIES]: LQueries|null;

  /**
   * Store the `TNode` of the location where the current `LView` is inserted into.
   *
   * 存储当前 `TNode` 插入到的位置的 `LView` 。
   *
   * Given:
   *
   * 给定：
   *
   * ```
   * <div>
   *   <ng-template><span></span></ng-template>
   * </div>
   * ```
   *
   * We end up with two `TView`s.
   *
   * 我们最终得到了两个 `TView` 。
   *
   * - `parent` `TView` which contains `<div><!-- anchor --></div>`
   *
   *   包含 `<div><!-- anchor --></div>` 的 `parent` `TView`
   *
   * - `child` `TView` which contains `<span></span>`
   *
   *   包含 `<span></span>` 的 `child` `TView`
   *
   * Typically the `child` is inserted into the declaration location of the `parent`, but it can be
   * inserted anywhere. Because it can be inserted anywhere it is not possible to store the
   * insertion information in the `TView` and instead we must store it in the `LView[T_HOST]`.
   *
   * 通常，`child` 项会插入到 `parent`
   * 的声明位置，但它可以插入任何地方。因为它可以在任何地方插入，所以不可能将插入信息存储在 `TView`
   * 中，我们必须将其存储在 `LView[T_HOST]` 中。
   *
   * So to determine where is our insertion parent we would execute:
   *
   * 因此，要确定我们的插入父级在哪里，我们将执行：
   *
   * ```
   * const parentLView = lView[PARENT];
   * const parentTNode = lView[T_HOST];
   * const insertionParent = parentLView[parentTNode.index];
   * ```
   *
   * If `null`, this is the root view of an application (root component is in this view) and it has
   * no parents.
   *
   * 如果 `null` ，这是应用程序的根视图（根组件在此视图中），并且它没有父级。
   *
   */
  [T_HOST]: TNode|null;

  /**
   * When a view is destroyed, listeners need to be released and outputs need to be
   * unsubscribed. This context array stores both listener functions wrapped with
   * their context and output subscription instances for a particular view.
   *
   * 当视图被销毁时，需要释放侦听器并需要退订输出。此上下文数组存储使用其上下文包装的侦听器函数和特定视图的输出订阅实例。
   *
   * These change per LView instance, so they cannot be stored on TView. Instead,
   * TView.cleanup saves an index to the necessary context in this array.
   *
   * 这些每个 LView 实例都会更改，因此它们不能存储在 TView 上。相反，TView.cleanup
   * 会在此数组中保存到必要上下文的索引。
   *
   * After `LView` is created it is possible to attach additional instance specific functions at the
   * end of the `lView[CLEANUP]` because we know that no more `T` level cleanup functions will be
   * added here.
   *
   * 创建 `LView` 后，可以在 `lView[CLENUP]`
   * 的末尾附加额外的实例特定函数，因为我们知道这里不会添加更多 `T` 级清理函数。
   *
   */
  [CLEANUP]: any[]|null;

  /**
   * - For dynamic views, this is the context with which to render the template (e.g.
   *   `NgForContext`), or `{}` if not defined explicitly.
   * - For root view of the root component it's a reference to the component instance itself.
   * - For components, the context is a reference to the component instance itself.
   * - For inline views, the context is null.
   *
   *   对于内联视图，上下文为 null。
   *
   */
  [CONTEXT]: T;

  /**
   * An optional Module Injector to be used as fall back after Element Injectors are consulted.
   *
   * 一个可选的模块注入器，在咨询元素注入器之后用作后备。
   *
   */
  readonly[INJECTOR]: Injector|null;

  /**
   * Factory to be used for creating Renderer.
   *
   * 用于创建渲染器的工厂。
   *
   */
  [RENDERER_FACTORY]: RendererFactory;

  /**
   * Renderer to be used for this view.
   *
   * 要用于此视图的渲染器。
   *
   */
  [RENDERER]: Renderer;

  /**
   * An optional custom sanitizer.
   *
   * 可选的自定义清洁器。
   *
   */
  [SANITIZER]: Sanitizer|null;

  /**
   * Reference to the first LView or LContainer beneath this LView in
   * the hierarchy.
   *
   * 引用层次结构中此 LView 下的第一个 LView 或 LContainer。
   *
   * Necessary to store this so views can traverse through their nested views
   * to remove listeners and call onDestroy callbacks.
   *
   * 有必要存储它，以便视图可以遍历它们的嵌套视图以删除侦听器并调用 onDestroy 回调。
   *
   */
  [CHILD_HEAD]: LView|LContainer|null;

  /**
   * The last LView or LContainer beneath this LView in the hierarchy.
   *
   * 层次结构中此 LView 下的最后一个 LView 或 LContainer。
   *
   * The tail allows us to quickly add a new state to the end of the view list
   * without having to propagate starting from the first child.
   *
   * 尾部允许我们快速将新状态添加到视图列表的末尾，而无需从第一个子项开始传播。
   *
   */
  [CHILD_TAIL]: LView|LContainer|null;

  /**
   * View where this view's template was declared.
   *
   * 声明此视图的模板的视图。
   *
   * The template for a dynamically created view may be declared in a different view than
   * it is inserted. We already track the "insertion view" (view where the template was
   * inserted) in LView[PARENT], but we also need access to the "declaration view"
   * (view where the template was declared). Otherwise, we wouldn't be able to call the
   * view's template function with the proper contexts. Context should be inherited from
   * the declaration view tree, not the insertion view tree.
   *
   * 动态创建的视图的模板可以在与插入它的视图不同的视图中声明。我们已经在 LView
   * [PARENT][PARENT]中跟踪了“插入视图”（插入模板的视图），但我们还需要访问“声明视图”（声明模板的视图）。否则，我们将无法使用适当的上下文调用视图的模板函数。上下文应该继承自声明视图树，而不是插入视图树。
   *
   * Example (AppComponent template):
   *
   * 示例（AppComponent 模板）：
   *
   * &lt;ng-template #foo></ng-template>       &lt;-- declared here -->
   * &lt;some-comp [tpl]="foo"></some-comp>    &lt;-- inserted inside this component -->
   *
   * &lt;ng-模板 #foo></ng-template>&lt;-- 在这里声明 --> &lt;some-comp [tpl][tpl]
   * ="foo"></some-comp>&lt;-- 插入此组件中 -->
   *
   * The <ng-template> above is declared in the AppComponent template, but it will be passed into
   * SomeComp and inserted there. In this case, the declaration view would be the AppComponent,
   * but the insertion view would be SomeComp. When we are removing views, we would want to
   * traverse through the insertion view to clean up listeners. When we are calling the
   * template function during change detection, we need the declaration view to get inherited
   * context.
   *
   * 的<ng-template>上面的是在 AppComponent 模板中声明的，但它将被传入 SomeComp
   * 并插入那里。在这种情况下，声明视图将是 AppComponent ，但插入视图将是 SomeComp
   * 。当我们删除视图时，我们会希望遍历插入视图以清理侦听器。当我们在变更检测期间调用模板函数时，我们需要声明视图来获取继承的上下文。
   *
   */
  [DECLARATION_VIEW]: LView|null;


  /**
   * Points to the declaration component view, used to track transplanted `LView`s.
   *
   * 指向声明组件视图，用于跟踪移植的 `LView` 。
   *
   * See: `DECLARATION_VIEW` which points to the actual `LView` where it was declared, whereas
   * `DECLARATION_COMPONENT_VIEW` points to the component which may not be same as
   * `DECLARATION_VIEW`.
   *
   * 请参阅： DECLARATION_VIEW 指向了 `DECLARATION_VIEW` 它的实际 `LView` ，而
   * `DECLARATION_COMPONENT_VIEW` 指向的组件可能与 `DECLARATION_VIEW` 不同。
   *
   * Example:
   *
   * 示例：
   *
   * ```
   * <#VIEW #myComp>
   *  <div *ngIf="true">
   *   <ng-template #myTmpl>...</ng-template>
   *  </div>
   * </#VIEW>
   * ```
   *
   * In the above case `DECLARATION_VIEW` for `myTmpl` points to the `LView` of `ngIf` whereas
   * `DECLARATION_COMPONENT_VIEW` points to `LView` of the `myComp` which owns the template.
   *
   * 在上述情况下，`DECLARATION_VIEW` 的 `myTmpl` 指向 `LView` 的 `ngIf` ，而
   * `DECLARATION_COMPONENT_VIEW` 指向拥有模板的 `LView` 的 `myComp` 。
   *
   * The reason for this is that all embedded views are always check-always whereas the component
   * view can be check-always or on-push. When we have a transplanted view it is important to
   * determine if we have transplanted a view from check-always declaration to on-push insertion
   * point. In such a case the transplanted view needs to be added to the `LContainer` in the
   * declared `LView` and CD during the declared view CD (in addition to the CD at the insertion
   * point.) (Any transplanted views which are intra Component are of no interest because the CD
   * strategy of declaration and insertion will always be the same, because it is the same
   * component.)
   *
   * 原因是所有嵌入式视图始终是 check-always ，而组件视图可以是 check-always 或 on-push
   * 。当我们有移植的视图时，重要的是要确定我们是否已将视图从 check-always 声明移植到了 on-push
   * 插入点。在这种情况下，移植的视图需要在声明的视图 CD 期间添加到声明的 `LContainer` 中的 `LView`
   * 和 CD（除了插入点处的 CD。）（任何组件内的移植视图都是不感兴趣的，因为声明和插入的 CD
   * 策略将始终相同，因为它是同一个组件。）
   *
   * Queries already track moved views in `LView[DECLARATION_LCONTAINER]` and
   * `LContainer[MOVED_VIEWS]`. However the queries also track `LView`s which moved within the same
   * component `LView`. Transplanted views are a subset of moved views, and we use
   * `DECLARATION_COMPONENT_VIEW` to differentiate them. As in this example.
   *
   * 查询已经跟踪 LView\[DECLARATION_LCONTAINER `LView[DECLARATION_LCONTAINER]` 和
   * `LContainer[MOVED_VIEWS]` 中移动的视图。但是，查询还会跟踪在同一个组件 `LView` 中移动的 `LView`
   * 。移植的视图是移动视图的子集，我们使用 `DECLARATION_COMPONENT_VIEW` 来区分它们。与此示例一样。
   *
   * Example showing intra component `LView` movement.
   *
   * 显示组件内 `LView` 移动的示例。
   *
   * ```
   * <#VIEW #myComp>
   *   <div *ngIf="condition; then thenBlock else elseBlock"></div>
   *   <ng-template #thenBlock>Content to render when condition is true.</ng-template>
   *   <ng-template #elseBlock>Content to render when condition is false.</ng-template>
   * </#VIEW>
   * ```
   *
   * The `thenBlock` and `elseBlock` is moved but not transplanted.
   *
   * `thenBlock` 和 `elseBlock` 被移动但不会移植。
   *
   * Example showing inter component `LView` movement (transplanted view).
   *
   * 显示组件间 `LView` 移动的示例（移植视图）。
   *
   * ```
   * <#VIEW #myComp>
   *   <ng-template #myTmpl>...</ng-template>
   *   <insertion-component [template]="myTmpl"></insertion-component>
   * </#VIEW>
   * ```
   *
   * In the above example `myTmpl` is passed into a different component. If `insertion-component`
   * instantiates `myTmpl` and `insertion-component` is on-push then the `LContainer` needs to be
   * marked as containing transplanted views and those views need to be CD as part of the
   * declaration CD.
   *
   * 在上面的示例中，`myTmpl` 被传递给不同的组件。如果 insernate `insertion-component` 实例化
   * `myTmpl` 并且 insert `insertion-component` 是 on-push ，则 `LContainer`
   * 需要标记为包含移植的视图，并且这些视图需要是 CD，作为声明 CD 的一部分。
   *
   * When change detection runs, it iterates over `[MOVED_VIEWS]` and CDs any child `LView`s where
   * the `DECLARATION_COMPONENT_VIEW` of the current component and the child `LView` does not match
   * (it has been transplanted across components.)
   *
   * 当变更检测运行时，它会迭代 `[MOVED_VIEWS]` 并 CD 记录当前组件的 `DECLARATION_COMPONENT_VIEW`
   * 与子 `LView` 不匹配的任何子 `LView`（它已被跨组件移植。）
   *
   * Note: `[DECLARATION_COMPONENT_VIEW]` points to itself if the LView is a component view (the
   *       simplest / most common case).
   *
   * 注意：如果 LView 是组件视图，则 `[DECLARATION_COMPONENT_VIEW]`
   * 指向自身（最简单/最常见的情况）。
   *
   * see also:
   *
   * 另请参阅：
   *
   * - <https://hackmd.io/@mhevery/rJUJsvv9H> write up of the problem
   *
   *   <https://hackmd.io/@mhevery/rJUJsvv9H>写下问题
   *
   * - `LContainer[HAS_TRANSPLANTED_VIEWS]` which marks which `LContainer` has transplanted views.
   *
   *   `LContainer[HAS_TRANSPLANTED_VIEWS]` ，它标记了哪些 `LContainer` 移植了视图。
   *
   * - `LContainer[TRANSPLANT_HEAD]` and `LContainer[TRANSPLANT_TAIL]` storage for transplanted
   *
   *   `LContainer[TRANSPLANT_HEAD]` 和 `LContainer[TRANSPLANT_TAIL]` 存储，用于移植
   *
   * - `LView[DECLARATION_LCONTAINER]` similar problem for queries
   *
   *   `LView[DECLARATION_LCONTAINER]` 的查询类似问题
   *
   * - `LContainer[MOVED_VIEWS]` similar problem for queries
   *
   *   `LContainer[MOVED_VIEWS]` 查询的类似问题
   *
   */
  [DECLARATION_COMPONENT_VIEW]: LView;

  /**
   * A declaration point of embedded views (ones instantiated based on the content of a
   * <ng-template>), null for other types of views.
   *
   * 嵌入式视图的声明点（基于<ng-template>)，对于其他类型的视图，为 null 。
   *
   * We need to track all embedded views created from a given declaration point so we can prepare
   * query matches in a proper order (query matches are ordered based on their declaration point and
   * _not_ the insertion point).
   *
   * 我们需要跟踪从给定声明点创建的所有嵌入式视图，以便我们可以按正确的顺序准备查询匹配（查询匹配是根据它们的声明点而
   * _ 不是 _ 插入点排序）。
   *
   */
  [DECLARATION_LCONTAINER]: LContainer|null;

  /**
   * More flags for this view. See PreOrderHookFlags for more info.
   *
   * 此视图的更多标志。有关更多信息，请参阅 PreOrderHookFlags 。
   *
   */
  [PREORDER_HOOK_FLAGS]: PreOrderHookFlags;

  /**
   * The number of direct transplanted views which need a refresh or have descendants themselves
   * that need a refresh but have not marked their ancestors as Dirty. This tells us that during
   * change detection we should still descend to find those children to refresh, even if the parents
   * are not `Dirty`/`CheckAlways`.
   *
   * 需要刷新或有后代本身需要刷新但尚未将其祖先标记为“脏”的直接移植视图的数量。这告诉我们，在变更检测期间，我们仍然应该下降以查找这些要刷新的子项，即使父级不是
   * `Dirty` / `CheckAlways` 。
   *
   */
  [TRANSPLANTED_VIEWS_TO_REFRESH]: number;

  /**
   * Unique ID of the view. Used for `__ngContext__` lookups in the `LView` registry.
   *
   * 视图的唯一 ID。用于 `LView` 注册表中的 `__ngContext__` 查找。
   *
   */
  [ID]: number;

  /**
   * Optional injector assigned to embedded views that takes
   * precedence over the element and module injectors.
   *
   * 分配给嵌入式视图的可选注入器，它优先于元素和模块注入器。
   *
   */
  readonly[EMBEDDED_VIEW_INJECTOR]: Injector|null;
}

/**
 * Flags associated with an LView (saved in LView[FLAGS])
 *
 * 与 LView 关联的标志（保存在 LView [FLAGS][FLAGS]中）
 *
 */
export const enum LViewFlags {
  /**
   * The state of the init phase on the first 2 bits
   *
   * 前 2 位上的初始化阶段的状态
   *
   */
  InitPhaseStateIncrementer = 0b00000000001,
  InitPhaseStateMask = 0b00000000011,

  /**
   * Whether or not the view is in creationMode.
   *
   * 视图是否处于 CreationMode 。
   *
   * This must be stored in the view rather than using `data` as a marker so that
   * we can properly support embedded views. Otherwise, when exiting a child view
   * back into the parent view, `data` will be defined and `creationMode` will be
   * improperly reported as false.
   *
   * 这必须存储在视图中，而不是使用 `data`
   * 作为标记，以便我们可以正确支持嵌入式视图。否则，当退出子视图回到父视图时，将定义 `data` ，并且
   * `creationMode` 将被错误地报告为 false。
   *
   */
  CreationMode = 0b00000000100,

  /**
   * Whether or not this LView instance is on its first processing pass.
   *
   * 此 LView 实例是否处于其第一个处理过程。
   *
   * An LView instance is considered to be on its "first pass" until it
   * has completed one creation mode run and one update mode run. At this
   * time, the flag is turned off.
   *
   * LView
   * 实例被认为处于其“第一次通过”，直到它完成了一次创建模式运行和一次更新模式运行。此时，标志被关闭。
   *
   */
  FirstLViewPass = 0b00000001000,

  /**
   * Whether this view has default change detection strategy (checks always) or onPush
   *
   * 此视图是否具有默认的变更检测策略（始终检查）或 onPush
   *
   */
  CheckAlways = 0b00000010000,

  /**
   * Whether or not this view is currently dirty (needing check)
   *
   * 此视图当前是否是脏的（需要检查）
   *
   */
  Dirty = 0b00000100000,

  /**
   * Whether or not this view is currently attached to change detection tree.
   *
   * 此视图当前是否附加到变更检测树。
   *
   */
  Attached = 0b000001000000,

  /**
   * Whether or not this view is destroyed.
   *
   * 此视图是否被破坏。
   *
   */
  Destroyed = 0b000010000000,

  /**
   * Whether or not this view is the root view
   *
   * 此视图是否是根视图
   *
   */
  IsRoot = 0b000100000000,

  /**
   * Whether this moved LView was needs to be refreshed at the insertion location because the
   * declaration was dirty.
   *
   * 此移动的 LView 是否需要在插入位置刷新，因为声明是脏的。
   *
   */
  RefreshTransplantedView = 0b001000000000,

  /**
   * Indicates that the view **or any of its ancestors** have an embedded view injector.
   *
   * 表明视图**或其任何祖先**具有嵌入式视图注入器。
   *
   */
  HasEmbeddedViewInjector = 0b0010000000000,

  /**
   * Index of the current init phase on last 21 bits
   *
   * 最后 21 位上当前初始化阶段的索引
   *
   */
  IndexWithinInitPhaseIncrementer = 0b0100000000000,
  IndexWithinInitPhaseShift = 11,
  IndexWithinInitPhaseReset = 0b0011111111111,
}

/**
 * Possible states of the init phase:
 *
 * init 阶段的可能状态：
 *
 * - 00: OnInit hooks to be run.
 *
 *   00：要运行的 OnInit 钩子。
 *
 * - 01: AfterContentInit hooks to be run
 *
 *   01：要运行的 AfterContentInit 钩子
 *
 * - 10: AfterViewInit hooks to be run
 *
 *   10：要运行的 AfterViewInit 钩子
 *
 * - 11: All init hooks have been run
 *
 *   11：所有初始化钩子都已运行
 *
 */
export const enum InitPhaseState {
  OnInitHooksToBeRun = 0b00,
  AfterContentInitHooksToBeRun = 0b01,
  AfterViewInitHooksToBeRun = 0b10,
  InitPhaseCompleted = 0b11,
}

/**
 * More flags associated with an LView (saved in LView[PREORDER_HOOK_FLAGS])
 *
 * 与 LView 关联的更多标志（保存在 LView [PREORDER_HOOK_FLAGS][PREORDER_HOOK_FLAGS]中）
 *
 */
export const enum PreOrderHookFlags {
  /**
   * The index of the next pre-order hook to be called in the hooks array, on the first 16
   *      bits
   *
   * hooks 数组中要调用的下一个预购钩子的索引，在前 16 位上
   *
   */
  IndexOfTheNextPreOrderHookMaskMask = 0b01111111111111111,

  /**
   * The number of init hooks that have already been called, on the last 16 bits
   *
   * 已调用的初始化钩子数，在最后 16 位
   *
   */
  NumberOfInitHooksCalledIncrementer = 0b010000000000000000,
  NumberOfInitHooksCalledShift = 16,
  NumberOfInitHooksCalledMask = 0b11111111111111110000000000000000,
}

/**
 * Stores a set of OpCodes to process `HostBindingsFunction` associated with a current view.
 *
 * 存储一组 OpCode 以处理与当前视图关联的 `HostBindingsFunction` 。
 *
 * In order to invoke `HostBindingsFunction` we need:
 * 1\. 'elementIdx`: Index to the element associated with the`HostBindingsFunction`.
 * 2. 'directiveIdx`: Index to the directive associated with the `HostBindingsFunction`. (This will
 *    become the context for the `HostBindingsFunction` invocation.)
 * 3\. `bindingRootIdx`: Location where the bindings for the `HostBindingsFunction` start.
 * Internally `HostBindingsFunction` binding indexes start from `0` so we need to add
 * `bindingRootIdx` to it. 4\. `HostBindingsFunction`: A host binding function to execute.
 *
 * 为了调用 `HostBindingsFunction` ，我们需要： 1. 'elementIdx `: Index to the element associated
 * with the` 索引 `. 2. 'directiveIdx` ：与 `HostBindingsFunction` 关联的指令的索引。（这将成为
 * `HostBindingsFunction` 调用的上下文。）3. `bindingRootIdx` ： `HostBindingsFunction`
 * 绑定的开始位置。在内部 `HostBindingsFunction` 绑定索引从 `0` 开始，因此我们需要向它添加
 * `bindingRootIdx` 。 4. `HostBindingsFunction` ：要执行的主机绑定函数。
 *
 * The above information needs to be encoded into the `HostBindingOpCodes` in an efficient manner.
 *
 * 上述信息需要以高效的方式编码到 `HostBindingOpCodes` 中。
 *
 * 1. `elementIdx` is encoded into the `HostBindingOpCodes` as `~elementIdx` (so a negative number);
 *
 *    `elementIdx` 被编码为 `HostBindingOpCodes` 为 `~elementIdx`（因此是负数）；
 *
 * 2. `directiveIdx`
 *
 * 3. `bindingRootIdx`
 *
 * 4. `HostBindingsFunction` is passed in as is.
 *
 *    `HostBindingsFunction` 是按原样传入的。
 *
 * The `HostBindingOpCodes` array contains:
 *
 * `HostBindingOpCodes` 数组包含：
 *
 * - negative number to select the element index.
 *
 *   负数以选择元素索引。
 *
 * - followed by 1 or more of:
 *
 *   后跟 1 或多个：
 *
 *   - a number to select the directive index
 *
 *     选择指令索引的数字
 *
 *   - a number to select the bindingRoot index
 *
 *     选择 bindingRoot 索引的数字
 *
 *   - and a function to invoke.
 *
 *     和要调用的函数。
 *
 * ## Example
 *
 * ## 例子
 *
 * ```
 * const hostBindingOpCodes = [
 *   ~30,                               // Select element 30
 *   40, 45, MyDir.ɵdir.hostBindings    // Invoke host bindings on MyDir on element 30;
 *                                      // directiveIdx = 40; bindingRootIdx = 45;
 *   50, 55, OtherDir.ɵdir.hostBindings // Invoke host bindings on OtherDire on element 30
 *                                      // directiveIdx = 50; bindingRootIdx = 55;
 * ]
 * ```
 *
 * ## Pseudocode
 *
 * ## 伪代码
 *
 * ```
 * const hostBindingOpCodes = tView.hostBindingOpCodes;
 * if (hostBindingOpCodes === null) return;
 * for (let i = 0; i < hostBindingOpCodes.length; i++) {
 *   const opCode = hostBindingOpCodes[i] as number;
 *   if (opCode < 0) {
 *     // Negative numbers are element indexes.
 *     setSelectedIndex(~opCode);
 *   } else {
 *     // Positive numbers are NumberTuple which store bindingRootIndex and directiveIndex.
 *     const directiveIdx = opCode;
 *     const bindingRootIndx = hostBindingOpCodes[++i] as number;
 *     const hostBindingFn = hostBindingOpCodes[++i] as HostBindingsFunction<any>;
 *     setBindingRootForHostBindings(bindingRootIndx, directiveIdx);
 *     const context = lView[directiveIdx];
 *     hostBindingFn(RenderFlags.Update, context);
 *   }
 * }
 * ```
 *
 */
export interface HostBindingOpCodes extends Array<number|HostBindingsFunction<any>> {
  __brand__: 'HostBindingOpCodes';
  debug?: string[];
}

/**
 * Explicitly marks `TView` as a specific type in `ngDevMode`
 *
 * 在 `ngDevMode` `TView` 式标记为特定类型
 *
 * It is useful to know conceptually what time of `TView` we are dealing with when
 * debugging an application (even if the runtime does not need it.) For this reason
 * we store this information in the `ngDevMode` `TView` and than use it for
 * better debugging experience.
 *
 * 在调试应用程序时，从概念上了解我们正在处理的 `TView`
 * 的什么时间会很有用（即使运行时不需要它）。因此，我们将此类信息存储在 `ngDevMode` `TView`
 * 中，而不是用它来获得更好的调试体验。
 *
 */
export const enum TViewType {
  /**
   * Root `TView` is the used to bootstrap components into. It is used in conjunction with
   * `LView` which takes an existing DOM node not owned by Angular and wraps it in `TView`/`LView`
   * so that other components can be loaded into it.
   *
   * 根 `TView` 用于引导组件进入。它与 LView 结合使用，`LView` 会采用不属于 Angular 的现有 DOM
   * 节点并将其包装在 `TView` / `LView` 中，以便可以将其他组件加载到其中。
   *
   */
  Root = 0,

  /**
   * `TView` associated with a Component. This would be the `TView` directly associated with the
   * component view (as opposed an `Embedded` `TView` which would be a child of `Component` `TView`)
   *
   * 与组件关联的 `TView` 。这将是与组件视图直接关联的 `TView`（而不是作为 `Component` `TView`
   * 的子项的 `Embedded` `TView`）
   *
   */
  Component = 1,

  /**
   * `TView` associated with a template. Such as `*ngIf`, `<ng-template>` etc... A `Component`
   * can have zero or more `Embedded` `TView`s.
   *
   * 与模板关联的 `TView` 。例如 `*ngIf`、`<ng-template>` 等……一个 `Component` 可以有零个或多个
   * `Embedede` `TView` 。
   *
   */
  Embedded = 2,
}

/**
 * Converts `TViewType` into human readable text.
 * Make sure this matches with `TViewType`
 *
 * 将 `TViewType` 转换为人类可读的文本。确保这与 `TViewType`
 *
 */
export const TViewTypeAsString = [
  'Root',       // 0
  'Component',  // 1
  'Embedded',   // 2
] as const;


/**
 * The static data for an LView (shared between all templates of a
 * given type).
 *
 * LView 的静态数据（在给定类型的所有模板之间共享）。
 *
 * Stored on the `ComponentDef.tView`.
 *
 * 存储在 `ComponentDef.tView` 上。
 *
 */
export interface TView {
  /**
   * Type of `TView` (`Root`\|`Component`\|`Embedded`).
   *
   * `TView` 的类型（`Root` \| `Component` \| `Embedded`）。
   *
   */
  type: TViewType;

  /**
   * This is a blueprint used to generate LView instances for this TView. Copying this
   * blueprint is faster than creating a new LView from scratch.
   *
   * 这是用于为此 TView 生成 LView 实例的蓝图。复制此蓝图比从头创建新的 LView 快。
   *
   */
  blueprint: LView;

  /**
   * The template function used to refresh the view of dynamically created views
   * and components. Will be null for inline views.
   *
   * 用于刷新动态创建的视图和组件的视图的模板函数。对于内联视图，将为 null 。
   *
   */
  template: ComponentTemplate<{}>|null;

  /**
   * A function containing query-related instructions.
   *
   * 包含与查询相关的指令的函数。
   *
   */
  viewQuery: ViewQueriesFunction<{}>|null;

  /**
   * A `TNode` representing the declaration location of this `TView` (not part of this TView).
   *
   * 一个 `TNode` ，表示此 `TView` 的声明位置（不属于此 TView）。
   *
   */
  declTNode: TNode|null;

  // FIXME(misko): Why does `TView` not have `declarationTView` property?

  /**
   * Whether or not this template has been processed in creation mode.
   *
   * 此模板是否已在创建模式下处理。
   *
   */
  firstCreatePass: boolean;

  /**
   * Whether or not this template has been processed in update mode (e.g. change detected)
   *
   * 此模板是否已在更新模式下处理（例如检测到更改）
   *
   * `firstUpdatePass` is used by styling to set up `TData` to contain metadata about the styling
   * instructions. (Mainly to build up a linked list of styling priority order.)
   *
   * 样式化使用 `firstUpdatePass` 来设置 `TData` 以包含有关样式说明的元数据。
   *（主要是为了构建样式优先级的链表。）
   *
   * Typically this function gets cleared after first execution. If exception is thrown then this
   * flag can remain turned un until there is first successful (no exception) pass. This means that
   * individual styling instructions keep track of if they have already been added to the linked
   * list to prevent double adding.
   *
   * 通常，此函数在第一次执行后会被清除。如果抛出异常，则此标志可以保持为 un
   * ，直到第一次成功（无异常）通过。这意味着单个样式指令会跟踪它们是否已添加到链表中以防止重复添加。
   *
   */
  firstUpdatePass: boolean;

  /**
   * Static data equivalent of LView.data\[]. Contains TNodes, PipeDefInternal or TI18n.
   *
   * 等效于 LView.data\[] 的静态数据。包含 TNodes、PipeDefInternal 或 TI18n。
   *
   */
  data: TData;

  /**
   * The binding start index is the index at which the data array
   * starts to store bindings only. Saving this value ensures that we
   * will begin reading bindings at the correct point in the array when
   * we are in update mode.
   *
   * 绑定开始索引是数据数组开始仅存储绑定的索引。保存此值可确保我们处于更新模式时，将在数组中的正确点开始读取绑定。
   *
   * \-1 means that it has not been initialized.
   *
   * \-1 意味着它尚未被初始化。
   *
   */
  bindingStartIndex: number;

  /**
   * The index where the "expando" section of `LView` begins. The expando
   * section contains injectors, directive instances, and host binding values.
   * Unlike the "decls" and "vars" sections of `LView`, the length of this
   * section cannot be calculated at compile-time because directives are matched
   * at runtime to preserve locality.
   *
   * `LView` 的“expando”部分开始的索引。 expando 部分包含注入器、指令实例和主机绑定值。与 LView 的“
   * `LView` ”和“vars”部分不同，本节的长度无法在编译时计算，因为指令是在运行时匹配以保留局部性。
   *
   * We store this start index so we know where to start checking host bindings
   * in `setHostBindings`.
   *
   * 我们存储此开始索引，以便知道从哪里开始检查 `setHostBindings` 中的主机绑定。
   *
   */
  expandoStartIndex: number;

  /**
   * Whether or not there are any static view queries tracked on this view.
   *
   * 在此视图上是否跟踪到任何静态视图查询。
   *
   * We store this so we know whether or not we should do a view query
   * refresh after creation mode to collect static query results.
   *
   * 我们存储它，以便知道我们是否应该在创建模式后进行视图查询刷新以收集静态查询结果。
   *
   */
  staticViewQueries: boolean;

  /**
   * Whether or not there are any static content queries tracked on this view.
   *
   * 在此视图上是否跟踪到任何静态内容查询。
   *
   * We store this so we know whether or not we should do a content query
   * refresh after creation mode to collect static query results.
   *
   * 我们存储它是为了知道我们是否应该在创建模式后进行内容查询刷新以收集静态查询结果。
   *
   */
  staticContentQueries: boolean;

  /**
   * A reference to the first child node located in the view.
   *
   * 对位于视图中的第一个子节点的引用。
   *
   */
  firstChild: TNode|null;

  /**
   * Stores the OpCodes to be replayed during change-detection to process the `HostBindings`
   *
   * 存储要在变更检测期间重放的 OpCodes 以处理 `HostBindings`
   *
   * See `HostBindingOpCodes` for encoding details.
   *
   * 有关编码的详细信息，请参阅 `HostBindingOpCodes` 。
   *
   */
  hostBindingOpCodes: HostBindingOpCodes|null;

  /**
   * Full registry of directives and components that may be found in this view.
   *
   * 可以在此视图中找到的指令和组件的完整注册表。
   *
   * It's necessary to keep a copy of the full def list on the TView so it's possible
   * to render template functions without a host component.
   *
   * 有必要在 TView 上保留完整的 def 列表的副本，以便在没有主机组件的情况下呈现模板函数。
   *
   */
  directiveRegistry: DirectiveDefList|null;

  /**
   * Full registry of pipes that may be found in this view.
   *
   * 可以在此视图中找到的管道的完整注册表。
   *
   * The property is either an array of `PipeDefs`s or a function which returns the array of
   * `PipeDefs`s. The function is necessary to be able to support forward declarations.
   *
   * 该属性是 `PipeDefs` s 的数组或返回 `PipeDefs` s 数组的函数。该函数是支持前向声明所必需的。
   *
   * It's necessary to keep a copy of the full def list on the TView so it's possible
   * to render template functions without a host component.
   *
   * 有必要在 TView 上保留完整的 def 列表的副本，以便在没有主机组件的情况下呈现模板函数。
   *
   */
  pipeRegistry: PipeDefList|null;

  /**
   * Array of ngOnInit, ngOnChanges and ngDoCheck hooks that should be executed for this view in
   * creation mode.
   *
   * 在创建模式下应该为此视图执行的 ngOnInit、ngOnChanges 和 ngDoCheck 钩子数组。
   *
   * This array has a flat structure and contains TNode indices, directive indices (where an
   * instance can be found in `LView`) and hook functions. TNode index is followed by the directive
   * index and a hook function. If there are multiple hooks for a given TNode, the TNode index is
   * not repeated and the next lifecycle hook information is stored right after the previous hook
   * function. This is done so that at runtime the system can efficiently iterate over all of the
   * functions to invoke without having to make any decisions/lookups.
   *
   * 该数组具有平面结构，并包含 TNode 索引、指令索引（可以在 `LView` 中找到实例）和钩子函数。 TNode
   * 索引后面是指令索引和一个钩子函数。如果给定 TNode 有多个钩子，则不会重复 TNode
   * 索引，并且下一个生命周期钩子信息会在前一个钩子函数之后立即存储。这样做是为了在运行时，系统可以有效地迭代要调用的所有函数，而无需做出任何决策/查找。
   *
   */
  preOrderHooks: HookData|null;

  /**
   * Array of ngOnChanges and ngDoCheck hooks that should be executed for this view in update mode.
   *
   * 在更新模式下应该为此视图执行的 ngOnChanges 和 ngDoCheck 钩子数组。
   *
   * This array has the same structure as the `preOrderHooks` one.
   *
   * 此数组具有与 `preOrderHooks` 数组相同的结构。
   *
   */
  preOrderCheckHooks: HookData|null;

  /**
   * Array of ngAfterContentInit and ngAfterContentChecked hooks that should be executed
   * for this view in creation mode.
   *
   * 在创建模式下应该为此视图执行的 ngAfterContentInit 和 ngAfterContentChecked 钩子数组。
   *
   * Even indices: Directive index
   * Odd indices: Hook function
   *
   * 偶数索引：指令索引 奇数索引：挂钩函数
   *
   */
  contentHooks: HookData|null;

  /**
   * Array of ngAfterContentChecked hooks that should be executed for this view in update
   * mode.
   *
   * 在更新模式下应该为此视图执行的 ngAfterContentChecked 钩子数组。
   *
   * Even indices: Directive index
   * Odd indices: Hook function
   *
   * 偶数索引：指令索引 奇数索引：挂钩函数
   *
   */
  contentCheckHooks: HookData|null;

  /**
   * Array of ngAfterViewInit and ngAfterViewChecked hooks that should be executed for
   * this view in creation mode.
   *
   * 在创建模式下应该为此视图执行的 ngAfterViewInit 和 ngAfterViewChecked 钩子数组。
   *
   * Even indices: Directive index
   * Odd indices: Hook function
   *
   * 偶数索引：指令索引 奇数索引：挂钩函数
   *
   */
  viewHooks: HookData|null;

  /**
   * Array of ngAfterViewChecked hooks that should be executed for this view in
   * update mode.
   *
   * 在更新模式下应该为此视图执行的 ngAfterViewChecked 钩子数组。
   *
   * Even indices: Directive index
   * Odd indices: Hook function
   *
   * 偶数索引：指令索引 奇数索引：挂钩函数
   *
   */
  viewCheckHooks: HookData|null;

  /**
   * Array of ngOnDestroy hooks that should be executed when this view is destroyed.
   *
   * 此视图被销毁时应该执行的 ngOnDestroy 钩子数组。
   *
   * Even indices: Directive index
   * Odd indices: Hook function
   *
   * 偶数索引：指令索引 奇数索引：挂钩函数
   *
   */
  destroyHooks: DestroyHookData|null;

  /**
   * When a view is destroyed, listeners need to be released and outputs need to be
   * unsubscribed. This cleanup array stores both listener data (in chunks of 4)
   * and output data (in chunks of 2) for a particular view. Combining the arrays
   * saves on memory (70 bytes per array) and on a few bytes of code size (for two
   * separate for loops).
   *
   * 当视图被销毁时，需要释放侦听器并需要退订输出。此清理数组存储特定视图的侦听器数据（以 4
   * 为块）和输出数据（以 2 为块）。组合这些数组可以节省内存（每个数组 70
   * 字节）和几个字节的代码大小（对于两个单独的 for 循环）。
   *
   * If it's a native DOM listener or output subscription being stored:
   * 1st index is: event name  `name = tView.cleanup[i+0]`
   * 2nd index is: index of native element or a function that retrieves global target (window,
   *               document or body) reference based on the native element:
   *    `typeof idxOrTargetGetter === 'function'`: global target getter function
   *    `typeof idxOrTargetGetter === 'number'`: index of native element
   *
   * 如果是本机 DOM 侦听器或正在存储的输出订阅：第一个索引是：事件名称 `name = tView.cleanup[i+0]`
   * 第二个索引是：本机元素或检索全局目标（窗口、文档或正文）的函数的索引基于本机元素的引用：
   * `typeof idxOrTargetGetter === 'function'` ：全局目标 getter 函数 `typeof idxOrTargetGetter ===
   * 'number'` ：本机元素的索引
   *
   * 3rd index is: index of listener function `listener = lView[CLEANUP][tView.cleanup[i+2]]`
   * 4th index is: `useCaptureOrIndx = tView.cleanup[i+3]`
   *    `typeof useCaptureOrIndx == 'boolean' : useCapture boolean`typeof useCaptureOrIndx ==
   * 'number': `useCaptureOrIndx >= 0` `removeListener = LView[CLEANUP][useCaptureOrIndx]`
   *         `useCaptureOrIndx <  0` `subscription = LView[CLEANUP][-useCaptureOrIndx]`
   *
   * 第三个索引是：侦听器函数的索引 `listener = lView[CLEANUP][tView.cleanup[i+2]]` 第四个索引是：
   * `useCaptureOrIndx = tView.cleanup[i+3]` `typeof useCaptureOrIndx == 'boolean' : useCapture
   * boolean` typeof useCaptureOrIndx == 'number': `useCaptureOrIndx >= 0` `removeListener =
   * LView[CLEANUP][useCaptureOrIndx]` `useCaptureOrIndx < 0` `subscription =
   * LView[CLEANUP][-useCaptureOrIndx]`
   *
   * If it's an output subscription or query list destroy hook:
   * 1st index is: output unsubscribe function / query list destroy function
   * 2nd index is: index of function context in LView.cleanupInstances\[]
   *               `tView.cleanup[i+0].call(lView[CLEANUP][tView.cleanup[i+1]])`
   *
   * 如果是输出订阅或查询列表销毁钩子：第一个索引是：输出取消订阅函数/查询列表销毁函数第二个索引是：
   * LView.cleanupInstances\[] `tView.cleanup[i+0].call(lView[CLEANUP][tView.cleanup[i+1]])`
   *
   */
  cleanup: any[]|null;

  /**
   * A list of element indices for child components that will need to be
   * refreshed when the current view has finished its check. These indices have
   * already been adjusted for the HEADER_OFFSET.
   *
   * 当前视图完成检查时需要刷新的子组件的元素索引列表。这些索引已经针对 HEADER_OFFSET 进行了调整。
   *
   */
  components: number[]|null;

  /**
   * A collection of queries tracked in a given view.
   *
   * 在给定视图中跟踪的查询的集合。
   *
   */
  queries: TQueries|null;

  /**
   * An array of indices pointing to directives with content queries alongside with the
   * corresponding query index. Each entry in this array is a tuple of:
   *
   * 指向具有内容查询的指令以及相应的查询索引的索引数组。此数组中的每个条目都是以下内容的元组：
   *
   * - index of the first content query index declared by a given directive;
   *
   *   给定指令声明的第一个内容查询索引的索引；
   *
   * - index of a directive.
   *
   *   指令的索引。
   *
   * We are storing those indexes so we can refresh content queries as part of a view refresh
   * process.
   *
   * 我们正在存储这些索引，以便我们可以在视图刷新过程中刷新内容查询。
   *
   */
  contentQueries: number[]|null;

  /**
   * Set of schemas that declare elements to be allowed inside the view.
   *
   * 声明要在视图中允许的元素的模式集。
   *
   */
  schemas: SchemaMetadata[]|null;

  /**
   * Array of constants for the view. Includes attribute arrays, local definition arrays etc.
   * Used for directive matching, attribute bindings, local definitions and more.
   *
   * 视图的常量数组。包括属性数组、本地定义数组等。用于指令匹配、属性绑定、本地定义等。
   *
   */
  consts: TConstants|null;

  /**
   * Indicates that there was an error before we managed to complete the first create pass of the
   * view. This means that the view is likely corrupted and we should try to recover it.
   *
   * 表明在我们设法完成视图的第一个创建过程之前出现了错误。这意味着视图可能已损坏，我们应该尝试恢复它。
   *
   */
  incompleteFirstPass: boolean;
}

/** Single hook callback function. */
export type HookFn = () => void;

/**
 * Information necessary to call a hook. E.g. the callback that
 * needs to invoked and the index at which to find its context.
 *
 * 调用钩子所需的信息。例如，需要调用的回调以及要查找其上下文的索引。
 *
 */
export type HookEntry = number|HookFn;

/**
 * Array of hooks that should be executed for a view and their directive indices.
 *
 * 应该为视图及其指令索引执行的钩子数组。
 *
 * For each node of the view, the following data is stored:
 * 1) Node index (optional)
 * 2) A series of number/function pairs where:
 *
 * 对于视图的每个节点，都会存储以下数据：1）节点索引（可选）2）一系列数字/函数对，其中：
 *
 * - even indices are directive indices
 *
 *   甚至索引都是指令索引
 *
 * - odd indices are hook functions
 *
 *   奇数索引是钩子函数
 *
 * Special cases:
 *
 * 特殊情况：
 *
 * - a negative directive index flags an init hook (ngOnInit, ngAfterContentInit, ngAfterViewInit)
 *
 *   负指令索引标记初始化钩子（ngOnInit、ngAfterContentInit、ngAfterViewInit）
 *
 */
export type HookData = HookEntry[];

/**
 * Array of destroy hooks that should be executed for a view and their directive indices.
 *
 * 应该为视图及其指令索引执行的破坏钩子数组。
 *
 * The array is set up as a series of number/function or number/(number|function)\[]:
 *
 * 数组被设置为一系列数字/函数或 number/(number|function)\[]：
 *
 * - Even indices represent the context with which hooks should be called.
 *
 *   甚至索引也表示应该调用钩子的上下文。
 *
 * - Odd indices are the hook functions themselves. If a value at an odd index is an array,
 *     it represents the destroy hooks of a `multi` provider where:
 *       \- Even indices represent the index of the provider for which we've registered a destroy
 * hook, inside of the `multi` provider array.
 *       \- Odd indices are the destroy hook functions.
 *   For example:
 *   LView: `[0, 1, 2, AService, 4, [BService, CService, DService]]`
 *   destroyHooks: `[3, AService.ngOnDestroy, 5, [0, BService.ngOnDestroy, 2,
 * DService.ngOnDestroy]]`
 *
 *   奇数索引是钩子函数本身。如果奇数索引处的值是数组，则它表示 `multi` 提供程序的破坏钩子，其中： -
 * 偶数索引表示我们在 `multi` 提供程序数组中注册了 destroy 钩子的提供程序的索引。 -
 * 奇数索引是破坏钩子函数。例如： LView: `[0, 1, 2, AService, 4, [BService, CService, DService]]`
 * destroyHooks: `[3, AService.ngOnDestroy, 5, [0, BService.ngOnDestroy, 2, DService.ngOnDestroy]]`
 *
 * In the example above `AService` is a type provider with an `ngOnDestroy`, whereas `BService`,
 * `CService` and `DService` are part of a `multi` provider where only `BService` and `DService`
 * have an `ngOnDestroy` hook.
 *
 * 在上面的示例中，`AService` 是带有 `ngOnDestroy` 的类型提供者，而 `BService`、`CService` 和
 * `DService` 是 `multi` 提供者的一部分，其中只有 `BService` 和 `DService` 具有 `ngOnDestroy` 钩子。
 *
 */
export type DestroyHookData = (HookEntry|HookData)[];

/**
 * Static data that corresponds to the instance-specific data array on an LView.
 *
 * 与 LView 上特定于实例的数据数组对应的静态数据。
 *
 * Each node's static data is stored in tData at the same index that it's stored
 * in the data array.  Any nodes that do not have static data store a null value in
 * tData to avoid a sparse array.
 *
 * 每个节点的静态数据都存储在 tData 中，与它存储在数据数组中的索引相同。任何没有静态数据的节点都在
 * tData 中存储 null 值以避免稀疏数组。
 *
 * Each pipe's definition is stored here at the same index as its pipe instance in
 * the data array.
 *
 * 每个管道的定义都存储在与其在数据数组中的管道实例相同的索引处。
 *
 * Each host property's name is stored here at the same index as its value in the
 * data array.
 *
 * 每个主机属性的名称都存储在与其在数据数组中的值相同的索引处。
 *
 * Each property binding name is stored here at the same index as its value in
 * the data array. If the binding is an interpolation, the static string values
 * are stored parallel to the dynamic values. Example:
 *
 * 每个属性绑定名称都存储在与其在数据数组中的值相同的索引处。如果绑定是插值，则静态字符串值与动态值并行存储。示例：
 *
 * id="prefix {{ v0 }} a {{ v1 }} b {{ v2 }} suffix"
 *
 * id="prefix {{ v0 }} a {{ v1 }} b {{ v2 }} 后缀"
 *
 * ## LView       |   TView.data
 *
 *  v0 value   |   'a'
 *  v1 value   |   'b'
 *  v2 value   |   id � prefix � suffix
 *
 * v0 值 | “a” v1 值| “b” v2 值| id � 前缀 � 后缀
 *
 * Injector bloom filters are also stored here.
 *
 * 注入器布隆过滤器也存储在这里。
 *
 */
export type TData = (TNode|PipeDef<any>|DirectiveDef<any>|ComponentDef<any>|number|TStylingRange|
                     TStylingKey|ProviderToken<any>|TI18n|I18nUpdateOpCodes|TIcu|null|string)[];

// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;

/**
 * Human readable version of the `LView`.
 *
 * `LView` 的人类可读版本。
 *
 * `LView` is a data structure used internally to keep track of views. The `LView` is designed for
 * efficiency and so at times it is difficult to read or write tests which assert on its values. For
 * this reason when `ngDevMode` is true we patch a `LView.debug` property which points to
 * `LViewDebug` for easier debugging and test writing. It is the intent of `LViewDebug` to be used
 * in tests.
 *
 * `LView` 是一种在内部使用的数据结构，用于跟踪视图。 `LView`
 * 旨在提高效率，因此有时很难读取或编写对其值进行断言的测试。出于这个原因，当 `ngDevMode` 为 true
 * 时，我们会修补一个指向 `LViewDebug` 的 `LView.debug` 属性，以便于调试和测试编写。 `LViewDebug`
 * 的目的是在测试中使用。
 *
 */
export interface LViewDebug<T = unknown> {
  /**
   * Flags associated with the `LView` unpacked into a more readable state.
   *
   * 与 `LView` 关联的标志已解压缩为更具可读性的状态。
   *
   * See `LViewFlags` for the flag meanings.
   *
   * 有关标志的含义，请参阅 `LViewFlags` 。
   *
   */
  readonly flags: {
    initPhaseState: number,
    creationMode: boolean,
    firstViewPass: boolean,
    checkAlways: boolean,
    dirty: boolean,
    attached: boolean,
    destroyed: boolean,
    isRoot: boolean,
    indexWithinInitPhase: number,
  };

  /**
   * Associated TView
   *
   * 关联的 TView
   *
   */
  readonly tView: TView;

  /**
   * Parent view (or container)
   *
   * 父视图（或容器）
   *
   */
  readonly parent: LViewDebug|LContainerDebug|null;

  /**
   * Next sibling to the `LView`.
   *
   * `LView` 的下一个同级。
   *
   */
  readonly next: LViewDebug|LContainerDebug|null;

  /**
   * The context used for evaluation of the `LView`
   *
   * 用于估算 `LView` 的上下文
   *
   * (Usually the component)
   *
   *（通常是组件）
   *
   */
  readonly context: T;

  /**
   * Hierarchical tree of nodes.
   *
   * 节点的层次树。
   *
   */
  readonly nodes: DebugNode[];

  /**
   * Template structure (no instance data).
   * (Shows how TNodes are connected)
   *
   * 模板结构（无实例数据）。（显示 TNode 的连接方式）
   *
   */
  readonly template: string;

  /**
   * HTML representation of the `LView`.
   *
   * `LView` 的 HTML 表示。
   *
   * This is only approximate to actual HTML as child `LView`s are removed.
   *
   * 这只是近似于实际的 HTML，因为删除了子 `LView` 。
   *
   */
  readonly html: string;

  /**
   * The host element to which this `LView` is attached.
   *
   * 此 `LView` 附加到的主机元素。
   *
   */
  readonly hostHTML: string|null;

  /**
   * Child `LView`s
   *
   * 子 `LView`
   *
   */
  readonly childViews: Array<LViewDebug|LContainerDebug>;

  /**
   * Sub range of `LView` containing decls (DOM elements).
   *
   * 包含 decls（DOM 元素）的 `LView` 的子范围。
   *
   */
  readonly decls: LViewDebugRange;

  /**
   * Sub range of `LView` containing vars (bindings).
   *
   * 包含 vars（绑定）的 `LView` 的子范围。
   *
   */
  readonly vars: LViewDebugRange;

  /**
   * Sub range of `LView` containing expando (used by DI).
   *
   * 包含 expando 的 `LView` 的子范围（供 DI 使用）。
   *
   */
  readonly expando: LViewDebugRange;
}

/**
 * Human readable version of the `LContainer`
 *
 * `LContainer` 的人类可读版本
 *
 * `LContainer` is a data structure used internally to keep track of child views. The `LContainer`
 * is designed for efficiency and so at times it is difficult to read or write tests which assert on
 * its values. For this reason when `ngDevMode` is true we patch a `LContainer.debug` property which
 * points to `LContainerDebug` for easier debugging and test writing. It is the intent of
 * `LContainerDebug` to be used in tests.
 *
 * `LContainer` 是一种在内部使用的数据结构，用于跟踪子视图。 `LContainer`
 * 旨在提高效率，因此有时很难读取或编写根据其值断言的测试。出于这个原因，当 `ngDevMode` 为 true
 * 时，我们会修补一个指向 `LContainerDebug` 的 `LContainer.debug` 属性，以便于调试和测试编写。
 * `LContainerDebug` 的目的是在测试中使用。
 *
 */
export interface LContainerDebug {
  readonly native: RComment;
  /**
   * Child `LView`s.
   *
   * 子 `LView` 。
   *
   */
  readonly views: LViewDebug[];
  readonly parent: LViewDebug|null;
  readonly movedViews: LView[]|null;
  readonly host: RElement|RComment|LView;
  readonly next: LViewDebug|LContainerDebug|null;
  readonly hasTransplantedViews: boolean;
}



/**
 * `LView` is subdivided to ranges where the actual data is stored. Some of these ranges such as
 * `decls` and `vars` are known at compile time. Other such as `i18n` and `expando` are runtime only
 * concepts.
 *
 * `LView` 被细分为存储实际数据的范围。其中一些范围，例如 `decls` 和 `vars`
 * 在编译时是已知的。其他例如 `i18n` 和 `expando` 是仅限运行时的概念。
 *
 */
export interface LViewDebugRange {
  /**
   * The starting index in `LView` where the range begins. (Inclusive)
   *
   * `LView` 中范围开始的起始索引。（含）
   *
   */
  start: number;

  /**
   * The ending index in `LView` where the range ends. (Exclusive)
   *
   * `LView` 中范围结束的结束索引。（不含）
   *
   */
  end: number;

  /**
   * The length of the range
   *
   * 范围的长度
   *
   */
  length: number;

  /**
   * The merged content of the range. `t` contains data from `TView.data` and `l` contains `LView`
   * data at an index.
   *
   * 该范围的合并内容。 `t` 包含来自 `TView.data` 的数据，`l` 包含索引处的 `LView` 数据。
   *
   */
  content: LViewDebugRangeContent[];
}

/**
 * For convenience the static and instance portions of `TView` and `LView` are merged into a single
 * object in `LViewRange`.
 *
 * 为方便起见，`TView` 和 `LView` 的静态部分和实例部分被合并到 `LViewRange` 中的单个对象中。
 *
 */
export interface LViewDebugRangeContent {
  /**
   * Index into original `LView` or `TView.data`.
   *
   * 对原始 `LView` 或 `TView.data` 的索引。
   *
   */
  index: number;

  /**
   * Value from the `TView.data[index]` location.
   *
   * 来自 `TView.data[index]` 位置的值。
   *
   */
  t: any;

  /**
   * Value from the `LView[index]` location.
   *
   * 来自 `LView[index]` 位置的值。
   *
   */
  l: any;
}


/**
 * A logical node which comprise into `LView`s.
 *
 * 组成 `LView` 的逻辑节点。
 *
 */
export interface DebugNode {
  /**
   * HTML representation of the node.
   *
   * 节点的 HTML 表示。
   *
   */
  html: string|null;

  /**
   * Associated `TNode`
   *
   * 关联 `TNode`
   *
   */
  tNode: TNode;

  /**
   * Human readable node type.
   *
   * 人类可读的节点类型。
   *
   */
  type: string;

  /**
   * DOM native node.
   *
   * DOM 本机节点。
   *
   */
  native: Node;

  /**
   * Child nodes
   *
   * 子节点
   *
   */
  children: DebugNode[];

  /**
   * A list of Component/Directive types which need to be instantiated an this location.
   *
   * 需要在此位置实例化的组件/指令类型的列表。
   *
   */
  factories: Type<unknown>[];

  /**
   * A list of Component/Directive instances which were instantiated an this location.
   *
   * 在此位置实例化的 Component/Directive 实例的列表。
   *
   */
  instances: unknown[];

  /**
   * NodeInjector information.
   *
   * NodeInjector 信息。
   *
   */
  injector: NodeInjectorDebug;

  /**
   * Injector resolution path.
   *
   * 注入器解析路径。
   *
   */
  injectorResolutionPath: any;
}

export interface NodeInjectorDebug {
  /**
   * Instance bloom. Does the current injector have a provider with a given bloom mask.
   *
   * 实例绽放。当前的注入器是否有具有给定 bloom 掩码的提供者。
   *
   */
  bloom: string;


  /**
   * Cumulative bloom. Do any of the above injectors have a provider with a given bloom mask.
   *
   * 累积绽放。上述任何注入器是否有具有给定 bloom 掩码的提供者。
   *
   */
  cumulativeBloom: string;

  /**
   * A list of providers associated with this injector.
   *
   * 与此注入器关联的提供者列表。
   *
   */
  providers: (Type<unknown>|DirectiveDef<unknown>|ComponentDef<unknown>)[];

  /**
   * A list of providers associated with this injector visible to the view of the component only.
   *
   * 与此注入器关联的提供程序列表，仅对组件视图可见。
   *
   */
  viewProviders: Type<unknown>[];


  /**
   * Location of the parent `TNode`.
   *
   * 父 `TNode` 的位置。
   *
   */
  parentInjectorIndex: number;
}
