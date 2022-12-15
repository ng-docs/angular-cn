/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {IncrementalBuild} from '../../../src/ngtsc/incremental/api';
import {SemanticSymbol} from '../../../src/ngtsc/incremental/semantic_graph';
import {NOOP_PERF_RECORDER} from '../../../src/ngtsc/perf';
import {ClassDeclaration, Decorator} from '../../../src/ngtsc/reflection';
import {isShim} from '../../../src/ngtsc/shims';
import {CompilationMode, DecoratorHandler, DtsTransformRegistry, HandlerFlags, Trait, TraitCompiler} from '../../../src/ngtsc/transform';
import {NgccReflectionHost} from '../host/ngcc_host';
import {isDefined} from '../utils';

/**
 * Specializes the `TraitCompiler` for ngcc purposes. Mainly, this includes an alternative way of
 * scanning for classes to compile using the reflection host's `findClassSymbols`, together with
 * support to inject synthetic decorators into the compilation for ad-hoc migrations that ngcc
 * performs.
 *
 * 将 `TraitCompiler` 专门用于 ngcc 。主要，这包括另一种使用反射宿主的 `findClassSymbols`
 * 扫描要编译的类的方法，以及支持将合成装饰器注入到 ngcc 执行的即席迁移的编译中。
 *
 */
export class NgccTraitCompiler extends TraitCompiler {
  constructor(
      handlers: DecoratorHandler<unknown, unknown, SemanticSymbol|null, unknown>[],
      private ngccReflector: NgccReflectionHost) {
    super(
        handlers, ngccReflector, NOOP_PERF_RECORDER, new NoIncrementalBuild(),
        /* compileNonExportedClasses */ true, CompilationMode.FULL, new DtsTransformRegistry(),
        /* semanticDepGraphUpdater */ null, {isShim, isResource: () => false});
  }

  get analyzedFiles(): ts.SourceFile[] {
    return Array.from(this.fileToClasses.keys());
  }

  /**
   * Analyzes the source file in search for classes to process. For any class that is found in the
   * file, a `ClassRecord` is created and the source file is included in the `analyzedFiles` array.
   *
   * 分析源文件以搜索要处理的类。对于在文件中找到的任何类，都会创建 `ClassRecord` ，并且源文件包含在
   * `analyzedFiles` 数组中。
   *
   */
  analyzeFile(sf: ts.SourceFile): void {
    const ngccClassSymbols = this.ngccReflector.findClassSymbols(sf);
    for (const classSymbol of ngccClassSymbols) {
      this.analyzeClass(classSymbol.declaration.valueDeclaration, null);
    }

    return undefined;
  }

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
      Trait<unknown, unknown, SemanticSymbol|null, unknown>[] {
    const migratedTraits = this.detectTraits(clazz, [decorator]);
    if (migratedTraits === null) {
      return [];
    }

    for (const trait of migratedTraits) {
      this.analyzeTrait(clazz, trait, flags);
    }

    return migratedTraits;
  }

  /**
   * Returns all decorators that have been recognized for the provided class, including any
   * synthetically injected decorators.
   *
   * 返回已为所提供的类识别的所有装饰器，包括任何合成注入的装饰器。
   *
   * @param clazz the declaration for which the decorators are returned.
   *
   * 返回装饰器的声明。
   *
   */
  getAllDecorators(clazz: ClassDeclaration): Decorator[]|null {
    const record = this.recordFor(clazz);
    if (record === null) {
      return null;
    }

    return record.traits.map(trait => trait.detected.decorator).filter(isDefined);
  }
}

class NoIncrementalBuild implements IncrementalBuild<any, any> {
  priorAnalysisFor(sf: ts.SourceFile): any[]|null {
    return null;
  }

  priorTypeCheckingResultsFor(): null {
    return null;
  }

  recordSuccessfulTypeCheck(): void {}
}
