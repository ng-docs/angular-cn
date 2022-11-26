/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';

import {DirectiveMeta, MetadataReaderWithIndex, MetadataRegistry, NgModuleMeta, PipeMeta} from './api';

/**
 * A registry of directive, pipe, and module metadata for types defined in the current compilation
 * unit, which supports both reading and registering.
 *
 * 当前编译单元中定义的类型的指令、管道和模块元数据的注册表，支持读取和注册。
 *
 */
export class LocalMetadataRegistry implements MetadataRegistry, MetadataReaderWithIndex {
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

  getKnownDirectives(): Iterable<ClassDeclaration> {
    return this.directives.keys();
  }
}

/**
 * A `MetadataRegistry` which registers metadata with multiple delegate `MetadataRegistry`
 * instances.
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
