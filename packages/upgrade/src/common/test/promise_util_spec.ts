/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SyncPromise, isThenable} from '../src/promise_util';

describe('isThenable()', () => {
  it('should return false for primitive values', () => {
    expect(isThenable(undefined)).toBe(false);
    expect(isThenable(null)).toBe(false);
    expect(isThenable(false)).toBe(false);
    expect(isThenable(true)).toBe(false);
    expect(isThenable(0)).toBe(false);
    expect(isThenable(1)).toBe(false);
    expect(isThenable('')).toBe(false);
    expect(isThenable('foo')).toBe(false);
  });

  it('should return false if `.then` is not a function', () => {
    expect(isThenable([])).toBe(false);
    expect(isThenable(['then'])).toBe(false);
    expect(isThenable(function() {})).toBe(false);
    expect(isThenable({})).toBe(false);
    expect(isThenable({then: true})).toBe(false);
    expect(isThenable({then: 'not a function'})).toBe(false);

  });

  it('should return true if `.then` is a function', () => {
    expect(isThenable({then: function() {}})).toBe(true);
    expect(isThenable({then: () => {}})).toBe(true);
    expect(isThenable(Object.assign('thenable', {then: () => {}}))).toBe(true);
  });
});

describe('SyncPromise', () => {
  it('should call all callbacks once resolved', () => {
    const spy1 = jasmine.createSpy('spy1');
    const spy2 = jasmine.createSpy('spy2');

    const promise = new SyncPromise<string>();
    promise.then(spy1);
    promise.then(spy2);

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();

    promise.resolve('foo');

    expect(spy1).toHaveBeenCalledWith('foo');
    expect(spy2).toHaveBeenCalledWith('foo');
  });

  it('should call callbacks immediately if already resolved', () => {
    const spy = jasmine.createSpy('spy');

    const promise = new SyncPromise<string>();
    promise.resolve('foo');
    promise.then(spy);

    expect(spy).toHaveBeenCalledWith('foo');
  });

  it('should ignore subsequent calls to `resolve()`', () => {
    const spy = jasmine.createSpy('spy');

    const promise = new SyncPromise<string>();

    promise.then(spy);
    promise.resolve('foo');
    expect(spy).toHaveBeenCalledWith('foo');

    spy.calls.reset();

    promise.resolve('bar');
    expect(spy).not.toHaveBeenCalled();

    promise.then(spy);
    promise.resolve('baz');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('foo');
  });
});
