/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EventEmitter} from '@angular/core';

import {ΔdefineComponent, ΔdefineDirective} from '../../src/render3/index';
import {Δbind, Δcontainer, ΔcontainerRefreshEnd, ΔcontainerRefreshStart, Δelement, ΔelementEnd, ΔelementProperty, ΔelementStart, ΔembeddedViewEnd, ΔembeddedViewStart, Δinterpolation1, Δlistener, Δload, Δreference, Δtext, ΔtextBinding} from '../../src/render3/instructions/all';
import {RenderFlags} from '../../src/render3/interfaces/definition';

import {ComponentFixture, createComponent, renderToHtml} from './render_util';

describe('elementProperty', () => {

  it('should support bindings to properties', () => {
    const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
      if (rf & RenderFlags.Create) {
        Δelement(0, 'span');
      }
      if (rf & RenderFlags.Update) {
        ΔelementProperty(0, 'id', Δbind(ctx.id));
      }
    }, 1, 1);

    const fixture = new ComponentFixture(App);
    fixture.component.id = 'testId';
    fixture.update();
    expect(fixture.html).toEqual('<span id="testId"></span>');

    fixture.component.id = 'otherId';
    fixture.update();
    expect(fixture.html).toEqual('<span id="otherId"></span>');
  });

  it('should support creation time bindings to properties', () => {
    function expensive(ctx: string): any {
      if (ctx === 'cheapId') {
        return ctx;
      } else {
        throw 'Too expensive!';
      }
    }

    function Template(rf: RenderFlags, ctx: string) {
      if (rf & RenderFlags.Create) {
        Δelement(0, 'span');
        ΔelementProperty(0, 'id', expensive(ctx));
      }
    }

    expect(renderToHtml(Template, 'cheapId', 1)).toEqual('<span id="cheapId"></span>');
    expect(renderToHtml(Template, 'expensiveId', 1)).toEqual('<span id="cheapId"></span>');
  });

  it('should support interpolation for properties', () => {
    const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
      if (rf & RenderFlags.Create) {
        Δelement(0, 'span');
      }
      if (rf & RenderFlags.Update) {
        ΔelementProperty(0, 'id', Δinterpolation1('_', ctx.id, '_'));
      }
    }, 1, 1);

    const fixture = new ComponentFixture(App);
    fixture.component.id = 'testId';
    fixture.update();
    expect(fixture.html).toEqual('<span id="_testId_"></span>');

    fixture.component.id = 'otherId';
    fixture.update();
    expect(fixture.html).toEqual('<span id="_otherId_"></span>');
  });

  describe('input properties', () => {
    let button: MyButton;
    let otherDir: OtherDir;
    let otherDisabledDir: OtherDisabledDir;
    let idDir: IdDir;

    class MyButton {
      // TODO(issue/24571): remove '!'.
      disabled !: boolean;

      static ngDirectiveDef = ΔdefineDirective({
        type: MyButton,
        selectors: [['', 'myButton', '']],
        factory: () => button = new MyButton(),
        inputs: {disabled: 'disabled'}
      });
    }

    class OtherDir {
      // TODO(issue/24571): remove '!'.
      id !: number;
      clickStream = new EventEmitter();

      static ngDirectiveDef = ΔdefineDirective({
        type: OtherDir,
        selectors: [['', 'otherDir', '']],
        factory: () => otherDir = new OtherDir(),
        inputs: {id: 'id'},
        outputs: {clickStream: 'click'}
      });
    }

    class OtherDisabledDir {
      // TODO(issue/24571): remove '!'.
      disabled !: boolean;

      static ngDirectiveDef = ΔdefineDirective({
        type: OtherDisabledDir,
        selectors: [['', 'otherDisabledDir', '']],
        factory: () => otherDisabledDir = new OtherDisabledDir(),
        inputs: {disabled: 'disabled'}
      });
    }

    class IdDir {
      // TODO(issue/24571): remove '!'.
      idNumber !: string;

      static ngDirectiveDef = ΔdefineDirective({
        type: IdDir,
        selectors: [['', 'idDir', '']],
        factory: () => idDir = new IdDir(),
        inputs: {idNumber: 'id'}
      });
    }


    const deps = [MyButton, OtherDir, OtherDisabledDir, IdDir];

    it('should check input properties before setting (directives)', () => {

      /** <button myButton otherDir [id]="id" [disabled]="isDisabled">Click me</button> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          ΔelementStart(0, 'button', ['otherDir', '', 'myButton', '']);
          { Δtext(1, 'Click me'); }
          ΔelementEnd();
        }
        if (rf & RenderFlags.Update) {
          ΔelementProperty(0, 'disabled', Δbind(ctx.isDisabled));
          ΔelementProperty(0, 'id', Δbind(ctx.id));
        }
      }, 2, 2, deps);

      const fixture = new ComponentFixture(App);
      fixture.component.isDisabled = true;
      fixture.component.id = 0;
      fixture.update();
      expect(fixture.html).toEqual(`<button mybutton="" otherdir="">Click me</button>`);
      expect(button !.disabled).toEqual(true);
      expect(otherDir !.id).toEqual(0);

      fixture.component.isDisabled = false;
      fixture.component.id = 1;
      fixture.update();
      expect(fixture.html).toEqual(`<button mybutton="" otherdir="">Click me</button>`);
      expect(button !.disabled).toEqual(false);
      expect(otherDir !.id).toEqual(1);
    });

    it('should support mixed element properties and input properties', () => {

      /** <button myButton [id]="id" [disabled]="isDisabled">Click me</button> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          ΔelementStart(0, 'button', ['myButton', '']);
          { Δtext(1, 'Click me'); }
          ΔelementEnd();
        }
        if (rf & RenderFlags.Update) {
          ΔelementProperty(0, 'disabled', Δbind(ctx.isDisabled));
          ΔelementProperty(0, 'id', Δbind(ctx.id));
        }
      }, 2, 2, deps);


      const fixture = new ComponentFixture(App);
      fixture.component.isDisabled = true;
      fixture.component.id = 0;
      fixture.update();
      expect(fixture.html).toEqual(`<button id="0" mybutton="">Click me</button>`);
      expect(button !.disabled).toEqual(true);

      fixture.component.isDisabled = false;
      fixture.component.id = 1;
      fixture.update();
      expect(fixture.html).toEqual(`<button id="1" mybutton="">Click me</button>`);
      expect(button !.disabled).toEqual(false);
    });

    it('should check that property is not an input property before setting (component)', () => {
      let comp: Comp;

      class Comp {
        // TODO(issue/24571): remove '!'.
        id !: number;

        static ngComponentDef = ΔdefineComponent({
          type: Comp,
          selectors: [['comp']],
          consts: 0,
          vars: 0,
          template: function(rf: RenderFlags, ctx: any) {},
          factory: () => comp = new Comp(),
          inputs: {id: 'id'}
        });
      }

      /** <comp [id]="id"></comp> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δelement(0, 'comp');
        }
        if (rf & RenderFlags.Update) {
          ΔelementProperty(0, 'id', Δbind(ctx.id));
        }
      }, 1, 1, [Comp]);

      const fixture = new ComponentFixture(App);
      fixture.component.id = 1;
      fixture.update();
      expect(fixture.html).toEqual(`<comp></comp>`);
      expect(comp !.id).toEqual(1);

      fixture.component.id = 2;
      fixture.update();
      expect(fixture.html).toEqual(`<comp></comp>`);
      expect(comp !.id).toEqual(2);
    });

    it('should support two input properties with the same name', () => {

      /** <button myButton otherDisabledDir [disabled]="isDisabled">Click me</button> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          ΔelementStart(0, 'button', ['myButton', '', 'otherDisabledDir', '']);
          { Δtext(1, 'Click me'); }
          ΔelementEnd();
        }
        if (rf & RenderFlags.Update) {
          ΔelementProperty(0, 'disabled', Δbind(ctx.isDisabled));
        }
      }, 2, 1, deps);

      const fixture = new ComponentFixture(App);
      fixture.component.isDisabled = true;
      fixture.update();
      expect(fixture.html).toEqual(`<button mybutton="" otherdisableddir="">Click me</button>`);
      expect(button !.disabled).toEqual(true);
      expect(otherDisabledDir !.disabled).toEqual(true);

      fixture.component.isDisabled = false;
      fixture.update();
      expect(fixture.html).toEqual(`<button mybutton="" otherdisableddir="">Click me</button>`);
      expect(button !.disabled).toEqual(false);
      expect(otherDisabledDir !.disabled).toEqual(false);
    });

    it('should set input property if there is an output first', () => {
      /** <button otherDir [id]="id" (click)="onClick()">Click me</button> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          ΔelementStart(0, 'button', ['otherDir', '']);
          {
            Δlistener('click', () => ctx.onClick());
            Δtext(1, 'Click me');
          }
          ΔelementEnd();
        }
        if (rf & RenderFlags.Update) {
          ΔelementProperty(0, 'id', Δbind(ctx.id));
        }
      }, 2, 1, deps);

      const fixture = new ComponentFixture(App);
      let counter = 0;
      fixture.component.id = 1;
      fixture.component.onClick = () => counter++;
      fixture.update();
      expect(fixture.html).toEqual(`<button otherdir="">Click me</button>`);
      expect(otherDir !.id).toEqual(1);

      otherDir !.clickStream.next();
      expect(counter).toEqual(1);

      fixture.component.id = 2;
      fixture.update();
      fixture.html;
      expect(otherDir !.id).toEqual(2);
    });

    it('should support unrelated element properties at same index in if-else block', () => {
      /**
       * <button idDir [id]="id1">Click me</button>             // inputs: {'id': [0, 'idNumber']}
       * % if (condition) {
       *   <button [id]="id2">Click me too</button>             // inputs: null
       * % } else {
       *   <button otherDir [id]="id3">Click me too</button>   // inputs: {'id': [0, 'id']}
       * % }
       */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          ΔelementStart(0, 'button', ['idDir', '']);
          { Δtext(1, 'Click me'); }
          ΔelementEnd();
          Δcontainer(2);
        }
        if (rf & RenderFlags.Update) {
          ΔelementProperty(0, 'id', Δbind(ctx.id1));
          ΔcontainerRefreshStart(2);
          {
            if (ctx.condition) {
              let rf0 = ΔembeddedViewStart(0, 2, 1);
              if (rf0 & RenderFlags.Create) {
                ΔelementStart(0, 'button');
                { Δtext(1, 'Click me too'); }
                ΔelementEnd();
              }
              if (rf0 & RenderFlags.Update) {
                ΔelementProperty(0, 'id', Δbind(ctx.id2));
              }
              ΔembeddedViewEnd();
            } else {
              let rf1 = ΔembeddedViewStart(1, 2, 1);
              if (rf1 & RenderFlags.Create) {
                ΔelementStart(0, 'button', ['otherDir', '']);
                { Δtext(1, 'Click me too'); }
                ΔelementEnd();
              }
              if (rf1 & RenderFlags.Update) {
                ΔelementProperty(0, 'id', Δbind(ctx.id3));
              }
              ΔembeddedViewEnd();
            }
          }
          ΔcontainerRefreshEnd();
        }
      }, 3, 1, deps);

      const fixture = new ComponentFixture(App);
      fixture.component.condition = true;
      fixture.component.id1 = 'one';
      fixture.component.id2 = 'two';
      fixture.component.id3 = 3;
      fixture.update();
      expect(fixture.html)
          .toEqual(`<button iddir="">Click me</button><button id="two">Click me too</button>`);
      expect(idDir !.idNumber).toEqual('one');

      fixture.component.condition = false;
      fixture.component.id1 = 'four';
      fixture.update();
      expect(fixture.html)
          .toEqual(`<button iddir="">Click me</button><button otherdir="">Click me too</button>`);
      expect(idDir !.idNumber).toEqual('four');
      expect(otherDir !.id).toEqual(3);
    });

  });

  describe('attributes and input properties', () => {
    let myDir: MyDir;
    class MyDir {
      // TODO(issue/24571): remove '!'.
      role !: string;
      // TODO(issue/24571): remove '!'.
      direction !: string;
      changeStream = new EventEmitter();

      static ngDirectiveDef = ΔdefineDirective({
        type: MyDir,
        selectors: [['', 'myDir', '']],
        factory: () => myDir = new MyDir(),
        inputs: {role: 'role', direction: 'dir'},
        outputs: {changeStream: 'change'},
        exportAs: ['myDir']
      });
    }

    let dirB: MyDirB;
    class MyDirB {
      // TODO(issue/24571): remove '!'.
      roleB !: string;

      static ngDirectiveDef = ΔdefineDirective({
        type: MyDirB,
        selectors: [['', 'myDirB', '']],
        factory: () => dirB = new MyDirB(),
        inputs: {roleB: 'role'}
      });
    }

    const deps = [MyDir, MyDirB];

    it('should set input property based on attribute if existing', () => {

      /** <div role="button" myDir></div> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δelement(0, 'div', ['role', 'button', 'myDir', '']);
        }
      }, 1, 0, deps);

      const fixture = new ComponentFixture(App);
      expect(fixture.html).toEqual(`<div mydir="" role="button"></div>`);
      expect(myDir !.role).toEqual('button');
    });

    it('should set input property and attribute if both defined', () => {

      /** <div role="button" [role]="role" myDir></div> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δelement(0, 'div', ['role', 'button', 'myDir', '']);
        }
        if (rf & RenderFlags.Update) {
          ΔelementProperty(0, 'role', Δbind(ctx.role));
        }
      }, 1, 1, deps);

      const fixture = new ComponentFixture(App);
      fixture.component.role = 'listbox';
      fixture.update();
      expect(fixture.html).toEqual(`<div mydir="" role="button"></div>`);
      expect(myDir !.role).toEqual('listbox');

      fixture.component.role = 'button';
      fixture.update();
      expect(myDir !.role).toEqual('button');
    });

    it('should set two directive input properties based on same attribute', () => {

      /** <div role="button" myDir myDirB></div> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δelement(0, 'div', ['role', 'button', 'myDir', '', 'myDirB', '']);
        }
      }, 1, 0, deps);

      const fixture = new ComponentFixture(App);
      expect(fixture.html).toEqual(`<div mydir="" mydirb="" role="button"></div>`);
      expect(myDir !.role).toEqual('button');
      expect(dirB !.roleB).toEqual('button');
    });

    it('should process two attributes on same directive', () => {

      /** <div role="button" dir="rtl" myDir></div> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δelement(0, 'div', ['role', 'button', 'dir', 'rtl', 'myDir', '']);
        }
      }, 1, 0, deps);

      const fixture = new ComponentFixture(App);
      expect(fixture.html).toEqual(`<div dir="rtl" mydir="" role="button"></div>`);
      expect(myDir !.role).toEqual('button');
      expect(myDir !.direction).toEqual('rtl');
    });

    it('should process attributes and outputs properly together', () => {

      /** <div role="button" (change)="onChange()" myDir></div> */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          ΔelementStart(0, 'div', ['role', 'button', 'myDir', '']);
          { Δlistener('change', () => ctx.onChange()); }
          ΔelementEnd();
        }
      }, 1, 0, deps);

      const fixture = new ComponentFixture(App);
      let counter = 0;
      fixture.component.onChange = () => counter++;
      fixture.update();
      expect(fixture.html).toEqual(`<div mydir="" role="button"></div>`);
      expect(myDir !.role).toEqual('button');

      myDir !.changeStream.next();
      expect(counter).toEqual(1);
    });

    it('should process attributes properly for directives with later indices', () => {

      /**
       * <div role="button" dir="rtl" myDir></div>
       * <div role="listbox" myDirB></div>
       */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δelement(0, 'div', ['role', 'button', 'dir', 'rtl', 'myDir', '']);
          Δelement(1, 'div', ['role', 'listbox', 'myDirB', '']);
        }
      }, 2, 0, deps);

      const fixture = new ComponentFixture(App);
      expect(fixture.html)
          .toEqual(
              `<div dir="rtl" mydir="" role="button"></div><div mydirb="" role="listbox"></div>`);
      expect(myDir !.role).toEqual('button');
      expect(myDir !.direction).toEqual('rtl');
      expect(dirB !.roleB).toEqual('listbox');
    });

    it('should support attributes at same index inside an if-else block', () => {
      /**
       * <div role="listbox" myDir></div>          // initialInputs: [['role', 'listbox']]
       *
       * % if (condition) {
       *   <div role="button" myDirB></div>       // initialInputs: [['role', 'button']]
       * % } else {
       *   <div role="menu"></div>               // initialInputs: [null]
       * % }
       */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δelement(0, 'div', ['role', 'listbox', 'myDir', '']);
          Δcontainer(1);
        }
        if (rf & RenderFlags.Update) {
          ΔcontainerRefreshStart(1);
          {
            if (ctx.condition) {
              let rf1 = ΔembeddedViewStart(0, 1, 0);
              if (rf1 & RenderFlags.Create) {
                Δelement(0, 'div', ['role', 'button', 'myDirB', '']);
              }
              ΔembeddedViewEnd();
            } else {
              let rf2 = ΔembeddedViewStart(1, 1, 0);
              if (rf2 & RenderFlags.Create) {
                Δelement(0, 'div', ['role', 'menu']);
              }
              ΔembeddedViewEnd();
            }
          }
          ΔcontainerRefreshEnd();
        }
      }, 2, 0, deps);

      const fixture = new ComponentFixture(App);
      fixture.component.condition = true;
      fixture.update();
      expect(fixture.html)
          .toEqual(`<div mydir="" role="listbox"></div><div mydirb="" role="button"></div>`);
      expect(myDir !.role).toEqual('listbox');
      expect(dirB !.roleB).toEqual('button');
      expect((dirB !as any).role).toBeUndefined();

      fixture.component.condition = false;
      fixture.update();
      expect(fixture.html).toEqual(`<div mydir="" role="listbox"></div><div role="menu"></div>`);
      expect(myDir !.role).toEqual('listbox');
    });

    it('should process attributes properly inside a for loop', () => {

      class Comp {
        static ngComponentDef = ΔdefineComponent({
          type: Comp,
          selectors: [['comp']],
          consts: 3,
          vars: 1,
          /** <div role="button" dir #dir="myDir"></div> {{ dir.role }} */
          template: function(rf: RenderFlags, ctx: any) {
            if (rf & RenderFlags.Create) {
              Δelement(0, 'div', ['role', 'button', 'myDir', ''], ['dir', 'myDir']);
              Δtext(2);
            }
            if (rf & RenderFlags.Update) {
              const tmp = Δreference(1) as any;
              ΔtextBinding(2, Δbind(tmp.role));
            }
          },
          factory: () => new Comp(),
          directives: () => [MyDir]
        });
      }

      /**
       * % for (let i = 0; i < 3; i++) {
       *     <comp></comp>
       * % }
       */
      const App = createComponent('app', function(rf: RenderFlags, ctx: any) {
        if (rf & RenderFlags.Create) {
          Δcontainer(0);
        }
        if (rf & RenderFlags.Update) {
          ΔcontainerRefreshStart(0);
          {
            for (let i = 0; i < 2; i++) {
              let rf1 = ΔembeddedViewStart(0, 1, 0);
              if (rf1 & RenderFlags.Create) {
                Δelement(0, 'comp');
              }
              ΔembeddedViewEnd();
            }
          }
          ΔcontainerRefreshEnd();
        }
      }, 1, 0, [Comp]);

      const fixture = new ComponentFixture(App);
      expect(fixture.html)
          .toEqual(
              `<comp><div mydir="" role="button"></div>button</comp><comp><div mydir="" role="button"></div>button</comp>`);
    });

  });

});
