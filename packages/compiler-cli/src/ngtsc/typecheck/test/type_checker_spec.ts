/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ErrorCode, ngErrorCode} from '../../diagnostics';
import {absoluteFrom, absoluteFromSourceFile, getSourceFileOrError} from '../../file_system';
import {runInEachFileSystem} from '../../file_system/testing';

import {getClass, setup} from './test_utils';

runInEachFileSystem(() => {
  describe('TemplateTypeChecker', () => {
    it('should batch diagnostic operations when requested in WholeProgram mode', () => {
      const file1 = absoluteFrom('/file1.ts');
      const file2 = absoluteFrom('/file2.ts');
      const {program, templateTypeChecker, programStrategy} = setup([
        {fileName: file1, templates: {'Cmp1': '<div></div>'}},
        {fileName: file2, templates: {'Cmp2': '<span></span>'}}
      ]);

      templateTypeChecker.getDiagnosticsForFile(getSourceFileOrError(program, file1));
      const ttcProgram1 = programStrategy.getProgram();
      templateTypeChecker.getDiagnosticsForFile(getSourceFileOrError(program, file2));
      const ttcProgram2 = programStrategy.getProgram();

      expect(ttcProgram1).toBe(ttcProgram2);
    });

    it('should allow access to the type-check block of a component', () => {
      const file1 = absoluteFrom('/file1.ts');
      const file2 = absoluteFrom('/file2.ts');
      const {program, templateTypeChecker, programStrategy} = setup([
        {fileName: file1, templates: {'Cmp1': '<div></div>'}},
        {fileName: file2, templates: {'Cmp2': '<span></span>'}}
      ]);

      const cmp1 = getClass(getSourceFileOrError(program, file1), 'Cmp1');
      const block = templateTypeChecker.getTypeCheckBlock(cmp1);
      expect(block).not.toBeNull();
      expect(block!.getText()).toMatch(/: i[0-9]\.Cmp1/);
      expect(block!.getText()).toContain(`document.createElement("div")`);
    });

    describe('when inlining is unsupported', () => {
      it('should not produce errors for components that do not require inlining', () => {
        const fileName = absoluteFrom('/main.ts');
        const dirFile = absoluteFrom('/dir.ts');
        const {program, templateTypeChecker} = setup(
            [
              {
                fileName,
                source: `export class Cmp {}`,
                templates: {'Cmp': '<div dir></div>'},
                declarations: [{
                  name: 'TestDir',
                  selector: '[dir]',
                  file: dirFile,
                  type: 'directive',
                }]
              },
              {
                fileName: dirFile,
                source: `export class TestDir {}`,
                templates: {},
              }
            ],
            {inlining: false});
        const sf = getSourceFileOrError(program, fileName);
        const diags = templateTypeChecker.getDiagnosticsForFile(sf);
        expect(diags.length).toBe(0);
      });

      it('should produce errors for components that require TCB inlining', () => {
        const fileName = absoluteFrom('/main.ts');
        const {program, templateTypeChecker} = setup(
            [{
              fileName,
              source: `class Cmp {} // not exported, so requires inline`,
              templates: {'Cmp': '<div></div>'}
            }],
            {inlining: false});
        const sf = getSourceFileOrError(program, fileName);
        const diags = templateTypeChecker.getDiagnosticsForFile(sf);
        expect(diags.length).toBe(1);
        expect(diags[0].code).toBe(ngErrorCode(ErrorCode.INLINE_TCB_REQUIRED));
      });

      it('should produce errors for components that require type constructor inlining', () => {
        const fileName = absoluteFrom('/main.ts');
        const dirFile = absoluteFrom('/dir.ts');
        const {program, templateTypeChecker} = setup(
            [
              {
                fileName,
                source: `export class Cmp {}`,
                templates: {'Cmp': '<div dir></div>'},
                declarations: [{
                  name: 'TestDir',
                  selector: '[dir]',
                  file: dirFile,
                  type: 'directive',
                }]
              },
              {
                fileName: dirFile,
                source: `
                  // A non-exported interface used as a type bound for a generic directive causes
                  // an inline type constructor to be required.
                  interface NotExported {}
                  export class TestDir<T extends NotExported> {}`,
                templates: {},
              }
            ],
            {inlining: false});
        const sf = getSourceFileOrError(program, fileName);
        const diags = templateTypeChecker.getDiagnosticsForFile(sf);
        expect(diags.length).toBe(1);
        expect(diags[0].code).toBe(ngErrorCode(ErrorCode.INLINE_TYPE_CTOR_REQUIRED));

        // The relatedInformation of the diagnostic should point to the directive which required the
        // inline type constructor.
        expect(diags[0].relatedInformation).not.toBeUndefined();
        expect(diags[0].relatedInformation!.length).toBe(1);
        expect(diags[0].relatedInformation![0].file).not.toBeUndefined();
        expect(absoluteFromSourceFile(diags[0].relatedInformation![0].file!)).toBe(dirFile);
      });
    });
  });
});
