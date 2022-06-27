/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Split the given `text` into an array of "static strings" and ICU "placeholder names".
 *
 * 将给定的 `text` 拆分为“静态字符串”和 ICU “占位符名称”组成的数组。
 *
 * This is required because ICU expressions in `$localize` tagged messages may contain "dynamic"
 * piece (e.g. interpolations or element markers). These markers need to be translated to
 * placeholders in extracted translation files. So we must parse ICUs to identify them and separate
 * them out so that the translation serializers can render them appropriately.
 *
 * 这是必需的，因为 `$localize` 标记消息中的 ICU
 * 表达式可能包含“动态”片段（例如插值或元素标记）。这些标记需要翻译为提取的翻译文件中的占位符。因此，我们必须解析
 * ICU 以识别它们并将它们分开，以便翻译序列化器可以适当地呈现它们。
 *
 * An example of an ICU with interpolations:
 *
 * 带有插值的 ICU 示例：
 *
 * ```
 * {VAR_PLURAL, plural, one {{INTERPOLATION}} other {{INTERPOLATION_1} post}}
 * ```
 *
 * In this ICU, `INTERPOLATION` and `INTERPOLATION_1` are actually placeholders that will be
 * replaced with dynamic content at runtime.
 *
 * 在这个 ICU 中， `INTERPOLATION` 和 `INTERPOLATION_1` 实际上是占位符，将在运行时被替换为动态内容。
 *
 * Such placeholders are identifiable as text wrapped in curly braces, within an ICU case
 * expression.
 *
 * 在 ICU 案例表达式中，此类占位符可识别为花括号中的文本。
 *
 * To complicate matters, it is possible for ICUs to be nested indefinitely within each other. In
 * such cases, the nested ICU expression appears enclosed in a set of curly braces in the same way
 * as a placeholder. The nested ICU expressions can be differentiated from placeholders as they
 * contain a comma `,`, which separates the ICU value from the ICU type.
 *
 * 更复杂的是，ICU 可能会无限期地嵌套在彼此中。在这种情况下，嵌套 ICU
 * 表达式会以与占位符相同的方式出现在一组花括号中。嵌套 ICU 表达式可以与占位符区分，因为它们包含逗号
 * `,` ，它将 ICU 值与 ICU 类型分开。
 *
 * Furthermore, nested ICUs can have placeholders of their own, which need to be extracted.
 *
 * 此外，嵌套 ICU 可以有自己的占位符，需要提取。
 *
 * An example of a nested ICU containing its own placeholders:
 *
 * 包含自己的占位符的嵌套 ICU 的示例：
 *
 * ```
 * {VAR_SELECT_1, select,
 *   invoice {Invoice for {INTERPOLATION}}
 *   payment {{VAR_SELECT, select,
 *     processor {Payment gateway}
 *     other {{INTERPOLATION_1}}
 *   }}
 * ```
 *
 * @param text Text to be broken.
 *
 * 要打破的文本。
 *
 * @returns
 *
 * an array of strings, where
 *
 * 一个字符串数组，其中
 *
 * - even values are static strings (e.g. 0, 2, 4, etc)
 *
 *   偶数值是静态字符串（例如 0、2、4 等）
 *
 * - odd values are placeholder names (e.g. 1, 3, 5, etc)
 *
 *   奇数值是占位符名称（例如 1、3、5 等）
 *
 */
export function extractIcuPlaceholders(text: string): string[] {
  const state = new StateStack();
  const pieces = new IcuPieces();
  const braces = /[{}]/g;

  let lastPos = 0;
  let match: RegExpMatchArray|null;
  while (match = braces.exec(text)) {
    if (match[0] == '{') {
      state.enterBlock();
    } else {
      // We must have hit a `}`
      state.leaveBlock();
    }

    if (state.getCurrent() === 'placeholder') {
      const name = tryParsePlaceholder(text, braces.lastIndex);
      if (name) {
        // We found a placeholder so store it in the pieces;
        // store the current static text (minus the opening curly brace);
        // skip the closing brace and leave the placeholder block.
        pieces.addText(text.substring(lastPos, braces.lastIndex - 1));
        pieces.addPlaceholder(name);
        braces.lastIndex += name.length + 1;
        state.leaveBlock();
      } else {
        // This is not a placeholder, so it must be a nested ICU;
        // store the current static text (including the opening curly brace).
        pieces.addText(text.substring(lastPos, braces.lastIndex));
        state.nestedIcu();
      }
    } else {
      pieces.addText(text.substring(lastPos, braces.lastIndex));
    }
    lastPos = braces.lastIndex;
  }

  // Capture the last piece of text after the ICUs (if any).
  pieces.addText(text.substring(lastPos));
  return pieces.toArray();
}

/**
 * A helper class to store the pieces ("static text" or "placeholder name") in an ICU.
 *
 * 将各个部分（“静态文本”或“占位符名称”）存储在 ICU 中的帮助器类。
 *
 */
class IcuPieces {
  private pieces: string[] = [''];

  /**
   * Add the given `text` to the current "static text" piece.
   *
   * 将给定 `text` 添加到当前的“静态文本”部分。
   *
   * Sequential calls to `addText()` will append to the current text piece.
   *
   * 对 `addText()` 的顺序调用将附加到当前文本段。
   *
   */
  addText(text: string): void {
    this.pieces[this.pieces.length - 1] += text;
  }

  /**
   * Add the given placeholder `name` to the stored pieces.
   *
   * 将给定的占位符 `name` 添加到存储的片段。
   *
   */
  addPlaceholder(name: string): void {
    this.pieces.push(name);
    this.pieces.push('');
  }

  /**
   * Return the stored pieces as an array of strings.
   *
   * 将存储的部分作为字符串数组返回。
   *
   * Even values are static strings (e.g. 0, 2, 4, etc)
   * Odd values are placeholder names (e.g. 1, 3, 5, etc)
   *
   * 偶数值是静态字符串（例如 0、2、4 等） 奇数值是占位符名称（例如 1、3、5 等）
   *
   */
  toArray(): string[] {
    return this.pieces;
  }
}

/**
 * A helper class to track the current state of parsing the strings for ICU placeholders.
 *
 * 一个帮助器类，用于跟踪解析 ICU 占位符的字符串的当前状态。
 *
 * State changes happen when we enter or leave a curly brace block.
 * Since ICUs can be nested the state is stored as a stack.
 *
 * 当我们进入或离开花括号块时，状态会发生变化。由于 ICU 可以嵌套，因此状态存储为堆栈。
 *
 */
class StateStack {
  private stack: ParserState[] = [];

  /**
   * Update the state upon entering a block.
   *
   * 在进入块时更新状态。
   *
   * The new state is computed from the current state and added to the stack.
   *
   * 新状态是根据当前状态计算并添加到堆栈中的。
   *
   */
  enterBlock(): void {
    const current = this.getCurrent();
    switch (current) {
      case 'icu':
        this.stack.push('case');
        break;
      case 'case':
        this.stack.push('placeholder');
        break;
      case 'placeholder':
        this.stack.push('case');
        break;
      default:
        this.stack.push('icu');
        break;
    }
  }

  /**
   * Update the state upon leaving a block.
   *
   * 离开块时更新状态。
   *
   * The previous state is popped off the stack.
   *
   * 前一个状态会从堆栈中弹出。
   *
   */
  leaveBlock(): ParserState {
    return this.stack.pop();
  }

  /**
   * Update the state upon arriving at a nested ICU.
   *
   * 在到达嵌套 ICU 时更新状态。
   *
   * In this case, the current state of "placeholder" is incorrect, so this is popped off and the
   * correct "icu" state is stored.
   *
   * 在这种情况下，“占位符”的当前状态不正确，因此它将弹出并存储正确的“icu”状态。
   *
   */
  nestedIcu(): void {
    const current = this.stack.pop();
    assert(current === 'placeholder', 'A nested ICU must replace a placeholder but got ' + current);
    this.stack.push('icu');
  }

  /**
   * Get the current (most recent) state from the stack.
   *
   * 从堆栈中获取当前（最新）状态。
   *
   */
  getCurrent() {
    return this.stack[this.stack.length - 1];
  }
}
type ParserState = 'icu'|'case'|'placeholder'|undefined;

/**
 * Attempt to parse a simple placeholder name from a curly braced block.
 *
 * 尝试从花括号块解析简单的占位符名称。
 *
 * If the block contains a comma `,` then it cannot be a placeholder - and is probably a nest ICU
 * instead.
 *
 * 如果块包含逗号 `,` 则它不能是占位符 - 并且可能是嵌套 ICU。
 *
 * @param text the whole string that is being parsed.
 *
 * 正在解析的整个字符串。
 *
 * @param start the index of the character in the `text` string where this placeholder may start.
 *
 * `text` 字符串中此占位符可能开始的字符的索引。
 *
 * @returns
 *
 * the placeholder name or `null` if it is not a placeholder.
 *
 * 占位符名称，如果不是占位符，则为 `null` 。
 *
 */
function tryParsePlaceholder(text: string, start: number): string|null {
  for (let i = start; i < text.length; i++) {
    if (text[i] === ',') {
      break;
    }
    if (text[i] === '}') {
      return text.substring(start, i);
    }
  }
  return null;
}

function assert(test: boolean, message: string): void {
  if (!test) {
    throw new Error('Assertion failure: ' + message);
  }
}
