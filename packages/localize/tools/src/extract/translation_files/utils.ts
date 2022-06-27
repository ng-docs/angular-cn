/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {MessageId, ɵParsedMessage, ɵSourceLocation} from '@angular/localize';

/**
 * Consolidate messages into groups that have the same id.
 *
 * 将消息合并到具有相同 id 的组中。
 *
 * Messages with the same id are grouped together so that we can quickly deduplicate messages when
 * rendering into translation files.
 *
 * 具有相同 id 的消息会被分组在一起，以便我们在渲染到翻译文件时可以快速删除重复消息。
 *
 * To ensure that messages are rendered in a deterministic order:
 *
 * 为确保消息以确定的顺序呈现：
 *
 * - the messages within a group are sorted by location (file path, then start position)
 *
 *   组中的消息按位置（文件路径，然后是开始位置）排序
 *
 * - the groups are sorted by the location of the first message in the group
 *
 *   组会按组中第一条消息的位置排序
 *
 * @param messages the messages to consolidate.
 *
 * 要合并的消息。
 *
 * @param getMessageId a function that will compute the message id of a message.
 *
 * 一个将计算消息的消息 id 的函数。
 *
 * @returns
 *
 * an array of message groups, where each group is an array of messages that have the same
 *     id.
 *
 * 消息组的数组，其中每个组都是具有相同 id 的消息数组。
 *
 */
export function consolidateMessages(
    messages: ɵParsedMessage[],
    getMessageId: (message: ɵParsedMessage) => string): ɵParsedMessage[][] {
  const messageGroups = new Map<MessageId, ɵParsedMessage[]>();
  for (const message of messages) {
    const id = getMessageId(message);
    if (!messageGroups.has(id)) {
      messageGroups.set(id, [message]);
    } else {
      messageGroups.get(id)!.push(message);
    }
  }

  // Here we sort the messages within a group into location order.
  // Note that `Array.sort()` will mutate the array in-place.
  for (const messages of messageGroups.values()) {
    messages.sort(compareLocations);
  }
  // Now we sort the groups by location of the first message in the group.
  return Array.from(messageGroups.values()).sort((a1, a2) => compareLocations(a1[0], a2[0]));
}

/**
 * Does the given message have a location property?
 *
 * 给定的消息是否具有 location 属性？
 *
 */
export function hasLocation(message: ɵParsedMessage): message is ɵParsedMessage&
    {location: ɵSourceLocation} {
  return message.location !== undefined;
}

export function compareLocations(
    {location: location1}: ɵParsedMessage, {location: location2}: ɵParsedMessage): number {
  if (location1 === location2) {
    return 0;
  }
  if (location1 === undefined) {
    return -1;
  }
  if (location2 === undefined) {
    return 1;
  }
  if (location1.file !== location2.file) {
    return location1.file < location2.file ? -1 : 1;
  }
  if (location1.start.line !== location2.start.line) {
    return location1.start.line < location2.start.line ? -1 : 1;
  }
  if (location1.start.column !== location2.start.column) {
    return location1.start.column < location2.start.column ? -1 : 1;
  }
  return 0;
}
