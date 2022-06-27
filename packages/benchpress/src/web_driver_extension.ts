/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken, Injector} from '@angular/core';

import {Options} from './common_options';

export type PerfLogEvent = {
  [key: string]: any
}&{
  ph?: 'X' | 'B' | 'E' | 'I',
  ts?: number,
  dur?: number,
  name?: string,
  pid?: string,
  args?: {
    encodedDataLength?: number,
    usedHeapSize?: number,
    majorGc?: boolean,
    url?: string,
    method?: string
  }
};

/**
 * A WebDriverExtension implements extended commands of the webdriver protocol
 * for a given browser, independent of the WebDriverAdapter.
 * Needs one implementation for every supported Browser.
 *
 * WebDriverExtension 为给定的浏览器实现 Webdriver 协议的扩展命令，独立于 WebDriverAdapter
 * 。每个受支持的浏览器都需要一个实现。
 *
 */
export abstract class WebDriverExtension {
  static provideFirstSupported(childTokens: any[]): any[] {
    const res = [
      {
        provide: _CHILDREN,
        useFactory: (injector: Injector) => childTokens.map(token => injector.get(token)),
        deps: [Injector]
      },
      {
        provide: WebDriverExtension,
        useFactory: (children: WebDriverExtension[], capabilities: {[key: string]: any}) => {
          let delegate: WebDriverExtension = undefined!;
          children.forEach(extension => {
            if (extension.supports(capabilities)) {
              delegate = extension;
            }
          });
          if (!delegate) {
            throw new Error('Could not find a delegate for given capabilities!');
          }
          return delegate;
        },
        deps: [_CHILDREN, Options.CAPABILITIES]
      }
    ];
    return res;
  }

  gc(): Promise<any> {
    throw new Error('NYI');
  }

  timeBegin(name: string): Promise<any> {
    throw new Error('NYI');
  }

  timeEnd(name: string, restartName: string|null): Promise<any> {
    throw new Error('NYI');
  }

  /**
   * Format:
   *
   * 格式：
   *
   * - cat: category of the event
   *
   *   cat：事件的类别
   *
   * - name: event name: 'script', 'gc', 'render', ...
   *
   *   名称：事件名称：'script', 'gc', 'render', ...
   *
   * - ph: phase: 'B' (begin), 'E' (end), 'X' (Complete event), 'I' (Instant event)
   *
   *   ph：phase：“B”（开始），“E”（结束），“X”（完成事件），“I”（即时事件）
   *
   * - ts: timestamp in ms, e.g. 12345
   *
   *   ts：以 ms 为单位的时间戳，例如 12345
   *
   * - pid: process id
   *
   *   pid：进程 ID
   *
   * - args: arguments, e.g. {heapSize: 1234}
   *
   *   args：参数，例如 {heapSize: 1234}
   *
   * Based on [Chrome Trace Event
   * Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
   *
   * 基于[Chrome
   * 跟踪事件格式](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
   *
   */
  readPerfLog(): Promise<PerfLogEvent[]> {
    throw new Error('NYI');
  }

  perfLogFeatures(): PerfLogFeatures {
    throw new Error('NYI');
  }

  supports(capabilities: {[key: string]: any}): boolean {
    return true;
  }
}

export class PerfLogFeatures {
  render: boolean;
  gc: boolean;
  frameCapture: boolean;
  userTiming: boolean;

  constructor(
      {render = false, gc = false, frameCapture = false, userTiming = false}:
          {render?: boolean, gc?: boolean, frameCapture?: boolean, userTiming?: boolean} = {}) {
    this.render = render;
    this.gc = gc;
    this.frameCapture = frameCapture;
    this.userTiming = userTiming;
  }
}

const _CHILDREN = new InjectionToken('WebDriverExtension.children');
