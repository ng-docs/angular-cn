/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';

import {absoluteFrom} from '../../file_system';
import {runInEachFileSystem, TestFile} from '../../file_system/testing';
import {isNamedClassDeclaration, TypeScriptReflectionHost} from '../../reflection';
import {getDeclaration, makeProgram} from '../../testing';
import {TypeParameterEmitter} from '../src/type_parameter_emitter';

import {angularCoreDts} from './test_utils';


runInEachFileSystem(() => {
  describe('type parameter emitter', () => {
    function createEmitter(source: string, additionalFiles: TestFile[] = []) {
      const files: TestFile[] = [
        angularCoreDts(), {name: absoluteFrom('/main.ts'), contents: source}, ...additionalFiles
      ];
      const {program} = makeProgram(files, undefined, undefined, false);
      const checker = program.getTypeChecker();
      const reflector = new TypeScriptReflectionHost(checker);

      const TestClass =
          getDeclaration(program, absoluteFrom('/main.ts'), 'TestClass', isNamedClassDeclaration);

      return new TypeParameterEmitter(TestClass.typeParameters, reflector);
    }

    function emit(emitter: TypeParameterEmitter) {
      const canEmit = emitter.canEmit();
      const emitted = emitter.emit(ref => {
        const typeName = ts.createQualifiedName(ts.createIdentifier('test'), ref.debugName!);
        return ts.createTypeReferenceNode(typeName, /* typeArguments */ undefined);
      });

      if (emitted === undefined) {
        return canEmit ? '' : null;
      }

      if (!canEmit) {
        fail('canEmit must be true when emitting succeeds');
      }

      const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
      const sf = ts.createSourceFile('test.ts', '', ts.ScriptTarget.Latest);
      const generics =
          emitted.map(param => printer.printNode(ts.EmitHint.Unspecified, param, sf)).join(', ');

      return `<${generics}>`;
    }

    it('can emit for simple generic types', () => {
      expect(emit(createEmitter(`export class TestClass {}`))).toEqual('');
      expect(emit(createEmitter(`export class TestClass<T> {}`))).toEqual('<T>');
      expect(emit(createEmitter(`export class TestClass<T extends any> {}`)))
          .toEqual('<T extends any>');
      expect(emit(createEmitter(`export class TestClass<T extends unknown> {}`)))
          .toEqual('<T extends unknown>');
      expect(emit(createEmitter(`export class TestClass<T extends string> {}`)))
          .toEqual('<T extends string>');
      expect(emit(createEmitter(`export class TestClass<T extends number> {}`)))
          .toEqual('<T extends number>');
      expect(emit(createEmitter(`export class TestClass<T extends boolean> {}`)))
          .toEqual('<T extends boolean>');
      expect(emit(createEmitter(`export class TestClass<T extends object> {}`)))
          .toEqual('<T extends object>');
      expect(emit(createEmitter(`export class TestClass<T extends null> {}`)))
          .toEqual('<T extends null>');
      expect(emit(createEmitter(`export class TestClass<T extends undefined> {}`)))
          .toEqual('<T extends undefined>');
      expect(emit(createEmitter(`export class TestClass<T extends string[]> {}`)))
          .toEqual('<T extends string[]>');
      expect(emit(createEmitter(`export class TestClass<T extends [string, boolean]> {}`)))
          .toEqual('<T extends [\n    string,\n    boolean\n]>');
      expect(emit(createEmitter(`export class TestClass<T extends string | boolean> {}`)))
          .toEqual('<T extends string | boolean>');
      expect(emit(createEmitter(`export class TestClass<T extends string & boolean> {}`)))
          .toEqual('<T extends string & boolean>');
      expect(emit(createEmitter(`export class TestClass<T extends { [key: string]: boolean }> {}`)))
          .toEqual('<T extends {\n    [key: string]: boolean;\n}>');
    });

    it('can emit literal types', () => {
      expect(emit(createEmitter(`export class TestClass<T extends 'a"a'> {}`)))
          .toEqual(`<T extends "a\\"a">`);
      expect(emit(createEmitter(`export class TestClass<T extends "b\\\"b"> {}`)))
          .toEqual(`<T extends "b\\"b">`);
      expect(emit(createEmitter(`export class TestClass<T extends \`c\\\`c\`> {}`)))
          .toEqual(`<T extends \`c\\\`c\`>`);
      expect(emit(createEmitter(`export class TestClass<T extends -1> {}`)))
          .toEqual(`<T extends -1>`);
      expect(emit(createEmitter(`export class TestClass<T extends 1> {}`)))
          .toEqual(`<T extends 1>`);
      expect(emit(createEmitter(`export class TestClass<T extends 1n> {}`)))
          .toEqual(`<T extends 1n>`);
    });

    it('cannot emit import types', () => {
      const emitter = createEmitter(`export class TestClass<T extends import('module')> {}`);

      expect(emitter.canEmit()).toBe(false);
      expect(() => emit(emitter)).toThrowError('Unable to emit import type');
    });

    it('can emit references into external modules', () => {
      const emitter = createEmitter(`
          import {NgIterable} from '@angular/core';

          export class TestClass<T extends NgIterable<any>> {}`);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.NgIterable<any>>');
    });

    it('can emit references into external modules using qualified name', () => {
      const emitter = createEmitter(`
          import * as ng from '@angular/core';

          export class TestClass<T extends ng.NgIterable<any>> {}`);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.NgIterable<any>>');
    });

    it('can emit references to other type parameters', () => {
      const emitter = createEmitter(`
          import {NgIterable} from '@angular/core';

          export class TestClass<T, U extends NgIterable<T>> {}`);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T, U extends test.NgIterable<T>>');
    });

    it('can emit references to local, exported declarations', () => {
      const emitter = createEmitter(`
          class Local {};
          export {Local};
          export class TestClass<T extends Local> {}`);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.Local>');
    });

    it('cannot emit references to non-exported local declarations', () => {
      const emitter = createEmitter(`
          class Local {};
          export class TestClass<T extends Local> {}`);

      expect(emitter.canEmit()).toBe(false);
      expect(() => emit(emitter)).toThrowError('Unable to emit an unresolved reference');
    });

    it('cannot emit references to local declarations as nested type arguments', () => {
      const emitter = createEmitter(`
          import {NgIterable} from '@angular/core';

          class Local {};
          export class TestClass<T extends NgIterable<Local>> {}`);

      expect(emitter.canEmit()).toBe(false);
      expect(() => emit(emitter)).toThrowError('Unable to emit an unresolved reference');
    });

    it('can emit references into external modules within array types', () => {
      const emitter = createEmitter(`
          import {NgIterable} from '@angular/core';

          export class TestClass<T extends NgIterable[]> {}`);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.NgIterable[]>');
    });

    it('cannot emit references to local declarations within array types', () => {
      const emitter = createEmitter(`
          class Local {};
          export class TestClass<T extends Local[]> {}`);

      expect(emitter.canEmit()).toBe(false);
      expect(() => emit(emitter)).toThrowError('Unable to emit an unresolved reference');
    });

    it('can emit references into relative files', () => {
      const additionalFiles: TestFile[] = [{
        name: absoluteFrom('/internal.ts'),
        contents: `export class Internal {}`,
      }];
      const emitter = createEmitter(
          `
          import {Internal} from './internal';

          export class TestClass<T extends Internal> {}`,
          additionalFiles);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.Internal>');
    });

    it('can emit references to interfaces', () => {
      const additionalFiles: TestFile[] = [{
        name: absoluteFrom('/node_modules/types/index.d.ts'),
        contents: `export declare interface MyInterface {}`,
      }];
      const emitter = createEmitter(
          `
          import {MyInterface} from 'types';

          export class TestClass<T extends MyInterface> {}`,
          additionalFiles);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.MyInterface>');
    });

    it('can emit references to enums', () => {
      const additionalFiles: TestFile[] = [{
        name: absoluteFrom('/node_modules/types/index.d.ts'),
        contents: `export declare enum MyEnum {}`,
      }];
      const emitter = createEmitter(
          `
          import {MyEnum} from 'types';

          export class TestClass<T extends MyEnum> {}`,
          additionalFiles);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.MyEnum>');
    });

    it('can emit references to type aliases', () => {
      const additionalFiles: TestFile[] = [{
        name: absoluteFrom('/node_modules/types/index.d.ts'),
        contents: `export declare type MyType = string;`,
      }];
      const emitter = createEmitter(
          `
          import {MyType} from 'types';

          export class TestClass<T extends MyType> {}`,
          additionalFiles);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.MyType>');
    });

    it('transforms generic type parameter defaults', () => {
      const additionalFiles: TestFile[] = [{
        name: absoluteFrom('/node_modules/types/index.d.ts'),
        contents: `export declare type MyType = string;`,
      }];
      const emitter = createEmitter(
          `
          import {MyType} from 'types';

          export class TestClass<T extends MyType = MyType> {}`,
          additionalFiles);

      expect(emitter.canEmit()).toBe(true);
      expect(emit(emitter)).toEqual('<T extends test.MyType = test.MyType>');
    });

    it('cannot emit when a type parameter default cannot be emitted', () => {
      const emitter = createEmitter(`
          interface Local {}

          export class TestClass<T extends object = Local> {}`);

      expect(emitter.canEmit()).toBe(false);
      expect(() => emit(emitter)).toThrowError('Unable to emit an unresolved reference');
    });
  });
});
