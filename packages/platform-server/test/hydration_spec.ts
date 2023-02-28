/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {APP_ID, ApplicationRef, Component, ComponentRef, destroyPlatform, getPlatform, inject, Provider, TemplateRef, Type, ViewChild, ɵprovideHydrationSupport as provideHydrationSupport, ɵsetDocument} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {bootstrapApplication} from '@angular/platform-browser';

import {renderApplication} from '../src/utils';

/**
 * The name of the attribute that contains a slot index
 * inside the TransferState storage where hydration info
 * could be found.
 */
const NGH_ATTR_NAME = 'ngh';

const NGH_ATTR_REGEXP = new RegExp(` ${NGH_ATTR_NAME}=".*?"`, 'g');

/**
 * Drop utility attributes such as `ng-version`, `ng-server-context` and `ngh`,
 * so that it's easier to make assertions in tests.
 */
function stripUtilAttributes(html: string, keepNgh: boolean): string {
  html = html.replace(/ ng-version=".*?"/g, '')  //
             .replace(/ ng-server-context=".*?"/g, '');
  if (!keepNgh) {
    html = html.replace(NGH_ATTR_REGEXP, '');
  }
  return html;
}

function getComponentRef<T>(appRef: ApplicationRef): ComponentRef<T> {
  return appRef.components[0];
}

/**
 * Extracts a portion of HTML located inside of the `<body>` element.
 * This content belongs to the application view (and supporting TransferState
 * scripts) rendered on the server.
 */
function getAppContents(html: string): string {
  const result = stripUtilAttributes(html, true).match(/<body>(.*?)<\/body>/s);
  if (!result) {
    throw new Error('Invalid HTML structure is provided.');
  }
  return result[1];
}

/**
 * Converts a static HTML to a DOM structure.
 *
 * @param html the rendered html in test
 * @param doc the document object
 * @returns a div element containing a copy of the app contents
 */
function convertHtmlToDom(html: string, doc: Document): HTMLElement {
  const contents = getAppContents(html);
  const container = doc.createElement('div');
  container.innerHTML = contents;
  return container;
}

describe('platform-server integration', () => {
  beforeEach(() => {
    if (getPlatform()) destroyPlatform();
  });

  afterAll(() => destroyPlatform());

  describe('hydration', () => {
    const appId = 'simple-cmp';

    let doc: Document;

    beforeEach(() => {
      doc = TestBed.inject(DOCUMENT);
    });

    afterEach(() => {
      doc.body.textContent = '';
    });

    /**
     * This renders the application with server side rendering logic.
     *
     * @param component the test component to be rendered
     * @param doc the document
     * @param envProviders the environment providers
     * @returns a promise containing the server rendered app as a string
     */
    async function ssr(
        component: Type<unknown>, doc?: string, envProviders?: Provider[]): Promise<string> {
      const defaultHtml = '<html><head></head><body><app></app></body></html>';
      const providers = [
        ...(envProviders ?? []),
        {provide: APP_ID, useValue: appId},
        provideHydrationSupport(),
      ];
      return renderApplication(component, {
        document: doc ?? defaultHtml,
        appId,
        providers,
      });
    }

    /**
     * This bootstraps an application with existing html and enables hydration support
     * causing hydration to be invoked.
     *
     * @param html the server side rendered DOM string to be hydrated
     * @param component the root component
     * @param envProviders the environment providers
     * @returns a promise with the application ref
     */
    async function hydrate(html: string, component: Type<unknown>, envProviders?: Provider[]):
        Promise<ApplicationRef> {
      // Destroy existing platform, a new one will be created later by the `bootstrapApplication`.
      destroyPlatform();

      // Get HTML contents of the `<app>`, create a DOM element and append it into the body.
      const container = convertHtmlToDom(html, doc);
      Array.from(container.children).forEach(node => doc.body.appendChild(node));

      function _document(): any {
        ɵsetDocument(doc);
        global.document = doc;  // needed for `DefaultDomRenderer2`
        return doc;
      }

      const providers = [
        ...(envProviders ?? []),
        {provide: APP_ID, useValue: appId},
        {provide: DOCUMENT, useFactory: _document, deps: []},
        provideHydrationSupport(),
      ];
      return bootstrapApplication(component, {providers});
    }

    describe('annotations', () => {
      it('should add hydration annotations to component host nodes during ssr', async () => {
        @Component({
          standalone: true,
          selector: 'nested',
          template: 'This is a nested component.',
        })
        class NestedComponent {
        }

        @Component({
          standalone: true,
          selector: 'app',
          imports: [NestedComponent],
          template: `
            <nested />
          `,
        })
        class SimpleComponent {
        }

        const html = await ssr(SimpleComponent);
        const ssrContents = getAppContents(html);

        expect(ssrContents).toContain(`<app ${NGH_ATTR_NAME}`);
        expect(ssrContents).toContain(`<nested ${NGH_ATTR_NAME}`);
      });

      it('should skip local ref slots while producing hydration annotations', async () => {
        @Component({
          standalone: true,
          selector: 'nested',
          template: 'This is a nested component.',
        })
        class NestedComponent {
        }

        @Component({
          standalone: true,
          selector: 'app',
          imports: [NestedComponent],
          template: `
            <div #localRef></div>
            <nested />
          `,
        })
        class SimpleComponent {
        }

        const html = await ssr(SimpleComponent);
        const ssrContents = getAppContents(html);

        expect(ssrContents).toContain(`<app ${NGH_ATTR_NAME}`);
        expect(ssrContents).toContain(`<nested ${NGH_ATTR_NAME}`);
      });

      it('should skip embedded views from an ApplicationRef during annotation', async () => {
        @Component({
          standalone: true,
          selector: 'app',
          template: `
            <ng-template #tmpl>Hi!</ng-template>
          `,
        })
        class SimpleComponent {
          @ViewChild('tmpl', {read: TemplateRef}) tmplRef!: TemplateRef<unknown>;
          private appRef = inject(ApplicationRef);

          ngAfterViewInit() {
            const viewRef = this.tmplRef.createEmbeddedView({});
            this.appRef.attachView(viewRef);
          }
        }

        const html = await ssr(SimpleComponent);
        const ssrContents = getAppContents(html);

        expect(ssrContents).toContain(`<app ${NGH_ATTR_NAME}`);
      });
    });

    describe('server rendering', () => {
      it('should wipe out existing host element content when server side rendering', async () => {
        @Component({
          standalone: true,
          selector: 'app',
          template: `
            <div>Some content</div>
          `,
        })
        class SimpleComponent {
        }

        const extraChildNodes = '<!--comment--> Some text! <b>and a tag</b>';
        const doc = `<html><head></head><body><app>${extraChildNodes}</app></body></html>`;
        const html = await ssr(SimpleComponent, doc);
        const ssrContents = getAppContents(html);

        // We expect that the existing content of the host node is fully removed.
        expect(ssrContents).not.toContain(extraChildNodes);
        expect(ssrContents).toContain('<app ngh="0"><div>Some content</div></app>');
      });
    });

    describe('hydration', () => {
      it('should remove ngh attributes after hydation on the client', async () => {
        @Component({
          standalone: true,
          selector: 'app',
          template: 'Hi!',
        })
        class SimpleComponent {
        }

        const html = await ssr(SimpleComponent);
        const ssrContents = getAppContents(html);

        expect(ssrContents).toContain(`<app ${NGH_ATTR_NAME}`);

        const appRef = await hydrate(html, SimpleComponent);
        const compRef = getComponentRef<SimpleComponent>(appRef);
        appRef.tick();

        const appHostNode = compRef.location.nativeElement;
        expect(appHostNode.getAttribute(NGH_ATTR_NAME)).toBeNull();
      });
    });
  });
});
