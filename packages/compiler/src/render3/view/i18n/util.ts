/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as i18n from '../../../i18n/i18n_ast';
import {toPublicName} from '../../../i18n/serializers/xmb';
import * as html from '../../../ml_parser/ast';
import * as o from '../../../output/output_ast';
import * as t from '../../r3_ast';

/* Closure variables holding messages must be named `MSG_[A-Z0-9]+` */
const CLOSURE_TRANSLATION_VAR_PREFIX = 'MSG_';

/**
 * Prefix for non-`goog.getMsg` i18n-related vars.
 * Note: the prefix uses lowercase characters intentionally due to a Closure behavior that
 * considers variables like `I18N_0` as constants and throws an error when their value changes.
 *
 * 非 `goog.getMsg` i18n 相关的 var 的前缀。注意：前缀故意使用小写字符，因为 Closure 行为 `I18N_0`
 * 等变量视为常量，并在它们的值更改时抛出错误。
 *
 */
export const TRANSLATION_VAR_PREFIX = 'i18n_';

/**
 * Name of the i18n attributes
 *
 * i18n 属性的名称
 *
 */
export const I18N_ATTR = 'i18n';
export const I18N_ATTR_PREFIX = 'i18n-';

/**
 * Prefix of var expressions used in ICUs
 *
 * ICU 中使用的 var 表达式的前缀
 *
 */
export const I18N_ICU_VAR_PREFIX = 'VAR_';

/**
 * Prefix of ICU expressions for post processing
 *
 * 用于后处理的 ICU 表达式的前缀
 *
 */
export const I18N_ICU_MAPPING_PREFIX = 'I18N_EXP_';

/**
 * Placeholder wrapper for i18n expressions
 *
 * i18n 表达式的占位符包装器
 *
 */
export const I18N_PLACEHOLDER_SYMBOL = '�';

export function isI18nAttribute(name: string): boolean {
  return name === I18N_ATTR || name.startsWith(I18N_ATTR_PREFIX);
}

export function isI18nRootNode(meta?: i18n.I18nMeta): meta is i18n.Message {
  return meta instanceof i18n.Message;
}

export function isSingleI18nIcu(meta?: i18n.I18nMeta): boolean {
  return isI18nRootNode(meta) && meta.nodes.length === 1 && meta.nodes[0] instanceof i18n.Icu;
}

export function hasI18nMeta(node: t.Node&{i18n?: i18n.I18nMeta}): boolean {
  return !!node.i18n;
}

export function hasI18nAttrs(element: html.Element): boolean {
  return element.attrs.some((attr: html.Attribute) => isI18nAttribute(attr.name));
}

export function icuFromI18nMessage(message: i18n.Message) {
  return message.nodes[0] as i18n.IcuPlaceholder;
}

export function wrapI18nPlaceholder(content: string|number, contextId: number = 0): string {
  const blockId = contextId > 0 ? `:${contextId}` : '';
  return `${I18N_PLACEHOLDER_SYMBOL}${content}${blockId}${I18N_PLACEHOLDER_SYMBOL}`;
}

export function assembleI18nBoundString(
    strings: string[], bindingStartIndex: number = 0, contextId: number = 0): string {
  if (!strings.length) return '';
  let acc = '';
  const lastIdx = strings.length - 1;
  for (let i = 0; i < lastIdx; i++) {
    acc += `${strings[i]}${wrapI18nPlaceholder(bindingStartIndex + i, contextId)}`;
  }
  acc += strings[lastIdx];
  return acc;
}

export function getSeqNumberGenerator(startsAt: number = 0): () => number {
  let current = startsAt;
  return () => current++;
}

export function placeholdersToParams(placeholders: Map<string, string[]>):
    {[name: string]: o.LiteralExpr} {
  const params: {[name: string]: o.LiteralExpr} = {};
  placeholders.forEach((values: string[], key: string) => {
    params[key] = o.literal(values.length > 1 ? `[${values.join('|')}]` : values[0]);
  });
  return params;
}

export function updatePlaceholderMap(map: Map<string, any[]>, name: string, ...values: any[]) {
  const current = map.get(name) || [];
  current.push(...values);
  map.set(name, current);
}

export function assembleBoundTextPlaceholders(
    meta: i18n.I18nMeta, bindingStartIndex: number = 0, contextId: number = 0): Map<string, any[]> {
  const startIdx = bindingStartIndex;
  const placeholders = new Map<string, any>();
  const node =
      meta instanceof i18n.Message ? meta.nodes.find(node => node instanceof i18n.Container) : meta;
  if (node) {
    (node as i18n.Container)
        .children
        .filter((child: i18n.Node): child is i18n.Placeholder => child instanceof i18n.Placeholder)
        .forEach((child: i18n.Placeholder, idx: number) => {
          const content = wrapI18nPlaceholder(startIdx + idx, contextId);
          updatePlaceholderMap(placeholders, child.name, content);
        });
  }
  return placeholders;
}

/**
 * Format the placeholder names in a map of placeholders to expressions.
 *
 * 将占位符映射中的占位符名称格式化为表达式。
 *
 * The placeholder names are converted from "internal" format (e.g. `START_TAG_DIV_1`) to "external"
 * format (e.g. `startTagDiv_1`).
 *
 * 占位符名称会从“内部”格式（例如 `START_TAG_DIV_1`）转换为“外部”格式（例如 `startTagDiv_1`）。
 *
 * @param params A map of placeholder names to expressions.
 *
 * 占位符名称到表达式的映射。
 *
 * @param useCamelCase whether to camelCase the placeholder name when formatting.
 *
 * 格式化时是否要将占位符名称 CamelCase 。
 *
 * @returns
 *
 * A new map of formatted placeholder names to expressions.
 *
 * 格式化的占位符名称到表达式的新映射。
 *
 */
export function formatI18nPlaceholderNamesInMap(
    params: {[name: string]: o.Expression} = {}, useCamelCase: boolean) {
  const _params: {[key: string]: o.Expression} = {};
  if (params && Object.keys(params).length) {
    Object.keys(params).forEach(
        key => _params[formatI18nPlaceholderName(key, useCamelCase)] = params[key]);
  }
  return _params;
}

/**
 * Converts internal placeholder names to public-facing format
 * (for example to use in goog.getMsg call).
 * Example: `START_TAG_DIV_1` is converted to `startTagDiv_1`.
 *
 * 将内部占位符名称转换为面向公众的格式（例如在 goog.getMsg 调用中使用）。示例： `START_TAG_DIV_1`
 * 被转换为 `startTagDiv_1` 。
 *
 * @param name The placeholder name that should be formatted
 *
 * 应该格式化的占位符名称
 *
 * @returns
 *
 * Formatted placeholder name
 *
 * 格式化的占位符名称
 *
 */
export function formatI18nPlaceholderName(name: string, useCamelCase: boolean = true): string {
  const publicName = toPublicName(name);
  if (!useCamelCase) {
    return publicName;
  }
  const chunks = publicName.split('_');
  if (chunks.length === 1) {
    // if no "_" found - just lowercase the value
    return name.toLowerCase();
  }
  let postfix;
  // eject last element if it's a number
  if (/^\d+$/.test(chunks[chunks.length - 1])) {
    postfix = chunks.pop();
  }
  let raw = chunks.shift()!.toLowerCase();
  if (chunks.length) {
    raw += chunks.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()).join('');
  }
  return postfix ? `${raw}_${postfix}` : raw;
}

/**
 * Generates a prefix for translation const name.
 *
 * 为翻译 const name 生成前缀。
 *
 * @param extra Additional local prefix that should be injected into translation var name
 *
 * 应该注入到翻译 var name 中的额外本地前缀
 *
 * @returns
 *
 * Complete translation const prefix
 *
 * 完全翻译 const 前缀
 *
 */
export function getTranslationConstPrefix(extra: string): string {
  return `${CLOSURE_TRANSLATION_VAR_PREFIX}${extra}`.toUpperCase();
}

/**
 * Generate AST to declare a variable. E.g. `var I18N_1;`.
 *
 * 生成 AST 以声明变量。例如 `var I18N_1;` .
 *
 * @param variable the name of the variable to declare.
 *
 * 要声明的变量名。
 *
 */
export function declareI18nVariable(variable: o.ReadVarExpr): o.Statement {
  return new o.DeclareVarStmt(
      variable.name!, undefined, o.INFERRED_TYPE, undefined, variable.sourceSpan);
}
