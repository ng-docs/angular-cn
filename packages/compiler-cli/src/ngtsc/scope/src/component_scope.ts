/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ClassDeclaration} from '../../reflection';

import {ComponentScope, ComponentScopeReader, LocalModuleScope, RemoteScope} from './api';

/**
 * A `ComponentScopeReader` that reads from an ordered set of child readers until it obtains the
 * requested scope.
 *
 * 一个 `ComponentScopeReader` ，它会从一组有序的子读取器中读取，直到获得所请求的范围。
 *
 * This is used to combine `ComponentScopeReader`s that read from different sources (e.g. from a
 * registry and from the incremental state).
 *
 * 这用于组合从不同来源（例如从注册表和从增量状态）读取的 `ComponentScopeReader` 。
 *
 */
export class CompoundComponentScopeReader implements ComponentScopeReader {
  constructor(private readers: ComponentScopeReader[]) {}

  getScopeForComponent(clazz: ClassDeclaration): ComponentScope|null {
    for (const reader of this.readers) {
      const meta = reader.getScopeForComponent(clazz);
      if (meta !== null) {
        return meta;
      }
    }
    return null;
  }

  getRemoteScope(clazz: ClassDeclaration): RemoteScope|null {
    for (const reader of this.readers) {
      const remoteScope = reader.getRemoteScope(clazz);
      if (remoteScope !== null) {
        return remoteScope;
      }
    }
    return null;
  }
}
