/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {Inject, Injectable, InjectionToken, NgZone, ɵRuntimeError as RuntimeError} from '@angular/core';

import {RuntimeErrorCode} from '../../errors';

/**
 * The injection token for the event-manager plug-in service.
 *
 * 事件管理器插件服务的注入令牌。
 *
 * @publicApi
 */
export const EVENT_MANAGER_PLUGINS =
    new InjectionToken<EventManagerPlugin[]>('EventManagerPlugins');

/**
 * An injectable service that provides event management for Angular
 * through a browser plug-in.
 *
 * 通过浏览器插件为 Angular 提供事件管理的可注入服务。
 *
 * @publicApi
 */
@Injectable()
export class EventManager {
  private _plugins: EventManagerPlugin[];
  private _eventNameToPlugin = new Map<string, EventManagerPlugin>();

  /**
   * Initializes an instance of the event-manager service.
   *
   * 初始化事件管理器服务的实例。
   *
   */
  constructor(@Inject(EVENT_MANAGER_PLUGINS) plugins: EventManagerPlugin[], private _zone: NgZone) {
    plugins.forEach((plugin) => {
      plugin.manager = this;
    });
    this._plugins = plugins.slice().reverse();
  }

  /**
   * Registers a handler for a specific element and event.
   *
   * 注册特定元素和事件的处理器。
   *
   * @param element The HTML element to receive event notifications.
   *
   * 要接收事件通知的 HTML 元素。
   *
   * @param eventName The name of the event to listen for.
   *
   * 要监听的事件的名称。
   *
   * @param handler A function to call when the notification occurs. Receives the
   * event object as an argument.
   *
   * 通知发生时调用的函数。接收事件对象作为参数。
   *
   * @returns  A callback function that can be used to remove the handler.
   */
  addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    const plugin = this._findPluginFor(eventName);
    return plugin.addEventListener(element, eventName, handler);
  }

  /**
   * Retrieves the compilation zone in which event listeners are registered.
   *
   * 检索在其中注册了事件侦听器的编译 Zone。
   *
   */
  getZone(): NgZone {
    return this._zone;
  }

  /** @internal */
  _findPluginFor(eventName: string): EventManagerPlugin {
    let plugin = this._eventNameToPlugin.get(eventName);
    if (plugin) {
      return plugin;
    }

    const plugins = this._plugins;
    plugin = plugins.find((plugin) => plugin.supports(eventName));
    if (!plugin) {
      throw new RuntimeError(
          RuntimeErrorCode.NO_PLUGIN_FOR_EVENT,
          (typeof ngDevMode === 'undefined' || ngDevMode) &&
              `No event manager plugin found for event ${eventName}`);
    }

    this._eventNameToPlugin.set(eventName, plugin);
    return plugin;
  }
}

export abstract class EventManagerPlugin {
  constructor(private _doc: any) {}

  // Using non-null assertion because it's set by EventManager's constructor
  manager!: EventManager;

  abstract supports(eventName: string): boolean;

  abstract addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
}
