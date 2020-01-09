/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';

import {absoluteFrom, getSourceFileOrError} from '../../file_system';
import {runInEachFileSystem} from '../../file_system/testing';
import {Reference} from '../../imports';
import {DependencyTracker} from '../../incremental/api';
import {FunctionDefinition, TsHelperFn, TypeScriptReflectionHost} from '../../reflection';
import {getDeclaration, makeProgram} from '../../testing';
import {DynamicValue} from '../src/dynamic';
import {PartialEvaluator} from '../src/interface';
import {EnumValue} from '../src/result';

import {evaluate, firstArgFfr, makeEvaluator, makeExpression, owningModuleOf} from './utils';

runInEachFileSystem(() => {
  describe('ngtsc metadata', () => {
    let _: typeof absoluteFrom;
    beforeEach(() => _ = absoluteFrom);

    it('reads a file correctly', () => {
      const value = evaluate(
          `
        import {Y} from './other';
        const A = Y;
    `,
          'A', [
            {
              name: _('/other.ts'),
              contents: `
      export const Y = 'test';
      `
            },
          ]);

      expect(value).toEqual('test');
    });

    it('map access works',
       () => { expect(evaluate('const obj = {a: "test"};', 'obj.a')).toEqual('test'); });

    it('resolves undefined property access',
       () => { expect(evaluate('const obj: any = {}', 'obj.bar')).toEqual(undefined); });

    it('function calls work', () => {
      expect(evaluate(`function foo(bar) { return bar; }`, 'foo("test")')).toEqual('test');
    });

    it('function call default value works', () => {
      expect(evaluate(`function foo(bar = 1) { return bar; }`, 'foo()')).toEqual(1);
      expect(evaluate(`function foo(bar = 1) { return bar; }`, 'foo(2)')).toEqual(2);
      expect(evaluate(`function foo(a, c = a) { return c; }; const a = 1;`, 'foo(2)')).toEqual(2);
    });

    it('function call spread works', () => {
      expect(evaluate(`function foo(a, ...b) { return [a, b]; }`, 'foo(1, ...[2, 3])')).toEqual([
        1, [2, 3]
      ]);
    });

    it('conditionals work', () => {
      expect(evaluate(`const x = false; const y = x ? 'true' : 'false';`, 'y')).toEqual('false');
    });

    it('addition works', () => { expect(evaluate(`const x = 1 + 2;`, 'x')).toEqual(3); });

    it('static property on class works', () => {
      expect(evaluate(`class Foo { static bar = 'test'; }`, 'Foo.bar')).toEqual('test');
    });

    it('static property call works', () => {
      expect(evaluate(`class Foo { static bar(test) { return test; } }`, 'Foo.bar("test")'))
          .toEqual('test');
    });

    it('indirected static property call works', () => {
      expect(
          evaluate(
              `class Foo { static bar(test) { return test; } }; const fn = Foo.bar;`, 'fn("test")'))
          .toEqual('test');
    });

    it('array works', () => {
      expect(evaluate(`const x = 'test'; const y = [1, x, 2];`, 'y')).toEqual([1, 'test', 2]);
    });

    it('array spread works', () => {
      expect(evaluate(`const a = [1, 2]; const b = [4, 5]; const c = [...a, 3, ...b];`, 'c'))
          .toEqual([1, 2, 3, 4, 5]);
    });

    it('&& operations work', () => {
      expect(evaluate(`const a = 'hello', b = 'world';`, 'a && b')).toEqual('world');
      expect(evaluate(`const a = false, b = 'world';`, 'a && b')).toEqual(false);
      expect(evaluate(`const a = 'hello', b = 0;`, 'a && b')).toEqual(0);
    });

    it('|| operations work', () => {
      expect(evaluate(`const a = 'hello', b = 'world';`, 'a || b')).toEqual('hello');
      expect(evaluate(`const a = false, b = 'world';`, 'a || b')).toEqual('world');
      expect(evaluate(`const a = 'hello', b = 0;`, 'a || b')).toEqual('hello');
    });

    it('evaluates arithmetic operators', () => {
      expect(evaluate('const a = 6, b = 3;', 'a + b')).toEqual(9);
      expect(evaluate('const a = 6, b = 3;', 'a - b')).toEqual(3);
      expect(evaluate('const a = 6, b = 3;', 'a * b')).toEqual(18);
      expect(evaluate('const a = 6, b = 3;', 'a / b')).toEqual(2);
      expect(evaluate('const a = 6, b = 3;', 'a % b')).toEqual(0);
      expect(evaluate('const a = 6, b = 3;', 'a & b')).toEqual(2);
      expect(evaluate('const a = 6, b = 3;', 'a | b')).toEqual(7);
      expect(evaluate('const a = 6, b = 3;', 'a ^ b')).toEqual(5);
      expect(evaluate('const a = 6, b = 3;', 'a ** b')).toEqual(216);
      expect(evaluate('const a = 6, b = 3;', 'a << b')).toEqual(48);
      expect(evaluate('const a = -6, b = 2;', 'a >> b')).toEqual(-2);
      expect(evaluate('const a = -6, b = 2;', 'a >>> b')).toEqual(1073741822);
    });

    it('evaluates comparison operators', () => {
      expect(evaluate('const a = 2, b = 3;', 'a < b')).toEqual(true);
      expect(evaluate('const a = 3, b = 3;', 'a < b')).toEqual(false);

      expect(evaluate('const a = 3, b = 3;', 'a <= b')).toEqual(true);
      expect(evaluate('const a = 4, b = 3;', 'a <= b')).toEqual(false);

      expect(evaluate('const a = 4, b = 3;', 'a > b')).toEqual(true);
      expect(evaluate('const a = 3, b = 3;', 'a > b')).toEqual(false);

      expect(evaluate('const a = 3, b = 3;', 'a >= b')).toEqual(true);
      expect(evaluate('const a = 2, b = 3;', 'a >= b')).toEqual(false);

      expect(evaluate('const a: any = 3, b = "3";', 'a == b')).toEqual(true);
      expect(evaluate('const a: any = 2, b = "3";', 'a == b')).toEqual(false);

      expect(evaluate('const a: any = 2, b = "3";', 'a != b')).toEqual(true);
      expect(evaluate('const a: any = 3, b = "3";', 'a != b')).toEqual(false);

      expect(evaluate('const a: any = 3, b = 3;', 'a === b')).toEqual(true);
      expect(evaluate('const a: any = 3, b = "3";', 'a === b')).toEqual(false);

      expect(evaluate('const a: any = 3, b = "3";', 'a !== b')).toEqual(true);
      expect(evaluate('const a: any = 3, b = 3;', 'a !== b')).toEqual(false);
    });

    it('parentheticals work',
       () => { expect(evaluate(`const a = 3, b = 4;`, 'a * (a + b)')).toEqual(21); });

    it('array access works',
       () => { expect(evaluate(`const a = [1, 2, 3];`, 'a[1] + a[0]')).toEqual(3); });

    it('array access out of bounds is `undefined`', () => {
      expect(evaluate(`const a = [1, 2, 3];`, 'a[-1]')).toEqual(undefined);
      expect(evaluate(`const a = [1, 2, 3];`, 'a[3]')).toEqual(undefined);
    });

    it('array `length` property access works',
       () => { expect(evaluate(`const a = [1, 2, 3];`, 'a[\'length\'] + 1')).toEqual(4); });

    it('array `slice` function works', () => {
      expect(evaluate(`const a = [1, 2, 3];`, 'a[\'slice\']()')).toEqual([1, 2, 3]);
    });

    it('array `concat` function works', () => {
      expect(evaluate(`const a = [1, 2], b = [3, 4];`, 'a[\'concat\'](b)')).toEqual([1, 2, 3, 4]);
      expect(evaluate(`const a = [1, 2], b = 3;`, 'a[\'concat\'](b)')).toEqual([1, 2, 3]);
      expect(evaluate(`const a = [1, 2], b = 3, c = [4, 5];`, 'a[\'concat\'](b, c)')).toEqual([
        1, 2, 3, 4, 5
      ]);
      expect(evaluate(`const a = [1, 2], b = [3, 4]`, 'a[\'concat\'](...b)')).toEqual([1, 2, 3, 4]);
    });

    it('negation works', () => {
      expect(evaluate(`const x = 3;`, '!x')).toEqual(false);
      expect(evaluate(`const x = 3;`, '!!x')).toEqual(true);
    });

    it('supports boolean literals', () => {
      expect(evaluate('const a = true;', 'a')).toEqual(true);
      expect(evaluate('const a = false;', 'a')).toEqual(false);
    });

    it('supports undefined',
       () => { expect(evaluate('const a = undefined;', 'a')).toEqual(undefined); });

    it('supports null', () => { expect(evaluate('const a = null;', 'a')).toEqual(null); });

    it('resolves unknown binary operators as dynamic value', () => {
      const value = evaluate('declare const window: any;', '"location" in window');
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.node.getText()).toEqual('"location" in window');
      expect(value.isFromUnsupportedSyntax()).toBe(true);
    });

    it('resolves unknown unary operators as dynamic value', () => {
      const value = evaluate('let index = 0;', '++index');
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.node.getText()).toEqual('++index');
      expect(value.isFromUnsupportedSyntax()).toBe(true);
    });

    it('resolves invalid element accesses as dynamic value', () => {
      const value = evaluate('const a = {}; const index: any = true;', 'a[index]');
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.node.getText()).toEqual('a[index]');
      if (!value.isFromInvalidExpressionType()) {
        return fail('Should have an invalid expression type as reason');
      }
      expect(value.reason).toEqual(true);
    });

    it('resolves invalid array accesses as dynamic value', () => {
      const value = evaluate('const a = []; const index = 1.5;', 'a[index]');
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.node.getText()).toEqual('a[index]');
      if (!value.isFromInvalidExpressionType()) {
        return fail('Should have an invalid expression type as reason');
      }
      expect(value.reason).toEqual(1.5);
    });

    it('resolves binary operator on non-literals as dynamic value', () => {
      const value = evaluate('const a: any = []; const b: any = [];', 'a + b');
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.node.getText()).toEqual('a + b');
      if (!(value.reason instanceof DynamicValue)) {
        return fail(`Should have a DynamicValue as reason`);
      }
      if (!value.reason.isFromInvalidExpressionType()) {
        return fail('Should have an invalid expression type as reason');
      }
      expect(value.reason.node.getText()).toEqual('a');
      expect(value.reason.reason).toEqual([]);
    });

    it('resolves invalid spreads in array literals as dynamic value', () => {
      const array = evaluate('const a: any = true;', '[1, ...a]');
      if (!Array.isArray(array)) {
        return fail(`Should have resolved to an array`);
      }
      expect(array[0]).toBe(1);
      const value = array[1];
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.node.getText()).toEqual('...a');
      if (!value.isFromInvalidExpressionType()) {
        return fail('Should have an invalid spread element as reason');
      }
      expect(value.reason).toEqual(true);
    });

    it('resolves invalid spreads in object literals as dynamic value', () => {
      const value = evaluate('const a: any = true;', '{b: true, ...a}');
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.node.getText()).toEqual('{b: true, ...a}');
      if (!value.isFromDynamicInput()) {
        return fail('Should have a dynamic input as reason');
      }
      expect(value.reason.node.getText()).toEqual('...a');
      if (!value.reason.isFromInvalidExpressionType()) {
        return fail('Should have an invalid spread element as reason');
      }
      expect(value.reason.reason).toEqual(true);
    });

    it('resolves access from external variable declarations as dynamic value', () => {
      const value = evaluate('declare const window: any;', 'window.location');
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }
      expect(value.isFromDynamicInput()).toEqual(true);
      expect(value.node.getText()).toEqual('window.location');
      if (!(value.reason instanceof DynamicValue)) {
        return fail(`Should have a DynamicValue as reason`);
      }
      expect(value.reason.isFromExternalReference()).toEqual(true);
      expect(value.reason.node.getText()).toEqual('window: any');
    });

    it('imports work', () => {
      const {program} = makeProgram([
        {name: _('/second.ts'), contents: 'export function foo(bar) { return bar; }'},
        {
          name: _('/entry.ts'),
          contents: `
          import {foo} from './second';
          const target$ = foo;
      `
        },
      ]);
      const checker = program.getTypeChecker();
      const result = getDeclaration(program, _('/entry.ts'), 'target$', ts.isVariableDeclaration);
      const expr = result.initializer !;
      const evaluator = makeEvaluator(checker);
      const resolved = evaluator.evaluate(expr);
      if (!(resolved instanceof Reference)) {
        return fail('Expected expression to resolve to a reference');
      }
      expect(ts.isFunctionDeclaration(resolved.node)).toBe(true);
      const reference = resolved.getIdentityIn(getSourceFileOrError(program, _('/entry.ts')));
      if (reference === null) {
        return fail('Expected to get an identifier');
      }
      expect(reference.getSourceFile()).toEqual(getSourceFileOrError(program, _('/entry.ts')));
    });

    it('absolute imports work', () => {
      const {program} = makeProgram([
        {
          name: _('/node_modules/some_library/index.d.ts'),
          contents: 'export declare function foo(bar);'
        },
        {
          name: _('/entry.ts'),
          contents: `
          import {foo} from 'some_library';
          const target$ = foo;
      `
        },
      ]);
      const checker = program.getTypeChecker();
      const result = getDeclaration(program, _('/entry.ts'), 'target$', ts.isVariableDeclaration);
      const expr = result.initializer !;
      const evaluator = makeEvaluator(checker);
      const resolved = evaluator.evaluate(expr);
      if (!(resolved instanceof Reference)) {
        return fail('Expected expression to resolve to an absolute reference');
      }
      expect(owningModuleOf(resolved)).toBe('some_library');
      expect(ts.isFunctionDeclaration(resolved.node)).toBe(true);
      const reference = resolved.getIdentityIn(getSourceFileOrError(program, _('/entry.ts')));
      expect(reference).not.toBeNull();
      expect(reference !.getSourceFile()).toEqual(getSourceFileOrError(program, _('/entry.ts')));
    });

    it('reads values from default exports', () => {
      const value = evaluate(
          `
      import mod from './second';
      `,
          'mod.property', [
            {name: _('/second.ts'), contents: 'export default {property: "test"}'},
          ]);
      expect(value).toEqual('test');
    });

    it('reads values from named exports', () => {
      const value = evaluate(`import * as mod from './second';`, 'mod.a.property', [
        {name: _('/second.ts'), contents: 'export const a = {property: "test"};'},
      ]);
      expect(value).toEqual('test');
    });

    it('chain of re-exports works', () => {
      const value = evaluate(`import * as mod from './direct-reexport';`, 'mod.value.property', [
        {name: _('/const.ts'), contents: 'export const value = {property: "test"};'},
        {name: _('/def.ts'), contents: `import {value} from './const'; export default value;`},
        {name: _('/indirect-reexport.ts'), contents: `import value from './def'; export {value};`},
        {name: _('/direct-reexport.ts'), contents: `export {value} from './indirect-reexport';`},
      ]);
      expect(value).toEqual('test');
    });

    it('map spread works', () => {
      const map: Map<string, number> = evaluate<Map<string, number>>(
          `const a = {a: 1}; const b = {b: 2, c: 1}; const c = {...a, ...b, c: 3};`, 'c');

      const obj: {[key: string]: number} = {};
      map.forEach((value, key) => obj[key] = value);
      expect(obj).toEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });

    it('module spread works', () => {
      const map = evaluate<Map<string, number>>(
          `import * as mod from './module'; const c = {...mod, c: 3};`, 'c', [
            {name: _('/module.ts'), contents: `export const a = 1; export const b = 2;`},
          ]);

      const obj: {[key: string]: number} = {};
      map.forEach((value, key) => obj[key] = value);
      expect(obj).toEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });

    it('evaluates module exports lazily to avoid infinite recursion', () => {
      const value = evaluate(`import * as mod1 from './mod1';`, 'mod1.primary', [
        {
          name: _('/mod1.ts'),
          contents: `
            import * as mod2 from './mod2';
            export const primary = mod2.indirection;
            export const secondary = 2;`
        },
        {
          name: _('/mod2.ts'),
          contents: `import * as mod1 from './mod1'; export const indirection = mod1.secondary;`
        },
      ]);
      expect(value).toEqual(2);
    });

    it('indirected-via-object function call works', () => {
      expect(evaluate(
                 `
      function fn(res) { return res; }
      const obj = {fn};
    `,
                 'obj.fn("test")'))
          .toEqual('test');
    });

    it('template expressions work',
       () => { expect(evaluate('const a = 2, b = 4;', '`1${a}3${b}5`')).toEqual('12345'); });

    it('enum resolution works', () => {
      const result = evaluate(
          `
      enum Foo {
        A,
        B,
        C,
      }

      const r = Foo.B;
    `,
          'r');
      if (!(result instanceof EnumValue)) {
        return fail(`result is not an EnumValue`);
      }
      expect(result.enumRef.node.name.text).toBe('Foo');
      expect(result.name).toBe('B');
    });

    it('variable declaration resolution works', () => {
      const value = evaluate(`import {value} from './decl';`, 'value', [
        {name: _('/decl.d.ts'), contents: 'export declare let value: number;'},
      ]);
      expect(value instanceof Reference).toBe(true);
    });

    it('should resolve shorthand properties to values', () => {
      const {program} = makeProgram([
        {name: _('/entry.ts'), contents: `const prop = 42; const target$ = {prop};`},
      ]);
      const checker = program.getTypeChecker();
      const result = getDeclaration(program, _('/entry.ts'), 'target$', ts.isVariableDeclaration);
      const expr = result.initializer !as ts.ObjectLiteralExpression;
      const prop = expr.properties[0] as ts.ShorthandPropertyAssignment;
      const evaluator = makeEvaluator(checker);
      const resolved = evaluator.evaluate(prop.name);
      expect(resolved).toBe(42);
    });

    it('should resolve dynamic values in object literals', () => {
      const {program} = makeProgram([
        {name: _('/decl.d.ts'), contents: 'export declare const fn: any;'},
        {
          name: _('/entry.ts'),
          contents:
              `import {fn} from './decl'; const prop = fn.foo(); const target$ = {value: prop};`
        },
      ]);
      const checker = program.getTypeChecker();
      const result = getDeclaration(program, _('/entry.ts'), 'target$', ts.isVariableDeclaration);
      const expr = result.initializer !as ts.ObjectLiteralExpression;
      const evaluator = makeEvaluator(checker);
      const resolved = evaluator.evaluate(expr);
      if (!(resolved instanceof Map)) {
        return fail('Should have resolved to a Map');
      }
      const value = resolved.get('value') !;
      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved 'value' to a DynamicValue`);
      }
      const prop = expr.properties[0] as ts.PropertyAssignment;
      expect(value.node).toBe(prop.initializer);
    });

    it('should resolve enums in template expressions', () => {
      const value =
          evaluate(`enum Test { VALUE = 'test', } const value = \`a.\${Test.VALUE}.b\`;`, 'value');
      expect(value).toBe('a.test.b');
    });

    it('should not attach identifiers to FFR-resolved values', () => {
      const value = evaluate(
          `
    declare function foo(arg: any): any;
    class Target {}

    const indir = foo(Target);
    const value = indir;
  `,
          'value', [], firstArgFfr);
      if (!(value instanceof Reference)) {
        return fail('Expected value to be a Reference');
      }
      const id = value.getIdentityIn(value.node.getSourceFile());
      if (id === null) {
        return fail('Expected value to have an identity');
      }
      expect(id.text).toEqual('Target');
    });

    it('should resolve functions with more than one statement to an unknown value', () => {
      const value = evaluate(`function foo(bar) { const b = bar; return b; }`, 'foo("test")');

      if (!(value instanceof DynamicValue)) {
        return fail(`Should have resolved to a DynamicValue`);
      }

      expect(value.isFromUnknown()).toBe(true);
      expect((value.node as ts.CallExpression).expression.getText()).toBe('foo');
    });

    it('should evaluate TypeScript __spread helper', () => {
      const {checker, expression} = makeExpression(
          `
        import * as tslib from 'tslib';
        const a = [1];
        const b = [2, 3];
      `,
          'tslib.__spread(a, b)', [
            {
              name: _('/node_modules/tslib/index.d.ts'),
              contents: `
          export declare function __spread(...args: any[][]): any[];
        `
            },
          ]);
      const reflectionHost = new TsLibAwareReflectionHost(checker);
      const evaluator = new PartialEvaluator(reflectionHost, checker, null);
      const value = evaluator.evaluate(expression);
      expect(value).toEqual([1, 2, 3]);
    });

    it('should evaluate TypeScript __spreadArrays helper', () => {
      const {checker, expression} = makeExpression(
          `
        import * as tslib from 'tslib';
        const a = [1];
        const b = [2, 3];
      `,
          'tslib.__spreadArrays(a, b)', [
            {
              name: _('/node_modules/tslib/index.d.ts'),
              contents: `
          export declare function __spreadArrays(...args: any[][]): any[];
        `
            },
          ]);
      const reflectionHost = new TsLibAwareReflectionHost(checker);
      const evaluator = new PartialEvaluator(reflectionHost, checker, null);
      const value = evaluator.evaluate(expression);
      expect(value).toEqual([1, 2, 3]);
    });

    it('should evaluate TypeScript __assign helper', () => {
      const {checker, expression} = makeExpression(
          `
        import * as tslib from 'tslib';
        const a = {a: true};
        const b = {b: true};
      `,
          'tslib.__assign(a, b)', [
            {
              name: _('/node_modules/tslib/index.d.ts'),
              contents: `
          export declare function __assign(...args: object[]): object;
        `
            },
          ]);
      const reflectionHost = new TsLibAwareReflectionHost(checker);
      const evaluator = new PartialEvaluator(reflectionHost, checker, null);
      const map = evaluator.evaluate(expression) as Map<string, boolean>;
      const obj: {[key: string]: boolean} = {};
      map.forEach((value, key) => obj[key] = value);
      expect(obj).toEqual({a: true, b: true});
    });

    describe('(visited file tracking)', () => {
      it('should track each time a source file is visited', () => {
        const addDependency = jasmine.createSpy('DependencyTracker');
        const {expression, checker} = makeExpression(
            `class A { static foo = 42; } function bar() { return A.foo; }`, 'bar()');
        const evaluator = makeEvaluator(checker, {...fakeDepTracker, addDependency});
        evaluator.evaluate(expression);
        expect(addDependency).toHaveBeenCalledTimes(2);  // two declaration visited
        expect(addDependency.calls.allArgs().map(args => [args[0].fileName, args[1].fileName]))
            .toEqual([[_('/entry.ts'), _('/entry.ts')], [_('/entry.ts'), _('/entry.ts')]]);
      });

      it('should track imported source files', () => {
        const addDependency = jasmine.createSpy('DependencyTracker');
        const {expression, checker} =
            makeExpression(`import {Y} from './other'; const A = Y;`, 'A', [
              {name: _('/other.ts'), contents: `export const Y = 'test';`},
              {name: _('/not-visited.ts'), contents: `export const Z = 'nope';`}
            ]);
        const evaluator = makeEvaluator(checker, {...fakeDepTracker, addDependency});
        evaluator.evaluate(expression);
        expect(addDependency).toHaveBeenCalledTimes(2);
        expect(addDependency.calls.allArgs().map(args => [args[0].fileName, args[1].fileName]))
            .toEqual([
              [_('/entry.ts'), _('/entry.ts')],
              [_('/entry.ts'), _('/other.ts')],
            ]);
      });

      it('should track files passed through during re-exports', () => {
        const addDependency = jasmine.createSpy('DependencyTracker');
        const {expression, checker} =
            makeExpression(`import * as mod from './direct-reexport';`, 'mod.value.property', [
              {name: _('/const.ts'), contents: 'export const value = {property: "test"};'},
              {
                name: _('/def.ts'),
                contents: `import {value} from './const'; export default value;`
              },
              {
                name: _('/indirect-reexport.ts'),
                contents: `import value from './def'; export {value};`
              },
              {
                name: _('/direct-reexport.ts'),
                contents: `export {value} from './indirect-reexport';`
              },
            ]);
        const evaluator = makeEvaluator(checker, {...fakeDepTracker, addDependency});
        evaluator.evaluate(expression);
        expect(addDependency).toHaveBeenCalledTimes(2);
        expect(addDependency.calls.allArgs().map(args => [args[0].fileName, args[1].fileName]))
            .toEqual([
              [_('/entry.ts'), _('/direct-reexport.ts')],
              // Not '/indirect-reexport.ts' or '/def.ts'.
              // TS skips through them when finding the original symbol for `value`
              [_('/entry.ts'), _('/const.ts')],
            ]);
      });
    });
  });

  /**
   * Customizes the resolution of functions to recognize functions from tslib. Such functions are
   * not handled specially in the default TypeScript host, as only ngcc's ES5 host will have special
   * powers to recognize functions from tslib.
   */
  class TsLibAwareReflectionHost extends TypeScriptReflectionHost {
    getDefinitionOfFunction(node: ts.Node): FunctionDefinition|null {
      if (ts.isFunctionDeclaration(node)) {
        const helper = getTsHelperFn(node);
        if (helper !== null) {
          return {
            node,
            body: null, helper,
            parameters: [],
          };
        }
      }
      return super.getDefinitionOfFunction(node);
    }
  }

  function getTsHelperFn(node: ts.FunctionDeclaration): TsHelperFn|null {
    const name = node.name !== undefined && ts.isIdentifier(node.name) && node.name.text;

    switch (name) {
      case '__assign':
        return TsHelperFn.Assign;
      case '__spread':
        return TsHelperFn.Spread;
      case '__spreadArrays':
        return TsHelperFn.SpreadArrays;
      default:
        return null;
    }
  }
});

const fakeDepTracker: DependencyTracker = {
  addDependency: () => undefined,
  addResourceDependency: () => undefined,
  addTransitiveDependency: () => undefined,
  addTransitiveResources: () => undefined,
};
