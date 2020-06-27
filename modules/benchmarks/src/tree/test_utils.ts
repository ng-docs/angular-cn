/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {browser} from 'protractor';

import {openBrowser, runBenchmark} from '../../../../dev-infra/benchmark/driver-utilities';

export function runTreeBenchmark({id, prepare, setup, work}: {
  id: string; prepare ? () : void; setup ? () : void; work(): void;
}) {
  browser.rootEl = '#root';
  return runBenchmark({
    id: id,
    url: '',
    ignoreBrowserSynchronization: true,
    params: [],
    work: work,
    prepare: prepare,
    setup: setup
  });
}

export function openTreeBenchmark() {
  browser.rootEl = '#root';
  openBrowser({
    url: '',
    ignoreBrowserSynchronization: true,
    params: [{name: 'depth', value: 4}],
  });
}
