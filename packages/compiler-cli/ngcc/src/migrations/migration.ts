/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {MetadataReader} from '../../../src/ngtsc/metadata';
import {PartialEvaluator} from '../../../src/ngtsc/partial_evaluator';
import {ClassDeclaration, Decorator} from '../../../src/ngtsc/reflection';
import {HandlerFlags} from '../../../src/ngtsc/transform';
import {NgccReflectionHost} from '../host/ngcc_host';


/**
 * Implement this interface and add it to the `DecorationAnalyzer.migrations` collection to get ngcc
 * to modify the analysis of the decorators in the program in order to migrate older code to work
 * with Ivy.
 *
 * 实现此接口并将其添加到 `DecorationAnalyzer.migrations` 集合中，以让 ngcc
 * 修改程序中对装饰器的分析，以迁移较旧的代码以使用 Ivy。
 *
 * `Migration.apply()` is called for every class in the program being compiled by ngcc.
 *
 * 为 ngcc 正在编译的程序中的每个类调用 `Migration.apply()` 。
 *
 * Note that the underlying program could be in a variety of different formats, e.g. ES2015, ES5,
 * UMD, CommonJS etc. This means that an author of a `Migration` should not attempt to navigate and
 * manipulate the AST nodes directly. Instead, the `MigrationHost` interface, passed to the
 * `Migration`, provides access to a `MetadataReader`, `ReflectionHost` and `PartialEvaluator`
 * interfaces, which should be used.
 *
 * 请注意，底层程序可以是多种不同的格式，例如 ES2015、ES5、UMD、CommonJS 等。这意味着 `Migration`
 * 的作者不应该尝试直接导航和操作 AST 节点。相反，传递给 `Migration` 的 `MigrationHost`
 * 接口提供对应该使用的 `MetadataReader`、`ReflectionHost` 和 `PartialEvaluator` 接口的访问。
 *
 */
export interface Migration {
  apply(clazz: ClassDeclaration, host: MigrationHost): ts.Diagnostic|null;
}

export interface MigrationHost {
  /**
   * Provides access to the decorator information associated with classes.
   *
   * 提供对与类关联的装饰器信息的访问。
   *
   */
  readonly metadata: MetadataReader;
  /**
   * Provides access to navigate the AST in a format-agnostic manner.
   *
   * 提供以与格式无关的方式导航 AST 的访问。
   *
   */
  readonly reflectionHost: NgccReflectionHost;
  /**
   * Enables expressions to be statically evaluated in the context of the program.
   *
   * 允许在程序上下文中静态估算表达式。
   *
   */
  readonly evaluator: PartialEvaluator;
  /**
   * Associate a new synthesized decorator, which did not appear in the original source, with a
   * given class.
   *
   * 将未出现在原始源代码中的新合成装饰器与给定类关联。
   *
   * @param clazz the class to receive the new decorator.
   *
   * 接收新装饰器的类。
   *
   * @param decorator the decorator to inject.
   *
   * 要注入的装饰器。
   *
   * @param flags optional bitwise flag to influence the compilation of the decorator.
   *
   * 可选的按位标志，以影响装饰器的编译。
   *
   */
  injectSyntheticDecorator(clazz: ClassDeclaration, decorator: Decorator, flags?: HandlerFlags):
      void;

  /**
   * Retrieves all decorators that are associated with the class, including synthetic decorators
   * that have been injected before.
   *
   * 检索与类关联的所有装饰器，包括之前注入的合成装饰器。
   *
   * @param clazz the class for which all decorators are retrieved.
   *
   * 检索其所有装饰器的类。
   *
   * @returns
   *
   * the list of the decorators, or null if the class was not decorated.
   *
   * 装饰器的列表，如果类未装饰，则为 null 。
   *
   */
  getAllDecorators(clazz: ClassDeclaration): Decorator[]|null;

  /**
   * Determines whether the provided class in within scope of the entry-point that is currently
   * being compiled.
   *
   * 确定提供的类是否在当前正在编译的入口点范围内。
   *
   * @param clazz the class for which to determine whether it is within the current entry-point.
   *
   * 要确定它是否在当前入口点内的类。
   *
   * @returns
   *
   * true if the file is part of the compiled entry-point, false otherwise.
   *
   * 如果文件是已编译入口点的一部分，则为 true ，否则为 false 。
   *
   */
  isInScope(clazz: ClassDeclaration): boolean;
}
