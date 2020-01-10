/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ViewRef} from '../../linker/view_ref';

import {TNode} from './node';
import {RComment, RElement} from './renderer';
import {HOST, LView, NEXT, PARENT, T_HOST, TRANSPLANTED_VIEWS_TO_REFRESH} from './view';



/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 */
export const TYPE = 1;

/**
 * Below are constants for LContainer indices to help us look up LContainer members
 * without having to remember the specific indices.
 * Uglify will inline these when minifying so there shouldn't be a cost.
 */
export const ACTIVE_INDEX = 2;

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
 */
export const CONTAINER_HEADER_OFFSET = 10;


/**
 * Used to track Transplanted `LView`s (see: `LView[DECLARATION_COMPONENT_VIEW])`
 */
export const enum ActiveIndexFlag {
  /**
   * Flag which signifies that the `LContainer` does not have any inline embedded views.
   */
  DYNAMIC_EMBEDDED_VIEWS_ONLY = -1,

  /**
   * Flag to signify that this `LContainer` may have transplanted views which need to be change
   * detected. (see: `LView[DECLARATION_COMPONENT_VIEW])`.
   *
   * This flag once set is never unset for the `LContainer`. This means that when unset we can skip
   * a lot of work in `refreshDynamicEmbeddedViews`. But when set we still need to verify
   * that the `MOVED_VIEWS` are transplanted and on-push.
   */
  HAS_TRANSPLANTED_VIEWS = 1,

  /**
   * Number of bits to shift inline embedded views counter to make space for other flags.
   */
  SHIFT = 1,
}

/**
 * The state associated with a container.
 *
 * This is an array so that its structure is closer to LView. This helps
 * when traversing the view tree (which is a mix of containers and component
 * views), so we can jump to viewOrContainer[NEXT] in the same way regardless
 * of type.
 */
export interface LContainer extends Array<any> {
  /**
   * The host element of this LContainer.
   *
   * The host could be an LView if this container is on a component node.
   * In that case, the component LView is its HOST.
   */
  readonly[HOST]: RElement|RComment|LView;

  /**
   * This is a type field which allows us to differentiate `LContainer` from `StylingContext` in an
   * efficient way. The value is always set to `true`
   */
  [TYPE]: true;

  /**
   * The next active index in the views array to read or write to. This helps us
   * keep track of where we are in the views array.
   * In the case the LContainer is created for a ViewContainerRef,
   * it is set to null to identify this scenario, as indices are "absolute" in that case,
   * i.e. provided directly by the user of the ViewContainerRef API.
   *
   * The lowest bit signals that this `LContainer` has transplanted views which need to be change
   * detected as part of the declaration CD. (See `LView[DECLARATION_COMPONENT_VIEW]`)
   */
  [ACTIVE_INDEX]: ActiveIndexFlag;

  /**
   * Access to the parent view is necessary so we can propagate back
   * up from inside a container to parent[NEXT].
   */
  [PARENT]: LView;

  /**
   * This allows us to jump from a container to a sibling container or component
   * view with the same parent, so we can remove listeners efficiently.
   */
  [NEXT]: LView|LContainer|null;

  /**
   * The number of direct transplanted views which need a refresh or have descendants themselves
   * that need a refresh but have not marked their ancestors as Dirty. This tells us that during
   * change detection we should still descend to find those children to refresh, even if the parents
   * are not `Dirty`/`CheckAlways`.
   */
  [TRANSPLANTED_VIEWS_TO_REFRESH]: number;

  /**
   * A collection of views created based on the underlying `<ng-template>` element but inserted into
   * a different `LContainer`. We need to track views created from a given declaration point since
   * queries collect matches from the embedded view declaration point and _not_ the insertion point.
   */
  [MOVED_VIEWS]: LView[]|null;

  /**
   * Pointer to the `TNode` which represents the host of the container.
   */
  [T_HOST]: TNode;

  /** The comment element that serves as an anchor for this LContainer. */
  readonly[NATIVE]:
      RComment;  // TODO(misko): remove as this value can be gotten by unwrapping `[HOST]`

  /**
   * Array of `ViewRef`s used by any `ViewContainerRef`s that point to this container.
   *
   * This is lazily initialized by `ViewContainerRef` when the first view is inserted.
   */
  [VIEW_REFS]: ViewRef[]|null;
}

// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;
