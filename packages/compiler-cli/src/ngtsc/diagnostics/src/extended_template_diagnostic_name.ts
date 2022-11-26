/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Enum holding the name of each extended template diagnostic. The name is used as a user-meaningful
 * value for configuring the diagnostic in the project's options.
 *
 * 包含每个扩展模板诊断的名称的枚举。该名称用作在项目选项中配置诊断的对用户有意义的值。
 *
 * See the corresponding `ErrorCode` for documentation about each specific error.
 * packages/compiler-cli/src/ngtsc/diagnostics/src/error_code.ts
 *
 * 有关每个特定错误的文档，请参阅相应的 `ErrorCode` 。
 * package/compiler-cli/src/ngtsc/diagnostics/src/error_code.ts
 *
 * @publicApi
 */
export enum ExtendedTemplateDiagnosticName {
  INVALID_BANANA_IN_BOX = 'invalidBananaInBox',
  NULLISH_COALESCING_NOT_NULLABLE = 'nullishCoalescingNotNullable',
  OPTIONAL_CHAIN_NOT_NULLABLE = 'optionalChainNotNullable',
  MISSING_CONTROL_FLOW_DIRECTIVE = 'missingControlFlowDirective',
  TEXT_ATTRIBUTE_NOT_BINDING = 'textAttributeNotBinding',
  MISSING_NGFOROF_LET = 'missingNgForOfLet',
  SUFFIX_NOT_SUPPORTED = 'suffixNotSupported',
}
