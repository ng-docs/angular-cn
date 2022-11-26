/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../di/injector';
import {EnvironmentInjector, getNullInjector} from '../di/r3_injector';
import {Type} from '../interface/type';
import {ComponentRef} from '../linker/component_factory';

import {ComponentFactory} from './component_ref';
import {getComponentDef} from './definition';
import {assertComponentDef} from './errors';

/**
 * Creates a `ComponentRef` instance based on provided component type and a set of options.
 *
 * 根据提供的组件类型和一组选项创建一个 `ComponentRef` 实例。
 *
 * @usageNotes
 *
 * The example below demonstrates how the `createComponent` function can be used
 * to create an instance of a ComponentRef dynamically and attach it to an ApplicationRef,
 * so that it gets included into change detection cycles.
 *
 * 下面的示例演示了如何使用 `createComponent` 函数动态创建 ComponentRef 的实例并将其附加到 ApplicationRef 上，以便它被包含在变更检测周期中。
 *
 * Note: the example uses standalone components, but the function can also be used for
 * non-standalone components (declared in an NgModule) as well.
 *
 * 注：该示例使用了独立组件，但该函数也可用于非独立组件（在 NgModule 中声明）。
 *
 * ```typescript
 * @Component({
 *   standalone: true,
 *   template: `Hello {{ name }}!`
 * })
 * class HelloComponent {
 *   name = 'Angular';
 * }
 *
 * @Component({
 *   standalone: true,
 *   template: `<div id="hello-component-host"></div>`
 * })
 * class RootComponent {}
 *
 * // Bootstrap an application.
 * const applicationRef = await bootstrapApplication(RootComponent);
 *
 * // Locate a DOM node that would be used as a host.
 * const host = document.getElementById('hello-component-host');
 *
 * // Get an `EnvironmentInjector` instance from the `ApplicationRef`.
 * const environmentInjector = applicationRef.injector;
 *
 * // We can now create a `ComponentRef` instance.
 * const componentRef = createComponent(HelloComponent, {host, environmentInjector});
 *
 * // Last step is to register the newly created ref using the `ApplicationRef` instance
 * // to include the component view into change detection cycles.
 * applicationRef.attachView(componentRef.hostView);
 * ```
 *
 * @param component Component class reference.
 *
 * 组件类引用。
 *
 * @param options Set of options to use:
 *
 * 要使用的选项集：
 *
 * - `environmentInjector`: An `EnvironmentInjector` instance to be used for the component, see
 *   additional info about it at <https://angular.io/guide/standalone-components#environment-injectors>.
 *
 *   `environmentInjector` ：要用于组件的 `EnvironmentInjector` 实例，请在<https://angular.io/guide/standalone-components#environment-injectors>中查看有关它的其他信息。
 *
 * - `hostElement` (optional): A DOM node that should act as a host node for the component. If not
 *   provided, Angular creates one based on the tag name used in the component selector (and falls
 *   back to using `div` if selector doesn't have tag name info).
 *
 *   `hostElement` （可选）：应该作为组件的宿主节点的 DOM 节点。如果未提供，Angular 会根据组件选择器中使用的标签名称创建一个（如果选择器没有标签名称信息，则回用 `div` ）。
 *
 * - `elementInjector` (optional): An `ElementInjector` instance, see additional info about it at
 *   <https://angular.io/guide/hierarchical-dependency-injection#elementinjector>.
 *
 *   `elementInjector` （可选）：一个 `ElementInjector` 实例，请在<https://angular.io/guide/hierarchical-dependency-injection#elementinjector>上查看有关它的其他信息。
 *
 * - `projectableNodes` (optional): A list of DOM nodes that should be projected through
 *                     [`<ng-content>`](api/core/ng-content) of the new component instance.
 *
 *   `projectableNodes` （可选）：应该通过新组件实例的[`<ng-content>`](api/core/ng-content)投影的 DOM 节点列表。
 *
 * @returns
 *
 * ComponentRef instance that represents a given Component.
 *
 * 表示给定 Component 的 ComponentRef 实例。
 *
 * @publicApi
 */
export function createComponent<C>(component: Type<C>, options: {
  environmentInjector: EnvironmentInjector,
  hostElement?: Element,
  elementInjector?: Injector,
  projectableNodes?: Node[][],
}): ComponentRef<C> {
  ngDevMode && assertComponentDef(component);
  const componentDef = getComponentDef(component)!;
  const elementInjector = options.elementInjector || getNullInjector();
  const factory = new ComponentFactory<C>(componentDef);
  return factory.create(
      elementInjector, options.projectableNodes, options.hostElement, options.environmentInjector);
}

/**
 * An interface that describes the subset of component metadata
 * that can be retrieved using the `reflectComponentType` function.
 *
 * 一个接口，描述可以用 `reflectComponentType` 函数检索的组件元数据子集。
 *
 * @publicApi
 */
export interface ComponentMirror<C> {
  /**
   * The component's HTML selector.
   *
   * 组件的 HTML 选择器。
   *
   */
  get selector(): string;
  /**
 * The type of component the factory will create.
 *
 * 工厂将创建的组件类型。
 *
 */
  get type(): Type<C>;
  /**
 * The inputs of the component.
 *
 * 组件的输入。
 *
 */
  get inputs(): ReadonlyArray<{readonly propName: string, readonly templateName: string}>;
  /**
 * The outputs of the component.
 *
 * 组件的输出。
 *
 */
  get outputs(): ReadonlyArray<{readonly propName: string, readonly templateName: string}>;
  /**
 * Selector for all <ng-content> elements in the component.
 *
 * 所有人的选择器<ng-content>组件中的元素。
 *
 */
  get ngContentSelectors(): ReadonlyArray<string>;
  /**
 * Whether this component is marked as standalone.
 * Note: an extra flag, not present in `ComponentFactory`.
 *
 * 此组件是否标记为独立。注：一个额外的标志，在 `ComponentFactory` 中不存在。
 *
 */
  get isStandalone(): boolean;
}

/**
 * Creates an object that allows to retrieve component metadata.
 *
 * 创建一个允许检索组件元数据的对象。
 *
 * @usageNotes
 *
 * The example below demonstrates how to use the function and how the fields
 * of the returned object map to the component metadata.
 *
 * 下面的示例演示了如何使用该函数，以及返回对象的字段如何映射到组件元数据。
 *
 * ```typescript
 * @Component({
 *   standalone: true,
 *   selector: 'foo-component',
 *   template: `
 *     <ng-content></ng-content>
 *     <ng-content select="content-selector-a"></ng-content>
 *   `,
 * })
 * class FooComponent {
 *   @Input('inputName') inputPropName: string;
 *   @Output('outputName') outputPropName = new EventEmitter<void>();
 * }
 *
 * const mirror = reflectComponentType(FooComponent);
 * expect(mirror.type).toBe(FooComponent);
 * expect(mirror.selector).toBe('foo-component');
 * expect(mirror.isStandalone).toBe(true);
 * expect(mirror.inputs).toEqual([{propName: 'inputName', templateName: 'inputPropName'}]);
 * expect(mirror.outputs).toEqual([{propName: 'outputName', templateName: 'outputPropName'}]);
 * expect(mirror.ngContentSelectors).toEqual([
 *   '*',                 // first `<ng-content>` in a template, the selector defaults to `*`
 *   'content-selector-a' // second `<ng-content>` in a template
 * ]);
 * ```
 *
 * @param component Component class reference.
 *
 * 组件类引用。
 *
 * @returns
 *
 * An object that allows to retrieve component metadata.
 *
 * 允许检索组件元数据的对象。
 *
 * @publicApi
 */
export function reflectComponentType<C>(component: Type<C>): ComponentMirror<C>|null {
  const componentDef = getComponentDef(component);
  if (!componentDef) return null;

  const factory = new ComponentFactory<C>(componentDef);
  return {
    get selector(): string {
      return factory.selector;
    },
    get type(): Type<C> {
      return factory.componentType;
    },
    get inputs(): ReadonlyArray<{propName: string, templateName: string}> {
      return factory.inputs;
    },
    get outputs(): ReadonlyArray<{propName: string, templateName: string}> {
      return factory.outputs;
    },
    get ngContentSelectors(): ReadonlyArray<string> {
      return factory.ngContentSelectors;
    },
    get isStandalone(): boolean {
      return componentDef.standalone;
    },
  };
}
