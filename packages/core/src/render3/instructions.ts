/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import './ng_dev_mode';

import {Type} from '../core';

import {assertEqual, assertLessThan, assertNotEqual, assertNotNull} from './assert';
import {ContainerState, CssSelector, ProjectionState, QueryState, ViewState} from './interfaces';
import {LContainer, LElement, LNode, LNodeFlags, LNodeInjector, LProjection, LText, LView} from './l_node';

import {NgStaticData, LNodeStatic, LContainerStatic, InitialInputData, InitialInputs, PropertyAliases, PropertyAliasValue,} from './l_node_static';
import {assertNodeType} from './node_assert';
import {appendChild, insertChild, insertView, processProjectedNode, removeView} from './node_manipulation';
import {isNodeMatchingSelector} from './node_selector_matcher';
import {ComponentDef, ComponentTemplate, DirectiveDef} from './public_interfaces';
import {QueryList, QueryState_} from './query';
import {RComment, RElement, RText, Renderer3, ProceduralRenderer3, ObjectOrientedRenderer3, RendererStyleFlags3} from './renderer';
import {isDifferent, stringify} from './util';

export {refreshQuery} from './query';

/**
 * Enum used by the directiveLifecycle (l) instruction to determine which lifecycle
 * hook is requesting processing and whether it should be allowed to run. It "guards"
 * certain hooks, e.g. "ngOnInit" should only run once on creation.
 */
export const enum LifeCycleGuard {ON_INIT = 1, ON_DESTROY = 2, ON_CHANGES = 4}

/**
 * directiveCreate (D) sets a property on all component instances using this constant
 * as a key, and the component's host node (LElement) as the value. This is used in
 * methods like detectChanges to facilitate jumping from an instance to the host node.
 */
export const NG_HOST_SYMBOL = '__ngHostLNode__';

/**
 * If a directive is diPublic, bloomAdd sets a property on the instance with this constant as
 * the key and the directive's unique ID as the value. This allows us to map directives to their
 * bloom filter bit for DI.
 */
export const NG_ELEMENT_ID = '__NG_ELEMENT_ID__';

/**
 * The number of slots in each bloom filter (used by DI). The larger this number, the fewer
 * directives that will share slots, and thus, the fewer false positives when checking for
 * the existence of a directive.
 */
export const BLOOM_SIZE = 128;

/** Counter used to generate unique IDs for directives. */
let nextNgElementId = 0;

/**
 * This property gets set before entering a template.
 *
 * This renderer can be one of two varieties of Renderer3:
 *
 * - ObjectedOrientedRenderer3
 *
 * This is the native browser API style. e.g. operations are methods on individual objects
 * like HTMLElement. With this style, no additional code is needed (reducing payload size)
 * as a facade.
 *
 * - ProceduralRenderer3
 *
 * In non-native browser environments (e.g. platforms such as web-workers), this is the facade
 * that facilitates element manipulation. This also facilitates backwards compatibility with
 * Renderer2.
 */
let renderer: Renderer3;

/** Used to set the parent property when nodes are created. */
let previousOrParentNode: LNode;

/**
 * If `isParent` is:
 *  - `true`: then `previousOrParentNode` points to a parent node.
 *  - `false`: then `previousOrParentNode` points to previous node (sibling).
 */
let isParent: boolean;

/**
 * The current template's static data (shared between all templates of a
 * given type).
 *
 * Each node's static data is stored at the same index that it's stored
 * in the data array. Any nodes that do not have static data store a null
 * value to avoid a sparse array.
 */
let ngStaticData: NgStaticData;

/**
 * State of the current view being processed.
 */
let currentView: ViewState = createViewState(null !, null !, []);

let currentQuery: QueryState|null;

/**
 * This property gets set before entering a template.
 */
let creationMode: boolean;

/**
 * An array of nodes (text, element, container, etc), their bindings, and
 * any local variables that need to be stored between invocations.
 */
let data: any[];

/**
 * Points to the next binding index to read or write to.
 */
let bindingIndex: number;

/**
 * When a view is destroyed, listeners need to be released
 * and onDestroy callbacks need to be called. This cleanup array
 * stores both listener data (in chunks of 4) and onDestroy data
 * (in chunks of 2), as they'll be processed at the same time.
 *
 * If it's a listener being stored:
 * 1st index is: event name to remove
 * 2nd index is: native element
 * 3rd index is: listener function
 * 4th index is: useCapture boolean
 *
 * If it's an onDestroy function:
 * 1st index is: onDestroy function
 * 2nd index is: context for function
 */
let cleanup: any[]|null;

/**
 * Swap the current state with a new state.
 *
 * For performance reasons we store the state in the top level of the module.
 * This way we minimize the number of properties to read. Whenever a new view
 * is entered we have to store the state for later, and when the view is
 * exited the state has to be restored
 *
 * @param newViewState New state to become active
 * @param host Element to which the View is a child of
 * @returns the previous state;
 */
export function enterView(newViewState: ViewState, host: LElement | LView | null): ViewState {
  const oldViewState = currentView;
  data = newViewState.data;
  bindingIndex = newViewState.bindingStartIndex || 0;
  ngStaticData = newViewState.ngStaticData;

  if (creationMode = !data) {
    // Absence of data implies creationMode.
    (newViewState as{data: any[]}).data = data = [];
  }
  cleanup = newViewState.cleanup;
  renderer = newViewState.renderer;

  if (host != null) {
    previousOrParentNode = host;
    isParent = true;
  }

  currentView = newViewState;
  return oldViewState !;
}

/**
 * Used in lieu of enterView to make it clear when we are exiting a child view. This makes
 * the direction of traversal (up or down the view tree) a bit clearer.
 */
export const leaveView: (newViewState: ViewState) => void = enterView as any;

export function createViewState(
    viewId: number, renderer: Renderer3, ngStaticData: NgStaticData): ViewState {
  const newView = {
    parent: currentView,
    id: viewId,    // -1 for component views
    node: null !,  // until we initialize it in createNode.
    data: null !,  // Hack use as a marker for creationMode
    ngStaticData: ngStaticData,
    cleanup: null,
    renderer: renderer,
    child: null,
    tail: null,
    next: null,
    bindingStartIndex: null
  };

  return newView;
}

/**
 * A common way of creating the LNode to make sure that all of them have same shape to
 * keep the execution code monomorphic and fast.
 */
export function createLNode(
    index: number | null, type: LNodeFlags.Element, native: RElement | RText | null,
    viewState?: ViewState | null): LElement;
export function createLNode(
    index: null, type: LNodeFlags.View, native: null, viewState: ViewState): LView;
export function createLNode(
    index: number, type: LNodeFlags.Container, native: RComment,
    containerState: ContainerState): LContainer;
export function createLNode(
    index: number, type: LNodeFlags.Projection, native: null,
    projectionState: ProjectionState): LProjection;
export function createLNode(
    index: number | null, type: LNodeFlags, native: RText | RElement | RComment | null,
    state?: null | ViewState | ContainerState | ProjectionState): LElement&LText&LView&LContainer&
    LProjection {
  const parent = isParent ? previousOrParentNode :
                            previousOrParentNode && previousOrParentNode.parent as LNode;
  let query = (isParent ? currentQuery : previousOrParentNode && previousOrParentNode.query) ||
      parent && parent.query && parent.query.child();
  const isState = state != null;
  const node: LElement&LText&LView&LContainer&LProjection = {
    flags: type,
    native: native as any,
    view: currentView,
    parent: parent as any,
    child: null,
    next: null,
    nodeInjector: parent ? parent.nodeInjector : null,
    data: isState ? state as any : null,
    query: query,
    staticData: null
  };

  if ((type & LNodeFlags.ViewOrElement) === LNodeFlags.ViewOrElement && isState) {
    // Bit of a hack to bust through the readonly because there is a circular dep between
    // ViewState and LNode.
    ngDevMode && assertEqual((state as ViewState).node, null, 'viewState.node');
    (state as ViewState as{node: LNode}).node = node;
  }
  if (index != null) {
    // We are Element or Container
    ngDevMode && assertEqual(data.length, index, 'data.length not in sequence');
    data[index] = node;

    // Every node adds a value to the static data array to avoid a sparse array
    if (index >= ngStaticData.length) {
      ngStaticData[index] = null;
    } else {
      node.staticData = ngStaticData[index] as LNodeStatic;
    }

    // Now link ourselves into the tree.
    if (isParent) {
      currentQuery = null;
      if (previousOrParentNode.view === currentView ||
          (previousOrParentNode.flags & LNodeFlags.TYPE_MASK) === LNodeFlags.View) {
        // We are in the same view, which means we are adding content node to the parent View.
        ngDevMode && assertEqual(previousOrParentNode.child, null, 'previousNode.child');
        previousOrParentNode.child = node;
      } else {
        // We are adding component view, so we don't link parent node child to this node.
      }
    } else if (previousOrParentNode) {
      ngDevMode && assertEqual(previousOrParentNode.next, null, 'previousNode.next');
      previousOrParentNode.next = node;
    }
  }
  previousOrParentNode = node;
  isParent = true;
  return node;
}


//////////////////////////
//// Render
//////////////////////////

/**
 *
 * @param host Existing node to render into.
 * @param renderer Renderer to use.
 * @param template Template function with the instructions.
 * @param context to pass into the template.
 */
export function renderTemplate<T>(host: LElement, template: ComponentTemplate<T>, context: T) {
  const hostView = host.data !;
  ngDevMode && assertNotEqual(hostView, null, 'hostView');
  hostView.ngStaticData = getTemplateStatic(template);
  const oldView = enterView(hostView, host);
  try {
    template(context, creationMode);
  } finally {
    leaveView(oldView);
  }
}

/**
 * Registers this directive as present in its node's injector by flipping the directive's
 * corresponding bit in the injector's bloom filter.
 *
 * @param injector The injector to which the type should be added
 * @param type The directive type to add
 */
export function bloomAdd(injector: LNodeInjector, type: Type<any>): void {
  let id: number|undefined = (type as any)[NG_ELEMENT_ID];

  // Set a unique ID on the directive type, so if something tries to inject the directive,
  // we can easily retrieve the ID and hash it into the bloom bit that should be checked.
  if (id == null) {
    id = (type as any)[NG_ELEMENT_ID] = nextNgElementId++;
  }

  // We only have BLOOM_SIZE (128) slots in our bloom filter (4 buckets * 32 bits each),
  // so all unique IDs must be modulo-ed into a number from 0 - 127 to fit into the filter.
  // This means that after 128, some directives will share slots, leading to some false positives
  // when checking for a directive's presence.
  const bloomBit = id % BLOOM_SIZE;

  // Create a mask that targets the specific bit associated with the directive.
  // JS bit operations are 32 bits, so this will be a number between 2^0 and 2^31, corresponding
  // to bit positions 0 - 31 in a 32 bit integer.
  const mask = 1 << bloomBit;

  // Use the raw bloomBit number to determine which bloom filter bucket we should check
  // e.g: bf0 = [0 - 31], bf1 = [32 - 63], bf2 = [64 - 95], bf3 = [96 - 127]
  if (bloomBit < 64) {
    if (bloomBit < 32) {
      // Then use the mask to flip on the bit (0-31) associated with the directive in that bucket
      injector.bf0 |= mask;
    } else {
      injector.bf1 |= mask;
    }
  } else {
    if (bloomBit < 96) {
      injector.bf2 |= mask;
    } else {
      injector.bf3 |= mask;
    }
  }
}

export function getOrCreateNodeInjector(): LNodeInjector {
  ngDevMode && assertPreviousIsParent();
  const node = previousOrParentNode as LElement | LContainer;
  const nodeInjector = node.nodeInjector;
  const parentInjector = node.parent && node.parent.nodeInjector;
  if (nodeInjector != parentInjector) {
    return nodeInjector !;
  }
  return node.nodeInjector = {
    parent: parentInjector,
    node: node,
    bf0: 0,
    bf1: 0,
    bf2: 0,
    bf3: 0,
    cbf0: parentInjector == null ? 0 : parentInjector.cbf0 | parentInjector.bf0,
    cbf1: parentInjector == null ? 0 : parentInjector.cbf1 | parentInjector.bf1,
    cbf2: parentInjector == null ? 0 : parentInjector.cbf2 | parentInjector.bf2,
    cbf3: parentInjector == null ? 0 : parentInjector.cbf3 | parentInjector.bf3,
    injector: null,
    templateRef: null,
    viewContainerRef: null,
    elementRef: null
  };
}


//////////////////////////
//// Element
//////////////////////////

/**
 * Create DOM element. The instruction must later be followed by `elementEnd()` call.
 *
 * @param index Index of the element in the data array
 * @param nameOrComponentDef Name of the DOM Node or `ComponentDef`.
 * @param attrs Statically bound set of attributes to be written into the DOM element on creation.
 *
 * Attributes are passed as an array of strings where elements with an even index hold an attribute
 * name and elements with an odd index hold an attribute value, ex.:
 * ['id', 'warning5', 'class', 'alert']
 */
export function elementCreate(
    index: number, nameOrComponentDef?: string | ComponentDef<any>, attrs?: string[]): RElement {
  let node: LElement;
  let native: RElement;

  if (nameOrComponentDef == null) {
    // native node retrieval - used for exporting elements as tpl local variables (<div #foo>)
    const node = data[index] !;
    native = node && (node as LElement).native;
  } else {
    ngDevMode && assertEqual(currentView.bindingStartIndex, null, 'bindingStartIndex');
    const isHostElement = typeof nameOrComponentDef !== 'string';
    const name = isHostElement ? (nameOrComponentDef as ComponentDef<any>).tag :
                                 nameOrComponentDef as string;
    if (name === null) {
      // TODO: future support for nameless components.
      throw 'for now name is required';
    } else {
      native = renderer.createElement(name);

      let componentView: ViewState|null = null;
      if (isHostElement) {
        const ngStaticData = getTemplateStatic((nameOrComponentDef as ComponentDef<any>).template);
        componentView = addToViewTree(createViewState(-1, renderer, ngStaticData));
      }

      // Only component views should be added to the view tree directly. Embedded views are
      // accessed through their containers because they may be removed / re-added later.
      node = createLNode(index, LNodeFlags.Element, native, componentView);

      if (node.staticData == null) {
        ngDevMode && assertDataInRange(index - 1);
        node.staticData = ngStaticData[index] = createNodeStatic(name, attrs || null, null);
      }

      if (attrs) setUpAttributes(native, attrs);
      appendChild(node.parent !, native, currentView);
    }
  }
  return native;
}

/**
 * Gets static data from a template function or creates a new static
 * data array if it doesn't already exist.
 *
 * @param template The template from which to get static data
 * @returns NgStaticData
 */
function getTemplateStatic(template: ComponentTemplate<any>): NgStaticData {
  return template.ngStaticData || (template.ngStaticData = [] as never);
}

function setUpAttributes(native: RElement, attrs: string[]): void {
  ngDevMode && assertEqual(attrs.length % 2, 0, 'attrs.length % 2');
  const isFnRenderer = (renderer as ProceduralRenderer3).setAttribute;
  for (let i = 0; i < attrs.length; i += 2) {
    isFnRenderer ? (renderer as ProceduralRenderer3).setAttribute !(native, attrs[i], attrs[i | 1]) :
                   native.setAttribute(attrs[i], attrs[i | 1]);
  }
}

export function createError(text: string, token: any) {
  return new Error(`Renderer: ${text} [${stringify(token)}]`);
}


/**
 * Used for bootstrapping existing nodes into rendering pipeline.
 *
 * @param elementOrSelector Render element or CSS selector to locate the element.
 */
export function elementHost(elementOrSelector: RElement | string, def: ComponentDef<any>) {
  ngDevMode && assertDataInRange(-1);
  const rNode = typeof elementOrSelector === 'string' ?
      ((renderer as ProceduralRenderer3).selectRootElement ?
           (renderer as ProceduralRenderer3).selectRootElement(elementOrSelector) :
           (renderer as ObjectOrientedRenderer3).querySelector !(elementOrSelector)) :
      elementOrSelector;
  if (ngDevMode && !rNode) {
    if (typeof elementOrSelector === 'string') {
      throw createError('Host node with selector not found:', elementOrSelector);
    } else {
      throw createError('Host node is required:', elementOrSelector);
    }
  }
  createLNode(
      0, LNodeFlags.Element, rNode, createViewState(-1, renderer, getTemplateStatic(def.template)));
}


/**
 * Adds an event listener to the current node.
 *
 * If an output exists on one of the node's directives, it also subscribes to the output
 * and saves the subscription for later cleanup.
 *
 * @param eventName Name of the event
 * @param listener The function to be called when event emits
 * @param useCapture Whether or not to use capture in event listener.
 */
export function listenerCreate(
    eventName: string, listener: EventListener, useCapture = false): void {
  ngDevMode && assertPreviousIsParent();
  const node = previousOrParentNode;
  const native = node.native as RElement;

  // In order to match current behavior, native DOM event listeners must be added for all
  // events (including outputs).
  if ((renderer as ProceduralRenderer3).listen) {
    const cleanupFn = (renderer as ProceduralRenderer3).listen(native, eventName, listener);
    (cleanup || (cleanup = currentView.cleanup = [])).push(cleanupFn, null);
  } else {
    native.addEventListener(eventName, listener, useCapture);
    (cleanup || (cleanup = currentView.cleanup = [])).push(eventName, native, listener, useCapture);
  }

  let staticData: LNodeStatic|null = node.staticData !;
  if (staticData.outputs === undefined) {
    // if we create LNodeStatic here, inputs must be undefined so we know they still need to be
    // checked
    staticData.outputs = null;
    staticData = generatePropertyAliases(node.flags, staticData);
  }

  const outputs = staticData.outputs;
  let outputData: (number | string)[]|undefined;
  if (outputs && (outputData = outputs[eventName])) {
    outputCreate(outputData, listener);
  }
}

/**
 * Iterates through the outputs associated with a particular event name and subscribes to
 * each output.
 */
function outputCreate(outputs: (number | string)[], listener: Function): void {
  for (let i = 0; i < outputs.length; i += 2) {
    ngDevMode && assertDataInRange(outputs[i] as number);
    const subscription = data[outputs[i] as number][outputs[i | 1]].subscribe(listener);
    cleanup !.push(subscription.unsubscribe, subscription);
  }
}

/**
 * Mark the end of the element.
 */
export function elementEnd() {
  if (isParent) {
    isParent = false;
  } else {
    ngDevMode && assertHasParent();
    previousOrParentNode = previousOrParentNode.parent !;
  }
  ngDevMode && assertNodeType(previousOrParentNode, LNodeFlags.Element);
  const query = previousOrParentNode.query;
  query && query.addNode(previousOrParentNode);
}

/**
 * Update an attribute on an Element. This is used with a `bind` instruction.
 *
 * @param index The index of the element to update in the data array
 * @param attrName Name of attribute. Because it is going to DOM, this is not subject to
 *        renaming as port of minification.
 * @param value Value to write. This value will go through stringification.
 */
export function elementAttribute(index: number, attrName: string, value: any): void {
  if (value !== NO_CHANGE) {
    const element = data[index] as LElement;
    if (value == null) {
      (renderer as ProceduralRenderer3).removeAttribute ?
          (renderer as ProceduralRenderer3).removeAttribute(element.native, attrName) :
          element.native.removeAttribute(attrName);
    } else {
      (renderer as ProceduralRenderer3).setAttribute ?
          (renderer as ProceduralRenderer3).setAttribute(element.native, attrName, value) :
          element.native.setAttribute(attrName, value);
    }
  }
}

/**
 * Update a property on an Element.
 *
 * If the property name also exists as an input property on one of the element's directives,
 * the component property will be set instead of the element property. This check is also
 * done at compile time to determine whether to generate an i() or p() instruction, but must
 * be conducted at runtime as well so child components that add new @Inputs don't have to be
 * re-compiled.
 *
 * @param index The index of the element to update in the data array
 * @param propName Name of property. Because it is going to DOM, this is not subject to
 *        renaming as part of minification.
 * @param value New value to write.
 */

export function elementProperty<T>(index: number, propName: string, value: T | NO_CHANGE): void {
  if (value === NO_CHANGE) return;
  const node = data[index] as LElement;

  let staticData: LNodeStatic|null = node.staticData !;
  // if staticData.inputs is undefined, a listener has created output staticData, but inputs haven't
  // yet been checked
  if (staticData.inputs === undefined) {
    // mark inputs as checked
    staticData.inputs = null;
    staticData = generatePropertyAliases(node.flags, staticData, true);
  }

  const inputData = staticData.inputs;
  let dataValue: PropertyAliasValue|null;
  if (inputData && (dataValue = inputData[propName])) {
    setInputsForProperty(dataValue, value);
  } else {
    const native = node.native;
    (renderer as ProceduralRenderer3).setProperty ?
        (renderer as ProceduralRenderer3).setProperty(native, propName, value) :
        native.setProperty ? native.setProperty(propName, value) :
                             (native as any)[propName] = value;
  }
}

/**
 * Constructs a LNodeStatic object from the arguments.
 *
 * @param tagName
 * @param attrs
 * @param containerStatic
 * @returns the LNodeStatic object
 */
function createNodeStatic(
    tagName: string | null, attrs: string[] | null,
    containerStatic: (LNodeStatic | null)[][] | null): LNodeStatic {
  return {
    tagName,
    attrs,
    initialInputs: undefined,
    inputs: undefined,
    outputs: undefined,
    containerStatic: containerStatic
  };
}

/**
 * Given a list of directive indices and minified input names, sets the
 * input properties on the corresponding directives.
 */
function setInputsForProperty(inputs: (number | string)[], value: any): void {
  for (let i = 0; i < inputs.length; i += 2) {
    ngDevMode && assertDataInRange(inputs[i] as number);
    data[inputs[i] as number][inputs[i | 1]] = value;
  }
}

/**
 * This function consolidates all the inputs or outputs defined by directives
 * on this node into one object and stores it in ngStaticData so it can
 * be shared between all templates of this type.
 *
 * @param index Index where data should be stored in ngStaticData
 */
function generatePropertyAliases(
    flags: number, data: LNodeStatic, isInputData = false): LNodeStatic {
  const start = flags >> LNodeFlags.INDX_SHIFT;
  const size = (flags & LNodeFlags.SIZE_MASK) >> LNodeFlags.SIZE_SHIFT;

  for (let i = start, ii = start + size; i < ii; i++) {
    const directiveDef: DirectiveDef<any> = ngStaticData ![i] as DirectiveDef<any>;
    const propertyAliasMap: {[publicName: string]: string} =
        isInputData ? directiveDef.inputs : directiveDef.outputs;
    for (let publicName in propertyAliasMap) {
      if (propertyAliasMap.hasOwnProperty(publicName)) {
        const internalName = propertyAliasMap[publicName];
        const staticDirData: PropertyAliases = isInputData ? (data.inputs || (data.inputs = {})) :
                                                             (data.outputs || (data.outputs = {}));
        const hasProperty: boolean = staticDirData.hasOwnProperty(publicName);
        hasProperty ? staticDirData[publicName].push(i, internalName) :
                      (staticDirData[publicName] = [i, internalName]);
      }
    }
  }
  return data;
}

/**
 * Add or remove a class in a classList.
 *
 * This instruction is meant to handle the [class.foo]="exp" case
 *
 * @param index The index of the element to update in the data array
 * @param className Name of class to toggle. Because it is going to DOM, this is not subject to
 *        renaming as part of minification.
 * @param value A value indicating if a given class should be added or removed.
 */
export function elementClass<T>(index: number, className: string, value: T | NO_CHANGE): void {
  if (value !== NO_CHANGE) {
    const lElement = data[index] as LElement;
    if (value) {
      (renderer as ProceduralRenderer3).addClass ?
          (renderer as ProceduralRenderer3).addClass(lElement.native, className) :
          lElement.native.classList.add(className);

    } else {
      (renderer as ProceduralRenderer3).removeClass ?
          (renderer as ProceduralRenderer3).removeClass(lElement.native, className) :
          lElement.native.classList.remove(className);
    }
  }
}

/**
 * Update a given style on an Element.
 *
 * @param index Index of the element to change in the data array
 * @param styleName Name of property. Because it is going to DOM this is not subject to
 *        renaming as part of minification.
 * @param value New value to write (null to remove).
 * @param suffix Suffix to add to style's value (optional).
 */
export function elementStyle<T>(
    index: number, styleName: string, value: T | NO_CHANGE, suffix?: string): void {
  if (value !== NO_CHANGE) {
    const lElement = data[index] as LElement;
    if (value == null) {
      (renderer as ProceduralRenderer3).removeStyle ?
          (renderer as ProceduralRenderer3)
              .removeStyle(lElement.native, styleName, RendererStyleFlags3.DashCase) :
          lElement.native.style.removeProperty(styleName);
    } else {
      (renderer as ProceduralRenderer3).setStyle ?
          (renderer as ProceduralRenderer3)
              .setStyle(
                  lElement.native, styleName, suffix ? stringify(value) + suffix : stringify(value),
                  RendererStyleFlags3.DashCase) :
          lElement.native.style.setProperty(
              styleName, suffix ? stringify(value) + suffix : stringify(value));
    }
  }
}



//////////////////////////
//// Text
//////////////////////////

/**
 * Create static text node
 *
 * @param index Index of the node in the data array.
 * @param value Value to write. This value will be stringified.
 *   If value is not provided than the actual creation of the text node is delayed.
 */
export function textCreate(index: number, value?: any): void {
  ngDevMode && assertEqual(currentView.bindingStartIndex, null, 'bindingStartIndex');
  const textNode = value != null ?
      ((renderer as ProceduralRenderer3).createText ?
           (renderer as ProceduralRenderer3).createText(stringify(value)) :
           (renderer as ObjectOrientedRenderer3).createTextNode !(stringify(value))) :
      null;
  const node = createLNode(index, LNodeFlags.Element, textNode);
  // Text nodes are self closing.
  isParent = false;
  appendChild(node.parent !, textNode, currentView);
}

/**
 * Create text node with binding
 * Bindings should be handled externally with the proper bind(1-8) method
 *
 * @param index Index of the node in the data array.
 * @param value Stringified value to write.
 */
export function textCreateBound<T>(index: number, value: T | NO_CHANGE): void {
  // TODO(misko): I don't think index < nodes.length check is needed here.
  let existingNode = index < data.length && data[index] as LText;
  if (existingNode && existingNode.native) {
    // If DOM node exists and value changed, update textContent
    value !== NO_CHANGE &&
        ((renderer as ProceduralRenderer3).setValue ?
             (renderer as ProceduralRenderer3).setValue(existingNode.native, stringify(value)) :
             existingNode.native.textContent = stringify(value));
  } else if (existingNode) {
    // Node was created but DOM node creation was delayed. Create and append now.
    existingNode.native =
        ((renderer as ProceduralRenderer3).createText ?
             (renderer as ProceduralRenderer3).createText(stringify(value)) :
             (renderer as ObjectOrientedRenderer3).createTextNode !(stringify(value)));
    insertChild(existingNode, currentView);
  } else {
    textCreate(index, value);
  }
}


//////////////////////////
//// Directive
//////////////////////////

/**
 * Create or retrieve the directive.
 *
 * NOTE: directives can be created in order other than the index order. They can also
 *       be retrieved before they are created in which case the value will be null.
 *
 * @param index Each directive in a `View` will have a unique index. Directives can
 *        be created or retrieved out of order.
 * @param directive The directive instance.
 * @param directiveDef DirectiveDef object which contains information about the template.
 */
export function directiveCreate<T>(index: number): T;
export function directiveCreate<T>(index: number, directive: T, directiveDef: DirectiveDef<T>): T;
export function directiveCreate<T>(
    index: number, directive?: T, directiveDef?: DirectiveDef<T>): T {
  let instance;
  if (directive == null) {
    // return existing
    ngDevMode && assertDataInRange(index);
    instance = data[index];
  } else {
    ngDevMode && assertEqual(currentView.bindingStartIndex, null, 'bindingStartIndex');
    ngDevMode && assertPreviousIsParent();
    let flags = previousOrParentNode !.flags;
    let size = flags & LNodeFlags.SIZE_MASK;
    if (size === 0) {
      flags =
          (index << LNodeFlags.INDX_SHIFT) | LNodeFlags.SIZE_SKIP | flags & LNodeFlags.TYPE_MASK;
    } else {
      flags += LNodeFlags.SIZE_SKIP;
    }
    previousOrParentNode !.flags = flags;

    ngDevMode && assertDataInRange(index - 1);
    Object.defineProperty(
        directive, NG_HOST_SYMBOL, {enumerable: false, value: previousOrParentNode});
    data[index] = instance = directive;

    if (index >= ngStaticData.length) {
      ngStaticData[index] = directiveDef !;
    }

    const diPublic = directiveDef !.diPublic;
    if (diPublic) {
      diPublic(directiveDef !);
    }

    const staticData: LNodeStatic|null = previousOrParentNode.staticData !;
    if (staticData && staticData.attrs) {
      setInputsFromAttrs<T>(instance, directiveDef !.inputs, staticData);
    }
  }

  return instance;
}

/**
 * Sets initial input properties on directive instances from attribute data
 *
 * @param instance Instance of the directive on which to set the initial inputs
 * @param inputs The list of inputs from the directive def
 * @param staticData The static data for this node
 */
function setInputsFromAttrs<T>(
    instance: T, inputs: {[key: string]: string}, staticData: LNodeStatic): void {
  const directiveIndex =
      ((previousOrParentNode.flags & LNodeFlags.SIZE_MASK) >> LNodeFlags.SIZE_SHIFT) - 1;

  let initialInputData = staticData.initialInputs as InitialInputData | undefined;
  if (initialInputData === undefined || directiveIndex >= initialInputData.length) {
    initialInputData = generateInitialInputs(directiveIndex, inputs, staticData);
  }

  const initialInputs: InitialInputs|null = initialInputData[directiveIndex];
  if (initialInputs) {
    for (let i = 0; i < initialInputs.length; i += 2) {
      (instance as any)[initialInputs[i]] = initialInputs[i | 1];
    }
  }
}

/**
 * Generates initialInputData for a node and stores it in the template's static storage
 * so subsequent template invocations don't have to recalculate it.
 *
 * initialInputData is an array containing values that need to be set as input properties
 * for directives on this node, but only once on creation. We need this array to support
 * the case where you set an @Input property of a directive using attribute-like syntax.
 * e.g. if you have a `name` @Input, you can set it once like this:
 *
 * <my-component name="Bess"></my-component>
 *
 * @param directiveIndex Index to store the initial input data
 * @param inputs The list of inputs from the directive def
 * @param  staticData The static data on this node
 */
function generateInitialInputs(
    directiveIndex: number, inputs: {[key: string]: string},
    staticData: LNodeStatic): InitialInputData {
  const initialInputData: InitialInputData =
      staticData.initialInputs || (staticData.initialInputs = []);
  initialInputData[directiveIndex] = null;

  const attrs = staticData.attrs !;
  for (let i = 0; i < attrs.length; i += 2) {
    const attrName = attrs[i];
    const minifiedInputName = inputs[attrName];
    if (minifiedInputName !== undefined) {
      const inputsToStore: InitialInputs =
          initialInputData[directiveIndex] || (initialInputData[directiveIndex] = []);
      inputsToStore.push(minifiedInputName, attrs[i | 1]);
    }
  }
  return initialInputData;
}

/**
 * Makes a directive public to the DI system by adding it to an injector's bloom filter.
 *
 * @param def The definition of the directive to be made public
 */
export function diPublic(def: DirectiveDef<any>): void {
  bloomAdd(getOrCreateNodeInjector(), def.type);
}

/**
 * Accepts a lifecycle hook type and determines when and how the related lifecycle hook
 * callback should run.
 *
 * For the onInit lifecycle hook, it will return whether or not the ngOnInit() function
 * should run. If so, ngOnInit() will be called outside of this function.
 *
 * e.g. l(LifecycleGuard.ON_INIT) && ctx.ngOnInit();
 *
 * For the onDestroy lifecycle hook, this instruction also accepts an onDestroy
 * method that should be stored and called internally when the parent view is being
 * cleaned up.
 *
 * e.g.  l(LifecycleGuard.ON_DESTROY, ctx, ctx.onDestroy);
 *
 * @param lifeCycle
 * @param self
 * @param method
 */
export function directiveLifeCycle(
    lifeCycle: LifeCycleGuard.ON_DESTROY, self: any, method: Function): void;
export function directiveLifeCycle(lifeCycle: LifeCycleGuard): boolean;
export function directiveLifeCycle(
    lifeCycle: LifeCycleGuard, self?: any, method?: Function): boolean {
  if (lifeCycle === LifeCycleGuard.ON_INIT) {
    return creationMode;
  } else if (lifeCycle === LifeCycleGuard.ON_DESTROY) {
    (cleanup || (currentView.cleanup = cleanup = [])).push(method, self);
  }
  return false;
}


//////////////////////////
//// ViewContainer & View
//////////////////////////

/**
 * Creates an LContainer.
 *
 * Only `LView`s can go into `LContainer`.
 *
 * @param index The index of the container in the data array
 * @param template Optional inline template
 * @param tagName The name of the container element, if applicable
 * @param attrs The attrs attached to the container, if applicable
 */
export function containerCreate(
    index: number, template?: ComponentTemplate<any>, tagName?: string, attrs?: string[]): void {
  ngDevMode && assertEqual(currentView.bindingStartIndex, null, 'bindingStartIndex');

  // If the direct parent of the container is a view, its views (including its comment)
  // will need to be added through insertView() when its parent view is being inserted.
  // For now, it is marked "headless" so we know to append its views later.
  let comment = renderer.createComment(ngDevMode ? 'container' : '');
  let renderParent: LElement|null = null;
  const currentParent = isParent ? previousOrParentNode : previousOrParentNode.parent !;
  ngDevMode && assertNotEqual(currentParent, null, 'currentParent');
  if (appendChild(currentParent, comment, currentView)) {
    // we are adding to an Element which is either:
    // - Not a component (will not be re-projected, just added)
    // - View of the Component
    renderParent = currentParent as LElement;
  }

  const node = createLNode(index, LNodeFlags.Container, comment, <ContainerState>{
    views: [],
    nextIndex: 0, renderParent,
    template: template == null ? null : template,
    next: null,
    parent: currentView
  });

  if (node.staticData == null) {
    node.staticData = ngStaticData[index] = createNodeStatic(tagName || null, attrs || null, []);
  }

  // Containers are added to the current view tree instead of their embedded views
  // because views can be removed and re-inserted.
  addToViewTree(node.data);
}

export function containerEnd() {
  if (isParent) {
    isParent = false;
  } else {
    ngDevMode && assertHasParent();
    previousOrParentNode = previousOrParentNode.parent !;
  }
  ngDevMode && assertNodeType(previousOrParentNode, LNodeFlags.Container);
}

/**
 * Sets a container up to receive views.
 *
 * @param index The index of the container in the data array
 */
export function refreshContainer(index: number): void {
  ngDevMode && assertDataInRange(index);
  previousOrParentNode = data[index] as LNode;
  ngDevMode && assertNodeType(previousOrParentNode, LNodeFlags.Container);
  isParent = true;
  (previousOrParentNode as LContainer).data.nextIndex = 0;
}

/**
 * Marks the end of the LContainer.
 *
 * Marking the end of ViewContainer is the time when to child Views get inserted or removed.
 */
export function refreshContainerEnd(): void {
  if (isParent) {
    isParent = false;
  } else {
    ngDevMode && assertNodeType(previousOrParentNode, LNodeFlags.View);
    ngDevMode && assertHasParent();
    previousOrParentNode = previousOrParentNode.parent !;
  }
  ngDevMode && assertNodeType(previousOrParentNode, LNodeFlags.Container);
  const container = previousOrParentNode as LContainer;
  ngDevMode && assertNodeType(container, LNodeFlags.Container);
  const nextIndex = container.data.nextIndex;
  while (nextIndex < container.data.views.length) {
    // remove extra view.
    removeView(container, nextIndex);
  }
}

/**
 * Creates an LView.
 *
 * @param viewBlockId The ID of this view
 * @return Whether or not this view is in creation mode
 */
export function viewCreate(viewBlockId: number): boolean {
  const container = (isParent ? previousOrParentNode : previousOrParentNode.parent !) as LContainer;
  ngDevMode && assertNodeType(container, LNodeFlags.Container);
  const containerState = container.data;
  const views = containerState.views;

  const existingView: LView|false =
      !creationMode && containerState.nextIndex < views.length && views[containerState.nextIndex];
  let viewUpdateMode = existingView && viewBlockId === (existingView as LView).data.id;

  if (viewUpdateMode) {
    previousOrParentNode = views[containerState.nextIndex++];
    ngDevMode && assertNodeType(previousOrParentNode, LNodeFlags.View);
    isParent = true;
    enterView((existingView as LView).data, previousOrParentNode as LView);
  } else {
    // When we create a new View, we always reset the state of the instructions.
    const newViewState =
        createViewState(viewBlockId, renderer, initViewStaticData(viewBlockId, container));
    enterView(newViewState, createLNode(null, LNodeFlags.View, null, newViewState));
    containerState.nextIndex++;
  }

  return !viewUpdateMode;
}

/**
 * Initialize the static data for the active view.
 *
 * Each embedded view needs to set the global ngStaticData variable to the static data for
 * that view. Otherwise, the view's static data for a particular node would overwrite
 * the staticdata for a node in the view above it with the same index (since it's in the
 * same template).
 *
 * @param viewIndex The index of the view's static data in containerStatic
 * @param parent The parent container in which to look for the view's static data
 * @returns NgStaticData
 */
function initViewStaticData(viewIndex: number, parent: LContainer): NgStaticData {
  ngDevMode && assertNodeType(parent, LNodeFlags.Container);
  const containerStatic = (parent !.staticData as LContainerStatic).containerStatic;
  if (viewIndex >= containerStatic.length || containerStatic[viewIndex] == null) {
    containerStatic[viewIndex] = [];
  }
  return containerStatic[viewIndex];
}

/**
 * Marks the end of the LView.
 */
export function viewEnd(): void {
  isParent = false;
  const viewNode = previousOrParentNode = currentView.node as LView;
  const container = previousOrParentNode.parent as LContainer;
  ngDevMode && assertNodeType(viewNode, LNodeFlags.View);
  ngDevMode && assertNodeType(container, LNodeFlags.Container);
  const containerState = container.data;
  const previousView = containerState.nextIndex <= containerState.views.length ?
      containerState.views[containerState.nextIndex - 1] as LView :
      null;
  const viewIdChanged = previousView == null ? true : previousView.data.id !== viewNode.data.id;

  if (viewIdChanged) {
    insertView(container, viewNode, containerState.nextIndex - 1);
    creationMode = false;
  }
  leaveView(currentView !.parent !);
  ngDevMode && assertEqual(isParent, false, 'isParent');
  ngDevMode && assertNodeType(previousOrParentNode, LNodeFlags.View);
}
/////////////


export const refreshComponent:
    <T>(directiveIndex: number, elementIndex: number, template: ComponentTemplate<T>) =>
        void = function<T>(
            this: undefined | {template: ComponentTemplate<T>}, directiveIndex: number,
            elementIndex: number, template: ComponentTemplate<T>) {
  ngDevMode && assertDataInRange(elementIndex);
  const element = data ![elementIndex] as LElement;
  ngDevMode && assertNodeType(element, LNodeFlags.Element);
  ngDevMode && assertNotEqual(element.data, null, 'isComponent');
  ngDevMode && assertDataInRange(directiveIndex);
  const hostView = element.data !;
  ngDevMode && assertNotEqual(hostView, null, 'hostView');
  const directive = data[directiveIndex];
  const oldView = enterView(hostView, element);
  try {
    (template || this !.template)(directive, creationMode);
  } finally {
    leaveView(oldView);
  }
};

/**
 * Instruction to distribute projectable nodes among <ng-content> occurrences in a given template.
 * It takes all the selectors from the entire component's template and decides where
 * each projected node belongs (it re-distributes nodes among "buckets" where each "bucket" is
 * backed by a selector).
 *
 * @param {CssSelector[]} selectors
 */
export function distributeProjectedNodes(selectors?: CssSelector[]): LNode[][] {
  const noOfNodeBuckets = selectors ? selectors.length + 1 : 1;
  const distributedNodes = new Array<LNode[]>(noOfNodeBuckets);
  for (let i = 0; i < noOfNodeBuckets; i++) {
    distributedNodes[i] = [];
  }

  const componentNode = findComponentHost(currentView);
  let componentChild = componentNode.child;

  while (componentChild !== null) {
    if (!selectors) {
      distributedNodes[0].push(componentChild);
    } else if (
        (componentChild.flags & LNodeFlags.TYPE_MASK) === LNodeFlags.Element ||
        (componentChild.flags & LNodeFlags.TYPE_MASK) === LNodeFlags.Container) {
      // Only trying to match selectors against:
      // - elements, excluding text nodes;
      // - containers that have tagName and attributes associated.

      if (componentChild.staticData) {
        for (let i = 0; i < selectors !.length; i++) {
          if (isNodeMatchingSelector(componentChild.staticData, selectors ![i])) {
            distributedNodes[i + 1].push(componentChild);
            break;  // first matching selector "captures" a given node
          } else {
            distributedNodes[0].push(componentChild);
          }
        }
      } else {
        distributedNodes[0].push(componentChild);
      }

    } else if ((componentChild.flags & LNodeFlags.TYPE_MASK) === LNodeFlags.Projection) {
      // we don't descent into nodes to re-project (not trying to match selectors against nodes to
      // re-project)
      distributedNodes[0].push(componentChild);
    }
    componentChild = componentChild.next;
  }

  return distributedNodes;
}

/**
 * Inserts previously re-distributed projected nodes. This instruction must be preceded by a call
 * to the distributeProjectedNodes instruction.
 *
 * @param {number} nodeIndex
 * @param {number} localIndex - index under which distribution of projected nodes was memorized
 * @param {number} selectorIndex - 0 means <ng-content> without any selector
 */
export function contentProjection(
    nodeIndex: number, localIndex: number, selectorIndex: number = 0): void {
  const projectedNodes: ProjectionState = [];
  const node = createLNode(nodeIndex, LNodeFlags.Projection, null, projectedNodes);
  isParent = false;  // self closing
  const currentParent = node.parent;

  // re-distribution of projectable nodes is memorized on a component's view level
  const componentNode = findComponentHost(currentView);

  // make sure that nodes to project were memorized
  const nodesForSelector =
      valueInData<LNode[][]>(componentNode.data !.data !, localIndex)[selectorIndex];

  for (let i = 0; i < nodesForSelector.length; i++) {
    const nodeToProject = nodesForSelector[i];
    if ((nodeToProject.flags & LNodeFlags.TYPE_MASK) === LNodeFlags.Projection) {
      const previouslyProjectedNodes = (nodeToProject as LProjection).data;
      for (let j = 0; j < previouslyProjectedNodes.length; j++) {
        processProjectedNode(
            projectedNodes, previouslyProjectedNodes[j], currentParent, currentView);
      }
    } else {
      processProjectedNode(
          projectedNodes, nodeToProject as LElement | LText | LContainer, currentParent,
          currentView);
    }
  }
}

/**
 * Given a current view, finds the nearest component's host (LElement).
 *
 * @param {ViewState} viewState
 * @returns {LElement}
 */
function findComponentHost(viewState: ViewState): LElement {
  let viewRootLNode = viewState.node;
  while ((viewRootLNode.flags & LNodeFlags.TYPE_MASK) === LNodeFlags.View) {
    ngDevMode && assertNotNull(viewState.parent, 'viewState.parent');
    viewState = viewState.parent !;
    viewRootLNode = viewState.node;
  }

  ngDevMode && assertNodeType(viewRootLNode, LNodeFlags.Element);
  ngDevMode && assertNotNull(viewRootLNode.data, 'node.data');

  return viewRootLNode as LElement;
}

/**
 * Adds a ViewState or a ContainerState to the end of the current
 * view tree.
 *
 * This structure will be used to traverse through nested views
 * to remove listeners and call onDestroy callbacks.
 *
 * @param {ViewState | ContainerState} state
 */
export function addToViewTree<T extends ViewState|ContainerState>(state: T): T {
  currentView.tail ? (currentView.tail.next = state) : (currentView.child = state);
  currentView.tail = state;
  return state;
}

//////////////////////////
//// Bindings
//////////////////////////

/**
 * The type of the NO_CHANGE constant, which can never be structurally matched
 * because of its private member.
 */
export declare class NO_CHANGE_TYPE {
  // This is a brand that ensures that this type can never match anything else
  private _;
}

// This is an alias for NO_CHANGE_TYPE for brevity throughout the codebase.
export type NO_CHANGE = typeof NO_CHANGE_TYPE;

/** A special value which designates that a value has not changed. */
export const NO_CHANGE = {} as NO_CHANGE;

/**
 * Create interpolation bindings with variable number of arguments.
 *
 * If any of the arguments change, then the interpolation is concatenated
 * and causes an update.
 *
 * @param values an array of values to diff.
 */
export function bindV(values: any[]): string|NO_CHANGE {
  let different: boolean;
  let parts: any[];
  if (different = creationMode) {
    // make a copy of the array.
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = parts = values.slice();
  } else {
    parts = data[bindingIndex++];
    different = false;
    for (let i = 0; i < values.length; i++) {
      different = different || values[i] !== NO_CHANGE && isDifferent(values[i], parts[i]);
      if (different && values[i] !== NO_CHANGE) {
        parts[i] = values[i];
      }
    }
  }
  if (different) {
    let str = stringify(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      str += stringify(parts[i]);
    }
    return str;
  } else {
    return NO_CHANGE;
  }
}

// For bindings that have 0 - 7 dynamic values to watch, we can use a bind function that
// matches the number of interpolations. This is faster than using the bindV function above
// because we know ahead of time how many interpolations we'll have and don't need to
// accept the values as an array that will need to be copied and looped over.

/**
 * Create a single value binding without interpolation.
 *
 * @param value Value to diff
 */
export function bind<T>(value: T | NO_CHANGE): T|NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = value;
  } else {
    if (different = value !== NO_CHANGE && isDifferent(data[bindingIndex], value)) {
      data[bindingIndex] = value;
    }
    bindingIndex++;
  }
  return different ? value : NO_CHANGE;
}

/**
 * Create an interpolation bindings with 1 arguments.
 *
 * @param prefix static value used for concatenation only.
 * @param value value checked for change.
 * @param suffix static value used for concatenation only.
 */
export function bind1(prefix: string, value: any, suffix: string): string|NO_CHANGE {
  return bind(value) === NO_CHANGE ? NO_CHANGE : prefix + stringify(value) + suffix;
}

/**
 * Create an interpolation bindings with 2 arguments.
 *
 * @param prefix
 * @param v0 value checked for change
 * @param i0
 * @param v1 value checked for change
 * @param suffix
 */
export function bind2(prefix: string, v0: any, i0: string, v1: any, suffix: string): string|
    NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = {v0: v0, v1: v1};
  } else {
    const parts: {v0: any, v1: any} = data[bindingIndex++];
    if (v0 === NO_CHANGE) v0 = parts.v0;
    if (v1 === NO_CHANGE) v1 = parts.v1;
    if (different = (isDifferent(parts.v0, v0) || isDifferent(parts.v1, v1))) {
      parts.v0 = v0;
      parts.v1 = v1;
    }
  }
  return different ? prefix + stringify(v0) + i0 + stringify(v1) + suffix : NO_CHANGE;
}

/**
 * Create an interpolation bindings with 3 arguments.
 *
 * @param prefix
 * @param v0
 * @param i0
 * @param v1
 * @param i1
 * @param v2
 * @param suffix
 */
export function bind3(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, suffix: string): string|
    NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = {v0: v0, v1: v1, v2: v2};
  } else {
    const parts: {v0: any, v1: any, v2: any} = data[bindingIndex++];
    if (v0 === NO_CHANGE) v0 = parts.v0;
    if (v1 === NO_CHANGE) v1 = parts.v1;
    if (v2 === NO_CHANGE) v2 = parts.v2;
    if (different =
            (isDifferent(parts.v0, v0) || isDifferent(parts.v1, v1) || isDifferent(parts.v2, v2))) {
      parts.v0 = v0;
      parts.v1 = v1;
      parts.v2 = v2;
    }
  }
  return different ? prefix + stringify(v0) + i0 + stringify(v1) + i1 + stringify(v2) + suffix :
                     NO_CHANGE;
}

/**
 * Create an interpolation binding with 4 arguments.
 *
 * @param prefix
 * @param v0
 * @param i0
 * @param v1
 * @param i1
 * @param v2
 * @param i2
 * @param v3
 * @param suffix
 */
export function bind4(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    suffix: string): string|NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = {v0: v0, v1: v1, v2: v2, v3: v3};
  } else {
    const parts: {v0: any, v1: any, v2: any, v3: any} = data[bindingIndex++];
    if (v0 === NO_CHANGE) v0 = parts.v0;
    if (v1 === NO_CHANGE) v1 = parts.v1;
    if (v2 === NO_CHANGE) v2 = parts.v2;
    if (v3 === NO_CHANGE) v3 = parts.v3;
    if (different =
            (isDifferent(parts.v0, v0) || isDifferent(parts.v1, v1) || isDifferent(parts.v2, v2) ||
             isDifferent(parts.v3, v3))) {
      parts.v0 = v0;
      parts.v1 = v1;
      parts.v2 = v2;
      parts.v3 = v3;
    }
  }
  return different ?
      prefix + stringify(v0) + i0 + stringify(v1) + i1 + stringify(v2) + i2 + stringify(v3) +
          suffix :
      NO_CHANGE;
}

/**
 * Create an interpolation binding with 5 arguments.
 *
 * @param prefix
 * @param v0
 * @param i0
 * @param v1
 * @param i1
 * @param v2
 * @param i2
 * @param v3
 * @param i3
 * @param v4
 * @param suffix
 */
export function bind5(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, suffix: string): string|NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = {v0: v0, v1: v1, v2: v2, v3, v4};
  } else {
    const parts: {v0: any, v1: any, v2: any, v3: any, v4: any} = data[bindingIndex++];
    if (v0 === NO_CHANGE) v0 = parts.v0;
    if (v1 === NO_CHANGE) v1 = parts.v1;
    if (v2 === NO_CHANGE) v2 = parts.v2;
    if (v3 === NO_CHANGE) v3 = parts.v3;
    if (v4 === NO_CHANGE) v4 = parts.v4;
    if (different =
            (isDifferent(parts.v0, v0) || isDifferent(parts.v1, v1) || isDifferent(parts.v2, v2) ||
             isDifferent(parts.v3, v3) || isDifferent(parts.v4, v4))) {
      parts.v0 = v0;
      parts.v1 = v1;
      parts.v2 = v2;
      parts.v3 = v3;
      parts.v4 = v4;
    }
  }
  return different ?
      prefix + stringify(v0) + i0 + stringify(v1) + i1 + stringify(v2) + i2 + stringify(v3) + i3 +
          stringify(v4) + suffix :
      NO_CHANGE;
}

/**
 * Create an interpolation binding with 6 arguments.
 *
 * @param prefix
 * @param v0
 * @param i0
 * @param v1
 * @param i1
 * @param v2
 * @param i2
 * @param v3
 * @param i3
 * @param v4
 * @param i4
 * @param v5
 * @param suffix
 */
export function bind6(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, suffix: string): string|NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = {v0: v0, v1: v1, v2: v2, v3: v3, v4: v4, v5: v5};
  } else {
    const parts: {v0: any, v1: any, v2: any, v3: any, v4: any, v5: any} = data[bindingIndex++];
    if (v0 === NO_CHANGE) v0 = parts.v0;
    if (v1 === NO_CHANGE) v1 = parts.v1;
    if (v2 === NO_CHANGE) v2 = parts.v2;
    if (v3 === NO_CHANGE) v3 = parts.v3;
    if (v4 === NO_CHANGE) v4 = parts.v4;
    if (v5 === NO_CHANGE) v5 = parts.v5;
    if (different =
            (isDifferent(parts.v0, v0) || isDifferent(parts.v1, v1) || isDifferent(parts.v2, v2) ||
             isDifferent(parts.v3, v3) || isDifferent(parts.v4, v4) || isDifferent(parts.v5, v5))) {
      parts.v0 = v0;
      parts.v1 = v1;
      parts.v2 = v2;
      parts.v3 = v3;
      parts.v4 = v4;
      parts.v5 = v5;
    }
  }
  return different ?
      prefix + stringify(v0) + i0 + stringify(v1) + i1 + stringify(v2) + i2 + stringify(v3) + i3 +
          stringify(v4) + i4 + stringify(v5) + suffix :
      NO_CHANGE;
}

/**
 * Create an interpolation binding with 7 arguments.
 *
 * @param prefix
 * @param v0
 * @param i0
 * @param v1
 * @param i1
 * @param v2
 * @param i2
 * @param v3
 * @param i3
 * @param v4
 * @param i4
 * @param v5
 * @param i5
 * @param v6
 * @param suffix
 */
export function bind7(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, i5: string, v6: any, suffix: string): string|
    NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = {v0: v0, v1: v1, v2: v2, v3: v3, v4: v4, v5: v5, v6: v6};
  } else {
    const parts: {v0: any, v1: any, v2: any, v3: any, v4: any, v5: any, v6: any} =
        data[bindingIndex++];
    if (v0 === NO_CHANGE) v0 = parts.v0;
    if (v1 === NO_CHANGE) v1 = parts.v1;
    if (v2 === NO_CHANGE) v2 = parts.v2;
    if (v3 === NO_CHANGE) v3 = parts.v3;
    if (v4 === NO_CHANGE) v4 = parts.v4;
    if (v5 === NO_CHANGE) v5 = parts.v5;
    if (v6 === NO_CHANGE) v6 = parts.v6;
    if (different =
            (isDifferent(parts.v0, v0) || isDifferent(parts.v1, v1) || isDifferent(parts.v2, v2) ||
             isDifferent(parts.v3, v3) || isDifferent(parts.v4, v4) || isDifferent(parts.v5, v5) ||
             isDifferent(parts.v6, v6))) {
      parts.v0 = v0;
      parts.v1 = v1;
      parts.v2 = v2;
      parts.v3 = v3;
      parts.v4 = v4;
      parts.v5 = v5;
      parts.v6 = v6;
    }
  }
  return different ?
      prefix + stringify(v0) + i0 + stringify(v1) + i1 + stringify(v2) + i2 + stringify(v3) + i3 +
          stringify(v4) + i4 + stringify(v5) + i5 + stringify(v6) + suffix :
      NO_CHANGE;
}

/**
 * Create an interpolation binding with 8 arguments.
 *
 * @param prefix
 * @param v0
 * @param i0
 * @param v1
 * @param i1
 * @param v2
 * @param i2
 * @param v3
 * @param i3
 * @param v4
 * @param i4
 * @param v5
 * @param i5
 * @param v6
 * @param i6
 * @param v7
 * @param suffix
 */
export function bind8(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, i5: string, v6: any, i6: string, v7: any,
    suffix: string): string|NO_CHANGE {
  let different: boolean;
  if (different = creationMode) {
    if (typeof currentView.bindingStartIndex !== 'number') {
      bindingIndex = currentView.bindingStartIndex = data.length;
    }
    data[bindingIndex++] = {v0: v0, v1: v1, v2: v2, v3: v3, v4: v4, v5: v5, v6: v6, v7: v7};
  } else {
    const parts: {v0: any, v1: any, v2: any, v3: any, v4: any, v5: any, v6: any, v7: any} =
        data[bindingIndex++];
    if (v0 === NO_CHANGE) v0 = parts.v0;
    if (v1 === NO_CHANGE) v1 = parts.v1;
    if (v2 === NO_CHANGE) v2 = parts.v2;
    if (v3 === NO_CHANGE) v3 = parts.v3;
    if (v4 === NO_CHANGE) v4 = parts.v4;
    if (v5 === NO_CHANGE) v5 = parts.v5;
    if (v6 === NO_CHANGE) v6 = parts.v6;
    if (v7 === NO_CHANGE) v7 = parts.v7;
    if (different =
            (isDifferent(parts.v0, v0) || isDifferent(parts.v1, v1) || isDifferent(parts.v2, v2) ||
             isDifferent(parts.v3, v3) || isDifferent(parts.v4, v4) || isDifferent(parts.v5, v5) ||
             isDifferent(parts.v6, v6))) {
      parts.v0 = v0;
      parts.v1 = v1;
      parts.v2 = v2;
      parts.v3 = v3;
      parts.v4 = v4;
      parts.v5 = v5;
      parts.v6 = v6;
      parts.v7 = v7;
    }
  }
  return different ?
      prefix + stringify(v0) + i0 + stringify(v1) + i1 + stringify(v2) + i2 + stringify(v3) + i3 +
          stringify(v4) + i4 + stringify(v5) + i5 + stringify(v6) + i6 + stringify(v7) + suffix :
      NO_CHANGE;
}

export function memory<T>(index: number, value?: T): T {
  return valueInData<T>(data, index, value);
}

function valueInData<T>(data: any[], index: number, value?: T): T {
  ngDevMode && assertDataInRange(index, data);
  if (value === undefined) {
    value = data[index];
  } else {
    // We don't store any static data for local variables, so the first time
    // we see the template, we should store as null to avoid a sparse array
    if (index >= ngStaticData.length) {
      ngStaticData[index] = null;
    }
    data[index] = value;
  }
  return value !;
}

export function queryCreate<T>(predicate: Type<any>| any[], descend?: boolean): QueryList<T> {
  ngDevMode && assertPreviousIsParent();
  const queryList = new QueryList<T>();
  const query = currentQuery || (currentQuery = new QueryState_());
  query.track(queryList, predicate, descend);
  return queryList;
}



function assertPreviousIsParent() {
  assertEqual(isParent, true, 'isParent');
}

function assertHasParent() {
  assertNotEqual(previousOrParentNode.parent, null, 'isParent');
}

function assertDataInRange(index: number, arr?: any[]) {
  if (arr == null) arr = data;
  assertLessThan(arr ? arr.length : 0, index, 'data.length');
}
