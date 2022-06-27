/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * The character used to mark the start and end of a "block" in a `$localize` tagged string.
 * A block can indicate metadata about the message or specify a name of a placeholder for a
 * substitution expressions.
 *
 * `$localize`
 * 标记字符串中用于标记“块”开始和结束的字符。块可以表示有关消息的元数据或为替换表达式指定占位符的名称。
 *
 * For example:
 *
 * 例如：
 *
 * ```ts
 * $localize`Hello, ${title}:title:!`;
 * $localize`:meaning|description@@id:source message text`;
 * ```
 *
 */
export const BLOCK_MARKER = ':';

/**
 * The marker used to separate a message's "meaning" from its "description" in a metadata block.
 *
 * 用于将消息的“含义”与其在元数据块中的“描述”分开的标记。
 *
 * For example:
 *
 * 例如：
 *
 * ```ts
 * $localize `:correct|Indicates that the user got the answer correct: Right!`;
 * $localize `:movement|Button label for moving to the right: Right!`;
 * ```
 *
 */
export const MEANING_SEPARATOR = '|';

/**
 * The marker used to separate a message's custom "id" from its "description" in a metadata block.
 *
 * 用于将消息的自定义“id”与其在元数据块中的“描述”分开的标记。
 *
 * For example:
 *
 * 例如：
 *
 * ```ts
 * $localize `:A welcome message on the home page@@myApp-homepage-welcome: Welcome!`;
 * ```
 *
 */
export const ID_SEPARATOR = '@@';

/**
 * The marker used to separate legacy message ids from the rest of a metadata block.
 *
 * 用于将旧版消息 ID 与元数据块的其余部分分开的标记。
 *
 * For example:
 *
 * 例如：
 *
 * ```ts
 * $localize `:@@custom-id␟2df64767cd895a8fabe3e18b94b5b6b6f9e2e3f0: Welcome!`;
 * ```
 *
 * Note that this character is the "symbol for the unit separator" (␟) not the "unit separator
 * character" itself, since that has no visual representation. See
 * <https://graphemica.com/%E2%90%9F>.
 *
 * 请注意，此字符是“单位分隔符的符号” (␟)
 * 而不是“单位分隔符”本身，因为它没有视觉表示。请参阅<https://graphemica.com/%E2%90%9F> 。
 *
 * Here is some background for the original "unit separator character":
 * <https://stackoverflow.com/questions/8695118/whats-the-file-group-record-unit-separator-control-characters-and-its-usage>
 *
 * 这是原始“单位分隔符”的一些背景：
 * <https://stackoverflow.com/questions/8695118/whats-the-file-group-record-unit-separator-control-characters-and-its-usage>
 *
 */
export const LEGACY_ID_INDICATOR = '\u241F';
