/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {OpKind} from './enums';

/**
 * Branded type for a cross-reference ID. During ingest, `XrefId`s are generated to link together
 * different IR operations which need to reference each other.
 *
 * 交叉引用 ID 的品牌类型。 在摄取期间，生成 `XrefId` 以将需要相互引用的不同 IR 操作链接在一起。
 *
 */
export type XrefId = number&{__brand: 'XrefId'};

/**
 * Base interface for semantic operations being performed within a template.
 *
 * 在模板中执行的语义操作的基本接口。
 *
 * @param OpT a specific narrower type of `Op` \(for example, creation operations\) which this
 *     specific subtype of `Op` can be linked with in a linked list.
 *
 * 特定的更窄类型的 `Op` （例如，创建操作），该特定的 `Op` 子类型可以在链表中与之链接。
 *
 */
export interface Op<OpT extends Op<OpT>> {
  /**
   * All operations have a distinct kind.
   *
   * 所有操作都有不同的种类。
   *
   */
  kind: OpKind;

  /**
   * The previous operation in the linked list, if any.
   *
   * 链表中的前一个操作，如果有的话。
   *
   * This is `null` for operation nodes not currently in a list, or for the special head/tail nodes.
   *
   * 对于当前不在列表中的操作节点或特殊的头/尾节点，这为 `null` 。
   *
   */
  prev: OpT|null;

  /**
   * The next operation in the linked list, if any.
   *
   * 链表中的下一个操作，如果有的话。
   *
   * This is `null` for operation nodes not currently in a list, or for the special head/tail nodes.
   *
   * 对于当前不在列表中的操作节点或特殊的头/尾节点，这为 `null` 。
   *
   */
  next: OpT|null;

  /**
   * Debug id of the list to which this node currently belongs, or `null` if this node is not part
   * of a list.
   *
   * 此节点当前所属列表的调试 ID，如果此节点不属于列表，则为 `null` 。
   *
   */
  debugListId: number|null;
}

/**
 * A linked list of `Op` nodes of a given subtype.
 *
 * 给定子类型的 `Op` 节点的链表。
 *
 * @param OpT specific subtype of `Op` nodes which this list contains.
 *
 * 此列表包含的 `Op` 节点的特定子类型。
 *
 */
export class OpList<OpT extends Op<OpT>> {
  static nextListId = 0;

  /**
   * Debug ID of this `OpList` instance.
   *
   * 此 `OpList` 实例的调试 ID。
   *
   */
  readonly debugListId = OpList.nextListId++;

  // OpList uses static head/tail nodes of a special `ListEnd` type.
  // This avoids the need for special casing of the first and last list
  // elements in all list operations.
  readonly head: OpT = {
    kind: OpKind.ListEnd,
    next: null,
    prev: null,
    debugListId: this.debugListId,
  } as OpT;

  readonly tail = {
    kind: OpKind.ListEnd,
    next: null,
    prev: null,
    debugListId: this.debugListId,
  } as OpT;


  constructor() {
    // Link `head` and `tail` together at the start (list is empty).
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Push a new operation to the tail of the list.
   *
   * 将新操作推送到列表的尾部。
   *
   */
  push(op: OpT): void {
    OpList.assertIsNotEnd(op);
    OpList.assertIsUnowned(op);

    op.debugListId = this.debugListId;

    // The old "previous" node (which might be the head, if the list is empty).
    const oldLast = this.tail.prev!;

    // Insert `op` following the old last node.
    op.prev = oldLast;
    oldLast.next = op;

    // Connect `op` with the list tail.
    op.next = this.tail;
    this.tail.prev = op;
  }

  /**
   * Prepend one or more nodes to the start of the list.
   *
   * 将一个或多个节点添加到列表的开头。
   *
   */
  prepend(ops: OpT[]): void {
    if (ops.length === 0) {
      return;
    }

    for (const op of ops) {
      OpList.assertIsNotEnd(op);
      OpList.assertIsUnowned(op);

      op.debugListId = this.debugListId;
    }

    const first = this.head.next!;

    let prev = this.head;
    for (const op of ops) {
      prev.next = op;
      op.prev = prev;

      prev = op;
    }

    prev.next = first;
    first.prev = prev;
  }

  /**
   * `OpList` is iterable via the iteration protocol.
   *
   * `OpList` 可通过迭代协议进行迭代。
   *
   * It's safe to mutate the part of the list that has already been returned by the iterator, up to
   * and including the last operation returned. Mutations beyond that point _may_ be safe, but may
   * also corrupt the iteration position and should be avoided.
   *
   * 改变迭代器已经返回的列表部分是安全的，直到并包括返回的最后一个操作。 超过该点的突变 _ 可能 _ 是安全的，但也可能破坏迭代位置，应该避免。
   *
   */
  * [Symbol.iterator](): Generator<OpT> {
    let current = this.head.next!;
    while (current !== this.tail) {
      // Guards against corruption of the iterator state by mutations to the tail of the list during
      // iteration.
      OpList.assertIsOwned(current, this.debugListId);

      const next = current.next!;
      yield current;
      current = next;
    }
  }

  * reversed(): Generator<OpT> {
    let current = this.tail.prev!;
    while (current !== this.head) {
      OpList.assertIsOwned(current, this.debugListId);

      const prev = current.prev!;
      yield current;
      current = prev;
    }
  }

  /**
   * Replace `oldOp` with `newOp` in the list.
   *
   * 将列表中的 `oldOp` 替换为 `newOp` 。
   *
   */
  static replace<OpT extends Op<OpT>>(oldOp: OpT, newOp: OpT): void {
    OpList.assertIsNotEnd(oldOp);
    OpList.assertIsNotEnd(newOp);

    OpList.assertIsOwned(oldOp);
    OpList.assertIsUnowned(newOp);

    newOp.debugListId = oldOp.debugListId;
    if (oldOp.prev !== null) {
      oldOp.prev.next = newOp;
      newOp.prev = oldOp.prev;
    }
    if (oldOp.next !== null) {
      oldOp.next.prev = newOp;
      newOp.next = oldOp.next;
    }
    oldOp.debugListId = null;
    oldOp.prev = null;
    oldOp.next = null;
  }

  /**
   * Replace `oldOp` with some number of new operations in the list \(which may include `oldOp`\).
   *
   * 将 `oldOp` 替换为列表中的一些新操作（可能包括 `oldOp` ）。
   *
   */
  static replaceWithMany<OpT extends Op<OpT>>(oldOp: OpT, newOps: OpT[]): void {
    if (newOps.length === 0) {
      // Replacing with an empty list -> pure removal.
      OpList.remove(oldOp);
      return;
    }

    OpList.assertIsNotEnd(oldOp);
    OpList.assertIsOwned(oldOp);

    const listId = oldOp.debugListId;
    oldOp.debugListId = null;

    for (const newOp of newOps) {
      OpList.assertIsNotEnd(newOp);

      // `newOp` might be `oldOp`, but at this point it's been marked as unowned.
      OpList.assertIsUnowned(newOp);
    }

    // It should be safe to reuse `oldOp` in the `newOps` list - maybe you want to sandwich an
    // operation between two new ops.
    const {prev: oldPrev, next: oldNext} = oldOp;
    oldOp.prev = null;
    oldOp.next = null;

    let prev: OpT = oldPrev!;
    for (const newOp of newOps) {
      this.assertIsUnowned(newOp);
      newOp.debugListId = listId;

      prev!.next = newOp;
      newOp.prev = prev;

      // This _should_ be the case, but set it just in case.
      newOp.next = null;

      prev = newOp;
    }
    // At the end of iteration, `prev` holds the last node in the list.
    const first = newOps[0]!;
    const last = prev!;

    // Replace `oldOp` with the chain `first` -> `last`.
    if (oldPrev !== null) {
      oldPrev.next = first;
      first.prev = oldOp.prev;
    }

    if (oldNext !== null) {
      oldNext.prev = last;
      last.next = oldNext;
    }
  }

  /**
   * Remove the given node from the list which contains it.
   *
   * 从包含它的列表中删除给定的节点。
   *
   */
  static remove<OpT extends Op<OpT>>(op: OpT): void {
    OpList.assertIsNotEnd(op);
    OpList.assertIsOwned(op);

    op.prev!.next = op.next;
    op.next!.prev = op.prev;

    // Break any link between the node and this list to safeguard against its usage in future
    // operations.
    op.debugListId = null;
    op.prev = null;
    op.next = null;
  }

  /**
   * Insert `op` before `before`.
   *
   * 在 `before` 插入 `op` 。
   *
   */
  static insertBefore<OpT extends Op<OpT>>(op: OpT, before: OpT): void {
    OpList.assertIsOwned(before);
    if (before.prev === null) {
      throw new Error(`AssertionError: illegal operation on list start`);
    }

    OpList.assertIsNotEnd(op);

    OpList.assertIsUnowned(op);

    op.debugListId = before.debugListId;

    // Just in case.
    op.prev = null;

    before.prev!.next = op;
    op.prev = before.prev;

    op.next = before;
    before.prev = op;
  }

  /**
   * Asserts that `op` does not currently belong to a list.
   *
   * 断言 `op` 当前不属于列表。
   *
   */
  static assertIsUnowned<OpT extends Op<OpT>>(op: OpT): void {
    if (op.debugListId !== null) {
      throw new Error(`AssertionError: illegal operation on owned node: ${OpKind[op.kind]}`);
    }
  }

  /**
   * Asserts that `op` currently belongs to a list. If `byList` is passed, `op` is asserted to
   * specifically belong to that list.
   *
   * 断言 `op` 当前属于列表。 如果传递了 `byList` ，则断言 `op` 明确属于该列表。
   *
   */
  static assertIsOwned<OpT extends Op<OpT>>(op: OpT, byList?: number): void {
    if (op.debugListId === null) {
      throw new Error(`AssertionError: illegal operation on unowned node: ${OpKind[op.kind]}`);
    } else if (byList !== undefined && op.debugListId !== byList) {
      throw new Error(`AssertionError: node belongs to the wrong list (expected ${byList}, actual ${
          op.debugListId})`);
    }
  }

  /**
   * Asserts that `op` is not a special `ListEnd` node.
   *
   * 断言 `op` 不是特殊的 `ListEnd` 节点。
   *
   */
  static assertIsNotEnd<OpT extends Op<OpT>>(op: OpT): void {
    if (op.kind === OpKind.ListEnd) {
      throw new Error(`AssertionError: illegal operation on list head or tail`);
    }
  }
}
