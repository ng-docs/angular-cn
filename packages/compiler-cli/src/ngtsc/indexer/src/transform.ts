/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseSourceFile} from '@angular/compiler';

import {DeclarationNode} from '../../reflection';

import {IndexedComponent} from './api';
import {IndexingContext} from './context';
import {getTemplateIdentifiers} from './template';

/**
 * Generates `IndexedComponent` entries from a `IndexingContext`, which has information
 * about components discovered in the program registered in it.
 *
 * 从 `IndexingContext` 生成 `IndexedComponent`
 * 条目，该条目具有有关在其中注册的程序中找到的组件的信息。
 *
 * The context must be populated before `generateAnalysis` is called.
 *
 * 必须在调用 `generateAnalysis` 之前填充上下文。
 *
 */
export function generateAnalysis(context: IndexingContext): Map<DeclarationNode, IndexedComponent> {
  const analysis = new Map<DeclarationNode, IndexedComponent>();

  context.components.forEach(({declaration, selector, boundTemplate, templateMeta}) => {
    const name = declaration.name.getText();

    const usedComponents = new Set<DeclarationNode>();
    const usedDirs = boundTemplate.getUsedDirectives();
    usedDirs.forEach(dir => {
      if (dir.isComponent) {
        usedComponents.add(dir.ref.node);
      }
    });

    // Get source files for the component and the template. If the template is inline, its source
    // file is the component's.
    const componentFile = new ParseSourceFile(
        declaration.getSourceFile().getFullText(), declaration.getSourceFile().fileName);
    let templateFile: ParseSourceFile;
    if (templateMeta.isInline) {
      templateFile = componentFile;
    } else {
      templateFile = templateMeta.file;
    }

    const {identifiers, errors} = getTemplateIdentifiers(boundTemplate);
    analysis.set(declaration, {
      name,
      selector,
      file: componentFile,
      template: {
        identifiers,
        usedComponents,
        isInline: templateMeta.isInline,
        file: templateFile,
      },
      errors,
    });
  });

  return analysis;
}
