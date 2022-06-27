/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InputOutputPropertySet} from '@angular/compiler';

/**
 * The name of a class property that backs an input or output declared by a directive or component.
 *
 * 支持由指令或组件声明的输入或输出的类属性名称。
 *
 * This type exists for documentation only.
 *
 * 此类型仅用于文档。
 *
 */
export type ClassPropertyName = string;

/**
 * The name by which an input or output of a directive or component is bound in an Angular template.
 *
 * 指令或组件的输入或输出在 Angular 模板中绑定的名称。
 *
 * This type exists for documentation only.
 *
 * 此类型仅用于文档。
 *
 */
export type BindingPropertyName = string;

/**
 * An input or output of a directive that has both a named JavaScript class property on a component
 * or directive class, as well as an Angular template property name used for binding.
 *
 * 指令的输入或输出，它同时具有组件或指令类上的命名 JavaScript 类属性，以及用于绑定的 Angular
 * 模板属性名称。
 *
 */
export interface InputOrOutput {
  /**
   * The name of the JavaScript property on the component or directive instance for this input or
   * output.
   *
   * 此输入或输出的组件或指令实例上的 JavaScript 属性名称。
   *
   */
  readonly classPropertyName: ClassPropertyName;

  /**
   * The property name used to bind this input or output in an Angular template.
   *
   * 用于在 Angular 模板中绑定此输入或输出的属性名称。
   *
   */
  readonly bindingPropertyName: BindingPropertyName;
}

/**
 * A mapping of component property and template binding property names, for example containing the
 * inputs of a particular directive or component.
 *
 * 组件属性和模板绑定属性名称的映射，例如包含特定指令或组件的输入。
 *
 * A single component property has exactly one input/output annotation (and therefore one binding
 * property name) associated with it, but the same binding property name may be shared across many
 * component property names.
 *
 * 单个组件属性只有一个关联的输入/输出注解（因此有一个绑定属性名称），但同一个绑定属性名称可以在许多组件属性名称之间共享。
 *
 * Allows bidirectional querying of the mapping - looking up all inputs/outputs with a given
 * property name, or mapping from a specific class property to its binding property name.
 *
 * 允许双向查询映射 - 查找具有给定属性名称的所有输入/输出，或从特定的类属性映射到其绑定属性名称。
 *
 */
export class ClassPropertyMapping implements InputOutputPropertySet {
  /**
   * Mapping from class property names to the single `InputOrOutput` for that class property.
   *
   * 从类属性名称映射到该类属性的单个 `InputOrOutput` 。
   *
   */
  private forwardMap: Map<ClassPropertyName, InputOrOutput>;

  /**
   * Mapping from property names to one or more `InputOrOutput`s which share that name.
   *
   * 从属性名称映射到共享该名称的一个或多个 `InputOrOutput` 。
   *
   */
  private reverseMap: Map<BindingPropertyName, InputOrOutput[]>;

  private constructor(forwardMap: Map<ClassPropertyName, InputOrOutput>) {
    this.forwardMap = forwardMap;
    this.reverseMap = reverseMapFromForwardMap(forwardMap);
  }

  /**
   * Construct a `ClassPropertyMapping` with no entries.
   *
   * 构造一个没有条目的 `ClassPropertyMapping` 。
   *
   */
  static empty(): ClassPropertyMapping {
    return new ClassPropertyMapping(new Map());
  }

  /**
   * Construct a `ClassPropertyMapping` from a primitive JS object which maps class property names
   * to either binding property names or an array that contains both names, which is used in on-disk
   * metadata formats (e.g. in .d.ts files).
   *
   * 从原始 JS 对象构造一个 `ClassPropertyMapping`
   * ，该对象将类属性名称映射到绑定属性名称或包含这两个名称的数组，用于磁盘上的元数据格式（例如
   * .d.ts 文件）。
   *
   */
  static fromMappedObject(obj: {
    [classPropertyName: string]: BindingPropertyName|[ClassPropertyName, BindingPropertyName]
  }): ClassPropertyMapping {
    const forwardMap = new Map<ClassPropertyName, InputOrOutput>();

    for (const classPropertyName of Object.keys(obj)) {
      const value = obj[classPropertyName];
      const bindingPropertyName = Array.isArray(value) ? value[0] : value;
      const inputOrOutput: InputOrOutput = {classPropertyName, bindingPropertyName};
      forwardMap.set(classPropertyName, inputOrOutput);
    }

    return new ClassPropertyMapping(forwardMap);
  }

  /**
   * Merge two mappings into one, with class properties from `b` taking precedence over class
   * properties from `a`.
   *
   * 将两个映射合并为一个，来自 `b` 的类属性优先于来自 `a` 的类属性。
   *
   */
  static merge(a: ClassPropertyMapping, b: ClassPropertyMapping): ClassPropertyMapping {
    const forwardMap = new Map<ClassPropertyName, InputOrOutput>(a.forwardMap.entries());
    for (const [classPropertyName, inputOrOutput] of b.forwardMap) {
      forwardMap.set(classPropertyName, inputOrOutput);
    }

    return new ClassPropertyMapping(forwardMap);
  }

  /**
   * All class property names mapped in this mapping.
   *
   * 在此映射中映射的所有类属性名称。
   *
   */
  get classPropertyNames(): ClassPropertyName[] {
    return Array.from(this.forwardMap.keys());
  }

  /**
   * All binding property names mapped in this mapping.
   *
   * 在此映射中映射的所有绑定属性名称。
   *
   */
  get propertyNames(): BindingPropertyName[] {
    return Array.from(this.reverseMap.keys());
  }

  /**
   * Check whether a mapping for the given property name exists.
   *
   * 检查给定属性名称的映射是否存在。
   *
   */
  hasBindingPropertyName(propertyName: BindingPropertyName): boolean {
    return this.reverseMap.has(propertyName);
  }

  /**
   * Lookup all `InputOrOutput`s that use this `propertyName`.
   *
   * 查找使用此 `propertyName` 的所有 `InputOrOutput` 。
   *
   */
  getByBindingPropertyName(propertyName: string): ReadonlyArray<InputOrOutput>|null {
    return this.reverseMap.has(propertyName) ? this.reverseMap.get(propertyName)! : null;
  }

  /**
   * Lookup the `InputOrOutput` associated with a `classPropertyName`.
   *
   * 查找与 `InputOrOutput` 关联的 `classPropertyName` 。
   *
   */
  getByClassPropertyName(classPropertyName: string): InputOrOutput|null {
    return this.forwardMap.has(classPropertyName) ? this.forwardMap.get(classPropertyName)! : null;
  }

  /**
   * Convert this mapping to a primitive JS object which maps each class property directly to the
   * binding property name associated with it.
   *
   * 将此映射转换为原始 JS 对象，该对象将每个类属性直接映射到与其关联的绑定属性名称。
   *
   */
  toDirectMappedObject(): {[classPropertyName: string]: BindingPropertyName} {
    const obj: {[classPropertyName: string]: BindingPropertyName} = {};
    for (const [classPropertyName, inputOrOutput] of this.forwardMap) {
      obj[classPropertyName] = inputOrOutput.bindingPropertyName;
    }
    return obj;
  }

  /**
   * Convert this mapping to a primitive JS object which maps each class property either to itself
   * (for cases where the binding property name is the same) or to an array which contains both
   * names if they differ.
   *
   * 将此映射转换为原始 JS
   * 对象，该对象将每个类属性映射到本身（对于绑定属性名称相同的情况），或者映射到包含两个名称（如果不同）的数组。
   *
   * This object format is used when mappings are serialized (for example into .d.ts files).
   *
   * 序列化映射（例如转换为 .d.ts 文件）时会使用此对象格式。
   *
   */
  toJointMappedObject():
      {[classPropertyName: string]: BindingPropertyName|[BindingPropertyName, ClassPropertyName]} {
    const obj: {
      [classPropertyName: string]: BindingPropertyName|[BindingPropertyName, ClassPropertyName]
    } = {};
    for (const [classPropertyName, inputOrOutput] of this.forwardMap) {
      if (inputOrOutput.bindingPropertyName as string === classPropertyName as string) {
        obj[classPropertyName] = inputOrOutput.bindingPropertyName;
      } else {
        obj[classPropertyName] = [inputOrOutput.bindingPropertyName, classPropertyName];
      }
    }
    return obj;
  }

  /**
   * Implement the iterator protocol and return entry objects which contain the class and binding
   * property names (and are useful for destructuring).
   *
   * 实现迭代器协议并返回包含类和绑定属性名称（并且可用于解构）的条目对象。
   *
   */
  * [Symbol.iterator](): IterableIterator<[ClassPropertyName, BindingPropertyName]> {
    for (const [classPropertyName, inputOrOutput] of this.forwardMap.entries()) {
      yield [classPropertyName, inputOrOutput.bindingPropertyName];
    }
  }
}

function reverseMapFromForwardMap(forwardMap: Map<ClassPropertyName, InputOrOutput>):
    Map<BindingPropertyName, InputOrOutput[]> {
  const reverseMap = new Map<BindingPropertyName, InputOrOutput[]>();
  for (const [_, inputOrOutput] of forwardMap) {
    if (!reverseMap.has(inputOrOutput.bindingPropertyName)) {
      reverseMap.set(inputOrOutput.bindingPropertyName, []);
    }

    reverseMap.get(inputOrOutput.bindingPropertyName)!.push(inputOrOutput);
  }
  return reverseMap;
}
