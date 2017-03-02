/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule, JsonPipe} from '@angular/common';
import {Component} from '@angular/core';
import {TestBed, async} from '@angular/core/testing';
import {expect} from '@angular/platform-browser/testing/src/matchers';

export function main() {
  describe('JsonPipe', () => {
    const regNewLine = '\n';
    let inceptionObj: any;
    let inceptionObjString: string;
    let pipe: JsonPipe;

    function normalize(obj: string): string { return obj.replace(regNewLine, ''); }

    beforeEach(() => {
      inceptionObj = {dream: {dream: {dream: 'Limbo'}}};
      inceptionObjString = '{\n' +
          '  "dream": {\n' +
          '    "dream": {\n' +
          '      "dream": "Limbo"\n' +
          '    }\n' +
          '  }\n' +
          '}';


      pipe = new JsonPipe();
    });

    describe('transform', () => {
      it('should return JSON-formatted string',
         () => { expect(pipe.transform(inceptionObj)).toEqual(inceptionObjString); });

      it('should return JSON-formatted string even when normalized', () => {
        const dream1 = normalize(pipe.transform(inceptionObj));
        const dream2 = normalize(inceptionObjString);
        expect(dream1).toEqual(dream2);
      });

      it('should return JSON-formatted string similar to Json.stringify', () => {
        const dream1 = normalize(pipe.transform(inceptionObj));
        const dream2 = normalize(JSON.stringify(inceptionObj, null, 2));
        expect(dream1).toEqual(dream2);
      });
    });

    describe('integration', () => {

      @Component({selector: 'test-comp', template: '{{data | json}}'})
      class TestComp {
        data: any;
      }

      beforeEach(() => {
        TestBed.configureTestingModule({declarations: [TestComp], imports: [CommonModule]});
      });

      it('should work with mutable objects', async(() => {
           const fixture = TestBed.createComponent(TestComp);
           const mutable: number[] = [1];
           fixture.componentInstance.data = mutable;
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveText('[\n  1\n]');

           mutable.push(2);
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveText('[\n  1,\n  2\n]');
         }));
    });
  });
}
