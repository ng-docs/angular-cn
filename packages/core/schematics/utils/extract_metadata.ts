/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {getAngularDecorators} from './ng_decorators';
import {unwrapExpression} from './typescript/functions';

/**
 * Interface describing metadata of an Angular class.
 *
 * 描述 Angular 类的元数据的接口。
 *
 */
export interface AngularClassMetadata {
  type: 'component'|'directive';
  node: ts.ObjectLiteralExpression;
}

/**
 * Extracts `@Directive` or `@Component` metadata from the given class.
 *
 * 从给定类中提取 `@Directive` 或 `@Component` 元数据。
 *
 */
export function extractAngularClassMetadata(
    typeChecker: ts.TypeChecker, node: ts.ClassDeclaration): AngularClassMetadata|null {
  const decorators = ts.getDecorators(node);

  if (!decorators || !decorators.length) {
    return null;
  }

  const ngDecorators = getAngularDecorators(typeChecker, decorators);
  const componentDecorator = ngDecorators.find(dec => dec.name === 'Component');
  const directiveDecorator = ngDecorators.find(dec => dec.name === 'Directive');
  const decorator = componentDecorator ?? directiveDecorator;

  // In case no decorator could be found on the current class, skip.
  if (!decorator) {
    return null;
  }

  const decoratorCall = decorator.node.expression;

  // In case the decorator call is not valid, skip this class declaration.
  if (decoratorCall.arguments.length !== 1) {
    return null;
  }

  const metadata = unwrapExpression(decoratorCall.arguments[0]);

  // Ensure that the metadata is an object literal expression.
  if (!ts.isObjectLiteralExpression(metadata)) {
    return null;
  }

  return {
    type: componentDecorator ? 'component' : 'directive',
    node: metadata,
  };
}
