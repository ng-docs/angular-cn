/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule, NgFor, NgForOf} from '@angular/common';
import {Component, Directive} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser/src/dom/debug/by';
import {expect} from '@angular/platform-browser/testing/matchers';

let thisArg: any;

export function main() {
  describe('ngFor', () => {
    let fixture: ComponentFixture<any>;

    function getComponent(): TestComponent { return fixture.componentInstance; }

    function detectChangesAndExpectText(text: string): void {
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveText(text);
    }

    afterEach(() => { fixture = null; });

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, TestDirective],
        imports: [CommonModule],
      });
    });

    it('should reflect initial elements', async(() => {
         fixture = createTestComponent();

         detectChangesAndExpectText('1;2;');
       }));

    it('should reflect added elements', async(() => {
         fixture = createTestComponent();
         fixture.detectChanges();
         getComponent().items.push(3);
         detectChangesAndExpectText('1;2;3;');
       }));

    it('should reflect removed elements', async(() => {
         fixture = createTestComponent();
         fixture.detectChanges();
         getComponent().items.splice(1, 1);
         detectChangesAndExpectText('1;');
       }));

    it('should reflect moved elements', async(() => {
         fixture = createTestComponent();
         fixture.detectChanges();
         getComponent().items.splice(0, 1);
         getComponent().items.push(1);
         detectChangesAndExpectText('2;1;');
       }));

    it('should reflect a mix of all changes (additions/removals/moves)', async(() => {
         fixture = createTestComponent();

         getComponent().items = [0, 1, 2, 3, 4, 5];
         fixture.detectChanges();

         getComponent().items = [6, 2, 7, 0, 4, 8];

         detectChangesAndExpectText('6;2;7;0;4;8;');
       }));

    it('should iterate over an array of objects', async(() => {
         const template = '<ul><li *ngFor="let item of items">{{item["name"]}};</li></ul>';
         fixture = createTestComponent(template);

         // INIT
         getComponent().items = [{'name': 'misko'}, {'name': 'shyam'}];
         detectChangesAndExpectText('misko;shyam;');

         // GROW
         getComponent().items.push({'name': 'adam'});
         detectChangesAndExpectText('misko;shyam;adam;');

         // SHRINK
         getComponent().items.splice(2, 1);
         getComponent().items.splice(0, 1);
         detectChangesAndExpectText('shyam;');
       }));

    it('should gracefully handle nulls', async(() => {
         const template = '<ul><li *ngFor="let item of null">{{item}};</li></ul>';
         fixture = createTestComponent(template);

         detectChangesAndExpectText('');
       }));

    it('should gracefully handle ref changing to null and back', async(() => {
         fixture = createTestComponent();

         detectChangesAndExpectText('1;2;');

         getComponent().items = null;
         detectChangesAndExpectText('');

         getComponent().items = [1, 2, 3];
         detectChangesAndExpectText('1;2;3;');
       }));

    it('should throw on non-iterable ref and suggest using an array', async(() => {
         fixture = createTestComponent();

         getComponent().items = <any>'whaaa';
         expect(() => fixture.detectChanges())
             .toThrowError(
                 /Cannot find a differ supporting object 'whaaa' of type 'string'. NgFor only supports binding to Iterables such as Arrays/);
       }));

    it('should throw on ref changing to string', async(() => {
         fixture = createTestComponent();

         detectChangesAndExpectText('1;2;');

         getComponent().items = <any>'whaaa';
         expect(() => fixture.detectChanges()).toThrowError();
       }));

    it('should works with duplicates', async(() => {
         fixture = createTestComponent();

         const a = new Foo();
         getComponent().items = [a, a];
         detectChangesAndExpectText('foo;foo;');
       }));

    it('should repeat over nested arrays', async(() => {
         const template = '<div *ngFor="let item of items">' +
             '<div *ngFor="let subitem of item">{{subitem}}-{{item.length}};</div>|' +
             '</div>';
         fixture = createTestComponent(template);

         getComponent().items = [['a', 'b'], ['c']];
         detectChangesAndExpectText('a-2;b-2;|c-1;|');

         getComponent().items = [['e'], ['f', 'g']];
         detectChangesAndExpectText('e-1;|f-2;g-2;|');
       }));

    it('should repeat over nested arrays with no intermediate element', async(() => {
         const template = '<div *ngFor="let item of items">' +
             '<div *ngFor="let subitem of item">{{subitem}}-{{item.length}};</div>' +
             '</div>';
         fixture = createTestComponent(template);

         getComponent().items = [['a', 'b'], ['c']];
         detectChangesAndExpectText('a-2;b-2;c-1;');

         getComponent().items = [['e'], ['f', 'g']];
         detectChangesAndExpectText('e-1;f-2;g-2;');
       }));

    it('should repeat over nested ngIf that are the last node in the ngFor template', async(() => {
         const template = `<div *ngFor="let item of items; let i=index">` +
             `<div>{{i}}|</div>` +
             `<div *ngIf="i % 2 == 0">even|</div>` +
             `</div>`;

         fixture = createTestComponent(template);

         const items = [1];
         getComponent().items = items;
         detectChangesAndExpectText('0|even|');

         items.push(1);
         detectChangesAndExpectText('0|even|1|');

         items.push(1);
         detectChangesAndExpectText('0|even|1|2|even|');
       }));

    it('should display indices correctly', async(() => {
         const template = '<span *ngFor ="let item of items; let i=index">{{i.toString()}}</span>';
         fixture = createTestComponent(template);

         getComponent().items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
         detectChangesAndExpectText('0123456789');

         getComponent().items = [1, 2, 6, 7, 4, 3, 5, 8, 9, 0];
         detectChangesAndExpectText('0123456789');
       }));

    it('should display first item correctly', async(() => {
         const template =
             '<span *ngFor="let item of items; let isFirst=first">{{isFirst.toString()}}</span>';
         fixture = createTestComponent(template);

         getComponent().items = [0, 1, 2];
         detectChangesAndExpectText('truefalsefalse');

         getComponent().items = [2, 1];
         detectChangesAndExpectText('truefalse');
       }));

    it('should display last item correctly', async(() => {
         const template =
             '<span *ngFor="let item of items; let isLast=last">{{isLast.toString()}}</span>';
         fixture = createTestComponent(template);

         getComponent().items = [0, 1, 2];
         detectChangesAndExpectText('falsefalsetrue');

         getComponent().items = [2, 1];
         detectChangesAndExpectText('falsetrue');
       }));

    it('should display even items correctly', async(() => {
         const template =
             '<span *ngFor="let item of items; let isEven=even">{{isEven.toString()}}</span>';
         fixture = createTestComponent(template);

         getComponent().items = [0, 1, 2];
         detectChangesAndExpectText('truefalsetrue');

         getComponent().items = [2, 1];
         detectChangesAndExpectText('truefalse');
       }));

    it('should display odd items correctly', async(() => {
         const template =
             '<span *ngFor="let item of items; let isOdd=odd">{{isOdd.toString()}}</span>';
         fixture = createTestComponent(template);

         getComponent().items = [0, 1, 2, 3];
         detectChangesAndExpectText('falsetruefalsetrue');

         getComponent().items = [2, 1];
         detectChangesAndExpectText('falsetrue');
       }));

    it('should allow to use a custom template', async(() => {
         const template =
             '<ng-container *ngFor="let item of items; template: tpl"></ng-container>' +
             '<ng-template let-item let-i="index" #tpl><p>{{i}}: {{item}};</p></ng-template>';
         fixture = createTestComponent(template);
         getComponent().items = ['a', 'b', 'c'];
         fixture.detectChanges();
         detectChangesAndExpectText('0: a;1: b;2: c;');
       }));

    it('should use a default template if a custom one is null', async(() => {
         const template =
             `<ul><ng-container *ngFor="let item of items; template: null; let i=index">{{i}}: {{item}};</ng-container></ul>`;
         fixture = createTestComponent(template);
         getComponent().items = ['a', 'b', 'c'];
         fixture.detectChanges();
         detectChangesAndExpectText('0: a;1: b;2: c;');
       }));

    it('should use a custom template when both default and a custom one are present', async(() => {
         const template =
             '<ng-container *ngFor="let item of items; template: tpl">{{i}};</ng-container>' +
             '<ng-template let-item let-i="index" #tpl>{{i}}: {{item}};</ng-template>';
         fixture = createTestComponent(template);
         getComponent().items = ['a', 'b', 'c'];
         fixture.detectChanges();
         detectChangesAndExpectText('0: a;1: b;2: c;');
       }));

    describe('track by', () => {
      it('should console.warn if trackBy is not a function', async(() => {
           // TODO(vicb): expect a warning message when we have a proper log service
           const template = `<p *ngFor="let item of items; trackBy: value"></p>`;
           fixture = createTestComponent(template);
           fixture.componentInstance.value = 0;
           fixture.detectChanges();
         }));

      it('should track by identity when trackBy is to `null` or `undefined`', async(() => {
           // TODO(vicb): expect no warning message when we have a proper log service
           const template = `<p *ngFor="let item of items; trackBy: value">{{ item }}</p>`;
           fixture = createTestComponent(template);
           fixture.componentInstance.items = ['a', 'b', 'c'];
           fixture.componentInstance.value = null;
           detectChangesAndExpectText('abc');
           fixture.componentInstance.value = undefined;
           detectChangesAndExpectText('abc');
         }));

      it('should set the context to the component instance', async(() => {
           const template =
               `<p *ngFor="let item of items; trackBy: trackByContext.bind(this)"></p>`;
           fixture = createTestComponent(template);

           thisArg = null;
           fixture.detectChanges();
           expect(thisArg).toBe(getComponent());
         }));

      it('should not replace tracked items', async(() => {
           const template =
               `<p *ngFor="let item of items; trackBy: trackById; let i=index">{{items[i]}}</p>`;
           fixture = createTestComponent(template);

           const buildItemList = () => {
             getComponent().items = [{'id': 'a'}];
             fixture.detectChanges();
             return fixture.debugElement.queryAll(By.css('p'))[0];
           };

           const firstP = buildItemList();
           const finalP = buildItemList();
           expect(finalP.nativeElement).toBe(firstP.nativeElement);
         }));

      it('should update implicit local variable on view', async(() => {
           const template =
               `<div *ngFor="let item of items; trackBy: trackById">{{item['color']}}</div>`;
           fixture = createTestComponent(template);

           getComponent().items = [{'id': 'a', 'color': 'blue'}];
           detectChangesAndExpectText('blue');

           getComponent().items = [{'id': 'a', 'color': 'red'}];
           detectChangesAndExpectText('red');
         }));

      it('should move items around and keep them updated ', async(() => {
           const template =
               `<div *ngFor="let item of items; trackBy: trackById">{{item['color']}}</div>`;
           fixture = createTestComponent(template);

           getComponent().items = [{'id': 'a', 'color': 'blue'}, {'id': 'b', 'color': 'yellow'}];
           detectChangesAndExpectText('blueyellow');

           getComponent().items = [{'id': 'b', 'color': 'orange'}, {'id': 'a', 'color': 'red'}];
           detectChangesAndExpectText('orangered');
         }));

      it('should handle added and removed items properly when tracking by index', async(() => {
           const template = `<div *ngFor="let item of items; trackBy: trackByIndex">{{item}}</div>`;
           fixture = createTestComponent(template);

           getComponent().items = ['a', 'b', 'c', 'd'];
           fixture.detectChanges();
           getComponent().items = ['e', 'f', 'g', 'h'];
           fixture.detectChanges();
           getComponent().items = ['e', 'f', 'h'];
           detectChangesAndExpectText('efh');
         }));

      it('should support injecting `NgFor` and get an instance of `NgForOf`', async(() => {
           const template = `<ng-template ngFor [ngForOf]='items' let-item test></ng-template>`;
           fixture = createTestComponent(template);
           const testDirective = fixture.debugElement.childNodes[0].injector.get(TestDirective);
           const ngForOf = fixture.debugElement.childNodes[0].injector.get(NgForOf);
           expect(testDirective.ngFor).toBe(ngForOf);
         }));
    });
  });
}

class Foo {
  toString() { return 'foo'; }
}

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  value: any;
  items: any[] = [1, 2];
  trackById(index: number, item: any): string { return item['id']; }
  trackByIndex(index: number, item: any): number { return index; }
  trackByContext(): void { thisArg = this; }
}

@Directive({selector: '[test]'})
class TestDirective {
  constructor(public ngFor: NgFor) {}
}

const TEMPLATE = '<div><span *ngFor="let item of items">{{item.toString()}};</span></div>';

function createTestComponent(template: string = TEMPLATE): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, {set: {template: template}})
      .createComponent(TestComponent);
}