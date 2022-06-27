/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {hasNameIdentifier} from '../utils';

/**
 * Consider the following ES5 code that may have been generated for a class:
 *
 * 考虑可能已经为类生成的以下 ES5 代码：
 *
 * ```
 * var A = (function(){
 *   function A() {}
 *   return A;
 * }());
 * A.staticProp = true;
 * ```
 *
 * Here, TypeScript marks the symbol for "A" as a so-called "expando symbol", which causes
 * "staticProp" to be added as an export of the "A" symbol.
 *
 * 在这里，TypeScript 将“A”的符号标记为所谓的“expando
 * Symbol”，这会导致“staticProp”作为“A”符号的导出添加。
 *
 * In the example above, symbol "A" has been assigned some flags to indicate that it represents a
 * class. Due to this flag, the symbol is considered an expando symbol and as such, "staticProp" is
 * stored in `ts.Symbol.exports`.
 *
 * 在上面的示例中，符号“A”被分配了一些标志，以表明它代表一个类。由于此标志，该符号被认为是 expando
 * 符号，因此，“staticProp”存储在 `ts.Symbol.exports` 中。
 *
 * A problem arises when "A" is not at the top-level, i.e. in UMD bundles. In that case, the symbol
 * does not have the flag that marks the symbol as a class. Therefore, TypeScript inspects "A"'s
 * initializer expression, which is an IIFE in the above example. Unfortunately however, only IIFEs
 * of the form `(function(){})()` qualify as initializer for an "expando symbol"; the slightly
 * different form seen in the example above, `(function(){}())`, does not. This prevents the "A"
 * symbol from being considered an expando symbol, in turn preventing "staticProp" from being stored
 * in `ts.Symbol.exports`.
 *
 * 当“A”不在顶级时，即在 UMD
 * 包中，会出现问题。在这种情况下，该符号没有将其标记为类的标志。因此，TypeScript
 * 会检查“A”的初始化表达式，在上面的示例中是 IIFE。然而不幸的是，只有 `(function(){})()` 形式的 IIFE
 * 有资格作为“扩展符号”的初始化器；在上面的示例中看到的略有不同的形式 `(function(){}())`
 * 则不是。这可以防止“A”符号被认为是 expando 符号，从而防止“staticProp”存储在 `ts.Symbol.exports`
 * 中。
 *
 * The logic for identifying symbols as "expando symbols" can be found here:
 * <https://github.com/microsoft/TypeScript/blob/v3.4.5/src/compiler/binder.ts#L2656-L2685>
 *
 * 将符号标识为“扩展符号”的逻辑可以在此找到：
 * <https://github.com/microsoft/TypeScript/blob/v3.4.5/src/compiler/binder.ts#L2656-L2685>
 *
 * Notice how the `getExpandoInitializer` function is available on the "ts" namespace in the
 * compiled bundle, so we are able to override this function to accommodate for the alternative
 * IIFE notation. The original implementation can be found at:
 * <https://github.com/Microsoft/TypeScript/blob/v3.4.5/src/compiler/utilities.ts#L1864-L1887>
 *
 * 请注意 `getExpandoInitializer`
 * 函数在已编译包的“ts”命名空间中是如何可用的，因此我们可以覆盖此函数以适应另一种 IIFE
 * 表示法。原始实现可在以下位置找到：<https://github.com/Microsoft/TypeScript/blob/v3.4.5/src/compiler/utilities.ts#L1864-L1887>
 *
 * Issue tracked in <https://github.com/microsoft/TypeScript/issues/31778>
 *
 * 在<https://github.com/microsoft/TypeScript/issues/31778>中跟踪的问题
 *
 * @returns
 *
 * the function to pass to `restoreGetExpandoInitializer` to undo the patch, or null if
 * the issue is known to have been fixed.
 *
 * 要传递给 `restoreGetExpandoInitializer` 以撤消补丁的函数，如果已知问题已修复，则为 null 。
 *
 */
export function patchTsGetExpandoInitializer(): unknown {
  if (isTs31778GetExpandoInitializerFixed()) {
    return null;
  }

  const originalGetExpandoInitializer = (ts as any).getExpandoInitializer;
  if (originalGetExpandoInitializer === undefined) {
    throw makeUnsupportedTypeScriptError();
  }

  // Override the function to add support for recognizing the IIFE structure used in ES5 bundles.
  (ts as any).getExpandoInitializer = (initializer: ts.Node,
                                       isPrototypeAssignment: boolean): ts.Expression|undefined => {
    // If the initializer is a call expression within parenthesis, unwrap the parenthesis
    // upfront such that unsupported IIFE syntax `(function(){}())` becomes `function(){}()`,
    // which is supported.
    if (ts.isParenthesizedExpression(initializer) && ts.isCallExpression(initializer.expression)) {
      initializer = initializer.expression;
    }
    return originalGetExpandoInitializer(initializer, isPrototypeAssignment);
  };
  return originalGetExpandoInitializer;
}

export function restoreGetExpandoInitializer(originalGetExpandoInitializer: unknown): void {
  if (originalGetExpandoInitializer !== null) {
    (ts as any).getExpandoInitializer = originalGetExpandoInitializer;
  }
}

let ts31778FixedResult: boolean|null = null;

function isTs31778GetExpandoInitializerFixed(): boolean {
  // If the result has already been computed, return early.
  if (ts31778FixedResult !== null) {
    return ts31778FixedResult;
  }

  // Determine if the issue has been fixed by checking if an expando property is present in a
  // minimum reproduction using unpatched TypeScript.
  ts31778FixedResult = checkIfExpandoPropertyIsPresent();

  // If the issue does not appear to have been fixed, verify that applying the patch has the desired
  // effect.
  if (!ts31778FixedResult) {
    const originalGetExpandoInitializer = patchTsGetExpandoInitializer();
    try {
      const patchIsSuccessful = checkIfExpandoPropertyIsPresent();
      if (!patchIsSuccessful) {
        throw makeUnsupportedTypeScriptError();
      }
    } finally {
      restoreGetExpandoInitializer(originalGetExpandoInitializer);
    }
  }

  return ts31778FixedResult;
}

/**
 * Verifies whether TS issue 31778 has been fixed by inspecting a symbol from a minimum
 * reproduction. If the symbol does in fact have the "expando" as export, the issue has been fixed.
 *
 * 通过检查最小复制品中的符号来验证 TS 问题 31778
 * 是否已修复。如果该符号实际上具有“expando”作为导出，则问题已解决。
 *
 * See <https://github.com/microsoft/TypeScript/issues/31778> for details.
 *
 * 有关详细信息，请参阅<https://github.com/microsoft/TypeScript/issues/31778> 。
 *
 */
function checkIfExpandoPropertyIsPresent(): boolean {
  const sourceText = `
    (function() {
      var A = (function() {
        function A() {}
        return A;
      }());
      A.expando = true;
    }());`;
  const sourceFile =
      ts.createSourceFile('test.js', sourceText, ts.ScriptTarget.ES5, true, ts.ScriptKind.JS);
  const host: ts.CompilerHost = {
    getSourceFile(): ts.SourceFile |
        undefined {
          return sourceFile;
        },
    fileExists(): boolean {
      return true;
    },
    readFile(): string |
        undefined {
          return '';
        },
    writeFile() {},
    getDefaultLibFileName(): string {
      return '';
    },
    getCurrentDirectory(): string {
      return '';
    },
    getDirectories(): string[] {
      return [];
    },
    getCanonicalFileName(fileName: string): string {
      return fileName;
    },
    useCaseSensitiveFileNames(): boolean {
      return true;
    },
    getNewLine(): string {
      return '\n';
    },
  };
  const options = {noResolve: true, noLib: true, noEmit: true, allowJs: true};
  const program = ts.createProgram(['test.js'], options, host);

  function visitor(node: ts.Node): ts.VariableDeclaration|undefined {
    if (ts.isVariableDeclaration(node) && hasNameIdentifier(node) && node.name.text === 'A') {
      return node;
    }
    return ts.forEachChild(node, visitor);
  }

  const declaration = ts.forEachChild(sourceFile, visitor);
  if (declaration === undefined) {
    throw new Error('Unable to find declaration of outer A');
  }

  const symbol = program.getTypeChecker().getSymbolAtLocation(declaration.name);
  if (symbol === undefined) {
    throw new Error('Unable to resolve symbol of outer A');
  }
  return symbol.exports !== undefined && symbol.exports.has('expando' as ts.__String);
}

function makeUnsupportedTypeScriptError(): Error {
  return new Error('The TypeScript version used is not supported by ngcc.');
}
