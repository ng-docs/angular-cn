/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import MagicString from 'magic-string';
import ts from 'typescript';

import {PathManipulation} from '../../../src/ngtsc/file_system';
import {Reexport} from '../../../src/ngtsc/imports';
import {Import, ImportManager} from '../../../src/ngtsc/translator';
import {ExportInfo} from '../analysis/private_declarations_analyzer';
import {UmdReflectionHost} from '../host/umd_host';

import {Esm5RenderingFormatter} from './esm5_rendering_formatter';
import {stripExtension} from './utils';

/**
 * A RenderingFormatter that works with UMD files, instead of `import` and `export` statements
 * the module is an IIFE with a factory function call with dependencies, which are defined in a
 * wrapper function for AMD, CommonJS and global module formats.
 *
 * 使用 UMD 文件的 RenderingFormatter ，而不是 `import` 和 `export` 语句，该模块是一个
 * IIFE，带有带有依赖项的工厂函数调用，这些依赖项是在 AMD、CommonJS
 * 和全局模块格式的包装器函数中定义的。
 *
 */
export class UmdRenderingFormatter extends Esm5RenderingFormatter {
  constructor(fs: PathManipulation, protected umdHost: UmdReflectionHost, isCore: boolean) {
    super(fs, umdHost, isCore);
  }

  /**
   * Add the imports to the UMD module IIFE.
   *
   * 将导入添加到 UMD 模块 IIFE。
   *
   * Note that imports at "prepended" to the start of the parameter list of the factory function,
   * and so also to the arguments passed to it when it is called.
   * This is because there are scenarios where the factory function does not accept as many
   * parameters as are passed as argument in the call. For example:
   *
   * 请注意，导入 at
   * “附加”到工厂函数的参数列表开头，以及调用时传递给它的参数。这是因为在某些情况下，工厂函数不接受在调用中作为参数传递的那么多参数。例如：
   *
   * ```
   * (function (global, factory) {
   *     typeof exports === 'object' && typeof module !== 'undefined' ?
   *         factory(exports,require('x'),require('z')) :
   *     typeof define === 'function' && define.amd ?
   *         define(['exports', 'x', 'z'], factory) :
   *     (global = global || self, factory(global.myBundle = {}, global.x));
   * }(this, (function (exports, x) { ... }
   * ```
   *
   * (See that the `z` import is not being used by the factory function.)
   *
   * （请参阅工厂函数没有使用 `z` 导入。）
   *
   */
  override addImports(output: MagicString, imports: Import[], file: ts.SourceFile): void {
    if (imports.length === 0) {
      return;
    }

    // Assume there is only one UMD module in the file
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }

    const {factoryFn, factoryCalls} = umdModule;

    // We need to add new `require()` calls for each import in the CommonJS initializer
    renderCommonJsDependencies(output, factoryCalls.commonJs, imports);
    renderCommonJsDependencies(output, factoryCalls.commonJs2, imports);
    renderAmdDependencies(output, factoryCalls.amdDefine, imports);
    renderGlobalDependencies(output, factoryCalls.global, imports);
    renderFactoryParameters(output, factoryFn, imports);
  }

  /**
   * Add the exports to the bottom of the UMD module factory function.
   *
   * 将导出添加到 UMD 模块工厂函数的底部。
   *
   */
  override addExports(
      output: MagicString, entryPointBasePath: string, exports: ExportInfo[],
      importManager: ImportManager, file: ts.SourceFile): void {
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }
    const factoryFunction = umdModule.factoryFn;
    const lastStatement =
        factoryFunction.body.statements[factoryFunction.body.statements.length - 1];
    const insertionPoint =
        lastStatement ? lastStatement.getEnd() : factoryFunction.body.getEnd() - 1;
    exports.forEach(e => {
      const basePath = stripExtension(e.from);
      const relativePath = './' + this.fs.relative(this.fs.dirname(entryPointBasePath), basePath);
      const namedImport = entryPointBasePath !== basePath ?
          importManager.generateNamedImport(relativePath, e.identifier) :
          {symbol: e.identifier, moduleImport: null};
      const importNamespace = namedImport.moduleImport ? `${namedImport.moduleImport.text}.` : '';
      const exportStr = `\nexports.${e.identifier} = ${importNamespace}${namedImport.symbol};`;
      output.appendRight(insertionPoint, exportStr);
    });
  }

  override addDirectExports(
      output: MagicString, exports: Reexport[], importManager: ImportManager,
      file: ts.SourceFile): void {
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }
    const factoryFunction = umdModule.factoryFn;
    const lastStatement =
        factoryFunction.body.statements[factoryFunction.body.statements.length - 1];
    const insertionPoint =
        lastStatement ? lastStatement.getEnd() : factoryFunction.body.getEnd() - 1;
    for (const e of exports) {
      const namedImport = importManager.generateNamedImport(e.fromModule, e.symbolName);
      const importNamespace = namedImport.moduleImport ? `${namedImport.moduleImport.text}.` : '';
      const exportStr = `\nexports.${e.asAlias} = ${importNamespace}${namedImport.symbol};`;
      output.appendRight(insertionPoint, exportStr);
    }
  }

  /**
   * Add the constants to the top of the UMD factory function.
   *
   * 将常量添加到 UMD 工厂函数的顶部。
   *
   */
  override addConstants(output: MagicString, constants: string, file: ts.SourceFile): void {
    if (constants === '') {
      return;
    }
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }
    const factoryFunction = umdModule.factoryFn;
    const firstStatement = factoryFunction.body.statements[0];
    const insertionPoint =
        firstStatement ? firstStatement.getStart() : factoryFunction.body.getStart() + 1;
    output.appendLeft(insertionPoint, '\n' + constants + '\n');
  }
}

/**
 * Add dependencies to the CommonJS/CommonJS2 part of the UMD wrapper function.
 *
 * 将依赖项添加到 UMD 包装器函数的 CommonJS/CommonJS2 部分。
 *
 */
function renderCommonJsDependencies(
    output: MagicString, factoryCall: ts.CallExpression|null, imports: Import[]) {
  if (factoryCall === null) {
    return;
  }

  const injectionPoint = factoryCall.arguments.length > 0 ?
      // Add extra dependencies before the first argument
      factoryCall.arguments[0].getFullStart() :
      // Backup one char to account for the closing parenthesis on the call
      factoryCall.getEnd() - 1;
  const importString = imports.map(i => `require('${i.specifier}')`).join(',');
  output.appendLeft(injectionPoint, importString + (factoryCall.arguments.length > 0 ? ',' : ''));
}

/**
 * Add dependencies to the AMD part of the UMD wrapper function.
 *
 * 将依赖项添加到 UMD 包装器函数的 AMD 部分。
 *
 */
function renderAmdDependencies(
    output: MagicString, amdDefineCall: ts.CallExpression|null, imports: Import[]) {
  if (amdDefineCall === null) {
    return;
  }

  const importString = imports.map(i => `'${i.specifier}'`).join(',');
  // The dependency array (if it exists) is the second to last argument
  // `define(id?, dependencies?, factory);`
  const factoryIndex = amdDefineCall.arguments.length - 1;
  const dependencyArray = amdDefineCall.arguments[factoryIndex - 1];
  if (dependencyArray === undefined || !ts.isArrayLiteralExpression(dependencyArray)) {
    // No array provided: `define(factory)` or `define(id, factory)`.
    // Insert a new array in front the `factory` call.
    const injectionPoint = amdDefineCall.arguments[factoryIndex].getFullStart();
    output.appendLeft(injectionPoint, `[${importString}],`);
  } else {
    // Already an array
    const injectionPoint = dependencyArray.elements.length > 0 ?
        // Add imports before the first item.
        dependencyArray.elements[0].getFullStart() :
        // Backup one char to account for the closing square bracket on the array
        dependencyArray.getEnd() - 1;
    output.appendLeft(
        injectionPoint, importString + (dependencyArray.elements.length > 0 ? ',' : ''));
  }
}

/**
 * Add dependencies to the global part of the UMD wrapper function.
 *
 * 将依赖项添加到 UMD 包装器函数的全局部分。
 *
 */
function renderGlobalDependencies(
    output: MagicString, factoryCall: ts.CallExpression|null, imports: Import[]) {
  if (factoryCall === null) {
    return;
  }

  const injectionPoint = factoryCall.arguments.length > 0 ?
      // Add extra dependencies before the first argument
      factoryCall.arguments[0].getFullStart() :
      // Backup one char to account for the closing parenthesis on the call
      factoryCall.getEnd() - 1;
  const importString = imports.map(i => `global.${getGlobalIdentifier(i)}`).join(',');
  output.appendLeft(injectionPoint, importString + (factoryCall.arguments.length > 0 ? ',' : ''));
}

/**
 * Add dependency parameters to the UMD factory function.
 *
 * 将依赖参数添加到 UMD 工厂函数。
 *
 */
function renderFactoryParameters(
    output: MagicString, factoryFunction: ts.FunctionExpression, imports: Import[]) {
  const parameters = factoryFunction.parameters;
  const parameterString = imports.map(i => i.qualifier.text).join(',');
  if (parameters.length > 0) {
    const injectionPoint = parameters[0].getFullStart();
    output.appendLeft(injectionPoint, parameterString + ',');
  } else {
    // If there are no parameters then the factory function will look like:
    // function () { ... }
    // The AST does not give us a way to find the insertion point - between the two parentheses.
    // So we must use a regular expression on the text of the function.
    const injectionPoint = factoryFunction.getStart() + factoryFunction.getText().indexOf('()') + 1;
    output.appendLeft(injectionPoint, parameterString);
  }
}

/**
 * Compute a global identifier for the given import (`i`).
 *
 * 计算给定导入 ( `i` ) 的全局标识符。
 *
 * The identifier used to access a package when using the "global" form of a UMD bundle usually
 * follows a special format where snake-case is conveted to camelCase and path separators are
 * converted to dots. In addition there are special cases such as `@angular` is mapped to `ng`.
 *
 * 使用 UMD 包的“全局”形式时用于访问包的标识符通常遵循一种特殊的格式，其中的 snake-case 被转换为
 * camelCase ，并且路径分隔符被转换为点号。此外，还有一些特殊情况，例如 `@angular` 映射到 `ng` 。
 *
 * For example
 *
 * 例如
 *
 * * `@ns/package/entry-point` => `ns.package.entryPoint`
 *
 * * `@angular/common/testing` => `ng.common.testing`
 *
 * * `@angular/platform-browser-dynamic` => `ng.platformBrowserDynamic`
 *
 * It is possible for packages to specify completely different identifiers for attaching the package
 * to the global, and so there is no guaranteed way to compute this.
 * Currently, this approach appears to work for the known scenarios; also it is not known how common
 * it is to use globals for importing packages.
 *
 * 包可以指定完全不同的标识符来将包附加到全局，因此没有保证的方式来计算它。目前，这种方法似乎适用于已知的场景；此外，不知道使用全局变量导入包的常见程度。
 *
 * If it turns out that there are packages that are being used via globals, where this approach
 * fails, we should consider implementing a configuration based solution, similar to what would go
 * in a rollup configuration for mapping import paths to global indentifiers.
 *
 * 如果事实证明是通过全局变量使用的包，而这种方法失败了，我们应该考虑实现基于配置的解决方案，类似于在汇总配置中将导入路径映射到全局标识符的方式。
 *
 */
function getGlobalIdentifier(i: Import): string {
  return i.specifier.replace(/^@angular\//, 'ng.')
      .replace(/^@/, '')
      .replace(/\//g, '.')
      .replace(/[-_]+(.?)/g, (_, c) => c.toUpperCase())
      .replace(/^./, c => c.toLowerCase());
}
