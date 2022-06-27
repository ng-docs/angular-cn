/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ResourceLoader, SourceMap} from '@angular/compiler';
import {CompilerFacadeImpl} from '@angular/compiler/src/jit_compiler_facade';
import {JitEvaluator} from '@angular/compiler/src/output/output_jit';
import {escapeRegExp} from '@angular/compiler/src/util';
import {Attribute, Component, Directive, ErrorHandler} from '@angular/core';
import {CompilerFacade, ExportedCompilerFacade} from '@angular/core/src/compiler/compiler_facade';
import {resolveComponentResources} from '@angular/core/src/metadata/resource_loading';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {MockResourceLoader} from './resource_loader_mock';
import {extractSourceMap, originalPositionFor} from './source_map_util';

describe('jit source mapping', () => {
  let resourceLoader: MockResourceLoader;
  let jitEvaluator: MockJitEvaluator;

  beforeEach(() => {
    resourceLoader = new MockResourceLoader();
    jitEvaluator = new MockJitEvaluator();
    TestBed.configureCompiler({
      providers: [
        {
          provide: ResourceLoader,
          useValue: resourceLoader,
        },
        {
          provide: JitEvaluator,
          useValue: jitEvaluator,
        }
      ]
    });
  });

  describe('generated filenames and stack traces', () => {
    beforeEach(() => overrideCompilerFacade());
    afterEach(() => restoreCompilerFacade());

    describe('inline templates', () => {
      const ngUrl = 'ng:///MyComp/template.html';
      function templateDecorator(template: string) {
        return {template};
      }
      declareTests({ngUrl, templateDecorator});
    });

    describe('external templates', () => {
      const templateUrl = 'http://localhost:1234/some/url.html';
      const ngUrl = templateUrl;
      function templateDecorator(template: string) {
        resourceLoader.expect(templateUrl, template);
        return {templateUrl};
      }

      declareTests({ngUrl, templateDecorator});
    });

    function declareTests({ngUrl, templateDecorator}: TestConfig) {
      const generatedUrl = 'ng:///MyComp.js';

      it('should use the right source url in html parse errors', fakeAsync(() => {
           const template = '<div>\n  </error>';
           @Component({...templateDecorator(template)})
           class MyComp {
           }

           expect(() => {
             resolveCompileAndCreateComponent(MyComp, template);
           }).toThrowError(new RegExp(`${escapeRegExp(ngUrl)}@1:2`));
         }));

      it('should create a sourceMap for templates', fakeAsync(() => {
           const template = `Hello World!`;

           @Component({...templateDecorator(template)})
           class MyComp {
           }

           resolveCompileAndCreateComponent(MyComp, template);

           const sourceMap = jitEvaluator.getSourceMap(generatedUrl);
           expect(sourceMap.sources).toEqual([generatedUrl, ngUrl]);
           expect(sourceMap.sourcesContent).toEqual([' ', template]);
         }));


      it('should report source location for di errors', fakeAsync(() => {
           const template = `<div>\n    <div   someDir></div></div>`;

           @Component({...templateDecorator(template)})
           class MyComp {
           }

           @Directive({selector: '[someDir]'})
           class SomeDir {
             constructor() {
               throw new Error('Test');
             }
           }

           TestBed.configureTestingModule({declarations: [SomeDir]});
           let error: any;
           try {
             resolveCompileAndCreateComponent(MyComp, template);
           } catch (e) {
             error = e;
           }
           // The error should be logged from the element
           expect(jitEvaluator.getSourcePositionForStack(error.stack, generatedUrl)).toEqual({
             line: 2,
             column: 4,
             source: ngUrl,
           });
         }));

      it('should report di errors with multiple elements and directives', fakeAsync(() => {
           const template = `<div someDir></div>|<div someDir="throw"></div>`;

           @Component({...templateDecorator(template)})
           class MyComp {
           }

           @Directive({selector: '[someDir]'})
           class SomeDir {
             constructor(@Attribute('someDir') someDir: string) {
               if (someDir === 'throw') {
                 throw new Error('Test');
               }
             }
           }

           TestBed.configureTestingModule({declarations: [SomeDir]});
           let error: any;
           try {
             resolveCompileAndCreateComponent(MyComp, template);
           } catch (e) {
             error = e;
           }
           // The error should be logged from the 2nd-element
           expect(jitEvaluator.getSourcePositionForStack(error.stack, generatedUrl)).toEqual({
             line: 1,
             column: 20,
             source: ngUrl,
           });
         }));

      it('should report source location for binding errors', fakeAsync(() => {
           const template = `<div>\n    <span   [title]="createError()"></span></div>`;

           @Component({...templateDecorator(template)})
           class MyComp {
             createError() {
               throw new Error('Test');
             }
           }

           const comp = resolveCompileAndCreateComponent(MyComp, template);

           let error: any;
           try {
             comp.detectChanges();
           } catch (e) {
             error = e;
           }
           // the stack should point to the binding
           expect(jitEvaluator.getSourcePositionForStack(error.stack, generatedUrl)).toEqual({
             line: 2,
             column: 12,
             source: ngUrl,
           });
         }));

      it('should report source location for event errors', fakeAsync(() => {
           const template = `<div>\n    <span   (click)="createError()"></span></div>`;

           @Component({...templateDecorator(template)})
           class MyComp {
             createError() {
               throw new Error('Test');
             }
           }

           const comp = resolveCompileAndCreateComponent(MyComp, template);

           let error: any;
           const errorHandler = TestBed.inject(ErrorHandler);
           spyOn(errorHandler, 'handleError').and.callFake((e: any) => error = e);
           try {
             comp.debugElement.children[0].children[0].triggerEventHandler('click', 'EVENT');
           } catch (e) {
             error = e;
           }
           expect(error).toBeTruthy();
           // the stack should point to the binding
           expect(jitEvaluator.getSourcePositionForStack(error.stack, generatedUrl)).toEqual({
             line: 2,
             column: 21,
             source: ngUrl,
           });
         }));
    }
  });

  function compileAndCreateComponent(comType: any) {
    TestBed.configureTestingModule({declarations: [comType]});

    let error: any;
    TestBed.compileComponents().catch((e) => error = e);
    if (resourceLoader.hasPendingRequests()) {
      resourceLoader.flush();
    }
    tick();
    if (error) {
      throw error;
    }
    return TestBed.createComponent(comType);
  }

  function createResolver(contents: string) {
    return (_url: string) => Promise.resolve(contents);
  }

  function resolveCompileAndCreateComponent(comType: any, template: string) {
    resolveComponentResources(createResolver(template));
    return compileAndCreateComponent(comType);
  }

  let ɵcompilerFacade: CompilerFacade;
  function overrideCompilerFacade() {
    const ng: ExportedCompilerFacade = (global as any).ng;
    if (ng) {
      ɵcompilerFacade = ng.ɵcompilerFacade;
      ng.ɵcompilerFacade = new CompilerFacadeImpl(jitEvaluator);
    }
  }
  function restoreCompilerFacade() {
    if (ɵcompilerFacade) {
      const ng: ExportedCompilerFacade = (global as any).ng;
      ng.ɵcompilerFacade = ɵcompilerFacade;
    }
  }

  interface TestConfig {
    ngUrl: string;
    templateDecorator: (template: string) => {
      [key: string]: any
    };
  }

  interface SourcePos {
    source: string;
    line: number;
    column: number;
  }

  /**
   * A helper class that captures the sources that have been JIT compiled.
   */
  class MockJitEvaluator extends JitEvaluator {
    sources: string[] = [];

    override executeFunction(fn: Function, args: any[]) {
      // Capture the source that has been generated.
      this.sources.push(fn.toString());
      // Then execute it anyway.
      return super.executeFunction(fn, args);
    }

    /**
     * Get the source-map for a specified JIT compiled file.
     * @param genFile the URL of the file whose source-map we want.
     */
    getSourceMap(genFile: string): SourceMap {
      return this.sources.map(source => extractSourceMap(source))
          .find(map => !!(map && map.file === genFile))!;
    }

    getSourcePositionForStack(stack: string, genFile: string): SourcePos {
      const urlRegexp = new RegExp(`(${escapeRegExp(genFile)}):(\\d+):(\\d+)`);
      const pos = stack.split('\n')
                      .map(line => urlRegexp.exec(line))
                      .filter(match => !!match)
                      .map(match => ({
                             file: match![1],
                             line: parseInt(match![2], 10),
                             column: parseInt(match![3], 10)
                           }))
                      .shift();
      if (!pos) {
        throw new Error(`${genFile} was not mentioned in this stack:\n${stack}`);
      }
      const sourceMap = this.getSourceMap(pos.file);
      return originalPositionFor(sourceMap, pos);
    }
  }
});
