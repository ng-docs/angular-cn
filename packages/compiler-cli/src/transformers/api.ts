/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseSourceSpan} from '@angular/compiler';
import * as ts from 'typescript';

export enum DiagnosticCategory {
  Warning = 0,
  Error = 1,
  Message = 2,
}

export interface Diagnostic {
  message: string;
  span?: ParseSourceSpan;
  category: DiagnosticCategory;
}

export interface CompilerOptions extends ts.CompilerOptions {
  // Absolute path to a directory where generated file structure is written.
  // If unspecified, generated files will be written alongside sources.
  genDir?: string;

  // Path to the directory containing the tsconfig.json file.
  basePath?: string;

  // Don't produce .metadata.json files (they don't work for bundled emit with --out)
  skipMetadataEmit?: boolean;

  // Produce an error if the metadata written for a class would produce an error if used.
  strictMetadataEmit?: boolean;

  // Don't produce .ngfactory.ts or .ngstyle.ts files
  skipTemplateCodegen?: boolean;

  // Whether to generate a flat module index of the given name and the corresponding
  // flat module metadata. This option is intended to be used when creating flat
  // modules similar to how `@angular/core` and `@angular/common` are packaged.
  // When this option is used the `package.json` for the library should refered to the
  // generated flat module index instead of the library index file. When using this
  // option only one .metadata.json file is produced that contains all the metadata
  // necessary for symbols exported from the library index.
  // In the generated .ngfactory.ts files flat module index is used to import symbols
  // includes both the public API from the library index as well as shrowded internal
  // symbols.
  // By default the .ts file supplied in the `files` files field is assumed to be
  // library index. If more than one is specified, uses `libraryIndex` to select the
  // file to use. If more than on .ts file is supplied and no `libraryIndex` is supplied
  // an error is produced.
  // A flat module index .d.ts and .js will be created with the given `flatModuleOutFile`
  // name in the same location as the library index .d.ts file is emitted.
  // For example, if a library uses `public_api.ts` file as the library index of the
  // module the `tsconfig.json` `files` field would be `["public_api.ts"]`. The
  // `flatModuleOutFile` options could then be set to, for example `"index.js"`, which
  // produces `index.d.ts` and  `index.metadata.json` files. The library's
  // `package.json`'s `module` field would be `"index.js"` and the `typings` field would
  // be `"index.d.ts"`.
  flatModuleOutFile?: string;

  // Preferred module id to use for importing flat module. References generated by `ngc`
  // will use this module name when importing symbols from the flat module. This is only
  // meaningful when `flatModuleOutFile` is also supplied. It is otherwise ignored.
  flatModuleId?: string;

  // Whether to generate code for library code.
  // If true, produce .ngfactory.ts and .ngstyle.ts files for .d.ts inputs.
  // Default is true.
  generateCodeForLibraries?: boolean;

  // Insert JSDoc type annotations needed by Closure Compiler
  annotateForClosureCompiler?: boolean;

  // Modify how angular annotations are emitted to improve tree-shaking.
  // Default is static fields.
  // decorators: Leave the Decorators in-place. This makes compilation faster.
  //             TypeScript will emit calls to the __decorate helper.
  //             `--emitDecoratorMetadata` can be used for runtime reflection.
  //             However, the resulting code will not properly tree-shake.
  // static fields: Replace decorators with a static field in the class.
  //                Allows advanced tree-shakers like Closure Compiler to remove
  //                unused classes.
  annotationsAs?: 'decorators'|'static fields';

  // Print extra information while running the compiler
  trace?: boolean;

  // Whether to enable support for <template> and the template attribute (true by default)
  enableLegacyTemplate?: boolean;
}

export interface ModuleFilenameResolver {
  /**
   * Converts a module name that is used in an `import` to a file path.
   * I.e. `path/to/containingFile.ts` containing `import {...} from 'module-name'`.
   */
  moduleNameToFileName(moduleName: string, containingFile?: string): string|null;

  /**
   * Converts a file path to a module name that can be used as an `import.
   * I.e. `path/to/importedFile.ts` should be imported by `path/to/containingFile.ts`.
   *
   * See ImportResolver.
   */
  fileNameToModuleName(importedFilePath: string, containingFilePath: string): string|null;

  getNgCanonicalFileName(fileName: string): string;

  assumeFileExists(fileName: string): void;
}

export interface CompilerHost extends ts.CompilerHost, ModuleFilenameResolver {
  /**
   * Load a referenced resource either statically or asynchronously. If the host returns a
   * `Promise<string>` it is assumed the user of the corresponding `Program` will call
   * `loadNgStructureAsync()`. Returing  `Promise<string>` outside `loadNgStructureAsync()` will
   * cause a diagnostics diagnostic error or an exception to be thrown.
   *
   * If `loadResource()` is not provided, `readFile()` will be called to load the resource.
   */
  readResource?(fileName: string): Promise<string>|string;
}

export enum EmitFlags {
  DTS = 1 << 0,
  JS = 1 << 1,
  Metadata = 1 << 2,
  I18nBundle = 1 << 3,
  Summary = 1 << 4,

  Default = DTS | JS,
  All = DTS | JS | Metadata | I18nBundle | Summary
}

// TODO(chuckj): Support CustomTransformers once we require TypeScript 2.3+
// export interface CustomTransformers {
//   beforeTs?: ts.TransformerFactory<ts.SourceFile>[];
//   afterTs?: ts.TransformerFactory<ts.SourceFile>[];
// }

export interface Program {
  /**
   * Retrieve the TypeScript program used to produce semantic diagnostics and emit the sources.
   *
   * Angular structural information is required to produce the program.
   */
  getTsProgram(): ts.Program;

  /**
   * Retreive options diagnostics for the TypeScript options used to create the program. This is
   * faster than calling `getTsProgram().getOptionsDiagnostics()` since it does not need to
   * collect Angular structural information to produce the errors.
   */
  getTsOptionDiagnostics(cancellationToken?: ts.CancellationToken): ts.Diagnostic[];

  /**
   * Retrieve options diagnostics for the Angular options used to create the program.
   */
  getNgOptionDiagnostics(cancellationToken?: ts.CancellationToken): Diagnostic[];

  /**
   * Retrive the syntax diagnostics from TypeScript. This is faster than calling
   * `getTsProgram().getSyntacticDiagnostics()` since it does not need to collect Angular structural
   * information to produce the errors.
   */
  getTsSyntacticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken):
      ts.Diagnostic[];

  /**
   * Retrieve the diagnostics for the structure of an Angular application is correctly formed.
   * This includes validating Angular annotations and the syntax of referenced and imbedded HTML
   * and CSS.
   *
   * Note it is important to displaying TypeScript semantic diagnostics along with Angular
   * structural diagnostics as an error in the program strucutre might cause errors detected in
   * semantic analysis and a semantic error might cause errors in specifying the program structure.
   *
   * Angular structural information is required to produce these diagnostics.
   */
  getNgStructuralDiagnostics(cancellationToken?: ts.CancellationToken): Diagnostic[];

  /**
   * Retreive the semantic diagnostics from TypeScript. This is equivilent to calling
   * `getTsProgram().getSemanticDiagnostics()` directly and is included for completeness.
   */
  getTsSemanticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken):
      ts.Diagnostic[];

  /**
   * Retrieve the Angular semantic diagnostics.
   *
   * Angular structural information is required to produce these diagnostics.
   */
  getNgSemanticDiagnostics(fileName?: string, cancellationToken?: ts.CancellationToken):
      Diagnostic[];

  /**
   * Load Angular structural information asynchronously. If this method is not called then the
   * Angular structural information, including referenced HTML and CSS files, are loaded
   * synchronously. If the supplied Angular compiler host returns a promise from `loadResource()`
   * will produce a diagnostic error message or, `getTsProgram()` or `emit` to throw.
   */
  loadNgStructureAsync(): Promise<void>;

  /**
   * Retrieve the lazy route references in the program.
   *
   * Angular structural information is required to produce these routes.
   */
  getLazyRoutes(cancellationToken?: ts.CancellationToken): {[route: string]: string};

  /**
   * Emit the files requested by emitFlags implied by the program.
   *
   * Angular structural information is required to emit files.
   */
  emit({// transformers,
        emitFlags, cancellationToken}: {
    emitFlags: EmitFlags,
    // transformers?: CustomTransformers, // See TODO above
    cancellationToken?: ts.CancellationToken,
  }): void;
}
