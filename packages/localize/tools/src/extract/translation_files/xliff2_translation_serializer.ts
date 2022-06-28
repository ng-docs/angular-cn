/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, getFileSystem, PathManipulation} from '@angular/compiler-cli/private/localize';
import {ɵParsedMessage, ɵSourceLocation} from '@angular/localize';

import {FormatOptions, validateOptions} from './format_options';
import {extractIcuPlaceholders} from './icu_parsing';
import {TranslationSerializer} from './translation_serializer';
import {consolidateMessages, hasLocation} from './utils';
import {XmlFile} from './xml_file';

/**
 * This is the maximum number of characters that can appear in a legacy XLIFF 2.0 message id.
 *
 * 这是旧版 XLIFF 2.0 消息 ID 中可以出现的最大字符数。
 *
 */
const MAX_LEGACY_XLIFF_2_MESSAGE_LENGTH = 20;

/**
 * A translation serializer that can write translations in XLIFF 2 format.
 *
 * 一个翻译序列化器，可以以 XLIFF 2 格式编写翻译。
 *
 * <https://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html>
 *
 * @see Xliff2TranslationParser
 * @publicApi used by CLI
 */
export class Xliff2TranslationSerializer implements TranslationSerializer {
  private currentPlaceholderId = 0;
  constructor(
      private sourceLocale: string, private basePath: AbsoluteFsPath, private useLegacyIds: boolean,
      private formatOptions: FormatOptions = {}, private fs: PathManipulation = getFileSystem()) {
    validateOptions('Xliff1TranslationSerializer', [['xml:space', ['preserve']]], formatOptions);
  }

  serialize(messages: ɵParsedMessage[]): string {
    const messageGroups = consolidateMessages(messages, message => this.getMessageId(message));
    const xml = new XmlFile();
    xml.startTag('xliff', {
      'version': '2.0',
      'xmlns': 'urn:oasis:names:tc:xliff:document:2.0',
      'srcLang': this.sourceLocale
    });
    // NOTE: the `original` property is set to the legacy `ng.template` value for backward
    // compatibility.
    // We could compute the file from the `message.location` property, but there could
    // be multiple values for this in the collection of `messages`. In that case we would probably
    // need to change the serializer to output a new `<file>` element for each collection of
    // messages that come from a particular original file, and the translation file parsers may
    // not
    xml.startTag('file', {'id': 'ngi18n', 'original': 'ng.template', ...this.formatOptions});
    for (const duplicateMessages of messageGroups) {
      const message = duplicateMessages[0];
      const id = this.getMessageId(message);

      xml.startTag('unit', {id});
      const messagesWithLocations = duplicateMessages.filter(hasLocation);
      if (message.meaning || message.description || messagesWithLocations.length) {
        xml.startTag('notes');

        // Write all the locations
        for (const {location: {file, start, end}} of messagesWithLocations) {
          const endLineString =
              end !== undefined && end.line !== start.line ? `,${end.line + 1}` : '';
          this.serializeNote(
              xml, 'location',
              `${this.fs.relative(this.basePath, file)}:${start.line + 1}${endLineString}`);
        }

        if (message.description) {
          this.serializeNote(xml, 'description', message.description);
        }
        if (message.meaning) {
          this.serializeNote(xml, 'meaning', message.meaning);
        }
        xml.endTag('notes');
      }
      xml.startTag('segment');
      xml.startTag('source', {}, {preserveWhitespace: true});
      this.serializeMessage(xml, message);
      xml.endTag('source', {preserveWhitespace: false});
      xml.endTag('segment');
      xml.endTag('unit');
    }
    xml.endTag('file');
    xml.endTag('xliff');
    return xml.toString();
  }

  private serializeMessage(xml: XmlFile, message: ɵParsedMessage): void {
    this.currentPlaceholderId = 0;
    const length = message.messageParts.length - 1;
    for (let i = 0; i < length; i++) {
      this.serializeTextPart(xml, message.messageParts[i]);
      const name = message.placeholderNames[i];
      const associatedMessageId =
          message.associatedMessageIds && message.associatedMessageIds[name];
      this.serializePlaceholder(xml, name, message.substitutionLocations, associatedMessageId);
    }
    this.serializeTextPart(xml, message.messageParts[length]);
  }

  private serializeTextPart(xml: XmlFile, text: string): void {
    const pieces = extractIcuPlaceholders(text);
    const length = pieces.length - 1;
    for (let i = 0; i < length; i += 2) {
      xml.text(pieces[i]);
      this.serializePlaceholder(xml, pieces[i + 1], undefined, undefined);
    }
    xml.text(pieces[length]);
  }

  private serializePlaceholder(
      xml: XmlFile, placeholderName: string,
      substitutionLocations: Record<string, ɵSourceLocation|undefined>|undefined,
      associatedMessageId: string|undefined): void {
    const text = substitutionLocations?.[placeholderName]?.text;

    if (placeholderName.startsWith('START_')) {
      // Replace the `START` with `CLOSE` and strip off any `_1` ids from the end.
      const closingPlaceholderName =
          placeholderName.replace(/^START/, 'CLOSE').replace(/_\d+$/, '');
      const closingText = substitutionLocations?.[closingPlaceholderName]?.text;
      const attrs: Record<string, string> = {
        id: `${this.currentPlaceholderId++}`,
        equivStart: placeholderName,
        equivEnd: closingPlaceholderName,
      };
      const type = getTypeForPlaceholder(placeholderName);
      if (type !== null) {
        attrs.type = type;
      }
      if (text !== undefined) {
        attrs.dispStart = text;
      }
      if (closingText !== undefined) {
        attrs.dispEnd = closingText;
      }
      xml.startTag('pc', attrs);
    } else if (placeholderName.startsWith('CLOSE_')) {
      xml.endTag('pc');
    } else {
      const attrs: Record<string, string> = {
        id: `${this.currentPlaceholderId++}`,
        equiv: placeholderName,
      };
      const type = getTypeForPlaceholder(placeholderName);
      if (type !== null) {
        attrs.type = type;
      }
      if (text !== undefined) {
        attrs.disp = text;
      }
      if (associatedMessageId !== undefined) {
        attrs['subFlows'] = associatedMessageId;
      }
      xml.startTag('ph', attrs, {selfClosing: true});
    }
  }

  private serializeNote(xml: XmlFile, name: string, value: string) {
    xml.startTag('note', {category: name}, {preserveWhitespace: true});
    xml.text(value);
    xml.endTag('note', {preserveWhitespace: false});
  }

  /**
   * Get the id for the given `message`.
   *
   * 获取给定 `message` 的 id。
   *
   * If there was a custom id provided, use that.
   *
   * 如果提供了自定义 ID，请使用它。
   *
   * If we have requested legacy message ids, then try to return the appropriate id
   * from the list of legacy ids that were extracted.
   *
   * 如果我们请求了旧版消息 ID，请尝试从提取的旧版 ID 列表中返回适当的 id。
   *
   * Otherwise return the canonical message id.
   *
   * 否则返回规范消息 ID。
   *
   * An Xliff 2.0 legacy message id is a 64 bit number encoded as a decimal string, which will have
   * at most 20 digits, since 2^65-1 = 36,893,488,147,419,103,231. This digest is based on:
   * <https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java>
   *
   * Xliff 2.0 旧版消息 ID 是编码为十进制字符串的 64 位数字，最多有 20 位数字，因为 2^65-1 =
   * 36,893,488,147,419,103,231 。本摘要基于：
   * <https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java>
   *
   */
  private getMessageId(message: ɵParsedMessage): string {
    return message.customId ||
        this.useLegacyIds && message.legacyIds !== undefined &&
        message.legacyIds.find(
            id => id.length <= MAX_LEGACY_XLIFF_2_MESSAGE_LENGTH && !/[^0-9]/.test(id)) ||
        message.id;
  }
}

/**
 * Compute the value of the `type` attribute from the `placeholder` name.
 *
 * 根据 `placeholder` 名称计算 `type` 属性的值。
 *
 * If the tag is not known but starts with `TAG_`, `START_TAG_` or `CLOSE_TAG_` then the type is
 * `other`. Certain formatting tags (e.g. bold, italic, etc) have type `fmt`. Line-breaks, images
 * and links are special cases.
 *
 * 如果标签是未知的但以 `TAG_`、`START_TAG_` 或 `CLOSE_TAG_` ，则类型是 `other`
 * 。某些格式标签（例如粗体、斜体等）具有 `fmt` 类型。换行符、图像和链接是特例。
 *
 */
function getTypeForPlaceholder(placeholder: string): string|null {
  const tag = placeholder.replace(/^(START_|CLOSE_)/, '').replace(/_\d+$/, '');
  switch (tag) {
    case 'BOLD_TEXT':
    case 'EMPHASISED_TEXT':
    case 'ITALIC_TEXT':
    case 'LINE_BREAK':
    case 'STRIKETHROUGH_TEXT':
    case 'UNDERLINED_TEXT':
      return 'fmt';
    case 'TAG_IMG':
      return 'image';
    case 'LINK':
      return 'link';
    default:
      return /^(START_|CLOSE_)/.test(placeholder) ? 'other' : null;
  }
}
