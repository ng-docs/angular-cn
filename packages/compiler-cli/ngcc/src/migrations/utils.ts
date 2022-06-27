/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {Reference} from '../../../src/ngtsc/imports';
import {ClassDeclaration, Decorator, isNamedClassDeclaration, isNamedFunctionDeclaration, isNamedVariableDeclaration} from '../../../src/ngtsc/reflection';

import {MigrationHost} from './migration';

export function isClassDeclaration(clazz: ts.Node): clazz is ClassDeclaration<ts.Declaration> {
  return isNamedClassDeclaration(clazz) || isNamedFunctionDeclaration(clazz) ||
      isNamedVariableDeclaration(clazz);
}

/**
 * Returns true if the `clazz` is decorated as a `Directive` or `Component`.
 *
 * 如果 `clazz` 被装饰为 `Directive` 或 `Component` ，则返回 true 。
 *
 */
export function hasDirectiveDecorator(host: MigrationHost, clazz: ClassDeclaration): boolean {
  const ref = new Reference(clazz);
  return host.metadata.getDirectiveMetadata(ref) !== null;
}

/**
 * Returns true if the `clazz` is decorated as a `Pipe`.
 *
 * 如果 `clazz` 被装饰为 `Pipe` ，则返回 true 。
 *
 */
export function hasPipeDecorator(host: MigrationHost, clazz: ClassDeclaration): boolean {
  const ref = new Reference(clazz);
  return host.metadata.getPipeMetadata(ref) !== null;
}

/**
 * Returns true if the `clazz` has its own constructor function.
 *
 * 如果 `clazz` 有自己的构造函数，则返回 true。
 *
 */
export function hasConstructor(host: MigrationHost, clazz: ClassDeclaration): boolean {
  return host.reflectionHost.getConstructorParameters(clazz) !== null;
}

/**
 * Create an empty `Directive` decorator that will be associated with the `clazz`.
 *
 * 创建一个将与 `clazz` 关联的空 `Directive` 装饰器。
 *
 */
export function createDirectiveDecorator(
    clazz: ClassDeclaration,
    metadata?: {selector: string|null, exportAs: string[]|null}): Decorator {
  const args: ts.Expression[] = [];
  if (metadata !== undefined) {
    const metaArgs: ts.PropertyAssignment[] = [];
    if (metadata.selector !== null) {
      metaArgs.push(property('selector', metadata.selector));
    }
    if (metadata.exportAs !== null) {
      metaArgs.push(property('exportAs', metadata.exportAs.join(', ')));
    }
    args.push(reifySourceFile(ts.factory.createObjectLiteralExpression(metaArgs)));
  }
  return {
    name: 'Directive',
    identifier: null,
    import: {name: 'Directive', from: '@angular/core'},
    node: null,
    synthesizedFor: clazz.name,
    args,
  };
}

/**
 * Create an empty `Component` decorator that will be associated with the `clazz`.
 *
 * 创建一个将与 `clazz` 关联的空 `Component` 装饰器。
 *
 */
export function createComponentDecorator(
    clazz: ClassDeclaration,
    metadata: {selector: string|null, exportAs: string[]|null}): Decorator {
  const metaArgs: ts.PropertyAssignment[] = [
    property('template', ''),
  ];
  if (metadata.selector !== null) {
    metaArgs.push(property('selector', metadata.selector));
  }
  if (metadata.exportAs !== null) {
    metaArgs.push(property('exportAs', metadata.exportAs.join(', ')));
  }
  return {
    name: 'Component',
    identifier: null,
    import: {name: 'Component', from: '@angular/core'},
    node: null,
    synthesizedFor: clazz.name,
    args: [
      reifySourceFile(ts.factory.createObjectLiteralExpression(metaArgs)),
    ],
  };
}

/**
 * Create an empty `Injectable` decorator that will be associated with the `clazz`.
 *
 * 创建一个将与 `clazz` 关联的空 `Injectable` 装饰器。
 *
 */
export function createInjectableDecorator(clazz: ClassDeclaration): Decorator {
  return {
    name: 'Injectable',
    identifier: null,
    import: {name: 'Injectable', from: '@angular/core'},
    node: null,
    synthesizedFor: clazz.name,
    args: [],
  };
}

function property(name: string, value: string): ts.PropertyAssignment {
  return ts.factory.createPropertyAssignment(name, ts.factory.createStringLiteral(value));
}

const EMPTY_SF = ts.createSourceFile('(empty)', '', ts.ScriptTarget.Latest);

/**
 * Takes a `ts.Expression` and returns the same `ts.Expression`, but with an associated
 * `ts.SourceFile`.
 *
 * 接受 `ts.Expression` 并返回相同的 `ts.Expression` ，但具有关联的 `ts.SourceFile` 。
 *
 * This transformation is necessary to use synthetic `ts.Expression`s with the `PartialEvaluator`,
 * and many decorator arguments are interpreted in this way.
 *
 * 要将合成 `ts.Expression` 与 `PartialEvaluator`
 * 一起使用，这种转换是必要的，并且许多装饰器参数都是以这种方式解释的。
 *
 */
function reifySourceFile(expr: ts.Expression): ts.Expression {
  const printer = ts.createPrinter();
  const exprText = printer.printNode(ts.EmitHint.Unspecified, expr, EMPTY_SF);
  const sf = ts.createSourceFile(
      '(synthetic)', `const expr = ${exprText};`, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const stmt = sf.statements[0];
  if (!ts.isVariableStatement(stmt)) {
    throw new Error(`Expected VariableStatement, got ${ts.SyntaxKind[stmt.kind]}`);
  }
  return stmt.declarationList.declarations[0].initializer!;
}
