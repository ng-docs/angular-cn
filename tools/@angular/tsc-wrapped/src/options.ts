/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';

interface Options extends ts.CompilerOptions {
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

  // Whether to generate a bundle index of the given name and the corresponding bundled
  // metadata. This option is intended to be used when creating library bundles similar
  // to how `@angular/core` and `@angular/common` are generated.
  // When this option is used the `package.json` for the library should refered to the
  // generated bundle index instead of the library index file. Only the bundle index
  // metadata is required as the bundle index contains all metadata visible from the
  // bundle index. The bundle index is used to import symbols for generating
  // .ngfactory.ts files and includes both the public API from the root .ts file as well
  // as shrowded internal symbols.
  // The by default the .ts file supplied in the `files` files field is assumed to be
  // library index. If more than one is specified, uses `libraryIndex` to select the
  // file to use. If more than on .ts file is supplied and no `libraryIndex` is supllied
  // an error is produced.
  // A bundle index .d.ts and .js will be created with the given `bundleIndex` name in the
  // same location as the library index .d.ts file is emitted.
  // For example, if a library uses `index.ts` file as the root file, the `tsconfig.json`
  // `files` field would be `["index.ts"]`. The `bundleIndex` options could then be set
  // to, for example `"bundle_index"`, which produces a `bundle_index.d.ts` and
  // `bundle_index.metadata.json` files. The library's `package.json`'s `module` field
  // would be `"bundle_index.js"` and the `typings` field would be `"bundle_index.d.ts"`.
  bundleIndex?: string;

  // Override which module is used as the library index. This is only meaningful if
  // `bundleIndex` is also supplied and only necessary if more than one `.ts` file is
  // supplied in the `files` field. This must be of the form found in a import
  // declaration. For example, if the library index is in `index.ts` then the
  // `libraryIndex` field should be `"./index"`.
  libraryIndex?: string;

  // Preferred module name to use for importing the generated bundle. References
  // generated by `ngc` will use this module name when importing symbols from the
  // generated bundle. This is only meaningful when `bundleIndex` is also supplied. It is
  // otherwise ignored.
  importAs?: string;

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

  // Whether to embed debug information in the compiled templates
  debug?: boolean;
}

export default Options;
