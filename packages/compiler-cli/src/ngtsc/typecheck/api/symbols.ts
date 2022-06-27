/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TmplAstElement, TmplAstReference, TmplAstTemplate, TmplAstVariable} from '@angular/compiler';
import ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';
import {SymbolWithValueDeclaration} from '../../util/src/typescript';

import {DirectiveInScope} from './scope';

export enum SymbolKind {
  Input,
  Output,
  Binding,
  Reference,
  Variable,
  Directive,
  Element,
  Template,
  Expression,
  DomBinding,
  Pipe,
}

/**
 * A representation of an entity in the `TemplateAst`.
 *
 * `TemplateAst` 中实体的表示。
 *
 */
export type Symbol = InputBindingSymbol|OutputBindingSymbol|ElementSymbol|ReferenceSymbol|
    VariableSymbol|ExpressionSymbol|DirectiveSymbol|TemplateSymbol|DomBindingSymbol|PipeSymbol;

/**
 * A `Symbol` which declares a new named entity in the template scope.
 *
 * 在模板范围内声明一个新的命名实体的 `Symbol` 。
 *
 */
export type TemplateDeclarationSymbol = ReferenceSymbol|VariableSymbol;

/**
 * Information about where a `ts.Node` can be found in the type check file. This can either be
 * a type-checking shim file, or an original source file for inline type check blocks.
 *
 * 有关 `ts.Node` 在类型检查文件中的位置的信息。这可以是类型检查的 shim
 * 文件，也可以是内联类型检查块的原始源文件。
 *
 */
export interface TcbLocation {
  /**
   * The fully qualified path of the file which contains the generated TypeScript type check
   * code for the component's template.
   *
   * 包含为组件模板生成的 TypeScript 类型检查代码的文件的完全限定路径。
   *
   */
  tcbPath: AbsoluteFsPath;

  /**
   * Whether the type check block exists in a type-checking shim file or is inline.
   *
   * 类型检查块是存在于类型检查 shim 文件中还是内联。
   *
   */
  isShimFile: boolean;

  /**
   * The location in the file where node appears.
   *
   * 文件中节点出现的位置。
   *
   */
  positionInFile: number;
}

/**
 * A generic representation of some node in a template.
 *
 * 模板中某些节点的通用表示。
 *
 */
export interface TsNodeSymbolInfo {
  /**
   * The `ts.Type` of the template node.
   *
   * 模板节点的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` for the template node
   *
   * 模板节点的 `ts.Symbol`
   *
   */
  tsSymbol: ts.Symbol|null;

  /**
   * The position of the most relevant part of the template node.
   *
   * 模板节点中最相关部分的位置。
   *
   */
  tcbLocation: TcbLocation;
}

/**
 * A representation of an expression in a component template.
 *
 * 组件模板中表达式的表示。
 *
 */
export interface ExpressionSymbol {
  kind: SymbolKind.Expression;

  /**
   * The `ts.Type` of the expression AST.
   *
   * 表达式 AST 的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` of the entity. This could be `null`, for example `AST` expression
   * `{{foo.bar + foo.baz}}` does not have a `ts.Symbol` but `foo.bar` and `foo.baz` both do.
   *
   * 实体的 `ts.Symbol` 。这可以是 `null` ，例如 `AST` 表达式 `{{foo.bar + foo.baz}}` 没有
   * `ts.Symbol` ，但 `foo.bar` 和 `foo.baz` 都有。
   *
   */
  tsSymbol: ts.Symbol|null;

  /**
   * The position of the most relevant part of the expression.
   *
   * 表达式中最相关部分的位置。
   *
   */
  tcbLocation: TcbLocation;
}

/**
 * Represents either an input or output binding in a template.
 *
 * 表示模板中的输入或输出绑定。
 *
 */
export interface BindingSymbol {
  kind: SymbolKind.Binding;

  /**
   * The `ts.Type` of the class member on the directive that is the target of the binding.
   *
   * 作为绑定目标的指令上类成员的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` of the class member on the directive that is the target of the binding.
   *
   * 作为绑定目标的指令上类成员的 `ts.Symbol` 。
   *
   */
  tsSymbol: ts.Symbol;

  /**
   * The `DirectiveSymbol` or `ElementSymbol` for the Directive, Component, or `HTMLElement` with
   * the binding.
   *
   * 具有绑定的 Directive、组件或 `HTMLElement` 的 `DirectiveSymbol` 或 `ElementSymbol` 。
   *
   */
  target: DirectiveSymbol|ElementSymbol|TemplateSymbol;

  /**
   * The location in the shim file where the field access for the binding appears.
   *
   * shim 文件中绑定的字段访问出现的位置。
   *
   */
  tcbLocation: TcbLocation;
}

/**
 * A representation of an input binding in a component template.
 *
 * 组件模板中输入绑定的表示。
 *
 */
export interface InputBindingSymbol {
  kind: SymbolKind.Input;

  /**
   * A single input may be bound to multiple components or directives.
   *
   * 单个输入可以绑定到多个组件或指令。
   *
   */
  bindings: BindingSymbol[];
}

/**
 * A representation of an output binding in a component template.
 *
 * 组件模板中输出绑定的表示。
 *
 */
export interface OutputBindingSymbol {
  kind: SymbolKind.Output;

  /**
   * A single output may be bound to multiple components or directives.
   *
   * 单个输出可以绑定到多个组件或指令。
   *
   */
  bindings: BindingSymbol[];
}

/**
 * A representation of a local reference in a component template.
 *
 * 组件模板中本地引用的表示。
 *
 */
export interface ReferenceSymbol {
  kind: SymbolKind.Reference;

  /**
   * The `ts.Type` of the Reference value.
   *
   * 参考值的 `ts.Type` 。
   *
   * `TmplAstTemplate` - The type of the `TemplateRef`
   * `TmplAstElement` - The `ts.Type` for the `HTMLElement`.
   * Directive - The `ts.Type` for the class declaration.
   *
   * `TmplAstTemplate` - `TemplateRef` 的类型 `TmplAstElement` - `HTMLElement` 的 `ts.Type` 。
   * Directive - 类声明的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` for the Reference value.
   *
   * 参考值的 `ts.Symbol` 。
   *
   * `TmplAstTemplate` - A `TemplateRef` symbol.
   * `TmplAstElement` - The symbol for the `HTMLElement`.
   * Directive - The symbol for the class declaration of the directive.
   *
   * `TmplAstTemplate` - 一个 `TemplateRef` 符号。 `TmplAstElement` - `HTMLElement` 的符号。指令 -
   * 指令的类声明的符号。
   *
   */
  tsSymbol: ts.Symbol;

  /**
   * Depending on the type of the reference, this is one of the following:
   *
   * 根据引用的类型，这是以下之一：
   *
   * - `TmplAstElement` when the local ref refers to the HTML element
   *
   *   本地 ref 引用 HTML 元素时的 `TmplAstElement`
   *
   * - `TmplAstTemplate` when the ref refers to an `ng-template`
   *
   *   ref 引用 `ng-template` 时的 `TmplAstTemplate`
   *
   * - `ts.ClassDeclaration` when the local ref refers to a Directive instance (#ref="myExportAs")
   *
   *   本地 ref 引用 Directive 实例时的 `ts.ClassDeclaration` (#ref="myExportAs")
   *
   */
  target: TmplAstElement|TmplAstTemplate|ts.ClassDeclaration;

  /**
   * The node in the `TemplateAst` where the symbol is declared. That is, node for the `#ref` or
   * `#ref="exportAs"`.
   *
   * `TemplateAst` 中声明符号的节点。也就是说， `#ref` 或 `#ref="exportAs"` 的节点。
   *
   */
  declaration: TmplAstReference;

  /**
   * The location in the shim file of a variable that holds the type of the local ref.
   * For example, a reference declaration like the following:
   *
   * 包含本地 ref 类型的变量在 shim 文件中的位置。例如，如下所示的引用声明：
   *
   * ```
   * var _t1 = document.createElement('div');
   * var _t2 = _t1; // This is the reference declaration
   * ```
   *
   * This `targetLocation` is `[_t1 variable declaration].getStart()`.
   *
   * 此 `targetLocation` 是 `[_t1 variable declaration].getStart()` 。
   *
   */
  targetLocation: TcbLocation;

  /**
   * The location in the TCB for the identifier node in the reference variable declaration.
   * For example, given a variable declaration statement for a template reference:
   * `var _t2 = _t1`, this location is `[_t2 node].getStart()`. This location can
   * be used to find references to the variable within the template.
   *
   * 引用变量声明中标识符节点在 TCB 中的位置。例如，给定模板引用的变量声明语句： `var _t2 = _t1`
   * ，此位置是 `[_t2 node].getStart()` 。此位置可用于查找对模板中变量的引用。
   *
   */
  referenceVarLocation: TcbLocation;
}

/**
 * A representation of a context variable in a component template.
 *
 * 组件模板中上下文变量的表示。
 *
 */
export interface VariableSymbol {
  kind: SymbolKind.Variable;

  /**
   * The `ts.Type` of the entity.
   *
   * 实体的 `ts.Type` 。
   *
   * This will be `any` if there is no `ngTemplateContextGuard`.
   *
   * 如果没有 `ngTemplateContextGuard` ，这将是 `any` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` for the context variable.
   *
   * 上下文变量的 `ts.Symbol` 。
   *
   * This will be `null` if there is no `ngTemplateContextGuard`.
   *
   * 如果没有 `ngTemplateContextGuard` ，这将是 `null` 。
   *
   */
  tsSymbol: ts.Symbol|null;

  /**
   * The node in the `TemplateAst` where the variable is declared. That is, the node for the `let-`
   * node in the template.
   *
   * `TemplateAst` 中声明变量的节点。也就是说，模板中 `let-` node 的节点。
   *
   */
  declaration: TmplAstVariable;

  /**
   * The location in the shim file for the identifier that was declared for the template variable.
   *
   * 为模板变量声明的标识符在 shim 文件中的位置。
   *
   */
  localVarLocation: TcbLocation;

  /**
   * The location in the shim file for the initializer node of the variable that represents the
   * template variable.
   *
   * 表示模板变量的变量的初始化器节点在 shim 文件中的位置。
   *
   */
  initializerLocation: TcbLocation;
}

/**
 * A representation of an element in a component template.
 *
 * 组件模板中元素的表示。
 *
 */
export interface ElementSymbol {
  kind: SymbolKind.Element;

  /**
   * The `ts.Type` for the `HTMLElement`.
   *
   * `HTMLElement` 的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` for the `HTMLElement`.
   *
   * `HTMLElement` 的 `ts.Symbol` 。
   *
   */
  tsSymbol: ts.Symbol|null;

  /**
   * A list of directives applied to the element.
   *
   * 应用于元素的指令列表。
   *
   */
  directives: DirectiveSymbol[];

  /**
   * The location in the shim file for the variable that holds the type of the element.
   *
   * 保存元素类型的变量在 shim 文件中的位置。
   *
   */
  tcbLocation: TcbLocation;

  templateNode: TmplAstElement;
}

export interface TemplateSymbol {
  kind: SymbolKind.Template;

  /**
   * A list of directives applied to the element.
   *
   * 应用于元素的指令列表。
   *
   */
  directives: DirectiveSymbol[];

  templateNode: TmplAstTemplate;
}

/**
 * A representation of a directive/component whose selector matches a node in a component
 * template.
 *
 * 其选择器与组件模板中的节点匹配的指令/组件的表示。
 *
 */
export interface DirectiveSymbol extends DirectiveInScope {
  kind: SymbolKind.Directive;

  /**
   * The `ts.Type` for the class declaration.
   *
   * 类声明的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The location in the shim file for the variable that holds the type of the directive.
   *
   * 保存指令类型的变量在 shim 文件中的位置。
   *
   */
  tcbLocation: TcbLocation;
}

/**
 * A representation of an attribute on an element or template. These bindings aren't currently
 * type-checked (see `checkTypeOfDomBindings`) so they won't have a `ts.Type`, `ts.Symbol`, or shim
 * location.
 *
 * 元素或模板上属性的表示。这些绑定当前没有经过类型检查（请参阅 `checkTypeOfDomBindings`
 * ），因此它们不会有 `ts.Type` 、 `ts.Symbol` 或 shim 位置。
 *
 */
export interface DomBindingSymbol {
  kind: SymbolKind.DomBinding;

  /**
   * The symbol for the element or template of the text attribute.
   *
   * 文本属性的元素或模板的符号。
   *
   */
  host: ElementSymbol|TemplateSymbol;
}

/**
 * A representation for a call to a pipe's transform method in the TCB.
 *
 * 在 TCB 中调用管道的 transform 方法的表示。
 *
 */
export interface PipeSymbol {
  kind: SymbolKind.Pipe;

  /**
   * The `ts.Type` of the transform node.
   *
   * 转换节点的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` for the transform call. This could be `null` when `checkTypeOfPipes` is set to
   * `false` because the transform call would be of the form `(_pipe1 as any).transform()`
   *
   * 转换调用的 `ts.Symbol` 。当 `checkTypeOfPipes` 设置为 `false` 时，这可能为 `null`
   * ，因为转换调用的格式 `(_pipe1 as any).transform()`
   *
   */
  tsSymbol: ts.Symbol|null;

  /**
   * The position of the transform call in the template.
   *
   * 模板中转换调用的位置。
   *
   */
  tcbLocation: TcbLocation;

  /**
   * The symbol for the pipe class as an instance that appears in the TCB.
   *
   * 作为实例出现在 TCB 中的管道类的符号。
   *
   */
  classSymbol: ClassSymbol;
}

/**
 * Represents an instance of a class found in the TCB, i.e. \`var \_pipe1: MyPipe = null!;
 *
 * 表示在 TCB 中找到的类的实例，即 \`var \_pipe1: MyPipe = null!;
 *
 */
export interface ClassSymbol {
  /**
   * The `ts.Type` of class.
   *
   * 类的 `ts.Type` 。
   *
   */
  tsType: ts.Type;

  /**
   * The `ts.Symbol` for class.
   *
   * 类的 `ts.Symbol` 。
   *
   */
  tsSymbol: SymbolWithValueDeclaration;

  /**
   * The position for the variable declaration for the class instance.
   *
   * 类实例的变量声明的位置。
   *
   */
  tcbLocation: TcbLocation;
}
