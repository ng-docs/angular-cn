/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ERROR_DETAILS_PAGE_BASE_URL} from './error_details_base_url';

/**
 * The list of error codes used in runtime code of the `core` package.
 * Reserved error code range: 100-999.
 *
 * `core` 包的运行时代码中使用的错误代码列表。保留的错误代码范围： 100-999。
 *
 * Note: the minus sign denotes the fact that a particular code has a detailed guide on
 * angular.io. This extra annotation is needed to avoid introducing a separate set to store
 * error codes which have guides, which might leak into runtime code.
 *
 * 注意：减号表示特定代码在 angular.io
 * 上有详细指南。需要这个额外的注解，以避免引入一个单独的集来存储具有指南的错误代码，这可能会泄漏到运行时代码中。
 *
 * Full list of available error guides can be found at <https://angular.io/errors>.
 *
 * 可用错误指南的完整列表可在<https://angular.io/errors>找到。
 *
 */
export const enum RuntimeErrorCode {
  // Change Detection Errors
  EXPRESSION_CHANGED_AFTER_CHECKED = -100,
  RECURSIVE_APPLICATION_REF_TICK = 101,

  // Dependency Injection Errors
  CYCLIC_DI_DEPENDENCY = -200,
  PROVIDER_NOT_FOUND = -201,
  INVALID_FACTORY_DEPENDENCY = 202,
  MISSING_INJECTION_CONTEXT = -203,
  INVALID_INJECTION_TOKEN = 204,
  INJECTOR_ALREADY_DESTROYED = 205,
  PROVIDER_IN_WRONG_CONTEXT = 207,
  MISSING_INJECTION_TOKEN = 208,
  INVALID_MULTI_PROVIDER = 209,

  // Template Errors
  MULTIPLE_COMPONENTS_MATCH = -300,
  EXPORT_NOT_FOUND = -301,
  PIPE_NOT_FOUND = -302,
  UNKNOWN_BINDING = 303,
  UNKNOWN_ELEMENT = 304,
  TEMPLATE_STRUCTURE_ERROR = 305,
  INVALID_EVENT_BINDING = 306,
  HOST_DIRECTIVE_UNRESOLVABLE = 307,
  HOST_DIRECTIVE_NOT_STANDALONE = 308,
  DUPLICATE_DIRECTITVE = 309,
  HOST_DIRECTIVE_COMPONENT = 310,
  HOST_DIRECTIVE_UNDEFINED_BINDING = 311,
  HOST_DIRECTIVE_CONFLICTING_ALIAS = 312,

  // Bootstrap Errors
  MULTIPLE_PLATFORMS = 400,
  PLATFORM_NOT_FOUND = 401,
  ERROR_HANDLER_NOT_FOUND = 402,
  BOOTSTRAP_COMPONENTS_NOT_FOUND = 403,
  PLATFORM_ALREADY_DESTROYED = 404,
  ASYNC_INITIALIZERS_STILL_RUNNING = 405,
  APPLICATION_REF_ALREADY_DESTROYED = 406,
  RENDERER_NOT_FOUND = 407,

  // Styling Errors

  // Declarations Errors

  // i18n Errors
  INVALID_I18N_STRUCTURE = 700,
  MISSING_LOCALE_DATA = 701,

  // standalone errors
  IMPORT_PROVIDERS_FROM_STANDALONE = 800,

  // JIT Compilation Errors
  // Other
  INVALID_DIFFER_INPUT = 900,
  NO_SUPPORTING_DIFFER_FACTORY = 901,
  VIEW_ALREADY_ATTACHED = 902,
  INVALID_INHERITANCE = 903,
  UNSAFE_VALUE_IN_RESOURCE_URL = 904,
  UNSAFE_VALUE_IN_SCRIPT = 905,
  MISSING_GENERATED_DEF = 906,
  TYPE_IS_NOT_STANDALONE = 907,
  MISSING_ZONEJS = 908,
  UNEXPECTED_ZONE_STATE = 909,
  UNSAFE_IFRAME_ATTRS = -910,
}

/**
 * Class that represents a runtime error.
 * Formats and outputs the error message in a consistent way.
 *
 * 表示运行时错误的类。以一致的方式格式化和输出错误消息。
 *
 * Example:
 *
 * 示例：
 *
 * ```
 *  throw new RuntimeError(
 *    RuntimeErrorCode.INJECTOR_ALREADY_DESTROYED,
 *    ngDevMode && 'Injector has already been destroyed.');
 * ```
 *
 * Note: the `message` argument contains a descriptive error message as a string in development
 * mode (when the `ngDevMode` is defined). In production mode (after tree-shaking pass), the
 * `message` argument becomes `false`, thus we account for it in the typings and the runtime logic.
 *
 * 注意： `message` 参数在开发模式下（定义 `ngDevMode`
 * 时）包含作为字符串的描述性错误消息。在生产模式下（在 tree-shaking 通过之后），`message` 参数变为
 * `false` ，因此我们在分型和运行时逻辑中考虑了它。
 *
 */
export class RuntimeError<T extends number = RuntimeErrorCode> extends Error {
  constructor(public code: T, message: null|false|string) {
    super(formatRuntimeError<T>(code, message));
  }
}

/**
 * Called to format a runtime error.
 * See additional info on the `message` argument type in the `RuntimeError` class description.
 *
 * 调用以格式化运行时错误。请参阅 `RuntimeError` 类描述中有关 `message` 参数类型的其他信息。
 *
 */
export function formatRuntimeError<T extends number = RuntimeErrorCode>(
    code: T, message: null|false|string): string {
  // Error code might be a negative number, which is a special marker that instructs the logic to
  // generate a link to the error details page on angular.io.
  // We also prepend `0` to non-compile-time errors.
  const fullCode = `NG0${Math.abs(code)}`;

  let errorMessage = `${fullCode}${message ? ': ' + message.trim() : ''}`;

  if (ngDevMode && code < 0) {
    const addPeriodSeparator = !errorMessage.match(/[.,;!?]$/);
    const separator = addPeriodSeparator ? '.' : '';
    errorMessage =
        `${errorMessage}${separator} Find more at ${ERROR_DETAILS_PAGE_BASE_URL}/${fullCode}`;
  }
  return errorMessage;
}
