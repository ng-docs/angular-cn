/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {Attribute, Component, Directive, TemplateRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from '@angular/platform-browser/testing/src/matchers';

{
  describe('NgSwitch', () => {
    let fixture: ComponentFixture<any>;

    function getComponent(): TestComponent { return fixture.componentInstance; }

    function detectChangesAndExpectText(text: string): void {
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveText(text);
    }

    afterEach(() => { fixture = null !; });

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, ComplexComponent],
        imports: [CommonModule],
      });
    });

    describe('switch value changes', () => {
      it('should switch amongst when values', () => {
        const template = '<ul [ngSwitch]="switchValue">' +
            '<li *ngSwitchCase="\'a\'">when a</li>' +
            '<li *ngSwitchCase="\'b\'">when b</li>' +
            '</ul>';

        fixture = createTestComponent(template);

        detectChangesAndExpectText('');

        getComponent().switchValue = 'a';
        detectChangesAndExpectText('when a');

        getComponent().switchValue = 'b';
        detectChangesAndExpectText('when b');
      });

      it('should switch amongst when values with fallback to default', () => {
        const template = '<ul [ngSwitch]="switchValue">' +
            '<li *ngSwitchCase="\'a\'">when a</li>' +
            '<li *ngSwitchDefault>when default</li>' +
            '</ul>';

        fixture = createTestComponent(template);
        detectChangesAndExpectText('when default');

        getComponent().switchValue = 'a';
        detectChangesAndExpectText('when a');

        getComponent().switchValue = 'b';
        detectChangesAndExpectText('when default');

        getComponent().switchValue = 'c';
        detectChangesAndExpectText('when default');
      });

      it('should support multiple whens with the same value', () => {
        const template = '<ul [ngSwitch]="switchValue">' +
            '<li *ngSwitchCase="\'a\'">when a1;</li>' +
            '<li *ngSwitchCase="\'b\'">when b1;</li>' +
            '<li *ngSwitchCase="\'a\'">when a2;</li>' +
            '<li *ngSwitchCase="\'b\'">when b2;</li>' +
            '<li *ngSwitchDefault>when default1;</li>' +
            '<li *ngSwitchDefault>when default2;</li>' +
            '</ul>';

        fixture = createTestComponent(template);
        detectChangesAndExpectText('when default1;when default2;');

        getComponent().switchValue = 'a';
        detectChangesAndExpectText('when a1;when a2;');

        getComponent().switchValue = 'b';
        detectChangesAndExpectText('when b1;when b2;');
      });
    });

    describe('when values changes', () => {
      it('should switch amongst when values', () => {
        const template = '<ul [ngSwitch]="switchValue">' +
            '<li *ngSwitchCase="when1">when 1;</li>' +
            '<li *ngSwitchCase="when2">when 2;</li>' +
            '<li *ngSwitchDefault>when default;</li>' +
            '</ul>';

        fixture = createTestComponent(template);
        getComponent().when1 = 'a';
        getComponent().when2 = 'b';
        getComponent().switchValue = 'a';
        detectChangesAndExpectText('when 1;');

        getComponent().switchValue = 'b';
        detectChangesAndExpectText('when 2;');

        getComponent().switchValue = 'c';
        detectChangesAndExpectText('when default;');

        getComponent().when1 = 'c';
        detectChangesAndExpectText('when 1;');

        getComponent().when1 = 'd';
        detectChangesAndExpectText('when default;');
      });
    });

    describe('corner cases', () => {

      it('should not create the default case if another case matches', () => {
        const log: string[] = [];

        @Directive({selector: '[test]'})
        class TestDirective {
          constructor(@Attribute('test') test: string) { log.push(test); }
        }

        const template = '<div [ngSwitch]="switchValue">' +
            '<div *ngSwitchCase="\'a\'" test="aCase"></div>' +
            '<div *ngSwitchDefault test="defaultCase"></div>' +
            '</div>';

        TestBed.configureTestingModule({declarations: [TestDirective]});
        const fixture = createTestComponent(template);
        fixture.componentInstance.switchValue = 'a';

        fixture.detectChanges();

        expect(log).toEqual(['aCase']);
      });

      it('should create the default case if there is no other case', () => {
        const template = '<ul [ngSwitch]="switchValue">' +
            '<li *ngSwitchDefault>when default1;</li>' +
            '<li *ngSwitchDefault>when default2;</li>' +
            '</ul>';

        fixture = createTestComponent(template);
        detectChangesAndExpectText('when default1;when default2;');

      });

      it('should allow defaults before cases', () => {
        const template = '<ul [ngSwitch]="switchValue">' +
            '<li *ngSwitchDefault>when default1;</li>' +
            '<li *ngSwitchDefault>when default2;</li>' +
            '<li *ngSwitchCase="\'a\'">when a1;</li>' +
            '<li *ngSwitchCase="\'b\'">when b1;</li>' +
            '<li *ngSwitchCase="\'a\'">when a2;</li>' +
            '<li *ngSwitchCase="\'b\'">when b2;</li>' +
            '</ul>';

        fixture = createTestComponent(template);
        detectChangesAndExpectText('when default1;when default2;');

        getComponent().switchValue = 'a';
        detectChangesAndExpectText('when a1;when a2;');

        getComponent().switchValue = 'b';
        detectChangesAndExpectText('when b1;when b2;');
      });

      it('should support nested NgSwitch on ng-container with ngTemplateOutlet', () => {
        fixture = TestBed.createComponent(ComplexComponent);
        detectChangesAndExpectText('Foo');

        fixture.componentInstance.state = 'case2';
        detectChangesAndExpectText('Bar');

        fixture.componentInstance.state = 'notACase';
        detectChangesAndExpectText('Default');

        fixture.componentInstance.state = 'case1';
        detectChangesAndExpectText('Foo');
      });
    });
  });
}

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  switchValue: any = null;
  when1: any = null;
  when2: any = null;
}

@Component({
  selector: 'complex-cmp',
  template: `
<div [ngSwitch]="state">
  <ng-container *ngSwitchCase="'case1'" [ngSwitch]="true">
    <ng-container *ngSwitchCase="true" [ngTemplateOutlet]="foo"></ng-container>
    <span *ngSwitchDefault>Should never render</span>
  </ng-container>
  <ng-container *ngSwitchCase="'case2'" [ngSwitch]="true">
    <ng-container *ngSwitchCase="true" [ngTemplateOutlet]="bar"></ng-container>
    <span *ngSwitchDefault>Should never render</span>
  </ng-container>
  <ng-container *ngSwitchDefault [ngSwitch]="false">
    <ng-container *ngSwitchCase="true" [ngTemplateOutlet]="foo"></ng-container>
    <span *ngSwitchDefault>Default</span>
  </ng-container>
</div>

<ng-template #foo>
  <span>Foo</span>
</ng-template>
<ng-template #bar>
  <span>Bar</span>
</ng-template>
`
})
class ComplexComponent {
  @ViewChild('foo', {static: true}) foo !: TemplateRef<any>;
  @ViewChild('bar', {static: true}) bar !: TemplateRef<any>;
  state: string = 'case1';
}

function createTestComponent(template: string): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, {set: {template: template}})
      .createComponent(TestComponent);
}
