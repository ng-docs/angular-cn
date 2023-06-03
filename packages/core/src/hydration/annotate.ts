/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef} from '../application_ref';
import {ViewEncapsulation} from '../metadata';
import {collectNativeNodes} from '../render3/collect_native_nodes';
import {getComponentDef} from '../render3/definition';
import {CONTAINER_HEADER_OFFSET, LContainer} from '../render3/interfaces/container';
import {TNode, TNodeType} from '../render3/interfaces/node';
import {RElement} from '../render3/interfaces/renderer_dom';
import {isComponentHost, isLContainer, isProjectionTNode, isRootView} from '../render3/interfaces/type_checks';
import {CONTEXT, FLAGS, HEADER_OFFSET, HOST, LView, LViewFlags, RENDERER, TView, TVIEW, TViewType} from '../render3/interfaces/view';
import {unwrapRNode} from '../render3/util/view_utils';
import {TransferState} from '../transfer_state';

import {unsupportedProjectionOfDomNodes} from './error_handling';
import {CONTAINERS, DISCONNECTED_NODES, ELEMENT_CONTAINERS, MULTIPLIER, NODES, NUM_ROOT_NODES, SerializedContainerView, SerializedView, TEMPLATE_ID, TEMPLATES} from './interfaces';
import {calcPathForNode} from './node_lookup_utils';
import {hasInSkipHydrationBlockFlag, isInSkipHydrationBlock, SKIP_HYDRATION_ATTR_NAME} from './skip_hydration';
import {getComponentLViewForHydration, NGH_ATTR_NAME, NGH_DATA_KEY, TextNodeMarker} from './utils';

/**
 * A collection that tracks all serialized views \(`ngh` DOM annotations\)
 * to avoid duplication. An attempt to add a duplicate view results in the
 * collection returning the index of the previously collected serialized view.
 * This reduces the number of annotations needed for a given page.
 *
 * 跟踪所有序列化视图（ `ngh` DOM 注释）以避免重复的集合。 尝试添加重复视图会导致集合返回先前收集的序列化视图的索引。 这减少了给定页面所需的注释数量。
 *
 */
class SerializedViewCollection {
  private views: SerializedView[] = [];
  private indexByContent = new Map<string, number>();

  add(serializedView: SerializedView): number {
    const viewAsString = JSON.stringify(serializedView);
    if (!this.indexByContent.has(viewAsString)) {
      const index = this.views.length;
      this.views.push(serializedView);
      this.indexByContent.set(viewAsString, index);
      return index;
    }
    return this.indexByContent.get(viewAsString)!;
  }

  getAll(): SerializedView[] {
    return this.views;
  }
}

/**
 * Global counter that is used to generate a unique id for TViews
 * during the serialization process.
 *
 * 用于在序列化过程中为 TViews 生成唯一 ID 的全局计数器。
 *
 */
let tViewSsrId = 0;

/**
 * Generates a unique id for a given TView and returns this id.
 * The id is also stored on this instance of a TView and reused in
 * subsequent calls.
 *
 * 为给定的 TView 生成一个唯一的 id 并返回这个 id。 id 也存储在 TView 的这个实例上，并在后续调用中重复使用。
 *
 * This id is needed to uniquely identify and pick up dehydrated views
 * at runtime.
 *
 * 需要此 id 才能在运行时唯一标识和提取脱水视图。
 *
 */
function getSsrId(tView: TView): string {
  if (!tView.ssrId) {
    tView.ssrId = `t${tViewSsrId++}`;
  }
  return tView.ssrId;
}

/**
 * Describes a context available during the serialization
 * process. The context is used to share and collect information
 * during the serialization.
 *
 * 描述序列化过程中可用的上下文。 上下文用于在序列化期间共享和收集信息。
 *
 */
interface HydrationContext {
  serializedViewCollection: SerializedViewCollection;
  corruptedTextNodes: Map<HTMLElement, TextNodeMarker>;
}

/**
 * Computes the number of root nodes in a given view
 * \(or child nodes in a given container if a tNode is provided\).
 *
 * 计算给定视图中的根节点数（如果提供了 tNode，则计算给定容器中的子节点数）。
 *
 */
function calcNumRootNodes(tView: TView, lView: LView, tNode: TNode|null): number {
  const rootNodes: unknown[] = [];
  collectNativeNodes(tView, lView, tNode, rootNodes);
  return rootNodes.length;
}

/**
 * Annotates all components bootstrapped in a given ApplicationRef
 * with info needed for hydration.
 *
 * 使用水合所需的信息注释在给定 ApplicationRef 中引导的所有组件。
 *
 * @param appRef An instance of an ApplicationRef.
 *
 * ApplicationRef 的实例。
 *
 * @param doc A reference to the current Document instance.
 *
 * 对当前 Document 实例的引用。
 *
 */
export function annotateForHydration(appRef: ApplicationRef, doc: Document) {
  const serializedViewCollection = new SerializedViewCollection();
  const corruptedTextNodes = new Map<HTMLElement, TextNodeMarker>();
  const viewRefs = appRef._views;
  for (const viewRef of viewRefs) {
    const lView = getComponentLViewForHydration(viewRef);
    // An `lView` might be `null` if a `ViewRef` represents
    // an embedded view (not a component view).
    if (lView !== null) {
      const hostElement = lView[HOST];
      // Root elements might also be annotated with the `ngSkipHydration` attribute,
      // check if it's present before starting the serialization process.
      if (hostElement && !(hostElement as HTMLElement).hasAttribute(SKIP_HYDRATION_ATTR_NAME)) {
        const context: HydrationContext = {
          serializedViewCollection,
          corruptedTextNodes,
        };
        annotateHostElementForHydration(hostElement as HTMLElement, lView, context);
        insertCorruptedTextNodeMarkers(corruptedTextNodes, doc);
      }
    }
  }

  // Note: we *always* include hydration info key and a corresponding value
  // into the TransferState, even if the list of serialized views is empty.
  // This is needed as a signal to the client that the server part of the
  // hydration logic was setup and enabled correctly. Otherwise, if a client
  // hydration doesn't find a key in the transfer state - an error is produced.
  const serializedViews = serializedViewCollection.getAll();
  const transferState = appRef.injector.get(TransferState);
  transferState.set(NGH_DATA_KEY, serializedViews);
}

/**
 * Serializes the lContainer data into a list of SerializedView objects,
 * that represent views within this lContainer.
 *
 * 将 lContainer 数据序列化为 SerializedView 对象列表，这些对象表示此 lContainer 中的视图。
 *
 * @param lContainer the lContainer we are serializing
 *
 * 我们正在序列化的 lContainer
 *
 * @param context the hydration context
 *
 * 水合作用
 *
 * @returns
 *
 * an array of the `SerializedView` objects
 *
 * `SerializedView` 对象的数组
 *
 */
function serializeLContainer(
    lContainer: LContainer, context: HydrationContext): SerializedContainerView[] {
  const views: SerializedContainerView[] = [];
  let lastViewAsString: string = '';

  for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    let childLView = lContainer[i] as LView;

    // If this is a root view, get an LView for the underlying component,
    // because it contains information about the view to serialize.
    if (isRootView(childLView)) {
      childLView = childLView[HEADER_OFFSET];
    }
    const childTView = childLView[TVIEW];

    let template: string;
    let numRootNodes = 0;
    if (childTView.type === TViewType.Component) {
      template = childTView.ssrId!;

      // This is a component view, thus it has only 1 root node: the component
      // host node itself (other nodes would be inside that host node).
      numRootNodes = 1;
    } else {
      template = getSsrId(childTView);
      numRootNodes = calcNumRootNodes(childTView, childLView, childTView.firstChild);
    }

    const view: SerializedContainerView = {
      [TEMPLATE_ID]: template,
      [NUM_ROOT_NODES]: numRootNodes,
      ...serializeLView(lContainer[i] as LView, context),
    };

    // Check if the previous view has the same shape (for example, it was
    // produced by the *ngFor), in which case bump the counter on the previous
    // view instead of including the same information again.
    const currentViewAsString = JSON.stringify(view);
    if (views.length > 0 && currentViewAsString === lastViewAsString) {
      const previousView = views[views.length - 1];
      previousView[MULTIPLIER] ??= 1;
      previousView[MULTIPLIER]++;
    } else {
      // Record this view as most recently added.
      lastViewAsString = currentViewAsString;
      views.push(view);
    }
  }
  return views;
}

/**
 * Helper function to produce a node path \(which navigation steps runtime logic
 * needs to take to locate a node\) and stores it in the `NODES` section of the
 * current serialized view.
 *
 * 生成节点路径的帮助函数（运行时逻辑需要采取哪些导航步骤来定位节点）并将其存储在当前序列化视图的 `NODES` 部分。
 *
 */
function appendSerializedNodePath(ngh: SerializedView, tNode: TNode, lView: LView) {
  const noOffsetIndex = tNode.index - HEADER_OFFSET;
  ngh[NODES] ??= {};
  ngh[NODES][noOffsetIndex] = calcPathForNode(tNode, lView);
}

/**
 * Helper function to append information about a disconnected node.
 * This info is needed at runtime to avoid DOM lookups for this element
 * and instead, the element would be created from scratch.
 *
 * 用于附加有关断开连接的节点的信息的辅助函数。 在运行时需要此信息以避免为此元素进行 DOM 查找，相反，该元素将从头开始创建。
 *
 */
function appendDisconnectedNodeIndex(ngh: SerializedView, tNode: TNode) {
  const noOffsetIndex = tNode.index - HEADER_OFFSET;
  ngh[DISCONNECTED_NODES] ??= [];
  if (!ngh[DISCONNECTED_NODES].includes(noOffsetIndex)) {
    ngh[DISCONNECTED_NODES].push(noOffsetIndex);
  }
}

/**
 * Serializes the lView data into a SerializedView object that will later be added
 * to the TransferState storage and referenced using the `ngh` attribute on a host
 * element.
 *
 * 将 lView 数据序列化为一个 SerializedView 对象，该对象稍后将添加到 TransferState 存储并使用宿主元素上的 `ngh` 属性进行引用。
 *
 * @param lView the lView we are serializing
 *
 * 我们正在序列化的 lView
 *
 * @param context the hydration context
 *
 * 水合作用
 *
 * @returns
 *
 * the `SerializedView` object containing the data to be added to the host node
 *
 * 包含要添加到主机节点的数据的 `SerializedView` 对象
 *
 */
function serializeLView(lView: LView, context: HydrationContext): SerializedView {
  const ngh: SerializedView = {};
  const tView = lView[TVIEW];
  // Iterate over DOM element references in an LView.
  for (let i = HEADER_OFFSET; i < tView.bindingStartIndex; i++) {
    const tNode = tView.data[i] as TNode;
    const noOffsetIndex = i - HEADER_OFFSET;
    // Local refs (e.g. <div #localRef>) take up an extra slot in LViews
    // to store the same element. In this case, there is no information in
    // a corresponding slot in TNode data structure. If that's the case, just
    // skip this slot and move to the next one.
    if (!tNode) {
      continue;
    }

    // Check if a native node that represents a given TNode is disconnected from the DOM tree.
    // Such nodes must be excluded from the hydration (since the hydration won't be able to
    // find them), so the TNode ids are collected and used at runtime to skip the hydration.
    //
    // This situation may happen during the content projection, when some nodes don't make it
    // into one of the content projection slots (for example, when there is no default
    // <ng-content /> slot in projector component's template).
    if (isDisconnectedNode(tNode, lView) && isContentProjectedNode(tNode)) {
      appendDisconnectedNodeIndex(ngh, tNode);
      continue;
    }
    if (Array.isArray(tNode.projection)) {
      for (const projectionHeadTNode of tNode.projection) {
        // We may have `null`s in slots with no projected content.
        if (!projectionHeadTNode) continue;

        if (!Array.isArray(projectionHeadTNode)) {
          // If we process re-projected content (i.e. `<ng-content>`
          // appears at projection location), skip annotations for this content
          // since all DOM nodes in this projection were handled while processing
          // a parent lView, which contains those nodes.
          if (!isProjectionTNode(projectionHeadTNode) &&
              !isInSkipHydrationBlock(projectionHeadTNode)) {
            if (isDisconnectedNode(projectionHeadTNode, lView)) {
              // Check whether this node is connected, since we may have a TNode
              // in the data structure as a projection segment head, but the
              // content projection slot might be disabled (e.g.
              // <ng-content *ngIf="false" />).
              appendDisconnectedNodeIndex(ngh, projectionHeadTNode);
            } else {
              appendSerializedNodePath(ngh, projectionHeadTNode, lView);
            }
          }
        } else {
          // If a value is an array, it means that we are processing a projection
          // where projectable nodes were passed in as DOM nodes (for example, when
          // calling `ViewContainerRef.createComponent(CmpA, {projectableNodes: [...]})`).
          //
          // In this scenario, nodes can come from anywhere (either created manually,
          // accessed via `document.querySelector`, etc) and may be in any state
          // (attached or detached from the DOM tree). As a result, we can not reliably
          // restore the state for such cases during hydration.

          throw unsupportedProjectionOfDomNodes(unwrapRNode(lView[i]));
        }
      }
    }
    if (isLContainer(lView[i])) {
      // Serialize information about a template.
      const embeddedTView = tNode.tView;
      if (embeddedTView !== null) {
        ngh[TEMPLATES] ??= {};
        ngh[TEMPLATES][noOffsetIndex] = getSsrId(embeddedTView);
      }

      // Serialize views within this LContainer.
      const hostNode = lView[i][HOST]!;  // host node of this container

      // LView[i][HOST] can be of 2 different types:
      // - either a DOM node
      // - or an array that represents an LView of a component
      if (Array.isArray(hostNode)) {
        // This is a component, serialize info about it.
        const targetNode = unwrapRNode(hostNode as LView) as RElement;
        if (!(targetNode as HTMLElement).hasAttribute(SKIP_HYDRATION_ATTR_NAME)) {
          annotateHostElementForHydration(targetNode, hostNode as LView, context);
        }
      }
      ngh[CONTAINERS] ??= {};
      ngh[CONTAINERS][noOffsetIndex] = serializeLContainer(lView[i], context);
    } else if (Array.isArray(lView[i])) {
      // This is a component, annotate the host node with an `ngh` attribute.
      const targetNode = unwrapRNode(lView[i][HOST]!);
      if (!(targetNode as HTMLElement).hasAttribute(SKIP_HYDRATION_ATTR_NAME)) {
        annotateHostElementForHydration(targetNode as RElement, lView[i], context);
      }
    } else {
      // <ng-container> case
      if (tNode.type & TNodeType.ElementContainer) {
        // An <ng-container> is represented by the number of
        // top-level nodes. This information is needed to skip over
        // those nodes to reach a corresponding anchor node (comment node).
        ngh[ELEMENT_CONTAINERS] ??= {};
        ngh[ELEMENT_CONTAINERS][noOffsetIndex] = calcNumRootNodes(tView, lView, tNode.child);
      } else if (tNode.type & TNodeType.Projection) {
        // Current TNode represents an `<ng-content>` slot, thus it has no
        // DOM elements associated with it, so the **next sibling** node would
        // not be able to find an anchor. In this case, use full path instead.
        let nextTNode = tNode.next;
        // Skip over all `<ng-content>` slots in a row.
        while (nextTNode !== null && (nextTNode.type & TNodeType.Projection)) {
          nextTNode = nextTNode.next;
        }
        if (nextTNode && !isInSkipHydrationBlock(nextTNode)) {
          // Handle a tNode after the `<ng-content>` slot.
          appendSerializedNodePath(ngh, nextTNode, lView);
        }
      } else {
        // Handle cases where text nodes can be lost after DOM serialization:
        //  1. When there is an *empty text node* in DOM: in this case, this
        //     node would not make it into the serialized string and as a result,
        //     this node wouldn't be created in a browser. This would result in
        //     a mismatch during the hydration, where the runtime logic would expect
        //     a text node to be present in live DOM, but no text node would exist.
        //     Example: `<span>{{ name }}</span>` when the `name` is an empty string.
        //     This would result in `<span></span>` string after serialization and
        //     in a browser only the `span` element would be created. To resolve that,
        //     an extra comment node is appended in place of an empty text node and
        //     that special comment node is replaced with an empty text node *before*
        //     hydration.
        //  2. When there are 2 consecutive text nodes present in the DOM.
        //     Example: `<div>Hello <ng-container *ngIf="true">world</ng-container></div>`.
        //     In this scenario, the live DOM would look like this:
        //       <div>#text('Hello ') #text('world') #comment('container')</div>
        //     Serialized string would look like this: `<div>Hello world<!--container--></div>`.
        //     The live DOM in a browser after that would be:
        //       <div>#text('Hello world') #comment('container')</div>
        //     Notice how 2 text nodes are now "merged" into one. This would cause hydration
        //     logic to fail, since it'd expect 2 text nodes being present, not one.
        //     To fix this, we insert a special comment node in between those text nodes, so
        //     serialized representation is: `<div>Hello <!--ngtns-->world<!--container--></div>`.
        //     This forces browser to create 2 text nodes separated by a comment node.
        //     Before running a hydration process, this special comment node is removed, so the
        //     live DOM has exactly the same state as it was before serialization.
        if (tNode.type & TNodeType.Text) {
          const rNode = unwrapRNode(lView[i]) as HTMLElement;
          // Collect this node as required special annotation only when its
          // contents is empty. Otherwise, such text node would be present on
          // the client after server-side rendering and no special handling needed.
          if (rNode.textContent === '') {
            context.corruptedTextNodes.set(rNode, TextNodeMarker.EmptyNode);
          } else if (rNode.nextSibling?.nodeType === Node.TEXT_NODE) {
            context.corruptedTextNodes.set(rNode, TextNodeMarker.Separator);
          }
        }

        if (tNode.projectionNext && tNode.projectionNext !== tNode.next &&
            !isInSkipHydrationBlock(tNode.projectionNext)) {
          // Check if projection next is not the same as next, in which case
          // the node would not be found at creation time at runtime and we
          // need to provide a location for that node.
          appendSerializedNodePath(ngh, tNode.projectionNext, lView);
        }
      }
    }
  }
  return ngh;
}

/**
 * Determines whether a component instance that is represented
 * by a given LView uses `ViewEncapsulation.ShadowDom`.
 *
 * 确定由给定 LView 表示的组件实例是否使用 `ViewEncapsulation.ShadowDom` 。
 *
 */
function componentUsesShadowDomEncapsulation(lView: LView): boolean {
  const instance = lView[CONTEXT];
  return instance?.constructor ?
      getComponentDef(instance.constructor)?.encapsulation === ViewEncapsulation.ShadowDom :
      false;
}

/**
 * Annotates component host element for hydration:
 *
 * 注释组件宿主元素以进行水合作用：
 *
 * - by either adding the `ngh` attribute and collecting hydration-related info
 *   for the serialization and transferring to the client
 *
 *   通过添加 `ngh` 属性并收集与水合作用相关的信息以进行序列化并传输到客户端
 *
 * - or by adding the `ngSkipHydration` attribute in case Angular detects that
 *   component contents is not compatible with hydration.
 *
 *   或者通过添加 `ngSkipHydration` 属性，以防 Angular 检测到组件内容与 hydration 不兼容。
 *
 * @param element The Host element to be annotated
 *
 * 要注释的 Host 元素
 *
 * @param lView The associated LView
 *
 * 关联的 LView
 *
 * @param context The hydration context
 *
 * 水合作用
 *
 */
function annotateHostElementForHydration(
    element: RElement, lView: LView, context: HydrationContext): void {
  const renderer = lView[RENDERER];
  if ((lView[FLAGS] & LViewFlags.HasI18n) === LViewFlags.HasI18n ||
      componentUsesShadowDomEncapsulation(lView)) {
    // Attach the skip hydration attribute if this component:
    // - either has i18n blocks, since hydrating such blocks is not yet supported
    // - or uses ShadowDom view encapsulation, since Domino doesn't support
    //   shadow DOM, so we can not guarantee that client and server representations
    //   would exactly match
    renderer.setAttribute(element, SKIP_HYDRATION_ATTR_NAME, '');
  } else {
    const ngh = serializeLView(lView, context);
    const index = context.serializedViewCollection.add(ngh);
    renderer.setAttribute(element, NGH_ATTR_NAME, index.toString());
  }
}

/**
 * Physically inserts the comment nodes to ensure empty text nodes and adjacent
 * text node separators are preserved after server serialization of the DOM.
 * These get swapped back for empty text nodes or separators once hydration happens
 * on the client.
 *
 * 物理插入注释节点以确保空文本节点和相邻的文本节点分隔符在 DOM 的服务器序列化后得到保留。 一旦在客户端发生水合作用，这些就会换回空文本节点或分隔符。
 *
 * @param corruptedTextNodes The Map of text nodes to be replaced with comments
 *
 * 要替换为注释的文本节点映射
 *
 * @param doc The document
 *
 * 文档
 *
 */
function insertCorruptedTextNodeMarkers(
    corruptedTextNodes: Map<HTMLElement, string>, doc: Document) {
  for (const [textNode, marker] of corruptedTextNodes) {
    textNode.after(doc.createComment(marker));
  }
}

/**
 * Detects whether a given TNode represents a node that
 * is being content projected.
 *
 * 检测给定的 TNode 是否表示正在投影内容的节点。
 *
 */
function isContentProjectedNode(tNode: TNode): boolean {
  let currentTNode = tNode;
  while (currentTNode != null) {
    // If we come across a component host node in parent nodes -
    // this TNode is in the content projection section.
    if (isComponentHost(currentTNode)) {
      return true;
    }
    currentTNode = currentTNode.parent as TNode;
  }
  return false;
}

/**
 * Check whether a given node exists, but is disconnected from the DOM.
 *
 * 检查给定节点是否存在，但与 DOM 断开连接。
 *
 * Note: we leverage the fact that we have this information available in the DOM emulation
 * layer \(in Domino\) for now. Longer-term solution should not rely on the DOM emulation and
 * only use internal data structures and state to compute this information.
 *
 * 注意：我们利用了目前在 DOM 仿真层（在 Domino 中）中提供此信息这一事实。 长期解决方案不应依赖 DOM 模拟，而应仅使用内部数据结构和状态来计算此信息。
 *
 */
function isDisconnectedNode(tNode: TNode, lView: LView) {
  return !(tNode.type & TNodeType.Projection) && !!lView[tNode.index] &&
      !(unwrapRNode(lView[tNode.index]) as Node).isConnected;
}
