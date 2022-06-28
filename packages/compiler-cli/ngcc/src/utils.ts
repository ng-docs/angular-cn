/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {absoluteFrom, AbsoluteFsPath, isRooted, ReadonlyFileSystem} from '../../src/ngtsc/file_system';
import {DeclarationNode, KnownDeclaration} from '../../src/ngtsc/reflection';

export type JsonPrimitive = string|number|boolean|null;
export type JsonValue = JsonPrimitive|JsonArray|JsonObject|undefined;
export interface JsonArray extends Array<JsonValue> {}
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * A list (`Array`) of partially ordered `T` items.
 *
 * 偏序 `T` 项的列表 ( `Array` )。
 *
 * The items in the list are partially ordered in the sense that any element has either the same or
 * higher precedence than any element which appears later in the list. What "higher precedence"
 * means and how it is determined is implementation-dependent.
 *
 * 列表中的条目是部分排序的，因为任何元素都具有与列表中靠后出现的任何元素相同或更高的优先级。
 * “更高优先级”是什么意思以及如何确定它取决于实现。
 *
 * See [PartiallyOrderedSet](https://en.wikipedia.org/wiki/Partially_ordered_set) for more details.
 * (Refraining from using the term "set" here, to avoid confusion with JavaScript's
 * [Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set).)
 *
 * 有关更多详细信息，请参阅[PartiallyOrderedSet](https://en.wikipedia.org/wiki/Partially_ordered_set)
 * 。（在这里避免使用术语“set”，以避免与 JavaScript
 * 的[Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)混淆。）
 *
 * NOTE: A plain `Array<T>` is not assignable to a `PartiallyOrderedList<T>`, but a
 *       `PartiallyOrderedList<T>` is assignable to an `Array<T>`.
 *
 * 注意：普通的 `Array<T>` 不能分配给 `PartiallyOrderedList<T>` ，但 `PartiallyOrderedList<T>`
 * 可以分配给 `Array<T>` 。
 *
 */
export interface PartiallyOrderedList<T> extends Array<T> {
  _partiallyOrdered: true;

  map<U>(callbackfn: (value: T, index: number, array: PartiallyOrderedList<T>) => U, thisArg?: any):
      PartiallyOrderedList<U>;
  slice(...args: Parameters<Array<T>['slice']>): PartiallyOrderedList<T>;
}

export function getOriginalSymbol(checker: ts.TypeChecker): (symbol: ts.Symbol) => ts.Symbol {
  return function(symbol: ts.Symbol) {
    return ts.SymbolFlags.Alias & symbol.flags ? checker.getAliasedSymbol(symbol) : symbol;
  };
}

export function isDefined<T>(value: T|undefined|null): value is T {
  return (value !== undefined) && (value !== null);
}

export function getNameText(name: ts.PropertyName|ts.BindingName): string {
  return ts.isIdentifier(name) || ts.isLiteralExpression(name) ? name.text : name.getText();
}

/**
 * Does the given declaration have a name which is an identifier?
 *
 * 给定的声明是否有一个作为标识符的名称？
 *
 * @param declaration The declaration to test.
 *
 * 要测试的声明。
 *
 * @returns
 *
 * true if the declaration has an identifier for a name.
 *
 * 如果声明具有名称的标识符，则为 true 。
 *
 */
export function hasNameIdentifier(declaration: ts.Node): declaration is DeclarationNode&
    {name: ts.Identifier} {
  const namedDeclaration: ts.Node&{name?: ts.Node} = declaration;
  return namedDeclaration.name !== undefined && ts.isIdentifier(namedDeclaration.name);
}

/**
 * Test whether a path is "relative".
 *
 * 测试路径是否是“相对的”。
 *
 * Relative paths start with `/`, `./` or `../` (or the Windows equivalents); or are simply `.` or
 * `..`.
 *
 * 相对路径以 `/`、`./` 或 `../`（或 Windows 等效项）开头；或者只是 `.` 或 `..`
 *
 */
export function isRelativePath(path: string): boolean {
  return isRooted(path) || /^\.\.?(\/|\\|$)/.test(path);
}

/**
 * A `Map`-like object that can compute and memoize a missing value for any key.
 *
 * 一个类似于 `Map` 的对象，可以计算和记忆任何键的缺失值。
 *
 * The computed values are memoized, so the factory function is not called more than once per key.
 * This is useful for storing values that are expensive to compute and may be used multiple times.
 *
 * 计算的值是被记忆的，因此每个键不会多次调用工厂函数。这对于存储计算成本高且可能会多次使用的值很有用。
 *
 */
// NOTE:
// Ideally, this class should extend `Map`, but that causes errors in ES5 transpiled code:
// `TypeError: Constructor Map requires 'new'`
export class FactoryMap<K, V> {
  private internalMap: Map<K, V>;

  constructor(private factory: (key: K) => V, entries?: readonly(readonly[K, V])[]|null) {
    this.internalMap = new Map(entries);
  }

  get(key: K): V {
    if (!this.internalMap.has(key)) {
      this.internalMap.set(key, this.factory(key));
    }

    return this.internalMap.get(key)!;
  }

  set(key: K, value: V): void {
    this.internalMap.set(key, value);
  }
}

/**
 * Attempt to resolve a `path` to a file by appending the provided `postFixes`
 * to the `path` and checking if the file exists on disk.
 *
 * 尝试通过将提供的 `postFixes` 附加到 `path` 并检查文件在磁盘上是否存在来解析文件的 `path` 。
 *
 * @returns
 *
 * An absolute path to the first matching existing file, or `null` if none exist.
 *
 * 第一个匹配的现有文件的绝对路径，如果不存在，则为 `null` 。
 *
 */
export function resolveFileWithPostfixes(
    fs: ReadonlyFileSystem, path: AbsoluteFsPath, postFixes: string[]): AbsoluteFsPath|null {
  for (const postFix of postFixes) {
    const testPath = absoluteFrom(path + postFix);
    if (fs.exists(testPath) && fs.stat(testPath).isFile()) {
      return testPath;
    }
  }
  return null;
}

/**
 * Determine whether a function declaration corresponds with a TypeScript helper function, returning
 * its kind if so or null if the declaration does not seem to correspond with such a helper.
 *
 * 确定函数声明是否与 TypeScript
 * 帮助器函数对应，如果是，则返回其种类，如果声明似乎与这样的帮助器不对应，则返回 null 。
 *
 */
export function getTsHelperFnFromDeclaration(decl: DeclarationNode): KnownDeclaration|null {
  if (!ts.isFunctionDeclaration(decl) && !ts.isVariableDeclaration(decl)) {
    return null;
  }

  if (decl.name === undefined || !ts.isIdentifier(decl.name)) {
    return null;
  }

  return getTsHelperFnFromIdentifier(decl.name);
}

/**
 * Determine whether an identifier corresponds with a TypeScript helper function (based on its
 * name), returning its kind if so or null if the identifier does not seem to correspond with such a
 * helper.
 *
 * 确定标识符是否与 TypeScript
 * 帮助器函数（基于其名称）对应，如果是，则返回其种类，如果此标识符似乎与这样的帮助器不对应，则返回
 * null 。
 *
 */
export function getTsHelperFnFromIdentifier(id: ts.Identifier): KnownDeclaration|null {
  switch (stripDollarSuffix(id.text)) {
    case '__assign':
      return KnownDeclaration.TsHelperAssign;
    case '__spread':
      return KnownDeclaration.TsHelperSpread;
    case '__spreadArrays':
      return KnownDeclaration.TsHelperSpreadArrays;
    case '__spreadArray':
      return KnownDeclaration.TsHelperSpreadArray;
    case '__read':
      return KnownDeclaration.TsHelperRead;
    default:
      return null;
  }
}

/**
 * An identifier may become repeated when bundling multiple source files into a single bundle, so
 * bundlers have a strategy of suffixing non-unique identifiers with a suffix like $2. This function
 * strips off such suffixes, so that ngcc deals with the canonical name of an identifier.
 *
 * 将多个源文件打包到一个包中时，一个标识符可能会重复，因此打包器的策略是用 $2
 * 之类的后缀来为非唯一标识符添加后缀。此函数会剥离这样的后缀，以便 ngcc 处理标识符的规范名称。
 *
 * @param value The value to strip any suffix of, if applicable.
 *
 * 要删除任何后缀的值（如果适用）。
 *
 * @returns
 *
 * The canonical representation of the value, without any suffix.
 *
 * 值的规范表示，不带任何后缀。
 *
 */
export function stripDollarSuffix(value: string): string {
  return value.replace(/\$\d+$/, '');
}

export function stripExtension(fileName: string): string {
  return fileName.replace(/\..+$/, '');
}

/**
 * Parse the JSON from a `package.json` file.
 *
 * 从 `package.json` 文件解析 JSON。
 *
 * @param packageJsonPath The absolute path to the `package.json` file.
 *
 * `package.json` 文件的绝对路径。
 *
 * @returns
 *
 * JSON from the `package.json` file if it exists and is valid, `null` otherwise.
 *
 * `package.json` 文件中的 JSON（如果存在并且有效），否则为 `null` 。
 *
 */
export function loadJson<T extends JsonObject = JsonObject>(
    fs: ReadonlyFileSystem, packageJsonPath: AbsoluteFsPath): T|null {
  try {
    return JSON.parse(fs.readFile(packageJsonPath)) as T;
  } catch {
    return null;
  }
}

/**
 * Given the parsed JSON of a `package.json` file, try to extract info for a secondary entry-point
 * from the `exports` property. Such info will only be present for packages following Angular
 * Package Format v14+.
 *
 * 给定 `package.json` 文件的解析后的 JSON，尝试从 `exports`
 * 属性中提取辅助入口点的信息。此类信息仅适用于遵循 Angular 包格式 v14+ 的包。
 *
 * @param primaryPackageJson The parsed JSON of the primary `package.json` (or `null` if it failed
 *     to be loaded).
 *
 * 主要 `package.json` 的解析后的 JSON（如果加载失败，则为 `null`）。
 *
 * @param packagePath The absolute path to the containing npm package.
 *
 * 包含 npm 包的绝对路径。
 *
 * @param entryPointPath The absolute path to the secondary entry-point.
 *
 * 辅助入口点的绝对路径。
 *
 * @returns
 *
 * The `exports` info for the specified entry-point if it exists, `null` otherwise.
 *
 * 指定入口点的 `exports` 信息（如果存在），否则为 `null` 。
 *
 */
export function loadSecondaryEntryPointInfoForApfV14(
    fs: ReadonlyFileSystem, primaryPackageJson: JsonObject|null, packagePath: AbsoluteFsPath,
    entryPointPath: AbsoluteFsPath): JsonObject|null {
  // Check if primary `package.json` has been loaded and has an `exports` property that is an
  // object.
  const exportMap = primaryPackageJson?.exports;
  if (!isExportObject(exportMap)) {
    return null;
  }

  // Find the `exports` key for the secondary entry-point.
  const relativeEntryPointPath = fs.relative(packagePath, entryPointPath);
  const entryPointExportKey = `./${relativeEntryPointPath}`;

  // Read the info for the entry-point.
  const entryPointInfo = exportMap[entryPointExportKey];

  // Check whether the entry-point info exists and is an export map.
  return isExportObject(entryPointInfo) ? entryPointInfo : null;
}

/**
 * Check whether a value read from a JSON file is a Node.js export map (either the top-level one or
 * one for a subpath).
 *
 * 检查从 JSON 文件读取的值是否是 Node.js 导出映射（顶级映射或子路径）。
 *
 * In `package.json` files, the `exports` field can be of type `Object | string | string[]`, but APF
 * v14+ uses an object with subpath exports for each entry-point, which in turn are conditional
 * exports (see references below). This function verifies that a value read from the top-level
 * `exports` field or a subpath is of type `Object` (and not `string` or `string[]`).
 *
 * 在 `package.json` 文件中，`exports` 字段可以是 `Object | string | string[]` 类型 `Object |
 * string | string[]` ，但 APF v14+
 * 对每个入口点使用具有子路径导出的对象，这又是条件导出（请参阅下面的参考资料）。此函数会验证从顶级
 * `exports` 字段或子路径读取的值是 `Object` 类型（而不是 `string` 或 `string[]`）。
 *
 * References:
 *
 * 参考文献：
 *
 * - <https://nodejs.org/api/packages.html#exports>
 *
 * - <https://nodejs.org/api/packages.html#subpath-exports>
 *
 * - <https://nodejs.org/api/packages.html#conditional-exports>
 *
 *   [https://nodejs.org/api/packages.html#Conditional-exports](https://nodejs.org/api/packages.html#conditional-exports)
 *
 * - <https://v14.angular.io/guide/angular-package-format#exports>
 *
 * @param thing The value read from the JSON file
 *
 * 从 JSON 文件读取的值
 *
 * @returns
 *
 * True if the value is an `Object` (and not an `Array`).
 *
 * 如果值为 `Object`（而不是 `Array`），则为 True 。
 *
 */
function isExportObject(thing: JsonValue): thing is JsonObject {
  return (typeof thing === 'object') && (thing !== null) && !Array.isArray(thing);
}
