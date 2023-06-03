/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ExtendedTemplateDiagnosticName} from '../../../../ngtsc/diagnostics';

/**
 * Options supported by the legacy View Engine compiler, which are still consumed by the Angular Ivy
 * compiler for backwards compatibility.
 *
 * 旧版 View Engine 编译器支持的选项，Angular Ivy 编译器仍然使用这些选项以实现向后兼容。
 *
 * These are expected to be removed at some point in the future.
 *
 * 预计这些将在未来的某个时候被删除。
 *
 * @publicApi
 */
export interface LegacyNgcOptions {
  /**
   * generate all possible generated files
   *
   * 生成所有可能的生成文件
   *
   */
  allowEmptyCodegenFiles?: boolean;

  /**
   * Whether to type check the entire template.
   *
   * 是否类型检查整个模板。
   *
   * This flag currently controls a couple aspects of template type-checking, including
   * whether embedded views are checked.
   *
   * 此标志当前控制模板类型检查的几个方面，包括是否检查嵌入式视图。
   *
   * For maximum type-checking, set this to `true`, and set `strictTemplates` to `true`.
   *
   * 对于最大程度的类型检查，请将其设置为 `true` ，并将 `strictTemplates` 设置为 `true` 。
   *
   * It is an error for this flag to be `false`, while `strictTemplates` is set to `true`.
   *
   * 此标志为 `false` 是错误的，而 `strictTemplates` 设置为 `true` 。
   *
   * @deprecated
   *
   * The `fullTemplateTypeCheck` option has been superseded by the more granular
   * `strictTemplates` family of compiler options. Usage of `fullTemplateTypeCheck` is therefore
   * deprecated, `strictTemplates` and its related options should be used instead.
   *
   * `fullTemplateTypeCheck` 选项已被更细化的 `strictTemplates` 系列编译器选项取代。因此，不推荐使用
   * `fullTemplateTypeCheck` ，应改为使用 `strictTemplates` 及其相关选项。
   *
   */
  fullTemplateTypeCheck?: boolean;

  /**
   * Whether to generate a flat module index of the given name and the corresponding
   * flat module metadata. This option is intended to be used when creating flat
   * modules similar to how `@angular/core` and `@angular/common` are packaged.
   * When this option is used the `package.json` for the library should refer to the
   * generated flat module index instead of the library index file. When using this
   * option only one .metadata.json file is produced that contains all the metadata
   * necessary for symbols exported from the library index.
   * In the generated .ngfactory.ts files flat module index is used to import symbols
   * including both the public API from the library index as well as shrouded internal
   * symbols.
   * By default the .ts file supplied in the `files` field is assumed to be the
   * library index. If more than one is specified, uses `libraryIndex` to select the
   * file to use. If more than one .ts file is supplied and no `libraryIndex` is supplied
   * an error is produced.
   * A flat module index .d.ts and .js will be created with the given `flatModuleOutFile`
   * name in the same location as the library index .d.ts file is emitted.
   * For example, if a library uses `public_api.ts` file as the library index of the
   * module the `tsconfig.json` `files` field would be `["public_api.ts"]`. The
   * `flatModuleOutFile` options could then be set to, for example `"index.js"`, which
   * produces `index.d.ts` and  `index.metadata.json` files. The library's
   * `package.json`'s `module` field would be `"index.js"` and the `typings` field would
   * be `"index.d.ts"`.
   *
   * 是否生成给定名称的平面模块索引和对应的平面模块元数据。此选项旨在在创建类似于 `@angular/core` 和
   * `@angular/common` 的打包方式的平面模块时使用。使用此选项时，库的 `package.json`
   * 应该引用生成的平面模块索引，而不是库索引文件。使用此选项时，只会生成一个 .metadata.json
   * 文件，其中包含从库索引导出的符号所需的所有元数据。在生成的 .ngfactory.ts
   * 文件中，平面模块索引用于导入符号，包括库索引中的公共 API 以及隐藏的内部符号。默认情况下，
   * `files` 字段中提供的 .ts 文件被假定为库索引。如果指定了多个，则使用 `libraryIndex`
   * 来选择要使用的文件。如果提供了多个 .ts 文件，并且没有提供 `libraryIndex`
   * ，则会产生错误。将使用给定的 `flatModuleOutFile` 名称在发出库索引 .d.ts
   * 文件的位置创建一个平面模块索引 .d.ts 和 .js。例如，如果一个库使用 `public_api.ts`
   * 文件作为模块的库索引，则 `tsconfig.json` `files` 字段将是 `["public_api.ts"]` 。然后可以将
   * `flatModuleOutFile` 选项设置为例如 `"index.js"` ，它会生成 `index.d.ts` 和
   * `index.metadata.json` 文件。库的 `package.json` 的 `module` 字段将是 `"index.js"` ，`typings`
   * 字段将是 `"index.d.ts"` 。
   *
   */
  flatModuleOutFile?: string;

  /**
   * Preferred module id to use for importing flat module. References generated by `ngc`
   * will use this module name when importing symbols from the flat module. This is only
   * meaningful when `flatModuleOutFile` is also supplied. It is otherwise ignored.
   *
   * 用于导入平面模块的首选模块 ID。从平面模块导入符号时，`ngc`
   * 生成的引用将使用此模块名称。这仅在同时提供了 `flatModuleOutFile` 时才有意义。否则被忽略。
   *
   */
  flatModuleId?: string;

  /**
   * Always report errors a parameter is supplied whose injection type cannot
   * be determined. When this value option is not provided or is `false`, constructor
   * parameters of classes marked with `@Injectable` whose type cannot be resolved will
   * produce a warning. With this option `true`, they produce an error. When this option is
   * not provided is treated as if it were `false`.
   *
   * 始终报告错误，提供了无法确定注入类型的参数。当未提供此值选项或为 `false` 时，无法解析类型的带有
   * `@Injectable` 标记的类的构造函数参数将产生警告。使用此选项 `true`
   * ，它们会产生错误。当未提供此选项时，被视为 `false` 。
   *
   */
  strictInjectionParameters?: boolean;

  /**
   * Whether to remove blank text nodes from compiled templates. It is `false` by default starting
   * from Angular 6.
   *
   * 是否从已编译的模板中删除空白文本节点。从 Angular 6 开始，默认情况下为 `false` 。
   *
   */
  preserveWhitespaces?: boolean;
}

/**
 * Options related to template type-checking and its strictness.
 *
 * 与模板类型检查及其严格性相关的选项。
 *
 * @publicApi
 */
export interface StrictTemplateOptions {
  /**
   * If `true`, implies all template strictness flags below \(unless individually disabled\).
   *
   * 如果为 `true` ，则意味着下面的所有模板严格性标志（除非单独禁用）。
   *
   * This flag is a superset of the deprecated `fullTemplateTypeCheck` option.
   *
   * 此标志是已弃用的 `fullTemplateTypeCheck` 选项的超集。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is `true`.
   *
   * 默认为 `false` ，即使 "fullTemplateTypeCheck" 是 `true` 。
   *
   */
  strictTemplates?: boolean;


  /**
   * Whether to check the type of a binding to a directive/component input against the type of the
   * field on the directive/component.
   *
   * 是否根据指令/组件上字段的类型检查与指令/组件输入的绑定的类型。
   *
   * For example, if this is `false` then the expression `[input]="expr"` will have `expr` type-
   * checked, but not the assignment of the resulting type to the `input` property of whichever
   * directive or component is receiving the binding. If set to `true`, both sides of the assignment
   * are checked.
   *
   * 例如，如果 this 为 `false` ，则表达式 `[input]="expr"` 将进行 `expr`
   * 类型检查，但不会将结果类型分配给正在接收绑定的任何指令或组件的 `input` 属性。如果设置为 `true`
   * ，则会检查赋值的两边。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。
   *
   */
  strictInputTypes?: boolean;

  /**
   * Whether to check if the input binding attempts to assign to a restricted field \(readonly,
   * private, or protected\) on the directive/component.
   *
   * 是否检查输入绑定是否尝试分配给指令/组件上的受限字段（只读、私有或受保护）。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck", "strictTemplates" and/or
   * "strictInputTypes" is set. Note that if `strictInputTypes` is not set, or set to `false`, this
   * flag has no effect.
   *
   * 默认为 `false`
   * ，即使设置了“fullTemplateTypeCheck”、“strictTemplates”和/或“strictInputTypes”。请注意，如果未设置
   * `strictInputTypes` 或设置为 `false` ，则此标志无效。
   *
   * Tracking issue for enabling this by default: https://github.com/angular/angular/issues/38400
   *
   * 默认启用此功能的跟踪问题： https://github.com/angular/angular/issues/38400
   *
   */
  strictInputAccessModifiers?: boolean;

  /**
   * Whether to use strict null types for input bindings for directives.
   *
   * 是否对指令的输入绑定使用严格的 null 类型。
   *
   * If this is `true`, applications that are compiled with TypeScript's `strictNullChecks` enabled
   * will produce type errors for bindings which can evaluate to `undefined` or `null` where the
   * inputs's type does not include `undefined` or `null` in its type. If set to `false`, all
   * binding expressions are wrapped in a non-null assertion operator to effectively disable strict
   * null checks.
   *
   * 如果为 `true` ，在启用 TypeScript 的 `strictNullChecks`
   * 的情况下编译的应用程序将产生绑定类型错误，如果输入的类型不包含 `undefined` 或 `null`
   * ，则可以估算为 `undefined` 或 `null` 。如果设置为 `false` ，则所有绑定表达式都包含在非 null
   * 断言运算符中，以有效禁用严格的 null 检查。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set. Note that if `strictInputTypes` is
   * not set, or set to `false`, this flag has no effect.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。请注意，如果未设置 `strictInputTypes`
   * 或设置为 `false` ，则此标志无效。
   *
   */
  strictNullInputTypes?: boolean;

  /**
   * Whether to check text attributes that happen to be consumed by a directive or component.
   *
   * 是否检查恰好被指令或组件使用的文本属性。
   *
   * For example, in a template containing `<input matInput disabled>` the `disabled` attribute ends
   * up being consumed as an input with type `boolean` by the `matInput` directive. At runtime, the
   * input will be set to the attribute's string value, which is an empty string for attributes
   * without a value, so with this flag set to `true`, an error would be reported. If set to
   * `false`, text attributes will never report an error.
   *
   * 例如，在包含 `<input matInput disabled>` 的模板中，`disabled` 属性最终会被 `matInput` 指令作为
   * `boolean`
   * 类型的输入使用。在运行时，输入将设置为属性的字符串值，对于没有值的属性，这是一个空字符串，因此在此标志设置为
   * `true` 的情况下，将报告错误。如果设置为 `false` ，则文本属性将永远不会报告错误。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set. Note that if `strictInputTypes` is
   * not set, or set to `false`, this flag has no effect.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。请注意，如果未设置 `strictInputTypes`
   * 或设置为 `false` ，则此标志无效。
   *
   */
  strictAttributeTypes?: boolean;

  /**
   * Whether to use a strict type for null-safe navigation operations.
   *
   * 是否将严格类型用于 null 安全的导航操作。
   *
   * If this is `false`, then the return type of `a?.b` or `a?()` will be `any`. If set to `true`,
   * then the return type of `a?.b` for example will be the same as the type of the ternary
   * expression `a != null ? a.b : a`.
   *
   * 如果这是 `false` ，则 `a?.b` 或 `a?()` 的返回类型将是 `any` 。如果设置为 `true` ，则 `a?.b`
   * 的返回类型将与三元表达式 `a != null ? ab : a` 的类型相同 `a != null ? ab : a` 。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。
   *
   */
  strictSafeNavigationTypes?: boolean;

  /**
   * Whether to infer the type of local references.
   *
   * 是否推断本地引用的类型。
   *
   * If this is `true`, the type of a `#ref` variable on a DOM node in the template will be
   * determined by the type of `document.createElement` for the given DOM node. If set to `false`,
   * the type of `ref` for DOM nodes will be `any`.
   *
   * 如果为 `true` ，则模板中 DOM 节点上的 `#ref` 变量的类型将由给定 DOM 节点的
   * `document.createElement` 类型确定。如果设置为 `false` ，则 DOM 节点的 `ref` 类型将是 `any` 。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。
   *
   */
  strictDomLocalRefTypes?: boolean;

  /**
   * Whether to infer the type of the `$event` variable in event bindings for directive outputs or
   * animation events.
   *
   * 是在指令输出或动画事件的事件绑定中推断 `$event` 变量的类型。
   *
   * If this is `true`, the type of `$event` will be inferred based on the generic type of
   * `EventEmitter`/`Subject` of the output. If set to `false`, the `$event` variable will be of
   * type `any`.
   *
   * 如果为 `true` ，则 `$event` 的类型将根据输出的 `EventEmitter` / `Subject`
   * 的泛型类型来推断。如果设置为 `false` ，则 `$event` 变量将是 `any` 类型。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。
   *
   */
  strictOutputEventTypes?: boolean;

  /**
   * Whether to infer the type of the `$event` variable in event bindings to DOM events.
   *
   * 是否在到 DOM 事件的事件绑定中推断 `$event` 变量的类型。
   *
   * If this is `true`, the type of `$event` will be inferred based on TypeScript's
   * `HTMLElementEventMap`, with a fallback to the native `Event` type. If set to `false`, the
   * `$event` variable will be of type `any`.
   *
   * 如果为 `true` ，则 `$event` 的类型将根据 TypeScript 的 `HTMLElementEventMap` 推断，并回退到本机
   * `Event` 类型。如果设置为 `false` ，则 `$event` 变量将是 `any` 类型。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。
   *
   */
  strictDomEventTypes?: boolean;

  /**
   * Whether to include the generic type of components when type-checking the template.
   *
   * 对模板进行类型检查时是否包含通用类型的组件。
   *
   * If no component has generic type parameters, this setting has no effect.
   *
   * 如果没有组件具有泛型类型参数，则此设置无效。
   *
   * If a component has generic type parameters and this setting is `true`, those generic parameters
   * will be included in the context type for the template. If `false`, any generic parameters will
   * be set to `any` in the template context type.
   *
   * 如果组件具有泛型类型参数并且此设置为 `true` ，则这些泛型参数将包含在模板的上下文类型中。如果
   * `false` ，则任何泛型参数在模板上下文类型中都将设置为 `any` 。
   *
   * Defaults to `false`, even if "fullTemplateTypeCheck" is set.
   *
   * 默认为 `false` ，即使设置了 "fullTemplateTypeCheck" 。
   *
   */
  strictContextGenerics?: boolean;

  /**
   * Whether object or array literals defined in templates use their inferred type, or are
   * interpreted as `any`.
   *
   * 模板中定义的对象或数组文字是使用它们的推断类型，还是被解释为 `any` 。
   *
   * Defaults to `false` unless `fullTemplateTypeCheck` or `strictTemplates` are set.
   *
   * 默认为 `false` ，除非设置了 `fullTemplateTypeCheck` 或 `strictTemplates` 。
   *
   */
  strictLiteralTypes?: boolean;
}

/**
 * A label referring to a `ts.DiagnosticCategory` or `'suppress'`, meaning the associated diagnostic
 * should not be displayed at all.
 *
 * 引用 `ts.DiagnosticCategory` 或 `'suppress'` 的标签，这意味着根本不应该显示关联的诊断。
 *
 * @publicApi
 */
export enum DiagnosticCategoryLabel {
  /**
   * Treat the diagnostic as a warning, don't fail the compilation.
   *
   * 将诊断视为警告，不要使编译失败。
   *
   */
  Warning = 'warning',

  /**
   * Treat the diagnostic as a hard error, fail the compilation.
   *
   * 将诊断视为硬错误，使编译失败。
   *
   */
  Error = 'error',

  /**
   * Ignore the diagnostic altogether.
   *
   * 完全忽略诊断。
   *
   */
  Suppress = 'suppress',
}

/**
 * Options which control how diagnostics are emitted from the compiler.
 *
 * 控制如何从编译器发出诊断信息的选项。
 *
 * @publicApi
 */
export interface DiagnosticOptions {
  /**
   * Options which control how diagnostics are emitted from the compiler.
   *
   * 控制如何从编译器发出诊断信息的选项。
   *
   */
  extendedDiagnostics?: {
    /**
     * The category to use for configurable diagnostics which are not overridden by `checks`. Uses
     * `warning` by default.
     *
     * 用于不会被 `checks` 覆盖的可配置诊断的类别。默认使用 `warning` 。
     *
     */
    defaultCategory?: DiagnosticCategoryLabel;

    /**
     * A map of each extended template diagnostic's name to its category. This can be expanded in
     * the future with more information for each check or for additional diagnostics not part of the
     * extended template diagnostics system.
     *
     * 每个扩展模板诊断的名称到其类别的映射。将来可以通过为每次检查或不属于扩展模板诊断系统一部分的额外诊断提供更多信息来扩展这点。
     *
     */
    checks?: {[Name in ExtendedTemplateDiagnosticName]?: DiagnosticCategoryLabel};
  };
}

/**
 * Options which control behavior useful for "monorepo" build cases using Bazel \(such as the
 * internal Google monorepo, g3\).
 *
 * 使用 Bazel 控制可用于“monorepo”构建用例的行为的选项（例如内部的 Google monorepo、g3）。
 *
 * @publicApi
 */
export interface BazelAndG3Options {
  /**
   * Enables the generation of alias re-exports of directives/pipes that are visible from an
   * NgModule from that NgModule's file.
   *
   * 允许生成从 NgModule 文件中的 NgModule 可见的指令/管道的别名重新导出。
   *
   * This option should be disabled for application builds or for Angular Package Format libraries
   * \(where NgModules along with their directives/pipes are exported via a single entrypoint\).
   *
   * 应该为应用程序构建或 Angular 包格式库（其中的 NgModules
   * 及其指令/管道通过单个入口点导出）禁用此选项。
   *
   * For other library compilations which are intended to be path-mapped into an application build
   * \(or another library\), enabling this option enables the resulting deep imports to work
   * correctly.
   *
   * 对于旨在路径映射到应用程序构建（或另一个库）的其他库编译，启用此选项可让所生成的深度导入正常工作。
   *
   * A consumer of such a path-mapped library will write an import like:
   *
   * 这种路径映射库的使用者将编写如下导入：
   *
   * ```typescript
   * import {LibModule} from 'lib/deep/path/to/module';
   * ```
   *
   * The compiler will attempt to generate imports of directives/pipes from that same module
   * specifier \(the compiler does not rewrite the user's given import path, unlike View Engine\).
   *
   * 编译器将尝试从同一个模块说明符生成指令/管道的导入（与 View Engine
   * 不同，编译器不会重写用户给定的导入路径）。
   *
   * ```typescript
   * import {LibDir, LibCmp, LibPipe} from 'lib/deep/path/to/module';
   * ```
   *
   * It would be burdensome for users to have to re-export all directives/pipes alongside each
   * NgModule to support this import model. Enabling this option tells the compiler to generate
   * private re-exports alongside the NgModule of all the directives/pipes it makes available, to
   * support these future imports.
   *
   * 对于用户来说，不得不将所有指令/管道与每个 NgModule
   * 一起重新导出以支持此导入模型，这将是一件繁琐的事情。启用此选项会告诉编译器与它提供的所有指令/管道的
   * NgModule 一起生成私有重新导出，以支持这些未来的导入。
   *
   */
  generateDeepReexports?: boolean;

  /**
   * The `.d.ts` file for NgModules contain type pointers to their declarations, imports, and
   * exports. Without this flag, the generated type definition will include
   * components/directives/pipes/NgModules that are declared or imported locally in the NgModule and
   * not necessarily exported to consumers.
   *
   * NgModules 的 `.d.ts`
   * 文件包含指向它们的声明、导入和导出的类型指针。如果没有此标志，生成的类型定义将包括
   * components/directives/pipes/NgModules ，它们在 NgModule
   * 中本地声明或导入，不一定要导出给消费者。
   *
   * With this flag set, the type definition generated in the `.d.ts` for an NgModule will be
   * filtered to only list those types which are publicly exported by the NgModule.
   *
   * 设置此标志后，在 `.d.ts` 中为 NgModule 生成的类型定义将被过滤以仅列出那些由 NgModule
   * 公开导出的类型。
   *
   */
  onlyPublishPublicTypingsForNgModules?: boolean;

  /**
   * Insert JSDoc type annotations needed by Closure Compiler
   *
   * 插入 Closure 编译器所需的 JSDoc 类型注解
   *
   */
  annotateForClosureCompiler?: boolean;
}

/**
 * Options related to i18n compilation support.
 *
 * 与 i18n 编译支持相关的选项。
 *
 * @publicApi
 */
export interface I18nOptions {
  /**
   * Locale of the imported translations
   *
   * 导入翻译的区域设置
   *
   */
  i18nInLocale?: string;

  /**
   * Export format \(xlf, xlf2 or xmb\) when the xi18n operation is requested.
   *
   * 请求 xi18n 操作时的导出格式（xlf、xlf2 或 xmb）。
   *
   */
  i18nOutFormat?: string;

  /**
   * Path to the extracted message file to emit when the xi18n operation is requested.
   *
   * 请求 xi18n 操作时要发出的提取的消息文件的路径。
   *
   */
  i18nOutFile?: string;


  /**
   * Locale of the application \(used when xi18n is requested\).
   *
   * 应用程序的区域设置（请求 xi18n 时使用）。
   *
   */
  i18nOutLocale?: string;

  /**
   * Render `$localize` messages with legacy format ids.
   *
   * 使用旧版格式 ID 渲染 `$localize` 消息。
   *
   * The default value for now is `true`.
   *
   * 现在的默认值为 `true` 。
   *
   * Use this option when use are using the `$localize` based localization messages but
   * have not migrated the translation files to use the new `$localize` message id format.
   *
   * 当使用基于 `$localize` 的本地化消息但尚未迁移翻译文件以使用新的 `$localize` 消息 ID
   * 格式时，可以使用此选项。
   *
   */
  enableI18nLegacyMessageIdFormat?: boolean;

  /**
   * Whether translation variable name should contain external message id
   * \(used by Closure Compiler's output of `goog.getMsg` for transition period\)
   *
   * 翻译变量名称是否应该包含外部消息 id（供 Closure Compiler 的 `goog.getMsg` 输出在过渡期使用）
   *
   */
  i18nUseExternalIds?: boolean;

  /**
   * If templates are stored in external files \(e.g. via `templateUrl`\) then we need to decide
   * whether or not to normalize the line-endings \(from `\r\n` to `\n`\) when processing ICU
   * expressions.
   *
   * 如果模板存储在外部文件中（例如通过 `templateUrl`），那么我们需要在处理 ICU
   * 表达式时决定是否对行结尾进行规范化（从 `\r\n` 到 `\n`）。
   *
   * Ideally we would always normalize, but for backward compatibility this flag allows the template
   * parser to avoid normalizing line endings in ICU expressions.
   *
   * 理想情况下，我们会始终规范化，但为了向后兼容，此标志允许模板解析器避免对 ICU
   * 表达式中的行尾进行规范化。
   *
   * If `true` then we will normalize ICU expression line endings.
   * The default is `false`, but this will be switched in a future major release.
   *
   * 如果 `true` ，那么我们将规范化 ICU 表达式行结尾。默认值为 `false`
   * ，但这将在未来的主要版本中切换。
   *
   */
  i18nNormalizeLineEndingsInICUs?: boolean;
}

/**
 * Options that specify compilation target.
 *
 * 指定编译目标的选项。
 *
 * @publicApi
 */
export interface TargetOptions {
  /**
   * Specifies the compilation mode to use. The following modes are available:
   *
   * 指定要使用的编译模式。有以下模式可供使用：
   *
   * - 'full': generates fully AOT compiled code using Ivy instructions.
   *
   *   “full”：使用 Ivy 指令生成完全 AOT 编译的代码。
   *
   * - 'partial': generates code in a stable, but intermediate form suitable for publication to NPM.
   *
   * - 'experimental-local': generates code based on each individual source file without using its
   *   dependencies. This mode is suitable only for fast edit/refresh during development. It will be
   *   eventually replaced by the value `local` once the feature is ready to be public.
   *
   *   “partial”：以适合发布到 NPM 的稳定但中间形式生成代码。
   *
   * The default value is 'full'.
   *
   * 默认值为“完整”。
   *
   */
  compilationMode?: 'full'|'partial'|'experimental-local';
}

/**
 * Miscellaneous options that don't fall into any other category
 *
 * 不属于任何其他类别的杂项选项
 *
 * @publicApi
 */
export interface MiscOptions {
  /**
   * Whether the compiler should avoid generating code for classes that haven't been exported.
   * Defaults to `true`.
   *
   * 编译器是否应该避免为尚未导出的类生成代码。这仅在使用 `enableIvy: true`
   * 构建时才处于活动状态。默认为 `true` 。
   *
   */
  compileNonExportedClasses?: boolean;

  /**
   * Disable TypeScript Version Check.
   *
   * 禁用 TypeScript 版本检查。
   *
   */
  disableTypeScriptVersionCheck?: boolean;
}
