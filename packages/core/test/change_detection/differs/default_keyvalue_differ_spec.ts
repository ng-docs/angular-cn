/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DefaultKeyValueDiffer, DefaultKeyValueDifferFactory} from '@angular/core/src/change_detection/differs/default_keyvalue_differ';
import {afterEach, beforeEach, describe, expect, it} from '@angular/core/testing/src/testing_internal';
import {kvChangesAsString} from '../../change_detection/util';

// todo(vicb): Update the code & tests for object equality
export function main() {
  describe('keyvalue differ', function() {
    describe('DefaultKeyValueDiffer', function() {
      let differ: DefaultKeyValueDiffer<any, any>;
      let m: Map<any, any>;

      beforeEach(() => {
        differ = new DefaultKeyValueDiffer<string, any>();
        m = new Map();
      });

      afterEach(() => { differ = null; });

      it('should detect additions', () => {
        differ.check(m);

        m.set('a', 1);
        differ.check(m);
        expect(differ.toString())
            .toEqual(kvChangesAsString({map: ['a[null->1]'], additions: ['a[null->1]']}));

        m.set('b', 2);
        differ.check(m);
        expect(differ.toString())
            .toEqual(kvChangesAsString(
                {map: ['a', 'b[null->2]'], previous: ['a'], additions: ['b[null->2]']}));
      });

      it('should handle changing key/values correctly', () => {
        m.set(1, 10);
        m.set(2, 20);
        differ.check(m);

        m.set(2, 10);
        m.set(1, 20);
        differ.check(m);
        expect(differ.toString()).toEqual(kvChangesAsString({
          map: ['1[10->20]', '2[20->10]'],
          previous: ['1[10->20]', '2[20->10]'],
          changes: ['1[10->20]', '2[20->10]']
        }));
      });

      it('should expose previous and current value', () => {
        let previous: any /** TODO #9100 */, current: any /** TODO #9100 */;

        m.set(1, 10);
        differ.check(m);

        m.set(1, 20);
        differ.check(m);

        differ.forEachChangedItem((record: any /** TODO #9100 */) => {
          previous = record.previousValue;
          current = record.currentValue;
        });

        expect(previous).toEqual(10);
        expect(current).toEqual(20);
      });

      it('should do basic map watching', () => {
        differ.check(m);

        m.set('a', 'A');
        differ.check(m);
        expect(differ.toString())
            .toEqual(kvChangesAsString({map: ['a[null->A]'], additions: ['a[null->A]']}));

        m.set('b', 'B');
        differ.check(m);
        expect(differ.toString())
            .toEqual(kvChangesAsString(
                {map: ['a', 'b[null->B]'], previous: ['a'], additions: ['b[null->B]']}));

        m.set('b', 'BB');
        m.set('d', 'D');
        differ.check(m);
        expect(differ.toString()).toEqual(kvChangesAsString({
          map: ['a', 'b[B->BB]', 'd[null->D]'],
          previous: ['a', 'b[B->BB]'],
          additions: ['d[null->D]'],
          changes: ['b[B->BB]']
        }));

        m.delete('b');
        differ.check(m);
        expect(differ.toString())
            .toEqual(kvChangesAsString(
                {map: ['a', 'd'], previous: ['a', 'b[BB->null]', 'd'], removals: ['b[BB->null]']}));

        m.clear();
        differ.check(m);
        expect(differ.toString()).toEqual(kvChangesAsString({
          previous: ['a[A->null]', 'd[D->null]'],
          removals: ['a[A->null]', 'd[D->null]']
        }));
      });

      it('should not see a NaN value as a change', () => {
        m.set('foo', Number.NaN);
        differ.check(m);

        differ.check(m);
        expect(differ.toString()).toEqual(kvChangesAsString({map: ['foo'], previous: ['foo']}));
      });

      it('should work regardless key order', () => {
        m.set('a', 0);
        m.set('b', 0);
        differ.check(m);

        m = new Map();
        m.set('b', 1);
        m.set('a', 1);
        differ.check(m);

        expect(differ.toString()).toEqual(kvChangesAsString({
          map: ['b[0->1]', 'a[0->1]'],
          previous: ['a[0->1]', 'b[0->1]'],
          changes: ['b[0->1]', 'a[0->1]']
        }));
      });

      describe('JsObject changes', () => {
        it('should support JS Object', () => {
          const f = new DefaultKeyValueDifferFactory();
          expect(f.supports({})).toBeTruthy();
          expect(f.supports('not supported')).toBeFalsy();
          expect(f.supports(0)).toBeFalsy();
          expect(f.supports(null)).toBeFalsy();
        });

        it('should do basic object watching', () => {
          let m: {[k: string]: string} = {};
          differ.check(m);

          m['a'] = 'A';
          differ.check(m);
          expect(differ.toString())
              .toEqual(kvChangesAsString({map: ['a[null->A]'], additions: ['a[null->A]']}));

          m['b'] = 'B';
          differ.check(m);
          expect(differ.toString())
              .toEqual(kvChangesAsString(
                  {map: ['a', 'b[null->B]'], previous: ['a'], additions: ['b[null->B]']}));

          m['b'] = 'BB';
          m['d'] = 'D';
          differ.check(m);
          expect(differ.toString()).toEqual(kvChangesAsString({
            map: ['a', 'b[B->BB]', 'd[null->D]'],
            previous: ['a', 'b[B->BB]'],
            additions: ['d[null->D]'],
            changes: ['b[B->BB]']
          }));

          m = {};
          m['a'] = 'A';
          m['d'] = 'D';
          differ.check(m);
          expect(differ.toString()).toEqual(kvChangesAsString({
            map: ['a', 'd'],
            previous: ['a', 'b[BB->null]', 'd'],
            removals: ['b[BB->null]']
          }));

          m = {};
          differ.check(m);
          expect(differ.toString()).toEqual(kvChangesAsString({
            previous: ['a[A->null]', 'd[D->null]'],
            removals: ['a[A->null]', 'd[D->null]']
          }));

        });

        it('should work regardless key order', () => {
          differ.check({a: 0, b: 0});
          differ.check({b: 1, a: 1});

          expect(differ.toString()).toEqual(kvChangesAsString({
            map: ['b[0->1]', 'a[0->1]'],
            previous: ['a[0->1]', 'b[0->1]'],
            changes: ['b[0->1]', 'a[0->1]']
          }));
        });
      });

      describe('diff', () => {
        it('should return self when there is a change', () => {
          m.set('a', 'A');
          expect(differ.diff(m)).toBe(differ);
        });

        it('should return null when there is no change', () => {
          m.set('a', 'A');
          differ.diff(m);
          expect(differ.diff(m)).toEqual(null);
        });

        it('should treat null as an empty list', () => {
          m.set('a', 'A');
          differ.diff(m);
          expect(differ.diff(null).toString())
              .toEqual(kvChangesAsString({previous: ['a[A->null]'], removals: ['a[A->null]']}));
        });

        it('should throw when given an invalid collection', () => {
          expect(() => differ.diff(<any>'invalid'))
              .toThrowError('Error trying to diff \'invalid\'');
        });
      });
    });
  });
}
