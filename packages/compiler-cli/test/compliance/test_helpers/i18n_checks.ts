/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const EXTRACT_GENERATED_TRANSLATIONS_REGEXP =
    /const\s*(.*?)\s*=\s*goog\.getMsg\("(.*?)",?\s*(.*?)\)/g;

/**
 * Verify that placeholders in translation strings match placeholders in the object defined in the
 * `goog.getMsg()` function arguments.
 *
 * 验证翻译字符串中的占位符是否与 `goog.getMsg()` 函数参数中定义的对象中的占位符匹配。
 *
 */
export function verifyPlaceholdersIntegrity(output: string): boolean {
  const translations = extractTranslations(output);
  translations.forEach(([msg, args]) => {
    const bodyPhs = extractPlaceholdersFromMsg(msg);
    const argsPhs = extractPlaceholdersFromArgs(args);
    if (bodyPhs.size !== argsPhs.size || diff(bodyPhs, argsPhs).size) {
      return false;
    }
  });
  return true;
}

/**
 * Verify that all the variables initialized with `goog.getMsg()` calls have
 * unique names.
 *
 * 验证使用 `goog.getMsg()` 调用初始化的所有变量都具有唯一名称。
 *
 */
export function verifyUniqueConsts(output: string): boolean {
  extract(
      output, EXTRACT_GENERATED_TRANSLATIONS_REGEXP,
      (current: string[], state: Set<string>): string => {
        const key = current[1];
        if (state.has(key)) {
          throw new Error(`Duplicate const ${key} found in generated output!`);
        }
        return key;
      });
  return true;
}


/**
 * Extract pairs of `[msg, placeholders]`, in calls to `goog.getMsg()`, from the `source`.
 *
 * 在对 `goog.getMsg()` 的调用中，从 `source` 提取成对的 `[msg, placeholders]` 。
 *
 * @param source The source code to parse.
 *
 * 要解析的源代码。
 *
 */
function extractTranslations(source: string): Set<string[]> {
  return extract(
      source, EXTRACT_GENERATED_TRANSLATIONS_REGEXP,
      ([, , msg, placeholders]) => [msg, placeholders]);
}

/**
 * Extract placeholder names (of the form `{$PLACEHOLDER}`) from the `msg`.
 *
 * 从 `msg` 中提取占位符名称（格式 `{$PLACEHOLDER}` ）。
 *
 * @param msg The text of the message to parse.
 *
 * 要解析的消息的文本。
 *
 */
function extractPlaceholdersFromMsg(msg: string): Set<string> {
  const regex = /{\$(.*?)}/g;
  return extract(msg, regex, ([, placeholders]) => placeholders);
}

/**
 * Extract the placeholder names (of the form `"PLACEHOLDER": "XXX"`) from the body of the argument
 * provided as `args`.
 *
 * 从作为 `args` 提供的参数主体中提取占位符名称（格式为 `"PLACEHOLDER": "XXX"` ）。
 *
 * @param args The body of an object literal containing placeholder info.
 *
 * 包含占位符信息的对象文字的主体。
 *
 */
function extractPlaceholdersFromArgs(args: string): Set<string> {
  const regex = /\s+"(.+?)":\s*".*?"/g;
  return extract(args, regex, ([, placeholders]) => placeholders);
}

function extract<T>(
    from: string, regex: RegExp, transformFn: (match: string[], state: Set<T>) => T): Set<T> {
  const result = new Set<T>();
  let item;
  while ((item = regex.exec(from)) !== null) {
    result.add(transformFn(item, result));
  }
  return result;
}

function diff(a: Set<string>, b: Set<string>): Set<string> {
  return new Set(Array.from(a).filter(x => !b.has(x)));
}
