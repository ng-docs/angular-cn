/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgtscProgram} from '@angular/compiler-cli';
import {PotentialImport} from '@angular/compiler-cli/private/migrations';
import {dirname, relative} from 'path';
import ts from 'typescript';

import {normalizePath} from '../../utils/change_tracker';
import {closestNode} from '../../utils/typescript/nodes';

/**
 * Map used to look up nodes based on their positions in a source file.
 *
 * Map 用于根据节点在源文件中的位置查找节点。
 *
 */
export type NodeLookup = Map<number, ts.Node[]>;

/**
 * Utility to type a class declaration with a name.
 *
 * 使用名称键入类声明的实用程序。
 *
 */
export type NamedClassDeclaration = ts.ClassDeclaration&{name: ts.Identifier};

/**
 * Text span of an AST node.
 *
 * AST 节点的文本跨度。
 *
 */
export type ReferenceSpan = [start: number, end: number];

/**
 * Mapping between a file name and spans for node references inside of it.
 *
 * 文件名和其中节点引用的跨度之间的映射。
 *
 */
export type ReferencesByFile = Map<string, ReferenceSpan[]>;

/**
 * Utility class used to track a one-to-many relationship where all the items are unique.
 *
 * 用于跟踪所有项目都是唯一的一对多关系的实用程序类。
 *
 */
export class UniqueItemTracker<K, V> {
  private _nodes = new Map<K, Set<V>>();

  track(key: K, item: V) {
    const set = this._nodes.get(key);

    if (set) {
      set.add(item);
    } else {
      this._nodes.set(key, new Set([item]));
    }
  }

  get(key: K): Set<V>|undefined {
    return this._nodes.get(key);
  }

  getEntries(): IterableIterator<[K, Set<V>]> {
    return this._nodes.entries();
  }
}

/**
 * Resolves references to nodes.
 *
 * 解析对节点的引用。
 *
 */
export class ReferenceResolver {
  private _languageService: ts.LanguageService|undefined;

  /**
   * If set, allows the language service to *only* read a specific file.
   * Used to speed up single-file lookups.
   */
  private _tempOnlyFile: string|null = null;

  constructor(
      private _program: NgtscProgram, private _host: ts.CompilerHost,
      private _rootFileNames: string[], private _basePath: string,
      private _excludedFiles?: RegExp) {}

  /**
   * Finds all references to a node within the entire project.
   *
   * 查找整个项目中对某个节点的所有引用。
   *
   */
  findReferencesInProject(node: ts.Node): ReferencesByFile {
    const languageService = this._getLanguageService();
    const fileName = node.getSourceFile().fileName;
    const start = node.getStart();
    let referencedSymbols: ts.ReferencedSymbol[];

    // The language service can throw if it fails to read a file.
    // Silently continue since we're making the lookup on a best effort basis.
    try {
      referencedSymbols = languageService.findReferences(fileName, start) || [];
    } catch (e: any) {
      console.error('Failed reference lookup for node ' + node.getText(), e.message);
      referencedSymbols = [];
    }

    const results: ReferencesByFile = new Map();

    for (const symbol of referencedSymbols) {
      for (const ref of symbol.references) {
        if (!ref.isDefinition || symbol.definition.kind === ts.ScriptElementKind.alias) {
          if (!results.has(ref.fileName)) {
            results.set(ref.fileName, []);
          }

          results.get(ref.fileName)!.push(
              [ref.textSpan.start, ref.textSpan.start + ref.textSpan.length]);
        }
      }
    }

    return results;
  }

  /**
   * Finds all references to a node within a single file.
   *
   * 在单个文件中查找对节点的所有引用。
   *
   */
  findSameFileReferences(node: ts.Node, fileName: string): ReferenceSpan[] {
    // Even though we're only passing in a single file into `getDocumentHighlights`, the language
    // service ends up traversing the entire project. Prevent it from reading any files aside from
    // the one we're interested in by intercepting it at the compiler host level.
    // This is an order of magnitude faster on a large project.
    this._tempOnlyFile = fileName;

    const nodeStart = node.getStart();
    const results: ReferenceSpan[] = [];
    let highlights: ts.DocumentHighlights[]|undefined;

    // The language service can throw if it fails to read a file.
    // Silently continue since we're making the lookup on a best effort basis.
    try {
      highlights =
          this._getLanguageService().getDocumentHighlights(fileName, nodeStart, [fileName]);
    } catch (e: any) {
      console.error('Failed reference lookup for node ' + node.getText(), e.message);
    }

    if (highlights) {
      for (const file of highlights) {
        // We are pretty much guaranteed to only have one match from the current file since it is
        // the only one being passed in `getDocumentHighlight`, but we check here just in case.
        if (file.fileName === fileName) {
          for (const {textSpan: {start, length}, kind} of file.highlightSpans) {
            if (kind !== ts.HighlightSpanKind.none) {
              results.push([start, start + length]);
            }
          }
        }
      }
    }

    // Restore full project access to the language service.
    this._tempOnlyFile = null;
    return results;
  }

  /** Used by the language service  */
  private _readFile(path: string) {
    if ((this._tempOnlyFile !== null && path !== this._tempOnlyFile) ||
        this._excludedFiles?.test(path)) {
      return '';
    }
    return this._host.readFile(path);
  }

  /** Gets a language service that can be used to perform lookups. */
  private _getLanguageService(): ts.LanguageService {
    if (!this._languageService) {
      const rootFileNames = this._rootFileNames.slice();

      this._program.getTsProgram().getSourceFiles().forEach(({fileName}) => {
        if (!this._excludedFiles?.test(fileName) && !rootFileNames.includes(fileName)) {
          rootFileNames.push(fileName);
        }
      });

      this._languageService = ts.createLanguageService(
          {
            getCompilationSettings: () => this._program.getTsProgram().getCompilerOptions(),
            getScriptFileNames: () => rootFileNames,
            // The files won't change so we can return the same version.
            getScriptVersion: () => '0',
            getScriptSnapshot: (path: string) => {
              const content = this._readFile(path);
              return content ? ts.ScriptSnapshot.fromString(content) : undefined;
            },
            getCurrentDirectory: () => this._basePath,
            getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
            readFile: path => this._readFile(path),
            fileExists: (path: string) => this._host.fileExists(path)
          },
          ts.createDocumentRegistry(), ts.LanguageServiceMode.PartialSemantic);
    }

    return this._languageService;
  }
}

/**
 * Creates a NodeLookup object from a source file.
 *
 * 从源文件创建一个 NodeLookup 对象。
 *
 */
export function getNodeLookup(sourceFile: ts.SourceFile): NodeLookup {
  const lookup: NodeLookup = new Map();

  sourceFile.forEachChild(function walk(node) {
    const nodesAtStart = lookup.get(node.getStart());

    if (nodesAtStart) {
      nodesAtStart.push(node);
    } else {
      lookup.set(node.getStart(), [node]);
    }

    node.forEachChild(walk);
  });

  return lookup;
}

/**
 * Converts node offsets to the nodes they correspond to.
 *
 * 将节点偏移量转换为它们对应的节点。
 *
 * @param lookup Data structure used to look up nodes at particular positions.
 *
 * 用于在特定位置查找节点的数据结构。
 *
 * @param offsets Offsets of the nodes.
 *
 * 节点的偏移量。
 *
 * @param results Set in which to store the results.
 *
 * 设置存储结果的位置。
 *
 */
export function offsetsToNodes(
    lookup: NodeLookup, offsets: ReferenceSpan[], results: Set<ts.Node>): Set<ts.Node> {
  for (const [start, end] of offsets) {
    const match = lookup.get(start)?.find(node => node.getEnd() === end);

    if (match) {
      results.add(match);
    }
  }

  return results;
}

/**
 * Finds the class declaration that is being referred to by a node.
 *
 * 查找节点引用的类声明。
 *
 * @param reference Node referring to a class declaration.
 *
 * 引用类声明的节点。
 *
 * @param typeChecker
 */
export function findClassDeclaration(
    reference: ts.Node, typeChecker: ts.TypeChecker): ts.ClassDeclaration|null {
  return typeChecker.getTypeAtLocation(reference).getSymbol()?.declarations?.find(
             ts.isClassDeclaration) ||
      null;
}

/**
 * Finds a property with a specific name in an object literal expression.
 *
 * 在对象文字表达式中查找具有特定名称的属性。
 *
 */
export function findLiteralProperty(literal: ts.ObjectLiteralExpression, name: string) {
  return literal.properties.find(
      prop => prop.name && ts.isIdentifier(prop.name) && prop.name.text === name);
}

/**
 * Gets a relative path between two files that can be used inside a TypeScript import.
 *
 * 获取可在 TypeScript 导入中使用的两个文件之间的相对路径。
 *
 */
export function getRelativeImportPath(fromFile: string, toFile: string): string {
  let path = relative(dirname(fromFile), toFile).replace(/\.ts$/, '');

  // `relative` returns paths inside the same directory without `./`
  if (!path.startsWith('.')) {
    path = './' + path;
  }

  // Using the Node utilities can yield paths with forward slashes on Windows.
  return normalizePath(path);
}

/**
 * Function used to remap the generated `imports` for a component to known shorter aliases.
 *
 * 用于将组件生成的 `imports` 重新映射到已知的较短别名的函数。
 *
 */
export function knownInternalAliasRemapper(imports: PotentialImport[]) {
  return imports.map(
      current => current.moduleSpecifier === '@angular/common' && current.symbolName === 'NgForOf' ?
          {...current, symbolName: 'NgFor'} :
          current);
}

/**
 * Gets the closest node that matches a predicate, including the node that the search started from.
 *
 * 获取与谓词匹配的最近节点，包括搜索开始的节点。
 *
 * @param node Node from which to start the search.
 *
 * 开始搜索的节点。
 *
 * @param predicate Predicate that the result needs to pass.
 *
 * 谓结果需要通过。
 *
 */
export function closestOrSelf<T extends ts.Node>(
    node: ts.Node, predicate: (n: ts.Node) => n is T): T|null {
  return predicate(node) ? node : closestNode(node, predicate);
}

/**
 * Checks whether a node is referring to a specific class declaration.
 *
 * 检查节点是否引用特定的类声明。
 *
 * @param node Node that is being checked.
 *
 * 正在检查的节点。
 *
 * @param className Name of the class that the node might be referring to.
 *
 * 节点可能引用的类的名称。
 *
 * @param moduleName Name of the Angular module that should contain the class.
 *
 * 应包含该类的 Angular 模块的名称。
 *
 * @param typeChecker
 */
export function isClassReferenceInAngularModule(
    node: ts.Node, className: string|RegExp, moduleName: string,
    typeChecker: ts.TypeChecker): boolean {
  const symbol = typeChecker.getTypeAtLocation(node).getSymbol();
  const externalName = `@angular/${moduleName}`;
  const internalName = `angular2/rc/packages/${moduleName}`;

  return !!symbol?.declarations?.some(decl => {
    const closestClass = closestOrSelf(decl, ts.isClassDeclaration);
    const closestClassFileName = closestClass?.getSourceFile().fileName;

    if (!closestClass || !closestClassFileName || !closestClass.name ||
        !ts.isIdentifier(closestClass.name) ||
        (!closestClassFileName.includes(externalName) &&
         !closestClassFileName.includes(internalName))) {
      return false;
    }

    return typeof className === 'string' ? closestClass.name.text === className :
                                           className.test(closestClass.name.text);
  });
}
