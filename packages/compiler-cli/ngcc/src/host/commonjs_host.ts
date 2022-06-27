/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {absoluteFrom} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {Declaration, DeclarationKind, Import} from '../../../src/ngtsc/reflection';
import {BundleProgram} from '../packages/bundle_program';
import {FactoryMap, isDefined} from '../utils';

import {DefinePropertyReexportStatement, ExportDeclaration, ExportsStatement, extractGetterFnExpression, findNamespaceOfIdentifier, findRequireCallReference, isDefinePropertyReexportStatement, isExportsAssignment, isExportsStatement, isExternalImport, isRequireCall, isWildcardReexportStatement, RequireCall, skipAliases, WildcardReexportStatement} from './commonjs_umd_utils';
import {getInnerClassDeclaration, getOuterNodeFromInnerDeclaration} from './esm2015_host';
import {Esm5ReflectionHost} from './esm5_host';
import {NgccClassSymbol} from './ngcc_host';

export class CommonJsReflectionHost extends Esm5ReflectionHost {
  protected commonJsExports = new FactoryMap<ts.SourceFile, Map<string, Declaration>|null>(
      sf => this.computeExportsOfCommonJsModule(sf));
  protected topLevelHelperCalls =
      new FactoryMap<string, FactoryMap<ts.SourceFile, ts.CallExpression[]>>(
          helperName => new FactoryMap<ts.SourceFile, ts.CallExpression[]>(
              sf => sf.statements.map(stmt => this.getHelperCall(stmt, [helperName]))
                        .filter(isDefined)));
  protected program: ts.Program;
  protected compilerHost: ts.CompilerHost;
  constructor(logger: Logger, isCore: boolean, src: BundleProgram, dts: BundleProgram|null = null) {
    super(logger, isCore, src, dts);
    this.program = src.program;
    this.compilerHost = src.host;
  }

  override getImportOfIdentifier(id: ts.Identifier): Import|null {
    const requireCall = this.findCommonJsImport(id);
    if (requireCall === null) {
      return null;
    }
    return {from: requireCall.arguments[0].text, name: id.text};
  }

  override getDeclarationOfIdentifier(id: ts.Identifier): Declaration|null {
    return this.getCommonJsModuleDeclaration(id) || super.getDeclarationOfIdentifier(id);
  }

  override getExportsOfModule(module: ts.Node): Map<string, Declaration>|null {
    return super.getExportsOfModule(module) || this.commonJsExports.get(module.getSourceFile());
  }

  /**
   * Search statements related to the given class for calls to the specified helper.
   *
   * 搜索与给定类相关的语句以查找对指定帮助器的调用。
   *
   * In CommonJS these helper calls can be outside the class's IIFE at the top level of the
   * source file. Searching the top level statements for helpers can be expensive, so we
   * try to get helpers from the IIFE first and only fall back on searching the top level if
   * no helpers are found.
   *
   * 在 CommonJS 中，这些帮助器调用可以在源文件顶级类的 IIFE
   * 之外。在顶级语句中搜索帮助器可能会很昂贵，因此我们会尝试首先从 IIFE
   * 获取帮助器，如果没有找到帮助器，则只会退回到搜索顶级。
   *
   * @param classSymbol the class whose helper calls we are interested in.
   *
   * 我们感兴趣的助手调用的类。
   *
   * @param helperNames the names of the helpers (e.g. `__decorate`) whose calls we are interested
   * in.
   *
   * 我们感兴趣的调用的帮助器的名称（例如 `__decorate` ）。
   *
   * @returns
   *
   * an array of nodes of calls to the helper with the given name.
   *
   * 调用给定名称的帮助器的节点数组。
   *
   */
  protected override getHelperCallsForClass(classSymbol: NgccClassSymbol, helperNames: string[]):
      ts.CallExpression[] {
    const esm5HelperCalls = super.getHelperCallsForClass(classSymbol, helperNames);
    if (esm5HelperCalls.length > 0) {
      return esm5HelperCalls;
    } else {
      const sourceFile = classSymbol.declaration.valueDeclaration.getSourceFile();
      return this.getTopLevelHelperCalls(sourceFile, helperNames);
    }
  }

  /**
   * Find all the helper calls at the top level of a source file.
   *
   * 在源文件的顶级查找所有帮助器调用。
   *
   * We cache the helper calls per source file so that we don't have to keep parsing the code for
   * each class in a file.
   *
   * 我们缓存每个源文件的帮助器调用，以便我们不必继续解析文件中每个类的代码。
   *
   * @param sourceFile the source who may contain helper calls.
   *
   * 可能包含帮助器调用的源。
   *
   * @param helperNames the names of the helpers (e.g. `__decorate`) whose calls we are interested
   * in.
   *
   * 我们感兴趣的调用的帮助器的名称（例如 `__decorate` ）。
   *
   * @returns
   *
   * an array of nodes of calls to the helper with the given name.
   *
   * 调用给定名称的帮助器的节点数组。
   *
   */
  private getTopLevelHelperCalls(sourceFile: ts.SourceFile, helperNames: string[]):
      ts.CallExpression[] {
    const calls: ts.CallExpression[] = [];
    helperNames.forEach(helperName => {
      const helperCallsMap = this.topLevelHelperCalls.get(helperName);
      calls.push(...helperCallsMap.get(sourceFile));
    });
    return calls;
  }

  private computeExportsOfCommonJsModule(sourceFile: ts.SourceFile): Map<string, Declaration> {
    const moduleMap = new Map<string, Declaration>();
    for (const statement of this.getModuleStatements(sourceFile)) {
      if (isExportsStatement(statement)) {
        const exportDeclaration = this.extractBasicCommonJsExportDeclaration(statement);
        moduleMap.set(exportDeclaration.name, exportDeclaration.declaration);
      } else if (isWildcardReexportStatement(statement)) {
        const reexports = this.extractCommonJsWildcardReexports(statement, sourceFile);
        for (const reexport of reexports) {
          moduleMap.set(reexport.name, reexport.declaration);
        }
      } else if (isDefinePropertyReexportStatement(statement)) {
        const exportDeclaration = this.extractCommonJsDefinePropertyExportDeclaration(statement);
        if (exportDeclaration !== null) {
          moduleMap.set(exportDeclaration.name, exportDeclaration.declaration);
        }
      }
    }
    return moduleMap;
  }

  private extractBasicCommonJsExportDeclaration(statement: ExportsStatement): ExportDeclaration {
    const exportExpression = skipAliases(statement.expression.right);
    const node = statement.expression.left;
    const declaration = this.getDeclarationOfExpression(exportExpression) ?? {
      kind: DeclarationKind.Inline,
      node,
      implementation: exportExpression,
      known: null,
      viaModule: null,
    };
    return {name: node.name.text, declaration};
  }

  private extractCommonJsWildcardReexports(
      statement: WildcardReexportStatement, containingFile: ts.SourceFile): ExportDeclaration[] {
    const reexportArg = statement.expression.arguments[0];

    const requireCall = isRequireCall(reexportArg) ? reexportArg :
        ts.isIdentifier(reexportArg) ? findRequireCallReference(reexportArg, this.checker) :
                                       null;
    if (requireCall === null) {
      return [];
    }

    const importPath = requireCall.arguments[0].text;
    const importedFile = this.resolveModuleName(importPath, containingFile);
    if (importedFile === undefined) {
      return [];
    }

    const importedExports = this.getExportsOfModule(importedFile);
    if (importedExports === null) {
      return [];
    }

    const viaModule = isExternalImport(importPath) ? importPath : null;
    const reexports: ExportDeclaration[] = [];
    importedExports.forEach((declaration, name) => {
      if (viaModule !== null && declaration.viaModule === null) {
        declaration = {...declaration, viaModule};
      }
      reexports.push({name, declaration});
    });
    return reexports;
  }

  private extractCommonJsDefinePropertyExportDeclaration(
      statement: DefinePropertyReexportStatement): ExportDeclaration|null {
    const args = statement.expression.arguments;
    const name = args[1].text;
    const getterFnExpression = extractGetterFnExpression(statement);
    if (getterFnExpression === null) {
      return null;
    }

    const declaration = this.getDeclarationOfExpression(getterFnExpression);
    if (declaration !== null) {
      return {name, declaration};
    }

    return {
      name,
      declaration: {
        kind: DeclarationKind.Inline,
        node: args[1],
        implementation: getterFnExpression,
        known: null,
        viaModule: null,
      },
    };
  }

  private findCommonJsImport(id: ts.Identifier): RequireCall|null {
    // Is `id` a namespaced property access, e.g. `Directive` in `core.Directive`?
    // If so capture the symbol of the namespace, e.g. `core`.
    const nsIdentifier = findNamespaceOfIdentifier(id);
    return nsIdentifier && findRequireCallReference(nsIdentifier, this.checker);
  }

  /**
   * Handle the case where the identifier represents a reference to a whole CommonJS
   * module, i.e. the result of a call to `require(...)`.
   *
   * 处理标识符表示对整个 CommonJS 模块的引用的情况，即调用 `require(...)` 的结果。
   *
   * @param id the identifier whose declaration we are looking for.
   *
   * 我们要查找其声明的标识符。
   *
   * @returns
   *
   * a declaration if `id` refers to a CommonJS module, or `null` otherwise.
   *
   * 如果 `id` 引用了 CommonJS 模块，则为声明，否则为 `null` 。
   *
   */
  private getCommonJsModuleDeclaration(id: ts.Identifier): Declaration|null {
    const requireCall = findRequireCallReference(id, this.checker);
    if (requireCall === null) {
      return null;
    }
    const importPath = requireCall.arguments[0].text;
    const module = this.resolveModuleName(importPath, id.getSourceFile());
    if (module === undefined) {
      return null;
    }
    const viaModule = isExternalImport(importPath) ? importPath : null;
    return {node: module, known: null, viaModule, identity: null, kind: DeclarationKind.Concrete};
  }

  /**
   * If this is an IFE then try to grab the outer and inner classes otherwise fallback on the super
   * class.
   *
   * 如果这是 IFE，则尝试获取外部类和内部类，否则回退到超类。
   *
   */
  protected override getDeclarationOfExpression(expression: ts.Expression): Declaration|null {
    const inner = getInnerClassDeclaration(expression);
    if (inner !== null) {
      const outer = getOuterNodeFromInnerDeclaration(inner);
      if (outer !== null && isExportsAssignment(outer)) {
        return {
          kind: DeclarationKind.Inline,
          node: outer.left,
          implementation: inner,
          known: null,
          viaModule: null,
        };
      }
    }
    return super.getDeclarationOfExpression(expression);
  }

  private resolveModuleName(moduleName: string, containingFile: ts.SourceFile): ts.SourceFile
      |undefined {
    if (this.compilerHost.resolveModuleNames) {
      const moduleInfo = this.compilerHost.resolveModuleNames(
          [moduleName], containingFile.fileName, undefined, undefined,
          this.program.getCompilerOptions())[0];
      return moduleInfo && this.program.getSourceFile(absoluteFrom(moduleInfo.resolvedFileName));
    } else {
      const moduleInfo = ts.resolveModuleName(
          moduleName, containingFile.fileName, this.program.getCompilerOptions(),
          this.compilerHost);
      return moduleInfo.resolvedModule &&
          this.program.getSourceFile(absoluteFrom(moduleInfo.resolvedModule.resolvedFileName));
    }
  }
}
