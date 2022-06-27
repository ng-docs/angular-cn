/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ɵParsedMessage} from '@angular/localize';

/**
 * Implement this interface to provide a class that can render messages into a translation file.
 *
 * 实现此接口以提供一个可以将消息呈现到翻译文件中的类。
 *
 */
export interface TranslationSerializer {
  /**
   * Serialize the contents of a translation file containing the given `messages`.
   *
   * 序列化包含给定 `messages` 的翻译文件的内容。
   *
   * @param messages The messages to render to the file.
   *
   * 要呈现到文件的消息。
   *
   * @returns
   *
   * The contents of the serialized file.
   *
   * 序列化文件的内容。
   *
   */
  serialize(messages: ɵParsedMessage[]): string;
}
