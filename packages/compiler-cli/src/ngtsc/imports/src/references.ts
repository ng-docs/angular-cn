/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Expression} from '@angular/compiler';
import ts from 'typescript';

import {identifierOfNode} from '../../util/src/typescript';

export interface OwningModule {
  specifier: string;
  resolutionContext: string;
}

/**
 * A `ts.Node` plus the context in which it was discovered.
 *
 * 一个 `ts.Node` 加上找到它的上下文。
 *
 * A `Reference` is a pointer to a `ts.Node` that was extracted from the program somehow. It
 * contains not only the node itself, but the information regarding how the node was located. In
 * particular, it might track different identifiers by which the node is exposed, as well as
 * potentially a module specifier which might expose the node.
 *
 * `Reference` 是指向 `ts.Node`
 * 的指针，它是以某种方式从程序中提取的。它不仅包含节点本身，还包含有关节点位置的信息。特别是，它可能会跟踪公开节点的不同标识符，以及可能会公开该节点的模块说明符。
 *
 * The Angular compiler uses `Reference`s instead of `ts.Node`s when tracking classes or generating
 * imports.
 *
 * Angular 编译器在跟踪类或生成导入时使用 `Reference` 而不是 `ts.Node` 。
 *
 */
export class Reference<T extends ts.Node = ts.Node> {
  /**
   * The compiler's best guess at an absolute module specifier which owns this `Reference`.
   *
   * 编译器对拥有此 `Reference` 的绝对模块说明符的最佳猜测。
   *
   * This is usually determined by tracking the import statements which led the compiler to a given
   * node. If any of these imports are absolute, it's an indication that the node being imported
   * might come from that module.
   *
   * 这通常是通过跟踪将编译器引导到给定节点的导入语句来确定的。如果这些导入中的任何一个是绝对的，则表明正在导入的节点可能来自该模块。
   *
   * It is not _guaranteed_ that the node in question is exported from its `bestGuessOwningModule` -
   * that is mostly a convention that applies in certain package formats.
   *
   * 不能 _ 保证 _ 有问题的节点是从其 `bestGuessOwningModule` 导出的 -
   * 这主要是适用于某些包格式的约定。
   *
   * If `bestGuessOwningModule` is `null`, then it's likely the node came from the current program.
   *
   * 如果 `bestGuessOwningModule` 为 `null` ，则该节点很可能来自当前程序。
   *
   */
  readonly bestGuessOwningModule: OwningModule|null;

  private identifiers: ts.Identifier[] = [];

  /**
   * Indicates that the Reference was created synthetically, not as a result of natural value
   * resolution.
   *
   * 表明引用是综合创建的，而不是自然值解析的结果。
   *
   * This is used to avoid misinterpreting the Reference in certain contexts.
   *
   * 这用于避免在某些上下文中误解 Reference 。
   *
   */
  synthetic = false;

  private _alias: Expression|null = null;

  constructor(readonly node: T, bestGuessOwningModule: OwningModule|null = null) {
    this.bestGuessOwningModule = bestGuessOwningModule;

    const id = identifierOfNode(node);
    if (id !== null) {
      this.identifiers.push(id);
    }
  }

  /**
   * The best guess at which module specifier owns this particular reference, or `null` if there
   * isn't one.
   *
   * 哪个模块说明符拥有此特定引用的最佳猜测，如果不存在，则为 `null` 。
   *
   */
  get ownedByModuleGuess(): string|null {
    if (this.bestGuessOwningModule !== null) {
      return this.bestGuessOwningModule.specifier;
    } else {
      return null;
    }
  }

  /**
   * Whether this reference has a potential owning module or not.
   *
   * 此引用是否具有潜在的拥有模块。
   *
   * See `bestGuessOwningModule`.
   *
   * 请参阅 `bestGuessOwningModule` 。
   *
   */
  get hasOwningModuleGuess(): boolean {
    return this.bestGuessOwningModule !== null;
  }

  /**
   * A name for the node, if one is available.
   *
   * 节点的名称（如果有）。
   *
   * This is only suited for debugging. Any actual references to this node should be made with
   * `ts.Identifier`s (see `getIdentityIn`).
   *
   * 这仅适合调试。对此节点的任何实际引用都应该使用 `ts.Identifier` （请参阅 `getIdentityIn` ）。
   *
   */
  get debugName(): string|null {
    const id = identifierOfNode(this.node);
    return id !== null ? id.text : null;
  }

  get alias(): Expression|null {
    return this._alias;
  }


  /**
   * Record a `ts.Identifier` by which it's valid to refer to this node, within the context of this
   * `Reference`.
   *
   * 在此 `Reference` 的上下文中记录一个 `ts.Identifier` ，通过它可以有效地引用此节点。
   *
   */
  addIdentifier(identifier: ts.Identifier): void {
    this.identifiers.push(identifier);
  }

  /**
   * Get a `ts.Identifier` within this `Reference` that can be used to refer within the context of a
   * given `ts.SourceFile`, if any.
   *
   * 在此 `Reference` 中获取一个 `ts.Identifier` ，可用于在给定的 `ts.SourceFile`
   * 的上下文中引用（如果有）。
   *
   */
  getIdentityIn(context: ts.SourceFile): ts.Identifier|null {
    return this.identifiers.find(id => id.getSourceFile() === context) || null;
  }

  /**
   * Get a `ts.Identifier` for this `Reference` that exists within the given expression.
   *
   * 获取给定表达式中存在的此 `Reference` 的 `ts.Identifier` 。
   *
   * This is very useful for producing `ts.Diagnostic`s that reference `Reference`s that were
   * extracted from some larger expression, as it can be used to pinpoint the `ts.Identifier` within
   * the expression from which the `Reference` originated.
   *
   * 这对于生成引用从某些较大表达式中提取的 `Reference` 的 `ts.Diagnostic`
   * 非常有用，因为它可用于在源自 `Reference` 的表达式中查明 `ts.Identifier` 。
   *
   */
  getIdentityInExpression(expr: ts.Expression): ts.Identifier|null {
    const sf = expr.getSourceFile();
    return this.identifiers.find(id => {
      if (id.getSourceFile() !== sf) {
        return false;
      }

      // This identifier is a match if its position lies within the given expression.
      return id.pos >= expr.pos && id.end <= expr.end;
    }) ||
        null;
  }

  /**
   * Given the 'container' expression from which this `Reference` was extracted, produce a
   * `ts.Expression` to use in a diagnostic which best indicates the position within the container
   * expression that generated the `Reference`.
   *
   * 给定从中提取此 `Reference` 的“容器”表达式，生成一个要在诊断中使用的 `ts.Expression`
   * ，它可以最好地表明生成 `Reference` 的容器表达式中的位置。
   *
   * For example, given a `Reference` to the class 'Bar' and the containing expression:
   * `[Foo, Bar, Baz]`, this function would attempt to return the `ts.Identifier` for `Bar` within
   * the array. This could be used to produce a nice diagnostic context:
   *
   * 例如，给定对类 'Bar' 的 `Reference` 和包含表达式： `[Foo, Bar, Baz]` ，此函数将尝试在数组中返回
   * `Bar` 的 `ts.Identifier` 。这可用于生成一个很好的诊断上下文：
   *
   * ```text
   * [Foo, Bar, Baz]
   *       ~~~
   * ```
   *
   * If no specific node can be found, then the `fallback` expression is used, which defaults to the
   * entire containing expression.
   *
   * 如果找不到特定节点，则使用 `fallback` 表达式，默认为整个包含表达式。
   *
   */
  getOriginForDiagnostics(container: ts.Expression, fallback: ts.Expression = container):
      ts.Expression {
    const id = this.getIdentityInExpression(container);
    return id !== null ? id : fallback;
  }

  cloneWithAlias(alias: Expression): Reference<T> {
    const ref = new Reference(this.node, this.bestGuessOwningModule);
    ref.identifiers = [...this.identifiers];
    ref._alias = alias;
    return ref;
  }

  cloneWithNoIdentifiers(): Reference<T> {
    const ref = new Reference(this.node, this.bestGuessOwningModule);
    ref._alias = this._alias;
    ref.identifiers = [];
    return ref;
  }
}
