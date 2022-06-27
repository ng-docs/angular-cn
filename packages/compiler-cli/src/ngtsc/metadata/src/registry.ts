/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Reference} from '../../imports';
import {ClassDeclaration, ReflectionHost} from '../../reflection';

import {DirectiveMeta, MetadataReader, MetadataRegistry, NgModuleMeta, PipeMeta} from './api';
import {hasInjectableFields} from './util';

/**
 * A registry of directive, pipe, and module metadata for types defined in the current compilation
 * unit, which supports both reading and registering.
 *
 * 当前编译单元中定义的类型的指令、管道和模块元数据的注册表，支持读取和注册。
 *
 */
export class LocalMetadataRegistry implements MetadataRegistry, MetadataReader {
  private directives = new Map<ClassDeclaration, DirectiveMeta>();
  private ngModules = new Map<ClassDeclaration, NgModuleMeta>();
  private pipes = new Map<ClassDeclaration, PipeMeta>();

  getDirectiveMetadata(ref: Reference<ClassDeclaration>): DirectiveMeta|null {
    return this.directives.has(ref.node) ? this.directives.get(ref.node)! : null;
  }
  getNgModuleMetadata(ref: Reference<ClassDeclaration>): NgModuleMeta|null {
    return this.ngModules.has(ref.node) ? this.ngModules.get(ref.node)! : null;
  }
  getPipeMetadata(ref: Reference<ClassDeclaration>): PipeMeta|null {
    return this.pipes.has(ref.node) ? this.pipes.get(ref.node)! : null;
  }

  registerDirectiveMetadata(meta: DirectiveMeta): void {
    this.directives.set(meta.ref.node, meta);
  }
  registerNgModuleMetadata(meta: NgModuleMeta): void {
    this.ngModules.set(meta.ref.node, meta);
  }
  registerPipeMetadata(meta: PipeMeta): void {
    this.pipes.set(meta.ref.node, meta);
  }
}

/**
 * A `MetadataRegistry` which registers metdata with multiple delegate `MetadataRegistry` instances.
 *
 * 一种 `MetadataRegistry` ，它向多个委托 `MetadataRegistry` 实例注册元数据。
 *
 */
export class CompoundMetadataRegistry implements MetadataRegistry {
  constructor(private registries: MetadataRegistry[]) {}

  registerDirectiveMetadata(meta: DirectiveMeta): void {
    for (const registry of this.registries) {
      registry.registerDirectiveMetadata(meta);
    }
  }

  registerNgModuleMetadata(meta: NgModuleMeta): void {
    for (const registry of this.registries) {
      registry.registerNgModuleMetadata(meta);
    }
  }

  registerPipeMetadata(meta: PipeMeta): void {
    for (const registry of this.registries) {
      registry.registerPipeMetadata(meta);
    }
  }
}

/**
 * Registry that keeps track of classes that can be constructed via dependency injection (e.g.
 * injectables, directives, pipes).
 *
 * 跟踪可以通过依赖注入构建的类（例如注入器、指令、管道）的注册表。
 *
 */
export class InjectableClassRegistry {
  private classes = new Set<ClassDeclaration>();

  constructor(private host: ReflectionHost) {}

  registerInjectable(declaration: ClassDeclaration): void {
    this.classes.add(declaration);
  }

  isInjectable(declaration: ClassDeclaration): boolean {
    // Figure out whether the class is injectable based on the registered classes, otherwise
    // fall back to looking at its members since we might not have been able register the class
    // if it was compiled already.
    return this.classes.has(declaration) || hasInjectableFields(declaration, this.host);
  }
}
