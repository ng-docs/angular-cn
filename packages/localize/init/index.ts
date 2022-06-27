/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ɵ$localize as $localize, ɵ_global as _global, ɵLocalizeFn as LocalizeFn, ɵTranslateFn as TranslateFn} from '@angular/localize';

export {$localize, LocalizeFn, TranslateFn};

// Attach $localize to the global context, as a side-effect of this module.
_global.$localize = $localize;

// `declare global` allows us to escape the current module and place types on the global namespace
declare global {
  /**
   * Tag a template literal string for localization.
   *
   * 标记模板文字字符串以进行本地化。
   *
   * For example:
   *
   * 例如：
   *
   * ```ts
   * $localize `some string to localize`
   * ```
   *
   * **Providing meaning, description and id**
   *
   * **提供含义、描述和 id**
   *
   * You can optionally specify one or more of `meaning`, `description` and `id` for a localized
   * string by pre-pending it with a colon delimited block of the form:
   *
   * 你可以选择为本地化字符串指定 `meaning` 、 `description` 和 `id`
   * 中的一个或多个，方法是在其前面使用以下形式的冒号分隔块：
   *
   * ```ts
   * $localize`:meaning|description@@id:source message text`;
   *
   * $localize`:meaning|:source message text`;
   * $localize`:description:source message text`;
   * $localize`:@@id:source message text`;
   * ```
   *
   * This format is the same as that used for `i18n` markers in Angular templates. See the
   * [Angular 18n guide](guide/i18n-common-prepare#mark-text-in-component-template).
   *
   * 此格式与 Angular 模板中用于 `i18n` 标记的格式相同。请参阅[Angular 18n
   * 指南](guide/i18n-common-prepare#mark-text-in-component-template)。
   *
   * **Naming placeholders**
   *
   * **命名占位符**
   *
   * If the template literal string contains expressions, then the expressions will be automatically
   * associated with placeholder names for you.
   *
   * 如果模板文字字符串包含表达式，那么这些表达式将自动为你与占位符名称相关联。
   *
   * For example:
   *
   * 例如：
   *
   * ```ts
   * $localize `Hi ${name}! There are ${items.length} items.`;
   * ```
   *
   * will generate a message-source of `Hi {$PH}! There are {$PH_1} items`.
   *
   * 将生成 `Hi {$PH}! There are {$PH_1} items` 。
   *
   * The recommended practice is to name the placeholder associated with each expression though.
   *
   * 推荐的实践是命名与每个表达式关联的占位符。
   *
   * Do this by providing the placeholder name wrapped in `:` characters directly after the
   * expression. These placeholder names are stripped out of the rendered localized string.
   *
   * 通过在表达式之后直接提供用 `:`
   * 字符包装的占位符名称来实现。这些占位符名称会从呈现的本地化字符串中删除。
   *
   * For example, to name the `items.length` expression placeholder `itemCount` you write:
   *
   * 例如，要命名 `items.length` 表达式占位符 `itemCount` ，你可以这样写：
   *
   * ```ts
   * $localize `There are ${items.length}:itemCount: items`;
   * ```
   *
   * **Escaping colon markers**
   *
   * **转义冒号标记**
   *
   * If you need to use a `:` character directly at the start of a tagged string that has no
   * metadata block, or directly after a substitution expression that has no name you must escape
   * the `:` by preceding it with a backslash:
   *
   * 如果你需要直接在没有元数据块的标记字符串的开头使用 `:`
   * 字符，或直接在没有名称的替换表达式之后使用 : ，你必须在 `:` 之前使用反斜杠来转译：
   *
   * For example:
   *
   * 例如：
   *
   * ```ts
   * // message has a metadata block so no need to escape colon
   * $localize `:some description::this message starts with a colon (:)`;
   * // no metadata block so the colon must be escaped
   * $localize `\:this message starts with a colon (:)`;
   * ```
   *
   * ```ts
   * // named substitution so no need to escape colon
   * $localize `${label}:label:: ${}`
   * // anonymous substitution so colon must be escaped
   * $localize `${label}\: ${}`
   * ```
   *
   * **Processing localized strings:**
   *
   * **处理本地化字符串：**
   *
   * There are three scenarios:
   *
   * 有三种情况：
   *
   * * **compile-time inlining**: the `$localize` tag is transformed at compile time by a
   *   transpiler, removing the tag and replacing the template literal string with a translated
   *   literal string from a collection of translations provided to the transpilation tool.
   *
   *   **编译时内联**： `$localize`
   * 标签在编译时由转译器转换，删除标签并使用提供给转译工具的翻译集合中的翻译后的文字字符串替换模板文字字符串。
   *
   * * **run-time evaluation**: the `$localize` tag is a run-time function that replaces and
   *   reorders the parts (static strings and expressions) of the template literal string with
   * strings from a collection of translations loaded at run-time.
   *
   *   **运行时估算**： `$localize`
   * 标签是一个运行时函数，它会使用运行时加载的翻译集合中的字符串替换模板文字字符串的部分（静态字符串和表达式）并重新排序。
   *
   * * **pass-through evaluation**: the `$localize` tag is a run-time function that simply evaluates
   *   the original template literal string without applying any translations to the parts. This
   *   version is used during development or where there is no need to translate the localized
   *   template literals.
   *
   *   **传递估算**： `$localize`
   * 标签是一个运行时函数，它只是估算原始模板文字字符串，而不对各个部分应用任何翻译。此版本在开发期间或无需翻译本地化模板文字的地方使用。
   *
   * @param messageParts a collection of the static parts of the template string.
   *
   * 模板字符串的静态部分的集合。
   *
   * @param expressions a collection of the values of each placeholder in the template string.
   *
   * 模板字符串中每个占位符的值的集合。
   *
   * @returns
   *
   * the translated string, with the `messageParts` and `expressions` interleaved together.
   *
   * 翻译后的字符串， `messageParts` 和 `expressions` 交错在一起。
   *
   */
  const $localize: LocalizeFn;
}
