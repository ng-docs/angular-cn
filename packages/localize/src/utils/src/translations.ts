/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {BLOCK_MARKER} from './constants';
import {MessageId, MessageMetadata, ParsedMessage, parseMessage, TargetMessage} from './messages';


/**
 * A translation message that has been processed to extract the message parts and placeholders.
 *
 * 已处理以提取消息部分和占位符的翻译消息。
 *
 */
export interface ParsedTranslation extends MessageMetadata {
  messageParts: TemplateStringsArray;
  placeholderNames: string[];
}

/**
 * The internal structure used by the runtime localization to translate messages.
 *
 * 运行时本地化用于翻译消息的内部结构。
 *
 */
export type ParsedTranslations = Record<MessageId, ParsedTranslation>;

export class MissingTranslationError extends Error {
  private readonly type = 'MissingTranslationError';
  constructor(readonly parsedMessage: ParsedMessage) {
    super(`No translation found for ${describeMessage(parsedMessage)}.`);
  }
}

export function isMissingTranslationError(e: any): e is MissingTranslationError {
  return e.type === 'MissingTranslationError';
}

/**
 * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
 * `substitutions`) using the given `translations`.
 *
 * 使用给定的 `translations` `$localize` 标记字符串的文本（即 `messageParts` 和 `substitutions` ）。
 *
 * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
 * `ParsedTranslation`. If this doesn't match and there are legacy ids then try matching a
 * translation using those.
 *
 * tagged-string 被解析以提取其 `messageId` ，该 messageId 用于查找适当的 `ParsedTranslation`
 * 。如果这不匹配并且有旧版 id，请尝试使用它们来匹配翻译。
 *
 * If one is found then it is used to translate the message into a new set of `messageParts` and
 * `substitutions`.
 * The translation may reorder (or remove) substitutions as appropriate.
 *
 * 如果找到了一个，则用它来将消息转换为一组新的 `messageParts` 和 `substitutions`
 * 。翻译可能会酌情重新排序（或删除）替换。
 *
 * If there is no translation with a matching message id then an error is thrown.
 * If a translation contains a placeholder that is not found in the message being translated then an
 * error is thrown.
 *
 * 如果没有具有匹配消息 ID
 * 的翻译，则会抛出错误。如果翻译包含正在翻译的消息中找不到的占位符，则会抛出错误。
 *
 */
export function translate(
    translations: Record<string, ParsedTranslation>, messageParts: TemplateStringsArray,
    substitutions: readonly any[]): [TemplateStringsArray, readonly any[]] {
  const message = parseMessage(messageParts, substitutions);
  // Look up the translation using the messageId, and then the legacyId if available.
  let translation = translations[message.id];
  // If the messageId did not match a translation, try matching the legacy ids instead
  if (message.legacyIds !== undefined) {
    for (let i = 0; i < message.legacyIds.length && translation === undefined; i++) {
      translation = translations[message.legacyIds[i]];
    }
  }
  if (translation === undefined) {
    throw new MissingTranslationError(message);
  }
  return [
    translation.messageParts, translation.placeholderNames.map(placeholder => {
      if (message.substitutions.hasOwnProperty(placeholder)) {
        return message.substitutions[placeholder];
      } else {
        throw new Error(
            `There is a placeholder name mismatch with the translation provided for the message ${
                describeMessage(message)}.\n` +
            `The translation contains a placeholder with name ${
                placeholder}, which does not exist in the message.`);
      }
    })
  ];
}

/**
 * Parse the `messageParts` and `placeholderNames` out of a target `message`.
 *
 * 从目标 `message` 中解析 `messageParts` 和 `placeholderNames` 。
 *
 * Used by `loadTranslations()` to convert target message strings into a structure that is more
 * appropriate for doing translation.
 *
 * 供 `loadTranslations()` 使用，将目标消息字符串转换为更适合进行翻译的结构。
 *
 * @param message the message to be parsed.
 *
 * 要解析的消息。
 *
 */
export function parseTranslation(messageString: TargetMessage): ParsedTranslation {
  const parts = messageString.split(/{\$([^}]*)}/);
  const messageParts = [parts[0]];
  const placeholderNames: string[] = [];
  for (let i = 1; i < parts.length - 1; i += 2) {
    placeholderNames.push(parts[i]);
    messageParts.push(`${parts[i + 1]}`);
  }
  const rawMessageParts =
      messageParts.map(part => part.charAt(0) === BLOCK_MARKER ? '\\' + part : part);
  return {
    text: messageString,
    messageParts: makeTemplateObject(messageParts, rawMessageParts),
    placeholderNames,
  };
}

/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * 从一组 `messageParts` 和 `placeholderNames` 创建 `ParsedTranslation` 。
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 *
 * 要出现在 ParsedTranslation 中的消息部分。
 *
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 *
 * 要穿在 `messageParts` 之间的占位符的名称。
 *
 */
export function makeParsedTranslation(
    messageParts: string[], placeholderNames: string[] = []): ParsedTranslation {
  let messageString = messageParts[0];
  for (let i = 0; i < placeholderNames.length; i++) {
    messageString += `{$${placeholderNames[i]}}${messageParts[i + 1]}`;
  }
  return {
    text: messageString,
    messageParts: makeTemplateObject(messageParts, messageParts),
    placeholderNames
  };
}

/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * 创建传递给 tagged-string 标签函数的专用数组。
 *
 * @param cooked The message parts with their escape codes processed.
 *
 * 已处理其转义代码的消息部分。
 *
 * @param raw The message parts with their escaped codes as-is.
 *
 * 消息按原样使用其转义代码。
 *
 */
export function makeTemplateObject(cooked: string[], raw: string[]): TemplateStringsArray {
  Object.defineProperty(cooked, 'raw', {value: raw});
  return cooked as any;
}


function describeMessage(message: ParsedMessage): string {
  const meaningString = message.meaning && ` - "${message.meaning}"`;
  const legacy = message.legacyIds && message.legacyIds.length > 0 ?
      ` [${message.legacyIds.map(l => `"${l}"`).join(', ')}]` :
      '';
  return `"${message.id}"${legacy} ("${message.text}"${meaningString})`;
}
