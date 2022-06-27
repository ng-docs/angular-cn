/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {MessageId, ɵParsedMessage, ɵSourceMessage} from '@angular/localize';

import {TranslationSerializer} from './translation_serializer';
import {consolidateMessages} from './utils';

interface SimpleJsonTranslationFile {
  locale: string;
  translations: Record<MessageId, ɵSourceMessage>;
}

/**
 * This is a semi-public bespoke serialization format that is used for testing and sometimes as a
 * format for storing translations that will be inlined at runtime.
 *
 * 这是一种半公开的定制序列化格式，用于测试，有时作为存储将在运行时内联的翻译的格式。
 *
 * @see SimpleJsonTranslationParser
 */
export class SimpleJsonTranslationSerializer implements TranslationSerializer {
  constructor(private sourceLocale: string) {}
  serialize(messages: ɵParsedMessage[]): string {
    const fileObj: SimpleJsonTranslationFile = {locale: this.sourceLocale, translations: {}};
    for (const [message] of consolidateMessages(messages, (message) => message.id)) {
      fileObj.translations[message.id] = message.text;
    }
    return JSON.stringify(fileObj, null, 2);
  }
}
