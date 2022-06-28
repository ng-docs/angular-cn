/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// We are temporarily importing the existing viewEngine from core so we can be sure we are
// correctly implementing its interfaces for backwards compatibility.
import {Injector} from '../di/injector';
import {Type} from '../interface/type';
import {Sanitizer} from '../sanitization/sanitizer';
import {assertDefined, assertIndexInRange} from '../util/assert';

import {assertComponentType} from './assert';
import {readPatchedLView} from './context_discovery';
import {getComponentDef} from './definition';
import {diPublicInInjector, getOrCreateNodeInjectorForNode} from './di';
import {throwProviderNotFoundError} from './errors_di';
import {registerPostOrderHooks} from './hooks';
import {addToViewTree, CLEAN_PROMISE, createLView, createTView, getOrCreateTComponentView, getOrCreateTNode, initTNodeFlags, instantiateRootComponent, invokeHostBindingsInCreationMode, locateHostElement, markAsComponentHost, refreshView, registerHostBindingOpCodes, renderView} from './instructions/shared';
import {ComponentDef, ComponentType, RenderFlags} from './interfaces/definition';
import {TElementNode, TNodeType} from './interfaces/node';
import {PlayerHandler} from './interfaces/player';
import {domRendererFactory3, Renderer3, RendererFactory3} from './interfaces/renderer';
import {RElement} from './interfaces/renderer_dom';
import {CONTEXT, HEADER_OFFSET, LView, LViewFlags, RootContext, RootContextFlags, TVIEW, TViewType} from './interfaces/view';
import {writeDirectClass, writeDirectStyle} from './node_manipulation';
import {enterView, getCurrentTNode, leaveView, setSelectedIndex} from './state';
import {computeStaticStyling} from './styling/static_styling';
import {setUpAttributes} from './util/attrs_utils';
import {publishDefaultGlobalUtils} from './util/global_utils';
import {defaultScheduler} from './util/misc_utils';
import {getRootContext} from './util/view_traversal_utils';



/**
 * Options that control how the component should be bootstrapped.
 *
 * 控制组件如何引导的选项。
 *
 */
export interface CreateComponentOptions {
  /**
   * Which renderer factory to use.
   *
   * 要使用哪个渲染器工厂。
   *
   */
  rendererFactory?: RendererFactory3;

  /**
   * A custom sanitizer instance
   *
   * 自定义清洁器实例
   *
   */
  sanitizer?: Sanitizer;

  /**
   * A custom animation player handler
   *
   * 自定义动画播放器处理程序
   *
   */
  playerHandler?: PlayerHandler;

  /**
   * Host element on which the component will be bootstrapped. If not specified,
   * the component definition's `tag` is used to query the existing DOM for the
   * element to bootstrap.
   *
   * 将在其上引导组件的主机元素。如果未指定，则组件定义的 `tag` 用于在现有的 DOM
   * 中查询要引导的元素。
   *
   */
  host?: RElement|string;

  /**
   * Module injector for the component. If unspecified, the injector will be NULL_INJECTOR.
   *
   * 组件的模块注入器。如果未指定，则注入器将是 NULL_INJECTOR。
   *
   */
  injector?: Injector;

  /**
   * List of features to be applied to the created component. Features are simply
   * functions that decorate a component with a certain behavior.
   *
   * 要应用于创建的组件的特性列表。特性只是用某种行为装饰组件的函数。
   *
   * Typically, the features in this list are features that cannot be added to the
   * other features list in the component definition because they rely on other factors.
   *
   * 通常，此列表中的特性是无法添加到组件定义中其他特性列表的特性，因为它们依赖于其他因素。
   *
   * Example: `LifecycleHooksFeature` is a function that adds lifecycle hook capabilities
   * to root components in a tree-shakable way. It cannot be added to the component
   * features list because there's no way of knowing when the component will be used as
   * a root component.
   *
   * 示例： `LifecycleHooksFeature`
   * 是一个函数，它以树形抖动的方式将生命周期钩子特性添加到根组件。无法将其添加到组件特性列表中，因为无法知道此组件何时将被用作根组件。
   *
   */
  hostFeatures?: HostFeature[];

  /**
   * A function which is used to schedule change detection work in the future.
   *
   * 用于安排将来变更检测工作的函数。
   *
   * When marking components as dirty, it is necessary to schedule the work of
   * change detection in the future. This is done to coalesce multiple
   * {@link markDirty} calls into a single changed detection processing.
   *
   * 将组件标记为脏时，有必要安排将来的变更检测工作。这样做是为了将多个 {@link markDirty}
   * 调用合并到一个更改的检测处理中。
   *
   * The default value of the scheduler is the `requestAnimationFrame` function.
   *
   * 调度程序的默认值是 `requestAnimationFrame` 函数。
   *
   * It is also useful to override this function for testing purposes.
   *
   * 出于测试目的覆盖此函数也很有用。
   *
   */
  scheduler?: (work: () => void) => void;
}

/**
 * See CreateComponentOptions.hostFeatures
 *
 * 请参阅 CreateComponentOptions.hostFeatures
 *
 */
type HostFeature = (<T>(component: T, componentDef: ComponentDef<T>) => void);

// TODO: A hack to not pull in the NullInjector from @angular/core.
export const NULL_INJECTOR: Injector = {
  get: (token: any, notFoundValue?: any) => {
    throwProviderNotFoundError(token, 'NullInjector');
  }
};

/**
 * Bootstraps a Component into an existing host element and returns an instance
 * of the component.
 *
 * 将 Component 引导到现有的宿主元素中，并返回组件的实例。
 *
 * Use this function to bootstrap a component into the DOM tree. Each invocation
 * of this function will create a separate tree of components, injectors and
 * change detection cycles and lifetimes. To dynamically insert a new component
 * into an existing tree such that it shares the same injection, change detection
 * and object lifetime, use {@link ViewContainer#createComponent}.
 *
 * 使用此函数将组件引导到 DOM
 * 树。此函数的每次调用都将创建一个单独的组件、注入器以及变更检测周期和生命周期的树。要将新组件动态插入现有树，以使其共享相同的注入、变更检测和对象生命周期，请使用 {@link
 * ViewContainer#createComponent} 。
 *
 * @param componentType Component to bootstrap
 *
 * 要引导的组件
 *
 * @param options Optional parameters which control bootstrapping
 *
 * 控制自举的可选参数
 *
 */
export function renderComponent<T>(
    componentType: ComponentType<T>|
    Type<T>/* Type as workaround for: Microsoft/TypeScript/issues/4881 */
    ,
    opts: CreateComponentOptions = {}): T {
  ngDevMode && publishDefaultGlobalUtils();
  ngDevMode && assertComponentType(componentType);

  const rendererFactory = opts.rendererFactory || domRendererFactory3;
  const sanitizer = opts.sanitizer || null;
  const componentDef = getComponentDef<T>(componentType)!;
  if (componentDef.type != componentType) (componentDef as {type: Type<any>}).type = componentType;

  // The first index of the first selector is the tag name.
  const componentTag = componentDef.selectors![0]![0] as string;
  const hostRenderer = rendererFactory.createRenderer(null, null);
  const hostRNode =
      locateHostElement(hostRenderer, opts.host || componentTag, componentDef.encapsulation);
  const rootFlags = componentDef.onPush ? LViewFlags.Dirty | LViewFlags.IsRoot :
                                          LViewFlags.CheckAlways | LViewFlags.IsRoot;
  const rootContext = createRootContext(opts.scheduler, opts.playerHandler);

  const renderer = rendererFactory.createRenderer(hostRNode, componentDef);
  const rootTView = createTView(TViewType.Root, null, null, 1, 0, null, null, null, null, null);
  const rootView: LView = createLView(
      null, rootTView, rootContext, rootFlags, null, null, rendererFactory, renderer, null,
      opts.injector || null, null);

  enterView(rootView);
  let component: T;

  try {
    if (rendererFactory.begin) rendererFactory.begin();
    const componentView = createRootComponentView(
        hostRNode, componentDef, rootView, rendererFactory, renderer, sanitizer);
    component = createRootComponent(
        componentView, componentDef, rootView, rootContext, opts.hostFeatures || null);

    // create mode pass
    renderView(rootTView, rootView, null);
    // update mode pass
    refreshView(rootTView, rootView, null, null);

  } finally {
    leaveView();
    if (rendererFactory.end) rendererFactory.end();
  }

  return component;
}

/**
 * Creates the root component view and the root component node.
 *
 * 创建根组件视图和根组件节点。
 *
 * @param rNode Render host element.
 *
 * 渲染宿主元素。
 *
 * @param def ComponentDef
 *
 * 组件定义
 *
 * @param rootView The parent view where the host node is stored
 *
 * 存储主机节点的父视图
 *
 * @param rendererFactory Factory to be used for creating child renderers.
 *
 * 用于创建子渲染器的工厂。
 *
 * @param hostRenderer The current renderer
 *
 * 当前渲染器
 *
 * @param sanitizer The sanitizer, if provided
 *
 * 消毒剂（如果提供）
 *
 * @returns
 *
 * Component view created
 *
 * 创建的组件视图
 *
 */
export function createRootComponentView(
    rNode: RElement|null, def: ComponentDef<any>, rootView: LView,
    rendererFactory: RendererFactory3, hostRenderer: Renderer3, sanitizer?: Sanitizer|null): LView {
  const tView = rootView[TVIEW];
  const index = HEADER_OFFSET;
  ngDevMode && assertIndexInRange(rootView, index);
  rootView[index] = rNode;
  // '#host' is added here as we don't know the real host DOM name (we don't want to read it) and at
  // the same time we want to communicate the debug `TNode` that this is a special `TNode`
  // representing a host element.
  const tNode: TElementNode = getOrCreateTNode(tView, index, TNodeType.Element, '#host', null);
  const mergedAttrs = tNode.mergedAttrs = def.hostAttrs;
  if (mergedAttrs !== null) {
    computeStaticStyling(tNode, mergedAttrs, true);
    if (rNode !== null) {
      setUpAttributes(hostRenderer, rNode, mergedAttrs);
      if (tNode.classes !== null) {
        writeDirectClass(hostRenderer, rNode, tNode.classes);
      }
      if (tNode.styles !== null) {
        writeDirectStyle(hostRenderer, rNode, tNode.styles);
      }
    }
  }

  const viewRenderer = rendererFactory.createRenderer(rNode, def);
  const componentView = createLView(
      rootView, getOrCreateTComponentView(def), null,
      def.onPush ? LViewFlags.Dirty : LViewFlags.CheckAlways, rootView[index], tNode,
      rendererFactory, viewRenderer, sanitizer || null, null, null);

  if (tView.firstCreatePass) {
    diPublicInInjector(getOrCreateNodeInjectorForNode(tNode, rootView), tView, def.type);
    markAsComponentHost(tView, tNode);
    initTNodeFlags(tNode, rootView.length, 1);
  }

  addToViewTree(rootView, componentView);

  // Store component view at node index, with node as the HOST
  return rootView[index] = componentView;
}

/**
 * Creates a root component and sets it up with features and host bindings. Shared by
 * renderComponent() and ViewContainerRef.createComponent().
 *
 * 创建一个根组件并使用特性和主机绑定对其进行设置。由 renderComponent() 和
 * ViewContainerRef.createComponent() 共享。
 *
 */
export function createRootComponent<T>(
    componentView: LView, componentDef: ComponentDef<T>, rootLView: LView, rootContext: RootContext,
    hostFeatures: HostFeature[]|null): any {
  const tView = rootLView[TVIEW];
  // Create directive instance with factory() and store at next index in viewData
  const component = instantiateRootComponent(tView, rootLView, componentDef);

  rootContext.components.push(component);
  componentView[CONTEXT] = component;

  hostFeatures && hostFeatures.forEach((feature) => feature(component, componentDef));

  // We want to generate an empty QueryList for root content queries for backwards
  // compatibility with ViewEngine.
  if (componentDef.contentQueries) {
    const tNode = getCurrentTNode()!;
    ngDevMode && assertDefined(tNode, 'TNode expected');
    componentDef.contentQueries(RenderFlags.Create, component, tNode.directiveStart);
  }

  const rootTNode = getCurrentTNode()!;
  ngDevMode && assertDefined(rootTNode, 'tNode should have been already created');
  if (tView.firstCreatePass &&
      (componentDef.hostBindings !== null || componentDef.hostAttrs !== null)) {
    setSelectedIndex(rootTNode.index);

    const rootTView = rootLView[TVIEW];
    registerHostBindingOpCodes(
        rootTView, rootTNode, rootLView, rootTNode.directiveStart, rootTNode.directiveEnd,
        componentDef);

    invokeHostBindingsInCreationMode(componentDef, component);
  }
  return component;
}


export function createRootContext(
    scheduler?: (workFn: () => void) => void, playerHandler?: PlayerHandler|null): RootContext {
  return {
    components: [],
    scheduler: scheduler || defaultScheduler,
    clean: CLEAN_PROMISE,
    playerHandler: playerHandler || null,
    flags: RootContextFlags.Empty
  };
}

/**
 * Used to enable lifecycle hooks on the root component.
 *
 * 用于在根组件上启用生命周期钩子。
 *
 * Include this feature when calling `renderComponent` if the root component
 * you are rendering has lifecycle hooks defined. Otherwise, the hooks won't
 * be called properly.
 *
 * 如果你要渲染的根组件定义了生命周期钩子，则在调用 `renderComponent`
 * 时包含此特性。否则，这些钩子将无法被正确调用。
 *
 * Example:
 *
 * 示例：
 *
 * ```
 * renderComponent(AppComponent, {hostFeatures: [LifecycleHooksFeature]});
 * ```
 *
 */
export function LifecycleHooksFeature(component: any, def: ComponentDef<any>): void {
  const lView = readPatchedLView(component)!;
  ngDevMode && assertDefined(lView, 'LView is required');
  const tView = lView[TVIEW];
  const tNode = getCurrentTNode()!;
  ngDevMode && assertDefined(tNode, 'TNode is required');
  registerPostOrderHooks(tView, tNode);
}

/**
 * Wait on component until it is rendered.
 *
 * 等待组件，直到它被渲染。
 *
 * This function returns a `Promise` which is resolved when the component's
 * change detection is executed. This is determined by finding the scheduler
 * associated with the `component`'s render tree and waiting until the scheduler
 * flushes. If nothing is scheduled, the function returns a resolved promise.
 *
 * 此函数返回一个 `Promise` ，它在执行组件的变更检测时会被解析。这是通过查找与 `component`
 * 的渲染树关联的调度程序并等到调度程序刷新来确定的。如果没有任何计划，则该函数会返回已解析的
 * Promise。
 *
 * Example:
 *
 * 示例：
 *
 * ```
 * await whenRendered(myComponent);
 * ```
 *
 * @param component Component to wait upon
 *
 * 要等待的组件
 *
 * @returns
 *
 * Promise which resolves when the component is rendered.
 *
 * 在渲染组件时解析的 Promise。
 *
 */
export function whenRendered(component: any): Promise<null> {
  return getRootContext(component).clean;
}
