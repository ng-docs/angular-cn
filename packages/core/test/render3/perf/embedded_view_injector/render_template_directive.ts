/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector, TemplateRef, ViewContainerRef, ɵɵdefineDirective, ɵɵdirectiveInject} from '@angular/core';
import {injectViewContainerRef} from '@angular/core/src/linker/view_container_ref';


class ViewContainerRefToken {
  /**
   * @internal
   * @nocollapse
   */
  static __NG_ELEMENT_ID__(): ViewContainerRef {
    return injectViewContainerRef();
  }
}

/**
 * Creates a helper directive that renders out a template
 * reference that is passed in as an input.
 *
 * 创建一个帮助器指令，该指令呈现作为输入传入的模板引用。
 *
 */
export function createRenderTemplateDirective(injector: Injector|undefined) {
  return class RenderTemplate {
    static ɵfac() {
      return new RenderTemplate(ɵɵdirectiveInject(ViewContainerRefToken as any));
    }

    static ɵdir = ɵɵdefineDirective({
      type: RenderTemplate,
      selectors: [['', 'renderTemplate', '']],
      inputs: {template: ['renderTemplate', 'template']}
    });

    constructor(public viewContainerRef: ViewContainerRef) {}

    set template(template: TemplateRef<any>) {
      this.viewContainerRef.createEmbeddedView(template, undefined, {injector});
    }
  };
}
