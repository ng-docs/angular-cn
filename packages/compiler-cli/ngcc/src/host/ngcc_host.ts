/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {ClassDeclaration, Declaration, Decorator, ReflectionHost} from '../../../src/ngtsc/reflection';
import {SymbolWithValueDeclaration} from '../../../src/ngtsc/util/src/typescript';

/**
 * The symbol corresponding to a "class" declaration. I.e. a `ts.Symbol` whose `valueDeclaration` is
 * a `ClassDeclaration`.
 *
 * 与“class”声明对应的符号。即一个 `ts.Symbol` ，其 `valueDeclaration` 是 `ClassDeclaration` 。
 *
 */
export type ClassSymbol = ts.Symbol&{valueDeclaration: ClassDeclaration};

/**
 * A representation of a class that accounts for the potential existence of two `ClassSymbol`s for a
 * given class, as the compiled JavaScript bundles that ngcc reflects on can have two declarations.
 *
 * 一个类的表示，它解释了给定类可能存在两个 `ClassSymbol` ，因为 ngcc 反映的已编译 JavaScript
 * 包可以有两个声明。
 *
 */
export interface NgccClassSymbol {
  /**
   * The name of the class.
   *
   * 类的名称。
   *
   */
  name: string;

  /**
   * Represents the symbol corresponding with the outer declaration of the class. This should be
   * considered the public class symbol, i.e. its declaration is visible to the rest of the program.
   *
   * 表示与类的外部声明对应的符号。这应该被认为是公共类符号，即它的声明对程序的其余部分可见。
   *
   */
  declaration: ClassSymbol;

  /**
   * Represents the symbol corresponding with the inner declaration of the class, referred to as its
   * "implementation". This is not necessarily a `ClassSymbol` but rather just a `ts.Symbol`, as the
   * inner declaration does not need to satisfy the requirements imposed on a publicly visible class
   * declaration.
   *
   * 表示与类的内部声明对应的符号，称为其“实现”。这不一定是 `ClassSymbol` ，而只是 `ts.Symbol`
   * ，因为内部声明不需要满足对公开可见的类声明施加的要求。
   *
   */
  implementation: SymbolWithValueDeclaration;

  /**
   * Represents the symbol corresponding to a variable within a class IIFE that may be used to
   * attach static properties or decorated.
   *
   * 表示与 IIFE 类中的变量对应的符号，可用于附加静态属性或装饰。
   *
   */
  adjacent?: SymbolWithValueDeclaration;
}

/**
 * A reflection host that has extra methods for looking at non-Typescript package formats
 *
 * 一个反射主机，它具有查看非 Typescript 包格式的额外方法
 *
 */
export interface NgccReflectionHost extends ReflectionHost {
  /**
   * Find a symbol for a declaration that we think is a class.
   *
   * 为我们认为是类的声明找到一个符号。
   *
   * @param declaration The declaration whose symbol we are finding
   *
   * 我们要查找其符号的声明
   *
   * @returns
   *
   * the symbol for the declaration or `undefined` if it is not
   * a "class" or has no symbol.
   *
   * 声明的符号，如果它不是“类”或没有符号，则为 `undefined` 。
   *
   */
  getClassSymbol(declaration: ts.Node): NgccClassSymbol|undefined;

  /**
   * Retrieves all decorators of a given class symbol.
   *
   * 检索给定类符号的所有装饰器。
   *
   * @param symbol Class symbol that can refer to a declaration which can hold decorators.
   *
   * 可以引用可以包含装饰器的声明的类符号。
   *
   * @returns
   *
   * An array of decorators or null if none are declared.
   *
   * 装饰器数组，如果没有声明，则为 null 。
   *
   */
  getDecoratorsOfSymbol(symbol: NgccClassSymbol): Decorator[]|null;

  /**
   * Retrieves all class symbols of a given source file.
   *
   * 检索给定源文件的所有类符号。
   *
   * @param sourceFile The source file to search for classes.
   *
   * 要搜索类的源文件。
   *
   * @returns
   *
   * An array of found class symbols.
   *
   * 找到的类符号的数组。
   *
   */
  findClassSymbols(sourceFile: ts.SourceFile): NgccClassSymbol[];

  /**
   * Find the last node that is relevant to the specified class.
   *
   * 查找与指定类相关的最后一个节点。
   *
   * As well as the main declaration, classes can have additional statements such as static
   * properties (`SomeClass.staticProp = ...;`) and decorators (`__decorate(SomeClass, ...);`).
   * It is useful to know exactly where the class "ends" so that we can inject additional
   * statements after that point.
   *
   * 除了 main 声明，类可以有其他语句，例如静态属性 ( `SomeClass.staticProp = ...;` ) 和装饰器 (
   * `__decorate(SomeClass, ...);`
   * )。确切地知道类“结束”的位置会很有用，以便我们可以在此之后注入额外的语句。
   *
   * @param classSymbol The class whose statements we want.
   *
   * 我们想要其语句的类。
   *
   */
  getEndOfClass(classSymbol: NgccClassSymbol): ts.Node;

  /**
   * Check whether a `Declaration` corresponds with a known declaration and set its `known` property
   * to the appropriate `KnownDeclaration`.
   *
   * 检查 `Declaration` 是否与已知声明对应，并将其 `known` 属性设置为适当的 `KnownDeclaration` 。
   *
   * @param decl The `Declaration` to check.
   *
   * 要检查的 `Declaration` 。
   *
   * @return The passed in `Declaration` (potentially enhanced with a `KnownDeclaration`).
   *
   * 传入的 `Declaration` （可能使用 `KnownDeclaration` 增强）。
   *
   */
  detectKnownDeclaration<T extends Declaration>(decl: T): T;
}
