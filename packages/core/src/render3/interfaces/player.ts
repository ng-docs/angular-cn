/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A shared interface which contains an animation player
 *
 * 包含动画播放器的共享接口
 *
 */
export interface Player {
  parent?: Player|null;
  state: PlayState;
  play(): void;
  pause(): void;
  finish(): void;
  destroy(): void;
  addEventListener(state: PlayState|string, cb: (data?: any) => any): void;
}

export const enum BindingType {
  Unset = 0,
  Class = 1,
  Style = 2,
}

export interface BindingStore {
  setValue(prop: string, value: any): void;
}

/**
 * Defines the shape which produces the Player.
 *
 * 定义生成 Player 的形状。
 *
 * Used to produce a player that will be placed on an element that contains
 * styling bindings that make use of the player. This function is designed
 * to be used with `PlayerFactory`.
 *
 * 用于生成一个播放器，该播放器将被放置在包含使用播放器的样式绑定的元素上。此函数旨在与
 * `PlayerFactory` 一起使用。
 *
 */
export interface PlayerFactoryBuildFn {
  (element: HTMLElement, type: BindingType, values: {[key: string]: any}, isFirstRender: boolean,
   currentPlayer: Player|null): Player|null;
}

/**
 * Used as a reference to build a player from a styling template binding
 * (`[style]` and `[class]`).
 *
 * 用作从样式模板绑定（ `[style]` 和 `[class]` ）构建播放器的引用。
 *
 * The `fn` function will be called once any styling-related changes are
 * evaluated on an element and is expected to return a player that will
 * be then run on the element.
 *
 * 一旦在元素上估算了任何与样式相关的更改，将调用 `fn`
 * 函数，并希望返回一个播放器，然后在元素上运行。
 *
 * `[style]`, `[style.prop]`, `[class]` and `[class.name]` template bindings
 * all accept a `PlayerFactory` as input and this player factories.
 *
 * `[style]` 、 `[style.prop]` 、 `[class]` 和 `[class.name]` 模板绑定都接受 `PlayerFactory`
 * 作为输入，并且接受此播放器工厂。
 *
 */
export interface PlayerFactory {
  '__brand__': 'Brand for PlayerFactory that nothing will match';
}

export interface PlayerBuilder extends BindingStore {
  buildPlayer(currentPlayer: Player|null, isFirstRender: boolean): Player|undefined|null;
}

/**
 * The state of a given player
 *
 * 给定玩家的状态
 *
 * Do not change the increasing nature of the numbers since the player
 * code may compare state by checking if a number is higher or lower than
 * a certain numeric value.
 *
 * 不要更改数字的递增性质，因为播放器代码可能会通过检查数字是高于还是低于某个数值来比较状态。
 *
 */
export const enum PlayState {
  Pending = 0,
  Running = 1,
  Paused = 2,
  Finished = 100,
  Destroyed = 200
}

/**
 * The context that stores all the active players and queued player factories present on an element.
 *
 * 存储元素上存在的所有活动玩家和排队的玩家工厂的上下文。
 *
 */
export interface PlayerContext extends Array<null|number|Player|PlayerBuilder> {
  [PlayerIndex.NonBuilderPlayersStart]: number;
  [PlayerIndex.ClassMapPlayerBuilderPosition]: PlayerBuilder|null;
  [PlayerIndex.ClassMapPlayerPosition]: Player|null;
  [PlayerIndex.StyleMapPlayerBuilderPosition]: PlayerBuilder|null;
  [PlayerIndex.StyleMapPlayerPosition]: Player|null;
}

/**
 * Designed to be used as an injection service to capture all animation players.
 *
 * 旨在用作注入服务来捕获所有动画播放器。
 *
 * When present all animation players will be passed into the flush method below.
 * This feature is designed to service application-wide animation testing, live
 * debugging as well as custom animation choreographing tools.
 *
 * 当存在时，所有动画播放器都将被传递给下面的 flush
 * 方法。此特性旨在为应用程序范围的动画测试、实时调试以及自定义动画编排工具提供服务。
 *
 */
export interface PlayerHandler {
  /**
   * Designed to kick off the player at the end of change detection
   *
   * 旨在在更改检测结束时启动播放器
   *
   */
  flushPlayers(): void;

  /**
   * @param player The player that has been scheduled to run within the application.
   *
   * 已计划在应用程序中运行的播放器。
   *
   * @param context The context as to where the player was bound to
   *
   * 关于玩家绑定到哪里的上下文
   *
   */
  queuePlayer(player: Player, context: ComponentInstance|DirectiveInstance|HTMLElement): void;
}

export const enum PlayerIndex {
  // The position where the index that reveals where players start in the PlayerContext
  NonBuilderPlayersStart = 0,
  // The position where the player builder lives (which handles {key:value} map expression) for
  // classes
  ClassMapPlayerBuilderPosition = 1,
  // The position where the last player assigned to the class player builder is stored
  ClassMapPlayerPosition = 2,
  // The position where the player builder lives (which handles {key:value} map expression) for
  // styles
  StyleMapPlayerBuilderPosition = 3,
  // The position where the last player assigned to the style player builder is stored
  StyleMapPlayerPosition = 4,
  // The position where any player builders start in the PlayerContext
  PlayerBuildersStartPosition = 1,
  // The position where non map-based player builders start in the PlayerContext
  SinglePlayerBuildersStartPosition = 5,
  // For each player builder there is a player in the player context (therefore size = 2)
  PlayerAndPlayerBuildersTupleSize = 2,
  // The player exists next to the player builder in the list
  PlayerOffsetPosition = 1,
}

export declare type ComponentInstance = {};
export declare type DirectiveInstance = {};
