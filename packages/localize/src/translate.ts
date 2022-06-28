/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {LocalizeFn} from './localize';
import {MessageId, ParsedTranslation, parseTranslation, TargetMessage, translate as _translate} from './utils';

/**
 * We augment the `$localize` object to also store the translations.
 *
 * 我们增加了 `$localize` 对象以存储翻译。
 *
 * Note that because the TRANSLATIONS are attached to a global object, they will be shared between
 * all applications that are running in a single page of the browser.
 *
 * 请注意，由于 TRANSLATIONS
 * 附加到全局对象，因此它们将在浏览器单个页面中运行的所有应用程序之间共享。
 *
 */
declare const $localize: LocalizeFn&{TRANSLATIONS: Record<MessageId, ParsedTranslation>};

/**
 * Load translations for use by `$localize`, if doing runtime translation.
 *
 * 如果进行运行时翻译，则加载供 `$localize` 使用的翻译。
 *
 * If the `$localize` tagged strings are not going to be replaced at compiled time, it is possible
 * to load a set of translations that will be applied to the `$localize` tagged strings at runtime,
 * in the browser.
 *
 * 如果 `$localize`
 * 标记的字符串不会在编译时被替换，则可以在浏览器中加载一组翻译，这些翻译将在运行时应用于
 * `$localize` 标记的字符串。
 *
 * Loading a new translation will overwrite a previous translation if it has the same `MessageId`.
 *
 * 如果具有相同的 `MessageId` ，加载新翻译将覆盖以前的翻译。
 *
 * Note that `$localize` messages are only processed once, when the tagged string is first
 * encountered, and does not provide dynamic language changing without refreshing the browser.
 * Loading new translations later in the application life-cycle will not change the translated text
 * of messages that have already been translated.
 *
 * 请注意，`$localize`
 * 消息只会在第一次遇到标记字符串时处理一次，并且在不刷新浏览器的情况下不提供动态语言更改。在应用程序生命周期的后期加载新翻译不会更改已翻译消息的翻译文本。
 *
 * The message IDs and translations are in the same format as that rendered to "simple JSON"
 * translation files when extracting messages. In particular, placeholders in messages are rendered
 * using the `{$PLACEHOLDER_NAME}` syntax. For example the message from the following template:
 *
 * 消息 ID 和翻译的格式与提取消息时呈现为“简单 JSON”翻译文件的格式相同。特别是，消息中的占位符是使用
 * `{$PLACEHOLDER_NAME}` 语法呈现的。例如来自以下模板的消息：
 *
 * ```html
 * <div i18n>pre<span>inner-pre<b>bold</b>inner-post</span>post</div>
 * ```
 *
 * would have the following form in the `translations` map:
 *
 * 在 `translations` 映射表中将有以下形式：
 *
 * ```ts
 * {
 *   "2932901491976224757":
 *      "pre{$START_TAG_SPAN}inner-pre{$START_BOLD_TEXT}bold{$CLOSE_BOLD_TEXT}inner-post{$CLOSE_TAG_SPAN}post"
 * }
 * ```
 *
 * @param translations A map from message ID to translated message.
 *
 * 从消息 ID 到已翻译消息的映射。
 *
 * These messages are processed and added to a lookup based on their `MessageId`.
 *
 * 这些消息会根据它们的 `MessageId` 进行处理并添加到查找中。
 *
 * @see `clearTranslations()` for removing translations loaded using this function.
 *
 * `clearTranslations()` 用于删除使用此函数加载的翻译。
 *
 * @see `$localize` for tagging messages as needing to be translated.
 *
 * `$localize` 用于将消息标记为需要翻译。
 *
 * @publicApi
 */
export function loadTranslations(translations: Record<MessageId, TargetMessage>) {
  // Ensure the translate function exists
  if (!$localize.translate) {
    $localize.translate = translate;
  }
  if (!$localize.TRANSLATIONS) {
    $localize.TRANSLATIONS = {};
  }
  Object.keys(translations).forEach(key => {
    $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
  });
}

/**
 * Remove all translations for `$localize`, if doing runtime translation.
 *
 * 如果进行运行时翻译，请删除 `$localize` 的所有翻译。
 *
 * All translations that had been loading into memory using `loadTranslations()` will be removed.
 *
 * 已使用 `loadTranslations()` 加载到内存中的所有翻译都将被删除。
 *
 * @see `loadTranslations()` for loading translations at runtime.
 *
 * `loadTranslations()` 用于在运行时加载翻译。
 *
 * @see `$localize` for tagging messages as needing to be translated.
 *
 * `$localize` 用于将消息标记为需要翻译。
 *
 * @publicApi
 */
export function clearTranslations() {
  $localize.translate = undefined;
  $localize.TRANSLATIONS = {};
}

/**
 * Translate the text of the given message, using the loaded translations.
 *
 * 使用加载的翻译来翻译给定消息的文本。
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 *
 * 此函数可能会按照匹配翻译中的指示重新排序（或删除）替换。
 *
 */
export function translate(messageParts: TemplateStringsArray, substitutions: readonly any[]):
    [TemplateStringsArray, readonly any[]] {
  try {
    return _translate($localize.TRANSLATIONS, messageParts, substitutions);
  } catch (e) {
    console.warn((e as Error).message);
    return [messageParts, substitutions];
  }
}
