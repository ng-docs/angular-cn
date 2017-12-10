/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EventEmitter} from '@angular/core';
import {Injectable} from '@angular/core/src/di';
import {Testability, TestabilityRegistry} from '@angular/core/src/testability/testability';
import {NgZone} from '@angular/core/src/zone/ng_zone';
import {AsyncTestCompleter, SpyObject, beforeEach, describe, expect, inject, it} from '@angular/core/testing/src/testing_internal';

import {scheduleMicroTask} from '../../src/util';



// Schedules a task to be run after Testability checks for oustanding tasks. Since Testability
// uses a 0 second timeout to check for outstanding tasks we add our 0 second timeout after a
// micro task (which ensures Testability's timeout is run first).
function afterTestabilityCheck(fn: Function): void {
  scheduleMicroTask(() => setTimeout(fn));
}

@Injectable()
class MockNgZone extends NgZone {
  /** @internal */
  onUnstable: EventEmitter<any>;

  /** @internal */
  onStable: EventEmitter<any>;

  constructor() {
    super({enableLongStackTrace: false});
    this.onUnstable = new EventEmitter(false);
    this.onStable = new EventEmitter(false);
  }

  unstable(): void { this.onUnstable.emit(null); }

  stable(): void { this.onStable.emit(null); }
}

{
  describe('Testability', () => {
    let testability: Testability;
    let execute: any;
    let execute2: any;
    let ngZone: MockNgZone;

    beforeEach(() => {
      ngZone = new MockNgZone();
      testability = new Testability(ngZone);
      execute = new SpyObject().spy('execute');
      execute2 = new SpyObject().spy('execute');
    });

    describe('Pending count logic', () => {
      it('should start with a pending count of 0',
         () => { expect(testability.getPendingRequestCount()).toEqual(0); });

      it('should fire whenstable callbacks if pending count is 0',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           testability.whenStable(execute);
           afterTestabilityCheck(() => {
             expect(execute).toHaveBeenCalled();
             async.done();
           });
         }));

      it('should not fire whenstable callbacks synchronously if pending count is 0', () => {
        testability.whenStable(execute);
        expect(execute).not.toHaveBeenCalled();
      });

      it('should not call whenstable callbacks when there are pending counts',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           testability.increasePendingRequestCount();
           testability.increasePendingRequestCount();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             expect(execute).not.toHaveBeenCalled();
             testability.decreasePendingRequestCount();

             afterTestabilityCheck(() => {
               expect(execute).not.toHaveBeenCalled();
               async.done();
             });
           });
         }));

      it('should fire whenstable callbacks when pending drops to 0',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           testability.increasePendingRequestCount();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             expect(execute).not.toHaveBeenCalled();
             testability.decreasePendingRequestCount();

             afterTestabilityCheck(() => {
               expect(execute).toHaveBeenCalled();
               async.done();
             });
           });
         }));

      it('should not fire whenstable callbacks synchronously when pending drops to 0', () => {
        testability.increasePendingRequestCount();
        testability.whenStable(execute);
        testability.decreasePendingRequestCount();

        expect(execute).not.toHaveBeenCalled();
      });

      it('should fire whenstable callbacks with didWork if pending count is 0',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           testability.whenStable(execute);
           afterTestabilityCheck(() => {
             expect(execute).toHaveBeenCalledWith(false);
             async.done();
           });
         }));

      it('should fire whenstable callbacks with didWork when pending drops to 0',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           testability.increasePendingRequestCount();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             testability.decreasePendingRequestCount();

             afterTestabilityCheck(() => {
               expect(execute).toHaveBeenCalledWith(true);
               testability.whenStable(execute2);

               afterTestabilityCheck(() => {
                 expect(execute2).toHaveBeenCalledWith(false);
                 async.done();
               });
             });
           });
         }));
    });

    describe('NgZone callback logic', () => {
      it('should fire whenstable callback if event is already finished',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           ngZone.unstable();
           ngZone.stable();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             expect(execute).toHaveBeenCalled();
             async.done();
           });
         }));

      it('should not fire whenstable callbacks synchronously if event is already finished', () => {
        ngZone.unstable();
        ngZone.stable();
        testability.whenStable(execute);

        expect(execute).not.toHaveBeenCalled();
      });

      it('should fire whenstable callback when event finishes',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           ngZone.unstable();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             expect(execute).not.toHaveBeenCalled();
             ngZone.stable();

             afterTestabilityCheck(() => {
               expect(execute).toHaveBeenCalled();
               async.done();
             });
           });
         }));

      it('should not fire whenstable callbacks synchronously when event finishes', () => {
        ngZone.unstable();
        testability.whenStable(execute);
        ngZone.stable();

        expect(execute).not.toHaveBeenCalled();
      });

      it('should not fire whenstable callback when event did not finish',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           ngZone.unstable();
           testability.increasePendingRequestCount();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             expect(execute).not.toHaveBeenCalled();
             testability.decreasePendingRequestCount();

             afterTestabilityCheck(() => {
               expect(execute).not.toHaveBeenCalled();
               ngZone.stable();

               afterTestabilityCheck(() => {
                 expect(execute).toHaveBeenCalled();
                 async.done();
               });
             });
           });
         }));

      it('should not fire whenstable callback when there are pending counts',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           ngZone.unstable();
           testability.increasePendingRequestCount();
           testability.increasePendingRequestCount();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             expect(execute).not.toHaveBeenCalled();
             ngZone.stable();

             afterTestabilityCheck(() => {
               expect(execute).not.toHaveBeenCalled();
               testability.decreasePendingRequestCount();

               afterTestabilityCheck(() => {
                 expect(execute).not.toHaveBeenCalled();
                 testability.decreasePendingRequestCount();

                 afterTestabilityCheck(() => {
                   expect(execute).toHaveBeenCalled();
                   async.done();
                 });
               });
             });
           });
         }));

      it('should fire whenstable callback with didWork if event is already finished',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           ngZone.unstable();
           ngZone.stable();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             expect(execute).toHaveBeenCalledWith(true);
             testability.whenStable(execute2);

             afterTestabilityCheck(() => {
               expect(execute2).toHaveBeenCalledWith(false);
               async.done();
             });
           });
         }));

      it('should fire whenstable callback with didwork when event finishes',
         inject([AsyncTestCompleter], (async: AsyncTestCompleter) => {
           ngZone.unstable();
           testability.whenStable(execute);

           afterTestabilityCheck(() => {
             ngZone.stable();

             afterTestabilityCheck(() => {
               expect(execute).toHaveBeenCalledWith(true);
               testability.whenStable(execute2);

               afterTestabilityCheck(() => {
                 expect(execute2).toHaveBeenCalledWith(false);
                 async.done();
               });
             });
           });
         }));
    });
  });

  describe('TestabilityRegistry', () => {
    let testability1: Testability;
    let testability2: Testability;
    let resgitry: TestabilityRegistry;
    let ngZone: MockNgZone;

    beforeEach(() => {
      ngZone = new MockNgZone();
      testability1 = new Testability(ngZone);
      testability2 = new Testability(ngZone);
      resgitry = new TestabilityRegistry();
    });
    describe('unregister testability', () => {
      it('should remove the testability when unregistering an existing testability', () => {
        resgitry.registerApplication('testability1', testability1);
        resgitry.registerApplication('testability2', testability2);
        resgitry.unregisterApplication('testability2');
        expect(resgitry.getAllTestabilities().length).toEqual(1);
        expect(resgitry.getTestability('testability1')).toEqual(testability1);
      });

      it('should remain the same when unregistering a non-existing testability', () => {
        expect(resgitry.getAllTestabilities().length).toEqual(0);
        resgitry.registerApplication('testability1', testability1);
        resgitry.registerApplication('testability2', testability2);
        resgitry.unregisterApplication('testability3');
        expect(resgitry.getAllTestabilities().length).toEqual(2);
        expect(resgitry.getTestability('testability1')).toEqual(testability1);
        expect(resgitry.getTestability('testability2')).toEqual(testability2);
      });

      it('should remove all the testability when unregistering all testabilities', () => {
        resgitry.registerApplication('testability1', testability1);
        resgitry.registerApplication('testability2', testability2);
        resgitry.unregisterAllApplications();
        expect(resgitry.getAllTestabilities().length).toEqual(0);
      });
    });
  });
}
