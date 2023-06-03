/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy} from '../../change_detection/constants';
import {Injector} from '../../di/injector';
import {ViewEncapsulation} from '../../metadata/view';
import {assertLView} from '../assert';
import {discoverLocalRefs, getComponentAtNodeIndex, getDirectivesAtNodeIndex, getLContext, readPatchedLView} from '../context_discovery';
import {getComponentDef, getDirectiveDef} from '../definition';
import {NodeInjector} from '../di';
import {DirectiveDef} from '../interfaces/definition';
import {TElementNode, TNode, TNodeProviderIndexes} from '../interfaces/node';
import {CLEANUP, CONTEXT, FLAGS, LView, LViewFlags, TVIEW, TViewType} from '../interfaces/view';

import {getLViewParent, getRootContext} from './view_traversal_utils';
import {unwrapRNode} from './view_utils';



/**
 * Retrieves the component instance associated with a given DOM element.
 *
 * 检索与给定 DOM 元素关联的组件实例。
 *
 * @usageNotes
 *
 * Given the following DOM structure:
 *
 * 给定以下 DOM 结构：
 *
 * ```html
 * <app-root>
 *   <div>
 *     <child-comp></child-comp>
 *   </div>
 * </app-root>
 * ```
 *
 * Calling `getComponent` on `<child-comp>` will return the instance of `ChildComponent`
 * associated with this DOM element.
 *
 * 在 `<my-app>` 上调用该函数将返回 `MyApp` 实例。
 *
 * Calling the function on `<app-root>` will return the `MyApp` instance.
 *
 * 在 `<my-app>` 上调用该函数将返回 `MyApp` 实例。
 *
 * @param element DOM element from which the component should be retrieved.
 *
 * 要从中检索组件的 DOM 元素。
 *
 * @returns Component instance associated with the element or `null` if there
 *    is no component associated with it.
 * @publicApi
 * @globalApi ng
 */
export function getComponent<T>(element: Element): T|null {
  ngDevMode && assertDomElement(element);
  const context = getLContext(element);
  if (context === null) return null;

  if (context.component === undefined) {
    const lView = context.lView;
    if (lView === null) {
      return null;
    }
    context.component = getComponentAtNodeIndex(context.nodeIndex, lView);
  }

  return context.component as unknown as T;
}


/**
 * If inside an embedded view \(e.g. `*ngIf` or `*ngFor`\), retrieves the context of the embedded
 * view that the element is part of. Otherwise retrieves the instance of the component whose view
 * owns the element \(in this case, the result is the same as calling `getOwningComponent`\).
 *
 * 如果在嵌入式视图中（比如 `*ngIf` 或 `*ngFor`），则检索元素所属的嵌入式视图的上下文。否则，检索其视图中拥有该元素的组件的实例（在这种情况下，其结果与调用 `getOwningComponent` 相同）。
 *
 * @param element Element for which to get the surrounding component instance.
 *
 * 要获取外围组件实例的元素。
 * @returns Instance of the component that is around the element or null if the element isn't
 *    inside any component.
 * @publicApi
 * @globalApi ng
 */
export function getContext<T extends {}>(element: Element): T|null {
  assertDomElement(element);
  const context = getLContext(element)!;
  const lView = context ? context.lView : null;
  return lView === null ? null : lView[CONTEXT] as T;
}

/**
 * Retrieves the component instance whose view contains the DOM element.
 *
 * 检索其视图中包含此 DOM 元素的组件实例。
 *
 * For example, if `<child-comp>` is used in the template of `<app-comp>`
 * \(i.e. a `ViewChild` of `<app-comp>`\), calling `getOwningComponent` on `<child-comp>`
 * would return `<app-comp>`.
 *
 * 比如，如果 `<child-comp>` 在 `<app-comp>` 的模板中使用（即 `<app-comp>` 的 `ViewChild`），在 `<child-comp>` 上调用 `getOwningComponent` 将返回 `<app-comp>`。
 *
 * @param elementOrDir DOM element, component or directive instance
 *    for which to retrieve the root components.
 *
 * 要为其检索根组件的 DOM 元素、组件或指令实例。
 * @returns Component instance whose view owns the DOM element or null if the element is not
 *    part of a component view.
 * @publicApi
 * @globalApi ng
 */
export function getOwningComponent<T>(elementOrDir: Element|{}): T|null {
  const context = getLContext(elementOrDir)!;
  let lView = context ? context.lView : null;
  if (lView === null) return null;

  let parent: LView|null;
  while (lView[TVIEW].type === TViewType.Embedded && (parent = getLViewParent(lView)!)) {
    lView = parent;
  }
  return lView[FLAGS] & LViewFlags.IsRoot ? null : lView[CONTEXT] as unknown as T;
}

/**
 * Retrieves all root components associated with a DOM element, directive or component instance.
 * Root components are those which have been bootstrapped by Angular.
 *
 * 检索与 DOM 元素，指令或组件实例关联的所有根组件。根组件是由 Angular 引导启动的组件。
 *
 * @param elementOrDir DOM element, component or directive instance
 *    for which to retrieve the root components.
 *
 * 要为其检索根组件的 DOM 元素、组件或指令实例。
 *
 * @returns Root components associated with the target object.
 * @publicApi
 * @globalApi ng
 */
export function getRootComponents(elementOrDir: Element|{}): {}[] {
  const lView = readPatchedLView<{}>(elementOrDir);
  return lView !== null ? [getRootContext(lView)] : [];
}

/**
 * Retrieves an `Injector` associated with an element, component or directive instance.
 *
 * 检索与元素、组件或指令实例关联的 `Injector`。
 *
 * @param elementOrDir DOM element, component or directive instance for which to
 *    retrieve the injector.
 *
 * 要为其获取注入器的 DOM 元素、组件或指令实例。
 *
 * @returns Injector associated with the element, component or directive instance.
 * @publicApi
 * @globalApi ng
 */
export function getInjector(elementOrDir: Element|{}): Injector {
  const context = getLContext(elementOrDir)!;
  const lView = context ? context.lView : null;
  if (lView === null) return Injector.NULL;

  const tNode = lView[TVIEW].data[context.nodeIndex] as TElementNode;
  return new NodeInjector(tNode, lView);
}

/**
 * Retrieve a set of injection tokens at a given DOM node.
 *
 * @param element Element for which the injection tokens should be retrieved.
 */
export function getInjectionTokens(element: Element): any[] {
  const context = getLContext(element)!;
  const lView = context ? context.lView : null;
  if (lView === null) return [];
  const tView = lView[TVIEW];
  const tNode = tView.data[context.nodeIndex] as TNode;
  const providerTokens: any[] = [];
  const startIndex = tNode.providerIndexes & TNodeProviderIndexes.ProvidersStartIndexMask;
  const endIndex = tNode.directiveEnd;
  for (let i = startIndex; i < endIndex; i++) {
    let value = tView.data[i];
    if (isDirectiveDefHack(value)) {
      // The fact that we sometimes store Type and sometimes DirectiveDef in this location is a
      // design flaw.  We should always store same type so that we can be monomorphic. The issue
      // is that for Components/Directives we store the def instead the type. The correct behavior
      // is that we should always be storing injectable type in this location.
      value = value.type;
    }
    providerTokens.push(value);
  }
  return providerTokens;
}

/**
 * Retrieves directive instances associated with a given DOM node. Does not include
 * component instances.
 *
 * 检索与给定 DOM 元素关联的指令实例。不包括组件实例。
 *
 * @usageNotes
 *
 * Given the following DOM structure:
 *
 * 给定以下 DOM 结构：
 *
 * ```html
 * <app-root>
 *   <button my-button></button>
 *   <my-comp></my-comp>
 * </app-root>
 * ```
 *
 * Calling `getDirectives` on `<button>` will return an array with an instance of the `MyButton`
 * directive that is associated with the DOM node.
 *
 * 在 `<my-comp>` 上调用 `getDirectives` 将返回一个空数组。
 *
 * Calling `getDirectives` on `<my-comp>` will return an empty array.
 *
 * 在 `<my-comp>` 上调用 `getDirectives` 将返回一个空数组。
 *
 * @param node DOM node for which to get the directives.
 *
 * 要为其获取指令的 DOM 元素。
 *
 * @returns Array of directives associated with the node.
 * @publicApi
 * @globalApi ng
 */
export function getDirectives(node: Node): {}[] {
  // Skip text nodes because we can't have directives associated with them.
  if (node instanceof Text) {
    return [];
  }

  const context = getLContext(node)!;
  const lView = context ? context.lView : null;
  if (lView === null) {
    return [];
  }

  const tView = lView[TVIEW];
  const nodeIndex = context.nodeIndex;
  if (!tView?.data[nodeIndex]) {
    return [];
  }
  if (context.directives === undefined) {
    context.directives = getDirectivesAtNodeIndex(nodeIndex, lView);
  }

  // The `directives` in this case are a named array called `LComponentView`. Clone the
  // result so we don't expose an internal data structure in the user's console.
  return context.directives === null ? [] : [...context.directives];
}

/**
 * Partial metadata for a given directive instance.
 * This information might be useful for debugging purposes or tooling.
 * Currently only `inputs` and `outputs` metadata is available.
 *
 * 给定指令实例的部分元数据。此信息可能可用于调试目的或工具。当前只有 `inputs` 和 `outputs` 元数据可用。
 *
 * @publicApi
 */
export interface DirectiveDebugMetadata {
  inputs: Record<string, string>;
  outputs: Record<string, string>;
}

/**
 * Partial metadata for a given component instance.
 * This information might be useful for debugging purposes or tooling.
 * Currently the following fields are available:
 *
 * 给定组件实例的部分元数据。此信息可能可用于调试目的或工具。目前有以下字段可用：
 *
 * - inputs
 *
 *   inputs（输入属性）
 *
 * - outputs
 *
 *   outputs（输出属性）
 *
 * - encapsulation
 *
 *   encapsulation（封装）
 *
 * - changeDetection
 *
 *   changeDetection（变更检测）
 *
 * @publicApi
 */
export interface ComponentDebugMetadata extends DirectiveDebugMetadata {
  encapsulation: ViewEncapsulation;
  changeDetection: ChangeDetectionStrategy;
}

/**
 * Returns the debug \(partial\) metadata for a particular directive or component instance.
 * The function accepts an instance of a directive or component and returns the corresponding
 * metadata.
 *
 * 返回特定指令或组件实例的调试（部分）元数据。该函数接受指令或组件的实例，并返回相应的元数据。
 *
 * @param directiveOrComponentInstance Instance of a directive or component
 *
 * 指令或组件的实例
 * @returns metadata of the passed directive or component
 * @publicApi
 * @globalApi ng
 */
export function getDirectiveMetadata(directiveOrComponentInstance: any): ComponentDebugMetadata|
    DirectiveDebugMetadata|null {
  const {constructor} = directiveOrComponentInstance;
  if (!constructor) {
    throw new Error('Unable to find the instance constructor');
  }
  // In case a component inherits from a directive, we may have component and directive metadata
  // To ensure we don't get the metadata of the directive, we want to call `getComponentDef` first.
  const componentDef = getComponentDef(constructor);
  if (componentDef) {
    return {
      inputs: componentDef.inputs,
      outputs: componentDef.outputs,
      encapsulation: componentDef.encapsulation,
      changeDetection: componentDef.onPush ? ChangeDetectionStrategy.OnPush :
                                             ChangeDetectionStrategy.Default
    };
  }
  const directiveDef = getDirectiveDef(constructor);
  if (directiveDef) {
    return {inputs: directiveDef.inputs, outputs: directiveDef.outputs};
  }
  return null;
}

/**
 * Retrieve map of local references.
 *
 * The references are retrieved as a map of local reference name to element or directive instance.
 *
 * @param target DOM element, component or directive instance for which to retrieve
 *    the local references.
 */
export function getLocalRefs(target: {}): {[key: string]: any} {
  const context = getLContext(target);
  if (context === null) return {};

  if (context.localRefs === undefined) {
    const lView = context.lView;
    if (lView === null) {
      return {};
    }
    context.localRefs = discoverLocalRefs(lView, context.nodeIndex);
  }

  return context.localRefs || {};
}

/**
 * Retrieves the host element of a component or directive instance.
 * The host element is the DOM element that matched the selector of the directive.
 *
 * 检索组件或指令实例的宿主元素。 宿主元素是与指令的选择器匹配的 DOM 元素。
 *
 * @param componentOrDirective Component or directive instance for which the host
 *     element should be retrieved.
 *
 * 要为其检索宿主元素的组件或指令实例。
 *
 * @returns Host element of the target.
 * @publicApi
 * @globalApi ng
 */
export function getHostElement(componentOrDirective: {}): Element {
  return getLContext(componentOrDirective)!.native as unknown as Element;
}

/**
 * Retrieves the rendered text for a given component.
 *
 * This function retrieves the host element of a component and
 * and then returns the `textContent` for that element. This implies
 * that the text returned will include re-projected content of
 * the component as well.
 *
 * @param component The component to return the content text for.
 */
export function getRenderedText(component: any): string {
  const hostElement = getHostElement(component);
  return hostElement.textContent || '';
}

/**
 * Event listener configuration returned from `getListeners`.
 *
 * `getListeners` 返回的事件监听器配置。
 *
 * @publicApi
 */
export interface Listener {
  /**
   * Name of the event listener.
   *
   * 事件监听器的名称。
   *
   */
  name: string;
  /**
   * Element that the listener is bound to.
   *
   * 监听器绑定到的元素。
   *
   */
  element: Element;
  /**
   * Callback that is invoked when the event is triggered.
   *
   * 触发事件时调用的回调。
   *
   */
  callback: (value: any) => any;
  /**
   * Whether the listener is using event capturing.
   *
   * 监听器是否正在使用事件捕获。
   *
   */
  useCapture: boolean;
  /**
   * Type of the listener \(e.g. a native DOM event or a custom @Output\).
   *
   * 监听器的类型（比如，原生 DOM 事件或自定义 @Output）。
   *
   */
  type: 'dom'|'output';
}


/**
 * Retrieves a list of event listeners associated with a DOM element. The list does include host
 * listeners, but it does not include event listeners defined outside of the Angular context
 * \(e.g. through `addEventListener`\).
 *
 * 检索与 DOM 元素关联的事件监听器的列表。该列表包含宿主监听器，但不包含在 Angular 上下文之外定义的事件监听器（比如，通过 `addEventListener`）。
 *
 * @usageNotes
 *
 * Given the following DOM structure:
 *
 * 给定以下 DOM 结构：
 *
 * ```html
 * <app-root>
 *   <div (click)="doSomething()"></div>
 * </app-root>
 * ```
 *
 * Calling `getListeners` on `<div>` will return an object that looks as follows:
 *
 * 在 `<div>` 上调用 `getListeners` 将返回一个如下所示的对象：
 *
 * ```ts
 * {
 *   name: 'click',
 *   element: <div>,
 *   callback: () => doSomething(),
 *   useCapture: false
 * }
 * ```
 * @param element Element for which the DOM listeners should be retrieved.
 *
 * 要为其检索 DOM 监听器的元素。
 * @returns Array of event listeners on the DOM element.
 * @publicApi
 * @globalApi ng
 */
export function getListeners(element: Element): Listener[] {
  ngDevMode && assertDomElement(element);
  const lContext = getLContext(element);
  const lView = lContext === null ? null : lContext.lView;
  if (lView === null) return [];

  const tView = lView[TVIEW];
  const lCleanup = lView[CLEANUP];
  const tCleanup = tView.cleanup;
  const listeners: Listener[] = [];
  if (tCleanup && lCleanup) {
    for (let i = 0; i < tCleanup.length;) {
      const firstParam = tCleanup[i++];
      const secondParam = tCleanup[i++];
      if (typeof firstParam === 'string') {
        const name: string = firstParam;
        const listenerElement = unwrapRNode(lView[secondParam]) as any as Element;
        const callback: (value: any) => any = lCleanup[tCleanup[i++]];
        const useCaptureOrIndx = tCleanup[i++];
        // if useCaptureOrIndx is boolean then report it as is.
        // if useCaptureOrIndx is positive number then it in unsubscribe method
        // if useCaptureOrIndx is negative number then it is a Subscription
        const type =
            (typeof useCaptureOrIndx === 'boolean' || useCaptureOrIndx >= 0) ? 'dom' : 'output';
        const useCapture = typeof useCaptureOrIndx === 'boolean' ? useCaptureOrIndx : false;
        if (element == listenerElement) {
          listeners.push({element, name, callback, useCapture, type});
        }
      }
    }
  }
  listeners.sort(sortListeners);
  return listeners;
}

function sortListeners(a: Listener, b: Listener) {
  if (a.name == b.name) return 0;
  return a.name < b.name ? -1 : 1;
}

/**
 * This function should not exist because it is megamorphic and only mostly correct.
 *
 * See call site for more info.
 */
function isDirectiveDefHack(obj: any): obj is DirectiveDef<any> {
  return obj.type !== undefined && obj.declaredInputs !== undefined &&
      obj.findHostDirectiveDefs !== undefined;
}

/**
 * Retrieve the component `LView` from component/element.
 *
 * NOTE: `LView` is a private and should not be leaked outside.
 *       Don't export this method to `ng.*` on window.
 *
 * @param target DOM element or component instance for which to retrieve the LView.
 */
export function getComponentLView(target: any): LView {
  const lContext = getLContext(target)!;
  const nodeIndx = lContext.nodeIndex;
  const lView = lContext.lView!;
  ngDevMode && assertLView(lView);
  const componentLView = lView[nodeIndx];
  ngDevMode && assertLView(componentLView);
  return componentLView;
}

/** Asserts that a value is a DOM Element. */
function assertDomElement(value: any) {
  if (typeof Element !== 'undefined' && !(value instanceof Element)) {
    throw new Error('Expecting instance of DOM Element');
  }
}
