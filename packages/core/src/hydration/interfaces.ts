/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RNode} from '../render3/interfaces/renderer_dom';


/**
 * Encodes that the node lookup should start from the host node of this component.
 *
 * 编码节点查找应从该组件的主机节点开始。
 *
 */
export const REFERENCE_NODE_HOST = 'h';

/**
 * Encodes that the node lookup should start from the document body node.
 *
 * 编码节点查找应该从文档主体节点开始。
 *
 */
export const REFERENCE_NODE_BODY = 'b';

/**
 * Describes navigation steps that the runtime logic need to perform,
 * starting from a given \(known\) element.
 *
 * 描述运行时逻辑需要执行的导航步骤，从给定（已知）元素开始。
 *
 */
export enum NodeNavigationStep {
  FirstChild = 'f',
  NextSibling = 'n',
}

/**
 * Keys within serialized view data structure to represent various
 * parts. See the `SerializedView` interface below for additional information.
 *
 * 序列化视图数据结构中的键来表示各个部分。 有关其他信息，请参阅下面的 `SerializedView` 界面。
 *
 */
export const ELEMENT_CONTAINERS = 'e';
export const TEMPLATES = 't';
export const CONTAINERS = 'c';
export const MULTIPLIER = 'x';
export const NUM_ROOT_NODES = 'r';
export const TEMPLATE_ID = 'i';  // as it's also an "id"
export const NODES = 'n';
export const DISCONNECTED_NODES = 'd';

/**
 * Represents element containers within this view, stored as key-value pairs
 * where key is an index of a container in an LView \(also used in the
 * `elementContainerStart` instruction\), the value is the number of root nodes
 * in this container. This information is needed to locate an anchor comment
 * node that goes after all container nodes.
 *
 * 表示该视图中的元素容器，存储为键值对，其中键是容器在 LView 中的索引（也用于 `elementContainerStart` 指令），值是该容器中根节点的数量。 需要此信息来定位所有容器节点之后的锚注释节点。
 *
 */
export interface SerializedElementContainers {
  [key: number]: number;
}

/**
 * Serialized data structure that contains relevant hydration
 * annotation information that describes a given hydration boundary
 * \(e.g. a component\).
 *
 * 包含描述给定水合边界（例如组件）的相关水合注释信息的序列化数据结构。
 *
 */
export interface SerializedView {
  /**
   * Serialized information about <ng-container>s.
   *
   * 有关的序列化信息
   *
   */
  [ELEMENT_CONTAINERS]?: SerializedElementContainers;

  /**
   * Serialized information about templates.
   * Key-value pairs where a key is an index of the corresponding
   * `template` instruction and the value is a unique id that can
   * be used during hydration to identify that template.
   *
   * 有关模板的序列化信息。 键值对，其中键是相应 `template` 指令的索引，值是可在水化过程中用于识别该模板的唯一 ID。
   *
   */
  [TEMPLATES]?: Record<number, string>;

  /**
   * Serialized information about view containers.
   * Key-value pairs where a key is an index of the corresponding
   * LContainer entry within an LView, and the value is a list
   * of serialized information about views within this container.
   *
   * 有关视图容器的序列化信息。 键值对，其中键是 LView 中相应 LContainer 条目的索引，值是有关此容器中视图的序列化信息列表。
   *
   */
  [CONTAINERS]?: Record<number, SerializedContainerView[]>;

  /**
   * Serialized information about nodes in a template.
   * Key-value pairs where a key is an index of the corresponding
   * DOM node in an LView and the value is a path that describes
   * the location of this node \(as a set of navigation instructions\).
   *
   * 有关模板中节点的序列化信息。 键值对，其中键是 LView 中相应 DOM 节点的索引，值是描述该节点位置的路径（作为一组导航指令）。
   *
   */
  [NODES]?: Record<number, string>;

  /**
   * A list of ids which represents a set of nodes disconnected
   * from the DOM tree at the serialization time, but otherwise
   * present in the internal data structures.
   *
   * 一个 id 列表，表示在序列化时与 DOM 树断开连接的一组节点，但在其他方面存在于内部数据结构中。
   *
   * This information is used to avoid triggering the hydration
   * logic for such nodes and instead use a regular "creation mode".
   *
   * 此信息用于避免触发此类节点的水合逻辑，而是使用常规的“创建模式”。
   *
   */
  [DISCONNECTED_NODES]?: number[];
}

/**
 * Serialized data structure that contains relevant hydration
 * annotation information about a view that is a part of a
 * ViewContainer collection.
 *
 * 包含有关作为 ViewContainer 集合一部分的视图的相关水化注释信息的序列化数据结构。
 *
 */
export interface SerializedContainerView extends SerializedView {
  /**
   * Unique id that represents a TView that was used to create
   * a given instance of a view:
   *
   * 表示用于创建给定视图实例的 TView 的唯一 ID：
   *
   * - TViewType.Embedded: a unique id generated during serialization on the server
   *
   *   TViewType.Embedded：在服务端序列化时生成的唯一 id
   *
   * - TViewType.Component: an id generated based on component properties
   *                       \(see `getComponentId` function for details\)
   *
   *   TViewType.Component：根据组件属性生成的 id（详见 `getComponentId` 函数）
   *
   */
  [TEMPLATE_ID]: string;

  /**
   * Number of root nodes that belong to this view.
   * This information is needed to effectively traverse the DOM tree
   * and identify segments that belong to different views.
   *
   * 属于该视图的根节点数。 需要此信息来有效地遍历 DOM 树并识别属于不同视图的段。
   *
   */
  [NUM_ROOT_NODES]: number;

  /**
   * Number of times this view is repeated.
   * This is used to avoid serializing and sending the same hydration
   * information about similar views \(for example, produced by \*ngFor\).
   *
   * 此视图重复的次数。 这用于避免序列化和发送关于相似视图的相同水化信息（例如，由 \*ngFor 生成）。
   *
   */
  [MULTIPLIER]?: number;
}

/**
 * An object that contains hydration-related information serialized
 * on the server, as well as the necessary references to segments of
 * the DOM, to facilitate the hydration process for a given hydration
 * boundary on the client.
 *
 * 一个对象，包含在服务器上序列化的水化相关信息，以及对 DOM 段的必要引用，以促进客户端上给定水化边界的水化过程。
 *
 */
export interface DehydratedView {
  /**
   * The readonly hydration annotation data.
   *
   * 只读水化注释数据。
   *
   */
  data: Readonly<SerializedView>;

  /**
   * A reference to the first child in a DOM segment associated
   * with a given hydration boundary.
   *
   * 对与给定水合边界关联的 DOM 段中第一个子项的引用。
   *
   */
  firstChild: RNode|null;

  /**
   * Stores references to first nodes in DOM segments that
   * represent either an <ng-container> or a view container.
   *
   * 存储对 DOM 段中第一个节点的引用，这些节点表示
   *
   */
  segmentHeads?: {[index: number]: RNode|null};

  /**
   * An instance of a Set that represents nodes disconnected from
   * the DOM tree at the serialization time, but otherwise present
   * in the internal data structures.
   *
   * 一个 Set 的实例，表示在序列化时与 DOM 树断开连接的节点，但以其他方式存在于内部数据结构中。
   *
   * The Set is based on the `SerializedView[DISCONNECTED_NODES]` data
   * and is needed to have constant-time lookups.
   *
   * 该 Set 基于 `SerializedView[DISCONNECTED_NODES]` 数据，并且需要进行恒定时间查找。
   *
   * If the value is `null`, it means that there were no disconnected
   * nodes detected in this view at serialization time.
   *
   * 如果该值为 `null` ，则表示在序列化时在此视图中未检测到断开连接的节点。
   *
   */
  disconnectedNodes?: Set<number>|null;
}

/**
 * An object that contains hydration-related information serialized
 * on the server, as well as the necessary references to segments of
 * the DOM, to facilitate the hydration process for a given view
 * inside a view container \(either an embedded view or a view created
 * for a component\).
 *
 * 包含在服务器上序列化的水化相关信息的对象，以及对 DOM 段的必要引用，以促进视图容器内给定视图（嵌入式视图或为组件创建的视图）的水化过程\).。
 *
 */
export interface DehydratedContainerView extends DehydratedView {
  data: Readonly<SerializedContainerView>;
}
