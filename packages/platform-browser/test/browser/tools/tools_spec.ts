/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef, Injector, ɵglobal as global} from '@angular/core';
import {disableDebugTools, enableDebugTools} from '@angular/platform-browser';

{
  describe('profiler', () => {
    if (isNode) return;

    beforeEach(() => {
      enableDebugTools({
        injector: Injector.create([{
          provide: ApplicationRef,
          useValue: jasmine.createSpyObj(
              'ApplicationRef', ['bootstrap', 'tick', 'attachView', 'detachView']),
          deps: []
        }])
      } as any);
    });

    afterEach(() => {
      disableDebugTools();
    });

    it('should time change detection', () => {
      callNgProfilerTimeChangeDetection();
    });

    it('should time change detection with recording', () => {
      callNgProfilerTimeChangeDetection({'record': true});
    });
  });
}

export function callNgProfilerTimeChangeDetection(config?: any /** TODO #9100 */): void {
  (<any>global).ng.profiler.timeChangeDetection(config);
}
