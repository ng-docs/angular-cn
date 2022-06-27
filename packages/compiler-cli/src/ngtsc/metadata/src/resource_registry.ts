/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';
import {ClassDeclaration} from '../../reflection';

/**
 * Represents an resource for a component and contains the `AbsoluteFsPath`
 * to the file which was resolved by evaluating the `ts.Expression` (generally, a relative or
 * absolute string path to the resource).
 *
 * 表示组件的资源，并包含通过估算 `ts.Expression` （通常是资源的相对或绝对字符串路径）解析的文件的
 * `AbsoluteFsPath` 。
 *
 * If the resource is inline, the `path` will be `null`.
 *
 * 如果资源是内联的，则 `path` 将是 `null` 。
 *
 */
export interface Resource {
  path: AbsoluteFsPath|null;
  expression: ts.Expression;
}

export interface ExternalResource extends Resource {
  path: AbsoluteFsPath;
}

export function isExternalResource(resource: Resource): resource is ExternalResource {
  return resource.path !== null;
}

/**
 * Represents the either inline or external resources of a component.
 *
 * 表示组件的内联或外部资源。
 *
 * A resource with a `path` of `null` is considered inline.
 *
 * `path` 为 `null` 的资源被认为是内联的。
 *
 */
export interface ComponentResources {
  template: Resource;
  styles: ReadonlySet<Resource>;
}

/**
 * Tracks the mapping between external template/style files and the component(s) which use them.
 *
 * 跟踪外部模板/样式文件与使用它们的组件之间的映射。
 *
 * This information is produced during analysis of the program and is used mainly to support
 * external tooling, for which such a mapping is challenging to determine without compiler
 * assistance.
 *
 * 这些信息是在程序分析期间产生的，主要用于支持外部工具，对于这些工具，如果没有编译器的帮助，很难确定这样的映射。
 *
 */
export class ResourceRegistry {
  private externalTemplateToComponentsMap = new Map<AbsoluteFsPath, Set<ClassDeclaration>>();
  private componentToTemplateMap = new Map<ClassDeclaration, Resource>();
  private componentToStylesMap = new Map<ClassDeclaration, Set<Resource>>();
  private externalStyleToComponentsMap = new Map<AbsoluteFsPath, Set<ClassDeclaration>>();

  getComponentsWithTemplate(template: AbsoluteFsPath): ReadonlySet<ClassDeclaration> {
    if (!this.externalTemplateToComponentsMap.has(template)) {
      return new Set();
    }

    return this.externalTemplateToComponentsMap.get(template)!;
  }

  registerResources(resources: ComponentResources, component: ClassDeclaration) {
    if (resources.template !== null) {
      this.registerTemplate(resources.template, component);
    }
    for (const style of resources.styles) {
      this.registerStyle(style, component);
    }
  }

  registerTemplate(templateResource: Resource, component: ClassDeclaration): void {
    const {path} = templateResource;
    if (path !== null) {
      if (!this.externalTemplateToComponentsMap.has(path)) {
        this.externalTemplateToComponentsMap.set(path, new Set());
      }
      this.externalTemplateToComponentsMap.get(path)!.add(component);
    }
    this.componentToTemplateMap.set(component, templateResource);
  }

  getTemplate(component: ClassDeclaration): Resource|null {
    if (!this.componentToTemplateMap.has(component)) {
      return null;
    }
    return this.componentToTemplateMap.get(component)!;
  }

  registerStyle(styleResource: Resource, component: ClassDeclaration): void {
    const {path} = styleResource;
    if (!this.componentToStylesMap.has(component)) {
      this.componentToStylesMap.set(component, new Set());
    }
    if (path !== null) {
      if (!this.externalStyleToComponentsMap.has(path)) {
        this.externalStyleToComponentsMap.set(path, new Set());
      }
      this.externalStyleToComponentsMap.get(path)!.add(component);
    }
    this.componentToStylesMap.get(component)!.add(styleResource);
  }

  getStyles(component: ClassDeclaration): Set<Resource> {
    if (!this.componentToStylesMap.has(component)) {
      return new Set();
    }
    return this.componentToStylesMap.get(component)!;
  }

  getComponentsWithStyle(styleUrl: AbsoluteFsPath): ReadonlySet<ClassDeclaration> {
    if (!this.externalStyleToComponentsMap.has(styleUrl)) {
      return new Set();
    }

    return this.externalStyleToComponentsMap.get(styleUrl)!;
  }
}
