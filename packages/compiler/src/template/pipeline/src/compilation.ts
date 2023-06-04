/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ConstantPool} from '../../../constant_pool';
import * as o from '../../../output/output_ast';
import * as ir from '../ir';

/**
 * Compilation-in-progress of a whole component's template, including the main template and any
 * embedded views or host bindings.
 *
 * 正在编译整个组件的模板，包括主模板和任何嵌入式视图或宿主绑定。
 *
 */
export class ComponentCompilation {
  /**
   * Tracks the next `ir.XrefId` which can be assigned as template structures are ingested.
   */
  private nextXrefId: ir.XrefId = 0 as ir.XrefId;

  /**
   * Map of view IDs to `ViewCompilation`s.
   *
   * 视图 ID 到 `ViewCompilation` 的映射。
   *
   */
  readonly views = new Map<ir.XrefId, ViewCompilation>();

  /**
   * Constant expressions used by operations within this component's compilation.
   *
   * 此组件编译中的操作使用的常量表达式。
   *
   * This will eventually become the `consts` array in the component definition.
   *
   * 这最终将成为组件定义中的 `consts` 数组。
   *
   */
  readonly consts: o.Expression[] = [];

  /**
   * The root view, representing the component's template.
   *
   * 根视图，代表组件的模板。
   *
   */
  readonly root: ViewCompilation;

  constructor(readonly componentName: string, readonly pool: ConstantPool) {
    // Allocate the root view.
    const root = new ViewCompilation(this, this.allocateXrefId(), null);
    this.views.set(root.xref, root);
    this.root = root;
  }

  /**
   * Add a `ViewCompilation` for a new embedded view to this compilation.
   *
   * 将新嵌入式视图的 `ViewCompilation` 添加到此编译中。
   *
   */
  allocateView(parent: ir.XrefId): ViewCompilation {
    const view = new ViewCompilation(this, this.allocateXrefId(), parent);
    this.views.set(view.xref, view);
    return view;
  }

  /**
   * Generate a new unique `ir.XrefId`.
   *
   * 生成一个新的唯一 `ir.XrefId`。
   *
   */
  allocateXrefId(): ir.XrefId {
    return this.nextXrefId++ as ir.XrefId;
  }

  /**
   * Add a constant `o.Expression` to the compilation and return its index in the `consts` array.
   *
   * 将常量 `o.Expression` 添加到编译中，并返回其在 `consts` 数组中的索引。
   *
   */
  addConst(newConst: o.Expression): ir.ConstIndex {
    for (let idx = 0; idx < this.consts.length; idx++) {
      if (this.consts[idx].isEquivalent(newConst)) {
        return idx as ir.ConstIndex;
      }
    }
    const idx = this.consts.length;
    this.consts.push(newConst);
    return idx as ir.ConstIndex;
  }
}

/**
 * Compilation-in-progress of an individual view within a template.
 *
 * 模板中单个视图的编译正在进行中。
 *
 */
export class ViewCompilation {
  constructor(
      readonly tpl: ComponentCompilation, readonly xref: ir.XrefId,
      readonly parent: ir.XrefId|null) {}

  /**
   * Name of the function which will be generated for this view.
   *
   * 将为该视图生成的函数的名称。
   *
   * May be `null` if not yet determined.
   *
   * 如果尚未确定，则可能为 `null`。
   *
   */
  fnName: string|null = null;

  /**
   * List of creation operations for this view.
   *
   * 此视图的创建操作列表。
   *
   * Creation operations may internally contain other operations, including update operations.
   *
   * 创建操作可能在内部包含其他操作，包括更新操作。
   *
   */
  readonly create = new ir.OpList<ir.CreateOp>();

  /**
   * List of update operations for this view.
   *
   * 此视图的更新操作列表。
   *
   */
  readonly update = new ir.OpList<ir.UpdateOp>();

  /**
   * Map of declared variables available within this view to the property on the context object
   * which they alias.
   *
   * 此视图中可用的已声明变量映射到它们别名的上下文对象上的属性。
   *
   */
  readonly contextVariables = new Map<string, string>();

  /**
   * Number of declaration slots used within this view, or `null` if slots have not yet been
   * allocated.
   *
   * 此视图中使用的声明插槽数，如果尚未分配插槽，则为 `null`。
   *
   */
  decls: number|null = null;

  /**
   * Number of variable slots used within this view, or `null` if variables have not yet been
   * counted.
   *
   * 此视图中使用的变量槽数，如果尚未计算变量，则为 `null`。
   *
   */
  vars: number|null = null;

  /**
   * Iterate over all `ir.Op`s within this view.
   *
   * 遍历此视图中的所有 `ir.Op`。
   *
   * Some operations may have child operations, which this iterator will visit.
   *
   * 某些操作可能有子操作，此迭代器将访问这些子操作。
   *
   */
  * ops(): Generator<ir.CreateOp|ir.UpdateOp> {
    for (const op of this.create) {
      yield op;
      if (op.kind === ir.OpKind.Listener) {
        for (const listenerOp of op.handlerOps) {
          yield listenerOp;
        }
      }
    }
    for (const op of this.update) {
      yield op;
    }
  }
}
