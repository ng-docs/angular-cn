/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '../di/injection_token';
import {ProviderToken} from '../di/provider_token';
import {makePropDecorator} from '../util/decorators';

/**
 * Type of the `Attribute` decorator / constructor function.
 *
 * `Attribute` 装饰器/构造函数的类型。
 *
 * @publicApi
 */
export interface AttributeDecorator {
  /**
   * Specifies that a constant attribute value should be injected.
   *
   * 指定应注入常量属性值。
   *
   * The directive can inject constant string literals of host element attributes.
   *
   * 该指令可以注入宿主元素属性的常量字符串文字。
   *
   * @usageNotes
   *
   * Suppose we have an `<input>` element and want to know its `type`.
   *
   * 假设我们有一个 `<input>` 元素，并且想知道它的 `type` 。
   *
   * ```html
   * <input type="text">
   * ```
   *
   * A decorator can inject string literal `text` as in the following example.
   *
   * 装饰器可以注入字符串文字 `text` ，如下例所示。
   *
   * {@example core/ts/metadata/metadata.ts region='attributeMetadata'}
   *
   * @publicApi
   */
  (name: string): any;
  new(name: string): Attribute;
}


/**
 * Type of the Attribute metadata.
 *
 * 属性元数据的类型。
 *
 * @publicApi
 */
export interface Attribute {
  /**
   * The name of the attribute to be injected into the constructor.
   *
   * 要注入构造函数的属性的名称。
   *
   */
  attributeName?: string;
}

/**
 * Type of the Query metadata.
 *
 * 查询元数据的类型。
 *
 * @publicApi
 */
export interface Query {
  descendants: boolean;
  emitDistinctChangesOnly: boolean;
  first: boolean;
  read: any;
  isViewQuery: boolean;
  selector: any;
  static?: boolean;
}

// Stores the default value of `emitDistinctChangesOnly` when the `emitDistinctChangesOnly` is not
// explicitly set.
export const emitDistinctChangesOnlyDefaultValue = true;


/**
 * Base class for query metadata.
 *
 * 查询元数据的基类。
 *
 * @see `ContentChildren`.
 * @see `ContentChild`.
 * @see `ViewChildren`.
 * @see `ViewChild`.
 * @publicApi
 */
export abstract class Query {}

/**
 * Type of the ContentChildren decorator / constructor function.
 *
 * ContentChildren 装饰器/构造函数的类型。
 *
 * @see `ContentChildren`.
 * @publicApi
 */
export interface ContentChildrenDecorator {
  /**
   * @description
   *
   * Property decorator that configures a content query.
   *
   * 用于配置内容查询的参数装饰器。
   *
   * Use to get the `QueryList` of elements or directives from the content DOM.
   * Any time a child element is added, removed, or moved, the query list will be
   * updated, and the changes observable of the query list will emit a new value.
   *
   * **元数据属性**：。
   *
   * Content queries are set before the `ngAfterContentInit` callback is called.
   *
   * 在调用 `ngAfterContentInit` 之前设置的内容查询。
   *
   * Does not retrieve elements or directives that are in other components' templates,
   * since a component's template is always a black box to its ancestors.
   *
   * 不检索其他组件模板中的元素或指令，因为组件模板对其祖先来说始终是黑匣子。
   *
   * **Metadata Properties**:
   *
   * **元数据属性**：
   *
   * * **selector** - The directive type or the name used for querying.
   *
   *   **selector** - 要查询的指令类型或名称。
   *
   * * **descendants** - If `true` include all descendants of the element. If `false` then only
   *   query direct children of the element.
   *
   *   **descendants** - 包含所有后代时为 true，否则仅包括直接子代。
   *
   * * **emitDistinctChangesOnly** - The `QueryList#changes` observable will emit new values only
   *   if the QueryList result has changed. When `false` the `changes` observable might emit even
   *   if the QueryList has not changed.
   *   ** Note: ** This config option is **deprecated**, it will be permanently set to `true` and
   *   removed in future versions of Angular.
   *
   *   **read** - 用于从查询的元素中读取不同的令牌。
   *
   * * **read** - Used to read a different token from the queried elements.
   *
   *   **read** - 用于从查询到的元素中读取不同的令牌。
   *
   * The following selectors are supported.
   *
   * 支持下列选择器：。
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - A template reference variable as a string \(e.g. query `<my-component #cmp></my-component>`
   *   with `@ContentChildren('cmp')`\)
   *
   *   字符串形式的模板引用变量（例如，使用 `@ContentChildren('cmp')` 查询 `<my-component #cmp></my-component>`）
   *
   * - Any provider defined in the child component tree of the current component \(e.g.
   *   `@ContentChildren(SomeService) someService: SomeService`\)
   *
   *   在当前组件的子组件树中定义的任何提供者（例如 `@ContentChildren(SomeService) someService: SomeService`）
   *
   * - Any provider defined through a string token \(e.g. `@ContentChildren('someToken')
   *   someTokenVal: any`\)
   *
   *   通过字符串标记定义的任何提供程序（例如 `@ContentChildren('someToken') someTokenVal: any`）
   *
   * - A `TemplateRef` \(e.g. query `<ng-template></ng-template>` with
   *   `@ContentChildren(TemplateRef) template;`\)
   *
   *   `TemplateRef`（例如使用 `@ContentChildren(TemplateRef) template;` 查询 `<ng-template></ng-template>` ；）
   *
   * In addition, multiple string selectors can be separated with a comma \(e.g.
   * `@ContentChildren('cmp1,cmp2')`\)
   *
   * 此外，多个字符串选择器可以用逗号分隔（例如 `@ContentChildren('cmp1,cmp2')`）
   *
   * The following values are supported by `read`:
   *
   * `read` 支持以下值：
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - Any provider defined on the injector of the component that is matched by the `selector` of
   *   this query
   *
   *   在此查询的 `selector` 匹配的组件注入器上定义的任何提供程序
   *
   * - Any provider defined through a string token \(e.g. `{provide: 'token', useValue: 'val'}`\)
   *
   *   通过字符串标记定义的任何提供程序（例如 `{provide: 'token', useValue: 'val'}`）
   *
   * - `TemplateRef`, `ElementRef`, and `ViewContainerRef`
   *
   *   `TemplateRef`、`ElementRef` 和 `ViewContainerRef`
   * @usageNotes
   *
   * Here is a simple demonstration of how the `ContentChildren` decorator can be used.
   *
   * 这里是如何使用 `ContentChildren` 装饰器的简单演示。
   *
   * {@example core/di/ts/contentChildren/content_children_howto.ts region='HowTo'}
   *
   * ### Tab-pane example
   *
   * ### 选项卡窗格示例
   *
   * Here is a slightly more realistic example that shows how `ContentChildren` decorators
   * can be used to implement a tab pane component.
   *
   * 下面是一个稍微更实际的示例，展示了如何使用 `ContentChildren` 装饰器来实现选项卡窗格组件。
   *
   * {@example core/di/ts/contentChildren/content_children_example.ts region='Component'}
   *
   * @Annotation
   */
  (selector: ProviderToken<unknown>|Function|string, opts?: {
    descendants?: boolean,
    emitDistinctChangesOnly?: boolean,
    read?: any,
  }): any;
  new(selector: ProviderToken<unknown>|Function|string,
      opts?: {descendants?: boolean, emitDistinctChangesOnly?: boolean, read?: any}): Query;
}

/**
 * Type of the ContentChildren metadata.
 *
 * ContentChildren 元数据的类型。
 *
 * @Annotation
 * @publicApi
 */
export type ContentChildren = Query;

/**
 * ContentChildren decorator and metadata.
 *
 * ContentChildren 装饰器和元数据。
 *
 * @Annotation
 * @publicApi
 */
export const ContentChildren: ContentChildrenDecorator = makePropDecorator(
    'ContentChildren', (selector?: any, data: any = {}) => ({
                         selector,
                         first: false,
                         isViewQuery: false,
                         descendants: false,
                         emitDistinctChangesOnly: emitDistinctChangesOnlyDefaultValue,
                         ...data
                       }),
    Query);

/**
 * Type of the ContentChild decorator / constructor function.
 *
 * ContentChild 装饰器/构造函数的类型。
 *
 * @publicApi
 */
export interface ContentChildDecorator {
  /**
   * @description
   *
   * Property decorator that configures a content query.
   *
   * 用于配置内容查询的参数装饰器。
   *
   * Use to get the first element or the directive matching the selector from the content DOM.
   * If the content DOM changes, and a new child matches the selector,
   * the property will be updated.
   *
   * **元数据属性**：。
   *
   * Content queries are set before the `ngAfterContentInit` callback is called.
   *
   * 在调用 `ngAfterContentInit` 之前设置的内容查询。
   *
   * Does not retrieve elements or directives that are in other components' templates,
   * since a component's template is always a black box to its ancestors.
   *
   * 不检索其他组件模板中的元素或指令，因为组件模板对其祖先来说始终是黑匣子。
   *
   * **Metadata Properties**:
   *
   * **元数据属性**：
   *
   * * **selector** - The directive type or the name used for querying.
   *
   *   **selector** - 要查询的指令类型或名称。
   *
   * * **descendants** - If `true` \(default\) include all descendants of the element. If `false` then
   *   only query direct children of the element.
   *
   *   **后代**- 如果为 `true` （默认），则包括元素的所有后代。如果为 `false` ，则仅查询元素的直接子项。
   *
   * * **read** - Used to read a different token from the queried element.
   *
   *   **read** - 用于从查询到的元素读取不同的令牌。
   *
   * * **static** - True to resolve query results before change detection runs,
   *   false to resolve after change detection. Defaults to false.
   *
   *   **static** - 如果为 true，则在变更检测运行之前解析查询结果，如果为 false，则在变更检测之后解析。默认为 false。
   *
   * The following selectors are supported.
   *
   * 支持下列选择器：。
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - A template reference variable as a string \(e.g. query `<my-component #cmp></my-component>`
   *   with `@ContentChild('cmp')`\)
   *
   *   字符串形式的模板引用变量（例如，使用 `@ContentChild('cmp')` 查询 `<my-component #cmp></my-component>` ）
   *
   * - Any provider defined in the child component tree of the current component \(e.g.
   *   `@ContentChild(SomeService) someService: SomeService`\)
   *
   *   在当前组件的子组件树中定义的任何提供者（例如 `@ContentChild(SomeService) someService: SomeService` ）
   *
   * - Any provider defined through a string token \(e.g. `@ContentChild('someToken') someTokenVal:
   *   any`\)
   *
   *   通过字符串标记定义的任何提供程序（例如 `@ContentChild('someToken') someTokenVal: any`）
   *
   * - A `TemplateRef` \(e.g. query `<ng-template></ng-template>` with `@ContentChild(TemplateRef)
   *   template;`\)
   *
   *   `TemplateRef` （例如使用 `@ContentChild(TemplateRef) template;` 查询 `<ng-template></ng-template>` ；）
   *
   * The following values are supported by `read`:
   *
   * `read` 支持以下值：
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - Any provider defined on the injector of the component that is matched by the `selector` of
   *   this query
   *
   *   在此查询的 `selector` 匹配的组件注入器上定义的任何提供程序
   *
   * - Any provider defined through a string token \(e.g. `{provide: 'token', useValue: 'val'}`\)
   *
   *   通过字符串标记定义的任何提供程序（例如 `{provide: 'token', useValue: 'val'}`）
   *
   * - `TemplateRef`, `ElementRef`, and `ViewContainerRef`
   *
   *   `TemplateRef`、`ElementRef` 和 `ViewContainerRef`
   * @usageNotes
   *
   * {@example core/di/ts/contentChild/content_child_howto.ts region='HowTo'}
   *
   * ### Example
   *
   * ### 范例
   *
   * {@example core/di/ts/contentChild/content_child_example.ts region='Component'}
   *
   * @Annotation
   */
  (selector: ProviderToken<unknown>|Function|string,
   opts?: {descendants?: boolean, read?: any, static?: boolean}): any;
  new(selector: ProviderToken<unknown>|Function|string,
      opts?: {descendants?: boolean, read?: any, static?: boolean}): ContentChild;
}

/**
 * Type of the ContentChild metadata.
 *
 * ContentChild 元数据的类型。
 *
 * @publicApi
 */
export type ContentChild = Query;

/**
 * ContentChild decorator and metadata.
 *
 * ContentChild 装饰器和元数据。
 *
 * @Annotation
 * @publicApi
 */
export const ContentChild: ContentChildDecorator = makePropDecorator(
    'ContentChild',
    (selector?: any, data: any = {}) =>
        ({selector, first: true, isViewQuery: false, descendants: true, ...data}),
    Query);

/**
 * Type of the ViewChildren decorator / constructor function.
 *
 * ViewChildren 装饰器/构造函数的类型。
 *
 * @see `ViewChildren`.
 * @publicApi
 */
export interface ViewChildrenDecorator {
  /**
   * @description
   *
   * Property decorator that configures a view query.
   *
   * 用于配置视图查询的参数装饰器。
   *
   * Use to get the `QueryList` of elements or directives from the view DOM.
   * Any time a child element is added, removed, or moved, the query list will be updated,
   * and the changes observable of the query list will emit a new value.
   *
   * **元数据属性**：。
   *
   * View queries are set before the `ngAfterViewInit` callback is called.
   *
   * **元数据属性**：。
   *
   * **Metadata Properties**:
   *
   * **元数据属性**：
   *
   * * **selector** - The directive type or the name used for querying.
   *
   *   **selector** - 要查询的指令类型或名称。
   *
   * * **read** - Used to read a different token from the queried elements.
   *
   *   **read** - 用于从查询到的元素中读取不同的令牌。
   *
   * * **emitDistinctChangesOnly** - The `QueryList#changes` observable will emit new values only
   *     if the QueryList result has changed. When `false` the `changes` observable might emit even
   *     if the QueryList has not changed.
   *     ** Note: ** This config option is **deprecated**, it will be permanently set to `true` and
   *   removed in future versions of Angular.
   *
   *   **read** - 用于从查询的元素中读取不同的令牌。
   *
   * The following selectors are supported.
   *
   * 支持下列选择器：。
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - A template reference variable as a string \(e.g. query `<my-component #cmp></my-component>`
   *   with `@ViewChildren('cmp')`\)
   *
   *   作为字符串的模板引用变量（例如，使用 `@ViewChildren('cmp')` 查询 `<my-component #cmp></my-component>` ）
   *
   * - Any provider defined in the child component tree of the current component \(e.g.
   *   `@ViewChildren(SomeService) someService!: SomeService`\)
   *
   *   在当前组件的子组件树中定义的任何提供者（例如 `@ViewChildren(SomeService) someService!: SomeService` ）
   *
   * - Any provider defined through a string token \(e.g. `@ViewChildren('someToken')
   *   someTokenVal!: any`\)
   *
   *   通过字符串标记定义的任何提供程序（例如 `@ViewChildren('someToken') someTokenVal!: any`）
   *
   * - A `TemplateRef` \(e.g. query `<ng-template></ng-template>` with `@ViewChildren(TemplateRef)
   *   template;`\)
   *
   *   `TemplateRef` （例如使用 `@ViewChildren(TemplateRef) template;` 查询 `<ng-template></ng-template>` ；）
   *
   * In addition, multiple string selectors can be separated with a comma \(e.g.
   * `@ViewChildren('cmp1,cmp2')`\)
   *
   * 此外，多个字符串选择器可以用逗号分隔（例如 `@ViewChildren('cmp1,cmp2')`）
   *
   * The following values are supported by `read`:
   *
   * `read` 支持以下值：
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - Any provider defined on the injector of the component that is matched by the `selector` of
   *   this query
   *
   *   在此查询的 `selector` 匹配的组件注入器上定义的任何提供程序
   *
   * - Any provider defined through a string token \(e.g. `{provide: 'token', useValue: 'val'}`\)
   *
   *   通过字符串标记定义的任何提供程序（例如 `{provide: 'token', useValue: 'val'}`）
   *
   * - `TemplateRef`, `ElementRef`, and `ViewContainerRef`
   *
   *   `TemplateRef`、`ElementRef` 和 `ViewContainerRef`
   * @usageNotes
   *
   * {@example core/di/ts/viewChildren/view_children_howto.ts region='HowTo'}
   *
   * ### Another example
   *
   * ### 另一个例子
   *
   * {@example core/di/ts/viewChildren/view_children_example.ts region='Component'}
   *
   * @Annotation
   */
  (selector: ProviderToken<unknown>|Function|string,
   opts?: {read?: any, emitDistinctChangesOnly?: boolean}): any;
  new(selector: ProviderToken<unknown>|Function|string,
      opts?: {read?: any, emitDistinctChangesOnly?: boolean}): ViewChildren;
}

/**
 * Type of the ViewChildren metadata.
 *
 * ViewChildren 元数据的类型。
 *
 * @publicApi
 */
export type ViewChildren = Query;

/**
 * ViewChildren decorator and metadata.
 *
 * ViewChildren 装饰器和元数据。
 *
 * @Annotation
 * @publicApi
 */
export const ViewChildren: ViewChildrenDecorator = makePropDecorator(
    'ViewChildren', (selector?: any, data: any = {}) => ({
                      selector,
                      first: false,
                      isViewQuery: true,
                      descendants: true,
                      emitDistinctChangesOnly: emitDistinctChangesOnlyDefaultValue,
                      ...data
                    }),
    Query);

/**
 * Type of the ViewChild decorator / constructor function.
 *
 * ViewChild 装饰器/构造函数的类型。
 *
 * @see `ViewChild`.
 * @publicApi
 */
export interface ViewChildDecorator {
  /**
   * @description
   *
   * Property decorator that configures a view query.
   * The change detector looks for the first element or the directive matching the selector
   * in the view DOM. If the view DOM changes, and a new child matches the selector,
   * the property is updated.
   *
   * 属性装饰器，用于配置一个视图查询。 变更检测器会在视图的 DOM 中查找能匹配上该选择器的第一个元素或指令。 如果视图的 DOM 发生了变化，出现了匹配该选择器的新的子节点，该属性就会被更新。
   *
   * View queries are set before the `ngAfterViewInit` callback is called.
   *
   * **元数据属性**：。
   *
   * **Metadata Properties**:
   *
   * **元数据属性**：
   *
   * * **selector** - The directive type or the name used for querying.
   *
   *   **selector** - 要查询的指令类型或名称。
   *
   * * **read** - Used to read a different token from the queried elements.
   *
   *   **read** - 用于从查询到的元素中读取不同的令牌。
   *
   * * **static** - True to resolve query results before change detection runs,
   *   false to resolve after change detection. Defaults to false.
   *
   *   **static** - 如果为 true，则在变更检测运行之前解析查询结果，如果为 false，则在变更检测之后解析。默认为 false。
   *
   * The following selectors are supported.
   *
   * 支持下列选择器：。
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - A template reference variable as a string \(e.g. query `<my-component #cmp></my-component>`
   *   with `@ViewChild('cmp')`\)
   *
   *   字符串形式的模板引用变量（比如可以使用 `@ViewChild('cmp')` 来查询 `<my-component #cmp></my-component>`
   *
   * - Any provider defined in the child component tree of the current component \(e.g.
   *   `@ViewChild(SomeService) someService: SomeService`\)
   *
   *   组件树中任何当前组件的子组件所定义的提供者（比如 `@ViewChild(SomeService) someService: SomeService` ）
   *
   * - Any provider defined through a string token \(e.g. `@ViewChild('someToken') someTokenVal:
   *   any`\)
   *
   *   任何通过字符串令牌定义的提供者（比如 `@ViewChild('someToken') someTokenVal: any`）
   *
   * - A `TemplateRef` \(e.g. query `<ng-template></ng-template>` with `@ViewChild(TemplateRef)
   *   template;`\)
   *
   *   `TemplateRef`（比如可以用 `@ViewChild(TemplateRef) template;` 来查询 `<ng-template></ng-template>`）
   *
   * The following values are supported by `read`:
   *
   * `read` 支持以下值：
   *
   * - Any class with the `@Component` or `@Directive` decorator
   *
   *   任何带有 `@Component` 或 `@Directive` 装饰器的类
   *
   * - Any provider defined on the injector of the component that is matched by the `selector` of
   *   this query
   *
   *   在此查询的 `selector` 匹配的组件注入器上定义的任何提供程序
   *
   * - Any provider defined through a string token \(e.g. `{provide: 'token', useValue: 'val'}`\)
   *
   *   通过字符串标记定义的任何提供程序（例如 `{provide: 'token', useValue: 'val'}`）
   *
   * - `TemplateRef`, `ElementRef`, and `ViewContainerRef`
   *
   *   `TemplateRef`、`ElementRef` 和 `ViewContainerRef`
   * @usageNotes
   *
   * {@example core/di/ts/viewChild/view_child_example.ts region='Component'}
   *
   * ### Example 2
   *
   * ### 例子 2
   *
   * {@example core/di/ts/viewChild/view_child_howto.ts region='HowTo'}
   *
   * @Annotation
   */
  (selector: ProviderToken<unknown>|Function|string, opts?: {read?: any, static?: boolean}): any;
  new(selector: ProviderToken<unknown>|Function|string,
      opts?: {read?: any, static?: boolean}): ViewChild;
}

/**
 * Type of the ViewChild metadata.
 *
 * ViewChild 元数据的类型。
 *
 * @publicApi
 */
export type ViewChild = Query;

/**
 * ViewChild decorator and metadata.
 *
 * ViewChild 装饰器和元数据。
 *
 * @Annotation
 * @publicApi
 */
export const ViewChild: ViewChildDecorator = makePropDecorator(
    'ViewChild',
    (selector: any, data: any) =>
        ({selector, first: true, isViewQuery: true, descendants: true, ...data}),
    Query);
