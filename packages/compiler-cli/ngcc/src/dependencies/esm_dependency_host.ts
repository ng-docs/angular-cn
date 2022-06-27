/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';

import {DependencyHostBase} from './dependency_host';
import {ModuleResolver} from './module_resolver';

/**
 * Helper functions for computing dependencies.
 *
 * 用于计算依赖项的帮助函数。
 *
 */
export class EsmDependencyHost extends DependencyHostBase {
  constructor(
      fs: ReadonlyFileSystem, moduleResolver: ModuleResolver,
      private scanImportExpressions = true) {
    super(fs, moduleResolver);
  }
  // By skipping trivia here we don't have to account for it in the processing below
  // It has no relevance to capturing imports.
  private scanner = ts.createScanner(ts.ScriptTarget.Latest, /* skipTrivia */ true);

  protected override canSkipFile(fileContents: string): boolean {
    return !hasImportOrReexportStatements(fileContents);
  }

  /**
   * Extract any import paths from imports found in the contents of this file.
   *
   * 从此文件内容中找到的导入中提取任何导入路径。
   *
   * This implementation uses the TypeScript scanner, which tokenizes source code,
   * to process the string. This is halfway between working with the string directly,
   * which is too difficult due to corner cases, and parsing the string into a full
   * TypeScript Abstract Syntax Tree (AST), which ends up doing more processing than
   * is needed.
   *
   * 此实现使用对源代码进行标记化的 TypeScript
   * 扫描器来处理字符串。这是直接使用字符串（由于极端情况而太难）和将字符串解析为完整的 TypeScript
   * 抽象语法树（ AST ）之间的中间，后者最终会进行比需要更多的处理。
   *
   * The scanning is not trivial because we must hold state between each token since
   * the context of the token affects how it should be scanned, and the scanner does
   * not manage this for us.
   *
   * 扫描并非易事，因为我们必须在每个标记之间保持状态，因为标记的上下文会影响它的扫描方式，并且扫描器不会为我们管理这个。
   *
   * Specifically, backticked strings are particularly challenging since it is possible
   * to recursively nest backticks and TypeScript expressions within each other.
   *
   * 具体来说，带有反引号的字符串特别具有挑战性，因为可以将反引号和 TypeScript 表达式彼此递归嵌套。
   *
   */
  protected override extractImports(file: AbsoluteFsPath, fileContents: string): Set<string> {
    const imports = new Set<string>();
    const templateStack: ts.SyntaxKind[] = [];
    let lastToken: ts.SyntaxKind = ts.SyntaxKind.Unknown;
    let currentToken: ts.SyntaxKind = ts.SyntaxKind.Unknown;
    const stopAtIndex = findLastPossibleImportOrReexport(fileContents);

    this.scanner.setText(fileContents);

    while ((currentToken = this.scanner.scan()) !== ts.SyntaxKind.EndOfFileToken) {
      if (this.scanner.getTokenPos() > stopAtIndex) {
        break;
      }
      switch (currentToken) {
        case ts.SyntaxKind.TemplateHead:
          // TemplateHead indicates the beginning of a backticked string
          // Capture this in the `templateStack` to indicate we are currently processing
          // within the static text part of a backticked string.
          templateStack.push(currentToken);
          break;
        case ts.SyntaxKind.OpenBraceToken:
          if (templateStack.length > 0) {
            // We are processing a backticked string. This indicates that we are either
            // entering an interpolation expression or entering an object literal expression.
            // We add it to the `templateStack` so we can track when we leave the interpolation or
            // object literal.
            templateStack.push(currentToken);
          }
          break;
        case ts.SyntaxKind.CloseBraceToken:
          if (templateStack.length > 0) {
            // We are processing a backticked string then this indicates that we are either
            // leaving an interpolation expression or leaving an object literal expression.
            const templateToken = templateStack[templateStack.length - 1];
            if (templateToken === ts.SyntaxKind.TemplateHead) {
              // We have hit a nested backticked string so we need to rescan it in that context
              currentToken = this.scanner.reScanTemplateToken(/* isTaggedTemplate */ false);
              if (currentToken === ts.SyntaxKind.TemplateTail) {
                // We got to the end of the backticked string so pop the token that started it off
                // the stack.
                templateStack.pop();
              }
            } else {
              // We hit the end of an object-literal expression so pop the open-brace that started
              // it off the stack.
              templateStack.pop();
            }
          }
          break;
        case ts.SyntaxKind.SlashToken:
        case ts.SyntaxKind.SlashEqualsToken:
          if (canPrecedeARegex(lastToken)) {
            // We have hit a slash (`/`) in a context where it could be the start of a regular
            // expression so rescan it in that context
            currentToken = this.scanner.reScanSlashToken();
          }
          break;
        case ts.SyntaxKind.ImportKeyword:
          const importPath = this.extractImportPath();
          if (importPath !== null) {
            imports.add(importPath);
          }
          break;
        case ts.SyntaxKind.ExportKeyword:
          const reexportPath = this.extractReexportPath();
          if (reexportPath !== null) {
            imports.add(reexportPath);
          }
          break;
      }
      lastToken = currentToken;
    }

    // Clear the text from the scanner to avoid holding on to potentially large strings of source
    // content after the scanning has completed.
    this.scanner.setText('');

    return imports;
  }


  /**
   * We have found an `import` token so now try to identify the import path.
   *
   * 我们找到了一个 `import` 标记，因此现在尝试识别导入路径。
   *
   * This method will use the current state of `this.scanner` to extract a string literal module
   * specifier. It expects that the current state of the scanner is that an `import` token has just
   * been scanned.
   *
   * 此方法将使用 `this.scanner`
   * 的当前状态来提取字符串文字模块说明符。它期望扫描器的当前状态是刚刚扫描了 `import` 标记。
   *
   * The following forms of import are matched:
   *
   * 匹配以下形式的导入：
   *
   * * `import "module-specifier";`
   *
   * * `import("module-specifier")`
   *
   * * `import defaultBinding from "module-specifier";`
   *
   * * `import defaultBinding, * as identifier from "module-specifier";`
   *
   * * `import defaultBinding, {...} from "module-specifier";`
   *
   * * `import * as identifier from "module-specifier";`
   *
   * * `import {...} from "module-specifier";`
   *
   * @returns
   *
   * the import path or null if there is no import or it is not a string literal.
   *
   * 导入路径；如果没有导入或者它不是字符串文字，则为 null 。
   *
   */
  protected extractImportPath(): string|null {
    // Check for side-effect import
    let sideEffectImportPath = this.tryStringLiteral();
    if (sideEffectImportPath !== null) {
      return sideEffectImportPath;
    }

    let kind: ts.SyntaxKind|null = this.scanner.getToken();

    // Check for dynamic import expression
    if (kind === ts.SyntaxKind.OpenParenToken) {
      return this.scanImportExpressions ? this.tryStringLiteral() : null;
    }

    // Check for defaultBinding
    if (kind === ts.SyntaxKind.Identifier) {
      // Skip default binding
      kind = this.scanner.scan();
      if (kind === ts.SyntaxKind.CommaToken) {
        // Skip comma that indicates additional import bindings
        kind = this.scanner.scan();
      }
    }

    // Check for namespace import clause
    if (kind === ts.SyntaxKind.AsteriskToken) {
      kind = this.skipNamespacedClause();
      if (kind === null) {
        return null;
      }
    }
    // Check for named imports clause
    else if (kind === ts.SyntaxKind.OpenBraceToken) {
      kind = this.skipNamedClause();
    }

    // Expect a `from` clause, if not bail out
    if (kind !== ts.SyntaxKind.FromKeyword) {
      return null;
    }

    return this.tryStringLiteral();
  }

  /**
   * We have found an `export` token so now try to identify a re-export path.
   *
   * 我们找到了一个 `export` 标记，因此现在尝试识别重新导出路径。
   *
   * This method will use the current state of `this.scanner` to extract a string literal module
   * specifier. It expects that the current state of the scanner is that an `export` token has
   * just been scanned.
   *
   * 此方法将使用 `this.scanner`
   * 的当前状态来提取字符串文字模块说明符。它期望扫描器的当前状态是刚刚扫描了 `export` 标记。
   *
   * There are three forms of re-export that are matched:
   *
   * 匹配了三种形式的再导出：
   *
   * * \`export \* from '...';
   *
   * * \`export \* as alias from '...';
   *
   * * \`export {...} from '...';
   *
   */
  protected extractReexportPath(): string|null {
    // Skip the `export` keyword
    let token: ts.SyntaxKind|null = this.scanner.scan();
    if (token === ts.SyntaxKind.AsteriskToken) {
      token = this.skipNamespacedClause();
      if (token === null) {
        return null;
      }
    } else if (token === ts.SyntaxKind.OpenBraceToken) {
      token = this.skipNamedClause();
    }
    // Expect a `from` clause, if not bail out
    if (token !== ts.SyntaxKind.FromKeyword) {
      return null;
    }
    return this.tryStringLiteral();
  }

  protected skipNamespacedClause(): ts.SyntaxKind|null {
    // Skip past the `*`
    let token = this.scanner.scan();
    // Check for a `* as identifier` alias clause
    if (token === ts.SyntaxKind.AsKeyword) {
      // Skip past the `as` keyword
      token = this.scanner.scan();
      // Expect an identifier, if not bail out
      if (token !== ts.SyntaxKind.Identifier) {
        return null;
      }
      // Skip past the identifier
      token = this.scanner.scan();
    }
    return token;
  }

  protected skipNamedClause(): ts.SyntaxKind {
    let braceCount = 1;
    // Skip past the initial opening brace `{`
    let token = this.scanner.scan();
    // Search for the matching closing brace `}`
    while (braceCount > 0 && token !== ts.SyntaxKind.EndOfFileToken) {
      if (token === ts.SyntaxKind.OpenBraceToken) {
        braceCount++;
      } else if (token === ts.SyntaxKind.CloseBraceToken) {
        braceCount--;
      }
      token = this.scanner.scan();
    }
    return token;
  }

  protected tryStringLiteral(): string|null {
    return this.scanner.scan() === ts.SyntaxKind.StringLiteral ? this.scanner.getTokenValue() :
                                                                 null;
  }
}

/**
 * Check whether a source file needs to be parsed for imports.
 * This is a performance short-circuit, which saves us from creating
 * a TypeScript AST unnecessarily.
 *
 * 检查是否需要解析源文件以进行导入。这是一个性能短路，它使我们免于创建不必要的 TypeScript AST。
 *
 * @param source The content of the source file to check.
 *
 * 要检查的源文件的内容。
 *
 * @returns
 *
 * false if there are definitely no import or re-export statements
 * in this file, true otherwise.
 *
 * 如果此文件中绝对没有 import 或 re-export 语句，则为 false ，否则为 true 。
 *
 */
export function hasImportOrReexportStatements(source: string): boolean {
  return /(?:import|export)[\s\S]+?(["'])(?:\\\1|.)+?\1/.test(source);
}

function findLastPossibleImportOrReexport(source: string): number {
  return Math.max(source.lastIndexOf('import'), source.lastIndexOf(' from '));
}

/**
 * Check whether the given statement is an import with a string literal module specifier.
 *
 * 检查给定的语句是否是使用字符串文字模块说明符的导入。
 *
 * @param stmt the statement node to check.
 *
 * 要检查的语句节点。
 *
 * @returns
 *
 * true if the statement is an import with a string literal module specifier.
 *
 * 如果该语句是使用字符串文字模块说明符的导入，则为 true 。
 *
 */
export function isStringImportOrReexport(stmt: ts.Statement): stmt is ts.ImportDeclaration&
    {moduleSpecifier: ts.StringLiteral} {
  return ts.isImportDeclaration(stmt) ||
      ts.isExportDeclaration(stmt) && !!stmt.moduleSpecifier &&
      ts.isStringLiteral(stmt.moduleSpecifier);
}


function canPrecedeARegex(kind: ts.SyntaxKind): boolean {
  switch (kind) {
    case ts.SyntaxKind.Identifier:
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NumericLiteral:
    case ts.SyntaxKind.BigIntLiteral:
    case ts.SyntaxKind.RegularExpressionLiteral:
    case ts.SyntaxKind.ThisKeyword:
    case ts.SyntaxKind.PlusPlusToken:
    case ts.SyntaxKind.MinusMinusToken:
    case ts.SyntaxKind.CloseParenToken:
    case ts.SyntaxKind.CloseBracketToken:
    case ts.SyntaxKind.CloseBraceToken:
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
      return false;
    default:
      return true;
  }
}
