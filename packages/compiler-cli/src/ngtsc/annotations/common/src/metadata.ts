/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Expression, FunctionExpr, LiteralArrayExpr, LiteralExpr, literalMap, R3ClassMetadata, ReturnStatement, WrappedNodeExpr} from '@angular/compiler';
import ts from 'typescript';

import {CtorParameter, DeclarationNode, Decorator, ReflectionHost, TypeValueReferenceKind} from '../../../reflection';

import {valueReferenceToExpression, wrapFunctionExpressionsInParens} from './util';

/**
 * Given a class declaration, generate a call to `setClassMetadata` with the Angular metadata
 * present on the class or its member fields. An ngDevMode guard is used to allow the call to be
 * tree-shaken away, as the `setClassMetadata` invocation is only needed for testing purposes.
 *
 * 给定一个类声明，使用类或其成员字段上的 Angular 元数据生成对 `setClassMetadata` 的调用。 ngDevMode
 * 保护用于允许对调用进行树形摇动，因为 `setClassMetadata` 调用仅用于测试目的。
 *
 * If no such metadata is present, this function returns `null`. Otherwise, the call is returned
 * as a `Statement` for inclusion along with the class.
 *
 * 如果不存在这样的元数据，则此函数返回 `null` 。否则，调用将作为 `Statement` 返回，以与类一起包含。
 *
 */
export function extractClassMetadata(
    clazz: DeclarationNode, reflection: ReflectionHost, isCore: boolean,
    annotateForClosureCompiler?: boolean,
    angularDecoratorTransform: (dec: Decorator) => Decorator = dec => dec): R3ClassMetadata|null {
  if (!reflection.isClass(clazz)) {
    return null;
  }
  const id = reflection.getAdjacentNameOfClass(clazz);

  // Reflect over the class decorators. If none are present, or those that are aren't from
  // Angular, then return null. Otherwise, turn them into metadata.
  const classDecorators = reflection.getDecoratorsOfDeclaration(clazz);
  if (classDecorators === null) {
    return null;
  }
  const ngClassDecorators =
      classDecorators.filter(dec => isAngularDecorator(dec, isCore))
          .map(
              decorator => decoratorToMetadata(
                  angularDecoratorTransform(decorator), annotateForClosureCompiler))
          // Since the `setClassMetadata` call is intended to be emitted after the class
          // declaration, we have to strip references to the existing identifiers or
          // TypeScript might generate invalid code when it emits to JS. In particular
          // this can break when emitting a class to ES5 which has a custom decorator
          // and is referenced inside of its own metadata (see #39509 for more information).
          .map(decorator => removeIdentifierReferences(decorator, id.text));
  if (ngClassDecorators.length === 0) {
    return null;
  }
  const metaDecorators =
      new WrappedNodeExpr(ts.factory.createArrayLiteralExpression(ngClassDecorators));

  // Convert the constructor parameters to metadata, passing null if none are present.
  let metaCtorParameters: Expression|null = null;
  const classCtorParameters = reflection.getConstructorParameters(clazz);
  if (classCtorParameters !== null) {
    const ctorParameters = classCtorParameters.map(param => ctorParameterToMetadata(param, isCore));
    metaCtorParameters = new FunctionExpr([], [
      new ReturnStatement(new LiteralArrayExpr(ctorParameters)),
    ]);
  }

  // Do the same for property decorators.
  let metaPropDecorators: Expression|null = null;
  const classMembers = reflection.getMembersOfClass(clazz).filter(
      member => !member.isStatic && member.decorators !== null && member.decorators.length > 0);
  const duplicateDecoratedMemberNames =
      classMembers.map(member => member.name).filter((name, i, arr) => arr.indexOf(name) < i);
  if (duplicateDecoratedMemberNames.length > 0) {
    // This should theoretically never happen, because the only way to have duplicate instance
    // member names is getter/setter pairs and decorators cannot appear in both a getter and the
    // corresponding setter.
    throw new Error(
        `Duplicate decorated properties found on class '${clazz.name.text}': ` +
        duplicateDecoratedMemberNames.join(', '));
  }
  const decoratedMembers = classMembers.map(
      member => classMemberToMetadata(member.nameNode ?? member.name, member.decorators!, isCore));
  if (decoratedMembers.length > 0) {
    metaPropDecorators =
        new WrappedNodeExpr(ts.factory.createObjectLiteralExpression(decoratedMembers));
  }

  return {
    type: new WrappedNodeExpr(id),
    decorators: metaDecorators,
    ctorParameters: metaCtorParameters,
    propDecorators: metaPropDecorators,
  };
}

/**
 * Convert a reflected constructor parameter to metadata.
 *
 * 将反射的构造函数参数转换为元数据。
 *
 */
function ctorParameterToMetadata(param: CtorParameter, isCore: boolean): Expression {
  // Parameters sometimes have a type that can be referenced. If so, then use it, otherwise
  // its type is undefined.
  const type = param.typeValueReference.kind !== TypeValueReferenceKind.UNAVAILABLE ?
      valueReferenceToExpression(param.typeValueReference) :
      new LiteralExpr(undefined);

  const mapEntries: {key: string, value: Expression, quoted: false}[] = [
    {key: 'type', value: type, quoted: false},
  ];

  // If the parameter has decorators, include the ones from Angular.
  if (param.decorators !== null) {
    const ngDecorators = param.decorators.filter(dec => isAngularDecorator(dec, isCore))
                             .map((decorator: Decorator) => decoratorToMetadata(decorator));
    const value = new WrappedNodeExpr(ts.factory.createArrayLiteralExpression(ngDecorators));
    mapEntries.push({key: 'decorators', value, quoted: false});
  }
  return literalMap(mapEntries);
}

/**
 * Convert a reflected class member to metadata.
 *
 * 将反射的类成员转换为元数据。
 *
 */
function classMemberToMetadata(
    name: ts.PropertyName|string, decorators: Decorator[], isCore: boolean): ts.PropertyAssignment {
  const ngDecorators = decorators.filter(dec => isAngularDecorator(dec, isCore))
                           .map((decorator: Decorator) => decoratorToMetadata(decorator));
  const decoratorMeta = ts.factory.createArrayLiteralExpression(ngDecorators);
  return ts.factory.createPropertyAssignment(name, decoratorMeta);
}

/**
 * Convert a reflected decorator to metadata.
 *
 * 将反射装饰器转换为元数据。
 *
 */
function decoratorToMetadata(
    decorator: Decorator, wrapFunctionsInParens?: boolean): ts.ObjectLiteralExpression {
  if (decorator.identifier === null) {
    throw new Error('Illegal state: synthesized decorator cannot be emitted in class metadata.');
  }
  // Decorators have a type.
  const properties: ts.ObjectLiteralElementLike[] = [
    ts.factory.createPropertyAssignment('type', ts.getMutableClone(decorator.identifier)),
  ];
  // Sometimes they have arguments.
  if (decorator.args !== null && decorator.args.length > 0) {
    const args = decorator.args.map(arg => {
      const expr = ts.getMutableClone(arg);
      return wrapFunctionsInParens ? wrapFunctionExpressionsInParens(expr) : expr;
    });
    properties.push(
        ts.factory.createPropertyAssignment('args', ts.factory.createArrayLiteralExpression(args)));
  }
  return ts.factory.createObjectLiteralExpression(properties, true);
}

/**
 * Whether a given decorator should be treated as an Angular decorator.
 *
 * 给定的装饰器是否应该被视为 Angular 装饰器。
 *
 * Either it's used in @angular/core, or it's imported from there.
 *
 * 它可以在 @angular/core 中使用，或者是从那里导入的。
 *
 */
function isAngularDecorator(decorator: Decorator, isCore: boolean): boolean {
  return isCore || (decorator.import !== null && decorator.import.from === '@angular/core');
}

/**
 * Recursively recreates all of the `Identifier` descendant nodes with a particular name inside
 * of an AST node, thus removing any references to them. Useful if a particular node has to be
 * taken from one place any emitted to another one exactly as it has been written.
 *
 * 递归地重新创建 AST 节点中具有特定名称的所有 `Identifier`
 * 后代节点，从而删除对它们的任何引用。如果必须从一个地方获取特定节点，则可能会完全按照写入的方式将其发送到另一个地方。
 *
 */
function removeIdentifierReferences<T extends ts.Node>(node: T, name: string): T {
  const result = ts.transform(
      node, [context => root => ts.visitNode(root, function walk(current: ts.Node): ts.Node {
        return ts.isIdentifier(current) && current.text === name ?
            ts.factory.createIdentifier(current.text) :
            ts.visitEachChild(current, walk, context);
      })]);

  return result.transformed[0];
}
