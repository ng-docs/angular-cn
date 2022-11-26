/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '../util/ng_dev_mode';

import {assertDefined, assertDomNode} from '../util/assert';
import {EMPTY_ARRAY} from '../util/empty';

import {assertLView} from './assert';
import {LContext} from './interfaces/context';
import {getLViewById, registerLView} from './interfaces/lview_tracking';
import {TNode, TNodeFlags} from './interfaces/node';
import {RElement, RNode} from './interfaces/renderer_dom';
import {isLView} from './interfaces/type_checks';
import {CONTEXT, HEADER_OFFSET, HOST, ID, LView, TVIEW} from './interfaces/view';
import {getComponentLViewByIndex, unwrapRNode} from './util/view_utils';



/**
 * Returns the matching `LContext` data for a given DOM node, directive or component instance.
 *
 * 返回给定 DOM 节点、指令或组件实例的匹配 `LContext` 数据。
 *
 * This function will examine the provided DOM element, component, or directive instance\\'s
 * monkey-patched property to derive the `LContext` data. Once called then the monkey-patched
 * value will be that of the newly created `LContext`.
 *
 * 此函数将检查提供的 DOM 元素、组件或指令实例的 Monkey-patched 属性以派生 `LContext`
 * 数据。一旦调用，那么猴子修补的值将是新创建的 `LContext` 的值。
 *
 * If the monkey-patched value is the `LView` instance then the context value for that
 * target will be created and the monkey-patch reference will be updated. Therefore when this
 * function is called it may mutate the provided element\\'s, component\\'s or any of the associated
 * directive\\'s monkey-patch values.
 *
 * 如果 Monkey-patched 的值是 `LView` 实例，则将创建该目标的上下文值，并更新 Monkey-patch
 * 引用。因此，当调用此函数时，它可能会改变提供的元素、组件或任何关联指令的 Monkey-patch 值。
 *
 * If the monkey-patch value is not detected then the code will walk up the DOM until an element
 * is found which contains a monkey-patch reference. When that occurs then the provided element
 * will be updated with a new context (which is then returned). If the monkey-patch value is not
 * detected for a component/directive instance then it will throw an error (all components and
 * directives should be automatically monkey-patched by ivy).
 *
 * 如果未检测到 Monkey-patch 值，则代码将沿着 DOM 向上走，直到找到包含 Monkey-patch
 * 引用的元素。当发生这种情况时，所提供的元素将使用新的上下文（然后返回）进行更新。如果未为组件/指令实例检测到
 * Monkey-patch 值，则它将抛出错误（所有组件和指令都应由 ivy 自动进行猴子补丁）。
 *
 * @param target Component, Directive or DOM Node.
 *
 * 组件、指令或 DOM 节点。
 *
 */
export function getLContext(target: any): LContext|null {
  let mpValue = readPatchedData(target);
  if (mpValue) {
    // only when it's an array is it considered an LView instance
    // ... otherwise it's an already constructed LContext instance
    if (isLView(mpValue)) {
      const lView: LView = mpValue!;
      let nodeIndex: number;
      let component: any = undefined;
      let directives: any[]|null|undefined = undefined;

      if (isComponentInstance(target)) {
        nodeIndex = findViaComponent(lView, target);
        if (nodeIndex == -1) {
          throw new Error('The provided component was not found in the application');
        }
        component = target;
      } else if (isDirectiveInstance(target)) {
        nodeIndex = findViaDirective(lView, target);
        if (nodeIndex == -1) {
          throw new Error('The provided directive was not found in the application');
        }
        directives = getDirectivesAtNodeIndex(nodeIndex, lView);
      } else {
        nodeIndex = findViaNativeElement(lView, target as RElement);
        if (nodeIndex == -1) {
          return null;
        }
      }

      // the goal is not to fill the entire context full of data because the lookups
      // are expensive. Instead, only the target data (the element, component, container, ICU
      // expression or directive details) are filled into the context. If called multiple times
      // with different target values then the missing target data will be filled in.
      const native = unwrapRNode(lView[nodeIndex]);
      const existingCtx = readPatchedData(native);
      const context: LContext = (existingCtx && !Array.isArray(existingCtx)) ?
          existingCtx :
          createLContext(lView, nodeIndex, native);

      // only when the component has been discovered then update the monkey-patch
      if (component && context.component === undefined) {
        context.component = component;
        attachPatchData(context.component, context);
      }

      // only when the directives have been discovered then update the monkey-patch
      if (directives && context.directives === undefined) {
        context.directives = directives;
        for (let i = 0; i < directives.length; i++) {
          attachPatchData(directives[i], context);
        }
      }

      attachPatchData(context.native, context);
      mpValue = context;
    }
  } else {
    const rElement = target as RElement;
    ngDevMode && assertDomNode(rElement);

    // if the context is not found then we need to traverse upwards up the DOM
    // to find the nearest element that has already been monkey patched with data
    let parent = rElement as any;
    while (parent = parent.parentNode) {
      const parentContext = readPatchedData(parent);
      if (parentContext) {
        const lView = Array.isArray(parentContext) ? parentContext as LView : parentContext.lView;

        // the edge of the app was also reached here through another means
        // (maybe because the DOM was changed manually).
        if (!lView) {
          return null;
        }

        const index = findViaNativeElement(lView, rElement);
        if (index >= 0) {
          const native = unwrapRNode(lView[index]);
          const context = createLContext(lView, index, native);
          attachPatchData(native, context);
          mpValue = context;
          break;
        }
      }
    }
  }
  return (mpValue as LContext) || null;
}

/**
 * Creates an empty instance of a `LContext` context
 *
 * 创建 `LContext` 上下文的空实例
 *
 */
function createLContext(lView: LView, nodeIndex: number, native: RNode): LContext {
  return new LContext(lView[ID], nodeIndex, native);
}

/**
 * Takes a component instance and returns the view for that component.
 *
 * 接受一个组件实例并返回该组件的视图。
 *
 * @param componentInstance
 * @returns
 *
 * The component's view
 *
 * 组件的视图
 *
 */
export function getComponentViewByInstance(componentInstance: {}): LView {
  let patchedData = readPatchedData(componentInstance);
  let lView: LView;

  if (isLView(patchedData)) {
    const contextLView: LView = patchedData;
    const nodeIndex = findViaComponent(contextLView, componentInstance);
    lView = getComponentLViewByIndex(nodeIndex, contextLView);
    const context = createLContext(contextLView, nodeIndex, lView[HOST] as RElement);
    context.component = componentInstance;
    attachPatchData(componentInstance, context);
    attachPatchData(context.native, context);
  } else {
    const context = patchedData as unknown as LContext;
    const contextLView = context.lView!;
    ngDevMode && assertLView(contextLView);
    lView = getComponentLViewByIndex(context.nodeIndex, contextLView);
  }
  return lView;
}

/**
 * This property will be monkey-patched on elements, components and directives.
 *
 * 此属性将在元素、组件和指令上进行猴子修补。
 *
 */
const MONKEY_PATCH_KEY_NAME = '__ngContext__';

/**
 * Assigns the given data to the given target (which could be a component,
 * directive or DOM node instance) using monkey-patching.
 *
 * 使用 Monkey-patching 将给定数据分配给给定目标（可以是组件、指令或 DOM 节点实例）。
 *
 */
export function attachPatchData(target: any, data: LView|LContext) {
  ngDevMode && assertDefined(target, 'Target expected');
  // Only attach the ID of the view in order to avoid memory leaks (see #41047). We only do this
  // for `LView`, because we have control over when an `LView` is created and destroyed, whereas
  // we can't know when to remove an `LContext`.
  if (isLView(data)) {
    target[MONKEY_PATCH_KEY_NAME] = data[ID];
    registerLView(data);
  } else {
    target[MONKEY_PATCH_KEY_NAME] = data;
  }
}

/**
 * Returns the monkey-patch value data present on the target (which could be
 * a component, directive or a DOM node).
 *
 * 返回目标上存在的 Monkey-patch 值数据（可以是组件、指令或 DOM 节点）。
 *
 */
export function readPatchedData(target: any): LView|LContext|null {
  ngDevMode && assertDefined(target, 'Target expected');
  const data = target[MONKEY_PATCH_KEY_NAME];
  return (typeof data === 'number') ? getLViewById(data) : data || null;
}

export function readPatchedLView<T>(target: any): LView<T>|null {
  const value = readPatchedData(target);
  if (value) {
    return (isLView(value) ? value : value.lView) as LView<T>;
  }
  return null;
}

export function isComponentInstance(instance: any): boolean {
  return instance && instance.constructor && instance.constructor.ɵcmp;
}

export function isDirectiveInstance(instance: any): boolean {
  return instance && instance.constructor && instance.constructor.ɵdir;
}

/**
 * Locates the element within the given LView and returns the matching index
 *
 * 在给定的 LView 中定位元素并返回匹配的索引
 *
 */
function findViaNativeElement(lView: LView, target: RElement): number {
  const tView = lView[TVIEW];
  for (let i = HEADER_OFFSET; i < tView.bindingStartIndex; i++) {
    if (unwrapRNode(lView[i]) === target) {
      return i;
    }
  }

  return -1;
}

/**
 * Locates the next tNode (child, sibling or parent).
 *
 * 定位下一个 tNode（子级、同级或父级）。
 *
 */
function traverseNextElement(tNode: TNode): TNode|null {
  if (tNode.child) {
    return tNode.child;
  } else if (tNode.next) {
    return tNode.next;
  } else {
    // Let's take the following template: <div><span>text</span></div><component/>
    // After checking the text node, we need to find the next parent that has a "next" TNode,
    // in this case the parent `div`, so that we can find the component.
    while (tNode.parent && !tNode.parent.next) {
      tNode = tNode.parent;
    }
    return tNode.parent && tNode.parent.next;
  }
}

/**
 * Locates the component within the given LView and returns the matching index
 *
 * 在给定的 LView 中定位组件并返回匹配的索引
 *
 */
function findViaComponent(lView: LView, componentInstance: {}): number {
  const componentIndices = lView[TVIEW].components;
  if (componentIndices) {
    for (let i = 0; i < componentIndices.length; i++) {
      const elementComponentIndex = componentIndices[i];
      const componentView = getComponentLViewByIndex(elementComponentIndex, lView);
      if (componentView[CONTEXT] === componentInstance) {
        return elementComponentIndex;
      }
    }
  } else {
    const rootComponentView = getComponentLViewByIndex(HEADER_OFFSET, lView);
    const rootComponent = rootComponentView[CONTEXT];
    if (rootComponent === componentInstance) {
      // we are dealing with the root element here therefore we know that the
      // element is the very first element after the HEADER data in the lView
      return HEADER_OFFSET;
    }
  }
  return -1;
}

/**
 * Locates the directive within the given LView and returns the matching index
 *
 * 在给定的 LView 中定位指令并返回匹配的索引
 *
 */
function findViaDirective(lView: LView, directiveInstance: {}): number {
  // if a directive is monkey patched then it will (by default)
  // have a reference to the LView of the current view. The
  // element bound to the directive being search lives somewhere
  // in the view data. We loop through the nodes and check their
  // list of directives for the instance.
  let tNode = lView[TVIEW].firstChild;
  while (tNode) {
    const directiveIndexStart = tNode.directiveStart;
    const directiveIndexEnd = tNode.directiveEnd;
    for (let i = directiveIndexStart; i < directiveIndexEnd; i++) {
      if (lView[i] === directiveInstance) {
        return tNode.index;
      }
    }
    tNode = traverseNextElement(tNode);
  }
  return -1;
}

/**
 * Returns a list of directives applied to a node at a specific index. The list includes
 * directives matched by selector and any host directives, but it excludes components.
 * Use `getComponentAtNodeIndex` to find the component applied to a node.
 *
 * 根据提供的指令索引值列表，返回从给定视图中提取的指令列表。
 *
 * @param nodeIndex The node index
 *
 * 节点索引
 *
 * @param lView The target view data
 */
export function getDirectivesAtNodeIndex(nodeIndex: number, lView: LView): any[]|null {
  const tNode = lView[TVIEW].data[nodeIndex] as TNode;
  if (tNode.directiveStart === 0) return EMPTY_ARRAY;
  const results: any[] = [];
  for (let i = tNode.directiveStart; i < tNode.directiveEnd; i++) {
    const directiveInstance = lView[i];
    if (!isComponentInstance(directiveInstance)) {
      results.push(directiveInstance);
    }
  }
  return results;
}

export function getComponentAtNodeIndex(nodeIndex: number, lView: LView): {}|null {
  const tNode = lView[TVIEW].data[nodeIndex] as TNode;
  const {directiveStart, componentOffset} = tNode;
  return componentOffset > -1 ? lView[directiveStart + componentOffset] : null;
}

/**
 * Returns a map of local references (local reference name => element or directive instance) that
 * exist on a given element.
 *
 * 返回给定元素上存在的本地引用（本地引用 name => 元素或指令实例）的映射表。
 *
 */
export function discoverLocalRefs(lView: LView, nodeIndex: number): {[key: string]: any}|null {
  const tNode = lView[TVIEW].data[nodeIndex] as TNode;
  if (tNode && tNode.localNames) {
    const result: {[key: string]: any} = {};
    let localIndex = tNode.index + 1;
    for (let i = 0; i < tNode.localNames.length; i += 2) {
      result[tNode.localNames[i]] = lView[localIndex];
      localIndex++;
    }
    return result;
  }

  return null;
}
