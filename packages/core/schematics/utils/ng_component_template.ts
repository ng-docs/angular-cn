/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Tree} from '@angular-devkit/schematics';
import {dirname, relative, resolve} from 'path';
import ts from 'typescript';

import {computeLineStartsMap, getLineAndCharacterFromPosition} from './line_mappings';
import {getAngularDecorators} from './ng_decorators';
import {unwrapExpression} from './typescript/functions';
import {getPropertyNameText} from './typescript/property_name';

export interface ResolvedTemplate {
  /**
   * Class declaration that contains this template.
   *
   * 包含此模板的类声明。
   *
   */
  container: ts.ClassDeclaration;
  /**
   * File content of the given template.
   *
   * 给定模板的文件内容。
   *
   */
  content: string;
  /**
   * Start offset of the template content (e.g. in the inline source file)
   *
   * 模板内容的开始偏移量（例如在内联源文件中）
   *
   */
  start: number;
  /**
   * Whether the given template is inline or not.
   *
   * 给定的模板是否是内联的。
   *
   */
  inline: boolean;
  /**
   * Path to the file that contains this template.
   *
   * 包含此模板的文件的路径。
   *
   */
  filePath: string;
  /**
   * Gets the character and line of a given position index in the template.
   * If the template is declared inline within a TypeScript source file, the line and
   * character are based on the full source file content.
   *
   * 获取模板中给定位置索引的字符和行。如果模板是在 TypeScript
   * 源文件中内联声明的，则该行和字符将基于完整的源文件内容。
   *
   */
  getCharacterAndLineOfPosition: (pos: number) => {
    character: number, line: number
  };
}

/**
 * Visitor that can be used to determine Angular templates referenced within given
 * TypeScript source files (inline templates or external referenced templates)
 *
 * 可用于确定给定 TypeScript 源文件中引用的 Angular 模板（内联模板或外部引用模板）的访问器
 *
 */
export class NgComponentTemplateVisitor {
  resolvedTemplates: ResolvedTemplate[] = [];

  constructor(public typeChecker: ts.TypeChecker, private _basePath: string, private _tree: Tree) {}

  visitNode(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      this.visitClassDeclaration(node as ts.ClassDeclaration);
    }

    ts.forEachChild(node, n => this.visitNode(n));
  }

  private visitClassDeclaration(node: ts.ClassDeclaration) {
    // TODO(crisbeto): in TS 4.8 the `decorators` are combined with the `modifiers` array.
    // Once we drop support for older versions, we can rely exclusively on `getDecorators`.
    const decorators = (ts as any).getDecorators?.(node) || node.decorators;

    if (!decorators || !decorators.length) {
      return;
    }

    const ngDecorators = getAngularDecorators(this.typeChecker, decorators);
    const componentDecorator = ngDecorators.find(dec => dec.name === 'Component');

    // In case no "@Component" decorator could be found on the current class, skip.
    if (!componentDecorator) {
      return;
    }

    const decoratorCall = componentDecorator.node.expression;

    // In case the component decorator call is not valid, skip this class declaration.
    if (decoratorCall.arguments.length !== 1) {
      return;
    }

    const componentMetadata = unwrapExpression(decoratorCall.arguments[0]);

    // Ensure that the component metadata is an object literal expression.
    if (!ts.isObjectLiteralExpression(componentMetadata)) {
      return;
    }

    const sourceFile = node.getSourceFile();
    const sourceFileName = sourceFile.fileName;

    // Walk through all component metadata properties and determine the referenced
    // HTML templates (either external or inline)
    componentMetadata.properties.forEach(property => {
      if (!ts.isPropertyAssignment(property)) {
        return;
      }

      const propertyName = getPropertyNameText(property.name);

      // In case there is an inline template specified, ensure that the value is statically
      // analyzable by checking if the initializer is a string literal-like node.
      if (propertyName === 'template' && ts.isStringLiteralLike(property.initializer)) {
        // Need to add an offset of one to the start because the template quotes are
        // not part of the template content.
        // The `getText()` method gives us the original raw text.
        // We could have used the `text` property, but if the template is defined as a backtick
        // string then the `text` property contains a "cooked" version of the string. Such cooked
        // strings will have converted CRLF characters to only LF. This messes up string
        // replacements in template migrations.
        // The raw text returned by `getText()` includes the enclosing quotes so we change the
        // `content` and `start` values accordingly.
        const content = property.initializer.getText().slice(1, -1);
        const start = property.initializer.getStart() + 1;
        this.resolvedTemplates.push({
          filePath: sourceFileName,
          container: node,
          content,
          inline: true,
          start: start,
          getCharacterAndLineOfPosition: pos =>
              ts.getLineAndCharacterOfPosition(sourceFile, pos + start)
        });
      }
      if (propertyName === 'templateUrl' && ts.isStringLiteralLike(property.initializer)) {
        const templateDiskPath = resolve(dirname(sourceFileName), property.initializer.text);
        // TODO(devversion): Remove this when the TypeScript compiler host is fully virtual
        // relying on the devkit virtual tree and not dealing with disk paths. This is blocked on
        // providing common utilities for schematics/migrations, given this is done in the
        // Angular CDK already:
        // https://github.com/angular/components/blob/3704400ee67e0190c9783e16367587489c803ebc/src/cdk/schematics/update-tool/utils/virtual-host.ts.
        const templateDevkitPath = relative(this._basePath, templateDiskPath);

        // In case the template does not exist in the file system, skip this
        // external template.
        if (!this._tree.exists(templateDevkitPath)) {
          return;
        }

        const fileContent = this._tree.read(templateDevkitPath)!.toString();
        const lineStartsMap = computeLineStartsMap(fileContent);

        this.resolvedTemplates.push({
          filePath: templateDiskPath,
          container: node,
          content: fileContent,
          inline: false,
          start: 0,
          getCharacterAndLineOfPosition: pos => getLineAndCharacterFromPosition(lineStartsMap, pos),
        });
      }
    });
  }
}
