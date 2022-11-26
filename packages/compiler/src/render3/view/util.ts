/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ConstantPool} from '../../constant_pool';
import {Interpolation} from '../../expression_parser/ast';
import * as o from '../../output/output_ast';
import {ParseSourceSpan} from '../../parse_util';
import {splitAtColon} from '../../util';
import * as t from '../r3_ast';
import {Identifiers as R3} from '../r3_identifiers';
import {ForwardRefHandling} from '../util';

import {R3QueryMetadata} from './api';
import {isI18nAttribute} from './i18n/util';


/**
 * Checks whether an object key contains potentially unsafe chars, thus the key should be wrapped in
 * quotes. Note: we do not wrap all keys into quotes, as it may have impact on minification and may
 * bot work in some cases when object keys are mangled by minifier.
 *
 * 检查对象键是否包含可能不安全的字符，因此键应该用引号引起来。注意：我们不会将所有键都用引号引起来，因为它可能会影响缩小，并且当对象键被缩小器破坏时，在某些情况下可能会工作。
 *
 * TODO(FW-1136): this is a temporary solution, we need to come up with a better way of working with
 * inputs that contain potentially unsafe chars.
 *
 * TODO(FW-1136)
 * ：这是一个临时解决方案，我们需要想出一种更好的方法来处理包含可能不安全的字符的输入。
 *
 */
const UNSAFE_OBJECT_KEY_NAME_REGEXP = /[-.]/;

/**
 * Name of the temporary to use during data binding
 *
 * 数据绑定期间要使用的临时名称
 *
 */
export const TEMPORARY_NAME = '_t';

/**
 * Name of the context parameter passed into a template function
 *
 * 传递给模板函数的上下文参数的名称
 *
 */
export const CONTEXT_NAME = 'ctx';

/**
 * Name of the RenderFlag passed into a template function
 *
 * 传递给模板函数的 RenderFlag 的名称
 *
 */
export const RENDER_FLAGS = 'rf';

/**
 * The prefix reference variables
 *
 * 前缀引用变量
 *
 */
export const REFERENCE_PREFIX = '_r';

/**
 * The name of the implicit context reference
 *
 * 隐式上下文引用的名称
 *
 */
export const IMPLICIT_REFERENCE = '$implicit';

/**
 * Non bindable attribute name
 *
 * 不可绑定的属性名称
 *
 */
export const NON_BINDABLE_ATTR = 'ngNonBindable';

/**
 * Name for the variable keeping track of the context returned by `ɵɵrestoreView`.
 *
 * 跟踪 `ɵɵrestoreView` 返回的上下文的变量的名称。
 *
 */
export const RESTORED_VIEW_CONTEXT_NAME = 'restoredCtx';

/**
 * Maximum length of a single instruction chain. Because our output AST uses recursion, we're
 * limited in how many expressions we can nest before we reach the call stack limit. This
 * length is set very conservatively in order to reduce the chance of problems.
 *
 * 单个指令链的最大长度。因为我们的输出 AST
 * 使用了递归，所以我们在达到调用堆栈限制之前可以嵌套的表达式数量有限。这个长度的设置非常保守，以减少出现问题的机会。
 *
 */
const MAX_CHAIN_LENGTH = 500;

/**
 * Instructions that support chaining.
 *
 * 支持链接的指令。
 *
 */
const CHAINABLE_INSTRUCTIONS = new Set([
  R3.element,
  R3.elementStart,
  R3.elementEnd,
  R3.elementContainer,
  R3.elementContainerStart,
  R3.elementContainerEnd,
  R3.i18nExp,
  R3.listener,
  R3.classProp,
  R3.syntheticHostListener,
  R3.hostProperty,
  R3.syntheticHostProperty,
  R3.property,
  R3.propertyInterpolate1,
  R3.propertyInterpolate2,
  R3.propertyInterpolate3,
  R3.propertyInterpolate4,
  R3.propertyInterpolate5,
  R3.propertyInterpolate6,
  R3.propertyInterpolate7,
  R3.propertyInterpolate8,
  R3.propertyInterpolateV,
  R3.attribute,
  R3.attributeInterpolate1,
  R3.attributeInterpolate2,
  R3.attributeInterpolate3,
  R3.attributeInterpolate4,
  R3.attributeInterpolate5,
  R3.attributeInterpolate6,
  R3.attributeInterpolate7,
  R3.attributeInterpolate8,
  R3.attributeInterpolateV,
  R3.styleProp,
  R3.stylePropInterpolate1,
  R3.stylePropInterpolate2,
  R3.stylePropInterpolate3,
  R3.stylePropInterpolate4,
  R3.stylePropInterpolate5,
  R3.stylePropInterpolate6,
  R3.stylePropInterpolate7,
  R3.stylePropInterpolate8,
  R3.stylePropInterpolateV,
  R3.textInterpolate,
  R3.textInterpolate1,
  R3.textInterpolate2,
  R3.textInterpolate3,
  R3.textInterpolate4,
  R3.textInterpolate5,
  R3.textInterpolate6,
  R3.textInterpolate7,
  R3.textInterpolate8,
  R3.textInterpolateV,
]);

/**
 * Possible types that can be used to generate the parameters of an instruction call.
 * If the parameters are a function, the function will be invoked at the time the instruction
 * is generated.
 *
 * 可用于生成指令调用参数的可能类型。如果参数是函数，则函数将在生成指令时调用。
 *
 */
export type InstructionParams = (o.Expression|o.Expression[])|(() => (o.Expression|o.Expression[]));

/**
 * Necessary information to generate a call to an instruction function.
 *
 * 生成对指令函数的调用的必要信息。
 *
 */
export interface Instruction {
  span: ParseSourceSpan|null;
  reference: o.ExternalReference;
  paramsOrFn?: InstructionParams;
}

/**
 * Generates a call to a single instruction.
 *
 * 生成对单个指令的调用。
 *
 */
export function invokeInstruction(
    span: ParseSourceSpan|null, reference: o.ExternalReference,
    params: o.Expression[]): o.Expression {
  return o.importExpr(reference, null, span).callFn(params, span);
}

/**
 * Creates an allocator for a temporary variable.
 *
 * 为临时变量创建分配器。
 *
 * A variable declaration is added to the statements the first time the allocator is invoked.
 *
 * 第一次调用分配器时，会在语句中添加变量声明。
 *
 */
export function temporaryAllocator(statements: o.Statement[], name: string): () => o.ReadVarExpr {
  let temp: o.ReadVarExpr|null = null;
  return () => {
    if (!temp) {
      statements.push(new o.DeclareVarStmt(TEMPORARY_NAME, undefined, o.DYNAMIC_TYPE));
      temp = o.variable(name);
    }
    return temp;
  };
}


export function invalid<T>(this: t.Visitor, arg: o.Expression|o.Statement|t.Node): never {
  throw new Error(
      `Invalid state: Visitor ${this.constructor.name} doesn't handle ${arg.constructor.name}`);
}

export function asLiteral(value: any): o.Expression {
  if (Array.isArray(value)) {
    return o.literalArr(value.map(asLiteral));
  }
  return o.literal(value, o.INFERRED_TYPE);
}

export function conditionallyCreateMapObjectLiteral(
    keys: {[key: string]: string|string[]}, keepDeclared?: boolean): o.Expression|null {
  if (Object.getOwnPropertyNames(keys).length > 0) {
    return mapToExpression(keys, keepDeclared);
  }
  return null;
}

function mapToExpression(
    map: {[key: string]: string|string[]}, keepDeclared?: boolean): o.Expression {
  return o.literalMap(Object.getOwnPropertyNames(map).map(key => {
    // canonical syntax: `dirProp: publicProp`
    const value = map[key];
    let declaredName: string;
    let publicName: string;
    let minifiedName: string;
    let needsDeclaredName: boolean;
    if (Array.isArray(value)) {
      [publicName, declaredName] = value;
      minifiedName = key;
      needsDeclaredName = publicName !== declaredName;
    } else {
      minifiedName = declaredName = key;
      publicName = value;
      needsDeclaredName = false;
    }
    return {
      key: minifiedName,
      // put quotes around keys that contain potentially unsafe characters
      quoted: UNSAFE_OBJECT_KEY_NAME_REGEXP.test(minifiedName),
      value: (keepDeclared && needsDeclaredName) ?
          o.literalArr([asLiteral(publicName), asLiteral(declaredName)]) :
          asLiteral(publicName)
    };
  }));
}

/**
 * Remove trailing null nodes as they are implied.
 *
 * 删除隐含的尾随 null 节点。
 *
 */
export function trimTrailingNulls(parameters: o.Expression[]): o.Expression[] {
  while (o.isNull(parameters[parameters.length - 1])) {
    parameters.pop();
  }
  return parameters;
}

export function getQueryPredicate(
    query: R3QueryMetadata, constantPool: ConstantPool): o.Expression {
  if (Array.isArray(query.predicate)) {
    let predicate: o.Expression[] = [];
    query.predicate.forEach((selector: string): void => {
      // Each item in predicates array may contain strings with comma-separated refs
      // (for ex. 'ref, ref1, ..., refN'), thus we extract individual refs and store them
      // as separate array entities
      const selectors = selector.split(',').map(token => o.literal(token.trim()));
      predicate.push(...selectors);
    });
    return constantPool.getConstLiteral(o.literalArr(predicate), true);
  } else {
    // The original predicate may have been wrapped in a `forwardRef()` call.
    switch (query.predicate.forwardRef) {
      case ForwardRefHandling.None:
      case ForwardRefHandling.Unwrapped:
        return query.predicate.expression;
      case ForwardRefHandling.Wrapped:
        return o.importExpr(R3.resolveForwardRef).callFn([query.predicate.expression]);
    }
  }
}

/**
 * A representation for an object literal used during codegen of definition objects. The generic
 * type `T` allows to reference a documented type of the generated structure, such that the
 * property names that are set can be resolved to their documented declaration.
 *
 * 在定义对象的代码生成期间使用的对象文字的表示。泛型 `T`
 * 允许引用生成的结构的文档化类型，以便设置的属性名称可以解析为它们的文档化声明。
 *
 */
export class DefinitionMap<T = any> {
  values: {key: string, quoted: boolean, value: o.Expression}[] = [];

  set(key: keyof T, value: o.Expression|null): void {
    if (value) {
      this.values.push({key: key as string, value, quoted: false});
    }
  }

  toLiteralMap(): o.LiteralMapExpr {
    return o.literalMap(this.values);
  }
}

/**
 * Extract a map of properties to values for a given element or template node, which can be used
 * by the directive matching machinery.
 *
 * 提取给定元素或模板节点的属性到值的映射，供指令匹配机制使用。
 *
 * @param elOrTpl the element or template in question
 *
 * 有问题的元素或模板
 *
 * @return an object set up for directive matching. For attributes on the element/template, this
 * object maps a property name to its (static) value. For any bindings, this map simply maps the
 * property name to an empty string.
 *
 * 为指令匹配设置的对象。对于元素/模板上的属性，此对象将属性名称映射到其（静态）值。对于任何绑定，此映射只是将属性名称映射到一个空字符串。
 *
 */
export function getAttrsForDirectiveMatching(elOrTpl: t.Element|
                                             t.Template): {[name: string]: string} {
  const attributesMap: {[name: string]: string} = {};


  if (elOrTpl instanceof t.Template && elOrTpl.tagName !== 'ng-template') {
    elOrTpl.templateAttrs.forEach(a => attributesMap[a.name] = '');
  } else {
    elOrTpl.attributes.forEach(a => {
      if (!isI18nAttribute(a.name)) {
        attributesMap[a.name] = a.value;
      }
    });

    elOrTpl.inputs.forEach(i => {
      attributesMap[i.name] = '';
    });
    elOrTpl.outputs.forEach(o => {
      attributesMap[o.name] = '';
    });
  }

  return attributesMap;
}

/**
 * Gets the number of arguments expected to be passed to a generated instruction in the case of
 * interpolation instructions.
 *
 * 获取在插值指令的情况下要传递给生成的指令的参数的数量。
 *
 * @param interpolation An interpolation ast
 *
 * 插值 ast
 *
 */
export function getInterpolationArgsLength(interpolation: Interpolation) {
  const {expressions, strings} = interpolation;
  if (expressions.length === 1 && strings.length === 2 && strings[0] === '' && strings[1] === '') {
    // If the interpolation has one interpolated value, but the prefix and suffix are both empty
    // strings, we only pass one argument, to a special instruction like `propertyInterpolate` or
    // `textInterpolate`.
    return 1;
  } else {
    return expressions.length + strings.length;
  }
}

/**
 * Generates the final instruction call statements based on the passed in configuration.
 * Will try to chain instructions as much as possible, if chaining is supported.
 *
 * 根据传入的配置生成最终的指令调用语句。如果支持链接，将尝试尽可能多地链接指令。
 *
 */
export function getInstructionStatements(instructions: Instruction[]): o.Statement[] {
  const statements: o.Statement[] = [];
  let pendingExpression: o.Expression|null = null;
  let pendingExpressionType: o.ExternalReference|null = null;
  let chainLength = 0;

  for (const current of instructions) {
    const resolvedParams =
        (typeof current.paramsOrFn === 'function' ? current.paramsOrFn() : current.paramsOrFn) ??
        [];
    const params = Array.isArray(resolvedParams) ? resolvedParams : [resolvedParams];

    // If the current instruction is the same as the previous one
    // and it can be chained, add another call to the chain.
    if (chainLength < MAX_CHAIN_LENGTH && pendingExpressionType === current.reference &&
        CHAINABLE_INSTRUCTIONS.has(pendingExpressionType)) {
      // We'll always have a pending expression when there's a pending expression type.
      pendingExpression = pendingExpression!.callFn(params, pendingExpression!.sourceSpan);
      chainLength++;
    } else {
      if (pendingExpression !== null) {
        statements.push(pendingExpression.toStmt());
      }
      pendingExpression = invokeInstruction(current.span, current.reference, params);
      pendingExpressionType = current.reference;
      chainLength = 0;
    }
  }

  // Since the current instruction adds the previous one to the statements,
  // we may be left with the final one at the end that is still pending.
  if (pendingExpression !== null) {
    statements.push(pendingExpression.toStmt());
  }

  return statements;
}
