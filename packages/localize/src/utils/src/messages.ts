/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {computeMsgId} from '@angular/compiler';

import {BLOCK_MARKER, ID_SEPARATOR, LEGACY_ID_INDICATOR, MEANING_SEPARATOR} from './constants';

/**
 * Re-export this helper function so that users of `@angular/localize` don't need to actively import
 * from `@angular/compiler`.
 */
export {computeMsgId} from '@angular/compiler';

/**
 * A string containing a translation source message.
 *
 * I.E. the message that indicates what will be translated from.
 *
 * Uses `{$placeholder-name}` to indicate a placeholder.
 */
export type SourceMessage = string;

/**
 * A string containing a translation target message.
 *
 * I.E. the message that indicates what will be translated to.
 *
 * Uses `{$placeholder-name}` to indicate a placeholder.
 */
export type TargetMessage = string;

/**
 * A string that uniquely identifies a message, to be used for matching translations.
 */
export type MessageId = string;

/**
 * Information parsed from a `$localize` tagged string that is used to translate it.
 *
 * For example:
 *
 * ```
 * const name = 'Jo Bloggs';
 * $localize`Hello ${name}:title!`;
 * ```
 *
 * May be parsed into:
 *
 * ```
 * {
 *   messageId: '6998194507597730591',
 *   substitutions: { title: 'Jo Bloggs' },
 *   messageString: 'Hello {$title}!',
 * }
 * ```
 */
export interface ParsedMessage {
  /**
   * The key used to look up the appropriate translation target.
   */
  messageId: MessageId;
  /**
   * Legacy message ids, if provided.
   *
   * In legacy message formats the message id can only be computed directly from the original
   * template source.
   *
   * Since this information is not available in `$localize` calls, the legacy message ids may be
   * attached by the compiler to the `$localize` metablock so it can be used if needed at the point
   * of translation if the translations are encoded using the legacy message id.
   */
  legacyIds: MessageId[];
  /**
   * A mapping of placeholder names to substitution values.
   */
  substitutions: Record<string, any>;
  /**
   * A human readable rendering of the message
   */
  messageString: string;
  /**
   * The meaning of the `message`, used to distinguish identical `messageString`s.
   */
  meaning: string;
  /**
   * The description of the `message`, used to aid translation.
   */
  description: string;
  /**
   * The static parts of the message.
   */
  messageParts: string[];
  /**
   * The names of the placeholders that will be replaced with substitutions.
   */
  placeholderNames: string[];
}

/**
 * Parse a `$localize` tagged string into a structure that can be used for translation.
 *
 * See `ParsedMessage` for an example.
 */
export function parseMessage(
    messageParts: TemplateStringsArray, expressions?: readonly any[]): ParsedMessage {
  const substitutions: {[placeholderName: string]: any} = {};
  const metadata = parseMetadata(messageParts[0], messageParts.raw[0]);
  const cleanedMessageParts: string[] = [metadata.text];
  const placeholderNames: string[] = [];
  let messageString = metadata.text;
  for (let i = 1; i < messageParts.length; i++) {
    const {text: messagePart, block: placeholderName = computePlaceholderName(i)} =
        splitBlock(messageParts[i], messageParts.raw[i]);
    messageString += `{$${placeholderName}}${messagePart}`;
    if (expressions !== undefined) {
      substitutions[placeholderName] = expressions[i - 1];
    }
    placeholderNames.push(placeholderName);
    cleanedMessageParts.push(messagePart);
  }
  const messageId = metadata.id || computeMsgId(messageString, metadata.meaning || '');
  const legacyIds = metadata.legacyIds.filter(id => id !== messageId);
  return {
    messageId,
    legacyIds,
    substitutions,
    messageString,
    meaning: metadata.meaning || '',
    description: metadata.description || '',
    messageParts: cleanedMessageParts,
    placeholderNames,
  };
}

export interface MessageMetadata {
  text: string;
  meaning: string|undefined;
  description: string|undefined;
  id: string|undefined;
  legacyIds: string[];
}

/**
 * Parse the given message part (`cooked` + `raw`) to extract the message metadata from the text.
 *
 * If the message part has a metadata block this function will extract the `meaning`,
 * `description`, `customId` and `legacyId` (if provided) from the block. These metadata properties
 * are serialized in the string delimited by `|`, `@@` and `␟` respectively.
 *
 * (Note that `␟` is the `LEGACY_ID_INDICATOR` - see `constants.ts`.)
 *
 * For example:
 *
 * ```ts
 * `:meaning|description@@custom-id`
 * `:meaning|@@custom-id`
 * `:meaning|description`
 * `description@@custom-id`
 * `meaning|`
 * `description`
 * `@@custom-id`
 * `:meaning|description@@custom-id␟legacy-id-1␟legacy-id-2`
 * ```
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns A object containing any metadata that was parsed from the message part.
 */
export function parseMetadata(cooked: string, raw: string): MessageMetadata {
  const {text, block} = splitBlock(cooked, raw);
  if (block === undefined) {
    return {text, meaning: undefined, description: undefined, id: undefined, legacyIds: []};
  } else {
    const [meaningDescAndId, ...legacyIds] = block.split(LEGACY_ID_INDICATOR);
    const [meaningAndDesc, id] = meaningDescAndId.split(ID_SEPARATOR, 2);
    let [meaning, description]: (string|undefined)[] = meaningAndDesc.split(MEANING_SEPARATOR, 2);
    if (description === undefined) {
      description = meaning;
      meaning = undefined;
    }
    if (description === '') {
      description = undefined;
    }
    return {text, meaning, description, id, legacyIds};
  }
}

/**
 * Split a message part (`cooked` + `raw`) into an optional delimited "block" off the front and the
 * rest of the text of the message part.
 *
 * Blocks appear at the start of message parts. They are delimited by a colon `:` character at the
 * start and end of the block.
 *
 * If the block is in the first message part then it will be metadata about the whole message:
 * meaning, description, id.  Otherwise it will be metadata about the immediately preceding
 * substitution: placeholder name.
 *
 * Since blocks are optional, it is possible that the content of a message block actually starts
 * with a block marker. In this case the marker must be escaped `\:`.
 *
 * @param cooked The cooked version of the message part to parse.
 * @param raw The raw version of the message part to parse.
 * @returns An object containing the `text` of the message part and the text of the `block`, if it
 * exists.
 * @throws an error if the `block` is unterminated
 */
export function splitBlock(cooked: string, raw: string): {text: string, block?: string} {
  if (raw.charAt(0) !== BLOCK_MARKER) {
    return {text: cooked};
  } else {
    const endOfBlock = findEndOfBlock(cooked, raw);
    return {
      block: cooked.substring(1, endOfBlock),
      text: cooked.substring(endOfBlock + 1),
    };
  }
}


function computePlaceholderName(index: number) {
  return index === 1 ? 'PH' : `PH_${index - 1}`;
}

/**
 * Find the end of a "marked block" indicated by the first non-escaped colon.
 *
 * @param cooked The cooked string (where escaped chars have been processed)
 * @param raw The raw string (where escape sequences are still in place)
 *
 * @returns the index of the end of block marker
 * @throws an error if the block is unterminated
 */
export function findEndOfBlock(cooked: string, raw: string): number {
  /************************************************************************************************
   * This function is repeated in `src/localize/src/localize.ts` and the two should be kept in sync.
   * (See that file for more explanation of why.)
   ************************************************************************************************/
  for (let cookedIndex = 1, rawIndex = 1; cookedIndex < cooked.length; cookedIndex++, rawIndex++) {
    if (raw[rawIndex] === '\\') {
      rawIndex++;
    } else if (cooked[cookedIndex] === BLOCK_MARKER) {
      return cookedIndex;
    }
  }
  throw new Error(`Unterminated $localize metadata block in "${raw}".`);
}