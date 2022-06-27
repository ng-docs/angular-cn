/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath, join} from '../../file_system';
import {NoopImportRewriter, Reference, ReferenceEmitter} from '../../imports';
import {ClassDeclaration, ReflectionHost} from '../../reflection';
import {ImportManager} from '../../translator';
import {TypeCheckBlockMetadata, TypeCheckingConfig} from '../api';

import {DomSchemaChecker} from './dom';
import {Environment} from './environment';
import {OutOfBandDiagnosticRecorder} from './oob';
import {generateTypeCheckBlock, TcbGenericContextBehavior} from './type_check_block';



/**
 * An `Environment` representing the single type-checking file into which most (if not all) Type
 * Check Blocks (TCBs) will be generated.
 *
 * 一个 `Environment` ，表示将在其中生成大多数（如果不是全部）类型检查块 (TCB) 的单个类型检查文件。
 *
 * The `TypeCheckFile` hosts multiple TCBs and allows the sharing of declarations (e.g. type
 * constructors) between them. Rather than return such declarations via `getPreludeStatements()`, it
 * hoists them to the top of the generated `ts.SourceFile`.
 *
 * `TypeCheckFile` 托管多个 TCB，并允许在它们之间共享声明（例如类型构造函数）。它没有通过
 * `getPreludeStatements()` 返回此类声明，而是将它们提升到生成的 `ts.SourceFile` 的顶部。
 *
 */
export class TypeCheckFile extends Environment {
  private nextTcbId = 1;
  private tcbStatements: ts.Statement[] = [];

  constructor(
      readonly fileName: AbsoluteFsPath, config: TypeCheckingConfig, refEmitter: ReferenceEmitter,
      reflector: ReflectionHost, compilerHost: Pick<ts.CompilerHost, 'getCanonicalFileName'>) {
    super(
        config, new ImportManager(new NoopImportRewriter(), 'i'), refEmitter, reflector,
        ts.createSourceFile(
            compilerHost.getCanonicalFileName(fileName), '', ts.ScriptTarget.Latest, true));
  }

  addTypeCheckBlock(
      ref: Reference<ClassDeclaration<ts.ClassDeclaration>>, meta: TypeCheckBlockMetadata,
      domSchemaChecker: DomSchemaChecker, oobRecorder: OutOfBandDiagnosticRecorder,
      genericContextBehavior: TcbGenericContextBehavior): void {
    const fnId = ts.factory.createIdentifier(`_tcb${this.nextTcbId++}`);
    const fn = generateTypeCheckBlock(
        this, ref, fnId, meta, domSchemaChecker, oobRecorder, genericContextBehavior);
    this.tcbStatements.push(fn);
  }

  render(removeComments: boolean): string {
    let source: string = this.importManager.getAllImports(this.contextFile.fileName)
                             .map(i => `import * as ${i.qualifier.text} from '${i.specifier}';`)
                             .join('\n') +
        '\n\n';
    const printer = ts.createPrinter({removeComments});
    source += '\n';
    for (const stmt of this.pipeInstStatements) {
      source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
    }
    for (const stmt of this.typeCtorStatements) {
      source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
    }
    source += '\n';
    for (const stmt of this.tcbStatements) {
      source += printer.printNode(ts.EmitHint.Unspecified, stmt, this.contextFile) + '\n';
    }

    // Ensure the template type-checking file is an ES module. Otherwise, it's interpreted as some
    // kind of global namespace in TS, which forces a full re-typecheck of the user's program that
    // is somehow more expensive than the initial parse.
    source += '\nexport const IS_A_MODULE = true;\n';

    return source;
  }

  override getPreludeStatements(): ts.Statement[] {
    return [];
  }
}

export function typeCheckFilePath(rootDirs: AbsoluteFsPath[]): AbsoluteFsPath {
  const shortest = rootDirs.concat([]).sort((a, b) => a.length - b.length)[0];
  return join(shortest, '__ng_typecheck__.ts');
}
