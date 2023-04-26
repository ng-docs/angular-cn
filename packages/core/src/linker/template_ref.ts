/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../di/injector';
import {DehydratedContainerView} from '../hydration/interfaces';
import {assertLContainer} from '../render3/assert';
import {renderView} from '../render3/instructions/render';
import {createLView} from '../render3/instructions/shared';
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
 * Access a `TemplateRef` instance by placing a directive on an `<ng-template>`
 * element (or directive prefixed with `*`). The `TemplateRef` for the embedded view
 * is injected into the constructor of the directive,
 * using the `TemplateRef` token.
 *
 * You can also use a `Query` to find a `TemplateRef` associated with
 * a component or a directive.
 *
 * @see `ViewContainerRef`
 * @see [Navigate the Component Tree with DI](guide/dependency-injection-navtree)
 *
 * @publicApi
 */
export abstract class TemplateRef<C> {
  /**
   * The anchor element in the parent view for this embedded view.
   *
   * The data-binding and injection contexts of embedded views created from this `TemplateRef`
   * inherit from the contexts of this location.
   *
   * Typically new embedded views are attached to the view container of this location, but in
   * advanced use-cases, the view can be attached to a different container while keeping the
   * data-binding and injection context from the original location.
   *
   */
  // TODO(i): rename to anchor or location
  abstract readonly elementRef: ElementRef;

  /**
   * Instantiates an unattached embedded view based on this template.
   * @param context The data-binding context of the embedded view, as declared
   * in the `<ng-template>` usage.
   * @param injector Injector to be used within the embedded view.
   * @returns The new embedded view object.
   */
  abstract createEmbeddedView(context: C, injector?: Injector): EmbeddedViewRef<C>;

  /**
   * Implementation of the `createEmbeddedView` function.
   *
   * This implementation is internal and allows framework code
   * to invoke it with extra parameters (e.g. for hydration) without
   * affecting public API.
   *
   * @internal
   */
  abstract createEmbeddedViewImpl(
      context: C, injector?: Injector,
      hydrationInfo?: DehydratedContainerView|null): EmbeddedViewRef<C>;

  /**
   * Returns an `ssrId` associated with a TView, which was used to
   * create this instance of the `TemplateRef`.
   *
   * @internal
   */
  abstract get ssrId(): string|null;

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

  /**
   * Returns an `ssrId` associated with a TView, which was used to
   * create this instance of the `TemplateRef`.
   *
   * @internal
   */
  override get ssrId(): string|null {
    return this._declarationTContainer.tView?.ssrId || null;
  }

  override createEmbeddedView(context: T, injector?: Injector): EmbeddedViewRef<T> {
    return this.createEmbeddedViewImpl(context, injector, null);
  }

  /**
   * @internal
   */
  override createEmbeddedViewImpl(
      context: T, injector?: Injector,
      hydrationInfo?: DehydratedContainerView|null): EmbeddedViewRef<T> {
    const embeddedTView = this._declarationTContainer.tView as TView;
    const embeddedLView = createLView(
        this._declarationLView, embeddedTView, context, LViewFlags.CheckAlways, null,
        embeddedTView.declTNode, null, null, null, injector || null, hydrationInfo || null);

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
 * @returns The TemplateRef instance to use
 */
export function injectTemplateRef<T>(): TemplateRef<T>|null {
  return createTemplateRef<T>(getCurrentTNode()!, getLView());
}

/**
 * Creates a TemplateRef and stores it on the injector.
 *
 * @param hostTNode The node on which a TemplateRef is requested
 * @param hostLView The `LView` to which the node belongs
 * @returns The TemplateRef instance or null if we can't create a TemplateRef on a given node type
 */
export function createTemplateRef<T>(hostTNode: TNode, hostLView: LView): TemplateRef<T>|null {
  if (hostTNode.type & TNodeType.Container) {
    ngDevMode && assertDefined(hostTNode.tView, 'TView must be allocated');
    return new R3TemplateRef(
        hostLView, hostTNode as TContainerNode, createElementRef(hostTNode, hostLView));
  }
  return null;
}
