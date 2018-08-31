/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy} from '../change_detection/constants';
import {Provider} from '../di';
import {R3_COMPILE_COMPONENT, R3_COMPILE_DIRECTIVE, R3_COMPILE_PIPE} from '../ivy_switch';
import {Type} from '../type';
import {TypeDecorator, makeDecorator, makePropDecorator} from '../util/decorators';
import {ViewEncapsulation} from './view';


/**
 * Type of the Directive decorator / constructor function.
 *
 * 指令装饰器、构造函数的类型。
 */
export interface DirectiveDecorator {
  /**
   * Marks a class as an Angular directive. You can define your own
   * directives to attach custom behavior to elements in the DOM.
   * The options provide configuration metadata that determines
   * how the directive should be processed, instantiated and used at
   * runtime.
   *
   * 把一个类标记为 Angular 指令。你可以定义自己的指令来为 DOM 中的元素添加自定义行为。
   * 该选项提供配置元数据，用于决定该指令在运行期间要如何处理、实例化和使用。
   *
   * Directive classes, like component classes, can implement
   * [life-cycle hoooks](guide/lifecycle-hooks) to influence their configuration and behavior.
   *
   * 像组件类一样，指令类也可以实现[生命周期钩子](guide/lifecycle-hooks)，以影响它们的配置和行为。
   *
   *
   * @usageNotes
   * To define a directive, mark the class with the decorator and provide metadata.
   *
   * 要想定义一个指令，请为该类加上此装饰器，并提供元数据。
   *
   * ```
   * import {Directive} from '@angular/core';
   *
   * @Directive({
   *   selector: 'my-directive',
   * })
   * export class MyDirective {
   * ...
   * }
   * ```
   *
   * ### Declaring directives
   *
   * ### 声明指令
   *
   * Directives are [declarables](guide/glossary#declarable).
   * They must be declared by an NgModule
   * in order to be usable in an app.
   *
   * 指令是[可声明对象](guide/glossary#declarable)。
   * 它们必须在 NgModule 中声明之后，才能用在应用中。
   *
   * A directive must belong to exactly one NgModule. Do not re-declare
   * a directive imported from another module.
   * List the directive class in the `declarations` field of an NgModule.
   *
   * 指令应当且只能属于一个 NgModule。不要重新声明那些从其它模块中导入的指令。
   * 请把该指令类列在 NgModule 的 `declarations` 字段中。
   *
   * ```
   * declarations: [
   *  AppComponent,
   *  MyDirective
   * ],
   * ```
   *
   * @Annotation
   */
  (obj: Directive): TypeDecorator;

  /**
   * See the `Directive` decorator.
   *
   * 参见 `Directive` 装饰器中。
   */
  new (obj: Directive): Directive;
}

export interface Directive {
  /**
   * The CSS selector that triggers the instantiation of a directive.
   *
   * 这个 CSS 选择器用于触发指令的实例化。
   *
   * Declare as one of the following:
   *
   * 可使用下列形式之一：
   *
   * - `element-name`: select by element name.
   *
   *   `element-name`：根据元素名选取。
   *
   * - `.class`: select by class name.
   *
   *   `.class`：根据类名选取。
   *
   * - `[attribute]`: select by attribute name.
   *
   *   `[attribute]`：根据属性名选取。
   *
   * - `[attribute=value]`: select by attribute name and value.
   *
   *   `[attribute=value]`：根据属性名和属性值选取。
   *
   * - `:not(sub_selector)`: select only if the element does not match the `sub_selector`.
   *
   *   `:not(sub_selector)`：只有当元素不匹配子选择器 `sub_selector` 的时候才选取。
   *
   * - `selector1, selector2`: select if either `selector1` or `selector2` matches.
   *
   *   `selector1, selector2`：无论 `selector1` 还是 `selector2` 匹配时都选取。
   *
   * Angular only allows directives to trigger on CSS selectors that do not cross element
   * boundaries. For example, consider a directive with an `input[type=text]` selector.
   * For the following HTML, the directive is instantiated only on the
   * `<input type="text">` element.
   *
   * Angular 的指令只允许那些不跨元素边界的 CSS 选择器。比如，考虑一个带有 `input[type=text]` 选择器的指令。
   * 对于下列 HTML，该指令只会在 `<input type="text">` 元素上实例化。
   *
   * ```html
   * <form>
   *   <input type="text">
   *   <input type="radio">
   * <form>
   * ```
   *
   */
  selector?: string;

  /**
   * Enumerates the set of data-bound input properties for a directive
   *
   * 列举某个指令的一组可供数据绑定的输入属性
   *
   * Angular automatically updates input properties during change detection.
   * The `inputs` property defines a set of `directiveProperty` to `bindingProperty`
   * configuration:
   *
   * Angular 会在变更检测期间自动更新输入属性。
   * `inputs` 属性定义了一组从 `directiveProperty` 指向 `bindingProperty` 的配置项：
   *
   * - `directiveProperty` specifies the component property where the value is written.
   *
   *   `directiveProperty` 用于指定要写入值的指令内属性。
   *
   * - `bindingProperty` specifies the DOM property where the value is read from.
   *
   *   `bindingProperty` 用于指定要从中读取值的 DOM 属性。
   *
   * When `bindingProperty` is not provided, it is assumed to be equal to `directiveProperty`.
   *
   * 当没有提供 `bindingProperty` 时，就假设它和 `directiveProperty` 一样。
   * @usageNotes
   *
   * ### Example
   *
   * ### 范例
   *
   * The following example creates a component with two data-bound properties.
   *
   * 下面的例子创建了一个带有两个可绑定属性的组件。
   *
   * ```typescript
   * @Component({
   *   selector: 'bank-account',
   *   inputs: ['bankName', 'id: account-id'],
   *   template: `
   *     Bank Name: {{bankName}}
   *     Account Id: {{id}}
   *   `
   * })
   * class BankAccount {
   *   bankName: string;
   *   id: string;
   *
   * ```
   */
  inputs?: string[];

  /**
   * Enumerates the set of event-bound output properties.
   *
   * 列举一组可供事件绑定的输出属性。
   *
   * When an output property emits an event, an event handler attached to that event
   * the template is invoked.
   *
   * 当输出属性发出一个事件时，就会调用模板中附加到它的一个事件处理器。
   *
   * The `outputs` property defines a set of `directiveProperty` to `bindingProperty`
   * configuration:
   *
   * `outputs` 属性定义了一组从 `directiveProperty` 指向 `bindingProperty` 的配置项：
   *
   * - `directiveProperty` specifies the component property that emits events.
   *
   *   `directiveProperty` 用于指定要发出事件的指令属性。
   *
   * - `bindingProperty` specifies the DOM property the event handler is attached to.
   *
   *   `bindingProperty` 用于指定要附加事件处理器的 DOM 属性。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 范例
   *
   * ```typescript
   * @Directive({
   *   selector: 'child-dir',
   *   exportAs: 'child'
   * })
   * class ChildDir {
   * }
   *
   * @Component({
   *   selector: 'main',
   *   template: `<child-dir #c="child"></child-dir>`
   * })
   * class MainComponent {
   * }
   * ```
   */
  outputs?: string[];

  /**
   * A set of injection tokens that allow the DI system to
   * provide a dependency to this directive or component.
   *
   * 一组依赖注入令牌，它允许 DI 系统为这个指令或组件提供依赖。
   */
  providers?: Provider[];

  /**
   * Defines the name that can be used in the template to assign this directive to a variable.
   *
   * 定义一个名字，用于在模板中把该指令赋值给一个变量。
   *
   * @usageNotes
   *
   * ### Simple Example
   *
   * ### 简单例子
   *
   * ```
   * @Directive({
   *   selector: 'child-dir',
   *   exportAs: 'child'
   * })
   * class ChildDir {
   * }
   *
   * @Component({
   *   selector: 'main',
   *   template: `<child-dir #c="child"></child-dir>`
   * })
   * class MainComponent {
   * }
   * ```
   */
  exportAs?: string;

  /**
   * Configures the queries that will be injected into the directive.
   *
   * 配置一些查询，它们将被注入到该指令中。
   *
   * Content queries are set before the `ngAfterContentInit` callback is called.
   * View queries are set before the `ngAfterViewInit` callback is called.
   *
   * 内容查询会在调用 `ngAfterContentInit` 回调之前设置好。
   * 试图查询会在调用 `ngAfterViewInit` 回调之前设置好。
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 范例
   *
   * The following example shows how queries are defined
   * and when their results are available in lifecycle hooks:
   *
   * 下面的范例展示了如何定义这些查询以及到生命周期钩子中的哪个步骤才会有结果：
   *
   * ```
   * @Component({
   *   selector: 'someDir',
   *   queries: {
   *     contentChildren: new ContentChildren(ChildDirective),
   *     viewChildren: new ViewChildren(ChildDirective)
   *   },
   *   template: '<child-directive></child-directive>'
   * })
   * class SomeDir {
   *   contentChildren: QueryList<ChildDirective>,
   *   viewChildren: QueryList<ChildDirective>
   *
   *   ngAfterContentInit() {
   *     // contentChildren is set
   *   }
   *
   *   ngAfterViewInit() {
   *     // viewChildren is set
   *   }
   * }
   * ```
   *
   * @Annotation
   */
  queries?: {[key: string]: any};

  /**
   * If true, this directive/component will be skipped by the AOT compiler and so will always be
   * compiled using JIT.
   *
   * 如果为 `true`，则该指令/组件将会被 AOT 编译器忽略，因此永远只会被 JIT 编译。
   *
   * This exists to support future Ivy work and has no effect currently.
   *
   * 这个选项是为了支持未来的 Ivy 编译器，目前还没有效果。
   */
  jit?: true;
}

/**
 * Directive decorator and metadata.
 *
 * 指令的装饰器和元数据
 *
 * @Annotation
 */
export interface Directive {
  /**
   * The CSS selector that identifies this directive in a template
   * and triggers instantiation of the directive.
   *
   * 这个 CSS 选择器用于在模板中标记出该指令，并触发该指令的实例化。
   *
   * Declare as one of the following:
   *
   * 可使用下列形式之一：
   *
   * - `element-name`: Select by element name.
   *
   *   `element-name`：根据元素名选取。
   *
   * - `.class`: Select by class name.
   *
   *   `.class`：根据类名选取。
   *
   * - `[attribute]`: Select by attribute name.
   *
   *   `[attribute]`：根据属性名选取。
   *
   * - `[attribute=value]`: Select by attribute name and value.
   *
   *   `[attribute=value]`：根据属性名和属性值选取。
   *
   * - `:not(sub_selector)`: Select only if the element does not match the `sub_selector`.
   *
   *   `:not(sub_selector)`：只有当元素不匹配子选择器 `sub_selector` 的时候才选取。
   *
   * - `selector1, selector2`: Select if either `selector1` or `selector2` matches.
   *
   *   `selector1, selector2`：无论 `selector1` 还是 `selector2` 匹配时都选取。
   *
   * Angular only allows directives to apply on CSS selectors that do not cross
   * element boundaries.
   *
   * Angular 只允许指令使用那些不跨元素边界的 CSS 选择器。
   *
   * For the following template HTML, a directive with an `input[type=text]` selector,
   * would be instantiated only on the `<input type="text">` element.
   *
   * 对于下列模板 HTML，具有 `input[type=text]` 选择器的指令只会在 `<input type="text">` 元素上实例化。
   *
   * ```html
   * <form>
   *   <input type="text">
   *   <input type="radio">
   * <form>
   * ```
   *
   */
  selector?: string;

  /**
   * The set of event-bound output properties.
   * When an output property emits an event, an event handler attached
   * to that event in the template is invoked.
   *
   * 一组可供事件绑定的输出属性。当输出属性发出事件时，就会调用模板中一个附加到该事件的处理器。
   *
   * Each output property maps a `directiveProperty` to a `bindingProperty`:
   *
   * 每个输出属性都会把 `directiveProperty` 映射到 `bindingProperty`：
   *
   * - `directiveProperty` specifies the component property that emits events.
   *
   *   `directiveProperty` 指定要发出事件的组件属性。
   *
   * - `bindingProperty` specifies the HTML attribute the event handler is attached to.
   *
   *   `bindingProperty` 指定要附加事件处理器的 HTML 属性。
   *
   */
  outputs?: string[];

  /**
   * Maps class properties to host element bindings for properties,
   * attributes, and events, using a set of key-value pairs.
   *
   * 使用一组键-值对，把类的属性映射到宿主元素的绑定（Property、Attribute 和事件）。
   *
   * Angular automatically checks host property bindings during change detection.
   * If a binding changes, Angular updates the directive's host element.
   *
   * Angular 在变更检测期间会自动检查宿主 Property 绑定。
   * 如果绑定的值发生了变化，Angular 就会更新该指令的宿主元素。
   *
   * When the key is a property of the host element, the property value is
   * the propagated to the specified DOM property.
   *
   * 当 key 是宿主元素的 Property 时，这个 Property 值就会传播到指定的 DOM 属性。
   *
   * When the key is a static attribute in the DOM, the attribute value
   * is propagated to the specified property in the host element.
   *
   * 当 key 是 DOM 中的静态 Attribute 时，这个 Attribute 值就会传播到宿主元素上指定的 Property 去。
   *
   * For event handling:
   *
   * 对于事件处理：
   *
   * - The key is the DOM event that the directive listens to.
   * To listen to global events, add the target to the event name.
   * The target can be `window`, `document` or `body`.
   *
   *   它的 key 就是该指令想要监听的 DOM 事件。
   *   要想监听全局事件，请把要监听的目标添加到事件名的前面。
   *   这个目标可以是 `window`、`document` 或 `body`。
   *
   * - The value is the statement to execute when the event occurs. If the
   * statement evalueates to `false`, then `preventDefault` is applied on the DOM
   * event. A handler method can refer to the `$event` local variable.
   *
   *   它的 value 就是当该事件发生时要执行的语句。如果该语句返回 `false`，那么就会调用这个 DOM 事件的 `preventDefault` 函数。
   *   这个语句中可以引用局部变量 `$event` 来获取事件数据。
   *
   */
  host?: {[key: string]: string};

  /**
   * Configures the [injector](guide/glossary#injector) of this
   * directive or component with a [token](guide/glossary#di-token)
   * that maps to a [provider](guide/glossary#provider) of a dependency.
   *
   * 使用一个 [令牌](guide/glossary#di-token) 配置该指令或组件的 [注入器](guide/glossary#injector)，该令牌会映射到一个依赖项的[提供商](guide/glossary#provider)。
   */
  providers?: Provider[];

  /**
   * The name or names that can be used in the template to assign this directive to a variable.
   * For multiple names, use a comma-separated string.
   *
   * 一个或多个名字，可以用来在模板中把该指令赋值给一个变量。当有多个名字时，请使用逗号分隔它们。
   *
   */
  exportAs?: string;

  /**
   * Configures the queries that will be injected into the directive.
   *
   * 配置将要注入到该指令中的一些查询。
   *
   * Content queries are set before the `ngAfterContentInit` callback is called.
   * View queries are set before the `ngAfterViewInit` callback is called.
   *
   * 内容查询会在调用 `ngAfterContentInit` 回调之前设置好。
   * 试图查询会在调用 `ngAfterViewInit` 回调之前设置好。
   *
   */
  queries?: {[key: string]: any};
}

/**
 * Type of the Directive metadata.
 *
 * 指令元数据的类型。
 */
export const Directive: DirectiveDecorator = makeDecorator(
    'Directive', (dir: Directive = {}) => dir, undefined, undefined,
    (type: Type<any>, meta: Directive) => (R3_COMPILE_DIRECTIVE || (() => {}))(type, meta));

/**
 * Component decorator interface
 * 组件装饰器的接口
 *
 */
export interface ComponentDecorator {
  /**
   * Decorator that marks a class as an Angular component and provides configuration
   * metadata that determines how the component should be processed,
   * instantiated, and used at runtime.
   *
   * 一个装饰器，用于把某个类标记为 Angular 组件，并为它配置一些元数据，以决定该组件在运行期间该如何处理、实例化和使用。
   *
   * Components are the most basic UI building block of an Angular app.
   * An Angular app contains a tree of Angular components.
   *
   * 组件是 Angular 应用中最基本的 UI 构造块。Angular 应用中包含一棵组件树。
   *
   * Angular components are a subset of directives, always associated with a template.
   * Unlike other directives, only one component can be instantiated per an element in a template.
   *
   * Angular 的组件是指令的一个子集，它总是有一个与之关联的模板。
   *
   * A component must belong to an NgModule in order for it to be available
   * to another component or application. To make it a member of an NgModule,
   * list it in the `declarations` field of the `@NgModule` metadata.
   *
   * 组件必须从属于某个 NgModule 才能被其它组件或应用使用。
   * 要想让它成为某个 NgModule 中的一员，请把它列在 `@NgModule` 元数据的 `declarations` 字段中。
   *
   * Note that, in addition to these options for configuring a directive,
   * you can control a component's runtime behavior by implementing
   * life-cycle hooks. For more information, see the
   * [Lifecycle Hooks](guide/lifecycle-hooks) guide.
   *
   * 注意，除了这些用来对指令进行配置的选项之外，你还可以通过实现生命周期钩子来控制组件的运行期行为。
   * 要了解更多，参见 [生命周期钩子](guide/lifecycle-hooks) 章。
   *
   * @usageNotes
   *
   * ### Setting component inputs
   *
   * ### 设置组件的输入属性
   *
   * The following example creates a component with two data-bound properties,
   * specified by the `inputs` value.
   *
   * 下免得例子创建了一个带有两个数据绑定属性的组件，它是通过 `inputs` 值来指定的。
   *
   * <code-example path="core/ts/metadata/directives.ts" region="component-input">
   * </code-example>
   *
   *
   * ### Setting component outputs
   *
   * ### 设置组件的输出属性
   *
   * The following example shows two event emitters that emit on an interval. One
   * emits an output every second, while the other emits every five seconds.
   *
   * 下面的例子展示了两个事件发生器，它们定时发出事件。一个每隔一秒发出一个输出事件，另一个则隔五秒。
   *
   * {@example core/ts/metadata/directives.ts region='component-output-interval'}
   *
   * ### Injecting a class with a view provider
   *
   * ### 使用视图提供商注入一个类
   *
   * The following simple example injects a class into a component
   * using the view provider specified in component metadata:
   *
   * 下面的例子示范了如何在组件元数据中使用视图提供商来把一个类注入到组件中：
   *
   * ```
   * class Greeter {
   *    greet(name:string) {
   *      return 'Hello ' + name + '!';
   *    }
   * }
   *
   * @Directive({
   *   selector: 'needs-greeter'
   * })
   * class NeedsGreeter {
   *   greeter:Greeter;
   *
   *   constructor(greeter:Greeter) {
   *     this.greeter = greeter;
   *   }
   * }
   *
   * @Component({
   *   selector: 'greet',
   *   viewProviders: [
   *     Greeter
   *   ],
   *   template: `<needs-greeter></needs-greeter>`
   * })
   * class HelloWorld {
   * }
   *
   * ```
   *
   *
   * @Annotation
   */
  (obj: Component): TypeDecorator;
  /**
   * See the `@Component` decorator.
   *
   * 参见 `@Component` 装饰器。
   */
  new (obj: Component): Component;
}

/**
 * Supplies configuration metadata for an Angular component.
 *
 * 为 Angular 组件提供配置元数据。
 */
export interface Component extends Directive {
  /**
   * The change-detection strategy to use for this component.
   *
   * 用于当前组件的变更检测策略。
   *
   * When a component is instantiated, Angular creates a change detector,
   * which is responsible for propagating the component's bindings.
   * The strategy is one of:
   *
   * 当组件实例化之后，Angular 就会创建一个变更检测器，它负责传播组件各个绑定值的变化。
   * 该策略是下列值之一：
   *
   * - `ChangeDetectionStrategy#OnPush` sets the strategy to `CheckOnce` (on demand).
   *
   *   `ChangeDetectionStrategy#OnPush` 把策略设置为 `CheckOnce`（按需）。
   *
   * - `ChangeDetectionStrategy#Default` sets the strategy to `CheckAlways`.
   *
   *   `ChangeDetectionStrategy#Default` 把策略设置为 `CheckAlways`。
   */
  changeDetection?: ChangeDetectionStrategy;

  /**
   * Defines the set of injectable objects that are visible to its view DOM children.
   * See [example](#injecting-a-class-with-a-view-provider).
   *
   */
  viewProviders?: Provider[];

  /**
   * The module ID of the module that contains the component.
   * The component must be able to resolve relative URLs for templates and styles.
   * SystemJS exposes the `__moduleName` variable within each module.
   * In CommonJS, this can  be set to `module.id`.
   *
   * 包含该组件的那个模块的 ID。该组件必须能解析模板和样式表中使用的相对 URL。
   * SystemJS 在每个模块中都导出了 `__moduleName` 变量。在 CommonJS 中，它可以设置为 `module.id`。
   */
  moduleId?: string;

  /**
   * The URL of a template file for an Angular component. If provided,
   * do not supply an inline template using `template`.
   *
   * 组件模板文件的 URL。如果提供了它，就不要再用 `template` 来提供内联模板了。
   */
  templateUrl?: string;

  /**
   * An inline template for an Angular component. If provided,
   * do not supply a template file using `templateUrl`.
   *
   * 组件的内联模板。如果提供了它，就不要再用 `templateUrl` 提供模板了。
   */
  template?: string;

  /**
   * One or more URLs for files containing CSS stylesheets to use
   * in this component.
   *
   * 一个或多个 URL，指向包含本组件 CSS 样式表的文件。
   */
  styleUrls?: string[];

  /**
   * One or more inline CSS stylesheets to use
   * in this component.
   *
   * 本组件用到的一个或多个内联 CSS 样式。
   */
  styles?: string[];

  /**
   * One or more animation `trigger()` calls, containing
   * `state()` and `transition()` definitions.
   * See the [Animations guide](/guide/animations) and animations API documentation.
   *
   * 一个或多个动画 `trigger()` 调用，包含一些 `state()` 和 `transition()` 定义。
   * 参见[动画](/guide/animations)和相关的 API 文档。
   */
  animations?: any[];

  /**
   * An encapsulation policy for the template and CSS styles. One of:
   *
   * 供模板和 CSS 样式使用的样式封装策略。取值为：
   *
   * - `ViewEncapsulation.Native`: Use shadow roots. This works
   * only if natively available on the platform.
   *
   *   `ViewEncapsulation.Native`：使用 Shadow DOM。它只在原生支持 Shadow DOM 的平台上才能工作。
   *
   * - `ViewEncapsulation.Emulated`: Use shimmed CSS that
   * emulates the native behavior.
   *
   *   `ViewEncapsulation.Emulated`：使用垫片（shimmed) CSS 来模拟原生行为。
   *
   * - `ViewEncapsulation.None`: Use global CSS without any
   * encapsulation.
   *
   *   `ViewEncapsulation.None`：使用全局 CSS，不做任何封装。
   *
   * If not supplied, the value is taken from `CompilerOptions`. The default compiler option is
   * `ViewEncapsulation.Emulated`.
   *
   * 如果没有提供，该值就会从 `CompilerOptions` 中获取它。默认的编译器选项是 `ViewEncapsulation.Emulated`。
   *
   * If the policy is set to `ViewEncapsulation.Emulated` and the component has no `styles`
   * or `styleUrls` specified, the policy is automatically switched to `ViewEncapsulation.None`.
   *
   * 如果该策略设置为 `ViewEncapsulation.Emulated`，并且该组件没有指定 `styles` 或 `styleUrls`，就会自动切换到 `ViewEncapsulation.None`。
   */
  encapsulation?: ViewEncapsulation;

  /**
   * Overrides the default encapsulation start and end delimiters (`{{` and `}}`)
   *
   * 改写默认的插值表达式起止分界符（`{{` 和 `}}`）
   */
  interpolation?: [string, string];

  /**
   * A set of components that should be compiled along with
   * this component. For each component listed here,
   * Angular creates a {@link ComponentFactory} and stores it in the
   * {@link ComponentFactoryResolver}.
   *
   * 一个组件的集合，它应该和当前组件一起编译。对于这里列出的每个组件，Angular 都会创建一个 {@link ComponentFactory} 并保存进 {@link ComponentFactoryResolver} 中。
   */
  entryComponents?: Array<Type<any>|any[]>;

  /**
   * True to preserve or false to remove potentially superfluous whitespace characters
   * from the compiled template. Whitespace characters are those matching the `\s`
   * character class in JavaScript regular expressions. Default is false, unless
   * overridden in compiler options.
   *
   * 为 `true` 则保留，为 `false` 则从编译后的模板中移除可能多余的空白字符。
   * 空白字符就是指那些能在 JavaScript 正则表达式中匹配 `\s` 的字符。默认为 `false`，除非通过编译器选项改写了它。
   */
  preserveWhitespaces?: boolean;
}

/**
 * Component decorator and metadata.
 *
 * 组件装饰器与元数据
 *
 * @usageNotes
 *
 * ### Using animations
 *
 * ### 使用动画
 *
 * The following snippet shows an animation trigger in a component's
 * metadata. The trigger is attached to an element in the component's
 * template, using "@_trigger_name_", and a state expression that is evaluated
 * at run time to determine whether the animation should start.
 *
 * 下列代码片段展示了组件元数据中的一些动画触发器。
 * 该触发器会附加到组件模板中的某个元素上（使用 "@_trigger_name_"），并在运行期间计算一个状态表达式，以决定该启动哪个动画。
 *
 * ```typescript
 * @Component({
 *   selector: 'animation-cmp',
 *   templateUrl: 'animation-cmp.html',
 *   animations: [
 *     trigger('myTriggerName', [
 *       state('on', style({ opacity: 1 }),
 *       state('off', style({ opacity: 0 }),
 *       transition('on => off', [
 *         animate("1s")
 *       ])
 *     ])
 *   ]
 * })
 * ```
 *
 * ```html
 * <!-- animation-cmp.html -->
 * <div @myTriggerName="expression">...</div>
 * ```
 *
 * ### Preserving whitespace
 *
 * ### 保留空白
 *
 * Removing whitespace can greatly reduce AOT-generated code size, and speed up view creation.
 * As of Angular 6, default for `preserveWhitespaces` is false (whitespace is removed).
 * To change the default setting for all components in your application, set
 * the `preserveWhitespaces` option of the AOT compiler.
 *
 * 移除空白可以大幅减小 AOT 生成的代码的体积，并能更快速的创建视图。
 * 对于 Angular 6，`preserveWhitespaces` 的默认值是 `false`（也就是说将移除空白）。
 * 如果要修改应用中所有组件的默认设置，请设置 AOT 编译器的 `preserveWhitespaces` 选项。
 *
 * Current implementation removes whitespace characters as follows:
 *
 * 当前的实现会按照下列规则移除空白字符：
 *
 * - Trims all whitespaces at the beginning and the end of a template.
 *
 *   移除模板开头和结尾处的所有空白。
 *
 * - Removes whitespace-only text nodes. For example,
 * `<button>Action 1</button>  <button>Action 2</button>` becomes
 * `<button>Action 1</button><button>Action 2</button>`.
 *
 *   移除只有空白字符的文本节点。比如：
 * `<button>Action 1</button>  <button>Action 2</button>` 会变成
 * `<button>Action 1</button><button>Action 2</button>`.
 *
 * - Replaces a series of whitespace characters in text nodes with a single space.
 * For example, `<span>\n some text\n</span>` becomes `<span> some text </span>`.
 *
 *   把文本节点内部的一系列空白字符替换为单个空格。比如`<span>\n some text\n</span>` 会变成 `<span> some text </span>`。
 *
 * - Does NOT alter text nodes inside HTML tags such as `<pre>` or `<textarea>`,
 * where whitespace characters are significant.
 *
 *   不会修改某些 HTML 标签（如 `<pre>` 或 `<textarea>`）内部的文本节点 —— 它们的空白字符是有意义的。
 *
 * Note that these transformations can influence DOM nodes layout, although impact
 * should be minimal.
 *
 * 注意，这些转换可能会影响 DOM 节点的布局，但是这种影响很小。
 *
 * You can override the default behavior to preserve whitespace characters
 * in certain fragments of a template. For example, you can exclude an entire
 * DOM sub-tree by using the `ngPreserveWhitespaces` attribute:
 *
 * 你可以改写它的默认行为，以在模板中的特定片段中保留空白字符。比如，你可以使用 `ngPreserveWhitespaces` 属性来豁免整个 DOM 子树：
 *
 * ```html
 * <div ngPreserveWhitespaces>
 *     whitespaces are preserved here
 *     <span>    and here </span>
 * </div>
 * ```
 *
 * You can force a single space to be preserved in a text node by using `&ngsp;`,
 * which is replaced with a space character by Angular's template
 * compiler:
 *
 * 你还可以使用 `&ngsp;` 来强制在文本节点中保留单个空格，`&ngsp;` 会被 Angular 的模板编译器替换为单个空格：
 *
 * ```html
 * <a>Spaces</a>&ngsp;<a>between</a>&ngsp;<a>links.</a>
 * <!-->compiled to be equivalent to:</>
 *  <a>Spaces</a> <a>between</a> <a>links.</a>
 * ```
 *
 * Note that sequences of `&ngsp;` are still collapsed to just one space character when
 * the `preserveWhitespaces` option is set to `false`.
 *
 * 注意，即使把 `preserveWhitespaces` 选项设置为 `false`，`&ngsp;` 序列也仍然会被压缩成单个空格字符。
 *
 * ```html
 * <a>before</a>&ngsp;&ngsp;&ngsp;<a>after</a>
 * <!-->compiled to be equivalent to:</>
 *  <a>Spaces</a> <a>between</a> <a>links.</a>
 * ```
 *
 * To preserve sequences of whitespace characters, use the
 * `ngPreserveWhitespaces` attribute.
 *
 * 要想完整的保留空白字符序列，请使用 `ngPreserveWhitespaces` 属性。
 *
 * @Annotation
 */
export const Component: ComponentDecorator = makeDecorator(
    'Component', (c: Component = {}) => ({changeDetection: ChangeDetectionStrategy.Default, ...c}),
    Directive, undefined,
    (type: Type<any>, meta: Component) => (R3_COMPILE_COMPONENT || (() => {}))(type, meta));

/**
 * Type of the Pipe decorator / constructor function.
 *
 * Pipe 装饰器、构造函数的类型
 */
export interface PipeDecorator {
  /**
   * Declares a reusable pipe function, and supplies configuration metadata.
   *
   * 声明一个可复用的 pipe 函数，并提供配置元数据。
   */
  (obj: Pipe): TypeDecorator;

  /**
   * See the `Pipe` decorator.
   *
   * 参见 `Pipe` 装饰器。
   */
  new (obj: Pipe): Pipe;
}

/**
 * Type of the Pipe metadata.
 *
 * Pipe 元数据的类型。
 */
export interface Pipe {
  /**
   * The pipe name to use in template bindings.
   *
   * 在模板中绑定时使用的管道名
   */
  name: string;

  /**
   * When true, the pipe is pure, meaning that the
   * `transform()` method is invoked only when its input arguments
   * change. Pipes are pure by default.
   *
   * 为 `true` 时，该管道是纯管道，也就是说 `transform()` 方法只有在其输入参数变化时才会被调用。管道默认都是纯管道。
   *
   * If the pipe has internal state (that is, the result
   * depends on state other than its arguments), set `pure` to false.
   * In this case, the pipe is invoked on each change-detection cycle,
   * even if the arguments have not changed.
   *
   * 如果该管道具有内部状态（也就是说，其结果会依赖内部状态，而不仅仅依赖参数），就要把 `pure` 设置为 `false`。
   * 这种情况下，该管道会在每个变更检测周期中都被调用一次 —— 即使其参数没有发生任何变化。
   */
  pure?: boolean;
}

/**
 *
 *
 * @Annotation
 */
export const Pipe: PipeDecorator = makeDecorator(
    'Pipe', (p: Pipe) => ({pure: true, ...p}), undefined, undefined,
    (type: Type<any>, meta: Pipe) => (R3_COMPILE_PIPE || (() => {}))(type, meta));


/**
 *
 */
export interface InputDecorator {
  /**
   * Decorator that marks a class as pipe and supplies configuration metadata.
   *
   * 一个装饰器，用来把某个类标记为管道，并提供配置元数据。
   *
   * A pipe class must implement the `PipeTransform` interface.
   * For example, if the name is "myPipe", use a template binding expression
   * such as the following:
   *
   * 管道类必须实现 `PipeTransform` 接口。
   * 比如，如果名字是 "myPipe"，则模板绑定表达式的用法如下：
   *
   * ```
   * {{ exp | myPipe }}
   * ```
   *
   * The result of the expression is passed to the pipe's `transform()` method.
   *
   * 表达式的计算结果将被传给该管道的 `transform()` 方法。
   *
   * A pipe must belong to an NgModule in order for it to be available
   * to a template. To make it a member of an NgModule,
   * list it in the `declarations` field of the `@NgModule` metadata.
   *
   * 管道必须属于某个 NgModule 才能在模板中使用。要让它成为 NgModule 的一部分，请把它列在 `@NgModule` 元数据中的 `declarations` 字段中。
   */
  (bindingPropertyName?: string): any;
  new (bindingPropertyName?: string): any;
}

/**
 * Type of metadata for an `Input` property.
 *
 * `Input` 属性的元数据类型。
 *
 */
export interface Input {
  /**
   * Decorator that marks a class field as an input property and supplies configuration metadata.
   * Declares a data-bound input property, which Angular automatically updates
   * during change detection.
   *
   * 一个装饰器，用来把某个类字段标记为输入属性，并且提供配置元数据。
   * 声明一个可供数据绑定的输入属性，在变更检测期间，Angular 会自动更新它。
   *
   * @usageNotes
   *
   * You can supply an optional name to use in templates when the
   * component is instantiated, that maps to the
   * name of the bound property. By default, the original
   * name of the bound property is used for input binding.
   *
   * 你可以提供一个可选的仅供模板中使用的名字，在组件实例化时，会把这个名字映射到可绑定属性上。
   * 默认情况下，输入绑定的名字就是这个可绑定属性的原始名称。
   *
   * The following example creates a component with two input properties,
   * one of which is given a special binding name.
   *
   * 下面的例子创建了一个带有两个输入属性的组件，其中一个还指定了绑定名。
   *
   * ```typescript
   * @Component({
   *   selector: 'bank-account',
   *   template: `
   *     Bank Name: {{bankName}}
  *      Account Id: {{id}}
   *   `
   * })
   * class BankAccount {
   *   // This property is bound using its original name.
   *   @Input() bankName: string;
   *   // this property value is bound to a different property name
   *   // when this component is instantiated in a template.
   *   @Input('account-id') id: string;
   *
   *   // this property is not bound, and is not automatically updated by Angular
   *   normalizedBankName: string;
   * }
   *
   * @Component({
   *   selector: 'app',
   *   template: `
   *     <bank-account bankName="RBC" account-id="4747"></bank-account>
   *   `
   * })
   *
   * class App {}
   * ```
   */
  bindingPropertyName?: string;
}

/**
 *
 * @Annotation
 */
export const Input: InputDecorator =
    makePropDecorator('Input', (bindingPropertyName?: string) => ({bindingPropertyName}));

/**
 * Type of the Output decorator / constructor function.
 *
 * `Output` 装饰器、构造函数的类型。
 */
export interface OutputDecorator {
  /**
  * Decorator that marks a class field as an output property and supplies configuration metadata.
  * Declares a data-bound output property, which Angular automatically updates
  * during change detection.
  *
  * 一个装饰器，用于把一个类字段标记为输出属性，并提供配置元数据。
  * 声明一个可绑定的输出属性，Angular 在变更检测期间会自动更新它。
  *
  * @usageNotes
  *
  * You can supply an optional name to use in templates when the
  * component is instantiated, that maps to the
  * name of the bound property. By default, the original
  * name of the bound property is used for output binding.
  *
  * 你可以提供一个可选的仅供模板中使用的名字，在组件实例化时，会把这个名字映射到可绑定属性上。
  * 默认情况下，输出绑定的名字就是这个可绑定属性的原始名称。
  *
  * See `@Input` decorator for an example of providing a binding name.
  *
  * 参见 `@Input` 的例子了解如何指定一个绑定名。
  */
  (bindingPropertyName?: string): any;
  new (bindingPropertyName?: string): any;
}

/**
 * Type of the Output metadata.
 *
 * `Output` 元数据的类型。
 */
export interface Output { bindingPropertyName?: string; }

/**
 *
 * @Annotation
 */
export const Output: OutputDecorator =
    makePropDecorator('Output', (bindingPropertyName?: string) => ({bindingPropertyName}));


/**
 * Type of the HostBinding decorator / constructor function.
 *
 * HostBinding 装饰器、构造函数的类型。
 *
 */
export interface HostBindingDecorator {
  /**
   * Decorator that marks a DOM property as a host-binding property and supplies configuration
   * metadata.
   * Angular automatically checks host property bindings during change detection, and
   * if a binding changes it updates the host element of the directive.
   *
   * 一个装饰器，用于把一个 DOM 属性标记为绑定到宿主的属性，并提供配置元数据。
   * Angular 在变更检测期间会自动检查宿主属性绑定，如果这个绑定变化了，它就会更新该指令所在的宿主元素。
   *
   * @usageNotes
   *
   * The following example creates a directive that sets the `valid` and `invalid`
   * properties on the DOM element that has an `ngModel` directive on it.
   *
   * 下面的例子创建了一个指令，它会对具有 `ngModel` 指令的 DOM 元素设置 `valid` 和 `invalid` 属性。
   *
   * ```typescript
   * @Directive({selector: '[ngModel]'})
   * class NgModelStatus {
   *   constructor(public control: NgModel) {}
   *   @HostBinding('class.valid') get valid() { return this.control.valid; }
   *   @HostBinding('class.invalid') get invalid() { return this.control.invalid; }
   * }
   *
   * @Component({
   *   selector: 'app',
   *   template: `<input [(ngModel)]="prop">`,
   * })
   * class App {
   *   prop;
   * }
   * ```
   */
  (hostPropertyName?: string): any;
  new (hostPropertyName?: string): any;
}

/**
 * Type of the HostBinding metadata.
 *
 * HostBinding 元数据的类型。
 *
 */
export interface HostBinding { hostPropertyName?: string; }

/**
 *
 * @Annotation
 */
export const HostBinding: HostBindingDecorator =
    makePropDecorator('HostBinding', (hostPropertyName?: string) => ({hostPropertyName}));


/**
 * Type of the HostListener decorator / constructor function.
 *
 * HostListener 装饰器、构造函数的类型
 */
export interface HostListenerDecorator {
  (eventName: string, args?: string[]): any;
  new (eventName: string, args?: string[]): any;
}

/**
 * Type of the HostListener metadata.
 *
 * HostListener 元数据的类型。
 */
export interface HostListener {
  /**
   * The CSS event to listen for.
   *
 * 要监听的事件。
   */
  eventName?: string;
  /**
   * A set of arguments to pass to the handler method when the event occurs.
   *
 * 当该事件发生时传给处理器方法的一组事件。
   */
  args?: string[];
}

/**
 * Binds a CSS event to a host listener and supplies configuration metadata.
 * Angular invokes the supplied handler method when the host element emits the specified event,
 * and updates the bound element with the result.
 * If the handler method returns false, applies `preventDefault` on the bound element.
 *
 * 把一个事件绑定到一个宿主监听器，并提供配置元数据。
 * 当宿主元素发出特定的事件时，Angular 就会执行所提供的处理器方法，并使用其结果更新所绑定到的元素。
 * 如果该事件处理器返回 `false`，则在所绑定的元素上执行 `preventDefault`。
 *
 * @usageNotes
 *
 * The following example declares a directive
 * that attaches a click listener to a button and counts clicks.
 *
 * 下面的例子声明了一个指令，它会为按钮附加一个 `click` 监听器，并统计点击次数。
 *
 * ```
 * @Directive({selector: 'button[counting]'})
 * class CountClicks {
 *   numberOfClicks = 0;
 *
 *   @HostListener('click', ['$event.target'])
 *   onClick(btn) {
 *     console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
 *  }
 * }
 *
 * @Component({
 *   selector: 'app',
 *   template: '<button counting>Increment</button>',
 * })
 * class App {}
 * ```
 *
 * @Annotation
 */
export const HostListener: HostListenerDecorator =
    makePropDecorator('HostListener', (eventName?: string, args?: string[]) => ({eventName, args}));
