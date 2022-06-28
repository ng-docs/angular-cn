/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ConstantPool, Expression, jsDocComment, LeadingComment, Statement, WrappedNodeExpr, WritePropExpr} from '@angular/compiler';
import MagicString from 'magic-string';
import ts from 'typescript';

import {ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {ImportManager} from '../../../src/ngtsc/translator';
import {ParsedConfiguration} from '../../../src/perform_compile';
import {PrivateDeclarationsAnalyses} from '../analysis/private_declarations_analyzer';
import {CompiledClass, CompiledFile, DecorationAnalyses} from '../analysis/types';
import {IMPORT_PREFIX} from '../constants';
import {NgccReflectionHost} from '../host/ngcc_host';
import {EntryPointBundle} from '../packages/entry_point_bundle';

import {RedundantDecoratorMap, RenderingFormatter} from './rendering_formatter';
import {renderSourceAndMap} from './source_maps';
import {FileToWrite, getImportRewriter, stripExtension} from './utils';

/**
 * A base-class for rendering an `AnalyzedFile`.
 *
 * 用于呈现 `AnalyzedFile` 的基类。
 *
 * Package formats have output files that must be rendered differently. Concrete sub-classes must
 * implement the `addImports`, `addDefinitions` and `removeDecorators` abstract methods.
 *
 * 包格式具有必须以不同方式呈现的输出文件。具体的子类必须实现 `addImports`、`addDefinitions` 和
 * `removeDecorators` 抽象方法。
 *
 */
export class Renderer {
  constructor(
      private host: NgccReflectionHost, private srcFormatter: RenderingFormatter,
      private fs: ReadonlyFileSystem, private logger: Logger, private bundle: EntryPointBundle,
      private tsConfig: ParsedConfiguration|null = null) {}

  renderProgram(
      decorationAnalyses: DecorationAnalyses,
      privateDeclarationsAnalyses: PrivateDeclarationsAnalyses): FileToWrite[] {
    const renderedFiles: FileToWrite[] = [];

    // Transform the source files.
    this.bundle.src.program.getSourceFiles().forEach(sourceFile => {
      if (decorationAnalyses.has(sourceFile) || sourceFile === this.bundle.src.file) {
        const compiledFile = decorationAnalyses.get(sourceFile);
        renderedFiles.push(
            ...this.renderFile(sourceFile, compiledFile, privateDeclarationsAnalyses));
      }
    });

    return renderedFiles;
  }

  /**
   * Render the source code and source-map for an Analyzed file.
   *
   * 渲染 Analysted 文件的源代码和 source-map。
   *
   * @param compiledFile The analyzed file to render.
   *
   * 要渲染的分析文件。
   *
   * @param targetPath The absolute path where the rendered file will be written.
   *
   * 将写入渲染文件的绝对路径。
   *
   */
  renderFile(
      sourceFile: ts.SourceFile, compiledFile: CompiledFile|undefined,
      privateDeclarationsAnalyses: PrivateDeclarationsAnalyses): FileToWrite[] {
    const isEntryPoint = sourceFile === this.bundle.src.file;
    const outputText = new MagicString(sourceFile.text);

    const importManager = new ImportManager(
        getImportRewriter(
            this.bundle.src.r3SymbolsFile, this.bundle.isCore, this.bundle.isFlatCore),
        IMPORT_PREFIX);

    if (compiledFile) {
      // TODO: remove constructor param metadata and property decorators (we need info from the
      // handlers to do this)
      const decoratorsToRemove = this.computeDecoratorsToRemove(compiledFile.compiledClasses);
      this.srcFormatter.removeDecorators(outputText, decoratorsToRemove);

      compiledFile.compiledClasses.forEach(clazz => {
        const renderedDefinition = this.renderDefinitions(
            compiledFile.sourceFile, clazz, importManager,
            !!this.tsConfig?.options.annotateForClosureCompiler);
        this.srcFormatter.addDefinitions(outputText, clazz, renderedDefinition);

        const renderedStatements =
            this.renderAdjacentStatements(compiledFile.sourceFile, clazz, importManager);
        this.srcFormatter.addAdjacentStatements(outputText, clazz, renderedStatements);
      });

      if (!isEntryPoint && compiledFile.reexports.length > 0) {
        this.srcFormatter.addDirectExports(
            outputText, compiledFile.reexports, importManager, compiledFile.sourceFile);
      }

      this.srcFormatter.addConstants(
          outputText,
          renderConstantPool(
              this.srcFormatter, compiledFile.sourceFile, compiledFile.constantPool, importManager),
          compiledFile.sourceFile);
    }

    // Add exports to the entry-point file
    if (isEntryPoint) {
      const entryPointBasePath = stripExtension(this.bundle.src.path);
      this.srcFormatter.addExports(
          outputText, entryPointBasePath, privateDeclarationsAnalyses, importManager, sourceFile);
    }

    if (isEntryPoint || compiledFile) {
      this.srcFormatter.addImports(
          outputText, importManager.getAllImports(sourceFile.fileName), sourceFile);
    }

    if (compiledFile || isEntryPoint) {
      return renderSourceAndMap(this.logger, this.fs, sourceFile, outputText);
    } else {
      return [];
    }
  }

  /**
   * From the given list of classes, computes a map of decorators that should be removed.
   * The decorators to remove are keyed by their container node, such that we can tell if
   * we should remove the entire decorator property.
   *
   * 从给定的类列表中，计算应该删除的装饰器映射。要删除的装饰器由它们的容器节点作为键，以便我们可以告诉我们是否应该删除整个
   * decorator 属性。
   *
   * @param classes The list of classes that may have decorators to remove.
   *
   * 可能要删除装饰器的类列表。
   *
   * @returns
   *
   * A map of decorators to remove, keyed by their container node.
   *
   * 要删除的装饰器映射，由它们的容器节点键控。
   *
   */
  private computeDecoratorsToRemove(classes: CompiledClass[]): RedundantDecoratorMap {
    const decoratorsToRemove = new RedundantDecoratorMap();
    classes.forEach(clazz => {
      if (clazz.decorators === null) {
        return;
      }

      clazz.decorators.forEach(dec => {
        if (dec.node === null) {
          return;
        }
        const decoratorArray = dec.node.parent!;
        if (!decoratorsToRemove.has(decoratorArray)) {
          decoratorsToRemove.set(decoratorArray, [dec.node]);
        } else {
          decoratorsToRemove.get(decoratorArray)!.push(dec.node);
        }
      });
    });
    return decoratorsToRemove;
  }

  /**
   * Render the definitions as source code for the given class.
   *
   * 将定义呈现为给定类的源代码。
   *
   * @param sourceFile The file containing the class to process.
   *
   * 包含要处理的类的文件。
   *
   * @param clazz The class whose definitions are to be rendered.
   *
   * 要呈现其定义的类。
   *
   * @param compilation The results of analyzing the class - this is used to generate the rendered
   * definitions.
   *
   * 分析类的结果 - 这用于生成呈现的定义。
   *
   * @param imports An object that tracks the imports that are needed by the rendered definitions.
   *
   * 跟踪呈现的定义所需的导入的对象。
   *
   */
  private renderDefinitions(
      sourceFile: ts.SourceFile, compiledClass: CompiledClass, imports: ImportManager,
      annotateForClosureCompiler: boolean): string {
    const name = this.host.getInternalNameOfClass(compiledClass.declaration);
    const leadingComment =
        annotateForClosureCompiler ? jsDocComment([{tagName: 'nocollapse'}]) : undefined;
    const statements: Statement[] = compiledClass.compilation.map(
        c => createAssignmentStatement(name, c.name, c.initializer, leadingComment));
    return this.renderStatements(sourceFile, statements, imports);
  }

  /**
   * Render the adjacent statements as source code for the given class.
   *
   * 将相邻的语句呈现为给定类的源代码。
   *
   * @param sourceFile The file containing the class to process.
   *
   * 包含要处理的类的文件。
   *
   * @param clazz The class whose statements are to be rendered.
   *
   * 要呈现其语句的类。
   *
   * @param compilation The results of analyzing the class - this is used to generate the rendered
   * definitions.
   *
   * 分析类的结果 - 这用于生成呈现的定义。
   *
   * @param imports An object that tracks the imports that are needed by the rendered definitions.
   *
   * 跟踪呈现的定义所需的导入的对象。
   *
   */
  private renderAdjacentStatements(
      sourceFile: ts.SourceFile, compiledClass: CompiledClass, imports: ImportManager): string {
    const statements: Statement[] = [];
    for (const c of compiledClass.compilation) {
      statements.push(...c.statements);
    }
    return this.renderStatements(sourceFile, statements, imports);
  }

  private renderStatements(
      sourceFile: ts.SourceFile, statements: Statement[], imports: ImportManager): string {
    const printStatement = (stmt: Statement) =>
        this.srcFormatter.printStatement(stmt, sourceFile, imports);
    return statements.map(printStatement).join('\n');
  }
}

/**
 * Render the constant pool as source code for the given class.
 *
 * 将常量池渲染为给定类的源代码。
 *
 */
export function renderConstantPool(
    formatter: RenderingFormatter, sourceFile: ts.SourceFile, constantPool: ConstantPool,
    imports: ImportManager): string {
  const printStatement = (stmt: Statement) => formatter.printStatement(stmt, sourceFile, imports);
  return constantPool.statements.map(printStatement).join('\n');
}

/**
 * Create an Angular AST statement node that contains the assignment of the
 * compiled decorator to be applied to the class.
 *
 * 创建一个 Angular AST 语句节点，其中包含要应用于类的已编译装饰器的分配。
 *
 * @param analyzedClass The info about the class whose statement we want to create.
 *
 * 有关我们要创建其语句的类的信息。
 *
 */
function createAssignmentStatement(
    receiverName: ts.DeclarationName, propName: string, initializer: Expression,
    leadingComment?: LeadingComment): Statement {
  const receiver = new WrappedNodeExpr(receiverName);
  const statement =
      new WritePropExpr(
          receiver, propName, initializer, /* type */ undefined, /* sourceSpan */ undefined)
          .toStmt();
  if (leadingComment !== undefined) {
    statement.addLeadingComment(leadingComment);
  }
  return statement;
}
