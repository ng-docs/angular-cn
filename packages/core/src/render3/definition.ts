/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy} from '../change_detection/constants';
import {NG_PROV_DEF} from '../di/interface/defs';
import {Mutable, Type} from '../interface/type';
import {NgModuleDef} from '../metadata/ng_module_def';
import {SchemaMetadata} from '../metadata/schema';
import {ViewEncapsulation} from '../metadata/view';
import {noSideEffects} from '../util/closure';
import {EMPTY_ARRAY, EMPTY_OBJ} from '../util/empty';
import {initNgDevMode} from '../util/ng_dev_mode';
import {stringify} from '../util/stringify';

import {NG_COMP_DEF, NG_DIR_DEF, NG_MOD_DEF, NG_PIPE_DEF} from './fields';
import {ComponentDef, ComponentDefFeature, ComponentTemplate, ComponentType, ContentQueriesFunction, DependencyTypeList, DirectiveDef, DirectiveDefFeature, DirectiveDefList, HostBindingsFunction, PipeDef, PipeDefList, TypeOrFactory, ViewQueriesFunction} from './interfaces/definition';
import {TAttributes, TConstantsOrFactory} from './interfaces/node';
import {CssSelectorList} from './interfaces/projection';


/**
 * Counter used to generate unique IDs for component definitions.
 *
 * 用于为组件定义生成唯一 ID 的计数器。
 *
 */
let componentDefCount = 0;


/**
 * Create a component definition object.
 *
 * 创建组件定义对象。
 *
 * # Example
 *
 * # 例子
 *
 * ```
 * class MyDirective {
 *   // Generated by Angular Template Compiler
 *   // [Symbol] syntax will not be supported by TypeScript until v2.7
 *   static ɵcmp = defineComponent({
 *     ...
 *   });
 * }
 * ```
 *
 * @codeGenApi
 */
export function ɵɵdefineComponent<T>(componentDefinition: {
  /**
   * Directive type, needed to configure the injector.
   *
   * 指令类型，配置注入器所需。
   *
   */
  type: Type<T>;

  /**
   * The selectors that will be used to match nodes to this component.
   *
   * 将用于将节点与此组件匹配的选择器。
   *
   */
  selectors?: CssSelectorList;

  /**
   * The number of nodes, local refs, and pipes in this component template.
   *
   * 此组件模板中的节点、本地引用和管道的数量。
   *
   * Used to calculate the length of this component's LView array, so we
   * can pre-fill the array and set the binding start index.
   *
   * 用于计算此组件的 LView 数组的长度，因此我们可以预填充数组并设置绑定开始索引。
   *
   */
  // TODO(kara): remove queries from this count
  decls: number;

  /**
   * The number of bindings in this component template (including pure fn bindings).
   *
   * 此组件模板中的绑定数量（包括纯 fn 绑定）。
   *
   * Used to calculate the length of this component's LView array, so we
   * can pre-fill the array and set the host binding start index.
   *
   * 用于计算此组件的 LView 数组的长度，因此我们可以预填充数组并设置宿主绑定开始索引。
   *
   */
  vars: number;

  /**
   * A map of input names.
   *
   * 输入名称的映射表。
   *
   * The format is in: `{[actualPropertyName: string]:(string|[string, string])}`.
   *
   * 格式为： `{[actualPropertyName: string]:(string|[string, string])}` 。
   *
   * Given:
   *
   * 给定：
   *
   * ```
   * class MyComponent {
   * ```
   *
   * @Input ()
   *   publicInput1: string;
   * @Input ('publicInput2')
   *   declaredInput2: string;
   * }
   * ```
   *
   * is described as:
   * ```
   * {
   *   publicInput1: 'publicInput1',
   *   declaredInput2: ['publicInput2', 'declaredInput2'],
   * }
   * ```
   *
   * Which the minifier may translate to:
   * ```
   * {
   *   minifiedPublicInput1: 'publicInput1',
   *   minifiedDeclaredInput2: ['publicInput2', 'declaredInput2'],
   * }
   * ```
   *
   * This allows the render to re-construct the minified, public, and declared names
   * of properties.
   *
   * NOTE:
   *  - Because declared and public name are usually same we only generate the array
   *    `['public', 'declared']` format when they differ.
   *  - The reason why this API and `outputs` API is not the same is that `NgOnChanges` has
   *    inconsistent behavior in that it uses declared names rather than minified or public. For
   *    this reason `NgOnChanges` will be deprecated and removed in future version and this
   *    API will be simplified to be consistent with `output`.
   */
  inputs?: {[P in keyof T]?: string | [string, string]};

  /**
   * A map of output names.
   *
   * 输出名称的映射表。
   *
   * The format is in: `{[actualPropertyName: string]:string}`.
   *
   * 格式为： `{[actualPropertyName: string]:string}` 。
   *
   * Which the minifier may translate to: `{[minifiedPropertyName: string]:string}`.
   *
   * 压缩器可以翻译为： `{[minifiedPropertyName: string]:string}` 。
   *
   * This allows the render to re-construct the minified and non-minified names
   * of properties.
   *
   * 这允许渲染器重新构建缩小和非缩小的属性名称。
   *
   */
  outputs?: {[P in keyof T]?: string};

  /**
   * Function executed by the parent template to allow child directive to apply host bindings.
   *
   * 由父模板执行以允许子指令应用宿主绑定的函数。
   *
   */
  hostBindings?: HostBindingsFunction<T>;

  /**
   * The number of bindings in this directive `hostBindings` (including pure fn bindings).
   *
   * 此指令 `hostBindings` 中的绑定数量（包括纯 fn 绑定）。
   *
   * Used to calculate the length of the component's LView array, so we
   * can pre-fill the array and set the host binding start index.
   *
   * 用于计算组件的 LView 数组的长度，因此我们可以预填充数组并设置宿主绑定开始索引。
   *
   */
  hostVars?: number;

  /**
   * Assign static attribute values to a host element.
   *
   * 将静态属性值分配给宿主元素。
   *
   * This property will assign static attribute values as well as class and style
   * values to a host element. Since attribute values can consist of different types of values, the
   * `hostAttrs` array must include the values in the following format:
   *
   * 此属性会将静态属性值以及 class 和 style
   * 值分配给宿主元素。由于属性值可以由不同类型的值组成，因此 `hostAttrs` 数组必须包含以下格式的值：
   *
   * attrs = \[
   *   // static attributes (like `title`, `name`, `id`...)
   *   attr1, value1, attr2, value,
   *
   * attrs = \[ // 静态属性（例如 `title` , `name` , `id` ...）attr1, value1, attr2, value,
   *
   *   // a single namespace value (like `x:id`)
   *   NAMESPACE_MARKER, namespaceUri1, name1, value1,
   *
   * // 单个命名空间值（例如 `x:id`）NAMESPACE_MARKER, namespaceUri1, name1, value1,
   *
   *   // another single namespace value (like `x:name`)
   *   NAMESPACE_MARKER, namespaceUri2, name2, value2,
   *
   * // 另一个单个命名空间值（例如 `x:name`）NAMESPACE_MARKER, namespaceUri2, name2, value2,
   *
   *   // a series of CSS classes that will be applied to the element (no spaces)
   *   CLASSES_MARKER, class1, class2, class3,
   *
   * // 将应用于元素的一系列 CSS 类（无空格）CLASSES_MARKER, class1, class2, class3,
   *
   *   // a series of CSS styles (property + value) that will be applied to the element
   *   STYLES_MARKER, prop1, value1, prop2, value2
   * ]
   *
   * // 将应用于元素 STYLES_MARKER,prop1, value1,prop2, value2 的一系列 CSS 样式（property + value）
   *
   * All non-class and non-style attributes must be defined at the start of the list
   * first before all class and style values are set. When there is a change in value
   * type (like when classes and styles are introduced) a marker must be used to separate
   * the entries. The marker values themselves are set via entries found in the
   * [AttributeMarker] enum.
   *
   * 在设置所有类和风格值之前，必须首先在列表的开头定义所有非类和非风格属性。当值类型发生更改时（例如介绍类和样式时），必须使用标记来分隔条目。标记值本身是通过[AttributeMarker][AttributeMarker]枚举中的条目设置的。
   *
   */
  hostAttrs?: TAttributes;

  /**
   * Function to create instances of content queries associated with a given directive.
   *
   * 用于创建与给定指令关联的内容查询实例的函数。
   *
   */
  contentQueries?: ContentQueriesFunction<T>;

  /**
   * Defines the name that can be used in the template to assign this directive to a variable.
   *
   * 定义可在模板中使用的名称，以将此指令分配给变量。
   *
   * See: {@link Directive.exportAs}
   *
   * 请参阅：{@link Directive.exportAs}
   *
   */
  exportAs?: string[];

  /**
   * Template function use for rendering DOM.
   *
   * 用于渲染 DOM 的模板函数。
   *
   * This function has following structure.
   *
   * 此函数具有以下结构。
   *
   * ```
   * function Template<T>(ctx:T, creationMode: boolean) {
   *   if (creationMode) {
   *     // Contains creation mode instructions.
   *   }
   *   // Contains binding update instructions
   * }
   * ```
   *
   * Common instructions are:
   * Creation mode instructions:
   *
   * 常见的操作指南是： 创建模式操作指南：
   *
   * - `elementStart`, `elementEnd`
   *
   * - `text`
   *
   * - `container`
   *
   * - `listener`
   *
   * Binding update instructions:
   *
   * 绑定更新操作指南：
   *
   * - `bind`
   *
   * - `elementAttribute`
   *
   * - `elementProperty`
   *
   * - `elementClass`
   *
   * - `elementStyle`
   *
   */
  template: ComponentTemplate<T>;

  /**
   * Constants for the nodes in the component's view.
   * Includes attribute arrays, local definition arrays etc.
   *
   * 组件视图中节点的常量。包括属性数组、本地定义数组等。
   *
   */
  consts?: TConstantsOrFactory;

  /**
   * An array of `ngContent[selector]` values that were found in the template.
   *
   * 在模板中找到的 `ngContent[selector]` 值的数组。
   *
   */
  ngContentSelectors?: string[];

  /**
   * Additional set of instructions specific to view query processing. This could be seen as a
   * set of instruction to be inserted into the template function.
   *
   * 特定于视图查询处理的额外操作指南。这可以看作是要插入到模板函数中的一组指令。
   *
   * Query-related instructions need to be pulled out to a specific function as a timing of
   * execution is different as compared to all other instructions (after change detection hooks but
   * before view hooks).
   *
   * 与查询相关的指令需要被提取到特定函数，因为执行时间与所有其他指令（变更检测钩子之后但视图钩子之前）不同。
   *
   */
  viewQuery?: ViewQueriesFunction<T>| null;

  /**
   * A list of optional features to apply.
   *
   * 要应用的可选特性列表。
   *
   * See: {@link NgOnChangesFeature}, {@link ProvidersFeature}
   *
   * 请参阅：{@link NgOnChangesFeature}、{@link ProvidersFeature}
   *
   */
  features?: ComponentDefFeature[];

  /**
   * Defines template and style encapsulation options available for Component's {@link Component}.
   *
   * 定义可用于 Component 的 {@link Component} 的模板和样式封装选项。
   *
   */
  encapsulation?: ViewEncapsulation;

  /**
   * Defines arbitrary developer-defined data to be stored on a renderer instance.
   * This is useful for renderers that delegate to other renderers.
   *
   * 定义要存储在渲染器实例上的任意开发人员定义的数据。这对于委托给其他渲染器的渲染器很有用。
   *
   * see: animation
   *
   * 参见：动画
   *
   */
  data?: {[kind: string]: any};

  /**
   * A set of styles that the component needs to be present for component to render correctly.
   *
   * 组件需要存在的一组样式，以便组件正确呈现。
   *
   */
  styles?: string[];

  /**
   * The strategy that the default change detector uses to detect changes.
   * When set, takes effect the next time change detection is triggered.
   *
   * 默认变更检测器用于检测更改的策略。设置时，会在下次触发变更检测时生效。
   *
   */
  changeDetection?: ChangeDetectionStrategy;

  /**
   * Registry of directives, components, and pipes that may be found in this component's view.
   *
   * 可以在此组件的视图中找到的指令、组件和管道的注册表。
   *
   * This property is either an array of types or a function that returns the array of types. This
   * function may be necessary to support forward declarations.
   *
   * 此属性可以是类型数组，也可以是返回类型数组的函数。此函数可能是支持前向声明所必需的。
   *
   */
  dependencies?: TypeOrFactory<DependencyTypeList>;

  /**
   * The set of schemas that declare elements to be allowed in the component's template.
   *
   * 声明组件模板中允许的元素的模式集。
   *
   */
  schemas?: SchemaMetadata[] | null;

  /**
   * Whether this directive/component is standalone.
   *
   * 此指令/组件是否是独立的。
   *
   */
  standalone?: boolean;
}): unknown {
  return noSideEffects(() => {
    // Initialize ngDevMode. This must be the first statement in ɵɵdefineComponent.
    // See the `initNgDevMode` docstring for more information.
    (typeof ngDevMode === 'undefined' || ngDevMode) && initNgDevMode();

    const type = componentDefinition.type;
    const standalone = componentDefinition.standalone === true;
    const declaredInputs: {[key: string]: string} = {} as any;
    const def: Mutable<ComponentDef<any>, keyof ComponentDef<any>> = {
      type: type,
      providersResolver: null,
      decls: componentDefinition.decls,
      vars: componentDefinition.vars,
      factory: null,
      template: componentDefinition.template || null!,
      consts: componentDefinition.consts || null,
      ngContentSelectors: componentDefinition.ngContentSelectors,
      hostBindings: componentDefinition.hostBindings || null,
      hostVars: componentDefinition.hostVars || 0,
      hostAttrs: componentDefinition.hostAttrs || null,
      contentQueries: componentDefinition.contentQueries || null,
      declaredInputs: declaredInputs,
      inputs: null!,   // assigned in noSideEffects
      outputs: null!,  // assigned in noSideEffects
      exportAs: componentDefinition.exportAs || null,
      onPush: componentDefinition.changeDetection === ChangeDetectionStrategy.OnPush,
      directiveDefs: null!,  // assigned in noSideEffects
      pipeDefs: null!,       // assigned in noSideEffects
      standalone,
      dependencies: standalone && componentDefinition.dependencies || null,
      getStandaloneInjector: null,
      selectors: componentDefinition.selectors || EMPTY_ARRAY,
      viewQuery: componentDefinition.viewQuery || null,
      features: componentDefinition.features as DirectiveDefFeature[] || null,
      data: componentDefinition.data || {},
      encapsulation: componentDefinition.encapsulation || ViewEncapsulation.Emulated,
      id: `c${componentDefCount++}`,
      styles: componentDefinition.styles || EMPTY_ARRAY,
      _: null,
      setInput: null,
      schemas: componentDefinition.schemas || null,
      tView: null,
      findHostDirectiveDefs: null,
      hostDirectives: null,
    };
    const dependencies = componentDefinition.dependencies;
    const feature = componentDefinition.features;
    def.inputs = invertObject(componentDefinition.inputs, declaredInputs),
    def.outputs = invertObject(componentDefinition.outputs),
    feature && feature.forEach((fn) => fn(def));
    def.directiveDefs = dependencies ?
        (() => (typeof dependencies === 'function' ? dependencies() : dependencies)
                   .map(extractDirectiveDef)
                   .filter(nonNull)) :
        null;
    def.pipeDefs = dependencies ?
        (() => (typeof dependencies === 'function' ? dependencies() : dependencies)
                   .map(getPipeDef)
                   .filter(nonNull)) :
        null;

    return def;
  });
}

/**
 * Generated next to NgModules to monkey-patch directive and pipe references onto a component's
 * definition, when generating a direct reference in the component file would otherwise create an
 * import cycle.
 *
 * 在 NgModules 旁边生成到 Monkey-patch
 * 指令并通过管道引用到组件的定义，当在组件文件中生成直接引用时，将创建一个导入周期。
 *
 * See [this explanation](https://hackmd.io/Odw80D0pR6yfsOjg_7XCJg?view) for more details.
 *
 * 有关更多详细信息，请参阅[此说明](https://hackmd.io/Odw80D0pR6yfsOjg_7XCJg?view)。
 *
 * @codeGenApi
 *
 * 代码 GenApi
 *
 */
export function ɵɵsetComponentScope(
    type: ComponentType<any>, directives: Type<any>[]|(() => Type<any>[]),
    pipes: Type<any>[]|(() => Type<any>[])): void {
  const def = (type.ɵcmp as ComponentDef<any>);
  def.directiveDefs = () =>
      (typeof directives === 'function' ? directives() : directives).map(extractDirectiveDef) as
      DirectiveDefList;
  def.pipeDefs = () =>
      (typeof pipes === 'function' ? pipes() : pipes).map(getPipeDef) as PipeDefList;
}

export function extractDirectiveDef(type: Type<any>): DirectiveDef<any>|ComponentDef<any>|null {
  return getComponentDef(type) || getDirectiveDef(type);
}

function nonNull<T>(value: T|null): value is T {
  return value !== null;
}

/**
 * @codeGenApi
 *
 * 代码 GenApi
 *
 */
export function ɵɵdefineNgModule<T>(def: {
  /**
   * Token representing the module. Used by DI.
   *
   * 表示模块的标记。由 DI 使用。
   *
   */
  type: T;

  /**
   * List of components to bootstrap.
   *
   * 要引导的组件列表。
   *
   */
  bootstrap?: Type<any>[] | (() => Type<any>[]);

  /**
   * List of components, directives, and pipes declared by this module.
   *
   * 此模块声明的组件、指令和管道的列表。
   *
   */
  declarations?: Type<any>[] | (() => Type<any>[]);

  /**
   * List of modules or `ModuleWithProviders` imported by this module.
   *
   * 此模块导入的模块或 `ModuleWithProviders` 列表。
   *
   */
  imports?: Type<any>[] | (() => Type<any>[]);

  /**
   * List of modules, `ModuleWithProviders`, components, directives, or pipes exported by this
   * module.
   *
   * 此模块导出的模块、 `ModuleWithProviders` 、组件、指令或管道的列表。
   *
   */
  exports?: Type<any>[] | (() => Type<any>[]);

  /**
   * The set of schemas that declare elements to be allowed in the NgModule.
   *
   * 声明 NgModule 中允许的元素的模式集。
   *
   */
  schemas?: SchemaMetadata[] | null;

  /**
   * Unique ID for the module that is used with `getModuleFactory`.
   *
   * 与 `getModuleFactory` 一起使用的模块的唯一 ID。
   *
   */
  id?: string | null;
}): unknown {
  return noSideEffects(() => {
    const res: NgModuleDef<T> = {
      type: def.type,
      bootstrap: def.bootstrap || EMPTY_ARRAY,
      declarations: def.declarations || EMPTY_ARRAY,
      imports: def.imports || EMPTY_ARRAY,
      exports: def.exports || EMPTY_ARRAY,
      transitiveCompileScopes: null,
      schemas: def.schemas || null,
      id: def.id || null,
    };
    return res;
  });
}

/**
 * Adds the module metadata that is necessary to compute the module's transitive scope to an
 * existing module definition.
 *
 * 将计算模块的可传递范围所需的模块元数据添加到现有的模块定义。
 *
 * Scope metadata of modules is not used in production builds, so calls to this function can be
 * marked pure to tree-shake it from the bundle, allowing for all referenced declarations
 * to become eligible for tree-shaking as well.
 *
 * 模块的范围元数据不会在生产构建中使用，因此可以将对此函数的调用标记为 pure
 * 以从包中对其进行树形抖动，从而允许所有引用的声明也有资格进行树形抖动。
 *
 * @codeGenApi
 *
 * 代码 GenApi
 *
 */
export function ɵɵsetNgModuleScope(type: any, scope: {
  /**
   * List of components, directives, and pipes declared by this module.
   *
   * 此模块声明的组件、指令和管道的列表。
   *
   */
  declarations?: Type<any>[]|(() => Type<any>[]);

  /**
   * List of modules or `ModuleWithProviders` imported by this module.
   *
   * 此模块导入的模块或 `ModuleWithProviders` 列表。
   *
   */
  imports?: Type<any>[] | (() => Type<any>[]);

  /**
   * List of modules, `ModuleWithProviders`, components, directives, or pipes exported by this
   * module.
   *
   * 此模块导出的模块、 `ModuleWithProviders` 、组件、指令或管道的列表。
   *
   */
  exports?: Type<any>[] | (() => Type<any>[]);
}): unknown {
  return noSideEffects(() => {
    const ngModuleDef = getNgModuleDef(type, true);
    ngModuleDef.declarations = scope.declarations || EMPTY_ARRAY;
    ngModuleDef.imports = scope.imports || EMPTY_ARRAY;
    ngModuleDef.exports = scope.exports || EMPTY_ARRAY;
  });
}

/**
 * Inverts an inputs or outputs lookup such that the keys, which were the
 * minified keys, are part of the values, and the values are parsed so that
 * the publicName of the property is the new key
 *
 * 反转输入或输出查找，以便使作为压缩后的键的键是值的一部分，并且解析这些值，以使属性的 publicName
 * 是新键
 *
 * e.g. for
 *
 * 例如对于
 *
 * ```
 * class Comp {
 * ```
 *
 * @Input ()
 *   propName1: string;
 * @Input ('publicName2')
 *   declaredPropName2: number;
 * }
 *
 * 输入 ()propName1 ：字符串； @Input ('publicName2') 声明的 PropName2: 数字; }
 *
 * ```
 * will be serialized as
 * ```
 *
 * {
 *   propName1: 'propName1',
 *   declaredPropName2: ['publicName2', 'declaredPropName2'],
 * }
 *
 * ```
 * which is than translated by the minifier as:
 * ```
 *
 * {
 *   minifiedPropName1: 'propName1',
 *   minifiedPropName2: ['publicName2', 'declaredPropName2'],
 * }
 *
 * ```
 * becomes: (public name => minifiedName)
 * ```
 *
 * {
 *  'propName1': 'minifiedPropName1',
 *  'publicName2': 'minifiedPropName2',
 * }
 *
 * ```
 * Optionally the function can take `secondary` which will result in: (public name => declared name)
 * ```
 *
 * {
 *  'propName1': 'propName1',
 *  'publicName2': 'declaredPropName2',
 * }
 *
 * ```
 *
 * ```
 *
 */
function invertObject<T>(
    obj?: {[P in keyof T]?: string|[string, string]},
    secondary?: {[key: string]: string}): {[P in keyof T]: string} {
  if (obj == null) return EMPTY_OBJ as any;
  const newLookup: any = {};
  for (const minifiedKey in obj) {
    if (obj.hasOwnProperty(minifiedKey)) {
      let publicName: string|[string, string] = obj[minifiedKey]!;
      let declaredName = publicName;
      if (Array.isArray(publicName)) {
        declaredName = publicName[1];
        publicName = publicName[0];
      }
      newLookup[publicName] = minifiedKey;
      if (secondary) {
        (secondary[publicName] = declaredName as string);
      }
    }
  }
  return newLookup;
}

/**
 * Create a directive definition object.
 *
 * 创建一个指令定义对象。
 *
 * # Example
 *
 * # 例子
 *
 * ```ts
 * class MyDirective {
 *   // Generated by Angular Template Compiler
 *   // [Symbol] syntax will not be supported by TypeScript until v2.7
 *   static ɵdir = ɵɵdefineDirective({
 *     ...
 *   });
 * }
 * ```
 *
 * @codeGenApi
 */
export const ɵɵdefineDirective =
    ɵɵdefineComponent as any as<T>(directiveDefinition: {
      /**
       * Directive type, needed to configure the injector.
       *
       * 指令类型，配置注入器所需。
       *
       */
      type: Type<T>;

      /**
       * The selectors that will be used to match nodes to this directive.
       *
       * 将用于将节点与此指令匹配的选择器。
       *
       */
      selectors?: CssSelectorList;

      /**
       * A map of input names.
       *
       * 输入名称的映射表。
       *
       * The format is in: `{[actualPropertyName: string]:(string|[string, string])}`.
       *
       * 格式为： `{[actualPropertyName: string]:(string|[string, string])}` 。
       *
       * Given:
       *
       * 给定：
       *
       * ```
       * class MyComponent {
       * ```
       *
       * @Input ()
       *   publicInput1: string;
       * @Input ('publicInput2')
       *   declaredInput2: string;
       * }
       * ```
       *
       * is described as:
       * ```
       * {
       *   publicInput1: 'publicInput1',
       *   declaredInput2: ['declaredInput2', 'publicInput2'],
       * }
       * ```
       *
       * Which the minifier may translate to:
       * ```
       * {
       *   minifiedPublicInput1: 'publicInput1',
       *   minifiedDeclaredInput2: [ 'publicInput2', 'declaredInput2'],
       * }
       * ```
       *
       * This allows the render to re-construct the minified, public, and declared names
       * of properties.
       *
       * NOTE:
       *  - Because declared and public name are usually same we only generate the array
       *    `['declared', 'public']` format when they differ.
       *  - The reason why this API and `outputs` API is not the same is that `NgOnChanges` has
       *    inconsistent behavior in that it uses declared names rather than minified or public. For
       *    this reason `NgOnChanges` will be deprecated and removed in future version and this
       *    API will be simplified to be consistent with `output`.
       */
      inputs?: {[P in keyof T]?: string | [string, string]};

      /**
       * A map of output names.
       *
       * 输出名称的映射表。
       *
       * The format is in: `{[actualPropertyName: string]:string}`.
       *
       * 格式为： `{[actualPropertyName: string]:string}` 。
       *
       * Which the minifier may translate to: `{[minifiedPropertyName: string]:string}`.
       *
       * 压缩器可以翻译为： `{[minifiedPropertyName: string]:string}` 。
       *
       * This allows the render to re-construct the minified and non-minified names
       * of properties.
       *
       * 这允许渲染器重新构建缩小和非缩小的属性名称。
       *
       */
      outputs?: {[P in keyof T]?: string};

      /**
       * A list of optional features to apply.
       *
       * 要应用的可选特性列表。
       *
       * See: {@link NgOnChangesFeature}, {@link ProvidersFeature}, {@link InheritDefinitionFeature}
       *
       * 请参阅：{@link NgOnChangesFeature}、{@link ProvidersFeature}、{@link
       * InheritDefinitionFeature}
       *
       */
      features?: DirectiveDefFeature[];

      /**
       * Function executed by the parent template to allow child directive to apply host bindings.
       *
       * 由父模板执行以允许子指令应用宿主绑定的函数。
       *
       */
      hostBindings?: HostBindingsFunction<T>;

      /**
       * The number of bindings in this directive `hostBindings` (including pure fn bindings).
       *
       * 此指令 `hostBindings` 中的绑定数量（包括纯 fn 绑定）。
       *
       * Used to calculate the length of the component's LView array, so we
       * can pre-fill the array and set the host binding start index.
       *
       * 用于计算组件的 LView 数组的长度，因此我们可以预填充数组并设置宿主绑定开始索引。
       *
       */
      hostVars?: number;

      /**
       * Assign static attribute values to a host element.
       *
       * 将静态属性值分配给宿主元素。
       *
       * This property will assign static attribute values as well as class and style
       * values to a host element. Since attribute values can consist of different types of values,
       * the `hostAttrs` array must include the values in the following format:
       *
       * 此属性会将静态属性值以及 class 和 style
       * 值分配给宿主元素。由于属性值可以由不同类型的值组成，因此 `hostAttrs`
       * 数组必须包含以下格式的值：
       *
       * attrs = \[
       *   // static attributes (like `title`, `name`, `id`...)
       *   attr1, value1, attr2, value,
       *
       * attrs = \[ // 静态属性（例如 `title` , `name` , `id` ...）attr1, value1, attr2, value,
       *
       *   // a single namespace value (like `x:id`)
       *   NAMESPACE_MARKER, namespaceUri1, name1, value1,
       *
       * // 单个命名空间值（例如 `x:id`）NAMESPACE_MARKER, namespaceUri1, name1, value1,
       *
       *   // another single namespace value (like `x:name`)
       *   NAMESPACE_MARKER, namespaceUri2, name2, value2,
       *
       * // 另一个单个命名空间值（例如 `x:name`）NAMESPACE_MARKER, namespaceUri2, name2, value2,
       *
       *   // a series of CSS classes that will be applied to the element (no spaces)
       *   CLASSES_MARKER, class1, class2, class3,
       *
       * // 将应用于元素的一系列 CSS 类（无空格）CLASSES_MARKER, class1, class2, class3,
       *
       *   // a series of CSS styles (property + value) that will be applied to the element
       *   STYLES_MARKER, prop1, value1, prop2, value2
       * ]
       *
       * // 将应用于元素 STYLES_MARKER,prop1, value1,prop2, value2 的一系列 CSS 样式（property +
       * value）
       *
       * All non-class and non-style attributes must be defined at the start of the list
       * first before all class and style values are set. When there is a change in value
       * type (like when classes and styles are introduced) a marker must be used to separate
       * the entries. The marker values themselves are set via entries found in the
       * [AttributeMarker] enum.
       *
       * 在设置所有类和风格值之前，必须首先在列表的开头定义所有非类和非风格属性。当值类型发生更改时（例如介绍类和样式时），必须使用标记来分隔条目。标记值本身是通过[AttributeMarker][AttributeMarker]枚举中的条目设置的。
       *
       */
      hostAttrs?: TAttributes;

      /**
       * Function to create instances of content queries associated with a given directive.
       *
       * 用于创建与给定指令关联的内容查询实例的函数。
       *
       */
      contentQueries?: ContentQueriesFunction<T>;

      /**
       * Additional set of instructions specific to view query processing. This could be seen as a
       * set of instructions to be inserted into the template function.
       *
       * 特定于视图查询处理的额外操作指南。这可以看作是要插入到模板函数中的一组指令。
       *
       */
      viewQuery?: ViewQueriesFunction<T>| null;

      /**
       * Defines the name that can be used in the template to assign this directive to a variable.
       *
       * 定义可在模板中使用的名称，以将此指令分配给变量。
       *
       * See: {@link Directive.exportAs}
       *
       * 请参阅：{@link Directive.exportAs}
       *
       */
      exportAs?: string[];
    }) => never;

/**
 * Create a pipe definition object.
 *
 * 创建一个管道定义对象。
 *
 * # Example
 *
 * # 例子
 *
 * ```
 * class MyPipe implements PipeTransform {
 *   // Generated by Angular Template Compiler
 *   static ɵpipe = definePipe({
 *     ...
 *   });
 * }
 * ```
 *
 * @param pipeDef Pipe definition generated by the compiler
 *
 * 编译器生成的管道定义
 *
 * @codeGenApi
 */
export function ɵɵdefinePipe<T>(pipeDef: {
  /**
   * Name of the pipe. Used for matching pipes in template to pipe defs.
   *
   * 管道的名称。用于将模板中的管道与管道定义匹配。
   *
   */
  name: string,

  /**
   * Pipe class reference. Needed to extract pipe lifecycle hooks.
   *
   * 管道类引用。需要提取管道生命周期钩子。
   *
   */
  type: Type<T>,

  /**
   * Whether the pipe is pure.
   *
   * 管道是否纯净。
   *
   */
  pure?: boolean,

  /**
   * Whether the pipe is standalone.
   *
   * 管道是否是独立的。
   *
   */
  standalone?: boolean,
}): unknown {
  return (<PipeDef<T>>{
    type: pipeDef.type,
    name: pipeDef.name,
    factory: null,
    pure: pipeDef.pure !== false,
    standalone: pipeDef.standalone === true,
    onDestroy: pipeDef.type.prototype.ngOnDestroy || null
  });
}

/**
 * The following getter methods retrieve the definition from the type. Currently the retrieval
 * honors inheritance, but in the future we may change the rule to require that definitions are
 * explicit. This would require some sort of migration strategy.
 *
 * 以下 getter
 * 方法从类型中检索定义。当前，检索尊重继承，但将来我们可能会更改规则以要求定义是显式的。这将需要某种迁移策略。
 *
 */

export function getComponentDef<T>(type: any): ComponentDef<T>|null {
  return type[NG_COMP_DEF] || null;
}

export function getDirectiveDef<T>(type: any): DirectiveDef<T>|null {
  return type[NG_DIR_DEF] || null;
}

export function getPipeDef<T>(type: any): PipeDef<T>|null {
  return type[NG_PIPE_DEF] || null;
}

export function isStandalone<T>(type: Type<T>): boolean {
  const def = getComponentDef(type) || getDirectiveDef(type) || getPipeDef(type);
  return def !== null ? def.standalone : false;
}

export function getNgModuleDef<T>(type: any, throwNotFound: true): NgModuleDef<T>;
export function getNgModuleDef<T>(type: any): NgModuleDef<T>|null;
export function getNgModuleDef<T>(type: any, throwNotFound?: boolean): NgModuleDef<T>|null {
  const ngModuleDef = type[NG_MOD_DEF] || null;
  if (!ngModuleDef && throwNotFound === true) {
    throw new Error(`Type ${stringify(type)} does not have 'ɵmod' property.`);
  }
  return ngModuleDef;
}
