/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../di/injector';
import {assertLContainer} from '../render3/assert';
import {createLView, renderView} from '../render3/instructions/shared';
import {TContainerNode, TNode, TNodeType} from '../render3/interfaces/node';
import {DECLARATION_LCONTAINER, LView, LViewFlags, QUERIES, TView} from '../render3/interfaces/view';
import {getCurrentTNode, getLView} from '../render3/state';
import {ViewRef as R3_ViewRef} from '../render3/view_ref';
import {assertDefined} from '../util/assert';

import {createElementRef, ElementRef} from './element_ref';
import {EmbeddedViewRef} from './view_ref';

/**
 * Represents an embedded template that can be used to instantiate embedded views.
 * To instantiate embedded views based on a template, use the `ViewContainerRef`
 * method `createEmbeddedView()`.
 *
 * 表示一个内嵌模板，它可用于实例化内嵌的视图。
 * 要想根据模板实例化内嵌的视图，请使用 `ViewContainerRef` 的 `createEmbeddedView()` 方法。
 *
 * Access a `TemplateRef` instance by placing a directive on an `<ng-template>`
 * element (or directive prefixed with `*`). The `TemplateRef` for the embedded view
 * is injected into the constructor of the directive,
 * using the `TemplateRef` token.
 *
 * 通过把一个指令放在 `<ng-template>` 元素（或一个带 `*` 前缀的指令）上，可以访问 `TemplateRef`
 * 的实例。 内嵌视图的 `TemplateRef` 实例会以 `TemplateRef` 作为令牌，注入到该指令的构造函数中。
 *
 * You can also use a `Query` to find a `TemplateRef` associated with
 * a component or a directive.
 *
 * 你还可以使用 `Query` 来找出与某个组件或指令相关的 `TemplateRef`。
 *
 * @see `ViewContainerRef`
 * @see [Navigate the Component Tree with DI](guide/dependency-injection-navtree)
 *
 * [使用 DI 在组件树中导航](guide/dependency-injection-navtree)
 *
 * @publicApi
 */
export abstract class TemplateRef<C> {
  /**
   * The anchor element in the parent view for this embedded view.
   *
   * 内嵌视图在其所属视图中的位置。
   *
   * The data-binding and injection contexts of embedded views created from this `TemplateRef`
   * inherit from the contexts of this location.
   *
   * 对于从这个 `TemplateRef`
   * 创建的内嵌视图，其数据绑定和依赖注入的上下文是从当前位置的上下文中继承而来的。
   *
   * Typically new embedded views are attached to the view container of this location, but in
   * advanced use-cases, the view can be attached to a different container while keeping the
   * data-binding and injection context from the original location.
   *
   * 通常，新的内嵌视图会被附加到当前位置的视图容器中，但是在一些高级用例中，该视图可能被附加到别的容器中，
   * 同时还保留原位置的数据绑定和依赖注入上下文。
   *
   */
  // TODO(i): rename to anchor or location
  abstract readonly elementRef: ElementRef;

  /**
   * Instantiates an unattached embedded view based on this template.
   *
   * 创建一个视图对象，并把它附着到父视图的视图容器上。
   *
   * @param context The data-binding context of the embedded view, as declared
   * in the `<ng-template>` usage.
   *
   * 这个新视图的上下文环境，继承自所附着的元素。
   * @param injector Injector to be used within the embedded view.
   *
   * 要在嵌入式视图中使用的注入器。
   *
   * @returns The new embedded view object.
   *
   * 这个新的视图对象。
   */
  abstract createEmbeddedView(context: C, injector?: Injector): EmbeddedViewRef<C>;

  /**
   * @internal
   * @nocollapse
   */
  static __NG_ELEMENT_ID__: () => TemplateRef<any>| null = injectTemplateRef;
}

const ViewEngineTemplateRef = TemplateRef;

// TODO(alxhub): combine interface and implementation. Currently this is challenging since something
// in g3 depends on them being separate.
const R3TemplateRef = class TemplateRef<T> extends ViewEngineTemplateRef<T> {
  constructor(
      private _declarationLView: LView, private _declarationTContainer: TContainerNode,
      public override elementRef: ElementRef) {
    super();
  }

  override createEmbeddedView(context: T, injector?: Injector): EmbeddedViewRef<T> {
    const embeddedTView = this._declarationTContainer.tViews as TView;
    const embeddedLView = createLView(
        this._declarationLView, embeddedTView, context, LViewFlags.CheckAlways, null,
        embeddedTView.declTNode, null, null, null, null, injector || null);

    const declarationLContainer = this._declarationLView[this._declarationTContainer.index];
    ngDevMode && assertLContainer(declarationLContainer);
    embeddedLView[DECLARATION_LCONTAINER] = declarationLContainer;

    const declarationViewLQueries = this._declarationLView[QUERIES];
    if (declarationViewLQueries !== null) {
      embeddedLView[QUERIES] = declarationViewLQueries.createEmbeddedView(embeddedTView);
    }

    renderView(embeddedTView, embeddedLView, context);

    return new R3_ViewRef<T>(embeddedLView);
  }
};

/**
 * Creates a TemplateRef given a node.
 *
 * 在给定节点的情况下创建一个 TemplateRef。
 *
 * @returns
 *
 * The TemplateRef instance to use
 *
 * 要使用的 TemplateRef 实例
 *
 */
export function injectTemplateRef<T>(): TemplateRef<T>|null {
  return createTemplateRef<T>(getCurrentTNode()!, getLView());
}

/**
 * Creates a TemplateRef and stores it on the injector.
 *
 * 创建一个 TemplateRef 并将其存储在注入器上。
 *
 * @param hostTNode The node on which a TemplateRef is requested
 *
 * 请求 TemplateRef 的节点
 *
 * @param hostLView The `LView` to which the node belongs
 *
 * 节点所属的 `LView`
 *
 * @returns
 *
 * The TemplateRef instance or null if we can't create a TemplateRef on a given node type
 *
 * TemplateRef 实例；如果我们无法在给定的节点类型上创建 TemplateRef ，则为 null
 *
 */
export function createTemplateRef<T>(hostTNode: TNode, hostLView: LView): TemplateRef<T>|null {
  if (hostTNode.type & TNodeType.Container) {
    ngDevMode && assertDefined(hostTNode.tViews, 'TView must be allocated');
    return new R3TemplateRef(
        hostLView, hostTNode as TContainerNode, createElementRef(hostTNode, hostLView));
  }
  return null;
}
