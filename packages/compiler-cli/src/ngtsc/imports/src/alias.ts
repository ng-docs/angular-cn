/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Expression, ExternalExpr} from '@angular/compiler';
import ts from 'typescript';

import {UnifiedModulesHost} from '../../core/api';
import {ClassDeclaration, ReflectionHost} from '../../reflection';

import {EmittedReference, ImportFlags, ReferenceEmitKind, ReferenceEmitStrategy} from './emitter';
import {Reference} from './references';


// Escape anything that isn't alphanumeric, '/' or '_'.
const CHARS_TO_ESCAPE = /[^a-zA-Z0-9/_]/g;

/**
 * A host for the aliasing system, which allows for alternative exports/imports of directives/pipes.
 *
 * 别名系统的主机，它允许以替代方式导出/导入指令/管道。
 *
 * Given an import of an NgModule (e.g. `CommonModule`), the compiler must generate imports to the
 * directives and pipes exported by this module (e.g. `NgIf`) when they're used in a particular
 * template. In its default configuration, if the compiler is not directly able to import the
 * component from another file within the same project, it will attempt to import the component
 * from the same (absolute) path by which the module was imported. So in the above example if
 * `CommonModule` was imported from '@angular/common', the compiler will attempt to import `NgIf`
 * from '@angular/common' as well.
 *
 * 给定 NgModule 的导入（例如 `CommonModule`
 * ），编译器必须在特定模板中使用此模块导出的指令和管道（例如 `NgIf`
 * ）时生成对此的导入。在其默认配置中，如果编译器无法直接从同一个项目中的另一个文件导入组件，它将尝试从导入模块的相同（绝对）路径导入组件。因此，在上面的示例中，如果
 * `CommonModule` 是从 '@angular/common' 导入的，则编译器将尝试从 '@angular/common' 导入 `NgIf` 。
 *
 * The aliasing system interacts with the above logic in two distinct ways.
 *
 * 别名系统以两种不同的方式与上述逻辑交互。
 *
 * 1) It can be used to create "alias" re-exports from different files, which can be used when the
 *    user hasn't exported the directive(s) from the ES module containing the NgModule. These re-
 *    exports can also be helpful when using a `UnifiedModulesHost`, which overrides the import
 *    logic described above.
 *
 * 1）它可用于从不同的文件创建“别名”重新导出，当用户尚未从包含 NgModule 的 ES
 * 模块导出指令时可以用它。在使用 `UnifiedModulesHost`
 * 时，这些重新导出也会很有帮助，它会覆盖上面描述的导入逻辑。
 *
 * 2) It can be used to get an alternative import expression for a directive or pipe, instead of
 *    the import that the normal logic would apply. The alias used depends on the provenance of the
 *    `Reference` which was obtained for the directive/pipe, which is usually a property of how it
 *    came to be in a template's scope (e.g. by which NgModule).
 *
 * 2)
 * 它可用于获取指令或管道的替代导入表达式，而不是正常逻辑将应用的导入。使用的别名取决于为指令/管道获得的
 * `Reference` 的出处，这通常是它如何进入模板范围的属性（例如，来自哪个 NgModule ）。
 *
 * See the README.md for more information on how aliasing works within the compiler.
 *
 * 有关别名在编译器中如何工作的更多信息，请参阅 README.md。
 *
 */
export interface AliasingHost {
  /**
   * Controls whether any alias re-exports are rendered into .d.ts files.
   *
   * 控制是否将任何别名重新导出呈现到 .d.ts 文件中。
   *
   * This is not always necessary for aliasing to function correctly, so this flag allows an
   * `AliasingHost` to avoid cluttering the .d.ts files if exports are not strictly needed.
   *
   * 对于别名正常运行而言，这并不总是必要的，因此此标志允许 `AliasingHost`
   * 在不严格需要导出的情况下避免使 .d.ts 文件混乱。
   *
   */
  readonly aliasExportsInDts: boolean;

  /**
   * Determine a name by which `decl` should be re-exported from `context`, depending on the
   * particular set of aliasing rules in place.
   *
   * 根据现行的特定别名规则集，确定应该从 `context` 重新导出 `decl` 的名称。
   *
   * `maybeAliasSymbolAs` can return `null`, in which case no alias export should be generated.
   *
   * `maybeAliasSymbolAs` 可以返回 `null` ，在这种情况下，不应该生成别名导出。
   *
   * @param ref a `Reference` to the directive/pipe to consider for aliasing.
   *
   * a 对要考虑用于别名的指令/管道的 `Reference` 。
   *
   * @param context the `ts.SourceFile` in which the alias re-export might need to be generated.
   *
   * 可能需要在其中生成别名重新导出的 `ts.SourceFile` 。
   *
   * @param ngModuleName the declared name of the `NgModule` within `context` for which the alias
   * would be generated.
   *
   * 将为其生成别名的 `context` 中的 `NgModule` 的声明名称。
   *
   * @param isReExport whether the directive/pipe under consideration is re-exported from another
   * NgModule (as opposed to being declared by it directly).
   *
   * 正在考虑的指令/管道是否是从另一个 NgModule 重新导出的（而不是由它直接声明）。
   *
   */
  maybeAliasSymbolAs(
      ref: Reference<ClassDeclaration>, context: ts.SourceFile, ngModuleName: string,
      isReExport: boolean): string|null;

  /**
   * Determine an `Expression` by which `decl` should be imported from `via` using an alias export
   * (which should have been previously created when compiling `via`).
   *
   * 使用别名 export （应该以前在编译 `via` `via` 创建）确定应该从中导入 `decl` 的 `Expression` 。
   *
   * `getAliasIn` can return `null`, in which case no alias is needed to import `decl` from `via`
   * (and the normal import rules should be used).
   *
   * `getAliasIn` 可以返回 `null` ，在这种情况下，从 `via` 导入 `decl`
   * 不需要别名（并且应该使用正常的导入规则）。
   *
   * @param decl the declaration of the directive/pipe which is being imported, and which might be
   * aliased.
   *
   * 正在导入的指令/管道的声明，可能是别名。
   *
   * @param via the `ts.SourceFile` which might contain an alias to the
   *
   * `ts.SourceFile` ，可能包含 的别名
   *
   */
  getAliasIn(decl: ClassDeclaration, via: ts.SourceFile, isReExport: boolean): Expression|null;
}

/**
 * An `AliasingHost` which generates and consumes alias re-exports when module names for each file
 * are determined by a `UnifiedModulesHost`.
 *
 * 一个 `AliasingHost` ，当每个文件的模块名称由 `UnifiedModulesHost`
 * 确定时，它会生成并使用别名重新导出。
 *
 * When using a `UnifiedModulesHost`, aliasing prevents issues with transitive dependencies. See the
 * README.md for more details.
 *
 * 使用 `UnifiedModulesHost` 时，别名可以防止可传递依赖项出现问题。有关更多详细信息，请参阅
 * README.md 。
 *
 */
export class UnifiedModulesAliasingHost implements AliasingHost {
  constructor(private unifiedModulesHost: UnifiedModulesHost) {}

  /**
   * With a `UnifiedModulesHost`, aliases are chosen automatically without the need to look through
   * the exports present in a .d.ts file, so we can avoid cluttering the .d.ts files.
   *
   * 使用 `UnifiedModulesHost` ，会自动选择别名，而无需查看 .d.ts
   * 文件中存在的导出，因此我们可以避免混乱 .d.ts 文件。
   *
   */
  readonly aliasExportsInDts = false;

  maybeAliasSymbolAs(
      ref: Reference<ClassDeclaration>, context: ts.SourceFile, ngModuleName: string,
      isReExport: boolean): string|null {
    if (!isReExport) {
      // Aliasing is used with a UnifiedModulesHost to prevent transitive dependencies. Thus,
      // aliases
      // only need to be created for directives/pipes which are not direct declarations of an
      // NgModule which exports them.
      return null;
    }
    return this.aliasName(ref.node, context);
  }

  /**
   * Generates an `Expression` to import `decl` from `via`, assuming an export was added when `via`
   * was compiled per `maybeAliasSymbolAs` above.
   *
   * 生成一个 `Expression` 以从 `via` 导入 `decl` ，假定在按照上面的 `maybeAliasSymbolAs` 编译 `via`
   * 时添加了导出。
   *
   */
  getAliasIn(decl: ClassDeclaration, via: ts.SourceFile, isReExport: boolean): Expression|null {
    if (!isReExport) {
      // Directly exported directives/pipes don't require an alias, per the logic in
      // `maybeAliasSymbolAs`.
      return null;
    }
    // viaModule is the module it'll actually be imported from.
    const moduleName = this.unifiedModulesHost.fileNameToModuleName(via.fileName, via.fileName);
    return new ExternalExpr({moduleName, name: this.aliasName(decl, via)});
  }

  /**
   * Generates an alias name based on the full module name of the file which declares the aliased
   * directive/pipe.
   *
   * 根据声明别名指令/管道的文件的完整模块名生成别名。
   *
   */
  private aliasName(decl: ClassDeclaration, context: ts.SourceFile): string {
    // The declared module is used to get the name of the alias.
    const declModule = this.unifiedModulesHost.fileNameToModuleName(
        decl.getSourceFile().fileName, context.fileName);

    const replaced = declModule.replace(CHARS_TO_ESCAPE, '_').replace(/\//g, '$');
    return 'ɵng$' + replaced + '$$' + decl.name.text;
  }
}

/**
 * An `AliasingHost` which exports directives from any file containing an NgModule in which they're
 * declared/exported, under a private symbol name.
 *
 * 一个 `AliasingHost` ，它从包含在私有符号名称下声明/导出的 NgModule 的任何文件中导出指令。
 *
 * These exports support cases where an NgModule is imported deeply from an absolute module path
 * (that is, it's not part of an Angular Package Format entrypoint), and the compiler needs to
 * import any matched directives/pipes from the same path (to the NgModule file). See README.md for
 * more details.
 *
 * 这些导出支持从绝对模块路径深度导入 NgModule 的情况（即，它不是 Angular
 * 包格式入口点的一部分），并且编译器需要从同一路径导入任何匹配的指令/管道（到 NgModule
 * 文件）。有关更多详细信息，请参阅 README.md 。
 *
 */
export class PrivateExportAliasingHost implements AliasingHost {
  constructor(private host: ReflectionHost) {}

  /**
   * Under private export aliasing, the `AbsoluteModuleStrategy` used for emitting references will
   * will select aliased exports that it finds in the .d.ts file for an NgModule's file. Thus,
   * emitting these exports in .d.ts is a requirement for the `PrivateExportAliasingHost` to
   * function correctly.
   *
   * 在私有导出别名下，用于发出引用的 `AbsoluteModuleStrategy` 将选择它在 .d.ts 文件中找到的
   * NgModule 文件的别名导出。因此，在 .d.ts 中发出这些导出是 `PrivateExportAliasingHost`
   * 正常运行的要求。
   *
   */
  readonly aliasExportsInDts = true;

  maybeAliasSymbolAs(
      ref: Reference<ClassDeclaration>, context: ts.SourceFile, ngModuleName: string): string|null {
    if (ref.hasOwningModuleGuess) {
      // Skip nodes that already have an associated absolute module specifier, since they can be
      // safely imported from that specifier.
      return null;
    }
    // Look for a user-provided export of `decl` in `context`. If one exists, then an alias export
    // is not needed.
    // TODO(alxhub): maybe add a host method to check for the existence of an export without going
    // through the entire list of exports.
    const exports = this.host.getExportsOfModule(context);
    if (exports === null) {
      // Something went wrong, and no exports were available at all. Bail rather than risk creating
      // re-exports when they're not needed.
      throw new Error(`Could not determine the exports of: ${context.fileName}`);
    }
    let found: boolean = false;
    exports.forEach(value => {
      if (value.node === ref.node) {
        found = true;
      }
    });
    if (found) {
      // The module exports the declared class directly, no alias is necessary.
      return null;
    }
    return `ɵngExportɵ${ngModuleName}ɵ${ref.node.name.text}`;
  }

  /**
   * A `PrivateExportAliasingHost` only generates re-exports and does not direct the compiler to
   * directly consume the aliases it creates.
   *
   * `PrivateExportAliasingHost` 仅生成重新导出，不会指示编译器直接使用它创建的别名。
   *
   * Instead, they're consumed indirectly: `AbsoluteModuleStrategy` `ReferenceEmitterStrategy` will
   * select these alias exports automatically when looking for an export of the directive/pipe from
   * the same path as the NgModule was imported.
   *
   * 相反，它们是间接使用的：当从与导入 NgModule 的路径相同的路径查找指令/管道的导出时，
   * `AbsoluteModuleStrategy` `ReferenceEmitterStrategy` 将自动选择这些别名导出。
   *
   * Thus, `getAliasIn` always returns `null`.
   *
   * 因此， `getAliasIn` 始终返回 `null` 。
   *
   */
  getAliasIn(): null {
    return null;
  }
}

/**
 * A `ReferenceEmitStrategy` which will consume the alias attached to a particular `Reference` to a
 * directive or pipe, if it exists.
 *
 * 一个 `ReferenceEmitStrategy` ，它将使用附加到指令或管道的特定 `Reference` 的别名（如果存在）。
 *
 */
export class AliasStrategy implements ReferenceEmitStrategy {
  emit(ref: Reference, context: ts.SourceFile, importMode: ImportFlags): EmittedReference|null {
    if (importMode & ImportFlags.NoAliasing || ref.alias === null) {
      return null;
    }

    return {
      kind: ReferenceEmitKind.Success,
      expression: ref.alias,
      importedFile: 'unknown',
    };
  }
}
