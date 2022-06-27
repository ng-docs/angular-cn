/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Expression, ExternalExpr, ExternalReference, WrappedNodeExpr} from '@angular/compiler';
import ts from 'typescript';

import {UnifiedModulesHost} from '../../core/api';
import {ErrorCode, FatalDiagnosticError, makeDiagnosticChain, makeRelatedInformation} from '../../diagnostics';
import {absoluteFromSourceFile, dirname, LogicalFileSystem, LogicalProjectPath, relative, toRelativeImport} from '../../file_system';
import {stripExtension} from '../../file_system/src/util';
import {DeclarationNode, ReflectionHost} from '../../reflection';
import {getSourceFile, isDeclaration, isNamedDeclaration, isTypeDeclaration, nodeNameForError} from '../../util/src/typescript';

import {findExportedNameOfNode} from './find_export';
import {Reference} from './references';
import {ModuleResolver} from './resolver';


/**
 * Flags which alter the imports generated by the `ReferenceEmitter`.
 *
 * 更改 `ReferenceEmitter` 生成的导入的标志。
 *
 */
export enum ImportFlags {
  None = 0x00,

  /**
   * Force the generation of a new import when generating a reference, even if an identifier already
   * exists in the target file which could be used instead.
   *
   * 生成引用时强制生成新的导入，即使目标文件中已经存在可以改为用的标识符。
   *
   * This is sometimes required if there's a risk TypeScript might remove imports during emit.
   *
   * 如果 TypeScript 可能会在发出期间删除导入，则有时需要这样做。
   *
   */
  ForceNewImport = 0x01,

  /**
   * Don't make use of any aliasing information when emitting a reference.
   *
   * 发出引用时不要使用任何别名信息。
   *
   * This is sometimes required if emitting into a context where generated references will be fed
   * into TypeScript and type-checked (such as in template type-checking).
   *
   * 如果发出到所生成的引用将被送入 TypeScript
   * 并进行类型检查的上下文（例如在模板类型检查中）的上下文中，有时需要这样做。
   *
   */
  NoAliasing = 0x02,

  /**
   * Indicates that an import to a type-only declaration is allowed.
   *
   * 表明允许导入到纯类型声明。
   *
   * For references that occur in type-positions, the referred declaration may be a type-only
   * declaration that is not retained during emit. Including this flag allows to emit references to
   * type-only declarations as used in e.g. template type-checking.
   *
   * 对于出现在类型位置的引用，被引用的声明可能是在发出期间不保留的仅类型声明。包含此标志允许发出对仅类型声明的引用，例如模板类型检查中使用的。
   *
   */
  AllowTypeImports = 0x04,

  /**
   * Indicates that importing from a declaration file using a relative import path is allowed.
   *
   * 表明允许使用相对导入路径从声明文件导入。
   *
   * The generated imports should normally use module specifiers that are valid for use in
   * production code, where arbitrary relative imports into e.g. node_modules are not allowed. For
   * template type-checking code it is however acceptable to use relative imports, as such files are
   * never emitted to JS code.
   *
   * 生成的导入通常应使用可在生产代码中使用的模块说明符，其中不允许任意相对导入到例如 node_modules
   * 。但是，对于模板类型检查代码，可以接受使用相对导入，因为这样的文件永远不会发送到 JS 代码。
   *
   * Non-declaration files have to be contained within a configured `rootDir` so using relative
   * paths may not be possible for those, hence this flag only applies when importing from a
   * declaration file.
   *
   * 非声明文件必须包含在配置的 `rootDir`
   * 中，因此对于这些文件可能无法使用相对路径，因此此标志仅在从声明文件导入时适用。
   *
   */
  AllowRelativeDtsImports = 0x08,
}

/**
 * An emitter strategy has the ability to indicate which `ts.SourceFile` is being imported by the
 * expression that it has generated. This information is useful for consumers of the emitted
 * reference that would otherwise have to perform a relatively expensive module resolution step,
 * e.g. for cyclic import analysis. In cases the emitter is unable to definitively determine the
 * imported source file or a computation would be required to actually determine the imported
 * source file, then `'unknown'` should be returned. If the generated expression does not represent
 * an import then `null` should be used.
 *
 * 发射器策略有能力通过它生成的表达式来表明正在导入哪个 `ts.SourceFile`
 * 。此信息对于发出的引用的消费者很有用，否则他们将不得不执行相对昂贵的模块解析步骤，例如循环导入分析。如果发射器无法明确确定导入的源文件，或者需要进行计算来实际确定导入的源文件，则应返回
 * `'unknown'` 。如果生成的表达式不表示导入，则应使用 `null` 。
 *
 */
export type ImportedFile = ts.SourceFile|'unknown'|null;

export const enum ReferenceEmitKind {
  Success,
  Failed,
}

/**
 * Represents the emitted expression of a `Reference` that is valid in the source file it was
 * emitted from.
 *
 * 表示发出的 `Reference` 表达式，该表达式在发出它的源文件中有效。
 *
 */
export interface EmittedReference {
  kind: ReferenceEmitKind.Success;

  /**
   * The expression that refers to `Reference`.
   *
   * `Reference` 的表达式。
   *
   */
  expression: Expression;

  /**
   * The `ts.SourceFile` that is imported by `expression`. This is not necessarily the source file
   * of the `Reference`'s declaration node, as the reference may have been rewritten through an
   * alias export. It could also be `null` if `expression` is a local identifier, or `'unknown'` if
   * the exact source file that is being imported is not known to the emitter.
   *
   * `expression` 导入的 `ts.SourceFile` 。这不一定是 `Reference`
   * 的声明节点的源文件，因为引用可能已通过别名导出被重写。如果 `expression` 是本地标识符，也可以是
   * `null` ，如果发射器不 `'unknown'` 要导入的确切源文件，它也可以是 null 。
   *
   */
  importedFile: ImportedFile;
}

/**
 * Represents a failure to emit a `Reference` into a different source file.
 *
 * 表示无法将 `Reference` 发送到不同的源文件。
 *
 */
export interface FailedEmitResult {
  kind: ReferenceEmitKind.Failed;

  /**
   * The reference that could not be emitted.
   *
   * 无法发出的引用。
   *
   */
  ref: Reference;

  /**
   * The source file into which the reference was requested to be emitted.
   *
   * 请求将引用发出到的源文件。
   *
   */
  context: ts.SourceFile;

  /**
   * Describes why the reference could not be emitted. This may be shown in a diagnostic.
   *
   * 描述无法发出引用的原因。这可能会在诊断中显示。
   *
   */
  reason: string;
}

export type ReferenceEmitResult = EmittedReference|FailedEmitResult;

/**
 * Verifies that a reference was emitted successfully, or raises a `FatalDiagnosticError` otherwise.
 *
 * 验证引用是否已成功发出，否则引发 `FatalDiagnosticError` 。
 *
 * @param result The emit result that should have been successful.
 *
 * 本应该成功的发出结果。
 *
 * @param origin The node that is used to report the failure diagnostic.
 *
 * 用于报告故障诊断的节点。
 *
 * @param typeKind The kind of the symbol that the reference represents, e.g. 'component' or
 *     'class'.
 *
 * 引用表示的符号的类型，例如“组件”或“类”。
 *
 */
export function assertSuccessfulReferenceEmit(
    result: ReferenceEmitResult, origin: ts.Node,
    typeKind: string): asserts result is EmittedReference {
  if (result.kind === ReferenceEmitKind.Success) {
    return;
  }

  const message = makeDiagnosticChain(
      `Unable to import ${typeKind} ${nodeNameForError(result.ref.node)}.`,
      [makeDiagnosticChain(result.reason)]);
  throw new FatalDiagnosticError(
      ErrorCode.IMPORT_GENERATION_FAILURE, origin, message,
      [makeRelatedInformation(result.ref.node, `The ${typeKind} is declared here.`)]);
}

/**
 * A particular strategy for generating an expression which refers to a `Reference`.
 *
 * 用于生成 `Reference` 的表达式的特定策略。
 *
 * There are many potential ways a given `Reference` could be referred to in the context of a given
 * file. A local declaration could be available, the `Reference` could be importable via a relative
 * import within the project, or an absolute import into `node_modules` might be necessary.
 *
 * 在给定文件的上下文中，可以用许多潜在方式引用给定 `Reference`
 * 。可以是本地声明，可以通过项目中的相对导入来导入 `Reference` ，或者可能需要绝对导入到
 * `node_modules` 中。
 *
 * Different `ReferenceEmitStrategy` implementations implement specific logic for generating such
 * references. A single strategy (such as using a local declaration) may not always be able to
 * generate an expression for every `Reference` (for example, if no local identifier is available),
 * and may return `null` in such a case.
 *
 * 不同的 `ReferenceEmitStrategy` 实现实现了用于生成此类引用的特定逻辑。单个策略（例如使用 local
 * 声明）可能并不总是能够为每个 `Reference`
 * 生成一个表达式（例如，如果没有本地标识符可用），并且在这种情况下可能会返回 `null` 。
 *
 */
export interface ReferenceEmitStrategy {
  /**
   * Emit an `Expression` which refers to the given `Reference` in the context of a particular
   * source file, if possible.
   *
   * 如果可能，发出一个在特定源文件的上下文中引用给定 `Reference` 的 `Expression` 。
   *
   * @param ref the `Reference` for which to generate an expression
   *
   * 要为其生成表达式的 `Reference`
   *
   * @param context the source file in which the `Expression` must be valid
   *
   * `Expression` 必须在其中有效的源文件
   *
   * @param importFlags a flag which controls whether imports should be generated or not
   *
   * 控制是否生成导入的标志
   *
   * @returns
   *
   * an `EmittedReference` which refers to the `Reference`, or `null` if none can be
   *   generated
   *
   * `Reference` 的 `EmittedReference` ，如果无法生成，则为 `null`
   *
   */
  emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags): ReferenceEmitResult|null;
}

/**
 * Generates `Expression`s which refer to `Reference`s in a given context.
 *
 * 生成在给定上下文中 `Reference` 的 `Expression` 。
 *
 * A `ReferenceEmitter` uses one or more `ReferenceEmitStrategy` implementations to produce an
 * `Expression` which refers to a `Reference` in the context of a particular file.
 *
 * `ReferenceEmitter` 使用一个或多个 `ReferenceEmitStrategy` 实现来生成一个 `Expression`
 * ，它在特定文件的上下文中 `Reference` 。
 *
 */
export class ReferenceEmitter {
  constructor(private strategies: ReferenceEmitStrategy[]) {}

  emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags = ImportFlags.None):
      ReferenceEmitResult {
    for (const strategy of this.strategies) {
      const emitted = strategy.emit(ref, context, importFlags);
      if (emitted !== null) {
        return emitted;
      }
    }

    return {
      kind: ReferenceEmitKind.Failed,
      ref,
      context,
      reason: `Unable to write a reference to ${nodeNameForError(ref.node)}.`,
    };
  }
}

/**
 * A `ReferenceEmitStrategy` which will refer to declarations by any local `ts.Identifier`s, if
 * such identifiers are available.
 *
 * 一个 `ReferenceEmitStrategy` ，如果这样的标识符可用，它将引用任何本地 `ts.Identifier` 的声明。
 *
 */
export class LocalIdentifierStrategy implements ReferenceEmitStrategy {
  emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags): EmittedReference|null {
    const refSf = getSourceFile(ref.node);

    // If the emitter has specified ForceNewImport, then LocalIdentifierStrategy should not use a
    // local identifier at all, *except* in the source file where the node is actually declared.
    if (importFlags & ImportFlags.ForceNewImport && refSf !== context) {
      return null;
    }

    // If referenced node is not an actual TS declaration (e.g. `class Foo` or `function foo() {}`,
    // etc) and it is in the current file then just use it directly.
    // This is important because the reference could be a property access (e.g. `exports.foo`). In
    // such a case, the reference's `identities` property would be `[foo]`, which would result in an
    // invalid emission of a free-standing `foo` identifier, rather than `exports.foo`.
    if (!isDeclaration(ref.node) && refSf === context) {
      return {
        kind: ReferenceEmitKind.Success,
        expression: new WrappedNodeExpr(ref.node),
        importedFile: null,
      };
    }

    // A Reference can have multiple identities in different files, so it may already have an
    // Identifier in the requested context file.
    const identifier = ref.getIdentityIn(context);
    if (identifier !== null) {
      return {
        kind: ReferenceEmitKind.Success,
        expression: new WrappedNodeExpr(identifier),
        importedFile: null,
      };
    } else {
      return null;
    }
  }
}

/**
 * Represents the exported declarations from a module source file.
 *
 * 表示从模块源文件中导出的声明。
 *
 */
interface ModuleExports {
  /**
   * The source file of the module.
   *
   * 模块的源文件。
   *
   */
  module: ts.SourceFile|null;

  /**
   * The map of declarations to their exported name.
   *
   * 声明到其导出名称的映射。
   *
   */
  exportMap: Map<DeclarationNode, string>|null;
}

/**
 * A `ReferenceEmitStrategy` which will refer to declarations that come from `node_modules` using
 * an absolute import.
 *
 * 一个 `ReferenceEmitStrategy` ，它将使用绝对导入来引用来自 `node_modules` 的声明。
 *
 * Part of this strategy involves looking at the target entry point and identifying the exported
 * name of the targeted declaration, as it might be different from the declared name (e.g. a
 * directive might be declared as FooDirImpl, but exported as FooDir). If no export can be found
 * which maps back to the original directive, an error is thrown.
 *
 * 该策略的一部分就是查看目标入口点并识别目标声明的导出名称，因为它可能与声明的名称不同（例如，指令可能被声明为
 * FooDirImpl ，但导出为 FooDir ）。如果找不到映射回原始指令的导出，则会抛出错误。
 *
 */
export class AbsoluteModuleStrategy implements ReferenceEmitStrategy {
  /**
   * A cache of the exports of specific modules, because resolving a module to its exports is a
   * costly operation.
   *
   * 特定模块导出的缓存，因为将模块解析为其导出是一项昂贵的操作。
   *
   */
  private moduleExportsCache = new Map<string, ModuleExports>();

  constructor(
      protected program: ts.Program, protected checker: ts.TypeChecker,
      protected moduleResolver: ModuleResolver, private reflectionHost: ReflectionHost) {}

  emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags): ReferenceEmitResult|null {
    if (ref.bestGuessOwningModule === null) {
      // There is no module name available for this Reference, meaning it was arrived at via a
      // relative path.
      return null;
    } else if (!isDeclaration(ref.node)) {
      // It's not possible to import something which isn't a declaration.
      throw new Error(`Debug assert: unable to import a Reference to non-declaration of type ${
          ts.SyntaxKind[ref.node.kind]}.`);
    } else if ((importFlags & ImportFlags.AllowTypeImports) === 0 && isTypeDeclaration(ref.node)) {
      throw new Error(`Importing a type-only declaration of type ${
          ts.SyntaxKind[ref.node.kind]} in a value position is not allowed.`);
    }

    // Try to find the exported name of the declaration, if one is available.
    const {specifier, resolutionContext} = ref.bestGuessOwningModule;
    const exports = this.getExportsOfModule(specifier, resolutionContext);
    if (exports.module === null) {
      return {
        kind: ReferenceEmitKind.Failed,
        ref,
        context,
        reason: `The module '${specifier}' could not be found.`,
      };
    } else if (exports.exportMap === null || !exports.exportMap.has(ref.node)) {
      return {
        kind: ReferenceEmitKind.Failed,
        ref,
        context,
        reason:
            `The symbol is not exported from ${exports.module.fileName} (module '${specifier}').`,
      };
    }
    const symbolName = exports.exportMap.get(ref.node)!;

    return {
      kind: ReferenceEmitKind.Success,
      expression: new ExternalExpr(new ExternalReference(specifier, symbolName)),
      importedFile: exports.module,
    };
  }

  private getExportsOfModule(moduleName: string, fromFile: string): ModuleExports {
    if (!this.moduleExportsCache.has(moduleName)) {
      this.moduleExportsCache.set(moduleName, this.enumerateExportsOfModule(moduleName, fromFile));
    }
    return this.moduleExportsCache.get(moduleName)!;
  }

  protected enumerateExportsOfModule(specifier: string, fromFile: string): ModuleExports {
    // First, resolve the module specifier to its entry point, and get the ts.Symbol for it.
    const entryPointFile = this.moduleResolver.resolveModule(specifier, fromFile);
    if (entryPointFile === null) {
      return {module: null, exportMap: null};
    }

    const exports = this.reflectionHost.getExportsOfModule(entryPointFile);
    if (exports === null) {
      return {module: entryPointFile, exportMap: null};
    }
    const exportMap = new Map<DeclarationNode, string>();
    for (const [name, declaration] of exports) {
      if (exportMap.has(declaration.node)) {
        // An export for this declaration has already been registered. We prefer an export that
        // has the same name as the declared name, i.e. is not an aliased export. This is relevant
        // for partial compilations where emitted references should import symbols using a stable
        // name. This is particularly relevant for declarations inside VE-generated libraries, as
        // such libraries contain private, unstable reexports of symbols.
        const existingExport = exportMap.get(declaration.node)!;
        if (isNamedDeclaration(declaration.node) && declaration.node.name.text === existingExport) {
          continue;
        }
      }
      exportMap.set(declaration.node, name);
    }
    return {module: entryPointFile, exportMap};
  }
}

/**
 * A `ReferenceEmitStrategy` which will refer to declarations via relative paths, provided they're
 * both in the logical project "space" of paths.
 *
 * 一个 `ReferenceEmitStrategy` ，它将通过相对路径引用声明，前提是它们都在路径的逻辑项目“空间”中。
 *
 * This is trickier than it sounds, as the two files may be in different root directories in the
 * project. Simply calculating a file system relative path between the two is not sufficient.
 * Instead, `LogicalProjectPath`s are used.
 *
 * 这比听起来更棘手，因为这两个文件可能在项目的不同根目录中。简单地计算两者之间的文件系统相对路径是不够的。相反，使用
 * `LogicalProjectPath` 。
 *
 */
export class LogicalProjectStrategy implements ReferenceEmitStrategy {
  private relativePathStrategy = new RelativePathStrategy(this.reflector);

  constructor(private reflector: ReflectionHost, private logicalFs: LogicalFileSystem) {}

  emit(ref: Reference, context: ts.SourceFile, importFlags: ImportFlags): ReferenceEmitResult|null {
    const destSf = getSourceFile(ref.node);

    // Compute the relative path from the importing file to the file being imported. This is done
    // as a logical path computation, because the two files might be in different rootDirs.
    const destPath = this.logicalFs.logicalPathOfSf(destSf);
    if (destPath === null) {
      // The imported file is not within the logical project filesystem. An import into a
      // declaration file is exempt from `TS6059: File is not under 'rootDir'` so we choose to allow
      // using a filesystem relative path as fallback, if allowed per the provided import flags.
      if (destSf.isDeclarationFile && importFlags & ImportFlags.AllowRelativeDtsImports) {
        return this.relativePathStrategy.emit(ref, context);
      }

      // Note: this error is analogous to `TS6059: File is not under 'rootDir'` that TypeScript
      // reports.
      return {
        kind: ReferenceEmitKind.Failed,
        ref,
        context,
        reason: `The file ${destSf.fileName} is outside of the configured 'rootDir'.`,
      };
    }

    const originPath = this.logicalFs.logicalPathOfSf(context);
    if (originPath === null) {
      throw new Error(
          `Debug assert: attempt to import from ${context.fileName} but it's outside the program?`);
    }

    // There's no way to emit a relative reference from a file to itself.
    if (destPath === originPath) {
      return null;
    }

    const name = findExportedNameOfNode(ref.node, destSf, this.reflector);
    if (name === null) {
      // The target declaration isn't exported from the file it's declared in. This is an issue!
      return {
        kind: ReferenceEmitKind.Failed,
        ref,
        context,
        reason: `The symbol is not exported from ${destSf.fileName}.`,
      };
    }

    // With both files expressed as LogicalProjectPaths, getting the module specifier as a relative
    // path is now straightforward.
    const moduleName = LogicalProjectPath.relativePathBetween(originPath, destPath);
    return {
      kind: ReferenceEmitKind.Success,
      expression: new ExternalExpr({moduleName, name}),
      importedFile: destSf,
    };
  }
}

/**
 * A `ReferenceEmitStrategy` which constructs relatives paths between `ts.SourceFile`s.
 *
 * 一个 `ReferenceEmitStrategy` ，它构造 `ts.SourceFile` 之间的相对路径。
 *
 * This strategy can be used if there is no `rootDir`/`rootDirs` structure for the project which
 * necessitates the stronger logic of `LogicalProjectStrategy`.
 *
 * 如果项目没有 `rootDir` / `rootDirs` 结构，可以用此策略，这需要 `LogicalProjectStrategy`
 * 更强大的逻辑。
 *
 */
export class RelativePathStrategy implements ReferenceEmitStrategy {
  constructor(private reflector: ReflectionHost) {}

  emit(ref: Reference, context: ts.SourceFile): ReferenceEmitResult|null {
    const destSf = getSourceFile(ref.node);
    const relativePath =
        relative(dirname(absoluteFromSourceFile(context)), absoluteFromSourceFile(destSf));
    const moduleName = toRelativeImport(stripExtension(relativePath));

    const name = findExportedNameOfNode(ref.node, destSf, this.reflector);
    if (name === null) {
      return {
        kind: ReferenceEmitKind.Failed,
        ref,
        context,
        reason: `The symbol is not exported from ${destSf.fileName}.`,
      };
    }
    return {
      kind: ReferenceEmitKind.Success,
      expression: new ExternalExpr({moduleName, name}),
      importedFile: destSf,
    };
  }
}

/**
 * A `ReferenceEmitStrategy` which uses a `UnifiedModulesHost` to generate absolute import
 * references.
 *
 * 使用 `UnifiedModulesHost` 生成绝对导入引用的 `ReferenceEmitStrategy` 。
 *
 */
export class UnifiedModulesStrategy implements ReferenceEmitStrategy {
  constructor(private reflector: ReflectionHost, private unifiedModulesHost: UnifiedModulesHost) {}

  emit(ref: Reference, context: ts.SourceFile): EmittedReference|null {
    const destSf = getSourceFile(ref.node);
    const name = findExportedNameOfNode(ref.node, destSf, this.reflector);
    if (name === null) {
      return null;
    }

    const moduleName =
        this.unifiedModulesHost.fileNameToModuleName(destSf.fileName, context.fileName);

    return {
      kind: ReferenceEmitKind.Success,
      expression: new ExternalExpr({moduleName, name}),
      importedFile: destSf,
    };
  }
}
