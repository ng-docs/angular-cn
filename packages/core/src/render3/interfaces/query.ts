/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ProviderToken} from '../../di/provider_token';
import {QueryList} from '../../linker/query_list';

import {TNode} from './node';
import {TView} from './view';

/**
 * An object representing query metadata extracted from query annotations.
 *
 * 表示从查询注解中提取的查询元数据的对象。
 *
 */
export interface TQueryMetadata {
  predicate: ProviderToken<unknown>|string[];
  read: any;
  flags: QueryFlags;
}

/**
 * A set of flags to be used with Queries.
 *
 * 要与查询一起使用的一组标志。
 *
 * NOTE: Ensure changes here are reflected in `packages/compiler/src/render3/view/compiler.ts`
 *
 * 注意：确保此处的更改反映在 `packages/compiler/src/render3/view/compiler.ts` 中
 *
 */
export const enum QueryFlags {
  /**
   * No flags
   *
   * 没有标志
   *
   */
  none = 0b0000,

  /**
   * Whether or not the query should descend into children.
   *
   * 查询是否应该下降到子项。
   *
   */
  descendants = 0b0001,

  /**
   * The query can be computed statically and hence can be assigned eagerly.
   *
   * 查询可以静态计算，因此可以立即分配。
   *
   * NOTE: Backwards compatibility with ViewEngine.
   *
   * 注意：与 ViewEngine 的向后兼容。
   *
   */
  isStatic = 0b0010,

  /**
   * If the `QueryList` should fire change event only if actual change to query was computed (vs old
   * behavior where the change was fired whenever the query was recomputed, even if the recomputed
   * query resulted in the same list.)
   *
   * 如果仅在计算了对查询的实际更改时，`QueryList` 应该触发 change
   * 事件（与旧行为相比，每当重新计算查询时都会触发更改，即使重新计算的查询产生了同一个列表。）
   *
   */
  emitDistinctChangesOnly = 0b0100,
}

/**
 * TQuery objects represent all the query-related data that remain the same from one view instance
 * to another and can be determined on the very first template pass. Most notably TQuery holds all
 * the matches for a given view.
 *
 * TQuery
 * 对象表示从一个视图实例到另一个视图实例保持不变的所有与查询相关的数据，并且可以在第一个模板传递时确定。最值得注意的是，TQuery
 * 包含给定视图的所有匹配项。
 *
 */
export interface TQuery {
  /**
   * Query metadata extracted from query annotations.
   *
   * 从查询注解中提取的查询元数据。
   *
   */
  metadata: TQueryMetadata;

  /**
   * Index of a query in a declaration view in case of queries propagated to en embedded view, -1
   * for queries declared in a given view. We are storing this index so we can find a parent query
   * to clone for an embedded view (when an embedded view is created).
   *
   * 在查询传播到嵌入式视图的情况下，声明视图中查询的索引，对于给定视图中声明的查询，为 -1
   * 。我们正在存储此索引，因此我们可以找到要为嵌入式视图克隆的父查询（创建嵌入式视图时）。
   *
   */
  indexInDeclarationView: number;

  /**
   * Matches collected on the first template pass. Each match is a pair of:
   *
   * 在第一个模板传递上收集的匹配项。每场比赛都是一对：
   *
   * - TNode index;
   *
   *   TNode 索引；
   *
   * - match index;
   *
   *   匹配索引；
   *
   * A TNode index can be either:
   *
   * TNode 索引可以是：
   *
   * - a positive number (the most common case) to indicate a matching TNode;
   *
   *   一个正数（最常见的情况），以表明一个匹配的 TNode；
   *
   * - a negative number to indicate that a given query is crossing a <ng-template> element and
   *   results from views created based on TemplateRef should be inserted at this place.
   *
   *   一个负数，以表明给定的查询正在跨越<ng-template>应该在此位置插入基于 TemplateRef
   * 创建的视图的元素和结果。
   *
   * A match index is a number used to find an actual value (for a given node) when query results
   * are materialized. This index can have one of the following values:
   *
   * 匹配索引是在查询结果具体化时用于查找实际值（对于给定节点）的数字。此索引可以有以下值之一：
   *
   * - \-2 - indicates that we need to read a special token (TemplateRef, ViewContainerRef etc.);
   *
   *   \-2 - 表明我们需要读取特殊标记（TemplateRef、ViewContainerRef 等）；
   *
   * - \-1 - indicates that we need to read a default value based on the node type (TemplateRef for
   *   ng-template and ElementRef for other elements);
   *
   *   \-1 - 表明我们需要根据节点类型读取默认值（ng-template 为 TemplateRef ，其他元素为 ElementRef
   *）；
   *
   * - a positive number - index of an injectable to be read from the element injector.
   *
   *   正数 - 要从元素注入器读取的可注入的索引。
   *
   */
  matches: number[]|null;

  /**
   * A flag indicating if a given query crosses an <ng-template> element. This flag exists for
   * performance reasons: we can notice that queries not crossing any <ng-template> elements will
   * have matches from a given view only (and adapt processing accordingly).
   *
   * 指示给定查询是否跨越<ng-template>元素。存在此标志是出于性能原因：我们可以注意到查询不跨越任何<ng-template>元素将仅具有来自给定视图的匹配项（并相应地调整处理）。
   *
   */
  crossesNgTemplate: boolean;

  /**
   * A method call when a given query is crossing an element (or element container). This is where a
   * given TNode is matched against a query predicate.
   *
   * 给定查询跨元素（或元素容器）时的方法调用。这是给定 TNode 与查询谓词匹配的地方。
   *
   * @param tView
   * @param tNode
   */
  elementStart(tView: TView, tNode: TNode): void;

  /**
   * A method called when processing the elementEnd instruction - this is mostly useful to determine
   * if a given content query should match any nodes past this point.
   *
   * 在处理 elementEnd 指令时调用的方法 -
   * 这主要用于确定给定的内容查询是否应该匹配超过此点的任何节点。
   *
   * @param tNode
   */
  elementEnd(tNode: TNode): void;

  /**
   * A method called when processing the template instruction. This is where a
   * given TContainerNode is matched against a query predicate.
   *
   * 处理模板指令时调用的方法。这是给定 TContainerNode 与查询谓词匹配的地方。
   *
   * @param tView
   * @param tNode
   */
  template(tView: TView, tNode: TNode): void;

  /**
   * A query-related method called when an embedded TView is created based on the content of a
   * <ng-template> element. We call this method to determine if a given query should be propagated
   * to the embedded view and if so - return a cloned TQuery for this embedded view.
   *
   * 根据内容创建嵌入式 TView
   * 时调用的与查询相关的方法<ng-template>元素。我们调用此方法来确定给定的查询是否应该传播到嵌入式视图，如果是，则返回此嵌入式视图的克隆
   * TQuery。
   *
   * @param tNode
   * @param childQueryIndex
   */
  embeddedTView(tNode: TNode, childQueryIndex: number): TQuery|null;
}

/**
 * TQueries represent a collection of individual TQuery objects tracked in a given view. Most of the
 * methods on this interface are simple proxy methods to the corresponding functionality on TQuery.
 *
 * TQuery 表示在给定视图中跟踪的单个 TQuery 对象的集合。此接口上的大多数方法都是 TQuery
 * 上相应特性的简单代理方法。
 *
 */
export interface TQueries {
  /**
   * Adds a new TQuery to a collection of queries tracked in a given view.
   *
   * 将新的 TQuery 添加到给定视图中跟踪的查询集合。
   *
   * @param tQuery
   */
  track(tQuery: TQuery): void;

  /**
   * Returns a TQuery instance for at the given index  in the queries array.
   *
   * 返回 query 数组中给定索引处的 TQuery 实例。
   *
   * @param index
   */
  getByIndex(index: number): TQuery;

  /**
   * Returns the number of queries tracked in a given view.
   *
   * 返回给定视图中跟踪的查询数。
   *
   */
  length: number;

  /**
   * A proxy method that iterates over all the TQueries in a given TView and calls the corresponding
   * `elementStart` on each and every TQuery.
   *
   * 一种代理方法，它迭代给定 TView 中的所有 TQueries 并在每个 TQuery 上调用相应的 `elementStart` 。
   *
   * @param tView
   * @param tNode
   */
  elementStart(tView: TView, tNode: TNode): void;

  /**
   * A proxy method that iterates over all the TQueries in a given TView and calls the corresponding
   * `elementEnd` on each and every TQuery.
   *
   * 一种代理方法，它迭代给定 TView 中的所有 TQueries 并在每个 TQuery 上调用相应的 `elementEnd` 。
   *
   * @param tNode
   */
  elementEnd(tNode: TNode): void;

  /**
   * A proxy method that iterates over all the TQueries in a given TView and calls the corresponding
   * `template` on each and every TQuery.
   *
   * 一种代理方法，它迭代给定 TView 中的所有 TQueries 并在每个 TQuery 上调用相应的 `template` 。
   *
   * @param tView
   * @param tNode
   */
  template(tView: TView, tNode: TNode): void;

  /**
   * A proxy method that iterates over all the TQueries in a given TView and calls the corresponding
   * `embeddedTView` on each and every TQuery.
   *
   * 一种代理方法，它迭代给定 TView 中的所有 TQueries 并在每个 TQuery 上调用相应的 `embeddedTView`
   * 。
   *
   * @param tNode
   */
  embeddedTView(tNode: TNode): TQueries|null;
}

/**
 * An interface that represents query-related information specific to a view instance. Most notably
 * it contains:
 *
 * 一个接口，表示特定于视图实例的查询相关信息。最值得注意的是，它包含：
 *
 * - materialized query matches;
 *
 *   物化查询匹配；
 *
 * - a pointer to a QueryList where materialized query results should be reported.
 *
 *   指向应该报告具体化查询结果的 QueryList 的指针。
 *
 */
export interface LQuery<T> {
  /**
   * Materialized query matches for a given view only (!). Results are initialized lazily so the
   * array of matches is set to `null` initially.
   *
   * 仅针对给定视图的物化查询匹配 (!)。结果被延迟初始化，因此匹配数组最初设置为 `null` 。
   *
   */
  matches: (T|null)[]|null;

  /**
   * A QueryList where materialized query results should be reported.
   *
   * 应该报告具体化查询结果的 QueryList。
   *
   */
  queryList: QueryList<T>;

  /**
   * Clones an LQuery for an embedded view. A cloned query shares the same `QueryList` but has a
   * separate collection of materialized matches.
   *
   * 为嵌入式视图克隆 LQuery。克隆的查询共享同一个 `QueryList` ，但有一个单独的具体化匹配项集合。
   *
   */
  clone(): LQuery<T>;

  /**
   * Called when an embedded view, impacting results of this query, is inserted or removed.
   *
   * 在插入或删除影响此查询结果的嵌入式视图时调用。
   *
   */
  setDirty(): void;
}

/**
 * lQueries represent a collection of individual LQuery objects tracked in a given view.
 *
 * lQuery 表示在给定视图中跟踪的单个 LQuery 对象的集合。
 *
 */
export interface LQueries {
  /**
   * A collection of queries tracked in a given view.
   *
   * 在给定视图中跟踪的查询的集合。
   *
   */
  queries: LQuery<any>[];

  /**
   * A method called when a new embedded view is created. As a result a set of LQueries applicable
   * for a new embedded view is instantiated (cloned) from the declaration view.
   *
   * 创建新的嵌入式视图时调用的方法。因此，一组适用于新嵌入式视图的 LQueries
   * 是从声明视图实例化（克隆）的。
   *
   * @param tView
   */
  createEmbeddedView(tView: TView): LQueries|null;

  /**
   * A method called when an embedded view is inserted into a container. As a result all impacted
   * `LQuery` objects (and associated `QueryList`) are marked as dirty.
   *
   * 将嵌入式视图插入容器时调用的方法。因此，所有受影响的 `LQuery` 对象（以及关联的 `QueryList`
   *）都被标记为脏。
   *
   * @param tView
   */
  insertView(tView: TView): void;

  /**
   * A method called when an embedded view is detached from a container. As a result all impacted
   * `LQuery` objects (and associated `QueryList`) are marked as dirty.
   *
   * 嵌入式视图与容器分离时调用的方法。因此，所有受影响的 `LQuery` 对象（以及关联的 `QueryList`
   *）都被标记为脏。
   *
   * @param tView
   */
  detachView(tView: TView): void;
}


// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;
